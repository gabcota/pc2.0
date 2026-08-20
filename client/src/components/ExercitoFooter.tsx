import { useLocation } from "wouter";
import { useState, useEffect, useCallback } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
const logoMpo = "https://www.gov.br/++theme++padrao_govbr/img/govbr.png";

interface DocumentModalContent {
  titulo: string;
  subtitulo: string;
  corpo: string[];
}

const documentos: Record<string, DocumentModalContent> = {
  "pec-seguranca": {
    titulo: "PEC DA SEGURANÇA PÚBLICA",
    subtitulo: "Proposta de Emenda à Constituição — Segurança Pública Nacional",
    corpo: [
      "A Proposta de Emenda a Constituicao da Seguranca Publica, aprovada em 2025, representa o maior marco legislativo na area de seguranca interna das ultimas decadas. A PEC determina o fortalecimento emergencial dos efetivos policiais em todo o territorio nacional, autorizando a abertura de concursos publicos para preenchimento de vagas nas Policias Civis, Policias Cientificas e demais orgaos integrantes do Sistema Unico de Seguranca Publica.",
      "CONSIDERAÇÕES PRELIMINARES — A PEC da Segurança Pública foi elaborada no contexto de crescente complexidade do cenário de segurança nacional e internacional. O aumento das ameaças transnacionais, o fortalecimento de organizações criminosas com atuação interestadual e internacional, e a necessidade de modernização das forças de segurança pública motivaram a propositura desta emenda constitucional.",
      "Art. 1º O art. 144 da Constituição Federal passa a vigorar com a seguinte redação: 'A segurança pública, dever do Estado, direito e responsabilidade de todos, é exercida para a preservação da ordem pública e da incolumidade das pessoas e do patrimônio, através dos seguintes órgãos, que deverão manter efetivo mínimo proporcional à população de cada unidade federativa.'",
      "Art. 2º Fica autorizada a abertura de concursos públicos emergenciais para provimento de cargos nas forças de segurança pública de todos os estados brasileiros e do Distrito Federal, com previsão de preenchimento de até 24.000 (vinte e quatro mil) vagas no prazo de 24 (vinte e quatro) meses a contar da promulgação desta Emenda.",
      "Art. 3º Os recursos necessários à implementação do disposto nesta Emenda Constitucional serão provenientes do Fundo Nacional de Segurança Pública (FNSP), instituído pela Lei nº 13.756/2018, e de dotações orçamentárias específicas consignadas no orçamento do Ministério da Justiça e Segurança Pública.",
      "Art. 4º A União prestará apoio técnico e financeiro aos Estados e ao Distrito Federal para a realização dos concursos públicos previstos nesta Emenda, inclusive mediante a disponibilização de recursos do FNSP para custeio das etapas do processo seletivo.",
      "Art. 5º Os aprovados nos concursos públicos realizados com base nesta Emenda Constitucional terão garantido o direito à formação profissional em Academias de Polícia, com duração mínima de 6 (seis) meses, durante os quais perceberão remuneração integral correspondente ao cargo para o qual foram aprovados.",
      "Parágrafo único. A remuneração inicial dos cargos providos com base nesta Emenda não poderá ser inferior a R$ 4.500,00 (quatro mil e quinhentos reais), podendo alcançar até R$ 11.000,00 (onze mil reais) no primeiro ano, considerados o salário base, gratificações e adicionais previstos na legislação de cada ente federativo.",
      "Art. 6º Compete ao Ministério da Justiça e Segurança Pública coordenar a implementação das medidas previstas nesta Emenda Constitucional, em articulação com as Secretarias de Segurança Pública estaduais e do Distrito Federal.",
      "Art. 7º O Conselho Nacional de Segurança Pública, órgão colegiado do Sistema Único de Segurança Pública, acompanhará a execução das políticas de segurança pública decorrentes desta Emenda, emitindo relatórios semestrais sobre o andamento do provimento das vagas e a efetividade das medidas implementadas.",
      "DISPOSIÇÕES TRANSITÓRIAS — Art. 8º Os concursos públicos autorizados por esta Emenda deverão ter seus editais publicados no prazo máximo de 180 (cento e oitenta) dias a contar de sua promulgação. Art. 9º Os candidatos aprovados e não convocados dentro do prazo de validade do concurso poderão ser aproveitados em vagas que surgirem em outros órgãos de segurança pública do mesmo ente federativo.",
      "JUSTIFICATIVA — O Brasil enfrenta desafios crescentes na área de segurança pública, com déficit estimado de mais de 100 mil policiais em todo o território nacional. A presente PEC visa suprir parcialmente esse déficit, garantindo o fortalecimento das instituições policiais e a melhoria da prestação de serviços de segurança à população brasileira.",
    ],
  },
  "lei-susp": {
    titulo: "LEI Nº 13.675/2018 — SISTEMA ÚNICO DE SEGURANÇA PÚBLICA",
    subtitulo: "Disciplina a organização e o funcionamento dos órgãos de segurança pública",
    corpo: [
      "A Lei nº 13.675, de 11 de junho de 2018, institui o Sistema Único de Segurança Pública (SUSP) e cria a Política Nacional de Segurança Pública e Defesa Social (PNSPDS). Esta legislação representa um avanço significativo na articulação e integração dos órgãos de segurança pública em todo o território nacional, estabelecendo princípios, diretrizes e objetivos comuns para a atuação coordenada das forças de segurança.",
      "Art. 1º Esta Lei institui o Sistema Único de Segurança Pública (Susp) e cria a Política Nacional de Segurança Pública e Defesa Social (PNSPDS), com a finalidade de preservação da ordem pública e da incolumidade das pessoas e do patrimônio, por meio de atuação conjunta, coordenada, sistêmica e integrada dos órgãos de segurança pública e defesa social da União, dos Estados, do Distrito Federal e dos Municípios.",
      "Art. 2º A segurança pública é dever do Estado e responsabilidade de todos, compreendendo a União, os Estados, o Distrito Federal e os Municípios, no âmbito das competências e atribuições legais de cada um.",
      "Art. 3º Compete ao Ministério da Justiça e Segurança Pública a coordenação do SUSP, cabendo-lhe: I — planejar, acompanhar e avaliar a implementação da PNSPDS; II — fomentar a integração e a interoperabilidade dos sistemas de informações de segurança pública; III — estabelecer metas e indicadores de avaliação de resultados.",
      "Art. 4º São integrantes operacionais do SUSP: I — polícia federal; II — polícia rodoviária federal; III — polícias civis; IV — polícias militares; V — corpos de bombeiros militares; VI — guardas municipais; VII — órgãos do sistema penitenciário; VIII — institutos oficiais de criminalística, medicina legal e identificação.",
      "Art. 5º São integrantes estratégicos e normativos do SUSP: I — Conselho Nacional de Segurança Pública e Defesa Social; II — Secretaria Nacional de Segurança Pública; III — Secretaria Nacional de Políticas Penais; IV — conselhos estaduais, distrital e municipais de segurança pública e defesa social.",
      "Art. 6º A Política Nacional de Segurança Pública e Defesa Social será implementada por estratégias que garantam integração, coordenação e cooperação federativa, interoperabilidade, liderança situacional, modernização da gestão das instituições de segurança pública, valorização e proteção dos profissionais, complementaridade e dotação de recursos humanos.",
      "Art. 7º Os integrantes do SUSP deverão utilizar sistema padronizado de registros e ocorrências policiais, sob a coordenação do Ministério da Justiça e Segurança Pública, com vistas à produção de estatísticas e indicadores de segurança pública.",
      "Art. 8º O SUSP atuará mediante: I — operações combinadas planejadas com antecedência entre os órgãos integrantes; II — compartilhamento de informações e dados de inteligência; III — uso integrado de sistemas de tecnologia da informação; IV — programas de capacitação e treinamento conjuntos.",
      "Art. 9º É instituído o Plano Nacional de Segurança Pública e Defesa Social, com duração de 10 (dez) anos, destinado a articular as ações do poder público para garantir a segurança pública e a defesa social, fixando metas, ações estratégicas e indicadores para cada período.",
    ],
  },
  "estatuto-policias": {
    titulo: "MINISTÉRIO DA JUSTIÇA E SEGURANÇA PÚBLICA — LEI Nº 13.502/2017",
    subtitulo: "Organização, competências e atuação na segurança pública nacional",
    corpo: [
      "O Ministério da Justiça e Segurança Pública (MJSP) é o órgão da administração pública federal responsável por formular e coordenar as políticas nacionais de segurança pública, criado nos termos da Lei nº 13.502, de 1º de novembro de 2017, com sede em Brasília/DF e atuação em todo o território nacional, em articulação com os Estados, o Distrito Federal e os Municípios.",
      "DISPOSIÇÕES GERAIS — Compete ao MJSP: defesa da ordem jurídica, dos direitos políticos e das garantias constitucionais; políticas sobre drogas e prevenção ao crime organizado; segurança pública; e articulação com os órgãos estaduais de segurança, por meio da Secretaria Nacional de Segurança Pública (SENASP), no âmbito do Sistema Único de Segurança Pública (SUSP), instituído pela Lei nº 13.675/2018.",
      "DO FUNDO NACIONAL DE SEGURANÇA PÚBLICA — Nos termos da Lei nº 13.756/2018, o Fundo Nacional de Segurança Pública (FNSP), gerido pelo MJSP, destina-se a apoiar projetos de segurança pública e ações de prevenção à violência dos Estados e do Distrito Federal, incluindo o custeio de concursos públicos, equipamentos, capacitação e modernização das corporações estaduais.",
      "DA ARTICULAÇÃO COM AS POLÍCIAS ESTADUAIS — O SUSP integra, sob a coordenação do MJSP, as Polícias Militares, Polícias Civis, Polícias Penais, Corpos de Bombeiros Militares e demais órgãos de segurança pública dos Estados, promovendo padrões nacionais de atuação, doutrina, formação profissional e compartilhamento de dados, sem prejuízo da autonomia administrativa de cada corporação estadual.",
      "DO INGRESSO NAS CORPORAÇÕES ESTADUAIS — O ingresso nos cargos das Polícias Militares estaduais ocorre mediante concurso público de provas ou de provas e títulos, nos termos do art. 37, II, da Constituição Federal, seguido de curso de formação profissional em Academia de Polícia Militar, conforme a legislação e o edital de cada Estado.",
      "DOS DIREITOS — São assegurados aos policiais militares, nos termos da legislação estadual aplicável e das diretrizes nacionais de segurança pública: estabilidade após o estágio probatório; remuneração irredutível; férias anuais com adicional de 1/3; licenças legais (saúde, capacitação, entre outras); 13º salário; e participação em programas de qualificação profissional continuada.",
      "DOS DEVERES — São deveres do policial militar: exercer com zelo, hierarquia e disciplina as atribuições do cargo; observar o sigilo funcional e as normas de proteção de dados dos cidadãos (LGPD — Lei nº 13.709/2018); manter conduta ética e compatível com o decoro da função policial; e atuar com urbanidade e proporcionalidade no atendimento à população.",
      "DA CAPACITAÇÃO E MODERNIZAÇÃO — O MJSP, por meio da SENASP, promove e apoia a formação continuada dos profissionais de segurança pública, o intercâmbio de boas práticas entre Estados e a modernização tecnológica das corporações estaduais, incluindo sistemas de informação, inteligência e integração de dados criminais.",
    ],
  },
  "codigo-processo-penal": {
    titulo: "CÓDIGO DE PROCESSO PENAL",
    subtitulo: "Decreto-Lei nº 3.689/1941 — Disposições sobre o inquérito policial",
    corpo: [
      "O Código de Processo Penal (CPP), instituído pelo Decreto-Lei nº 3.689, de 3 de outubro de 1941, disciplina o processo penal em todo o território brasileiro. O CPP é o principal instrumento normativo que rege a investigação criminal e o processamento das infrações penais, estabelecendo as regras para o inquérito policial, a ação penal, as provas, os recursos e a execução penal.",
      "LIVRO I — DO PROCESSO EM GERAL — TÍTULO II — DO INQUÉRITO POLICIAL — Art. 4º A polícia judiciária será exercida pelas autoridades policiais no território de suas respectivas circunscrições e terá por fim a apuração das infrações penais e da sua autoria. Parágrafo único. A competência definida neste artigo não excluirá a de autoridades administrativas, a quem por lei seja cometida a mesma função.",
      "Art. 5º Nos crimes de ação pública o inquérito policial será iniciado: I — de ofício; II — mediante requisição da autoridade judiciária ou do Ministério Público, ou a requerimento do ofendido ou de quem tiver qualidade para representá-lo. § 1º O requerimento a que se refere o nº II conterá sempre que possível: a) a narração do fato, com todas as circunstâncias; b) a individualização do indiciado ou seus sinais característicos e as razões de convicção ou de presunção de ser ele o autor da infração.",
      "Art. 6º Logo que tiver conhecimento da prática da infração penal, a autoridade policial deverá: I — dirigir-se ao local, providenciando para que não se alterem o estado e conservação das coisas, até a chegada dos peritos criminais; II — apreender os objetos que tiverem relação com o fato, após liberados pelos peritos criminais; III — colher todas as provas que servirem para o esclarecimento do fato e suas circunstâncias.",
      "Art. 7º Para verificar a possibilidade de haver a infração sido praticada de determinado modo, a autoridade policial poderá proceder à reprodução simulada dos fatos, desde que esta não contrarie a moralidade ou a ordem pública.",
      "Art. 10. O inquérito deverá terminar no prazo de 10 dias, se o indiciado tiver sido preso em flagrante, ou estiver preso preventivamente, contado o prazo, nesta hipótese, a partir do dia em que se executar a ordem de prisão, ou no prazo de 30 dias, quando estiver solto, mediante fiança ou sem ela.",
      "Art. 11. Os instrumentos do crime, bem como os objetos que interessarem à prova, acompanharão os autos do inquérito.",
      "Art. 12. O inquérito policial acompanhará a denúncia ou queixa, sempre que servir de base a uma ou outra.",
      "Art. 13. Incumbirá ainda à autoridade policial: I — fornecer às autoridades judiciárias as informações necessárias à instrução e julgamento dos processos; II — realizar as diligências requisitadas pelo juiz ou pelo Ministério Público; III — cumprir os mandados de prisão expedidos pelas autoridades judiciárias; IV — representar acerca da prisão preventiva.",
      "DAS PROVAS — Art. 155. O juiz formará sua convicção pela livre apreciação da prova produzida em contraditório judicial, não podendo fundamentar sua decisão exclusivamente nos elementos informativos colhidos na investigação, ressalvadas as provas cautelares, não repetíveis e antecipadas.",
      "Art. 158. Quando a infração deixar vestígios, será indispensável o exame de corpo de delito, direto ou indireto, não podendo supri-lo a confissão do acusado. Esta disposição reforça a importância da perícia criminal na investigação policial e no processo penal.",
    ],
  },
  "concursos-selecoes": {
    titulo: "CONCURSO PÚBLICO INSS 2026",
    subtitulo: "Edital INSS 2026 — Concurso Público Federal para provimento de vagas efetivas",
    corpo: [
      "O Concurso Público do INSS 2026 é regido pelos princípios constitucionais da legalidade, impessoalidade, moralidade, publicidade e eficiência, nos termos do art. 37 da Constituição Federal, e pela Lei nº 8.112/1990 (Regime Jurídico Único). O certame visa o provimento de 10.000 vagas efetivas para os cargos de Técnico do Seguro Social e Analista do Seguro Social.",
      "VAGAS DISPONÍVEIS — São ofertadas 10.000 vagas efetivas: 8.501 vagas para Técnico do Seguro Social (nível médio), distribuídas nos 26 estados e no Distrito Federal; e 1.499 vagas para Analista do Seguro Social (nível superior), em diversas especialidades. Adicionalmente, o programa Acelera INSS prevê cerca de 2.000 vagas emergenciais.",
      "ETAPAS DO CONCURSO — O processo seletivo compreende: I — Inscrição pelo portal gov.br; II — Prova objetiva (obrigatória para ambos os cargos); III — Prova discursiva (exclusiva para Analista do Seguro Social); IV — Avaliação de títulos (para Analista); V — Curso de formação; VI — Posse e exercício.",
      "REQUISITOS GERAIS PARA INSCRIÇÃO — Podem se inscrever brasileiros natos ou naturalizados, homens e mulheres, regularizados perante a Justiça Eleitoral. Escolaridade mínima: Ensino Médio completo para Técnico do Seguro Social; Ensino Superior completo em qualquer área para Analista do Seguro Social. Idade mínima: 18 anos na data da posse.",
      "REMUNERAÇÃO — Técnico do Seguro Social: vencimento básico de R$ 6.355,13 + auxílio-alimentação de R$ 1.192,00. Analista do Seguro Social: remuneração compatível com o nível superior, conforme tabela do Plano de Carreira dos Cargos do Seguro Social, acrescida de auxílio-alimentação e demais vantagens previstas em lei.",
      "CRONOGRAMA — As inscrições são realizadas pelo portal gov.br. O cronograma detalhado, incluindo datas de inscrição, realização das provas, divulgação de gabaritos e resultados, e convocação para posse, está disponível no edital publicado no Diário Oficial da União.",
      "RESERVA DE VAGAS — O concurso reserva percentual de vagas para: pessoas com deficiência — PcD (5%), nos termos do Decreto nº 9.508/2018; candidatos negros — PPP (20%), conforme Lei nº 12.990/2014; povos indígenas e quilombolas, conforme legislação federal aplicável.",
      "CONTEÚDO PROGRAMÁTICO — Para o cargo de Técnico do Seguro Social, a prova objetiva abrange: Direito Previdenciário (~60% do conteúdo); Legislação Previdenciária; Noções de Direito Administrativo; Noções de Direito Constitucional; e Língua Portuguesa. Para Analista, são acrescidas disciplinas específicas da área de formação.",
    ],
  },
  "boletim-ocorrencia": {
    titulo: "BOLETIM DE OCORRÊNCIA ONLINE",
    subtitulo: "Registro eletrônico de ocorrências policiais",
    corpo: [
      "O Boletim de Ocorrência (BO) é o documento oficial utilizado para o registro de fatos que configuram infrações penais ou que necessitam de providências policiais. Com a modernização dos serviços de segurança pública, diversos estados brasileiros disponibilizam a possibilidade de registro eletrônico de ocorrências, facilitando o acesso do cidadão aos serviços policiais.",
      "TIPOS DE OCORRÊNCIAS REGISTRÁVEIS ONLINE — Podem ser registradas eletronicamente, entre outras: furto simples; perda de documentos; desaparecimento de pessoa; ameaça; injúria, calúnia e difamação; dano ao patrimônio; acidente de trânsito sem vítima; perturbação do sossego. Para crimes contra a pessoa (lesão corporal, roubo, homicídio), o registro deve ser feito presencialmente na delegacia de polícia.",
      "PROCEDIMENTO — Para registrar um BO online, o cidadão deve acessar o portal da Delegacia Eletrônica do respectivo estado, preencher o formulário com os dados do fato (data, hora, local, descrição), informar seus dados pessoais e, quando possível, anexar evidências documentais. Após o envio, o BO recebe um número de protocolo para acompanhamento.",
      "VALIDADE JURÍDICA — O Boletim de Ocorrência registrado eletronicamente possui a mesma validade jurídica do registro presencial, servindo como documento comprobatório para fins de seguro, trabalhistas, processuais e administrativos.",
      "ACOMPANHAMENTO — O cidadão pode acompanhar o andamento de sua ocorrência pelo portal da Delegacia Eletrônica, mediante informação do número de protocolo e CPF. Caso sejam necessárias diligências complementares, o cidadão será notificado para comparecer à delegacia de polícia.",
    ],
  },
  "antecedentes-criminais": {
    titulo: "CONSULTA DE ANTECEDENTES CRIMINAIS",
    subtitulo: "Certidão de antecedentes criminais — Emissão e consulta",
    corpo: [
      "A Certidão de Antecedentes Criminais é o documento emitido pelos órgãos de segurança pública que atesta a existência ou inexistência de registros criminais em nome de determinada pessoa. A certidão é frequentemente exigida para fins de emprego, viagem internacional, adoção, naturalização e outros procedimentos administrativos.",
      "EMISSÃO PELOS ÓRGÃOS COMPETENTES — A certidão de antecedentes criminais pode ser emitida gratuitamente pelo portal eletrônico do Governo Federal (www.gov.br). A emissão é imediata para cidadãos sem registro criminal. Caso haja registro, o interessado deverá comparecer ao órgão competente para esclarecimentos.",
      "ABRANGÊNCIA NACIONAL — A certidão emitida tem abrangência em todo o território nacional, consultando a base de dados federal integrada ao Sistema Nacional de Informações de Segurança Pública (SINESP), garantindo validade para fins de emprego, viagem internacional, naturalização e demais procedimentos administrativos.",
      "VALIDADE — A certidão de antecedentes criminais tem validade de 90 (noventa) dias a contar da data de emissão, podendo variar conforme a legislação estadual ou a finalidade para a qual é solicitada.",
      "SIGILO — As informações constantes da certidão de antecedentes criminais são protegidas pelo sigilo, nos termos da legislação penal e da Lei Geral de Proteção de Dados (Lei nº 13.709/2018). O acesso a essas informações é restrito ao titular e às autoridades competentes.",
    ],
  },
  "denuncia-anonima": {
    titulo: "DENÚNCIA ANÔNIMA — DISQUE-DENÚNCIA",
    subtitulo: "Canais para denúncias de crimes e infrações",
    corpo: [
      "O serviço de denúncia anônima é um importante instrumento de participação cidadã na segurança pública, permitindo que qualquer pessoa comunique a prática de crimes ou infrações sem a necessidade de identificação pessoal. Os principais canais de denúncia disponíveis em âmbito nacional são:",
      "DISQUE 180 — Central de Atendimento à Mulher: canal exclusivo para denúncias de violência doméstica e familiar contra a mulher, funcionando 24 horas por dia, 7 dias por semana, com atendimento em português, inglês e espanhol. As ligações são gratuitas de qualquer telefone.",
      "DISQUE 100 — Disque Direitos Humanos: canal para denúncias de violações de direitos humanos, incluindo violência contra crianças e adolescentes, idosos, pessoas com deficiência, população LGBTQIA+ e população em situação de rua. Funcionamento 24 horas, todos os dias da semana.",
      "DISQUE-DENÚNCIA ESTADUAL — Cada estado possui seu próprio serviço de disque-denúncia, geralmente operado pela Secretaria de Segurança Pública, com número de telefone próprio. As denúncias são encaminhadas às autoridades policiais competentes para investigação.",
      "DENÚNCIA ONLINE — O Ministério da Justiça e Segurança Pública disponibiliza plataforma digital para registro de denúncias pelo portal www.gov.br/mj. As denúncias podem ser feitas de forma anônima ou identificada, conforme a preferência do denunciante.",
      "SIGILO E PROTEÇÃO — É assegurado o sigilo absoluto da identidade do denunciante, nos termos da legislação vigente. A quebra do sigilo constitui infração administrativa e penal, sujeitando o responsável às sanções previstas em lei. O denunciante não pode sofrer qualquer tipo de retaliação ou represália em razão da denúncia realizada.",
    ],
  },
  "sinesp": {
    titulo: "SINESP — SISTEMA NACIONAL DE INFORMAÇÕES DE SEGURANÇA PÚBLICA",
    subtitulo: "Plataforma integrada de dados e estatísticas de segurança pública",
    corpo: [
      "O Sistema Nacional de Informações de Segurança Pública, Prisionais, de Rastreabilidade de Armas e Munições, de Material Genético, de Digitais e de Drogas (SINESP) é a plataforma tecnológica do Ministério da Justiça e Segurança Pública responsável pela integração, coleta e análise de dados de segurança pública em todo o território nacional.",
      "SINESP CIDADÃO — Aplicativo gratuito disponível para dispositivos móveis que permite ao cidadão consultar: situação de veículos (furto/roubo); mandados de prisão em aberto; pessoas desaparecidas; e registrar ocorrências em algumas modalidades. O aplicativo está disponível para Android e iOS.",
      "SINESP INFOSEG — Sistema de informações de segurança pública que integra bases de dados de todos os estados brasileiros, permitindo consultas sobre: indivíduos com passagens policiais; veículos com restrições; armas registradas; e mandados judiciais. O acesso é restrito a profissionais de segurança pública devidamente credenciados.",
      "SINESP PPE — Módulo de Procedimentos Policiais Eletrônicos que padroniza o registro de ocorrências e inquéritos policiais em formato digital, permitindo a interoperabilidade entre as Polícias Civis de diferentes estados.",
      "SINESP ESTATÍSTICAS — Módulo de produção de estatísticas e indicadores de segurança pública, que consolida dados de todas as unidades federativas para subsidiar a formulação de políticas públicas na área de segurança.",
      "BASE LEGAL — O SINESP é regulamentado pela Lei nº 13.675/2018 (SUSP) e pelo Decreto nº 9.489/2018, que estabelecem as diretrizes para a coleta, tratamento e compartilhamento de informações de segurança pública entre os órgãos integrantes do Sistema Único de Segurança Pública.",
    ],
  },
  "infoseg": {
    titulo: "INFOSEG — REDE DE INTEGRAÇÃO NACIONAL DE INFORMAÇÕES",
    subtitulo: "Sistema integrado de informações de justiça e segurança pública",
    corpo: [
      "O INFOSEG é a rede nacional de informações de segurança pública e justiça criminal, mantida pelo Ministério da Justiça e Segurança Pública. O sistema permite a consulta integrada a diversas bases de dados governamentais, facilitando o trabalho investigativo das forças de segurança pública.",
      "BASES DE DADOS INTEGRADAS — O INFOSEG integra informações de: Departamentos de Trânsito (DETRAN) de todos os estados; Tribunal Superior Eleitoral (TSE); Instituto Nacional de Identificação (INI/PF); Departamento Penitenciário Nacional (DEPEN); Conselho Nacional de Justiça (CNJ); Receita Federal do Brasil; entre outros órgãos.",
      "FUNCIONALIDADES — O sistema permite: consulta de indivíduos por nome, CPF ou RG; consulta de veículos por placa ou chassi; consulta de armas de fogo por número de registro; consulta de mandados de prisão; consulta de foragidos da justiça; e geração de relatórios estatísticos.",
      "ACESSO — O acesso ao INFOSEG é restrito a profissionais de segurança pública, magistrados e membros do Ministério Público, mediante credenciamento prévio junto à Secretaria Nacional de Segurança Pública. Todas as consultas são registradas e auditáveis.",
      "CONFIDENCIALIDADE — As informações acessadas pelo INFOSEG são protegidas por sigilo funcional. O uso indevido das informações constitui infração administrativa e penal, sujeitando o responsável às sanções previstas na legislação vigente.",
    ],
  },
  "snic": {
    titulo: "SISTEMA NACIONAL DE INFORMAÇÕES CRIMINAIS",
    subtitulo: "Base de dados criminal integrada de âmbito nacional",
    corpo: [
      "O Sistema Nacional de Informações Criminais (SNIC) é a base de dados que consolida informações sobre registros criminais de todo o território brasileiro, sob a coordenação do Ministério da Justiça e Segurança Pública.",
      "OBJETIVO — O SNIC tem por objetivo centralizar e disponibilizar informações criminais para subsidiar as atividades de investigação, inteligência e formulação de políticas públicas de segurança. O sistema consolida dados de boletins de ocorrência, inquéritos policiais, processos criminais e execuções penais.",
      "INTEGRACAO — O sistema e alimentado pelas Policias Civis e Militares de todos os estados, orgaos federais de seguranca publica, Ministerio Publico e Poder Judiciario, garantindo uma visao integrada da criminalidade em ambito nacional.",
      "ESTATÍSTICAS — O SNIC produz relatórios periódicos sobre indicadores criminais, incluindo: homicídios dolosos; latrocínios; lesão corporal seguida de morte; estupro; roubo; furto; tráfico de drogas; e demais crimes com maior impacto social. Esses dados são utilizados para orientar a alocação de recursos e a definição de prioridades na área de segurança pública.",
    ],
  },
  "rede-sinesp": {
    titulo: "REDE SINESP — INTEGRAÇÃO TECNOLÓGICA",
    subtitulo: "Infraestrutura tecnológica para segurança pública",
    corpo: [
      "A Rede SINESP compreende o conjunto de infraestruturas tecnológicas, sistemas de informação e plataformas digitais utilizados para a integração e interoperabilidade dos órgãos de segurança pública em todo o território nacional.",
      "COMPONENTES — A Rede é composta por: data centers seguros; redes de comunicação criptografadas; sistemas de videomonitoramento integrados; plataformas de análise de dados e inteligência artificial; aplicativos móveis para uso operacional; e sistemas de despacho de ocorrências.",
      "OBJETIVOS — Garantir a integração tecnológica entre os órgãos de segurança pública dos três níveis de governo; promover a interoperabilidade dos sistemas de informação; viabilizar o compartilhamento seguro de dados e informações; e subsidiar a tomada de decisão com base em evidências e análise de dados.",
      "SEGURANÇA DA INFORMAÇÃO — A Rede SINESP opera em conformidade com os padrões internacionais de segurança da informação, incluindo certificações ISO 27001 e ISO 27701, garantindo a proteção, integridade e disponibilidade dos dados de segurança pública.",
    ],
  },
  "ouvidoria-mjsp": {
    titulo: "OUVIDORIA DO MINISTÉRIO DA JUSTIÇA E SEGURANÇA PÚBLICA",
    subtitulo: "Canal de comunicação entre o cidadão e o MJSP",
    corpo: [
      "A Ouvidoria do Ministério da Justiça e Segurança Pública é o canal institucional de comunicação entre o cidadão e o MJSP, destinado ao recebimento de manifestações, reclamações, sugestões, elogios e denúncias relacionadas aos serviços prestados pelo Ministério e seus órgãos vinculados.",
      "CANAIS DE ATENDIMENTO — O cidadão pode realizar suas manifestações por meio dos seguintes canais: (i) Portal Fala.BR (https://falabr.cgu.gov.br) — plataforma integrada de ouvidoria do Governo Federal; (ii) Telefone 0800-600-1503 — atendimento de segunda a sexta-feira, das 8h às 17h; (iii) Atendimento presencial — Esplanada dos Ministérios, Bloco T, Brasília/DF; (iv) Correspondência — Esplanada dos Ministérios, Bloco T, CEP 70064-900, Brasília/DF.",
      "TIPOS DE MANIFESTAÇÃO — Reclamação: expressão de insatisfação com serviço prestado; Sugestão: proposta de melhoria de serviço ou política pública; Elogio: demonstração de satisfação com serviço prestado; Denúncia: comunicação de prática de irregularidade ou ilícito; Solicitação: pedido de informação ou providência.",
      "PRAZOS DE RESPOSTA — Reclamação: 30 dias, prorrogáveis por mais 30; Sugestão: 30 dias; Denúncia: prazo variável conforme complexidade; Solicitação: 20 dias; Elogio: encaminhamento à unidade elogiada.",
      "SIGILO — É assegurado o sigilo da identidade do manifestante, quando solicitado, nos termos do art. 10, §7º da Lei nº 13.460/2017, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).",
    ],
  },
  "fale-conosco-mjsp": {
    titulo: "FALE CONOSCO — MJSP",
    subtitulo: "Formulário eletrônico de contato com o Ministério da Justiça",
    corpo: [
      "O serviço Fale Conosco do Ministério da Justiça e Segurança Pública permite ao cidadão encaminhar dúvidas, solicitações e informações diretamente às unidades do Ministério, de forma prática e acessível.",
      "COMO UTILIZAR — Acesse o portal www.gov.br/mj e preencha o formulário eletrônico com: nome completo; CPF; e-mail; telefone; assunto; e descrição detalhada da solicitação. Anexe documentos quando necessário.",
      "PRAZO DE RESPOSTA — As solicitações são respondidas no prazo de até 20 dias úteis, conforme a complexidade do assunto e a unidade responsável pelo atendimento.",
      "HORÁRIO DE ATENDIMENTO TELEFÔNICO — O Ministério da Justiça e Segurança Pública atende pelo telefone 0800-600-1503, de segunda a sexta-feira, das 8h às 17h (horário de Brasília).",
    ],
  },
  "disque-180-100": {
    titulo: "DISQUE 180 E DISQUE 100",
    subtitulo: "Centrais de atendimento para denúncias de violações de direitos",
    corpo: [
      "O Disque 180 (Central de Atendimento à Mulher) e o Disque 100 (Disque Direitos Humanos) são serviços de utilidade pública do Governo Federal, vinculados ao Ministério da Justiça e Segurança Pública, que funcionam como canais de denúncia, orientação e encaminhamento de casos de violações de direitos.",
      "DISQUE 180 — Criado em 2005, o serviço atende mulheres em situação de violência doméstica e familiar, prestando orientação sobre direitos, legislação e serviços disponíveis. O atendimento é 24 horas, gratuito, e pode ser acessado de qualquer telefone fixo ou celular, inclusive do exterior.",
      "DISQUE 100 — Recebe denúncias de violações de direitos humanos envolvendo crianças e adolescentes, idosos, pessoas com deficiência, população LGBTQIA+, população em situação de rua, entre outros grupos vulneráveis. Funcionamento 24 horas, todos os dias da semana, com ligação gratuita.",
      "ENCAMINHAMENTO — As denúncias recebidas são analisadas e encaminhadas aos órgãos competentes (Ministério Público, Delegacias Especializadas, Conselhos Tutelares, etc.) para as providências cabíveis. O denunciante pode acompanhar o andamento pelo número de protocolo fornecido no atendimento.",
    ],
  },
  "chat-mjsp": {
    titulo: "ATENDIMENTO VIRTUAL — MJSP",
    subtitulo: "Chat online e assistente virtual do Ministério da Justiça",
    corpo: [
      "O Ministério da Justiça e Segurança Pública disponibiliza atendimento virtual por meio de chat online e assistente virtual inteligente, permitindo ao cidadão obter informações e orientações de forma rápida e acessível.",
      "SERVIÇOS DISPONÍVEIS — Pelo chat online é possível: consultar informações sobre concursos e seleções; obter orientações sobre registro de ocorrências; consultar andamento de processos administrativos; obter informações sobre programas e projetos do MJSP; e ser encaminhado ao setor competente para demandas específicas.",
      "HORÁRIO DE ATENDIMENTO — O assistente virtual está disponível 24 horas por dia, 7 dias por semana. O atendimento humano por chat funciona de segunda a sexta-feira, das 8h às 18h (horário de Brasília).",
      "ACESSIBILIDADE — O chat online é compatível com tecnologias assistivas e atende às diretrizes de acessibilidade digital do Governo Federal (e-MAG).",
    ],
  },
  "sobre-mjsp": {
    titulo: "SOBRE O MINISTÉRIO DA JUSTIÇA E SEGURANÇA PÚBLICA",
    subtitulo: "Competências, estrutura e atuação do MJSP",
    corpo: [
      "O Ministério da Justiça e Segurança Pública (MJSP) é o órgão da administração federal direta responsável pela coordenação da política nacional de segurança pública, pela defesa da ordem jurídica, dos direitos políticos e das garantias constitucionais, e pela articulação do Sistema Único de Segurança Pública (SUSP).",
      "COMPETÊNCIAS — Compete ao MJSP: coordenar e promover a integração da segurança pública em âmbito nacional; planejar, acompanhar e avaliar a implementação da Política Nacional de Segurança Pública; gerir o Fundo Nacional de Segurança Pública; coordenar ações de combate ao tráfico de drogas; e promover a cooperação jurídica internacional.",
      "ESTRUTURA — O MJSP e composto por: Secretaria Nacional de Seguranca Publica (SENASP); Secretaria Nacional de Politicas Penais (SENAPPEN); Secretaria Nacional de Politicas sobre Drogas (SENAD); Secretaria Nacional do Consumidor (SENACON); Departamento de Policia Federal; e demais orgaos vinculados.",
      "PROGRAMAS — O MJSP executa diversos programas na área de segurança pública, incluindo: Programa Nacional de Segurança Pública com Cidadania (PRONASCI); Programa de Redução da Violência Letal; Programa de Fortalecimento das Perícias; e Programa Nacional de Enfrentamento da Violência contra a Mulher.",
    ],
  },
  "senasp": {
    titulo: "SECRETARIA NACIONAL DE SEGURANÇA PÚBLICA — SENASP",
    subtitulo: "Órgão central do Sistema Único de Segurança Pública",
    corpo: [
      "A Secretaria Nacional de Segurança Pública (SENASP) é o órgão do Ministério da Justiça e Segurança Pública responsável pela coordenação, planejamento e implementação da Política Nacional de Segurança Pública, exercendo o papel de órgão central do Sistema Único de Segurança Pública (SUSP).",
      "ATRIBUIÇÕES — Compete à SENASP: promover a integração dos órgãos de segurança pública; gerenciar o Sistema Nacional de Informações de Segurança Pública (SINESP); promover a capacitação e valorização dos profissionais de segurança pública; fomentar a pesquisa e a produção de conhecimento na área de segurança; e coordenar programas de prevenção à violência.",
      "REDE EAD-SENASP — A SENASP mantém a Rede Nacional de Educação a Distância em Segurança Pública, que oferece cursos gratuitos de capacitação para profissionais de segurança pública e demais interessados, com mais de 100 cursos disponíveis nas áreas de investigação criminal, perícia, policiamento comunitário, direitos humanos, entre outras.",
      "FORÇA NACIONAL DE SEGURANÇA PÚBLICA — A SENASP coordena a Força Nacional de Segurança Pública, programa de cooperação federativa que atua em situações de grave perturbação da ordem pública, mediante solicitação dos governadores dos estados.",
    ],
  },
  "policia-federal": {
    titulo: "INSS — INSTITUTO NACIONAL DO SEGURO SOCIAL",
    subtitulo: "Autarquia federal responsável pelo Regime Geral de Previdência Social",
    corpo: [
      "O Instituto Nacional do Seguro Social (INSS) é uma autarquia federal criada pela Lei nº 8.029, de 12 de abril de 1990, vinculada ao Ministério da Previdência Social. Tem sede em Brasília/DF e jurisdição em todo o território nacional, com mais de 1.500 agências de atendimento distribuídas nos 26 estados e no Distrito Federal.",
      "MISSÃO — Garantir a proteção previdenciária ao trabalhador brasileiro e sua família, por meio da concessão e manutenção de benefícios e serviços do Regime Geral de Previdência Social (RGPS), contribuindo para a redução da pobreza e a promoção do bem-estar social, com eficiência, equidade e transparência.",
      "BENEFÍCIOS E SERVIÇOS — O INSS administra e concede: aposentadorias (por idade, por tempo de contribuição, por invalidez); pensão por morte; auxílio-doença e auxílio-acidente; salário-maternidade; salário-família; benefício de prestação continuada (BPC/LOAS); e reabilitação profissional — atendendo mais de 37 milhões de beneficiários em todo o Brasil.",
      "REGIME GERAL DE PREVIDÊNCIA SOCIAL — O RGPS, gerido pelo INSS, é de filiação obrigatória para todos os trabalhadores urbanos e rurais com vínculo empregatício, e facultativo para os demais. É custeado por contribuições de segurados e empregadores, nos termos da Lei nº 8.212/1991 e do Decreto nº 3.048/1999.",
      "ESTRUTURA DE ATENDIMENTO — O INSS opera por meio de rede nacional com mais de 1.500 Agências da Previdência Social (APS), além do portal gov.br/inss e da Central 135, que funciona de segunda a sábado, das 7h às 22h. O programa Meu INSS permite ao cidadão solicitar e acompanhar benefícios de forma digital.",
      "CONCURSO PÚBLICO 2026 — Para suprir o déficit estrutural de pessoal e reduzir a fila de benefícios — que alcançou 3,1 milhões em fevereiro de 2026 — o INSS realizará o maior concurso da previdência em mais de uma década, com 10.000 vagas efetivas para Técnico e Analista do Seguro Social, além de cerca de 2.000 vagas emergenciais pelo programa Acelera INSS.",
    ],
  },
  "depen": {
    titulo: "DEPARTAMENTO PENITENCIÁRIO NACIONAL — DEPEN",
    subtitulo: "Órgão responsável pela política penitenciária nacional",
    corpo: [
      "O Departamento Penitenciário Nacional (DEPEN), vinculado ao Ministério da Justiça e Segurança Pública, é o órgão responsável pela execução da política penitenciária nacional, pelo acompanhamento da aplicação das normas de execução penal e pelo apoio administrativo e financeiro ao Conselho Nacional de Política Criminal e Penitenciária (CNPCP).",
      "ATRIBUIÇÕES — Compete ao DEPEN: planejar e coordenar a política penitenciária nacional; inspecionar e fiscalizar os estabelecimentos penais; assistir tecnicamente as unidades federativas na implementação dos princípios e regras da execução penal; e gerir o Fundo Penitenciário Nacional (FUNPEN).",
      "SISTEMA PENITENCIÁRIO — O Brasil possui um dos maiores sistemas penitenciários do mundo, com mais de 1.400 estabelecimentos penais. O DEPEN coordena ações para a melhoria das condições de encarceramento, a reinserção social dos egressos e a redução da reincidência criminal.",
      "PROGRAMAS — O DEPEN executa programas de: educação e trabalho prisional; assistência à saúde da população carcerária; monitoração eletrônica; e alternativas penais à prisão.",
    ],
  },
  "portal-transparencia-mjsp": {
    titulo: "PORTAL DA TRANSPARÊNCIA",
    subtitulo: "Acesso a informações sobre gastos e ações do MJSP",
    corpo: [
      "O Portal da Transparência é a ferramenta digital do Governo Federal que permite ao cidadão acompanhar a aplicação dos recursos públicos pelo Ministério da Justiça e Segurança Pública e seus órgãos vinculados. O portal disponibiliza informações sobre execução orçamentária, contratos, convênios, servidores e demais dados de interesse público.",
      "INFORMAÇÕES DISPONÍVEIS — O cidadão pode consultar: gastos diretos e transferências de recursos; contratos e licitações; convênios e termos de cooperação; remuneração de servidores; viagens a serviço; cartões de pagamento do governo federal; e emendas parlamentares.",
      "LEI DE ACESSO À INFORMAÇÃO — A Lei nº 12.527/2011 (LAI) garante o acesso a informações públicas como regra geral, sendo o sigilo a exceção. Qualquer cidadão pode solicitar informações aos órgãos públicos, sem necessidade de apresentar motivo.",
      "COMO SOLICITAR — As solicitações de acesso à informação podem ser feitas pelo portal Fala.BR, pelo telefone 0800-600-1503, ou presencialmente no Serviço de Informação ao Cidadão (SIC) do MJSP, localizado na Esplanada dos Ministérios, Bloco T, Brasília/DF.",
    ],
  },
  "dados-abertos-mjsp": {
    titulo: "DADOS ABERTOS — MJSP",
    subtitulo: "Acesso a bases de dados públicas de segurança",
    corpo: [
      "O Ministério da Justiça e Segurança Pública disponibiliza conjuntos de dados abertos em conformidade com a Política de Dados Abertos do Governo Federal (Decreto nº 8.777/2016). Os dados abertos permitem o acesso, uso e redistribuição por qualquer pessoa, sem restrição de direitos autorais.",
      "CONJUNTOS DE DADOS — Os principais conjuntos de dados abertos do MJSP incluem: estatísticas de ocorrências criminais por estado e município; dados do sistema penitenciário nacional; informações sobre apreensões de drogas; dados de operações policiais; e indicadores de segurança pública do SINESP.",
      "FORMATO — Os dados são disponibilizados em formatos abertos (CSV, JSON, XML) para facilitar o uso por pesquisadores, jornalistas, desenvolvedores e cidadãos em geral.",
      "ACESSO — Os dados abertos do MJSP estão disponíveis no Portal Brasileiro de Dados Abertos (dados.gov.br) e no portal do MJSP (www.gov.br/mj).",
    ],
  },
  "lai-mjsp": {
    titulo: "LEI DE ACESSO À INFORMAÇÃO — LAI",
    subtitulo: "Lei nº 12.527/2011 — Direito de acesso à informação pública",
    corpo: [
      "A Lei nº 12.527, de 18 de novembro de 2011, regulamenta o direito constitucional de acesso às informações públicas, previsto no art. 5º, inciso XXXIII, no art. 37, §3º, inciso II, e no art. 216, §2º, da Constituição Federal.",
      "PRINCÍPIOS — A LAI estabelece que o acesso à informação é a regra; o sigilo é a exceção. Os órgãos públicos devem garantir a divulgação proativa de informações de interesse coletivo, em local de fácil acesso, independentemente de solicitação.",
      "PRAZOS — Os órgãos públicos devem responder aos pedidos de acesso à informação no prazo de 20 dias, prorrogável por mais 10 dias, mediante justificativa expressa.",
      "RECURSOS — Em caso de negativa de acesso, o interessado pode interpor recurso à autoridade hierarquicamente superior, à CGU e à Comissão Mista de Reavaliação de Informações, conforme o caso.",
    ],
  },
  "auditorias-mjsp": {
    titulo: "AUDITORIAS E FISCALIZAÇÕES",
    subtitulo: "Controle interno e externo das ações do MJSP",
    corpo: [
      "O Ministério da Justiça e Segurança Pública é submetido a auditorias e fiscalizações periódicas realizadas pela Controladoria-Geral da União (CGU) e pelo Tribunal de Contas da União (TCU), que verificam a regularidade da gestão administrativa, financeira e patrimonial do Ministério.",
      "CONTROLE INTERNO — A CGU realiza auditorias nos programas e ações do MJSP, avaliando a conformidade dos gastos, a eficiência na execução dos recursos e o alcance dos resultados previstos.",
      "CONTROLE EXTERNO — O TCU fiscaliza as contas do MJSP no âmbito de sua competência constitucional, verificando a legalidade, legitimidade e economicidade dos atos de gestão.",
      "RELATÓRIOS — Os relatórios de auditoria e os pareceres dos órgãos de controle são publicados nos respectivos portais eletrônicos, garantindo a transparência e o controle social da gestão pública.",
    ],
  },
  "estatisticas-criminais": {
    titulo: "ESTATÍSTICAS CRIMINAIS",
    subtitulo: "Indicadores e dados de criminalidade no Brasil",
    corpo: [
      "O Ministério da Justiça e Segurança Pública, por meio da Secretaria Nacional de Segurança Pública (SENASP), produz e divulga periodicamente estatísticas e indicadores de criminalidade, com base nos dados fornecidos pelas unidades federativas ao Sistema Nacional de Informações de Segurança Pública (SINESP).",
      "INDICADORES MONITORADOS — Os principais indicadores monitorados incluem: homicídios dolosos; feminicídios; latrocínios; lesão corporal seguida de morte; estupro; roubo (total e por modalidade); furto (total e por modalidade); tráfico de drogas; e apreensão de armas de fogo.",
      "PUBLICAÇÕES — A SENASP publica: Anuário Brasileiro de Segurança Pública (em parceria com o Fórum Brasileiro de Segurança Pública); Atlas da Violência (em parceria com o IPEA); e boletins mensais de ocorrências criminais.",
      "METODOLOGIA — As estatísticas são produzidas com base na metodologia do SINESP, que padroniza os conceitos, definições e classificações utilizados no registro de ocorrências criminais em todo o território nacional, garantindo a comparabilidade dos dados entre as unidades federativas.",
    ],
  },
  "politica-privacidade-mjsp": {
    titulo: "POLÍTICA DE PRIVACIDADE — MJSP",
    subtitulo: "Tratamento de dados pessoais em conformidade com a LGPD",
    corpo: [
      "A Política de Privacidade do Ministério da Justiça e Segurança Pública estabelece as diretrizes para o tratamento de dados pessoais coletados por meio dos portais, sistemas e serviços digitais do MJSP, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).",
      "DADOS COLETADOS — O MJSP pode coletar dados pessoais como: nome completo; CPF; endereço de e-mail; telefone; endereço residencial; dados de navegação (cookies, IP, geolocalização); e demais informações necessárias à prestação dos serviços solicitados.",
      "FINALIDADE — Os dados pessoais são tratados para as seguintes finalidades: prestação de serviços públicos; atendimento a solicitações do titular; cumprimento de obrigações legais; produção de estatísticas e pesquisas; e melhoria dos serviços oferecidos.",
      "DIREITOS DO TITULAR — O titular dos dados pessoais tem direito a: confirmação da existência de tratamento; acesso aos dados; correção de dados incompletos ou desatualizados; anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade dos dados; e revogação do consentimento.",
      "ENCARREGADO — O Encarregado pelo Tratamento de Dados Pessoais do MJSP pode ser contatado pelo e-mail lgpd@mj.gov.br ou pelo telefone 0800-600-1503.",
    ],
  },
  "termos-uso-mjsp": {
    titulo: "TERMOS DE USO",
    subtitulo: "Condições de utilização dos serviços digitais do MJSP",
    corpo: [
      "Os Termos de Uso estabelecem as condições para utilização dos portais, sistemas e serviços digitais do Ministério da Justiça e Segurança Pública. Ao acessar e utilizar os serviços, o usuário declara ter lido, compreendido e concordado com os presentes termos.",
      "ACESSO — O acesso aos portais e serviços digitais do MJSP é gratuito e disponível a todos os cidadãos. Alguns serviços podem exigir cadastro prévio e autenticação mediante login Gov.br.",
      "RESPONSABILIDADES DO USUÁRIO — O usuário se compromete a: fornecer informações verdadeiras e atualizadas; utilizar os serviços de forma ética e em conformidade com a legislação; não praticar atos que possam comprometer a segurança ou o funcionamento dos sistemas; e manter sigilo sobre suas credenciais de acesso.",
      "PROPRIEDADE INTELECTUAL — Todo o conteúdo dos portais do MJSP é protegido pela legislação de direitos autorais e propriedade intelectual, salvo disposição em contrário. A reprodução de conteúdo para fins não comerciais é permitida, desde que citada a fonte.",
    ],
  },
  "cookies-mjsp": {
    titulo: "POLÍTICA DE COOKIES",
    subtitulo: "Utilização de cookies nos portais do MJSP",
    corpo: [
      "Os portais e sistemas digitais do Ministério da Justiça e Segurança Pública utilizam cookies para melhorar a experiência de navegação do usuário, coletar dados estatísticos e garantir o funcionamento adequado dos serviços.",
      "TIPOS DE COOKIES — Cookies essenciais: necessários para o funcionamento básico do portal; Cookies de desempenho: coletam dados anônimos sobre a utilização do portal para fins estatísticos; Cookies de funcionalidade: permitem personalizar a experiência do usuário; Cookies de análise: utilizados para compreender o comportamento dos visitantes.",
      "GERENCIAMENTO — O usuário pode configurar seu navegador para bloquear ou alertar sobre cookies. No entanto, o bloqueio de cookies essenciais pode comprometer o funcionamento de alguns serviços.",
      "BASE LEGAL — A utilização de cookies segue as diretrizes da Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e do Marco Civil da Internet (Lei nº 12.965/2014).",
    ],
  },
  "certificado-digital-mjsp": {
    titulo: "CERTIFICADO DIGITAL E SEGURANÇA",
    subtitulo: "Autenticação e segurança nos sistemas do MJSP",
    corpo: [
      "O Ministério da Justiça e Segurança Pública utiliza certificados digitais e protocolos de segurança avançados para garantir a autenticidade, integridade e confidencialidade das informações trafegadas em seus sistemas e portais.",
      "CERTIFICADO SSL/TLS — Todos os portais do MJSP utilizam certificado SSL/TLS para criptografia da conexão, garantindo que os dados trafegados entre o navegador do usuário e os servidores do Ministério sejam protegidos contra interceptação.",
      "AUTENTICAÇÃO — O acesso a sistemas restritos é realizado mediante autenticação por login Gov.br, que suporta diferentes níveis de segurança: bronze (cadastro básico), prata (validação biométrica ou bancária) e ouro (certificado digital ICP-Brasil).",
      "INFRAESTRUTURA — Os sistemas do MJSP são hospedados em infraestrutura certificada ISO 27001 e ISO 27701, mantida pelo SERPRO (Serviço Federal de Processamento de Dados), garantindo os mais elevados padrões de segurança da informação.",
    ],
  },
};

function DocumentModal({ content, onClose }: { content: DocumentModalContent; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#f4f6f8",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          backgroundColor: "#071D41",
          height: "4px",
          width: "100%",
          flexShrink: 0,
        }}
      />

      <div
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #e0e0e0",
          padding: "0 20px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "52px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src={logoMpo}
              alt="Ministério do Planejamento e Orçamento"
              style={{ height: "32px", objectFit: "contain" }}
            />
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid #ccc",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#555",
              fontSize: "15px",
              fontFamily: "Arial, sans-serif",
              lineHeight: 1,
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            ✕
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "32px 24px 60px",
            backgroundColor: "#fff",
            minHeight: "100%",
            boxShadow: "0 0 20px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "28px", paddingBottom: "20px", borderBottom: "1px solid #e8e8e8" }}>
            <img
              src="https://www.gov.br/planalto/pt-br/conheca-a-presidencia/biblioteca-da-pr/simbolos-nacionais/brasao-da-republica/brasaooficialcolorido.png"
              alt="Brasão da República"
              style={{ height: "48px", margin: "0 auto 10px", display: "block", objectFit: "contain" }}
            />
            <p style={{ fontSize: "10px", color: "#888", margin: "0 0 2px", fontFamily: "'Rawline', sans-serif", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Ministério da Justiça e Segurança Pública
            </p>
            <p style={{ fontSize: "9px", color: "#aaa", margin: "0 0 14px", fontFamily: "'Rawline', sans-serif" }}>
              Secretaria Nacional de Segurança Pública
            </p>
            <h1 style={{ fontSize: "17px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px", fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "0.3px" }}>
              {content.titulo}
            </h1>
            <p style={{ fontSize: "12px", color: "#666", margin: 0, fontStyle: "italic", fontFamily: "'Times New Roman', Georgia, serif" }}>
              {content.subtitulo}
            </p>
          </div>

          {content.corpo.map((paragrafo, i) => (
            <p
              key={i}
              style={{
                fontSize: "14px",
                color: "#333",
                textAlign: "justify",
                marginBottom: "14px",
                lineHeight: 1.8,
                fontFamily: "'Times New Roman', Georgia, serif",
                textIndent: paragrafo.startsWith("Art.") || paragrafo.startsWith("§") || paragrafo.startsWith("II") || paragrafo.startsWith("I ") ? "0" : "2em",
                paddingLeft: paragrafo.startsWith("§") || paragrafo.startsWith("II") || paragrafo.startsWith("I ") ? "1.5em" : "0",
              }}
            >
              {paragrafo}
            </p>
          ))}

          <div style={{ marginTop: "40px", borderTop: "1px solid #e8e8e8", paddingTop: "16px", textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: "#aaa", fontFamily: "'Rawline', sans-serif", margin: "0 0 2px" }}>
              Documento de acesso público — Portal do Ministério da Justiça e Segurança Pública
            </p>
            <p style={{ fontSize: "9px", color: "#bbb", fontFamily: "'Rawline', sans-serif", margin: 0 }}>
              SERPRO — Serviço Federal de Processamento de Dados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ExercitoFooter() {
  const [location, navigate] = useLocation();
  const [lastVisitedPage, setLastVisitedPage] = useState<string>("/");
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const [modalDoc, setModalDoc] = useState<string | null>(null);
  const isFooterPage = location.startsWith('/footer-');

  useEffect(() => {
    if (!location.startsWith('/footer-')) {
      setLastVisitedPage(location);
      localStorage.setItem('lastVisitedPage', location);
    }
  }, [location]);

  useEffect(() => {
    const saved = localStorage.getItem('lastVisitedPage');
    if (saved) {
      setLastVisitedPage(saved);
    }
  }, []);

  const handleBackToProcess = () => {
    navigate(lastVisitedPage);
  };

  const handleFooterLink = (page: string) => {
    navigate(`/footer-${page}`);
  };

  const toggleAccordion = (target: string) => {
    setOpenAccordions((prev) =>
      prev.includes(target) ? prev.filter((item) => item !== target) : [...prev, target]
    );
  };

  const abrirDocumento = (docKey: string) => {
    setModalDoc(docKey);
    document.body.style.overflow = "hidden";
  };

  const fecharModal = useCallback(() => {
    setModalDoc(null);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (!modalDoc) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") fecharModal();
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [modalDoc, fecharModal]);

  const footerSections = [
    {
      id: "legislacao",
      titulo: "LEGISLAÇÃO E NORMAS",
      itens: [
        { label: "PEC da Segurança Pública", doc: "pec-seguranca" },
        { label: "Lei nº 13.675/2018 — SUSP", doc: "lei-susp" },
        { label: "Estatuto das Polícias Civis", doc: "estatuto-policias" },
        { label: "Código de Processo Penal", doc: "codigo-processo-penal" },
      ],
    },
    {
      id: "servicos",
      titulo: "SERVIÇOS AO CIDADÃO",
      itens: [
        { label: "Concursos e Seleções Públicas", doc: "concursos-selecoes" },
        { label: "Boletim de Ocorrência Online", doc: "boletim-ocorrencia" },
        { label: "Consulta de Antecedentes Criminais", doc: "antecedentes-criminais" },
        { label: "Denúncia Anônima — Disque-Denúncia", doc: "denuncia-anonima" },
      ],
    },
    {
      id: "sistemas",
      titulo: "SISTEMAS E PLATAFORMAS",
      itens: [
        { label: "SINESP — Sistema Nacional de Informações", doc: "sinesp" },
        { label: "INFOSEG — Rede de Integração Nacional", doc: "infoseg" },
        { label: "Sistema Nacional de Informações Criminais", doc: "snic" },
        { label: "Rede SINESP — Integração Tecnológica", doc: "rede-sinesp" },
      ],
    },
    {
      id: "atendimento",
      titulo: "CANAIS DE ATENDIMENTO",
      itens: [
        { label: "Ouvidoria do MJSP", doc: "ouvidoria-mjsp" },
        { label: "Fale Conosco — Formulário Eletrônico", doc: "fale-conosco-mjsp" },
        { label: "Disque 180 / Disque 100", doc: "disque-180-100" },
        { label: "Chat Online — Atendimento Virtual", doc: "chat-mjsp" },
      ],
    },
    {
      id: "institucional",
      titulo: "INSTITUCIONAL",
      itens: [
        { label: "Sobre o MJSP", doc: "sobre-mjsp" },
        { label: "Secretaria Nacional de Segurança Pública", doc: "senasp" },
        { label: "INSS — Concurso Público 2026", doc: "policia-federal" },
        { label: "DEPEN — Departamento Penitenciário Nacional", doc: "depen" },
      ],
    },
    {
      id: "transparencia",
      titulo: "TRANSPARÊNCIA E PRESTAÇÃO DE CONTAS",
      itens: [
        { label: "Portal da Transparência", doc: "portal-transparencia-mjsp" },
        { label: "Dados Abertos", doc: "dados-abertos-mjsp" },
        { label: "Lei de Acesso à Informação (LAI)", doc: "lai-mjsp" },
        { label: "Auditorias e Fiscalizações", doc: "auditorias-mjsp" },
        { label: "Estatísticas Criminais", doc: "estatisticas-criminais" },
      ],
    },
    {
      id: "privacidade",
      titulo: "PRIVACIDADE E SEGURANÇA",
      itens: [
        { label: "Política de Privacidade (LGPD)", doc: "politica-privacidade-mjsp" },
        { label: "Termos de Uso", doc: "termos-uso-mjsp" },
        { label: "Política de Cookies", doc: "cookies-mjsp" },
        { label: "Certificado Digital e Segurança", doc: "certificado-digital-mjsp" },
      ],
    },
  ];

  return (
    <>
      {isFooterPage && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleBackToProcess}
            className="bg-[#1351b4] text-white font-bold py-4 px-6 rounded-full shadow-lg hover:bg-[#0c326f] transition-all transform hover:scale-105"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Voltar ao processo seletivo
          </button>
        </div>
      )}

      <footer style={{ backgroundColor: "#071D41" }}>
        <div style={{ maxWidth: "672px", margin: "0 auto", padding: "32px 16px", textAlign: "left" }}>
          <img
            src={logoMpo}
            alt="Ministério do Planejamento e Orçamento"
            style={{ height: "48px", objectFit: "contain", filter: "brightness(0) invert(1)", marginBottom: "24px" }}
          />

          {footerSections.map((section, sIdx) => (
            <div key={section.id}>
              {sIdx > 0 && <div style={{ borderTop: "1px solid #2a4a7f", marginTop: "2px" }} />}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 4px",
                  cursor: "pointer",
                }}
                onClick={() => toggleAccordion(section.id)}
              >
                <span style={{ fontWeight: 700, fontSize: "14px", color: "#fff", letterSpacing: "0.5px" }}>
                  {section.titulo}
                </span>
                <i
                  className="fas fa-chevron-down"
                  style={{
                    color: "#fff",
                    fontSize: "14px",
                    transition: "transform 0.3s",
                    transform: openAccordions.includes(section.id) ? "rotate(180deg)" : "rotate(0deg)",
                    fontFamily: '"Font Awesome 6 Free"',
                  }}
                />
              </div>
              <div style={{ display: openAccordions.includes(section.id) ? "block" : "none", paddingBottom: "12px" }}>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {section.itens.map((item, iIdx) => (
                    <li key={iIdx}>
                      <span
                        onClick={() => abrirDocumento(item.doc)}
                        style={{
                          display: "block",
                          padding: "6px 4px 6px 12px",
                          fontSize: "13px",
                          color: "#b0c4de",
                          cursor: "pointer",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#b0c4de")}
                      >
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <div style={{ borderTop: "1px solid #2a4a7f", marginTop: "8px", paddingTop: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <p style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "8px" }}>Redes Sociais</p>
              <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                {[
                  { icon: <FaFacebookF />, url: "https://www.facebook.com/MJSPgov/", label: "Facebook" },
                  { icon: <FaTwitter />, url: "https://twitter.com/mjspgov", label: "X" },
                  { icon: <FaInstagram />, url: "https://www.instagram.com/mjspgov/", label: "Instagram" },
                  { icon: <FaYoutube />, url: "https://www.youtube.com/channel/UCDey6VruQbsEEQ5TgvxHHKw", label: "YouTube" },
                ].map((rede) => (
                  <button
                    key={rede.label}
                    aria-label={rede.label}
                    onClick={() => window.open(rede.url, rede.label, "width=480,height=640,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no")}
                    style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#4b5563", display: "flex", alignItems: "center", justifyContent: "center", color: "white", border: "none", cursor: "pointer", transition: "background-color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#6b7280")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4b5563")}
                  >
                    {rede.icon}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid #2a4a7f", paddingTop: "14px", marginBottom: "14px" }}>
              <p style={{ color: "#7a8ba8", fontSize: "11px", textAlign: "center", lineHeight: 1.6, margin: "0 0 10px" }}>
                Ministério da Justiça e Segurança Pública
              </p>
              <p style={{ color: "#5a6a80", fontSize: "10px", textAlign: "center", lineHeight: 1.6, margin: "0 0 10px" }}>
                Esplanada dos Ministérios, Bloco T — Brasília/DF — CEP 70064-900
              </p>
              <p style={{ color: "#5a6a80", fontSize: "10px", textAlign: "center", lineHeight: 1.6, margin: "0 0 10px" }}>
                Horário de atendimento: segunda a sexta, das 8h às 18h (horário de Brasília)
              </p>
              <p style={{ color: "#5a6a80", fontSize: "10px", textAlign: "center", lineHeight: 1.6, margin: "0 0 10px" }}>
                Ouvidoria: 0800-061-1520 — Atendimento ao cidadão (ligação gratuita)
              </p>
            </div>

            <div style={{ borderTop: "1px solid #2a4a7f", paddingTop: "14px", marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px 16px" }}>
                {["Acessibilidade", "Mapa do site", "Termos de uso", "Sobre o Gov.br", "Acesso à informação", "Dados abertos", "Órgãos do Governo"].map((link) => (
                  <span key={link} style={{ color: "#7a8ba8", fontSize: "10px", cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#7a8ba8")}
                  >
                    {link}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid #2a4a7f", paddingTop: "14px", marginBottom: "14px" }}>
              <p style={{ color: "#5a6a80", fontSize: "9px", textAlign: "center", lineHeight: 1.7, margin: "0 0 8px" }}>
                Este portal segue as diretrizes do e-MAG (Modelo de Acessibilidade em Governo Eletrônico),
                conforme Portaria nº 3, de 7 de maio de 2007, e é compatível com as recomendações WCAG 2.1 nível AA.
              </p>
              <p style={{ color: "#5a6a80", fontSize: "9px", textAlign: "center", lineHeight: 1.7, margin: "0 0 8px" }}>
                Ambiente protegido por certificado SSL/TLS — Conexão criptografada com protocolo HTTPS.
                Dados trafegados em conformidade com a Política de Segurança da Informação do Ministério da Justiça e Segurança Pública.
              </p>
              <p style={{ color: "#5a6a80", fontSize: "9px", textAlign: "center", lineHeight: 1.7, margin: "0 0 8px" }}>
                Sistema homologado pelo SERPRO (Serviço Federal de Processamento de Dados) — Infraestrutura certificada ISO 27001 e ISO 27701.
              </p>
            </div>

            <div style={{ borderTop: "1px solid #2a4a7f", paddingTop: "14px" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#6b7280", fontSize: "10px", margin: "0 0 4px" }}>
                  Todos os direitos reservados
                </p>
                <p style={{ color: "#4b5563", fontSize: "9px", margin: "0 0 4px" }}>
                  Desenvolvido e mantido pelo SERPRO — Serviço Federal de Processamento de Dados
                </p>
                <p style={{ color: "#4b5563", fontSize: "9px", margin: "0 0 4px" }}>
                  Governo Federal — República Federativa do Brasil
                </p>
                <p style={{ color: "#3b4553", fontSize: "8px", margin: "12px 0 0", letterSpacing: "0.5px" }}>
                  v4.2.1-prod — Build 2025.02.18 — Ambiente: Produção
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {modalDoc && documentos[modalDoc] && (
        <DocumentModal content={documentos[modalDoc]} onClose={fecharModal} />
      )}
    </>
  );
}
