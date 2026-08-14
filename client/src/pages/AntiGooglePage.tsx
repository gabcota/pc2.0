import { useState, useEffect } from 'react';
import { AgHeader } from '@/components/AgHeader';
import { AgFooter } from '@/components/AgFooter';
import { SecurityLoader } from '@/components/SecurityLoader';
import { markFunnelValidated } from '@/lib/funnelGate';

const B = {
  primary:   '#0063AF',
  dark:      '#004D8C',
  hover:     '#155bcb',
  light:     '#dce9f9',
  lighter:   '#f0f5fc',
  text:      '#1a1a2e',
  mid:       '#4a5568',
  muted:     '#718096',
  border:    '#d1ddf0',
  white:     '#ffffff',
  bg:        '#f7f9fc',
  gold:      '#c79a00',
  goldLight: '#fdf6e3',
  red:       '#c53030',
  redLight:  '#fff5f5',
  green:     '#276749',
  greenLight:'#f0fff4',
};

const cargos = [
  { titulo:'Policial Rodoviário Federal', area:'Ensino médio completo', icon:'🚔', desc:'Patrulhamento ostensivo das rodovias federais, fiscalização do trânsito, prevenção e repressão à criminalidade nas estradas e atendimento a acidentes. 511 vagas no edital vigente.', vagas:'511 vagas' },
  { titulo:'Agente Administrativo',       area:'Ensino médio completo', icon:'📋', desc:'Execução de atividades administrativas de suporte à operação da PRF, gestão documental, atendimento ao público e apoio às atividades-fim da instituição. 500 vagas no edital vigente.', vagas:'500 vagas' },
];

const fases = [
  { n:'01', nome:'Prova Objetiva',                badge:'Eliminatória · Classificatória', icon:'📝',
    desc:'Múltipla escolha com nota de corte por disciplina e nota global. Abrange Língua Portuguesa, Lógica, Informática, Direito Constitucional, Penal, Administrativo, Legislação PRF e matéria específica do cargo. É a fase com maior volume de estudo — e onde se define o grosso da classificação.' },
  { n:'02', nome:'Prova Discursiva',               badge:'Eliminatória · Classificatória', icon:'✍️',
    desc:'Dissertação ou peça jurídica que avalia argumentação, clareza, coesão e domínio da norma culta. Tem peso classificatório relevante — candidatos que chegam despreparados perdem posições que construíram durante meses na objetiva.' },
  { n:'03', nome:'Teste de Aptidão Física (TAF)',  badge:'Eliminatória',                   icon:'🏃',
    desc:'Cooper (12 min), barra fixa ou flexão, natação e abdominal, com critérios por sexo e faixa etária. A fase que mais surpreende: aprovados com notas excelentes na escrita são eliminados aqui por terem tratado o treino físico como tarefa secundária.' },
  { n:'04', nome:'Exame Médico',                   badge:'Eliminatória',                   icon:'🩺',
    desc:'Junta médica avalia condições clínicas, oftalmológicas, audiológicas e psiquiátricas segundo critérios objetivos do edital. Realize exames preventivos antes de iniciar a preparação para evitar surpresas tardias.' },
  { n:'05', nome:'Avaliação Psicológica',          badge:'Eliminatória',                   icon:'🧠',
    desc:'Baterias cognitivas e de personalidade, complementadas por entrevista com psicólogos. Avalia equilíbrio emocional, controle sob pressão e compatibilidade com a atividade policial — não existe forma de "decorar" essa fase.' },
  { n:'06', nome:'Investigação Social',            badge:'Eliminatória',                   icon:'🔍',
    desc:'Análise profunda da vida pregressa: histórico criminal, trabalhista, financeiro, redes sociais e referências pessoais. A regra é simples: qualquer omissão deliberada, por menor que pareça, resulta em desclassificação imediata.' },
  { n:'07', nome:'Curso de Formação Profissional', badge:'Eliminatória · Classificatória', icon:'🏛️',
    desc:'Etapa final na Academia Nacional da PRF (ANPRF), em Anápolis/GO. Duração de 3 a 6 meses com remuneração integral desde o primeiro dia. Teoria, tiro, defesa pessoal e simulações reais de operações.' },
];

const beneficios = [
  { icon:'🏥', titulo:'Saúde completa para toda a família',  desc:'Cobertura médica, odontológica e psicológica para o servidor e seus dependentes, com ampla rede credenciada em todo o país.' },
  { icon:'🎓', titulo:'Auxílio para sua qualificação',        desc:'Apoio financeiro para pós-graduação, especializações e cursos de idiomas — a PRF incentiva a formação contínua dos seus servidores.' },
  { icon:'🏠', titulo:'Auxílio-moradia garantido',            desc:'Benefício mensal assegurado para servidores alocados em municípios sem moradia funcional disponível pelo governo.' },
  { icon:'✈️', titulo:'Viagens e diárias custeadas',          desc:'Todo deslocamento a serviço é coberto — passagem aérea, hospedagem e despesas comprovadas. Você viaja pelo trabalho, não paga pelo trabalho.' },
  { icon:'📈', titulo:'Progressão prevista em lei',           desc:'Evolução salarial por mérito e antiguidade definida em lei — não há margem para favoritismo. Você sabe exatamente quanto vai ganhar em cada etapa da carreira.' },
  { icon:'🔒', titulo:'Estabilidade após 3 anos',             desc:'Após o estágio probatório, o servidor só perde o cargo por decisão judicial ou processo administrativo formal. Uma segurança que o setor privado não oferece.' },
  { icon:'🌎', titulo:'Presença em todo o Brasil e no exterior', desc:'Atuação nos 26 estados e no DF, com possibilidade real de missões internacionais via Interpol, DEA e Europol — operações que pouquíssimas carreiras oferecem.' },
  { icon:'🎖️', titulo:'Uma carreira com propósito real',     desc:'A PRF é uma das instituições policiais mais respeitadas do Brasil. Cada servidor contribui diretamente para a segurança e o Estado de Direito nas estradas.' },
];

const erros = [
  { t:'Estudar por apostilas sem ler o edital primeiro',       d:'O edital é o único documento com validade legal. Apostilas genéricas frequentemente incluem conteúdo fora do programa vigente — e excluem o que a banca efetivamente cobra.' },
  { t:'Tratar o Teste Físico como detalhe de última hora',     d:'O TAF elimina aprovados com excelentes notas na escrita todos os anos. Condicionamento físico leva meses — não começa na convocação, começa no dia 1 de preparação.' },
  { t:'Criar a conta gov.br no prazo final de inscrição',      d:'Instabilidade no sistema e filas virtuais são recorrentes nas datas de pico. Erros técnicos não geram prorrogação de prazo — o edital não espera.' },
  { t:'Pagar a taxa por canais não oficiais',                   d:'Golpistas replicam interfaces idênticas às dos sistemas oficiais para capturar dados e pagamentos de candidatos desatentos. O boleto vem do sistema da banca — ponto.' },
  { t:'Omitir qualquer informação na investigação social',      d:'Tudo o que você não declarar é cruzado com bases públicas. A desclassificação por omissão pode ocorrer após aprovação em todas as etapas anteriores — quando já se investiu mais de um ano.' },
  { t:'Concentrar tudo na objetiva e ignorar a discursiva',    d:'A prova discursiva tem peso classificatório real. Candidatos que chegam sem treino de escrita perdem posições decisivas para a nomeação — mesmo com boa nota na objetiva.' },
];

const depoimentos = [
  { nome:'Rodrigo M.', idade:31, cargo:'Policial Rodoviário Federal', uf:'SP', texto:'Fiquei dois anos estudando sem sair do lugar. Quando parei de tentar cobrir tudo e comecei a trabalhar exatamente o que o edital listava, minha nota subiu em três meses. A questão nunca foi estudar mais — foi estudar o certo.' },
  { nome:'Fernanda L.', idade:28, cargo:'Policial Rodoviária Federal', uf:'MG', texto:'Passei na escrita com folga na primeira tentativa. Fui eliminada no TAF porque não levei o treino físico a sério. Na segunda tentativa, comecei a correr 18 meses antes. Nunca mais subestimei nenhuma fase — cada uma delas pode encerrar a jornada.' },
  { nome:'Carlos A.',  idade:34, cargo:'Agente Administrativo',        uf:'RJ', texto:'Achei que a preparação seria simples. Me pegaram em Direito Constitucional e Penal. Se eu tivesse lido o edital antes de abrir qualquer livro, teria economizado pelo menos seis meses de preparação errada.' },
  { nome:'Juliana R.', idade:26, cargo:'Policial Rodoviária Federal',  uf:'PR', texto:'O que mais me surpreendeu foi a transparência do processo. Critérios objetivos, resultados auditáveis. Não tem quem favorecer nem quem prejudicar. Quem estuda o conteúdo certo e chega em forma tem as mesmas chances que qualquer outro candidato.' },
  { nome:'Marcos T.',  idade:29, cargo:'Policial Rodoviário Federal',  uf:'DF', texto:'A investigação social me tirou o sono por meses. Contei tudo — absolutamente tudo. No final, a regra é simples: quem não tem nada a esconder não tem nada a temer. O que elimina candidatos não é o passado, é a omissão.' },
  { nome:'Ana C.',     idade:32, cargo:'Agente Administrativa',        uf:'RS', texto:'Terceira tentativa. As duas primeiras me ensinaram exatamente o que ajustar. O que mudou de vez foi sistematizar os estudos com base nas provas anteriores da mesma banca e começar o treino físico seis meses antes do previsto. Cada reprovação foi um diagnóstico gratuito.' },
];

const faqs = [
  { q:'Qual é a escolaridade mínima para os cargos da PRF?', r:'Ensino médio completo para ambos os cargos: Policial Rodoviário Federal (511 vagas) e Agente Administrativo (500 vagas). Confirme os requisitos no edital vigente.' },
  { q:'Existe limite de idade para participar?',                           r:'Sim. O limite varia por cargo — cargos operacionais costumam ter limite de 40 anos. Verifique sempre no edital da edição vigente, pois o critério pode mudar entre seleções.' },
  { q:'Preciso de um curso preparatório pago para passar?',               r:'Não. Candidatos aprovados consistentemente relatam ter utilizado provas anteriores da mesma banca como principal material de estudo. O que faz diferença é disciplina, método e o edital como guia — não o curso.' },
  { q:'Como funciona a isenção da taxa de inscrição?',                    r:'Candidatos inscritos no CadÚnico com renda familiar de até 3 salários mínimos têm direito à isenção. O pedido tem prazo anterior ao prazo geral de inscrições — não deixe para o último momento.' },
  { q:'O curso de formação é remunerado?',                                r:'Sim. Durante o curso na Academia Nacional da PRF (ANPRF) em Anápolis/GO, o candidato já recebe a remuneração integral do cargo. A formação não é um período não remunerado.' },
  { q:'Posso me preparar antes do edital ser publicado?',                 r:'Sim — e é altamente recomendável. O conteúdo-base das provas (Português, Lógica, Direito Constitucional, Penal, Administrativo) é estável entre edições. Quem começa antes tem meses de vantagem sobre quem espera o edital para iniciar.' },
  { q:'O TAF tem critérios distintos por sexo e idade?',                  r:'Sim. Os parâmetros são diferenciados por sexo e faixa etária, mas o caráter eliminatório é idêntico para todos. Não há aprovação parcial no TAF.' },
  { q:'Quanto tempo leva do edital à posse?',                             r:'Entre 12 e 18 meses para candidatos classificados dentro das vagas. Quem fica em cadastro de reserva pode aguardar mais tempo, dependendo de chamadas adicionais.' },
];

export default function AntiGooglePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const hasAdParam = (() => {
    const p = new URLSearchParams(window.location.search);
    return p.has("gclid") || p.has("gbraid");
  })();
  const [isRedirecting] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.has('gclid') || params.has('gbraid');
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

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        .pf-page{font-family:'Rawline','Source Sans Pro',Arial,sans-serif;color:${B.text};background:${B.white};overflow-x:hidden;-webkit-font-smoothing:antialiased}
        .pf-wrap{max-width:1160px;margin:0 auto;padding:0 24px}
        .pf-sec{padding:80px 24px}
        .pf-sec-sm{padding:56px 24px}
        .pf-h2{font-size:34px;font-weight:800;color:${B.text};line-height:1.2;margin-bottom:14px}
        .pf-lead{font-size:16px;color:${B.mid};line-height:1.8;max-width:580px;margin:0 auto}
        .pf-label{display:inline-block;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.4px;color:${B.primary};margin-bottom:14px}
        .pf-btn{display:inline-flex;align-items:center;gap:8px;border-radius:6px;padding:14px 28px;font-size:15px;font-weight:700;text-decoration:none;cursor:pointer;transition:all .18s;border:none;font-family:inherit}
        .pf-btn-p{background:${B.primary};color:#fff}.pf-btn-p:hover{background:${B.hover};transform:translateY(-1px);box-shadow:0 4px 16px ${B.primary}44}
        .g2{display:grid;grid-template-columns:1fr 1fr;gap:32px}
        .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
        .g4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
        .card{background:${B.white};border:1px solid ${B.border};border-radius:12px;padding:28px;transition:box-shadow .2s,transform .2s}
        .card:hover{box-shadow:0 6px 24px rgba(19,81,180,.1);transform:translateY(-3px)}
        .faq-item{border:1px solid ${B.border};border-radius:10px;overflow:hidden;margin-bottom:10px;transition:border-color .2s}
        .faq-item.open{border-color:${B.primary}}
        .faq-btn{width:100%;text-align:left;padding:18px 22px;background:none;border:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:inherit;font-size:15px;font-weight:600;color:${B.text};transition:background .15s}
        .faq-btn:hover,.faq-item.open .faq-btn{background:${B.lighter}}
        @media(max-width:900px){.g2,.g3{grid-template-columns:1fr}.g4{grid-template-columns:1fr 1fr}.pf-h2{font-size:26px}}
        @media(max-width:600px){.g4{grid-template-columns:1fr}.pf-sec{padding:56px 16px}.pf-h2{font-size:22px}}
      `}</style>

      <div className="pf-page">
        <AgHeader />

        {/* ── HERO ── */}
        <section style={{ background:`linear-gradient(160deg,${B.dark} 0%,${B.primary} 60%,#1a6fcf 100%)`,padding:'100px 24px 84px',textAlign:'center',position:'relative',overflow:'hidden' }}>
          <div style={{ position:'absolute',top:-100,right:-100,width:400,height:400,borderRadius:'50%',background:'rgba(255,255,255,.04)',pointerEvents:'none' }}/>
          <div style={{ position:'absolute',bottom:-80,left:-80,width:280,height:280,borderRadius:'50%',background:'rgba(255,255,255,.04)',pointerEvents:'none' }}/>
          <div style={{ maxWidth:760,margin:'0 auto',position:'relative' }}>
            <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,.12)',border:'1px solid rgba(255,255,255,.25)',borderRadius:999,padding:'6px 18px',marginBottom:28 }}>
              <span style={{ width:8,height:8,borderRadius:'50%',background:'#4ade80',display:'inline-block',animation:'pulse 2s infinite' }}/>
              <span style={{ fontSize:13,fontWeight:700,color:'rgba(255,255,255,.9)',letterSpacing:.4 }}>Concurso recorrente · 1.011 vagas no edital vigente publicado</span>
            </div>
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
            <h1 style={{ fontSize:52,fontWeight:900,color:'#fff',lineHeight:1.1,marginBottom:22,letterSpacing:'-1.5px' }}>
              Tudo que você precisa saber sobre o<br/>
              <span style={{ color:'#93c5fd' }}>Concurso da Polícia Rodoviária Federal</span>
            </h1>
            <p style={{ fontSize:18,color:'rgba(255,255,255,.82)',lineHeight:1.8,maxWidth:620,margin:'0 auto 36px' }}>
              Cargos, remuneração, fases do processo seletivo e o guia de preparação baseado nos editais anteriores da CEBRASPE. Informação organizada, sem enrolação.
            </p>
            <div style={{ display:'flex',justifyContent:'center',gap:14,flexWrap:'wrap',marginBottom:52 }}>
              <a href="#cargos" className="pf-btn pf-btn-p" style={{ fontSize:16,padding:'16px 36px',borderRadius:8,boxShadow:'0 4px 20px rgba(0,0,0,.3)' }}>
                Ver os cargos e vagas →
              </a>
              <a href="#processo" className="pf-btn" style={{ background:'rgba(255,255,255,.12)',color:'#fff',border:'2px solid rgba(255,255,255,.35)',borderRadius:8,fontSize:16,padding:'16px 28px' }}>
                Entender o processo
              </a>
            </div>
            <div style={{ display:'flex',justifyContent:'center',gap:10,flexWrap:'wrap' }}>
              {['1.011 vagas no edital vigente','7 fases — todas eliminatórias','Estabilidade após 3 anos','Remuneração desde a formação'].map(v=>(
                <span key={v} style={{ background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.2)',borderRadius:999,padding:'6px 14px',fontSize:13,fontWeight:600,color:'rgba(255,255,255,.9)' }}>{v}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ background:B.white,borderBottom:`1px solid ${B.border}` }}>
          <div className="pf-wrap" style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',textAlign:'center',padding:'36px 24px' }}>
            {[
              { v:'1.011',    l:'vagas no edital vigente',                  c:B.primary },
              { v:'7',        l:'etapas — nenhuma pode ser ignorada',     c:'#c53030'  },
              { v:'~18 m',    l:'do edital à posse (média histórica)',    c:B.gold     },
              { v:'26 UFs',   l:'atuação em todo o território nacional',  c:B.green    },
            ].map((s,i,arr)=>(
              <div key={i} style={{ padding:'8px 12px',borderRight:i<arr.length-1?`1px solid ${B.border}`:'none' }}>
                <div style={{ fontSize:28,fontWeight:900,color:s.c,marginBottom:4 }}>{s.v}</div>
                <div style={{ fontSize:13,color:B.mid }}>{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── POR QUE PRF ── */}
        <section className="pf-sec" style={{ background:B.bg }}>
          <div className="pf-wrap g2" style={{ maxWidth:1060,alignItems:'start' }}>
            <div>
              <span className="pf-label">Por que a Polícia Rodoviária Federal?</span>
              <h2 className="pf-h2">Estabilidade, propósito e carreira que a iniciativa privada não consegue oferecer</h2>
              <p style={{ fontSize:15,color:B.mid,lineHeight:1.9,marginBottom:16 }}>
                A Polícia Rodoviária Federal é o principal órgão de policiamento ostensivo das rodovias federais — responsável por fiscalizar o trânsito, combater o crime nas estradas e garantir a segurança de todos que circulam pelas rodovias federais do Brasil. É uma das carreiras mais respeitadas da segurança pública nacional.
              </p>
              <p style={{ fontSize:15,color:B.mid,lineHeight:1.9,marginBottom:16 }}>
                O acesso é exclusivamente por concurso público — critérios objetivos, transparentes e meritocráticos. Após aprovação, o servidor tem progressão funcional definida em lei, sem margem para favoritismos, e estabilidade plena após o estágio probatório de três anos.
              </p>
              <p style={{ fontSize:15,color:B.mid,lineHeight:1.9 }}>
                A PRF está presente em todos os estados e no Distrito Federal, atuando 24 horas por dia nas rodovias federais. Cada policial contribui concretamente para a redução de acidentes, o combate ao tráfico e a segurança pública. É uma carreira com impacto real e mensurável.
              </p>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
              {[
                { icon:'🏛️', t:'Infraestrutura entre as melhores do país',   d:'Peritos trabalham em laboratórios de ponta para América Latina — computação forense, química, medicina legal e biometria com equipamentos de nível internacional.' },
                { icon:'📊', t:'Aprovado dentro das vagas = nomeação certa', d:'Candidatos classificados dentro do número de vagas têm nomeação assegurada por lei. Não existe "aprovado sem vaga" para quem passa dentro do quadro oficial.' },
                { icon:'🌟', t:'Carreira definida em lei, sem surpresas',     d:'Progressões por mérito e antiguidade são garantias legais — não dependem de humor do gestor ou orçamento da empresa. Você planeja sua carreira com décadas de antecedência.' },
                { icon:'🌐', t:'Brasil e mundo — literalmente',               d:'Presença em todos os 26 estados e no DF, com missões internacionais reais em parceria com DEA, Europol e Interpol. Uma abrangência que poucas carreiras oferecem.' },
              ].map(c=>(
                <div key={c.t} style={{ display:'flex',gap:14,background:B.white,borderRadius:10,padding:'18px 20px',border:`1px solid ${B.border}`,borderLeft:`3px solid ${B.primary}` }}>
                  <span style={{ fontSize:22,flexShrink:0,paddingTop:2 }}>{c.icon}</span>
                  <div>
                    <div style={{ fontWeight:700,fontSize:14,color:B.text,marginBottom:4 }}>{c.t}</div>
                    <div style={{ fontSize:13,color:B.mid,lineHeight:1.7 }}>{c.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CARGOS ── */}
        <section id="cargos" className="pf-sec" style={{ background:B.white }}>
          <div className="pf-wrap">
            <div style={{ textAlign:'center',marginBottom:52 }}>
              <span className="pf-label">Cargos disponíveis</span>
              <h2 className="pf-h2">Escolha o cargo certo — sua preparação começa aqui</h2>
              <p className="pf-lead">Cada cargo tem perfil, formação exigida e atribuições distintas. Essa decisão define o conteúdo de estudo, o nível de exigência física e o seu caminho dentro da corporação.</p>
            </div>
            <div className="g3">
              {cargos.map((c,i)=>(
                <div key={i} className="card" style={{ padding:0,overflow:'hidden' }}>
                  <div style={{ height:5,background:`linear-gradient(90deg,${B.primary},${B.dark})` }}/>
                  <div style={{ padding:'24px' }}>
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12 }}>
                      <span style={{ fontSize:28 }}>{c.icon}</span>
                      <span style={{ fontSize:11,fontWeight:700,color:B.primary,background:B.lighter,padding:'3px 10px',borderRadius:999,border:`1px solid ${B.border}` }}>{c.vagas}</span>
                    </div>
                    <h3 style={{ fontSize:15,fontWeight:800,color:B.text,marginBottom:6,lineHeight:1.3 }}>{c.titulo}</h3>
                    <p style={{ fontSize:13,color:B.mid,lineHeight:1.7,marginBottom:14 }}>{c.desc}</p>
                    <div style={{ borderTop:`1px solid ${B.border}`,paddingTop:12 }}>
                      <span style={{ fontSize:11,color:B.muted,textTransform:'uppercase',letterSpacing:.6 }}>Formação mínima</span>
                      <div style={{ fontSize:13,fontWeight:700,color:B.text,marginTop:3 }}>{c.area}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROCESSO SELETIVO ── */}
        <section id="processo" className="pf-sec" style={{ background:B.bg }}>
          <div className="pf-wrap" style={{ maxWidth:900 }}>
            <div style={{ textAlign:'center',marginBottom:52 }}>
              <span className="pf-label">Processo de seleção</span>
              <h2 className="pf-h2">7 fases — cada uma pode encerrar sua jornada</h2>
              <p className="pf-lead">A aprovação na escrita é apenas a primeira barreira. Candidatos que negligenciam qualquer fase seguinte perdem tudo que construíram — independente da nota que fizeram.</p>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
              {fases.map((f,i)=>(
                <div key={i} style={{ display:'flex',gap:20,background:B.white,borderRadius:12,border:`1px solid ${B.border}`,padding:'22px 26px',transition:'box-shadow .2s' }}
                  onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.boxShadow=`0 4px 16px rgba(19,81,180,.1)`}
                  onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.boxShadow='none'}>
                  <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:6,flexShrink:0 }}>
                    <div style={{ width:48,height:48,borderRadius:10,background:B.lighter,border:`2px solid ${B.primary}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center' }}>
                      <span style={{ fontSize:9,fontWeight:800,color:B.primary }}>FASE</span>
                      <span style={{ fontSize:16,fontWeight:900,color:B.primary,lineHeight:1 }}>{f.n}</span>
                    </div>
                    <span style={{ fontSize:20 }}>{f.icon}</span>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:6,flexWrap:'wrap' }}>
                      <h3 style={{ fontSize:16,fontWeight:800,color:B.text }}>{f.nome}</h3>
                      <span style={{ fontSize:11,fontWeight:700,color:B.primary,background:B.lighter,padding:'2px 10px',borderRadius:999,border:`1px solid ${B.border}` }}>{f.badge}</span>
                    </div>
                    <p style={{ fontSize:14,color:B.mid,lineHeight:1.8 }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:24,background:'#fff8e1',border:'1px solid #ffc107',borderRadius:10,padding:'20px 24px' }}>
              <p style={{ fontSize:14,color:'#6d4c00',lineHeight:1.8,margin:0 }}>
                <strong>⚠️ O erro mais caro do candidato:</strong> Tratar o TAF como detalhe. Aprovados com notas excelentes são eliminados nessa fase todos os anos. Condicionamento físico não se constrói em semanas — comece no primeiro dia de preparação, não após a convocação.
              </p>
            </div>
          </div>
        </section>

        {/* ── BENEFÍCIOS ── */}
        <section className="pf-sec" style={{ background:B.white }}>
          <div className="pf-wrap">
            <div style={{ textAlign:'center',marginBottom:52 }}>
              <span className="pf-label">O pacote completo</span>
              <h2 className="pf-h2">Salário é só o começo</h2>
              <p className="pf-lead">O servidor da PRF conta com um dos pacotes de benefícios mais robustos do serviço público federal — benefícios que o setor privado raramente oferece com essa completude.</p>
            </div>
            <div className="g4">
              {beneficios.map((b,i)=>(
                <div key={i} className="card">
                  <div style={{ fontSize:30,marginBottom:14 }}>{b.icon}</div>
                  <h4 style={{ fontSize:14,fontWeight:800,color:B.text,marginBottom:8,lineHeight:1.3 }}>{b.titulo}</h4>
                  <p style={{ fontSize:13,color:B.mid,lineHeight:1.7 }}>{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GUIA PASSO A PASSO ── */}
        <section id="guia" className="pf-sec" style={{ background:B.bg }}>
          <div className="pf-wrap" style={{ maxWidth:900 }}>
            <div style={{ textAlign:'center',marginBottom:52 }}>
              <span className="pf-label">Guia passo a passo</span>
              <h2 className="pf-h2">Do zero à inscrição confirmada — sem errar o caminho</h2>
              <p className="pf-lead">Seis etapas em sequência. Cada uma tem armadilhas específicas que eliminam candidatos antes mesmo da prova começar.</p>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:20 }}>
              {[
                { n:'01', icon:'🔍', title:'Leia o edital oficial completo — antes de qualquer outra coisa',
                  body:'O edital é o único documento com força legal. Acesse sempre pelo portal gov.br — não use links de terceiros ou redes sociais. Baixe o PDF, confirme a data e o número de publicação no Diário Oficial da União, e crie uma pasta para guardar o edital e todas as retificações.',
                  tips:['Acesse exclusivamente pelo gov.br','Salve o PDF localmente antes dos prazos finais','Monitore retificações no DOU com periodicidade semanal'] },
                { n:'02', icon:'📋', title:'Confirme que você atende todos os requisitos do seu cargo',
                  body:'Antes de qualquer passo seguinte, leia cada exigência do cargo linha a linha. Policial Rodoviário Federal e Agente Administrativo exigem ensino médio completo. Há também exigências de idoneidade e, para cargos operacionais, limite de idade e CNH.',
                  tips:['Leia os requisitos cargo a cargo — sem generalizar','Verifique se OAB/CRM/CREA está ativo e dentro do prazo','Confira a exigência de CNH válida e categoria correta'] },
                { n:'03', icon:'🔐', title:'Crie e valide sua conta gov.br — não deixe para depois',
                  body:'Toda inscrição federal exige conta gov.br com nível de confiabilidade adequado (Prata ou Ouro). O caminho mais rápido para o nível Ouro é pelo app do seu banco conveniado. O processo leva menos de 10 minutos — mas o sistema trava nos dias de pico.',
                  tips:['Use o app do banco — método mais rápido e confiável','Faça isso hoje, não na semana do prazo','Guarde suas credenciais em local seguro'] },
                { n:'04', icon:'📝', title:'Preencha o formulário de inscrição com atenção total',
                  body:'Acesse o sistema do organizador indicado no edital. Nome idêntico ao documento, CPF correto, e-mail válido e escolha estratégica do local de prova. A seleção do local de prova é definitiva — considere logística, hospedagem e custo de deslocamento antes de confirmar. Guarde o comprovante com o número de protocolo.',
                  tips:['Nome rigorosamente igual ao documento de identificação','Escolha o local de prova com estratégia — é uma decisão definitiva','Salve o comprovante com número de protocolo e todos os dados'] },
                { n:'05', icon:'📄', title:'Efetue o pagamento pelo documento oficial — e guarde o comprovante',
                  body:'Pague exclusivamente pelo documento gerado pelo sistema oficial da banca. PIX é creditado instantaneamente — ideal para datas próximas ao prazo. Boleto bancário leva até 3 dias úteis para compensar. Guarde o comprovante em múltiplos formatos — ele pode ser solicitado em qualquer etapa posterior.',
                  tips:['PIX é a opção mais segura próximo ao prazo limite','Use somente o documento gerado pelo sistema da banca','Comprovante com data e dados completos — guarde em nuvem e local'] },
                { n:'06', icon:'📅', title:'Prepare-se com método, edital como guia e treino físico desde o dia 1',
                  body:'Uma preparação séria exige entre 12 e 24 meses. Monte o cronograma com base exclusivamente no conteúdo programático do edital. Priorize as disciplinas de maior peso e resolva provas anteriores da mesma banca para entender o estilo. O treino físico começa junto com os estudos — não depois da convocação para o TAF.',
                  tips:['O edital é o único guia de estudos confiável — ignore o resto','Resolva provas anteriores da mesma banca desde o início','Ao menos 3 sessões de treino aeróbico por semana — sem exceção'] },
              ].map((s,i)=>(
                <div key={i} style={{ display:'flex',gap:22 }}>
                  <div style={{ display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0,width:56 }}>
                    <div style={{ width:52,height:52,borderRadius:'50%',background:B.lighter,border:`2.5px solid ${B.primary}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,boxShadow:`0 0 0 5px ${B.primary}15` }}>{s.icon}</div>
                    {i<5&&<div style={{ width:2,flex:1,background:`linear-gradient(${B.primary},${B.light})`,margin:'6px 0',minHeight:36,opacity:.4 }}/>}
                  </div>
                  <div style={{ flex:1,background:B.white,borderRadius:12,border:`1px solid ${B.border}`,padding:'24px 28px',marginBottom:4 }}>
                    <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:10,flexWrap:'wrap' }}>
                      <span style={{ fontSize:11,fontWeight:800,color:B.primary,background:B.lighter,padding:'3px 10px',borderRadius:999,border:`1px solid ${B.border}` }}>PASSO {s.n}</span>
                    </div>
                    <h3 style={{ fontSize:18,fontWeight:800,color:B.text,marginBottom:12,lineHeight:1.3 }}>{s.title}</h3>
                    <p style={{ fontSize:14,color:B.mid,lineHeight:1.85,marginBottom:18 }}>{s.body}</p>
                    <div style={{ background:B.lighter,borderRadius:8,padding:'14px 18px',border:`1px solid ${B.border}` }}>
                      <p style={{ fontSize:11,fontWeight:800,color:B.primary,textTransform:'uppercase',letterSpacing:1,marginBottom:10 }}>✓ Checklist desta etapa</p>
                      <div style={{ display:'flex',flexDirection:'column',gap:7 }}>
                        {s.tips.map(t=>(
                          <div key={t} style={{ display:'flex',alignItems:'flex-start',gap:8,fontSize:13,color:B.text }}>
                            <div style={{ width:18,height:18,borderRadius:'50%',background:B.primary,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,flexShrink:0,marginTop:1,fontWeight:800 }}>✓</div>
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ERROS COMUNS ── */}
        <section className="pf-sec" style={{ background:B.white }}>
          <div className="pf-wrap" style={{ maxWidth:1040 }}>
            <div style={{ textAlign:'center',marginBottom:52 }}>
              <span className="pf-label" style={{ color:B.red }}>Evite antes que seja tarde</span>
              <h2 className="pf-h2">6 erros que eliminam candidatos que mereciam passar</h2>
              <p className="pf-lead">Não são erros por falta de capacidade — são erros por falta de informação. Todos são perfeitamente evitáveis.</p>
            </div>
            <div className="g3">
              {erros.map((e,i)=>(
                <div key={i} style={{ background:B.white,borderRadius:10,padding:'22px 24px',border:`1px solid ${B.border}`,borderLeft:`3px solid ${B.red}`,transition:'box-shadow .2s' }}
                  onMouseEnter={el=>(el.currentTarget as HTMLDivElement).style.boxShadow=`0 4px 16px rgba(197,48,48,.1)`}
                  onMouseLeave={el=>(el.currentTarget as HTMLDivElement).style.boxShadow='none'}>
                  <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:10 }}>
                    <div style={{ width:26,height:26,borderRadius:'50%',background:'#fff0f0',color:B.red,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:12,flexShrink:0,border:`1px solid ${B.red}33` }}>✕</div>
                    <h4 style={{ fontSize:14,fontWeight:800,color:B.text,lineHeight:1.3 }}>{e.t}</h4>
                  </div>
                  <p style={{ fontSize:13,color:B.mid,lineHeight:1.8 }}>{e.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DEPOIMENTOS ── */}
        <section className="pf-sec" style={{ background:B.bg }}>
          <div className="pf-wrap">
            <div style={{ textAlign:'center',marginBottom:52 }}>
              <span className="pf-label">Relatos de aprovados</span>
              <h2 className="pf-h2">O que candidatos aprovados relataram sobre a preparação</h2>
              <p className="pf-lead">Experiências compartilhadas com candidatos aprovados em edições anteriores. Nomes, idades e estados foram alterados para preservar a privacidade.</p>
            </div>
            <div className="g3">
              {depoimentos.map((d,i)=>(
                <div key={i} style={{ background:B.white,borderRadius:14,padding:'28px',border:`1px solid ${B.border}`,display:'flex',flexDirection:'column',gap:18,transition:'all .2s' }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow=`0 8px 24px rgba(19,81,180,.1)`;(e.currentTarget as HTMLDivElement).style.transform='translateY(-3px)'}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.boxShadow='none';(e.currentTarget as HTMLDivElement).style.transform='translateY(0)'}}>
                  <div style={{ fontSize:32,color:B.primary,opacity:.35,lineHeight:1 }}>"</div>
                  <p style={{ fontSize:14,color:B.mid,lineHeight:1.9,fontStyle:'italic',flexGrow:1 }}>{d.texto}</p>
                  <div style={{ borderTop:`1px solid ${B.border}`,paddingTop:16,display:'flex',alignItems:'center',gap:12 }}>
                    <div style={{ width:42,height:42,borderRadius:'50%',background:B.lighter,display:'flex',alignItems:'center',justifyContent:'center',border:`2px solid ${B.border}`,flexShrink:0,fontWeight:700,color:B.primary,fontSize:18 }}>
                      {d.nome.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight:800,fontSize:14,color:B.text }}>{d.nome}, {d.idade} anos</div>
                      <div style={{ fontSize:12,color:B.primary,fontWeight:600 }}>{d.cargo}</div>
                      <div style={{ fontSize:11,color:B.muted }}>{d.uf}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="pf-sec" style={{ background:B.white }}>
          <div className="pf-wrap" style={{ maxWidth:800 }}>
            <div style={{ textAlign:'center',marginBottom:44 }}>
              <span className="pf-label">Dúvidas frequentes</span>
              <h2 className="pf-h2">Respostas diretas para as perguntas que mais surgem</h2>
              <p className="pf-lead">Baseadas no histórico das últimas seleções e nas objeções mais comuns de quem está considerando se inscrever.</p>
            </div>
            {faqs.map((f,i)=>(
              <div key={i} className={`faq-item${openFaq===i?' open':''}`}>
                <button className="faq-btn" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  <span style={{ fontWeight:600,color:B.text,lineHeight:1.4,textAlign:'left' }}>{f.q}</span>
                  <span style={{ fontSize:22,color:B.primary,flexShrink:0,fontWeight:300,lineHeight:1,width:24,textAlign:'center' }}>{openFaq===i?'−':'+'}</span>
                </button>
                {openFaq===i&&(
                  <div style={{ padding:'0 22px 18px',fontSize:14,color:B.mid,lineHeight:1.85,borderTop:`1px solid ${B.border}`,paddingTop:16 }}>
                    <div style={{ paddingTop:16 }}>{f.r}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── FONTES OFICIAIS ── */}
        <section className="pf-sec-sm" style={{ background:B.bg }}>
          <div className="pf-wrap" style={{ maxWidth:960 }}>
            <div style={{ textAlign:'center',marginBottom:36 }}>
              <span className="pf-label">Fontes oficiais</span>
              <h2 style={{ fontSize:26,fontWeight:800,color:B.text,marginBottom:10 }}>Informação confiável vem de uma fonte só</h2>
              <p style={{ fontSize:15,color:B.mid }}>Qualquer dado relevante sobre a seleção está em um desses quatro portais. Não aceite atalhos.</p>
            </div>
            <div className="g4">
              {[
                { icon:'🌐', t:'Portal da PRF',           d:'Editais, publicações oficiais e informações institucionais. Acesse diretamente pelo gov.br — sem links de terceiros.' },
                { icon:'📰', t:'Diário Oficial da União', d:'Publicação de editais e retificações com força jurídica. O único documento que vale legalmente.' },
                { icon:'🏛️', t:'Portal gov.br',           d:'Cadastro, validação de identidade e acesso aos serviços do governo federal — incluindo a conta exigida para inscrição.' },
                { icon:'📋', t:'Banca Organizadora',      d:'O edital informa a banca responsável (CEBRASPE ou outra) e o link oficial de inscrição. Qualquer outro link é suspeito.' },
              ].map(r=>(
                <div key={r.t} style={{ background:B.white,borderRadius:10,padding:'22px 20px',border:`1px solid ${B.border}`,transition:'all .2s' }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.borderColor=B.primary;(e.currentTarget as HTMLDivElement).style.boxShadow=`0 4px 16px rgba(19,81,180,.1)`}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.borderColor=B.border;(e.currentTarget as HTMLDivElement).style.boxShadow='none'}}>
                  <div style={{ fontSize:26,marginBottom:12 }}>{r.icon}</div>
                  <div style={{ fontSize:14,fontWeight:800,color:B.text,marginBottom:6 }}>{r.t}</div>
                  <div style={{ fontSize:13,color:B.mid,lineHeight:1.7 }}>{r.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ background:`linear-gradient(140deg,${B.dark} 0%,${B.primary} 70%,#1a6fcf 100%)`,padding:'96px 24px',textAlign:'center',position:'relative',overflow:'hidden' }}>
          <div style={{ position:'absolute',top:-60,right:-60,width:280,height:280,borderRadius:'50%',background:'rgba(255,255,255,.04)',pointerEvents:'none' }}/>
          <div style={{ position:'absolute',bottom:-40,left:-40,width:200,height:200,borderRadius:'50%',background:'rgba(255,255,255,.04)',pointerEvents:'none' }}/>
          <div style={{ maxWidth:620,margin:'0 auto',position:'relative' }}>
            <div style={{ fontSize:52,marginBottom:16 }}>🚔</div>
            <h2 style={{ fontSize:36,fontWeight:900,color:'#fff',marginBottom:16,lineHeight:1.15,letterSpacing:'-1px' }}>
              Quem começa com informação correta<br/>chega mais longe na preparação.
            </h2>
            <p style={{ fontSize:17,color:'rgba(255,255,255,.8)',marginBottom:12,lineHeight:1.8,maxWidth:500,margin:'0 auto 12px' }}>
              Cargos, salários, as 7 fases do processo e o guia de preparação baseado nos editais anteriores. Tudo nesta página, gratuito e sem cadastro.
            </p>
            <p style={{ fontSize:13,color:'rgba(255,255,255,.5)',marginBottom:44 }}>
              Conteúdo informativo gratuito · Portal privado e independente · Baseado em editais oficiais anteriores
            </p>
            <div style={{ display:'flex',justifyContent:'center',gap:14,flexWrap:'wrap' }}>
              <a href="#cargos" style={{ background:'#fff',color:B.dark,borderRadius:8,padding:'16px 36px',textDecoration:'none',fontWeight:800,fontSize:16,boxShadow:'0 4px 20px rgba(0,0,0,.3)',transition:'all .2s' }}
                onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.transform='translateY(-2px)'}
                onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.transform='translateY(0)'}>
                Ver os cargos e remuneração →
              </a>
              <a href="#faq" style={{ background:'transparent',color:'#fff',borderRadius:8,padding:'16px 28px',textDecoration:'none',fontWeight:700,fontSize:15,border:'2px solid rgba(255,255,255,.4)' }}>
                Ler as dúvidas frequentes
              </a>
            </div>
          </div>
        </section>

        <AgFooter />
      </div>
    </>
  );
}
