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
};

interface FaqEntry {
  q: string;
  a: string;
}

// Mirrors the FAQ actually rendered on ZapZapPage.tsx in neutral mode
// (FAQS_COMMON + FAQ_WHATSAPP_NEUTRAL) — keep these two in sync if the
// page copy changes, since this feeds the FAQPage JSON-LD seen by crawlers.
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

// Kept identical to the Q&A actually rendered on ZapZapPage.tsx
// (FAQS_COMMON + FAQ_WHATSAPP_NEUTRAL) so the FAQPage JSON-LD matches the
// visible page content exactly. Domain differentiation lives in the hero
// copy (h1Override/leadOverride/breadcrumbLabel in siteConfig.ts) and in the
// SEO title/description/keywords below, not in fabricated duplicate FAQ text.
const DOMAIN_FAQS: Partial<Record<string, FaqEntry[]>> = {
  "concursopm.click": FAQ_VIDA_FUNCIONAL,
  // Same FAQPage JSON-LD as concursopm.click on purpose: direitodocandidatopm.click
  // renders through the same ZapZapPage template, so FAQS_COMMON + the neutral
  // WhatsApp FAQ (isVerifiedLawFirm is false for both — no oabNumero configured)
  // is the Q&A actually shown on screen for this domain too.
  "direitodocandidatopm.click": FAQ_VIDA_FUNCIONAL,
  "editalpm.click": FAQ_VIDA_FUNCIONAL,
  "carreiramilitarpm.click": FAQ_VIDA_FUNCIONAL,
  "vagaspm.click": FAQ_VIDA_FUNCIONAL,
  "direitosconcursopm.click": FAQ_VIDA_FUNCIONAL,
  "assessoriapm.click": FAQ_VIDA_FUNCIONAL,
  "militarconcursos.click": FAQ_VIDA_FUNCIONAL,
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
      "Siqueira e Magalhaes Advogados — Direitos e Estabilidade na Carreira Pública",
    description:
      "Orientação jurídica especializada sobre estágio probatório, processos administrativos disciplinares, promoções e estabilidade na carreira pública. Siqueira e Magalhaes Sociedade de Advogados · CNPJ 63.851.818/0001-38 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "direitos do servidor público, estágio probatório exoneração, processo administrativo disciplinar PAD, promoção negada servidor público, transferência indeferida servidor público, reintegração ao cargo público, direito administrativo carreira pública, estabilidade servidor público",
    author: "Siqueira e Magalhaes Sociedade de Advogados",
    ogType: "website",
    siteName: "Direito de Carreira",
    ogTitle:
      "Direitos e Estabilidade na Carreira Pública | Direito de Carreira",
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
      "Siqueira e Magalhaes Advogados — Direitos e Estabilidade na Carreira Pública",
    description:
      "Orientação jurídica especializada sobre estágio probatório, processos administrativos disciplinares, promoções e estabilidade na carreira pública. Siqueira e Magalhaes Sociedade de Advogados · CNPJ 63.851.818/0001-38 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "direitos do servidor público, estágio probatório exoneração, processo administrativo disciplinar PAD, promoção negada servidor público, transferência indeferida servidor público, reintegração ao cargo público, direito administrativo carreira pública, estabilidade servidor público",
    author: "Siqueira e Magalhaes Sociedade de Advogados",
    ogType: "website",
    siteName: "Direito de Carreira",
    ogTitle:
      "Direitos e Estabilidade na Carreira Pública | Direito de Carreira",
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
      "Alves & Saavedra Advogados — Direitos do Candidato em Processos Seletivos Públicos",
    description:
      "Orientação jurídica especializada para candidatos em processos seletivos públicos: recursos administrativos, contestação de eliminação em etapas do certame, laudos médicos e psicológicos, investigação social. Alves & Saavedra Advogados Associados · CNPJ 65.953.516/0001-04 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "direitos do candidato em concurso público, recurso administrativo eliminação em processo seletivo, contestação de exame psicotécnico, investigação social concurso público, laudo médico eliminação irregular, direito administrativo processo seletivo público, advogado para candidatos",
    author: "Alves & Saavedra Advogados Associados",
    ogType: "website",
    siteName: "Direito do Candidato",
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
      "Alves & Saavedra Advogados — Direitos do Candidato em Processos Seletivos Públicos",
    description:
      "Orientação jurídica especializada para candidatos em processos seletivos públicos: recursos administrativos, contestação de eliminação em etapas do certame, laudos médicos e psicológicos, investigação social. Alves & Saavedra Advogados Associados · CNPJ 65.953.516/0001-04 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "direitos do candidato em concurso público, recurso administrativo eliminação em processo seletivo, contestação de exame psicotécnico, investigação social concurso público, laudo médico eliminação irregular, direito administrativo processo seletivo público, advogado para candidatos",
    author: "Alves & Saavedra Advogados Associados",
    ogType: "website",
    siteName: "Direito do Candidato",
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
      "L.f.a. Oliveira Advocacia — Irregularidades em Editais de Processos Seletivos Públicos",
    description:
      "Orientação jurídica especializada sobre irregularidades em editais de processos seletivos públicos: impugnação de edital, retificação, isonomia entre candidatos e prazos de inscrição. L.f.a. Oliveira Sociedade Individual de Advocacia · CNPJ 67.877.690/0001-32 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "impugnação de edital concurso público, retificação de edital, irregularidades em edital de concurso, isonomia entre candidatos, prazo de inscrição concurso público, direito administrativo edital, advogado para editais públicos",
    author: "L.f.a. Oliveira Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Direito no Edital",
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
      "L.f.a. Oliveira Advocacia — Irregularidades em Editais de Processos Seletivos Públicos",
    description:
      "Orientação jurídica especializada sobre irregularidades em editais de processos seletivos públicos: impugnação de edital, retificação, isonomia entre candidatos e prazos de inscrição. L.f.a. Oliveira Sociedade Individual de Advocacia · CNPJ 67.877.690/0001-32 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "impugnação de edital concurso público, retificação de edital, irregularidades em edital de concurso, isonomia entre candidatos, prazo de inscrição concurso público, direito administrativo edital, advogado para editais públicos",
    author: "L.f.a. Oliveira Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Direito no Edital",
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
    title: "Nichelle Alves Advocacia — Direitos na Carreira Militar",
    description:
      "Orientação jurídica especializada sobre promoções, transferências, processos disciplinares e conselhos de disciplina na carreira militar. Nichelle Alves Sociedade Individual de Advocacia · CNPJ 63.814.373/0001-16 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "direitos na carreira militar, promoção militar antiguidade merecimento, conselho de disciplina militar, transferência ex officio, processo administrativo disciplinar militar, reintegração ao posto graduação, advogado militar carreira",
    author: "Nichelle Alves Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Direito Militar de Carreira",
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
    title: "Nichelle Alves Advocacia — Direitos na Carreira Militar",
    description:
      "Orientação jurídica especializada sobre promoções, transferências, processos disciplinares e conselhos de disciplina na carreira militar. Nichelle Alves Sociedade Individual de Advocacia · CNPJ 63.814.373/0001-16 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "direitos na carreira militar, promoção militar antiguidade merecimento, conselho de disciplina militar, transferência ex officio, processo administrativo disciplinar militar, reintegração ao posto graduação, advogado militar carreira",
    author: "Nichelle Alves Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Direito Militar de Carreira",
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
      "Derick Guerra Advocacia — Convocação e Nomeação em Processos Seletivos Públicos",
    description:
      "Orientação jurídica especializada sobre preterição na ordem de convocação, ampliação de vagas, cadastro de reserva e validade do certame em processos seletivos públicos. Derick Guerra Sociedade Individual de Advocacia · CNPJ 63.835.741/0001-02 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "preterição na ordem de convocação concurso, nomeação fora da ordem concurso público, cadastro de reserva concurso, ampliação de vagas concurso público, prazo de validade do concurso, direito administrativo convocação, advogado para convocação concurso",
    author: "Derick Guerra Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Direito à Vaga",
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
      "Derick Guerra Advocacia — Convocação e Nomeação em Processos Seletivos Públicos",
    description:
      "Orientação jurídica especializada sobre preterição na ordem de convocação, ampliação de vagas, cadastro de reserva e validade do certame em processos seletivos públicos. Derick Guerra Sociedade Individual de Advocacia · CNPJ 63.835.741/0001-02 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "preterição na ordem de convocação concurso, nomeação fora da ordem concurso público, cadastro de reserva concurso, ampliação de vagas concurso público, prazo de validade do concurso, direito administrativo convocação, advogado para convocação concurso",
    author: "Derick Guerra Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Direito à Vaga",
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
      "Carlos Oliveira Advocacia — Recursos contra Gabarito e Resultado de Provas",
    description:
      "Orientação jurídica especializada sobre contestação de questões, anulação de gabarito, revisão de nota e prazos recursais em provas de processos seletivos públicos. Carlos Oliveira Sociedade Individual de Advocacia · CNPJ 63.910.297/0001-42 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "recurso contra gabarito concurso público, anulação de questão de prova, revisão de nota concurso, contestação de resultado de prova, prazo recursal concurso público, direito administrativo recurso de prova, advogado para recurso de concurso",
    author: "Carlos Oliveira Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Direitos no Concurso",
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
      "Carlos Oliveira Advocacia — Recursos contra Gabarito e Resultado de Provas",
    description:
      "Orientação jurídica especializada sobre contestação de questões, anulação de gabarito, revisão de nota e prazos recursais em provas de processos seletivos públicos. Carlos Oliveira Sociedade Individual de Advocacia · CNPJ 63.910.297/0001-42 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "recurso contra gabarito concurso público, anulação de questão de prova, revisão de nota concurso, contestação de resultado de prova, prazo recursal concurso público, direito administrativo recurso de prova, advogado para recurso de concurso",
    author: "Carlos Oliveira Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Direitos no Concurso",
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
      "Lilian Gama Advocacia — Isenção de Taxa e Reserva de Vagas em Concursos Públicos",
    description:
      "Orientação jurídica especializada sobre indeferimento de isenção de taxa de inscrição, reserva de vagas para pessoas com deficiência e cotas raciais em processos seletivos públicos. Lilian Gama Sociedade Individual de Advocacia · CNPJ 63.924.938/0001-18 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "isenção de taxa de inscrição concurso público, indeferimento de isenção de taxa, reserva de vagas pessoas com deficiência concurso, cotas raciais concurso público, direito administrativo cotas e isenções, advogado para isenção de taxa concurso",
    author: "Lilian Gama Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Direito às Cotas e Isenções",
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
      "Lilian Gama Advocacia — Isenção de Taxa e Reserva de Vagas em Concursos Públicos",
    description:
      "Orientação jurídica especializada sobre indeferimento de isenção de taxa de inscrição, reserva de vagas para pessoas com deficiência e cotas raciais em processos seletivos públicos. Lilian Gama Sociedade Individual de Advocacia · CNPJ 63.924.938/0001-18 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "isenção de taxa de inscrição concurso público, indeferimento de isenção de taxa, reserva de vagas pessoas com deficiência concurso, cotas raciais concurso público, direito administrativo cotas e isenções, advogado para isenção de taxa concurso",
    author: "Lilian Gama Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Direito às Cotas e Isenções",
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
      "Amanda Ciodaro Advocacia — Eliminação e Desligamento em Cursos de Formação Militar",
    description:
      "Orientação jurídica especializada sobre eliminação em teste de aptidão física (TAF), exame psicotécnico e desligamento de cursos de formação em corporações militares. Amanda C Ciodaro de Quadros Sociedade Individual de Advocacia · CNPJ 63.952.036/0001-95 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "eliminação teste de aptidão física militar, desligamento curso de formação militar, exame psicotécnico militar, TAF concurso militar, curso de formação de oficiais soldados, direito administrativo militar formação, advogado curso de formação militar",
    author: "Amanda C Ciodaro de Quadros Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Direito Militar em Formação",
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
      "Amanda Ciodaro Advocacia — Eliminação e Desligamento em Cursos de Formação Militar",
    description:
      "Orientação jurídica especializada sobre eliminação em teste de aptidão física (TAF), exame psicotécnico e desligamento de cursos de formação em corporações militares. Amanda C Ciodaro de Quadros Sociedade Individual de Advocacia · CNPJ 63.952.036/0001-95 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    keywords:
      "eliminação teste de aptidão física militar, desligamento curso de formação militar, exame psicotécnico militar, TAF concurso militar, curso de formação de oficiais soldados, direito administrativo militar formação, advogado curso de formação militar",
    author: "Amanda C Ciodaro de Quadros Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Direito Militar em Formação",
    ogTitle:
      "Eliminação e Desligamento em Cursos de Formação Militar | Amanda Ciodaro Advocacia",
    ogDescription:
      "Orientação jurídica sobre eliminação em TAF, exame psicotécnico e desligamento de cursos de formação militar. Amanda C Ciodaro de Quadros Sociedade Individual de Advocacia — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.b02f9d64",
    gtmId: "GTM-NDCG42NJ",
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
