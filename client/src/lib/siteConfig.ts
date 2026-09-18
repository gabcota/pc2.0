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

// pmdomeuestado.click (Muamba Filmes LTDA — Sociedade Empresária Limitada,
// CNAE 59.11-1-99, Produção cinematográfica e de vídeos, sediada em
// Fortaleza/CE). Não é escritório de advocacia — sem campos OAB, ZapZapPage
// em modo neutro. Ângulo: panorama comparativo das Polícias Militares
// estaduais — como as corporações se organizam por estado, variações na
// estrutura de postos e graduações, diferenças salariais e frequência
// histórica de concursos por região. Ângulo geográfico/comparativo, distinto
// de todos os domínios de carreira, jurídicos e de preparação para provas.
const PM_DO_MEU_ESTADO: RawConfig = {
  hostname: 'pmdomeuestado.click',
  brand: 'PM do Meu Estado',
  siteSubtitle: 'Panorama Comparativo das Polícias Militares Estaduais do Brasil',
  razaoSocial: 'Muamba Filmes LTDA',
  cnpj: '57507866000100',
  cnpjFormatted: '57.507.866/0001-00',
  endereco: 'Rua Milagres, 24, Sala 10',
  bairro: 'Aldeota',
  cidade: 'Fortaleza',
  estado: 'CE',
  cep: '60110-430',
  enderecoCompleto: 'Rua Milagres, 24, Sala 10 · Aldeota · Fortaleza/CE · CEP 60110-430',
  canonicalUrl: 'https://www.pmdomeuestado.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre as Polícias Militares estaduais brasileiras e não constituem consultoria jurídica ou orientação sobre casos individuais. Este site é independente e não possui vínculo com qualquer corporação policial ou órgão público.',
  email: 'muambafilmes@gmail.com',
  telefone: '(85) 99631-6323',
  cnae: '59.11-1-99 - Atividades de produção cinematográfica, de vídeos e de programas de televisão não especificadas anteriormente',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '01/10/2024',
  capitalSocial: 'R$ 3.000,00',
  breadcrumbLabel: 'Panorama das Polícias Militares por Estado',
  h1Override: 'Como funcionam as Polícias Militares nos diferentes estados brasileiros',
  leadOverride: 'Reunimos conteúdo informativo sobre como cada corporação estadual se organiza — estrutura de postos e graduações, variações salariais entre estados, frequência histórica de seleções e diferenças regionais na carreira militar. Consulte a corporação do seu estado para informações oficiais e atualizadas.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'As Polícias Militares variam muito entre os estados brasileiros?',
      a: 'Sim. Cada PM estadual é regulamentada por legislação própria e organizada de forma autônoma dentro do quadro federal. Há variações relevantes no quantitativo de efetivo, na estrutura de Batalhões e Companhias, nos critérios de promoção, no regime de trabalho (escala de plantão) e na remuneração dos profissionais. Estados maiores, como São Paulo e Minas Gerais, costumam ter corporações mais numerosas e orçamentos distintos das PMs de estados menores.',
    },
    {
      q: 'As diferenças salariais entre PMs de estados diferentes são significativas?',
      a: 'São expressivas. O vencimento base de um soldado recém-formado pode variar consideravelmente entre estados, refletindo diferenças no orçamento estadual, nas leis de carreira e nos planos de reestruturação remuneratória de cada governo. Além do salário base, benefícios como adicional de risco de vida, gratificação por habilitação e licenças especiais variam por corporação e influenciam a remuneração total do profissional.',
    },
    {
      q: 'A estrutura de postos e graduações é igual em todas as PMs estaduais?',
      a: 'A estrutura geral segue o modelo nacional — praças (soldado a subtenente) e oficiais (aspirante a coronel) — mas os detalhes variam por estado. Alguns estados possuem graduações ou denominações específicas, planos de cargos distintos e critérios diferentes para acesso aos cursos de especialização e promoção. O regulamento interno de cada corporação define os detalhes da progressão funcional.',
    },
    {
      q: 'Alguns estados abrem mais concursos para a PM do que outros?',
      a: 'Historicamente, sim. A frequência de seleções depende do orçamento estadual, da taxa de saída de profissionais (aposentadorias e desligamentos) e das políticas de segurança pública de cada governo. Estados com maior rotatividade ou expansão do efetivo costumam realizar seleções com maior regularidade. Acompanhe os diários oficiais e o site da PM do seu estado para informações oficiais sobre editais abertos.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Muamba Filmes LTDA não é escritório de advocacia (CNPJ
  // 57.507.866/0001-00, CNAE 59.11-1-99). ZapZapPage renderiza em modo neutro.
};

const MODO_POLICIAL: RawConfig = {
  hostname: 'modopolicial.click',
  brand: 'Modo Policial',
  siteSubtitle: 'Consciência Situacional, De-escalada e Tomada de Decisão Operacional na Polícia Civil',
  razaoSocial: 'Exytus Contabilidade Consultiva LTDA',
  cnpj: '36709907000171',
  cnpjFormatted: '36.709.907/0001-71',
  endereco: 'Avenida Jorn Juarez Conrado Dantas, 1125, Apt 101 Cond Parq Alameda Real Bloco 27',
  bairro: 'Santa Maria',
  cidade: 'Aracaju',
  estado: 'SE',
  cep: '49039-083',
  enderecoCompleto: 'Avenida Jorn Juarez Conrado Dantas, 1125, Apt 101 Cond Parq Alameda Real Bloco 27 · Santa Maria · Aracaju/SE · CEP 49039-083',
  canonicalUrl: 'https://www.modopolicial.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre cognição investigativa, atuação operacional e tomada de decisão policial e não constituem treinamento oficial, orientação jurídica ou instrução para uso da força. Este site é independente e não possui vínculo com qualquer Polícia Civil ou órgão público.',
  email: 'contato@exytus.com.br',
  telefone: '(79) 99868-9197',
  cnae: 'Atividades de contabilidade',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '18/03/2020',
  capitalSocial: 'R$ 8.000,00',
  breadcrumbLabel: 'Cognição Investigativa e Tomada de Decisão do Policial Civil',
  h1Override: 'Como o policial civil pensa e decide em campo — consciência situacional, de-escalada e atuação responsável',
  leadOverride: 'Reunimos conteúdo informativo sobre o processo mental que orienta a atuação do policial civil em investigações e situações operacionais — como se desenvolve a consciência situacional durante diligências, quando técnicas de de-escalada podem reduzir riscos, como decisões são tomadas sob pressão e quais princípios orientam uma atuação legal, necessária e proporcional. Para treinamentos oficiais, consulte os programas de formação e qualificação da Polícia Civil do seu estado.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Como o policial civil desenvolve a consciência situacional durante uma investigação?',
      a: 'A consciência situacional — a capacidade de perceber, compreender e antecipar o que acontece ao redor — é importante tanto na análise investigativa quanto no trabalho de campo. Ela se desenvolve com formação, experiência e observação deliberada. Em diligências, entrevistas e verificações de local, o policial civil precisa relacionar informações, identificar mudanças de comportamento, reconhecer riscos no ambiente e avaliar como cada novo elemento pode afetar a investigação e a segurança da equipe.',
    },
    {
      q: 'O que é de-escalada e quando ela pode ser aplicada pela Polícia Civil?',
      a: 'De-escalada é o conjunto de técnicas de comunicação e controle da situação que busca reduzir tensão e evitar o agravamento de um conflito. Na Polícia Civil, pode ser útil durante entrevistas, diligências, cumprimento de mandados e outras situações em que exista tempo e segurança para estabelecer diálogo, esclarecer comandos ou aguardar apoio. Comunicação objetiva, controle emocional e avaliação contínua do risco ajudam a proteger policiais, envolvidos e terceiros.',
    },
    {
      q: 'Como funciona a tomada de decisão do policial civil em situações de alta pressão?',
      a: 'Em situações de alta pressão, o policial civil precisa decidir com rapidez sem perder de vista a legalidade, a segurança e a preservação de informações relevantes para a investigação. O processo envolve observar o ambiente, interpretar os dados disponíveis, avaliar riscos, coordenar a equipe e escolher uma resposta compatível com a situação. Formação e experiência ajudam a reconhecer padrões, mas cada decisão precisa considerar as circunstâncias concretas e os limites legais da atuação.',
    },
    {
      q: 'Quais princípios orientam o uso da força em operações da Polícia Civil?',
      a: 'Quando o uso da força é necessário em uma operação da Polícia Civil, a resposta deve observar a legalidade, a necessidade, a proporcionalidade e a responsabilidade funcional. A conduta precisa considerar o nível de risco, a resistência encontrada, a proteção de terceiros e as alternativas disponíveis naquele momento. Toda intervenção deve seguir os protocolos aplicáveis, ser interrompida quando cessar a necessidade e ser devidamente registrada para controle e responsabilização.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Exytus Contabilidade Consultiva LTDA não é escritório de
  // advocacia (CNPJ 36.709.907/0001-71). ZapZapPage renderiza em modo neutro.
};

const PRIMEIRA_FARDA: RawConfig = {
  hostname: 'primeirafarda.click',
  brand: 'Primeira Farda',
  siteSubtitle: 'Como é o Curso de Formação de Soldados da PM — Rotina, Desafios e Como se Preparar',
  razaoSocial: 'Diesel Max Pecas e Servicos LTDA',
  cnpj: '62545581000102',
  cnpjFormatted: '62.545.581/0001-02',
  endereco: 'Avenida Durval Alves de Faria, 738',
  bairro: 'Tropical',
  cidade: 'Contagem',
  estado: 'MG',
  cep: '32070-040',
  enderecoCompleto: 'Avenida Durval Alves de Faria, 738 · Tropical · Contagem/MG · CEP 32070-040',
  canonicalUrl: 'https://www.primeirafarda.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre o Curso de Formação de Soldados da Polícia Militar e não constituem orientação oficial sobre processos seletivos ou cursos específicos. Este site é independente e não possui vínculo com qualquer corporação policial, centro de formação ou órgão público.',
  email: 'maxtone24@yahoo.com.br',
  telefone: '(31) 98220-8438',
  cnae: '45.20-0-01 - Serviços de manutenção e reparação mecânica de veículos automotores',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '03/09/2025',
  capitalSocial: 'R$ 20.000,00',
  breadcrumbLabel: 'Curso de Formação de Soldados da PM — Rotina e Preparação',
  h1Override: 'Como é o Curso de Formação de Soldados da PM — rotina, desafios e o que esperar desde o primeiro dia',
  leadOverride: 'Reunimos conteúdo informativo sobre a experiência do Curso de Formação de Soldados da Polícia Militar — como é a rotina diária, quais são os maiores desafios das primeiras semanas, o que mais surpreende quem ingressa e como se preparar física e mentalmente antes de iniciar. Para informações oficiais sobre o curso de formação do seu estado, consulte o site da PM estadual.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Como é a rotina diária dentro do Curso de Formação de Soldados da PM?',
      a: 'A rotina do Curso de Formação de Soldados é marcada por estrutura rígida e horários fixos. O dia começa cedo — geralmente entre 5h e 6h — com formatura, atividade física e café da manhã antes do início das aulas. O período letivo combina disciplinas teóricas (legislação, direito penal, procedimentos operacionais) com treinamentos práticos (armamento, defesa pessoal, abordagem). O regime é semi-internato ou internato completo dependendo da corporação estadual. Além das atividades formais, há deveres e obrigações militares que se estendem ao tempo livre.',
    },
    {
      q: 'Quais são os maiores desafios enfrentados pelos recrutas nas primeiras semanas do curso?',
      a: 'As primeiras semanas do curso de formação representam o choque cultural mais intenso da carreira policial. Os maiores desafios relatados incluem: a adaptação ao regime de hierarquia e disciplina rígidos após anos de vida civil, o cansaço acumulado da combinação de atividade física intensa com carga horária teórica elevada, o convívio compulsório com um grupo grande de desconhecidos em ambiente fechado e a gestão emocional diante de cobranças que muitos recrutas nunca experimentaram antes. Recrutas que chegam com condicionamento físico e alguma familiaridade com rotina disciplinada tendem a ter uma adaptação mais suave.',
    },
    {
      q: 'O que mais surpreende quem ingressa no Curso de Formação de Soldados da PM?',
      a: 'O que mais surpreende não costuma ser a intensidade física — esperada por quem se preparou para o TAF — mas o volume e a complexidade do conteúdo teórico: legislação, procedimentos operacionais, uso da força, direitos humanos e ética profissional formam uma carga acadêmica que muitos recrutas subestimam. Outro ponto que surpreende é a dimensão coletiva da formação: avaliações e punições frequentemente recaem sobre o grupo, não apenas sobre o indivíduo, o que exige uma mentalidade de equipe que nem todos estão acostumados a desenvolver.',
    },
    {
      q: 'Como se preparar mentalmente e fisicamente antes de iniciar o curso de formação da PM?',
      a: 'A preparação física deve ir além do mínimo exigido no TAF — o recruta deve chegar ao curso com capacidade aeróbica e muscular acima do mínimo, pois as exigências físicas são contínuas e acumulativas. Mentalmente, familiarizar-se com a estrutura hierárquica e com os regulamentos disciplinares militares antes do início ajuda a reduzir o choque cultural. Recrutas que já leram o regulamento da corporação e entendem o que significa uma formatura chegam com vantagem real. O aspecto mais útil emocionalmente é estar preparado para abrir mão da autonomia do cotidiano civil por um período determinado.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Diesel Max Pecas e Servicos LTDA não é escritório de advocacia
  // (CNPJ 62.545.581/0001-02, CNAE 45.20-0-01). ZapZapPage renderiza em modo neutro.
};

const PATENTE_MILITAR: RawConfig = {
  hostname: 'patentemilitar.click',
  brand: 'Patente Militar',
  siteSubtitle: 'Postos, Graduações e Sistema de Promoções da Polícia Militar — de Soldado a Coronel',
  razaoSocial: 'Fernandes Engenharia e Construcao LTDA',
  cnpj: '62551644000125',
  cnpjFormatted: '62.551.644/0001-25',
  endereco: 'Rua Monsenhor Bicalho, 145, Andar 2 Sala 2',
  bairro: 'Eldorado',
  cidade: 'Contagem',
  estado: 'MG',
  cep: '32310-220',
  enderecoCompleto: 'Rua Monsenhor Bicalho, 145, Andar 2 Sala 2 · Eldorado · Contagem/MG · CEP 32310-220',
  canonicalUrl: 'https://www.patentemilitar.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre a estrutura hierárquica e o sistema de promoções das Polícias Militares brasileiras e não constituem consultoria jurídica ou orientação sobre casos individuais. Este site é independente e não possui vínculo com qualquer corporação policial ou órgão público.',
  email: 'processos@contajul.com',
  telefone: '(31) 2115-8100',
  cnae: '41.20-4-00 - Construção de edifícios',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '03/09/2025',
  capitalSocial: 'R$ 30.000,00',
  breadcrumbLabel: 'Postos, Graduações e Promoções na Polícia Militar',
  h1Override: 'De soldado a coronel: guia completo de postos, graduações e promoções na Polícia Militar',
  leadOverride: 'Reunimos conteúdo informativo sobre a hierarquia completa da Polícia Militar — o que cada posto e graduação representa, como funciona o sistema de promoções por merecimento e antiguidade, os critérios para progressão entre graduações de praça e o que diferencia oficiais de praças na estrutura da corporação. Para critérios específicos da PM do seu estado, consulte o Estatuto dos Policiais Militares estadual.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Quais são todos os postos e graduações da Polícia Militar, do soldado ao coronel?',
      a: 'A estrutura hierárquica da PM divide-se em dois grandes grupos: praças e oficiais. As graduações de praça — em ordem crescente — são: Soldado, Cabo, 3º Sargento, 2º Sargento, 1º Sargento e Subtenente. Os postos de oficial são: 2º Tenente, 1º Tenente, Capitão, Major, Tenente-Coronel e Coronel. O Coronel PM é o posto mais elevado da carreira estadual. Cada corporação estadual pode ter variações de nomenclatura, e algumas possuem patentes intermediárias adicionais conforme o Estatuto próprio.',
    },
    {
      q: 'Como funciona o sistema de promoções na PM — por merecimento, antiguidade ou vaga?',
      a: 'As promoções na PM ocorrem geralmente por uma combinação de três critérios: antiguidade (tempo de serviço no posto ou graduação atual), merecimento (avaliação de desempenho, conduta disciplinar, cursos realizados e condecorações) e existência de vaga na graduação ou posto superior. Promoções entre as graduações de praça têm critérios mais objetivos, enquanto as promoções nos postos de oficial envolvem análise por Comissão de Promoções e maior peso do merecimento. Os critérios específicos são definidos pelo Estatuto dos Policiais Militares de cada estado.',
    },
    {
      q: 'Quais são os critérios e prazos típicos para progressão entre as graduações de praça?',
      a: 'Os prazos mínimos para promoção entre graduações de praça variam por estado, mas de forma geral o policial precisa cumprir um tempo mínimo em cada graduação — que costuma variar de 2 a 5 anos —, estar em situação disciplinar regular e, em alguns estados, concluir cursos de aperfeiçoamento específicos para cada nível. A promoção a Subtenente, a mais alta entre as praças, tende a exigir maior tempo de serviço e, frequentemente, conclusão do Curso de Formação de Sargentos ou equivalente.',
    },
    {
      q: 'O que diferencia os oficiais dos praças na estrutura hierárquica da PM?',
      a: 'A divisão entre praças e oficiais é a fronteira hierárquica mais significativa na PM. Os oficiais exercem funções de comando e direção — são responsáveis pelo planejamento operacional, pela gestão das unidades e pela representação institucional. Os praças executam as atividades operacionais diretas, como o policiamento ostensivo, sob supervisão dos oficiais. O ingresso nas duas carreiras ocorre por concursos distintos — um para soldado (início da carreira de praça) e outro para o Curso de Formação de Oficiais (CFO). A progressão de praça para oficial é possível, mas exige aprovação em processo seletivo específico e conclusão do CFO.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Fernandes Engenharia e Construcao LTDA não é escritório de
  // advocacia (CNPJ 62.551.644/0001-25, CNAE 41.20-4-00). ZapZapPage renderiza
  // em modo neutro.
};

const SONHO_DE_FARDA: RawConfig = {
  hostname: 'sonhodefarda.click',
  brand: 'Sonho de Farda',
  siteSubtitle: 'Motivação, Resiliência e o Caminho Emocional até a Aprovação na PM',
  razaoSocial: 'Pnzn Papeis Finos e Presentes LTDA',
  cnpj: '62549874000150',
  cnpjFormatted: '62.549.874/0001-50',
  endereco: 'Avenida Do Batel, 1868, Quiosqq-301 Andar L-3',
  bairro: 'Batel',
  cidade: 'Curitiba',
  estado: 'PR',
  cep: '80420-090',
  enderecoCompleto: 'Avenida Do Batel, 1868, Quiosqq-301 Andar L-3 · Batel · Curitiba/PR · CEP 80420-090',
  canonicalUrl: 'https://www.sonhodefarda.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre motivação e preparação emocional para concursos da Polícia Militar e não constituem orientação psicológica ou aconselhamento individual. Este site é independente e não possui vínculo com qualquer corporação policial, banca organizadora ou órgão público.',
  email: 'patiobatel.magnolia@gmail.com',
  telefone: '(41) 99135-3002',
  cnae: '47.61-0-03 - Comércio varejista de artigos de papelaria',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '03/09/2025',
  capitalSocial: 'R$ 150.000,00',
  breadcrumbLabel: 'Motivação e Resiliência na Preparação para a PM',
  h1Override: 'Como manter o sonho da farda vivo — motivação, resiliência e o lado emocional da preparação',
  leadOverride: 'Reunimos conteúdo informativo sobre o aspecto mais ignorado da preparação para a PM: a sustentabilidade emocional de uma jornada que pode durar anos. Como manter a motivação, o que fazer após uma reprovação, como lidar com a pressão de quem está à volta e o que muda concretamente na vida de quem conquista a aprovação.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Como manter a motivação durante uma preparação longa para o concurso da PM?',
      a: 'Preparações que se estendem por um ou dois anos — ou mais — exigem estratégias de sustentabilidade emocional que vão além da disciplina de estudo. Dividir o objetivo final em marcos intermediários mensuráveis (dominar uma disciplina, melhorar o tempo no TAF, concluir um simulado) cria momentos de conquista que alimentam a motivação ao longo do caminho. Registrar o progresso — um diário de estudo, uma planilha de desempenho — torna o avanço visível mesmo quando ele parece lento. Manter ao menos uma atividade prazerosa fora dos estudos não é desperdício de tempo: é o que impede o esgotamento que faz candidatos abandonarem antes de chegar à reta final.',
    },
    {
      q: 'O que fazer quando não se é aprovado em um ciclo do processo seletivo da PM?',
      a: 'A não aprovação em um ciclo é uma informação, não uma sentença. O primeiro passo é identificar com precisão em qual etapa a eliminação ocorreu — prova escrita, TAF, psicológico — e o que o desempenho naquela fase diz sobre onde concentrar energia no próximo ciclo. Candidatos que repetem os mesmos erros de preparação entre ciclos tendem a obter os mesmos resultados; os que fazem uma análise honesta e ajustam a estratégia aumentam progressivamente suas chances. Dar um tempo curto para processar a frustração é saudável; transformar esse tempo em inação prolongada é o maior risco para quem quer tentar novamente.',
    },
    {
      q: 'Como lidar com a pressão familiar e social durante a preparação para a PM?',
      a: 'A pressão de quem está de fora — família, amigos, colegas — costuma vir de dois lugares: preocupação genuína com o futuro do candidato e dificuldade de compreender por que alguém investiria tanto tempo em algo sem retorno garantido. Comunicar de forma clara o que é a carreira, o que a aprovação significa concretamente e qual é o plano caso o objetivo não se concretize ajuda a transformar ceticismo em apoio. Estabelecer limites sobre quando o tema pode ser discutido em casa — evitando que cada conversa se torne uma avaliação da preparação — protege o foco e o equilíbrio emocional do candidato.',
    },
    {
      q: 'O que muda na vida do candidato e da família com a aprovação na PM?',
      a: 'A aprovação na PM representa uma mudança de vida que vai além do emprego. Para o aprovado, há a transformação identitária de tornar-se um profissional de segurança pública — com a responsabilidade, os valores e a rotina que esse papel implica. Para a família, há a estabilidade financeira que a carreira oferece, mas também a adaptação à escala de trabalho (incluindo plantões, fins de semana e feriados) e ao risco inerente à profissão. Quanto mais essa conversa acontecer antes da aprovação — com expectativas alinhadas e apoio mútuo construído —, mais suave tende a ser a transição.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Pnzn Papeis Finos e Presentes LTDA não é escritório de advocacia
  // (CNPJ 62.549.874/0001-50, CNAE 47.61-0-03). ZapZapPage renderiza em modo neutro.
};

const HONRA_MILITAR: RawConfig = {
  hostname: 'honramilitar.click',
  brand: 'Honra Militar',
  siteSubtitle: 'História, Tradições e Cultura Institucional das Polícias Militares Brasileiras',
  razaoSocial: 'Chaveiro Auto Tecno LTDA',
  cnpj: '62549317000139',
  cnpjFormatted: '62.549.317/0001-39',
  endereco: 'Avenida Alvarenga Peixoto, 508, Andar 01 Loja 03',
  bairro: 'Amazonas',
  cidade: 'Contagem',
  estado: 'MG',
  cep: '32223-450',
  enderecoCompleto: 'Avenida Alvarenga Peixoto, 508, Andar 01 Loja 03 · Amazonas · Contagem/MG · CEP 32223-450',
  canonicalUrl: 'https://www.honramilitar.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre a história e as tradições das Polícias Militares brasileiras e não constituem consultoria jurídica ou orientação sobre casos individuais. Este site é independente e não possui vínculo com qualquer corporação policial ou órgão público.',
  email: 'chaveiroautotecno@gmail.com',
  telefone: '(31) 2565-1113',
  cnae: '95.29-1-02 - Chaveiros',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '03/09/2025',
  capitalSocial: 'R$ 30.000,00',
  breadcrumbLabel: 'História e Tradições das Polícias Militares do Brasil',
  h1Override: 'A história e as tradições que forjam a identidade da Polícia Militar brasileira',
  leadOverride: 'Reunimos conteúdo informativo sobre a origem histórica, as cerimônias, o código de honra e o papel da hierarquia que constroem a cultura institucional das Polícias Militares brasileiras — do surgimento no século XIX até as tradições que marcam a carreira de quem veste a farda hoje. Para informações oficiais, consulte o site da PM do seu estado.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Qual é a origem histórica das Polícias Militares brasileiras?',
      a: 'As Polícias Militares brasileiras têm origem no século XIX, com raízes que remontam às forças de segurança criadas durante o período imperial. A Guarda Real de Polícia, fundada em 1809 no Rio de Janeiro, é considerada um dos marcos fundadores da tradição policial militar no Brasil. Com a proclamação da República e a organização federativa do país, cada estado passou a estruturar sua própria corporação, herdando a tradição hierárquica e disciplinar das forças militares e incorporando progressivamente o modelo de policiamento ostensivo que permanece até hoje.',
    },
    {
      q: 'Quais são as principais tradições e cerimônias que marcam a vida institucional da PM?',
      a: 'A vida institucional da PM é pontuada por cerimônias que reforçam os vínculos de pertencimento e os valores da corporação. Entre as mais significativas estão a formatura dos novos policiais ao término do curso de formação — considerada um dos momentos mais marcantes da carreira —, a passagem de comando, que simboliza a continuidade institucional, as formaturas em datas comemorativas e as homenagens a policiais em missão. Cada corporação estadual tem suas tradições específicas, mas o caráter cerimonial e hierárquico é comum a todas.',
    },
    {
      q: 'O que é o código de honra do policial militar e como ele se expressa na prática?',
      a: 'O código de honra militar não é necessariamente um documento formal único, mas um conjunto de valores e princípios que orientam a conduta do policial dentro e fora do serviço — lealdade à corporação, cumprimento do dever mesmo sob adversidade, respeito à hierarquia, proteção dos mais vulneráveis e preservação da imagem institucional. Esses valores são transmitidos durante a formação e reforçados ao longo da carreira por meio de regulamentos disciplinares, cerimônias e da cultura interna da unidade onde o policial serve.',
    },
    {
      q: 'Como a hierarquia contribui para a coesão e a eficiência operacional da Polícia Militar?',
      a: 'A hierarquia militar garante previsibilidade na cadeia de decisão — em situações de alta pressão, saber quem decide e quem executa elimina ambiguidades que poderiam custar vidas. Ela também cria um sistema de responsabilidade vertical: cada nível responde pelos resultados de suas ações e das ações de quem está sob seu comando. Além da dimensão operacional, a hierarquia tem função simbólica — os rituais de respeito entre postos e graduações reforçam a coesão institucional e a identidade coletiva da corporação.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Chaveiro Auto Tecno LTDA não é escritório de advocacia (CNPJ
  // 62.549.317/0001-39, CNAE 95.29-1-02). ZapZapPage renderiza em modo neutro.
};

const TRILHA_PM: RawConfig = {
  hostname: 'trilhapm.click',
  brand: 'Trilha PM',
  siteSubtitle: 'Cada Etapa do Processo Seletivo da PM — Prova, TAF, Psicotécnico, Investigação e Exame Médico',
  razaoSocial: 'Distribuidora Pecas Truck Mqn LTDA',
  cnpj: '62549521000150',
  cnpjFormatted: '62.549.521/0001-50',
  endereco: 'Rua João David Perneta, 82',
  bairro: 'Hugo Lange',
  cidade: 'Curitiba',
  estado: 'PR',
  cep: '80040-330',
  enderecoCompleto: 'Rua João David Perneta, 82 · Hugo Lange · Curitiba/PR · CEP 80040-330',
  canonicalUrl: 'https://www.trilhapm.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre as etapas do processo seletivo da Polícia Militar e não constituem orientação jurídica ou psicológica sobre casos individuais. Este site é independente e não possui vínculo com qualquer corporação policial, banca organizadora ou órgão público.',
  email: 'contapagamentos@gmail.com',
  telefone: '(41) 3223-8875',
  cnae: '45.30-7-01 - Comércio por atacado de peças e acessórios novos para veículos automotores',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '03/09/2025',
  capitalSocial: 'R$ 130.000,00',
  breadcrumbLabel: 'Etapas do Processo Seletivo da Polícia Militar',
  h1Override: 'Da inscrição à aprovação: o que acontece em cada etapa do processo seletivo da PM',
  leadOverride: 'Reunimos conteúdo informativo sobre todas as fases do processo seletivo da Polícia Militar — prova de conhecimentos, TAF, avaliação psicológica, investigação social e exame médico — explicando o que cada etapa avalia, como se preparar e quais fatores podem causar desclassificação. Para informações oficiais, consulte sempre o edital do estado de interesse.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Quais são todas as etapas do processo seletivo da PM e em que ordem costumam ocorrer?',
      a: 'O processo seletivo da PM geralmente segue esta sequência: prova objetiva de conhecimentos, Teste de Aptidão Física (TAF), avaliação psicológica, exame médico, investigação social e, em alguns estados, avaliação de títulos ou entrevista. A ordem pode variar por edital — alguns estados realizam o exame médico antes da investigação social, outros invertem. Cada etapa é eliminatória; o candidato que não atinge o mínimo em qualquer fase é desclassificado independentemente do desempenho nas demais. Ler o edital do estado de interesse com atenção ao cronograma é indispensável.',
    },
    {
      q: 'Como se preparar para a avaliação psicológica no processo seletivo da PM?',
      a: 'A avaliação psicológica não tem gabarito certo ou errado — ela busca identificar características de personalidade compatíveis com o exercício da função policial, como estabilidade emocional, autocontrole, capacidade de lidar com pressão e ausência de traços que possam comprometer o julgamento em situações críticas. Candidatos que tentam manipular as respostas com base no que imaginam que os avaliadores querem ouvir costumam apresentar padrões inconsistentes, o que em si pode ser um indicativo de inadequação. A melhor preparação é estar descansado e responder com honestidade.',
    },
    {
      q: 'O que é avaliado na investigação social e o que pode gerar desclassificação?',
      a: 'A investigação social verifica a idoneidade moral e os antecedentes do candidato por meio de consulta a registros policiais, cartoriais e eleitorais, entrevistas com vizinhos e referências, e checagem de redes sociais. Podem gerar desclassificação: antecedentes criminais (mesmo sem condenação definitiva, em alguns estados), uso de substâncias ilícitas comprovado em entrevistas, vínculos com organizações criminosas, dívidas tributárias ou eleitorais não regularizadas e publicações em redes sociais incompatíveis com a conduta esperada de um agente de segurança pública.',
    },
    {
      q: 'Como funciona o exame médico no processo seletivo da PM e quais condições podem causar eliminação?',
      a: 'O exame médico avalia a aptidão física e clínica do candidato para o exercício das funções policiais. Inclui exames laboratoriais, avaliação cardiológica, oftalmológica, otorrinolaringológica e, em alguns estados, toxicológica. Condições que podem causar eliminação incluem: acuidade visual abaixo do mínimo exigido sem correção adequada, hipertensão arterial não controlada, uso de determinados medicamentos de uso contínuo, índice de massa corporal fora da faixa estabelecida em edital e resultado positivo no exame toxicológico. Os critérios variam por corporação estadual e são detalhados no edital.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Distribuidora Pecas Truck Mqn LTDA não é escritório de advocacia
  // (CNPJ 62.549.521/0001-50, CNAE 45.30-7-01). ZapZapPage renderiza em modo neutro.
};

const FOCO_NA_FARDA: RawConfig = {
  hostname: 'foconafarda.click',
  brand: 'Foco na Farda',
  siteSubtitle: 'Desempenho Mental, Concentração e Foco para o Dia da Prova da PM',
  razaoSocial: "D' Martins Assessoria e Consultoria Unipessoal LTDA",
  cnpj: '67588626000131',
  cnpjFormatted: '67.588.626/0001-31',
  endereco: 'Rua Paranaiguara, 50',
  bairro: 'Lot Alphaville Flamboyant',
  cidade: 'Goiânia',
  estado: 'GO',
  cep: '74884-667',
  enderecoCompleto: "Rua Paranaiguara, 50 · Lot Alphaville Flamboyant · Goiânia/GO · CEP 74884-667",
  canonicalUrl: 'https://www.foconafarda.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre desempenho mental e estratégias de foco para provas de concursos públicos e não constituem orientação psicológica ou médica individual. Este site é independente e não possui vínculo com qualquer corporação policial, banca organizadora ou órgão público.',
  email: 'fiscalmmc@gmail.com',
  telefone: '(61) 99253-5805',
  cnae: '82.11-3-00 - Serviços combinados de escritório e apoio administrativo',
  naturezaJuridica: 'Sociedade Simples Limitada',
  dataAbertura: '19/12/2024',
  capitalSocial: 'R$ 15.000,00',
  breadcrumbLabel: 'Foco e Desempenho Mental para Provas da PM',
  h1Override: 'Como chegar no estado mental ideal para a prova da PM — foco, ansiedade e desempenho',
  leadOverride: 'Reunimos conteúdo informativo sobre as estratégias que fazem diferença no dia da prova da Polícia Militar — como controlar a ansiedade, manter o foco em provas objetivas longas, o que comer e como dormir na véspera e o que fazer nas 24 horas que antecedem o exame. Para informações sobre o conteúdo programático do seu concurso, consulte o edital oficial.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Como controlar a ansiedade na véspera e no dia da prova da PM?',
      a: 'A ansiedade pré-prova é uma resposta fisiológica normal diante de situações de alta importância — o problema não é senti-la, mas deixar que ela comprometa o desempenho. Técnicas eficazes incluem respiração diafragmática (inspirar em 4 tempos, segurar em 4, expirar em 6), ancoragem em rotinas conhecidas (estudar no mesmo local, usar os mesmos materiais) e reduzir estímulos de alta intensidade nas 12 horas anteriores à prova — redes sociais, grupos de WhatsApp de concurseiros e revisões de última hora costumam amplificar a ansiedade sem agregar desempenho.',
    },
    {
      q: 'Quais técnicas de concentração ajudam durante uma prova objetiva extensa?',
      a: 'Em provas objetivas longas, a concentração tende a cair progressivamente. Estratégias que ajudam: responder primeiro as questões que você domina (gera confiança e economiza tempo), marcar as dúvidas para revisão posterior em vez de travar numa questão, e fazer microrrespiros de 10 segundos entre blocos de 10 questões — feche os olhos brevemente e respire fundo. Evite alterar respostas sem um motivo claro; a primeira leitura costuma ser mais confiável do que a revisão ansiosa.',
    },
    {
      q: 'Como o sono e a alimentação afetam o desempenho no dia da prova da PM?',
      a: 'O sono tem impacto direto na memória de trabalho, no tempo de reação e na capacidade de raciocínio — funções críticas em uma prova objetiva. Dormir menos de seis horas na noite anterior reduz significativamente o desempenho cognitivo, mesmo em candidatos bem preparados. Quanto à alimentação, prefira refeições de baixo índice glicêmico no dia da prova — carboidratos complexos e proteínas mantêm energia estável por mais tempo do que alimentos açucarados, que causam pico e queda rápidos de energia. Evite experimentar alimentos novos no dia; vá com o que seu organismo já conhece.',
    },
    {
      q: 'O que fazer nas 24 horas anteriores à prova para chegar no estado mental ideal?',
      a: 'As 24 horas antes da prova não são para aprender conteúdo novo — são para calibrar o estado mental. Revise apenas um resumo breve de pontos já consolidados, confirme logística (local de prova, documentos, horário de saída), prepare o material que levará (caneta, documento, água) e durma no horário habitual. Atividade física leve na manhã anterior ajuda a regular o cortisol. No dia da prova, chegue com antecedência suficiente para se acomodar sem pressa — chegar atrasado ou com pressa ativa o sistema de estresse de forma desnecessária.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — D' Martins Assessoria e Consultoria Unipessoal LTDA não é
  // escritório de advocacia (CNPJ 67.588.626/0001-31, CNAE 82.11-3-00).
  // ZapZapPage renderiza em modo neutro.
};

const GUIA_DO_PM: RawConfig = {
  hostname: 'guiadopm.click',
  brand: 'Guia do PM',
  siteSubtitle: 'Benefícios, Assistência e Recursos Institucionais para o Policial Militar',
  razaoSocial: 'Comex B2G LTDA',
  cnpj: '62548749000125',
  cnpjFormatted: '62.548.749/0001-25',
  endereco: 'Rua Guararapes, 134',
  bairro: 'Monte Castelo',
  cidade: 'Contagem',
  estado: 'MG',
  cep: '32285-090',
  enderecoCompleto: 'Rua Guararapes, 134 · Monte Castelo · Contagem/MG · CEP 32285-090',
  canonicalUrl: 'https://www.guiadopm.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre recursos e benefícios institucionais disponíveis para policiais militares e não constituem consultoria jurídica ou financeira sobre casos individuais. Este site é independente e não possui vínculo com qualquer corporação policial, entidade de assistência ou órgão público.',
  email: 'comexb2g@gmail.com',
  telefone: '(31) 99138-0034',
  cnae: '47.51-2-01 - Comércio varejista especializado de equipamentos e suprimentos de informática',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '03/09/2025',
  capitalSocial: 'R$ 50.000,00',
  breadcrumbLabel: 'Benefícios e Recursos Institucionais para Policiais Militares',
  h1Override: 'Quais recursos e benefícios estão disponíveis para o policial militar durante a carreira',
  leadOverride: 'Reunimos conteúdo informativo sobre os principais apoios institucionais acessíveis ao policial militar — caixas de assistência, associações de classe, plano de saúde corporativo, previdência complementar e cooperativas de crédito. Para informações oficiais sobre os benefícios da sua corporação, consulte o setor de recursos humanos da sua unidade ou a entidade de assistência do seu estado.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'O que é a Caixa de Assistência do Policial Militar (CAPM) e quais benefícios ela oferece?',
      a: 'A CAPM — ou equivalente estadual, já que cada corporação tem sua própria entidade de assistência — é uma organização voltada ao suporte financeiro e social do policial militar e de seus dependentes. Em geral, oferece empréstimos em condições diferenciadas, auxílio funeral, assistência em casos de invalidez e, em alguns estados, auxílio educação para filhos de policiais. Os serviços variam por estado e exigem filiação formal; o policial deve consultar a entidade da sua corporação para conhecer os benefícios disponíveis e os critérios de acesso.',
    },
    {
      q: 'Quais associações e entidades de classe existem para representar os policiais militares?',
      a: 'As principais entidades de representação incluem associações de praças, associações de oficiais e, em alguns estados, sindicatos de servidores militares estaduais — embora a sindicalização de militares seja restrita juridicamente. Essas organizações atuam na defesa de interesses trabalhistas e previdenciários, na interlocução com o governo estadual em negociações salariais e na oferta de benefícios aos associados, como convênios com clínicas, farmácias e estabelecimentos comerciais. Cada estado possui suas próprias entidades; o policial deve verificar as opções disponíveis na corporação onde atua.',
    },
    {
      q: 'Como funciona o plano de saúde disponível para o policial militar e seus dependentes?',
      a: 'A maioria das corporações estaduais oferece alguma modalidade de assistência à saúde — seja por meio de sistema próprio (policlínicas e hospitais militares), convênios com operadoras de saúde ou fundo de assistência gerido pela própria PM. A cobertura, o custeio e as condições de inclusão de dependentes variam bastante entre os estados. Em algumas corporações, o benefício é parcialmente custeado pelo estado; em outras, o policial arca com parte da mensalidade. O policial deve consultar o setor de recursos humanos da sua unidade para entender as opções disponíveis.',
    },
    {
      q: 'O policial militar tem acesso a previdência complementar ou cooperativas de crédito?',
      a: 'Sim, em muitos estados. Cooperativas de crédito voltadas a servidores militares oferecem condições de empréstimo, financiamento e investimento mais favoráveis do que as instituições financeiras convencionais — com taxas de juros reduzidas e prazos diferenciados. Quanto à previdência complementar, alguns estados criaram fundos específicos para servidores públicos estaduais, incluindo policiais militares, especialmente após as reformas previdenciárias que alteraram o teto dos benefícios do RPPS. A adesão e as condições variam por estado e exigem consulta direta à entidade gestora.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Comex B2G LTDA não é escritório de advocacia (CNPJ
  // 62.548.749/0001-25, CNAE 47.51-2-01). ZapZapPage renderiza em modo neutro.
};

const MISSAO_FARDA: RawConfig = {
  hostname: 'missaofarda.click',
  brand: 'Missão Farda',
  siteSubtitle: 'Vocação, Propósito e o Significado de Servir na Polícia Militar',
  razaoSocial: 'Jl Distribuidora Retiro Ltda.',
  cnpj: '62539537000181',
  cnpjFormatted: '62.539.537/0001-81',
  endereco: 'Rua Ilha do Retiro, 92, Loja Lj',
  bairro: 'Retiro',
  cidade: 'Contagem',
  estado: 'MG',
  cep: '32050-510',
  enderecoCompleto: 'Rua Ilha do Retiro, 92, Loja Lj · Retiro · Contagem/MG · CEP 32050-510',
  canonicalUrl: 'https://www.missaofarda.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre vocação e carreira na Polícia Militar e não constituem consultoria jurídica ou orientação sobre casos individuais. Este site é independente e não possui vínculo com qualquer corporação policial ou órgão público.',
  email: 'jldistribuidoraretiro@gmail.com',
  telefone: '(31) 97319-7498',
  cnae: '47.23-7-00 - Comércio varejista de bebidas',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '03/09/2025',
  capitalSocial: 'R$ 30.000,00',
  breadcrumbLabel: 'Vocação e Propósito na Carreira de Policial Militar',
  h1Override: 'O que significa vestir a farda — vocação, missão e propósito na carreira policial',
  leadOverride: 'Reunimos conteúdo informativo sobre o que motiva quem escolhe a carreira de policial militar, como a missão de servir se manifesta no dia a dia profissional e como conciliar valores pessoais com as exigências de uma instituição hierárquica. Para informações sobre processos seletivos, consulte o site da PM do seu estado.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'O que motiva as pessoas a escolherem a carreira de policial militar?',
      a: 'As motivações variam muito entre indivíduos, mas pesquisas com policiais militares apontam padrões comuns: o desejo de contribuir diretamente com a segurança da comunidade, a atração pela estrutura e pelos valores da vida militar, a estabilidade que a carreira oferece e, em muitos casos, a influência de familiares que também serviram. Para parte expressiva dos policiais, a escolha envolve uma dimensão vocacional genuína — uma identificação com o papel de proteger e servir que antecede a decisão de prestar o concurso.',
    },
    {
      q: 'Como a vocação para servir se manifesta no cotidiano do policial militar?',
      a: 'No dia a dia, a vocação se traduz em comprometimento com a missão mesmo em situações de alta pressão, na postura ativa diante de ocorrências que exigem iniciativa e na relação de respeito construída com a comunidade ao longo do tempo. Policiais que enxergam o serviço como missão tendem a manter conduta mais consistente, a buscar qualificação contínua e a enfrentar o desgaste da carreira com mais resiliência do que aqueles que ingressaram exclusivamente por estabilidade financeira.',
    },
    {
      q: 'Qual é o papel da Polícia Militar na segurança pública da comunidade?',
      a: 'A Polícia Militar é responsável pelo policiamento ostensivo e pela preservação da ordem pública — atua de forma visível, preventiva e reativa nas ruas, em eventos e em situações de emergência. Além do atendimento a ocorrências, a PM tem papel relevante no policiamento comunitário, na mediação de conflitos e na construção de vínculos de confiança com a população. A efetividade dessa missão depende tanto do preparo técnico quanto da postura ética e da qualidade da relação que cada policial estabelece com a comunidade em que atua.',
    },
    {
      q: 'Como conciliar os valores pessoais com as exigências institucionais da carreira policial?',
      a: 'A carreira policial impõe valores e normas institucionais — hierarquia, disciplina, obediência a regulamentos — que nem sempre coincidem de forma imediata com os valores individuais de cada profissional. A conciliação saudável passa por compreender que a estrutura institucional existe para garantir coesão e previsibilidade, enquanto o espaço para a expressão dos valores pessoais acontece dentro dos limites que essa estrutura permite. Corporações que investem em formação ética e em canais de escuta criam ambientes onde profissionais comprometidos conseguem manter integridade e pertencimento ao mesmo tempo.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Jl Distribuidora Retiro Ltda. não é escritório de advocacia
  // (CNPJ 62.539.537/0001-81, CNAE 47.23-7-00). ZapZapPage renderiza em modo neutro.
};

const MINHA_FARDA: RawConfig = {
  hostname: 'minhafarda.click',
  brand: 'Minha Farda',
  siteSubtitle: 'Composição, Cuidados e Regulamentos do Uniforme da Polícia Militar',
  razaoSocial: 'Ink Grafica LTDA',
  cnpj: '62550653000100',
  cnpjFormatted: '62.550.653/0001-00',
  endereco: 'Rua Cruzeiro do Sul, 953, Loja',
  bairro: 'Novo Progresso',
  cidade: 'Contagem',
  estado: 'MG',
  cep: '32115-170',
  enderecoCompleto: 'Rua Cruzeiro do Sul, 953, Loja · Novo Progresso · Contagem/MG · CEP 32115-170',
  canonicalUrl: 'https://www.minhafarda.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre o uniforme e o fardamento da Polícia Militar e não constituem orientação oficial de qualquer corporação. Este site é independente e não possui vínculo com nenhuma Polícia Militar estadual ou órgão público.',
  email: 'contatograficaink@gmail.com',
  telefone: '(31) 98384-9251',
  cnae: '18.22-9-99 - Serviços de acabamentos gráficos, exceto encadernação e plastificação',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '03/09/2025',
  capitalSocial: 'R$ 115.000,00',
  breadcrumbLabel: 'Uniforme e Fardamento da Polícia Militar',
  h1Override: 'Tudo sobre o uniforme da PM — composição, cuidados e o que diz o regulamento',
  leadOverride: 'Reunimos conteúdo informativo sobre o fardamento da Polícia Militar — quais peças compõem cada modalidade de uniforme, como conservar corretamente cada item, as regras de uso fora do serviço e como funciona o fornecimento do fardamento ao ingressar na corporação. Para informações oficiais, consulte o regulamento de uniformes da PM do seu estado.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Quais são os principais itens que compõem o uniforme da Polícia Militar?',
      a: 'O fardamento da PM é composto por diferentes modalidades conforme a ocasião: o uniforme de serviço (diário) inclui calça, camisa ou gandola, coturno, quepe ou boné e cinto de guarnição. O uniforme de gala é utilizado em cerimônias e conta com peças adicionais como dolmã, calça com vivo e dragonas. Cada corporação estadual tem seu regulamento de uniformes específico, que define cores, insígnias, posicionamento de distintivos e regras de uso para cada modalidade.',
    },
    {
      q: 'Como cuidar e conservar adequadamente o uniforme da PM para mantê-lo em boas condições?',
      a: 'A conservação do uniforme começa pela lavagem correta: peças de tecido resistente como a gandola devem ser lavadas em água fria com sabão neutro para preservar a cor e o caimento. O coturno exige limpeza regular com flanela e graxa própria, além de impermeabilização periódica. Quepes e bonés não devem ser lavados na máquina — prefira limpeza com escova seca e pano úmido. Guardar o uniforme em local arejado, pendurado em cabide adequado, evita amassados e o aparecimento de mofo em regiões úmidas.',
    },
    {
      q: 'Existem regras sobre o uso do uniforme da PM fora do horário de serviço?',
      a: 'Sim. O uso do uniforme fora do serviço é regulado por cada corporação estadual e, em geral, é permitido apenas em situações específicas previstas no regulamento interno — como deslocamento para o trabalho ou em eventos autorizados pela corporação. O uso indevido do uniforme em ambientes que possam comprometer a imagem institucional é vedado e pode sujeitar o policial a procedimento disciplinar. Alguns estados permitem o porte de arma fora do serviço, mas com regras específicas sobre identificação e uniforme.',
    },
    {
      q: 'Como funciona o fornecimento do uniforme ao ingressar na PM como novo policial?',
      a: 'Em geral, a corporação fornece o kit inicial de fardamento ao recruta durante o curso de formação — incluindo os itens essenciais para o período de instrução. A quantidade e as peças fornecidas variam por estado, e alguns itens podem exigir aquisição complementar pelo próprio policial ao longo da carreira. Após o ingresso, o policial tem direito a reposição periódica de itens do fardamento conforme regulamento interno, que define prazos e condições para substituição das peças desgastadas.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Ink Grafica LTDA não é escritório de advocacia (CNPJ
  // 62.550.653/0001-00, CNAE 18.22-9-99). ZapZapPage renderiza em modo neutro.
};

const PROXIMO_EDITAL: RawConfig = {
  hostname: 'proximoedital.click',
  brand: 'Próximo Edital',
  siteSubtitle: 'Como Monitorar e Antecipar Editais de Concursos da Polícia Militar',
  razaoSocial: 'Br Motos LTDA',
  cnpj: '62550094000120',
  cnpjFormatted: '62.550.094/0001-20',
  endereco: 'Avenida T9, 2840, Box 30',
  bairro: 'Bro Jardim America',
  cidade: 'Goiânia',
  estado: 'GO',
  cep: '74255-220',
  enderecoCompleto: 'Avenida T9, 2840, Box 30 · Bro Jardim America · Goiânia/GO · CEP 74255-220',
  canonicalUrl: 'https://www.proximoedital.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre o monitoramento de editais de concursos públicos e não constituem previsão oficial de abertura de seleções ou orientação sobre casos individuais. Este site é independente e não possui vínculo com qualquer corporação policial, banca organizadora ou órgão público.',
  email: 'rodrigotaioba@gmail.com',
  telefone: '(19) 99819-9067',
  cnae: '77.11-0-00 - Locação de automóveis sem condutor',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '03/09/2025',
  capitalSocial: 'R$ 270.000,00',
  breadcrumbLabel: 'Monitoramento de Editais e Previsões de Concursos da PM',
  h1Override: 'Como acompanhar o próximo edital de concurso da PM e não perder nenhuma oportunidade',
  leadOverride: 'Reunimos conteúdo informativo sobre como monitorar a publicação de novos editais de concursos da Polícia Militar — quais fontes acompanhar, quais estados abrem seleções com maior regularidade e como aproveitar o período de espera entre editais para chegar preparado. Para informações oficiais, consulte o Diário Oficial do seu estado e o site da PM estadual.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Como saber quando vai sair o próximo edital de concurso da PM do meu estado?',
      a: 'Não existe um calendário oficial antecipado de concursos da PM — cada edital depende de autorização legislativa, dotação orçamentária e decisão do governo estadual. A forma mais confiável de se antecipar é acompanhar o Diário Oficial do estado, o site institucional da PM estadual e as sessões da Assembleia Legislativa, onde projetos de lei autorizando concursos costumam tramitar meses antes da publicação do edital. Portais especializados em concursos públicos também monitoram esses movimentos e publicam notícias sobre previsões e autorizações em andamento.',
    },
    {
      q: 'Quais estados da PM costumam abrir concursos com maior regularidade?',
      a: 'Estados com maior efetivo e maior taxa de saída por aposentadoria tendem a abrir concursos com mais frequência — São Paulo, Minas Gerais, Bahia e Rio Grande do Sul historicamente figuram entre as corporações que realizam seleções em intervalos menores. Estados com menor efetivo ou orçamento mais restrito podem passar vários anos sem abrir vagas. Acompanhar o histórico de editais publicados nos últimos cinco anos é uma boa forma de estimar a cadência de cada corporação.',
    },
    {
      q: 'O que fazer no período de espera entre editais para não perder a preparação?',
      a: 'O intervalo entre editais é um dos momentos mais estratégicos da preparação: sem a pressão imediata de uma data de prova, é possível consolidar conteúdos com mais profundidade, trabalhar disciplinas com menor percentual de acerto e construir o condicionamento físico de forma progressiva. Candidatos que aproveitam esse período chegam ao edital seguinte com base sólida e precisam apenas ajustar o foco ao conteúdo específico do certame. Abandonar os estudos durante a espera é o erro mais comum entre quem tenta repetidamente.',
    },
    {
      q: 'Como se manter atualizado sobre novos editais de concursos militares sem depender de uma única fonte?',
      a: 'A estratégia mais robusta combina múltiplas fontes: ativar alertas do Google para termos como "edital PM [estado]", assinar o Diário Oficial estadual por e-mail quando disponível, seguir os perfis oficiais da PM nas redes sociais e acompanhar grupos e comunidades de concurseiros do seu estado. Cada fonte tem velocidade e confiabilidade diferentes — o Diário Oficial é a fonte primária e definitiva, enquanto portais e redes sociais agilizam o acesso à informação, mas podem conter imprecisões antes da confirmação oficial.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Br Motos LTDA não é escritório de advocacia (CNPJ
  // 62.550.094/0001-20, CNAE 77.11-0-00). ZapZapPage renderiza em modo neutro.
};

const PANORAMA_PM: RawConfig = {
  hostname: 'panoramapm.click',
  brand: 'Panorama PM',
  siteSubtitle: 'Do Ingresso à Aposentadoria: a Carreira Completa do Policial Militar',
  razaoSocial: 'Anacarlaperiodontia LTDA',
  cnpj: '62523695000143',
  cnpjFormatted: '62.523.695/0001-43',
  endereco: 'Avenida Governador Joao Durval Carneiro, 3803, Edif Charmant Sala 913',
  bairro: 'Sao Joao',
  cidade: 'Feira de Santana',
  estado: 'BA',
  cep: '44051-335',
  enderecoCompleto: 'Avenida Governador Joao Durval Carneiro, 3803, Edif Charmant Sala 913 · Sao Joao · Feira de Santana/BA · CEP 44051-335',
  canonicalUrl: 'https://www.panoramapm.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre a estrutura de carreira da Polícia Militar e não constituem consultoria jurídica ou orientação sobre casos individuais. Este site é independente e não possui vínculo com qualquer corporação policial ou órgão público.',
  email: 'acmpperiodontia@gmail.com',
  telefone: '(71) 98605-0042',
  cnae: '86.30-5-04 - Atividade odontológica',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '02/09/2025',
  capitalSocial: 'R$ 130.000,00',
  breadcrumbLabel: 'Trajetória Completa da Carreira de Policial Militar',
  h1Override: 'A carreira de policial militar do início ao fim — graduações, especialidades e aposentadoria',
  leadOverride: 'Reunimos conteúdo informativo sobre toda a trajetória possível dentro da Polícia Militar — da formação como soldado à progressão de graduações, especialidades disponíveis, possibilidade de acesso ao CFO e como funciona a aposentadoria. Para informações oficiais, consulte sempre a PM do seu estado.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Qual é a progressão de carreira completa de um policial militar, do ingresso à aposentadoria?',
      a: 'A carreira de praça começa no ingresso como soldado e pode progredir, via cursos internos e avaliações, pelas graduações de cabo, terceiro, segundo e primeiro sargentos, subtenente e aspirante. Praças com perfil e requisitos adequados podem acessar o Curso de Formação de Oficiais (CFO) e iniciar a carreira de oficial — de segundo-tenente a coronel. Em paralelo, é possível se especializar em áreas como inteligência, trânsito, policiamento ambiental ou montado. A aposentadoria voluntária ocorre após tempo de contribuição definido em lei estadual, geralmente entre 25 e 30 anos de serviço.',
    },
    {
      q: 'Em quanto tempo um soldado recém-formado pode alcançar a graduação de sargento?',
      a: 'O tempo varia por corporação estadual, mas em média um soldado pode chegar ao posto de terceiro-sargento em oito a doze anos de serviço, após cumprir os interstícios mínimos em cada graduação, concluir o Curso de Formação de Sargentos (CFS) e ser aprovado nas avaliações de desempenho. Estados com maior efetivo e rotatividade tendem a ter progressão mais rápida; corporações menores podem apresentar estagnação em determinadas graduações por ausência de vagas.',
    },
    {
      q: 'Quais são as principais especialidades disponíveis dentro da Polícia Militar?',
      a: 'As PMs estaduais oferecem diversas especialidades além do policiamento ostensivo convencional: policiamento de trânsito (BPTran), policiamento ambiental, policiamento montado (cavalaria), unidades de operações especiais (COE, BOPE, GATE), policiamento comunitário, inteligência policial e aviação. O acesso a cada especialidade depende de tempo de serviço, requisitos físicos específicos e aprovação em processo seletivo interno. Cada especialização abre um percurso diferente dentro da carreira.',
    },
    {
      q: 'Como funciona a aposentadoria do policial militar e quais são os requisitos?',
      a: 'A aposentadoria do policial militar é regida pelo Estatuto dos Militares Estaduais de cada estado. Em geral, a aposentadoria voluntária exige um mínimo de anos de serviço — frequentemente 25 anos para as praças e 30 para os oficiais — além de idade mínima definida pela legislação previdenciária estadual. A reforma compulsória ocorre ao atingir o limite de idade para o posto ou graduação. Os proventos variam conforme o tempo de serviço, o posto final e as regras de transição aplicáveis a cada corporação.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Anacarlaperiodontia LTDA não é escritório de advocacia (CNPJ
  // 62.523.695/0001-43, CNAE 86.30-5-04). ZapZapPage renderiza em modo neutro.
};

const CRONOGRAMA_PM: RawConfig = {
  hostname: 'cronogramapm.click',
  brand: 'Cronograma PM',
  siteSubtitle: 'Como Organizar e Gerenciar o Tempo de Estudos para o Concurso da PM',
  razaoSocial: 'Cop Odontologia Premium LTDA',
  cnpj: '62509737000191',
  cnpjFormatted: '62.509.737/0001-91',
  endereco: 'Avenida Getulio Vargas, 456',
  bairro: 'Centro',
  cidade: 'Feira de Santana',
  estado: 'BA',
  cep: '44001-192',
  enderecoCompleto: 'Avenida Getulio Vargas, 456 · Centro · Feira de Santana/BA · CEP 44001-192',
  canonicalUrl: 'https://www.cronogramapm.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre organização e gerenciamento de estudos para concursos públicos e não constituem garantia de aprovação ou orientação sobre casos individuais. Este site é independente e não possui vínculo com qualquer corporação policial, banca organizadora ou órgão público.',
  email: 'fiscal@sgcon.com.br',
  telefone: '(75) 3616-7471',
  cnae: '86.30-5-04 - Atividade odontológica',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '01/09/2025',
  capitalSocial: 'R$ 200.000,00',
  breadcrumbLabel: 'Cronograma e Gestão de Tempo para Concursos da PM',
  h1Override: 'Como montar um cronograma de estudos que realmente funciona para o concurso da PM',
  leadOverride: 'Reunimos conteúdo informativo sobre como estruturar e adaptar um cronograma de estudos para concursos da Polícia Militar — distribuição de horas por disciplina, estratégias para quem trabalha em tempo integral e como ajustar o ritmo nas semanas que antecedem a prova. Para informações oficiais sobre editais, consulte sempre a PM do seu estado.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Como montar um cronograma semanal de estudos para o concurso da PM?',
      a: 'Um cronograma semanal eficiente começa pelo mapeamento do tempo disponível: some as horas livres de segunda a domingo, desconte sono, alimentação, deslocamento e obrigações fixas. Com o tempo real em mãos, distribua as disciplinas do edital proporcionalmente ao seu peso na prova e à sua dificuldade atual. Reserve ao menos dois blocos semanais para revisão do conteúdo já estudado e um bloco para resolução de questões — sem isso, o cronograma vira acumulação de conteúdo sem fixação.',
    },
    {
      q: 'Como distribuir o tempo de estudo entre as disciplinas do concurso da PM?',
      a: 'A distribuição ideal parte da análise do edital: verifique quantas questões cada disciplina representa na prova objetiva e qual é seu percentual de acerto atual nessa matéria. Disciplinas com alto peso e baixo domínio recebem mais tempo; disciplinas já consolidadas entram em modo de manutenção com revisões espaçadas. Matemática e raciocínio lógico costumam exigir estudo diário para manter o ritmo, enquanto história e geografia permitem blocos alternados sem perda significativa de desempenho.',
    },
    {
      q: 'Como adaptar o cronograma de estudos para quem trabalha em tempo integral?',
      a: 'Quem trabalha precisa ser ainda mais estratégico: blocos curtos e frequentes funcionam melhor do que sessões longas e irregulares. Madrugadas ou manhãs antes do trabalho, horário de almoço e o período logo após o jantar são janelas que, somadas, podem render de duas a três horas diárias. Áudios e podcasts de conteúdo durante o deslocamento complementam sem substituir o estudo ativo. Nos finais de semana, períodos mais longos permitem avançar em conteúdos que exigem maior concentração.',
    },
    {
      q: 'Com que antecedência o cronograma deve ser intensificado antes da data da prova?',
      a: 'A fase de intensificação geralmente começa de quatro a seis semanas antes da prova, quando o foco se desloca do conteúdo novo para a revisão e a resolução intensiva de questões e simulados. Nessa fase, é recomendável reduzir o volume de novos tópicos e aumentar a proporção de questões comentadas e provas anteriores da mesma banca. A semana da prova deve ser de revisão leve, descanso ativo e preparação logística — sem conteúdo novo, que gera ansiedade sem benefício mensurável.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Cop Odontologia Premium LTDA não é escritório de advocacia (CNPJ
  // 62.509.737/0001-91, CNAE 86.30-5-04). ZapZapPage renderiza em modo neutro.
};

const EDITAL_MILITAR: RawConfig = {
  hostname: 'editalmilitar.click',
  brand: 'Edital Militar',
  siteSubtitle: 'Como Ler, Interpretar e Não Perder Nada em Editais de Concursos da PM',
  razaoSocial: 'Bittencourt Berenguer Cesar Ativos LTDA',
  cnpj: '62532283000170',
  cnpjFormatted: '62.532.283/0001-70',
  endereco: 'Rua Fernando Ferrari, 614',
  bairro: 'Brasilia',
  cidade: 'Feira de Santana',
  estado: 'BA',
  cep: '44088-066',
  enderecoCompleto: 'Rua Fernando Ferrari, 614 · Brasilia · Feira de Santana/BA · CEP 44088-066',
  canonicalUrl: 'https://www.editalmilitar.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre a interpretação de editais de concursos públicos e não constituem consultoria jurídica ou orientação sobre casos individuais. Este site é independente e não possui vínculo com qualquer banca organizadora, corporação policial ou órgão público.',
  email: 'contato@bberenguercesarativos.com.br',
  telefone: '(71) 99686-0916',
  cnae: '74.90-1-04 - Atividades de intermediação e agenciamento de serviços e negócios em geral, exceto imobiliários',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '02/09/2025',
  capitalSocial: 'R$ 1.000.000,00',
  breadcrumbLabel: 'Leitura e Interpretação de Editais de Concursos Militares',
  h1Override: 'Como ler um edital de concurso da PM sem deixar passar nenhum detalhe crítico',
  leadOverride: 'Reunimos conteúdo informativo sobre como interpretar editais de concursos da Polícia Militar — quais informações verificar primeiro, critérios de eliminação que candidatos costumam ignorar, como entender tabelas de pontuação e como acompanhar prazos de recurso em cada fase. Para informações oficiais, consulte sempre a banca organizadora e o site da PM do seu estado.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Quais são as informações mais críticas para verificar imediatamente ao sair um edital da PM?',
      a: 'Ao abrir um edital de concurso da PM, priorize verificar: limite de idade na data da inscrição ou da posse (os critérios variam), escolaridade exigida, requisitos de idoneidade moral e antecedentes, número de vagas por cargo e localidade, e o cronograma completo — da inscrição até a nomeação estimada. Em seguida, leia atentamente as causas de eliminação sumária, que costumam incluir condições médicas, tatuagens visíveis em farda e antecedentes criminais específicos.',
    },
    {
      q: 'Quais critérios de eliminação candidatos frequentemente ignoram ao ler um edital militar?',
      a: 'Entre os critérios que mais surpreendem candidatos estão: restrições relacionadas a tatuagens em regiões visíveis com o uniforme, histórico de uso de substâncias ilícitas apurado na investigação social, pendências com a Justiça Eleitoral ou Militar, e incompatibilidade de acúmulo de cargo público. Alguns editais também vedam a participação de candidatos que tenham sido demitidos de cargo público por justa causa ou respondido a processo administrativo disciplinar. Ler o capítulo de requisitos de forma integral — não apenas resumos — é indispensável.',
    },
    {
      q: 'Como interpretar a tabela de pontuação e os critérios de desempate em editais militares?',
      a: 'A tabela de pontuação define o peso de cada etapa (prova objetiva, TAF, avaliação psicológica, títulos, etc.) no cômputo final. É fundamental verificar quais etapas são eliminatórias e qual a nota mínima de corte em cada uma — pois uma nota abaixo do mínimo exclui o candidato independentemente do desempenho nas demais fases. Os critérios de desempate costumam seguir uma ordem definida: maior idade, maior pontuação na prova objetiva e, em alguns editais, tempo de serviço público anterior.',
    },
    {
      q: 'Qual é o prazo para recurso nas etapas eliminatórias e como acompanhá-lo?',
      a: 'Os prazos para interposição de recursos variam por edital, mas costumam ser de um a dois dias úteis após a divulgação do resultado de cada fase. É essencial acompanhar o cronograma publicado no site oficial da banca organizadora e no Diário Oficial do estado, pois atrasos na leitura dos resultados podem fazer o candidato perder o prazo recursal. Guarde prints do resultado, da publicação oficial e do protocolo do recurso como comprovação caso haja necessidade de contestação posterior.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Bittencourt Berenguer Cesar Ativos LTDA não é escritório de
  // advocacia (CNPJ 62.532.283/0001-70, CNAE 74.90-1-04). ZapZapPage renderiza
  // em modo neutro.
};

const FUTURO_SOLDADO: RawConfig = {
  hostname: 'futurosoldado.click',
  brand: 'Futuro Soldado',
  siteSubtitle: 'A Transformação de Vida de Quem Ingressa na Polícia Militar como Soldado',
  razaoSocial: 'Mb Internacional LTDA',
  cnpj: '62466825000153',
  cnpjFormatted: '62.466.825/0001-53',
  endereco: 'Avenida Papa Joao Paulo I, 4006, Galpao02',
  bairro: 'Residencial Parque Cumbica',
  cidade: 'Guarulhos',
  estado: 'SP',
  cep: '07174-005',
  enderecoCompleto: 'Avenida Papa Joao Paulo I, 4006, Galpao02 · Residencial Parque Cumbica · Guarulhos/SP · CEP 07174-005',
  canonicalUrl: 'https://www.futurosoldado.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre o ingresso e a formação de soldados da Polícia Militar e não constituem consultoria jurídica ou orientação sobre casos individuais. Este site é independente e não possui vínculo com qualquer corporação policial ou órgão público.',
  email: 'oregonempresarial@gmail.com',
  telefone: '(15) 99628-4851',
  cnae: '82.11-3-00 - Serviços combinados de escritório e apoio administrativo',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '29/08/2025',
  capitalSocial: 'R$ 860.000,00',
  breadcrumbLabel: 'Formação e Vida de Soldado na Polícia Militar',
  h1Override: 'O que realmente muda quando você se torna soldado da Polícia Militar',
  leadOverride: 'Reunimos conteúdo informativo sobre a transformação que acompanha o ingresso na PM como soldado — como é a rotina no curso de recrutas, os desafios físicos e psicológicos da formação e como a família se adapta a essa nova realidade. Para informações oficiais sobre processos seletivos, consulte sempre o site da PM do seu estado.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'O que muda na vida de uma pessoa ao se tornar soldado da Polícia Militar?',
      a: 'Ingressar na PM como soldado representa uma mudança profunda — não apenas profissional, mas de identidade e rotina. O novo policial passa a conviver com hierarquia rígida, responsabilidade coletiva e uma cultura institucional distinta do ambiente civil. A forma de se vestir, de se comunicar dentro da corporação e de gerir o tempo fora do serviço se transforma. Para muitos, é a primeira experiência com um ambiente de alta exigência disciplinar sustentada, o que exige adaptação gradual e intencional.',
    },
    {
      q: 'Como é a rotina no curso de formação de soldados da Polícia Militar?',
      a: 'O curso de formação de soldados (recrutas) combina instrução teórica — legislação, direitos humanos, ética policial — com treinamento físico intensivo e instrução tática. A rotina é estruturada em blocos fixos: diana, atividade física matinal, aulas, instrução prática e recolher. O regime costuma ser de internato total ou parcial durante o período de formação, com saídas controladas. A duração varia por estado, geralmente entre três e seis meses.',
    },
    {
      q: 'Quais são os principais desafios físicos e psicológicos do curso de recrutas?',
      a: 'No campo físico, os maiores desafios costumam ser a adaptação ao volume e à intensidade do treinamento diário, especialmente para candidatos que chegam com condicionamento aeróbico abaixo da média. No campo psicológico, enfrentar a distância da família, a convivência forçada com desconhecidos em ambiente de pressão e a exigência de subordinação constante são os pontos que mais demandam resiliência. Corporações estruturadas oferecem suporte psicológico durante a formação para auxiliar nessa transição.',
    },
    {
      q: 'Como a família se adapta à nova rotina de quem ingressa na PM como soldado?',
      a: 'A adaptação familiar é um dos aspectos menos discutidos — e mais relevantes — de quem ingressa na PM. A escala de plantão, as convocações em datas especiais e os períodos de formação com internato alteram a dinâmica doméstica de forma significativa. Famílias que passam por esse processo relatam que a comunicação clara sobre as exigências da carreira, ainda durante o processo seletivo, facilita muito a adaptação. Com o tempo, a maioria encontra um equilíbrio entre os compromissos institucionais e a vida pessoal.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Mb Internacional LTDA não é escritório de advocacia (CNPJ
  // 62.466.825/0001-53, CNAE 82.11-3-00). ZapZapPage renderiza em modo neutro.
};

const QUARTEL_CONCURSEIRO: RawConfig = {
  hostname: 'quarteldoconcurseiro.com',
  brand: 'Quartel do Concurseiro',
  siteSubtitle: 'Disciplina, Mentalidade e Hábitos de Alta Performance para Passar na PM',
  razaoSocial: 'Ricardo Pereira Sanches Tecnologia da Informacao LTDA',
  cnpj: '62446657000134',
  cnpjFormatted: '62.446.657/0001-34',
  endereco: 'Rua Mauricio de Oliveira, 170, Bloco C Apt 127',
  bairro: 'Vila Augusta',
  cidade: 'Guarulhos',
  estado: 'SP',
  cep: '07040-110',
  enderecoCompleto: 'Rua Mauricio de Oliveira, 170, Bloco C Apt 127 · Vila Augusta · Guarulhos/SP · CEP 07040-110',
  canonicalUrl: 'https://www.quarteldoconcurseiro.com/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre disciplina e estratégias de preparação para concursos públicos e não constituem garantia de aprovação ou orientação sobre casos individuais. Este site é independente e não possui vínculo com qualquer corporação policial, banca organizadora ou órgão público.',
  email: 'meucnpj@contabilizei.com.br',
  telefone: '(41) 99788-0145',
  cnae: '62.04-0-00 - Consultoria em tecnologia da informação',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '28/08/2025',
  capitalSocial: 'R$ 1.000,00',
  breadcrumbLabel: 'Disciplina e Mentalidade para Concursos da PM',
  h1Override: 'Como transformar disciplina em aprovação — a mentalidade que separa quem passa de quem desiste',
  leadOverride: 'Reunimos conteúdo informativo sobre os hábitos, a rotina e a resiliência que fazem a diferença em uma preparação para concursos da Polícia Militar — desde montar uma rotina inflexível até lidar com reprovações sem perder o rumo. Para informações oficiais sobre editais e processos seletivos, consulte sempre a PM do seu estado.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Como a disciplina militar pode ser aplicada à rotina de estudos para concursos?',
      a: 'O método militar de treinamento tem muito a ensinar ao concurseiro: horários fixos e inegociáveis, metas diárias mensuráveis, rituais de início e encerramento de sessão de estudo e tolerância zero para justificativas. Estabelecer uma rotina com acordar no mesmo horário, blocos de foco definidos e pausas planejadas reduz a dependência de motivação — que oscila — e constrói o hábito que sustenta a preparação a longo prazo.',
    },
    {
      q: 'Como manter a motivação durante uma preparação longa e desgastante para a PM?',
      a: 'Motivação é combustível que acaba; disciplina é o motor que mantém o veículo em movimento. O segredo é transformar o estudo em rotina automática, independente do estado emocional do dia. Além disso, dividir a meta final em marcos menores (dominar uma disciplina, atingir um percentual em simulado) cria pequenas vitórias que realimentam o engajamento. Registrar o progresso diário — mesmo que mínimo — é uma das ferramentas mais eficazes para sustentar a consistência.',
    },
    {
      q: 'Quais hábitos diários fazem mais diferença na produtividade de quem estuda para concursos?',
      a: 'Entre os hábitos com maior impacto estão: estudar sempre nos mesmos horários (o cérebro entra em modo de foco mais rápido quando há previsibilidade), revisar o conteúdo do dia anterior antes de avançar para novos tópicos, resolver questões todos os dias mesmo em dias de revisão teórica, e dormir bem — o sono é quando o cérebro consolida o que foi aprendido. Evitar multitarefa durante o estudo e eliminar distrações digitais nas sessões principais são práticas que ampliam o rendimento de forma expressiva.',
    },
    {
      q: 'Como lidar com reprovações e continuar a preparação sem desanimar?',
      a: 'Reprovação faz parte do processo para a maioria dos aprovados — raramente alguém passa no primeiro concurso. O ponto de virada está em transformar o resultado negativo em diagnóstico: analisar o gabarito, identificar quais disciplinas pesaram mais na eliminação e recalibrar o plano de estudos a partir daí. Candidatos que persistem tratam cada tentativa como um simulado oficial, não como uma derrota definitiva. A resiliência, nesse contexto, é construída com método — não apenas com força de vontade.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Ricardo Pereira Sanches Tecnologia da Informacao LTDA não é
  // escritório de advocacia (CNPJ 62.446.657/0001-34, CNAE 62.04-0-00).
  // ZapZapPage renderiza em modo neutro.
};

const PROJETO_PM_2026: RawConfig = {
  hostname: 'projetopm2026.click',
  brand: 'Projeto PM 2026',
  siteSubtitle: 'Planejamento Estratégico de Preparação para Concursos da PM em 2026',
  razaoSocial: 'Furquim Soccer Assessoria Esportiva LTDA',
  cnpj: '62453437000138',
  cnpjFormatted: '62.453.437/0001-38',
  endereco: 'Rua Diogo Farias, 181, Sala 1312',
  bairro: 'Centro',
  cidade: 'Guarulhos',
  estado: 'SP',
  cep: '07110-090',
  enderecoCompleto: 'Rua Diogo Farias, 181, Sala 1312 · Centro · Guarulhos/SP · CEP 07110-090',
  canonicalUrl: 'https://www.projetopm2026.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre estratégias de preparação para concursos públicos da Polícia Militar e não constituem garantia de aprovação ou orientação sobre casos individuais. Este site é independente e não possui vínculo com qualquer corporação policial, banca organizadora ou órgão público.',
  email: 'rodrigoneno24@gmail.com',
  telefone: '(11) 96342-4395',
  cnae: '74.90-1-05 - Agenciamento de profissionais para atividades esportivas, culturais e artísticas',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '28/08/2025',
  capitalSocial: 'R$ 10.000,00',
  breadcrumbLabel: 'Planejamento e Estratégia para Concursos da PM 2026',
  h1Override: 'Como montar um projeto de aprovação para o concurso da PM em 2026',
  leadOverride: 'Reunimos conteúdo informativo sobre como estruturar uma preparação estratégica para os concursos da Polícia Militar — escolha do estado-alvo, cronograma de estudos por disciplina, treinamento físico para o TAF, acompanhamento de editais publicados em 2026 e gestão de desempenho nos simulados. Para informações oficiais sobre editais, consulte o site da PM do seu estado.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Como estruturar um plano de estudos eficiente para um concurso da PM?',
      a: 'Um plano de estudos eficiente começa pelo edital: mapeie as disciplinas exigidas, o peso de cada uma na prova e a distribuição histórica de questões. Em seguida, avalie seu nível atual em cada matéria e destine mais horas às disciplinas com maior lacuna de conhecimento. Divida o conteúdo em ciclos semanais com revisões periódicas, intercalando teoria, resolução de questões e simulados cronometrados para simular as condições reais da prova.',
    },
    {
      q: 'Quantos meses de preparação são necessários para passar em um concurso da PM?',
      a: 'O tempo ideal varia conforme o nível de conhecimento inicial do candidato, a concorrência do edital e o quantitativo de vagas. Candidatos sem base nas disciplinas jurídicas e de língua portuguesa costumam precisar de 12 a 18 meses de estudo consistente. Quem já tem domínio de parte do conteúdo pode conseguir resultados em períodos menores. O fator determinante não é a duração, mas a regularidade e a qualidade da preparação diária.',
    },
    {
      q: 'Como equilibrar a preparação intelectual e o treinamento físico para o processo seletivo da PM?',
      a: 'A dica central é tratar o TAF (Teste de Aptidão Física) com a mesma seriedade das provas teóricas: defina metas claras para cada prova física (corrida, flexões, abdominais) com base nos critérios do edital e inclua treinos específicos na rotina semanal. Alternar dias de estudos intensos com treinos aeróbicos ajuda na concentração e reduz o estresse acumulado. Comece o condicionamento físico desde o início da preparação, sem deixar para os últimos meses.',
    },
    {
      q: 'Como acompanhar editais abertos da PM e não perder prazos de inscrição?',
      a: 'A forma mais confiável é monitorar diretamente o Diário Oficial do estado de interesse e o site institucional da PM estadual, além de portais de concursos públicos que centralizam publicações de editais. Defina uma rotina semanal de consulta a essas fontes e, quando identificar um edital, leia o documento completo antes de se inscrever — verificando requisitos de idade, escolaridade, antecedentes e documentação exigida.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Furquim Soccer Assessoria Esportiva LTDA não é escritório de
  // advocacia (CNPJ 62.453.437/0001-38, CNAE 74.90-1-05). ZapZapPage renderiza
  // em modo neutro.
};

const PM_DESCOMPLICADA: RawConfig = {
  hostname: 'pmdescomplicada.click',
  brand: 'PM Descomplicada',
  siteSubtitle: 'Rotina, Benefícios e Direitos do Policial Militar sem Complicação',
  razaoSocial: 'Mulheres do Queijo Ltda.',
  cnpj: '56048934000158',
  cnpjFormatted: '56.048.934/0001-58',
  endereco: 'Rua Ernani Agricola, 15',
  bairro: 'Buritis',
  cidade: 'Belo Horizonte',
  estado: 'MG',
  cep: '30492-040',
  enderecoCompleto: 'Rua Ernani Agricola, 15 · Buritis · Belo Horizonte/MG · CEP 30492-040',
  canonicalUrl: 'https://www.pmdescomplicada.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre a rotina, benefícios e aspectos funcionais da carreira de policial militar e não constituem consultoria jurídica ou orientação sobre casos individuais. Este site é independente e não possui vínculo com qualquer corporação policial ou órgão público.',
  email: 'cestevao@escritoriodofazendeiro.com.br',
  telefone: '(38) 99161-9377',
  cnae: '70.20-4-00 - Atividades de consultoria em gestão empresarial, exceto consultoria técnica específica',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '23/07/2024',
  capitalSocial: 'R$ 20.000,00',
  breadcrumbLabel: 'Rotina, Benefícios e Direitos na Carreira Policial Militar',
  h1Override: 'Como é realmente a vida de policial militar — rotina, direitos e o que ninguém conta antes',
  leadOverride: 'Reunimos conteúdo informativo sobre os aspectos da PM que candidatos e novos integrantes mais perguntam — escala de plantão, benefícios além do salário, solicitação de férias e licenças e o que a vida no quartel realmente envolve. Para informações oficiais, consulte sempre a corporação do seu estado.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Como funciona a escala de plantão na Polícia Militar e o que esperar da rotina de trabalho?',
      a: 'A maioria das corporações estaduais adota o sistema de escala 24×72 — um turno de 24 horas de serviço seguido de 72 horas de folga — embora algumas PMs utilizem escalas de 12×36 ou modalidades específicas para determinadas funções. O policial em regime de plantão pode ser acionado durante a folga em situações de emergência ou eventos de grande porte, conforme regulamento interno da corporação.',
    },
    {
      q: 'Quais benefícios e vantagens a carreira de policial militar oferece além do salário base?',
      a: 'Além do vencimento base, o policial militar costuma ter direito a adicionais como gratificação de risco de vida, adicional noturno, auxílio-alimentação, auxílio-transporte, plano de saúde corporativo e, em muitos estados, acesso a cooperativas de crédito com condições diferenciadas. Os benefícios variam por corporação estadual e pelo posto ou graduação ocupado, sendo importante consultar o plano de cargos e salários específico da PM de interesse.',
    },
    {
      q: 'Como funciona a solicitação de férias e licenças para o policial militar em serviço ativo?',
      a: 'As férias e licenças seguem regulamentação própria de cada PM estadual, geralmente prevista no Estatuto dos Militares Estaduais. O policial tem direito a férias anuais remuneradas, licença-saúde, licença para tratar de interesses particulares e, conforme o estado, licença-prêmio por tempo de serviço. As solicitações tramitam via requerimento na unidade de lotação, sujeito à escala de necessidades operacionais e aprovação pela chefia imediata.',
    },
    {
      q: 'O que os candidatos geralmente só descobrem sobre a PM depois que já ingressaram?',
      a: 'Entre os pontos que costumam surpreender estão: a intensidade da formação no curso de recrutas, que vai muito além do preparo físico e inclui disciplina rígida, hierarquia e protocolos institucionais; a variação significativa de funções disponíveis (policiamento ostensivo, administrativo, especialidades técnicas); e a diferença entre o trabalho na capital e no interior, que impacta escala, estrutura e remuneração. Conversar com policiais militares em serviço ativo é a melhor forma de construir expectativas realistas.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Mulheres do Queijo Ltda. não é escritório de advocacia (CNPJ
  // 56.048.934/0001-58, CNAE 70.20-4-00). ZapZapPage renderiza em modo neutro.
};

const ROTA_POLICIAL: RawConfig = {
  hostname: 'rotapolicial.click',
  brand: 'Rota Policial',
  siteSubtitle: 'Procedimentos, Protocolos e Rotina Operacional do Policiamento',
  razaoSocial: 'Am Solutions Comercio e Servicos LTDA',
  cnpj: '57632967000103',
  cnpjFormatted: '57.632.967/0001-03',
  endereco: 'Setor Qnh Area Especial (Cemiterio), SN',
  bairro: 'Taguatinga Norte',
  cidade: 'Brasília',
  estado: 'DF',
  cep: '72130-730',
  enderecoCompleto: 'Setor Qnh Area Especial (Cemiterio), SN · Taguatinga Norte · Brasília/DF · CEP 72130-730',
  canonicalUrl: 'https://www.rotapolicial.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre procedimentos operacionais no policiamento e não constituem orientação jurídica ou instrução oficial de qualquer corporação. Este site é independente e não possui vínculo com nenhuma Polícia Militar estadual ou órgão público.',
  email: 'alemar.gestaoenegocios@gmail.com',
  telefone: '(61) 99699-8990',
  cnae: '47.89-0-99 - Comércio varejista de outros produtos não especificados anteriormente',
  naturezaJuridica: 'Sociedade Empresária Limitada',
  dataAbertura: '10/10/2024',
  capitalSocial: 'R$ 15.000,00',
  breadcrumbLabel: 'Rotina Operacional e Protocolos de Patrulhamento',
  h1Override: 'Como funciona o serviço operacional de patrulhamento na Polícia Militar',
  leadOverride: 'Reunimos conteúdo informativo sobre os principais procedimentos da rotina operacional policial — abordagens veiculares e pessoais, comunicação via rádio, elaboração de Boletim de Ocorrência e critérios legais para o uso proporcional da força. Consulte sempre os regulamentos e a gestão da sua corporação para orientações aplicáveis ao seu caso.',
  ctaHeroText: 'Tirar dúvidas pelo WhatsApp',
  faq: [
    {
      q: 'Qual é o procedimento correto para abordar um veículo durante o patrulhamento?',
      a: 'A abordagem veicular segue uma sequência tática estabelecida: posicionamento estratégico da viatura, acionamento de sinais luminosos, comunicação clara pelo alto-falante e manutenção de distância de segurança até a imobilização do veículo. O policial deve identificar-se, informar o motivo da abordagem e atuar dentro dos limites legais, preservando a integridade dos ocupantes e a segurança da guarnição.',
    },
    {
      q: 'Como funciona a comunicação via rádio durante o serviço de patrulha?',
      a: 'A comunicação operacional é feita por rádio transmissor, seguindo protocolos padronizados de cada corporação — com códigos numéricos que indicam ocorrências, deslocamentos, solicitação de apoio e encerramento de atendimento. A clareza e a objetividade nas transmissões são fundamentais para agilizar o acionamento de reforços e evitar falhas de coordenação durante ocorrências em andamento.',
    },
    {
      q: 'O que deve constar em um Boletim de Ocorrência elaborado pelo policial?',
      a: 'O Boletim de Ocorrência (BO) deve registrar de forma objetiva: data, horário e local do fato; qualificação completa das partes envolvidas; descrição circunstanciada dos acontecimentos na ordem em que ocorreram; providências adotadas pela guarnição; relação de evidências coletadas; e identificação dos policiais envolvidos. A precisão e a fidelidade ao que foi efetivamente observado são essenciais para a validade do documento em inquérito e eventual ação judicial.',
    },
    {
      q: 'Quais são os critérios legais para o uso proporcional da força durante a atividade policial?',
      a: 'O uso da força deve obedecer aos princípios de legalidade, necessidade e proporcionalidade — o policial emprega o nível de força estritamente indispensável para cessar a ameaça, escalando ou desescalando conforme a situação evolui. A Portaria Interministerial nº 4.226/2010 e os manuais corporativos de cada PM estadual definem os níveis de resposta, desde a presença e verbalização até o uso de força letal em situações de risco iminente à vida.',
    },
  ],
  // oabNumero, oabSeccional, advogadoNome, advogadoAtuacao: intencionalmente
  // ausentes — Am Solutions Comercio e Servicos LTDA não é escritório de advocacia
  // (CNPJ 57.632.967/0001-03, CNAE 47.89-0-99). ZapZapPage renderiza em modo neutro.
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
  'pmdomeuestado.click': PM_DO_MEU_ESTADO,
  'www.pmdomeuestado.click': PM_DO_MEU_ESTADO,
  'rotapolicial.click': ROTA_POLICIAL,
  'www.rotapolicial.click': ROTA_POLICIAL,
  'pmdescomplicada.click': PM_DESCOMPLICADA,
  'www.pmdescomplicada.click': PM_DESCOMPLICADA,
  'projetopm2026.click': PROJETO_PM_2026,
  'www.projetopm2026.click': PROJETO_PM_2026,
  'quarteldoconcurseiro.com': QUARTEL_CONCURSEIRO,
  'www.quarteldoconcurseiro.com': QUARTEL_CONCURSEIRO,
  'futurosoldado.click': FUTURO_SOLDADO,
  'www.futurosoldado.click': FUTURO_SOLDADO,
  'editalmilitar.click': EDITAL_MILITAR,
  'www.editalmilitar.click': EDITAL_MILITAR,
  'cronogramapm.click': CRONOGRAMA_PM,
  'www.cronogramapm.click': CRONOGRAMA_PM,
  'panoramapm.click': PANORAMA_PM,
  'www.panoramapm.click': PANORAMA_PM,
  'proximoedital.click': PROXIMO_EDITAL,
  'www.proximoedital.click': PROXIMO_EDITAL,
  'minhafarda.click': MINHA_FARDA,
  'www.minhafarda.click': MINHA_FARDA,
  'missaofarda.click': MISSAO_FARDA,
  'www.missaofarda.click': MISSAO_FARDA,
  'guiadopm.click': GUIA_DO_PM,
  'www.guiadopm.click': GUIA_DO_PM,
  'foconafarda.click': FOCO_NA_FARDA,
  'www.foconafarda.click': FOCO_NA_FARDA,
  'trilhapm.click': TRILHA_PM,
  'www.trilhapm.click': TRILHA_PM,
  'honramilitar.click': HONRA_MILITAR,
  'www.honramilitar.click': HONRA_MILITAR,
  'sonhodefarda.click': SONHO_DE_FARDA,
  'www.sonhodefarda.click': SONHO_DE_FARDA,
  'patentemilitar.click': PATENTE_MILITAR,
  'www.patentemilitar.click': PATENTE_MILITAR,
  'primeirafarda.click': PRIMEIRA_FARDA,
  'www.primeirafarda.click': PRIMEIRA_FARDA,
  'modopolicial.click': MODO_POLICIAL,
  'www.modopolicial.click': MODO_POLICIAL,
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
