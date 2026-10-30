const UTM_KEYS = ["utm_source", "utm_campaign", "utm_medium", "utm_content", "utm_term", "src"];
function object(value: unknown): Record<string, any> {
  if (typeof value === "string") {
    try { return object(JSON.parse(value)); } catch { return {}; }
  }
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
export function collectPaymentUtms(supplied?: unknown) {
  const params = new URLSearchParams(window.location.search);
  const saved = object(localStorage.getItem("utm_params"));
  const given = object(supplied);
  return Object.fromEntries(UTM_KEYS.map(key => [key,
    [given[key], saved[key], localStorage.getItem(key), params.get(key)]
      .find(value => typeof value === "string" && value.length > 0) ?? "",
  ]));
}
export async function paymentFetch(url: string, init: RequestInit): Promise<Response> {
  const body = object(init.body);
  body.utm_params = { ...object(body.utm_params), ...collectPaymentUtms(body.utm_params) };
  return fetch(url, { ...init, body: JSON.stringify(body) });
}
let mode: Promise<"bolt" | "paglemon"> | undefined;
export function getPaymentMode() {
  return mode ??= fetch("/api/payment-config", { cache: "no-store" })
    .then(response => response.json())
    .then(data => data.gateway === "paglemon" ? "paglemon" as const : "bolt" as const)
    .catch(() => "bolt" as const);
}
// Browser storage is not proof that a Pix exists. In Bolt mode only the
// server's persisted record may supply its code and original issued amount.
export async function approvedPix(candidate: any): Promise<any | null> {
  if (await getPaymentMode() === "paglemon") return candidate;
  const id = candidate?.id ?? candidate?.transactionId;
  if (!id || String(id).startsWith("fallback-")) return null;
  try {
    const response = await fetch(`/api/pix-local/${encodeURIComponent(id)}`, { cache: "no-store" });
    const result = await response.json();
    return response.ok && result.success && result.data?.gateway === "bolt" &&
      result.data.pixCode?.startsWith("000201") ? result.data : null;
  } catch { return null; }
}
