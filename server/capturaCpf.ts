import type { Express } from "express";
import { formatName } from "./nameUtils";

const LOOKUP_BASE = "https://api-cpf-cg-production-86ed.up.railway.app";

export class CapturaCpfError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

// This adapter is exclusive to /captura. Legacy routes remain unchanged.
export async function lookupCapturaCpf(
  cpf: string,
  fetcher: typeof fetch = fetch,
  delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms)),
) {
  let response: Response | undefined;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      response = await fetcher(`${LOOKUP_BASE}/api/cpf-lookup/${cpf}`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(20_000),
      });
    } catch {
      if (attempt === 0) {
        await delay(1000);
        continue;
      }
      throw new CapturaCpfError(503, "Consulta de CPF temporariamente indisponível");
    }
    if ((response.status === 429 || response.status === 502) && attempt === 0) {
      await response.body?.cancel();
      await delay(1000);
      continue;
    }
    break;
  }

  if (!response?.ok) {
    const status = response?.status ?? 503;
    const messages: Record<number, string> = {
      400: "CPF inválido",
      404: "CPF não encontrado",
      422: "CPF inválido",
      429: "Limite de consultas atingido. Tente novamente mais tarde",
      502: "Consulta de CPF temporariamente indisponível",
      503: "Consulta de CPF temporariamente indisponível",
    };
    throw new CapturaCpfError(messages[status] ? status : 502,
      messages[status] || "Consulta de CPF temporariamente indisponível");
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new CapturaCpfError(502, "Resposta inválida da consulta de CPF");
  }
  if (result?.success === false) {
    // Do not treat a documented negative result as a successful empty lookup.
    const status = [400, 404, 422, 429, 502, 503].includes(result.api_status)
      ? result.api_status : 404;
    throw new CapturaCpfError(status, status === 404
      ? "CPF não encontrado" : "Não foi possível consultar o CPF");
  }
  if (result?.success !== true || typeof result.nome !== "string" ||
      !result.nome.trim() || result.cpf !== cpf ||
      (result.nasc != null && typeof result.nasc !== "string") ||
      (result.sexo != null && typeof result.sexo !== "string")) {
    throw new CapturaCpfError(502, "Resposta inválida da consulta de CPF");
  }

  const nascimento = result.nasc || "";
  const sexo = (result.sexo || "").trim().toUpperCase();
  return {
    DADOS: {
      nome: formatName(result.nome),
      cpf,
      nascimento,
      data_nascimento: nascimento,
      mae: typeof result.nome_mae === "string" ? formatName(result.nome_mae) : "",
      pai: "",
      rg: "",
      orgao_emissor: "",
      uf_emissao: "",
      titulo_eleitor: "",
      sexo: sexo === "M" || sexo === "F" ? sexo : "",
      situacao: "",
    },
  };
}

export function registerCapturaCpfRoute(
  app: Express,
  isValidCpf: (cpf: string) => boolean,
  lookup = lookupCapturaCpf,
) {
  app.post("/api/captura/validate-cpf", async (req, res) => {
    const input = req.body?.cpf;
    if (typeof input !== "string") {
      return res.status(400).json({ success: false, error: "CPF é obrigatório" });
    }
    const cpf = input.replace(/\D/g, "");
    if (cpf.length !== 11 || !isValidCpf(cpf)) {
      return res.status(400).json({ success: false, error: "CPF inválido" });
    }
    try {
      return res.json({ success: true, data: await lookup(cpf) });
    } catch (error) {
      // Never log CPF, provider body, or a URL containing personal data.
      const known = error instanceof CapturaCpfError;
      return res.status(known ? error.status : 503).json({
        success: false,
        error: known ? error.message : "Consulta de CPF temporariamente indisponível",
      });
    }
  });
}
