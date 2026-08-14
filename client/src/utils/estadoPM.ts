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
 * Lê `localStorage.user_ip_data` (formato { region: "SP" }) e retorna
 * o EstadoPMData correspondente, ou null se não detectado / não mapeado.
 * Segura para chamar fora do ciclo React (ex: getServerSideProps, callbacks).
 */
export function getEstadoPMFromStorage(): EstadoPMData | null {
  try {
    const raw = localStorage.getItem('user_ip_data');
    if (!raw) return null;
    const ipData = JSON.parse(raw);
    const uf: string = (ipData?.region ?? '').toUpperCase();
    return ESTADO_PM[uf] ?? null;
  } catch (_) {
    return null;
  }
}
