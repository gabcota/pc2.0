export type Gateway = "bolt" | "paglemon";
export const UNAVAILABLE = "pagamento indisponível, tente novamente";
export function paymentGateway(env = process.env): Gateway {
  const value = env.PAYMENT_GATEWAY || "bolt";
  if (value !== "bolt" && value !== "paglemon") throw new Error("INVALID_PAYMENT_GATEWAY");
  return value;
}

export const BOLT_STATUSES = new Set([
  "PENDING", "PAID", "REFUNDED", "REFUSED", "CHARGEBACK",
  "PRECHARGEBACK", "EXPIRED", "ERROR",
]);
export function boltStatus(value: unknown): string {
  const status = String(value ?? "").toUpperCase();
  if (!BOLT_STATUSES.has(status)) throw new Error("INVALID_BOLT_STATUS");
  return status;
}
export function amountInCents(value: unknown): number {
  if ((typeof value !== "number" && typeof value !== "string") ||
      value === "" || !Number.isFinite(Number(value)) || Number(value) <= 0) {
    throw new Error("INVALID_AMOUNT");
  }
  const cents = Math.round(Number(value) * 100);
  if (!Number.isSafeInteger(cents) || cents < 1) throw new Error("INVALID_AMOUNT");
  return cents;
}
export function matchesBoltAmount(value: unknown, expected: number): boolean {
  try {
    return amountInCents(value) === expected || Number(value) === expected;
  } catch { return false; }
}
export const UTM_KEYS = ["utm_source", "utm_campaign", "utm_medium", "utm_content", "utm_term", "src"] as const;
export function paymentUtms(value: unknown): Record<string, string> {
  let object: any = value;
  if (typeof object === "string") {
    try { object = JSON.parse(object); } catch { object = {}; }
  }
  return Object.fromEntries(UTM_KEYS.map(key => [
    key, typeof object?.[key] === "string" ? object[key] : "",
  ]));
}
export function boltPhone(value: unknown): { number: string; reason?: string } {
  let phone = typeof value === "string" ? value.replace(/\D/g, "") : "";
  if ((phone.length === 12 || phone.length === 13) && phone.startsWith("55")) phone = phone.slice(2);
  const ddds = /^(?:1[1-9]|2[12478]|3[1-578]|4[1-9]|5[1345]|6[1-9]|7[134579]|8[1-9]|9[1-9])$/;
  const valid = ddds.test(phone.slice(0, 2)) &&
    (/^[1-9]\d[2-5]\d{7}$/.test(phone) || /^[1-9]\d9\d{8}$/.test(phone));
  const substitute = /(\d)\1{6,}$/.test(phone) || phone === "11999999999" ||
    phone === "00000000000" || phone === "12345678901";
  return valid && !substitute ? { number: phone } :
    { number: "11999999999", reason: !phone ? "missing" : substitute ? "substitute" : "malformed" };
}
export function webhookUrl(env = process.env): string {
  const url = new URL(env.PAYMENT_WEBHOOK_BASE_URL || "");
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash ||
      !["", "/"].includes(url.pathname)) throw new Error("INVALID_WEBHOOK_BASE_URL");
  return `${url.origin}/api/utmify/bolt`;
}
export class BoltError extends Error {
  constructor(public statusCode: number, public retrySeconds = 15) { super("BOLT_UNAVAILABLE"); }
}
export function retrySeconds(value: string | null, now = Date.now()): number {
  if (!value) return 15;
  const seconds = /^\d+(?:\.\d+)?$/.test(value) ? Number(value) :
    (Date.parse(value) - now) / 1000;
  return Number.isFinite(seconds) ? Math.max(15, Math.ceil(seconds)) : 15;
}
export class BoltClient {
  constructor(private env = process.env, private request: typeof fetch = fetch) {}
  private async call(path: string, body?: unknown): Promise<any> {
    const { BOLT_PUBLIC_KEY, BOLT_SECRET_KEY } = this.env;
    if (!BOLT_PUBLIC_KEY || !BOLT_SECRET_KEY) throw new Error("BOLT_CREDENTIALS_MISSING");
    const response = await this.request(`https://api.boltpag.com.br${path}`, {
      method: body ? "POST" : "GET",
      headers: {
        authorization: `Basic ${Buffer.from(`${BOLT_PUBLIC_KEY}:${BOLT_SECRET_KEY}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new BoltError(response.status, retrySeconds(response.headers.get("Retry-After")));
    const result = await response.json();
    return result?.data ?? result;
  }
  create(body: unknown) { return this.call("/v1/payment-transaction/create", body); }
  info(id: string) { return this.call(`/v1/payment-transaction/info/${encodeURIComponent(id)}`); }
}

export function buildBoltPayload(body: any, ip: string, env = process.env) {
  const cents = body.amount != null ? amountInCents(body.amount) : Number(body.valor);
  if (!Number.isSafeInteger(cents) || cents <= 0) throw new Error("INVALID_AMOUNT");
  const customer = body.customer ?? {};
  const phone = boltPhone(customer.phone ?? body.telefone);
  const document = customer.cpf ?? customer.document?.number ?? customer.document ?? body.cpf ?? "";
  if (String(document).replace(/\D/g, "").length !== 11) throw new Error("INVALID_CUSTOMER_CPF");
  const title = String(body.description || body.inscricaoData?.vaga?.title || "Inscrição");
  return {
    phoneReason: phone.reason,
    payload: {
      amount: cents, payment_method: "pix", postback_url: webhookUrl(env),
      customer: {
        name: customer.name || body.nome || body.userData?.nomeCompleto || "",
        email: customer.email || body.email || body.userData?.email || "",
        document: { type: "cpf", number: String(document).replace(/\D/g, "") },
        phone: phone.number,
      },
      items: [{ title, unit_price: cents, quantity: 1, tangible: false }],
      pix: { expires_in_days: 1 }, metadata: paymentUtms(body.utm_params), ip,
    },
  };
}
