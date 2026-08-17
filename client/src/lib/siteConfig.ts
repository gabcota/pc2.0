export interface SiteConfig {
  hostname: string;
  siteName: string;
  brand?: string;
  siteSubtitle: string;
  logoImage?: string;
  razaoSocial: string;
  cnpj: string;
  cnpjFormatted: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  enderecoCompleto: string;
  canonicalUrl: string;
  disclaimer: string;
  email?: string;
  telefone?: string;
  cnae?: string;
  naturezaJuridica?: string;
  dataAbertura?: string;
  capitalSocial?: string;
  horarioAtendimento?: string;
  gadsConversionSendTo?: string;
  gtagId?: string;
  utmifyPixelId?: string;
  redUrl?: string;
  h1Override?: string;
  leadOverride?: string;
  ctaHeroText?: string;
  breadcrumbLabel?: string;
  themeSection?: {
    heading: string;
    body: string;
  };
  oabNumero?: string;
  oabSeccional?: string;
  advogadoNome?: string;
  advogadoAtuacao?: string;
}

type RawConfig = Omit<SiteConfig, 'siteName'>;

// NOTE: This project serves a single production domain today — concursopm.click
// (Siqueira e Magalhaes Sociedade de Advogados — informação jurídica/advocacia
// sobre direitos e estabilidade na carreira pública, powered by ZapZapPage.tsx).
// Content is intentionally framed around the servant's post-approval career
// (probation, disciplinary proceedings, promotions) rather than exam/edital
// language, to avoid repetitive "concurso"/"taxa" wording across the page.
const VIDA_FUNCIONAL: RawConfig = {
  hostname: 'concursopm.click',
  brand: 'Direito de Carreira',
  siteSubtitle: 'Orientação Jurídica sobre Direitos e Estabilidade na Carreira Pública',
  razaoSocial: 'Siqueira e Magalhaes Sociedade de Advogados',
  cnpj: '63851818000138',
  cnpjFormatted: '63.851.818/0001-38',
  endereco: 'Rua Retiro dos Artistas, 01931, Apt 104 Blc 3',
  bairro: 'Pechincha',
  cidade: 'Rio de Janeiro',
  estado: 'RJ',
  cep: '22770-104',
  enderecoCompleto: 'Rua Retiro dos Artistas, 01931, Apt 104 Blc 3 · Pechincha · Rio de Janeiro/RJ · CEP 22770-104',
  canonicalUrl: 'https://www.concursopm.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre direitos de servidores públicos e não constituem aconselhamento jurídico individual. Este site é independente e não possui vínculo com qualquer órgão, entidade ou instituição pública.',
  email: 'contabil@siqueiramagalhaesadvogados.com.br',
  telefone: '(21) 2435-8134',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Simples Pura',
  capitalSocial: 'R$ 10.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Siqueira e Magalhaes Sociedade de Advogados',
  advogadoAtuacao: 'Direito Administrativo e Carreira do Servidor Público',
  breadcrumbLabel: 'Direitos do Servidor Público',
  h1Override: 'Orientação jurídica sobre direitos e estabilidade na carreira pública',
  leadOverride: 'Reunimos orientação jurídica sobre os principais momentos da vida funcional do servidor público — estágio probatório, processos administrativos, promoções e estabilidade. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // dataAbertura: intentionally left unset — not provided in the CNPJ data supplied
  // for this domain; do not fabricate.
  // naturezaJuridica kept as plain text (no code) — "Sociedade Simples Pura" has
  // no verified numeric code on hand.
  // advogadoNome uses the firm name (multiple sócios, no single lead attorney given).
  // oabNumero: intentionally left unset — no OAB registration number was provided.
  // ZapZapPage only shows office/attorney claims (isVerifiedLawFirm) when BOTH
  // advogadoNome and oabNumero are set, to avoid misleading legal advertising.
};

// direitodocandidatopm.click (Alves & Saavedra Advogados Associados — different
// firm, different CNPJ/registration data from VIDA_FUNCIONAL above). Framed
// around the candidate's *pre-approval* stage of a public selection process
// (exams, medical/psychological reports, background review, administrative
// appeals) rather than "vida funcional" (post-approval career), and avoids
// repeating exam-bait vocabulary ("concurso", "taxa") across headline/FAQ/
// disclaimer — see ad-content-risk-reframing memory for why that matters for
// Google Ads policy review.
const DIREITO_CANDIDATO: RawConfig = {
  hostname: 'direitodocandidatopm.click',
  brand: 'Direito do Candidato',
  siteSubtitle: 'Orientação Jurídica para Candidatos em Processos Seletivos Públicos',
  razaoSocial: 'Alves & Saavedra Advogados Associados',
  cnpj: '65953516000104',
  cnpjFormatted: '65.953.516/0001-04',
  endereco: 'Estrada Coronel Pedro Correia, 740, Sala 513',
  bairro: 'Jacarepaguá',
  cidade: 'Rio de Janeiro',
  estado: 'RJ',
  cep: '22775-090',
  enderecoCompleto: 'Estrada Coronel Pedro Correia, 740, Sala 513 · Jacarepaguá · Rio de Janeiro/RJ · CEP 22775-090',
  canonicalUrl: 'https://www.direitodocandidatopm.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre direitos de candidatos em processos seletivos públicos e não constituem aconselhamento jurídico individual. Este site é independente e não possui vínculo com qualquer órgão, entidade, banca organizadora ou instituição pública.',
  email: 'dericsaavedra@alvessaavedra.com',
  telefone: '(21) 99654-5319',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Simples Pura',
  dataAbertura: '11/03/2025',
  capitalSocial: 'R$ 1.500,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Alves & Saavedra Advogados Associados',
  advogadoAtuacao: 'Direito Administrativo e Direitos do Candidato em Processos Seletivos Públicos',
  breadcrumbLabel: 'Direitos do Candidato em Concursos Públicos',
  h1Override: 'Orientação jurídica para candidatos em processos seletivos públicos',
  leadOverride: 'Reunimos orientação jurídica sobre as principais etapas do processo seletivo — exames, investigação social, laudos médicos e psicológicos e recursos administrativos. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // oabNumero: intentionally left unset — no OAB registration number was
  // provided; advogadoNome uses the firm name (2 sócios-administradores, no
  // single lead attorney given). ZapZapPage only shows office/attorney claims
  // (isVerifiedLawFirm) when BOTH advogadoNome and oabNumero are set.
};

// editalpm.click (L.f.a. Oliveira Sociedade Individual de Advocacia — sole
// practitioner, third distinct firm/CNPJ). Framed around the *pre-inscription*
// edital stage (notice irregularities, impugnação, isonomia between
// candidates) — a third angle distinct from both VIDA_FUNCIONAL (post-approval
// career) and DIREITO_CANDIDATO (exam/selection stage) above.
const DIREITO_EDITAL: RawConfig = {
  hostname: 'editalpm.click',
  brand: 'Direito no Edital',
  siteSubtitle: 'Orientação Jurídica sobre Irregularidades em Editais de Processos Seletivos Públicos',
  razaoSocial: 'L.f.a. Oliveira Sociedade Individual de Advocacia',
  cnpj: '67877690000132',
  cnpjFormatted: '67.877.690/0001-32',
  endereco: 'Avenida Rio Branco, 156, Sala 2321',
  bairro: 'Centro',
  cidade: 'Rio de Janeiro',
  estado: 'RJ',
  cep: '20040-003',
  enderecoCompleto: 'Avenida Rio Branco, 156, Sala 2321 · Centro · Rio de Janeiro/RJ · CEP 20040-003',
  canonicalUrl: 'https://www.editalpm.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre editais de processos seletivos públicos e não constituem aconselhamento jurídico individual. Este site é independente e não possui vínculo com qualquer órgão, entidade, banca organizadora ou instituição pública.',
  email: 'contato@lfaoliveira.adv.br',
  telefone: '(21) 97629-5329',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Unipessoal de Advocacia',
  dataAbertura: '08/03/2024',
  capitalSocial: 'R$ 250.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Luiz Fernando Araujo Oliveira',
  advogadoAtuacao: 'Direito Administrativo e Impugnação de Editais de Processos Seletivos Públicos',
  breadcrumbLabel: 'Direitos em Editais de Concursos Públicos',
  h1Override: 'Orientação jurídica sobre irregularidades em editais de processos seletivos públicos',
  leadOverride: 'Reunimos orientação jurídica sobre prazos, requisitos e possíveis irregularidades em editais de processos seletivos — impugnação, retificação e isonomia entre candidatos. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // oabNumero: intentionally left unset — no OAB registration number was
  // provided, even though this firm is a single named practitioner (Titular
  // Pessoa Física). ZapZapPage only shows office/attorney claims
  // (isVerifiedLawFirm) when BOTH advogadoNome and oabNumero are set.
};

// carreiramilitarpm.click (Nichelle Alves Sociedade Individual de Advocacia —
// sole practitioner, fourth distinct firm/CNPJ). Framed around military-
// specific career vocabulary (posto/graduação, conselho de disciplina,
// transferência ex officio) rather than the generic civilian-servant framing
// in VIDA_FUNCIONAL, so the two "post-approval career" domains stay distinct.
const CARREIRA_MILITAR: RawConfig = {
  hostname: 'carreiramilitarpm.click',
  brand: 'Direito Militar de Carreira',
  siteSubtitle: 'Orientação Jurídica sobre Direitos na Carreira Militar',
  razaoSocial: 'Nichelle Alves Sociedade Individual de Advocacia',
  cnpj: '63814373000116',
  cnpjFormatted: '63.814.373/0001-16',
  endereco: 'Avenida Rio Branco, 45, Sala 2102',
  bairro: 'Centro',
  cidade: 'Rio de Janeiro',
  estado: 'RJ',
  cep: '20090-908',
  enderecoCompleto: 'Avenida Rio Branco, 45, Sala 2102 · Centro · Rio de Janeiro/RJ · CEP 20090-908',
  canonicalUrl: 'https://www.carreiramilitarpm.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre direitos de militares na carreira e não constituem aconselhamento jurídico individual. Este site é independente e não possui vínculo com qualquer corporação, órgão ou instituição militar.',
  email: 'nichellealves@carraroeguimaraes.com.br',
  telefone: '(21) 98054-5461',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Unipessoal de Advocacia',
  dataAbertura: '16/06/2025',
  capitalSocial: 'R$ 2.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Nichelle Moura Alves',
  advogadoAtuacao: 'Direito Administrativo Militar e Carreira nas Corporações Militares',
  breadcrumbLabel: 'Direitos na Carreira Militar',
  h1Override: 'Orientação jurídica sobre direitos na carreira militar',
  leadOverride: 'Reunimos orientação jurídica sobre os principais momentos da carreira militar — promoções, transferências, processos disciplinares e conselhos de disciplina, licenciamento e reintegração. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // oabNumero: intentionally left unset — no OAB registration number was
  // provided, even though this firm is a single named practitioner (Titular
  // Pessoa Física). ZapZapPage only shows office/attorney claims
  // (isVerifiedLawFirm) when BOTH advogadoNome and oabNumero are set.
};

// vagaspm.click (Derick Guerra Sociedade Individual de Advocacia — sole
// practitioner, fifth distinct firm/CNPJ). Framed around convocation/vacancy
// rights (ordem de convocação, cadastro de reserva, prazo de validade) — a
// fifth angle distinct from candidate/edital/career/military-career above.
const DIREITO_VAGAS: RawConfig = {
  hostname: 'vagaspm.click',
  brand: 'Direito à Vaga',
  siteSubtitle: 'Orientação Jurídica sobre Convocação e Nomeação em Processos Seletivos Públicos',
  razaoSocial: 'Derick Guerra Sociedade Individual de Advocacia',
  cnpj: '63835741000102',
  cnpjFormatted: '63.835.741/0001-02',
  endereco: 'Avenida Treze de Maio, 47, Sala 2309',
  bairro: 'Centro',
  cidade: 'Rio de Janeiro',
  estado: 'RJ',
  cep: '20031-921',
  enderecoCompleto: 'Avenida Treze de Maio, 47, Sala 2309 · Centro · Rio de Janeiro/RJ · CEP 20031-921',
  canonicalUrl: 'https://www.vagaspm.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre direitos de convocação e nomeação em processos seletivos públicos e não constituem aconselhamento jurídico individual. Este site é independente e não possui vínculo com qualquer órgão, entidade, banca organizadora ou instituição pública.',
  email: 'advderickguerra@gmail.com',
  telefone: '(21) 96963-9874',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Unipessoal de Advocacia',
  dataAbertura: '09/06/2025',
  capitalSocial: 'R$ 30.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Derick Octaviano Guerra de Assis',
  advogadoAtuacao: 'Direito Administrativo e Convocação em Processos Seletivos Públicos',
  breadcrumbLabel: 'Direitos de Convocação em Concursos Públicos',
  h1Override: 'Orientação jurídica sobre convocação e nomeação em processos seletivos públicos',
  leadOverride: 'Reunimos orientação jurídica sobre preterição na ordem de convocação, ampliação de vagas, cadastro de reserva e prazo de validade do certame. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // oabNumero: intentionally left unset — no OAB registration number was
  // provided, even though this firm is a single named practitioner (Titular
  // Pessoa Física). ZapZapPage only shows office/attorney claims
  // (isVerifiedLawFirm) when BOTH advogadoNome and oabNumero are set.
};

// direitosconcursopm.click (Carlos Oliveira Sociedade Individual de Advocacia
// — sole practitioner, sixth distinct firm/CNPJ). Framed around exam-content
// disputes (recurso contra gabarito, anulação de questão, revisão de nota) —
// a sixth angle distinct from candidate/edital/career/military-career/vacancy
// above.
const DIREITOS_PROVA: RawConfig = {
  hostname: 'direitosconcursopm.click',
  brand: 'Direitos no Concurso',
  siteSubtitle: 'Orientação Jurídica sobre Recursos contra Gabarito e Resultado de Provas',
  razaoSocial: 'Carlos Oliveira Sociedade Individual de Advocacia',
  cnpj: '63910297000142',
  cnpjFormatted: '63.910.297/0001-42',
  endereco: 'Rua Da Quitanda, 19, Sala 206',
  bairro: 'Centro',
  cidade: 'Rio de Janeiro',
  estado: 'RJ',
  cep: '20011-030',
  enderecoCompleto: 'Rua Da Quitanda, 19, Sala 206 · Centro · Rio de Janeiro/RJ · CEP 20011-030',
  canonicalUrl: 'https://www.direitosconcursopm.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre recursos administrativos em provas de processos seletivos públicos e não constituem aconselhamento jurídico individual. Este site é independente e não possui vínculo com qualquer órgão, entidade, banca organizadora ou instituição pública.',
  email: 'digicontassessoriacontabil@gmail.com',
  telefone: '(21) 99696-3935',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Unipessoal de Advocacia',
  dataAbertura: '10/03/2025',
  capitalSocial: 'R$ 5.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Carlos Renato Silva de Oliveira',
  advogadoAtuacao: 'Direito Administrativo e Recursos contra Gabarito e Resultado de Provas',
  breadcrumbLabel: 'Recursos contra Gabarito em Concursos Públicos',
  h1Override: 'Orientação jurídica sobre recursos contra gabarito e resultado de provas',
  leadOverride: 'Reunimos orientação jurídica sobre contestação de questões, anulação de gabarito, revisão de nota e prazos recursais em provas de processos seletivos públicos. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // oabNumero: intentionally left unset — no OAB registration number was
  // provided, even though this firm is a single named practitioner (Titular
  // Pessoa Física). ZapZapPage only shows office/attorney claims
  // (isVerifiedLawFirm) when BOTH advogadoNome and oabNumero are set.
};

// assessoriapm.click (Lilian Gama Sociedade Individual de Advocacia — sole
// practitioner, seventh distinct firm/CNPJ). Framed around fee-exemption and
// quota-reservation rights (isenção de taxa, reserva de vagas PCD/cotas
// raciais) — a seventh angle distinct from candidate/edital/career/military-
// career/vacancy/exam-content above.
const DIREITO_COTAS: RawConfig = {
  hostname: 'assessoriapm.click',
  brand: 'Direito às Cotas e Isenções',
  siteSubtitle: 'Orientação Jurídica sobre Isenção de Taxa e Reserva de Vagas em Concursos Públicos',
  razaoSocial: 'Lilian Gama Sociedade Individual de Advocacia',
  cnpj: '63924938000118',
  cnpjFormatted: '63.924.938/0001-18',
  endereco: 'Avenida Treze de Maio, 47, Apt 1813',
  bairro: 'Centro',
  cidade: 'Rio de Janeiro',
  estado: 'RJ',
  cep: '20031-921',
  enderecoCompleto: 'Avenida Treze de Maio, 47, Apt 1813 · Centro · Rio de Janeiro/RJ · CEP 20031-921',
  canonicalUrl: 'https://www.assessoriapm.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre isenção de taxa e reserva de vagas em processos seletivos públicos e não constituem aconselhamento jurídico individual. Este site é independente e não possui vínculo com qualquer órgão, entidade, banca organizadora ou instituição pública.',
  email: 'contabilidadeprb@gmail.com',
  telefone: '(21) 99984-1663',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Unipessoal de Advocacia',
  dataAbertura: '19/09/2023',
  capitalSocial: 'R$ 1.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Lilian Silva da Gama',
  advogadoAtuacao: 'Direito Administrativo e Cotas e Isenções em Processos Seletivos Públicos',
  breadcrumbLabel: 'Isenção de Taxa e Reserva de Vagas em Concursos Públicos',
  h1Override: 'Orientação jurídica sobre isenção de taxa e reserva de vagas em concursos públicos',
  leadOverride: 'Reunimos orientação jurídica sobre indeferimento de isenção de taxa, reserva de vagas para pessoas com deficiência e cotas raciais em processos seletivos públicos. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // oabNumero: intentionally left unset — no OAB registration number was
  // provided, even though this firm is a single named practitioner (Titular
  // Pessoa Física). ZapZapPage only shows office/attorney claims
  // (isVerifiedLawFirm) when BOTH advogadoNome and oabNumero are set.
};

// militarconcursos.click (Amanda C Ciodaro de Quadros Sociedade Individual de
// Advocacia — sole practitioner, eighth distinct firm/CNPJ). Framed around
// the military formation-course stage (TAF elimination, exame psicotécnico,
// desligamento do curso de formação) — distinct from CARREIRA_MILITAR (already
// a career member facing PAD/promotion) and DIREITO_CANDIDATO (generic civil
// selection-process candidate rights).
const MILITAR_FORMACAO: RawConfig = {
  hostname: 'militarconcursos.click',
  brand: 'Direito Militar em Formação',
  siteSubtitle: 'Orientação Jurídica sobre Eliminação e Desligamento em Cursos de Formação Militar',
  razaoSocial: 'Amanda C Ciodaro de Quadros Sociedade Individual de Advocacia',
  cnpj: '63952036000195',
  cnpjFormatted: '63.952.036/0001-95',
  endereco: 'Avenida Das Américas, 4200, Bloco 1, Sala 305',
  bairro: 'Barra da Tijuca',
  cidade: 'Rio de Janeiro',
  estado: 'RJ',
  cep: '22640-907',
  enderecoCompleto: 'Avenida Das Américas, 4200, Bloco 1, Sala 305 · Barra da Tijuca · Rio de Janeiro/RJ · CEP 22640-907',
  canonicalUrl: 'https://www.militarconcursos.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre direitos em cursos de formação militar e não constituem aconselhamento jurídico individual. Este site é independente e não possui vínculo com qualquer corporação, órgão ou instituição militar.',
  email: 'amandacq.adv@gmail.com',
  telefone: '(21) 99402-1596',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Unipessoal de Advocacia',
  dataAbertura: '26/04/2024',
  capitalSocial: 'R$ 1.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Amanda Cardoso Ciodaro de Quadros',
  advogadoAtuacao: 'Direito Administrativo Militar e Cursos de Formação',
  breadcrumbLabel: 'Eliminação em Curso de Formação Militar',
  h1Override: 'Orientação jurídica sobre eliminação e desligamento em cursos de formação militar',
  leadOverride: 'Reunimos orientação jurídica sobre eliminação em teste de aptidão física, exame psicotécnico e desligamento de cursos de formação em corporações militares. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // oabNumero: intentionally left unset — no OAB registration number was
  // provided, even though this firm is a single named practitioner (Titular
  // Pessoa Física). ZapZapPage only shows office/attorney claims
  // (isVerifiedLawFirm) when BOTH advogadoNome and oabNumero are set.
};

const CONFIGS: Record<string, RawConfig> = {
  'concursopm.click': VIDA_FUNCIONAL,
  'www.concursopm.click': VIDA_FUNCIONAL,
  'direitodocandidatopm.click': DIREITO_CANDIDATO,
  'www.direitodocandidatopm.click': DIREITO_CANDIDATO,
  'editalpm.click': DIREITO_EDITAL,
  'www.editalpm.click': DIREITO_EDITAL,
  'carreiramilitarpm.click': CARREIRA_MILITAR,
  'www.carreiramilitarpm.click': CARREIRA_MILITAR,
  'vagaspm.click': DIREITO_VAGAS,
  'www.vagaspm.click': DIREITO_VAGAS,
  'direitosconcursopm.click': DIREITOS_PROVA,
  'www.direitosconcursopm.click': DIREITOS_PROVA,
  'assessoriapm.click': DIREITO_COTAS,
  'www.assessoriapm.click': DIREITO_COTAS,
  'militarconcursos.click': MILITAR_FORMACAO,
  'www.militarconcursos.click': MILITAR_FORMACAO,
};

function resolveHostname(): string {
  if (typeof window === 'undefined') return '';
  return window.location.hostname.replace(/^www\./, '');
}

const DEFAULT_CONFIG: RawConfig = VIDA_FUNCIONAL;

export function getSiteConfig(): SiteConfig {
  const host = resolveHostname();
  let raw: RawConfig;
  if (host.includes('.replit.dev')) {
    const keys = Object.keys(CONFIGS);
    raw = CONFIGS[keys[keys.length - 1]] ?? DEFAULT_CONFIG;
  } else {
    raw = CONFIGS[window.location.hostname] ?? CONFIGS[host] ?? DEFAULT_CONFIG;
  }
  return { ...raw, siteName: raw.brand || raw.razaoSocial };
}

export const siteConfig: SiteConfig = getSiteConfig();
