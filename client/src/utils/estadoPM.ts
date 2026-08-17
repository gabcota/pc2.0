export interface EstadoPMData {
  sigla: string;
  nomeCompleto: string;
  vagasSoldado: number;
  vagasOficial: number;
}

export const ESTADO_PM: Record<string, EstadoPMData> = {
  SP: { sigla: 'PM-SP', nomeCompleto: 'Polícia Militar do Estado de São Paulo',    vagasSoldado: 2000, vagasOficial: 200 },
  MG: { sigla: 'PM-MG', nomeCompleto: 'Polícia Militar de Minas Gerais',           vagasSoldado: 2350, vagasOficial: 150 },
  RJ: { sigla: 'PM-RJ', nomeCompleto: 'Polícia Militar do Estado do Rio de Janeiro', vagasSoldado: 2000, vagasOficial: 100 },
  BA: { sigla: 'PM-BA', nomeCompleto: 'Polícia Militar da Bahia',                  vagasSoldado: 2500, vagasOficial: 200 },
  PR: { sigla: 'PM-PR', nomeCompleto: 'Polícia Militar do Paraná',                 vagasSoldado: 2200, vagasOficial: 100 },
  RS: { sigla: 'PM-RS', nomeCompleto: 'Polícia Militar do Rio Grande do Sul',      vagasSoldado: 1300, vagasOficial: 150 },
  PE: { sigla: 'PM-PE', nomeCompleto: 'Polícia Militar de Pernambuco',             vagasSoldado: 1250, vagasOficial: 70  },
  CE: { sigla: 'PM-CE', nomeCompleto: 'Polícia Militar do Ceará',                  vagasSoldado: 1100, vagasOficial: 120 },
  PA: { sigla: 'PM-PA', nomeCompleto: 'Polícia Militar do Pará',                   vagasSoldado: 4400, vagasOficial: 450 },
  SC: { sigla: 'PM-SC', nomeCompleto: 'Polícia Militar de Santa Catarina',         vagasSoldado: 500,  vagasOficial: 35  },
  MA: { sigla: 'PM-MA', nomeCompleto: 'Polícia Militar do Maranhão',               vagasSoldado: 1000, vagasOficial: 40  },
  GO: { sigla: 'PM-GO', nomeCompleto: 'Polícia Militar de Goiás',                  vagasSoldado: 1700, vagasOficial: 180 },
  AM: { sigla: 'PM-AM', nomeCompleto: 'Polícia Militar do Amazonas',               vagasSoldado: 1100, vagasOficial: 350 },
  ES: { sigla: 'PM-ES', nomeCompleto: 'Polícia Militar do Espírito Santo',         vagasSoldado: 1000, vagasOficial: 100 },
  PB: { sigla: 'PM-PB', nomeCompleto: 'Polícia Militar da Paraíba',                vagasSoldado: 1150, vagasOficial: 40  },
  RN: { sigla: 'PM-RN', nomeCompleto: 'Polícia Militar do Rio Grande do Norte',    vagasSoldado: 1000, vagasOficial: 125 },
  MT: { sigla: 'PM-MT', nomeCompleto: 'Polícia Militar do Mato Grosso',            vagasSoldado: 900,  vagasOficial: 90  },
  DF: { sigla: 'PMDF',  nomeCompleto: 'Polícia Militar do Distrito Federal',       vagasSoldado: 2300, vagasOficial: 147 },
  AL: { sigla: 'PM-AL', nomeCompleto: 'Polícia Militar de Alagoas',                vagasSoldado: 1000, vagasOficial: 60  },
  PI: { sigla: 'PM-PI', nomeCompleto: 'Polícia Militar do Piauí',                  vagasSoldado: 1000, vagasOficial: 1   },
  MS: { sigla: 'PM-MS', nomeCompleto: 'Polícia Militar do Mato Grosso do Sul',     vagasSoldado: 650,  vagasOficial: 120 },
  SE: { sigla: 'PM-SE', nomeCompleto: 'Polícia Militar de Sergipe',                vagasSoldado: 330,  vagasOficial: 40  },
  RO: { sigla: 'PM-RO', nomeCompleto: 'Polícia Militar de Rondônia',               vagasSoldado: 400,  vagasOficial: 50  },
  TO: { sigla: 'PM-TO', nomeCompleto: 'Polícia Militar do Tocantins',              vagasSoldado: 660,  vagasOficial: 70  },
  AC: { sigla: 'PM-AC', nomeCompleto: 'Polícia Militar do Acre',                   vagasSoldado: 262,  vagasOficial: 30  },
  AP: { sigla: 'PM-AP', nomeCompleto: 'Polícia Militar do Amapá',                  vagasSoldado: 2700, vagasOficial: 260 },
  RR: { sigla: 'PM-RR', nomeCompleto: 'Polícia Militar de Roraima',                vagasSoldado: 600,  vagasOficial: 120 },
};

/**
 * Nomes completos (e variações) de cada UF, usados para reconhecer o valor
 * de `region`/`regionName` retornado pelos provedores de geolocalização.
 *
 * - ipinfo.io (fonte primária de `/api/user-ip-data`) preenche `region` com o
 *   nome completo do estado em português (ex.: "São Paulo", "Rio de Janeiro"),
 *   exceto o Distrito Federal, que vem em inglês como "Federal District".
 * - ip-api.com (fallback) preenche `region` com a sigla de 2 letras (ex.: "SP").
 *
 * Todas as chaves abaixo são comparadas já normalizadas (sem acento, minúsculas,
 * sem espaços extras) em `normalizeToUF`.
 */
const NOME_PARA_UF: Record<string, string> = {
  'acre': 'AC',
  'alagoas': 'AL',
  'amapa': 'AP',
  'amazonas': 'AM',
  'bahia': 'BA',
  'ceara': 'CE',
  'distrito federal': 'DF',
  'federal district': 'DF',
  'espirito santo': 'ES',
  'goias': 'GO',
  'maranhao': 'MA',
  'mato grosso': 'MT',
  'mato grosso do sul': 'MS',
  'minas gerais': 'MG',
  'para': 'PA',
  'paraiba': 'PB',
  'parana': 'PR',
  'pernambuco': 'PE',
  'piaui': 'PI',
  'rio de janeiro': 'RJ',
  'state of rio de janeiro': 'RJ',
  'rio grande do norte': 'RN',
  'rio grande do sul': 'RS',
  'rondonia': 'RO',
  'roraima': 'RR',
  'santa catarina': 'SC',
  'sao paulo': 'SP',
  'state of sao paulo': 'SP',
  'sergipe': 'SE',
  'tocantins': 'TO',
};

/** Remove acentos, baixa a caixa e colapsa espaços para comparação tolerante. */
const normalizeString = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');

/**
 * Resolve uma string livre (sigla de 2 letras ou nome completo do estado,
 * com ou sem acentos, em qualquer capitalização) para a sigla de UF de
 * 2 letras usada como chave em `ESTADO_PM`. Retorna null se não reconhecer.
 */
export function normalizeToUF(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  // Já é uma sigla válida de 2 letras (ex.: "SP", "df").
  const asSigla = trimmed.toUpperCase();
  if (asSigla.length === 2 && ESTADO_PM[asSigla]) return asSigla;

  // Nome completo do estado (com/sem acento, qualquer capitalização).
  const normalized = normalizeString(trimmed);
  return NOME_PARA_UF[normalized] ?? null;
}

/**
 * Lê `localStorage.user_ip_data` (formato { region: "SP" } ou
 * { region: "São Paulo" }/{ regionName: "São Paulo" }, dependendo do provedor
 * de geolocalização) e retorna o EstadoPMData correspondente, ou null se não
 * detectado / não mapeado. Segura para chamar fora do ciclo React (ex:
 * getServerSideProps, callbacks).
 */
export function getEstadoPMFromStorage(): EstadoPMData | null {
  try {
    const raw = localStorage.getItem('user_ip_data');
    if (!raw) return null;
    const ipData = JSON.parse(raw);
    const uf = normalizeToUF(ipData?.region) ?? normalizeToUF(ipData?.regionName);
    return uf ? ESTADO_PM[uf] ?? null : null;
  } catch (_) {
    return null;
  }
}
