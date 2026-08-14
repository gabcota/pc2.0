import { useState, useEffect, useRef } from 'react';
import { getSiteConfig } from '@/lib/siteConfig';
import { SecurityLoader } from '@/components/SecurityLoader';
import { markFunnelValidated } from '@/lib/funnelGate';

/* ─── Palette (editorial light) ─────────────────── */
const C = {
  red:      '#B00000',
  redD:     '#8a0000',
  redL:     '#FFF5F5',
  ink:      '#111111',
  ink2:     '#222222',
  mid:      '#444444',
  muted:    '#6b6b6b',
  dim:      '#999999',
  line:     '#E0E0E0',
  lineL:    '#F0F0F0',
  bg:       '#FAFAFA',
  white:    '#FFFFFF',
  blue:     '#0033A0',
  blueL:    '#EEF2FF',
  green:    '#1B5E20',
  greenL:   '#F0F7F0',
  amber:    '#92400E',
  amberL:   '#FFFBEB',
  amberB:   '#F59E0B',
};

/* ─── Utility: scroll to content (no direct navigation) ──── */
function goCTA() {
  const el = document.getElementById('conteudo');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ─── Scroll reveal hook ─────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(22px)',
      transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

/* ─── Reading progress bar ───────────────────────── */
function Progress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const d = document.documentElement;
      setPct(Math.min(100, (d.scrollTop / (d.scrollHeight - d.clientHeight)) * 100));
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: C.lineL, zIndex: 2000 }}>
      <div style={{ height: '100%', width: `${pct}%`, background: C.red, transition: 'width .1s linear' }} />
    </div>
  );
}

/* ─── News ticker ────────────────────────────────── */
const TICK = [
  'CARGOS: Policial Rodoviário Federal e Agente Administrativo — 1.011 vagas no edital vigente',
  'TAF: Condicionamento físico é eliminatório — prepare-se desde o início',
  'BANCA: CEBRASPE mantém estilo previsível entre concursos — use isso a seu favor',
  'CARREIRA: Aprovados frequentam ANPRF em Anápolis/GO com remuneração integral',
  'SALÁRIOS: Policial Rodoviário Federal R$ 17.484,45 · Agente Administrativo R$ 5.173,28',
  'GOV.BR: Inscrições exclusivamente online — crie conta com nível mínimo prata',
];

function Ticker() {
  return (
    <div style={{ background: C.ink, overflow: 'hidden' }}>
      <style>{`@keyframes rv3tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}.rv3tick{display:flex;width:max-content;animation:rv3tick 44s linear infinite}.rv3tick:hover{animation-play-state:paused}`}</style>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ flexShrink: 0, background: C.red, padding: '0 18px', display: 'flex', alignItems: 'center', fontSize: 10, fontWeight: 900, color: C.white, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap' }}>
          AO VIVO
        </div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div className="rv3tick">
            {[...TICK, ...TICK].map((t, i) => (
              <span key={i} style={{ padding: '9px 36px', fontSize: 12, color: 'rgba(255,255,255,.65)', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,.08)' }}>
                <span style={{ color: C.red, fontWeight: 700, marginRight: 8 }}>◆</span>{t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero editorial image ───────────────────────── */
function HeroEditorialImage() {
  return (
    <figure style={{ margin: 0, position: 'relative' }}>
      {/* Main image container */}
      <div style={{
        width: '100%',
        aspectRatio: '4/3',
        background: `linear-gradient(145deg, #1a2a4a 0%, #0d1e38 50%, #1e1a38 100%)`,
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${C.line}`,
      }}>
        {/* Subtle grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)`, backgroundSize: '32px 32px' }} />
        {/* Glow */}
        <div style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%,-50%)', width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,184,0,.14) 0%, transparent 70%)' }} />
        {/* Badge visual */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <svg width="96" height="108" viewBox="0 0 96 108" fill="none">
            <path d="M48 3L91 22v29c0 27-19.5 46.5-43 53.5C25.5 97.5 5 78 5 51V22L48 3z" stroke="rgba(255,184,0,.8)" strokeWidth="1.5" fill="rgba(255,184,0,.06)" />
            <path d="M48 18L78 31v22c0 20-13.5 33-30 38.5C31.5 86 18 73 18 53V31L48 18z" stroke="rgba(255,184,0,.5)" strokeWidth="1" fill="rgba(255,184,0,.04)" strokeDasharray="4 3" />
            <circle cx="48" cy="53" r="15" stroke="rgba(255,184,0,.7)" strokeWidth="1" fill="none" />
            <text x="48" y="59" textAnchor="middle" fill="rgba(255,184,0,.9)" fontSize="11" fontFamily="Georgia, serif" fontWeight="bold">PRF</text>
          </svg>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,184,0,.85)', letterSpacing: 3, fontFamily: 'Arial, sans-serif', textTransform: 'uppercase', marginBottom: 3 }}>Polícia Rodoviária Federal</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.35)', letterSpacing: 2, fontFamily: 'Arial, sans-serif', textTransform: 'uppercase' }}>República Federativa do Brasil</div>
          </div>
        </div>
        {/* Corner marks */}
        {[
          { top: 12, left: 12, borderTop: `2px solid rgba(255,184,0,.5)`, borderLeft: `2px solid rgba(255,184,0,.5)` },
          { top: 12, right: 12, borderTop: `2px solid rgba(255,184,0,.5)`, borderRight: `2px solid rgba(255,184,0,.5)` },
          { bottom: 12, left: 12, borderBottom: `2px solid rgba(255,184,0,.5)`, borderLeft: `2px solid rgba(255,184,0,.5)` },
          { bottom: 12, right: 12, borderBottom: `2px solid rgba(255,184,0,.5)`, borderRight: `2px solid rgba(255,184,0,.5)` },
        ].map((s, i) => <div key={i} style={{ position: 'absolute', width: 16, height: 16, ...s }} />)}
        {/* Scan line animation */}
        <style>{`@keyframes rv3scan{from{top:-2px}to{top:101%}}`}</style>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,184,0,.4), transparent)', animation: 'rv3scan 5s linear infinite' }} />
        {/* Tag overlay bottom-left */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 16px 12px', background: 'linear-gradient(0deg, rgba(13,30,56,.96), transparent)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', fontFamily: 'Arial, sans-serif' }}>Academia Nacional da PRF · Anápolis/GO</span>
            <span style={{ fontSize: 9, color: 'rgba(255,184,0,.55)', fontFamily: 'Arial, sans-serif', letterSpacing: 1 }}>DPRF/ANPRF</span>
          </div>
        </div>
      </div>
      <figcaption style={{ marginTop: 8, fontSize: 11, color: C.dim, fontFamily: 'Arial, sans-serif', lineHeight: 1.5, borderBottom: `1px solid ${C.lineL}`, paddingBottom: 8 }}>
        Academia Nacional da PRF (ANPRF), em Anápolis/GO — sede do curso de formação de todos os aprovados no concurso, remunerado desde o primeiro dia.
      </figcaption>
    </figure>
  );
}

/* ─── Section label ──────────────────────────────── */
function SectionLabel({ label, color = C.red }: { label: string; color?: string }) {
  return (
    <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 900, color, letterSpacing: 1.6, textTransform: 'uppercase', fontFamily: 'Arial, sans-serif', borderBottom: `2px solid ${color}`, paddingBottom: 1, marginBottom: 8 }}>
      {label}
    </span>
  );
}

/* ─── Stats strip ────────────────────────────────── */
const STATS = [
  { v: '1.011', l: 'vagas (edital vigente)' },
  { v: '7', l: 'etapas eliminatórias' },
  { v: 'R$ 17k', l: 'rem. Policial PRF' },
  { v: '12–18m', l: 'preparação ideal' },
];

/* ─── Bento secondary tiles ──────────────────────── */
const BENTO = [
  { tag: 'CARGOS', tagColor: C.blue, title: 'Policial Rodoviário Federal e Agente Administrativo: dois cargos, 1.011 vagas', body: 'Policial: R$ 17.484,45 · Agente Administrativo: R$ 5.173,28. Ambos acessíveis com ensino médio.' },
  { tag: 'FÍSICO', tagColor: C.red, title: 'O TAF elimina mais candidatos do que a prova objetiva', body: 'Cooper, barra fixa, abdominal — parâmetros por sexo e idade, todos eliminatórios sem segunda chance.' },
  { tag: 'BANCA', tagColor: C.green, title: 'CEBRASPE: o estilo que define quem passa', body: 'Afirmações certo/errado com erros em uma única palavra. Treine com provas reais — teoria pura não basta.' },
  { tag: 'SELEÇÃO', tagColor: C.amber, title: 'Investigação social: declare tudo, sem exceção', body: 'Histórico judicial, financeiro e redes sociais são cruzados com bases de dados. Omissão = desclassificação.' },
  { tag: 'CARREIRA', tagColor: C.blue, title: 'Curso remunerado na ANPRF em Anápolis/GO desde o primeiro dia', body: 'Aprovados frequentam a Academia Nacional da PRF com remuneração integral durante toda a formação.' },
  { tag: 'EDITAL', tagColor: C.red, title: 'Comece antes do edital — o conteúdo-base é estável entre edições', body: 'Português, Direito Constitucional, Penal e Administrativo aparecem em todos os concursos com peso similar.' },
];

/* ─── BentoCard ──────────────────────────────────── */
function BentoCard({ item }: { item: typeof BENTO[0] }) {
  const [hov, setHov] = useState(false);
  const bg = item.tagColor === C.blue ? C.blueL : item.tagColor === C.green ? C.greenL : item.tagColor === C.amber ? C.amberL : C.redL;
  return (
    <div
      onClick={goCTA}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? bg : C.white,
        border: `1px solid ${hov ? item.tagColor + '44' : C.line}`,
        borderRadius: 3,
        padding: '20px 18px',
        cursor: 'pointer',
        transition: 'all .22s',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: item.tagColor, opacity: hov ? 1 : 0, transition: 'opacity .22s' }} />
      <SectionLabel label={item.tag} color={item.tagColor} />
      <h3 style={{ fontSize: 13, fontWeight: 800, color: C.ink, lineHeight: 1.35, marginBottom: 6, fontFamily: "'Georgia', serif" }}>{item.title}</h3>
      <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.7, fontFamily: 'Arial, sans-serif' }}>{item.body}</p>
    </div>
  );
}

/* ─── Timeline ───────────────────────────────────── */
const TIMELINE = [
  { n: '01', t: 'Prova Objetiva', d: 'Certo/errado estilo CEBRASPE. Nota de corte por disciplina e nota global — zerar qualquer matéria com corte elimina independente da nota total.' },
  { n: '02', t: 'Prova Discursiva', d: 'Dissertação argumentativa. Peso classificatório real. Exige prática regular de escrita — não é resolvido em última hora.' },
  { n: '03', t: 'Teste de Aptidão Física', d: 'Cooper, barra fixa ou flexão, abdominal. Eliminatório sem margem. Condicionamento leva meses — comece no dia 1 da preparação.' },
  { n: '04', t: 'Exame Médico', d: 'Avaliação clínica e laboratorial com parâmetros definidos em edital. Condições preexistentes devem ser verificadas antes da inscrição.' },
  { n: '05', t: 'Avaliação Psicológica', d: 'Testes psicométricos e entrevista clínica. Perfil comportamental compatível com atividade policial. Critérios objetivos definidos em edital.' },
  { n: '06', t: 'Investigação Social', d: 'Cruzamento de dados pessoais, judiciais e financeiros. Transparência total é a única estratégia — qualquer omissão pode desclassificar após mais de um ano de processo.' },
  { n: '07', t: 'Curso de Formação (ANPRF)', d: 'Realizado na Academia Nacional da PRF em Anápolis/GO. Remunerado desde o primeiro dia. Conclusão resulta em nomeação e posse no cargo.' },
];

/* ─── TimelineStep ───────────────────────────────── */
function TimelineStep({ step, isLast, delay = 0 }: { step: typeof TIMELINE[0]; isLast: boolean; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ display: 'flex', gap: 18, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(-16px)', transition: `all .5s ease ${delay}ms` }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.red, color: C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, fontFamily: 'Arial, sans-serif', flexShrink: 0 }}>{step.n}</div>
        {!isLast && <div style={{ width: 1, flex: 1, minHeight: 24, background: C.line, margin: '4px 0' }} />}
      </div>
      <div style={{ paddingBottom: isLast ? 0 : 28 }}>
        <h4 style={{ fontSize: 14, fontWeight: 800, color: C.ink, marginBottom: 5, fontFamily: "'Georgia', serif" }}>{step.t}</h4>
        <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.8, fontFamily: 'Arial, sans-serif' }}>{step.d}</p>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────── */
export default function RevistaPage() {
  const cfg = getSiteConfig();
  const siteName = cfg?.siteName ?? 'Portal PRF';
  const razaoSocial = cfg?.razaoSocial ?? '';
  const cnpjFormatted = cfg?.cnpjFormatted ?? '';
  const enderecoCompleto = cfg?.enderecoCompleto ?? '';
  const disclaimer = cfg?.disclaimer ?? 'Portal informativo privado e independente.';

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const edition = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

  const [redirecting] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.has('gclid') || p.has('gbraid');
  });

  const hasAdParam = (() => {
    const p = new URLSearchParams(window.location.search);
    return p.has("gclid") || p.has("gbraid");
  })();
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

  if (redirecting) {
    return <SecurityLoader />;
  }

  const W = { maxWidth: 1140, margin: '0 auto', padding: '0 20px' };

  return (
    <div style={{ background: C.bg, color: C.ink, minHeight: '100vh', fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <Progress />

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        a{color:inherit;text-decoration:none}
        .rv3-cta{display:inline-flex;align-items:center;gap:8px;background:${C.red};color:#fff;font-family:Arial,sans-serif;font-size:13px;font-weight:800;letter-spacing:.5px;padding:13px 28px;border:none;cursor:pointer;border-radius:2px;transition:all .2s;white-space:nowrap}
        .rv3-cta:hover{background:${C.redD};box-shadow:0 4px 24px rgba(176,0,0,.35);transform:translateY(-1px)}
        .rv3-cta-ghost{display:inline-flex;align-items:center;gap:8px;background:transparent;color:${C.red};font-family:Arial,sans-serif;font-size:13px;font-weight:800;letter-spacing:.5px;padding:12px 24px;border:2px solid ${C.red};cursor:pointer;border-radius:2px;transition:all .2s;white-space:nowrap}
        .rv3-cta-ghost:hover{background:${C.red};color:#fff}
        .rv3-nav-a{font-size:12px;font-weight:700;color:rgba(255,255,255,.75);letter-spacing:.8px;text-transform:uppercase;font-family:Arial,sans-serif;padding:4px 0;transition:color .15s;cursor:pointer;border-bottom:2px solid transparent}
        .rv3-nav-a:hover{color:#fff;border-bottom-color:${C.red}}
        .rv3-body{font-size:15px;line-height:1.9;color:${C.mid};font-family:Arial,sans-serif}
        .rv3-hero-outer{display:grid;grid-template-columns:2fr 1px 1fr;gap:0 28px;align-items:start}
        .rv3-main-grid{display:grid;grid-template-columns:1fr 340px;gap:44px;align-items:start}
        .rv3-bento{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .rv3-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
        @media(max-width:940px){
          .rv3-hero-outer{grid-template-columns:1fr !important}
          .rv3-hero-outer > div:nth-child(2){display:none}
          .rv3-main-grid{grid-template-columns:1fr !important}
          .rv3-bento{grid-template-columns:1fr 1fr !important}
        }
        @media(max-width:560px){
          .rv3-bento{grid-template-columns:1fr !important}
          .rv3-stats{grid-template-columns:1fr 1fr !important}
          .rv3-nav-a{display:none}
        }
      `}</style>

      {/* ── AVISO TOPO ── */}
      <div style={{ background: 'linear-gradient(90deg,#ff6b00 0%,#f7c500 50%,#ff6b00 100%)', padding: '9px 24px', textAlign: 'center', backgroundSize: '200% auto', animation: 'rv3-banner-shift 4s linear infinite' }}>
        <style>{`@keyframes rv3-banner-shift{0%{background-position:0% center}100%{background-position:200% center}}`}</style>
        <p style={{ fontSize: 12, color: '#1a1a1a', margin: 0, lineHeight: 1.5, fontWeight: 700, letterSpacing: 0.2, textShadow: '0 1px 2px rgba(255,255,255,.3)', fontFamily: 'Arial, sans-serif' }}>
          📰 <strong>Veículo independente:</strong> Este é um portal de jornalismo especializado em concursos públicos{razaoSocial ? `, mantido por ${razaoSocial}` : ''}{cnpjFormatted ? ` · CNPJ ${cnpjFormatted}` : ''}. Não somos o governo, não somos a Polícia Rodoviária Federal. <strong>Inscrições oficiais só pelo gov.br.</strong>
        </p>
      </div>

      {/* ── MASTHEAD ── */}
      <header style={{ background: C.red, padding: '0' }}>
        <div style={{ ...W, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <span style={{ fontSize: 34, fontWeight: 900, color: C.white, letterSpacing: '-0.5px', lineHeight: 1, fontFamily: "'Georgia', serif" }}>{siteName}</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase', letterSpacing: 1.2 }}>Portal Informativo</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.5)', fontFamily: 'Arial, sans-serif', textTransform: 'uppercase', letterSpacing: 1 }}>Independente · Educacional</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', fontFamily: 'Arial, sans-serif', marginTop: 2 }}>{edition}</div>
          </div>
        </div>
      </header>

      {/* ── NAV ── */}
      <nav style={{ background: C.ink, borderBottom: `3px solid ${C.red}` }}>
        <div style={{ ...W, display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
          {['Concursos', 'Cargos', 'Etapas', 'Preparação', 'Carreira', 'Remuneração'].map((l, i) => (
            <a key={i} href="#conteudo" className="rv3-nav-a" style={{ padding: '11px 18px', borderRight: '1px solid rgba(255,255,255,.08)', display: 'block' }}>{l}</a>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ padding: '11px 18px', fontSize: 11, color: 'rgba(255,255,255,.3)', fontFamily: 'Arial, sans-serif', letterSpacing: 1, textTransform: 'uppercase', flexShrink: 0 }}>{today.split(',')[0]}</div>
        </div>
      </nav>

      {/* ── TICKER ── */}
      <Ticker />

      {/* ── DATELINE + SECTION TAG ── */}
      <div style={{ ...W, padding: '20px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 14 }}>
          <div style={{ height: 4, width: 32, background: C.red, borderRadius: 1 }} />
          <span style={{ fontSize: 11, fontWeight: 900, color: C.red, letterSpacing: 1.4, textTransform: 'uppercase', fontFamily: 'Arial, sans-serif' }}>Concursos Públicos · Polícia Rodoviária Federal 2026</span>
          <div style={{ flex: 1, height: 1, background: C.line }} />
        </div>
      </div>

      {/* ── HERO GRID ── */}
      <section id="conteudo" style={{ ...W, paddingBottom: 32 }}>
        {/* 3-col VEJA layout: main article (2fr) | divider | secondary headlines (1fr) */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1px 1fr', gap: '0 28px', alignItems: 'start' }} className="rv3-hero-outer">
          {/* LEFT: image + main headline */}
          <Reveal>
            <HeroEditorialImage />
            <div style={{ marginTop: 18 }}>
              <SectionLabel label="Concursos Públicos" />
              <h1 style={{ fontSize: 'clamp(20px, 2.6vw, 32px)', fontWeight: 900, lineHeight: 1.15, color: C.ink, marginBottom: 10, letterSpacing: '-0.3px' }}>
                Polícia Rodoviária Federal inicia novo ciclo de seleção: o que todo candidato precisa saber antes de começar a estudar
              </h1>
              <p style={{ fontSize: 14, fontStyle: 'italic', color: C.muted, lineHeight: 1.7, fontFamily: 'Arial, sans-serif', marginBottom: 12 }}>
                Com base no histórico de editais anteriores da CEBRASPE, entenda cargos, etapas eliminatórias e o que os candidatos aprovados fizeram de diferente.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 14, marginBottom: 16, borderBottom: `1px solid ${C.line}` }}>
                <span style={{ fontSize: 11, color: C.dim, fontFamily: 'Arial, sans-serif' }}>Por <strong style={{ color: C.mid }}>Redação Portal</strong></span>
                <span style={{ color: C.line }}>·</span>
                <span style={{ fontSize: 11, color: C.dim, fontFamily: 'Arial, sans-serif' }}>{today}</span>
              </div>
              {/* Stats strip */}
              <div className="rv3-stats" style={{ marginBottom: 16 }}>
                {STATS.map(s => (
                  <div key={s.v} style={{ textAlign: 'center', padding: '10px 6px', background: C.white, border: `1px solid ${C.line}`, borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: C.red }} />
                    <div style={{ fontSize: 20, fontWeight: 900, color: C.red, fontFamily: "'Georgia', serif", lineHeight: 1 }}>{s.v}</div>
                    <div style={{ fontSize: 9, color: C.dim, fontFamily: 'Arial, sans-serif', marginTop: 4, textTransform: 'uppercase', letterSpacing: .8 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="rv3-cta" onClick={goCTA}>Acessar guia completo →</button>
                <button className="rv3-cta-ghost" onClick={goCTA}>Ver as 7 etapas</button>
              </div>
              <p style={{ fontSize: 9, color: C.dim, fontFamily: 'Arial, sans-serif', marginTop: 10 }}>¹ Com base em editais anteriores. Confirme no edital vigente.</p>
            </div>
          </Reveal>

          {/* VERTICAL DIVIDER */}
          <div style={{ background: C.line, alignSelf: 'stretch', minHeight: 400 }} />

          {/* RIGHT: secondary headlines */}
          <Reveal delay={120}>
            <p style={{ fontSize: 10, fontWeight: 900, color: C.dim, letterSpacing: 1.4, textTransform: 'uppercase', fontFamily: 'Arial, sans-serif', marginBottom: 14, paddingBottom: 10, borderBottom: `2px solid ${C.ink}` }}>
              Mais do concurso
            </p>
            {[
              { tag: 'CARGOS', c: C.blue, t: 'Policial Rodoviário Federal e Agente Administrativo: dois cargos com 1.011 vagas no edital vigente', r: 'Policial: R$ 17.484,45 · Agente Administrativo: R$ 5.173,28. Inscrições pelo gov.br.' },
              { tag: 'FÍSICO', c: C.red, t: 'TAF elimina candidatos com ótima nota na escrita — todo ano, sem exceção', r: 'Condicionamento aeróbico leva 4–8 meses. Comece o treinamento físico no primeiro dia da preparação.' },
              { tag: 'BANCA', c: C.green, t: 'CEBRASPE mantém estilo estável entre concursos — e candidatos que sabem disso usam essa vantagem', r: 'Afirmações certo/errado com erros em uma única palavra. Treine com provas reais, não apenas teoria.' },
              { tag: 'CARREIRA', c: C.amber, t: 'Aprovados têm remuneração garantida desde o 1º dia do curso de formação em Anápolis/GO', r: 'Curso realizado na Academia Nacional da PRF (ANPRF). Todos os aprovados passam pela ANPRF antes da posse.' },
            ].map((s, i) => (
              <div key={i} onClick={goCTA} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: i < 3 ? `1px solid ${C.lineL}` : 'none', cursor: 'pointer' }}>
                <SectionLabel label={s.tag} color={s.c} />
                <h3 style={{ fontSize: 14, fontWeight: 800, color: C.ink, lineHeight: 1.3, marginBottom: 5, fontFamily: "'Georgia', serif" }}>{s.t}</h3>
                <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.7, fontFamily: 'Arial, sans-serif' }}>{s.r}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <div style={{ ...W }}>
        <div style={{ height: 1, background: C.line }} />
      </div>

      {/* ── MAIN: ARTICLE + SIDEBAR ── */}
      <section style={{ ...W, paddingTop: 40, paddingBottom: 60 }}>
        <div className="rv3-main-grid">

          {/* ARTICLE */}
          <article>
            {[
              'O concurso da Polícia Rodoviária Federal prevê seleção para os cargos de Policial Rodoviário Federal e Agente Administrativo. Com base no edital vigente, são ofertadas 1.011 vagas distribuídas por todos os estados da federação e pelo Distrito Federal.',
              'A seleção é composta por etapas eliminatórias: prova objetiva, prova discursiva, teste de aptidão física, exame médico, avaliação psicológica, investigação social e curso de formação na Academia Nacional da PRF (ANPRF), em Anápolis/GO. Inscrições são realizadas exclusivamente pelo portal gov.br, conforme edital publicado no Diário Oficial da União.',
              'O estilo da CEBRASPE é muito específico: afirmações para julgamento certo ou errado, com erros construídos a partir de negações sutis, inversões de conceito ou erro em apenas uma palavra-chave. Candidatos que estudam apenas teoria e chegam à prova sem treinar esse estilo específico cometem erros que não refletem falta de conhecimento — refletem falta de familiaridade com o formato.',
            ].map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <p className="rv3-body" style={{ marginBottom: 18 }}>{p}</p>
              </Reveal>
            ))}

            {/* Pull quote */}
            <Reveal delay={80}>
              <blockquote style={{ margin: '28px 0', padding: '20px 24px', borderLeft: `4px solid ${C.red}`, background: C.white, borderRadius: '0 3px 3px 0', position: 'relative' }}>
                <div style={{ fontSize: 42, color: C.red, lineHeight: 1, fontFamily: "'Georgia', serif", position: 'absolute', top: 8, left: 20, opacity: .2 }}>"</div>
                <p style={{ fontSize: 16, fontStyle: 'italic', color: C.ink2, lineHeight: 1.75, fontFamily: "'Georgia', serif", position: 'relative', paddingLeft: 20 }}>
                  Candidatos que iniciam antes do edital chegam com o conteúdo-base consolidado — e usam o período pós-edital apenas para ajuste fino.
                </p>
              </blockquote>
            </Reveal>

            {/* Inline CTA */}
            <Reveal delay={100}>
              <div style={{ margin: '28px 0', padding: '24px', background: C.white, border: `1px solid ${C.line}`, borderTop: `3px solid ${C.red}`, borderRadius: '0 0 3px 3px' }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: C.ink, fontFamily: 'Arial, sans-serif', marginBottom: 6 }}>Prepare-se com antecedência — antes do edital ser publicado</p>
                <p className="rv3-body" style={{ fontSize: 13, marginBottom: 16 }}>O conteúdo-base é estável entre edições. Candidatos que começam agora chegam ao edital com meses de vantagem real.</p>
                <button className="rv3-cta" onClick={goCTA}>Acessar guia de preparação →</button>
              </div>
            </Reveal>

            {[
              'O Teste de Aptidão Física (TAF) é uma das etapas mais subestimadas. Envolve Cooper (corrida de 12 minutos), barra fixa ou flexão de braço e abdominal — com parâmetros por sexo e faixa etária, todos eliminatórios sem margem para aprovação parcial. Candidatos com excelentes notas na escrita são eliminados no TAF todo ano por terem tratado o condicionamento físico como detalhe secundário.',
              'A investigação social é a etapa que mais surpreende candidatos experientes. Todo o histórico declarado — e o que não for declarado — será cruzado com bases de dados públicos e privados. A desclassificação por omissão pode ocorrer após aprovação em todas as outras etapas, quando o candidato já investiu mais de um ano no processo.',
            ].map((p, i) => (
              <Reveal key={i} delay={i * 60}>
                <p className="rv3-body" style={{ marginBottom: 18 }}>{p}</p>
              </Reveal>
            ))}

            {/* Timeline */}
            <Reveal>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '40px 0 28px' }}>
                <div style={{ height: 3, width: 24, background: C.red }} />
                <span style={{ fontSize: 11, fontWeight: 900, color: C.ink, letterSpacing: 1.4, textTransform: 'uppercase', fontFamily: 'Arial, sans-serif' }}>As 7 Etapas do Processo Seletivo</span>
                <div style={{ flex: 1, height: 1, background: C.line }} />
              </div>
            </Reveal>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {TIMELINE.map((step, i) => (
                <TimelineStep key={step.n} step={step} isLast={i === TIMELINE.length - 1} delay={i * 60} />
              ))}
            </div>

            <p style={{ fontSize: 11, color: C.dim, fontFamily: 'Arial, sans-serif', marginTop: 24 }}>¹ Dados com base em editais anteriores. A única fonte com validade legal é o edital publicado no Diário Oficial da União.</p>
          </article>

          {/* SIDEBAR */}
          <aside style={{ position: 'sticky', top: 8, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* CTA box */}
            <Reveal>
              <div style={{ background: C.white, border: `1px solid ${C.line}`, borderTop: `3px solid ${C.red}`, borderRadius: '0 0 4px 4px', padding: '22px' }}>
                <p style={{ fontSize: 10, fontWeight: 900, color: C.red, fontFamily: 'Arial, sans-serif', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 10 }}>Guia completo</p>
                <h3 style={{ fontSize: 17, fontWeight: 900, color: C.ink, lineHeight: 1.3, marginBottom: 10 }}>Cargos, etapas, cronograma e disciplinas por cargo</h3>
                <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.7, fontFamily: 'Arial, sans-serif', marginBottom: 18 }}>Tudo que você precisa saber sobre o concurso PRF num guia completo, com base em editais anteriores da CEBRASPE.</p>
                <button className="rv3-cta" onClick={goCTA} style={{ width: '100%', justifyContent: 'center' }}>Acessar agora →</button>
              </div>
            </Reveal>

            {/* Manchetes curtas */}
            <Reveal delay={80}>
              <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 4, padding: '18px' }}>
                <p style={{ fontSize: 10, fontWeight: 900, color: C.dim, fontFamily: 'Arial, sans-serif', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${C.line}` }}>Mais do concurso</p>
                {[
                  { tag: 'CARGOS', c: C.blue, t: 'Policial Rodoviário Federal e Agente Administrativo — 1.011 vagas no edital vigente' },
                  { tag: 'FÍSICO', c: C.red, t: 'Candidatos com nota excelente são eliminados no TAF — treino físico começa no dia 1' },
                  { tag: 'CARREIRA', c: C.green, t: 'Aprovados têm remuneração garantida desde o primeiro dia do curso de formação em Brasília' },
                ].map((s, i) => (
                  <div key={i} style={{ paddingBottom: 14, marginBottom: 14, borderBottom: i < 2 ? `1px solid ${C.lineL}` : 'none' }}>
                    <SectionLabel label={s.tag} color={s.c} />
                    <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, lineHeight: 1.35, fontFamily: "'Georgia', serif" }}>{s.t}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Aviso */}
            <Reveal delay={120}>
              <div style={{ padding: '14px 16px', border: `1px solid ${C.amberB}44`, borderRadius: 4, background: C.amberL }}>
                <p style={{ fontSize: 11, color: C.amber, lineHeight: 1.7, fontFamily: 'Arial, sans-serif' }}>
                  <strong>Aviso:</strong> Portal privado e independente. Inscrições exclusivamente pelo gov.br. Fonte com validade legal: edital oficial publicado no DOU.
                </p>
              </div>
            </Reveal>

            {/* Fontes */}
            <Reveal delay={140}>
              <div style={{ padding: '18px', background: C.bg, border: `1px solid ${C.line}`, borderRadius: 4 }}>
                <p style={{ fontSize: 10, fontWeight: 900, color: C.dim, fontFamily: 'Arial, sans-serif', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12 }}>Fontes</p>
                {['gov.br/prf', 'in.gov.br (DOU)', 'cebraspe.org.br', 'prf.gov.br'].map(s => (
                  <div key={s} style={{ fontSize: 11, color: C.muted, fontFamily: 'Arial, sans-serif', padding: '6px 0', borderBottom: `1px solid ${C.lineL}` }}>{s}</div>
                ))}
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* ── BENTO GRID ── */}
      <section style={{ background: C.white, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, padding: '52px 0' }}>
        <div style={W}>
          <Reveal>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ height: 3, width: 24, background: C.red }} />
              <span style={{ fontSize: 11, fontWeight: 900, color: C.ink, letterSpacing: 1.4, textTransform: 'uppercase', fontFamily: 'Arial, sans-serif' }}>Saiba mais</span>
              <div style={{ flex: 1, height: 1, background: C.line }} />
            </div>
          </Reveal>
          <div className="rv3-bento">
            {BENTO.map((item, i) => (
              <Reveal key={item.tag + i} delay={i * 60}>
                <BentoCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL CTA BANNER ── */}
      <section style={{ background: C.ink, padding: '64px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(176,0,0,.18), transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(176,0,0,.1), transparent 50%)` }} />
        <div style={{ ...W, position: 'relative', textAlign: 'center' }}>
          <Reveal>
            <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 900, color: C.red, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'Arial, sans-serif', border: `1px solid ${C.red}44`, padding: '3px 12px', borderRadius: 2, marginBottom: 18 }}>
              Guia de Preparação
            </span>
            <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 38px)', fontWeight: 900, color: C.white, maxWidth: 620, margin: '0 auto 16px', lineHeight: 1.2 }}>
              Comece a preparação com as informações certas
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.6)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.8, fontFamily: 'Arial, sans-serif' }}>
              Cargos, disciplinas, cronograma e as 7 etapas do processo — guia completo com base em editais anteriores da CEBRASPE.
            </p>
            <button className="rv3-cta" onClick={goCTA} style={{ fontSize: 14, padding: '15px 36px' }}>
              Acessar guia de preparação →
            </button>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.ink2, padding: '36px 0 24px', borderTop: `3px solid ${C.red}` }}>
        <div style={W}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: C.white, fontFamily: "'Georgia', serif", marginBottom: 8 }}>{siteName}</div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', maxWidth: 400, lineHeight: 1.7, fontFamily: 'Arial, sans-serif' }}>{disclaimer}</p>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[['Política de Privacidade', '/politica-privacidade'], ['Termos de Uso', '/termos-de-uso'], ['Aviso de Isenção', '/aviso-isencao'], ['Cookies', '/cookies']].map(([l, h]) => (
                <a key={h} href={h} style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', fontFamily: 'Arial, sans-serif', transition: 'color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.35)')}>
                  {l}
                </a>
              ))}
            </div>
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,.1)', marginBottom: 20 }} />
          <div style={{ fontFamily: 'Arial, sans-serif' }}>
            {razaoSocial && <p style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', lineHeight: 1.7, marginBottom: 4 }}>{razaoSocial}{cnpjFormatted ? ` · CNPJ ${cnpjFormatted}` : ''}</p>}
            {enderecoCompleto && <p style={{ fontSize: 11, color: 'rgba(255,255,255,.25)', lineHeight: 1.7, marginBottom: 4 }}>{enderecoCompleto}</p>}
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.15)', lineHeight: 1.7 }}>
              Portal informativo privado e independente. Não possui vínculo com a Polícia Rodoviária Federal, o Governo Federal ou qualquer banca organizadora de concursos públicos. Conteúdo de caráter exclusivamente educacional, baseado em editais e documentos públicos anteriores.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
