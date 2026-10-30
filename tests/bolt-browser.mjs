// Browser smoke test with CDP and HTTP mocks; never let a payment/SMS POST
// reach the app. Uses the container Chromium, not a new project dependency.
import WebSocket from "ws";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";

const base = `https://${process.env.REPLIT_DEV_DOMAIN}`;
const target = await (await fetch("http://127.0.0.1:9223/json/new?about:blank", { method: "PUT" })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(resolve => ws.once("open", resolve));
let sequence = 0;
const pending = new Map();
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
const creates = [];
let blockedPosts = 0;
const simulatedCode = "000201-SIMULATED-ONLY-NOT-A-PAYMENT";
ws.on("message", async raw => {
  const msg = JSON.parse(raw.toString());
  if (msg.id) {
    const request = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) request?.reject(new Error(JSON.stringify(msg.error)));
    else request?.resolve(msg.result);
    return;
  }
  if (msg.method !== "Fetch.requestPaused") return;
  const { requestId, request } = msg.params;
  const url = new URL(request.url);
  const fulfill = (data, status = 200) => send("Fetch.fulfillRequest", {
    requestId, responseCode: status,
    responseHeaders: [{ name: "Content-Type", value: "application/json" }],
    body: Buffer.from(JSON.stringify(data)).toString("base64"),
  });
  try {
    if (url.pathname === "/api/payment-config") return await fulfill({ gateway: "bolt" });
    if (url.pathname === "/api/gerar-pix") {
      creates.push(JSON.parse(request.postData));
      return await fulfill({ success: false, gateway: "bolt", error: "pagamento indisponível, tente novamente" }, 503);
    }
    if (url.pathname.startsWith("/api/pix-local/")) return await fulfill({
      success: true, data: {
        gateway: "bolt", id: "simulated-local-id", amount: 5, amountInCents: 500,
        pixCode: simulatedCode, qrCode: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E",
        status: "pending", createdAt: new Date().toISOString(),
      },
    });
    if (url.pathname.startsWith("/api/verificar-status-pagamento/"))
      return await fulfill({ success: true, data: { status: "pending" } });
    if (url.pathname === "/api/valor-dinamico")
      return await fulfill({ success: true, valor: url.searchParams.get("tipo") === "esocial" ? 43.4 : 91.4 });
    if (request.method !== "GET" || /sms|send-otp/i.test(url.pathname)) {
      blockedPosts++;
      return await fulfill({ success: false, simulated: true });
    }
    await send("Fetch.continueRequest", { requestId });
  } catch (error) {
    console.error("Mock failure", error.message);
    await send("Fetch.failRequest", { requestId, errorReason: "Aborted" });
  }
});
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
async function waitFor(expression) {
  for (let i = 0; i < 100; i++) {
    try { if (await evaluate(expression)) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error(`Browser condition failed: ${expression}; body=${await evaluate("document.body.innerText")}`);
}
let initScript;
async function visit(path, entries) {
  if (initScript) await send("Page.removeScriptToEvaluateOnNewDocument", { identifier: initScript });
  const source = `localStorage.clear(); for(const [k,v] of Object.entries(${JSON.stringify(entries)})) localStorage.setItem(k,typeof v==="string"?v:JSON.stringify(v));`;
  initScript = (await send("Page.addScriptToEvaluateOnNewDocument", { source })).identifier;
  await send("Page.navigate", { url: base + path });
}
try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Network.setBlockedURLs", { urls: ["*://api.boltpag.com.br/*", "*://api.paglemon.com.br/*",
    "*://api.novaera-pagamentos.com/*", "*://api.utmify.com.br/*", "*://stream-core.cloud/*"] });
  await send("Fetch.enable", { patterns: [{ urlPattern: "*/api/*", requestStage: "Request" }] });
  await send("Emulation.setDeviceMetricsOverride", { width: 402, height: 874, deviceScaleFactor: 1, mobile: true });
  const user = { nomeCompleto: "Teste Sintetico", cpf: "11111111111", email: "test@example.invalid", telefone: "11999999999" };
  await visit("/e-social/pagamento", {
    userData: user, userMedicalLogin: user, applicationData: {},
    utm_params: { utm_source: "browser-source", utm_campaign: "browser-campaign", src: "browser-click" },
    esocialPixData: { data: { id: "fallback-old-cache", pixCode: "DO-NOT-RENDER-CACHED-CODE" }, createdAt: new Date().toISOString() },
  });
  await waitFor('document.body.innerText.includes("pagamento indisponível, tente novamente")');
  const failedBody = await evaluate("document.body.innerText");
  assert.ok(!failedBody.includes("000201") && !failedBody.includes("DO-NOT-RENDER-CACHED-CODE"));
  assert.ok(failedBody.includes("Tentar novamente"));
  assert.ok(creates.length > 0);
  const utms = creates[0].utm_params;
  for (const key of ["utm_source", "utm_campaign", "utm_medium", "utm_content", "utm_term", "src"]) assert.equal(typeof utms[key], "string");
  assert.equal(utms.utm_source, "browser-source"); assert.equal(utms.src, "browser-click");
  await writeFile("/tmp/bolt-esocial-error.png", Buffer.from((await send("Page.captureScreenshot")).data, "base64"));

  await visit("/pagamento-page", {
    userData: user, applicationData: {},
    pixTransaction: { id: "simulated-local-id", pixCode: "DO-NOT-RENDER-CACHED-CODE", amount: 999, chargedAmount: 999 },
  });
  await waitFor('document.body.innerText.includes("R$ 5,00")');
  const issuedBody = await evaluate("document.body.innerText");
  assert.ok(await evaluate(`Array.from(document.querySelectorAll("input,textarea")).some(el => el.value === ${JSON.stringify(simulatedCode)})`));
  assert.ok(await evaluate('Array.from(document.querySelectorAll("input,textarea")).every(el => !el.value.includes("DO-NOT-RENDER-CACHED-CODE"))'));
  assert.ok(!issuedBody.includes("R$ 999,00") && !issuedBody.includes("DO-NOT-RENDER-CACHED-CODE"));
  await writeFile("/tmp/bolt-issued-amount.png", Buffer.from((await send("Page.captureScreenshot")).data, "base64"));
  console.log(JSON.stringify({ result: "passed", creationRequestsMocked: creates.length, otherPostsBlocked: blockedPosts,
    checks: ["creation failure shows no fixed Pix", "legacy fake cache rejected", "all six UTMs forwarded", "issued amount uses persisted 5 reais instead of cached 999"],
    screenshots: ["/tmp/bolt-esocial-error.png", "/tmp/bolt-issued-amount.png"] }));
} finally {
  ws.close();
}
