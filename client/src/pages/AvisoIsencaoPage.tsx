import { AgHeader } from '@/components/AgHeader';
import { AgFooter } from '@/components/AgFooter';
import { getSiteConfig } from '@/lib/siteConfig';

const H2 = { fontSize:21, fontWeight:800, color:'#202124', marginBottom:14, paddingBottom:12, borderBottom:'1px solid #DADCE0' } as const;

function buildSections() { return [
  {
    titulo: '1. Finalidade e escopo deste Aviso',
    conteudo: `Este Aviso explica, de forma clara e direta, os limites da responsabilidade deste portal sobre o conteúdo disponibilizado e o uso que os visitantes fazem dele.

Ao acessar qualquer página deste site, você declara ter lido e aceito as disposições aqui contidas.

Este Aviso abrange: (i) todas as páginas e conteúdos do portal; (ii) guias, orientações, cronogramas e resumos disponibilizados gratuitamente; (iii) informações sobre processos seletivos, cargos, requisitos e etapas; (iv) referências a fontes externas; (v) comunicações realizadas pelos canais de contato.

Este Aviso deve ser lido junto com os Termos de Uso, a Política de Privacidade e a Política de Cookies, disponíveis no rodapé.`,
  },
  {
    titulo: '2. Identificação e desvinculação de órgãos oficiais',
    conteudo: `Este portal é operado por ${getSiteConfig().razaoSocial}, CNPJ ${getSiteConfig().cnpjFormatted}, com sede em ${getSiteConfig().enderecoCompleto}. Trata-se de uma iniciativa privada e independente, sem qualquer vínculo — institucional, contratual, operacional ou financeiro — com:

• O IBGE — Instituto Brasileiro de Geografia e Estatística e demais órgãos e fundações do serviço público federal;
• O Governo Federal do Brasil, seus ministérios, secretarias, autarquias, fundações e empresas públicas;
• O Diário Oficial da União (DOU) e a Imprensa Nacional;
• Bancas organizadoras de processos seletivos, tais como CESPE/Cebraspe, FGV Projetos, IBFC, FCC, VUNESP, Quadrix ou qualquer outra entidade organizadora;
• Órgãos de controle, supervisão ou fiscalização de atividades profissionais (OAB, CRM, CREA, CRQ etc.);
• Associações de servidores, entidades de classe ou sindicatos de servidores públicos federais;
• Cursos preparatórios, plataformas de ensino a distância, editoras de material didático ou qualquer outra entidade educacional privada.

O uso do nome "IBGE" e "PSS IBGE 2026" neste portal ocorre exclusivamente no contexto informativo e educacional, com finalidade de identificar o objeto do conteudo disponibilizado, e nao implica qualquer forma de associacao, parceria, autorizacao, endosso ou patrocinio por parte do orgao mencionado.

A identidade visual e o design deste portal foram desenvolvidos de forma independente e não reproduzem, integralmente ou de forma que possa induzir confusão, a identidade visual oficial de nenhum órgão governamental.`,
  },
  {
    titulo: '3. Isenção quanto à precisão, completude e atualidade das informações',
    conteudo: `3.1. Base das informações

As informacoes disponibilizadas neste portal sao compiladas a partir de fontes publicas — editais de selecao publicados no Diario Oficial da Uniao, portarias, resolucoes, publicacoes oficiais do IBGE e legislacao federal aplicavel — com o objetivo de facilitar o acesso e a compreensao do publico em geral sobre o Processo Seletivo Simplificado do IBGE.

3.2. Ausência de garantia de precisão

Não garantimos, em nenhuma hipótese, que as informações publicadas neste portal são precisas, completas, atualizadas, adequadas para qualquer finalidade específica ou que correspondem ao entendimento oficial dos órgãos realizadores dos processos seletivos. Erros, omissões e imprecisões podem existir no conteúdo publicado, seja em razão de falha humana na compilação e redação do material, seja em razão de alterações nas fontes oficiais após a publicação do conteúdo neste portal.

3.3. Risco de desatualização

Editais de processos seletivos são documentos vivos — sujeitos a retificações, errata, suspensões judiciais, prorrogações de prazo e alterações de toda sorte ao longo de sua vigência. O conteúdo publicado neste portal reflete o estado das informações disponíveis na data de sua elaboração e pode não incorporar alterações supervenientes. O Usuário é exclusivamente responsável por verificar se as informações consultadas neste portal ainda correspondem ao estado atual do edital oficial.

3.4. Interpretações e opiniões

Parte do conteúdo deste portal pode consistir em interpretações, análises, opiniões e recomendações de caráter editorial, elaboradas com base no entendimento dos produtores do conteúdo sobre as fontes consultadas. Essas interpretações não têm força vinculante, não foram validadas pelos órgãos realizadores dos processos seletivos e podem não corresponder à interpretação oficial das bancas organizadoras ou dos órgãos de controle.`,
  },
  {
    titulo: '4. Responsabilidade exclusiva e integral do candidato',
    conteudo: `O candidato a qualquer processo seletivo é o único e exclusivo responsável pelo cumprimento de todas as exigências do edital oficial e pela adoção de todas as providências necessárias à participação regular no processo seletivo. Este portal não assume qualquer responsabilidade por omissões, erros ou decisões do candidato no contexto de sua participação no processo seletivo.

São responsabilidades exclusivas do candidato, de forma não exaustiva:

4.1. Leitura integral do edital
Ler o edital oficial na íntegra, incluindo todos os seus anexos, sem exceção, antes de realizar a inscrição ou adotar qualquer providência relacionada ao processo seletivo. Nenhum resumo, guia ou orientação disponibilizado por este ou qualquer outro portal pode substituir a leitura completa e atenta do documento oficial.

4.2. Verificação de elegibilidade
Confirmar, com base no edital oficial, que atende integralmente a todos os requisitos exigidos para o cargo para o qual pretende concorrer, incluindo — sem se limitar a — formação acadêmica, registro profissional ativo, faixa etária, situação de saúde, situação criminal, situação relativa ao serviço militar e demais condições estabelecidas.

4.3. Acompanhamento de retificações e comunicados
Acompanhar, durante todo o período de vigência do processo seletivo, as publicações no Diário Oficial da União e nos canais oficiais da banca organizadora para verificar a existência de retificações, erratas, cronogramas atualizados, convocações e demais comunicações relevantes.

4.4. Realização da inscrição pelos canais oficiais
Realizar a inscrição exclusivamente pelo sistema oficial indicado no edital, dentro dos prazos estabelecidos, e guardar o comprovante de inscrição. Este portal não oferece, não intermedia e não valida inscrições em processos seletivos.

4.5. Preparo para as etapas do processo
Organizar sua preparação intelectual, física, psicológica e documental para todas as etapas do processo seletivo, sendo de responsabilidade exclusiva do candidato o nível de preparação alcançado.

4.6. Cumprimento de prazos e procedimentos
Comparecer a todas as etapas do processo seletivo nos locais, datas e horários estabelecidos, portando os documentos exigidos, e seguir rigorosamente todos os procedimentos determinados pela banca organizadora em cada fase.`,
  },
  {
    titulo: '5. Isenção quanto a resultados em processos seletivos',
    conteudo: `Este portal, em nenhuma hipótese, garante, promete, sugere ou induz a expectativa de aprovação de qualquer candidato em qualquer etapa de qualquer processo seletivo, incluindo — sem limitação — prova objetiva, prova discursiva, teste de aptidão física, avaliação psicológica, investigação social, exame médico e curso de formação.

O resultado obtido pelo candidato em qualquer fase do processo seletivo decorre exclusivamente do nível de preparação individual, das condições fisiológicas e psicológicas no momento da avaliação, do conteúdo efetivamente cobrado em cada edição do certame, das decisões da banca organizadora quanto à correção das provas e dos critérios de avaliação estabelecidos no edital. Nenhum desses fatores está sob o controle ou influência deste portal.

Depoimentos, relatos ou casos de aprovação eventualmente mencionados neste portal são meramente ilustrativos e não constituem garantia ou previsão de resultado para outros candidatos. Resultados individuais variam significativamente em razão de uma pluralidade de fatores que este portal não tem como controlar ou prever.`,
  },
  {
    titulo: '6. Isenção quanto a informações sobre datas, prazos e cronogramas',
    conteudo: `Informações sobre datas, prazos, cronogramas, locais de prova, gabaritos e resultados divulgadas neste portal têm caráter meramente informativo e podem estar desatualizadas no momento em que o Usuário as consultar. Alterações nos cronogramas dos processos seletivos — decorrentes de adiamentos, suspensões judiciais, prorrogações de prazo, revisões administrativas ou quaisquer outros eventos — podem não estar refletidas no conteúdo publicado neste portal.

A única fonte com validade legal para consulta de datas, prazos e cronogramas de processos seletivos federais é o edital oficial e suas retificações, publicados no Diário Oficial da União e nos canais oficiais da banca organizadora. O Usuário não deve, em nenhuma hipótese, tomar decisões relevantes — como a compra de passagem para o local de prova, o agendamento de licenças no trabalho ou a preparação de documentos para a posse — com base exclusiva nas informações de datas divulgadas neste portal, sem confirmação prévia nas fontes oficiais.`,
  },
  {
    titulo: '7. Isenção quanto a links e referências externas',
    conteudo: `Este portal pode fazer menção a portais externos com finalidade orientativa. A menção a um endereço eletrônico externo não implica parceria, patrocínio, endosso, validação de conteúdo ou qualquer relação de qualquer natureza entre este portal e o titular do site mencionado.

Não controlamos o conteúdo, a disponibilidade, a segurança ou as práticas de privacidade de sites externos. Links para sites de terceiros podem estar desatualizados ou indisponíveis no momento do acesso. O conteúdo de sites externos pode ser alterado sem que este portal tenha ciência ou possibilidade de atualização.

O Usuário que acessar sites externos referenciados neste portal o faz por sua exclusiva conta e risco. Este portal não será responsável por quaisquer danos, prejuízos ou perdas sofridos pelo Usuário em razão do acesso a sites de terceiros, incluindo — sem limitação — vírus, malware, phishing, divulgação não autorizada de dados pessoais ou perda financeira.

Golpistas frequentemente criam sites com aparência idêntica ou muito semelhante a portais governamentais para capturar dados pessoais, credenciais de acesso e informações financeiras de candidatos a processos seletivos. Este portal alerta o Usuário para que sempre verifique o endereço completo da URL antes de inserir qualquer dado em formulários online, especialmente se acessar sites governamentais por meio de links recebidos em aplicativos de mensagens, e-mails ou anúncios pagos.`,
  },
  {
    titulo: '8. Isenção quanto a conteúdo gerado por usuários',
    conteudo: `Na hipótese de este portal disponibilizar seções de comentários, fóruns, campos de sugestão, avaliações ou quaisquer outros recursos que permitam a contribuição de conteúdo por parte dos Usuários, este portal não é responsável pelo conteúdo gerado por terceiros, incluindo sua precisão, completude, legalidade ou adequação.

Conteúdo gerado por usuários reflete exclusivamente as opiniões e experiências de seus autores e não representa, em nenhuma hipótese, a posição editorial deste portal. Não nos responsabilizamos por decisões tomadas com base em relatos, opiniões ou informações fornecidas por outros usuários.

Reservamo-nos o direito de remover, a qualquer momento e sem aviso prévio, qualquer conteúdo gerado por usuários que seja considerado — a nosso exclusivo critério — ilegal, difamatório, caluniante, injurioso, discriminatório, obsceno, enganoso ou contrário a estes Termos de Uso.`,
  },
  {
    titulo: '9. Isenção quanto a interrupções e indisponibilidade',
    conteudo: `Este portal é disponibilizado sem garantia de funcionamento ininterrupto. Podem ocorrer, a qualquer momento e sem aviso prévio, interrupções, indisponibilidade parcial ou total, lentidão, erros de carregamento ou qualquer outra disfunção técnica, seja em razão de manutenção programada, falha técnica, sobrecarga de servidores, ataque cibernético, caso fortuito ou força maior.

Não nos responsabilizamos por quaisquer consequências que o Usuário venha a sofrer em razão de: (i) indisponibilidade do portal no momento em que o Usuário precisasse consultar determinada informação; (ii) lentidão que tenha impedido o Usuário de concluir uma consulta dentro de um prazo específico; (iii) perda de informações que o Usuário tenha tentado salvar ou copiar por meio do portal; ou (iv) qualquer outra disfunção técnica que tenha causado inconveniente ou prejuízo ao Usuário.

Recomendamos que o Usuário salve, em dispositivo de uso pessoal, todas as informações essenciais sobre o processo seletivo de seu interesse, consultadas tanto neste portal quanto nas fontes oficiais, de modo a não depender da disponibilidade deste portal em momentos críticos.`,
  },
  {
    titulo: '10. Limitação de responsabilidade civil — cláusula geral',
    conteudo: `NA MÁXIMA EXTENSÃO PERMITIDA PELA LEGISLAÇÃO BRASILEIRA APLICÁVEL, ESTE PORTAL, SEUS PROPRIETÁRIOS, ADMINISTRADORES, COLABORADORES, PARCEIROS E PRESTADORES DE SERVIÇO NÃO SERÃO RESPONSABILIZADOS POR QUAISQUER DANOS DIRETOS, INDIRETOS, INCIDENTAIS, ESPECIAIS, EXEMPLARES, PUNITIVOS OU CONSEQUENTES, INCLUINDO — SEM CARÁTER EXAUSTIVO:

• Lucros cessantes de qualquer natureza;
• Perda de oportunidade de emprego ou aprovação em processo seletivo;
• Danos à reputação ou imagem do Usuário;
• Eliminação em qualquer etapa de processo seletivo;
• Perda de dados ou informações armazenadas pelo Usuário;
• Custos com preparação, deslocamento, hospedagem ou quaisquer outras despesas relacionadas à participação em processo seletivo;
• Danos decorrentes do acesso a sites de terceiros referenciados neste portal;
• Danos decorrentes de vírus, malware ou outros componentes prejudiciais que o Usuário venha a receber ao acessar sites de terceiros;
• Qualquer outra perda ou dano, ainda que este portal tenha sido previamente informado da possibilidade de sua ocorrência.

A responsabilidade total agregada deste portal perante o Usuário, por qualquer causa e independentemente da forma de ação, será sempre limitada ao valor de R$ 0,00 (zero reais), uma vez que o acesso ao portal e ao seu conteúdo é disponibilizado inteiramente sem cobrança.`,
  },
  {
    titulo: '11. A única fonte com validade legal',
    conteudo: `Para qualquer finalidade relacionada à participação em processos seletivos públicos federais — incluindo, sem limitação, verificação de requisitos, cumprimento de prazos, confirmação de locais de prova, consulta a gabaritos, verificação de resultados e preparação para a posse —, a única fonte com validade legal é o EDITAL OFICIAL publicado no Diário Oficial da União, juntamente com todas as suas retificações e comunicados oficiais subsequentes.

Este portal é uma ferramenta auxiliar de orientação e nunca um substituto para a leitura integral e atenta do edital oficial. O Usuário que tomar decisões relevantes com base exclusivamente no conteúdo deste portal, sem verificação nas fontes oficiais, o faz por sua inteira conta e risco.

O IBGE disponibiliza canais oficiais de atendimento ao candidato para esclarecimento de duvidas sobre o edital. Recomendamos que duvidas especificas sobre requisitos, prazos, documentos e procedimentos sejam sempre esclarecidas diretamente junto a fonte oficial (ibge.gov.br).`,
  },
  {
    titulo: '12. Alterações neste Aviso',
    conteudo: `Este Aviso de Isenção de Responsabilidade pode ser revisado e atualizado a qualquer momento, sem aviso prévio ao Usuário. A versão vigente é sempre a publicada nesta página, com a data de última atualização indicada no início do documento.

Recomendamos que o Usuário revise este Aviso periodicamente para se manter informado sobre os limites de responsabilidade deste portal. O uso continuado do portal após a publicação de alterações neste Aviso constitui aceitação tácita da versão atualizada.`,
  },
  {
    titulo: '13. Contato',
    conteudo: `Dúvidas, questionamentos ou manifestações relacionadas a este Aviso de Isenção de Responsabilidade podem ser encaminhadas por meio do canal de contato disponível neste portal.

Prazo de resposta: até 5 (cinco) dias úteis para comunicações gerais.`,
  },
]; }

export default function AvisoIsencaoPage() {
  const sections = buildSections();
  return (
    <div style={{ fontFamily:"'Google Sans','Roboto',Arial,sans-serif",color:'#202124',background:'#fff',minHeight:'100vh',display:'flex',flexDirection:'column' }}>
      <AgHeader />
      <main style={{ flex:1,maxWidth:860,margin:'0 auto',padding:'64px 24px 100px',width:'100%' }}>

        <span style={{ fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:1.2,color:'#EA4335' }}>Legal</span>
        <h1 style={{ fontSize:40,fontWeight:800,color:'#202124',margin:'12px 0 8px',lineHeight:1.2 }}>Aviso de Isenção de Responsabilidade</h1>
        <p style={{ fontSize:13,color:'#80868B',marginBottom:16 }}>Última atualização: 01 de abril de 2026</p>

        <div style={{ background:'#FFF8E1',border:'1px solid #F9A825',borderRadius:10,padding:'18px 22px',marginBottom:52 }}>
          <p style={{ fontSize:14,color:'#5D4037',lineHeight:1.75,margin:0 }}>
            <strong>⚠️ Leia com atenção:</strong> Este Aviso descreve os limites da responsabilidade deste portal. O conteúdo disponível é informativo. A única fonte com validade legal para qualquer finalidade relacionada a processos seletivos é o edital oficial publicado no Diário Oficial da União.
          </p>
        </div>

        {/* índice */}
        <nav style={{ background:'#F8F9FA',borderRadius:12,padding:'24px 28px',marginBottom:52 }}>
          <p style={{ fontSize:12,fontWeight:800,textTransform:'uppercase',letterSpacing:1,color:'#80868B',marginBottom:14 }}>Índice</p>
          <ol style={{ margin:0,padding:'0 0 0 18px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px 24px' }}>
            {sections.map((s,i)=>(
              <li key={i} style={{ fontSize:13,color:'#EA4335',lineHeight:1.6 }}>
                <a href={`#a${i+1}`} style={{ color:'inherit',textDecoration:'none' }}
                  onMouseEnter={e=>e.currentTarget.style.textDecoration='underline'}
                  onMouseLeave={e=>e.currentTarget.style.textDecoration='none'}>
                  {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {sections.map((s,i)=>(
          <section key={i} id={`a${i+1}`} style={{ marginBottom:48, scrollMarginTop:80 }}>
            <h2 style={{ fontSize:21,fontWeight:800,color:'#202124',marginBottom:14,paddingBottom:12,borderBottom:'1px solid #DADCE0' }}>{s.titulo}</h2>
            <div style={{ fontSize:15,color:'#5F6368',lineHeight:1.95,whiteSpace:'pre-line' }}>{s.conteudo}</div>
          </section>
        ))}

      </main>
      <AgFooter />
    </div>
  );
}
