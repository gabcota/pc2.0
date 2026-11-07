import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import express from "express";
import { distanceKm, lookupTemporariosLocations, registerTemporariosLocationsRoute } from "../server/temporariosLocations";

const cep = "01310100";
const token = "test-only-not-a-credential";
const info = async () => ({ localidade: "São Paulo", uf: "SP" });
const center = { lat: -23.55, lng: -46.63 };
const unit = {
  id: "test-unit", nome: "Unidade de teste", endereco: "Endereço de teste",
  telefone: "(11) 0000-0000", coordenadas: { lat: -23.56, lng: -46.64 }, precisao: "predial",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const successFetcher: typeof fetch = async url => String(url).includes("/v1/cep?")
  ? json(center) : json({ modulo: "leste", total: 1, obtidos: 1, resultados: [unit] });

test("new provider authenticates only server calls and preserves the current response contract", async () => {
  const urls: string[] = [];
  const result = await lookupTemporariosLocations(cep, token, info, async (url, options) => {
    urls.push(String(url));
    assert.deepEqual(options?.headers, { Accept: "application/json", "X-API-Token": token });
    assert.ok(options?.signal);
    return successFetcher(url, options);
  });
  assert.deepEqual(urls, [
    `https://backend-api-map-production-7fef.up.railway.app/v1/delegacias?cep=${cep}&raio=30000&limite=20&fonte=leste`,
    `https://backend-api-map-production-7fef.up.railway.app/v1/cep?texto=${cep}`,
  ]);
  assert.equal(result.fonte, "api_maps");
  assert.equal(result.success, true);
  assert.equal(result.data.municipio, "São Paulo");
  assert.equal(result.data.uf, "SP");
  assert.equal(result.data.cep_consultado, cep);
  assert.deepEqual(result.data.locais_prova[0], {
    place_id: unit.id, nome: unit.nome, endereco: unit.endereco,
    distancia_km: Number(distanceKm(center, unit.coordenadas).toFixed(2)),
    latitude: unit.coordenadas.lat, longitude: unit.coordenadas.lng,
    tipos: ["police"], type: "delegacia", telefone: unit.telefone, precisao: "predial",
  });
  assert.ok(!JSON.stringify(result).includes(token));
});

test("distance is real great-circle distance, not a fabricated zero", () => {
  assert.equal(distanceKm(center, center), 0);
  assert.ok(Math.abs(distanceKm({ lat: 0, lng: 0 }, { lat: 0, lng: 1 }) - 111.195) < 0.01);
  assert.ok(distanceKm(center, unit.coordenadas) > 1);
});

test("DP abbreviations and full Distrito Policial names are never filtered out", async () => {
  const names = ["6 DP Cambuci", "16 ° DP - V Clementino", "5° Distrito Policial de São Paulo"];
  const result = await lookupTemporariosLocations(cep, token, info, async url =>
    String(url).includes("/v1/cep?") ? json(center) : json({
      resultados: names.map((nome, index) => ({ ...unit, id: `dp-${index}`, nome })),
    }));
  assert.deepEqual(result.data.locais_prova.map(location => location.nome), names);
  assert.ok(result.data.locais_prova.every(location => location.type === "delegacia"));
});

test("missing token stops before any external call", async () => {
  let called = false;
  await assert.rejects(() => lookupTemporariosLocations(cep, undefined, info, async () => {
    called = true;
    return json({});
  }), /não configurado/);
  assert.equal(called, false);
});

test("empty results do not trigger geocoding, Google, CSV or extra lookups", async () => {
  let calls = 0;
  const result = await lookupTemporariosLocations(cep, token, async () => { throw new Error("must not call"); }, async () => {
    calls++;
    return json({ resultados: [] });
  });
  assert.equal(calls, 1);
  assert.equal(result.success, true);
  assert.deepEqual(result.data.locais_prova, []);
  assert.equal(result.data.total_locais_encontrados, 0);
});

test("optional address and phone are explicit; duplicate stable IDs are removed", async () => {
  const result = await lookupTemporariosLocations(cep, token, info, async url =>
    String(url).includes("/v1/cep?") ? json(center)
      : json({ resultados: [{ ...unit, endereco: undefined, telefone: undefined }, unit] }));
  assert.equal(result.data.total_locais_encontrados, 1);
  assert.equal(result.data.locais_prova[0].endereco, "Endereço não informado");
  assert.equal(result.data.locais_prova[0].telefone, "");
});

test("municipality metadata failure does not discard actual provider results", async () => {
  const result = await lookupTemporariosLocations(cep, token, async () => { throw new Error("CEP metadata offline"); }, successFetcher);
  assert.equal(result.data.municipio, "");
  assert.equal(result.data.uf, "");
  assert.equal(result.data.locais_prova.length, 1);
});

for (const coordinates of [null, {}, { lat: 91, lng: 0 }, { lat: 0, lng: 181 }, { lat: "0", lng: 0 }]) {
  test(`invalid coordinates are not replaced by zero: ${JSON.stringify(coordinates)}`, async () => {
    await assert.rejects(() => lookupTemporariosLocations(cep, token, info, async url =>
      String(url).includes("/v1/cep?") ? json(center) : json({ resultados: [{ ...unit, coordenadas: coordinates }] })),
    /Dados incompletos/);
  });
}

test("invalid center is reported explicitly", async () => {
  await assert.rejects(() => lookupTemporariosLocations(cep, token, info, async url =>
    String(url).includes("/v1/cep?") ? json({}) : json({ resultados: [unit] })), /Coordenadas indisponíveis/);
});

for (const body of [null, {}, { resultados: "bad" }, { resultados: [{ ...unit, id: "" }] }]) {
  test(`reject malformed provider data: ${JSON.stringify(body)}`, async () => {
    await assert.rejects(() => lookupTemporariosLocations(cep, token, info, async url =>
      String(url).includes("/v1/cep?") ? json(center) : json(body)));
  });
}

test("invalid JSON and timeout are controlled failures", async () => {
  await assert.rejects(() => lookupTemporariosLocations(cep, token, info, async () => new Response("not json")),
    /Resposta inválida/);
  await assert.rejects(() => lookupTemporariosLocations(cep, token, info, async () => {
    throw new DOMException("private URL or token must never escape", "TimeoutError");
  }), /temporariamente indisponível/);
});

async function withRoute(fetcher: typeof fetch, run: (base: string) => Promise<void>, getToken = () => token) {
  const app = express();
  registerTemporariosLocationsRoute(app, info, { fetcher, getToken });
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>(resolve => server.once("listening", resolve));
  const address = server.address() as import("node:net").AddressInfo;
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
}

test("dedicated route accepts formatted CEP and does not register legacy/medical paths", async () => {
  await withRoute(successFetcher, async base => {
    const response = await fetch(`${base}/api/temporarios/locais-prova/01310-100`);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).data.cep_consultado, cep);
    for (const path of ["/api/locais-prova/01310100", "/api/locais-exame/01310100"]) {
      assert.equal((await fetch(base + path)).status, 404);
    }
  });
});

test("invalid CEP never reaches the provider", async () => {
  await withRoute(async () => { throw new Error("must not call"); }, async base => {
    for (const invalid of ["123", "abcdefgh", "123456789", "12-345678"]) {
      const response = await fetch(`${base}/api/temporarios/locais-prova/${invalid}`);
      assert.equal(response.status, 400);
      assert.equal((await response.json()).success, false);
    }
  });
});

for (const [providerStatus, expected] of [[400, 400], [401, 503], [404, 404], [429, 503], [503, 503]]) {
  test(`HTTP ${providerStatus} is controlled and never falls back`, async () => {
    let calls = 0;
    await withRoute(async () => {
      calls++;
      return json({ error: { message: token } }, providerStatus);
    }, async base => {
      const response = await fetch(`${base}/api/temporarios/locais-prova/${cep}`);
      assert.equal(response.status, expected);
      const text = await response.text();
      assert.equal(JSON.parse(text).success, false);
      assert.ok(!text.includes(token));
    });
    assert.equal(calls, 1);
  });
}

test("missing credentials are a visible controlled route error", async () => {
  await withRoute(async () => { throw new Error("must not call"); }, async base => {
    const response = await fetch(`${base}/api/temporarios/locais-prova/${cep}`);
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /não configurado/);
  }, () => "");
});

test("temporarios keeps selection/persistence/navigation and medical caller stays unchanged", () => {
  const page = readFileSync("client/src/pages/TemporariosPage.tsx", "utf8");
  assert.ok(page.includes("fetch(`/api/temporarios/locais-prova/${encodeURIComponent(cep)}`)"));
  assert.ok(page.includes("locais_prova.slice(0, 3)"));
  assert.ok(page.includes("localStorage.setItem('applicationData', JSON.stringify(applicationData))"));
  assert.ok(page.includes("selectedJunta: selectedLocationData"));
  assert.ok(page.includes("examTime: selectedTime"));
  assert.ok(page.includes("juntaPlaceId: selectedLocationData.place_id"));
  assert.ok(page.includes('role="alert"'));
  assert.ok(page.includes("Nenhuma unidade encontrada"));
  assert.ok(!page.includes("DELEGACIAS_API_TOKEN"));
  const medical = readFileSync("client/src/pages/AgendamentoMedicoPage.tsx", "utf8");
  assert.ok(medical.includes("fetch(`/api/locais-exame/${cep}`)"));
  assert.ok(!medical.includes("/api/temporarios/"));
  const routes = readFileSync("server/routes.ts", "utf8");
  assert.ok(routes.includes('app.get("/api/locais-prova/:cep"'));
  assert.ok(routes.includes('app.get("/api/locais-exame/:cep"'));
  const adapter = readFileSync("server/temporariosLocations.ts", "utf8");
  assert.ok(!adapter.includes("maps.googleapis.com"));
  assert.ok(!adapter.includes("lerEscolasCsv"));
});
