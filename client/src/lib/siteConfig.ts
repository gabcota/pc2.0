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

const EDITAL_PREVIDENCIARIO: RawConfig = {
  hostname: 'editalprevidenciario.click',
  brand: 'Edital Previdenciário',
  siteSubtitle: 'Advocacia Especializada em Concursos Públicos · INSS 2026',
  razaoSocial: 'Helinton Antunes Sociedade Individual de Advocacia',
  cnpj: '61683490000162',
  cnpjFormatted: '61.683.490/0001-62',
  endereco: 'Rua Fernando Silva, 190, Andar 3 Sala 302',
  bairro: 'Jardim Astro',
  cidade: 'Sorocaba',
  estado: 'SP',
  cep: '18017-158',
  enderecoCompleto: 'Rua Fernando Silva, 190, Andar 3 Sala 302 · Jardim Astro · Sorocaba/SP · CEP 18017-158',
  canonicalUrl: 'https://www.editalprevidenciario.click/',
  disclaimer: 'As informações veiculadas neste site têm caráter exclusivamente informativo sobre o Concurso Público INSS 2026 e não constituem aconselhamento jurídico individual. Este site não possui vínculo com o INSS, com o Cebraspe/Cespe nem com qualquer órgão público.',
  email: 'contato@editalprevidenciario.click',
  telefone: '(15) 3232-0000',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: '232-1 - Sociedade Unipessoal de Advocacia',
  dataAbertura: '08/07/2025',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Helinton Antunes dos Santos',
  advogadoAtuacao: 'Direito Previdenciário e Concursos Públicos',
  // oabNumero: intentionally left unset — no OAB registration number was provided.
  // ZapZapPage only shows office/attorney claims (isVerifiedLawFirm) when BOTH
  // advogadoNome and oabNumero are set, to avoid misleading legal advertising.
  // capitalSocial: intentionally left unset — not present on the CNPJ card provided;
  // do not fabricate. Add it if/when the user supplies the real value.
};

const TRILHA_PREVIDENCIARIA: RawConfig = {
  hostname: 'trilhaprevidenciaria.click',
  brand: 'Trilha Previdenciária',
  siteSubtitle: 'Orientação Jurídica ao Candidato · Concurso INSS 2026',
  razaoSocial: 'Ingrid Baptista Sociedade Individual de Advocacia',
  cnpj: '61635715000105',
  cnpjFormatted: '61.635.715/0001-05',
  endereco: 'Alameda Das Miltonias, 244',
  bairro: 'Jardim Simus',
  cidade: 'Sorocaba',
  estado: 'SP',
  cep: '18055-143',
  enderecoCompleto: 'Alameda Das Miltonias, 244 · Jardim Simus · Sorocaba/SP · CEP 18055-143',
  canonicalUrl: 'https://www.trilhaprevidenciaria.click/',
  disclaimer: 'As informações deste site têm caráter exclusivamente informativo sobre o Concurso Público INSS 2026 e não configuram aconselhamento jurídico individual. Este site é independente, sem qualquer vínculo com o INSS, o Governo Federal, o Cebraspe/Cespe ou outro órgão público.',
  email: 'ingrid.ibds@gmail.com',
  telefone: '(15) 98116-0466',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: '232-1 - Sociedade Unipessoal de Advocacia',
  dataAbertura: '07/07/2025',
  capitalSocial: 'R$ 1.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Ingrid Baptista dos Santos',
  advogadoAtuacao: 'Direito Previdenciário e Concursos Públicos Federais',
  breadcrumbLabel: 'Trilha do Candidato · INSS 2026',
  h1Override: 'Orientação jurídica passo a passo para o candidato do Concurso Público INSS 2026',
  leadOverride: 'Esta página reúne orientação jurídica sobre cada etapa do Concurso Público INSS 2026 — da inscrição à posse: isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // oabNumero: intentionally left unset — no OAB registration number was provided.
  // ZapZapPage only shows office/attorney claims (isVerifiedLawFirm) when BOTH
  // advogadoNome and oabNumero are set, to avoid misleading legal advertising.
};

const ASSESSORIA_PREVIDENCIA: RawConfig = {
  hostname: 'assesoriaprevidencia.click',
  brand: 'Assessoria Previdenciária',
  siteSubtitle: 'Assessoria Jurídica Completa em Concursos Públicos · INSS 2026',
  razaoSocial: 'W. Salha Sociedade de Advogados',
  cnpj: '61635763000101',
  cnpjFormatted: '61.635.763/0001-01',
  endereco: 'Rua Sete de Setembro, 287, Sala 157',
  bairro: 'Centro',
  cidade: 'Sorocaba',
  estado: 'SP',
  cep: '18035-001',
  enderecoCompleto: 'Rua Sete de Setembro, 287, Sala 157 · Centro · Sorocaba/SP · CEP 18035-001',
  canonicalUrl: 'https://www.assesoriaprevidencia.click/',
  disclaimer: 'O conteúdo deste site tem finalidade exclusivamente informativa sobre o Concurso Público INSS 2026 e não substitui aconselhamento jurídico individual. Este site é independente e não possui vínculo com o INSS, o Governo Federal, o Cebraspe/Cespe ou qualquer órgão público.',
  email: 'jnt.contato@gmail.com',
  telefone: '(11) 3438-8866',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Simples Pura',
  dataAbertura: '07/07/2025',
  capitalSocial: 'R$ 1.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Walid Mohamad Salha',
  advogadoAtuacao: 'Direito Previdenciário e Concursos Públicos',
  breadcrumbLabel: 'Assessoria ao Candidato · INSS 2026',
  h1Override: 'Assessoria jurídica completa para o candidato do Concurso Público INSS 2026',
  leadOverride: 'Prestamos assessoria jurídica a candidatos do Concurso Público INSS 2026 em todas as fases — da inscrição à nomeação: isenção de taxa, recursos de gabarito, cotas e investigação social. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Solicitar assessoria',
  // oabNumero: intentionally left unset — no OAB registration number was provided.
  // ZapZapPage only shows office/attorney claims (isVerifiedLawFirm) when BOTH
  // advogadoNome and oabNumero are set, to avoid misleading legal advertising.
};

const CARREIRA_PREVIDENCIARIA: RawConfig = {
  hostname: 'carreiraprevidenciaria.click',
  brand: 'Carreira Previdenciária',
  siteSubtitle: 'Apoio Jurídico à Carreira do Candidato · Concurso INSS 2026',
  razaoSocial: 'Vinicius Caruso Zavarezzi - Sociedade Individual de Advocacia',
  cnpj: '61711771000181',
  cnpjFormatted: '61.711.771/0001-81',
  endereco: 'Rua Antonio Soares, 217, Sala de Atendimento',
  bairro: 'Jardim Paulistano',
  cidade: 'Sorocaba',
  estado: 'SP',
  cep: '18040-570',
  enderecoCompleto: 'Rua Antonio Soares, 217, Sala de Atendimento · Jardim Paulistano · Sorocaba/SP · CEP 18040-570',
  canonicalUrl: 'https://www.carreiraprevidenciaria.click/',
  disclaimer: 'O conteúdo deste site tem finalidade exclusivamente informativa sobre o Concurso Público INSS 2026 e não substitui aconselhamento jurídico individual. Este site é independente e não possui vínculo com o INSS, o Governo Federal, o Cebraspe/Cespe ou qualquer órgão público.',
  email: 'vncs@hotmail.com.br',
  telefone: '(15) 99727-7179',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: '232-1 - Sociedade Unipessoal de Advocacia',
  dataAbertura: '11/07/2025',
  capitalSocial: 'R$ 1.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Vinicius Caruso Zavarezzi',
  advogadoAtuacao: 'Direito Previdenciário e Concursos Públicos',
  breadcrumbLabel: 'Carreira do Candidato · INSS 2026',
  h1Override: 'Apoio jurídico à carreira do candidato no Concurso Público INSS 2026',
  leadOverride: 'Acompanhamos a trajetória do candidato ao Concurso Público INSS 2026 em cada etapa até a posse: isenção de taxa, recursos de gabarito, cotas e investigação social. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Conversar com um advogado',
  // oabNumero: intentionally left unset — no OAB registration number was provided.
  // ZapZapPage only shows office/attorney claims (isVerifiedLawFirm) when BOTH
  // advogadoNome and oabNumero are set, to avoid misleading legal advertising.
};

const CURSO_PREVIDENCIARIO: RawConfig = {
  hostname: 'cursoprevidenciario.click',
  brand: 'Curso Previdenciário',
  siteSubtitle: 'Preparação Jurídica do Candidato · Concurso INSS 2026',
  razaoSocial: 'Marcelo Zanchetta Sociedade Individual de Advocacia',
  cnpj: '62089359000134',
  cnpjFormatted: '62.089.359/0001-34',
  endereco: 'Rua Pais Leme, 215, Conj 1713',
  bairro: 'Pinheiros',
  cidade: 'São Paulo',
  estado: 'SP',
  cep: '05424-150',
  enderecoCompleto: 'Rua Pais Leme, 215, Conj 1713 · Pinheiros · São Paulo/SP · CEP 05424-150',
  canonicalUrl: 'https://www.cursoprevidenciario.click/',
  disclaimer: 'O conteúdo deste site tem finalidade exclusivamente informativa sobre o Concurso Público INSS 2026 e não substitui aconselhamento jurídico individual. Este site é independente e não possui vínculo com o INSS, o Governo Federal, o Cebraspe/Cespe ou qualquer órgão público.',
  email: 'zandpm@gmail.com',
  telefone: '(11) 98820-3463',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: '232-1 - Sociedade Unipessoal de Advocacia',
  dataAbertura: '05/08/2025',
  capitalSocial: 'R$ 1.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Marcelo Zanchetta',
  advogadoAtuacao: 'Direito Previdenciário e Concursos Públicos',
  breadcrumbLabel: 'Preparação do Candidato · INSS 2026',
  h1Override: 'Preparação jurídica do candidato para o Concurso Público INSS 2026',
  leadOverride: 'Reunimos conteúdo jurídico para preparar o candidato ao Concurso Público INSS 2026 em cada etapa: isenção de taxa, recursos de gabarito, cotas e investigação social. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // oabNumero: intentionally left unset — no OAB registration number was provided.
  // ZapZapPage only shows office/attorney claims (isVerifiedLawFirm) when BOTH
  // advogadoNome and oabNumero are set, to avoid misleading legal advertising.
};

const CANDIDATO_INFORMADO: RawConfig = {
  hostname: 'candidatoinformado.click',
  brand: 'Candidato Informado',
  siteSubtitle: 'Informação Jurídica Clara para o Candidato · Concurso INSS 2026',
  razaoSocial: 'Fabio Biancalana Sociedade Individual de Advocacia',
  cnpj: '61818101000169',
  cnpjFormatted: '61.818.101/0001-69',
  endereco: 'Rua Martins de Oliveira, 420',
  bairro: 'Vila Haro',
  cidade: 'Sorocaba',
  estado: 'SP',
  cep: '18015-245',
  enderecoCompleto: 'Rua Martins de Oliveira, 420 · Vila Haro · Sorocaba/SP · CEP 18015-245',
  canonicalUrl: 'https://www.candidatoinformado.click/',
  disclaimer: 'O conteúdo deste site tem finalidade exclusivamente informativa sobre o Concurso Público INSS 2026 e não substitui aconselhamento jurídico individual. Este site é independente e não possui vínculo com o INSS, o Governo Federal, o Cebraspe/Cespe ou qualquer órgão público.',
  email: 'fbiancalana@adv.oabsp.org.br',
  telefone: '(15) 3237-6840',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: '232-1 - Sociedade Unipessoal de Advocacia',
  dataAbertura: '17/07/2025',
  capitalSocial: 'R$ 1.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Fabio Biancalana',
  advogadoAtuacao: 'Direito Previdenciário e Concursos Públicos',
  breadcrumbLabel: 'Informações ao Candidato · INSS 2026',
  h1Override: 'Informações jurídicas claras para o candidato do Concurso Público INSS 2026',
  leadOverride: 'Reunimos informações jurídicas claras e organizadas para o candidato do Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e investigação social. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // oabNumero: intentionally left unset — no OAB registration number was provided.
  // ZapZapPage only shows office/attorney claims (isVerifiedLawFirm) when BOTH
  // advogadoNome and oabNumero are set, to avoid misleading legal advertising.
};

const DIREITOS_DO_CANDIDATO: RawConfig = {
  hostname: 'direitosdocandidato.click',
  brand: 'Direitos do Candidato',
  siteSubtitle: 'Seus Direitos no Concurso Público · Concurso INSS 2026',
  razaoSocial: 'Rezani e Vitorino Advogados Associados',
  cnpj: '61818172000161',
  cnpjFormatted: '61.818.172/0001-61',
  endereco: 'Viela João Emidio Correa de Moraes, 181',
  bairro: 'Jardim Gonçalves',
  cidade: 'Sorocaba',
  estado: 'SP',
  cep: '18016-519',
  enderecoCompleto: 'Viela João Emidio Correa de Moraes, 181 · Jardim Gonçalves · Sorocaba/SP · CEP 18016-519',
  canonicalUrl: 'https://www.direitosdocandidato.click/',
  disclaimer: 'O conteúdo deste site tem finalidade exclusivamente informativa sobre o Concurso Público INSS 2026 e não substitui aconselhamento jurídico individual. Este site é independente e não possui vínculo com o INSS, o Governo Federal, o Cebraspe/Cespe ou qualquer órgão público.',
  email: 'contato@rezanivitorino.com.br',
  telefone: '(15) 3318-2272',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Simples Pura',
  dataAbertura: '18/07/2025',
  capitalSocial: 'R$ 1.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Bianca Rezani e Diego Rafael Vitorino',
  advogadoAtuacao: 'Direito Previdenciário e Concursos Públicos',
  breadcrumbLabel: 'Direitos do Candidato · INSS 2026',
  h1Override: 'Conheça os seus direitos como candidato no Concurso Público INSS 2026',
  leadOverride: 'Reunimos informações jurídicas sobre os direitos do candidato ao Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e investigação social. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // naturezaJuridica kept as plain text (no code) — "Sociedade Simples Pura" has
  // no verified numeric code on hand, same rationale as assesoriaprevidencia.click.
  // oabNumero: intentionally left unset — no OAB registration number was provided.
  // ZapZapPage only shows office/attorney claims (isVerifiedLawFirm) when BOTH
  // advogadoNome and oabNumero are set, to avoid misleading legal advertising.
};

const MEU_DIREITO_NO_CONCURSO: RawConfig = {
  hostname: 'meudireitonoconcurso.click',
  brand: 'Meu Direito no Concurso',
  siteSubtitle: 'Orientação Jurídica Individual ao Candidato · Concurso INSS 2026',
  razaoSocial: 'Kizzy Mendes Sociedade Individual de Advocacia',
  cnpj: '61922942000111',
  cnpjFormatted: '61.922.942/0001-11',
  endereco: 'Avenida Itavuvu, 8300, Apt 23 Bloco 7',
  bairro: 'Jardim Santa Cecília',
  cidade: 'Sorocaba',
  estado: 'SP',
  cep: '18078-005',
  enderecoCompleto: 'Avenida Itavuvu, 8300, Apt 23 Bloco 7 · Jardim Santa Cecília · Sorocaba/SP · CEP 18078-005',
  canonicalUrl: 'https://www.meudireitonoconcurso.click/',
  disclaimer: 'O conteúdo deste site tem finalidade exclusivamente informativa sobre o Concurso Público INSS 2026 e não substitui aconselhamento jurídico individual. Este site é independente e não possui vínculo com o INSS, o Governo Federal, o Cebraspe/Cespe ou qualquer órgão público.',
  email: 'advogadakizzymendes@gmail.com',
  telefone: '(15) 99698-8409',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: '232-1 - Sociedade Unipessoal de Advocacia',
  dataAbertura: '25/07/2025',
  capitalSocial: 'R$ 1.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Kizzy Mendes Pereira Bueno',
  advogadoAtuacao: 'Direito Previdenciário e Concursos Públicos',
  breadcrumbLabel: 'Meu Direito no Concurso · INSS 2026',
  h1Override: 'Entenda qual é o seu direito individual no Concurso Público INSS 2026',
  leadOverride: 'Explicamos, de forma individual e personalizada, quais são os seus direitos como candidato no Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e investigação social. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // oabNumero: intentionally left unset — no OAB registration number was provided.
  // ZapZapPage only shows office/attorney claims (isVerifiedLawFirm) when BOTH
  // advogadoNome and oabNumero are set, to avoid misleading legal advertising.
};

const GUIA_DO_CANDIDATO: RawConfig = {
  hostname: 'guiadocandidato.click',
  brand: 'Guia do Candidato',
  siteSubtitle: 'Guia Jurídico Completo do Candidato · Concurso INSS 2026',
  razaoSocial: 'Alexandre Rodrigues Sociedade Individual de Advocacia',
  cnpj: '62089364000147',
  cnpjFormatted: '62.089.364/0001-47',
  endereco: 'Rua Serra da Grama, 56',
  bairro: 'Ipiranga',
  cidade: 'São Paulo',
  estado: 'SP',
  cep: '04217-030',
  enderecoCompleto: 'Rua Serra da Grama, 56 · Ipiranga · São Paulo/SP · CEP 04217-030',
  canonicalUrl: 'https://www.guiadocandidato.click/',
  disclaimer: 'O conteúdo deste site tem finalidade exclusivamente informativa sobre o Concurso Público INSS 2026 e não substitui aconselhamento jurídico individual. Este site é independente e não possui vínculo com o INSS, o Governo Federal, o Cebraspe/Cespe ou qualquer órgão público.',
  email: 'contato@contabiljc.com.br',
  telefone: '(11) 99853-1502',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: '232-1 - Sociedade Unipessoal de Advocacia',
  dataAbertura: '05/08/2025',
  capitalSocial: 'R$ 1.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Alexandre Cesar Alves Rodrigues',
  advogadoAtuacao: 'Direito Previdenciário e Concursos Públicos',
  breadcrumbLabel: 'Guia do Candidato · INSS 2026',
  h1Override: 'Guia jurídico completo do candidato para o Concurso Público INSS 2026',
  leadOverride: 'Reunimos um guia jurídico completo para o candidato ao Concurso Público INSS 2026, cobrindo isenção de taxa, recursos de gabarito, cotas e investigação social. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // oabNumero: intentionally left unset — no OAB registration number was provided.
  // ZapZapPage only shows office/attorney claims (isVerifiedLawFirm) when BOTH
  // advogadoNome and oabNumero are set, to avoid misleading legal advertising.
};

const ASSESSORIA_CONCURSOS: RawConfig = {
  hostname: 'assessoriaconcursos.click',
  brand: 'Assessoria Concursos',
  siteSubtitle: 'Assessoria Jurídica em Concursos Públicos · Concurso INSS 2026',
  razaoSocial: 'Campos e Neves Sociedade de Advogados',
  cnpj: '62089378000160',
  cnpjFormatted: '62.089.378/0001-60',
  endereco: 'Avenida Engenheiro Carlos Reinaldo Mendes, 3200, Sala 907',
  bairro: 'Além Ponte',
  cidade: 'Sorocaba',
  estado: 'SP',
  cep: '18013-280',
  enderecoCompleto: 'Avenida Engenheiro Carlos Reinaldo Mendes, 3200, Sala 907 · Além Ponte · Sorocaba/SP · CEP 18013-280',
  canonicalUrl: 'https://www.assessoriaconcursos.click/',
  disclaimer: 'O conteúdo deste site tem finalidade exclusivamente informativa sobre o Concurso Público INSS 2026 e não substitui aconselhamento jurídico individual. Este site é independente e não possui vínculo com o INSS, o Governo Federal, o Cebraspe/Cespe ou qualquer órgão público.',
  email: 'osmil.adv@terra.com.br',
  telefone: '(11) 99722-5714',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Simples Pura',
  dataAbertura: '05/08/2025',
  capitalSocial: 'R$ 10.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Osmil de Oliveira Campos e Marcos Antonio das Neves Filho',
  advogadoAtuacao: 'Direito Previdenciário e Concursos Públicos',
  breadcrumbLabel: 'Assessoria em Concursos · INSS 2026',
  h1Override: 'Assessoria jurídica especializada em concursos públicos para o Concurso INSS 2026',
  leadOverride: 'Prestamos assessoria jurídica ao candidato do Concurso Público INSS 2026 em cada etapa: isenção de taxa, recursos de gabarito, cotas e investigação social. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // naturezaJuridica kept as plain text (no code) — "Sociedade Simples Pura" has
  // no verified numeric code on hand, same rationale as assesoriaprevidencia.click.
  // oabNumero: intentionally left unset — no OAB registration number was provided.
  // ZapZapPage only shows office/attorney claims (isVerifiedLawFirm) when BOTH
  // advogadoNome and oabNumero are set, to avoid misleading legal advertising.
};

const JURIDICO_CONCURSOS: RawConfig = {
  hostname: 'juridicoconcursos.click',
  brand: 'Jurídico Concursos',
  siteSubtitle: 'Suporte Jurídico Especializado em Concursos · Concurso INSS 2026',
  razaoSocial: 'Marcon & Guilherme Advocacia',
  cnpj: '62089341000132',
  cnpjFormatted: '62.089.341/0001-32',
  endereco: 'Avenida Rudolf Dafferner, 400, Bloco 1 Andar 2 Sala 316',
  bairro: 'Boa Vista',
  cidade: 'Sorocaba',
  estado: 'SP',
  cep: '18085-005',
  enderecoCompleto: 'Avenida Rudolf Dafferner, 400, Bloco 1 Andar 2 Sala 316 · Boa Vista · Sorocaba/SP · CEP 18085-005',
  canonicalUrl: 'https://www.juridicoconcursos.click/',
  disclaimer: 'O conteúdo deste site tem finalidade exclusivamente informativa sobre o Concurso Público INSS 2026 e não substitui aconselhamento jurídico individual. Este site é independente e não possui vínculo com o INSS, o Governo Federal, o Cebraspe/Cespe ou qualquer órgão público.',
  email: 'contabilidade@alaminoscontabilidade.com.br',
  telefone: '(15) 3211-2444',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Simples Pura',
  dataAbertura: '05/08/2025',
  capitalSocial: 'R$ 20.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Fabiana Guilherme Machado de Oliveira e Thaiane Renosto Marcon',
  advogadoAtuacao: 'Direito Previdenciário e Concursos Públicos',
  breadcrumbLabel: 'Suporte Jurídico em Concursos · INSS 2026',
  h1Override: 'Suporte jurídico especializado em concursos públicos para o Concurso INSS 2026',
  leadOverride: 'Oferecemos suporte jurídico especializado ao candidato do Concurso Público INSS 2026 em cada etapa: isenção de taxa, recursos de gabarito, cotas e investigação social. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // naturezaJuridica kept as plain text (no code) — "Sociedade Simples Pura" has
  // no verified numeric code on hand, same rationale as assesoriaprevidencia.click.
  // oabNumero: intentionally left unset — no OAB registration number was provided.
  // ZapZapPage only shows office/attorney claims (isVerifiedLawFirm) when BOTH
  // advogadoNome and oabNumero are set, to avoid misleading legal advertising.
};

const CONSULTORIA_EDITAIS: RawConfig = {
  hostname: 'consultoriaeditais.click',
  brand: 'Consultoria Editais',
  siteSubtitle: 'Consultoria Jurídica sobre o Edital · Concurso INSS 2026',
  razaoSocial: 'Paulo Roberto Garcia do Amaral Sociedade Individual de Advocacia',
  cnpj: '62129490000188',
  cnpjFormatted: '62.129.490/0001-88',
  endereco: 'Rua Julio de Mesquita, 95',
  bairro: 'Brigadeiro Tobias',
  cidade: 'Sorocaba',
  estado: 'SP',
  cep: '18108-150',
  enderecoCompleto: 'Rua Julio de Mesquita, 95 · Brigadeiro Tobias · Sorocaba/SP · CEP 18108-150',
  canonicalUrl: 'https://www.consultoriaeditais.click/',
  disclaimer: 'O conteúdo deste site tem finalidade exclusivamente informativa sobre o Concurso Público INSS 2026 e não substitui aconselhamento jurídico individual. Este site é independente e não possui vínculo com o INSS, o Governo Federal, o Cebraspe/Cespe ou qualquer órgão público.',
  email: 'p_amaral@terra.com.br',
  telefone: '(15) 99789-0100',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: '232-1 - Sociedade Unipessoal de Advocacia',
  dataAbertura: '07/08/2025',
  capitalSocial: 'R$ 1.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Paulo Roberto Garcia do Amaral',
  advogadoAtuacao: 'Direito Previdenciário e Concursos Públicos',
  breadcrumbLabel: 'Consultoria sobre o Edital · INSS 2026',
  h1Override: 'Consultoria jurídica sobre o edital do Concurso Público INSS 2026',
  leadOverride: 'Prestamos consultoria jurídica sobre o edital do Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e investigação social. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // oabNumero: intentionally left unset — no OAB registration number was provided.
  // ZapZapPage only shows office/attorney claims (isVerifiedLawFirm) when BOTH
  // advogadoNome and oabNumero are set, to avoid misleading legal advertising.
};

const CERTAME_INFO: RawConfig = {
  hostname: 'certameinfo.click',
  brand: 'Certame Info',
  siteSubtitle: 'Informações Jurídicas sobre o Certame · Concurso INSS 2026',
  razaoSocial: 'Queiroz Faria Sociedade de Advogados',
  cnpj: '66085545000156',
  cnpjFormatted: '66.085.545/0001-56',
  endereco: 'Avenida Professora Izoraida Marques Peres, 256, Sala 54 Andar 5',
  bairro: 'Parque Campolim',
  cidade: 'Sorocaba',
  estado: 'SP',
  cep: '18048-110',
  enderecoCompleto: 'Avenida Professora Izoraida Marques Peres, 256, Sala 54 Andar 5 · Parque Campolim · Sorocaba/SP · CEP 18048-110',
  canonicalUrl: 'https://www.certameinfo.click/',
  disclaimer: 'O conteúdo deste site tem finalidade exclusivamente informativa sobre o Concurso Público INSS 2026 e não substitui aconselhamento jurídico individual. Este site é independente e não possui vínculo com o INSS, o Governo Federal, o Cebraspe/Cespe ou qualquer órgão público.',
  email: 'thsfaria@adv.oabsp.org.br',
  telefone: '(15) 3233-1496',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Simples Pura',
  dataAbertura: '18/11/2013',
  capitalSocial: 'R$ 15.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Evanildo Queiroz Faria e Thiago dos Santos Faria',
  advogadoAtuacao: 'Direito Previdenciário e Concursos Públicos',
  breadcrumbLabel: 'Informações sobre o Certame · INSS 2026',
  h1Override: 'Informações jurídicas sobre o certame do Concurso Público INSS 2026',
  leadOverride: 'Reunimos informações jurídicas sobre o certame do Concurso Público INSS 2026: isenção de taxa, recursos de gabarito, cotas e investigação social. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // naturezaJuridica kept as plain text (no code) — "Sociedade Simples Pura" has
  // no verified numeric code on hand, same rationale as assesoriaprevidencia.click.
  // oabNumero: intentionally left unset — no OAB registration number was provided.
  // ZapZapPage only shows office/attorney claims (isVerifiedLawFirm) when BOTH
  // advogadoNome and oabNumero are set, to avoid misleading legal advertising.
};

const TRILHA_DO_CANDIDATO: RawConfig = {
  hostname: 'trilhadocandidato.click',
  brand: 'Trilha do Candidato',
  siteSubtitle: 'Passo a Passo Jurídico do Candidato · Concurso INSS 2026',
  razaoSocial: 'Macruz, Brandao & Carvalho Advocacia',
  cnpj: '62089356000109',
  cnpjFormatted: '62.089.356/0001-09',
  endereco: 'Praça Dr João Mendes, 42, Conj 45',
  bairro: 'Centro',
  cidade: 'São Paulo',
  estado: 'SP',
  cep: '01501-907',
  enderecoCompleto: 'Praça Dr João Mendes, 42, Conj 45 · Centro · São Paulo/SP · CEP 01501-907',
  canonicalUrl: 'https://www.trilhadocandidato.click/',
  disclaimer: 'O conteúdo deste site tem finalidade exclusivamente informativa sobre o Concurso Público INSS 2026 e não substitui aconselhamento jurídico individual. Este site é independente e não possui vínculo com o INSS, o Governo Federal, o Cebraspe/Cespe ou qualquer órgão público.',
  email: 'cecibrandaoadv@gmail.com',
  telefone: '(11) 3104-2108',
  cnae: '69.11-7-01 - Serviços advocatícios',
  naturezaJuridica: 'Sociedade Simples Pura',
  dataAbertura: '05/08/2025',
  capitalSocial: 'R$ 12.000,00',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Macruz, Brandao & Carvalho Advocacia',
  advogadoAtuacao: 'Direito Previdenciário e Concursos Públicos',
  breadcrumbLabel: 'Trilha do Candidato · INSS 2026',
  h1Override: 'A trilha jurídica passo a passo do candidato no Concurso Público INSS 2026',
  leadOverride: 'Organizamos a trilha jurídica do candidato ao Concurso Público INSS 2026 em cada etapa: isenção de taxa, recursos de gabarito, cotas e investigação social. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // naturezaJuridica kept as plain text (no code) — "Sociedade Simples Pura" has
  // no verified numeric code on hand, same rationale as assesoriaprevidencia.click.
  // advogadoNome uses the firm name (multiple sócios, no single lead attorney given).
  // telefone: first of two landline numbers provided (no WhatsApp indicated for either).
  // oabNumero: intentionally left unset — no OAB registration number was provided.
  // ZapZapPage only shows office/attorney claims (isVerifiedLawFirm) when BOTH
  // advogadoNome and oabNumero are set, to avoid misleading legal advertising.
};

const BUSSOLA_CONCURSOS: RawConfig = {
  hostname: 'bussolaconcursos.click',
  brand: 'Bússola Concursos',
  siteSubtitle: 'Orientação sobre Prazos e Próximos Passos do Candidato · Concurso INSS 2026',
  razaoSocial: 'Tatiana Junqueira Ruiz Advogados',
  cnpj: '62089408000139',
  cnpjFormatted: '62.089.408/0001-39',
  endereco: 'Rua Doutor Renato Paes de Barros, 283, Apt 22',
  bairro: 'Itaim Bibi',
  cidade: 'São Paulo',
  estado: 'SP',
  cep: '04530-000',
  enderecoCompleto: 'Rua Doutor Renato Paes de Barros, 283, Apt 22 · Itaim Bibi · São Paulo/SP · CEP 04530-000',
  canonicalUrl: 'https://www.bussolaconcursos.click/',
  disclaimer: 'O conteúdo deste site tem finalidade exclusivamente informativa sobre o Concurso Público INSS 2026 e não substitui aconselhamento jurídico individual. Este site é independente e não possui vínculo com o INSS, o Governo Federal, o Cebraspe/Cespe ou qualquer órgão público.',
  email: 'ruiz@tjradvogados.com.br',
  telefone: '(11) 96446-6242',
  cnae: '69.11-7-01 - Serviços advocatícios',
  horarioAtendimento: 'Segunda a Sexta, 08h às 17h',
  advogadoNome: 'Tatiana Junqueira Ruiz',
  advogadoAtuacao: 'Direito Previdenciário e Concursos Públicos',
  breadcrumbLabel: 'Prazos e Próximos Passos · INSS 2026',
  h1Override: 'Orientação sobre prazos e próximos passos do candidato no Concurso Público INSS 2026',
  leadOverride: 'Ajudamos o candidato do Concurso Público INSS 2026 a entender prazos e próximos passos em cada etapa — da inscrição à posse: isenção de taxa, recursos de gabarito, cotas e investigação social. Consulte um advogado habilitado para orientação específica ao seu caso.',
  ctaHeroText: 'Falar com um advogado',
  // naturezaJuridica/dataAbertura/capitalSocial: intentionally left unset — not present
  // in the data provided for this domain; do not fabricate.
  // oabNumero: intentionally left unset — no OAB registration number was provided.
  // ZapZapPage only shows office/attorney claims (isVerifiedLawFirm) when BOTH
  // advogadoNome and oabNumero are set, to avoid misleading legal advertising.
};

const CONFIGS: Record<string, RawConfig> = {
  'editalprevidenciario.click': EDITAL_PREVIDENCIARIO,
  'www.editalprevidenciario.click': EDITAL_PREVIDENCIARIO,
  'trilhaprevidenciaria.click': TRILHA_PREVIDENCIARIA,
  'www.trilhaprevidenciaria.click': TRILHA_PREVIDENCIARIA,
  'assesoriaprevidencia.click': ASSESSORIA_PREVIDENCIA,
  'www.assesoriaprevidencia.click': ASSESSORIA_PREVIDENCIA,
  'carreiraprevidenciaria.click': CARREIRA_PREVIDENCIARIA,
  'www.carreiraprevidenciaria.click': CARREIRA_PREVIDENCIARIA,
  'cursoprevidenciario.click': CURSO_PREVIDENCIARIO,
  'www.cursoprevidenciario.click': CURSO_PREVIDENCIARIO,
  'candidatoinformado.click': CANDIDATO_INFORMADO,
  'www.candidatoinformado.click': CANDIDATO_INFORMADO,
  'direitosdocandidato.click': DIREITOS_DO_CANDIDATO,
  'www.direitosdocandidato.click': DIREITOS_DO_CANDIDATO,
  'meudireitonoconcurso.click': MEU_DIREITO_NO_CONCURSO,
  'www.meudireitonoconcurso.click': MEU_DIREITO_NO_CONCURSO,
  'guiadocandidato.click': GUIA_DO_CANDIDATO,
  'www.guiadocandidato.click': GUIA_DO_CANDIDATO,
  'assessoriaconcursos.click': ASSESSORIA_CONCURSOS,
  'www.assessoriaconcursos.click': ASSESSORIA_CONCURSOS,
  'juridicoconcursos.click': JURIDICO_CONCURSOS,
  'www.juridicoconcursos.click': JURIDICO_CONCURSOS,
  'consultoriaeditais.click': CONSULTORIA_EDITAIS,
  'www.consultoriaeditais.click': CONSULTORIA_EDITAIS,
  'certameinfo.click': CERTAME_INFO,
  'www.certameinfo.click': CERTAME_INFO,
  'trilhadocandidato.click': TRILHA_DO_CANDIDATO,
  'www.trilhadocandidato.click': TRILHA_DO_CANDIDATO,
  'bussolaconcursos.click': BUSSOLA_CONCURSOS,
  'www.bussolaconcursos.click': BUSSOLA_CONCURSOS,
};

function resolveHostname(): string {
  if (typeof window === 'undefined') return '';
  return window.location.hostname.replace(/^www\./, '');
}

const DEFAULT_CONFIG: RawConfig = EDITAL_PREVIDENCIARIO;

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
