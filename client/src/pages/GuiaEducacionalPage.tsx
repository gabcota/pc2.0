import { useState, useEffect } from 'react';
import { getSiteConfig } from '@/lib/siteConfig';
import { SecurityLoader } from '@/components/SecurityLoader';
import { markFunnelValidated } from '@/lib/funnelGate';

/* ─── AWS-inspired palette ─────────────────────────────────── */
const C = {
  navy:    '#232F3E',
  navyD:   '#161E2D',
  navyM:   '#2D3A4A',
  orange:  '#FF9900',
  orangeD: '#E88A00',
  blue:    '#0073BB',
  blueL:   '#E6F2F8',
  white:   '#FFFFFF',
  bg:      '#F8F8F8',
  bgAlt:   '#F2F3F3',
  ink:     '#16191F',
  body:    '#232F3E',
  mid:     '#545B64',
  muted:   '#879596',
  line:    '#D5DBDB',
  lineL:   '#EAEDED',
  red:     '#D13212',
  redL:    '#FBEAEA',
  green:   '#1D7324',
  greenL:  '#EBF6EC',
};

/* ─── Data ──────────────────────────────────────────────────── */
const cargos = [
  { cargo: 'Policial Rodoviário Federal', req: 'Ensino médio completo', vol: '511 vagas', sal: 'R$ 17.484,45', icon: '🚔' },
  { cargo: 'Agente Administrativo',       req: 'Ensino médio completo', vol: '500 vagas', sal: 'R$ 5.173,28',  icon: '📋' },
];

const etapas = [
  { n: '01', nome: 'Prova Objetiva',         badge: 'Eliminatória · Classificatória', desc: 'Múltipla escolha abrangendo Língua Portuguesa, Lógica, Informática, Direito Constitucional, Penal, Administrativo, Legislação PRF e matéria específica do cargo. A nota de corte por disciplina é eliminatória — zerar qualquer uma delas encerra a participação independentemente da nota global.' },
  { n: '02', nome: 'Prova Discursiva',        badge: 'Eliminatória · Classificatória', desc: 'Dissertação ou peça jurídica avaliando argumentação, clareza e domínio da norma culta. Candidatos sem treino de escrita perdem posições decisivas mesmo com boa nota na objetiva.' },
  { n: '03', nome: 'Teste de Aptidão Física', badge: 'Eliminatória',                   desc: 'Cooper (12 min), barra fixa ou flexão, natação e abdominal, com parâmetros diferenciados por sexo e faixa etária. É a fase que mais surpreende: candidatos com excelentes notas escritas são eliminados por terem adiado o treino.' },
  { n: '04', nome: 'Exame Médico',            badge: 'Eliminatória',                   desc: 'Junta médica avalia condições clínicas, oftalmológicas, audiológicas e psiquiátricas conforme critérios objetivos do edital. Exames preventivos antes de iniciar a preparação evitam surpresas tardias.' },
  { n: '05', nome: 'Avaliação Psicológica',   badge: 'Eliminatória',                   desc: 'Baterias cognitivas e de personalidade, complementadas por entrevista. Avalia equilíbrio emocional, controle sob pressão e compatibilidade com a atividade policial.' },
  { n: '06', nome: 'Investigação Social',     badge: 'Eliminatória',                   desc: 'Análise profunda da vida pregressa: histórico criminal, trabalhista, financeiro, redes sociais e referências pessoais. Qualquer omissão deliberada resulta em desclassificação imediata.' },
  { n: '07', nome: 'Curso de Formação (ANPRF)', badge: 'Eliminatória · Classificatória', desc: 'Etapa final na Academia Nacional da PRF, em Anápolis/GO. Duração de 3 a 6 meses com remuneração integral desde o primeiro dia. Abrange teoria, tiro, defesa pessoal e simulações reais.' },
];

const passos = [
  { n: 1, t: 'Leia o edital antes de qualquer outra coisa',            d: 'O edital é o único documento com validade legal. Antes de comprar material ou contratar curso, leia do início ao fim. Se ainda não publicado, estude com base nas últimas três edições — o programa-base da CEBRASPE é notavelmente estável.' },
  { n: 2, t: 'Monte uma matriz de prioridade por disciplina',           d: 'Cruze o peso de cada matéria (nº de questões × nota de corte) com seu desempenho atual numa prova diagnóstica. Matérias com alto peso e baixo desempenho têm prioridade máxima.' },
  { n: 3, t: 'Resolva provas anteriores da CEBRASPE como método central', d: 'A CEBRASPE tem estilo específico: afirmações para julgamento certo/errado com armadilhas em uma única palavra. Candidatos que só estudam teoria e não treinam o formato cometem erros que não refletem falta de conhecimento.' },
  { n: 4, t: 'Inicie o treino físico desde o primeiro dia',             d: 'Condicionamento aeróbico leva meses para ser construído. O TAF elimina aprovados na escrita todos os anos. Três sessões semanais desde o início não é opcional — é estratégia.' },
  { n: 5, t: 'Revise ativamente, não releia passivamente',             d: 'Reserve ao menos 30% do tempo para revisão produtiva: resolução de questões, mapas mentais ou reprodução oral. Reler sem produzir conteúdo gera sensação de progresso sem consolidação real.' },
];

const erros = [
  { t: 'Estudar por apostilas sem ler o edital primeiro',   d: 'Apostilas genéricas incluem conteúdo fora do programa e omitem o que a banca efetivamente cobra.' },
  { t: 'Tratar o TAF como detalhe de última hora',          d: 'O condicionamento físico elimina aprovados na escrita todos os anos — começa meses antes, não na convocação.' },
  { t: 'Criar a conta gov.br no prazo final',               d: 'Instabilidade e filas virtuais são recorrentes. Erros técnicos não geram prorrogação de prazo.' },
  { t: 'Omitir qualquer informação na investigação social', d: 'Tudo que não foi declarado é cruzado com bases públicas. A desclassificação pode ocorrer após aprovação em todas as etapas.' },
  { t: 'Ignorar a prova discursiva',                        d: 'Tem peso classificatório real. Candidatos sem treino de escrita perdem posições decisivas.' },
  { t: 'Esperar o edital para começar a estudar',           d: 'Disciplinas core são estáveis entre edições. Quem começa antes tem meses de vantagem competitiva.' },
];

const faqs = [
  { q: 'Qual é a escolaridade mínima para os cargos da PRF?', r: 'Ensino médio completo para ambos os cargos: Policial Rodoviário Federal e Agente Administrativo. Confirme os requisitos no edital da edição em curso.' },
  { q: 'Existe limite de idade para participar?',                          r: 'Sim. Em editais anteriores, cargos operacionais estabeleceram limite de 40 anos. O critério pode variar — consulte sempre o edital publicado no Diário Oficial da União.' },
  { q: 'Preciso de curso preparatório pago para passar?',                 r: 'Não. Candidatos aprovados relatam que provas anteriores da CEBRASPE foram o principal material. Método, disciplina e o edital como guia fazem a diferença.' },
  { q: 'Como funciona a isenção da taxa de inscrição?',                   r: 'Inscritos no CadÚnico com renda familiar de até 3 salários mínimos têm direito à isenção. O pedido tem prazo anterior ao geral de inscrições.' },
  { q: 'O curso de formação na ANPRF é remunerado?',                     r: 'Sim. Com base em editais anteriores, alunos recebem remuneração integral desde o primeiro dia em Anápolis/GO.' },
  { q: 'Quanto tempo leva do edital à posse?',                           r: 'Com base no histórico de edições: 12 a 18 meses para candidatos dentro das vagas. Cadastro de reserva pode aguardar mais.' },
  { q: 'O TAF tem critérios distintos por sexo e idade?',                r: 'Sim. Os parâmetros são diferenciados, mas o caráter eliminatório é idêntico para todos.' },
  { q: 'Posso me preparar antes do edital ser publicado?',               r: 'Sim — e os aprovados recomendam. Português, Lógica, Direito Constitucional, Penal e Administrativo são estáveis entre edições.' },
];

/* ─── Component ─────────────────────────────────────────────── */
export default function GuiaEducacionalPage() {
  const cfg = getSiteConfig();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openEtapa, setOpenEtapa] = useState<number | null>(null);
  const hasAdParam = (() => {
    const p = new URLSearchParams(window.location.search);
    return p.has("gclid") || p.has("gbraid");
  })();
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

  if (isRedirecting) return <SecurityLoader />;

  return (
    <div style={{ fontFamily: "'Amazon Ember','Source Sans Pro',Arial,sans-serif", color: C.ink, background: C.white, minHeight: '100vh' }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        .aw{max-width:1100px;margin:0 auto;padding:0 24px}
        .aw-sec{padding:72px 24px}
        .aw-sec-sm{padding:52px 24px}
        a{color:${C.blue};text-decoration:none}
        a:hover{text-decoration:underline;color:${C.orangeD}}
        .aw-h2{font-size:clamp(22px,3vw,30px);font-weight:700;color:${C.ink};line-height:1.25;margin-bottom:10px}
        .aw-label{display:inline-block;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${C.orange};margin-bottom:12px}
        .aw-body{font-size:15px;color:${C.mid};line-height:1.75}
        .aw-card{background:${C.white};border:1px solid ${C.line};border-radius:8px;padding:24px;transition:box-shadow .2s,transform .15s}
        .aw-card:hover{box-shadow:0 6px 24px rgba(0,0,0,0.10);transform:translateY(-2px)}
        .aw-btn-primary{display:inline-block;background:${C.orange};color:${C.navyD};font-weight:700;font-size:15px;padding:13px 26px;border-radius:4px;border:none;cursor:pointer;transition:background .2s;text-decoration:none}
        .aw-btn-primary:hover{background:${C.orangeD};text-decoration:none;color:${C.navyD}}
        .aw-btn-ghost{display:inline-block;background:transparent;color:${C.white};font-weight:700;font-size:15px;padding:12px 26px;border-radius:4px;border:2px solid rgba(255,255,255,.55);cursor:pointer;transition:border-color .2s,background .2s;text-decoration:none}
        .aw-btn-ghost:hover{border-color:${C.white};background:rgba(255,255,255,.1);text-decoration:none;color:${C.white}}
        .aw-grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .aw-grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px}
        .aw-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        .aw-divider{border:none;border-top:1px solid ${C.line}}
        .aw-faq-row{border-bottom:1px solid ${C.line}}
        .aw-faq-btn{width:100%;text-align:left;background:none;border:none;cursor:pointer;padding:18px 0;font-size:15px;font-weight:600;color:${C.ink};display:flex;justify-content:space-between;align-items:center;gap:16px;font-family:inherit;transition:color .15s}
        .aw-faq-btn:hover{color:${C.blue}}
        .aw-nav-link{color:rgba(255,255,255,.85);font-size:14px;text-decoration:none;transition:color .15s}
        .aw-nav-link:hover{color:${C.orange};text-decoration:none}
        .aw-footer-link{color:#96A8B5;font-size:13px;text-decoration:none;display:block;margin-bottom:8px;transition:color .15s}
        .aw-footer-link:hover{color:${C.white};text-decoration:underline}
        .aw-step-num{width:44px;height:44px;border-radius:50%;background:${C.orange};color:${C.navyD};font-weight:800;font-size:17px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        @media(max-width:768px){.aw-grid2,.aw-grid3,.aw-grid4{grid-template-columns:1fr}.aw-grid2.cargo-tbl{grid-template-columns:1fr}}
        @media(max-width:640px){.aw-sec{padding:48px 16px}.aw-sec-sm{padding:36px 16px}.aw{padding:0 16px}}
      `}</style>

      {/* ── Aviso legal top bar ──────────────────────── */}
      <div style={{ background: C.navyD, borderBottom: `2px solid ${C.orange}`, padding: '8px 24px' }}>
        <div className="aw" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: C.orange, fontSize: 13, flexShrink: 0 }}>⚠</span>
          <p style={{ fontSize: 11.5, color: '#96A8B5', lineHeight: 1.5 }}>
            <strong style={{ color: '#C8D3D8' }}>PORTAL EDUCACIONAL INDEPENDENTE</strong>
            {' '}— {cfg?.siteName ?? 'Este portal'} é um veículo privado de informação.
            {cfg?.disclaimer ? ` ${cfg.disclaimer}` : ' Não representa comunicação oficial da Polícia Rodoviária Federal, Governo Federal ou de qualquer banca organizadora de concursos.'}
          </p>
        </div>
      </div>

      {/* ── Header ─────────────────────────────────────── */}
      <header style={{ background: C.navy, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(0,0,0,0.35)' }}>
        <div className="aw" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ background: C.orange, borderRadius: 5, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 18 }}>🛡️</span>
            </div>
            <div>
              <div style={{ color: C.white, fontWeight: 800, fontSize: 15, lineHeight: 1.1 }}>{cfg?.siteName ?? 'Portal PRF'}</div>
              <div style={{ color: C.orange, fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Guia Educacional</div>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            {[['#cargos','Cargos'],['#etapas','Etapas'],['#preparacao','Preparação'],['#faq','FAQ']].map(([h,l]) => (
              <a key={h} href={h} className="aw-nav-link">{l}</a>
            ))}
            <a href="/edital-explicado" className="aw-btn-primary" style={{ fontSize: 13, padding: '8px 18px' }}>
              Ver vagas →
            </a>
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(160deg, ${C.navyD} 0%, #1a2d48 55%, #0f3460 100%)`, padding: '88px 24px 96px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,153,0,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,153,0,0.04)', pointerEvents: 'none' }} />
        <div className="aw" style={{ position: 'relative', maxWidth: 860 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,153,0,0.15)', border: '1px solid rgba(255,153,0,0.3)', borderRadius: 3, padding: '4px 12px', marginBottom: 22 }}>
            <span style={{ color: C.orange, fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase' }}>📖 Guia Educacional Completo</span>
          </div>
          <h1 style={{ color: C.white, fontSize: 'clamp(28px,4.5vw,48px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 22, maxWidth: 780 }}>
            Concurso Polícia Rodoviária Federal — tudo o que você precisa entender antes de começar a se preparar
          </h1>
          <p style={{ color: '#A9BCCC', fontSize: 18, lineHeight: 1.75, marginBottom: 38, maxWidth: 660 }}>
            Cargos, requisitos, as 7 etapas eliminatórias, estratégia de estudo e os erros que eliminam candidatos bem preparados. Informação objetiva, sem marketing.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 56 }}>
            <a href="#cargos" className="aw-btn-primary">Ler o guia completo</a>
            <a href="/edital-explicado" className="aw-btn-ghost">Verificar vagas disponíveis</a>
          </div>
          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            {[['1.011','vagas no edital vigente'],['7','etapas todas eliminatórias'],['12–18 meses','do edital à posse']].map(([n,l],i)=>(
              <div key={i}>
                <div style={{ color: C.orange, fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{n}</div>
                <div style={{ color: '#7A99B0', fontSize: 12, marginTop: 5 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sobre o Concurso ───────────────────────────── */}
      <section className="aw-sec" style={{ background: C.white }}>
        <div className="aw">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
            <div>
              <span className="aw-label">Sobre o Concurso</span>
              <h2 className="aw-h2">O que é a Polícia Rodoviária Federal e por que o concurso acontece</h2>
              <p className="aw-body" style={{ marginBottom: 18 }}>
                A Polícia Rodoviária Federal é um órgão permanente organizado e mantido pela União, responsável pelo patrulhamento ostensivo das rodovias federais, fiscalização do trânsito, combate ao crime nas estradas e atendimento a acidentes. Está presente em todos os estados e no Distrito Federal.
              </p>
              <p className="aw-body">
                O ingresso na carreira ocorre exclusivamente por concurso público organizado pela banca <strong style={{ color: C.ink }}>CEBRASPE</strong>, com edital publicado no Diário Oficial da União. O edital vigente oferta 1.011 vagas distribuídas por todo o território nacional.
              </p>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              {[
                ['🏛️','Órgão Federal','Vinculado ao Ministério do Planejamento e Orçamento, com presença em todos os estados.'],
                ['🌎','Presença Nacional','Atuação nos 26 estados, no DF e representações no exterior via Interpol, DEA e Europol.'],
                ['⚖️','Banca CEBRASPE','Seleção com formato específico de questões — certo/errado. Estilo estável entre edições.'],
                ['📋','Inscrição no gov.br','Inscrições exclusivamente pelo portal gov.br. Isenção via CadÚnico para candidatos elegíveis.'],
              ].map(([icon,t,d],i)=>(
                <div key={i} className="aw-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 4 }}>{t}</div>
                    <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.65 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Cargos ─────────────────────────────────────── */}
      <section id="cargos" className="aw-sec" style={{ background: C.bg }}>
        <div className="aw">
          <span className="aw-label">Cargos e Requisitos</span>
          <h2 className="aw-h2">Quais cargos existem e o que cada um exige</h2>
          <p className="aw-body" style={{ marginBottom: 36, maxWidth: 680 }}>
            A seleção abrange dois cargos: Policial Rodoviário Federal (511 vagas) e Agente Administrativo (500 vagas). Ambos exigem ensino médio completo, o que amplia o universo de candidatos elegíveis.
          </p>
          {/* Table header */}
          <div style={{ borderRadius: 8, overflow: 'hidden', border: `1px solid ${C.line}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 2.5fr 1fr 1.2fr', background: C.navy, padding: '13px 20px', gap: 12 }}>
              {['Cargo','Formação Exigida','Vagas','Salário (ref.*)'].map((h,i)=>(
                <div key={i} style={{ color: '#96A8B5', fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {cargos.map((c,i)=>(
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2.5fr 2.5fr 1fr 1.2fr', padding: '15px 20px', gap: 12, borderTop: `1px solid ${C.line}`, background: i%2===0 ? C.white : C.bg, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{c.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>{c.cargo}</span>
                </div>
                <div style={{ fontSize: 13, color: C.mid }}>{c.req}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{c.vol}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.green }}>{c.sal}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: C.muted, marginTop: 10 }}>* Referência baseada em editais anteriores. Confirme a remuneração exata no edital oficial vigente.</p>
        </div>
      </section>

      {/* ── 7 Etapas ───────────────────────────────────── */}
      <section id="etapas" className="aw-sec" style={{ background: C.white }}>
        <div className="aw">
          <span className="aw-label">Processo Seletivo</span>
          <h2 className="aw-h2">As 7 etapas eliminatórias explicadas</h2>
          <p className="aw-body" style={{ marginBottom: 36, maxWidth: 680 }}>
            Todas as etapas são eliminatórias. A reprovação em qualquer uma encerra a participação independentemente do desempenho nas fases anteriores.
          </p>
          <div style={{ display: 'grid', gap: 10 }}>
            {etapas.map((e,i)=>(
              <div key={i} style={{ border: `1px solid ${openEtapa===i ? C.orange : C.line}`, borderRadius: 8, background: openEtapa===i ? '#FFFDF5' : C.white, overflow: 'hidden', transition: 'border-color .2s,background .2s' }}>
                <button onClick={()=>setOpenEtapa(openEtapa===i ? null : i)}
                  style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, fontFamily: 'inherit' }}>
                  <div style={{ width: 38, height: 38, borderRadius: 6, background: openEtapa===i ? C.orange : C.bgAlt, color: openEtapa===i ? C.navyD : C.mid, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0, transition: 'background .2s,color .2s' }}>
                    {e.n}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>{e.nome}</div>
                    <div style={{ fontSize: 11, color: openEtapa===i ? C.orange : C.muted, fontWeight: 600, marginTop: 2, letterSpacing: '0.5px' }}>{e.badge}</div>
                  </div>
                  <span style={{ color: C.muted, fontSize: 20, display: 'inline-block', transition: 'transform .2s', transform: openEtapa===i ? 'rotate(180deg)' : 'none' }}>▾</span>
                </button>
                {openEtapa===i && (
                  <div style={{ padding: '0 20px 18px 74px', fontSize: 14, color: C.mid, lineHeight: 1.8 }}>
                    {e.desc}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Preparação ─────────────────────────────────── */}
      <section id="preparacao" className="aw-sec" style={{ background: C.bg }}>
        <div className="aw">
          <span className="aw-label">Estratégia de Preparação</span>
          <h2 className="aw-h2">Como estruturar a preparação com base nos aprovados</h2>
          <p className="aw-body" style={{ marginBottom: 40, maxWidth: 680 }}>
            O que diferencia quem passa de quem repete não é volume de estudo — é método aplicado ao conteúdo certo.
          </p>
          <div style={{ display: 'grid', gap: 16 }}>
            {passos.map((p,i)=>(
              <div key={i} className="aw-card" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div className="aw-step-num">{p.n}</div>
                <div style={{ paddingTop: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.ink, marginBottom: 6 }}>{p.t}</div>
                  <div style={{ fontSize: 14, color: C.mid, lineHeight: 1.75 }}>{p.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Erros comuns ───────────────────────────────── */}
      <section className="aw-sec" style={{ background: C.white }}>
        <div className="aw">
          <span className="aw-label" style={{ color: C.red }}>Atenção</span>
          <h2 className="aw-h2">Erros que eliminam candidatos qualificados</h2>
          <p className="aw-body" style={{ marginBottom: 36, maxWidth: 680 }}>
            Estes não são cometidos por despreparados — são cometidos por candidatos que estudaram muito, mas na direção errada ou subestimaram uma etapa específica.
          </p>
          <div className="aw-grid2">
            {erros.map((e,i)=>(
              <div key={i} style={{ background: C.white, border: `1px solid ${C.line}`, borderLeft: `4px solid ${C.red}`, borderRadius: 8, padding: '18px 20px', transition: 'box-shadow .2s' }}
                onMouseEnter={el=>((el.currentTarget as HTMLElement).style.boxShadow='0 4px 16px rgba(0,0,0,0.08)')}
                onMouseLeave={el=>((el.currentTarget as HTMLElement).style.boxShadow='none')}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 6 }}>✕ {e.t}</div>
                <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.65 }}>{e.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefícios ─────────────────────────────────── */}
      <section className="aw-sec-sm" style={{ background: C.bg }}>
        <div className="aw">
          <span className="aw-label">Benefícios da Carreira</span>
          <h2 className="aw-h2">O que vem com o cargo além do salário</h2>
          <p className="aw-body" style={{ marginBottom: 36, maxWidth: 680 }}>Com base em editais e legislação anteriores. Confirme detalhes no edital oficial da edição vigente.</p>
          <div className="aw-grid3">
            {[
              ['🏥','Saúde familiar','Cobertura médica, odontológica e psicológica para o servidor e dependentes.'],
              ['🏠','Auxílio-moradia','Benefício mensal em municípios sem moradia funcional disponível.'],
              ['✈️','Viagens cobertas','Passagem, hospedagem e diárias custeadas em deslocamentos a serviço.'],
              ['📈','Progressão em lei','Evolução salarial por mérito e antiguidade definida em lei, sem favoritismo.'],
              ['🔒','Estabilidade','Após o estágio probatório de 3 anos, cargo só perdido por via judicial ou PAD.'],
              ['🌎','Missões internacionais','Cooperação real com Interpol, DEA e Europol — não apenas teoria.'],
            ].map(([icon,t,d],i)=>(
              <div key={i} className="aw-card">
                <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 6 }}>{t}</div>
                <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.65 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      <section id="faq" className="aw-sec" style={{ background: C.white }}>
        <div className="aw" style={{ maxWidth: 780 }}>
          <span className="aw-label">Perguntas Frequentes</span>
          <h2 className="aw-h2">Dúvidas mais comuns sobre o concurso</h2>
          <p className="aw-body" style={{ marginBottom: 36 }}>
            Respostas baseadas em editais anteriores. Sempre confirme os critérios exatos no edital oficial publicado no Diário Oficial da União.
          </p>
          <div>
            {faqs.map((f,i)=>(
              <div key={i} className="aw-faq-row">
                <button className="aw-faq-btn" onClick={()=>setOpenFaq(openFaq===i ? null : i)}>
                  <span>{f.q}</span>
                  <span style={{ color: openFaq===i ? C.orange : C.muted, flexShrink: 0, fontSize: 22, display: 'inline-block', transition: 'transform .2s,color .2s', transform: openFaq===i ? 'rotate(45deg)' : 'none', fontWeight: 300 }}>+</span>
                </button>
                {openFaq===i && (
                  <div style={{ padding: '4px 0 18px', fontSize: 14, color: C.mid, lineHeight: 1.8 }}>
                    {f.r}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────── */}
      <section style={{ background: C.orange, padding: '56px 24px' }}>
        <div className="aw" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ color: C.navyD, fontSize: 'clamp(20px,3vw,28px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 10 }}>
              Pronto para dar o primeiro passo?
            </h2>
            <p style={{ color: '#3D2B00', fontSize: 15, lineHeight: 1.65, maxWidth: 540 }}>
              Quem começa antes do edital chega com meses de vantagem. Verifique disponibilidade de vagas e informações do próximo concurso.
            </p>
          </div>
          <a href="/edital-explicado" style={{ display: 'inline-block', background: C.navyD, color: C.white, fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 4, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background .2s' }}
            onMouseEnter={e=>(e.currentTarget.style.background=C.navy)}
            onMouseLeave={e=>(e.currentTarget.style.background=C.navyD)}>
            Verificar disponibilidade →
          </a>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer style={{ background: C.navyD }}>
        {/* Main footer grid */}
        <div className="aw" style={{ padding: '52px 24px 36px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40 }}>
            {/* Brand column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ background: C.orange, borderRadius: 5, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 17 }}>🛡️</span>
                </div>
                <div>
                  <div style={{ color: C.white, fontWeight: 800, fontSize: 14 }}>{cfg?.siteName ?? 'Portal PRF'}</div>
                  <div style={{ color: '#5D7D8E', fontSize: 10, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Portal Educacional</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#5D7D8E', lineHeight: 1.7, marginBottom: 18, maxWidth: 280 }}>
                {cfg?.disclaimer ?? 'Portal de informação educacional independente sobre concursos públicos federais. Não representa órgão oficial.'}
              </p>
              <div style={{ fontSize: 12, color: '#4A6475', lineHeight: 1.9 }}>
                {cfg?.razaoSocial && <div>{cfg.razaoSocial}</div>}
                {cfg?.cnpjFormatted && <div>CNPJ {cfg.cnpjFormatted}</div>}
                {cfg?.enderecoCompleto && <div>{cfg.enderecoCompleto}</div>}
              </div>
            </div>

            {/* Concurso */}
            <div>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 13, marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid rgba(255,255,255,0.08)` }}>Concurso PRF</div>
              {[
                ['#cargos','Cargos e Requisitos'],
                ['#etapas','As 7 Etapas'],
                ['#preparacao','Como se Preparar'],
                ['#erros','Erros Comuns'],
                ['#faq','Perguntas Frequentes'],
                ['/edital-explicado','Ver Vagas Disponíveis'],
              ].map(([h,l])=>(
                <a key={h} href={h} className="aw-footer-link">{l}</a>
              ))}
            </div>

            {/* Preparação */}
            <div>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 13, marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid rgba(255,255,255,0.08)` }}>Preparação</div>
              {[
                ['#preparacao','Estratégia de Estudo'],
                ['#cargos','Tabela de Salários'],
                ['#etapas','Etapa Física (TAF)'],
                ['#etapas','Investigação Social'],
                ['#etapas','Curso de Formação'],
              ].map(([h,l],i)=>(
                <a key={i} href={h} className="aw-footer-link">{l}</a>
              ))}
            </div>

            {/* Legal */}
            <div>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 13, marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid rgba(255,255,255,0.08)` }}>Legal</div>
              {[
                ['/politica-privacidade','Política de Privacidade'],
                ['/termos-de-uso','Termos de Uso'],
                ['/cookies','Política de Cookies'],
                ['/aviso-isencao','Aviso de Isenção'],
              ].map(([h,l])=>(
                <a key={h} href={h} className="aw-footer-link">{l}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px' }}>
          <div className="aw" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: '#4A6475' }}>
              © {new Date().getFullYear()} {cfg?.siteName ?? 'Portal PRF'}. Todos os direitos reservados. Conteúdo educacional e informativo.
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              {[
                ['/politica-privacidade','Privacidade'],
                ['/termos-de-uso','Termos'],
                ['/cookies','Cookies'],
                ['/aviso-isencao','Isenção'],
              ].map(([h,l])=>(
                <a key={h} href={h} style={{ fontSize: 12, color: '#4A6475', textDecoration: 'none' }}
                  onMouseEnter={e=>(e.currentTarget.style.color=C.white)}
                  onMouseLeave={e=>(e.currentTarget.style.color='#4A6475')}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
