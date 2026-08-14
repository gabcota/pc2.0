import { AgHeader } from '@/components/AgHeader';
import { AgFooter } from '@/components/AgFooter';
import { getSiteConfig } from '@/lib/siteConfig';

const H2 = { fontSize:21, fontWeight:800, color:'#202124', marginBottom:14, paddingBottom:12, borderBottom:'1px solid #DADCE0' } as const;

function buildSections() { return [
  {
    titulo: '1. Aceitação dos Termos',
    conteudo: `Ao acessar este site, você declara ter lido e concordado com os termos deste documento, com a Política de Privacidade, com o Aviso de Isenção de Responsabilidade e com a Política de Cookies, todos disponíveis no rodapé do portal.

Se não concordar com qualquer ponto, encerre o acesso imediatamente. O uso continuado do portal equivale à aceitação dos termos vigentes.

Podemos alterar estes Termos a qualquer momento. A data da última revisão está indicada no início deste documento. Mudanças relevantes serão destacadas na página inicial por pelo menos 30 dias.`,
  },
  {
    titulo: '2. Identificação e natureza do portal',
    conteudo: `Este site é de propriedade e operado exclusivamente por ${getSiteConfig().razaoSocial}, CNPJ ${getSiteConfig().cnpjFormatted}, com sede em ${getSiteConfig().enderecoCompleto}.

O portal é uma plataforma privada de assessoria educacional, dedicada a orientar candidatos interessados no Processo Seletivo Simplificado (PSS) 2026 — incluindo os cargos de Recenseador, Agente Censitário Administrativo, Agente Censitário de Informática, Agente Censitário Supervisor, Agente Operacional Regional e Analista — por meio de plano de estudos personalizado e acompanhamento individual.

Este portal NÃO é, em nenhuma hipótese:
• Um órgão público, autarquia ou entidade governamental de qualquer esfera;
• Canal oficial do IBGE, de qualquer órgão federal, Ministério ou entidade do Governo;
• Representante ou parceiro de bancas organizadoras de processos seletivos;
• Prestador de serviços jurídicos ou advocacia;
• Plataforma de inscrição em processos seletivos públicos.

O acesso ao conteúdo deste portal não estabelece nenhum vínculo jurídico entre o Usuário e os proprietários além do descrito nestes Termos.`,
  },
  {
    titulo: '3. Objeto e conteúdo disponibilizado',
    conteudo: `3.1. Conteúdo educacional e informativo

O objeto principal deste portal é a prestação de serviços de assessoria educacional para candidatos ao Processo Seletivo Simplificado (PSS) 2026. O serviço disponibilizado inclui, sem se limitar a:

• Análise individual de elegibilidade para cargos federais;
• Plano de estudos personalizado conforme o edital vigente;
• Mentoria individual via WhatsApp com tutor dedicado;
• Orientações sobre metodologia de estudo e cronogramas sugeridos;
• Acompanhamento em todas as fases do processo seletivo;
• Perguntas frequentes (FAQ) com respostas baseadas nas dúvidas mais comuns de candidatos.

3.2. Natureza orientativa e não vinculante

Todo o conteúdo publicado neste portal tem caráter estritamente orientativo e não vinculante. As informações disponibilizadas não substituem, em nenhuma hipótese, a consulta direta ao edital oficial publicado no Diário Oficial da União, às comunicações oficiais da banca organizadora ou a assessoramento jurídico especializado.

3.3. Fontes de informação

O conteúdo deste portal é produzido com base em fontes públicas, incluindo editais publicados no Diário Oficial da União, portarias ministeriais, resoluções, legislação federal aplicável, jurisprudência de tribunais superiores e informações oficialmente divulgadas pelas bancas organizadoras. A data de elaboração ou atualização de cada conteúdo pode ser inferida pela data de publicação da respectiva seção ou artigo.`,
  },
  {
    titulo: '4. Limitações, isenções e responsabilidades',
    conteudo: `4.1. Imprecisão e desatualização das informações

O conteúdo deste portal pode ficar desatualizado em razão de alterações supervenientes nos editais, publicação de retificações, mudanças na legislação aplicável, alterações nas regulamentações das bancas organizadoras ou mudanças nas políticas internas dos órgãos realizadores dos processos seletivos. O portal não garante a completude, exatidão, atualidade ou adequação das informações publicadas a qualquer situação específica do Usuário.

4.2. Ausência de garantia de resultado

O uso do conteúdo deste portal não garante, em nenhuma hipótese, a aprovação do Usuário em qualquer etapa de qualquer processo seletivo, a obtenção de qualificação mínima em provas, a superação de fases de avaliação física, psicológica ou de investigação social, ou qualquer outro resultado específico no processo de seleção.

4.3. Responsabilidade exclusiva do candidato

É responsabilidade exclusiva do candidato: (i) verificar sua elegibilidade para o cargo pretendido mediante leitura integral do edital; (ii) efetuar a inscrição dentro dos prazos estabelecidos; (iii) acompanhar todas as publicações e retificações do edital; (iv) comparecer às etapas nos locais, datas e horários oficialmente divulgados; (v) portar os documentos exigidos em cada fase; e (vi) cumprir integralmente todas as exigências do edital para habilitação e investidura no cargo.

4.4. Limitação de responsabilidade civil

Na máxima extensão permitida pela legislação brasileira vigente, este portal, seus proprietários, colaboradores, parceiros e prestadores de serviço não serão responsabilizados por quaisquer danos diretos, indiretos, incidentais, consequentes, especiais, punitivos ou exemplares, incluindo — sem caráter exaustivo — lucros cessantes, perda de dados, perda de oportunidade de emprego, interrupção de negócios ou qualquer outra perda de natureza imaterial, decorrentes de:

• Uso ou impossibilidade de uso das informações disponíveis neste portal;
• Decisões tomadas com base, exclusiva ou parcialmente, no conteúdo aqui veiculado;
• Imprecisão, desatualização ou incompletude de qualquer informação publicada;
• Eliminação em qualquer etapa de processo seletivo;
• Indisponibilidade, interrupção ou lentidão no acesso ao portal;
• Acesso não autorizado a dados do Usuário por falha de segurança de terceiros.`,
  },
  {
    titulo: '5. Propriedade intelectual e direitos autorais',
    conteudo: `5.1. Conteúdo de propriedade do portal

Todo o conteúdo original produzido e publicado neste portal — incluindo, sem se limitar a, textos, artigos, guias, resumos, cronogramas, listas de disciplinas, estrutura editorial, layout gráfico, identidade visual, logotipo, paleta de cores, tipografia, ícones desenvolvidos internamente, código-fonte das páginas e quaisquer outros elementos criativos — é de titularidade exclusiva do operador deste portal e está protegido pelas disposições da Lei Federal nº 9.610/1998 (Lei de Direitos Autorais) e demais instrumentos de propriedade intelectual aplicáveis.

5.2. Uso permitido

É autorizado ao Usuário, para uso estritamente pessoal e não comercial: (i) visualizar o conteúdo deste portal em seu dispositivo, durante o acesso ao site; (ii) imprimir ou salvar cópias individuais de páginas para consulta pessoal offline; (iii) compartilhar links para páginas específicas deste portal em redes sociais ou aplicativos de mensagens, com a devida identificação da fonte.

5.3. Uso vedado

É expressamente proibido, sem autorização prévia e por escrito do titular dos direitos autorais:

• Reproduzir, copiar ou transcrever, integral ou parcialmente, qualquer conteúdo deste portal em outros sites, blogs, canais do YouTube, perfis de redes sociais, aplicativos, publicações físicas ou qualquer outro meio de comunicação, com ou sem fins lucrativos;
• Criar obras derivadas com base no conteúdo original deste portal;
• Utilizar o nome, logotipo, marca ou identidade visual deste portal para qualquer finalidade, incluindo fins educacionais, sem autorização expressa;
• Realizar coleta automatizada de dados (web scraping, crawling, data mining ou similares) sem autorização expressa;
• Remover, ocultar ou alterar avisos de direitos autorais, marcas ou outras indicações de propriedade presentes no conteúdo.

A violação destas disposições sujeitará o infrator às sanções civis e penais previstas na legislação brasileira de propriedade intelectual, incluindo indenização por danos materiais e morais.`,
  },
  {
    titulo: '6. Conduta esperada e vedações ao Usuário',
    conteudo: `O Usuário concorda em utilizar este portal de forma lícita, ética e em conformidade com a legislação brasileira vigente, com os presentes Termos de Uso e com os bons costumes. Em especial, o Usuário compromete-se a não:

• Utilizar o portal para fins ilícitos, fraudulentos ou contrários à moral e à ordem pública;
• Realizar, facilitar ou incitar qualquer atividade que constitua crime ou contravenção penal, nos termos do Código Penal Brasileiro, do Código de Processo Penal ou de legislação especial;
• Acessar, ou tentar acessar, áreas restritas do portal ou de sistemas de informação associados sem autorização expressa;
• Introduzir, transmitir ou distribuir vírus, malware, ransomware, spyware, adware ou qualquer outro código malicioso que possa danificar, sobrecarregar ou comprometer o funcionamento do portal ou dos dispositivos de outros usuários;
• Realizar tentativas de interferência no funcionamento dos servidores ou da infraestrutura de rede do portal, incluindo ataques de negação de serviço (DoS/DDoS), injeção de código (SQL injection, XSS, CSRF) ou qualquer outra técnica de exploração de vulnerabilidades;
• Publicar, transmitir ou disseminar conteúdo falso, difamatório, caluniante, injurioso, discriminatório, obsceno ou que viole direitos de personalidade de terceiros;
• Fazer-se passar por outra pessoa, entidade, órgão público ou representante oficial para obter qualquer vantagem ou prejudicar terceiros;
• Utilizar o portal para coleta ou tratamento de dados pessoais de terceiros sem o consentimento destes, em violação à LGPD ou a qualquer outra norma de proteção de dados;
• Impedir ou dificultar o acesso de outros usuários ao portal.

O descumprimento de qualquer das vedações acima poderá resultar em: (i) bloqueio imediato do acesso ao portal; (ii) responsabilização civil por perdas e danos; (iii) responsabilização criminal perante as autoridades competentes; e (iv) comunicação às autoridades de segurança pública competentes, se o comportamento configurar ilícito penal.`,
  },
  {
    titulo: '7. Links e referências a sites externos',
    conteudo: `Este portal pode conter referências, citações e hyperlinks para sites externos — como o Diário Oficial da União (in.gov.br), sites de bancas organizadoras de processos seletivos, portais de legislação (planalto.gov.br) e outros recursos de informação pública — com finalidade exclusivamente orientativa, para que o Usuário possa acessar as fontes primárias de informação.

A presença de um link para um site externo neste portal não implica, em nenhuma hipótese: (i) parceria ou acordo comercial entre este portal e o titular do site de destino; (ii) patrocínio, endosso ou aprovação do conteúdo disponível no site de destino; (iii) recomendação dos produtos, serviços ou informações disponíveis no site de destino; ou (iv) responsabilidade deste portal pelo conteúdo, disponibilidade, práticas de privacidade ou segurança do site de destino.

Este portal não possui controle sobre sites de terceiros e não pode ser responsabilizado por: (i) alterações no conteúdo do site de destino após a inclusão do link neste portal; (ii) disponibilidade ou indisponibilidade do site de destino; (iii) tratamento de dados pessoais realizado pelo site de destino; ou (iv) quaisquer danos causados ao Usuário em razão do acesso a sites externos referenciados.

O Usuário acessa qualquer site externo referenciado por sua exclusiva conta e risco, e é responsável por verificar as condições de uso, políticas de privacidade e segurança de cada site visitado.`,
  },
  {
    titulo: '8. Disponibilidade, manutenção e interrupções',
    conteudo: `Este portal é disponibilizado "no estado em que se encontra" (as is) e "conforme disponível" (as available). Não garantimos: (i) que o portal estará disponível de forma ininterrupta, 24 horas por dia, 7 dias por semana, 365 dias por ano; (ii) que o acesso ao portal será livre de erros, falhas, lentidão ou interrupções; (iii) que os servidores que hospedam o portal estão livres de vírus ou outros componentes prejudiciais; ou (iv) que os resultados obtidos pelo uso do portal atenderão às expectativas ou necessidades específicas do Usuário.

Podem ocorrer interrupções no acesso ao portal em razão de: manutenção programada (realizada, sempre que possível, em horários de menor tráfego, com aviso prévio); falhas técnicas imprevisíveis nos servidores, na rede de comunicações ou em sistemas de terceiros dos quais o portal depende; ataques cibernéticos; caso fortuito ou força maior, incluindo desastres naturais, falhas de energia, interrupções em serviços essenciais de telecomunicações e determinações governamentais.

Não somos responsáveis por quaisquer danos, prejuízos ou perdas — de qualquer natureza — sofridos pelo Usuário em razão de interrupções, indisponibilidade ou lentidão no acesso ao portal.`,
  },
  {
    titulo: '9. Comunicações e notificações',
    conteudo: `Todas as comunicações e notificações relacionadas a estes Termos de Uso, à Política de Privacidade ou a qualquer outro aspecto do relacionamento entre o Usuário e este portal deverão ser realizadas por escrito, pelo canal de contato disponível neste portal.

Este portal poderá utilizar, a seu exclusivo critério, os seguintes meios de comunicação com o Usuário: (i) publicação de aviso em destaque na página inicial do portal; (ii) atualização de documentos legais com nova data de revisão; (iii) comunicação direta por e-mail, quando o Usuário tenha fornecido voluntariamente seu endereço eletrônico e não tenha revogado o consentimento para recebimento de comunicações.

O Usuário é responsável por manter seu endereço de e-mail atualizado no cadastro deste portal (quando aplicável) e por verificar regularmente a caixa de entrada e a pasta de spam. Comunicações enviadas para o último endereço de e-mail fornecido pelo Usuário serão consideradas válidas e efetivas, independentemente de efetivo recebimento.`,
  },
  {
    titulo: '10. Modificações ao conteúdo e ao portal',
    conteudo: `Este portal reserva-se o direito de, a qualquer momento e sem aviso prévio: (i) modificar, suspender, descontinuar ou encerrar, temporária ou permanentemente, qualquer parte ou a totalidade do portal; (ii) adicionar, remover, alterar ou reorganizar qualquer seção, recurso, funcionalidade ou conteúdo; (iii) alterar o layout, design, identidade visual ou estrutura de navegação; (iv) suspender o acesso de usuários que violem estes Termos de Uso.

A eventual descontinuação total ou parcial do portal não gerará qualquer direito de indenização ao Usuário, uma vez que o acesso ao portal é disponibilizado gratuitamente e sem qualquer contraprestação.`,
  },
  {
    titulo: '11. Isenção de garantias',
    conteudo: `NA MÁXIMA EXTENSÃO PERMITIDA PELA LEGISLAÇÃO BRASILEIRA APLICÁVEL, ESTE PORTAL, SEUS PROPRIETÁRIOS, COLABORADORES E PRESTADORES DE SERVIÇO ISENTAM-SE DE TODAS AS GARANTIAS, EXPRESSAS OU IMPLÍCITAS, INCLUINDO, SEM LIMITAÇÃO:

• Garantia de adequação do conteúdo a uma finalidade específica;
• Garantia de precisão, completude, atualidade ou confiabilidade das informações;
• Garantia de que o acesso ao portal será ininterrupto, seguro ou livre de erros;
• Garantia de que os defeitos identificados serão corrigidos;
• Garantia de que o portal ou os servidores que o hospedam estão livres de vírus ou outros componentes prejudiciais.

Nenhuma informação, orientação ou conselho fornecido por este portal, seja verbalmente, por escrito ou por qualquer outro meio, criará qualquer garantia que não esteja expressamente prevista nestes Termos.`,
  },
  {
    titulo: '12. Força maior e caso fortuito',
    conteudo: `Este portal não será responsável pelo descumprimento ou pelo cumprimento tardio de qualquer obrigação prevista nestes Termos quando tal descumprimento ou atraso resultar de circunstâncias fora de seu controle razoável, incluindo — sem caráter exaustivo — desastres naturais, epidemias, pandemias, guerras, atos de terrorismo, greves, tumultos civis, falhas de infraestrutura de telecomunicações, interrupções no fornecimento de energia elétrica, ataques cibernéticos de grande escala, falhas de sistemas de terceiros dos quais o portal depende, e determinações de autoridades governamentais.

Na ocorrência de evento de força maior ou caso fortuito, as obrigações deste portal ficarão suspensas pelo período de duração da situação excepcional, sem que isso implique qualquer responsabilização ou direito de indenização ao Usuário.`,
  },
  {
    titulo: '13. Integralidade do acordo',
    conteudo: `Estes Termos de Uso, em conjunto com a Política de Privacidade, o Aviso de Isenção de Responsabilidade e a Política de Cookies — todos disponíveis neste portal —, constituem o acordo integral entre o Usuário e este portal no que diz respeito ao acesso e uso do site, e substituem todos os acordos, entendimentos, representações e garantias anteriores, verbais ou escritos, sobre o mesmo objeto.

Se qualquer disposição destes Termos for considerada inválida, ilegal ou inexequível por qualquer tribunal ou autoridade competente, tal disposição será modificada na medida mínima necessária para torná-la válida, legal e exequível. As demais disposições continuarão em pleno vigor e efeito, não sendo afetadas pela invalidade da cláusula modificada.

A eventual omissão deste portal em exigir o cumprimento de qualquer disposição destes Termos não constituirá renúncia a tal disposição ou ao direito de exigi-la no futuro.`,
  },
  {
    titulo: '14. Legislação aplicável e foro competente',
    conteudo: `Estes Termos são regidos pela legislação brasileira, em especial pelo Código Civil (Lei nº 10.406/2002), pelo Código de Defesa do Consumidor (Lei nº 8.078/1990), pelo Marco Civil da Internet (Lei nº 12.965/2014) e pela LGPD (Lei nº 13.709/2018).

Fica eleito o foro da Comarca de ${getSiteConfig().cidade}, ${getSiteConfig().estado}, para dirimir controvérsias, com renúncia a qualquer outro foro.

Antes de acionar o Judiciário, as partes comprometem-se a buscar solução amigável por meio dos canais de contato disponíveis neste portal, no prazo de até 30 dias.`,
  },
  {
    titulo: '15. Contato',
    conteudo: `Dúvidas, sugestões, reclamações ou quaisquer outras comunicações referentes a estes Termos de Uso podem ser encaminhadas por meio do canal de contato disponível neste portal.

O prazo para resposta a comunicações gerais é de até 5 (cinco) dias úteis. Para solicitações envolvendo dados pessoais (exercício de direitos nos termos da LGPD), o prazo é de até 15 (quinze) dias úteis, conforme previsto na lei.`,
  },
]; }

export default function TermosDeUsoPage() {
  const sections = buildSections();
  return (
    <div style={{ fontFamily:"'Google Sans','Roboto',Arial,sans-serif",color:'#202124',background:'#fff',minHeight:'100vh',display:'flex',flexDirection:'column' }}>
      <AgHeader />
      <main style={{ flex:1,maxWidth:860,margin:'0 auto',padding:'64px 24px 100px',width:'100%' }}>

        <span style={{ fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:1.2,color:'#34A853' }}>Legal</span>
        <h1 style={{ fontSize:40,fontWeight:800,color:'#202124',margin:'12px 0 8px',lineHeight:1.2 }}>Termos de Uso</h1>
        <p style={{ fontSize:13,color:'#80868B',marginBottom:16 }}>Última atualização: 01 de abril de 2026</p>

        <div style={{ background:'#E6F4EA',border:'1px solid #A8D5B5',borderRadius:10,padding:'18px 22px',marginBottom:52 }}>
          <p style={{ fontSize:14,color:'#1E7E34',lineHeight:1.75,margin:0 }}>
            <strong>ℹ️ Em resumo:</strong> Este é um serviço privado de assessoria educacional. Ao acessá-lo, você concorda que o conteúdo é orientativo, não substitui o edital oficial, e que o portal não tem qualquer vínculo com órgãos públicos ou entidades governamentais.
          </p>
        </div>

        {/* índice */}
        <nav style={{ background:'#F8F9FA',borderRadius:12,padding:'24px 28px',marginBottom:52 }}>
          <p style={{ fontSize:12,fontWeight:800,textTransform:'uppercase',letterSpacing:1,color:'#80868B',marginBottom:14 }}>Índice</p>
          <ol style={{ margin:0,padding:'0 0 0 18px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px 24px' }}>
            {sections.map((s,i)=>(
              <li key={i} style={{ fontSize:13,color:'#34A853',lineHeight:1.6 }}>
                <a href={`#t${i+1}`} style={{ color:'inherit',textDecoration:'none' }}
                  onMouseEnter={e=>e.currentTarget.style.textDecoration='underline'}
                  onMouseLeave={e=>e.currentTarget.style.textDecoration='none'}>
                  {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {sections.map((s,i)=>(
          <section key={i} id={`t${i+1}`} style={{ marginBottom:48, scrollMarginTop:80 }}>
            <h2 style={H2}>{s.titulo}</h2>
            <div style={{ fontSize:15,color:'#5F6368',lineHeight:1.95,whiteSpace:'pre-line' }}>{s.conteudo}</div>
          </section>
        ))}

      </main>
      <AgFooter />
    </div>
  );
}
