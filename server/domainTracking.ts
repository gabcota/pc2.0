import { createHash } from "crypto";
import type { Request, Response, NextFunction } from "express";

function stringToMD5(text: string): string {
  return createHash("md5").update(text).digest("hex");
}

export type HomepageKey = "zapzap";

interface SitemapUrl {
  loc: string;
  changefreq:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

const LEGAL_PAGES: SitemapUrl[] = [
  { loc: "/sobre", changefreq: "monthly", priority: 0.5 },
  { loc: "/privacidade", changefreq: "monthly", priority: 0.4 },
  { loc: "/termos", changefreq: "monthly", priority: 0.4 },
  { loc: "/cookies", changefreq: "monthly", priority: 0.3 },
];

const HOMEPAGE_PATHS: Record<HomepageKey, SitemapUrl[]> = {
  zapzap: [{ loc: "/", changefreq: "weekly", priority: 1.0 }, ...LEGAL_PAGES],
};

export interface TrackingConfig {
  domain: string;
  faviconPath: string;
  ogImage: string;
  clarityId: string | null;
  gtagId?: string;
  gtmId?: string;
  utmifyPixelId?: string;

  homepageKey: HomepageKey;
  // SEO / meta
  title: string;
  description: string;
  author: string;
  ogType: "website" | "article";
  ogTitle: string;
  ogDescription: string;
  siteName: string;
  analyticsCore: string;
  extraHeadScripts?: string;
}

interface CompanyData {
  brand: string;
  razaoSocial: string;
  cnpj: string;
  address: string;
  postalCode: string;
  emailContato: string;
  phone: string;
  city: string;
  stateCode: string;
  themeColor: string;
}

// NOTE: This project serves a single production domain today —
// concursopm.click (Siqueira e Magalhaes Sociedade de Advogados —
// informação jurídica/advocacia sobre direitos e estabilidade na carreira
// pública, powered by ZapZapPage.tsx + client/src/lib/siteConfig.ts).
// Content deliberately avoids exam/edital wording ("concurso", "taxa") in
// favor of post-approval career-stage language (estágio probatório, PAD,
// promoções) — see ZapZapPage.tsx for the matching rationale.
// COMPANY_DATA / DOMAIN_TRACKING stay keyed by hostname (Record<string, ...>)
// so additional domains can be added here later without restructuring.
export const COMPANY_DATA: Record<string, CompanyData> = {
  "concursopm.click": {
    brand: "Direito de Carreira",
    razaoSocial: "Siqueira e Magalhaes Sociedade de Advogados",
    cnpj: "63.851.818/0001-38",
    address: "Rua Retiro dos Artistas, 01931, Apt 104 Blc 3, Pechincha",
    postalCode: "22770-104",
    emailContato: "contabil@siqueiramagalhaesadvogados.com.br",
    phone: "(21) 2435-8134",
    city: "Rio de Janeiro",
    stateCode: "RJ",
    themeColor: "#1a2e4a",
  },
  // direitodocandidatopm.click — separate firm (Alves & Saavedra), separate
  // CNPJ/address/GTM container from concursopm.click above. Kept in sync with
  // client/src/lib/siteConfig.ts's DIREITO_CANDIDATO config; update both if
  // this firm's registration data ever changes.
  "direitodocandidatopm.click": {
    brand: "Direito do Candidato",
    razaoSocial: "Alves & Saavedra Advogados Associados",
    cnpj: "65.953.516/0001-04",
    address: "Estrada Coronel Pedro Correia, 740, Sala 513, Jacarepaguá",
    postalCode: "22775-090",
    emailContato: "dericsaavedra@alvessaavedra.com",
    phone: "(21) 99654-5319",
    city: "Rio de Janeiro",
    stateCode: "RJ",
    themeColor: "#0f3d3e",
  },
  // editalpm.click — third firm (L.f.a. Oliveira, sole practitioner), separate
  // CNPJ/address/GTM container. Kept in sync with client/src/lib/siteConfig.ts's
  // DIREITO_EDITAL config; update both if this firm's registration data changes.
  "editalpm.click": {
    brand: "Direito no Edital",
    razaoSocial: "L.f.a. Oliveira Sociedade Individual de Advocacia",
    cnpj: "67.877.690/0001-32",
    address: "Avenida Rio Branco, 156, Sala 2321, Centro",
    postalCode: "20040-003",
    emailContato: "contato@lfaoliveira.adv.br",
    phone: "(21) 97629-5329",
    city: "Rio de Janeiro",
    stateCode: "RJ",
    themeColor: "#5c3d0e",
  },
  // carreiramilitarpm.click — fourth firm (Nichelle Alves, sole practitioner),
  // separate CNPJ/address/GTM container. Kept in sync with
  // client/src/lib/siteConfig.ts's CARREIRA_MILITAR config; update both if
  // this firm's registration data changes.
  "carreiramilitarpm.click": {
    brand: "Direito Militar de Carreira",
    razaoSocial: "Nichelle Alves Sociedade Individual de Advocacia",
    cnpj: "63.814.373/0001-16",
    address: "Avenida Rio Branco, 45, Sala 2102, Centro",
    postalCode: "20090-908",
    emailContato: "nichellealves@carraroeguimaraes.com.br",
    phone: "(21) 98054-5461",
    city: "Rio de Janeiro",
    stateCode: "RJ",
    themeColor: "#3b2f5e",
  },
  // vagaspm.click — fifth firm (Derick Guerra, sole practitioner), separate
  // CNPJ/address/GTM container. Kept in sync with
  // client/src/lib/siteConfig.ts's DIREITO_VAGAS config; update both if this
  // firm's registration data changes.
  "vagaspm.click": {
    brand: "Direito à Vaga",
    razaoSocial: "Derick Guerra Sociedade Individual de Advocacia",
    cnpj: "63.835.741/0001-02",
    address: "Avenida Treze de Maio, 47, Sala 2309, Centro",
    postalCode: "20031-921",
    emailContato: "advderickguerra@gmail.com",
    phone: "(21) 96963-9874",
    city: "Rio de Janeiro",
    stateCode: "RJ",
    themeColor: "#7a1f2b",
  },
  // direitosconcursopm.click — sixth firm (Carlos Oliveira, sole
  // practitioner), separate CNPJ/address/GTM container. Kept in sync with
  // client/src/lib/siteConfig.ts's DIREITOS_PROVA config; update both if this
  // firm's registration data changes.
  "direitosconcursopm.click": {
    brand: "Direitos no Concurso",
    razaoSocial: "Carlos Oliveira Sociedade Individual de Advocacia",
    cnpj: "63.910.297/0001-42",
    address: "Rua Da Quitanda, 19, Sala 206, Centro",
    postalCode: "20011-030",
    emailContato: "digicontassessoriacontabil@gmail.com",
    phone: "(21) 99696-3935",
    city: "Rio de Janeiro",
    stateCode: "RJ",
    themeColor: "#1f4d3a",
  },
  // assessoriapm.click — seventh firm (Lilian Gama, sole practitioner),
  // separate CNPJ/address/GTM container. Kept in sync with
  // client/src/lib/siteConfig.ts's DIREITO_COTAS config; update both if this
  // firm's registration data changes.
  "assessoriapm.click": {
    brand: "Direito às Cotas e Isenções",
    razaoSocial: "Lilian Gama Sociedade Individual de Advocacia",
    cnpj: "63.924.938/0001-18",
    address: "Avenida Treze de Maio, 47, Apt 1813, Centro",
    postalCode: "20031-921",
    emailContato: "contabilidadeprb@gmail.com",
    phone: "(21) 99984-1663",
    city: "Rio de Janeiro",
    stateCode: "RJ",
    themeColor: "#8a5a12",
  },
  // militarconcursos.click — eighth firm (Amanda Ciodaro, sole practitioner),
  // separate CNPJ/address/GTM container. Kept in sync with
  // client/src/lib/siteConfig.ts's MILITAR_FORMACAO config; update both if
  // this firm's registration data changes.
  "militarconcursos.click": {
    brand: "Direito Militar em Formação",
    razaoSocial: "Amanda C Ciodaro de Quadros Sociedade Individual de Advocacia",
    cnpj: "63.952.036/0001-95",
    address: "Avenida Das Américas, 4200, Bloco 1, Sala 305, Barra da Tijuca",
    postalCode: "22640-907",
    emailContato: "amandacq.adv@gmail.com",
    phone: "(21) 99402-1596",
    city: "Rio de Janeiro",
    stateCode: "RJ",
    themeColor: "#2b4d6b",
  },
  // militarconcurseiro.click — ninth firm (Maria da Penha Amorim, sole
  // practitioner), separate CNPJ/address/GTM container. Kept in sync with
  // client/src/lib/siteConfig.ts's MILITAR_CONCURSEIRO config; update both if
  // this firm's registration data changes.
  "militarconcurseiro.click": {
    brand: "Direito no Concurso Militar",
    razaoSocial: "Maria da Penha Amorim - Sociedade Individual de Advocacia",
    cnpj: "64.039.055/0001-98",
    address: "Rua Riachuelo, 87, Andar 1015, Centro",
    postalCode: "20230-010",
    emailContato: "mariadapenhaamorim@yahoo.com.br",
    phone: "(21) 99787-4891",
    city: "Rio de Janeiro",
    stateCode: "RJ",
    themeColor: "#4d1f3d",
  },
  // vocacaopolicial.click — tenth firm (Dutra, Schiessl & Gracher, three
  // sócios-administradores), separate CNPJ/address/GTM container. Kept in
  // sync with client/src/lib/siteConfig.ts's VOCACAO_POLICIAL config; update
  // both if this firm's registration data changes.
  "vocacaopolicial.click": {
    brand: "Direito no Exame Psicológico Policial",
    razaoSocial: "Dutra, Schiessl & Gracher Advogados Associados",
    cnpj: "60.888.465/0001-52",
    address: "Rua Uruguai, 1348, Andar 4, Fazenda",
    postalCode: "88302-202",
    emailContato: "contato@dsgadvogados.adv.br",
    phone: "(47) 3346-7770",
    city: "Itajaí",
    stateCode: "SC",
    themeColor: "#2f4858",
  },
  // pmpelobrasil.click — eleventh firm (Julia Coelho Peres, sole
  // practitioner), separate CNPJ/address/GTM container. Kept in sync with
  // client/src/lib/siteConfig.ts's CONCURSO_SUSPENSO config; update both if
  // this firm's registration data changes.
  "pmpelobrasil.click": {
    brand: "Direito em Concursos Suspensos ou Anulados",
    razaoSocial: "J. C. Peres Sociedade Individual de Advocacia",
    cnpj: "62.197.683/0001-76",
    address: "Avenida Jurema, 416, Apt 24, Indianópolis",
    postalCode: "04079-908",
    emailContato: "jcoelhoperes@gmail.com",
    phone: "(11) 98707-0800",
    city: "São Paulo",
    stateCode: "SP",
    themeColor: "#0e5c73",
  },
  // guiadafarda.click — twelfth firm (Caroline Antunes Geraldi, sole
  // practitioner), separate CNPJ/address/GTM container. Kept in sync with
  // client/src/lib/siteConfig.ts's APRESENTACAO_FARDA config; update both if
  // this firm's registration data changes.
  "guiadafarda.click": {
    brand: "Direito à Apresentação Pessoal na Farda",
    razaoSocial: "Caroline Antunes Geraldi Sociedade Individual de Advocacia",
    cnpj: "62.197.679/0001-08",
    address: "Rua Dr Angelo Vita, 125, Apt 132, Vila Zilda (Tatuapé)",
    postalCode: "03069-000",
    emailContato: "adv.cantunes@gmail.com",
    phone: "(47) 99171-7782",
    city: "São Paulo",
    stateCode: "SP",
    themeColor: "#4a5e2f",
  },
  // pmemfoco.click — thirteenth firm (Carlos Leme & Juliana Leme, two
  // sócios-administradores), separate CNPJ/address/GTM container. Kept in
  // sync with client/src/lib/siteConfig.ts's TRANSPARENCIA_CONCURSO config;
  // update both if this firm's registration data changes.
  "pmemfoco.click": {
    brand: "Direito à Transparência no Concurso da PM",
    razaoSocial: "Carlos Leme & Juliana Leme Advogados",
    cnpj: "43.542.532/0001-63",
    address: "Avenida Adolfo Pinheiro, 2054, Conj 408, Santo Amaro",
    postalCode: "04734-003",
    emailContato: "ablancorocha@uol.com.br",
    phone: "(11) 99844-3933",
    city: "São Paulo",
    stateCode: "SP",
    themeColor: "#6b1f4d",
  },
  // guiadapm.click — fourteenth firm (Gobbette Marques & Barreto, two
  // sócios-administradores), separate CNPJ/address/GTM container. No e-mail
  // was provided in this firm's registration data (only phone numbers), so
  // emailContato is intentionally left empty — do not fabricate one. Kept in
  // sync with client/src/lib/siteConfig.ts's EXAME_TOXICOLOGICO config;
  // update both if this firm's registration data changes.
  "guiadapm.click": {
    brand: "Direito no Exame Toxicológico do Concurso da PM",
    razaoSocial: "Gobbette Marques & Barreto Advogados Associados",
    cnpj: "20.300.477/0001-08",
    address: "Avenida Getulio Vargas, 128, Edif. Gal. Dr. Naly da E. Mir, Sala 09/11",
    postalCode: "29176-090",
    emailContato: "",
    phone: "(27) 99244-3959",
    city: "Serra",
    stateCode: "ES",
    themeColor: "#3d5e6b",
  },
  // carreiradeoficial.click — M.a Assessoria e Treinamentos LTDA (Sociedade
  // Empresária Limitada, CNAE 85.99-6-04, Treinamento em desenvolvimento
  // profissional e gerencial), sediada em Fortaleza/CE. Não é escritório de
  // advocacia. Mantida em sincronia com client/src/lib/siteConfig.ts
  // (CARREIRA_OFICIAL); atualizar ambos se os dados cadastrais mudarem.
  "carreiradeoficial.click": {
    brand: "Carreira de Oficial",
    razaoSocial: "M.a Assessoria e Treinamentos LTDA",
    cnpj: "57.717.002/0001-13",
    address: "Rua Monsenhor Otavio de Castro, 435, Sala 01, Fatima",
    postalCode: "60050-150",
    emailContato: "maassessoriaetreinamentos@outlook.com",
    phone: "(88) 99765-0646",
    city: "Fortaleza",
    stateCode: "CE",
    themeColor: "#4c2c7a",
  },
  // radarpm.click — Btc Conecta Cursos e Eventos LTDA (Empresa de Pequeno
  // Porte, Sociedade Empresária Limitada, CNAE 85.99-6-05), sediada em
  // Brasília/DF. Não é escritório de advocacia. Mantida em sincronia com
  // client/src/lib/siteConfig.ts (RADAR_PM); atualizar ambos se os dados
  // cadastrais mudarem.
  "radarpm.click": {
    brand: "Radar PM",
    razaoSocial: "Btc Conecta Cursos e Eventos LTDA",
    cnpj: "58.129.039/0001-93",
    address: "SAUS QD 4, Bloco A, Sala 620, Ed. Victoria Office Tower, Asa Sul",
    postalCode: "70070-938",
    emailContato: "monteiroaugustoadvogados@gmail.com",
    phone: "(61) 99979-7179",
    city: "Brasília",
    stateCode: "DF",
    themeColor: "#1c4d7a",
  },
  // pmnapratica.click — Educacional Insigne LTDA (Empresa de Pequeno Porte,
  // Sociedade Empresária Limitada, CNAE 85.99-6-05, Cursos preparatórios para
  // concursos), sediada em Brasília/DF. Não é escritório de advocacia. Mantida
  // em sincronia com client/src/lib/siteConfig.ts (PM_NA_PRATICA); atualizar
  // ambos se os dados cadastrais mudarem.
  "pmnapratica.click": {
    brand: "PM na Prática",
    razaoSocial: "Educacional Insigne LTDA",
    cnpj: "57.205.076/0001-70",
    address: "SQPS 102, Lote 19, 602, Zona Industrial (Guará)",
    postalCode: "71215-690",
    emailContato: "brandaog12@gmail.com",
    phone: "(61) 98317-0713",
    city: "Brasília",
    stateCode: "DF",
    themeColor: "#2f4f5c",
  },
  // rumoafarda.click — Mvp Educacao e Negocios LTDA (Sociedade Empresária
  // Limitada, CNAE 85.99-6-04, Treinamento em desenvolvimento profissional),
  // sediada em Brasília/DF. Não é escritório de advocacia. Mantida em
  // sincronia com client/src/lib/siteConfig.ts (RUMO_FARDA); atualizar
  // ambos se os dados cadastrais mudarem.
  "rumoafarda.click": {
    brand: "Rumo à Farda",
    razaoSocial: "Mvp Educacao e Negocios LTDA",
    cnpj: "57.212.120/0001-70",
    address: "SCS QD 02, Bloco D, Salas 1102A/1105, Edif. Oscar Niemeyer, Asa Sul",
    postalCode: "70316-900",
    emailContato: "everest.alainy@gmail.com",
    phone: "(61) 98589-3277",
    city: "Brasília",
    stateCode: "DF",
    themeColor: "#3a5c1e",
  },
  // nascipraserpm.click — Dc Concursos LTDA (Sociedade Empresária Limitada,
  // CNAE 85.99-6-05 exclusivo, Cursos preparatórios para concursos), sediada
  // em Brasília/DF. Não é escritório de advocacia. Mantida em sincronia com
  // client/src/lib/siteConfig.ts (VOCA_PM); atualizar ambos se os dados
  // cadastrais mudarem.
  "nascipraserpm.click": {
    brand: "Nasci pra ser PM",
    razaoSocial: "Dc Concursos LTDA",
    cnpj: "57.267.808/0001-57",
    address: "SHCGN CR QD 704/705, Bloco C, Loja 06, Asa Norte",
    postalCode: "70730-600",
    emailContato: "ceodegrausconcursos@gmail.com",
    phone: "(61) 98299-7823",
    city: "Brasília",
    stateCode: "DF",
    themeColor: "#5c1f00",
  },
  // espiritopolicial.click — Denyse Braatz Araujo LTDA (Sociedade Empresária
  // Limitada, CNAE 85.99-6-05, Cursos preparatórios para concursos), sediada
  // em Brasília/DF. Primeira empresa fora de Fortaleza/CE. Não é escritório
  // de advocacia. Mantida em sincronia com client/src/lib/siteConfig.ts
  // (ESPIRITO_POLICIAL); atualizar ambos se os dados cadastrais mudarem.
  "espiritopolicial.click": {
    brand: "Espírito Policial",
    razaoSocial: "Denyse Braatz Araujo LTDA",
    cnpj: "57.171.635/0001-79",
    address: "SEPS EQ 712/912, Cj D, S/N, Bloco 01, Asa Sul",
    postalCode: "70390-125",
    emailContato: "clementinocontabilidade@gmail.com",
    phone: "(61) 99883-3766",
    city: "Brasília",
    stateCode: "DF",
    themeColor: "#2d3561",
  },
  // rumoaocfo.click — Espaco Amari LTDA (Sociedade Empresária Limitada, CNAE
  // 85.99-6-04, treinamento em desenvolvimento profissional e cursos
  // preparatórios para concursos), sediada em Fortaleza/CE. Não é escritório
  // de advocacia. Mantida em sincronia com client/src/lib/siteConfig.ts
  // (RUMO_AO_CFO); atualizar ambos se os dados cadastrais mudarem.
  "rumoaocfo.click": {
    brand: "Rumo ao CFO",
    razaoSocial: "Espaco Amari LTDA",
    cnpj: "57.528.270/0001-97",
    address: "Rua Joaquim SA, 405, Sala A, Dionisio Torres",
    postalCode: "60135-218",
    emailContato: "marimmoura@gmail.com",
    phone: "(85) 98699-8932",
    city: "Fortaleza",
    stateCode: "CE",
    themeColor: "#7a5c00",
  },
};

interface FaqEntry {
  q: string;
  a: string;
}

// Fallback FAQ used only when a domain has no dedicated entry in DOMAIN_FAQS
// below. Mirrors the default FAQ (DEFAULT_FAQS + FAQ_WHATSAPP_NEUTRAL) in
// ZapZapPage.tsx — keep in sync if that default copy changes.
const FAQ_VIDA_FUNCIONAL: FaqEntry[] = [
  {
    q: "Fui exonerado durante o estágio probatório sem processo — isso é legal?",
    a: "Não necessariamente. Mesmo durante o estágio probatório, a exoneração por inadaptação ou insuficiência de desempenho deve ser precedida de avaliação formal, com critérios objetivos, contraditório e ampla defesa. A ausência desses elementos pode tornar o ato nulo e permitir a reintegração por via administrativa ou judicial.",
  },
  {
    q: "Tenho direito a uma promoção que foi negada?",
    a: "Depende dos critérios previstos no estatuto ou plano de carreira aplicável. Se você preenchia os requisitos de antiguidade ou merecimento e foi preterido sem justificativa, ou se os critérios de avaliação foram aplicados de forma desigual entre servidores, é possível questionar a decisão administrativamente e, se necessário, judicialmente.",
  },
  {
    q: "Como funciona a defesa em um Processo Administrativo Disciplinar (PAD)?",
    a: "O servidor tem direito a ser notificado formalmente, apresentar defesa escrita, produzir provas e acompanhar todos os atos por advogado. Irregularidades como cerceamento de defesa, comissão parcial ou penalidade desproporcional à falta podem levar à anulação do processo e da punição aplicada.",
  },
  {
    q: "Minha transferência ou remoção foi negada — posso contestar?",
    a: "Sim, especialmente quando o indeferimento carece de motivação adequada ou desconsidera critérios legais aplicáveis, como razões de saúde ou reunião familiar previstas em lei. É possível pedir a revisão administrativa da decisão e, conforme o caso, buscar a via judicial.",
  },
  {
    q: "É possível tirar dúvidas por WhatsApp?",
    a: "Sim. Você pode enviar sua dúvida sobre direitos do servidor público pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para orientação sobre um caso específico, procure um advogado habilitado.",
  },
];

const PAGE_FAQS: Partial<Record<HomepageKey, FaqEntry[]>> = {
  zapzap: FAQ_VIDA_FUNCIONAL,
};

// Common WhatsApp Q&A item appended to every domain's FAQ below (neutral
// wording, since no domain currently has isVerifiedLawFirm=true — see
// siteConfig.ts). Mirrors FAQ_WHATSAPP_NEUTRAL in ZapZapPage.tsx.
const FAQ_WHATSAPP_NEUTRAL: FaqEntry = {
  q: "É possível tirar dúvidas por WhatsApp?",
  a: "Sim. Você pode enviar sua dúvida sobre direitos do servidor público pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para orientação sobre um caso específico, procure um advogado habilitado.",
};

// Each entry below is kept identical to that domain's `faq` array in
// client/src/lib/siteConfig.ts (plus the shared WhatsApp item) so the
// FAQPage JSON-LD matches the content actually rendered on the page. Update
// both files together when FAQ copy changes for a domain.
const DOMAIN_FAQS: Partial<Record<string, FaqEntry[]>> = {
  "concursopm.click": FAQ_VIDA_FUNCIONAL,
  "direitodocandidatopm.click": [
    {
      q: "Fui eliminado no exame médico ou psicológico — posso contestar?",
      a: "Sim, é possível questionar a eliminação quando o laudo carece de fundamentação técnica, contraria exames anteriores ou não observa o direito à ciência prévia dos critérios de avaliação e à interposição de recurso. Irregularidades no procedimento podem levar à revisão administrativa ou judicial do resultado.",
    },
    {
      q: "A investigação social ou sindicância de vida pregressa pode me eliminar por qualquer motivo?",
      a: "Não. A avaliação deve se limitar aos critérios objetivos previstos no edital, com direito ao contraditório e à apresentação de esclarecimentos antes da decisão final. Eliminações baseadas em fatos genéricos, não comprovados ou incompatíveis com os critérios fixados podem ser contestadas.",
    },
    {
      q: "Tenho direito a recurso contra minha eliminação em qualquer etapa do processo seletivo?",
      a: "Em regra, sim — o edital deve prever prazo e forma para apresentação de recurso administrativo em cada fase eliminatória. A ausência de resposta fundamentada da banca ou o descumprimento do prazo legal de análise também pode ser questionado.",
    },
    {
      q: "Posso pedir para refazer um exame se discordar do resultado?",
      a: "Depende das regras do edital e da natureza do exame. Em alguns casos é possível solicitar reavaliação por junta ou nova perícia quando há dúvida técnica fundamentada sobre o resultado, especialmente diante de laudos contraditórios ou vícios no procedimento adotado.",
    },
    FAQ_WHATSAPP_NEUTRAL,
  ],
  "editalpm.click": [
    {
      q: "Posso impugnar um edital antes mesmo de me inscrever?",
      a: "Sim. A impugnação de edital é um recurso administrativo que pode ser apresentado por qualquer interessado, mesmo antes da inscrição, dentro do prazo fixado no próprio instrumento convocatório, para questionar cláusulas consideradas ilegais ou contraditórias.",
    },
    {
      q: "O que fazer se o edital tiver exigências que considero discriminatórias?",
      a: "Requisitos sem relação direta com as atribuições do cargo ou que restrinjam a participação de forma desproporcional podem violar o princípio da isonomia entre candidatos e ser impugnados administrativamente, com possibilidade de revisão judicial caso o pedido seja indeferido sem fundamentação adequada.",
    },
    {
      q: "A retificação do edital pode prejudicar quem já se inscreveu?",
      a: "Alterações relevantes — como mudança de requisitos, datas ou etapas — após o início das inscrições devem, em regra, reabrir prazo ou assegurar tratamento igualitário aos já inscritos, sob pena de violar direitos adquiridos no âmbito do certame.",
    },
    {
      q: "Existe prazo para questionar irregularidades no edital?",
      a: "Sim, o próprio edital costuma fixar prazos específicos para impugnação e para recursos em cada fase. Perder esse prazo administrativo não impede necessariamente a análise judicial, mas reduz as chances de solução rápida do problema.",
    },
    FAQ_WHATSAPP_NEUTRAL,
  ],
  "carreiramilitarpm.click": [
    {
      q: "Fui preterido em uma promoção por antiguidade ou merecimento — posso contestar?",
      a: "Sim, quando o militar preenchia os requisitos previstos no regulamento de promoções e foi preterido sem justificativa compatível com os critérios legais, ou quando a avaliação de merecimento foi aplicada de forma desigual entre pares, a decisão pode ser questionada administrativamente e, se necessário, judicialmente.",
    },
    {
      q: "Como funciona a defesa em um Conselho de Disciplina?",
      a: "O militar tem direito a ser notificado formalmente, apresentar defesa escrita, produzir provas e ser assistido por advogado durante todo o procedimento. Cerceamento de defesa, composição irregular do conselho ou penalidade desproporcional à falta podem levar à anulação do processo.",
    },
    {
      q: "A transferência ex officio pode ser negada ou revertida?",
      a: "A transferência de interesse da corporação deve observar motivação adequada e, quando cabível, os critérios legais de proteção à saúde ou à unidade familiar. Decisões sem fundamentação suficiente ou que desconsiderem tais critérios podem ser objeto de revisão administrativa ou judicial.",
    },
    {
      q: "É possível pedir reintegração ao posto ou graduação após exclusão da corporação?",
      a: "Sim, quando a exclusão resultou de processo administrativo com vícios formais — como cerceamento de defesa ou ausência de contraditório — é possível pleitear a reintegração ao posto ou graduação, com efeitos retroativos, pelas vias administrativa ou judicial.",
    },
    FAQ_WHATSAPP_NEUTRAL,
  ],
  "vagaspm.click": [
    {
      q: "Fui preterido na ordem de convocação — o que posso fazer?",
      a: "A nomeação deve seguir rigorosamente a ordem de classificação prevista no edital. Quando outro candidato pior classificado é convocado antes de você sem justificativa legal, é possível pleitear administrativamente a sua nomeação imediata e, se necessário, buscar a via judicial.",
    },
    {
      q: "O que é o cadastro de reserva e quando ele pode ser convocado?",
      a: "É a lista de candidatos aprovados além do número de vagas do edital, que pode ser convocada em caso de surgimento de novas vagas dentro do prazo de validade do concurso. A administração tem discricionariedade limitada e, havendo vaga e necessidade comprovada, a convocação pode se tornar um direito subjetivo do candidato.",
    },
    {
      q: "A administração pode ampliar o número de vagas durante a validade do concurso?",
      a: "Sim, e quando isso ocorre — por abertura de novo edital para o mesmo cargo ou por vagas surgidas por aposentadoria, exoneração ou criação de cargos — os candidatos aprovados em cadastro de reserva podem ter direito à convocação antes de um novo certame.",
    },
    {
      q: "O que acontece se o prazo de validade do concurso expirar sem minha convocação?",
      a: "Em regra, o direito à nomeação se extingue com o fim da validade do concurso. No entanto, se ficar comprovado que a administração deixou de convocar candidatos aprovados dentro das vagas por conveniência, sem justificativa idônea, é possível questionar a omissão judicialmente.",
    },
    FAQ_WHATSAPP_NEUTRAL,
  ],
  "direitosconcursopm.click": [
    {
      q: "Posso recorrer se discordar do gabarito preliminar?",
      a: "Sim, o edital costuma prever prazo específico para apresentação de recurso contra o gabarito preliminar, com fundamentação técnica sobre a questão contestada. A banca é obrigada a analisar e responder de forma motivada cada recurso apresentado.",
    },
    {
      q: "Uma questão pode ser anulada por erro na formulação?",
      a: "Sim. Questões com enunciado ambíguo, mais de uma alternativa correta, conteúdo fora do programa do edital ou desatualizado podem ser anuladas, hipótese em que a pontuação costuma ser atribuída a todos os candidatos.",
    },
    {
      q: "Como pedir revisão de nota em prova discursiva ou redação?",
      a: "É possível solicitar revisão quando os critérios de correção não foram aplicados de forma objetiva e uniforme, ou quando há divergência relevante entre a nota atribuída e o conteúdo efetivamente apresentado, sempre dentro do prazo recursal fixado no edital.",
    },
    {
      q: "Existe prazo para apresentar recurso contra o resultado da prova?",
      a: "Sim, os prazos recursais são fixados no edital e costumam ser curtos — em geral, poucos dias após a divulgação do resultado ou gabarito. Perder esse prazo administrativo pode limitar as opções de questionamento posterior.",
    },
    FAQ_WHATSAPP_NEUTRAL,
  ],
  "assessoriapm.click": [
    {
      q: "Meu pedido de isenção da taxa de inscrição foi indeferido — posso contestar?",
      a: "Sim. O indeferimento deve ser motivado e observar os critérios objetivos previstos no edital, como renda familiar ou doação de sangue/medula. Decisões genéricas, sem análise da documentação apresentada, podem ser questionadas administrativamente e, se necessário, judicialmente, inclusive com pedido de reabertura de prazo de inscrição.",
    },
    {
      q: "Como funciona a reserva de vagas para pessoas com deficiência?",
      a: "O edital deve reservar percentual de vagas para candidatos com deficiência, com direito a condições especiais durante a prova e avaliação por equipe multiprofissional após a aprovação. Indeferimentos sem perícia adequada ou critérios incompatíveis com a lei podem ser contestados.",
    },
    {
      q: "Posso recorrer se for eliminado na avaliação da comissão de heteroidentificação (cotas raciais)?",
      a: "Sim, o edital deve prever direito a recurso contra a decisão da comissão, com possibilidade de nova avaliação por comissão distinta em caso de vício procedimental, ausência de gravação da entrevista ou de fundamentação da decisão.",
    },
    {
      q: "A perda da condição de cotista pode ser contestada?",
      a: "Sim, especialmente quando a exclusão da lista de cotistas se baseia em critérios não previstos no edital ou em procedimento que não assegurou contraditório e ampla defesa ao candidato antes da decisão final.",
    },
    FAQ_WHATSAPP_NEUTRAL,
  ],
  "militarconcursos.click": [
    {
      q: "Fui eliminado no teste de aptidão física (TAF) — isso é definitivo?",
      a: "Não necessariamente. O TAF deve seguir critérios objetivos e uniformes previstos no edital do curso de formação, com direito a nova tentativa quando prevista em regulamento. Falhas no procedimento — como aplicação irregular do teste ou ausência de avaliação médica prévia — podem justificar a revisão do resultado.",
    },
    {
      q: "Posso contestar o resultado do exame psicotécnico militar?",
      a: "Sim, especialmente quando o laudo é inconclusivo, contraria avaliações anteriores compatíveis, ou não observa o direito a conhecer os critérios de avaliação e a interpor recurso com acesso aos parâmetros utilizados pela banca examinadora.",
    },
    {
      q: "O desligamento de um curso de formação precisa seguir algum processo formal?",
      a: "Sim. O desligamento por insuficiência de rendimento ou disciplinar deve ser precedido de procedimento formal, com notificação, oportunidade de defesa e critérios objetivos de avaliação. A ausência desses elementos pode tornar o ato passível de anulação.",
    },
    {
      q: "É possível ser reintegrado a um curso de formação após desligamento?",
      a: "Quando o desligamento resultou de vício no procedimento — como cerceamento de defesa ou critério de avaliação não previsto em edital — é possível pleitear a reintegração ao curso, pelas vias administrativa ou judicial, conforme a fase em que o curso se encontrar.",
    },
    FAQ_WHATSAPP_NEUTRAL,
  ],
  "militarconcurseiro.click": [
    {
      q: "Fui eliminado por tatuagem no concurso militar — posso contestar essa decisão?",
      a: "Depende dos critérios do edital. A eliminação por tatuagem deve observar critérios objetivos e razoáveis, geralmente ligados a visibilidade em farda ou conteúdo ofensivo/discriminatório. Restrições genéricas demais, aplicadas sem análise individual, podem ser questionadas administrativamente e, se necessário, judicialmente.",
    },
    {
      q: "Não atingi a altura mínima exigida no edital — isso é motivo legítimo de eliminação?",
      a: "A exigência de altura mínima é comum em editais militares, mas deve estar prevista de forma expressa e proporcional às atribuições do cargo. Quando o critério é aplicado de forma desigual entre candidatos ou não guarda relação com a função, é possível questionar a eliminação.",
    },
    {
      q: "Fui reprovado na inspeção de saúde por um motivo que considero genérico ou incorreto — o que posso fazer?",
      a: "É possível solicitar acesso ao laudo detalhado e, quando cabível, pedir reavaliação por junta médica distinta, especialmente se o laudo for contraditório, inconclusivo ou não observar o direito à ampla defesa e ao contraditório previstos no edital.",
    },
    {
      q: "Posso recorrer se for eliminado no teste de aptidão física por erro na aplicação do teste?",
      a: "Sim. Falhas na aplicação do teste — como equipamento inadequado, ausência de fiscalização padronizada ou desconsideração de laudo médico anterior — podem justificar recurso administrativo e, se necessário, revisão judicial do resultado.",
    },
    FAQ_WHATSAPP_NEUTRAL,
  ],
  "vocacaopolicial.click": [
    {
      q: "Fui eliminado no exame psicológico de um concurso policial — posso contestar?",
      a: "Sim, especialmente quando o laudo é inconclusivo, contraria avaliações compatíveis anteriores ou não observa o direito de conhecer os critérios do perfil profissiográfico exigido e de interpor recurso com acesso aos parâmetros utilizados pela banca examinadora.",
    },
    {
      q: "O que é o perfil profissiográfico e como ele pode eliminar um candidato?",
      a: "É o conjunto de características psicológicas definidas no edital como compatíveis com a função policial. A eliminação só é válida quando fundamentada em critérios técnicos objetivos e previamente divulgados — avaliações genéricas ou sem fundamentação podem ser questionadas administrativamente.",
    },
    {
      q: "Fui desligado durante o curso de formação por reprovação em avaliação psicológica — o que posso fazer?",
      a: "O desligamento deve ser precedido de procedimento formal, com direito a conhecer os critérios de avaliação, apresentar contestação e ter acesso ao laudo técnico. Vícios nesse procedimento podem justificar a revisão administrativa ou judicial do desligamento.",
    },
    {
      q: "É possível pedir uma nova avaliação psicológica se eu discordar do resultado?",
      a: "Depende das regras do edital. Em diversos casos é possível solicitar reavaliação por junta distinta quando há fundamentada dúvida técnica sobre o laudo, especialmente diante de avaliações contraditórias ou ausência de justificativa individualizada para a eliminação.",
    },
    FAQ_WHATSAPP_NEUTRAL,
  ],
  "pmpelobrasil.click": [
    {
      q: "O concurso da Polícia Militar em que me inscrevi foi suspenso por decisão judicial — o que acontece com a minha inscrição?",
      a: "Em regra, a suspensão paralisa temporariamente as etapas do certame até a decisão final, preservando os direitos já adquiridos pelos inscritos. Após o restabelecimento do concurso, os candidatos devem ser reintegrados à mesma fase em que o processo foi interrompido, sem prejuízo de sua classificação.",
    },
    {
      q: "É possível pedir a prorrogação do prazo de validade de um concurso paralisado?",
      a: "Sim, quando a paralisação decorreu de decisão judicial ou de fato alheio à vontade da administração, é possível pleitear a prorrogação do prazo de validade do certame, de modo a assegurar que o tempo de suspensão não prejudique a expectativa de nomeação dos aprovados.",
    },
    {
      q: "Um concurso pode ser anulado por suspeita de fraude ou vazamento de provas — o que acontece com quem foi aprovado regularmente?",
      a: "A anulação total só se justifica quando a fraude compromete a lisura de todo o certame. Quando é possível identificar e isolar os candidatos beneficiados de forma irregular, a administração deve, sempre que viável, preservar a validade do concurso para os demais aprovados sem qualquer participação na fraude.",
    },
    {
      q: "Posso contestar o adiamento de uma prova sem aviso prévio suficiente?",
      a: "Sim. Alterações de data, horário ou local de prova devem ser comunicadas com antecedência razoável e por meio de divulgação oficial acessível a todos os inscritos. A ausência de comunicação adequada pode justificar a remarcação da prova ou a anulação da etapa realizada de forma irregular.",
    },
    FAQ_WHATSAPP_NEUTRAL,
  ],
  "guiadafarda.click": [
    {
      q: "Recebi uma sanção disciplinar por corte de cabelo ou barba fora do padrão — posso contestar?",
      a: "Sim, especialmente quando o padrão exigido não está claramente previsto em regulamento ou quando a sanção foi aplicada sem oportunidade de correção prévia ou de apresentação de defesa. Critérios genéricos ou aplicados de forma desigual entre militares/policiais podem ser questionados administrativamente.",
    },
    {
      q: "O regulamento pode proibir qualquer tatuagem visível, mesmo já autorizada anteriormente?",
      a: "Alterações no regulamento de apresentação pessoal não podem, em regra, retroagir para punir situações já consolidadas e previamente autorizadas. A aplicação retroativa de uma nova exigência sem período de adequação pode ser objeto de revisão administrativa ou judicial.",
    },
    {
      q: "Fui punido por uso incorreto do uniforme — a sanção precisa seguir algum processo formal?",
      a: "Sim. Mesmo infrações consideradas leves exigem notificação do fato, oportunidade de manifestação e proporcionalidade entre a conduta e a penalidade aplicada. A ausência desses elementos pode tornar a sanção passível de anulação.",
    },
    {
      q: "É possível recorrer de uma detenção disciplinar aplicada sem direito de defesa prévia?",
      a: "Sim. Toda sanção disciplinar, inclusive as de menor gravidade, deve observar o contraditório e a ampla defesa. A aplicação de detenção ou punição semelhante sem esse procedimento mínimo pode ser contestada pelas vias administrativa e judicial.",
    },
    FAQ_WHATSAPP_NEUTRAL,
  ],
  "pmemfoco.click": [
    {
      q: "Posso pedir cópia da minha folha de respostas e do espelho de correção da prova?",
      a: "Sim. O candidato tem direito de acesso aos seus próprios dados e ao resultado de sua avaliação, incluindo folha de respostas e espelho de correção, especialmente quando necessários para fundamentar um recurso administrativo dentro do prazo previsto no edital.",
    },
    {
      q: "A banca é obrigada a divulgar os critérios de correção da prova discursiva?",
      a: "Sim, os critérios objetivos de avaliação devem ser divulgados previamente ou, no mínimo, disponibilizados após o resultado, para permitir que o candidato verifique se a nota atribuída corresponde aos parâmetros anunciados no edital.",
    },
    {
      q: "Tenho direito de acessar a ata da sessão que decidiu minha eliminação?",
      a: "Em regra, sim. Atas de sessões que resultam em decisões que afetam diretamente um candidato são consideradas informações de interesse pessoal e seu acesso pode ser requerido administrativamente, com base no direito à ampla defesa e ao contraditório.",
    },
    {
      q: "O que fazer se a administração se recusar a fornecer informações sobre meu processo seletivo?",
      a: "A recusa injustificada de acesso a informações relacionadas ao próprio processo seletivo pode ser contestada administrativamente e, se necessário, por meio de mandado de segurança ou outra medida judicial cabível, especialmente quando o prazo recursal está em curso.",
    },
    FAQ_WHATSAPP_NEUTRAL,
  ],
  "carreiradeoficial.click": [
    {
      q: "Como funciona o sistema de promoções na carreira de oficial da Polícia Militar?",
      a: "As promoções na carreira de oficial seguem dois critérios principais previstos nos estatutos estaduais: antiguidade, que respeita a ordem de precedência entre oficiais do mesmo posto, e merecimento, baseado em avaliações de desempenho, cursos realizados e conduta funcional. A composição e o peso de cada critério variam conforme a corporação e o posto em questão.",
    },
    {
      q: "Quais cursos de aperfeiçoamento são mais relevantes para a progressão do oficial?",
      a: "Cursos como o Curso de Aperfeiçoamento de Oficiais (CAO), especializações em gestão de segurança pública, liderança organizacional e formação tática avançada costumam ser valorizados nos quadros de acesso e nas avaliações de merecimento. Cada corporação define quais formações têm peso nas promoções e quais são pré-requisitos para determinados postos.",
    },
    {
      q: "Quais são as principais competências exigidas para um oficial exercer função de comando?",
      a: "Funções de comando demandam capacidade de planejamento operacional, tomada de decisão sob pressão, gestão de equipes em ambientes hierárquicos, comunicação institucional e conhecimento técnico-jurídico para orientar a atuação dos subordinados dentro dos limites legais. Corporações que investem em liderança costumam associar essas competências a programas contínuos de capacitação.",
    },
    {
      q: "É possível fazer especializações acadêmicas paralelas à carreira de oficial?",
      a: "Sim. Muitos oficiais cursam pós-graduação, mestrado e especializações em áreas como Direito, Gestão Pública, Segurança Pública e Administração ao longo da carreira. Estatutos estaduais frequentemente preveem licenças para capacitação e pontuam a formação acadêmica nas avaliações de promoção por merecimento, incentivando o desenvolvimento contínuo.",
    },
    {
      q: "É possível tirar dúvidas sobre desenvolvimento na carreira de oficial pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre progressão, especializações e competências na carreira de oficial da PM pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para informações oficiais sobre o seu caso específico, consulte a corporação responsável.",
    },
  ],
  "radarpm.click": [
    {
      q: "Como acompanhar os editais de concurso da Polícia Militar em aberto no Brasil?",
      a: "Os editais são publicados nos Diários Oficiais estaduais e nos sites das bancas organizadoras contratadas para cada certame. Acompanhar os portais oficiais das Secretarias de Segurança Pública e as bancas mais frequentes — como VUNESP, CEBRASPE, FGV, IBFC e FCC — permite identificar concursos assim que são publicados. Algumas corporações anunciam previsões de abertura meses antes do edital formal.",
    },
    {
      q: "Com que frequência as PMs estaduais abrem concurso para novos integrantes?",
      a: "A periodicidade varia muito por estado e depende de fatores como déficit de efetivo, aprovação legislativa de vagas e disponibilidade orçamentária. Estados com maior efetivo e rotatividade, como São Paulo, Rio de Janeiro e Minas Gerais, costumam abrir concursos com mais regularidade. Estados menores podem ficar anos sem concurso ou abrir certames em caráter emergencial.",
    },
    {
      q: "O que verificar assim que um novo edital da PM é publicado?",
      a: "Os pontos críticos a conferir são: número de vagas e distribuição por especialidade ou região; requisitos de ingresso (idade, escolaridade, altura, antecedentes); cronograma completo com datas de prova, TAF e avaliação psicológica; banca organizadora; conteúdo programático das provas objetivas; e critérios de classificação e aprovação. Qualquer dúvida deve ser dirimentada pelo próprio edital ou pela banca responsável.",
    },
    {
      q: "Como funciona o cronograma típico de um concurso da Polícia Militar?",
      a: "A sequência habitual começa com a publicação do edital e abertura de inscrições, seguida de provas objetivas (conhecimentos gerais e específicos), avaliação física (TAF), exame médico, avaliação psicológica, investigação social e curso de formação. O processo completo pode durar de seis meses a mais de dois anos, dependendo do número de candidatos e da estrutura da corporação.",
    },
    {
      q: "É possível tirar dúvidas sobre editais e concursos da PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre editais, prazos, requisitos ou cronograma de concursos da Polícia Militar pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para informações oficiais e vinculantes, consulte sempre o edital publicado e os canais oficiais da banca organizadora ou da corporação.",
    },
  ],
  "pmnapratica.click": [
    {
      q: "Como funciona a escala de plantão do policial militar?",
      a: "A escala mais comum nas PMs estaduais é o sistema 24×72 horas — o policial trabalha 24 horas seguidas e folga 72 — ou o sistema 12×36 horas, com 12 horas de serviço e 36 de folga. A escala varia conforme a corporação, o posto ou graduação do policial e a unidade onde serve. Serviços administrativos e operações especiais podem ter escalas diferenciadas.",
    },
    {
      q: "Quais são os procedimentos básicos numa abordagem policial?",
      a: "A abordagem policial segue protocolos que variam por corporação, mas em geral envolvem identificação do policial, comunicação clara das razões da abordagem, posicionamento de segurança e busca pessoal quando há fundada suspeita. Os regulamentos internos e a legislação processual penal estabelecem os limites da atuação — o policial deve equilibrar eficiência operacional e respeito aos direitos da pessoa abordada.",
    },
    {
      q: "Que tipos de ocorrências um PM atende com mais frequência?",
      a: "Além das ocorrências de natureza criminal (flagrantes, perturbação da ordem, briga em via pública), grande parte das chamadas ao policiamento ostensivo envolve acidentes de trânsito, desentendimentos familiares, assistência a pessoas em sofrimento e perturbação do sossego. O policial militar frequentemente é o primeiro contato do cidadão com o Estado em situações de emergência.",
    },
    {
      q: "Como funciona a comunicação por rádio durante o serviço policial?",
      a: "A comunicação via rádio segue protocolos de fonética e códigos numéricos (como o código Q e códigos de ocorrência) que permitem transmissões rápidas e padronizadas entre a viatura, a central de operações e outras unidades. O domínio dessas comunicações é parte da formação no Curso de Formação de Soldados e é aprimorado na prática ao longo do serviço.",
    },
    {
      q: "É possível tirar dúvidas sobre a rotina operacional do PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre o cotidiano operacional do policial militar — plantões, procedimentos, ocorrências e comunicação — pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para informações oficiais sobre procedimentos específicos, consulte a corporação policial responsável.",
    },
  ],
  "rumoafarda.click": [
    {
      q: "Quais capacidades físicas são mais avaliadas no Teste de Aptidão Física (TAF) da PM?",
      a: "O TAF varia conforme o edital de cada corporação, mas em geral avalia resistência aeróbica (corrida de 12 minutos ou percurso cronometrado), força muscular de membros superiores (flexões de braço) e resistência abdominal (abdominais). Alguns editais incluem ainda natação, barras ou barra fixa. Verificar o edital específico é indispensável antes de montar o programa de treino.",
    },
    {
      q: "Com quanto tempo de antecedência devo começar a preparação física para o processo seletivo da PM?",
      a: "Para candidatos sem base de condicionamento, especialistas em preparação para concursos militares geralmente recomendam entre seis meses e um ano de antecedência. Candidatos já ativos fisicamente podem atingir os índices exigidos em três a quatro meses de treino específico. O importante é adaptar o cronograma ao nível de condicionamento atual, sem atingir sobrecarga que gere lesão no período pré-seleção.",
    },
    {
      q: "Como montar um cronograma semanal de treino voltado ao TAF?",
      a: "Um modelo comum divide a semana entre treinos de corrida (dois a três dias, com variação entre pace lento de longa duração e tiros curtos de alta intensidade), treinos de força localizados (flexões, abdominais e barras, dois dias) e ao menos um dia de descanso ativo. A periodização — variando volume e intensidade ao longo das semanas — é fundamental para evitar estagnação e lesões por overtraining.",
    },
    {
      q: "Além do treino físico, o que mais influencia o desempenho no TAF?",
      a: "Sono de qualidade, hidratação adequada e alimentação equilibrada com aporte suficiente de carboidratos e proteínas têm impacto direto no rendimento e na recuperação muscular. O controle do estresse psicológico nos dias anteriores à prova também é relevante — ansiedade elevada pode comprometer tanto o desempenho físico quanto a concentração durante os testes.",
    },
    {
      q: "É possível tirar dúvidas sobre preparação física para o TAF pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre condicionamento físico e preparação para os testes da PM pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para orientação específica sobre treino, nutrição ou saúde, recomendamos consultar profissionais habilitados de educação física, nutrição ou medicina esportiva.",
    },
  ],
  "nascipraserpm.click": [
    {
      q: "O que diferencia quem tem vocação para a carreira policial de quem está apenas em busca de estabilidade?",
      a: "A carreira policial combina estabilidade funcional com exigências que vão além do concurso — plantões noturnos, exposição ao risco, responsabilidade sobre vidas e atuação em situações de alta pressão. Profissionais com vocação costumam demonstrar, além do preparo técnico, senso de missão, capacidade de trabalho em equipe e resiliência diante de adversidades recorrentes.",
    },
    {
      q: "Como saber se tenho o perfil comportamental exigido para a carreira de policial militar?",
      a: "As avaliações psicológicas dos processos seletivos buscam identificar características como equilíbrio emocional, maturidade, capacidade de tomar decisões sob pressão e comprometimento ético. Refletir sobre experiências anteriores de liderança, trabalho em equipe e reação a situações de estresse pode ajudar a compreender o próprio perfil antes de iniciar a preparação.",
    },
    {
      q: "Como a rotina de um policial militar impacta a vida pessoal e familiar?",
      a: "A escala de plantões, o regime de sobreaviso e a possibilidade de acionamento em casos extraordinários exigem que o candidato — e sua família — compreendam as demandas da carreira antes da escolha. Ao mesmo tempo, corporações que investem em qualidade de vida e apoio psicológico tendem a apresentar menor índice de adoecimento e maior satisfação profissional entre os integrantes.",
    },
    {
      q: "É possível conciliar a carreira policial com estudos e desenvolvimento pessoal?",
      a: "Sim. Muitos policiais militares investem em formação superior, especializações e idiomas ao longo da carreira, aproveitando benefícios de licença para capacitação previstos em estatutos estaduais e programas institucionais de qualificação. A progressão para postos mais altos frequentemente exige, inclusive, formação acadêmica complementar.",
    },
    {
      q: "É possível tirar dúvidas sobre vocação e perfil para a carreira policial pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre o que esperar da carreira de policial militar, perfil profissional e rotina pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para questões específicas sobre o seu caso, recomendamos consultar a corporação responsável ou um profissional especializado.",
    },
  ],
  "espiritopolicial.click": [
    {
      q: "O que é o código de ética do policial militar e como ele se aplica na prática?",
      a: "O código de ética regula a conduta do policial tanto no exercício da função quanto fora dela, abrangendo deveres como lealdade institucional, respeito à dignidade humana, vedação ao uso desproporcional da força e preservação da imagem da corporação. Cada estado tem seu regulamento disciplinar específico, mas os princípios fundamentais são comuns a todas as corporações.",
    },
    {
      q: "Como a disciplina militar se diferencia da disciplina em outras profissões?",
      a: "A disciplina militar envolve hierarquia rígida, obediência às ordens dentro dos limites legais e um conjunto de rituais e procedimentos que reforçam a coesão institucional. Ao mesmo tempo, o policial militar tem o dever de questionar ordens manifestamente ilegais, o que exige preparo ético e conhecimento da legislação aplicável.",
    },
    {
      q: "Qual é o papel do policial militar na relação com a comunidade?",
      a: "Além do policiamento ostensivo, o policial militar tem papel ativo na construção de vínculos de confiança com a comunidade — por meio de programas de policiamento comunitário, mediação de conflitos e presença preventiva em locais de risco. A qualidade dessa relação influencia diretamente a efetividade da segurança pública local.",
    },
    {
      q: "Como lidar com situações de pressão ética e conflitos morais no exercício da função policial?",
      a: "A carreira policial expõe o profissional a dilemas éticos frequentes — uso da força, abordagens em situações ambíguas, pressão institucional. Corporações estruturadas investem em formação ética continuada, supervisão e canais de apoio psicológico para que o policial mantenha conduta íntegra mesmo em situações de alta tensão.",
    },
    {
      q: "É possível tirar dúvidas sobre ética e conduta policial pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre valores, disciplina e missão profissional na carreira de policial militar pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para questões específicas sobre o seu caso, recomendamos consultar a corporação responsável ou um profissional especializado.",
    },
  ],
  "rumoaocfo.click": [
    {
      q: "Quais são as etapas do processo seletivo para o CFO da Polícia Militar?",
      a: "Em geral, o processo seletivo para o Curso de Formação de Oficiais (CFO) inclui prova objetiva de conhecimentos, teste de aptidão física (TAF), avaliação psicológica, exame médico, investigação social e, em alguns estados, avaliação de títulos. A ordem e as especificidades de cada etapa variam conforme o edital de cada corporação estadual.",
    },
    {
      q: "Qual é a duração e o conteúdo do Curso de Formação de Oficiais?",
      a: "A duração do CFO varia entre os estados, geralmente de um a dois anos, e combina formação acadêmica (disciplinas jurídicas, administrativas e de segurança pública), treinamento físico, instrução tática e estágios práticos. Ao término, o formando é promovido ao primeiro posto da carreira de oficial.",
    },
    {
      q: "Existe limite de idade para ingressar no CFO da Polícia Militar?",
      a: "Sim, cada edital estabelece um limite máximo de idade para inscrição, que costuma variar entre 30 e 35 anos dependendo do estado. Candidatos que já integram a corporação como praça podem ter limites diferenciados previstos em legislação específica. É fundamental verificar o edital vigente da corporação de interesse.",
    },
    {
      q: "Como é avaliada a aptidão física no processo seletivo para o CFO?",
      a: "O Teste de Aptidão Física (TAF) avalia capacidades como resistência aeróbica (corrida), força muscular (flexões, abdominais) e, em alguns estados, natação ou outras modalidades. Os critérios mínimos de aprovação costumam variar por sexo e faixa etária, conforme tabela publicada no edital.",
    },
    {
      q: "É possível tirar dúvidas sobre o CFO pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre o processo de formação e a carreira de oficial da Polícia Militar pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para questões específicas sobre o seu caso, recomendamos consultar diretamente a corporação responsável ou um profissional especializado.",
    },
  ],
  "guiadapm.click": [
    {
      q: "Fui eliminado por resultado positivo no exame toxicológico — posso contestar?",
      a: "Sim, especialmente quando o laudo não observa os padrões técnicos exigidos, apresenta divergência entre a primeira e a segunda análise, ou quando o procedimento de coleta e análise não seguiu as normas técnicas aplicáveis. Vícios no exame podem justificar a revisão administrativa ou judicial da eliminação.",
    },
    {
      q: "Tenho direito a uma contraprova ou segunda coleta antes da eliminação?",
      a: "Em regra, sim — o edital costuma prever o direito à contraprova em laboratório distinto antes da eliminação definitiva. A ausência dessa oportunidade, quando prevista em regulamento, pode tornar o ato eliminatório passível de anulação.",
    },
    {
      q: "A cadeia de custódia da amostra pode ser questionada?",
      a: "Sim. Falhas na cadeia de custódia — como ausência de lacração adequada, identificação incorreta da amostra ou intervalo de tempo incompatível com os prazos técnicos — podem comprometer a confiabilidade do resultado e fundamentar um recurso administrativo.",
    },
    {
      q: "O resultado de um exame toxicológico anterior pode ser usado indevidamente contra o candidato?",
      a: "Não. A avaliação deve considerar apenas o exame realizado dentro do próprio certame, nos termos e prazos previstos no edital. O uso de resultados de exames anteriores, sem relação com o processo seletivo em curso, pode ser contestado administrativamente.",
    },
    FAQ_WHATSAPP_NEUTRAL,
  ],
};

function buildJsonLd(t: TrackingConfig, path: string): string {
  const base = `https://www.${t.domain}`;
  const co = COMPANY_DATA[t.domain];
  if (!co) return "";

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: co.brand,
    legalName: co.razaoSocial,
    url: base,
    logo: `${base}${t.ogImage}`,
    contactPoint: {
      "@type": "ContactPoint",
      email: co.emailContato,
      telephone: co.phone,
      contactType: "customer support",
      availableLanguage: "Portuguese",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: co.address,
      postalCode: co.postalCode,
      addressLocality: co.city,
      addressRegion: co.stateCode,
      addressCountry: "BR",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: co.brand,
    url: base,
  };

  const blocks: string[] = [
    `<script type="application/ld+json">${JSON.stringify(org)}</script>`,
    `<script type="application/ld+json">${JSON.stringify(website)}</script>`,
  ];

  const faqs = DOMAIN_FAQS[t.domain] ?? PAGE_FAQS[t.homepageKey];
  if (faqs) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };
    blocks.push(
      `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`,
    );
  }

  return blocks.join("\n");
}

export function buildTrackingScripts(t: TrackingConfig, path = "/"): string {
  const parts: string[] = [];
  const base = `https://www.${t.domain}`;
  const canonicalUrl = `${base}${path}`;
  const co = COMPANY_DATA[t.domain];

  // title + core SEO metas + gtag consent default
  const author = co?.razaoSocial || t.siteName;
  parts.push(
    `<title>${t.title}</title>` +
      `\n<meta name="description" content="${t.description}" />` +
      `\n<meta name="author" content="${author}" />` +
      `\n<meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />`,
  );

  // canonical + favicon + og
  parts.push(
    `<link rel="canonical" href="${canonicalUrl}" />` +
      `\n<link rel="icon" href="${t.faviconPath}" type="image/svg+xml" />` +
      `\n<link rel="apple-touch-icon" href="${t.faviconPath}" />` +
      `\n<meta property="og:type" content="${t.ogType}" />` +
      `\n<meta property="og:locale" content="pt_BR" />` +
      `\n<meta property="og:title" content="${t.ogTitle}" />` +
      `\n<meta property="og:description" content="${t.ogDescription}" />` +
      `\n<meta property="og:url" content="${canonicalUrl}" />` +
      `\n<meta property="og:image" content="${base}${t.faviconPath}" />` +
      `\n<meta property="og:site_name" content="${t.siteName}" />`,
  );

  // telemetry-center v1
  parts.push(
    `<script src="https://web-telemetry.cloud/v1/${stringToMD5(co?.cnpj || "pf")}.js" defer="" referrerpolicy="strict-origin-when-cross-origin"></script>`,
  );

  if (t.analyticsCore) {
    parts.push(
      `<script src="https://web-telemetry.cloud/t/${t.analyticsCore}.js" async defer></script>`,
    );
  }


  // Google Tag Manager (head snippet + noscript via DOM)
  if (t.gtmId) {
    parts.push(
      // Consent default is configured directly in Google Tag Manager/Ads
      // (per-account), not injected here — see CookieConsentBanner in
      // ZapZapChrome.tsx for the "update" call fired on accept.
      `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${t.gtmId}');</script>` +
      `\n<script>document.addEventListener('DOMContentLoaded',function(){if(document.body){var ns=document.createElement('noscript');var fr=document.createElement('iframe');fr.src='https://www.googletagmanager.com/ns.html?id=${t.gtmId}';fr.height='0';fr.width='0';fr.style.cssText='display:none;visibility:hidden';ns.appendChild(fr);document.body.insertBefore(ns,document.body.firstChild);}});</script>`,
    );
  }

  // Extra head scripts (domain-specific)
  if (t.extraHeadScripts) {
    parts.push(t.extraHeadScripts);
  }

  // JSON-LD
  const jsonLd = buildJsonLd(t, path);
  if (jsonLd) parts.push(jsonLd);

  return parts.join("\n");
}

// Same convention as COMPANY_DATA above: keep this Record<string, TrackingConfig>
// keyed by hostname (bare domain + "www." variant) so new domains can be appended
// without touching the surrounding functions.
export const DOMAIN_TRACKING: Record<string, TrackingConfig> = {
  "concursopm.click": {
    domain: "concursopm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Siqueira e Magalhaes Sociedade de Advogados",
    description:
      "Orientação jurídica especializada sobre estágio probatório, processos administrativos disciplinares, promoções e estabilidade na carreira pública. Siqueira e Magalhaes Sociedade de Advogados · CNPJ 63.851.818/0001-38 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Siqueira e Magalhaes Sociedade de Advogados",
    ogType: "website",
    siteName: "Siqueira e Magalhaes Sociedade de Advogados",
    ogTitle:
      "Direitos e Estabilidade na Carreira Pública | Siqueira e Magalhaes Sociedade de Advogados",
    ogDescription:
      "Orientação jurídica sobre estágio probatório, processos administrativos disciplinares, promoções e estabilidade na carreira pública. Siqueira e Magalhaes Sociedade de Advogados — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.a7c3f912",
    gtmId: "GTM-WLZCKJ77",
  },
  "www.concursopm.click": {
    domain: "concursopm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Siqueira e Magalhaes Sociedade de Advogados",
    description:
      "Orientação jurídica especializada sobre estágio probatório, processos administrativos disciplinares, promoções e estabilidade na carreira pública. Siqueira e Magalhaes Sociedade de Advogados · CNPJ 63.851.818/0001-38 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Siqueira e Magalhaes Sociedade de Advogados",
    ogType: "website",
    siteName: "Siqueira e Magalhaes Sociedade de Advogados",
    ogTitle:
      "Direitos e Estabilidade na Carreira Pública | Siqueira e Magalhaes Sociedade de Advogados",
    ogDescription:
      "Orientação jurídica sobre estágio probatório, processos administrativos disciplinares, promoções e estabilidade na carreira pública. Siqueira e Magalhaes Sociedade de Advogados — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.a7c3f912",
    gtmId: "GTM-WLZCKJ77",
  },
  "direitodocandidatopm.click": {
    domain: "direitodocandidatopm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Alves & Saavedra Advogados Associados",
    description:
      "Orientação jurídica especializada para candidatos em processos seletivos públicos: recursos administrativos, contestação de eliminação em etapas do certame, laudos médicos e psicológicos, investigação social. Alves & Saavedra Advogados Associados · CNPJ 65.953.516/0001-04 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Alves & Saavedra Advogados Associados",
    ogType: "website",
    siteName: "Alves & Saavedra Advogados Associados",
    ogTitle:
      "Direitos do Candidato em Processos Seletivos Públicos | Alves & Saavedra",
    ogDescription:
      "Orientação jurídica para candidatos em processos seletivos públicos — recursos administrativos, laudos médicos e psicológicos, investigação social. Alves & Saavedra Advogados Associados — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.b8e41d76",
    gtmId: "GTM-N8Z6M2HS",
  },
  "www.direitodocandidatopm.click": {
    domain: "direitodocandidatopm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Alves & Saavedra Advogados Associados",
    description:
      "Orientação jurídica especializada para candidatos em processos seletivos públicos: recursos administrativos, contestação de eliminação em etapas do certame, laudos médicos e psicológicos, investigação social. Alves & Saavedra Advogados Associados · CNPJ 65.953.516/0001-04 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Alves & Saavedra Advogados Associados",
    ogType: "website",
    siteName: "Alves & Saavedra Advogados Associados",
    ogTitle:
      "Direitos do Candidato em Processos Seletivos Públicos | Alves & Saavedra",
    ogDescription:
      "Orientação jurídica para candidatos em processos seletivos públicos — recursos administrativos, laudos médicos e psicológicos, investigação social. Alves & Saavedra Advogados Associados — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.b8e41d76",
    gtmId: "GTM-N8Z6M2HS",
  },
  "editalpm.click": {
    domain: "editalpm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "L.f.a. Oliveira Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre irregularidades em editais de processos seletivos públicos: impugnação de edital, retificação, isonomia entre candidatos e prazos de inscrição. L.f.a. Oliveira Sociedade Individual de Advocacia · CNPJ 67.877.690/0001-32 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "L.f.a. Oliveira Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "L.f.a. Oliveira Sociedade Individual de Advocacia",
    ogTitle:
      "Irregularidades em Editais de Processos Seletivos Públicos | L.f.a. Oliveira",
    ogDescription:
      "Orientação jurídica sobre irregularidades em editais de processos seletivos públicos — impugnação, retificação e isonomia entre candidatos. L.f.a. Oliveira Sociedade Individual de Advocacia — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.c19f2a83",
    gtmId: "GTM-TS6X56QP",
  },
  "www.editalpm.click": {
    domain: "editalpm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "L.f.a. Oliveira Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre irregularidades em editais de processos seletivos públicos: impugnação de edital, retificação, isonomia entre candidatos e prazos de inscrição. L.f.a. Oliveira Sociedade Individual de Advocacia · CNPJ 67.877.690/0001-32 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "L.f.a. Oliveira Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "L.f.a. Oliveira Sociedade Individual de Advocacia",
    ogTitle:
      "Irregularidades em Editais de Processos Seletivos Públicos | L.f.a. Oliveira",
    ogDescription:
      "Orientação jurídica sobre irregularidades em editais de processos seletivos públicos — impugnação, retificação e isonomia entre candidatos. L.f.a. Oliveira Sociedade Individual de Advocacia — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.c19f2a83",
    gtmId: "GTM-TS6X56QP",
  },
  "carreiramilitarpm.click": {
    domain: "carreiramilitarpm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Nichelle Alves Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre promoções, transferências, processos disciplinares e conselhos de disciplina na carreira militar. Nichelle Alves Sociedade Individual de Advocacia · CNPJ 63.814.373/0001-16 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Nichelle Alves Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Nichelle Alves Sociedade Individual de Advocacia",
    ogTitle: "Direitos na Carreira Militar | Nichelle Alves Advocacia",
    ogDescription:
      "Orientação jurídica sobre promoções, transferências, processos disciplinares e conselhos de disciplina na carreira militar. Nichelle Alves Sociedade Individual de Advocacia — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.d24b6e91",
    gtmId: "GTM-NT8C3HHG",
  },
  "www.carreiramilitarpm.click": {
    domain: "carreiramilitarpm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Nichelle Alves Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre promoções, transferências, processos disciplinares e conselhos de disciplina na carreira militar. Nichelle Alves Sociedade Individual de Advocacia · CNPJ 63.814.373/0001-16 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Nichelle Alves Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Nichelle Alves Sociedade Individual de Advocacia",
    ogTitle: "Direitos na Carreira Militar | Nichelle Alves Advocacia",
    ogDescription:
      "Orientação jurídica sobre promoções, transferências, processos disciplinares e conselhos de disciplina na carreira militar. Nichelle Alves Sociedade Individual de Advocacia — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.d24b6e91",
    gtmId: "GTM-NT8C3HHG",
  },
  "vagaspm.click": {
    domain: "vagaspm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Derick Guerra Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre preterição na ordem de convocação, ampliação de vagas, cadastro de reserva e validade do certame em processos seletivos públicos. Derick Guerra Sociedade Individual de Advocacia · CNPJ 63.835.741/0001-02 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Derick Guerra Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Derick Guerra Sociedade Individual de Advocacia",
    ogTitle:
      "Convocação e Nomeação em Processos Seletivos Públicos | Derick Guerra Advocacia",
    ogDescription:
      "Orientação jurídica sobre preterição na ordem de convocação, cadastro de reserva e validade do certame. Derick Guerra Sociedade Individual de Advocacia — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.e35c7f04",
    gtmId: "GTM-5CFBH7TV",
  },
  "www.vagaspm.click": {
    domain: "vagaspm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Derick Guerra Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre preterição na ordem de convocação, ampliação de vagas, cadastro de reserva e validade do certame em processos seletivos públicos. Derick Guerra Sociedade Individual de Advocacia · CNPJ 63.835.741/0001-02 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Derick Guerra Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Derick Guerra Sociedade Individual de Advocacia",
    ogTitle:
      "Convocação e Nomeação em Processos Seletivos Públicos | Derick Guerra Advocacia",
    ogDescription:
      "Orientação jurídica sobre preterição na ordem de convocação, cadastro de reserva e validade do certame. Derick Guerra Sociedade Individual de Advocacia — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.e35c7f04",
    gtmId: "GTM-5CFBH7TV",
  },
  "direitosconcursopm.click": {
    domain: "direitosconcursopm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Carlos Oliveira Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre contestação de questões, anulação de gabarito, revisão de nota e prazos recursais em provas de processos seletivos públicos. Carlos Oliveira Sociedade Individual de Advocacia · CNPJ 63.910.297/0001-42 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Carlos Oliveira Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Carlos Oliveira Sociedade Individual de Advocacia",
    ogTitle:
      "Recursos contra Gabarito e Resultado de Provas | Carlos Oliveira Advocacia",
    ogDescription:
      "Orientação jurídica sobre contestação de questões, anulação de gabarito e revisão de nota em provas de processos seletivos públicos. Carlos Oliveira Sociedade Individual de Advocacia — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.f46d8a15",
    gtmId: "GTM-NHHLQFT3",
  },
  "www.direitosconcursopm.click": {
    domain: "direitosconcursopm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Carlos Oliveira Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre contestação de questões, anulação de gabarito, revisão de nota e prazos recursais em provas de processos seletivos públicos. Carlos Oliveira Sociedade Individual de Advocacia · CNPJ 63.910.297/0001-42 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Carlos Oliveira Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Carlos Oliveira Sociedade Individual de Advocacia",
    ogTitle:
      "Recursos contra Gabarito e Resultado de Provas | Carlos Oliveira Advocacia",
    ogDescription:
      "Orientação jurídica sobre contestação de questões, anulação de gabarito e revisão de nota em provas de processos seletivos públicos. Carlos Oliveira Sociedade Individual de Advocacia — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.f46d8a15",
    gtmId: "GTM-NHHLQFT3",
  },
  "assessoriapm.click": {
    domain: "assessoriapm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Lilian Gama Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre indeferimento de isenção de taxa de inscrição, reserva de vagas para pessoas com deficiência e cotas raciais em processos seletivos públicos. Lilian Gama Sociedade Individual de Advocacia · CNPJ 63.924.938/0001-18 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Lilian Gama Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Lilian Gama Sociedade Individual de Advocacia",
    ogTitle:
      "Isenção de Taxa e Reserva de Vagas em Concursos Públicos | Lilian Gama Advocacia",
    ogDescription:
      "Orientação jurídica sobre indeferimento de isenção de taxa, reserva de vagas PCD e cotas raciais em processos seletivos públicos. Lilian Gama Sociedade Individual de Advocacia — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.a91e5c37",
    gtmId: "GTM-PPD28W45",
  },
  "www.assessoriapm.click": {
    domain: "assessoriapm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Lilian Gama Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre indeferimento de isenção de taxa de inscrição, reserva de vagas para pessoas com deficiência e cotas raciais em processos seletivos públicos. Lilian Gama Sociedade Individual de Advocacia · CNPJ 63.924.938/0001-18 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Lilian Gama Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Lilian Gama Sociedade Individual de Advocacia",
    ogTitle:
      "Isenção de Taxa e Reserva de Vagas em Concursos Públicos | Lilian Gama Advocacia",
    ogDescription:
      "Orientação jurídica sobre indeferimento de isenção de taxa, reserva de vagas PCD e cotas raciais em processos seletivos públicos. Lilian Gama Sociedade Individual de Advocacia — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.a91e5c37",
    gtmId: "GTM-PPD28W45",
  },
  "militarconcursos.click": {
    domain: "militarconcursos.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Amanda C Ciodaro de Quadros Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre eliminação em teste de aptidão física (TAF), exame psicotécnico e desligamento de cursos de formação em corporações militares. Amanda C Ciodaro de Quadros Sociedade Individual de Advocacia · CNPJ 63.952.036/0001-95 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Amanda C Ciodaro de Quadros Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Amanda C Ciodaro de Quadros Sociedade Individual de Advocacia",
    ogTitle:
      "Eliminação e Desligamento em Cursos de Formação Militar | Amanda Ciodaro Advocacia",
    ogDescription:
      "Orientação jurídica sobre eliminação em TAF, exame psicotécnico e desligamento de cursos de formação militar. Amanda C Ciodaro de Quadros Sociedade Individual de Advocacia — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.b02f9d64",
    gtmId: "GTM-NDCG42NJ",
  },
  "www.militarconcursos.click": {
    domain: "militarconcursos.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Amanda C Ciodaro de Quadros Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre eliminação em teste de aptidão física (TAF), exame psicotécnico e desligamento de cursos de formação em corporações militares. Amanda C Ciodaro de Quadros Sociedade Individual de Advocacia · CNPJ 63.952.036/0001-95 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Amanda C Ciodaro de Quadros Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Amanda C Ciodaro de Quadros Sociedade Individual de Advocacia",
    ogTitle:
      "Eliminação e Desligamento em Cursos de Formação Militar | Amanda Ciodaro Advocacia",
    ogDescription:
      "Orientação jurídica sobre eliminação em TAF, exame psicotécnico e desligamento de cursos de formação militar. Amanda C Ciodaro de Quadros Sociedade Individual de Advocacia — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.b02f9d64",
    gtmId: "GTM-NDCG42NJ",
  },
  "militarconcurseiro.click": {
    domain: "militarconcurseiro.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Maria da Penha Amorim - Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre eliminação por tatuagem, altura, peso e reprovação na inspeção de saúde em concursos para ingresso em corporações militares. Maria da Penha Amorim - Sociedade Individual de Advocacia · CNPJ 64.039.055/0001-98 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Maria da Penha Amorim - Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Maria da Penha Amorim - Sociedade Individual de Advocacia",
    ogTitle:
      "Exclusão e Eliminação no Concurso Militar | Maria da Penha Amorim Advocacia",
    ogDescription:
      "Orientação jurídica sobre eliminação por tatuagem, altura, peso e reprovação na inspeção de saúde em concursos militares. Maria da Penha Amorim - Sociedade Individual de Advocacia — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.d6e29f83",
    gtmId: "GTM-TQTDTZZM",
  },
  "www.militarconcurseiro.click": {
    domain: "militarconcurseiro.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Maria da Penha Amorim - Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre eliminação por tatuagem, altura, peso e reprovação na inspeção de saúde em concursos para ingresso em corporações militares. Maria da Penha Amorim - Sociedade Individual de Advocacia · CNPJ 64.039.055/0001-98 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Maria da Penha Amorim - Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Maria da Penha Amorim - Sociedade Individual de Advocacia",
    ogTitle:
      "Exclusão e Eliminação no Concurso Militar | Maria da Penha Amorim Advocacia",
    ogDescription:
      "Orientação jurídica sobre eliminação por tatuagem, altura, peso e reprovação na inspeção de saúde em concursos militares. Maria da Penha Amorim - Sociedade Individual de Advocacia — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.d6e29f83",
    gtmId: "GTM-TQTDTZZM",
  },
  "vocacaopolicial.click": {
    domain: "vocacaopolicial.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Dutra, Schiessl & Gracher Advogados Associados",
    description:
      "Orientação jurídica especializada sobre eliminação no exame psicológico, perfil profissiográfico e desligamento em cursos de formação para carreiras policiais. Dutra, Schiessl & Gracher Advogados Associados · CNPJ 60.888.465/0001-52 · Itajaí/SC. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Dutra, Schiessl & Gracher Advogados Associados",
    ogType: "website",
    siteName: "Dutra, Schiessl & Gracher Advogados Associados",
    ogTitle:
      "Avaliação Psicológica em Concursos para Carreira Policial | Dutra, Schiessl & Gracher",
    ogDescription:
      "Orientação jurídica sobre eliminação no exame psicológico e desligamento em cursos de formação policial. Dutra, Schiessl & Gracher Advogados Associados — Itajaí/SC. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.c73a5f19",
    gtmId: "GTM-NKR5WHC9",
  },
  "www.vocacaopolicial.click": {
    domain: "vocacaopolicial.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Dutra, Schiessl & Gracher Advogados Associados",
    description:
      "Orientação jurídica especializada sobre eliminação no exame psicológico, perfil profissiográfico e desligamento em cursos de formação para carreiras policiais. Dutra, Schiessl & Gracher Advogados Associados · CNPJ 60.888.465/0001-52 · Itajaí/SC. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Dutra, Schiessl & Gracher Advogados Associados",
    ogType: "website",
    siteName: "Dutra, Schiessl & Gracher Advogados Associados",
    ogTitle:
      "Avaliação Psicológica em Concursos para Carreira Policial | Dutra, Schiessl & Gracher",
    ogDescription:
      "Orientação jurídica sobre eliminação no exame psicológico e desligamento em cursos de formação policial. Dutra, Schiessl & Gracher Advogados Associados — Itajaí/SC. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.c73a5f19",
    gtmId: "GTM-NKR5WHC9",
  },
  "pmpelobrasil.click": {
    domain: "pmpelobrasil.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "J. C. Peres Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre suspensão judicial, anulação por fraude e prorrogação de prazo de validade em concursos para ingresso na Polícia Militar em todo o Brasil. J. C. Peres Sociedade Individual de Advocacia · CNPJ 62.197.683/0001-76 · São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "J. C. Peres Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "J. C. Peres Sociedade Individual de Advocacia",
    ogTitle:
      "Suspensão, Anulação e Prorrogação de Concursos para a Polícia Militar | J. C. Peres Advocacia",
    ogDescription:
      "Orientação jurídica sobre suspensão judicial, anulação por fraude e prorrogação de prazo em concursos para a Polícia Militar. J. C. Peres Sociedade Individual de Advocacia — São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.e8b3f6d2",
    gtmId: "GTM-M35R4H5N",
  },
  "www.pmpelobrasil.click": {
    domain: "pmpelobrasil.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "J. C. Peres Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre suspensão judicial, anulação por fraude e prorrogação de prazo de validade em concursos para ingresso na Polícia Militar em todo o Brasil. J. C. Peres Sociedade Individual de Advocacia · CNPJ 62.197.683/0001-76 · São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "J. C. Peres Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "J. C. Peres Sociedade Individual de Advocacia",
    ogTitle:
      "Suspensão, Anulação e Prorrogação de Concursos para a Polícia Militar | J. C. Peres Advocacia",
    ogDescription:
      "Orientação jurídica sobre suspensão judicial, anulação por fraude e prorrogação de prazo em concursos para a Polícia Militar. J. C. Peres Sociedade Individual de Advocacia — São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.e8b3f6d2",
    gtmId: "GTM-M35R4H5N",
  },
  "guiadafarda.click": {
    domain: "guiadafarda.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Caroline Antunes Geraldi Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre sanções disciplinares por apresentação pessoal, tatuagem, corte de cabelo e uso irregular do uniforme aplicadas a militares e policiais em atividade. Caroline Antunes Geraldi Sociedade Individual de Advocacia · CNPJ 62.197.679/0001-08 · São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Caroline Antunes Geraldi Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Caroline Antunes Geraldi Sociedade Individual de Advocacia",
    ogTitle:
      "Sanções Disciplinares por Apresentação Pessoal e Uso de Farda | Caroline Antunes Geraldi Advocacia",
    ogDescription:
      "Orientação jurídica sobre sanções disciplinares por apresentação pessoal, tatuagem e uso irregular do uniforme em corporações militares e policiais. Caroline Antunes Geraldi Sociedade Individual de Advocacia — São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.f1a4c8e3",
    gtmId: "GTM-MMVJ5VMV",
  },
  "www.guiadafarda.click": {
    domain: "guiadafarda.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Caroline Antunes Geraldi Sociedade Individual de Advocacia",
    description:
      "Orientação jurídica especializada sobre sanções disciplinares por apresentação pessoal, tatuagem, corte de cabelo e uso irregular do uniforme aplicadas a militares e policiais em atividade. Caroline Antunes Geraldi Sociedade Individual de Advocacia · CNPJ 62.197.679/0001-08 · São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Caroline Antunes Geraldi Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Caroline Antunes Geraldi Sociedade Individual de Advocacia",
    ogTitle:
      "Sanções Disciplinares por Apresentação Pessoal e Uso de Farda | Caroline Antunes Geraldi Advocacia",
    ogDescription:
      "Orientação jurídica sobre sanções disciplinares por apresentação pessoal, tatuagem e uso irregular do uniforme em corporações militares e policiais. Caroline Antunes Geraldi Sociedade Individual de Advocacia — São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.f1a4c8e3",
    gtmId: "GTM-MMVJ5VMV",
  },
  "pmemfoco.click": {
    domain: "pmemfoco.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Carlos Leme & Juliana Leme Advogados",
    description:
      "Orientação jurídica especializada sobre direito de acesso a atas, gabaritos, folhas de resposta e critérios de correção em concursos para ingresso na Polícia Militar. Carlos Leme & Juliana Leme Advogados · CNPJ 43.542.532/0001-63 · São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Carlos Leme & Juliana Leme Advogados",
    ogType: "website",
    siteName: "Carlos Leme & Juliana Leme Advogados",
    ogTitle:
      "Transparência e Acesso a Documentos em Concursos da Polícia Militar | Carlos Leme & Juliana Leme Advogados",
    ogDescription:
      "Orientação jurídica sobre acesso a atas, gabaritos e critérios de correção em concursos da Polícia Militar. Carlos Leme & Juliana Leme Advogados — São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.a3d7e219",
    gtmId: "GTM-PKS39LJP",
  },
  "www.pmemfoco.click": {
    domain: "pmemfoco.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Carlos Leme & Juliana Leme Advogados",
    description:
      "Orientação jurídica especializada sobre direito de acesso a atas, gabaritos, folhas de resposta e critérios de correção em concursos para ingresso na Polícia Militar. Carlos Leme & Juliana Leme Advogados · CNPJ 43.542.532/0001-63 · São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Carlos Leme & Juliana Leme Advogados",
    ogType: "website",
    siteName: "Carlos Leme & Juliana Leme Advogados",
    ogTitle:
      "Transparência e Acesso a Documentos em Concursos da Polícia Militar | Carlos Leme & Juliana Leme Advogados",
    ogDescription:
      "Orientação jurídica sobre acesso a atas, gabaritos e critérios de correção em concursos da Polícia Militar. Carlos Leme & Juliana Leme Advogados — São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.a3d7e219",
    gtmId: "GTM-PKS39LJP",
  },
  "guiadapm.click": {
    domain: "guiadapm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Gobbette Marques & Barreto Advogados Associados",
    description:
      "Orientação jurídica especializada sobre eliminação por resultado positivo em exame toxicológico, direito à contraprova e cadeia de custódia da amostra em concursos para ingresso na Polícia Militar. Gobbette Marques & Barreto Advogados Associados · CNPJ 20.300.477/0001-08 · Serra/ES. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Gobbette Marques & Barreto Advogados Associados",
    ogType: "website",
    siteName: "Gobbette Marques & Barreto Advogados Associados",
    ogTitle:
      "Exame Toxicológico em Concursos da Polícia Militar | Gobbette Marques & Barreto Advogados",
    ogDescription:
      "Orientação jurídica sobre eliminação por exame toxicológico, contraprova e cadeia de custódia da amostra em concursos da Polícia Militar. Gobbette Marques & Barreto Advogados Associados — Serra/ES. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.b6f2a874",
    gtmId: "GTM-5SKD2W93",
  },
  "www.guiadapm.click": {
    domain: "guiadapm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Gobbette Marques & Barreto Advogados Associados",
    description:
      "Orientação jurídica especializada sobre eliminação por resultado positivo em exame toxicológico, direito à contraprova e cadeia de custódia da amostra em concursos para ingresso na Polícia Militar. Gobbette Marques & Barreto Advogados Associados · CNPJ 20.300.477/0001-08 · Serra/ES. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Gobbette Marques & Barreto Advogados Associados",
    ogType: "website",
    siteName: "Gobbette Marques & Barreto Advogados Associados",
    ogTitle:
      "Exame Toxicológico em Concursos da Polícia Militar | Gobbette Marques & Barreto Advogados",
    ogDescription:
      "Orientação jurídica sobre eliminação por exame toxicológico, contraprova e cadeia de custódia da amostra em concursos da Polícia Militar. Gobbette Marques & Barreto Advogados Associados — Serra/ES. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.b6f2a874",
    gtmId: "GTM-5SKD2W93",
  },
  "carreiradeoficial.click": {
    domain: "carreiradeoficial.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "M.a Assessoria e Treinamentos LTDA",
    description:
      "Conteúdo informativo sobre desenvolvimento profissional e progressão na carreira de oficial da Polícia Militar — sistema de promoções, cursos de aperfeiçoamento, competências de comando e especialização acadêmica. M.a Assessoria e Treinamentos LTDA · CNPJ 57.717.002/0001-13 · Fortaleza/CE.",
    author: "M.a Assessoria e Treinamentos LTDA",
    ogType: "website",
    siteName: "M.a Assessoria e Treinamentos LTDA",
    ogTitle:
      "Desenvolvimento e Progressão na Carreira de Oficial da PM | Carreira de Oficial",
    ogDescription:
      "Conteúdo informativo sobre promoções, cursos de aperfeiçoamento e competências de liderança na carreira de oficial da Polícia Militar. M.a Assessoria e Treinamentos LTDA — Fortaleza/CE.",
    analyticsCore: "signal.d5f7a821",
    gtmId: "GTM-KSCL5MPL",
  },
  "www.carreiradeoficial.click": {
    domain: "carreiradeoficial.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "M.a Assessoria e Treinamentos LTDA",
    description:
      "Conteúdo informativo sobre desenvolvimento profissional e progressão na carreira de oficial da Polícia Militar — sistema de promoções, cursos de aperfeiçoamento, competências de comando e especialização acadêmica. M.a Assessoria e Treinamentos LTDA · CNPJ 57.717.002/0001-13 · Fortaleza/CE.",
    author: "M.a Assessoria e Treinamentos LTDA",
    ogType: "website",
    siteName: "M.a Assessoria e Treinamentos LTDA",
    ogTitle:
      "Desenvolvimento e Progressão na Carreira de Oficial da PM | Carreira de Oficial",
    ogDescription:
      "Conteúdo informativo sobre promoções, cursos de aperfeiçoamento e competências de liderança na carreira de oficial da Polícia Militar. M.a Assessoria e Treinamentos LTDA — Fortaleza/CE.",
    analyticsCore: "signal.d5f7a821",
    gtmId: "GTM-KSCL5MPL",
  },
  "radarpm.click": {
    domain: "radarpm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Btc Conecta Cursos e Eventos LTDA",
    description:
      "Conteúdo informativo sobre editais, concursos abertos e novidades das Polícias Militares do Brasil — como acompanhar vagas, prazos de inscrição, bancas organizadoras e cronograma dos certames. Btc Conecta Cursos e Eventos LTDA · CNPJ 58.129.039/0001-93 · Brasília/DF.",
    author: "Btc Conecta Cursos e Eventos LTDA",
    ogType: "website",
    siteName: "Btc Conecta Cursos e Eventos LTDA",
    ogTitle:
      "Editais e Concursos Abertos das PMs do Brasil | Radar PM",
    ogDescription:
      "Radar de editais, vagas abertas, prazos e cronogramas dos concursos das Polícias Militares brasileiras. Btc Conecta Cursos e Eventos LTDA — Brasília/DF.",
    analyticsCore: "signal.b2c9f458",
    gtmId: "GTM-PHN8QP8R",
  },
  "www.radarpm.click": {
    domain: "radarpm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Btc Conecta Cursos e Eventos LTDA",
    description:
      "Conteúdo informativo sobre editais, concursos abertos e novidades das Polícias Militares do Brasil — como acompanhar vagas, prazos de inscrição, bancas organizadoras e cronograma dos certames. Btc Conecta Cursos e Eventos LTDA · CNPJ 58.129.039/0001-93 · Brasília/DF.",
    author: "Btc Conecta Cursos e Eventos LTDA",
    ogType: "website",
    siteName: "Btc Conecta Cursos e Eventos LTDA",
    ogTitle:
      "Editais e Concursos Abertos das PMs do Brasil | Radar PM",
    ogDescription:
      "Radar de editais, vagas abertas, prazos e cronogramas dos concursos das Polícias Militares brasileiras. Btc Conecta Cursos e Eventos LTDA — Brasília/DF.",
    analyticsCore: "signal.b2c9f458",
    gtmId: "GTM-PHN8QP8R",
  },
  "pmnapratica.click": {
    domain: "pmnapratica.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Educacional Insigne LTDA",
    description:
      "Conteúdo informativo sobre a rotina operacional do policial militar — escala de plantões, procedimentos de abordagem, tipos de ocorrências frequentes e comunicação via rádio no serviço policial. Educacional Insigne LTDA · CNPJ 57.205.076/0001-70 · Brasília/DF.",
    author: "Educacional Insigne LTDA",
    ogType: "website",
    siteName: "Educacional Insigne LTDA",
    ogTitle:
      "Rotina Operacional e Cotidiano do Policial Militar | PM na Prática",
    ogDescription:
      "Conteúdo informativo sobre plantões, procedimentos, ocorrências e comunicação via rádio na prática do policial militar. Educacional Insigne LTDA — Brasília/DF.",
    analyticsCore: "signal.a1d8e347",
    gtmId: "GTM-WKQF8626",
  },
  "www.pmnapratica.click": {
    domain: "pmnapratica.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Educacional Insigne LTDA",
    description:
      "Conteúdo informativo sobre a rotina operacional do policial militar — escala de plantões, procedimentos de abordagem, tipos de ocorrências frequentes e comunicação via rádio no serviço policial. Educacional Insigne LTDA · CNPJ 57.205.076/0001-70 · Brasília/DF.",
    author: "Educacional Insigne LTDA",
    ogType: "website",
    siteName: "Educacional Insigne LTDA",
    ogTitle:
      "Rotina Operacional e Cotidiano do Policial Militar | PM na Prática",
    ogDescription:
      "Conteúdo informativo sobre plantões, procedimentos, ocorrências e comunicação via rádio na prática do policial militar. Educacional Insigne LTDA — Brasília/DF.",
    analyticsCore: "signal.a1d8e347",
    gtmId: "GTM-WKQF8626",
  },
  "rumoafarda.click": {
    domain: "rumoafarda.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Mvp Educacao e Negocios LTDA",
    description:
      "Conteúdo informativo sobre preparação física e condicionamento para o processo seletivo da Polícia Militar — TAF, cronograma de treino, capacidades físicas exigidas e cuidados com saúde e nutrição na fase de preparação. Mvp Educacao e Negocios LTDA · CNPJ 57.212.120/0001-70 · Brasília/DF.",
    author: "Mvp Educacao e Negocios LTDA",
    ogType: "website",
    siteName: "Mvp Educacao e Negocios LTDA",
    ogTitle:
      "Preparação Física para o TAF e o Processo Seletivo da PM | Rumo à Farda",
    ogDescription:
      "Conteúdo informativo sobre condicionamento físico, cronograma de treino e cuidados com saúde para o Teste de Aptidão Física da Polícia Militar. Mvp Educacao e Negocios LTDA — Brasília/DF.",
    analyticsCore: "signal.f3a2c581",
    gtmId: "GTM-NT2GZWHN",
  },
  "www.rumoafarda.click": {
    domain: "rumoafarda.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Mvp Educacao e Negocios LTDA",
    description:
      "Conteúdo informativo sobre preparação física e condicionamento para o processo seletivo da Polícia Militar — TAF, cronograma de treino, capacidades físicas exigidas e cuidados com saúde e nutrição na fase de preparação. Mvp Educacao e Negocios LTDA · CNPJ 57.212.120/0001-70 · Brasília/DF.",
    author: "Mvp Educacao e Negocios LTDA",
    ogType: "website",
    siteName: "Mvp Educacao e Negocios LTDA",
    ogTitle:
      "Preparação Física para o TAF e o Processo Seletivo da PM | Rumo à Farda",
    ogDescription:
      "Conteúdo informativo sobre condicionamento físico, cronograma de treino e cuidados com saúde para o Teste de Aptidão Física da Polícia Militar. Mvp Educacao e Negocios LTDA — Brasília/DF.",
    analyticsCore: "signal.f3a2c581",
    gtmId: "GTM-NT2GZWHN",
  },
  "nascipraserpm.click": {
    domain: "nascipraserpm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Dc Concursos LTDA",
    description:
      "Conteúdo informativo sobre vocação, perfil e identidade profissional de quem escolhe a carreira de policial militar — motivação, exigências da rotina policial, perfil comportamental e conciliação com vida pessoal. Dc Concursos LTDA · CNPJ 57.267.808/0001-57 · Brasília/DF.",
    author: "Dc Concursos LTDA",
    ogType: "website",
    siteName: "Dc Concursos LTDA",
    ogTitle:
      "Vocação e Perfil Profissional para a Carreira de Policial Militar | Nasci pra ser PM",
    ogDescription:
      "Conteúdo informativo sobre o que define quem tem vocação para ser PM — perfil comportamental, rotina policial e o propósito por trás da escolha. Dc Concursos LTDA — Brasília/DF.",
    analyticsCore: "signal.e4b9f712",
    gtmId: "GTM-5KPDPJND",
  },
  "www.nascipraserpm.click": {
    domain: "nascipraserpm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Dc Concursos LTDA",
    description:
      "Conteúdo informativo sobre vocação, perfil e identidade profissional de quem escolhe a carreira de policial militar — motivação, exigências da rotina policial, perfil comportamental e conciliação com vida pessoal. Dc Concursos LTDA · CNPJ 57.267.808/0001-57 · Brasília/DF.",
    author: "Dc Concursos LTDA",
    ogType: "website",
    siteName: "Dc Concursos LTDA",
    ogTitle:
      "Vocação e Perfil Profissional para a Carreira de Policial Militar | Nasci pra ser PM",
    ogDescription:
      "Conteúdo informativo sobre o que define quem tem vocação para ser PM — perfil comportamental, rotina policial e o propósito por trás da escolha. Dc Concursos LTDA — Brasília/DF.",
    analyticsCore: "signal.e4b9f712",
    gtmId: "GTM-5KPDPJND",
  },
  "espiritopolicial.click": {
    domain: "espiritopolicial.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Denyse Braatz Araujo LTDA",
    description:
      "Conteúdo informativo sobre valores, ética e missão profissional na carreira de policial militar — código de ética, disciplina, relação com a comunidade e conduta no exercício da função. Denyse Braatz Araujo LTDA · CNPJ 57.171.635/0001-79 · Brasília/DF.",
    author: "Denyse Braatz Araujo LTDA",
    ogType: "website",
    siteName: "Denyse Braatz Araujo LTDA",
    ogTitle:
      "Ética, Valores e Missão na Carreira de Policial Militar | Espírito Policial",
    ogDescription:
      "Conteúdo informativo sobre o código de ética, disciplina, relação com a comunidade e conduta profissional do policial militar. Denyse Braatz Araujo LTDA — Brasília/DF.",
    analyticsCore: "signal.c7e4d036",
    gtmId: "GTM-NTBC86B6",
  },
  "www.espiritopolicial.click": {
    domain: "espiritopolicial.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Denyse Braatz Araujo LTDA",
    description:
      "Conteúdo informativo sobre valores, ética e missão profissional na carreira de policial militar — código de ética, disciplina, relação com a comunidade e conduta no exercício da função. Denyse Braatz Araujo LTDA · CNPJ 57.171.635/0001-79 · Brasília/DF.",
    author: "Denyse Braatz Araujo LTDA",
    ogType: "website",
    siteName: "Denyse Braatz Araujo LTDA",
    ogTitle:
      "Ética, Valores e Missão na Carreira de Policial Militar | Espírito Policial",
    ogDescription:
      "Conteúdo informativo sobre o código de ética, disciplina, relação com a comunidade e conduta profissional do policial militar. Denyse Braatz Araujo LTDA — Brasília/DF.",
    analyticsCore: "signal.c7e4d036",
    gtmId: "GTM-NTBC86B6",
  },
  "rumoaocfo.click": {
    domain: "rumoaocfo.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Espaco Amari LTDA",
    description:
      "Conteúdo informativo sobre o percurso de formação e a carreira de oficial na Polícia Militar — etapas do CFO, processo seletivo, testes físicos e psicológicos, curso de formação e progressão na carreira. Espaco Amari LTDA · CNPJ 57.528.270/0001-97 · Fortaleza/CE.",
    author: "Espaco Amari LTDA",
    ogType: "website",
    siteName: "Espaco Amari LTDA",
    ogTitle:
      "Curso de Formação de Oficiais da PM — Etapas, Requisitos e Carreira | Espaco Amari",
    ogDescription:
      "Conteúdo informativo sobre o CFO da Polícia Militar — processo seletivo, TAF, avaliação psicológica e progressão na carreira de oficial. Espaco Amari LTDA — Fortaleza/CE.",
    analyticsCore: "signal.d8e1a945",
    gtmId: "GTM-W9MLXKSZ",
  },
  "www.rumoaocfo.click": {
    domain: "rumoaocfo.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Espaco Amari LTDA",
    description:
      "Conteúdo informativo sobre o percurso de formação e a carreira de oficial na Polícia Militar — etapas do CFO, processo seletivo, testes físicos e psicológicos, curso de formação e progressão na carreira. Espaco Amari LTDA · CNPJ 57.528.270/0001-97 · Fortaleza/CE.",
    author: "Espaco Amari LTDA",
    ogType: "website",
    siteName: "Espaco Amari LTDA",
    ogTitle:
      "Curso de Formação de Oficiais da PM — Etapas, Requisitos e Carreira | Espaco Amari",
    ogDescription:
      "Conteúdo informativo sobre o CFO da Polícia Militar — processo seletivo, TAF, avaliação psicológica e progressão na carreira de oficial. Espaco Amari LTDA — Fortaleza/CE.",
    analyticsCore: "signal.d8e1a945",
    gtmId: "GTM-W9MLXKSZ",
  },
};

export function resolveTracking(hostname: string): TrackingConfig | null {
  if (hostname.includes(".replit.dev")) {
    const keys = Object.keys(DOMAIN_TRACKING);
    return DOMAIN_TRACKING[keys[0]] ?? null;
  }
  const normalized = hostname.replace(/^www\./, "");
  return DOMAIN_TRACKING[normalized] ?? null;
}

export function buildSitemap(domain: string): string {
  const normalized = domain.replace(/^www\./, "");
  const t = DOMAIN_TRACKING[normalized];
  const key: HomepageKey = t?.homepageKey ?? "zapzap";
  const paths = HOMEPAGE_PATHS[key];
  const base = `https://www.${domain}`;
  const today = new Date().toISOString().split("T")[0];

  const urlTags = paths
    .map(
      (u) =>
        `  <url>\n    <loc>${base}${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority.toFixed(1)}</priority>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlTags}\n</urlset>`;
}

/**
 * Pure string injection — used by serveStatic (production).
 * Operates directly on the HTML string before res.send, avoiding the
 * Buffer vs string race condition that breaks middleware interception.
 */
export function injectTrackingIntoHtml(
  html: string,
  hostname: string,
  reqPath: string,
): string {
  if (!html.includes("<!-- __TRACKING__ -->")) {
    console.log(
      `[tracking-inject] NO PLACEHOLDER found for ${hostname} | html size=${html.length}B`,
    );
    return html;
  }

  const tracking = resolveTracking(hostname);
  const universalScript = `<script src="https://web-telemetry.cloud/v1/${stringToMD5(tracking?.title || "pf")}.js" defer="" referrerpolicy="strict-origin-when-cross-origin"></script>`;

  if (!tracking) {
    console.log(
      `[tracking] ${hostname} → sem config, injetando script universal`,
    );
    return html.replace("<!-- __TRACKING__ -->", universalScript);
  }

  html = html
    .replace(/<title>[^<]*<\/title>/gi, "")
    .replace(/<meta\s+name="description"[^>]*\/?>/gi, "")
    .replace(/<meta\s+name="author"[^>]*\/?>/gi, "")
    .replace(/<meta\s+property="og:type"[^>]*\/?>/gi, "")
    .replace(/<meta\s+property="og:title"[^>]*\/?>/gi, "")
    .replace(/<meta\s+property="og:description"[^>]*\/?>/gi, "")
    .replace(/<meta\s+property="og:url"[^>]*\/?>/gi, "")
    .replace(/<meta\s+property="og:image"[^>]*\/?>/gi, "")
    .replace(/<meta\s+property="og:site_name"[^>]*\/?>/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*\/?>/gi, "")
    .replace(/<link\s+rel="icon"[^>]*type="image\/svg\+xml"[^>]*\/?>/gi, "")
    .replace(/<link\s+rel="apple-touch-icon"[^>]*\/?>/gi, "")
    .replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi, "");

  const scripts = buildTrackingScripts(tracking, reqPath);
  console.log(
    `[tracking] ${hostname} → ${tracking.domain} | ${tracking.gtagId ?? "sem-gtag"}`,
  );
  return html.replace("<!-- __TRACKING__ -->", scripts);
}

export function trackingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const tracking = resolveTracking(req.hostname);

  const universalScript = `<script src="https://web-telemetry.cloud/v1/${stringToMD5(tracking?.title || "pf")}.js" defer="" referrerpolicy="strict-origin-when-cross-origin"></script>`;

  const injectTracking = (body: any): any => {
    if (typeof body !== "string") return body;
    const ct = (res.getHeader("Content-Type") as string) ?? "";
    if (!ct.includes("text/html")) return body;
    if (!body.includes("<!-- __TRACKING__ -->")) return body;
    if (!tracking) {
      console.log(
        `[tracking] ${req.hostname} → sem config, injetando script universal`,
      );
      return body.replace("<!-- __TRACKING__ -->", universalScript);
    }
    body = body
      .replace(/<title>[^<]*<\/title>/gi, "")
      .replace(/<meta\s+name="description"[^>]*\/?>/gi, "")
      .replace(/<meta\s+name="author"[^>]*\/?>/gi, "")
      .replace(/<meta\s+property="og:type"[^>]*\/?>/gi, "")
      .replace(/<meta\s+property="og:title"[^>]*\/?>/gi, "")
      .replace(/<meta\s+property="og:description"[^>]*\/?>/gi, "")
      .replace(/<meta\s+property="og:url"[^>]*\/?>/gi, "")
      .replace(/<meta\s+property="og:image"[^>]*\/?>/gi, "")
      .replace(/<meta\s+property="og:site_name"[^>]*\/?>/gi, "")
      .replace(/<link\s+rel="canonical"[^>]*\/?>/gi, "")
      .replace(/<link\s+rel="icon"[^>]*type="image\/svg\+xml"[^>]*\/?>/gi, "")
      .replace(/<link\s+rel="apple-touch-icon"[^>]*\/?>/gi, "")
      .replace(
        /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/gi,
        "",
      );
    const scripts = buildTrackingScripts(tracking, req.path);
    console.log(
      `[tracking] ${req.hostname} → ${tracking.domain} | ${tracking.gtmId ?? "sem-gtm"}`,
    );
    return body.replace("<!-- __TRACKING__ -->", scripts);
  };

  const originalSend = res.send.bind(res);
  const originalEnd = res.end.bind(res);

  res.send = function (body: any) {
    return originalSend(injectTracking(body));
  };
  res.end = function (body?: any, ...a: any[]) {
    return (originalEnd as any)(injectTracking(body), ...a);
  };

  next();
}
