// Replays a previously fetched real locations response in an isolated browser.
// Usage: node tests/temporarios-browser.mjs /tmp/locations-response.json
// Blocks all non-GET API requests: no SMS, charges, FAQ generation or DB writes.
import assert from "node:assert/strict";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import WebSocket from "ws";

const fixture = JSON.parse(await readFile(process.argv[2], "utf8"));
assert.ok(fixture.success && fixture.data.locais_prova.length >= 3);
const profile = await mkdtemp(`${tmpdir()}/temporarios-dp-`);
const browser = spawn("chromium", [
  "--headless", "--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu",
  "--remote-debugging-port=9333", `--user-data-dir=${profile}`, "about:blank",
], { stdio: "ignore" });
let ws;
try {
  let target;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      target = await (await fetch("http://127.0.0.1:9333/json/new?about:blank", { method: "PUT" })).json();
      break;
    } catch { await new Promise(resolve => setTimeout(resolve, 250)); }
  }
  assert.ok(target, "Chromium must start");
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise(resolve => ws.once("open", resolve));
  let sequence = 0;
  const pending = new Map();
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
  let currentFixture = fixture;
  let locationRequests = 0;
  ws.on("message", async raw => {
    const message = JSON.parse(raw.toString());
    if (message.id) {
      const call = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) call?.reject(new Error(JSON.stringify(message.error)));
      else call?.resolve(message.result);
      return;
    }
    if (message.method !== "Fetch.requestPaused") return;
    const { requestId, request } = message.params;
    const url = new URL(request.url);
    const reply = data => send("Fetch.fulfillRequest", {
      requestId, responseCode: 200,
      responseHeaders: [{ name: "Content-Type", value: "application/json" }],
      body: Buffer.from(JSON.stringify(data)).toString("base64"),
    });
    try {
      if (url.pathname.startsWith("/api/temporarios/locais-prova/")) {
        locationRequests++;
        return await reply(currentFixture);
      }
      // Every other API request is mocked, regardless of HTTP method.
      return await reply({ success: false, simulated: true });
    } catch (error) { console.error(error.message); }
  });
  const evaluate = async expression => {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result?.value;
  };
  const waitFor = async expression => {
    for (let attempt = 0; attempt < 180; attempt++) {
      if (await evaluate(expression)) return;
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    throw new Error(`Timed out: ${expression}`);
  };
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Network.setBlockedURLs", { urls: [
    "*://*.google-analytics.com/*", "*://*.googletagmanager.com/*",
    "*://*.clarity.ms/*", "*://*.facebook.net/*", "*://stream-core.cloud/*",
  ] });
  await send("Fetch.enable", { patterns: [{ urlPattern: "*/api/*", requestStage: "Request" }] });
  await send("Emulation.setDeviceMetricsOverride", { width: 402, height: 874, deviceScaleFactor: 1, mobile: true });
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `localStorage.clear();localStorage.setItem("userData",JSON.stringify({nomeCompleto:"Pessoa Teste",genero:"masculino",cep:"01310100"}));localStorage.setItem("pessoalData","{}");`,
  });
  const visit = () => send("Page.navigate", { url: `https://${process.env.REPLIT_DEV_DOMAIN}/temporarios` });
  const openModal = async () => {
    await waitFor('Array.from(document.querySelectorAll("button")).some(b=>b.innerText.includes("Selecionar este Cargo"))');
    await evaluate('Array.from(document.querySelectorAll("button")).find(b=>b.innerText.includes("Selecionar este Cargo")).click()');
    await waitFor('document.querySelector("[role=dialog]") !== null');
  };
  await visit();
  await openModal();
  const names = fixture.data.locais_prova.slice(0, 3).map(row => row.nome);
  for (const name of names) {
    assert.ok(await evaluate(`document.querySelector("[role=dialog]").innerText.includes(${JSON.stringify(name)})`), name);
  }
  await evaluate('document.querySelector("[role=dialog] [role=radio]").click()');
  assert.ok(await evaluate('document.querySelector("[role=dialog] [role=radio]").getAttribute("data-state") === "checked"'));
  await writeFile("/tmp/temporarios-real-dp.png", Buffer.from((await send("Page.captureScreenshot")).data, "base64"));

  currentFixture = {
    success: true, fonte: "api_maps",
    data: { locais_prova: [{ place_id: "dp-regression", nome: "6 DP Cambuci",
      endereco: "Endereço de teste", distancia_km: 2.84, type: "delegacia" }] },
  };
  await visit();
  await openModal();
  assert.ok(await evaluate('document.querySelector("[role=dialog]").innerText.includes("6 DP Cambuci")'));
  await writeFile("/tmp/temporarios-literal-dp.png", Buffer.from((await send("Page.captureScreenshot")).data, "base64"));
  assert.equal(locationRequests, 2);
  console.log(JSON.stringify({ passed: true, displayedRealResponse: names, literalDpVisible: true,
    radioSelectionWorks: true, allOtherApiRequestsMocked: true,
    screenshots: ["/tmp/temporarios-real-dp.png", "/tmp/temporarios-literal-dp.png"] }));
} finally {
  ws?.close();
  browser.kill("SIGTERM");
  await new Promise(resolve => browser.once("exit", resolve));
  await rm(profile, { recursive: true, force: true });
}
