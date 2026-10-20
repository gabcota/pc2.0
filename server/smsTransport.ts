type SmsProvider = "integrax" | "manager";

export interface SmsRequest {
  phone: string;
  message: string;
  dontRepeat?: boolean;
}

export interface SmsResult {
  success: boolean;
  provider: SmsProvider;
  messageId?: string;
  httpStatus?: number;
  error?: string;
}

interface SmsConfig {
  provider?: string;
  integraxToken?: string;
  integraxFrom?: string;
  managerUrl?: string;
}

// Preserved only for a deliberate return to the previous transport.
// Its existing credential was rejected; it is never an automatic fallback.
const LEGACY_MANAGER_URL =
  "https://mysmsmanagercustom-z.replit.app/api/send/6949e9a7ec6b40cd92ec87d14c2921c1";

export function normalizeSmsPhone(phone: string): string {
  if (typeof phone !== "string") return "";
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;
}

export function createSmsSender(config: SmsConfig, request: typeof fetch = fetch) {
  return async (input: SmsRequest): Promise<SmsResult> => {
    const provider = (config.provider ?? "integrax") as SmsProvider;
    if (provider !== "integrax" && provider !== "manager") {
      return { success: false, provider, error: "Provedor de SMS inválido." };
    }
    const phone = normalizeSmsPhone(input.phone);
    if (!/^\d{10,15}$/.test(phone) || typeof input.message !== "string" || !input.message.trim()) {
      return { success: false, provider, error: "Telefone ou mensagem inválidos." };
    }
    if (provider === "integrax" && !config.integraxToken?.trim()) {
      return { success: false, provider, error: "INTEGRAX_SMS_TOKEN não configurado." };
    }

    const url = provider === "integrax"
      ? `https://sms.aresfun.com/v1/integration/${encodeURIComponent(config.integraxToken!.trim())}/send-sms`
      : config.managerUrl || LEGACY_MANAGER_URL;
    const body = provider === "integrax"
      ? { to: [phone], from: config.integraxFrom || "29094", message: input.message }
      : { phone, message: input.message, ...(input.dontRepeat === undefined ? {} : { dontRepeat: input.dontRepeat }) };

    try {
      const response = await request(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15_000),
        redirect: "error",
      });
      // Never log/return raw provider bodies: they may contain personal data or tokens.
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return { success: false, provider, httpStatus: response.status, error: `Serviço de SMS recusou o pedido (HTTP ${response.status}).` };
      }
      if (!data || typeof data !== "object" || data.success === false ||
          (data.error !== undefined && data.error !== null && data.error !== 0 && data.error !== false && data.error !== "")) {
        return { success: false, provider, httpStatus: response.status, error: "Serviço de SMS não confirmou a aceitação." };
      }
      const accepted = data.success === true || data.error === 0 ||
        data.code === "SMS_SENT" || data.data?.sended === true || data.data?.queued === true;
      if (provider === "integrax" && !accepted) {
        return { success: false, provider, httpStatus: response.status, error: "Serviço de SMS não confirmou a aceitação." };
      }
      const messageId = data.data?.messageId ?? data.messageId ?? data.id;
      return {
        success: true,
        provider,
        httpStatus: response.status,
        ...(messageId == null ? {} : { messageId: String(messageId) }),
      };
    } catch {
      // No automatic retry or second provider: a timed-out request may already have sent.
      return { success: false, provider, error: "Falha de conexão ou tempo limite no serviço de SMS." };
    }
  };
}

export function sendTransactionalSms(input: SmsRequest): Promise<SmsResult> {
  return createSmsSender({
    provider: process.env.SMS_PROVIDER,
    integraxToken: process.env.INTEGRAX_SMS_TOKEN,
    integraxFrom: process.env.INTEGRAX_SMS_FROM,
    managerUrl: process.env.SMS_MANAGER_API_URL,
  })(input);
}

export function logSmsResult(event: string, result: SmsResult): void {
  const metadata = { event, ...result };
  if (result.success) console.log("[SMS] Pedido aceito pelo serviço:", metadata);
  else console.error("[SMS] Falha no envio:", metadata);
}
