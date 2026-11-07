import type { Express } from "express";

const API_BASE = "https://backend-api-map-production-7fef.up.railway.app";
const UNAVAILABLE = "Busca de unidades temporariamente indisponível. Tente novamente mais tarde.";

class LocationsError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

type Coordinates = { lat: number; lng: number };
type CepInfo = { localidade: string; uf: string };

function isCoordinates(value: unknown): value is Coordinates {
  if (!value || typeof value !== "object") return false;
  const { lat, lng } = value as Coordinates;
  return typeof lat === "number" && Number.isFinite(lat) && lat >= -90 && lat <= 90 &&
    typeof lng === "number" && Number.isFinite(lng) && lng >= -180 && lng <= 180;
}

export function distanceKm(from: Coordinates, to: Coordinates): number {
  const rad = Math.PI / 180;
  const a = Math.sin((to.lat - from.lat) * rad / 2) ** 2 +
    Math.cos(from.lat * rad) * Math.cos(to.lat * rad) *
    Math.sin((to.lng - from.lng) * rad / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, a))));
}

async function providerJson(path: string, token: string, fetcher: typeof fetch) {
  let response: Response;
  try {
    response = await fetcher(`${API_BASE}${path}`, {
      headers: { Accept: "application/json", "X-API-Token": token },
      signal: AbortSignal.timeout(20_000),
    });
  } catch {
    throw new LocationsError(503, UNAVAILABLE);
  }
  if (!response.ok) {
    // Do not forward provider bodies, headers or credentials to the browser.
    if (response.status === 400) throw new LocationsError(400, "CEP inválido.");
    if (response.status === 404) throw new LocationsError(404, "CEP não encontrado.");
    throw new LocationsError(503, UNAVAILABLE);
  }
  try {
    return await response.json();
  } catch {
    throw new LocationsError(502, "Resposta inválida do serviço de unidades.");
  }
}

export async function lookupTemporariosLocations(
  cep: string,
  token: string | undefined,
  getCepInfo: (cep: string) => Promise<CepInfo>,
  fetcher: typeof fetch = fetch,
) {
  if (!token?.trim()) {
    throw new LocationsError(503, "Serviço de unidades ainda não configurado.");
  }
  const credentials = token.trim();
  const list = await providerJson(
    `/v1/delegacias?cep=${encodeURIComponent(cep)}&raio=30000&limite=20&fonte=leste`,
    credentials, fetcher,
  );
  if (!list || !Array.isArray(list.resultados)) {
    throw new LocationsError(502, "Resposta inválida do serviço de unidades.");
  }

  // An empty provider result is not an excuse to silently switch to Google/CSV.
  if (list.resultados.length === 0) {
    return {
      success: true, fonte: "api_maps",
      data: {
        cep_consultado: cep, municipio: "", uf: "",
        total_locais_encontrados: 0, locais_prova: [],
      },
    };
  }

  const center = await providerJson(`/v1/cep?texto=${encodeURIComponent(cep)}`, credentials, fetcher);
  if (!isCoordinates(center)) {
    throw new LocationsError(502, "Coordenadas indisponíveis para calcular as distâncias.");
  }
  const seen = new Set<string>();
  const locations = list.resultados.map((item: unknown) => {
    if (!item || typeof item !== "object") {
      throw new LocationsError(502, "Resposta inválida do serviço de unidades.");
    }
    const row = item as Record<string, unknown>;
    if (typeof row.id !== "string" || !row.id.trim() ||
        typeof row.nome !== "string" || !row.nome.trim() ||
        !isCoordinates(row.coordenadas)) {
      throw new LocationsError(502, "Dados incompletos do serviço de unidades.");
    }
    const coordinates = row.coordenadas;
    return {
      place_id: row.id,
      nome: row.nome.trim(),
      endereco: typeof row.endereco === "string" && row.endereco.trim()
        ? row.endereco.trim() : "Endereço não informado",
      distancia_km: Number(distanceKm(center, coordinates).toFixed(2)),
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      tipos: ["police"],
      type: "delegacia",
      telefone: typeof row.telefone === "string" ? row.telefone : "",
      precisao: typeof row.precisao === "string" ? row.precisao : "",
    };
  }).filter((location: { place_id: string }) => {
    if (seen.has(location.place_id)) return false;
    seen.add(location.place_id);
    return true;
  });

  // Existing CEP metadata lookup uses OpenCEP/ViaCEP, not Google Maps.
  // Missing metadata must not discard genuine establishments from the new API.
  let info: CepInfo = { localidade: "", uf: "" };
  try {
    info = await getCepInfo(cep);
  } catch {
    // Explicitly empty metadata, never fabricated municipality/state.
  }
  return {
    success: true, fonte: "api_maps",
    data: {
      cep_consultado: cep, municipio: info.localidade, uf: info.uf,
      coordinates: center,
      total_locais_encontrados: locations.length,
      locais_prova: locations,
    },
  };
}

export function registerTemporariosLocationsRoute(
  app: Express,
  getCepInfo: (cep: string) => Promise<CepInfo>,
  options: {
    getToken?: () => string | undefined;
    fetcher?: typeof fetch;
  } = {},
) {
  app.get("/api/temporarios/locais-prova/:cep", async (req, res) => {
    const input = req.params.cep;
    if (!/^\d{5}-?\d{3}$/.test(input)) {
      return res.status(400).json({ success: false, error: "CEP deve conter 8 dígitos." });
    }
    const cep = input.replace("-", "");
    try {
      const token = options.getToken ? options.getToken() : process.env.DELEGACIAS_API_TOKEN;
      return res.json(await lookupTemporariosLocations(cep, token, getCepInfo, options.fetcher));
    } catch (error) {
      const known = error instanceof LocationsError;
      return res.status(known ? error.status : 503).json({
        success: false, error: known ? error.message : UNAVAILABLE,
      });
    }
  });
}
