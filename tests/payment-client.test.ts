import assert from "node:assert/strict";
import test from "node:test";
import { collectPaymentUtms, paymentFetch, approvedPix } from "../client/src/lib/paymentClient";

test("all six real UTMs survive JSON/string input, stored attribution, and missing fields", async () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const originalFetch = globalThis.fetch;
  const values = new Map([
    ["utm_params", JSON.stringify({ utm_source: "stored-source", utm_campaign: "stored-campaign", src: "stored-click" })],
    ["utm_medium", "stored-medium"],
  ]);
  Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { search: "?utm_term=query-term" } } });
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: { getItem: (key: string) => values.get(key) ?? null } });
  try {
    assert.deepEqual(collectPaymentUtms('{"utm_content":"given-content"}'), {
      utm_source: "stored-source", utm_campaign: "stored-campaign", utm_medium: "stored-medium",
      utm_content: "given-content", utm_term: "query-term", src: "stored-click",
    });
    globalThis.fetch = async (_url, init) => {
      const body = JSON.parse(String(init!.body));
      assert.equal(body.utm_params.utm_source, "given-source");
      assert.equal(body.utm_params.src, "stored-click");
      assert.equal(body.utm_params.utm_content, "");
      return Response.json({ success: true });
    };
    await paymentFetch("/api/gerar-pix", { method: "POST", body: JSON.stringify({ utm_params: '{"utm_source":"given-source"}' }) });
    let localReads = 0;
    globalThis.fetch = async (url) => {
      if (url === "/api/payment-config") return Response.json({ gateway: "bolt" });
      localReads++;
      return Response.json({ success: true, data: { id: "real-local-record", gateway: "bolt", amount: 5, pixCode: "000201-only-server-code" } });
    };
    assert.equal(await approvedPix({ id: "fallback-123" }), null);
    assert.equal(localReads, 0);
    const approved = await approvedPix({ id: "real-local-record", pixCode: "fake-cache", amount: 91.4 });
    assert.equal(approved.amount, 5);
    assert.equal(approved.pixCode, "000201-only-server-code");
    globalThis.fetch = async () => Response.json({ success: false }, { status: 404 });
    assert.equal(await approvedPix({ id: "foreign-or-legacy-record" }), null);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
    else Reflect.deleteProperty(globalThis, "window");
    if (originalStorage) Object.defineProperty(globalThis, "localStorage", originalStorage);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
});
