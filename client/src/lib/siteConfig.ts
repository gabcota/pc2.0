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
  // Domain-specific FAQ shown on ZapZapPage.tsx (and mirrored in
  // server/domainTracking.ts's DOMAIN_FAQS for the FAQPage JSON-LD — keep
  // both in sync). Falls back to a generic default when omitted. The
  // WhatsApp Q&A item is appended separately by ZapZapPage based on
  // isVerifiedLawFirm and is not part of this array.
  faq?: { q: string; a: string }[];
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
  faq: [
    {
      q: 'Fui exonerado durante o estágio probatório sem processo — isso é legal?',
      a: 'Não necessariamente. Mesmo durante o estágio probatório, a exoneração por inadaptação ou insuficiência de desempenho deve ser precedida de avaliação formal, com critérios objetivos, contraditório e ampla defesa. A ausência desses elementos pode tornar o ato nulo e permitir a reintegração por via administrativa ou judicial.',
    },
    {
      q: 'Tenho direito a uma promoção que foi negada?',
      a: 'Depende dos critérios previstos no estatuto ou plano de carreira aplicável. Se você preenchia os requisitos de antiguidade ou merecimento e foi preterido sem justificativa, ou se os critérios de avaliação foram aplicados de forma desigual entre servidores, é possível questionar a decisão administrativamente e, se necessário, judicialmente.',
    },
    {
      q: 'Como funciona a defesa em um Processo Administrativo Disciplinar (PAD)?',
      a: 'O servidor tem direito a ser notificado formalmente, apresentar defesa escrita, produzir provas e acompanhar todos os atos por advogado. Irregularidades como cerceamento de defesa, comissão parcial ou penalidade desproporcional à falta podem levar à anulação do processo e da punição aplicada.',
    },
    {
      q: 'Minha transferência ou remoção foi negada — posso contestar?',
      a: 'Sim, especialmente quando o indeferimento carece de motivação adequada ou desconsidera critérios legais aplicáveis, como razões de saúde ou reunião familiar previstas em lei. É possível pedir a revisão administrativa da decisão e, conforme o caso, buscar a via judicial.',
    },
  ],
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
  faq: [
    {
      q: 'Fui eliminado no exame médico ou psicológico — posso contestar?',
      a: 'Sim, é possível questionar a eliminação quando o laudo carece de fundamentação técnica, contraria exames anteriores ou não observa o direito à ciência prévia dos critérios de avaliação e à interposição de recurso. Irregularidades no procedimento podem levar à revisão administrativa ou judicial do resultado.',
    },
    {
      q: 'A investigação social ou sindicância de vida pregressa pode me eliminar por qualquer motivo?',
      a: 'Não. A avaliação deve se limitar aos critérios objetivos previstos no edital, com direito ao contraditório e à apresentação de esclarecimentos antes da decisão final. Eliminações baseadas em fatos genéricos, não comprovados ou incompatíveis com os critérios fixados podem ser contestadas.',
    },
    {
      q: 'Tenho direito a recurso contra minha eliminação em qualquer etapa do processo seletivo?',
      a: 'Em regra, sim — o edital deve prever prazo e forma para apresentação de recurso administrativo em cada fase eliminatória. A ausência de resposta fundamentada da banca ou o descumprimento do prazo legal de análise também pode ser questionado.',
    },
    {
      q: 'Posso pedir para refazer um exame se discordar do resultado?',
      a: 'Depende das regras do edital e da natureza do exame. Em alguns casos é possível solicitar reavaliação por junta ou nova perícia quando há dúvida técnica fundamentada sobre o resultado, especialmente diante de laudos contraditórios ou vícios no procedimento adotado.',
    },
  ],
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
  faq: [
    {
      q: 'Posso impugnar um edital antes mesmo de me inscrever?',
      a: 'Sim. A impugnação de edital é um recurso administrativo que pode ser apresentado por qualquer interessado, mesmo antes da inscrição, dentro do prazo fixado no próprio instrumento convocatório, para questionar cláusulas consideradas ilegais ou contraditórias.',
    },
    {
      q: 'O que fazer se o edital tiver exigências que considero discriminatórias?',
      a: 'Requisitos sem relação direta com as atribuições do cargo ou que restrinjam a participação de forma desproporcional podem violar o princípio da isonomia entre candidatos e ser impugnados administrativamente, com possibilidade de revisão judicial caso o pedido seja indeferido sem fundamentação adequada.',
    },
    {
      q: 'A retificação do edital pode prejudicar quem já se inscreveu?',
      a: 'Alterações relevantes — como mudança de requisitos, datas ou etapas — após o início das inscrições devem, em regra, reabrir prazo ou assegurar tratamento igualitário aos já inscritos, sob pena de violar direitos adquiridos no âmbito do certame.',
    },
    {
      q: 'Existe prazo para questionar irregularidades no edital?',
      a: 'Sim, o próprio edital costuma fixar prazos específicos para impugnação e para recursos em cada fase. Perder esse prazo administrativo não impede necessariamente a análise judicial, mas reduz as chances de solução rápida do problema.',
    },
  ],
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
  faq: [
    {
      q: 'Fui preterido em uma promoção por antiguidade ou merecimento — posso contestar?',
      a: 'Sim, quando o militar preenchia os requisitos previstos no regulamento de promoções e foi preterido sem justificativa compatível com os critérios legais, ou quando a avaliação de merecimento foi aplicada de forma desigual entre pares, a decisão pode ser questionada administrativamente e, se necessário, judicialmente.',
    },
    {
      q: 'Como funciona a defesa em um Conselho de Disciplina?',
      a: 'O militar tem direito a ser notificado formalmente, apresentar defesa escrita, produzir provas e ser assistido por advogado durante todo o procedimento. Cerceamento de defesa, composição irregular do conselho ou penalidade desproporcional à falta podem levar à anulação do processo.',
    },
    {
      q: 'A transferência ex officio pode ser negada ou revertida?',
      a: 'A transferência de interesse da corporação deve observar motivação adequada e, quando cabível, os critérios legais de proteção à saúde ou à unidade familiar. Decisões sem fundamentação suficiente ou que desconsiderem tais critérios podem ser objeto de revisão administrativa ou judicial.',
    },
    {
      q: 'É possível pedir reintegração ao posto ou graduação após exclusão da corporação?',
      a: 'Sim, quando a exclusão resultou de processo administrativo com vícios formais — como cerceamento de defesa ou ausência de contraditório — é possível pleitear a reintegração ao posto ou graduação, com efeitos retroativos, pelas vias administrativa ou judicial.',
    },
  ],
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
  faq: [
    {
      q: 'Fui preterido na ordem de convocação — o que posso fazer?',
      a: 'A nomeação deve seguir rigorosamente a ordem de classificação prevista no edital. Quando outro candidato pior classificado é convocado antes de você sem justificativa legal, é possível pleitear administrativamente a sua nomeação imediata e, se necessário, buscar a via judicial.',
    },
    {
      q: 'O que é o cadastro de reserva e quando ele pode ser convocado?',
      a: 'É a lista de candidatos aprovados além do número de vagas do edital, que pode ser convocada em caso de surgimento de novas vagas dentro do prazo de validade do concurso. A administração tem discricionariedade limitada e, havendo vaga e necessidade comprovada, a convocação pode se tornar um direito subjetivo do candidato.',
    },
    {
      q: 'A administração pode ampliar o número de vagas durante a validade do concurso?',
      a: 'Sim, e quando isso ocorre — por abertura de novo edital para o mesmo cargo ou por vagas surgidas por aposentadoria, exoneração ou criação de cargos — os candidatos aprovados em cadastro de reserva podem ter direito à convocação antes de um novo certame.',
    },
    {
      q: 'O que acontece se o prazo de validade do concurso expirar sem minha convocação?',
      a: 'Em regra, o direito à nomeação se extingue com o fim da validade do concurso. No entanto, se ficar comprovado que a administração deixou de convocar candidatos aprovados dentro das vagas por conveniência, sem justificativa idônea, é possível questionar a omissão judicialmente.',
    },
  ],
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
  faq: [
    {
      q: 'Posso recorrer se discordar do gabarito preliminar?',
      a: 'Sim, o edital costuma prever prazo específico para apresentação de recurso contra o gabarito preliminar, com fundamentação técnica sobre a questão contestada. A banca é obrigada a analisar e responder de forma motivada cada recurso apresentado.',
    },
    {
      q: 'Uma questão pode ser anulada por erro na formulação?',
      a: 'Sim. Questões com enunciado ambíguo, mais de uma alternativa correta, conteúdo fora do programa do edital ou desatualizado podem ser anuladas, hipótese em que a pontuação costuma ser atribuída a todos os candidatos.',
    },
    {
      q: 'Como pedir revisão de nota em prova discursiva ou redação?',
      a: 'É possível solicitar revisão quando os critérios de correção não foram aplicados de forma objetiva e uniforme, ou quando há divergência relevante entre a nota atribuída e o conteúdo efetivamente apresentado, sempre dentro do prazo recursal fixado no edital.',
    },
    {
      q: 'Existe prazo para apresentar recurso contra o resultado da prova?',
      a: 'Sim, os prazos recursais são fixados no edital e costumam ser curtos — em geral, poucos dias após a divulgação do resultado ou gabarito. Perder esse prazo administrativo pode limitar as opções de questionamento posterior.',
    },
  ],
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
  faq: [
    {
      q: 'Meu pedido de isenção da taxa de inscrição foi indeferido — posso contestar?',
      a: 'Sim. O indeferimento deve ser motivado e observar os critérios objetivos previstos no edital, como renda familiar ou doação de sangue/medula. Decisões genéricas, sem análise da documentação apresentada, podem ser questionadas administrativamente e, se necessário, judicialmente, inclusive com pedido de reabertura de prazo de inscrição.',
    },
    {
      q: 'Como funciona a reserva de vagas para pessoas com deficiência?',
      a: 'O edital deve reservar percentual de vagas para candidatos com deficiência, com direito a condições especiais durante a prova e avaliação por equipe multiprofissional após a aprovação. Indeferimentos sem perícia adequada ou critérios incompatíveis com a lei podem ser contestados.',
    },
    {
      q: 'Posso recorrer se for eliminado na avaliação da comissão de heteroidentificação (cotas raciais)?',
      a: 'Sim, o edital deve prever direito a recurso contra a decisão da comissão, com possibilidade de nova avaliação por comissão distinta em caso de vício procedimental, ausência de gravação da entrevista ou de fundamentação da decisão.',
    },
    {
      q: 'A perda da condição de cotista pode ser contestada?',
      a: 'Sim, especialmente quando a exclusão da lista de cotistas se baseia em critérios não previstos no edital ou em procedimento que não assegurou contraditório e ampla defesa ao candidato antes da decisão final.',
    },
  ],
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
  faq: [
    {
      q: 'Fui eliminado no teste de aptidão física (TAF) — isso é definitivo?',
      a: 'Não necessariamente. O TAF deve seguir critérios objetivos e uniformes previstos no edital do curso de formação, com direito a nova tentativa quando prevista em regulamento. Falhas no procedimento — como aplicação irregular do teste ou ausência de avaliação médica prévia — podem justificar a revisão do resultado.',
    },
    {
      q: 'Posso contestar o resultado do exame psicotécnico militar?',
      a: 'Sim, especialmente quando o laudo é inconclusivo, contraria avaliações anteriores compatíveis, ou não observa o direito a conhecer os critérios de avaliação e a interpor recurso com acesso aos parâmetros utilizados pela banca examinadora.',
    },
    {
      q: 'O desligamento de um curso de formação precisa seguir algum processo formal?',
      a: 'Sim. O desligamento por insuficiência de rendimento ou disciplinar deve ser precedido de procedimento formal, com notificação, oportunidade de defesa e critérios objetivos de avaliação. A ausência desses elementos pode tornar o ato passível de anulação.',
    },
    {
      q: 'É possível ser reintegrado a um curso de formação após desligamento?',
      a: 'Quando o desligamento resultou de vício no procedimento — como cerceamento de defesa ou critério de avaliação não previsto em edital — é possível pleitear a reintegração ao curso, pelas vias administrativa ou judicial, conforme a fase em que o curso se encontrar.',
    },
  ],
  // oabNumero: intentionally left unset — no OAB registration number was
  // provided, even though this firm is a single named practitioner (Titular
  // Pessoa Física). ZapZapPage only shows office/attorney claims
  // (isVerifiedLawFirm) when BOTH advogadoNome and oabNumero are set.
};

// militarconcurseiro.click (Maria da Penha Amorim - Sociedade Individual de
// Advocacia — sole practitioner, ninth distinct firm/CNPJ). Framed around
// exclusion/elimination during the military recruitment exam itself
// (tattoo, minimum height/weight, health-inspection reprovação, TAF da
// prova) — distinct from MILITAR_FORMACAO (already admitted to a formation
// course), CARREIRA_MILITAR (already a career member facing PAD/promotion)
// and DIREITO_CANDIDATO (generic civil selection-process candidate rights).
const MILITAR_CONCURSEIRO: RawConfig = {
  hostname: 'militarconcurseiro.click',
  brand: 'Direito no Concurso Militar',
  siteSubtitle: 'Orientação Jurídica sobre Exclusão e Eliminação no Concurso Militar',
  razaoSocial: 'Maria da Penha Amorim - Sociedade Individual de Advocacia',
  cnpj: '64039055000198',
  cnpjFormatted: '64.039.055/0001-98',
  endereco: 'Rua Riachuelo, 87, Andar 1015',
  bairro: 'Centro',
  cidade: 'Rio de Janeiro',
  estado: 'RJ',
  cep: '20230-010',
  enderecoCompleto: 'Rua Riachuelo, 87, Andar 1015 · Centro · Rio de Janeiro/RJ · CEP 20230-010',
  canonicalUrl: 'https://www.militarconcurseiro.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre direitos de candidatos em concursos militares e não constituem aconselhamento jurídico individual. Este site é independente e não possui vínculo com qualquer corporação, órgão ou instituição militar.',
  email: 'mariadapenhaamorim@yahoo.com.br',
  telefone: '(21) 99787-4891',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Unipessoal de Advocacia',
  dataAbertura: '13/06/2025',
  capitalSocial: 'R$ 5.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Maria da Penha Amorim',
  advogadoAtuacao: 'Direito Administrativo Militar e Concursos Públicos',
  breadcrumbLabel: 'Exclusão no Concurso Militar',
  h1Override: 'Orientação jurídica sobre exclusão e eliminação no concurso para carreira militar',
  leadOverride: 'Reunimos orientação jurídica sobre eliminação por tatuagem, altura, peso e reprovação na inspeção de saúde em concursos para ingresso em corporações militares. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  faq: [
    {
      q: 'Fui eliminado por tatuagem no concurso militar — posso contestar essa decisão?',
      a: 'Depende dos critérios do edital. A eliminação por tatuagem deve observar critérios objetivos e razoáveis, geralmente ligados a visibilidade em farda ou conteúdo ofensivo/discriminatório. Restrições genéricas demais, aplicadas sem análise individual, podem ser questionadas administrativamente e, se necessário, judicialmente.',
    },
    {
      q: 'Não atingi a altura mínima exigida no edital — isso é motivo legítimo de eliminação?',
      a: 'A exigência de altura mínima é comum em editais militares, mas deve estar prevista de forma expressa e proporcional às atribuições do cargo. Quando o critério é aplicado de forma desigual entre candidatos ou não guarda relação com a função, é possível questionar a eliminação.',
    },
    {
      q: 'Fui reprovado na inspeção de saúde por um motivo que considero genérico ou incorreto — o que posso fazer?',
      a: 'É possível solicitar acesso ao laudo detalhado e, quando cabível, pedir reavaliação por junta médica distinta, especialmente se o laudo for contraditório, inconclusivo ou não observar o direito à ampla defesa e ao contraditório previstos no edital.',
    },
    {
      q: 'Posso recorrer se for eliminado no teste de aptidão física por erro na aplicação do teste?',
      a: 'Sim. Falhas na aplicação do teste — como equipamento inadequado, ausência de fiscalização padronizada ou desconsideração de laudo médico anterior — podem justificar recurso administrativo e, se necessário, revisão judicial do resultado.',
    },
  ],
  // oabNumero: intentionally left unset — no OAB registration number was
  // provided, even though this firm is a single named practitioner (Titular
  // Pessoa Física). ZapZapPage only shows office/attorney claims
  // (isVerifiedLawFirm) when BOTH advogadoNome and oabNumero are set.
};

// vocacaopolicial.click (Dutra, Schiessl & Gracher Advogados Associados —
// three sócios-administradores, tenth distinct firm/CNPJ). Framed around the
// psychological-evaluation stage of police selection processes (exame
// psicológico, perfil profissiográfico, desligamento em academia de
// formação) — a tenth angle distinct from the generic candidate/medical
// framing in DIREITO_CANDIDATO and from the broader military-recruitment
// framing (tattoo/height/health) in MILITAR_CONCURSEIRO and MILITAR_FORMACAO.
const VOCACAO_POLICIAL: RawConfig = {
  hostname: 'vocacaopolicial.click',
  brand: 'Direito no Exame Psicológico Policial',
  siteSubtitle: 'Orientação Jurídica sobre Avaliação Psicológica em Concursos para Carreira Policial',
  razaoSocial: 'Dutra, Schiessl & Gracher Advogados Associados',
  cnpj: '60888465000152',
  cnpjFormatted: '60.888.465/0001-52',
  endereco: 'Rua Uruguai, 1348, Andar 4',
  bairro: 'Fazenda',
  cidade: 'Itajaí',
  estado: 'SC',
  cep: '88302-202',
  enderecoCompleto: 'Rua Uruguai, 1348, Andar 4 · Fazenda · Itajaí/SC · CEP 88302-202',
  canonicalUrl: 'https://www.vocacaopolicial.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre avaliação psicológica em concursos para carreira policial e não constituem aconselhamento jurídico individual. Este site é independente e não possui vínculo com qualquer corporação, órgão, banca organizadora ou instituição policial.',
  email: 'contato@dsgadvogados.adv.br',
  telefone: '(47) 3346-7770',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Simples Pura',
  dataAbertura: '19/05/2025',
  capitalSocial: 'R$ 25.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Dutra, Schiessl & Gracher Advogados Associados',
  advogadoAtuacao: 'Direito Administrativo e Avaliação Psicológica em Concursos para Carreira Policial',
  breadcrumbLabel: 'Direitos na Avaliação Psicológica Policial',
  h1Override: 'Orientação jurídica sobre avaliação psicológica em concursos para carreira policial',
  leadOverride: 'Reunimos orientação jurídica sobre eliminação no exame psicológico, perfil profissiográfico e desligamento em cursos de formação de carreiras policiais. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  faq: [
    {
      q: 'Fui eliminado no exame psicológico de um concurso policial — posso contestar?',
      a: 'Sim, especialmente quando o laudo é inconclusivo, contraria avaliações compatíveis anteriores ou não observa o direito de conhecer os critérios do perfil profissiográfico exigido e de interpor recurso com acesso aos parâmetros utilizados pela banca examinadora.',
    },
    {
      q: 'O que é o perfil profissiográfico e como ele pode eliminar um candidato?',
      a: 'É o conjunto de características psicológicas definidas no edital como compatíveis com a função policial. A eliminação só é válida quando fundamentada em critérios técnicos objetivos e previamente divulgados — avaliações genéricas ou sem fundamentação podem ser questionadas administrativamente.',
    },
    {
      q: 'Fui desligado durante o curso de formação por reprovação em avaliação psicológica — o que posso fazer?',
      a: 'O desligamento deve ser precedido de procedimento formal, com direito a conhecer os critérios de avaliação, apresentar contestação e ter acesso ao laudo técnico. Vícios nesse procedimento podem justificar a revisão administrativa ou judicial do desligamento.',
    },
    {
      q: 'É possível pedir uma nova avaliação psicológica se eu discordar do resultado?',
      a: 'Depende das regras do edital. Em diversos casos é possível solicitar reavaliação por junta distinta quando há fundamentada dúvida técnica sobre o laudo, especialmente diante de avaliações contraditórias ou ausência de justificativa individualizada para a eliminação.',
    },
  ],
  // oabNumero: intentionally left unset — no OAB registration number was
  // provided; advogadoNome uses the firm name (três sócios-administradores,
  // no single lead attorney given). ZapZapPage only shows office/attorney
  // claims (isVerifiedLawFirm) when BOTH advogadoNome and oabNumero are set.
};

// pmpelobrasil.click (J. C. Peres Sociedade Individual de Advocacia — sole
// practitioner, eleventh distinct firm/CNPJ). Framed around mid-process
// disruption of a Polícia Militar selection process (judicial suspension,
// anulação por fraude, adiamento de prova, prorrogação de validade) — an
// eleventh angle distinct from pre-inscription edital disputes
// (DIREITO_EDITAL), exam-content disputes (DIREITOS_PROVA) and
// convocation/nomination order (DIREITO_VAGAS).
const CONCURSO_SUSPENSO: RawConfig = {
  hostname: 'pmpelobrasil.click',
  brand: 'Direito em Concursos Suspensos ou Anulados',
  siteSubtitle: 'Orientação Jurídica sobre Suspensão, Anulação e Prorrogação de Concursos para a Polícia Militar',
  razaoSocial: 'J. C. Peres Sociedade Individual de Advocacia',
  cnpj: '62197683000176',
  cnpjFormatted: '62.197.683/0001-76',
  endereco: 'Avenida Jurema, 416, Apt 24',
  bairro: 'Indianópolis',
  cidade: 'São Paulo',
  estado: 'SP',
  cep: '04079-908',
  enderecoCompleto: 'Avenida Jurema, 416, Apt 24 · Indianópolis · São Paulo/SP · CEP 04079-908',
  canonicalUrl: 'https://www.pmpelobrasil.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre suspensão, anulação e prorrogação de concursos públicos para a Polícia Militar e não constituem aconselhamento jurídico individual. Este site é independente e não possui vínculo com qualquer corporação, órgão, banca organizadora ou instituição pública.',
  email: 'jcoelhoperes@gmail.com',
  telefone: '(11) 98707-0800',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Unipessoal de Advocacia',
  dataAbertura: '12/08/2025',
  capitalSocial: 'R$ 1.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Julia Coelho Peres',
  advogadoAtuacao: 'Direito Administrativo e Suspensão/Anulação de Concursos para a Polícia Militar',
  breadcrumbLabel: 'Suspensão e Anulação de Concursos PM',
  h1Override: 'Orientação jurídica sobre suspensão, anulação e prorrogação de concursos para a Polícia Militar',
  leadOverride: 'Reunimos orientação jurídica sobre suspensão judicial, anulação por fraude, adiamento de provas e prorrogação do prazo de validade em concursos para ingresso na Polícia Militar. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  faq: [
    {
      q: 'O concurso da Polícia Militar em que me inscrevi foi suspenso por decisão judicial — o que acontece com a minha inscrição?',
      a: 'Em regra, a suspensão paralisa temporariamente as etapas do certame até a decisão final, preservando os direitos já adquiridos pelos inscritos. Após o restabelecimento do concurso, os candidatos devem ser reintegrados à mesma fase em que o processo foi interrompido, sem prejuízo de sua classificação.',
    },
    {
      q: 'É possível pedir a prorrogação do prazo de validade de um concurso paralisado?',
      a: 'Sim, quando a paralisação decorreu de decisão judicial ou de fato alheio à vontade da administração, é possível pleitear a prorrogação do prazo de validade do certame, de modo a assegurar que o tempo de suspensão não prejudique a expectativa de nomeação dos aprovados.',
    },
    {
      q: 'Um concurso pode ser anulado por suspeita de fraude ou vazamento de provas — o que acontece com quem foi aprovado regularmente?',
      a: 'A anulação total só se justifica quando a fraude compromete a lisura de todo o certame. Quando é possível identificar e isolar os candidatos beneficiados de forma irregular, a administração deve, sempre que viável, preservar a validade do concurso para os demais aprovados sem qualquer participação na fraude.',
    },
    {
      q: 'Posso contestar o adiamento de uma prova sem aviso prévio suficiente?',
      a: 'Sim. Alterações de data, horário ou local de prova devem ser comunicadas com antecedência razoável e por meio de divulgação oficial acessível a todos os inscritos. A ausência de comunicação adequada pode justificar a remarcação da prova ou a anulação da etapa realizada de forma irregular.',
    },
  ],
  // oabNumero: intentionally left unset — no OAB registration number was
  // provided, even though this firm is a single named practitioner (Titular
  // Pessoa Física). ZapZapPage only shows office/attorney claims
  // (isVerifiedLawFirm) when BOTH advogadoNome and oabNumero are set.
};

// guiadafarda.click (Caroline Antunes Geraldi Sociedade Individual de
// Advocacia — sole practitioner, twelfth distinct firm/CNPJ). Framed around
// disciplinary sanctions applied to already-serving militares/policiais for
// personal-presentation and uniform-use standards (corte de cabelo, barba,
// tatuagem, uso do uniforme) — a twelfth angle distinct from CARREIRA_MILITAR
// (broader promoções/transferências/conselho de disciplina) and from
// MILITAR_CONCURSEIRO (recruitment-stage tattoo/height/health exclusion).
const APRESENTACAO_FARDA: RawConfig = {
  hostname: 'guiadafarda.click',
  brand: 'Direito à Apresentação Pessoal na Farda',
  siteSubtitle: 'Orientação Jurídica sobre Sanções Disciplinares por Apresentação Pessoal e Uso de Farda',
  razaoSocial: 'Caroline Antunes Geraldi Sociedade Individual de Advocacia',
  cnpj: '62197679000108',
  cnpjFormatted: '62.197.679/0001-08',
  endereco: 'Rua Dr Angelo Vita, 125, Apt 132',
  bairro: 'Vila Zilda (Tatuapé)',
  cidade: 'São Paulo',
  estado: 'SP',
  cep: '03069-000',
  enderecoCompleto: 'Rua Dr Angelo Vita, 125, Apt 132 · Vila Zilda (Tatuapé) · São Paulo/SP · CEP 03069-000',
  canonicalUrl: 'https://www.guiadafarda.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre sanções disciplinares por apresentação pessoal e uso de farda em corporações militares e policiais e não constituem aconselhamento jurídico individual. Este site é independente e não possui vínculo com qualquer corporação, órgão ou instituição militar ou policial.',
  email: 'adv.cantunes@gmail.com',
  telefone: '(47) 99171-7782',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Unipessoal de Advocacia',
  dataAbertura: '12/08/2025',
  capitalSocial: 'R$ 5.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Caroline Antunes Geraldi',
  advogadoAtuacao: 'Direito Administrativo Disciplinar e Apresentação Pessoal em Corporações Militares e Policiais',
  breadcrumbLabel: 'Sanções por Apresentação Pessoal na Farda',
  h1Override: 'Orientação jurídica sobre sanções disciplinares por apresentação pessoal e uso de farda',
  leadOverride: 'Reunimos orientação jurídica sobre sanções disciplinares por corte de cabelo, barba, tatuagem e uso irregular do uniforme aplicadas a militares e policiais em atividade. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  faq: [
    {
      q: 'Recebi uma sanção disciplinar por corte de cabelo ou barba fora do padrão — posso contestar?',
      a: 'Sim, especialmente quando o padrão exigido não está claramente previsto em regulamento ou quando a sanção foi aplicada sem oportunidade de correção prévia ou de apresentação de defesa. Critérios genéricos ou aplicados de forma desigual entre militares/policiais podem ser questionados administrativamente.',
    },
    {
      q: 'O regulamento pode proibir qualquer tatuagem visível, mesmo já autorizada anteriormente?',
      a: 'Alterações no regulamento de apresentação pessoal não podem, em regra, retroagir para punir situações já consolidadas e previamente autorizadas. A aplicação retroativa de uma nova exigência sem período de adequação pode ser objeto de revisão administrativa ou judicial.',
    },
    {
      q: 'Fui punido por uso incorreto do uniforme — a sanção precisa seguir algum processo formal?',
      a: 'Sim. Mesmo infrações consideradas leves exigem notificação do fato, oportunidade de manifestação e proporcionalidade entre a conduta e a penalidade aplicada. A ausência desses elementos pode tornar a sanção passível de anulação.',
    },
    {
      q: 'É possível recorrer de uma detenção disciplinar aplicada sem direito de defesa prévia?',
      a: 'Sim. Toda sanção disciplinar, inclusive as de menor gravidade, deve observar o contraditório e a ampla defesa. A aplicação de detenção ou punição semelhante sem esse procedimento mínimo pode ser contestada pelas vias administrativa e judicial.',
    },
  ],
  // oabNumero: intentionally left unset — no OAB registration number was
  // provided, even though this firm is a single named practitioner (Titular
  // Pessoa Física). ZapZapPage only shows office/attorney claims
  // (isVerifiedLawFirm) when BOTH advogadoNome and oabNumero are set.
};

// pmemfoco.click (Carlos Leme & Juliana Leme Advogados — two sócios-
// administradores, thirteenth distinct firm/CNPJ). Framed around the
// candidate's right of access to selection-process documents (atas,
// gabaritos, folhas de resposta, critérios de correção) — a thirteenth angle
// distinct from DIREITOS_PROVA (recursos contra o mérito do gabarito) and
// DIREITO_EDITAL (pre-inscription impugnação).
const TRANSPARENCIA_CONCURSO: RawConfig = {
  hostname: 'pmemfoco.click',
  brand: 'Direito à Transparência no Concurso da PM',
  siteSubtitle: 'Orientação Jurídica sobre Acesso a Documentos e Transparência em Concursos da Polícia Militar',
  razaoSocial: 'Carlos Leme & Juliana Leme Advogados',
  cnpj: '43542532000163',
  cnpjFormatted: '43.542.532/0001-63',
  endereco: 'Avenida Adolfo Pinheiro, 2054, Conj 408',
  bairro: 'Santo Amaro',
  cidade: 'São Paulo',
  estado: 'SP',
  cep: '04734-003',
  enderecoCompleto: 'Avenida Adolfo Pinheiro, 2054, Conj 408 · Santo Amaro · São Paulo/SP · CEP 04734-003',
  canonicalUrl: 'https://www.pmemfoco.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre transparência e acesso a documentos em concursos públicos para a Polícia Militar e não constituem aconselhamento jurídico individual. Este site é independente e não possui vínculo com qualquer corporação, órgão, banca organizadora ou instituição pública.',
  email: 'ablancorocha@uol.com.br',
  telefone: '(11) 99844-3933',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Simples Pura',
  dataAbertura: '05/08/2021',
  capitalSocial: 'R$ 10.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Carlos Leme & Juliana Leme Advogados',
  advogadoAtuacao: 'Direito Administrativo e Transparência em Concursos Públicos para a Polícia Militar',
  breadcrumbLabel: 'Transparência em Concursos da PM',
  h1Override: 'Orientação jurídica sobre transparência e acesso a documentos em concursos da Polícia Militar',
  leadOverride: 'Reunimos orientação jurídica sobre o direito de acesso a atas, gabaritos, folhas de resposta e critérios de correção em concursos para ingresso na Polícia Militar. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  faq: [
    {
      q: 'Posso pedir cópia da minha folha de respostas e do espelho de correção da prova?',
      a: 'Sim. O candidato tem direito de acesso aos seus próprios dados e ao resultado de sua avaliação, incluindo folha de respostas e espelho de correção, especialmente quando necessários para fundamentar um recurso administrativo dentro do prazo previsto no edital.',
    },
    {
      q: 'A banca é obrigada a divulgar os critérios de correção da prova discursiva?',
      a: 'Sim, os critérios objetivos de avaliação devem ser divulgados previamente ou, no mínimo, disponibilizados após o resultado, para permitir que o candidato verifique se a nota atribuída corresponde aos parâmetros anunciados no edital.',
    },
    {
      q: 'Tenho direito de acessar a ata da sessão que decidiu minha eliminação?',
      a: 'Em regra, sim. Atas de sessões que resultam em decisões que afetam diretamente um candidato são consideradas informações de interesse pessoal e seu acesso pode ser requerido administrativamente, com base no direito à ampla defesa e ao contraditório.',
    },
    {
      q: 'O que fazer se a administração se recusar a fornecer informações sobre meu processo seletivo?',
      a: 'A recusa injustificada de acesso a informações relacionadas ao próprio processo seletivo pode ser contestada administrativamente e, se necessário, por meio de mandado de segurança ou outra medida judicial cabível, especialmente quando o prazo recursal está em curso.',
    },
  ],
  // oabNumero: intentionally left unset — no OAB registration number was
  // provided; advogadoNome uses the firm name (dois sócios-administradores,
  // no single lead attorney given). ZapZapPage only shows office/attorney
  // claims (isVerifiedLawFirm) when BOTH advogadoNome and oabNumero are set.
};

// guiadapm.click (Gobbette Marques & Barreto Advogados Associados — two
// sócios-administradores, fourteenth distinct firm/CNPJ; no e-mail was
// provided in this firm's registration data, so `email` is intentionally
// omitted rather than fabricated). Framed around exame toxicológico
// elimination in PM selection processes (contraprova, cadeia de custódia da
// amostra) — a fourteenth angle distinct from MILITAR_CONCURSEIRO
// (tattoo/height/health inspection) and VOCACAO_POLICIAL (psychological
// exam/perfil profissiográfico).
const EXAME_TOXICOLOGICO: RawConfig = {
  hostname: 'guiadapm.click',
  brand: 'Direito no Exame Toxicológico do Concurso da PM',
  siteSubtitle: 'Orientação Jurídica sobre Eliminação por Exame Toxicológico em Concursos da Polícia Militar',
  razaoSocial: 'Gobbette Marques & Barreto Advogados Associados',
  cnpj: '20300477000108',
  cnpjFormatted: '20.300.477/0001-08',
  endereco: 'Avenida Getulio Vargas, 128, Edif. Gal. Dr. Naly da E. Mir, Sala 09/11',
  bairro: 'Serra Centro',
  cidade: 'Serra',
  estado: 'ES',
  cep: '29176-090',
  enderecoCompleto: 'Avenida Getulio Vargas, 128, Edif. Gal. Dr. Naly da E. Mir, Sala 09/11 · Serra Centro · Serra/ES · CEP 29176-090',
  canonicalUrl: 'https://www.guiadapm.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre exame toxicológico em concursos públicos para a Polícia Militar e não constituem aconselhamento jurídico individual. Este site é independente e não possui vínculo com qualquer corporação, órgão, banca organizadora ou instituição pública.',
  telefone: '(27) 99244-3959',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Simples Pura',
  dataAbertura: '09/05/2014',
  capitalSocial: 'R$ 10.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Gobbette Marques & Barreto Advogados Associados',
  advogadoAtuacao: 'Direito Administrativo e Exame Toxicológico em Concursos Públicos para a Polícia Militar',
  breadcrumbLabel: 'Exame Toxicológico em Concursos da PM',
  h1Override: 'Orientação jurídica sobre eliminação por exame toxicológico em concursos da Polícia Militar',
  leadOverride: 'Reunimos orientação jurídica sobre eliminação por resultado de exame toxicológico, direito à contraprova e questionamento da cadeia de custódia da amostra em concursos para ingresso na Polícia Militar. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  faq: [
    {
      q: 'Fui eliminado por resultado positivo no exame toxicológico — posso contestar?',
      a: 'Sim, especialmente quando o laudo não observa os padrões técnicos exigidos, apresenta divergência entre a primeira e a segunda análise, ou quando o procedimento de coleta e análise não seguiu as normas técnicas aplicáveis. Vícios no exame podem justificar a revisão administrativa ou judicial da eliminação.',
    },
    {
      q: 'Tenho direito a uma contraprova ou segunda coleta antes da eliminação?',
      a: 'Em regra, sim — o edital costuma prever o direito à contraprova em laboratório distinto antes da eliminação definitiva. A ausência dessa oportunidade, quando prevista em regulamento, pode tornar o ato eliminatório passível de anulação.',
    },
    {
      q: 'A cadeia de custódia da amostra pode ser questionada?',
      a: 'Sim. Falhas na cadeia de custódia — como ausência de lacração adequada, identificação incorreta da amostra ou intervalo de tempo incompatível com os prazos técnicos — podem comprometer a confiabilidade do resultado e fundamentar um recurso administrativo.',
    },
    {
      q: 'O resultado de um exame toxicológico anterior pode ser usado indevidamente contra o candidato?',
      a: 'Não. A avaliação deve considerar apenas o exame realizado dentro do próprio certame, nos termos e prazos previstos no edital. O uso de resultados de exames anteriores, sem relação com o processo seletivo em curso, pode ser contestado administrativamente.',
    },
  ],
  // email: intentionally omitted — no e-mail was provided in this firm's
  // registration data (only phone numbers).
  // oabNumero: intentionally left unset — no OAB registration number was
  // provided; advogadoNome uses the firm name (dois sócios-administradores,
  // no single lead attorney given). ZapZapPage only shows office/attorney
  // claims (isVerifiedLawFirm) when BOTH advogadoNome and oabNumero are set.
};

// rumoaocfo.click (Espaco Amari LTDA — Sociedade Empresária Limitada, CNAE
// 85.99-6-04 / 85.99-6-05, treinamento e cursos preparatórios para concursos,
// sediada em Fortaleza/CE). Não é escritório de advocacia — sem campos OAB,
// sem advogadoNome, ZapZapPage renderiza em modo neutro (isVerifiedLawFirm=false).
// Ângulo: informação sobre o Curso de Formação de Oficiais (CFO) da Polícia
// Militar — processo seletivo, TAF, avaliação psicológica, formação e carreira.
// Distinto do ângulo jurídico/defesa de todos os outros domínios.
const RUMO_AO_CFO: RawConfig = {
  hostname: 'rumoaocfo.click',
  brand: 'Rumo ao CFO',
  siteSubtitle: 'Informações sobre a Formação e a Carreira de Oficial da Polícia Militar',
  razaoSocial: 'Espaco Amari LTDA',
  cnpj: '57528270000197',
  cnpjFormatted: '57.528.270/0001-97',
  endereco: 'Rua Joaquim SA, 405, Sala A',
  bairro: 'Dionisio Torres',
  cidade: 'Fortaleza',
  estado: 'CE',
  cep: '60135-218',
  enderecoCompleto: 'Rua Joaquim SA, 405, Sala A · Dionisio Torres · Fortaleza/CE · CEP 60135-218',
  canonicalUrl: 'https://www.rumoaocfo.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre o processo de formação e a carreira de oficial na Polícia Militar e não constituem consultoria ou orientação jurídica individual. Este site é independente e não possui vínculo com qualquer corporação policial, órgão público ou instituição de ensino.',
  email: 'marimmoura@gmail.com',
  telefone: '(85) 98699-8932',
  cnae: '85.99-6-04 - Treinamento em desenvolvimento profissional e gerencial',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '02/10/2024',
  capitalSocial: 'R$ 80.000,00',
  breadcrumbLabel: 'Formação de Oficiais da Polícia Militar',
  h1Override: 'Saiba como funciona o Curso de Formação de Oficiais (CFO) da Polícia Militar',
  leadOverride: 'Reunimos conteúdo informativo sobre as etapas do CFO — processo seletivo, testes físicos, avaliação psicológica, curso de formação e progressão na carreira de oficial. Consulte a corporação responsável ou um profissional especializado para orientação específica ao seu caso.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Quais são as etapas do processo seletivo para o CFO da Polícia Militar?',
      a: 'Em geral, o processo seletivo para o Curso de Formação de Oficiais (CFO) inclui prova objetiva de conhecimentos, teste de aptidão física (TAF), avaliação psicológica, exame médico, investigação social e, em alguns estados, avaliação de títulos. A ordem e as especificidades de cada etapa variam conforme o edital de cada corporação estadual.',
    },
    {
      q: 'Qual é a duração e o conteúdo do Curso de Formação de Oficiais?',
      a: 'A duração do CFO varia entre os estados, geralmente de um a dois anos, e combina formação acadêmica (disciplinas jurídicas, administrativas e de segurança pública), treinamento físico, instrução tática e estágios práticos. Ao término, o formando é promovido ao primeiro posto da carreira de oficial.',
    },
    {
      q: 'Existe limite de idade para ingressar no CFO da Polícia Militar?',
      a: 'Sim, cada edital estabelece um limite máximo de idade para inscrição, que costuma variar entre 30 e 35 anos dependendo do estado. Candidatos que já integram a corporação como praça podem ter limites diferenciados previstos em legislação específica. É fundamental verificar o edital vigente da corporação de interesse.',
    },
    {
      q: 'Como é avaliada a aptidão física no processo seletivo para o CFO?',
      a: 'O Teste de Aptidão Física (TAF) avalia capacidades como resistência aeróbica (corrida), força muscular (flexões, abdominais) e, em alguns estados, natação ou outras modalidades. Os critérios mínimos de aprovação costumam variar por sexo e faixa etária, conforme tabela publicada no edital.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Espaco Amari LTDA não é escritório de advocacia (CNPJ
  // 57.528.270/0001-97, CNAE 85.99-6-04). ZapZapPage renderiza em modo neutro
  // (isVerifiedLawFirm = false) quando oabNumero está ausente.
};

// espiritopolicial.click (Denyse Braatz Araujo LTDA — Sociedade Empresária
// Limitada, CNAE 85.99-6-05, Cursos preparatórios para concursos, sediada em
// Brasília/DF). Primeira empresa fora de Fortaleza/CE. Não é escritório de
// advocacia — sem campos OAB, ZapZapPage em modo neutro. Ângulo: valores,
// ética e missão profissional do policial militar — o sentido vocacional da
// função, disciplina, conduta ética e relação com a comunidade. Distinto de
// todos os outros domínios (jurídicos, de entrada no CFO, de carreira de
// oficial, de praça, de preparação acadêmica e de panorama estadual).
const ESPIRITO_POLICIAL: RawConfig = {
  hostname: 'espiritopolicial.click',
  brand: 'Espírito Policial',
  siteSubtitle: 'Valores, Ética e Missão Profissional na Carreira de Policial Militar',
  razaoSocial: 'Denyse Braatz Araujo LTDA',
  cnpj: '57171635000179',
  cnpjFormatted: '57.171.635/0001-79',
  endereco: 'SEPS EQ 712/912, Cj D, S/N, Bloco 01',
  bairro: 'Asa Sul',
  cidade: 'Brasília',
  estado: 'DF',
  cep: '70390-125',
  enderecoCompleto: 'SEPS EQ 712/912, Cj D, S/N, Bloco 01 · Asa Sul · Brasília/DF · CEP 70390-125',
  canonicalUrl: 'https://www.espiritopolicial.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre ética, valores e missão profissional na carreira de policial militar e não constituem consultoria ou orientação jurídica individual. Este site é independente e não possui vínculo com qualquer corporação policial, órgão público ou instituição de ensino.',
  email: 'clementinocontabilidade@gmail.com',
  telefone: '(61) 99883-3766',
  cnae: '85.99-6-05 - Cursos preparatórios para concursos',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '05/09/2024',
  capitalSocial: 'R$ 200.000,00',
  breadcrumbLabel: 'Ética e Missão na Carreira Policial Militar',
  h1Override: 'Valores, ética e missão profissional na carreira de policial militar',
  leadOverride: 'Reunimos conteúdo informativo sobre o que define a identidade e a conduta do policial militar — disciplina, ética profissional, relação com a comunidade e senso de missão. Consulte um profissional especializado para orientação específica ao seu caso.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'O que é o código de ética do policial militar e como ele se aplica na prática?',
      a: 'O código de ética regula a conduta do policial tanto no exercício da função quanto fora dela, abrangendo deveres como lealdade institucional, respeito à dignidade humana, vedação ao uso desproporcional da força e preservação da imagem da corporação. Cada estado tem seu regulamento disciplinar específico, mas os princípios fundamentais são comuns a todas as corporações.',
    },
    {
      q: 'Como a disciplina militar se diferencia da disciplina em outras profissões?',
      a: 'A disciplina militar envolve hierarquia rígida, obediência às ordens dentro dos limites legais e um conjunto de rituais e procedimentos que reforçam a coesão institucional. Ao mesmo tempo, o policial militar tem o dever de questionar ordens manifestamente ilegais, o que exige preparo ético e conhecimento da legislação aplicável.',
    },
    {
      q: 'Qual é o papel do policial militar na relação com a comunidade?',
      a: 'Além do policiamento ostensivo, o policial militar tem papel ativo na construção de vínculos de confiança com a comunidade — por meio de programas de policiamento comunitário, mediação de conflitos e presença preventiva em locais de risco. A qualidade dessa relação influencia diretamente a efetividade da segurança pública local.',
    },
    {
      q: 'Como lidar com situações de pressão ética e conflitos morais no exercício da função policial?',
      a: 'A carreira policial expõe o profissional a dilemas éticos frequentes — uso da força, abordagens em situações ambíguas, pressão institucional. Corporações estruturadas investem em formação ética continuada, supervisão e canais de apoio psicológico para que o policial mantenha conduta íntegra mesmo em situações de alta tensão.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Denyse Braatz Araujo LTDA não é escritório de advocacia (CNPJ
  // 57.171.635/0001-79, CNAE 85.99-6-05). ZapZapPage renderiza em modo neutro.
};

// nascipraserpm.click (Dc Concursos LTDA — Sociedade Empresária Limitada,
// CNAE 85.99-6-05 exclusivo, Cursos preparatórios para concursos, sediada em
// Brasília/DF). Não é escritório de advocacia — sem campos OAB, ZapZapPage em
// modo neutro. Ângulo: vocação e identidade do aspirante a policial militar —
// o que motiva quem quer ser PM, como reconhecer o próprio perfil, as
// exigências reais da vida policial e o significado da escolha. Distinto de
// espiritopolicial.click (ética/conduta do policial já formado) e de todos os
// domínios de processo seletivo, carreira e preparação acadêmica.
const VOCA_PM: RawConfig = {
  hostname: 'nascipraserpm.click',
  brand: 'Nasci pra ser PM',
  siteSubtitle: 'Vocação, Identidade e Propósito na Escolha da Carreira Policial Militar',
  razaoSocial: 'Dc Concursos LTDA',
  cnpj: '57267808000157',
  cnpjFormatted: '57.267.808/0001-57',
  endereco: 'SHCGN CR QD 704/705, Bloco C, Loja 06',
  bairro: 'Asa Norte',
  cidade: 'Brasília',
  estado: 'DF',
  cep: '70730-600',
  enderecoCompleto: 'SHCGN CR QD 704/705, Bloco C, Loja 06 · Asa Norte · Brasília/DF · CEP 70730-600',
  canonicalUrl: 'https://www.nascipraserpm.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre a carreira e o perfil profissional do policial militar e não constituem consultoria ou orientação jurídica individual. Este site é independente e não possui vínculo com qualquer corporação policial, órgão público ou instituição de ensino.',
  email: 'ceodegrausconcursos@gmail.com',
  telefone: '(61) 98299-7823',
  cnae: '85.99-6-05 - Cursos preparatórios para concursos',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '12/09/2024',
  capitalSocial: 'R$ 100.000,00',
  breadcrumbLabel: 'Vocação e Perfil Profissional do Policial Militar',
  h1Override: 'Você tem o perfil e a vocação para ser policial militar?',
  leadOverride: 'Reunimos conteúdo informativo sobre o que define quem escolhe a carreira policial militar — motivação, perfil comportamental, exigências da rotina e o sentido de propósito que move quem nasce pra servir. Consulte um profissional especializado para orientação específica ao seu caso.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'O que diferencia quem tem vocação para a carreira policial de quem está apenas em busca de estabilidade?',
      a: 'A carreira policial combina estabilidade funcional com exigências que vão além do concurso — plantões noturnos, exposição ao risco, responsabilidade sobre vidas e atuação em situações de alta pressão. Profissionais com vocação costumam demonstrar, além do preparo técnico, senso de missão, capacidade de trabalho em equipe e resiliência diante de adversidades recorrentes.',
    },
    {
      q: 'Como saber se tenho o perfil comportamental exigido para a carreira de policial militar?',
      a: 'As avaliações psicológicas dos processos seletivos buscam identificar características como equilíbrio emocional, maturidade, capacidade de tomar decisões sob pressão e comprometimento ético. Refletir sobre experiências anteriores de liderança, trabalho em equipe e reação a situações de estresse pode ajudar a compreender o próprio perfil antes de iniciar a preparação.',
    },
    {
      q: 'Como a rotina de um policial militar impacta a vida pessoal e familiar?',
      a: 'A escala de plantões, o regime de sobreaviso e a possibilidade de acionamento em casos extraordinários exigem que o candidato — e sua família — compreendam as demandas da carreira antes da escolha. Ao mesmo tempo, corporações que investem em qualidade de vida e apoio psicológico tendem a apresentar menor índice de adoecimento e maior satisfação profissional entre os integrantes.',
    },
    {
      q: 'É possível conciliar a carreira policial com estudos e desenvolvimento pessoal?',
      a: 'Sim. Muitos policiais militares investem em formação superior, especializações e idiomas ao longo da carreira, aproveitando benefícios de licença para capacitação previstos em estatutos estaduais e programas institucionais de qualificação. A progressão para postos mais altos frequentemente exige, inclusive, formação acadêmica complementar.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Dc Concursos LTDA não é escritório de advocacia (CNPJ
  // 57.267.808/0001-57, CNAE 85.99-6-05). ZapZapPage renderiza em modo neutro.
};

// rumoafarda.click (Mvp Educacao e Negocios LTDA — Sociedade Empresária
// Limitada, CNAE 85.99-6-04, Treinamento em desenvolvimento profissional e
// gerencial, sediada em Brasília/DF). Não é escritório de advocacia — sem
// campos OAB, ZapZapPage em modo neutro. Ângulo: preparação física e
// condicionamento para os testes da PM — como treinar para o TAF, cronograma
// de preparação física, cuidados com saúde e nutrição nos meses antes da
// seleção. Distinto de rumoaocfo.click (o que é o processo do CFO) e de
// todos os outros domínios de carreira, ética, vocação e panorama estadual.
const RUMO_FARDA: RawConfig = {
  hostname: 'rumoafarda.click',
  brand: 'Rumo à Farda',
  siteSubtitle: 'Preparação Física e Condicionamento para o Processo Seletivo da PM',
  razaoSocial: 'Mvp Educacao e Negocios LTDA',
  cnpj: '57212120000170',
  cnpjFormatted: '57.212.120/0001-70',
  endereco: 'SCS QD 02, Bloco D, Salas 1102A/1105, Edif. Oscar Niemeyer',
  bairro: 'Asa Sul',
  cidade: 'Brasília',
  estado: 'DF',
  cep: '70316-900',
  enderecoCompleto: 'SCS QD 02, Bloco D, Salas 1102A/1105, Edif. Oscar Niemeyer · Asa Sul · Brasília/DF · CEP 70316-900',
  canonicalUrl: 'https://www.rumoafarda.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre preparação física para processos seletivos da Polícia Militar e não constituem prescrição médica, nutricional ou de educação física. Consulte profissionais habilitados antes de iniciar qualquer programa de treinamento. Este site é independente e não possui vínculo com qualquer corporação policial ou órgão público.',
  email: 'everest.alainy@gmail.com',
  telefone: '(61) 98589-3277',
  cnae: '85.99-6-04 - Treinamento em desenvolvimento profissional e gerencial',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '09/09/2024',
  capitalSocial: 'R$ 50.000,00',
  breadcrumbLabel: 'Preparação Física para o Processo Seletivo da PM',
  h1Override: 'Como se preparar fisicamente para o processo seletivo da Polícia Militar',
  leadOverride: 'Reunimos conteúdo informativo sobre preparação física e condicionamento para os testes da PM — como montar o cronograma de treino, quais capacidades físicas priorizar e como cuidar do corpo e da mente nos meses antes da seleção. Consulte profissionais habilitados para orientação específica ao seu caso.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Quais capacidades físicas são mais avaliadas no Teste de Aptidão Física (TAF) da PM?',
      a: 'O TAF varia conforme o edital de cada corporação, mas em geral avalia resistência aeróbica (corrida de 12 minutos ou percurso cronometrado), força muscular de membros superiores (flexões de braço) e resistência abdominal (abdominais). Alguns editais incluem ainda natação, barras ou barra fixa. Verificar o edital específico é indispensável antes de montar o programa de treino.',
    },
    {
      q: 'Com quanto tempo de antecedência devo começar a preparação física para o processo seletivo da PM?',
      a: 'Para candidatos sem base de condicionamento, especialistas em preparação para concursos militares geralmente recomendam entre seis meses e um ano de antecedência. Candidatos já ativos fisicamente podem atingir os índices exigidos em três a quatro meses de treino específico. O importante é adaptar o cronograma ao nível de condicionamento atual, sem atingir sobrecarga que gere lesão no período pré-seleção.',
    },
    {
      q: 'Como montar um cronograma semanal de treino voltado ao TAF?',
      a: 'Um modelo comum divide a semana entre treinos de corrida (dois a três dias, com variação entre pace lento de longa duração e tiros curtos de alta intensidade), treinos de força localizados (flexões, abdominais e barras, dois dias) e ao menos um dia de descanso ativo. A periodização — variando volume e intensidade ao longo das semanas — é fundamental para evitar estagnação e lesões por overtraining.',
    },
    {
      q: 'Além do treino físico, o que mais influencia o desempenho no TAF?',
      a: 'Sono de qualidade, hidratação adequada e alimentação equilibrada com aporte suficiente de carboidratos e proteínas têm impacto direto no rendimento e na recuperação muscular. O controle do estresse psicológico nos dias anteriores à prova também é relevante — ansiedade elevada pode comprometer tanto o desempenho físico quanto a concentração durante os testes.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Mvp Educacao e Negocios LTDA não é escritório de advocacia
  // (CNPJ 57.212.120/0001-70, CNAE 85.99-6-04). ZapZapPage em modo neutro.
};

// pmnapratica.click (Educacional Insigne LTDA — Empresa de Pequeno Porte,
// Sociedade Empresária Limitada, CNAE 85.99-6-05, Cursos preparatórios para
// concursos, sediada em Brasília/DF). Não é escritório de advocacia — sem
// campos OAB, ZapZapPage em modo neutro. Ângulo: rotina operacional do PM —
// o cotidiano prático do policial: plantões, procedimentos de abordagem,
// tipos de ocorrências frequentes, equipamentos e comunicação via rádio.
// Conteúdo factual/operacional, distinto de espiritopolicial.click (ética),
// nascipraserpm.click (vocação), rumoafarda.click (preparação física) e dos
// domínios de carreira, processo seletivo e panorama estadual.
const PM_NA_PRATICA: RawConfig = {
  hostname: 'pmnapratica.click',
  brand: 'PM na Prática',
  siteSubtitle: 'Rotina Operacional e Cotidiano Profissional do Policial Militar',
  razaoSocial: 'Educacional Insigne LTDA',
  cnpj: '57205076000170',
  cnpjFormatted: '57.205.076/0001-70',
  endereco: 'SQPS 102, Lote 19, 602',
  bairro: 'Zona Industrial (Guará)',
  cidade: 'Brasília',
  estado: 'DF',
  cep: '71215-690',
  enderecoCompleto: 'SQPS 102, Lote 19, 602 · Zona Industrial (Guará) · Brasília/DF · CEP 71215-690',
  canonicalUrl: 'https://www.pmnapratica.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre a rotina operacional e o cotidiano profissional do policial militar e não constituem consultoria jurídica, orientação sobre procedimentos específicos ou opinião sobre casos concretos. Este site é independente e não possui vínculo com qualquer corporação policial ou órgão público.',
  email: 'brandaog12@gmail.com',
  telefone: '(61) 98317-0713',
  cnae: '85.99-6-05 - Cursos preparatórios para concursos',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '09/09/2024',
  capitalSocial: 'R$ 20.000,00',
  breadcrumbLabel: 'Rotina Operacional do Policial Militar',
  h1Override: 'Como funciona o cotidiano operacional do policial militar na prática',
  leadOverride: 'Reunimos conteúdo informativo sobre a rotina real do policial militar — escala de plantões, procedimentos operacionais, tipos de ocorrências e dinâmica do trabalho em equipe nas ruas. Consulte a corporação responsável para informações oficiais sobre procedimentos específicos.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Como funciona a escala de plantão do policial militar?',
      a: 'A escala mais comum nas PMs estaduais é o sistema 24×72 horas — o policial trabalha 24 horas seguidas e folga 72 — ou o sistema 12×36 horas, com 12 horas de serviço e 36 de folga. A escala varia conforme a corporação, o posto ou graduação do policial e a unidade onde serve. Serviços administrativos e operações especiais podem ter escalas diferenciadas.',
    },
    {
      q: 'Quais são os procedimentos básicos numa abordagem policial?',
      a: 'A abordagem policial segue protocolos que variam por corporação, mas em geral envolvem identificação do policial, comunicação clara das razões da abordagem, posicionamento de segurança e busca pessoal quando há fundada suspeita. Os regulamentos internos e a legislação processual penal estabelecem os limites da atuação — o policial deve equilibrar eficiência operacional e respeito aos direitos da pessoa abordada.',
    },
    {
      q: 'Que tipos de ocorrências um PM atende com mais frequência?',
      a: 'Além das ocorrências de natureza criminal (flagrantes, perturbação da ordem, briga em via pública), grande parte das chamadas ao policiamento ostensivo envolve acidentes de trânsito, desentendimentos familiares, assistência a pessoas em sofrimento e perturbação do sossego. O policial militar frequentemente é o primeiro contato do cidadão com o Estado em situações de emergência.',
    },
    {
      q: 'Como funciona a comunicação por rádio durante o serviço policial?',
      a: 'A comunicação via rádio segue protocolos de fonética e códigos numéricos (como o código Q e códigos de ocorrência) que permitem transmissões rápidas e padronizadas entre a viatura, a central de operações e outras unidades. O domínio dessas comunicações é parte da formação no Curso de Formação de Soldados e é aprimorado na prática ao longo do serviço.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Educacional Insigne LTDA não é escritório de advocacia (CNPJ
  // 57.205.076/0001-70, CNAE 85.99-6-05). ZapZapPage renderiza em modo neutro.
};

// radarpm.click (Btc Conecta Cursos e Eventos LTDA — Empresa de Pequeno
// Porte, Sociedade Empresária Limitada, CNAE 85.99-6-05, Cursos preparatórios
// para concursos, sediada em Brasília/DF). Não é escritório de advocacia —
// sem campos OAB, ZapZapPage em modo neutro. Ângulo: monitoramento de editais,
// concursos abertos e novidades das corporações — radar de vagas abertas,
// prazos, mudanças regulamentares e concursos recentes por estado. Distinto de
// concurseiropm.click (como estudar) e pmdomeuestado.click (panorama
// comparativo estrutural): o Radar foca no que está acontecendo agora.
const RADAR_PM: RawConfig = {
  hostname: 'radarpm.click',
  brand: 'Radar PM',
  siteSubtitle: 'Editais, Concursos Abertos e Novidades das Polícias Militares do Brasil',
  razaoSocial: 'Btc Conecta Cursos e Eventos LTDA',
  cnpj: '58129039000193',
  cnpjFormatted: '58.129.039/0001-93',
  endereco: 'SAUS QD 4, Bloco A, Sala 620, Ed. Victoria Office Tower',
  bairro: 'Asa Sul',
  cidade: 'Brasília',
  estado: 'DF',
  cep: '70070-938',
  enderecoCompleto: 'SAUS QD 4, Bloco A, Sala 620, Ed. Victoria Office Tower · Asa Sul · Brasília/DF · CEP 70070-938',
  canonicalUrl: 'https://www.radarpm.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre editais e concursos das Polícias Militares e não constituem consultoria jurídica ou orientação sobre casos individuais. Datas, vagas e condições de editais devem ser confirmadas diretamente nas fontes oficiais de cada corporação. Este site é independente e não possui vínculo com qualquer órgão público ou corporação policial.',
  email: 'monteiroaugustoadvogados@gmail.com',
  telefone: '(61) 99979-7179',
  cnae: '85.99-6-05 - Cursos preparatórios para concursos',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '18/11/2024',
  capitalSocial: 'R$ 200.000,00',
  breadcrumbLabel: 'Editais e Concursos das PMs Brasileiras',
  h1Override: 'Radar de editais e concursos abertos das Polícias Militares do Brasil',
  leadOverride: 'Reunimos conteúdo informativo sobre editais, concursos em andamento, prazos de inscrição e novidades das corporações de Polícia Militar em todo o Brasil. Confirme sempre os dados diretamente no edital oficial antes de tomar qualquer decisão.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Como acompanhar os editais de concurso da Polícia Militar em aberto no Brasil?',
      a: 'Os editais são publicados nos Diários Oficiais estaduais e nos sites das bancas organizadoras contratadas para cada certame. Acompanhar os portais oficiais das Secretarias de Segurança Pública e as bancas mais frequentes — como VUNESP, CEBRASPE, FGV, IBFC e FCC — permite identificar concursos assim que são publicados. Algumas corporações anunciam previsões de abertura meses antes do edital formal.',
    },
    {
      q: 'Com que frequência as PMs estaduais abrem concurso para novos integrantes?',
      a: 'A periodicidade varia muito por estado e depende de fatores como déficit de efetivo, aprovação legislativa de vagas e disponibilidade orçamentária. Estados com maior efetivo e rotatividade, como São Paulo, Rio de Janeiro e Minas Gerais, costumam abrir concursos com mais regularidade. Estados menores podem ficar anos sem concurso ou abrir certames em caráter emergencial.',
    },
    {
      q: 'O que verificar assim que um novo edital da PM é publicado?',
      a: 'Os pontos críticos a conferir são: número de vagas e distribuição por especialidade ou região; requisitos de ingresso (idade, escolaridade, altura, antecedentes); cronograma completo com datas de prova, TAF e avaliação psicológica; banca organizadora; conteúdo programático das provas objetivas; e critérios de classificação e aprovação. Qualquer dúvida deve ser dirimentada pelo próprio edital ou pela banca responsável.',
    },
    {
      q: 'Como funciona o cronograma típico de um concurso da Polícia Militar?',
      a: 'A sequência habitual começa com a publicação do edital e abertura de inscrições, seguida de provas objetivas (conhecimentos gerais e específicos), avaliação física (TAF), exame médico, avaliação psicológica, investigação social e curso de formação. O processo completo pode durar de seis meses a mais de dois anos, dependendo do número de candidatos e da estrutura da corporação.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Btc Conecta Cursos e Eventos LTDA não é escritório de advocacia
  // (CNPJ 58.129.039/0001-93, CNAE 85.99-6-05). ZapZapPage em modo neutro.
};

// carreiradeoficial.click (M.a Assessoria e Treinamentos LTDA — Sociedade
// Empresária Limitada, CNAE 85.99-6-04, Treinamento em desenvolvimento
// profissional e gerencial, sediada em Fortaleza/CE). Não é escritório de
// advocacia — sem campos OAB, ZapZapPage em modo neutro. Ângulo: desenvolvimento
// profissional e liderança na carreira de oficial da PM *após a formação* —
// especializações, promoções por merecimento/antiguidade, gestão de equipes,
// competências de comando e progressão ao longo dos postos. Distinto de
// rumoaocfo.click (que cobre o processo de *entrada* no CFO: seleção, TAF,
// psicológico) e de todos os domínios jurídicos e de preparação acadêmica.
const CARREIRA_OFICIAL: RawConfig = {
  hostname: 'carreiradeoficial.click',
  brand: 'Carreira de Oficial',
  siteSubtitle: 'Desenvolvimento Profissional e Liderança na Carreira de Oficial da PM',
  razaoSocial: 'M.a Assessoria e Treinamentos LTDA',
  cnpj: '57717002000113',
  cnpjFormatted: '57.717.002/0001-13',
  endereco: 'Rua Monsenhor Otavio de Castro, 435, Sala 01',
  bairro: 'Fatima',
  cidade: 'Fortaleza',
  estado: 'CE',
  cep: '60050-150',
  enderecoCompleto: 'Rua Monsenhor Otavio de Castro, 435, Sala 01 · Fatima · Fortaleza/CE · CEP 60050-150',
  canonicalUrl: 'https://www.carreiradeoficial.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre desenvolvimento profissional na carreira de oficial da Polícia Militar e não constituem consultoria jurídica ou orientação sobre casos individuais. Este site é independente e não possui vínculo com qualquer corporação policial ou órgão público.',
  email: 'maassessoriaetreinamentos@outlook.com',
  telefone: '(88) 99765-0646',
  cnae: '85.99-6-04 - Treinamento em desenvolvimento profissional e gerencial',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '16/10/2024',
  capitalSocial: 'R$ 30.000,00',
  breadcrumbLabel: 'Desenvolvimento e Progressão na Carreira de Oficial da PM',
  h1Override: 'Desenvolvimento profissional e progressão na carreira de oficial da Polícia Militar',
  leadOverride: 'Reunimos conteúdo informativo sobre as etapas de desenvolvimento que moldam a trajetória do oficial após a formação — especializações, cursos de aperfeiçoamento, critérios de promoção e competências de liderança e comando. Consulte a corporação responsável para informações oficiais sobre o seu caso.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Como funciona o sistema de promoções na carreira de oficial da Polícia Militar?',
      a: 'As promoções na carreira de oficial seguem dois critérios principais previstos nos estatutos estaduais: antiguidade, que respeita a ordem de precedência entre oficiais do mesmo posto, e merecimento, baseado em avaliações de desempenho, cursos realizados e conduta funcional. A composição e o peso de cada critério variam conforme a corporação e o posto em questão.',
    },
    {
      q: 'Quais cursos de aperfeiçoamento são mais relevantes para a progressão do oficial?',
      a: 'Cursos como o Curso de Aperfeiçoamento de Oficiais (CAO), especializações em gestão de segurança pública, liderança organizacional e formação tática avançada costumam ser valorizados nos quadros de acesso e nas avaliações de merecimento. Cada corporação define quais formações têm peso nas promoções e quais são pré-requisitos para determinados postos.',
    },
    {
      q: 'Quais são as principais competências exigidas para um oficial exercer função de comando?',
      a: 'Funções de comando demandam capacidade de planejamento operacional, tomada de decisão sob pressão, gestão de equipes em ambientes hierárquicos, comunicação institucional e conhecimento técnico-jurídico para orientar a atuação dos subordinados dentro dos limites legais. Corporações que investem em liderança costumam associar essas competências a programas contínuos de capacitação.',
    },
    {
      q: 'É possível fazer especializações acadêmicas paralelas à carreira de oficial?',
      a: 'Sim. Muitos oficiais cursam pós-graduação, mestrado e especializações em áreas como Direito, Gestão Pública, Segurança Pública e Administração ao longo da carreira. Estatutos estaduais frequentemente preveem licenças para capacitação e pontuam a formação acadêmica nas avaliações de promoção por merecimento, incentivando o desenvolvimento contínuo.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — M.a Assessoria e Treinamentos LTDA não é escritório de advocacia
  // (CNPJ 57.717.002/0001-13, CNAE 85.99-6-04). ZapZapPage em modo neutro.
};

// futuropm.click (Vilasolutions Brasil LTDA — Sociedade Empresária Limitada,
// CNAE 85.99-6-04, Treinamento em desenvolvimento profissional e gerencial,
// sediada em Fortaleza/CE). Não é escritório de advocacia — sem campos OAB,
// ZapZapPage em modo neutro. Ângulo: carreira de praça na PM — processo
// seletivo para ingresso como soldado, Curso de Formação de Soldados (CFS),
// progressão nas graduações (soldado → cabo → sargento → subtenente) e
// rotina profissional como praça. Distinto de rumoaocfo.click (track de
// oficial/CFO) e carreiradeoficial.click (desenvolvimento pós-formação do
// oficial) e de todos os domínios jurídicos.
const FUTURO_PM: RawConfig = {
  hostname: 'futuropm.click',
  brand: 'Futuro PM',
  siteSubtitle: 'Carreira de Praça na Polícia Militar: Ingresso, Formação e Progressão',
  razaoSocial: 'Vilasolutions Brasil LTDA',
  cnpj: '57638943000161',
  cnpjFormatted: '57.638.943/0001-61',
  endereco: 'Rua Pedro de Sousa, 305',
  bairro: 'Parque Santa Maria',
  cidade: 'Fortaleza',
  estado: 'CE',
  cep: '60873-105',
  enderecoCompleto: 'Rua Pedro de Sousa, 305 · Parque Santa Maria · Fortaleza/CE · CEP 60873-105',
  canonicalUrl: 'https://www.futuropm.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre a carreira de praça na Polícia Militar e não constituem consultoria jurídica ou orientação sobre casos individuais. Este site é independente e não possui vínculo com qualquer corporação policial ou órgão público.',
  email: 'alissonvillanovabrasil@gmail.com',
  telefone: '(85) 98642-5444',
  cnae: '85.99-6-04 - Treinamento em desenvolvimento profissional e gerencial',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '10/10/2024',
  capitalSocial: 'R$ 15.000,00',
  breadcrumbLabel: 'Ingresso e Carreira de Praça na Polícia Militar',
  h1Override: 'Como funciona o ingresso e a carreira de praça na Polícia Militar',
  leadOverride: 'Reunimos conteúdo informativo sobre a trajetória de quem ingressa na PM como soldado — processo seletivo, Curso de Formação de Soldados, progressão nas graduações e rotina profissional como praça. Consulte a corporação responsável para informações oficiais sobre o seu caso.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Como funciona o processo seletivo para ingresso como soldado da Polícia Militar?',
      a: 'O processo seletivo para soldado varia por estado, mas em geral inclui prova objetiva de conhecimentos gerais, Teste de Aptidão Física (TAF), exame médico, avaliação psicológica e investigação social. O edital de cada corporação define os requisitos mínimos de escolaridade, idade, altura e outros critérios eliminatórios. A ordem das etapas pode variar conforme a corporação organizadora.',
    },
    {
      q: 'O que é o Curso de Formação de Soldados (CFS) e como ele funciona?',
      a: 'O CFS é o período de formação inicial obrigatório para quem ingressa na PM como soldado. Durante o curso, o recruta recebe instrução em técnicas policiais, legislação, armamento, primeiros socorros, educação física intensa e conduta militar. A duração varia por estado — em geral de quatro a oito meses — e a aprovação é condição para assumir o serviço ativo como praça.',
    },
    {
      q: 'Como funciona a progressão nas graduações da carreira de praça da PM?',
      a: 'A carreira de praça segue a sequência: soldado → cabo → sargento (3º, 2º e 1º) → subtenente. As promoções ocorrem por antiguidade e merecimento, conforme os regulamentos de cada corporação estadual. Critérios como tempo mínimo na graduação, aprovação em cursos de formação específicos, ausência de punições e avaliação de desempenho influenciam diretamente o ritmo de progressão.',
    },
    {
      q: 'Quais são as principais diferenças entre a carreira de praça e a carreira de oficial na PM?',
      a: 'Praças ingressam como soldados por concurso público e progridem nas graduações até subtenente. Oficiais ingressam pelo Curso de Formação de Oficiais (CFO) — com exigência de ensino superior — e progridem nos postos de tenente a coronel, com responsabilidades maiores de comando e gestão. As carreiras são hierarquicamente separadas, com diferentes estatutos, critérios de promoção e atribuições funcionais.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Vilasolutions Brasil LTDA não é escritório de advocacia (CNPJ
  // 57.638.943/0001-61, CNAE 85.99-6-04). ZapZapPage renderiza em modo neutro.
};

// concurseiropm.click (Ab Contabilidade Assessoria Contabil e Consultoria
// Empresarial LTDA — Sociedade Empresária Limitada, CNAE 69.20-6-01,
// Atividades de contabilidade, sediada em Fortaleza/CE). Não é escritório de
// advocacia — sem campos OAB, ZapZapPage em modo neutro. Ângulo: preparação
// acadêmica para o concurso da PM — disciplinas cobradas nas provas objetivas,
// cronograma de estudos, conteúdo programático frequente e organização da
// preparação. Distinto de rumoaocfo.click (etapas do processo seletivo do
// CFO), futuropm.click (carreira de praça) e carreiradeoficial.click
// (desenvolvimento pós-formação do oficial) e de todos os domínios jurídicos.
const CONCURSEIRO_PM: RawConfig = {
  hostname: 'concurseiropm.click',
  brand: 'Concurseiro PM',
  siteSubtitle: 'Preparação Acadêmica para o Concurso da Polícia Militar',
  razaoSocial: 'Ab Contabilidade Assessoria Contabil e Consultoria Empresarial LTDA',
  cnpj: '58129437000100',
  cnpjFormatted: '58.129.437/0001-00',
  endereco: 'Avenida Washington Soares, 55, Sala 307',
  bairro: 'Edson Queiroz',
  cidade: 'Fortaleza',
  estado: 'CE',
  cep: '60811-341',
  enderecoCompleto: 'Avenida Washington Soares, 55, Sala 307 · Edson Queiroz · Fortaleza/CE · CEP 60811-341',
  canonicalUrl: 'https://www.concurseiropm.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre preparação acadêmica para concursos da Polícia Militar e não constituem consultoria jurídica ou pedagógica individual. Este site é independente e não possui vínculo com qualquer corporação policial, banca organizadora ou órgão público.',
  email: 'ab_contabilidade@hotmail.com',
  telefone: '(85) 98170-1976',
  cnae: '69.20-6-01 - Atividades de contabilidade',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '18/11/2024',
  capitalSocial: 'R$ 500.000,00',
  breadcrumbLabel: 'Preparação para as Provas do Concurso da PM',
  h1Override: 'Como se preparar academicamente para as provas do concurso da Polícia Militar',
  leadOverride: 'Reunimos conteúdo informativo sobre as disciplinas cobradas, como organizar o cronograma de estudos e o que esperar das provas objetivas nos concursos da Polícia Militar. Consulte o edital oficial da corporação para o conteúdo programático específico do certame de seu interesse.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Quais são as disciplinas mais cobradas nas provas objetivas do concurso da PM?',
      a: 'As disciplinas mais frequentes nos concursos da PM incluem Língua Portuguesa, Matemática e Raciocínio Lógico, Noções de Direito Constitucional, Direito Administrativo e Legislação Policial Estadual. Dependendo do edital, podem aparecer também Informática, Atualidades, Direito Penal e Ética no Serviço Público. O conteúdo programático exato varia por estado e por banca organizadora.',
    },
    {
      q: 'Como montar um cronograma eficiente de estudos para o concurso da PM?',
      a: 'Um cronograma eficiente parte do edital: identifique o número de questões por disciplina e o peso de cada uma na nota final. Dedique mais horas às disciplinas com maior incidência e às que representam maior dificuldade pessoal. Alterne dias de conteúdo novo com dias de revisão e resolução de questões anteriores, e inclua simulados periódicos para treinar o ritmo da prova real.',
    },
    {
      q: 'Qual é a melhor estratégia para resolver questões de múltipla escolha nas provas da PM?',
      a: 'Eliminar alternativas claramente erradas antes de escolher a resposta reduz o risco de marcação precipitada. Para questões de interpretação de texto e raciocínio lógico, ler o enunciado com atenção antes das alternativas ajuda a evitar armadilhas. Manter o ritmo e não gastar tempo excessivo em questões desconhecidas — deixando-as para revisitar ao final — é uma tática eficaz na maioria dos certames com limite de tempo rigoroso.',
    },
    {
      q: 'As provas dos concursos da PM variam muito entre os estados?',
      a: 'Sim. O conteúdo programático, o número de questões, o peso de cada disciplina e o nível de dificuldade das provas variam significativamente entre corporações estaduais e entre bancas organizadoras. Editais de estados como São Paulo (VUNESP), Minas Gerais e Rio de Janeiro têm perfis de prova distintos. Sempre consulte o edital específico do certame de seu interesse para organizar a preparação com precisão.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Ab Contabilidade Assessoria Contabil e Consultoria Empresarial
  // LTDA não é escritório de advocacia (CNPJ 58.129.437/0001-00, CNAE
  // 69.20-6-01). ZapZapPage renderiza em modo neutro.
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
  'militarconcurseiro.click': MILITAR_CONCURSEIRO,
  'www.militarconcurseiro.click': MILITAR_CONCURSEIRO,
  'vocacaopolicial.click': VOCACAO_POLICIAL,
  'www.vocacaopolicial.click': VOCACAO_POLICIAL,
  'pmpelobrasil.click': CONCURSO_SUSPENSO,
  'www.pmpelobrasil.click': CONCURSO_SUSPENSO,
  'guiadafarda.click': APRESENTACAO_FARDA,
  'www.guiadafarda.click': APRESENTACAO_FARDA,
  'pmemfoco.click': TRANSPARENCIA_CONCURSO,
  'www.pmemfoco.click': TRANSPARENCIA_CONCURSO,
  'guiadapm.click': EXAME_TOXICOLOGICO,
  'www.guiadapm.click': EXAME_TOXICOLOGICO,
  'rumoaocfo.click': RUMO_AO_CFO,
  'www.rumoaocfo.click': RUMO_AO_CFO,
  'espiritopolicial.click': ESPIRITO_POLICIAL,
  'www.espiritopolicial.click': ESPIRITO_POLICIAL,
  'nascipraserpm.click': VOCA_PM,
  'www.nascipraserpm.click': VOCA_PM,
  'rumoafarda.click': RUMO_FARDA,
  'www.rumoafarda.click': RUMO_FARDA,
  'pmnapratica.click': PM_NA_PRATICA,
  'www.pmnapratica.click': PM_NA_PRATICA,
  'radarpm.click': RADAR_PM,
  'www.radarpm.click': RADAR_PM,
  'carreiradeoficial.click': CARREIRA_OFICIAL,
  'www.carreiradeoficial.click': CARREIRA_OFICIAL,
  'futuropm.click': FUTURO_PM,
  'www.futuropm.click': FUTURO_PM,
  'concurseiropm.click': CONCURSEIRO_PM,
  'www.concurseiropm.click': CONCURSEIRO_PM,
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
    raw = CONFIGS[window.location.hostname] ?? CONFIGS[host];
  }
  return { ...raw, siteName: raw.brand || raw.razaoSocial };
}

export const siteConfig: SiteConfig = getSiteConfig();
