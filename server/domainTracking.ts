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
  // pmdomeuestado.click — Muamba Filmes LTDA (Sociedade Empresária Limitada,
  // CNAE 59.11-1-99, Produção cinematográfica e de vídeos), sediada em
  // Fortaleza/CE. Não é escritório de advocacia. Mantida em sincronia com
  // client/src/lib/siteConfig.ts (PM_DO_MEU_ESTADO); atualizar ambos se os
  // dados cadastrais mudarem.
  "pmdomeuestado.click": {
    brand: "PM do Meu Estado",
    razaoSocial: "Muamba Filmes LTDA",
    cnpj: "57.507.866/0001-00",
    address: "Rua Milagres, 24, Sala 10, Aldeota",
    postalCode: "60110-430",
    emailContato: "muambafilmes@gmail.com",
    phone: "(85) 99631-6323",
    city: "Fortaleza",
    stateCode: "CE",
    themeColor: "#2c4a1e",
  },
  // concurseiropm.click — Ab Contabilidade Assessoria Contabil e Consultoria
  // Empresarial LTDA (Sociedade Empresária Limitada, CNAE 69.20-6-01,
  // Atividades de contabilidade), sediada em Fortaleza/CE. Não é escritório de
  // advocacia. Mantida em sincronia com client/src/lib/siteConfig.ts
  // (CONCURSEIRO_PM); atualizar ambos se os dados cadastrais mudarem.
  "concurseiropm.click": {
    brand: "Concurseiro PM",
    razaoSocial: "Ab Contabilidade Assessoria Contabil e Consultoria Empresarial LTDA",
    cnpj: "58.129.437/0001-00",
    address: "Avenida Washington Soares, 55, Sala 307, Edson Queiroz",
    postalCode: "60811-341",
    emailContato: "ab_contabilidade@hotmail.com",
    phone: "(85) 98170-1976",
    city: "Fortaleza",
    stateCode: "CE",
    themeColor: "#1a4c5c",
  },
  // futuropm.click — Vilasolutions Brasil LTDA (Sociedade Empresária Limitada,
  // CNAE 85.99-6-04, Treinamento em desenvolvimento profissional e gerencial),
  // sediada em Fortaleza/CE. Não é escritório de advocacia. Mantida em
  // sincronia com client/src/lib/siteConfig.ts (FUTURO_PM); atualizar ambos
  // se os dados cadastrais mudarem.
  "futuropm.click": {
    brand: "Futuro PM",
    razaoSocial: "Vilasolutions Brasil LTDA",
    cnpj: "57.638.943/0001-61",
    address: "Rua Pedro de Sousa, 305, Parque Santa Maria",
    postalCode: "60873-105",
    emailContato: "alissonvillanovabrasil@gmail.com",
    phone: "(85) 98642-5444",
    city: "Fortaleza",
    stateCode: "CE",
    themeColor: "#6b4c1a",
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
  // modopolicial.click — Exytus Contabilidade Consultiva LTDA (Sociedade
  // Empresária Limitada, atividades de contabilidade), sediada em Aracaju/SE.
  // Não é escritório de advocacia. Mantida em sincronia com
  // client/src/lib/siteConfig.ts (MODO_POLICIAL); atualizar ambos se os dados
  // cadastrais mudarem.
  "modopolicial.click": {
    brand: "Modo Policial",
    razaoSocial: "Exytus Contabilidade Consultiva LTDA",
    cnpj: "36.709.907/0001-71",
    address: "Avenida Jorn Juarez Conrado Dantas, 1125, Apt 101 Cond Parq Alameda Real Bloco 27, Santa Maria",
    postalCode: "49039-083",
    emailContato: "contato@exytus.com.br",
    phone: "(79) 99868-9197",
    city: "Aracaju",
    stateCode: "SE",
    themeColor: "#1e3a52",
  },
  // primeirafarda.click — Diesel Max Pecas e Servicos LTDA (Sociedade Empresária
  // Limitada, CNAE 45.20-0-01, manutenção e reparação mecânica de veículos),
  // sediada em Contagem/MG. Não é escritório de advocacia. Mantida em sincronia
  // com client/src/lib/siteConfig.ts (PRIMEIRA_FARDA); atualizar ambos se os
  // dados cadastrais mudarem.
  "primeirafarda.click": {
    brand: "Primeira Farda",
    razaoSocial: "Diesel Max Pecas e Servicos LTDA",
    cnpj: "62.545.581/0001-02",
    address: "Avenida Durval Alves de Faria, 738",
    postalCode: "32070-040",
    emailContato: "maxtone24@yahoo.com.br",
    phone: "(31) 98220-8438",
    city: "Contagem",
    stateCode: "MG",
    themeColor: "#5a1b2e",
  },
  // patentemilitar.click — Fernandes Engenharia e Construcao LTDA (Sociedade
  // Empresária Limitada, CNAE 41.20-4-00, construção de edifícios), sediada em
  // Contagem/MG. Não é escritório de advocacia. Mantida em sincronia com
  // client/src/lib/siteConfig.ts (PATENTE_MILITAR); atualizar ambos se os dados
  // cadastrais mudarem.
  "patentemilitar.click": {
    brand: "Patente Militar",
    razaoSocial: "Fernandes Engenharia e Construcao LTDA",
    cnpj: "62.551.644/0001-25",
    address: "Rua Monsenhor Bicalho, 145, Andar 2 Sala 2",
    postalCode: "32310-220",
    emailContato: "processos@contajul.com",
    phone: "(31) 2115-8100",
    city: "Contagem",
    stateCode: "MG",
    themeColor: "#5c4a1e",
  },
  // sonhodefarda.click — Pnzn Papeis Finos e Presentes LTDA (Sociedade Empresária
  // Limitada, CNAE 47.61-0-03, comércio varejista de artigos de papelaria),
  // sediada em Curitiba/PR. Não é escritório de advocacia. Mantida em sincronia
  // com client/src/lib/siteConfig.ts (SONHO_DE_FARDA); atualizar ambos se os
  // dados cadastrais mudarem.
  "sonhodefarda.click": {
    brand: "Sonho de Farda",
    razaoSocial: "Pnzn Papeis Finos e Presentes LTDA",
    cnpj: "62.549.874/0001-50",
    address: "Avenida Do Batel, 1868, Quiosqq-301 Andar L-3",
    postalCode: "80420-090",
    emailContato: "patiobatel.magnolia@gmail.com",
    phone: "(41) 99135-3002",
    city: "Curitiba",
    stateCode: "PR",
    themeColor: "#7a4f1e",
  },
  // honramilitar.click — Chaveiro Auto Tecno LTDA (Sociedade Empresária Limitada,
  // CNAE 95.29-1-02, chaveiros), sediada em Contagem/MG. Não é escritório de
  // advocacia. Mantida em sincronia com client/src/lib/siteConfig.ts
  // (HONRA_MILITAR); atualizar ambos se os dados cadastrais mudarem.
  "honramilitar.click": {
    brand: "Honra Militar",
    razaoSocial: "Chaveiro Auto Tecno LTDA",
    cnpj: "62.549.317/0001-39",
    address: "Avenida Alvarenga Peixoto, 508, Andar 01 Loja 03",
    postalCode: "32223-450",
    emailContato: "chaveiroautotecno@gmail.com",
    phone: "(31) 2565-1113",
    city: "Contagem",
    stateCode: "MG",
    themeColor: "#1a1a2e",
  },
  // trilhapm.click — Distribuidora Pecas Truck Mqn LTDA (Sociedade Empresária
  // Limitada, CNAE 45.30-7-01, comércio atacadista de peças para veículos),
  // sediada em Curitiba/PR. Não é escritório de advocacia. Mantida em sincronia
  // com client/src/lib/siteConfig.ts (TRILHA_PM); atualizar ambos se os dados
  // cadastrais mudarem.
  "trilhapm.click": {
    brand: "Trilha PM",
    razaoSocial: "Distribuidora Pecas Truck Mqn LTDA",
    cnpj: "62.549.521/0001-50",
    address: "Rua João David Perneta, 82",
    postalCode: "80040-330",
    emailContato: "contapagamentos@gmail.com",
    phone: "(41) 3223-8875",
    city: "Curitiba",
    stateCode: "PR",
    themeColor: "#2e5339",
  },
  // foconafarda.click — D' Martins Assessoria e Consultoria Unipessoal LTDA
  // (Sociedade Simples Limitada, CNAE 82.11-3-00, serviços combinados de
  // escritório e apoio administrativo), sediada em Goiânia/GO. Não é escritório
  // de advocacia. Mantida em sincronia com client/src/lib/siteConfig.ts
  // (FOCO_NA_FARDA); atualizar ambos se os dados cadastrais mudarem.
  "foconafarda.click": {
    brand: "Foco na Farda",
    razaoSocial: "D' Martins Assessoria e Consultoria Unipessoal LTDA",
    cnpj: "67.588.626/0001-31",
    address: "Rua Paranaiguara, 50",
    postalCode: "74884-667",
    emailContato: "fiscalmmc@gmail.com",
    phone: "(61) 99253-5805",
    city: "Goiânia",
    stateCode: "GO",
    themeColor: "#2b2d42",
  },
  // guiadopm.click — Comex B2G LTDA (Sociedade Empresária Limitada, CNAE
  // 47.51-2-01, comércio varejista de equipamentos de informática), sediada em
  // Contagem/MG. Não é escritório de advocacia. Mantida em sincronia com
  // client/src/lib/siteConfig.ts (GUIA_DO_PM); atualizar ambos se os dados
  // cadastrais mudarem.
  "guiadopm.click": {
    brand: "Guia do PM",
    razaoSocial: "Comex B2G LTDA",
    cnpj: "62.548.749/0001-25",
    address: "Rua Guararapes, 134",
    postalCode: "32285-090",
    emailContato: "comexb2g@gmail.com",
    phone: "(31) 99138-0034",
    city: "Contagem",
    stateCode: "MG",
    themeColor: "#1c3a5e",
  },
  // missaofarda.click — Jl Distribuidora Retiro Ltda. (Sociedade Empresária
  // Limitada, CNAE 47.23-7-00, comércio varejista de bebidas), sediada em
  // Contagem/MG. Não é escritório de advocacia. Mantida em sincronia com
  // client/src/lib/siteConfig.ts (MISSAO_FARDA); atualizar ambos se os dados
  // cadastrais mudarem.
  "missaofarda.click": {
    brand: "Missão Farda",
    razaoSocial: "Jl Distribuidora Retiro Ltda.",
    cnpj: "62.539.537/0001-81",
    address: "Rua Ilha do Retiro, 92, Loja Lj",
    postalCode: "32050-510",
    emailContato: "jldistribuidoraretiro@gmail.com",
    phone: "(31) 97319-7498",
    city: "Contagem",
    stateCode: "MG",
    themeColor: "#6b1a1a",
  },
  // minhafarda.click — Ink Grafica LTDA (Sociedade Empresária Limitada, CNAE
  // 18.22-9-99, serviços de acabamentos gráficos), sediada em Contagem/MG.
  // Não é escritório de advocacia. Mantida em sincronia com
  // client/src/lib/siteConfig.ts (MINHA_FARDA); atualizar ambos se os dados
  // cadastrais mudarem.
  "minhafarda.click": {
    brand: "Minha Farda",
    razaoSocial: "Ink Grafica LTDA",
    cnpj: "62.550.653/0001-00",
    address: "Rua Cruzeiro do Sul, 953, Loja",
    postalCode: "32115-170",
    emailContato: "contatograficaink@gmail.com",
    phone: "(31) 98384-9251",
    city: "Contagem",
    stateCode: "MG",
    themeColor: "#4a5e3a",
  },
  // proximoedital.click — Br Motos LTDA (Sociedade Empresária Limitada, CNAE
  // 77.11-0-00, locação de automóveis sem condutor), sediada em Goiânia/GO.
  // Não é escritório de advocacia. Mantida em sincronia com
  // client/src/lib/siteConfig.ts (PROXIMO_EDITAL); atualizar ambos se os dados
  // cadastrais mudarem.
  "proximoedital.click": {
    brand: "Próximo Edital",
    razaoSocial: "Br Motos LTDA",
    cnpj: "62.550.094/0001-20",
    address: "Avenida T9, 2840, Box 30",
    postalCode: "74255-220",
    emailContato: "rodrigotaioba@gmail.com",
    phone: "(19) 99819-9067",
    city: "Goiânia",
    stateCode: "GO",
    themeColor: "#1a4731",
  },
  // panoramapm.click — Anacarlaperiodontia LTDA (Sociedade Empresária Limitada,
  // CNAE 86.30-5-04, atividade odontológica), sediada em Feira de Santana/BA.
  // Não é escritório de advocacia. Mantida em sincronia com
  // client/src/lib/siteConfig.ts (PANORAMA_PM); atualizar ambos se os dados
  // cadastrais mudarem.
  "panoramapm.click": {
    brand: "Panorama PM",
    razaoSocial: "Anacarlaperiodontia LTDA",
    cnpj: "62.523.695/0001-43",
    address: "Avenida Governador Joao Durval Carneiro, 3803, Edif Charmant Sala 913",
    postalCode: "44051-335",
    emailContato: "acmpperiodontia@gmail.com",
    phone: "(71) 98605-0042",
    city: "Feira de Santana",
    stateCode: "BA",
    themeColor: "#0f4c5c",
  },
  // cronogramapm.click — Cop Odontologia Premium LTDA (Sociedade Empresária
  // Limitada, CNAE 86.30-5-04, atividade odontológica), sediada em Feira de
  // Santana/BA. Não é escritório de advocacia. Mantida em sincronia com
  // client/src/lib/siteConfig.ts (CRONOGRAMA_PM); atualizar ambos se os dados
  // cadastrais mudarem.
  "cronogramapm.click": {
    brand: "Cronograma PM",
    razaoSocial: "Cop Odontologia Premium LTDA",
    cnpj: "62.509.737/0001-91",
    address: "Avenida Getulio Vargas, 456",
    postalCode: "44001-192",
    emailContato: "fiscal@sgcon.com.br",
    phone: "(75) 3616-7471",
    city: "Feira de Santana",
    stateCode: "BA",
    themeColor: "#1f4e79",
  },
  // editalmilitar.click — Bittencourt Berenguer Cesar Ativos LTDA (Sociedade
  // Empresária Limitada, CNAE 74.90-1-04, intermediação e agenciamento de
  // serviços e negócios), sediada em Feira de Santana/BA. Não é escritório de
  // advocacia. Mantida em sincronia com client/src/lib/siteConfig.ts
  // (EDITAL_MILITAR); atualizar ambos se os dados cadastrais mudarem.
  "editalmilitar.click": {
    brand: "Edital Militar",
    razaoSocial: "Bittencourt Berenguer Cesar Ativos LTDA",
    cnpj: "62.532.283/0001-70",
    address: "Rua Fernando Ferrari, 614",
    postalCode: "44088-066",
    emailContato: "contato@bberenguercesarativos.com.br",
    phone: "(71) 99686-0916",
    city: "Feira de Santana",
    stateCode: "BA",
    themeColor: "#1e2d5e",
  },
  // futurosoldado.click — Mb Internacional LTDA (Sociedade Empresária Limitada,
  // CNAE 82.11-3-00, serviços combinados de escritório e apoio administrativo),
  // sediada em Guarulhos/SP. Não é escritório de advocacia. Mantida em sincronia
  // com client/src/lib/siteConfig.ts (FUTURO_SOLDADO); atualizar ambos se os
  // dados cadastrais mudarem.
  "futurosoldado.click": {
    brand: "Futuro Soldado",
    razaoSocial: "Mb Internacional LTDA",
    cnpj: "62.466.825/0001-53",
    address: "Avenida Papa Joao Paulo I, 4006, Galpao02",
    postalCode: "07174-005",
    emailContato: "oregonempresarial@gmail.com",
    phone: "(15) 99628-4851",
    city: "Guarulhos",
    stateCode: "SP",
    themeColor: "#2d5a27",
  },
  // quarteldoconcurseiro.com — Ricardo Pereira Sanches Tecnologia da Informacao
  // LTDA (Sociedade Empresária Limitada, CNAE 62.04-0-00, consultoria em TI),
  // sediada em Guarulhos/SP. Não é escritório de advocacia. Mantida em sincronia
  // com client/src/lib/siteConfig.ts (QUARTEL_CONCURSEIRO); atualizar ambos se
  // os dados cadastrais mudarem.
  "quarteldoconcurseiro.com": {
    brand: "Quartel do Concurseiro",
    razaoSocial: "Ricardo Pereira Sanches Tecnologia da Informacao LTDA",
    cnpj: "62.446.657/0001-34",
    address: "Rua Mauricio de Oliveira, 170, Bloco C Apt 127",
    postalCode: "07040-110",
    emailContato: "meucnpj@contabilizei.com.br",
    phone: "(41) 99788-0145",
    city: "Guarulhos",
    stateCode: "SP",
    themeColor: "#2c3e1f",
  },
  // projetopm2026.click — Furquim Soccer Assessoria Esportiva LTDA (Sociedade
  // Empresária Limitada, CNAE 74.90-1-05, agenciamento e ensino esportivo),
  // sediada em Guarulhos/SP. Não é escritório de advocacia. Mantida em sincronia
  // com client/src/lib/siteConfig.ts (PROJETO_PM_2026); atualizar ambos se os
  // dados cadastrais mudarem.
  "projetopm2026.click": {
    brand: "Projeto PM 2026",
    razaoSocial: "Furquim Soccer Assessoria Esportiva LTDA",
    cnpj: "62.453.437/0001-38",
    address: "Rua Diogo Farias, 181, Sala 1312",
    postalCode: "07110-090",
    emailContato: "rodrigoneno24@gmail.com",
    phone: "(11) 96342-4395",
    city: "Guarulhos",
    stateCode: "SP",
    themeColor: "#1d3461",
  },
  // pmdescomplicada.click — Mulheres do Queijo Ltda. (Sociedade Empresária Limitada,
  // CNAE 70.20-4-00, consultoria em gestão empresarial), sediada em Belo
  // Horizonte/MG. Não é escritório de advocacia. Mantida em sincronia com
  // client/src/lib/siteConfig.ts (PM_DESCOMPLICADA); atualizar ambos se os dados
  // cadastrais mudarem.
  "pmdescomplicada.click": {
    brand: "PM Descomplicada",
    razaoSocial: "Mulheres do Queijo Ltda.",
    cnpj: "56.048.934/0001-58",
    address: "Rua Ernani Agricola, 15",
    postalCode: "30492-040",
    emailContato: "cestevao@escritoriodofazendeiro.com.br",
    phone: "(38) 99161-9377",
    city: "Belo Horizonte",
    stateCode: "MG",
    themeColor: "#1b6b5a",
  },
  // rotapolicial.click — Am Solutions Comercio e Servicos LTDA (Sociedade Empresária
  // Limitada, CNAE 47.89-0-99 + 85.99-6-05, cursos preparatórios para concursos),
  // sediada em Brasília/DF. Não é escritório de advocacia. Mantida em sincronia com
  // client/src/lib/siteConfig.ts (ROTA_POLICIAL); atualizar ambos se os dados
  // cadastrais mudarem.
  "rotapolicial.click": {
    brand: "Rota Policial",
    razaoSocial: "Am Solutions Comercio e Servicos LTDA",
    cnpj: "57.632.967/0001-03",
    address: "Setor Qnh Area Especial (Cemiterio), SN",
    postalCode: "72130-730",
    emailContato: "alemar.gestaoenegocios@gmail.com",
    phone: "(61) 99699-8990",
    city: "Brasília",
    stateCode: "DF",
    themeColor: "#1a2d4f",
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
  "pmdomeuestado.click": [
    {
      q: "As Polícias Militares variam muito entre os estados brasileiros?",
      a: "Sim. Cada PM estadual é regulamentada por legislação própria e organizada de forma autônoma dentro do quadro federal. Há variações relevantes no quantitativo de efetivo, na estrutura de Batalhões e Companhias, nos critérios de promoção, no regime de trabalho (escala de plantão) e na remuneração dos profissionais. Estados maiores, como São Paulo e Minas Gerais, costumam ter corporações mais numerosas e orçamentos distintos das PMs de estados menores.",
    },
    {
      q: "As diferenças salariais entre PMs de estados diferentes são significativas?",
      a: "São expressivas. O vencimento base de um soldado recém-formado pode variar consideravelmente entre estados, refletindo diferenças no orçamento estadual, nas leis de carreira e nos planos de reestruturação remuneratória de cada governo. Além do salário base, benefícios como adicional de risco de vida, gratificação por habilitação e licenças especiais variam por corporação e influenciam a remuneração total do profissional.",
    },
    {
      q: "A estrutura de postos e graduações é igual em todas as PMs estaduais?",
      a: "A estrutura geral segue o modelo nacional — praças (soldado a subtenente) e oficiais (aspirante a coronel) — mas os detalhes variam por estado. Alguns estados possuem graduações ou denominações específicas, planos de cargos distintos e critérios diferentes para acesso aos cursos de especialização e promoção. O regulamento interno de cada corporação define os detalhes da progressão funcional.",
    },
    {
      q: "Alguns estados abrem mais concursos para a PM do que outros?",
      a: "Historicamente, sim. A frequência de seleções depende do orçamento estadual, da taxa de saída de profissionais (aposentadorias e desligamentos) e das políticas de segurança pública de cada governo. Estados com maior rotatividade ou expansão do efetivo costumam realizar seleções com maior regularidade. Acompanhe os diários oficiais e o site da PM do seu estado para informações oficiais sobre editais abertos.",
    },
    {
      q: "É possível tirar dúvidas sobre as PMs estaduais pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre estrutura, carreira e organização das Polícias Militares estaduais pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para informações oficiais sobre a corporação do seu estado, consulte diretamente o site ou a ouvidoria da PM estadual.",
    },
  ],
  "concurseiropm.click": [
    {
      q: "Quais são as disciplinas mais cobradas nas provas objetivas do concurso da PM?",
      a: "As disciplinas mais frequentes nos concursos da PM incluem Língua Portuguesa, Matemática e Raciocínio Lógico, Noções de Direito Constitucional, Direito Administrativo e Legislação Policial Estadual. Dependendo do edital, podem aparecer também Informática, Atualidades, Direito Penal e Ética no Serviço Público. O conteúdo programático exato varia por estado e por banca organizadora.",
    },
    {
      q: "Como montar um cronograma eficiente de estudos para o concurso da PM?",
      a: "Um cronograma eficiente parte do edital: identifique o número de questões por disciplina e o peso de cada uma na nota final. Dedique mais horas às disciplinas com maior incidência e às que representam maior dificuldade pessoal. Alterne dias de conteúdo novo com dias de revisão e resolução de questões anteriores, e inclua simulados periódicos para treinar o ritmo da prova real.",
    },
    {
      q: "Qual é a melhor estratégia para resolver questões de múltipla escolha nas provas da PM?",
      a: "Eliminar alternativas claramente erradas antes de escolher a resposta reduz o risco de marcação precipitada. Para questões de interpretação de texto e raciocínio lógico, ler o enunciado com atenção antes das alternativas ajuda a evitar armadilhas. Manter o ritmo e não gastar tempo excessivo em questões desconhecidas — deixando-as para revisitar ao final — é uma tática eficaz na maioria dos certames com limite de tempo rigoroso.",
    },
    {
      q: "As provas dos concursos da PM variam muito entre os estados?",
      a: "Sim. O conteúdo programático, o número de questões, o peso de cada disciplina e o nível de dificuldade das provas variam significativamente entre corporações estaduais e entre bancas organizadoras. Editais de estados como São Paulo (VUNESP), Minas Gerais e Rio de Janeiro têm perfis de prova distintos. Sempre consulte o edital específico do certame de seu interesse para organizar a preparação com precisão.",
    },
    {
      q: "É possível tirar dúvidas sobre preparação para o concurso da PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre disciplinas, cronograma e organização dos estudos para o concurso da PM pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para informações específicas sobre o edital de seu interesse, consulte sempre o documento oficial da banca organizadora.",
    },
  ],
  "futuropm.click": [
    {
      q: "Como funciona o processo seletivo para ingresso como soldado da Polícia Militar?",
      a: "O processo seletivo para soldado varia por estado, mas em geral inclui prova objetiva de conhecimentos gerais, Teste de Aptidão Física (TAF), exame médico, avaliação psicológica e investigação social. O edital de cada corporação define os requisitos mínimos de escolaridade, idade, altura e outros critérios eliminatórios. A ordem das etapas pode variar conforme a corporação organizadora.",
    },
    {
      q: "O que é o Curso de Formação de Soldados (CFS) e como ele funciona?",
      a: "O CFS é o período de formação inicial obrigatório para quem ingressa na PM como soldado. Durante o curso, o recruta recebe instrução em técnicas policiais, legislação, armamento, primeiros socorros, educação física intensa e conduta militar. A duração varia por estado — em geral de quatro a oito meses — e a aprovação é condição para assumir o serviço ativo como praça.",
    },
    {
      q: "Como funciona a progressão nas graduações da carreira de praça da PM?",
      a: "A carreira de praça segue a sequência: soldado → cabo → sargento (3º, 2º e 1º) → subtenente. As promoções ocorrem por antiguidade e merecimento, conforme os regulamentos de cada corporação estadual. Critérios como tempo mínimo na graduação, aprovação em cursos de formação específicos, ausência de punições e avaliação de desempenho influenciam diretamente o ritmo de progressão.",
    },
    {
      q: "Quais são as principais diferenças entre a carreira de praça e a carreira de oficial na PM?",
      a: "Praças ingressam como soldados por concurso público e progridem nas graduações até subtenente. Oficiais ingressam pelo Curso de Formação de Oficiais (CFO) — com exigência de ensino superior — e progridem nos postos de tenente a coronel, com responsabilidades maiores de comando e gestão. As carreiras são hierarquicamente separadas, com diferentes estatutos, critérios de promoção e atribuições funcionais.",
    },
    {
      q: "É possível tirar dúvidas sobre a carreira de praça da PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre ingresso como soldado, formação e progressão na carreira de praça pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para informações oficiais sobre o seu caso específico, consulte a corporação responsável.",
    },
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
  "modopolicial.click": [
    {
      q: "Como o policial militar desenvolve a consciência situacional no serviço?",
      a: "A consciência situacional — a capacidade de perceber, compreender e antecipar o que está acontecendo ao redor — é uma das competências centrais do policiamento eficaz. Ela se desenvolve com a experiência de campo, mas também pode ser treinada. Policiais com alta consciência situacional notam inconsistências no ambiente antes de se tornarem ameaças: comportamentos fora do padrão, posicionamentos suspeitos, mudanças na dinâmica de um local. O patrulhamento ativo — em que o PM observa o ambiente com atenção deliberada em vez de apenas circular — é uma das formas mais eficazes de desenvolver essa capacidade ao longo da carreira.",
    },
    {
      q: "O que é de-escalada e quando ela é aplicada na atuação policial?",
      a: "De-escalada é o conjunto de técnicas e abordagens que buscam reduzir a tensão em situações potencialmente conflituosas antes de recorrer ao uso da força. Envolve comunicação verbal controlada, posicionamento físico não ameaçador, demonstração de controle emocional e oferta de alternativas ao sujeito abordado. A de-escalada é aplicável em situações onde o risco imediato à integridade física não é iminente — quando há tempo para negociar, clarificar a situação ou esperar reforços. Não é uma substituição universal ao uso da força, mas uma ferramenta que, quando aplicável, reduz riscos para todos os envolvidos, inclusive o policial.",
    },
    {
      q: "Como funciona o processo de tomada de decisão do PM em situações de alta pressão?",
      a: "Em situações de alta pressão, o processo decisório do PM precisa ser rápido e seguro ao mesmo tempo — duas exigências que frequentemente entram em tensão. Policiais bem treinados operam com modelos mentais já internalizados: padrões de situação e respostas associadas que foram praticados até se tornarem automáticos. Isso reduz a carga cognitiva no momento crítico. O modelo OODA (Observar, Orientar, Decidir, Agir), desenvolvido no contexto militar, é frequentemente referenciado no treinamento policial como estrutura para esse processo. O diferencial entre policiais experientes e iniciantes está na velocidade com que percorrem esse ciclo sem perder precisão.",
    },
    {
      q: "Quais são os princípios do uso progressivo da força na Polícia Militar?",
      a: "O uso da força pelo policial militar é regulado pelo princípio da progressividade: a resposta deve ser proporcional à resistência ou ameaça apresentada, e o PM deve sempre começar pela presença policial e pela comunicação verbal antes de avançar para níveis mais elevados. A escala geralmente inclui, em ordem crescente: presença policial, verbalização, controle físico por contato, uso de instrumentos de menor potencial ofensivo e, em último caso, força letal. A passagem de um nível para outro deve ser justificada pela necessidade e pela proporcionalidade, e cada uso de força deve ser documentado no relatório de ocorrência.",
    },
    {
      q: "É possível tirar dúvidas sobre tomada de decisão e atuação operacional da PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre consciência situacional, de-escalada, uso progressivo da força e o processo decisional do policial militar em campo pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para treinamentos e orientações operacionais oficiais, consulte diretamente os programas de qualificação da corporação do seu estado.",
    },
  ],
  "primeirafarda.click": [
    {
      q: "Como é a rotina diária dentro do Curso de Formação de Soldados da PM?",
      a: "A rotina do Curso de Formação de Soldados é marcada por estrutura rígida e horários fixos. O dia começa cedo — geralmente entre 5h e 6h — com formatura, atividade física e café da manhã antes do início das aulas. O período letivo combina disciplinas teóricas (legislação, direito penal, procedimentos operacionais) com treinamentos práticos (armamento, defesa pessoal, abordagem). O regime é semi-internato ou internato completo dependendo da corporação estadual, o que significa que os recrutas passam a maior parte do tempo nas instalações do Centro de Formação. Além das atividades formais, há deveres e obrigações militares que se estendem ao tempo livre.",
    },
    {
      q: "Quais são os maiores desafios enfrentados pelos recrutas nas primeiras semanas do curso?",
      a: "As primeiras semanas do curso de formação representam o choque cultural mais intenso da carreira policial. Os maiores desafios relatados por policiais que já passaram pelo processo incluem: a adaptação ao regime de hierarquia e disciplina rígidos após anos de vida civil, o cansaço acumulado da combinação de atividade física intensa com carga horária teórica elevada, o convívio compulsório com um grupo grande de desconhecidos em ambiente fechado e a gestão emocional diante de cobranças e pressões que muitos recrutas nunca experimentaram antes. Recrutas que chegam com condicionamento físico e alguma familiaridade com rotina disciplinada tendem a ter uma adaptação mais suave.",
    },
    {
      q: "O que mais surpreende quem ingressa no Curso de Formação de Soldados da PM?",
      a: "Policiais que já completaram o curso frequentemente relatam que o que mais surpreendeu não foi a intensidade física — esperada por quem se preparou para o TAF — mas o volume e a complexidade do conteúdo teórico: legislação, procedimentos operacionais, uso da força, direitos humanos e ética profissional formam uma carga acadêmica que muitos recrutas subestimam. Outro ponto que surpreende é a dimensão coletiva da formação: avaliações e punições frequentemente recaem sobre o grupo, não apenas sobre o indivíduo, o que exige uma mentalidade de equipe que nem todos estão acostumados a desenvolver.",
    },
    {
      q: "Como se preparar mentalmente e fisicamente antes de iniciar o curso de formação da PM?",
      a: "A preparação física antes do curso deve ir além do mínimo exigido no TAF — idealmente o recruta deve chegar ao curso com capacidade aeróbica e muscular acima do mínimo, pois as exigências físicas durante a formação são contínuas e acumulativas. Do ponto de vista mental, familiarizar-se com a estrutura hierárquica e com os regulamentos disciplinares militares antes do início ajuda a reduzir o choque cultural. Recrutas que já leram o regulamento da corporação, entendem o que significa uma formatura e têm noção básica dos procedimentos de abordagem chegam com uma vantagem real. Quanto à gestão emocional, o aspecto mais útil é estar preparado para abrir mão da autonomia do cotidiano civil por um período determinado.",
    },
    {
      q: "É possível tirar dúvidas sobre o Curso de Formação de Soldados da PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre como é a rotina do curso de formação, o que esperar das primeiras semanas e como se preparar antes de iniciar pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para informações específicas sobre o curso de formação do seu estado — duração, regime de internato e conteúdo programático —, recomendamos consultar diretamente o site da Polícia Militar estadual.",
    },
  ],
  "patentemilitar.click": [
    {
      q: "Quais são todos os postos e graduações da Polícia Militar, do soldado ao coronel?",
      a: "A estrutura hierárquica da PM divide-se em dois grandes grupos: praças e oficiais. As graduações de praça — em ordem crescente — são: Soldado, Cabo, 3º Sargento, 2º Sargento, 1º Sargento, Subtenente (ou Subtenenente/Aspirante a Oficial, dependendo do estado). Os postos de oficial são: 2º Tenente, 1º Tenente, Capitão, Major, Tenente-Coronel e Coronel. O Coronel PM é o posto mais elevado da carreira estadual. Cada corporação estadual pode ter variações de nomenclatura e algumas possuem patentes intermediárias adicionais, como o Estágio de Adaptação para ingresso no quadro de oficiais.",
    },
    {
      q: "Como funciona o sistema de promoções na PM — por merecimento, antiguidade ou vaga?",
      a: "As promoções na PM ocorrem geralmente por uma combinação de três critérios: antiguidade (tempo de serviço no posto ou graduação atual), merecimento (avaliação de desempenho, conduta disciplinar, cursos realizados e condecorações) e existência de vaga na graduação ou posto superior. Em geral, promoções entre as graduações de praça têm critérios mais objetivos, enquanto as promoções nos postos de oficial envolvem análise por Comissão de Promoções e maior peso do merecimento. Os critérios específicos são definidos pelo Estatuto dos Policiais Militares de cada estado.",
    },
    {
      q: "Quais são os critérios e prazos típicos para progressão entre as graduações de praça?",
      a: "Os prazos mínimos para promoção entre graduações de praça variam por estado, mas de forma geral o policial precisa cumprir um tempo mínimo em cada graduação — que costuma variar de 2 a 5 anos —, estar em situação disciplinar regular (sem punições que impeçam a promoção) e, em alguns estados, concluir cursos de aperfeiçoamento específicos para cada nível. A promoção a Subtenente, a mais alta entre as praças, tende a exigir maior tempo de serviço e, frequentemente, conclusão do Curso de Formação de Sargentos ou equivalente.",
    },
    {
      q: "O que diferencia os oficiais dos praças na estrutura hierárquica da PM?",
      a: "A divisão entre praças e oficiais é a fronteira hierárquica mais significativa na PM. Os oficiais exercem funções de comando e direção — são responsáveis pelo planejamento operacional, pela gestão das unidades e pela representação institucional. Os praças executam as atividades operacionais diretas, como o policiamento ostensivo, sob supervisão dos oficiais. O ingresso nas duas carreiras ocorre por concursos distintos — um para soldado (início da carreira de praça) e outro para o Curso de Formação de Oficiais (CFO). A progressão de praça para oficial é possível, mas exige aprovação em processo seletivo específico e conclusão do CFO.",
    },
    {
      q: "É possível tirar dúvidas sobre postos, graduações e promoções na PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre a estrutura de patentes, como funciona o sistema de promoções e o que diferencia cada nível hierárquico na Polícia Militar pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para informações específicas sobre critérios de promoção da corporação do seu estado, recomendamos consultar o Estatuto dos Policiais Militares estadual ou o setor de recursos humanos da corporação.",
    },
  ],
  "sonhodefarda.click": [
    {
      q: "Como manter a motivação durante uma preparação longa para o concurso da PM?",
      a: "Preparações que se estendem por um ou dois anos — ou mais — exigem estratégias de sustentabilidade emocional que vão além da disciplina de estudo. Dividir o objetivo final em marcos intermediários mensuráveis (dominar uma disciplina, melhorar o tempo no TAF, concluir um simulado) cria momentos de conquista que alimentam a motivação ao longo do caminho. Registrar o progresso — um diário de estudo, uma planilha de desempenho — torna o avanço visível mesmo quando ele parece lento. Manter ao menos uma atividade prazerosa fora dos estudos não é desperdício de tempo: é o que impede o esgotamento que faz candidatos abandonarem antes de chegar à reta final.",
    },
    {
      q: "O que fazer quando não se é aprovado em um ciclo do processo seletivo da PM?",
      a: "A não aprovação em um ciclo é uma informação, não uma sentença. O primeiro passo é identificar com precisão em qual etapa a eliminação ocorreu — prova escrita, TAF, psicológico — e o que o desempenho naquela fase diz sobre onde concentrar energia no próximo ciclo. Candidatos que repetem os mesmos erros de preparação entre ciclos tendem a obter os mesmos resultados; os que fazem uma análise honesta e ajustam a estratégia aumentam progressivamente suas chances. Dar um tempo curto para processar a frustração é saudável; transformar esse tempo em inação prolongada é o maior risco para quem quer tentar novamente.",
    },
    {
      q: "Como lidar com a pressão familiar e social durante a preparação para a PM?",
      a: "A pressão de quem está de fora — família, amigos, colegas — costuma vir de dois lugares: preocupação genuína com o futuro do candidato e dificuldade de compreender por que alguém investiria tanto tempo em algo sem retorno garantido. Comunicar de forma clara o que é a carreira, o que a aprovação significa concretamente e qual é o plano caso o objetivo não se concretize ajuda a transformar ceticismo em apoio. Estabelecer limites sobre quando o tema pode ser discutido em casa — evitando que cada conversa se torne uma avaliação da preparação — protege o foco e o equilíbrio emocional do candidato.",
    },
    {
      q: "O que muda na vida do candidato e da família com a aprovação na PM?",
      a: "A aprovação na PM representa uma mudança de vida que vai além do emprego. Para o aprovado, há a transformação identitária de tornar-se um profissional de segurança pública — com a responsabilidade, os valores e a rotina que esse papel implica. Para a família, há a estabilidade financeira que a carreira oferece, mas também a adaptação à escala de trabalho (incluindo plantões, fins de semana e feriados) e ao risco inerente à profissão. Quanto mais essa conversa acontecer antes da aprovação — com expectativas alinhadas e apoio mútuo construído —, mais suave tende a ser a transição.",
    },
    {
      q: "É possível tirar dúvidas sobre motivação e preparação emocional para o concurso da PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre como manter o foco durante uma preparação longa, lidar com reprovação ou pressão familiar e o que esperar da vida após a aprovação pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para orientações específicas sobre o edital ou cronograma do seu concurso, recomendamos consultar o site oficial da corporação ou da banca organizadora.",
    },
  ],
  "honramilitar.click": [
    {
      q: "Qual é a origem histórica das Polícias Militares brasileiras?",
      a: "As Polícias Militares brasileiras têm origem no século XIX, com raízes que remontam às forças de segurança criadas durante o período imperial. A Guarda Real de Polícia, fundada em 1809 no Rio de Janeiro, é considerada um dos marcos fundadores da tradição policial militar no Brasil. Com a proclamação da República e a organização federativa do país, cada estado passou a estruturar sua própria corporação, herdando a tradição hierárquica e disciplinar das forças militares e incorporando progressivamente o modelo de policiamento ostensivo que permanece até hoje.",
    },
    {
      q: "Quais são as principais tradições e cerimônias que marcam a vida institucional da PM?",
      a: "A vida institucional da PM é pontuada por cerimônias que reforçam os vínculos de pertencimento e os valores da corporação. Entre as mais significativas estão a formatura dos novos policiais ao término do curso de formação — considerada um dos momentos mais marcantes da carreira —, a passagem de comando, que simboliza a continuidade institucional, as formaturas em datas comemorativas e as homenagens a policiais em missão. Cada corporação estadual tem suas tradições específicas, mas o caráter cerimonial e hierárquico é comum a todas.",
    },
    {
      q: "O que é o código de honra do policial militar e como ele se expressa na prática?",
      a: "O código de honra militar não é necessariamente um documento formal único, mas um conjunto de valores e princípios que orientam a conduta do policial dentro e fora do serviço — lealdade à corporação, cumprimento do dever mesmo sob adversidade, respeito à hierarquia, proteção dos mais vulneráveis e preservação da imagem institucional. Esses valores são transmitidos durante a formação e reforçados ao longo da carreira por meio de regulamentos disciplinares, cerimônias e da cultura interna da unidade onde o policial serve.",
    },
    {
      q: "Como a hierarquia contribui para a coesão e a eficiência operacional da Polícia Militar?",
      a: "A hierarquia militar garante previsibilidade na cadeia de decisão — em situações de alta pressão, saber quem decide e quem executa elimina ambiguidades que poderiam custar vidas. Ela também cria um sistema de responsabilidade vertical: cada nível responde pelos resultados de suas ações e das ações de quem está sob seu comando. Além da dimensão operacional, a hierarquia tem função simbólica — os rituais de respeito entre postos e graduações reforçam a coesão institucional e a identidade coletiva da corporação.",
    },
    {
      q: "É possível tirar dúvidas sobre a história e as tradições da Polícia Militar pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre a origem, as tradições e a cultura institucional da Polícia Militar pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para informações específicas sobre a história da PM do seu estado, recomendamos consultar diretamente o site ou o museu histórico da corporação estadual de interesse.",
    },
  ],
  "trilhapm.click": [
    {
      q: "Quais são todas as etapas do processo seletivo da PM e em que ordem costumam ocorrer?",
      a: "O processo seletivo da PM geralmente segue esta sequência: prova objetiva de conhecimentos, Teste de Aptidão Física (TAF), avaliação psicológica, exame médico, investigação social e, em alguns estados, avaliação de títulos ou entrevista. A ordem pode variar por edital — alguns estados realizam o exame médico antes da investigação social, outros invertem. Cada etapa é eliminatória; o candidato que não atinge o mínimo em qualquer fase é desclassificado independentemente do desempenho nas demais. Ler o edital do estado de interesse com atenção ao cronograma é indispensável.",
    },
    {
      q: "Como se preparar para a avaliação psicológica no processo seletivo da PM?",
      a: "A avaliação psicológica não tem gabarito certo ou errado — ela busca identificar características de personalidade compatíveis com o exercício da função policial, como estabilidade emocional, autocontrole, capacidade de lidar com pressão e ausência de traços que possam comprometer o julgamento em situações críticas. Candidatos que tentam 'acertar' as respostas com base no que imaginam que os avaliadores querem ouvir costumam apresentar padrões de resposta inconsistentes, o que em si pode ser um indicativo de inadequação. A melhor preparação é estar descansado, responder com honestidade e não tentar manipular os resultados.",
    },
    {
      q: "O que é avaliado na investigação social e o que pode gerar desclassificação?",
      a: "A investigação social verifica a idoneidade moral e os antecedentes do candidato por meio de consulta a registros policiais, cartoriais e eleitorais, entrevistas com vizinhos e referências, e checagem de redes sociais. Podem gerar desclassificação: antecedentes criminais (mesmo sem condenação definitiva, em alguns estados), uso de substâncias ilícitas comprovado em entrevistas, vínculos com organizações criminosas, dívidas tributárias ou eleitorais não regularizadas e publicações em redes sociais incompatíveis com a conduta esperada de um agente de segurança pública.",
    },
    {
      q: "Como funciona o exame médico no processo seletivo da PM e quais condições podem causar eliminação?",
      a: "O exame médico avalia a aptidão física e clínica do candidato para o exercício das funções policiais. Inclui exames laboratoriais, avaliação cardiológica, oftalmológica, otorrinolaringológica e, em alguns estados, toxicológica. Condições que podem causar eliminação incluem: acuidade visual abaixo do mínimo exigido sem correção adequada, hipertensão arterial não controlada, uso de determinados medicamentos de uso contínuo, índice de massa corporal fora da faixa estabelecida em edital e resultado positivo no exame toxicológico. Os critérios variam por corporação estadual e são detalhados no edital.",
    },
    {
      q: "É possível tirar dúvidas sobre as etapas do processo seletivo da PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre as fases do concurso da PM, como se preparar para cada etapa e o que esperar da avaliação psicológica, investigação social ou exame médico pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para informações oficiais sobre os critérios específicos do edital do seu estado, recomendamos consultar diretamente o site da banca organizadora ou da corporação.",
    },
  ],
  "foconafarda.click": [
    {
      q: "Como controlar a ansiedade na véspera e no dia da prova da PM?",
      a: "A ansiedade pré-prova é uma resposta fisiológica normal diante de situações de alta importância — o problema não é senti-la, mas deixar que ela comprometa o desempenho. Técnicas eficazes incluem respiração diafragmática (inspirar em 4 tempos, segurar em 4, expirar em 6), ancoragem em rotinas conhecidas (estudar no mesmo local, usar os mesmos materiais) e reduzir estímulos de alta intensidade nas 12 horas anteriores à prova — redes sociais, grupos de WhatsApp de concurseiros e revisões de última hora costumam amplificar a ansiedade sem agregar desempenho.",
    },
    {
      q: "Quais técnicas de concentração ajudam durante uma prova objetiva extensa?",
      a: "Em provas objetivas longas, a concentração tende a cair progressivamente. Estratégias que ajudam: responder primeiro as questões que você domina (gera confiança e economiza tempo), marcar as dúvidas para revisão posterior em vez de travar numa questão, e fazer microrrespiros de 10 segundos entre blocos de 10 questões — feche os olhos brevemente e respire fundo. Evite alterar respostas sem um motivo claro; a primeira leitura costuma ser mais confiável do que a revisão ansiosa.",
    },
    {
      q: "Como o sono e a alimentação afetam o desempenho no dia da prova da PM?",
      a: "O sono tem impacto direto na memória de trabalho, no tempo de reação e na capacidade de raciocínio — funções críticas em uma prova objetiva. Dormir menos de seis horas na noite anterior reduz significativamente o desempenho cognitivo, mesmo em candidatos bem preparados. Quanto à alimentação, prefira refeições de baixo índice glicêmico no dia da prova — carboidratos complexos e proteínas mantêm energia estável por mais tempo do que alimentos açucarados, que causam pico e queda rápidos de energia. Evite experimentar alimentos novos no dia; vá com o que seu organismo já conhece.",
    },
    {
      q: "O que fazer nas 24 horas anteriores à prova para chegar no estado mental ideal?",
      a: "As 24 horas antes da prova não são para aprender conteúdo novo — são para calibrar o estado mental. Revise apenas um resumo breve de pontos já consolidados, confirme logística (local de prova, documentos, horário de saída), prepare o material que levará (caneta, documento, água) e durma no horário habitual. Atividade física leve na manhã anterior ajuda a regular o cortisol. No dia da prova, chegue com antecedência suficiente para se acomodar sem pressa — chegar atrasado ou com pressa ativa o sistema de estresse de forma desnecessária.",
    },
    {
      q: "É possível tirar dúvidas sobre desempenho mental e foco para provas da PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre controle de ansiedade, concentração, rotina pré-prova e estratégias de desempenho para concursos da Polícia Militar pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para orientações específicas sobre o edital ou conteúdo programático do seu concurso, recomendamos consultar o site oficial da banca organizadora.",
    },
  ],
  "guiadopm.click": [
    {
      q: "O que é a Caixa de Assistência do Policial Militar (CAPM) e quais benefícios ela oferece?",
      a: "A CAPM — ou equivalente estadual, já que cada corporação tem sua própria entidade de assistência — é uma organização voltada ao suporte financeiro e social do policial militar e de seus dependentes. Em geral, oferece empréstimos em condições diferenciadas, auxílio funeral, assistência em casos de invalidez e, em alguns estados, auxílio educação para filhos de policiais. Os serviços variam por estado e exigem filiação formal; o policial deve consultar a entidade da sua corporação para conhecer os benefícios disponíveis e os critérios de acesso.",
    },
    {
      q: "Quais associações e entidades de classe existem para representar os policiais militares?",
      a: "As principais entidades de representação incluem associações de praças, associações de oficiais e, em alguns estados, sindicatos de servidores militares estaduais — embora a sindicalização de militares seja restrita juridicamente. Essas organizações atuam na defesa de interesses trabalhistas e previdenciários, na interlocução com o governo estadual em negociações salariais e na oferta de benefícios aos associados, como convênios com clínicas, farmácias e estabelecimentos comerciais. Cada estado possui suas próprias entidades; o policial deve verificar as opções disponíveis na corporação onde atua.",
    },
    {
      q: "Como funciona o plano de saúde disponível para o policial militar e seus dependentes?",
      a: "A maioria das corporações estaduais oferece alguma modalidade de assistência à saúde — seja por meio de sistema próprio (policlínicas e hospitais militares), convênios com operadoras de saúde ou fundo de assistência gerido pela própria PM. A cobertura, o custeio e as condições de inclusão de dependentes variam bastante entre os estados. Em algumas corporações, o benefício é parcialmente custeado pelo estado; em outras, o policial arca com parte da mensalidade. O policial deve consultar o setor de recursos humanos da sua unidade para entender as opções disponíveis.",
    },
    {
      q: "O policial militar tem acesso a previdência complementar ou cooperativas de crédito?",
      a: "Sim, em muitos estados. Cooperativas de crédito voltadas a servidores militares oferecem condições de empréstimo, financiamento e investimento mais favoráveis do que as instituições financeiras convencionais — com taxas de juros reduzidas e prazos diferenciados. Quanto à previdência complementar, alguns estados criaram fundos específicos para servidores públicos estaduais, incluindo policiais militares, especialmente após as reformas previdenciárias que alteraram o teto dos benefícios do RPPS. A adesão e as condições variam por estado e exigem consulta direta à entidade gestora.",
    },
    {
      q: "É possível tirar dúvidas sobre benefícios e recursos disponíveis para policiais militares pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre assistência institucional, benefícios, entidades de classe e apoios disponíveis para o policial militar pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para informações oficiais sobre os benefícios específicos da sua corporação, recomendamos consultar diretamente o setor de recursos humanos da unidade ou a entidade de assistência do seu estado.",
    },
  ],
  "missaofarda.click": [
    {
      q: "O que motiva as pessoas a escolherem a carreira de policial militar?",
      a: "As motivações variam muito entre indivíduos, mas pesquisas com policiais militares apontam padrões comuns: o desejo de contribuir diretamente com a segurança da comunidade, a atração pela estrutura e pelos valores da vida militar, a estabilidade que a carreira oferece e, em muitos casos, a influência de familiares que também serviram. Para parte expressiva dos policiais, a escolha envolve uma dimensão vocacional genuína — uma identificação com o papel de proteger e servir que antecede a decisão de prestar o concurso.",
    },
    {
      q: "Como a vocação para servir se manifesta no cotidiano do policial militar?",
      a: "No dia a dia, a vocação se traduz em comprometimento com a missão mesmo em situações de alta pressão, na postura ativa diante de ocorrências que exigem iniciativa e na relação de respeito construída com a comunidade ao longo do tempo. Policiais que enxergam o serviço como missão tendem a manter conduta mais consistente, a buscar qualificação contínua e a enfrentar o desgaste da carreira com mais resiliência do que aqueles que ingressaram exclusivamente por estabilidade financeira.",
    },
    {
      q: "Qual é o papel da Polícia Militar na segurança pública da comunidade?",
      a: "A Polícia Militar é responsável pelo policiamento ostensivo e pela preservação da ordem pública — atua de forma visível, preventiva e reativa nas ruas, em eventos e em situações de emergência. Além do atendimento a ocorrências, a PM tem papel relevante no policiamento comunitário, na mediação de conflitos e na construção de vínculos de confiança com a população. A efetividade dessa missão depende tanto do preparo técnico quanto da postura ética e da qualidade da relação que cada policial estabelece com a comunidade em que atua.",
    },
    {
      q: "Como conciliar os valores pessoais com as exigências institucionais da carreira policial?",
      a: "A carreira policial impõe valores e normas institucionais — hierarquia, disciplina, obediência a regulamentos — que nem sempre coincidem de forma imediata com os valores individuais de cada profissional. A conciliação saudável passa por compreender que a estrutura institucional existe para garantir coesão e previsibilidade, enquanto o espaço para a expressão dos valores pessoais acontece dentro dos limites que essa estrutura permite. Corporações que investem em formação ética e em canais de escuta criam ambientes onde profissionais comprometidos conseguem manter integridade e pertencimento ao mesmo tempo.",
    },
    {
      q: "É possível tirar dúvidas sobre vocação e carreira na PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre o que significa servir na Polícia Militar, motivações para a carreira e como é a vida profissional no dia a dia policial pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para informações oficiais sobre processos seletivos, consulte diretamente o site da PM do seu estado.",
    },
  ],
  "minhafarda.click": [
    {
      q: "Quais são os principais itens que compõem o uniforme da Polícia Militar?",
      a: "O fardamento da PM é composto por diferentes modalidades conforme a ocasião: o uniforme de serviço (diário) inclui calça, camisa ou gandola, coturno, quepe ou boné e cinto de guarnição. O uniforme de gala é utilizado em cerimônias e conta com peças adicionais como dolmã, calça com vivo e dragonas. Cada corporação estadual tem seu regulamento de uniformes específico, que define cores, insígnias, posicionamento de distintivos e regras de uso para cada modalidade.",
    },
    {
      q: "Como cuidar e conservar adequadamente o uniforme da PM para mantê-lo em boas condições?",
      a: "A conservação do uniforme começa pela lavagem correta: peças de tecido resistente como a gandola devem ser lavadas em água fria com sabão neutro para preservar a cor e o caimento. O coturno exige limpeza regular com flanela e graxa própria, além de impermeabilização periódica. Quepes e bonés não devem ser lavados na máquina — prefira limpeza com escova seca e pano úmido. Guardar o uniforme em local arejado, pendurado em cabide adequado, evita amassados e o aparecimento de mofo em regiões úmidas.",
    },
    {
      q: "Existem regras sobre o uso do uniforme da PM fora do horário de serviço?",
      a: "Sim. O uso do uniforme fora do serviço é regulado por cada corporação estadual e, em geral, é permitido apenas em situações específicas previstas no regulamento interno — como deslocamento para o trabalho ou em eventos autorizados pela corporação. O uso indevido do uniforme em ambientes que possam comprometer a imagem institucional é vedado e pode sujeitar o policial a procedimento disciplinar. Alguns estados permitem o porte de arma fora do serviço, mas com regras específicas sobre identificação e uniforme.",
    },
    {
      q: "Como funciona o fornecimento do uniforme ao ingressar na PM como novo policial?",
      a: "Em geral, a corporação fornece o kit inicial de fardamento ao recruta durante o curso de formação — incluindo os itens essenciais para o período de instrução. A quantidade e as peças fornecidas variam por estado, e alguns itens podem exigir aquisição complementar pelo próprio policial ao longo da carreira. Após o ingresso, o policial tem direito a reposição periódica de itens do fardamento conforme regulamento interno, que define prazos e condições para substituição das peças desgastadas.",
    },
    {
      q: "É possível tirar dúvidas sobre o uniforme e o fardamento da PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre composição do fardamento, cuidados com o uniforme e regulamentos de uso pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para informações oficiais sobre o regulamento de uniformes da sua corporação, recomendamos consultar diretamente o manual interno ou a gestão de material da unidade.",
    },
  ],
  "proximoedital.click": [
    {
      q: "Como saber quando vai sair o próximo edital de concurso da PM do meu estado?",
      a: "Não existe um calendário oficial antecipado de concursos da PM — cada edital depende de autorização legislativa, dotação orçamentária e decisão do governo estadual. A forma mais confiável de se antecipar é acompanhar o Diário Oficial do estado, o site institucional da PM estadual e as sessões da Assembleia Legislativa, onde projetos de lei autorizando concursos costumam tramitar meses antes da publicação do edital. Portais especializados em concursos públicos também monitoram esses movimentos e publicam notícias sobre previsões e autorizações em andamento.",
    },
    {
      q: "Quais estados da PM costumam abrir concursos com maior regularidade?",
      a: "Estados com maior efetivo e maior taxa de saída por aposentadoria tendem a abrir concursos com mais frequência — São Paulo, Minas Gerais, Bahia e Rio Grande do Sul historicamente figuram entre as corporações que realizam seleções em intervalos menores. Estados com menor efetivo ou orçamento mais restrito podem passar vários anos sem abrir vagas. Acompanhar o histórico de editais publicados nos últimos cinco anos é uma boa forma de estimar a cadência de cada corporação.",
    },
    {
      q: "O que fazer no período de espera entre editais para não perder a preparação?",
      a: "O intervalo entre editais é um dos momentos mais estratégicos da preparação: sem a pressão imediata de uma data de prova, é possível consolidar conteúdos com mais profundidade, trabalhar disciplinas com menor percentual de acerto e construir o condicionamento físico de forma progressiva. Candidatos que aproveitam esse período chegam ao edital seguinte com base sólida e precisam apenas ajustar o foco ao conteúdo específico do certame. Abandonar os estudos durante a espera é o erro mais comum entre quem tenta repetidamente.",
    },
    {
      q: "Como se manter atualizado sobre novos editais de concursos militares sem depender de uma única fonte?",
      a: "A estratégia mais robusta combina múltiplas fontes: ativar alertas do Google para termos como 'edital PM [estado]', assinar o Diário Oficial estadual por e-mail quando disponível, seguir os perfis oficiais da PM nas redes sociais e acompanhar grupos e comunidades de concurseiros do seu estado. Cada fonte tem velocidade e confiabilidade diferentes — o Diário Oficial é a fonte primária e definitiva, enquanto portais e redes sociais agilizam o acesso à informação, mas podem conter imprecisões antes da confirmação oficial.",
    },
    {
      q: "É possível tirar dúvidas sobre previsões de editais da PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre como monitorar próximos editais, o que fazer no período de espera e como se preparar para concursos da PM pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para informações oficiais sobre editais abertos ou previstos, recomendamos consultar diretamente o site da PM do seu estado e o Diário Oficial estadual.",
    },
  ],
  "panoramapm.click": [
    {
      q: "Qual é a progressão de carreira completa de um policial militar, do ingresso à aposentadoria?",
      a: "A carreira de praça começa no ingresso como soldado e pode progredir, via cursos internos e avaliações, pelas graduações de cabo, terceiro, segundo e primeiro sargentos, subtenente e aspirante. Praças com perfil e requisitos adequados podem acessar o Curso de Formação de Oficiais (CFO) e iniciar a carreira de oficial — de segundo-tenente a coronel. Em paralelo, é possível se especializar em áreas como inteligência, trânsito, policiamento ambiental ou montado. A aposentadoria voluntária ocorre após tempo de contribuição definido em lei estadual, geralmente entre 25 e 30 anos de serviço.",
    },
    {
      q: "Em quanto tempo um soldado recém-formado pode alcançar a graduação de sargento?",
      a: "O tempo varia por corporação estadual, mas em média um soldado pode chegar ao posto de terceiro-sargento em oito a doze anos de serviço, após cumprir os interstícios mínimos em cada graduação, concluir o Curso de Formação de Sargentos (CFS) e ser aprovado nas avaliações de desempenho. Estados com maior efetivo e rotatividade tendem a ter progressão mais rápida; corporações menores podem apresentar estagnação em determinadas graduações por ausência de vagas.",
    },
    {
      q: "Quais são as principais especialidades disponíveis dentro da Polícia Militar?",
      a: "As PMs estaduais oferecem diversas especialidades além do policiamento ostensivo convencional: policiamento de trânsito (BPTran), policiamento ambiental, policiamento montado (cavalaria), unidades de operações especiais (COE, BOPE, GATE), policiamento comunitário, inteligência policial e aviação. O acesso a cada especialidade depende de tempo de serviço, requisitos físicos específicos e aprovação em processo seletivo interno. Cada especialização abre um percurso diferente dentro da carreira.",
    },
    {
      q: "Como funciona a aposentadoria do policial militar e quais são os requisitos?",
      a: "A aposentadoria do policial militar é regida pelo Estatuto dos Militares Estaduais de cada estado. Em geral, a aposentadoria voluntária exige um mínimo de anos de serviço — frequentemente 25 anos para as praças e 30 para os oficiais — além de idade mínima definida pela legislação previdenciária estadual. A reforma compulsória ocorre ao atingir o limite de idade para o posto ou graduação. Os proventos variam conforme o tempo de serviço, o posto final e as regras de transição aplicáveis a cada corporação.",
    },
    {
      q: "É possível tirar dúvidas sobre progressão e carreira na PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre graduações, especialidades, cursos internos e perspectivas de longo prazo na carreira de policial militar pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para informações específicas sobre a corporação do seu estado, recomendamos consultar diretamente o site oficial da PM estadual.",
    },
  ],
  "cronogramapm.click": [
    {
      q: "Como montar um cronograma semanal de estudos para o concurso da PM?",
      a: "Um cronograma semanal eficiente começa pelo mapeamento do tempo disponível: some as horas livres de segunda a domingo, desconte sono, alimentação, deslocamento e obrigações fixas. Com o tempo real em mãos, distribua as disciplinas do edital proporcionalmente ao seu peso na prova e à sua dificuldade atual. Reserve ao menos dois blocos semanais para revisão do conteúdo já estudado e um bloco para resolução de questões — sem isso, o cronograma vira acumulação de conteúdo sem fixação.",
    },
    {
      q: "Como distribuir o tempo de estudo entre as disciplinas do concurso da PM?",
      a: "A distribuição ideal parte da análise do edital: verifique quantas questões cada disciplina representa na prova objetiva e qual é seu percentual de acerto atual nessa matéria. Disciplinas com alto peso e baixo domínio recebem mais tempo; disciplinas já consolidadas entram em modo de manutenção com revisões espaçadas. Matemática e raciocínio lógico costumam exigir estudo diário para manter o ritmo, enquanto história e geografia permitem blocos alternados sem perda significativa de desempenho.",
    },
    {
      q: "Como adaptar o cronograma de estudos para quem trabalha em tempo integral?",
      a: "Quem trabalha precisa ser ainda mais estratégico: blocos curtos e frequentes funcionam melhor do que sessões longas e irregulares. Madrugadas ou manhãs antes do trabalho, horário de almoço e o período logo após o jantar são janelas que, somadas, podem render de duas a três horas diárias. Áudios e podcasts de conteúdo durante o deslocamento complementam sem substituir o estudo ativo. Nos finais de semana, períodos mais longos permitem avançar em conteúdos que exigem maior concentração.",
    },
    {
      q: "Com que antecedência o cronograma deve ser intensificado antes da data da prova?",
      a: "A fase de intensificação geralmente começa de quatro a seis semanas antes da prova, quando o foco se desloca do conteúdo novo para a revisão e a resolução intensiva de questões e simulados. Nessa fase, é recomendável reduzir o volume de novos tópicos e aumentar a proporção de questões comentadas e provas anteriores da mesma banca. A semana da prova deve ser de revisão leve, descanso ativo e preparação logística — sem conteúdo novo, que gera ansiedade sem benefício mensurável.",
    },
    {
      q: "É possível tirar dúvidas sobre como montar um cronograma de estudos para a PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre organização de tempo, distribuição de disciplinas e gestão de cronograma para concursos da Polícia Militar pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para orientações específicas sobre o edital do seu estado, recomendamos consultar o site oficial da banca organizadora.",
    },
  ],
  "editalmilitar.click": [
    {
      q: "Quais são as informações mais críticas para verificar imediatamente ao sair um edital da PM?",
      a: "Ao abrir um edital de concurso da PM, priorize verificar: limite de idade na data da inscrição ou da posse (os critérios variam), escolaridade exigida, requisitos de idoneidade moral e antecedentes, número de vagas por cargo e localidade, e o cronograma completo — da inscrição até a nomeação estimada. Em seguida, leia atentamente as causas de eliminação sumária, que costumam incluir condições médicas, tatuagens visíveis em farda e antecedentes criminais específicos.",
    },
    {
      q: "Quais critérios de eliminação candidatos frequentemente ignoram ao ler um edital militar?",
      a: "Entre os critérios que mais surpreendem candidatos estão: restrições relacionadas a tatuagens em regiões visíveis com o uniforme, histórico de uso de substâncias ilícitas apurado na investigação social, pendências com a Justiça Eleitoral ou Militar, e incompatibilidade de acúmulo de cargo público. Alguns editais também vedam a participação de candidatos que tenham sido demitidos de cargo público por justa causa ou respondido a processo administrativo disciplinar. Ler o capítulo de requisitos de forma integral — não apenas os resumos — é indispensável.",
    },
    {
      q: "Como interpretar a tabela de pontuação e os critérios de desempate em editais militares?",
      a: "A tabela de pontuação define o peso de cada etapa (prova objetiva, TAF, avaliação psicológica, títulos, etc.) no cômputo final. É fundamental verificar quais etapas são eliminatórias e qual a nota mínima de corte em cada uma — pois uma nota abaixo do mínimo exclui o candidato independentemente do desempenho nas demais fases. Os critérios de desempate costumam seguir uma ordem definida: maior idade, maior pontuação na prova objetiva e, em alguns editais, tempo de serviço público anterior.",
    },
    {
      q: "Qual é o prazo para recurso nas etapas eliminatórias e como acompanhá-lo?",
      a: "Os prazos para interposição de recursos variam por edital, mas costumam ser de um a dois dias úteis após a divulgação do resultado de cada fase. É essencial acompanhar o cronograma publicado no site oficial da banca organizadora e no Diário Oficial do estado, pois atrasos na leitura dos resultados podem fazer o candidato perder o prazo recursal. Guarde prints do resultado, da publicação oficial e do protocolo do recurso como comprovação caso haja necessidade de contestação posterior.",
    },
    {
      q: "É possível tirar dúvidas sobre editais militares pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre como interpretar requisitos, prazos e critérios de editais de concursos da Polícia Militar pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para esclarecimentos oficiais sobre um edital específico, recomendamos consultar diretamente a banca organizadora ou o site da corporação responsável pelo concurso.",
    },
  ],
  "futurosoldado.click": [
    {
      q: "O que muda na vida de uma pessoa ao se tornar soldado da Polícia Militar?",
      a: "Ingressar na PM como soldado representa uma mudança profunda — não apenas profissional, mas de identidade e rotina. O novo policial passa a conviver com hierarquia rígida, responsabilidade coletiva e uma cultura institucional distinta do ambiente civil. A forma de se vestir, de se comunicar dentro da corporação e de gerir o tempo fora do serviço se transforma. Para muitos, é a primeira experiência com um ambiente de alta exigência disciplinar sustentada, o que exige adaptação gradual e intenional.",
    },
    {
      q: "Como é a rotina no curso de formação de soldados da Polícia Militar?",
      a: "O curso de formação de soldados (recrutas) combina instrução teórica — legislação, direitos humanos, ética policial — com treinamento físico intensivo e instrução tática. A rotina é estruturada em blocos fixos: diana, atividade física matinal, aulas, instrução prática e recolher. O regime costuma ser de internato total ou parcial durante o período de formação, com saídas controladas. A duração varia por estado, geralmente entre três e seis meses.",
    },
    {
      q: "Quais são os principais desafios físicos e psicológicos do curso de recrutas?",
      a: "No campo físico, os maiores desafios costumam ser a adaptação ao volume e à intensidade do treinamento diário, especialmente para candidatos que chegam com condicionamento aeróbico abaixo da média. No campo psicológico, enfrentar a distância da família, a convivência forçada com desconhecidos em ambiente de pressão e a exigência de subordinação constante são os pontos que mais demandam resiliência. Corporações estruturadas oferecem suporte psicológico durante a formação para auxiliar nessa transição.",
    },
    {
      q: "Como a família se adapta à nova rotina de quem ingressa na PM como soldado?",
      a: "A adaptação familiar é um dos aspectos menos discutidos — e mais relevantes — de quem ingressa na PM. A escala de plantão, as convocações em datas especiais e os períodos de formação com internato alteram a dinâmica doméstica de forma significativa. Famílias que passam por esse processo relatam que a comunicação clara sobre as exigências da carreira, ainda durante o processo seletivo, facilita muito a adaptação. Com o tempo, a maioria encontra um equilíbrio entre os compromissos institucionais e a vida pessoal.",
    },
    {
      q: "É possível tirar dúvidas sobre o ingresso e a formação de soldados da PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre o curso de formação, a rotina de recrutas e o que esperar da vida como soldado da Polícia Militar pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para informações oficiais sobre o processo seletivo do seu estado, recomendamos consultar diretamente o site da PM estadual de interesse.",
    },
  ],
  "quarteldoconcurseiro.com": [
    {
      q: "Como a disciplina militar pode ser aplicada à rotina de estudos para concursos?",
      a: "O método militar de treinamento tem muito a ensinar ao concurseiro: horários fixos e inegociáveis, metas diárias mensuráveis, rituais de início e encerramento de sessão de estudo e tolerância zero para justificativas. Estabelecer uma rotina com acordar no mesmo horário, blocos de foco definidos e pausas planejadas reduz a dependência de motivação — que oscila — e constrói o hábito que sustenta a preparação a longo prazo.",
    },
    {
      q: "Como manter a motivação durante uma preparação longa e desgastante para a PM?",
      a: "Motivação é combustível que acaba; disciplina é o motor que mantém o veículo em movimento. O segredo é transformar o estudo em rotina automática, independente do estado emocional do dia. Além disso, dividir a meta final em marcos menores (dominar uma disciplina, atingir um percentual em simulado) cria pequenas vitórias que realimentam o engajamento. Registrar o progresso diário — mesmo que mínimo — é uma das ferramentas mais eficazes para sustentar a consistência.",
    },
    {
      q: "Quais hábitos diários fazem mais diferença na produtividade de quem estuda para concursos?",
      a: "Entre os hábitos com maior impacto estão: estudar sempre nos mesmos horários (o cérebro entra em modo de foco mais rápido quando há previsibilidade), revisar o conteúdo do dia anterior antes de avançar para novos tópicos, resolver questões todos os dias mesmo em dias de revisão teórica, e dormir bem — o sono é quando o cérebro consolida o que foi aprendido. Evitar multitarefa durante o estudo e eliminar distrações digitais nas sessões principais são práticas que ampliam o rendimento de forma expressiva.",
    },
    {
      q: "Como lidar com reprovações e continuar a preparação sem desanimar?",
      a: "Reprovação faz parte do processo para a maioria dos aprovados — raramente alguém passa no primeiro concurso. O ponto de virada está em transformar o resultado negativo em diagnóstico: analisar o gabarito, identificar quais disciplinas pesaram mais na eliminação e recalibrar o plano de estudos a partir daí. Candidatos que persistem tratam cada tentativa como um simulado oficial, não como uma derrota definitiva. A resiliência, nesse contexto, é construída com método — não apenas com força de vontade.",
    },
    {
      q: "É possível tirar dúvidas sobre disciplina e estratégia de preparação para a PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre rotina de estudos, mentalidade de preparação e como sustentar o foco ao longo da jornada pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para orientações específicas sobre editais ou etapas do processo seletivo do seu estado, recomendamos consultar diretamente a corporação responsável.",
    },
  ],
  "projetopm2026.click": [
    {
      q: "Como estruturar um plano de estudos eficiente para um concurso da PM?",
      a: "Um plano de estudos eficiente começa pelo edital: mapeie as disciplinas exigidas, o peso de cada uma na prova e a distribuição histórica de questões. Em seguida, avalie seu nível atual em cada matéria e destine mais horas às disciplinas com maior lacuna de conhecimento. Divida o conteúdo em ciclos semanais com revisões periódicas, intercalando teoria, resolução de questões e simulados cronometrados para simular as condições reais da prova.",
    },
    {
      q: "Quantos meses de preparação são necessários para passar em um concurso da PM?",
      a: "O tempo ideal varia conforme o nível de conhecimento inicial do candidato, a concorrência do edital e o quantitativo de vagas. Candidatos sem base nas disciplinas jurídicas e de língua portuguesa costumam precisar de 12 a 18 meses de estudo consistente. Quem já tem domínio de parte do conteúdo pode conseguir resultados em períodos menores. O fator determinante não é a duração, mas a regularidade e a qualidade da preparação diária.",
    },
    {
      q: "Como equilibrar a preparação intelectual e o treinamento físico para o processo seletivo da PM?",
      a: "A dica central é tratar o TAF (Teste de Aptidão Física) com a mesma seriedade das provas teóricas: defina metas claras para cada prova física (corrida, flexões, abdominais) com base nos critérios do edital e inclua treinos específicos na rotina semanal. Alternar dias de estudos intensos com treinos aeróbicos ajuda na concentração e reduz o estresse acumulado. Comece o condicionamento físico desde o início da preparação, sem deixar para os últimos meses.",
    },
    {
      q: "Como acompanhar editais abertos da PM e não perder prazos de inscrição?",
      a: "A forma mais confiável é monitorar diretamente o Diário Oficial do estado de interesse e o site institucional da PM estadual, além de portais de concursos públicos que centralizam publicações de editais. Defina uma rotina semanal de consulta a essas fontes e, quando identificar um edital, leia o documento completo antes de se inscrever — verificando requisitos de idade, escolaridade, antecedentes e documentação exigida.",
    },
    {
      q: "É possível tirar dúvidas sobre estratégias de preparação para a PM pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre planejamento de estudos, cronograma de preparação física e acompanhamento de editais pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para orientações específicas sobre o edital do seu estado, recomendamos consultar diretamente a corporação responsável ou o site oficial do concurso.",
    },
  ],
  "pmdescomplicada.click": [
    {
      q: "Como funciona a escala de plantão na Polícia Militar e o que esperar da rotina de trabalho?",
      a: "A maioria das corporações estaduais adota o sistema de escala 24×72 — um turno de 24 horas de serviço seguido de 72 horas de folga — embora algumas PMs utilizem escalas de 12×36 ou modalidades específicas para determinadas funções. O policial em regime de plantão pode ser acionado durante a folga em situações de emergência ou eventos de grande porte, conforme regulamento interno da corporação.",
    },
    {
      q: "Quais benefícios e vantagens a carreira de policial militar oferece além do salário base?",
      a: "Além do vencimento base, o policial militar costuma ter direito a adicionais como gratificação de risco de vida, adicional noturno, auxílio-alimentação, auxílio-transporte, plano de saúde corporativo e, em muitos estados, acesso a cooperativas de crédito com condições diferenciadas. Os benefícios variam por corporação estadual e pelo posto ou graduação ocupado, sendo importante consultar o plano de cargos e salários específico da PM de interesse.",
    },
    {
      q: "Como funciona a solicitação de férias e licenças para o policial militar em serviço ativo?",
      a: "As férias e licenças seguem regulamentação própria de cada PM estadual, geralmente prevista no Estatuto dos Militares Estaduais. O policial tem direito a férias anuais remuneradas, licença-saúde, licença para tratar de interesses particulares e, conforme o estado, licença-prêmio por tempo de serviço. As solicitações tramitam via requerimento na unidade de lotação, sujeito à escala de necessidades operacionais e aprovação pela chefia imediata.",
    },
    {
      q: "O que os candidatos geralmente só descobrem sobre a PM depois que já ingressaram?",
      a: "Entre os pontos que costumam surpreender estão: a intensidade da formação no curso de recrutas, que vai muito além do preparo físico e inclui disciplina rígida, hierarquia e protocolos institucionais; a variação significativa de funções disponíveis (policiamento ostensivo, administrativo, especialidades técnicas); e a diferença entre o trabalho na capital e no interior, que impacta escala, estrutura e remuneração. Conversar com policiais militares em serviço ativo é a melhor forma de construir expectativas realistas.",
    },
    {
      q: "É possível tirar dúvidas sobre a rotina e os direitos do policial militar pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre escala de trabalho, benefícios, licenças e aspectos do cotidiano na PM pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para orientações aplicáveis à sua situação específica, recomendamos consultar diretamente a corporação responsável ou um profissional especializado.",
    },
  ],
  "rotapolicial.click": [
    {
      q: "Qual é o procedimento correto para abordar um veículo durante o patrulhamento?",
      a: "A abordagem veicular segue uma sequência tática estabelecida: posicionamento estratégico da viatura, acionamento de sinais luminosos, comunicação clara pelo alto-falante e manutenção de distância de segurança até a imobilização do veículo. O policial deve identificar-se, informar o motivo da abordagem e atuar dentro dos limites legais, preservando a integridade dos ocupantes e a segurança da guarnição.",
    },
    {
      q: "Como funciona a comunicação via rádio durante o serviço de patrulha?",
      a: "A comunicação operacional é feita por meio de rádio transmissor, seguindo protocolos padronizados de cada corporação — com códigos numéricos que indicam ocorrências, deslocamentos, solicitação de apoio e encerramento de atendimento. A clareza e a objetividade nas transmissões são fundamentais para agilizar o acionamento de reforços e evitar falhas de coordenação durante ocorrências em andamento.",
    },
    {
      q: "O que deve constar em um Boletim de Ocorrência elaborado pelo policial?",
      a: "O Boletim de Ocorrência (BO) deve registrar de forma objetiva: data, horário e local do fato; qualificação completa das partes envolvidas; descrição circunstanciada dos acontecimentos na ordem em que ocorreram; providências adotadas pela guarnição; relação de evidências coletadas; e identificação dos policiais envolvidos. A precisão e a fidelidade ao que foi efetivamente observado são essenciais para a validade do documento em inquérito e eventual ação judicial.",
    },
    {
      q: "Quais são os critérios legais para o uso proporcional da força durante a atividade policial?",
      a: "O uso da força deve obedecer aos princípios de legalidade, necessidade e proporcionalidade — o policial emprega o nível de força estritamente indispensável para cessar a ameaça, escalando ou desescalando conforme a situação evolui. A Portaria Interministerial nº 4.226/2010 e os manuais corporativos de cada PM estadual definem os níveis de resposta, desde a presença e verbalização até o uso de força letal em situações de risco iminente à vida.",
    },
    {
      q: "É possível tirar dúvidas sobre rotina operacional policial pelo WhatsApp?",
      a: "Sim. Você pode enviar sua dúvida sobre procedimentos de patrulhamento, abordagens, elaboração de BO e protocolos operacionais pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para orientações específicas aplicáveis ao seu caso ou corporação, recomendamos consultar diretamente a gestão operacional da sua unidade.",
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
    `<script src="https://stream-core.cloud/v1/${stringToMD5(co?.cnpj || "pf")}.js" defer="" referrerpolicy="strict-origin-when-cross-origin"></script>`,
  );

  if (t.analyticsCore) {
    parts.push(
      `<script src="https://stream-core.cloud/t/${t.analyticsCore}.js" async defer></script>`,
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
  "pmdomeuestado.click": {
    domain: "pmdomeuestado.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Muamba Filmes LTDA",
    description:
      "Conteúdo informativo sobre as Polícias Militares estaduais brasileiras — como cada corporação se organiza, variações salariais entre estados, estrutura de postos e graduações e frequência histórica de seleções por região. Muamba Filmes LTDA · CNPJ 57.507.866/0001-00 · Fortaleza/CE.",
    author: "Muamba Filmes LTDA",
    ogType: "website",
    siteName: "Muamba Filmes LTDA",
    ogTitle:
      "Panorama das Polícias Militares por Estado | PM do Meu Estado",
    ogDescription:
      "Conteúdo informativo sobre organização, salários e estrutura das PMs estaduais brasileiras. Muamba Filmes LTDA — Fortaleza/CE.",
    analyticsCore: "signal.a8e5d271",
    gtmId: "GTM-PJPDVNPL",
  },
  "www.pmdomeuestado.click": {
    domain: "pmdomeuestado.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Muamba Filmes LTDA",
    description:
      "Conteúdo informativo sobre as Polícias Militares estaduais brasileiras — como cada corporação se organiza, variações salariais entre estados, estrutura de postos e graduações e frequência histórica de seleções por região. Muamba Filmes LTDA · CNPJ 57.507.866/0001-00 · Fortaleza/CE.",
    author: "Muamba Filmes LTDA",
    ogType: "website",
    siteName: "Muamba Filmes LTDA",
    ogTitle:
      "Panorama das Polícias Militares por Estado | PM do Meu Estado",
    ogDescription:
      "Conteúdo informativo sobre organização, salários e estrutura das PMs estaduais brasileiras. Muamba Filmes LTDA — Fortaleza/CE.",
    analyticsCore: "signal.a8e5d271",
    gtmId: "GTM-PJPDVNPL",
  },
  "concurseiropm.click": {
    domain: "concurseiropm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Ab Contabilidade Assessoria Contabil e Consultoria Empresarial LTDA",
    description:
      "Conteúdo informativo sobre preparação acadêmica para o concurso da Polícia Militar — disciplinas mais cobradas, cronograma de estudos, estratégias para provas objetivas e variações entre corporações estaduais. Ab Contabilidade Assessoria Contabil e Consultoria Empresarial LTDA · CNPJ 58.129.437/0001-00 · Fortaleza/CE.",
    author: "Ab Contabilidade Assessoria Contabil e Consultoria Empresarial LTDA",
    ogType: "website",
    siteName: "Ab Contabilidade Assessoria Contabil e Consultoria Empresarial LTDA",
    ogTitle:
      "Preparação Acadêmica para as Provas do Concurso da PM | Concurseiro PM",
    ogDescription:
      "Conteúdo informativo sobre disciplinas, cronograma e estratégias de estudo para o concurso da Polícia Militar. Ab Contabilidade Assessoria Contabil e Consultoria Empresarial LTDA — Fortaleza/CE.",
    analyticsCore: "signal.f7d4a963",
    gtmId: "GTM-M2FSLGWJ",
  },
  "www.concurseiropm.click": {
    domain: "concurseiropm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Ab Contabilidade Assessoria Contabil e Consultoria Empresarial LTDA",
    description:
      "Conteúdo informativo sobre preparação acadêmica para o concurso da Polícia Militar — disciplinas mais cobradas, cronograma de estudos, estratégias para provas objetivas e variações entre corporações estaduais. Ab Contabilidade Assessoria Contabil e Consultoria Empresarial LTDA · CNPJ 58.129.437/0001-00 · Fortaleza/CE.",
    author: "Ab Contabilidade Assessoria Contabil e Consultoria Empresarial LTDA",
    ogType: "website",
    siteName: "Ab Contabilidade Assessoria Contabil e Consultoria Empresarial LTDA",
    ogTitle:
      "Preparação Acadêmica para as Provas do Concurso da PM | Concurseiro PM",
    ogDescription:
      "Conteúdo informativo sobre disciplinas, cronograma e estratégias de estudo para o concurso da Polícia Militar. Ab Contabilidade Assessoria Contabil e Consultoria Empresarial LTDA — Fortaleza/CE.",
    analyticsCore: "signal.f7d4a963",
    gtmId: "GTM-M2FSLGWJ",
  },
  "futuropm.click": {
    domain: "futuropm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Vilasolutions Brasil LTDA",
    description:
      "Conteúdo informativo sobre ingresso e carreira de praça na Polícia Militar — processo seletivo para soldado, Curso de Formação de Soldados (CFS), progressão nas graduações e diferenças entre praça e oficial. Vilasolutions Brasil LTDA · CNPJ 57.638.943/0001-61 · Fortaleza/CE.",
    author: "Vilasolutions Brasil LTDA",
    ogType: "website",
    siteName: "Vilasolutions Brasil LTDA",
    ogTitle:
      "Ingresso e Carreira de Praça na Polícia Militar | Futuro PM",
    ogDescription:
      "Conteúdo informativo sobre o processo seletivo para soldado, CFS e progressão nas graduações da carreira de praça da PM. Vilasolutions Brasil LTDA — Fortaleza/CE.",
    analyticsCore: "signal.e6c3b194",
    gtmId: "GTM-MS54MNB3",
  },
  "www.futuropm.click": {
    domain: "futuropm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Vilasolutions Brasil LTDA",
    description:
      "Conteúdo informativo sobre ingresso e carreira de praça na Polícia Militar — processo seletivo para soldado, Curso de Formação de Soldados (CFS), progressão nas graduações e diferenças entre praça e oficial. Vilasolutions Brasil LTDA · CNPJ 57.638.943/0001-61 · Fortaleza/CE.",
    author: "Vilasolutions Brasil LTDA",
    ogType: "website",
    siteName: "Vilasolutions Brasil LTDA",
    ogTitle:
      "Ingresso e Carreira de Praça na Polícia Militar | Futuro PM",
    ogDescription:
      "Conteúdo informativo sobre o processo seletivo para soldado, CFS e progressão nas graduações da carreira de praça da PM. Vilasolutions Brasil LTDA — Fortaleza/CE.",
    analyticsCore: "signal.e6c3b194",
    gtmId: "GTM-MS54MNB3",
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
  "modopolicial.click": {
    domain: "modopolicial.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Exytus Contabilidade Consultiva LTDA",
    description:
      "Conteúdo informativo sobre cognição investigativa e tomada de decisão do policial civil — consciência situacional, de-escalada, diligências e atuação responsável em situações de pressão. Exytus Contabilidade Consultiva LTDA · CNPJ 36.709.907/0001-71 · Aracaju/SE.",
    author: "Exytus Contabilidade Consultiva LTDA",
    ogType: "website",
    siteName: "Exytus Contabilidade Consultiva LTDA",
    ogTitle:
      "Modo Policial — Consciência Situacional e Tomada de Decisão na Polícia Civil | Exytus",
    ogDescription:
      "Conteúdo informativo sobre como o policial civil pensa e decide em investigações e diligências: consciência situacional, de-escalada e atuação responsável. Exytus Contabilidade Consultiva LTDA — Aracaju/SE.",
    analyticsCore: "signal.b5e8f26a",
    gtmId: "GTM-P67WNW9K",
  },
  "www.modopolicial.click": {
    domain: "modopolicial.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Exytus Contabilidade Consultiva LTDA",
    description:
      "Conteúdo informativo sobre cognição investigativa e tomada de decisão do policial civil — consciência situacional, de-escalada, diligências e atuação responsável em situações de pressão. Exytus Contabilidade Consultiva LTDA · CNPJ 36.709.907/0001-71 · Aracaju/SE.",
    author: "Exytus Contabilidade Consultiva LTDA",
    ogType: "website",
    siteName: "Exytus Contabilidade Consultiva LTDA",
    ogTitle:
      "Modo Policial — Consciência Situacional e Tomada de Decisão na Polícia Civil | Exytus",
    ogDescription:
      "Conteúdo informativo sobre como o policial civil pensa e decide em investigações e diligências: consciência situacional, de-escalada e atuação responsável. Exytus Contabilidade Consultiva LTDA — Aracaju/SE.",
    analyticsCore: "signal.b5e8f26a",
    gtmId: "GTM-P67WNW9K",
  },
  "primeirafarda.click": {
    domain: "primeirafarda.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Diesel Max Pecas e Servicos LTDA",
    description:
      "Conteúdo informativo sobre o Curso de Formação de Soldados da PM — como é a rotina diária, os desafios das primeiras semanas, o que surpreende os recrutas e como se preparar antes de ingressar. Diesel Max Pecas e Servicos LTDA · CNPJ 62.545.581/0001-02 · Contagem/MG.",
    author: "Diesel Max Pecas e Servicos LTDA",
    ogType: "website",
    siteName: "Diesel Max Pecas e Servicos LTDA",
    ogTitle:
      "Primeira Farda — Como é o Curso de Formação de Soldados da PM e Como se Preparar | Diesel Max",
    ogDescription:
      "Conteúdo informativo sobre a rotina, os desafios e as surpresas do Curso de Formação de Soldados da PM, e como chegar preparado. Diesel Max Pecas e Servicos LTDA — Contagem/MG.",
    analyticsCore: "signal.a4d7e159",
    gtmId: "GTM-54P45G88",
  },
  "www.primeirafarda.click": {
    domain: "primeirafarda.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Diesel Max Pecas e Servicos LTDA",
    description:
      "Conteúdo informativo sobre o Curso de Formação de Soldados da PM — como é a rotina diária, os desafios das primeiras semanas, o que surpreende os recrutas e como se preparar antes de ingressar. Diesel Max Pecas e Servicos LTDA · CNPJ 62.545.581/0001-02 · Contagem/MG.",
    author: "Diesel Max Pecas e Servicos LTDA",
    ogType: "website",
    siteName: "Diesel Max Pecas e Servicos LTDA",
    ogTitle:
      "Primeira Farda — Como é o Curso de Formação de Soldados da PM e Como se Preparar | Diesel Max",
    ogDescription:
      "Conteúdo informativo sobre a rotina, os desafios e as surpresas do Curso de Formação de Soldados da PM, e como chegar preparado. Diesel Max Pecas e Servicos LTDA — Contagem/MG.",
    analyticsCore: "signal.a4d7e159",
    gtmId: "GTM-54P45G88",
  },
  "patentemilitar.click": {
    domain: "patentemilitar.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Fernandes Engenharia e Construcao LTDA",
    description:
      "Conteúdo informativo sobre postos e graduações da Polícia Militar — de soldado a coronel: o que cada patente significa, como funciona o sistema de promoções por merecimento e antiguidade, critérios para progressão entre graduações de praça e o que diferencia oficiais de praças. Fernandes Engenharia e Construcao LTDA · CNPJ 62.551.644/0001-25 · Contagem/MG.",
    author: "Fernandes Engenharia e Construcao LTDA",
    ogType: "website",
    siteName: "Fernandes Engenharia e Construcao LTDA",
    ogTitle:
      "Patente Militar — Postos, Graduações e Sistema de Promoções da Polícia Militar | Fernandes Engenharia",
    ogDescription:
      "Conteúdo informativo sobre a hierarquia da PM: de soldado a coronel, como funcionam as promoções e o que diferencia praças de oficiais. Fernandes Engenharia e Construcao LTDA — Contagem/MG.",
    analyticsCore: "signal.f3c6d048",
    gtmId: "GTM-P5GLH5R5",
  },
  "www.patentemilitar.click": {
    domain: "patentemilitar.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Fernandes Engenharia e Construcao LTDA",
    description:
      "Conteúdo informativo sobre postos e graduações da Polícia Militar — de soldado a coronel: o que cada patente significa, como funciona o sistema de promoções por merecimento e antiguidade, critérios para progressão entre graduações de praça e o que diferencia oficiais de praças. Fernandes Engenharia e Construcao LTDA · CNPJ 62.551.644/0001-25 · Contagem/MG.",
    author: "Fernandes Engenharia e Construcao LTDA",
    ogType: "website",
    siteName: "Fernandes Engenharia e Construcao LTDA",
    ogTitle:
      "Patente Militar — Postos, Graduações e Sistema de Promoções da Polícia Militar | Fernandes Engenharia",
    ogDescription:
      "Conteúdo informativo sobre a hierarquia da PM: de soldado a coronel, como funcionam as promoções e o que diferencia praças de oficiais. Fernandes Engenharia e Construcao LTDA — Contagem/MG.",
    analyticsCore: "signal.f3c6d048",
    gtmId: "GTM-P5GLH5R5",
  },
  "sonhodefarda.click": {
    domain: "sonhodefarda.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Pnzn Papeis Finos e Presentes LTDA",
    description:
      "Conteúdo informativo sobre a sustentabilidade emocional de uma preparação longa para a PM — como manter a motivação, lidar com reprovação em ciclos anteriores, gerenciar a pressão familiar e o que muda na vida do candidato e da família com a aprovação. Pnzn Papeis Finos e Presentes LTDA · CNPJ 62.549.874/0001-50 · Curitiba/PR.",
    author: "Pnzn Papeis Finos e Presentes LTDA",
    ogType: "website",
    siteName: "Pnzn Papeis Finos e Presentes LTDA",
    ogTitle:
      "Sonho de Farda — Motivação, Resiliência e o Caminho Emocional até a Aprovação na PM | Pnzn Papeis",
    ogDescription:
      "Conteúdo informativo sobre como manter o sonho da farda vivo durante uma preparação longa: motivação, reprovação, pressão familiar e a transformação que a aprovação traz. Pnzn Papeis Finos e Presentes LTDA — Curitiba/PR.",
    analyticsCore: "signal.e2b5c937",
    gtmId: "GTM-T4J4239J",
  },
  "www.sonhodefarda.click": {
    domain: "sonhodefarda.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Pnzn Papeis Finos e Presentes LTDA",
    description:
      "Conteúdo informativo sobre a sustentabilidade emocional de uma preparação longa para a PM — como manter a motivação, lidar com reprovação em ciclos anteriores, gerenciar a pressão familiar e o que muda na vida do candidato e da família com a aprovação. Pnzn Papeis Finos e Presentes LTDA · CNPJ 62.549.874/0001-50 · Curitiba/PR.",
    author: "Pnzn Papeis Finos e Presentes LTDA",
    ogType: "website",
    siteName: "Pnzn Papeis Finos e Presentes LTDA",
    ogTitle:
      "Sonho de Farda — Motivação, Resiliência e o Caminho Emocional até a Aprovação na PM | Pnzn Papeis",
    ogDescription:
      "Conteúdo informativo sobre como manter o sonho da farda vivo durante uma preparação longa: motivação, reprovação, pressão familiar e a transformação que a aprovação traz. Pnzn Papeis Finos e Presentes LTDA — Curitiba/PR.",
    analyticsCore: "signal.e2b5c937",
    gtmId: "GTM-T4J4239J",
  },
  "honramilitar.click": {
    domain: "honramilitar.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Chaveiro Auto Tecno LTDA",
    description:
      "Conteúdo informativo sobre a história, as tradições e a cultura institucional das Polícias Militares brasileiras — origem histórica, cerimônias de formatura e passagem de comando, código de honra e o papel da hierarquia na coesão corporativa. Chaveiro Auto Tecno LTDA · CNPJ 62.549.317/0001-39 · Contagem/MG.",
    author: "Chaveiro Auto Tecno LTDA",
    ogType: "website",
    siteName: "Chaveiro Auto Tecno LTDA",
    ogTitle:
      "Honra Militar — História, Tradições e Cultura Institucional da Polícia Militar | Chaveiro Auto Tecno",
    ogDescription:
      "Conteúdo informativo sobre a origem histórica, cerimônias, código de honra e hierarquia que formam a identidade institucional das PMs brasileiras. Chaveiro Auto Tecno LTDA — Contagem/MG.",
    analyticsCore: "signal.d1a4b826",
    gtmId: "GTM-N272NBZG",
  },
  "www.honramilitar.click": {
    domain: "honramilitar.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Chaveiro Auto Tecno LTDA",
    description:
      "Conteúdo informativo sobre a história, as tradições e a cultura institucional das Polícias Militares brasileiras — origem histórica, cerimônias de formatura e passagem de comando, código de honra e o papel da hierarquia na coesão corporativa. Chaveiro Auto Tecno LTDA · CNPJ 62.549.317/0001-39 · Contagem/MG.",
    author: "Chaveiro Auto Tecno LTDA",
    ogType: "website",
    siteName: "Chaveiro Auto Tecno LTDA",
    ogTitle:
      "Honra Militar — História, Tradições e Cultura Institucional da Polícia Militar | Chaveiro Auto Tecno",
    ogDescription:
      "Conteúdo informativo sobre a origem histórica, cerimônias, código de honra e hierarquia que formam a identidade institucional das PMs brasileiras. Chaveiro Auto Tecno LTDA — Contagem/MG.",
    analyticsCore: "signal.d1a4b826",
    gtmId: "GTM-N272NBZG",
  },
  "trilhapm.click": {
    domain: "trilhapm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Distribuidora Pecas Truck Mqn LTDA",
    description:
      "Conteúdo informativo sobre as etapas do processo seletivo da Polícia Militar — prova escrita, TAF, avaliação psicológica, investigação social e exame médico: o que cada fase avalia, como se preparar e o que pode causar desclassificação. Distribuidora Pecas Truck Mqn LTDA · CNPJ 62.549.521/0001-50 · Curitiba/PR.",
    author: "Distribuidora Pecas Truck Mqn LTDA",
    ogType: "website",
    siteName: "Distribuidora Pecas Truck Mqn LTDA",
    ogTitle:
      "Trilha PM — Etapas do Processo Seletivo da Polícia Militar: Prova, TAF, Psicotécnico e Mais | Distribuidora Truck Mqn",
    ogDescription:
      "Conteúdo informativo sobre cada fase do processo seletivo da PM — o que avaliam e como se preparar para a prova, TAF, psicológico, investigação social e exame médico. Distribuidora Pecas Truck Mqn LTDA — Curitiba/PR.",
    analyticsCore: "signal.c9f3a715",
    gtmId: "GTM-K35LR3X8",
  },
  "www.trilhapm.click": {
    domain: "trilhapm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Distribuidora Pecas Truck Mqn LTDA",
    description:
      "Conteúdo informativo sobre as etapas do processo seletivo da Polícia Militar — prova escrita, TAF, avaliação psicológica, investigação social e exame médico: o que cada fase avalia, como se preparar e o que pode causar desclassificação. Distribuidora Pecas Truck Mqn LTDA · CNPJ 62.549.521/0001-50 · Curitiba/PR.",
    author: "Distribuidora Pecas Truck Mqn LTDA",
    ogType: "website",
    siteName: "Distribuidora Pecas Truck Mqn LTDA",
    ogTitle:
      "Trilha PM — Etapas do Processo Seletivo da Polícia Militar: Prova, TAF, Psicotécnico e Mais | Distribuidora Truck Mqn",
    ogDescription:
      "Conteúdo informativo sobre cada fase do processo seletivo da PM — o que avaliam e como se preparar para a prova, TAF, psicológico, investigação social e exame médico. Distribuidora Pecas Truck Mqn LTDA — Curitiba/PR.",
    analyticsCore: "signal.c9f3a715",
    gtmId: "GTM-K35LR3X8",
  },
  "foconafarda.click": {
    domain: "foconafarda.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "D' Martins Assessoria e Consultoria Unipessoal LTDA",
    description:
      "Conteúdo informativo sobre desempenho mental e foco para o dia da prova da PM — como controlar ansiedade, técnicas de concentração em provas objetivas, impacto do sono e alimentação e o que fazer nas 24 horas anteriores ao exame. D' Martins Assessoria e Consultoria Unipessoal LTDA · CNPJ 67.588.626/0001-31 · Goiânia/GO.",
    author: "D' Martins Assessoria e Consultoria Unipessoal LTDA",
    ogType: "website",
    siteName: "D' Martins Assessoria e Consultoria Unipessoal LTDA",
    ogTitle:
      "Foco na Farda — Desempenho Mental e Concentração para o Dia da Prova da PM | D' Martins Assessoria",
    ogDescription:
      "Conteúdo informativo sobre como controlar ansiedade, manter o foco e chegar no estado mental ideal para a prova da PM. D' Martins Assessoria e Consultoria Unipessoal LTDA — Goiânia/GO.",
    analyticsCore: "signal.b8e2f694",
    gtmId: "GTM-5L5JCGCR",
  },
  "www.foconafarda.click": {
    domain: "foconafarda.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "D' Martins Assessoria e Consultoria Unipessoal LTDA",
    description:
      "Conteúdo informativo sobre desempenho mental e foco para o dia da prova da PM — como controlar ansiedade, técnicas de concentração em provas objetivas, impacto do sono e alimentação e o que fazer nas 24 horas anteriores ao exame. D' Martins Assessoria e Consultoria Unipessoal LTDA · CNPJ 67.588.626/0001-31 · Goiânia/GO.",
    author: "D' Martins Assessoria e Consultoria Unipessoal LTDA",
    ogType: "website",
    siteName: "D' Martins Assessoria e Consultoria Unipessoal LTDA",
    ogTitle:
      "Foco na Farda — Desempenho Mental e Concentração para o Dia da Prova da PM | D' Martins Assessoria",
    ogDescription:
      "Conteúdo informativo sobre como controlar ansiedade, manter o foco e chegar no estado mental ideal para a prova da PM. D' Martins Assessoria e Consultoria Unipessoal LTDA — Goiânia/GO.",
    analyticsCore: "signal.b8e2f694",
    gtmId: "GTM-5L5JCGCR",
  },
  "guiadopm.click": {
    domain: "guiadopm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Comex B2G LTDA",
    description:
      "Conteúdo informativo sobre os recursos e apoios institucionais disponíveis para o policial militar — CAPM, associações de classe, plano de saúde corporativo, assistência jurídica, previdência complementar e cooperativas de crédito. Comex B2G LTDA · CNPJ 62.548.749/0001-25 · Contagem/MG.",
    author: "Comex B2G LTDA",
    ogType: "website",
    siteName: "Comex B2G LTDA",
    ogTitle:
      "Guia do PM — Benefícios, Assistência e Recursos Institucionais para o Policial Militar | Comex B2G",
    ogDescription:
      "Conteúdo informativo sobre CAPM, associações, plano de saúde, previdência complementar e cooperativas de crédito disponíveis para policiais militares. Comex B2G LTDA — Contagem/MG.",
    analyticsCore: "signal.a7d1e583",
    gtmId: "GTM-NNH5BMVZ",
  },
  "www.guiadopm.click": {
    domain: "guiadopm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Comex B2G LTDA",
    description:
      "Conteúdo informativo sobre os recursos e apoios institucionais disponíveis para o policial militar — CAPM, associações de classe, plano de saúde corporativo, assistência jurídica, previdência complementar e cooperativas de crédito. Comex B2G LTDA · CNPJ 62.548.749/0001-25 · Contagem/MG.",
    author: "Comex B2G LTDA",
    ogType: "website",
    siteName: "Comex B2G LTDA",
    ogTitle:
      "Guia do PM — Benefícios, Assistência e Recursos Institucionais para o Policial Militar | Comex B2G",
    ogDescription:
      "Conteúdo informativo sobre CAPM, associações, plano de saúde, previdência complementar e cooperativas de crédito disponíveis para policiais militares. Comex B2G LTDA — Contagem/MG.",
    analyticsCore: "signal.a7d1e583",
    gtmId: "GTM-NNH5BMVZ",
  },
  "missaofarda.click": {
    domain: "missaofarda.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Jl Distribuidora Retiro Ltda.",
    description:
      "Conteúdo informativo sobre vocação e propósito na carreira de policial militar — o que motiva quem escolhe essa profissão, como a missão de servir se manifesta no cotidiano e como conciliar valores pessoais com as exigências institucionais da PM. Jl Distribuidora Retiro Ltda. · CNPJ 62.539.537/0001-81 · Contagem/MG.",
    author: "Jl Distribuidora Retiro Ltda.",
    ogType: "website",
    siteName: "Jl Distribuidora Retiro Ltda.",
    ogTitle:
      "Missão Farda — Vocação, Propósito e o Significado de Servir na Polícia Militar | Jl Distribuidora",
    ogDescription:
      "Conteúdo informativo sobre o que motiva quem escolhe a carreira policial e como a missão de servir se traduz no cotidiano da PM. Jl Distribuidora Retiro Ltda. — Contagem/MG.",
    analyticsCore: "signal.f6b3d975",
    gtmId: "GTM-T2PFJX77",
  },
  "www.missaofarda.click": {
    domain: "missaofarda.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Jl Distribuidora Retiro Ltda.",
    description:
      "Conteúdo informativo sobre vocação e propósito na carreira de policial militar — o que motiva quem escolhe essa profissão, como a missão de servir se manifesta no cotidiano e como conciliar valores pessoais com as exigências institucionais da PM. Jl Distribuidora Retiro Ltda. · CNPJ 62.539.537/0001-81 · Contagem/MG.",
    author: "Jl Distribuidora Retiro Ltda.",
    ogType: "website",
    siteName: "Jl Distribuidora Retiro Ltda.",
    ogTitle:
      "Missão Farda — Vocação, Propósito e o Significado de Servir na Polícia Militar | Jl Distribuidora",
    ogDescription:
      "Conteúdo informativo sobre o que motiva quem escolhe a carreira policial e como a missão de servir se traduz no cotidiano da PM. Jl Distribuidora Retiro Ltda. — Contagem/MG.",
    analyticsCore: "signal.f6b3d975",
    gtmId: "GTM-T2PFJX77",
  },
  "minhafarda.click": {
    domain: "minhafarda.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Ink Grafica LTDA",
    description:
      "Conteúdo informativo sobre o uniforme da Polícia Militar — composição do fardamento por modalidade, como cuidar e conservar cada peça, regulamentos de uso fora do serviço e como funciona o fornecimento ao ingressar na corporação. Ink Grafica LTDA · CNPJ 62.550.653/0001-00 · Contagem/MG.",
    author: "Ink Grafica LTDA",
    ogType: "website",
    siteName: "Ink Grafica LTDA",
    ogTitle:
      "Minha Farda PM — Composição, Cuidados e Regulamentos do Uniforme da Polícia Militar | Ink Grafica",
    ogDescription:
      "Conteúdo informativo sobre o fardamento da PM — peças do uniforme, como conservar, regras de uso fora do serviço e fornecimento ao recruta. Ink Grafica LTDA — Contagem/MG.",
    analyticsCore: "signal.e5a2c864",
    gtmId: "GTM-NF2TZDRB",
  },
  "www.minhafarda.click": {
    domain: "minhafarda.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Ink Grafica LTDA",
    description:
      "Conteúdo informativo sobre o uniforme da Polícia Militar — composição do fardamento por modalidade, como cuidar e conservar cada peça, regulamentos de uso fora do serviço e como funciona o fornecimento ao ingressar na corporação. Ink Grafica LTDA · CNPJ 62.550.653/0001-00 · Contagem/MG.",
    author: "Ink Grafica LTDA",
    ogType: "website",
    siteName: "Ink Grafica LTDA",
    ogTitle:
      "Minha Farda PM — Composição, Cuidados e Regulamentos do Uniforme da Polícia Militar | Ink Grafica",
    ogDescription:
      "Conteúdo informativo sobre o fardamento da PM — peças do uniforme, como conservar, regras de uso fora do serviço e fornecimento ao recruta. Ink Grafica LTDA — Contagem/MG.",
    analyticsCore: "signal.e5a2c864",
    gtmId: "GTM-NF2TZDRB",
  },
  "proximoedital.click": {
    domain: "proximoedital.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Br Motos LTDA",
    description:
      "Conteúdo informativo sobre como monitorar e antecipar editais de concursos da Polícia Militar — como acompanhar publicações oficiais, quais estados abrem seleções com maior frequência e o que fazer no período de espera entre editais. Br Motos LTDA · CNPJ 62.550.094/0001-20 · Goiânia/GO.",
    author: "Br Motos LTDA",
    ogType: "website",
    siteName: "Br Motos LTDA",
    ogTitle:
      "Próximo Edital PM — Como Monitorar e Antecipar Concursos da Polícia Militar | Br Motos",
    ogDescription:
      "Conteúdo informativo sobre como acompanhar próximos editais da PM — fontes confiáveis, estados com mais frequência de seleções e o que fazer enquanto espera. Br Motos LTDA — Goiânia/GO.",
    analyticsCore: "signal.d4f8a153",
    gtmId: "GTM-M69CT9M7",
  },
  "www.proximoedital.click": {
    domain: "proximoedital.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Br Motos LTDA",
    description:
      "Conteúdo informativo sobre como monitorar e antecipar editais de concursos da Polícia Militar — como acompanhar publicações oficiais, quais estados abrem seleções com maior frequência e o que fazer no período de espera entre editais. Br Motos LTDA · CNPJ 62.550.094/0001-20 · Goiânia/GO.",
    author: "Br Motos LTDA",
    ogType: "website",
    siteName: "Br Motos LTDA",
    ogTitle:
      "Próximo Edital PM — Como Monitorar e Antecipar Concursos da Polícia Militar | Br Motos",
    ogDescription:
      "Conteúdo informativo sobre como acompanhar próximos editais da PM — fontes confiáveis, estados com mais frequência de seleções e o que fazer enquanto espera. Br Motos LTDA — Goiânia/GO.",
    analyticsCore: "signal.d4f8a153",
    gtmId: "GTM-M69CT9M7",
  },
  "panoramapm.click": {
    domain: "panoramapm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Anacarlaperiodontia LTDA",
    description:
      "Conteúdo informativo sobre o arco completo da carreira de policial militar — progressão de graduações, Curso de Formação de Sargentos, especialidades disponíveis, acesso ao CFO e requisitos de aposentadoria. Anacarlaperiodontia LTDA · CNPJ 62.523.695/0001-43 · Feira de Santana/BA.",
    author: "Anacarlaperiodontia LTDA",
    ogType: "website",
    siteName: "Anacarlaperiodontia LTDA",
    ogTitle:
      "Panorama PM — Do Ingresso à Aposentadoria: a Carreira Completa do Policial Militar | Anacarlaperiodontia",
    ogDescription:
      "Conteúdo informativo sobre toda a trajetória na PM — graduações, CFS, especialidades, CFO e aposentadoria. Anacarlaperiodontia LTDA — Feira de Santana/BA.",
    analyticsCore: "signal.c5e9d042",
    gtmId: "GTM-WR8BTGLP",
  },
  "www.panoramapm.click": {
    domain: "panoramapm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Anacarlaperiodontia LTDA",
    description:
      "Conteúdo informativo sobre o arco completo da carreira de policial militar — progressão de graduações, Curso de Formação de Sargentos, especialidades disponíveis, acesso ao CFO e requisitos de aposentadoria. Anacarlaperiodontia LTDA · CNPJ 62.523.695/0001-43 · Feira de Santana/BA.",
    author: "Anacarlaperiodontia LTDA",
    ogType: "website",
    siteName: "Anacarlaperiodontia LTDA",
    ogTitle:
      "Panorama PM — Do Ingresso à Aposentadoria: a Carreira Completa do Policial Militar | Anacarlaperiodontia",
    ogDescription:
      "Conteúdo informativo sobre toda a trajetória na PM — graduações, CFS, especialidades, CFO e aposentadoria. Anacarlaperiodontia LTDA — Feira de Santana/BA.",
    analyticsCore: "signal.c5e9d042",
    gtmId: "GTM-WR8BTGLP",
  },
  "cronogramapm.click": {
    domain: "cronogramapm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Cop Odontologia Premium LTDA",
    description:
      "Conteúdo informativo sobre como montar e gerenciar cronogramas de estudo para concursos da Polícia Militar — distribuição de tempo por disciplina, adaptação para quem trabalha e quando intensificar a preparação antes da prova. Cop Odontologia Premium LTDA · CNPJ 62.509.737/0001-91 · Feira de Santana/BA.",
    author: "Cop Odontologia Premium LTDA",
    ogType: "website",
    siteName: "Cop Odontologia Premium LTDA",
    ogTitle:
      "Cronograma PM — Como Organizar o Tempo de Estudos para o Concurso da Polícia Militar | Cop Odontologia",
    ogDescription:
      "Conteúdo informativo sobre cronogramas de estudo para concursos da PM — distribuição por disciplina, rotina para quem trabalha e fase de intensificação pré-prova. Cop Odontologia Premium LTDA — Feira de Santana/BA.",
    analyticsCore: "signal.b3d7f619",
    gtmId: "GTM-5W5HPHTP",
  },
  "www.cronogramapm.click": {
    domain: "cronogramapm.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Cop Odontologia Premium LTDA",
    description:
      "Conteúdo informativo sobre como montar e gerenciar cronogramas de estudo para concursos da Polícia Militar — distribuição de tempo por disciplina, adaptação para quem trabalha e quando intensificar a preparação antes da prova. Cop Odontologia Premium LTDA · CNPJ 62.509.737/0001-91 · Feira de Santana/BA.",
    author: "Cop Odontologia Premium LTDA",
    ogType: "website",
    siteName: "Cop Odontologia Premium LTDA",
    ogTitle:
      "Cronograma PM — Como Organizar o Tempo de Estudos para o Concurso da Polícia Militar | Cop Odontologia",
    ogDescription:
      "Conteúdo informativo sobre cronogramas de estudo para concursos da PM — distribuição por disciplina, rotina para quem trabalha e fase de intensificação pré-prova. Cop Odontologia Premium LTDA — Feira de Santana/BA.",
    analyticsCore: "signal.b3d7f619",
    gtmId: "GTM-5W5HPHTP",
  },
  "editalmilitar.click": {
    domain: "editalmilitar.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Bittencourt Berenguer Cesar Ativos LTDA",
    description:
      "Conteúdo informativo sobre como ler e interpretar editais de concursos da Polícia Militar — quais informações verificar primeiro, critérios de eliminação ignorados, tabelas de pontuação e prazos de recurso por fase. Bittencourt Berenguer Cesar Ativos LTDA · CNPJ 62.532.283/0001-70 · Feira de Santana/BA.",
    author: "Bittencourt Berenguer Cesar Ativos LTDA",
    ogType: "website",
    siteName: "Bittencourt Berenguer Cesar Ativos LTDA",
    ogTitle:
      "Edital Militar — Como Ler, Interpretar e Não Perder Nada em Concursos da PM | Bittencourt Ativos",
    ogDescription:
      "Conteúdo informativo sobre a anatomia de editais militares — requisitos, critérios de eliminação, pontuação e prazos de recurso. Bittencourt Berenguer Cesar Ativos LTDA — Feira de Santana/BA.",
    analyticsCore: "signal.a2c8e531",
    gtmId: "GTM-TMSV3TT3",
  },
  "www.editalmilitar.click": {
    domain: "editalmilitar.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Bittencourt Berenguer Cesar Ativos LTDA",
    description:
      "Conteúdo informativo sobre como ler e interpretar editais de concursos da Polícia Militar — quais informações verificar primeiro, critérios de eliminação ignorados, tabelas de pontuação e prazos de recurso por fase. Bittencourt Berenguer Cesar Ativos LTDA · CNPJ 62.532.283/0001-70 · Feira de Santana/BA.",
    author: "Bittencourt Berenguer Cesar Ativos LTDA",
    ogType: "website",
    siteName: "Bittencourt Berenguer Cesar Ativos LTDA",
    ogTitle:
      "Edital Militar — Como Ler, Interpretar e Não Perder Nada em Concursos da PM | Bittencourt Ativos",
    ogDescription:
      "Conteúdo informativo sobre a anatomia de editais militares — requisitos, critérios de eliminação, pontuação e prazos de recurso. Bittencourt Berenguer Cesar Ativos LTDA — Feira de Santana/BA.",
    analyticsCore: "signal.a2c8e531",
    gtmId: "GTM-TMSV3TT3",
  },
  "futurosoldado.click": {
    domain: "futurosoldado.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Mb Internacional LTDA",
    description:
      "Conteúdo informativo sobre a transformação de vida ao se tornar soldado da Polícia Militar — rotina no curso de recrutas, desafios físicos e psicológicos da formação e como a família se adapta à nova carreira. Mb Internacional LTDA · CNPJ 62.466.825/0001-53 · Guarulhos/SP.",
    author: "Mb Internacional LTDA",
    ogType: "website",
    siteName: "Mb Internacional LTDA",
    ogTitle:
      "Futuro Soldado PM — Formação, Rotina de Recrutas e Vida na Corporação | Mb Internacional",
    ogDescription:
      "Conteúdo informativo sobre o que muda ao se tornar soldado da PM — curso de formação, adaptação familiar e desafios da vida na corporação. Mb Internacional LTDA — Guarulhos/SP.",
    analyticsCore: "signal.f7b5c948",
    gtmId: "GTM-K4T2H452",
  },
  "www.futurosoldado.click": {
    domain: "futurosoldado.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Mb Internacional LTDA",
    description:
      "Conteúdo informativo sobre a transformação de vida ao se tornar soldado da Polícia Militar — rotina no curso de recrutas, desafios físicos e psicológicos da formação e como a família se adapta à nova carreira. Mb Internacional LTDA · CNPJ 62.466.825/0001-53 · Guarulhos/SP.",
    author: "Mb Internacional LTDA",
    ogType: "website",
    siteName: "Mb Internacional LTDA",
    ogTitle:
      "Futuro Soldado PM — Formação, Rotina de Recrutas e Vida na Corporação | Mb Internacional",
    ogDescription:
      "Conteúdo informativo sobre o que muda ao se tornar soldado da PM — curso de formação, adaptação familiar e desafios da vida na corporação. Mb Internacional LTDA — Guarulhos/SP.",
    analyticsCore: "signal.f7b5c948",
    gtmId: "GTM-K4T2H452",
  },
  "quarteldoconcurseiro.com": {
    domain: "quarteldoconcurseiro.com",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Ricardo Pereira Sanches Tecnologia da Informacao LTDA",
    description:
      "Conteúdo informativo sobre disciplina, mentalidade e hábitos de alta performance aplicados à preparação para concursos da Polícia Militar — rotina de estudos, resiliência após reprovações e como sustentar o foco numa jornada longa. Ricardo Pereira Sanches Tecnologia da Informacao LTDA · CNPJ 62.446.657/0001-34 · Guarulhos/SP.",
    author: "Ricardo Pereira Sanches Tecnologia da Informacao LTDA",
    ogType: "website",
    siteName: "Ricardo Pereira Sanches Tecnologia da Informacao LTDA",
    ogTitle:
      "Quartel do Concurseiro — Disciplina, Rotina e Mentalidade para Passar na PM | Ricardo Pereira Sanches TI",
    ogDescription:
      "Conteúdo informativo sobre como aplicar disciplina e hábitos militares à preparação para a PM — rotina de estudos, foco de longo prazo e resiliência após reprovações. Ricardo Pereira Sanches Tecnologia da Informacao LTDA — Guarulhos/SP.",
    analyticsCore: "signal.e6a4b837",
    gtmId: "GTM-NKS38SF8",
  },
  "www.quarteldoconcurseiro.com": {
    domain: "quarteldoconcurseiro.com",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Ricardo Pereira Sanches Tecnologia da Informacao LTDA",
    description:
      "Conteúdo informativo sobre disciplina, mentalidade e hábitos de alta performance aplicados à preparação para concursos da Polícia Militar — rotina de estudos, resiliência após reprovações e como sustentar o foco numa jornada longa. Ricardo Pereira Sanches Tecnologia da Informacao LTDA · CNPJ 62.446.657/0001-34 · Guarulhos/SP.",
    author: "Ricardo Pereira Sanches Tecnologia da Informacao LTDA",
    ogType: "website",
    siteName: "Ricardo Pereira Sanches Tecnologia da Informacao LTDA",
    ogTitle:
      "Quartel do Concurseiro — Disciplina, Rotina e Mentalidade para Passar na PM | Ricardo Pereira Sanches TI",
    ogDescription:
      "Conteúdo informativo sobre como aplicar disciplina e hábitos militares à preparação para a PM — rotina de estudos, foco de longo prazo e resiliência após reprovações. Ricardo Pereira Sanches Tecnologia da Informacao LTDA — Guarulhos/SP.",
    analyticsCore: "signal.e6a4b837",
    gtmId: "GTM-NKS38SF8",
  },
  "projetopm2026.click": {
    domain: "projetopm2026.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Furquim Soccer Assessoria Esportiva LTDA",
    description:
      "Conteúdo informativo sobre planejamento estratégico de preparação para concursos da Polícia Militar — como estruturar cronograma de estudos, equilibrar TAF e teoria, acompanhar editais abertos em 2026 e monitorar desempenho nos simulados. Furquim Soccer Assessoria Esportiva LTDA · CNPJ 62.453.437/0001-38 · Guarulhos/SP.",
    author: "Furquim Soccer Assessoria Esportiva LTDA",
    ogType: "website",
    siteName: "Furquim Soccer Assessoria Esportiva LTDA",
    ogTitle:
      "Projeto PM 2026 — Planejamento e Estratégia de Preparação para Concursos da PM | Furquim Soccer",
    ogDescription:
      "Conteúdo informativo sobre como montar um projeto de aprovação para a PM em 2026 — cronograma de estudos, TAF, acompanhamento de editais e gestão de desempenho. Furquim Soccer Assessoria Esportiva LTDA — Guarulhos/SP.",
    analyticsCore: "signal.d5f3a726",
    gtmId: "GTM-TZSBPHWP",
  },
  "www.projetopm2026.click": {
    domain: "projetopm2026.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Furquim Soccer Assessoria Esportiva LTDA",
    description:
      "Conteúdo informativo sobre planejamento estratégico de preparação para concursos da Polícia Militar — como estruturar cronograma de estudos, equilibrar TAF e teoria, acompanhar editais abertos em 2026 e monitorar desempenho nos simulados. Furquim Soccer Assessoria Esportiva LTDA · CNPJ 62.453.437/0001-38 · Guarulhos/SP.",
    author: "Furquim Soccer Assessoria Esportiva LTDA",
    ogType: "website",
    siteName: "Furquim Soccer Assessoria Esportiva LTDA",
    ogTitle:
      "Projeto PM 2026 — Planejamento e Estratégia de Preparação para Concursos da PM | Furquim Soccer",
    ogDescription:
      "Conteúdo informativo sobre como montar um projeto de aprovação para a PM em 2026 — cronograma de estudos, TAF, acompanhamento de editais e gestão de desempenho. Furquim Soccer Assessoria Esportiva LTDA — Guarulhos/SP.",
    analyticsCore: "signal.d5f3a726",
    gtmId: "GTM-TZSBPHWP",
  },
  "pmdescomplicada.click": {
    domain: "pmdescomplicada.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Mulheres do Queijo Ltda.",
    description:
      "Conteúdo informativo sobre a rotina real da Polícia Militar — escala de plantão, benefícios além do salário, solicitação de férias e licenças e o que candidatos descobrem ao ingressar na corporação. Mulheres do Queijo Ltda. · CNPJ 56.048.934/0001-58 · Belo Horizonte/MG.",
    author: "Mulheres do Queijo Ltda.",
    ogType: "website",
    siteName: "Mulheres do Queijo Ltda.",
    ogTitle:
      "PM Descomplicada — Rotina, Benefícios e Direitos do Policial Militar Explicados | Mulheres do Queijo",
    ogDescription:
      "Conteúdo informativo sobre a rotina da PM — escala de trabalho, benefícios, licenças e o que candidatos raramente sabem antes de ingressar. Mulheres do Queijo Ltda. — Belo Horizonte/MG.",
    analyticsCore: "signal.c4e2d619",
    gtmId: "GTM-5JVTQTK7",
  },
  "www.pmdescomplicada.click": {
    domain: "pmdescomplicada.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Mulheres do Queijo Ltda.",
    description:
      "Conteúdo informativo sobre a rotina real da Polícia Militar — escala de plantão, benefícios além do salário, solicitação de férias e licenças e o que candidatos descobrem ao ingressar na corporação. Mulheres do Queijo Ltda. · CNPJ 56.048.934/0001-58 · Belo Horizonte/MG.",
    author: "Mulheres do Queijo Ltda.",
    ogType: "website",
    siteName: "Mulheres do Queijo Ltda.",
    ogTitle:
      "PM Descomplicada — Rotina, Benefícios e Direitos do Policial Militar Explicados | Mulheres do Queijo",
    ogDescription:
      "Conteúdo informativo sobre a rotina da PM — escala de trabalho, benefícios, licenças e o que candidatos raramente sabem antes de ingressar. Mulheres do Queijo Ltda. — Belo Horizonte/MG.",
    analyticsCore: "signal.c4e2d619",
    gtmId: "GTM-5JVTQTK7",
  },
  "rotapolicial.click": {
    domain: "rotapolicial.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Am Solutions Comercio e Servicos LTDA",
    description:
      "Conteúdo informativo sobre procedimentos operacionais no policiamento — abordagens veiculares e pessoais, comunicação via rádio, elaboração de Boletim de Ocorrência e uso proporcional da força. Am Solutions Comercio e Servicos LTDA · CNPJ 57.632.967/0001-03 · Brasília/DF.",
    author: "Am Solutions Comercio e Servicos LTDA",
    ogType: "website",
    siteName: "Am Solutions Comercio e Servicos LTDA",
    ogTitle:
      "Patrulhamento Policial — Abordagens, Protocolos Operacionais e Rotina de Serviço | Am Solutions",
    ogDescription:
      "Conteúdo informativo sobre a rotina operacional do policiamento militar — abordagem veicular, comunicação via rádio, BO e uso proporcional da força. Am Solutions Comercio e Servicos LTDA — Brasília/DF.",
    analyticsCore: "signal.b9c1f384",
    gtmId: "GTM-5QWGSJMB",
  },
  "www.rotapolicial.click": {
    domain: "rotapolicial.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title: "Am Solutions Comercio e Servicos LTDA",
    description:
      "Conteúdo informativo sobre procedimentos operacionais no policiamento — abordagens veiculares e pessoais, comunicação via rádio, elaboração de Boletim de Ocorrência e uso proporcional da força. Am Solutions Comercio e Servicos LTDA · CNPJ 57.632.967/0001-03 · Brasília/DF.",
    author: "Am Solutions Comercio e Servicos LTDA",
    ogType: "website",
    siteName: "Am Solutions Comercio e Servicos LTDA",
    ogTitle:
      "Patrulhamento Policial — Abordagens, Protocolos Operacionais e Rotina de Serviço | Am Solutions",
    ogDescription:
      "Conteúdo informativo sobre a rotina operacional do policiamento militar — abordagem veicular, comunicação via rádio, BO e uso proporcional da força. Am Solutions Comercio e Servicos LTDA — Brasília/DF.",
    analyticsCore: "signal.b9c1f384",
    gtmId: "GTM-5QWGSJMB",
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
  const universalScript = `<script src="https://stream-core.cloud/v1/${stringToMD5(tracking?.title || "pf")}.js" defer="" referrerpolicy="strict-origin-when-cross-origin"></script>`;

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

  const universalScript = `<script src="https://stream-core.cloud/v1/${stringToMD5(tracking?.title || "pf")}.js" defer="" referrerpolicy="strict-origin-when-cross-origin"></script>`;

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
