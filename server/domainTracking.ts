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
      "Siqueira e Magalhaes Advogados — Direitos e Estabilidade na Carreira Pública",
    description:
      "Orientação jurídica especializada sobre estágio probatório, processos administrativos disciplinares, promoções e estabilidade na carreira pública. Siqueira e Magalhaes Sociedade de Advogados · CNPJ 63.851.818/0001-38 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
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
  "militarconcurseiro.click": {
    domain: "militarconcurseiro.click",
    faviconPath: "/favicon.svg",
    ogImage: "/favicon.svg",
    clarityId: null,
    homepageKey: "zapzap",
    title:
      "Maria da Penha Amorim Advocacia — Exclusão e Eliminação no Concurso Militar",
    description:
      "Orientação jurídica especializada sobre eliminação por tatuagem, altura, peso e reprovação na inspeção de saúde em concursos para ingresso em corporações militares. Maria da Penha Amorim - Sociedade Individual de Advocacia · CNPJ 64.039.055/0001-98 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Maria da Penha Amorim - Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Direito no Concurso Militar",
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
      "Maria da Penha Amorim Advocacia — Exclusão e Eliminação no Concurso Militar",
    description:
      "Orientação jurídica especializada sobre eliminação por tatuagem, altura, peso e reprovação na inspeção de saúde em concursos para ingresso em corporações militares. Maria da Penha Amorim - Sociedade Individual de Advocacia · CNPJ 64.039.055/0001-98 · Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    author: "Maria da Penha Amorim - Sociedade Individual de Advocacia",
    ogType: "website",
    siteName: "Direito no Concurso Militar",
    ogTitle:
      "Exclusão e Eliminação no Concurso Militar | Maria da Penha Amorim Advocacia",
    ogDescription:
      "Orientação jurídica sobre eliminação por tatuagem, altura, peso e reprovação na inspeção de saúde em concursos militares. Maria da Penha Amorim - Sociedade Individual de Advocacia — Rio de Janeiro/RJ. Consulte um advogado habilitado para orientação específica ao seu caso.",
    analyticsCore: "signal.d6e29f83",
    gtmId: "GTM-TQTDTZZM",
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
