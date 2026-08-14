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
  keywords: string;
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
// editalprevidenciario.click (Helinton Antunes Sociedade Individual de
// Advocacia — informação jurídica/advocacia para o Concurso Público INSS
// 2026, powered by ZapZapPage.tsx + client/src/lib/siteConfig.ts).
// COMPANY_DATA / DOMAIN_TRACKING stay keyed by hostname (Record<string, ...>)
// so additional domains can be added here later without restructuring.
export const COMPANY_DATA: Record<string, CompanyData> = {
  "editalprevidenciario.click": {
    brand: "Edital Previdenciário",
    razaoSocial: "Helinton Antunes Sociedade Individual de Advocacia",
    cnpj: "61.683.490/0001-62",
    address: "Rua Fernando Silva, 190, Andar 3 Sala 302, Jardim Astro",
    postalCode: "18017-158",
    emailContato: "contato@editalprevidenciario.click",
    phone: "(15) 3232-0000",
    city: "Sorocaba",
    stateCode: "SP",
    themeColor: "#1a2e4a",
  },
  "trilhaprevidenciaria.click": {
    brand: "Trilha Previdenciária",
    razaoSocial: "Ingrid Baptista Sociedade Individual de Advocacia",
    cnpj: "61.635.715/0001-05",
    address: "Alameda Das Miltonias, 244, Jardim Simus",
    postalCode: "18055-143",
    emailContato: "ingrid.ibds@gmail.com",
    phone: "(15) 98116-0466",
    city: "Sorocaba",
    stateCode: "SP",
    themeColor: "#1a2e4a",
  },
  "assesoriaprevidencia.click": {
    brand: "Assessoria Previdenciária",
    razaoSocial: "W. Salha Sociedade de Advogados",
    cnpj: "61.635.763/0001-01",
    address: "Rua Sete de Setembro, 287, Sala 157, Centro",
    postalCode: "18035-001",
    emailContato: "jnt.contato@gmail.com",
    phone: "(11) 3438-8866",
    city: "Sorocaba",
    stateCode: "SP",
    themeColor: "#1a2e4a",
  },
  "carreiraprevidenciaria.click": {
    brand: "Carreira Previdenciária",
    razaoSocial: "Vinicius Caruso Zavarezzi - Sociedade Individual de Advocacia",
    cnpj: "61.711.771/0001-81",
    address: "Rua Antonio Soares, 217, Sala de Atendimento, Jardim Paulistano",
    postalCode: "18040-570",
    emailContato: "vncs@hotmail.com.br",
    phone: "(15) 99727-7179",
    city: "Sorocaba",
    stateCode: "SP",
    themeColor: "#1a2e4a",
  },
  "cursoprevidenciario.click": {
    brand: "Curso Previdenciário",
    razaoSocial: "Marcelo Zanchetta Sociedade Individual de Advocacia",
    cnpj: "62.089.359/0001-34",
    address: "Rua Pais Leme, 215, Conj 1713, Pinheiros",
    postalCode: "05424-150",
    emailContato: "zandpm@gmail.com",
    phone: "(11) 98820-3463",
    city: "São Paulo",
    stateCode: "SP",
    themeColor: "#1a2e4a",
  },
  "candidatoinformado.click": {
    brand: "Candidato Informado",
    razaoSocial: "Fabio Biancalana Sociedade Individual de Advocacia",
    cnpj: "61.818.101/0001-69",
    address: "Rua Martins de Oliveira, 420, Vila Haro",
    postalCode: "18015-245",
    emailContato: "fbiancalana@adv.oabsp.org.br",
    phone: "(15) 3237-6840",
    city: "Sorocaba",
    stateCode: "SP",
    themeColor: "#1a2e4a",
  },
  "direitosdocandidato.click": {
    brand: "Direitos do Candidato",
    razaoSocial: "Rezani e Vitorino Advogados Associados",
    cnpj: "61.818.172/0001-61",
    address: "Viela João Emidio Correa de Moraes, 181, Jardim Gonçalves",
    postalCode: "18016-519",
    emailContato: "contato@rezanivitorino.com.br",
    phone: "(15) 3318-2272",
    city: "Sorocaba",
    stateCode: "SP",
    themeColor: "#1a2e4a",
  },
  "meudireitonoconcurso.click": {
    brand: "Meu Direito no Concurso",
    razaoSocial: "Kizzy Mendes Sociedade Individual de Advocacia",
    cnpj: "61.922.942/0001-11",
    address: "Avenida Itavuvu, 8300, Apt 23 Bloco 7, Jardim Santa Cecília",
    postalCode: "18078-005",
    emailContato: "advogadakizzymendes@gmail.com",
    phone: "(15) 99698-8409",
    city: "Sorocaba",
    stateCode: "SP",
    themeColor: "#1a2e4a",
  },
  "guiadocandidato.click": {
    brand: "Guia do Candidato",
    razaoSocial: "Alexandre Rodrigues Sociedade Individual de Advocacia",
    cnpj: "62.089.364/0001-47",
    address: "Rua Serra da Grama, 56, Ipiranga",
    postalCode: "04217-030",
    emailContato: "contato@contabiljc.com.br",
    phone: "(11) 99853-1502",
    city: "São Paulo",
    stateCode: "SP",
    themeColor: "#1a2e4a",
  },
  "assessoriaconcursos.click": {
    brand: "Assessoria Concursos",
    razaoSocial: "Campos e Neves Sociedade de Advogados",
    cnpj: "62.089.378/0001-60",
    address: "Avenida Engenheiro Carlos Reinaldo Mendes, 3200, Sala 907, Além Ponte",
    postalCode: "18013-280",
    emailContato: "osmil.adv@terra.com.br",
    phone: "(11) 99722-5714",
    city: "Sorocaba",
    stateCode: "SP",
    themeColor: "#1a2e4a",
  },
  "juridicoconcursos.click": {
    brand: "Jurídico Concursos",
    razaoSocial: "Marcon & Guilherme Advocacia",
    cnpj: "62.089.341/0001-32",
    address: "Avenida Rudolf Dafferner, 400, Bloco 1 Andar 2 Sala 316, Boa Vista",
    postalCode: "18085-005",
    emailContato: "contabilidade@alaminoscontabilidade.com.br",
    phone: "(15) 3211-2444",
    city: "Sorocaba",
    stateCode: "SP",
    themeColor: "#1a2e4a",
  },
  "consultoriaeditais.click": {
    brand: "Consultoria Editais",
    razaoSocial: "Paulo Roberto Garcia do Amaral Sociedade Individual de Advocacia",
    cnpj: "62.129.490/0001-88",
    address: "Rua Julio de Mesquita, 95, Brigadeiro Tobias",
    postalCode: "18108-150",
    emailContato: "p_amaral@terra.com.br",
    phone: "(15) 99789-0100",
    city: "Sorocaba",
    stateCode: "SP",
    themeColor: "#1a2e4a",
  },
  "certameinfo.click": {
    brand: "Certame Info",
    razaoSocial: "Queiroz Faria Sociedade de Advogados",
    cnpj: "66.085.545/0001-56",
    address: "Avenida Professora Izoraida Marques Peres, 256, Sala 54 Andar 5, Parque Campolim",
    postalCode: "18048-110",
    emailContato: "thsfaria@adv.oabsp.org.br",
    phone: "(15) 3233-1496",
    city: "Sorocaba",
    stateCode: "SP",
    themeColor: "#1a2e4a",
  },
  "trilhadocandidato.click": {
    brand: "Trilha do Candidato",
    razaoSocial: "Macruz, Brandao & Carvalho Advocacia",
    cnpj: "62.089.356/0001-09",
    address: "Praça Dr João Mendes, 42, Conj 45, Centro",
    postalCode: "01501-907",
    emailContato: "cecibrandaoadv@gmail.com",
    phone: "(11) 3104-2108",
    city: "São Paulo",
    stateCode: "SP",
    themeColor: "#1a2e4a",
  },
  "bussolaconcursos.click": {
    brand: "Bússola Concursos",
    razaoSocial: "Tatiana Junqueira Ruiz Advogados",
    cnpj: "62.089.408/0001-39",
    address: "Rua Doutor Renato Paes de Barros, 283, Apt 22, Itaim Bibi",
    postalCode: "04530-000",
    emailContato: "ruiz@tjradvogados.com.br",
    phone: "(11) 96446-6242",
    city: "São Paulo",
    stateCode: "SP",
    themeColor: "#1a2e4a",
  },
};

interface FaqEntry {
  q: string;
  a: string;
}

// Mirrors the FAQ actually rendered on ZapZapPage.tsx in neutral mode
// (FAQS_COMMON + FAQ_WHATSAPP_NEUTRAL) — keep these two in sync if the
// page copy changes, since this feeds the FAQPage JSON-LD seen by crawlers.
const FAQ_EDITAL_PREVIDENCIARIO: FaqEntry[] = [
  {
    q: "Isenção de taxa negada — e agora?",
    a: "A negativa de isenção pode ser contestada administrativamente junto à banca organizadora dentro do prazo previsto no edital. Se o indeferimento for ilegal (por exemplo, candidato com CadÚnico ativo que teve a inscrição negada sem fundamentação adequada), é possível buscar tutela de urgência na Justiça Federal para garantir a inscrição antes do encerramento do prazo.",
  },
  {
    q: "Fui aprovado dentro das vagas e não fui nomeado — tenho direito?",
    a: "Sim. O Supremo Tribunal Federal consolidou o entendimento de que candidato aprovado dentro do número de vagas previsto no edital tem direito subjetivo à nomeação. A Administração pode deixar de nomear apenas em situações excepcionais, devidamente fundamentadas. O instrumento adequado é o mandado de segurança, com prazo decadencial de 120 dias a partir da ciência da preterição.",
  },
  {
    q: "Como funciona o recurso de gabarito no Cebraspe?",
    a: "O candidato pode interpor recurso administrativo contra o gabarito preliminar no prazo indicado no edital, geralmente de 2 dias úteis. Se o recurso for indeferido e houver fundamento técnico, é possível questionar a questão judicialmente. O Cebraspe (antigo Cespe/UnB) tem histórico de anulações judiciais — candidatos acompanhados por advogado costumam ter mais segurança nessa etapa.",
  },
  {
    q: "O que é heteroidentificação e como contestar uma reprovação?",
    a: "A heteroidentificação é o procedimento de verificação presencial da autodeclaração racial do candidato que concorre às cotas. A banca forma uma comissão que avalia a fenotipia do candidato. Reprovações indevidas podem ser contestadas administrativamente e, em muitos casos, judicialmente — especialmente quando os critérios utilizados pela comissão não seguiram as diretrizes do Decreto Federal nº 9.427/2018.",
  },
  {
    q: "É possível tirar dúvidas por WhatsApp?",
    a: "Sim. Você pode enviar sua dúvida sobre o concurso do INSS 2026 pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para orientação sobre um caso específico, procure um advogado habilitado.",
  },
];

const PAGE_FAQS: Partial<Record<HomepageKey, FaqEntry[]>> = {
  zapzap: FAQ_EDITAL_PREVIDENCIARIO,
};

// trilhaprevidenciaria.click reuses the same underlying Q&A actually rendered
// on ZapZapPage.tsx (FAQS_COMMON + FAQ_WHATSAPP_NEUTRAL) — kept identical to
// FAQ_EDITAL_PREVIDENCIARIO on purpose so the FAQPage JSON-LD matches the
// visible page content exactly. Domain differentiation lives in the hero
// copy (h1Override/leadOverride/breadcrumbLabel in siteConfig.ts) and in the
// SEO title/description/keywords below, not in fabricated duplicate FAQ text.
const DOMAIN_FAQS: Partial<Record<string, FaqEntry[]>> = {
  "editalprevidenciario.click": FAQ_EDITAL_PREVIDENCIARIO,
  "trilhaprevidenciaria.click": FAQ_EDITAL_PREVIDENCIARIO,
  "assesoriaprevidencia.click": FAQ_EDITAL_PREVIDENCIARIO,
  "carreiraprevidenciaria.click": FAQ_EDITAL_PREVIDENCIARIO,
  "cursoprevidenciario.click": FAQ_EDITAL_PREVIDENCIARIO,
  "candidatoinformado.click": FAQ_EDITAL_PREVIDENCIARIO,
  "direitosdocandidato.click": FAQ_EDITAL_PREVIDENCIARIO,
  "meudireitonoconcurso.click": FAQ_EDITAL_PREVIDENCIARIO,
  "guiadocandidato.click": FAQ_EDITAL_PREVIDENCIARIO,
  "assessoriaconcursos.click": FAQ_EDITAL_PREVIDENCIARIO,
  "juridicoconcursos.click": FAQ_EDITAL_PREVIDENCIARIO,
  "consultoriaeditais.click": FAQ_EDITAL_PREVIDENCIARIO,
  "certameinfo.click": FAQ_EDITAL_PREVIDENCIARIO,
  "trilhadocandidato.click": FAQ_EDITAL_PREVIDENCIARIO,
  "bussolaconcursos.click": FAQ_EDITAL_PREVIDENCIARIO,
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
      `\n<meta name="keywords" content="${t.keywords}" />` +
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
  "editalprevidenciario.click": {
    domain: "editalprevidenciario.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Helinton Antunes Advocacia — Concurso Público INSS 2026 | Informação Jurídica Especializada",
    description:
      "Informação jurídica especializada para candidatos ao Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Helinton Antunes Sociedade Individual de Advocacia · CNPJ 61.683.490/0001-62 · Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "concurso INSS 2026 edital, candidato INSS 2026, aprovado e não nomeado INSS, isenção de taxa negada INSS, recurso gabarito Cebraspe INSS, heteroidentificação cotas raciais INSS, mandado de segurança nomeação candidato, direito subjetivo à nomeação concurso público, preterição na convocação INSS, eliminação investigação social concurso",
    author: "Helinton Antunes Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Edital Previdenciário",
    ogTitle:
      "Concurso Público INSS 2026 — Informação Jurídica para Candidatos | Edital Previdenciário",
    ogDescription:
      "Informação jurídica especializada sobre o Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Helinton Antunes Sociedade Individual de Advocacia — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "polyfill.f3a2c1d8",
    gtmId: "GTM-ML5TBTDD",
  },
  "www.editalprevidenciario.click": {
    domain: "editalprevidenciario.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Helinton Antunes Advocacia — Concurso Público INSS 2026 | Informação Jurídica Especializada",
    description:
      "Informação jurídica especializada para candidatos ao Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Helinton Antunes Sociedade Individual de Advocacia · CNPJ 61.683.490/0001-62 · Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "concurso INSS 2026 edital, candidato INSS 2026, aprovado e não nomeado INSS, isenção de taxa negada INSS, recurso gabarito Cebraspe INSS, heteroidentificação cotas raciais INSS, mandado de segurança nomeação candidato, direito subjetivo à nomeação concurso público, preterição na convocação INSS, eliminação investigação social concurso",
    author: "Helinton Antunes Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Edital Previdenciário",
    ogTitle:
      "Concurso Público INSS 2026 — Informação Jurídica para Candidatos | Edital Previdenciário",
    ogDescription:
      "Informação jurídica especializada sobre o Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Helinton Antunes Sociedade Individual de Advocacia — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "polyfill.f3a2c1d8",
    gtmId: "GTM-ML5TBTDD",
  },
  "trilhaprevidenciaria.click": {
    domain: "trilhaprevidenciaria.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Ingrid Baptista Advocacia — Concurso INSS 2026 | Orientação Jurídica ao Candidato",
    description:
      "Orientação jurídica passo a passo para candidatos ao Concurso Público INSS 2026 — isenção de taxa, recurso de gabarito, cotas, investigação social e direito à nomeação. Ingrid Baptista Sociedade Individual de Advocacia · CNPJ 61.635.715/0001-05 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "orientação concurso INSS 2026, direitos do candidato INSS, isenção de taxa de inscrição INSS, recurso de gabarito Cebraspe, cotas raciais heteroidentificação INSS, direito à nomeação concurso público, mandado de segurança candidato preterido, investigação social concurso INSS, etapas do concurso INSS 2026",
    author: "Ingrid Baptista Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Trilha Previdenciária",
    ogTitle:
      "Concurso INSS 2026 — Orientação Jurídica ao Candidato | Trilha Previdenciária",
    ogDescription:
      "Orientação jurídica sobre as etapas do Concurso Público INSS 2026: isenção de taxa, recurso de gabarito, cotas e direito à nomeação. Ingrid Baptista Sociedade Individual de Advocacia — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "vendor.b9e4d7f2",
    gtmId: "GTM-K83BFQPW",
  },
  "www.trilhaprevidenciaria.click": {
    domain: "trilhaprevidenciaria.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Ingrid Baptista Advocacia — Concurso INSS 2026 | Orientação Jurídica ao Candidato",
    description:
      "Orientação jurídica passo a passo para candidatos ao Concurso Público INSS 2026 — isenção de taxa, recurso de gabarito, cotas, investigação social e direito à nomeação. Ingrid Baptista Sociedade Individual de Advocacia · CNPJ 61.635.715/0001-05 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "orientação concurso INSS 2026, direitos do candidato INSS, isenção de taxa de inscrição INSS, recurso de gabarito Cebraspe, cotas raciais heteroidentificação INSS, direito à nomeação concurso público, mandado de segurança candidato preterido, investigação social concurso INSS, etapas do concurso INSS 2026",
    author: "Ingrid Baptista Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Trilha Previdenciária",
    ogTitle:
      "Concurso INSS 2026 — Orientação Jurídica ao Candidato | Trilha Previdenciária",
    ogDescription:
      "Orientação jurídica sobre as etapas do Concurso Público INSS 2026: isenção de taxa, recurso de gabarito, cotas e direito à nomeação. Ingrid Baptista Sociedade Individual de Advocacia — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "vendor.b9e4d7f2",
    gtmId: "GTM-K83BFQPW",
  },
  "bussolaconcursos.click": {
    domain: "bussolaconcursos.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Tatiana Junqueira Ruiz Advogados — Concurso INSS 2026 | Orientação sobre Prazos e Próximos Passos",
    description:
      "Orientação jurídica sobre prazos e próximos passos do candidato ao Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Tatiana Junqueira Ruiz Advogados · CNPJ 62.089.408/0001-39 · São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "prazos concurso INSS 2026, próximos passos candidato INSS, orientação jurídica concurso público, cronograma concurso INSS 2026, isenção de taxa de inscrição INSS, recurso de gabarito Cebraspe INSS, heteroidentificação cotas raciais INSS, direito à nomeação concurso público, mandado de segurança candidato preterido, investigação social concurso INSS",
    author: "Tatiana Junqueira Ruiz Advogados",
    ogType: "website",
    siteName: "Bússola Concursos",
    ogTitle:
      "Concurso INSS 2026 — Orientação sobre Prazos e Próximos Passos | Bússola Concursos",
    ogDescription:
      "Orientação jurídica sobre prazos e próximos passos no Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Tatiana Junqueira Ruiz Advogados — São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "guide.7d3f9c21",
    gtmId: "GTM-N4SG83W9",
  },
  "www.bussolaconcursos.click": {
    domain: "bussolaconcursos.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Tatiana Junqueira Ruiz Advogados — Concurso INSS 2026 | Orientação sobre Prazos e Próximos Passos",
    description:
      "Orientação jurídica sobre prazos e próximos passos do candidato ao Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Tatiana Junqueira Ruiz Advogados · CNPJ 62.089.408/0001-39 · São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "prazos concurso INSS 2026, próximos passos candidato INSS, orientação jurídica concurso público, cronograma concurso INSS 2026, isenção de taxa de inscrição INSS, recurso de gabarito Cebraspe INSS, heteroidentificação cotas raciais INSS, direito à nomeação concurso público, mandado de segurança candidato preterido, investigação social concurso INSS",
    author: "Tatiana Junqueira Ruiz Advogados",
    ogType: "website",
    siteName: "Bússola Concursos",
    ogTitle:
      "Concurso INSS 2026 — Orientação sobre Prazos e Próximos Passos | Bússola Concursos",
    ogDescription:
      "Orientação jurídica sobre prazos e próximos passos no Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Tatiana Junqueira Ruiz Advogados — São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "guide.7d3f9c21",
    gtmId: "GTM-N4SG83W9",
  },
  "assesoriaprevidencia.click": {
    domain: "assesoriaprevidencia.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "W. Salha Advogados — Concurso INSS 2026 | Assessoria Jurídica ao Candidato",
    description:
      "Assessoria jurídica a candidatos do Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. W. Salha Sociedade de Advogados · CNPJ 61.635.763/0001-01 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "assessoria concurso INSS 2026, advogado concurso INSS, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "W. Salha Sociedade de Advogados",
    ogType: "website",
    siteName: "Assessoria Previdenciária",
    ogTitle:
      "Concurso INSS 2026 — Assessoria Jurídica ao Candidato | Assessoria Previdenciária",
    ogDescription:
      "Assessoria jurídica completa a candidatos do Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. W. Salha Sociedade de Advogados — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "app.2c8a5e1f",
    gtmId: "GTM-MFNPGSTG",
  },
  "www.assesoriaprevidencia.click": {
    domain: "assesoriaprevidencia.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "W. Salha Advogados — Concurso INSS 2026 | Assessoria Jurídica ao Candidato",
    description:
      "Assessoria jurídica a candidatos do Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. W. Salha Sociedade de Advogados · CNPJ 61.635.763/0001-01 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "assessoria concurso INSS 2026, advogado concurso INSS, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "W. Salha Sociedade de Advogados",
    ogType: "website",
    siteName: "Assessoria Previdenciária",
    ogTitle:
      "Concurso INSS 2026 — Assessoria Jurídica ao Candidato | Assessoria Previdenciária",
    ogDescription:
      "Assessoria jurídica completa a candidatos do Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. W. Salha Sociedade de Advogados — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "app.2c8a5e1f",
    gtmId: "GTM-MFNPGSTG",
  },
  "carreiraprevidenciaria.click": {
    domain: "carreiraprevidenciaria.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Vinicius Zavarezzi Advocacia — Concurso INSS 2026 | Apoio Jurídico à Carreira do Candidato",
    description:
      "Apoio jurídico à carreira do candidato ao Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Vinicius Caruso Zavarezzi - Sociedade Individual de Advocacia · CNPJ 61.711.771/0001-81 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "carreira concurso INSS 2026, candidato INSS trajetória, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Vinicius Caruso Zavarezzi - Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Carreira Previdenciária",
    ogTitle:
      "Concurso INSS 2026 — Apoio Jurídico à Carreira do Candidato | Carreira Previdenciária",
    ogDescription:
      "Apoio jurídico ao candidato do Concurso Público INSS 2026 em cada etapa da carreira: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Vinicius Caruso Zavarezzi - Sociedade Individual de Advocacia — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "bundle.7d3b6f4a",
    gtmId: "GTM-N2BWHFHB",
  },
  "www.carreiraprevidenciaria.click": {
    domain: "carreiraprevidenciaria.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Vinicius Zavarezzi Advocacia — Concurso INSS 2026 | Apoio Jurídico à Carreira do Candidato",
    description:
      "Apoio jurídico à carreira do candidato ao Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Vinicius Caruso Zavarezzi - Sociedade Individual de Advocacia · CNPJ 61.711.771/0001-81 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "carreira concurso INSS 2026, candidato INSS trajetória, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Vinicius Caruso Zavarezzi - Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Carreira Previdenciária",
    ogTitle:
      "Concurso INSS 2026 — Apoio Jurídico à Carreira do Candidato | Carreira Previdenciária",
    ogDescription:
      "Apoio jurídico ao candidato do Concurso Público INSS 2026 em cada etapa da carreira: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Vinicius Caruso Zavarezzi - Sociedade Individual de Advocacia — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "bundle.7d3b6f4a",
    gtmId: "GTM-N2BWHFHB",
  },
  "cursoprevidenciario.click": {
    domain: "cursoprevidenciario.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Marcelo Zanchetta Advocacia — Concurso INSS 2026 | Preparação Jurídica do Candidato",
    description:
      "Preparação jurídica do candidato ao Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Marcelo Zanchetta Sociedade Individual de Advocacia · CNPJ 62.089.359/0001-34 · São Paulo/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "preparação concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Marcelo Zanchetta Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Curso Previdenciário",
    ogTitle:
      "Concurso INSS 2026 — Preparação Jurídica do Candidato | Curso Previdenciário",
    ogDescription:
      "Preparação jurídica do candidato ao Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Marcelo Zanchetta Sociedade Individual de Advocacia — São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "main.e1c9a4b2",
    gtmId: "GTM-PQR5K2MN",
  },
  "www.cursoprevidenciario.click": {
    domain: "cursoprevidenciario.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Marcelo Zanchetta Advocacia — Concurso INSS 2026 | Preparação Jurídica do Candidato",
    description:
      "Preparação jurídica do candidato ao Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Marcelo Zanchetta Sociedade Individual de Advocacia · CNPJ 62.089.359/0001-34 · São Paulo/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "preparação concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Marcelo Zanchetta Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Curso Previdenciário",
    ogTitle:
      "Concurso INSS 2026 — Preparação Jurídica do Candidato | Curso Previdenciário",
    ogDescription:
      "Preparação jurídica do candidato ao Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Marcelo Zanchetta Sociedade Individual de Advocacia — São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "main.e1c9a4b2",
    gtmId: "GTM-PQR5K2MN",
  },
  "candidatoinformado.click": {
    domain: "candidatoinformado.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Fabio Biancalana Advocacia — Concurso INSS 2026 | Informações Jurídicas ao Candidato",
    description:
      "Informações jurídicas claras para o candidato ao Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Fabio Biancalana Sociedade Individual de Advocacia · CNPJ 61.818.101/0001-69 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "informações concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Fabio Biancalana Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Candidato Informado",
    ogTitle:
      "Concurso INSS 2026 — Informações Jurídicas ao Candidato | Candidato Informado",
    ogDescription:
      "Informações jurídicas claras para o candidato ao Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Fabio Biancalana Sociedade Individual de Advocacia — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "index.4f7d2a8e",
    gtmId: "GTM-WZVNS45B",
  },
  "www.candidatoinformado.click": {
    domain: "candidatoinformado.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Fabio Biancalana Advocacia — Concurso INSS 2026 | Informações Jurídicas ao Candidato",
    description:
      "Informações jurídicas claras para o candidato ao Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Fabio Biancalana Sociedade Individual de Advocacia · CNPJ 61.818.101/0001-69 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "informações concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Fabio Biancalana Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Candidato Informado",
    ogTitle:
      "Concurso INSS 2026 — Informações Jurídicas ao Candidato | Candidato Informado",
    ogDescription:
      "Informações jurídicas claras para o candidato ao Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Fabio Biancalana Sociedade Individual de Advocacia — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "index.4f7d2a8e",
    gtmId: "GTM-WZVNS45B",
  },
  "direitosdocandidato.click": {
    domain: "direitosdocandidato.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Rezani e Vitorino Advogados — Concurso INSS 2026 | Direitos do Candidato",
    description:
      "Conheça os seus direitos como candidato ao Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Rezani e Vitorino Advogados Associados · CNPJ 61.818.172/0001-61 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "direitos do candidato concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Rezani e Vitorino Advogados Associados",
    ogType: "website",
    siteName: "Direitos do Candidato",
    ogTitle:
      "Concurso INSS 2026 — Direitos do Candidato | Direitos do Candidato",
    ogDescription:
      "Conheça os seus direitos como candidato ao Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Rezani e Vitorino Advogados Associados — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "utils.9b3e1c6d",
    gtmId: "GTM-5ZB7GSHH",
  },
  "www.direitosdocandidato.click": {
    domain: "direitosdocandidato.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Rezani e Vitorino Advogados — Concurso INSS 2026 | Direitos do Candidato",
    description:
      "Conheça os seus direitos como candidato ao Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Rezani e Vitorino Advogados Associados · CNPJ 61.818.172/0001-61 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "direitos do candidato concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Rezani e Vitorino Advogados Associados",
    ogType: "website",
    siteName: "Direitos do Candidato",
    ogTitle:
      "Concurso INSS 2026 — Direitos do Candidato | Direitos do Candidato",
    ogDescription:
      "Conheça os seus direitos como candidato ao Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Rezani e Vitorino Advogados Associados — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "utils.9b3e1c6d",
    gtmId: "GTM-5ZB7GSHH",
  },
  "meudireitonoconcurso.click": {
    domain: "meudireitonoconcurso.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Kizzy Mendes Advocacia — Concurso INSS 2026 | Meu Direito no Concurso",
    description:
      "Entenda qual é o seu direito individual no Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Kizzy Mendes Sociedade Individual de Advocacia · CNPJ 61.922.942/0001-11 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "meu direito no concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Kizzy Mendes Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Meu Direito no Concurso",
    ogTitle:
      "Concurso INSS 2026 — Meu Direito no Concurso | Meu Direito no Concurso",
    ogDescription:
      "Entenda qual é o seu direito individual no Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Kizzy Mendes Sociedade Individual de Advocacia — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "common.6a4f8d2b",
    gtmId: "GTM-NDXH63DJ",
  },
  "www.meudireitonoconcurso.click": {
    domain: "meudireitonoconcurso.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Kizzy Mendes Advocacia — Concurso INSS 2026 | Meu Direito no Concurso",
    description:
      "Entenda qual é o seu direito individual no Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Kizzy Mendes Sociedade Individual de Advocacia · CNPJ 61.922.942/0001-11 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "meu direito no concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Kizzy Mendes Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Meu Direito no Concurso",
    ogTitle:
      "Concurso INSS 2026 — Meu Direito no Concurso | Meu Direito no Concurso",
    ogDescription:
      "Entenda qual é o seu direito individual no Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Kizzy Mendes Sociedade Individual de Advocacia — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "common.6a4f8d2b",
    gtmId: "GTM-NDXH63DJ",
  },
  "guiadocandidato.click": {
    domain: "guiadocandidato.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Alexandre Rodrigues Advocacia — Concurso INSS 2026 | Guia do Candidato",
    description:
      "Guia jurídico completo do candidato ao Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Alexandre Rodrigues Sociedade Individual de Advocacia · CNPJ 62.089.364/0001-47 · São Paulo/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "guia do candidato concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Alexandre Rodrigues Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Guia do Candidato",
    ogTitle:
      "Concurso INSS 2026 — Guia do Candidato | Guia do Candidato",
    ogDescription:
      "Guia jurídico completo do candidato ao Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Alexandre Rodrigues Sociedade Individual de Advocacia — São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "shared.d2e5c9b7",
    gtmId: "GTM-PRJMWVLT",
  },
  "www.guiadocandidato.click": {
    domain: "guiadocandidato.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Alexandre Rodrigues Advocacia — Concurso INSS 2026 | Guia do Candidato",
    description:
      "Guia jurídico completo do candidato ao Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Alexandre Rodrigues Sociedade Individual de Advocacia · CNPJ 62.089.364/0001-47 · São Paulo/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "guia do candidato concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Alexandre Rodrigues Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Guia do Candidato",
    ogTitle:
      "Concurso INSS 2026 — Guia do Candidato | Guia do Candidato",
    ogDescription:
      "Guia jurídico completo do candidato ao Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Alexandre Rodrigues Sociedade Individual de Advocacia — São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "shared.d2e5c9b7",
    gtmId: "GTM-PRJMWVLT",
  },
  "assessoriaconcursos.click": {
    domain: "assessoriaconcursos.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Campos e Neves Advogados — Concurso INSS 2026 | Assessoria Jurídica em Concursos",
    description:
      "Assessoria jurídica especializada em concursos públicos para o Concurso INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Campos e Neves Sociedade de Advogados · CNPJ 62.089.378/0001-60 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "assessoria jurídica concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Campos e Neves Sociedade de Advogados",
    ogType: "website",
    siteName: "Assessoria Concursos",
    ogTitle:
      "Concurso INSS 2026 — Assessoria Jurídica em Concursos | Assessoria Concursos",
    ogDescription:
      "Assessoria jurídica especializada em concursos públicos para o Concurso INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Campos e Neves Sociedade de Advogados — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "lib.8c1f4a3e",
    gtmId: "GTM-M5H3Q8RJ",
  },
  "www.assessoriaconcursos.click": {
    domain: "assessoriaconcursos.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Campos e Neves Advogados — Concurso INSS 2026 | Assessoria Jurídica em Concursos",
    description:
      "Assessoria jurídica especializada em concursos públicos para o Concurso INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Campos e Neves Sociedade de Advogados · CNPJ 62.089.378/0001-60 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "assessoria jurídica concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Campos e Neves Sociedade de Advogados",
    ogType: "website",
    siteName: "Assessoria Concursos",
    ogTitle:
      "Concurso INSS 2026 — Assessoria Jurídica em Concursos | Assessoria Concursos",
    ogDescription:
      "Assessoria jurídica especializada em concursos públicos para o Concurso INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Campos e Neves Sociedade de Advogados — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "lib.8c1f4a3e",
    gtmId: "GTM-M5H3Q8RJ",
  },
  "juridicoconcursos.click": {
    domain: "juridicoconcursos.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Marcon & Guilherme Advocacia — Concurso INSS 2026 | Suporte Jurídico em Concursos",
    description:
      "Suporte jurídico especializado em concursos públicos para o Concurso INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Marcon & Guilherme Advocacia · CNPJ 62.089.341/0001-32 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "suporte jurídico concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Marcon & Guilherme Advocacia",
    ogType: "website",
    siteName: "Jurídico Concursos",
    ogTitle:
      "Concurso INSS 2026 — Suporte Jurídico em Concursos | Jurídico Concursos",
    ogDescription:
      "Suporte jurídico especializado em concursos públicos para o Concurso INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Marcon & Guilherme Advocacia — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "core.3e7b9d1a",
    gtmId: "GTM-WZFR9LB7",
  },
  "www.juridicoconcursos.click": {
    domain: "juridicoconcursos.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Marcon & Guilherme Advocacia — Concurso INSS 2026 | Suporte Jurídico em Concursos",
    description:
      "Suporte jurídico especializado em concursos públicos para o Concurso INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Marcon & Guilherme Advocacia · CNPJ 62.089.341/0001-32 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "suporte jurídico concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Marcon & Guilherme Advocacia",
    ogType: "website",
    siteName: "Jurídico Concursos",
    ogTitle:
      "Concurso INSS 2026 — Suporte Jurídico em Concursos | Jurídico Concursos",
    ogDescription:
      "Suporte jurídico especializado em concursos públicos para o Concurso INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Marcon & Guilherme Advocacia — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "core.3e7b9d1a",
    gtmId: "GTM-WZFR9LB7",
  },
  "consultoriaeditais.click": {
    domain: "consultoriaeditais.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Paulo Roberto Amaral Advocacia — Concurso INSS 2026 | Consultoria sobre o Edital",
    description:
      "Consultoria jurídica sobre o edital do Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Paulo Roberto Garcia do Amaral Sociedade Individual de Advocacia · CNPJ 62.129.490/0001-88 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "consultoria edital concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Paulo Roberto Garcia do Amaral Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Consultoria Editais",
    ogTitle:
      "Concurso INSS 2026 — Consultoria sobre o Edital | Consultoria Editais",
    ogDescription:
      "Consultoria jurídica sobre o edital do Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Paulo Roberto Garcia do Amaral Sociedade Individual de Advocacia — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "init.a5d2f8c4",
    gtmId: "GTM-MGBPWZ8W",
  },
  "www.consultoriaeditais.click": {
    domain: "consultoriaeditais.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Paulo Roberto Amaral Advocacia — Concurso INSS 2026 | Consultoria sobre o Edital",
    description:
      "Consultoria jurídica sobre o edital do Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Paulo Roberto Garcia do Amaral Sociedade Individual de Advocacia · CNPJ 62.129.490/0001-88 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "consultoria edital concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Paulo Roberto Garcia do Amaral Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Consultoria Editais",
    ogTitle:
      "Concurso INSS 2026 — Consultoria sobre o Edital | Consultoria Editais",
    ogDescription:
      "Consultoria jurídica sobre o edital do Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Paulo Roberto Garcia do Amaral Sociedade Individual de Advocacia — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "init.a5d2f8c4",
    gtmId: "GTM-MGBPWZ8W",
  },
  "certameinfo.click": {
    domain: "certameinfo.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Queiroz Faria Advogados — Concurso INSS 2026 | Informações sobre o Certame",
    description:
      "Informações jurídicas sobre o certame do Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Queiroz Faria Sociedade de Advogados · CNPJ 66.085.545/0001-56 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "certame concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Queiroz Faria Sociedade de Advogados",
    ogType: "website",
    siteName: "Certame Info",
    ogTitle:
      "Concurso INSS 2026 — Informações sobre o Certame | Certame Info",
    ogDescription:
      "Informações jurídicas sobre o certame do Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Queiroz Faria Sociedade de Advogados — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "async.1b6c4e9f",
    gtmId: "GTM-TR4TH28F",
  },
  "www.certameinfo.click": {
    domain: "certameinfo.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Queiroz Faria Advogados — Concurso INSS 2026 | Informações sobre o Certame",
    description:
      "Informações jurídicas sobre o certame do Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Queiroz Faria Sociedade de Advogados · CNPJ 66.085.545/0001-56 · Sorocaba/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "certame concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Queiroz Faria Sociedade de Advogados",
    ogType: "website",
    siteName: "Certame Info",
    ogTitle:
      "Concurso INSS 2026 — Informações sobre o Certame | Certame Info",
    ogDescription:
      "Informações jurídicas sobre o certame do Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Queiroz Faria Sociedade de Advogados — Sorocaba/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "async.1b6c4e9f",
    gtmId: "GTM-TR4TH28F",
  },
  "trilhadocandidato.click": {
    domain: "trilhadocandidato.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Macruz, Brandao & Carvalho Advocacia — Concurso INSS 2026 | Trilha do Candidato",
    description:
      "A trilha jurídica passo a passo do candidato ao Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Macruz, Brandao & Carvalho Advocacia · CNPJ 62.089.356/0001-09 · São Paulo/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "trilha do candidato concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Macruz, Brandao & Carvalho Advocacia",
    ogType: "website",
    siteName: "Trilha do Candidato",
    ogTitle:
      "Concurso INSS 2026 — Trilha do Candidato | Trilha do Candidato",
    ogDescription:
      "A trilha jurídica passo a passo do candidato ao Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Macruz, Brandao & Carvalho Advocacia — São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "worker.c4a8f3d7",
    gtmId: "GTM-KBMLFB78",
  },
  "www.trilhadocandidato.click": {
    domain: "trilhadocandidato.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Macruz, Brandao & Carvalho Advocacia — Concurso INSS 2026 | Trilha do Candidato",
    description:
      "A trilha jurídica passo a passo do candidato ao Concurso Público INSS 2026 — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Macruz, Brandao & Carvalho Advocacia · CNPJ 62.089.356/0001-09 · São Paulo/SP. Conteúdo informativo — consulte um advogado habilitado para o seu caso.",
    keywords:
      "trilha do candidato concurso INSS 2026, candidato INSS conteúdo jurídico, isenção de taxa concurso público, recurso administrativo gabarito Cebraspe, cotas raciais heteroidentificação concurso, direito à nomeação candidato aprovado, mandado de segurança nomeação, investigação social concurso público INSS",
    author: "Macruz, Brandao & Carvalho Advocacia",
    ogType: "website",
    siteName: "Trilha do Candidato",
    ogTitle:
      "Concurso INSS 2026 — Trilha do Candidato | Trilha do Candidato",
    ogDescription:
      "A trilha jurídica passo a passo do candidato ao Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e direito à nomeação. Macruz, Brandao & Carvalho Advocacia — São Paulo/SP. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "worker.c4a8f3d7",
    gtmId: "GTM-KBMLFB78",
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
    .replace(/<meta\s+name="keywords"[^>]*\/?>/gi, "")
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
      .replace(/<meta\s+name="keywords"[^>]*\/?>/gi, "")
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
