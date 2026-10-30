import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { PgDialect } from "drizzle-orm/pg-core";
import { readFileSync } from "node:fs";
import {
  BoltClient, BoltError, amountInCents, matchesBoltAmount, paymentGateway,
  boltPhone, paymentUtms, buildBoltPayload, webhookUrl, retrySeconds, boltStatus,
} from "../server/payments/bolt";
import { BoltService } from "../server/payments/boltService";
import { PgBoltStore, type BoltStore, type BoltRecord, type BoltState } from "../server/payments/boltStore";
import { registerBoltRoutes } from "../server/payments/boltRoutes";

const env = { PAYMENT_WEBHOOK_BASE_URL: "https://merchant.example" };
const code = `000201${"1234567890".repeat(8)}`;
const body = { amount: 5, customer: { name: "Synthetic", email: "test@example.invalid", cpf: "11111111111", phone: "" },
  utm_params: '{"utm_source":"source","src":"click"}', description: "test-product" };

class SharedMemoryStore implements BoltStore {
  rows = new Map<string, BoltRecord>();
  now = 100000;
  async save(id: string, pix: string, state: BoltState) {
    if (this.rows.has(id)) throw new Error("duplicate");
    const row = { transaction_id: id, amount: String(state.amountCents / 100), status: "pending",
      pix_code: pix, qr_code: "https://image.example/qr.png", control: structuredClone(state) };
    this.rows.set(id, row);
    return structuredClone(row);
  }
  async get(id: string) { return structuredClone(this.rows.get(id) ?? null); }
  async claim(id: string, token: string) {
    const row = this.rows.get(id)!;
    if (row.control.nextCheckAt > this.now || row.control.leaseUntil > this.now) return false;
    row.control.leaseToken = token; row.control.leaseUntil = this.now + 60000;
    row.control.nextCheckAt = this.now + 15000;
    return true;
  }
  async finish(id: string, token: string, status: string) {
    const row = this.rows.get(id)!;
    if (row.control.leaseToken !== token) return null;
    const firstPaid = status === "PAID" && !row.control.confirmedAt;
    if (!(row.control.confirmedAt && status === "PENDING")) {
      row.status = status.toLowerCase(); row.control.rawStatus = status;
    }
    if (firstPaid) row.control.confirmedAt = "2026-01-01T00:00:00Z";
    row.control.leaseUntil = 0; row.control.leaseToken = "";
    row.control.nextCheckAt = this.now + 15000;
    return { ...structuredClone(row), firstPaid };
  }
  async defer(id: string, token: string, seconds: number) {
    const row = this.rows.get(id)!;
    if (row.control.leaseToken !== token) return;
    row.control.leaseUntil = 0; row.control.leaseToken = "";
    row.control.nextCheckAt = this.now + seconds * 1000;
  }
}
function fixture(info: () => Promise<any> = async () => ({ id: "bolt-test", status: "PAID", amount: 5 })) {
  const store = new SharedMemoryStore();
  let paid = 0, calls = 0;
  const client = { create: async (_payload: any) => ({ id: "bolt-test", status: "PENDING", pix: { qr_code: code } }),
    info: async (_id: string) => { calls++; return info(); } };
  const service = new BoltService(store, client, async () => { paid++; }, env);
  return { store, client, service, paid: () => paid, calls: () => calls };
}
test("gateway default Bolt, selection exclusive and fail-closed", () => {
  assert.equal(paymentGateway({}), "bolt");
  assert.equal(paymentGateway({ PAYMENT_GATEWAY: "bolt" }), "bolt");
  assert.equal(paymentGateway({ PAYMENT_GATEWAY: "paglemon" }), "paglemon");
  assert.throws(() => paymentGateway({ PAYMENT_GATEWAY: "novaera" }));
});
test("Bolt amount in reais, including decimals; cents only if exact", () => {
  assert.equal(amountInCents(5), 500);
  assert.equal(amountInCents(86.4), 8640);
  assert.ok(matchesBoltAmount(5, 500));
  assert.ok(matchesBoltAmount("86.4", 8640));
  assert.ok(matchesBoltAmount(8640, 8640));
  assert.ok(!matchesBoltAmount(86.41, 8640));
  for (const bad of [null, undefined, "", -1, NaN, {}, Infinity]) assert.ok(!matchesBoltAmount(bad, 500));
});
test("phone normalization never blocks a Pix; fallback is only the approved phone", () => {
  for (const phone of [undefined, "", "x", "00000000000", "11999999999", "12345678901"]) {
    assert.equal(boltPhone(phone).number, "11999999999"); assert.ok(boltPhone(phone).reason);
  }
  assert.deepEqual(boltPhone("+55 (11) 98765-4321"), { number: "11987654321" });
  assert.deepEqual(boltPhone("(69) 3424-4783"), { number: "6934244783" });
});
test("payload, UTMs as JSON/object, cents and explicit webhook origin", () => {
  const { payload } = buildBoltPayload(body, "192.0.2.1", env);
  assert.equal(payload.amount, 500); assert.equal(payload.items[0].unit_price, 500);
  assert.equal(payload.items[0].tangible, false); assert.equal(payload.pix.expires_in_days, 1);
  assert.equal(payload.customer.phone, "11999999999"); assert.equal(payload.customer.document.type, "cpf");
  assert.equal(payload.postback_url, "https://merchant.example/api/utmify/bolt");
  assert.deepEqual(payload.metadata, paymentUtms({ utm_source: "source", src: "click" }));
  assert.equal(payload.metadata.utm_term, "");
  assert.equal(buildBoltPayload({ ...body, amount: undefined, valor: 8640 }, "", env).payload.amount, 8640);
  for (const base of ["", "http://merchant.example", "https://merchant.example/path", "https://user:password@merchant.example"]) {
    assert.throws(() => webhookUrl({ PAYMENT_WEBHOOK_BASE_URL: base }));
  }
});
test("HTTP client uses Basic only on server and accepts root/data response formats", async () => {
  let requests = 0;
  const client = new BoltClient({ BOLT_PUBLIC_KEY: "synthetic-public", BOLT_SECRET_KEY: "synthetic-secret" },
    async (url, init) => {
      requests++;
      assert.match(String(url), /^https:\/\/api\.boltpag\.com\.br\/v1\/payment-transaction\//);
      assert.equal((init!.headers as any).authorization,
        `Basic ${Buffer.from("synthetic-public:synthetic-secret").toString("base64")}`);
      return Response.json(requests === 1 ? { id: "id", amount: 86.4, status: "PAID" } :
        { data: { id: "id", status: "PENDING", pix: { qr_code: code } } });
    });
  assert.equal((await client.info("id")).amount, 86.4);
  assert.equal((await client.create({})).pix.qr_code, code);
  const limited = new BoltClient({ BOLT_PUBLIC_KEY: "synthetic", BOLT_SECRET_KEY: "synthetic" },
    async () => new Response("", { status: 429, headers: { "Retry-After": "30" } }));
  await assert.rejects(limited.info("id"), (error: any) => error.statusCode === 429 && error.retrySeconds === 30);
  assert.equal(retrySeconds("30"), 30);
  assert.equal(retrySeconds(new Date(45000).toUTCString(), 0), 45);
  for (const status of ["PENDING", "PAID", "REFUNDED", "REFUSED", "CHARGEBACK", "PRECHARGEBACK", "EXPIRED", "ERROR"])
    assert.equal(boltStatus(status), status);
  assert.throws(() => boltStatus("APPROVED"));
});
test("two service instances and repeated webhooks cause one API call and one paid effect", async () => {
  const f = fixture();
  await f.service.create(body, "");
  const second = new BoltService(f.store, f.client, async () => { throw new Error("duplicate effect"); }, env);
  await Promise.all(Array.from({ length: 24 }, (_, i) => (i % 2 ? second : f.service).verify("bolt-test", true)));
  assert.equal(f.calls(), 1); assert.equal(f.paid(), 1);
  f.store.now += 15001;
  await f.service.verify("bolt-test", true);
  assert.equal(f.paid(), 1);
});
test("429 and remote failures return local pending, share Retry-After, never downgrade paid", async () => {
  let phase = "limited";
  const f = fixture(async () => {
    if (phase === "limited") throw new BoltError(429, 45);
    return { id: "bolt-test", status: phase === "paid" ? "PAID" : "PENDING", amount: 5 };
  });
  await f.service.create(body, "");
  assert.equal((await f.service.verify("bolt-test"))?.status, "pending");
  f.store.now += 15001;
  await f.service.verify("bolt-test"); assert.equal(f.calls(), 1);
  f.store.now += 30000; phase = "paid";
  assert.equal((await f.service.verify("bolt-test"))?.status, "paid");
  f.store.now += 15001; phase = "pending";
  assert.equal((await f.service.verify("bolt-test", true))?.status, "paid");
  assert.equal(f.paid(), 1);
});
test("mismatching IDs/amounts and fake Pix cannot confirm or return a successful creation", async () => {
  for (const remote of [{ id: "other", amount: 5 }, { id: "bolt-test", amount: 4.99 }]) {
    const f = fixture(async () => ({ ...remote, status: "PAID" }));
    await f.service.create(body, "");
    assert.equal((await f.service.verify("bolt-test"))?.status, "pending");
    assert.equal(f.paid(), 0);
  }
  const f = fixture();
  f.client.create = async () => ({ id: "bolt-test", status: "PENDING", pix: { qr_code: "PIX:fake" } });
  await assert.rejects(f.service.create(body, ""));
  assert.equal(f.store.rows.size, 0);
});
test("PostgreSQL store uses existing JSON and atomic conditional updates, no DDL", async () => {
  const queries: string[] = [];
  const store = new PgBoltStore(async query => {
    const text = new PgDialect().sqlToQuery(query).sql;
    queries.push(text);
    return [{ transaction_id: "id" }];
  });
  const f = fixture();
  await f.service.create(body, "");
  await store.save("id", code, f.store.rows.get("bolt-test")!.control, body);
  await store.get("id"); await store.claim("id", "lease"); await store.finish("id", "lease", "PAID");
  await store.defer("id", "lease", 30);
  assert.ok(queries.every(q => !/\b(CREATE|ALTER|DROP)\b/i.test(q)));
  assert.ok(queries[2].includes("leaseUntil") && queries[2].includes("nextCheckAt"));
  assert.ok(queries[2].includes("clock_timestamp"));
  assert.ok(queries[3].includes('AS "firstPaid"') && queries[3].includes("leaseToken"));
});
test("HTTP: foreign IDs ignored without Bolt call; providers and webhooks isolated", async () => {
  const f = fixture();
  const app = express(); app.use(express.json());
  let gateway: "bolt" | "paglemon" = "bolt";
  let legacy = 0;
  registerBoltRoutes(app, f.service, () => gateway);
  app.post("/api/gerar-pix", (_req, res) => { legacy++; res.json({ legacy: true }); });
  app.post("/api/utmify/novaera", (_req, res) => { legacy++; res.json({ legacy: true }); });
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>(resolve => server.on("listening", resolve));
  const base = `http://127.0.0.1:${(server.address() as any).port}`;
  const post = (path: string, data: any) => fetch(base + path,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  try {
    const foreign = await post("/api/utmify/bolt", { Id: "foreign-app", Status: "PAID", Amount: 5 });
    assert.equal(foreign.status, 200); assert.equal((await foreign.json()).ignored, true);
    assert.equal(f.calls(), 0);
    await post("/api/utmify/novaera", {}); assert.equal(legacy, 0);
    assert.equal((await post("/api/gerar-pix", body)).status, 200);
    await Promise.all(Array.from({ length: 8 }, () => post("/api/utmify/bolt",
      { Id: "bolt-test", Status: "PAID", Amount: 5, PaymentMethod: "pix" })));
    assert.equal(f.paid(), 1); assert.equal(f.calls(), 1); assert.equal(legacy, 0);
    gateway = "paglemon";
    assert.equal((await post("/api/utmify/bolt", { Id: "bolt-test" })).status, 200);
    await post("/api/gerar-pix", body); assert.equal(legacy, 1);
    assert.equal(f.calls(), 1);
  } finally { await new Promise<void>(resolve => server.close(() => resolve())); }
});
test("all creation screens collect UTMs and no schema, release or migration changes are required", () => {
  for (const page of ["ValidacaoPage", "ConfirmarDadosPage", "ESocialPagamentoPage", "RegularizacaoPagamentoPage", "RemarketingTestPage"]) {
    const source = readFileSync(`client/src/pages/${page}.tsx`, "utf8");
    assert.match(source, /paymentFetch\(["']\/api\/gerar-pix/);
  }
  assert.match(readFileSync("Procfile", "utf8"), /release: npm run db:migrate/);
});
