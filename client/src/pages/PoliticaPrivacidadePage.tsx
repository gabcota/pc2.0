import { AgHeader } from '@/components/AgHeader';
import { AgFooter } from '@/components/AgFooter';
import { getSiteConfig } from '@/lib/siteConfig';

const S = { fontSize:15, color:'#5F6368', lineHeight:1.95, marginBottom:16 } as const;
const H2 = { fontSize:21, fontWeight:800, color:'#202124', marginBottom:14, paddingBottom:12, borderBottom:'1px solid #DADCE0' } as const;
const H3 = { fontSize:16, fontWeight:700, color:'#202124', margin:'24px 0 10px' } as const;

function buildSections() { return [
  {
    titulo: '1. Identificação do responsável pelo tratamento de dados',
    conteudo: `Este site é operado e mantido por ${getSiteConfig().razaoSocial}, inscrita no CNPJ sob o nº ${getSiteConfig().cnpjFormatted}, com sede em ${getSiteConfig().enderecoCompleto}.

Este portal é uma plataforma privada de assessoria educacional, dedicada a orientar candidatos interessados no Processo Seletivo Simplificado (PSS) 2026. Não temos qualquer vínculo com o IBGE, órgãos públicos federais, bancas organizadoras de processos seletivos ou qualquer entidade governamental.

Para exercer seus direitos como titular de dados ou esclarecer dúvidas sobre esta Política, utilize o canal de contato disponível neste portal. Todas as solicitações serão respondidas em até 15 (quinze) dias úteis.`,
  },
  {
    titulo: '2. Abrangência e aplicação desta Política',
    conteudo: `Esta Política de Privacidade aplica-se a todas as páginas, seções e funcionalidades disponíveis neste domínio, incluindo páginas de conteúdo educacional, seções de perguntas frequentes, formulários de contato e quaisquer outros recursos interativos que venham a ser disponibilizados.

Ao acessar e utilizar este site, você reconhece ter lido, compreendido e concordado integralmente com os termos desta Política. Caso não concorde com qualquer disposição aqui contida, recomendamos que encerre imediatamente o acesso e se abstenha de utilizar os serviços disponibilizados.

Esta Política complementa — e não substitui — nossos Termos de Uso, Aviso de Isenção de Responsabilidade e Política de Cookies, todos disponíveis nos respectivos links no rodapé deste site. A leitura conjunta de todos esses documentos é recomendada para o entendimento completo das condições de uso do portal.

Esta Política está redigida em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei Federal nº 13.709, de 14 de agosto de 2018 — LGPD), com o Marco Civil da Internet (Lei Federal nº 12.965, de 23 de abril de 2014), com o Decreto nº 8.771/2016, que regulamenta o Marco Civil, e com demais normas aplicáveis editadas pela Autoridade Nacional de Proteção de Dados (ANPD).`,
  },
  {
    titulo: '3. Definições essenciais',
    conteudo: `Para os fins desta Política, adotam-se as seguintes definições, em conformidade com o art. 5º da Lei nº 13.709/2018 (LGPD):

Dado pessoal: informação relacionada a pessoa natural identificada ou identificável, tais como nome completo, CPF, endereço de e-mail, número de telefone, endereço IP vinculado a uma identidade, entre outros.

Dado pessoal sensível: dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação a sindicato ou a organização de caráter religioso, filosófico ou político, dado referente à saúde ou à vida sexual, dado genético ou biométrico, quando vinculado a uma pessoa natural.

Tratamento: toda operação realizada com dados pessoais, como coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação ou controle da informação, modificação, comunicação, transferência, difusão ou extração.

Titular: pessoa natural a quem se referem os dados pessoais que são objeto de tratamento.

Controlador: pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais.

Operador: pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador.

Encarregado (DPO): pessoa indicada pelo controlador e operador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a Autoridade Nacional de Proteção de Dados (ANPD).

Anonimização: utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo.

Consentimento: manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada.`,
  },
  {
    titulo: '4. Dados coletados e formas de coleta',
    conteudo: `4.1. Dados coletados automaticamente

Ao acessar este portal, determinadas informações técnicas são coletadas automaticamente pelos servidores de hospedagem e pelas ferramentas de análise integradas, sem qualquer ação deliberada do visitante. Essas informações incluem:

• Endereço IP do dispositivo utilizado para acesso, coletado de forma anonimizada (os últimos octetos do endereço IPv4, ou os últimos 80 bits do endereço IPv6, são zerados antes de qualquer processamento ou armazenamento);
• Tipo, versão e idioma do navegador utilizado (ex.: Chrome 124.0, Firefox 125, Safari 17 etc.);
• Sistema operacional e versão (ex.: Windows 11, macOS Sonoma, Android 14, iOS 17);
• Resolução de tela e tipo de dispositivo (desktop, tablet ou smartphone);
• Data e hora exatas do acesso, expressas no fuso horário UTC;
• Endereço da página visitada (URL), incluindo eventuais parâmetros de consulta (query strings);
• Página de referência (referrer), ou seja, o endereço de onde o visitante foi redirecionado, quando aplicável;
• Duração da visita e tempo de permanência em cada página acessada;
• Sequência de páginas navegadas durante uma mesma sessão;
• Dados de desempenho de carregamento das páginas (Core Web Vitals);
• País, estado e cidade inferidos com base no endereço IP anonimizado (geolocalização aproximada).

Essas informações são coletadas exclusivamente para fins estatísticos e de melhoria contínua do portal, sendo tratadas de forma agregada. Não permitem a identificação individual direta do visitante.

4.2. Dados fornecidos voluntariamente

Caso este portal disponibilize formulários de contato, caixas de sugestão, campos de inscrição em listas de atualização ou quaisquer outros meios de comunicação direta com o usuário, os dados fornecidos voluntariamente nesses campos poderão incluir:

• Nome completo ou apelido informado pelo titular;
• Endereço de correio eletrônico (e-mail);
• Mensagem ou texto livre redigido pelo titular;
• Quaisquer outros dados que o titular opte por incluir voluntariamente.

Esses dados serão tratados exclusivamente para a finalidade para a qual foram fornecidos (resposta a dúvida, envio de atualização de conteúdo etc.), e não serão utilizados para finalidades distintas sem novo consentimento expresso do titular.

4.3. Dados que não coletamos

Este portal não coleta, não solicita e não armazena, em nenhuma hipótese, as seguintes categorias de dados:

• Número de CPF ou de qualquer outro documento de identificação;
• Dados de cartão de crédito, débito ou qualquer instrumento de pagamento;
• Dados bancários ou financeiros;
• Senhas, tokens de acesso ou credenciais de autenticação;
• Dados biométricos de qualquer natureza;
• Dados relativos à saúde ou situação médica;
• Dados de geolocalização precisa em tempo real;
• Conteúdo de comunicações privadas (mensagens, e-mails pessoais, chats).`,
  },
  {
    titulo: '5. Finalidade do tratamento de dados',
    conteudo: `Os dados pessoais coletados por este portal são tratados para as seguintes finalidades, todas elas legítimas, específicas, explícitas e informadas ao titular antes ou no momento da coleta:

5.1. Funcionamento técnico do site
Garantir o carregamento correto das páginas, a integridade dos recursos disponíveis (textos, imagens, estrutura de navegação) e o funcionamento dos mecanismos de segurança implementados, incluindo proteção contra acesso não autorizado e ataques de negação de serviço (DDoS). Essa finalidade sustenta-se na base legal de legítimo interesse do controlador (art. 7º, IX, da LGPD) e é absolutamente necessária para a existência e operação do portal.

5.2. Análise de audiência e melhoria do conteúdo
Compreender como os visitantes utilizam o portal — quais seções são mais acessadas, em quais páginas o interesse é menor, quais dispositivos são utilizados, de quais regiões do país provêm os acessos — para aprimorar continuamente a qualidade, relevância e organização do conteúdo educacional disponibilizado. Os dados são tratados exclusivamente de forma agregada e anonimizada, sem vinculação a qualquer identidade individual.

5.3. Diagnóstico de erros e incidentes técnicos
Identificar, registrar e corrigir erros técnicos no funcionamento do portal, como páginas que não carregam, links quebrados, lentidão no carregamento ou falhas em funcionalidades interativas. Os dados de navegação podem ser consultados retroativamente para reconstruir o contexto de um incidente e corrigi-lo com eficiência.

5.4. Atendimento a solicitações dos titulares
Responder a mensagens, solicitações de acesso, correção, eliminação ou portabilidade de dados, e a quaisquer outras comunicações enviadas pelos titulares por meio dos canais de contato disponibilizados.

5.5. Cumprimento de obrigações legais e regulatórias
Manter registros de acesso pelo prazo mínimo de seis meses, conforme exigido pelo art. 15 da Lei nº 12.965/2014 (Marco Civil da Internet). Atender a eventuais requisições de autoridades públicas competentes, ordens judiciais ou determinações administrativas da ANPD, sempre nos limites estritos da legislação aplicável.

Nenhum dado pessoal coletado neste portal será utilizado para fins de publicidade comportamental, perfilamento individual, venda de listas de contatos, marketing direto não solicitado ou qualquer finalidade incompatível com as listadas acima.`,
  },
  {
    titulo: '6. Base legal para o tratamento (LGPD)',
    conteudo: `Todo tratamento de dados pessoais realizado por este portal possui amparo em ao menos uma das bases legais previstas nos artigos 7º e 11 da Lei Federal nº 13.709/2018 (LGPD). A seguir, detalhamos as bases legais aplicáveis a cada atividade de tratamento:

Legítimo interesse do controlador (art. 7º, IX): fundamenta o tratamento de dados técnicos de navegação para fins de funcionamento do site, análise de audiência agregada, diagnóstico de incidentes e segurança da informação. Este legítimo interesse foi objeto de avaliação de necessidade e proporcionalidade, sendo confirmado que os benefícios da atividade de tratamento superam os riscos aos direitos e liberdades dos titulares, especialmente em razão da anonimização aplicada aos dados.

Cumprimento de obrigação legal ou regulatória (art. 7º, II): fundamenta a manutenção de registros de acesso pelo prazo mínimo de 6 (seis) meses, exigida pelo art. 15 da Lei nº 12.965/2014, e o atendimento a determinações de autoridades competentes.

Consentimento do titular (art. 7º, I): fundamenta o tratamento de dados pessoais fornecidos voluntariamente por meio de formulários de contato, inscrição em listas de atualização ou quaisquer outros campos opcionais disponibilizados no portal. O consentimento, quando necessário, é coletado de forma livre, informada, inequívoca e destacada, e pode ser revogado a qualquer momento.

Exercício regular de direitos em processo judicial, administrativo ou arbitral (art. 7º, VI): fundamenta a manutenção de dados na hipótese em que sejam necessários para defesa de direitos em eventual litígio.

Em nenhuma hipótese realizamos tratamento de dados pessoais sensíveis conforme definidos no art. 5º, II, da LGPD, ressalvadas situações em que o próprio titular os forneça voluntariamente e de forma explícita por meio dos canais de contato, hipótese em que o tratamento se fundamenta no consentimento específico e destacado (art. 11, I, da LGPD).`,
  },
  {
    titulo: '7. Compartilhamento e transferência de dados',
    conteudo: `Este portal adota uma política restritiva de compartilhamento de dados pessoais. Não vendemos, alugamos, cedemos, comercializamos ou transferimos dados pessoais a terceiros para fins de publicidade, prospecção comercial, marketing de terceiros ou qualquer outra finalidade mercantil.

O compartilhamento de dados ocorre exclusivamente nas seguintes situações, todas elas necessárias e proporcionais:

7.1. Provedores de serviço (operadores de dados)
Empresas terceiras que prestam serviços técnicos essenciais à operação do portal, como infraestrutura de hospedagem, serviços de CDN (rede de entrega de conteúdo), proteção contra ataques (firewall de aplicação web) e análise de audiência. Esses provedores atuam como operadores de dados, nos termos do art. 5º, VII, da LGPD, e estão contratualmente obrigados a tratar os dados exclusivamente para as finalidades autorizadas pelo controlador, com medidas de segurança equivalentes ou superiores às adotadas por este portal. Os principais operadores incluem Google LLC (Google Analytics, com anonimização de IP ativada) e o provedor de hospedagem do portal.

7.2. Requisições legais
Podemos divulgar dados pessoais quando legalmente obrigados a fazê-lo em razão de ordem judicial, requerimento de autoridade policial, determinação administrativa da ANPD ou outra exigência legal aplicável, sempre nos estritos limites da solicitação e após verificação de sua legitimidade formal.

7.3. Defesa de direitos
Podemos utilizar dados pessoais armazenados para defesa de nossos direitos em procedimentos judiciais, administrativos ou arbitrais, nos termos do art. 7º, VI, da LGPD.

Transferência internacional de dados: os serviços de análise de audiência utilizados neste portal podem implicar transferência de dados anonimizados para servidores localizados nos Estados Unidos da América ou em outros países que oferecem nível adequado de proteção de dados, conforme avaliação da Comissão Europeia e/ou das autoridades brasileiras competentes. Os contratos celebrados com esses fornecedores incluem cláusulas de proteção de dados equivalentes às exigidas pela LGPD.`,
  },
  {
    titulo: '8. Prazo de retenção e eliminação de dados',
    conteudo: `Os dados pessoais coletados por este portal são retidos pelo menor prazo necessário ao cumprimento das finalidades para as quais foram coletados, respeitando os prazos mínimos estabelecidos pela legislação vigente:

Registros de acesso (logs de navegação com endereço IP): retidos pelo prazo mínimo de 6 (seis) meses, conforme exigência expressa do art. 15 da Lei nº 12.965/2014 (Marco Civil da Internet), e pelo prazo máximo de 12 (doze) meses em formato anonimizado para fins estatísticos.

Dados de audiência agregados e anonimizados (Google Analytics): retidos por até 26 (vinte e seis) meses, conforme configuração padrão da ferramenta, sendo que nenhum desses dados permite a identificação individual do visitante.

Dados fornecidos voluntariamente por formulários de contato: retidos pelo prazo necessário ao atendimento da solicitação, acrescido de até 12 (doze) meses para fins de comprovação do atendimento prestado, exceto se prazo superior for exigido por lei ou regulamento aplicável.

Dados utilizados para defesa em litígios: retidos pelo prazo prescricional aplicável à natureza do litígio, que no direito brasileiro pode variar entre 1 (um) e 10 (dez) anos conforme o Código Civil e legislação específica.

Ao final do prazo aplicável, os dados são eliminados de forma segura e irreversível, utilizando métodos que impedem qualquer recuperação, ou anonimizados de forma que a reidentificação do titular se torne impossível com os meios técnicos razoavelmente disponíveis.`,
  },
  {
    titulo: '9. Segurança das informações',
    conteudo: `Este portal adota medidas técnicas e organizacionais adequadas para proteger os dados pessoais que trata contra acesso não autorizado, uso indevido, divulgação, alteração, perda ou destruição acidental ou ilícita. As medidas implementadas incluem:

Medidas técnicas:
• Protocolo de comunicação segura HTTPS/TLS 1.2 ou superior em todas as páginas do portal, garantindo a criptografia de todos os dados transmitidos entre o navegador do visitante e os servidores;
• Certificados digitais válidos emitidos por autoridade certificadora reconhecida, com renovação periódica;
• Controle de acesso restrito aos sistemas de gerenciamento do portal, com autenticação multifatorial para administradores;
• Monitoramento contínuo de tentativas de acesso não autorizado, incluindo proteção contra ataques de força bruta e injeção de código (SQL injection, XSS, CSRF);
• Atualizações regulares de software, plugins e dependências para correção de vulnerabilidades conhecidas;
• Backups criptografados dos dados armazenados, realizados com periodicidade mínima diária, mantidos em local seguro e fisicamente separado do servidor principal.

Medidas organizacionais:
• Acesso aos dados pessoais restrito a colaboradores e prestadores de serviço que necessitem processá-los para desempenhar suas funções, submetidos a obrigações contratuais de confidencialidade;
• Política interna de uso aceitável dos sistemas de informação;
• Avaliação periódica das medidas de segurança adotadas e revisão em caso de identificação de novas ameaças ou vulnerabilidades.

Nenhum sistema de segurança é absolutamente infalível. Em caso de incidente de segurança que resulte em acesso não autorizado a dados pessoais, notificaremos os titulares afetados e a Autoridade Nacional de Proteção de Dados (ANPD) nos prazos estabelecidos pela LGPD e pelas normas regulamentares editadas pela ANPD, fornecendo informações claras sobre a natureza do incidente, as categorias de dados afetados e as medidas adotadas para mitigação.`,
  },
  {
    titulo: '10. Direitos dos titulares de dados',
    conteudo: `A Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018) garante ao titular de dados pessoais um conjunto robusto de direitos, que podem ser exercidos a qualquer momento mediante solicitação ao controlador. Este portal compromete-se a responder a todas as solicitações de exercício de direitos no prazo de até 15 (quinze) dias úteis, conforme estabelecido na LGPD.

Os direitos garantidos pela LGPD e assegurados por este portal são:

Direito de confirmação (art. 18, I): direito de obter confirmação sobre a existência de tratamento de dados pessoais que lhe dizem respeito.

Direito de acesso (art. 18, II): direito de acessar os dados pessoais que este portal mantém sobre você, bem como de obter informações sobre as finalidades do tratamento, as categorias de dados tratados, os destinatários dos dados e o prazo de retenção previsto.

Direito de correção (art. 18, III): direito de solicitar a correção de dados pessoais incompletos, inexatos ou desatualizados.

Direito de anonimização, bloqueio ou eliminação (art. 18, IV): direito de solicitar a anonimização, o bloqueio ou a eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD.

Direito de portabilidade (art. 18, V): direito de solicitar a portabilidade dos dados pessoais a outro fornecedor de serviço ou produto, mediante requisição expressa, de acordo com a regulamentação da ANPD, observados os segredos comercial e industrial.

Direito de informação sobre compartilhamento (art. 18, VII): direito de obter informações sobre entidades públicas e privadas com as quais este portal compartilhou seus dados pessoais.

Direito de revogação do consentimento (art. 18, IX): direito de revogar o consentimento dado para o tratamento de dados pessoais a qualquer momento, por procedimento gratuito e facilitado, sem prejuízo da licitude do tratamento realizado antes da revogação.

Direito de oposição (art. 18, § 2º): direito de se opor ao tratamento de dados pessoais realizado com fundamento em bases legais distintas do consentimento, em caso de descumprimento da LGPD.

Direito de peticionar à ANPD (art. 18, § 1º e art. 55-A): direito de apresentar petição de reclamação contra o controlador perante a Autoridade Nacional de Proteção de Dados.

Para exercer qualquer desses direitos, envie sua solicitação por meio do canal de contato disponível neste portal, indicando claramente: (a) o direito que deseja exercer; (b) informações suficientes para que possamos identificar os dados a que sua solicitação se refere; e (c) prova de sua identidade, para prevenção de fraudes. Não cobramos qualquer valor pelo atendimento de solicitações de exercício de direitos, exceto nos casos em que a solicitação for manifestamente infundada, excessiva ou repetitiva, hipótese em que poderemos cobrar uma taxa razoável ou recusar o atendimento, com justificativa fundamentada.`,
  },
  {
    titulo: '11. Cookies e tecnologias de rastreamento',
    conteudo: `Este portal utiliza cookies e tecnologias similares para os fins descritos nesta Política e detalhados em nossa Política de Cookies, disponível no link correspondente no rodapé desta página. Recomendamos a leitura da Política de Cookies para compreensão completa das tecnologias utilizadas, suas finalidades, duração e formas de gerenciamento pelo titular.

Em síntese, são utilizados três tipos de cookies: cookies estritamente necessários (indispensáveis para o funcionamento do site), cookies analíticos (coletam dados anonimizados de audiência via Google Analytics com anonimização de IP ativada) e cookies funcionais (que memorizam preferências de navegação). Não utilizamos cookies de publicidade comportamental, rastreamento entre sites ou segmentação de audiência para fins de marketing de terceiros.`,
  },
  {
    titulo: '12. Menores de idade',
    conteudo: `Este portal tem como público-alvo adultos interessados em processos seletivos públicos federais. Não coletamos, de forma intencional, dados pessoais de crianças (menores de 12 anos) ou adolescentes (entre 12 e 18 anos), sem o consentimento expresso e verificável de um dos pais ou responsável legal, conforme exigido pelo art. 14 da LGPD e pelo art. 227 da Constituição Federal.

Se tivermos razões para acreditar que dados de menores foram coletados sem o consentimento adequado dos responsáveis legais, tomaremos providências imediatas para eliminação desses dados. Caso você seja responsável legal por uma criança ou adolescente e acredite que seus dados foram indevidamente coletados, entre em contato conosco pelo e-mail indicado nesta Política para que possamos adotar as medidas cabíveis com a máxima brevidade.`,
  },
  {
    titulo: '13. Links para sites de terceiros',
    conteudo: `Este portal pode conter referências e links para sites externos, como o Diário Oficial da União (in.gov.br), sites de bancas organizadoras e outras fontes de informação pública. Essas referências são fornecidas exclusivamente para orientação do visitante e não implicam qualquer forma de parceria, patrocínio, endosso ou responsabilidade por parte deste portal em relação ao conteúdo, à disponibilidade ou às práticas de privacidade dos sites de destino.

Cada site externo possui sua própria política de privacidade e termos de uso, pelos quais somos inteiramente alheios. Recomendamos fortemente que você leia os documentos legais de cada site que visitar antes de fornecer quaisquer dados pessoais.`,
  },
  {
    titulo: '14. Alterações nesta Política de Privacidade',
    conteudo: `Esta Política de Privacidade pode ser revisada e atualizada periodicamente para refletir mudanças nas práticas de tratamento de dados deste portal, alterações na legislação aplicável (incluindo novas normas editadas pela ANPD), mudanças tecnológicas ou aprimoramentos nas medidas de segurança adotadas.

A data da última atualização desta Política está indicada logo abaixo do título, no início desta página. Recomendamos que você revise esta Política periodicamente para se manter informado sobre como seus dados são tratados.

Alterações significativas que impliquem expansão das finalidades de tratamento, novos tipos de dados coletados ou novos compartilhamentos com terceiros serão comunicadas de forma destacada no portal, por meio de banner informativo ou outro mecanismo equivalente de notificação. O uso continuado do portal após a publicação de alterações implica aceitação das disposições atualizadas.`,
  },
  {
    titulo: '15. Legislação aplicável e foro competente',
    conteudo: `Esta Política é regida pela legislação brasileira, em especial pela LGPD (Lei nº 13.709/2018), pelo Marco Civil da Internet (Lei nº 12.965/2014), pelo Decreto nº 8.771/2016 e pelas normas da ANPD.

Para questões não resolvidas diretamente com o responsável, fica eleito o foro da Comarca de ${getSiteConfig().cidade}, ${getSiteConfig().estado}, com renúncia a qualquer outro foro.

Antes de acionar o Judiciário, o titular pode registrar reclamação perante a ANPD em www.gov.br/anpd.`,
  },
  {
    titulo: '16. Contato e canal de atendimento ao titular',
    conteudo: `Para exercer seus direitos como titular de dados pessoais, esclarecer dúvidas sobre esta Política, solicitar informações sobre o tratamento de seus dados ou registrar uma reclamação, utilize exclusivamente os seguintes canais:

Todas as solicitações devem ser enviadas a partir do endereço de e-mail vinculado aos dados cujo tratamento é objeto da solicitação (ou acompanhadas de documento que comprove a identidade do solicitante), para prevenção de fraudes e preservação dos direitos do titular legítimo.

O prazo de resposta é de até 15 (quinze) dias úteis, contados da data do protocolo da solicitação. Em casos de complexidade excepcional, esse prazo poderá ser prorrogado uma única vez, por período equivalente, mediante comunicação fundamentada ao solicitante.

Este portal não dispõe de encarregado de proteção de dados (DPO) formalmente nomeado, pois o volume e a natureza dos dados tratados não atingem os thresholds que tornam a nomeação obrigatória nos termos das normas vigentes da ANPD. Eventuais alterações nessa situação serão refletidas nesta Política na próxima atualização.`,
  },
]; }

export default function PoliticaPrivacidadePage() {
  const sections = buildSections();
  return (
    <div style={{ fontFamily:"'Google Sans','Roboto',Arial,sans-serif",color:'#202124',background:'#fff',minHeight:'100vh',display:'flex',flexDirection:'column' }}>
      <AgHeader />
      <main style={{ flex:1,maxWidth:860,margin:'0 auto',padding:'64px 24px 100px',width:'100%' }}>

        <span style={{ fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:1.2,color:'#4285F4' }}>Legal</span>
        <h1 style={{ fontSize:40,fontWeight:800,color:'#202124',margin:'12px 0 8px',lineHeight:1.2 }}>Política de Privacidade</h1>
        <p style={{ fontSize:13,color:'#80868B',marginBottom:16 }}>Última atualização: 01 de abril de 2026</p>

        <div style={{ background:'#F0FDF4',border:'1px solid #C5D8FB',borderRadius:10,padding:'18px 22px',marginBottom:52 }}>
          <p style={{ fontSize:14,color:'#1A73E8',lineHeight:1.75,margin:0 }}>
            <strong>ℹ️ Resumo:</strong> Este portal coleta apenas dados técnicos de navegação, anonimizados, para funcionamento e melhoria do site. Não coletamos CPF, dados financeiros ou dados pessoais sensíveis. Não vendemos nem compartilhamos dados para publicidade. Seus direitos como titular (LGPD) estão detalhados na seção 10 abaixo.
          </p>
        </div>

        {/* índice */}
        <nav style={{ background:'#F8F9FA',borderRadius:12,padding:'24px 28px',marginBottom:52 }}>
          <p style={{ fontSize:12,fontWeight:800,textTransform:'uppercase',letterSpacing:1,color:'#80868B',marginBottom:14 }}>Índice</p>
          <ol style={{ margin:0,padding:'0 0 0 18px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px 24px' }}>
            {sections.map((s,i)=>(
              <li key={i} style={{ fontSize:13,color:'#4285F4',lineHeight:1.6 }}>
                <a href={`#s${i+1}`} style={{ color:'inherit',textDecoration:'none' }}
                  onMouseEnter={e=>e.currentTarget.style.textDecoration='underline'}
                  onMouseLeave={e=>e.currentTarget.style.textDecoration='none'}>
                  {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {sections.map((s,i)=>(
          <section key={i} id={`s${i+1}`} style={{ marginBottom:48, scrollMarginTop:80 }}>
            <h2 style={H2}>{s.titulo}</h2>
            <div style={{ fontSize:15,color:'#5F6368',lineHeight:1.95,whiteSpace:'pre-line' }}>{s.conteudo}</div>
          </section>
        ))}

      </main>
      <AgFooter />
    </div>
  );
}
