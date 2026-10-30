import { randomUUID } from "crypto";
import { BoltClient, BoltError, boltStatus, buildBoltPayload, matchesBoltAmount } from "./bolt";
import type { BoltRecord, BoltStore, BoltState } from "./boltStore";

type Client = Pick<BoltClient, "create" | "info">;
export const logBolt = (event: string, id = "", status = "", unit = "cents") =>
  console.info("[payment:bolt]", JSON.stringify({ event, id: id.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 128), status, unit }));
export function publicPayment(row: BoltRecord) {
  if (typeof row.pix_code !== "string" || !row.pix_code.startsWith("000201") ||
      row.pix_code.length < 30 || !Number.isSafeInteger(row.control.amountCents) ||
      row.control.amountCents <= 0) throw new Error("INVALID_STORED_BOLT_PIX");
  const qrCode = row.qr_code ||
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(row.pix_code)}`;
  return {
    id: row.transaction_id, transactionId: row.transaction_id, gateway: "bolt",
    status: row.status, originalStatus: row.control.rawStatus,
    amount: row.control.amountCents / 100, amountInCents: row.control.amountCents,
    pixCode: row.pix_code, pix: row.pix_code, brcode: row.pix_code,
    qrCode, qrcode: qrCode,
    createdAt: row.control.createdAt, expirationDate: row.control.expiresAt,
    paidAt: row.control.confirmedAt ?? null,
  };
}
export class BoltService {
  constructor(private store: BoltStore, private client: Client = new BoltClient(),
    private onPaid: (row: BoltRecord) => Promise<void> = async () => {},
    private env = process.env) {}
  async create(body: any, ip: string) {
    const { payload, phoneReason } = buildBoltPayload(body, ip, this.env);
    if (phoneReason) logBolt(`phone_${phoneReason}`);
    const data = await this.client.create(payload);
    const id = String(data?.id ?? "");
    const code = data?.pix?.qr_code;
    if (!/^[a-zA-Z0-9_-]{1,128}$/.test(id) || typeof code !== "string" ||
        !code.startsWith("000201") || code.length < 30) throw new Error("INVALID_BOLT_PIX");
    const initialStatus = boltStatus(data.status);
    const createdAt = new Date().toISOString();
    const state: BoltState = {
      // Even an immediate PAID response must pass the independent info check.
      provider: "bolt", amountCents: payload.amount,
      rawStatus: initialStatus === "PAID" ? "PENDING" : initialStatus,
      createdAt, expiresAt: new Date(Date.now() + 86400000).toISOString(),
      nextCheckAt: 0, leaseUntil: 0, leaseToken: "",
      customer: payload.customer, productName: payload.items[0].title,
    };
    const row = await this.store.save(id, code, state, body);
    logBolt("created", id, initialStatus);
    return publicPayment(initialStatus === "PAID" ? (await this.verify(id, true) ?? row) : row);
  }
  async find(id: string) { return this.store.get(id); }
  async verify(id: string, webhook = false): Promise<BoltRecord | null> {
    const saved = await this.store.get(id);
    if (!saved) return null;
    if (!webhook && saved.control.rawStatus !== "PENDING") return saved;
    const token = randomUUID();
    if (!await this.store.claim(id, token)) return await this.store.get(id);
    try {
      const data = await this.client.info(id);
      const rawStatus = boltStatus(data.status);
      if (String(data.id) !== id || !matchesBoltAmount(data.amount, saved.control.amountCents)) {
        logBolt("verification_rejected", id, "MISMATCH", "reais_or_exact_saved_cents");
        throw new Error("BOLT_PAYMENT_MISMATCH");
      }
      const row = await this.store.finish(id, token, rawStatus, data.paid_at ?? data.paidAt ?? data.PaidAt);
      logBolt("verified", id, rawStatus, "reais_or_exact_saved_cents");
      // The first confirmation is claimed by the same atomic SQL UPDATE.
      // Polling and repeated webhooks cannot both run the existing effect.
      if (row?.firstPaid) {
        try { await this.onPaid(row); } catch { logBolt("paid_notification_failed", id, "PAID"); }
      }
      return row ?? await this.store.get(id);
    } catch (error) {
      const wait = error instanceof BoltError ? error.retrySeconds : 15;
      await this.store.defer(id, token, wait);
      logBolt(error instanceof BoltError && error.statusCode === 429 ? "rate_limited" : "query_unavailable",
        id, saved.control.rawStatus);
      if (webhook) throw error;
      return await this.store.get(id);
    }
  }
}
