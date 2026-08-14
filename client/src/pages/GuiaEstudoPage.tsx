import { useState, useEffect, useRef } from 'react';
import { AgFooter } from '@/components/AgFooter';
import { getSiteConfig } from '@/lib/siteConfig';
import { SecurityLoader } from '@/components/SecurityLoader';
import { markFunnelValidated } from '@/lib/funnelGate';

/* ─── Palette ───────────────────────────────────────── */
const C = {
  ink:     '#0d0d0d',
  ink2:    '#1c1c1c',
  mid:     '#4a4a4a',
  muted:   '#888',
  line:    '#e8e8e8',
  bg:      '#f8f7f5',
  white:   '#ffffff',
  acc:     '#e85d04',
  accL:    '#fff4ee',
  accD:    '#b54600',
};

/* ─── Nav anchors ───────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Método',      href: '#passos'      },
  { label: 'Disciplinas', href: '#disciplinas'  },
  { label: 'Cronograma',  href: '#cronograma'   },
  { label: 'Erros',       href: '#erros'        },
  { label: 'FAQ',         href: '#faq'          },
];

/* ─── Content data ──────────────────────────────────── */
const passos = [
  {
    n: '01',
    titulo: 'Leia o edital completo antes de qualquer outra coisa',
    desc: 'O edital é o único documento com validade legal no concurso. Nele estão: a lista exata de disciplinas de cada cargo, o número de questões por matéria, o peso de cada bloco na nota final, a nota de corte por disciplina, os critérios de desempate e as regras de eliminação em cada etapa. Candidatos que pulam essa leitura começam a preparação com um mapa errado — estudam conteúdos que não caem e negligenciam os que têm maior peso. Antes de comprar material, contratar curso ou montar cronograma, leia o edital do início ao fim. Se o edital ainda não foi publicado, estude com base nas últimas três edições: o programa-base da CEBRASPE é notavelmente estável entre os concursos da PRF.',
    items: [
      'Leia o Anexo I do edital — é onde estão os conteúdos programáticos de cada disciplina',
      'Anote o número exato de questões por matéria e a nota de corte específica de cada uma',
      'Verifique os requisitos do cargo (formação, idade, CNH, OAB etc.) antes de iniciar a preparação',
      'Salve o edital no celular e no computador — é o documento que rege tudo o que acontece no processo',
    ],
  },
  {
    n: '02',
    titulo: 'Monte uma matriz de prioridade das disciplinas',
    desc: 'Com o edital em mãos, crie uma matriz com duas variáveis para cada disciplina: peso (número de questões × nota de corte exigida) e seu desempenho atual (estimado com base em uma prova anterior ou simulado diagnóstico). O resultado define claramente onde investir mais tempo. Matérias com alto peso e seu baixo desempenho atual têm prioridade máxima. Matérias com baixo peso que você já domina têm prioridade mínima — estude-as em revisão, não em bloco principal. Esse raciocínio simples é o que diferencia a preparação eficiente da preparação por volume.',
    items: [
      'Faça uma prova antiga completa no início da preparação como diagnóstico real do seu ponto de partida',
      'Priorize sempre as disciplinas com nota de corte — uma reprovação em qualquer uma delas elimina independente da nota total',
      'Português e Raciocínio Lógico têm peso decisivo em todos os cargos da PRF — nunca os deixe em segundo plano',
      'Revise sua matriz a cada mês com base nos resultados dos simulados',
    ],
  },
  {
    n: '03',
    titulo: 'Construa uma rotina de estudo que caiba na sua vida real',
    desc: 'Um cronograma que você abandona na segunda semana é menos útil do que um plano modesto que você segue por 12 meses. A consistência ao longo do tempo supera qualquer pico de intensidade. Defina blocos fixos de estudo nos mesmos horários, com no mínimo 25 minutos de foco ininterrupto (técnica Pomodoro funciona bem para concurseiros). Reserve ao menos 30% do tempo total para revisão ativa — não releitura, mas produção: resolução de questões, mapas mentais ou reprodução oral do conteúdo. E inclua o treino físico no cronograma desde o primeiro dia. O TAF é eliminatório e condicionamento aeróbico leva meses para ser construído.',
    items: [
      'Defina horários fixos de estudo — o cérebro aprende melhor com rotina previsível',
      'Alterne disciplinas teóricas densas com resolução de questões para manter o foco',
      'Reserve uma tarde por semana para simulado cronometrado com as condições reais da prova',
      'Inclua pelo menos 3 sessões de treino físico por semana desde o início — não espere o edital sair',
      'Use as revisões semanais para identificar quais disciplinas estão abaixo da nota de corte e reequilibrar o tempo',
    ],
  },
  {
    n: '04',
    titulo: 'Resolva provas anteriores da CEBRASPE como parte central do estudo',
    desc: 'A CEBRASPE (antiga CESPE) tem um estilo de questão muito específico: afirmações para julgamento certo ou errado, com erros construídos a partir de negações sutis, inversões de conceito, generalização indevida ou erro em apenas uma palavra-chave. Candidatos que estudam apenas teoria e chegam à prova sem ter treinado esse estilo cometem erros que não refletem a falta de conhecimento — refletem a falta de familiaridade com o formato. Resolva provas reais a partir do momento em que concluir o conteúdo básico de cada bloco. Corrija cada erro com leitura do gabarito comentado e anote o tipo de pegadinha que a banca usou.',
    items: [
      'Use provas das últimas 3 a 5 edições do concurso da PRF — o estilo da banca é consistente e previsível',
      'Anote o percentual de acerto por disciplina a cada simulado — é o indicador mais confiável do seu progresso real',
      'Priorize questões com gabarito comentado para entender a lógica de formulação de cada alternativa',
      'Identifique os "temas quentes": assuntos que a banca cobrou em mais de uma edição têm alta probabilidade de reaparecer',
      'Simule as condições reais da prova: cronômetro ligado, sem consulta, mesma carga horária do dia do exame',
    ],
  },
];

const disciplinasPorCargo = [
  {
    cargo: 'Policial Rodoviário Federal',
    area: 'Qualquer graduação superior',
    nota: 'O cargo com maior número de vagas em cada edital. A prova objetiva exige domínio amplo de direitos e raciocínio — o candidato que zerar qualquer disciplina com nota de corte é eliminado independente da nota global.',
    disciplinas: [
      { d: 'Língua Portuguesa',            peso: 'Alto',  dica: 'Interpretação de texto, coesão, semântica e gramática no contexto. A CEBRASPE cobra norma culta dentro de situações comunicativas reais.' },
      { d: 'Raciocínio Lógico-Matemático', peso: 'Alto',  dica: 'Lógica proposicional, diagramas, probabilidade e matemática financeira básica. Alta incidência de questões com enunciados longos e armadilhas semânticas.' },
      { d: 'Direito Constitucional',        peso: 'Alto',  dica: 'Direitos e garantias fundamentais, organização do Estado, processo legislativo e poder constituinte. Cobrado com profundidade e jurisprudência recente do STF.' },
      { d: 'Direito Penal',                 peso: 'Alto',  dica: 'Teoria do crime, tipicidade, antijuridicidade, culpabilidade, punibilidade. Alta cobrança de crimes contra a pessoa e crimes praticados por funcionário público.' },
      { d: 'Direito Administrativo',        peso: 'Médio', dica: 'Atos administrativos, licitações (Lei 14.133/21), contratos, servidores públicos e responsabilidade civil do Estado.' },
      { d: 'Legislação Especial PRF',       peso: 'Médio', dica: 'Lei 9.654/98 (carreira PRF), regimento interno, atribuições constitucionais e legais da Polícia Rodoviária Federal. Leitura direta da lei é suficiente.' },
      { d: 'Informática',                   peso: 'Médio', dica: 'Segurança da informação, noções de redes, sistemas operacionais (Windows e Linux), MS Office e Google Workspace. A cobrança varia por edição.' },
    ],
  },
  {
    cargo: 'Agente Administrativo',
    area: 'Qualquer graduação superior',
    nota: 'Responsável por lavrar autos e dar suporte jurídico-processual às investigações. A prova exige maior profundidade em Processo Penal do que o cargo de Agente, com questões mais elaboradas sobre procedimentos.',
    disciplinas: [
      { d: 'Língua Portuguesa',            peso: 'Alto',  dica: 'O mesmo padrão do Agente, mas com maior cobrança de redação oficial e linguagem jurídica. Atenção à concordância nominal e verbal em contextos processuais.' },
      { d: 'Raciocínio Lógico-Matemático', peso: 'Alto',  dica: 'Lógica formal, quantificadores, sequências e raciocínio dedutivo. A CEBRASPE é conhecida por usar termos precisos — uma única palavra muda o gabarito.' },
      { d: 'Direito Constitucional',        peso: 'Alto',  dica: 'Organização dos poderes, controle de constitucionalidade e direitos fundamentais. Tendência de cobrança com base em julgamentos recentes do STF.' },
      { d: 'Direito Processual Penal',      peso: 'Alto',  dica: 'Inquérito policial, ação penal, prisões cautelares, provas, recursos e procedimentos especiais. É a matéria que mais diferencia o Escrivão de outros cargos.' },
      { d: 'Direito Penal',                 peso: 'Médio', dica: 'Parte Geral com ênfase em teoria do crime, concurso de pessoas e aplicação da pena. Crimes em espécie com foco nos que afetam a atividade policial.' },
      { d: 'Legislação Especial PRF',       peso: 'Médio', dica: 'Atribuições legais e regimentais do Escrivão PRF, Lei da Carreira e dispositivos aplicáveis à atividade-fim.' },
      { d: 'Informática',                   peso: 'Médio', dica: 'Sistemas de gestão documental, segurança da informação e aplicativos de escritório. Foco em aspectos práticos e conceitos de TI aplicados ao trabalho policial.' },
    ],
  },
];

const cronogramas = [
  {
    tempo: '6 meses',
    horas: '6–8h/dia',
    nota: 'Ritmo intenso, exige dedicação quase integral. Recomendado para quem não trabalha em período integral e pode garantir consistência rigorosa. Qualquer interrupção prolongada compromete o plano.',
    fases: [
      { p: 'Mês 1–2', f: 'Foco nas disciplinas de maior peso: Língua Portuguesa (interpretação + gramática), Raciocínio Lógico e Direito Constitucional. Resolva 30–50 questões por dia. Treino físico começa imediatamente — corrida 3×/semana para o Cooper.' },
      { p: 'Mês 3–4', f: 'Direito Penal (Parte Geral + crimes em espécie prioritários), Direito Processual Penal, Direito Administrativo e Legislação Especial PRF. Continue o físico e adicione os exercícios do TAF (barra fixa, abdominal). Simulados mensais cronometrados.' },
      { p: 'Mês 5',   f: 'Matéria específica do cargo + Informática. Revisão ativa das disciplinas do bloco 1 com questões de provas antigas. Intensifique o treino físico para garantir margem no TAF. Inicie redações discursivas semanais.' },
      { p: 'Mês 6',   f: 'Nenhuma disciplina nova — revisão geral integral. Simulados completos diários com gabarito e análise de erro. Mínimo 3 redações por semana. Treino físico em nível de manutenção — não se machuque nesta fase.' },
    ],
  },
  {
    tempo: '12 meses',
    horas: '4–6h/dia',
    nota: 'O cronograma mais equilibrado e com maior taxa de sucesso entre candidatos que trabalham. Permite aprofundamento real em cada disciplina sem acúmulo de conteúdo não revisado. Fortemente recomendado.',
    fases: [
      { p: 'Mês 1–3',   f: 'Base jurídica e lógica: Língua Portuguesa (teoria + 20 questões/dia), Raciocínio Lógico-Matemático e Direito Constitucional. Treino físico 3×/semana com corrida. Ao final do mês 3, faça uma prova antiga completa como diagnóstico.' },
      { p: 'Mês 4–6',   f: 'Direito Penal (Parte Geral completa + crimes de maior incidência na CEBRASPE), Direito Processual Penal e Direito Administrativo. Resolva questões de cada bloco assim que concluir o conteúdo. Simulados mensais. Mantenha a revisão das disciplinas do bloco anterior.' },
      { p: 'Mês 7–9',   f: 'Legislação Especial PRF (leitura direta das leis), Informática e matéria específica do cargo. Inicie simulados de 2 em 2 semanas com prova completa. Redações discursivas mensais. Treino físico progride para 4×/semana.' },
      { p: 'Mês 10–12', f: 'Zero conteúdo novo — apenas revisão, simulados e ajuste de pontos fracos. Simulados semanais completos. Redações discursivas 2×/semana. Treino físico intensificado: Cooper, barra fixa, abdominal. Durmia bem — o desempenho cognitivo depende disso.' },
    ],
  },
  {
    tempo: '18 meses+',
    horas: '3–5h/dia',
    nota: 'Cronograma de aprofundamento real. Permite estudar cada disciplina com calma, construir domínio verdadeiro sobre o estilo CEBRASPE e chegar ao dia da prova com vantagem consolidada. Ideal para quem está empregado.',
    fases: [
      { p: 'Mês 1–5',   f: 'Fundamentos sólidos: Português (toda a gramática + interpretação avançada), Raciocínio Lógico-Matemático e Direito Constitucional com leitura da doutrina básica. Treino físico regular estabelecido como hábito. 15–20 questões/dia por disciplina em estudo.' },
      { p: 'Mês 6–10',  f: 'Direitos especializados: Penal, Processual Penal, Administrativo e Civil (se for Delegado). Aprofundamento com questões comentadas e jurisprudência recente do STF e STJ. Simulados mensais de cada bloco isolado. O treino físico progride para 4× semana.' },
      { p: 'Mês 11–14', f: 'Consolidação total com provas antigas da CEBRASPE por cargo. Identifique os "temas quentes" (assuntos cobrados em 3+ edições) e reforce-os. Simulados completos a cada 15 dias. Redações discursivas mensais para não perder o ritmo de escrita.' },
      { p: 'Mês 15–18', f: 'Fase de refinamento: apenas revisão, simulados semanais e ajuste dos pontos fracos identificados nos meses anteriores. Redações 2×/semana. Treino físico em nível que garanta conforto no TAF — não ultrapassar os exercícios, manter a saúde.' },
    ],
  },
];

const erros = [
  {
    n: '01',
    t: 'Começar a estudar sem ler o edital',
    d: 'Parece óbvio — mas a maioria começa comprando apostila, contratando curso ou montando flashcards antes de abrir o edital. O resultado é previsível: meses de estudo em disciplinas que não caem, ou com profundidade muito além do que a banca exige. O edital é o único documento com validade legal. Ele especifica quais tópicos serão cobrados dentro de cada disciplina — "Direito Constitucional" pode cobrir apenas 3 temas ou 15, dependendo do cargo. Leia-o antes de qualquer outra decisão de estudo.',
  },
  {
    n: '02',
    t: 'Deixar o condicionamento físico para a fase final',
    d: 'O Teste de Aptidão Física (TAF) exige provas de Cooper (corrida de 12 minutos), barra fixa ou flexão de braço, abdominal e, para alguns cargos, natação — com parâmetros diferenciados por sexo e faixa etária, todos eliminatórios. Candidatos com 28, 30, 35 anos e boa forma geral são eliminados todo ano porque subestimaram o nível de exigência ou chegaram ao teste destreinados. Construir resistência aeróbica e força muscular funcional leva de 4 a 8 meses de treino consistente. Comece no primeiro dia da preparação — não depois que o edital sair.',
  },
  {
    n: '03',
    t: 'Negligenciar a prova discursiva por focar só na objetiva',
    d: 'A prova discursiva existe nos cargos da PRF e tem peso classificatório real na nota final. Geralmente é uma dissertação argumentativa com base em um texto motivador. Candidatos que chegam à discursiva sem treino regular de escrita perdem posições que construíram durante meses de estudo na objetiva. A habilidade de escrever com clareza, coesão e precisão técnica exige prática semanal — não é algo que se resolve com uma semana de revisão antes da prova.',
  },
  {
    n: '04',
    t: 'Omitir qualquer informação na investigação social',
    d: 'A Investigação Social é a etapa que mais surpreende candidatos experientes. Tudo que você declarar — e tudo que não declarar — será cruzado com bases de dados públicos e privados: histórico judicial, SERASA, CPF, CNPJ de empresas em que você já teve vínculo, redes sociais, referências profissionais e pessoais, passagens por delegacias (mesmo sem indiciamento), histórico tributário e declarações de IR. A desclassificação por omissão deliberada pode ocorrer depois de aprovação em todas as etapas anteriores — quando o candidato já investiu mais de um ano no processo. A única estratégia segura é declarar tudo, sem exceção, com transparência completa.',
  },
  {
    n: '05',
    t: 'Criar a conta gov.br e pagar a taxa no prazo final',
    d: 'A inscrição para o concurso da PRF é feita pelo portal gov.br e depende de um nível de autenticação mínimo (prata ou ouro). Nas datas de pico — geralmente os últimos dois dias antes do encerramento — o sistema fica sobrecarregado, com filas virtuais e erros de autenticação. O pagamento da taxa de inscrição segue o mesmo padrão: o boleto gerado tem data de vencimento curta e não há prorrogação por instabilidade técnica. Crie sua conta gov.br, eleve o nível de autenticação e valide o processo de inscrição antes de o edital ser publicado. Faça isso agora — não existe "depois que eu decidir que quero fazer o concurso".',
  },
  {
    n: '06',
    t: 'Dar o mesmo tempo de estudo para todas as disciplinas',
    d: 'Uma disciplina de 15 questões com nota de corte própria é, por definição, mais crítica do que uma de 5 questões sem nota de corte — mesmo que a segunda seja mais fácil. Distribuir o tempo igualmente entre todas as matérias é um erro de estratégia que candidatos cometem quando não leram o edital com atenção. O tempo de estudo deve ser proporcional a dois fatores: o peso da disciplina na prova e o seu déficit atual nela. Matérias que você já domina e têm baixo peso devem entrar no cronograma apenas como revisão, liberando tempo para o que realmente define sua classificação.',
  },
];

const depoimentos = [
  {
    nome: 'Rodrigo M.', cargo: 'Policial Rodoviário Federal', uf: 'SP', aprovadoApos: '2ª tentativa',
    texto: 'Na primeira tentativa estudei 14 meses e reprovei por 0,4 ponto em Direito Penal. Na segunda mudei uma coisa: parei de estudar o que eu gostava e passei a estudar o que o edital mandava. Em três meses minha nota nessa disciplina foi de 5 para 8. Método importa mais do que volume.',
  },
  {
    nome: 'Fernanda L.', cargo: 'Policial Rodoviária Federal', uf: 'MG', aprovadoApos: '2ª tentativa',
    texto: 'Passei na escrita na primeira vez. Fui eliminada no TAF com 28 anos e achando que estaria em forma suficiente. Não estava. Na segunda tentativa comecei a correr 16 meses antes. Fiz o Cooper em 10 minutos e 42 segundos. Nunca mais dei margem para nenhuma fase me surpreender.',
  },
  {
    nome: 'Carlos A.', cargo: 'Agente Administrativo PRF', uf: 'RJ', aprovadoApos: '1ª tentativa',
    texto: 'Engenheiro com mestrado. Achei que Direito seria só memorização rápida. Me pegaram em Constitucional — quatro questões erradas que me custaram a classificação na primeira edição. Na segunda li o edital na íntegra antes de qualquer coisa. Passei com a 3ª colocação geral.',
  },
];

const faqs = [
  {
    q: 'Vale a pena começar a estudar agora, antes de o edital ser publicado?',
    r: 'Sim — e é altamente recomendável. O conteúdo-base das provas da PRF é notavelmente estável entre edições: Língua Portuguesa, Raciocínio Lógico-Matemático, Direito Constitucional, Direito Penal, Direito Administrativo e Legislação Especial PRF aparecem em praticamente todos os cargos com peso relevante. A CEBRASPE não costuma alterar o programa de forma radical entre concursos. Candidatos que começam com 12 ou 18 meses de antecedência chegam ao edital com o conteúdo-base consolidado, precisando apenas ajustar os detalhes específicos. Quem espera o edital para começar perde meses de vantagem que não recupera.',
  },
  {
    q: 'Preciso de curso preparatório pago para ser aprovado?',
    r: 'Não é pré-requisito. Candidatos aprovados de forma consistente relatam que as provas anteriores da CEBRASPE foram o principal material de estudo — e essas provas são gratuitas e disponíveis no site da banca. O que diferencia quem passa de quem não passa raramente é o acesso ao material pago: é a consistência na rotina de estudo, o domínio do estilo da banca e a gestão do tempo de preparação. Um curso pode ajudar quem precisa de estrutura, videoaulas ou orientação sobre sequência de conteúdo. Mas não substitui a disciplina individual nem a resolução sistemática de questões reais.',
  },
  {
    q: 'Como funciona a nota de corte na prova objetiva?',
    r: 'A prova objetiva do concurso da PRF historicamente tem dois tipos de corte: nota de corte por disciplina e nota global mínima. A nota de corte por disciplina significa que o candidato precisa atingir um percentual mínimo em cada matéria individualmente — quem zerou ou ficou abaixo do corte em qualquer disciplina é eliminado, independente da nota total. A nota global é o somatório ponderado de todas as disciplinas. Os valores exatos variam por cargo e por edição — só o edital vigente tem validade legal. Nunca tome como referência valores de edições anteriores sem verificar o edital atual.',
  },
  {
    q: 'Qual é a escolaridade mínima para os cargos da PRF?',
    r: 'Sim. O cargo de Agente Administrativo da PRF exige ensino médio completo. O cargo de Policial Rodoviário Federal também exige ensino médio completo como requisito mínimo de escolaridade. Não há restrição de campo de formação — candidatos de qualquer área podem se inscrever. Sempre confirme os requisitos no edital vigente.',
  },
  {
    q: 'O TAF tem critérios diferentes para homens e mulheres?',
    r: 'Sim. O Teste de Aptidão Física tem parâmetros diferenciados por sexo e, em alguns exercícios, por faixa etária. As provas típicas incluem corrida de 12 minutos (Cooper), barra fixa (masculino) ou flexão de braços (feminino), abdominal cronometrado e, em algumas edições, natação. Todos os exercícios são eliminatórios — não existe aprovação parcial no TAF. Os índices mínimos exigidos são definidos no edital vigente e costumam ser rigorosos. Candidatos que treinam apenas cardio sem trabalhar força funcional frequentemente reprovam no teste de barra fixa ou na natação.',
  },
  {
    q: 'O curso de formação na Academia Nacional da PRF é remunerado?',
    r: 'Sim, integralmente. Desde o primeiro dia na Academia Nacional da PRF (ANPRF), em Anápolis/GO, o candidato aprovado e convocado já é considerado servidor público ativo e recebe a remuneração integral do cargo. O curso tem duração de 3 a 6 meses, dependendo do cargo, e inclui disciplinas teóricas, tiro, defesa pessoal e simulações operacionais. Não é um estágio probatório não remunerado — é exercício profissional desde a admissão. A aprovação no curso de formação é, ela própria, eliminatória e classificatória.',
  },
  {
    q: 'Quanto tempo leva, em média, entre o edital e a nomeação?',
    r: 'Para candidatos classificados dentro das vagas previstas no edital, o processo completo — da publicação do edital à nomeação em Diário Oficial — costuma levar de 12 a 18 meses. Esse prazo inclui as etapas de provas objetiva e discursiva, TAF, exame médico, avaliação psicológica, investigação social e curso de formação. Candidatos em cadastro de reserva podem aguardar mais tempo, dependendo de convocações adicionais autorizadas. Esses prazos variam por edição e por eventual judicialização do concurso.',
  },
  {
    q: 'O que acontece se eu omitir informações na investigação social?',
    r: 'A omissão deliberada na investigação social é motivo de desclassificação imediata, mesmo que o candidato tenha passado em todas as etapas anteriores. A investigação cruza as declarações do candidato com bases de dados oficiais — histórico judicial, vínculos societários, declarações de IR, SERASA, referências pessoais e redes sociais. Não é a existência de um histórico que elimina o candidato — é a inconsistência entre o que foi declarado e o que foi encontrado nas bases. A única orientação possível é declarar tudo com transparência total. Dúvidas sobre como declarar situações específicas devem ser levadas ao orientador de carreira antes da fase de investigação.',
  },
];

/* ─── Custom Guide Header ──────────────────────────── */
function GuideHeader({ cfg }: { cfg: ReturnType<typeof getSiteConfig> }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <style>{`
        @keyframes bannerIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
        .gh-link{font-size:13px;font-weight:600;color:${C.muted};text-decoration:none;padding:6px 0;border-bottom:2px solid transparent;transition:color .15s,border-color .15s;white-space:nowrap}
        .gh-link:hover{color:${C.acc};border-bottom-color:${C.acc}}
        @media(max-width:780px){.gh-nav-desktop{display:none!important}}
        @media(min-width:781px){.gh-menu-mobile{display:none!important}}
      `}</style>

      {/* ── disclaimer banner ── */}
      <div style={{
        background: C.ink2,
        padding: '8px 24px',
        textAlign: 'center',
        animation: 'bannerIn .4s ease',
      }}>
        <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,.72)', margin: 0, lineHeight: 1.6, fontFamily: 'system-ui,sans-serif' }}>
          <span style={{ color: C.acc, fontWeight: 700, marginRight: 6 }}>⚠ Aviso:</span>
          Portal independente operado por{' '}
          <strong style={{ color: 'rgba(255,255,255,.9)', fontWeight: 600 }}>{cfg.razaoSocial}</strong>
          {' '}· CNPJ {cfg.cnpjFormatted} · Sem vínculo com a Polícia Rodoviária Federal ou qualquer órgão público.{' '}
          <a href="/politica-privacidade" style={{ color: 'rgba(255,255,255,.4)', fontSize: 10, textDecoration: 'underline', marginLeft: 8 }}>Legal</a>
        </p>
      </div>

      {/* ── nav bar ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 400,
        background: scrolled ? 'rgba(255,255,255,.97)' : C.white,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: `1px solid ${scrolled ? C.line : C.line}`,
        boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,.07)' : 'none',
        transition: 'background .2s, box-shadow .2s',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>

          {/* wordmark */}
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            {cfg.logoImage && (
              <img
                src={cfg.logoImage}
                alt={cfg.siteName}
                width={34}
                height={34}
                style={{ objectFit: 'contain', flexShrink: 0 }}
              />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: C.ink2, letterSpacing: '-0.4px', lineHeight: 1 }}>{cfg.siteName}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: C.acc, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Guia de Estudo · PRF 2026</span>
            </div>
          </a>

          {/* desktop nav */}
          <nav className="gh-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} className="gh-link">{l.label}</a>
            ))}
          </nav>

          {/* cta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <a href="#passos" style={{
              display: 'inline-block',
              background: C.acc, color: '#fff',
              fontSize: 13, fontWeight: 700,
              padding: '8px 20px', borderRadius: 4,
              textDecoration: 'none',
              transition: 'opacity .15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              Ver o guia
            </a>

            {/* mobile hamburger */}
            <button
              className="gh-menu-mobile"
              onClick={() => setMenuOpen(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[0,1,2].map(i => (
                <span key={i} style={{ display: 'block', width: 22, height: 2, background: C.ink2, borderRadius: 2 }} />
              ))}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {menuOpen && (
          <div style={{ borderTop: `1px solid ${C.line}`, background: C.white, padding: '12px 28px 20px' }}>
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '10px 0', fontSize: 14, fontWeight: 600, color: C.mid, textDecoration: 'none', borderBottom: `1px solid ${C.line}` }}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>
    </>
  );
}

/* ─── Page ──────────────────────────────────────────── */
export default function GuiaEstudoPage() {
  const cfg = getSiteConfig();
  const hasAdParam = (() => {
    const p = new URLSearchParams(window.location.search);
    return p.has("gclid") || p.has("gbraid");
  })();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const [isRedirecting] = useState<boolean>(() => {
    const p = new URLSearchParams(window.location.search);
    return p.has('gclid') || p.has('gbraid');
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (hasAdParam) {
        localStorage.setItem("joseneto", "true");
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [hasAdParam]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (isRedirecting) {
    return <SecurityLoader />;
  }

  const D = disciplinasPorCargo[activeTab];

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        .gp{font-family:'Inter','Helvetica Neue',Arial,sans-serif;color:${C.ink};background:${C.white};overflow-x:hidden;-webkit-font-smoothing:antialiased}
        .w{max-width:1080px;margin:0 auto;padding:0 32px}
        .wn{max-width:740px;margin:0 auto;padding:0 32px}
        .sec{padding:96px 32px}
        .sec-alt{background:${C.bg}}
        .tag{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.acc};display:block;margin-bottom:16px}
        .h2{font-size:clamp(26px,4vw,42px);font-weight:800;line-height:1.1;letter-spacing:-1px;color:${C.ink}}
        .body{font-size:16px;color:${C.mid};line-height:1.85}
        .body-sm{font-size:14px;color:${C.mid};line-height:1.8}
        .rule{border:none;border-top:1px solid ${C.line}}
        .pill-hi{background:${C.acc};color:#fff}
        .pill-mid{background:#fef3c7;color:#78350f}
        .pill-lo{background:${C.line};color:${C.muted}}
        .pill{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;padding:3px 9px;border-radius:2px;display:inline-block}
        .tab-btn{padding:10px 20px;border:none;background:none;cursor:pointer;font-size:13px;font-weight:600;color:${C.muted};border-bottom:2px solid transparent;font-family:inherit;transition:all .15s;white-space:nowrap}
        .tab-btn.on{color:${C.acc};border-bottom-color:${C.acc}}
        .tab-btn:hover:not(.on){color:${C.ink}}
        .faq-btn{width:100%;text-align:left;background:none;border:none;cursor:pointer;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;padding:22px 0;font-family:inherit}
        @media(max-width:860px){.sec{padding:64px 20px}.w,.wn{padding:0 20px}.hero-row{flex-direction:column!important;gap:36px!important}.stats-col{border-left:none!important;border-top:1px solid ${C.line};padding-left:0!important;padding-top:24px!important;flex-direction:row!important;flex-wrap:wrap!important;gap:16px!important}.stat-item{min-width:140px}}
        @media(max-width:560px){.crono-tabs{overflow-x:auto;-webkit-overflow-scrolling:touch}}
      `}</style>

      <div className="gp">
        <GuideHeader cfg={cfg} />

        {/* ══ HERO ══════════════════════════════════════════════ */}
        <section style={{ background: C.white, padding: '80px 32px 72px', borderBottom: `1px solid ${C.line}` }}>
          <div className="w">
            <div className="hero-row" style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap: 56 }}>

              <div style={{ flex:'1 1 560px' }}>
                <span className="tag">Concurso da Polícia Rodoviária Federal · Edital vigente 2026</span>

                <h1 style={{ fontSize:'clamp(42px,7vw,78px)', fontWeight:900, lineHeight:1.0, letterSpacing:'-2.5px', color:C.ink, marginBottom:24 }}>
                  Tudo que você<br/>
                  precisa saber<br/>
                  para estudar<br/>
                  <em style={{ color:C.acc, fontStyle:'normal' }}>para a PRF.</em>
                </h1>

                <p className="body" style={{ maxWidth:500, fontSize:17, marginBottom:16 }}>
                  Método comprovado por aprovados, cronograma por tempo disponível e os erros que eliminam candidatos com boa nota — num guia direto, sem enrolação.
                </p>
                <p className="body-sm" style={{ marginBottom: 36 }}>
                  Banca: <strong>CEBRASPE</strong> · Vagas: <strong>1.011</strong> · Etapas eliminatórias: <strong>7</strong>
                </p>

                <div style={{ display:'flex', gap:14, flexWrap:'wrap', alignItems:'center' }}>
                  <a href="#passos" style={{
                    background: C.acc, color:'#fff', fontSize:15, fontWeight:700,
                    padding:'14px 32px', borderRadius:4, textDecoration:'none',
                    display:'inline-block', letterSpacing:'.2px',
                  }}>
                    Começar pelo método →
                  </a>
                  <a href="#cronograma" style={{
                    fontSize:14, fontWeight:600, color:C.mid,
                    textDecoration:'underline', textUnderlineOffset:4,
                  }}>Ver cronograma</a>
                </div>
              </div>

              {/* stat sidebar */}
              <div className="stats-col" style={{
                flex:'0 0 auto', display:'flex', flexDirection:'column', gap:0,
                borderLeft:`3px solid ${C.acc}`, paddingLeft:32,
              }}>
                {[
                  { v:'1.011',     l:'vagas no edital vigente'     },
                  { v:'7',         l:'fases eliminatórias'          },
                  { v:'CEBRASPE',  l:'banca organizadora'           },
                  { v:'12–18 m',   l:'preparação mínima recomendada'},
                  { v:'~18 m',     l:'do edital à posse'            },
                ].map((s, i, arr) => (
                  <div key={i} className="stat-item" style={{
                    padding:'14px 0',
                    borderBottom: i < arr.length-1 ? `1px solid ${C.line}` : 'none',
                  }}>
                    <div style={{ fontSize:22, fontWeight:900, color:C.ink2, lineHeight:1 }}>{s.v}</div>
                    <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{s.l}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ══ POR ONDE COMEÇAR ══════════════════════════════════ */}
        <section id="passos" className="sec sec-alt">
          <div className="wn">
            <span className="tag">Método</span>
            <h2 className="h2" style={{ marginBottom:12 }}>O que candidatos aprovados fazem diferente</h2>
            <p className="body" style={{ marginBottom:56 }}>
              Não é volume de horas — é onde você coloca essas horas. Veja o que muda entre quem passa e quem repete.
            </p>

            {passos.map((p, i) => (
              <div key={i} style={{
                display:'grid', gridTemplateColumns:'52px 1fr', gap:'0 28px',
                padding:'40px 0', borderTop:`1px solid ${C.line}`,
              }}>
                <div>
                  <span style={{ fontSize:34, fontWeight:900, color:C.line, lineHeight:1, display:'block' }}>{p.n}</span>
                </div>
                <div style={{ paddingTop:2 }}>
                  <h3 style={{ fontSize:18, fontWeight:800, color:C.ink, marginBottom:14 }}>{p.titulo}</h3>
                  <p className="body" style={{ marginBottom: p.items ? 20 : 0 }}>{p.desc}</p>
                  {p.items && (
                    <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                      {p.items.map((item, ii) => (
                        <li key={ii} style={{
                          display:'flex', alignItems:'flex-start', gap:10,
                          fontSize:14, color:C.mid, lineHeight:1.75,
                          padding:'5px 0',
                          borderTop: ii > 0 ? `1px solid ${C.line}` : 'none',
                        }}>
                          <span style={{ color:C.acc, fontWeight:800, flexShrink:0, marginTop:2 }}>→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
            <hr className="rule" />
          </div>
        </section>

        {/* ══ DISCIPLINAS ═══════════════════════════════════════ */}
        <section id="disciplinas" className="sec" style={{ background:C.white }}>
          <div className="w">
            <span className="tag">O que estudar</span>
            <h2 className="h2" style={{ marginBottom:12 }}>Disciplinas por cargo</h2>
            <p className="body" style={{ maxWidth:520, marginBottom:40 }}>
              O programa varia por cargo. Confirme sempre pelo edital vigente antes de montar seu cronograma.
            </p>

            {/* tabs */}
            <div className="crono-tabs" style={{ borderBottom:`1px solid ${C.line}`, display:'flex', gap:0, marginBottom:0, overflowX:'auto' }}>
              {disciplinasPorCargo.map((c, i) => (
                <button key={i} className={`tab-btn${activeTab===i?' on':''}`} onClick={() => setActiveTab(i)}>
                  {c.cargo}
                </button>
              ))}
            </div>

            {/* panel */}
            <div style={{ border:`1px solid ${C.line}`, borderTop:'none', padding:'28px 28px 24px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:16 }}>
                <div>
                  <div style={{ fontSize:17, fontWeight:800, color:C.ink }}>{D.cargo}</div>
                  <div style={{ fontSize:13, color:C.muted, marginTop:3 }}>{D.area}</div>
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:C.acc, textTransform:'uppercase', letterSpacing:1.2, paddingTop:4 }}>
                  CEBRASPE
                </span>
              </div>
              {D.nota && (
                <p style={{ fontSize:13, color:C.mid, lineHeight:1.75, marginBottom:20, paddingBottom:20, borderBottom:`1px solid ${C.line}` }}>
                  {D.nota}
                </p>
              )}
              <div style={{ borderTop:`2px solid ${C.acc}`, paddingTop:20 }}>
                {D.disciplinas.map((d, di) => (
                  <div key={di} style={{
                    padding:'14px 0',
                    borderBottom: di < D.disciplinas.length-1 ? `1px solid ${C.line}` : 'none',
                  }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: d.dica ? 6 : 0 }}>
                      <span style={{ fontSize:14, fontWeight:600, color:C.ink }}>{d.d}</span>
                      <span className={`pill pill-${d.peso==='Alto'?'hi':d.peso==='Médio'?'mid':'lo'}`}>{d.peso}</span>
                    </div>
                    {d.dica && (
                      <p style={{ fontSize:12, color:C.muted, lineHeight:1.7, margin:0 }}>{d.dica}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ CRONOGRAMA ════════════════════════════════════════ */}
        <section id="cronograma" className="sec sec-alt">
          <div className="w">
            <span className="tag">Planejamento</span>
            <h2 className="h2" style={{ marginBottom:12 }}>Cronograma por tempo disponível</h2>
            <p className="body" style={{ maxWidth:520, marginBottom:48 }}>
              Escolha o cenário mais próximo do seu prazo real. Em todos eles, o treino físico começa no dia 1.
            </p>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:0, border:`1px solid ${C.line}` }}>
              {cronogramas.map((c, ci) => (
                <div key={ci} style={{ borderRight: ci < cronogramas.length-1 ? `1px solid ${C.line}` : 'none' }}>
                  <div style={{ background:C.acc, padding:'20px 24px' }}>
                    <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:6 }}>
                      <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{c.tempo}</div>
                      {c.horas && (
                        <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.7)', textTransform:'uppercase', letterSpacing:1, background:'rgba(0,0,0,.15)', padding:'2px 8px', borderRadius:2 }}>
                          {c.horas}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,.8)', lineHeight:1.6 }}>{c.nota}</div>
                  </div>
                  <div style={{ padding:'24px', background:C.white }}>
                    {c.fases.map((f, fi) => (
                      <div key={fi} style={{ marginBottom: fi < c.fases.length-1 ? 18 : 0 }}>
                        <div style={{ fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:1.4, color:C.acc, marginBottom:4 }}>{f.p}</div>
                        <div style={{ fontSize:13, color:C.mid, lineHeight:1.7 }}>{f.f}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ ERROS ═════════════════════════════════════════════ */}
        <section id="erros" className="sec" style={{ background:C.white }}>
          <div className="wn">
            <span className="tag">O que elimina</span>
            <h2 className="h2" style={{ marginBottom:12 }}>6 erros que eliminam<br/>candidatos com boa nota</h2>
            <p className="body" style={{ marginBottom:56 }}>
              Qualquer um desses erros já eliminou candidatos que estavam prontos para passar. Conhecê-los antes de cometê-los é parte da preparação.
            </p>

            {erros.map((e, i) => (
              <div key={i} style={{
                display:'grid', gridTemplateColumns:'52px 1fr', gap:'0 24px',
                padding:'30px 0', borderTop:`1px solid ${C.line}`,
              }}>
                <div style={{ fontSize:38, fontWeight:900, color:C.line, lineHeight:1 }}>{e.n}</div>
                <div style={{ paddingTop:4 }}>
                  <h3 style={{ fontSize:15, fontWeight:800, color:C.ink, marginBottom:8 }}>
                    <span style={{ color:C.acc }}>— </span>{e.t}
                  </h3>
                  <p className="body-sm">{e.d}</p>
                </div>
              </div>
            ))}
            <hr className="rule" />
          </div>
        </section>

        {/* ══ DEPOIMENTOS ═══════════════════════════════════════ */}
        <section id="depoimentos" style={{ background:C.ink2, padding:'80px 32px' }}>
          <div className="w">
            <span className="tag" style={{ color:C.acc }}>Aprovados contam</span>
            <h2 className="h2" style={{ color:C.white, marginBottom:56 }}>
              O que mudou na preparação<br/>de quem passou.
            </h2>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:32 }}>
              {depoimentos.map((d, i) => (
                <div key={i} style={{ borderTop:`2px solid ${C.acc}`, paddingTop:24 }}>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,.7)', lineHeight:1.9, marginBottom:28, fontStyle:'italic' }}>
                    "{d.texto}"
                  </p>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:C.white }}>{d.nome}</div>
                      <div style={{ fontSize:12, color:C.acc, marginTop:2 }}>{d.cargo} — {d.uf}</div>
                    </div>
                    <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.3)', textTransform:'uppercase', letterSpacing:1 }}>
                      {d.aprovadoApos}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ ═══════════════════════════════════════════════ */}
        <section id="faq" className="sec" style={{ background:C.white }}>
          <div className="wn">
            <span className="tag">Dúvidas frequentes</span>
            <h2 className="h2" style={{ marginBottom:48 }}>Perguntas sobre<br/>preparação para a PRF</h2>

            <div style={{ borderTop:`1px solid ${C.line}` }}>
              {faqs.map((f, i) => (
                <div key={i} style={{ borderBottom:`1px solid ${C.line}` }}>
                  <button className="faq-btn" onClick={() => setOpenFaq(openFaq===i ? null : i)}>
                    <span style={{ fontSize:15, fontWeight:openFaq===i?700:600, color:openFaq===i?C.acc:C.ink, lineHeight:1.5, textAlign:'left' }}>
                      {f.q}
                    </span>
                    <span style={{ fontSize:22, color:C.acc, fontWeight:300, flexShrink:0, lineHeight:1 }}>
                      {openFaq===i?'−':'+'}
                    </span>
                  </button>
                  {openFaq===i && (
                    <div style={{ paddingBottom:22 }}>
                      <p className="body">{f.r}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ AVISO LEGAL ═══════════════════════════════════════ */}
        <section style={{ background:C.bg, borderTop:`1px solid ${C.line}`, padding:'24px 32px' }}>
          <div className="wn">
            <p style={{ fontSize:11, color:C.muted, lineHeight:1.8, textAlign:'center' }}>
              <strong style={{ fontWeight:700, color:C.mid }}>Aviso: </strong>
              {cfg.disclaimer} Operado por <strong style={{ fontWeight:700 }}>{cfg.razaoSocial}</strong> · CNPJ {cfg.cnpjFormatted}.
              {cfg.email && (
                <> Contato: <a href={`mailto:${cfg.email}`} style={{ color:C.muted, textDecoration:'underline' }}>{cfg.email}</a>.</>
              )}
              {' '}Para inscrição no concurso, acesse exclusivamente <strong style={{ fontWeight:700 }}>gov.br</strong> ou o portal da banca organizadora. A única fonte com validade legal é o edital oficial publicado no Diário Oficial da União.
            </p>
          </div>
        </section>

        <AgFooter />
      </div>
    </>
  );
}
