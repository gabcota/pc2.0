/**
 * Sistema de variações de campanha GOOGLE_VARIATION
 *
 * Formato da variável VITE_GOOGLE_VARIATION: "{número}_{campanha}"
 *   - número  → define o arquivo HTML de entrada (google_1.html, google_2.html, …)
 *   - campanha → define o comportamento da aplicação (IB = IBAMA, AM = Ambiental, etc.)
 *
 * Exemplos:
 *   ""       → padrão, index.html, AntiGooglePage em /
 *   "1_IB"   → google_1.html, QuizPage em / (fluxo IBAMA quiz)
 *   "1_PREP" → google_1.html, GuidePage em / (preparaibama.com)
 *
 * Para adicionar uma nova campanha:
 *   1. Acrescente uma entrada em VARIATION_OVERRIDES abaixo.
 *   2. Crie client/google_N.html se ainda não existir.
 *   3. Defina VITE_GOOGLE_VARIATION no ambiente.
 *   Não é necessário alterar App.tsx, vite.ts ou qualquer outro arquivo.
 */

export type HomepageKey = "guide" | "quiz" | "initial" | "anti-google" | "boletim" | "editorial" | "news-guide" | "jornal" | "guide-pf" | "revista" | "guia-educacional" | "zapzap";
export type FunnelEntryKey = "quiz" | "initial";
export type DisclaimerStyle = "full" | "compact" | "hidden";
export type LayoutStyle = "portal" | "jornal";

export interface VariationConfig {
  /** ID bruto da variação (valor de VITE_GOOGLE_VARIATION, ou "" para padrão) */
  id: string;

  /** Componente renderizado na rota "/" */
  homepage: HomepageKey;

  /** Componente renderizado em /conta, /noticia, /initial */
  funnelEntry: FunnelEntryKey;

  /**
   * Estilo da barra de aviso legal no SiteHeader:
   *   "full"    → barra completa com CNPJ e endereço (padrão)
   *   "compact" → só o badge "Aviso legal" + mensagem principal, sem dados empresariais
   *   "hidden"  → barra omitida (fluxos em que o header não é exibido de forma alguma)
   */
  disclaimerStyle: DisclaimerStyle;

  /** Se false, o SiteHeader não é exibido — útil para variações com header próprio */
  showSiteHeader: boolean;

  /**
   * Estilo visual global do layout:
   *   "portal" → estilo portal educacional (AgHeader/AgFooter com banner laranja)
   *   "jornal" → estilo jornal impresso (AgHeader/AgFooter em versão mastheads escuros, sem banner)
   */
  layoutStyle: LayoutStyle;
}

const DEFAULT_CONFIG: VariationConfig = {
  id: "",
  homepage: "anti-google",
  funnelEntry: "initial",
  disclaimerStyle: "hidden",
  showSiteHeader: false,
  layoutStyle: "portal",
};

/**
 * Mapa de sobreposições por variação.
 * Cada entrada sobrepõe apenas os campos que diferem do DEFAULT_CONFIG.
 * Campos omitidos herdam o valor padrão.
 */
const VARIATION_OVERRIDES: Record<string, Partial<VariationConfig>> = {
  "1_IB": {
    homepage: "quiz",
    funnelEntry: "quiz",
    disclaimerStyle: "compact",
  },
  "1_PREP": {
    homepage: "guide",
    funnelEntry: "initial",
    disclaimerStyle: "full",
    showSiteHeader: true,
  },
  "2_BOL": {
    homepage: "boletim",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
  },
  "3_NEW": {
    homepage: "editorial",
    funnelEntry: "initial",
    disclaimerStyle: "full",
    showSiteHeader: false,
  },
  "4_NEW": {
    homepage: "news-guide",
    funnelEntry: "initial",
    disclaimerStyle: "full",
    showSiteHeader: false,
  },
  "5_PREP": {
    homepage: "guide",
    funnelEntry: "initial",
    disclaimerStyle: "full",
    showSiteHeader: true,
  },
  "1_JORNAL": {
    homepage: "jornal",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "jornal",
  },
  "2_JORNAL": {
    homepage: "jornal",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "jornal",
  },
  "3_GUIDE": {
    homepage: "guide-pf",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "4_GUIDE": {
    homepage: "guide-pf",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "5_REVISTA": {
    homepage: "revista",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "6_REVISTA": {
    homepage: "revista",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "7_REVISTA": {
    homepage: "revista",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "1_NAK": {
    homepage: "guia-educacional",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "2_NAK": {
    homepage: "guia-educacional",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "3_NAK": {
    homepage: "guia-educacional",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "4_NAK": {
    homepage: "guia-educacional",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "5_NAK": {
    homepage: "guia-educacional",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "6_NAK": {
    homepage: "guia-educacional",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "7_NAK": {
    homepage: "guia-educacional",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "8_NAK": {
    homepage: "guia-educacional",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "9_NAK": {
    homepage: "guia-educacional",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "10_NAK": {
    homepage: "guia-educacional",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "11_NAK": {
    homepage: "guia-educacional",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "12_ZAPZAP": {
    homepage: "zapzap",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "13_ZAPZAP": {
    homepage: "zapzap",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "14_ZAPZAP": {
    homepage: "zapzap",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "15_ZAPZAP": {
    homepage: "zapzap",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "16_ZAPZAP": {
    homepage: "zapzap",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
  "3_ZAPZAP": {
    homepage: "zapzap",
    funnelEntry: "initial",
    disclaimerStyle: "hidden",
    showSiteHeader: false,
    layoutStyle: "portal",
  },
};

export function getVariationConfig(): VariationConfig {
  try {
    const raw: string = (import.meta.env.VITE_GOOGLE_VARIATION as string) ?? "";
    const overrides = VARIATION_OVERRIDES[raw] ?? {};
    return { ...DEFAULT_CONFIG, id: raw, ...overrides };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Constante singleton — use esta em vez de chamar getVariationConfig() a cada render.
 * O valor é resolvido uma vez na inicialização do módulo.
 */
export const VARIATION: VariationConfig = getVariationConfig();

/**
 * Utilitário para o servidor (Node.js) — resolve o nome do arquivo HTML
 * a partir do valor da variação de campanha.
 *
 * Regra: extrai o número do prefixo ("1_IB" → 1) e retorna "google_1.html".
 * Retorna "index.html" se a variação for vazia ou inválida.
 */
export function resolveHtmlFile(variation: string): string {
  if (!variation) return "index.html";
  const numStr = variation.split("_")[0];
  const num = parseInt(numStr, 10);
  if (isNaN(num) || num < 1) return "index.html";
  return `google_${num}.html`;
}
