import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import express from "express";
import { CapturaCpfError, lookupCapturaCpf, registerCapturaCpfRoute } from "../server/capturaCpf";

// Synthetic fixtures: no external CPF lookup is performed in these tests.
const cpf = "12345678909";
const fixture = { success: true, cpf, nome: "PESSOA TESTE", nome_mae: "", nasc: "04/05/1990", sexo: "F" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

test("new provider keeps the complete DADOS shape expected by captura", async () => {
  const data = await lookupCapturaCpf(cpf, async (url, options) => {
    assert.equal(url, `https://api-cpf-cg-production-86ed.up.railway.app/api/cpf-lookup/${cpf}`);
    assert.deepEqual(options?.headers, { Accept: "application/json" });
    assert.ok(options?.signal);
    return json(fixture);
  });
  assert.deepEqual(data.DADOS, {
    nome: "Pessoa Teste", cpf, nascimento: "04/05/1990", data_nascimento: "04/05/1990",
    mae: "", pai: "", rg: "", orgao_emissor: "", uf_emissao: "", titulo_eleitor: "",
    sexo: "F", situacao: "",
  });
});

test("optional fields remain empty rather than being invented", async () => {
  const data = await lookupCapturaCpf(cpf, async () => json({ ...fixture, nasc: "", sexo: "" }));
  assert.equal(data.DADOS.nascimento, "");
  assert.equal(data.DADOS.sexo, "");
  assert.equal(data.DADOS.situacao, "");
});

for (const status of [400, 404, 422, 503]) {
  test(`HTTP ${status} is not retried or sent to a legacy provider`, async () => {
    let calls = 0;
    await assert.rejects(() => lookupCapturaCpf(cpf, async () => {
      calls++;
      return json({ success: false, api_status: status }, status);
    }), (error: CapturaCpfError) => error.status === status);
    assert.equal(calls, 1);
  });
}

for (const status of [429, 502]) {
  test(`HTTP ${status} retries once with backoff`, async () => {
    let calls = 0;
    const delays: number[] = [];
    const result = await lookupCapturaCpf(cpf, async () => {
      calls++;
      return calls === 1 ? json({}, status) : json(fixture);
    }, async ms => { delays.push(ms); });
    assert.equal(calls, 2);
    assert.deepEqual(delays, [1000]);
    assert.equal(result.DADOS.cpf, cpf);
  });
}

test("network errors and timeouts stop after two attempts", async () => {
  let calls = 0;
  await assert.rejects(() => lookupCapturaCpf(cpf, async () => {
    calls++;
    throw new DOMException("Timeout", "TimeoutError");
  }, async () => {}), (error: CapturaCpfError) => error.status === 503);
  assert.equal(calls, 2);
});

test("persistent transient errors keep their failure status", async () => {
  await assert.rejects(() => lookupCapturaCpf(cpf, async () => json({}, 429), async () => {}),
    (error: CapturaCpfError) => error.status === 429);
});

for (const body of [
  { success: false, api_status: 404 },
  { ...fixture, nome: "" },
  { ...fixture, cpf: "00000000000" },
  { ...fixture, sexo: {} },
  { ...fixture, nasc: 123 },
  null,
]) {
  test(`rejects missing or malformed provider results: ${JSON.stringify(body)}`, async () => {
    await assert.rejects(() => lookupCapturaCpf(cpf, async () => json(body)), CapturaCpfError);
  });
}

test("invalid JSON returns a controlled failure", async () => {
  await assert.rejects(() => lookupCapturaCpf(cpf, async () => new Response("invalid")),
    (error: CapturaCpfError) => error.status === 502);
});

test("dedicated route sanitizes input, validates, and preserves response envelope", async () => {
  const app = express();
  app.use(express.json());
  let calls = 0;
  registerCapturaCpfRoute(app, value => value === cpf, async value => {
    calls++;
    return lookupCapturaCpf(value, async () => json(fixture));
  });
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>(resolve => server.once("listening", resolve));
  const address = server.address() as import("node:net").AddressInfo;
  const url = `http://127.0.0.1:${address.port}/api/captura/validate-cpf`;
  try {
    for (const input of [null, 123, "", "11111111111", "123"]) {
      const response = await fetch(url, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: input }),
      });
      assert.equal(response.status, 400);
    }
    assert.equal(calls, 0);
    const response = await fetch(url, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cpf: "123.456.789-09" }),
    });
    const result = await response.json();
    assert.equal(response.status, 200);
    assert.equal(result.success, true);
    assert.equal(result.data.DADOS.cpf, cpf);
    assert.equal(calls, 1);
    assert.equal((await fetch(url.replace("/captura", ""), { method: "POST" })).status, 404);
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});

test("route returns failure, never success with null data", async () => {
  const app = express();
  app.use(express.json());
  registerCapturaCpfRoute(app, () => true, async () => { throw new CapturaCpfError(404, "CPF não encontrado"); });
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>(resolve => server.once("listening", resolve));
  const address = server.address() as import("node:net").AddressInfo;
  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/api/captura/validate-cpf`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cpf }),
    });
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { success: false, error: "CPF não encontrado" });
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});

test("only captura changes provider; persistence, navigation, and other callers remain", () => {
  const source = readFileSync("client/src/pages/CapturaPage.tsx", "utf8");
  assert.ok(source.includes("fetch('/api/captura/validate-cpf'"));
  assert.ok(source.includes("localStorage.setItem('userData', JSON.stringify(userData))"));
  assert.ok(source.includes("localStorage.setItem('userData', JSON.stringify(finalData))"));
  assert.ok(source.includes("setLocation('/pessoal')"));
  assert.ok(source.includes("fetchDadosExtras(cleanCpf)"));
  assert.ok(source.includes("fetchPhoneNumbers(cleanCpf)"));
  assert.ok(readFileSync("client/src/pages/LoginPosPagentoPage.tsx", "utf8").includes("fetch('/api/validate-cpf'"));
  for (const page of ["BotPage", "ConversarPage"]) {
    assert.ok(readFileSync(`client/src/pages/${page}.tsx`, "utf8").includes("/api/verificar-cpf"));
  }
});
