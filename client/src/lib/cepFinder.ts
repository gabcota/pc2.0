type Endereco = {
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
};

type Fonte = {
  nome: string;
  buscar: (cep: string, signal: AbortSignal) => Promise<Endereco | null>;
};

// A ordem do array é a prioridade no merge: em conflito, a primeira fonte vence.
const FONTES: Fonte[] = [
  {
    nome: 'opencep',
    buscar: async (cep, signal) => {
      const r = await fetch(`https://opencep.com/v1/${cep}`, { signal });
      if (!r.ok) return null;
      const d = await r.json();
      return {
        logradouro: d.logradouro ?? '',
        bairro: d.bairro ?? '',
        cidade: d.localidade ?? '',
        uf: d.uf ?? '',
      };
    },
  },
  {
    nome: 'brasilapi',
    buscar: async (cep, signal) => {
      const r = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`, { signal });
      if (!r.ok) return null;
      const d = await r.json();
      return {
        logradouro: d.street ?? '',
        bairro: d.neighborhood ?? '',
        cidade: d.city ?? '',
        uf: d.state ?? '',
      };
    },
  },
  {
    nome: 'viacep',
    buscar: async (cep, signal) => {
      const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`, { signal });
      if (!r.ok) return null;
      const d = await r.json();
      if (d.erro) return null;
      return {
        logradouro: d.logradouro ?? '',
        bairro: d.bairro ?? '',
        cidade: d.localidade ?? '',
        uf: d.uf ?? '',
      };
    },
  },
];

const CAMPOS = ['logradouro', 'bairro', 'cidade', 'uf'] as const;

const preenchido = (v?: string) => typeof v === 'string' && v.trim() !== '';

const cache = new Map<string, Endereco>();

function mesclar(respostas: (Endereco | null)[]): Endereco | null {
  const resultado: Endereco = { logradouro: '', bairro: '', cidade: '', uf: '' };
  let achouAlgo = false;

  for (const resposta of respostas) {
    if (!resposta) continue;
    achouAlgo = true;
    for (const campo of CAMPOS) {
      if (!preenchido(resultado[campo]) && preenchido(resposta[campo])) {
        resultado[campo] = resposta[campo].trim();
      }
    }
  }

  return achouAlgo ? resultado : null;
}

export async function buscarCep(cep: string, timeoutMs = 2000): Promise<Endereco | null> {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) return null;

  const emCache = cache.get(cepLimpo);
  if (emCache) return emCache;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  // Índice fixo por fonte para que o merge respeite a prioridade, não a ordem de chegada.
  const respostas: (Endereco | null)[] = new Array(FONTES.length).fill(null);

  // Resolve antes do timeout se alguma fonte trouxer o registro completo.
  let resolverCompleto: (() => void) | undefined;
  const primeiraCompleta = new Promise<void>((resolve) => {
    resolverCompleto = resolve;
  });

  const chamadas = FONTES.map(async (fonte, i) => {
    try {
      const dados = await fonte.buscar(cepLimpo, controller.signal);
      respostas[i] = dados;
      if (dados && CAMPOS.every((campo) => preenchido(dados[campo]))) {
        resolverCompleto?.();
      }
    } catch {
      respostas[i] = null;
    }
  });

  await Promise.race([Promise.allSettled(chamadas), primeiraCompleta]);
  clearTimeout(timer);
  controller.abort(); // cancela o que ainda estiver em voo

  const endereco = mesclar(respostas);
  if (endereco) cache.set(cepLimpo, endereco);
  return endereco;
}