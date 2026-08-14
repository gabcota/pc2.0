import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { getSiteConfig } from '@/lib/siteConfig';
import { VARIATION } from '@/lib/variationConfig';

const C = {
  blue:'#4285F4', blueDark:'#1A73E8', blueLight:'#F0FDF4', blueMid:'#C5D8FB',
  red:'#EA4335', yellow:'#FBBC04', green:'#34A853',
  dark:'#202124', mid:'#5F6368', muted:'#80868B', border:'#DADCE0',
};

type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string; desc?: string }[];
};

const nav: NavItem[] = [
  { label:'Início', href:'/' },
  {
    label:'Sobre o IBGE',
    children:[
      { label:'O que é o IBGE',                     href:'/#sobre',       desc:'Missão, estrutura e abrangência' },
      { label:'Por que trabalhar no IBGE',           href:'/#porque',      desc:'Carreira, benefícios e impacto social' },
      { label:'Perfil do candidato aprovado',        href:'/#perfil',      desc:'Características dos aprovados' },
      { label:'Distribuição regional',               href:'/#distribuicao',desc:'Vagas por estado e região' },
    ],
  },
  {
    label:'Cargos',
    children:[
      { label:'Agente de Pesquisa e Mapeamento', href:'/#cargos', desc:'Ensino Médio completo — campo e coleta' },
    ],
  },
  {
    label:'Processo Seletivo',
    children:[
      { label:'Visão geral do processo',  href:'/#processo',  desc:'Todas as etapas explicadas' },
      { label:'Inscrição',                href:'/#guia',      desc:'Passo a passo para se inscrever' },
      { label:'Provas objetiva e física', href:'/#processo',  desc:'Formato, conteúdo e datas' },
      { label:'Avaliação psicológica',    href:'/#processo',  desc:'Como funciona e como se preparar' },
      { label:'Curso de formação',        href:'/#processo',  desc:'Duração e local do curso' },
    ],
  },
  {
    label:'Plano de Estudos',
    children:[
      { label:'Cronograma sugerido',      href:'/#estudos',   desc:'Distribuição semanal das matérias' },
      { label:'Disciplinas mais cobradas',href:'/#estudos',   desc:'Português, RLM, Direito e mais' },
      { label:'Dicas de preparação',      href:'/#estudos',   desc:'Estratégias de estudo eficazes' },
      { label:'O dia da prova',           href:'/#estudos',   desc:'O que levar e como chegar' },
    ],
  },
  { label:'FAQ', href:'/#faq' },
];

const jornalSections = [
  { label:'Edital', href:'/#edital' },
  { label:'Cargos', href:'/#cargos' },
  { label:'Etapas', href:'/#processo' },
  { label:'Depoimentos', href:'/#depoimentos' },
  { label:'FAQ', href:'/#faq' },
];

function Dropdown({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position:'relative' }}
      onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)}>
      <button className={`agh-tab${isActive?' active':''}`}
        style={{ background:'none',border:'none',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:4 }}
        onClick={()=>setOpen(v=>!v)}>
        {item.label}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition:'transform .2s',transform:open?'rotate(180deg)':'none',opacity:.6 }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position:'absolute',top:'calc(100% + 1px)',left:'50%',transform:'translateX(-50%)',
          background:'#fff',border:`1px solid ${C.border}`,borderRadius:12,
          boxShadow:'0 8px 32px rgba(0,0,0,.12)',minWidth:280,zIndex:500,
          padding:'8px 0',animation:'agh-drop .15s ease',
        }}>
          {item.children!.map(c=>(
            <a key={c.label} href={c.href}
              style={{ display:'block',padding:'10px 18px',textDecoration:'none',transition:'background .12s' }}
              onMouseEnter={e=>(e.currentTarget.style.background='#F8F9FA')}
              onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
              <div style={{ fontSize:13,fontWeight:600,color:C.dark,marginBottom:2 }}>{c.label}</div>
              {c.desc && <div style={{ fontSize:11,color:C.muted }}>{c.desc}</div>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function JornalHeader() {
  const cfg = getSiteConfig();
  const [location] = useLocation();
  const today = new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

  return (
    <>
      <style>{`
        @keyframes agh-drop{from{opacity:0;transform:translateX(-50%) translateY(-6px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        @keyframes bannerShift{0%{background-position:0% center}100%{background-position:200% center}}
        .jh-link{font-size:12px;font-weight:700;color:#9CA3AF;text-decoration:none;text-transform:uppercase;letter-spacing:.8px;padding:10px 12px;transition:color .15s;white-space:nowrap}
        .jh-link:hover,.jh-link.active{color:#fff}
        .jh-link.active{border-bottom:2px solid #fff}
      `}</style>

      <header style={{ background:'#111213',fontFamily:"'Georgia','Times New Roman',serif" }}>
        {/* disclaimer banner */}
        <div style={{ background:'linear-gradient(90deg,#ff6b00 0%,#f7c500 50%,#ff6b00 100%)',padding:'9px 24px',textAlign:'center',backgroundSize:'200% auto',animation:'bannerShift 4s linear infinite' }}>
          <p style={{ fontSize:12,color:'#1a1a1a',margin:0,lineHeight:1.5,fontWeight:700,letterSpacing:.2,textShadow:'0 1px 2px rgba(255,255,255,.3)',fontFamily:'Arial,sans-serif' }}>
            ⚠️ <strong>Atenção:</strong> Este portal é privado e independente — sem nenhuma relação com o IBGE, o Governo Federal ou qualquer órgão público. <strong>Nenhuma inscrição, cadastro ou pagamento é realizado aqui.</strong> Para se inscrever, acesse o portal oficial do IBGE (ibge.gov.br).
          </p>
        </div>

        <div style={{ borderBottom:'1px solid #2A2B2D',padding:'10px 24px' }}>
          <div style={{ maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16 }}>
            <p style={{ fontSize:11,color:'#6B7280',margin:0,fontFamily:'Arial,sans-serif' }}>
              {today.charAt(0).toUpperCase() + today.slice(1)}
            </p>
            <p style={{ fontSize:10,color:'#4B5563',margin:0,fontFamily:'Arial,sans-serif',textAlign:'center' }}>
              Portal independente · Conteúdo informativo · {cfg.razaoSocial} — CNPJ {cfg.cnpjFormatted}
            </p>
            <a href="/politica-privacidade" style={{ fontSize:11,color:'#6B7280',textDecoration:'none',fontFamily:'Arial,sans-serif',whiteSpace:'nowrap' }}>Legal</a>
          </div>
        </div>

        <div style={{ padding:'24px 24px 16px',borderBottom:'3px solid #C0392B' }}>
          <div style={{ maxWidth:1200,margin:'0 auto',textAlign:'center' }}>
            <a href="/" style={{ textDecoration:'none' }}>
              {cfg.logoImage && (
                <div style={{ marginBottom:10,display:'flex',justifyContent:'center' }}>
                  <img src={cfg.logoImage} alt={cfg.siteName} style={{ height:64,width:'auto',objectFit:'contain' }} />
                </div>
              )}
              <div style={{ fontSize:11,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:3,marginBottom:6,fontFamily:'Arial,sans-serif' }}>
                {cfg.siteSubtitle}
              </div>
              <div style={{ fontSize:52,fontWeight:900,color:'#fff',lineHeight:1,letterSpacing:'-2px',marginBottom:6 }}>
                {cfg.siteName}
              </div>
              <div style={{ width:80,height:2,background:'#C0392B',margin:'0 auto 10px' }}/>
            </a>
            <p style={{ fontSize:12,color:'#6B7280',margin:0,fontFamily:'Arial,sans-serif',fontStyle:'italic' }}>
              {cfg.disclaimer}
            </p>
          </div>
        </div>

        <nav style={{ borderBottom:'1px solid #2A2B2D',background:'#1A1B1C' }}>
          <div style={{ maxWidth:1200,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'center',gap:0,overflowX:'auto',padding:'0 16px' }}>
            {jornalSections.map(s=>(
              <a key={s.label} href={s.href}
                className={`jh-link${location===s.href?' active':''}`}>
                {s.label}
              </a>
            ))}
            <div style={{ flex:1 }}/>
            <a href="/politica-privacidade"
              style={{ fontSize:11,color:'#6B7280',textDecoration:'none',padding:'10px 12px',fontFamily:'Arial,sans-serif',whiteSpace:'nowrap' }}>
              Privacidade
            </a>
          </div>
        </nav>
      </header>
    </>
  );
}

/* ─── RevistaHeader ────────────────────────────────── */
function RevistaHeader() {
  const cfg = getSiteConfig();
  const siteName = cfg?.siteName ?? 'Portal IBGE';
  return (
    <>
      <style>{`
        @keyframes rv-hbanner{0%{background-position:0% center}100%{background-position:200% center}}
        .rv-hnav-a{font-size:12px;font-weight:700;color:rgba(255,255,255,.72);letter-spacing:.8px;text-transform:uppercase;font-family:Arial,sans-serif;padding:11px 14px;border-right:1px solid rgba(255,255,255,.08);transition:color .15s,background .15s;display:block;white-space:nowrap}
        .rv-hnav-a:hover{color:#fff;background:rgba(176,0,0,.5)}
      `}</style>
      <div style={{ background:'linear-gradient(90deg,#ff6b00 0%,#f7c500 50%,#ff6b00 100%)',padding:'9px 24px',textAlign:'center',backgroundSize:'200% auto',animation:'rv-hbanner 4s linear infinite' }}>
        <p style={{ fontSize:12,color:'#1a1a1a',margin:0,lineHeight:1.5,fontWeight:700,letterSpacing:.2,textShadow:'0 1px 2px rgba(255,255,255,.3)',fontFamily:'Arial,sans-serif' }}>
          ⚠️ <strong>Atenção:</strong> Este portal é privado e independente, operado por {cfg?.razaoSocial ?? siteName}{cfg?.cnpjFormatted ? ` (CNPJ ${cfg.cnpjFormatted})` : ''} — sem nenhuma relação com o IBGE, o Governo Federal ou qualquer órgão público. <strong>Nenhuma inscrição, cadastro ou pagamento é realizado aqui.</strong>
        </p>
      </div>
      <header style={{ background:'#B00000' }}>
        <div style={{ maxWidth:1140,margin:'0 auto',padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <a href="/" style={{ textDecoration:'none',display:'flex',alignItems:'baseline',gap:12 }}>
            <span style={{ fontSize:28,fontWeight:900,color:'#fff',letterSpacing:'-0.5px',lineHeight:1,fontFamily:"'Georgia','Times New Roman',serif" }}>{siteName}</span>
            <span style={{ fontSize:10,color:'rgba(255,255,255,.55)',fontFamily:'Arial,sans-serif',textTransform:'uppercase',letterSpacing:1.2 }}>Portal Informativo</span>
          </a>
          <a href="/politica-privacidade" style={{ fontSize:11,color:'rgba(255,255,255,.55)',fontFamily:'Arial,sans-serif',textDecoration:'none' }}>Legal</a>
        </div>
      </header>
      <nav style={{ background:'#111',borderBottom:'3px solid #B00000' }}>
        <div style={{ maxWidth:1140,margin:'0 auto',display:'flex',overflowX:'auto' }}>
          {['Concursos','Cargos','Etapas','Preparação','Carreira','Remuneração'].map(l=>(
            <a key={l} href="/" className="rv-hnav-a">{l}</a>
          ))}
        </div>
      </nav>
    </>
  );
}

/* ─── GuideHeader ──────────────────────────────────── */
function GuideHeader() {
  const cfg = getSiteConfig();
  return (
    <>
      <style>{`
        .gh2-link{font-size:12px;font-weight:600;color:#4a4a4a;text-decoration:none;padding:6px 0;border-bottom:2px solid transparent;transition:all .15s;white-space:nowrap}
        .gh2-link:hover{color:#e85d04;border-bottom-color:#e85d04}
      `}</style>
      <div style={{ background:'#1c1c1c',padding:'8px 24px',textAlign:'center' }}>
        <p style={{ fontSize:11.5,color:'rgba(255,255,255,.65)',margin:0,fontFamily:'system-ui,sans-serif',lineHeight:1.5 }}>
          <span style={{ color:'#e85d04',fontWeight:700,marginRight:6 }}>⚠ Aviso:</span>
          Portal independente operado por <strong style={{ color:'rgba(255,255,255,.85)' }}>{cfg?.razaoSocial}</strong> · CNPJ {cfg?.cnpjFormatted} · Sem vínculo com o IBGE ou qualquer órgão público.
        </p>
      </div>
      <header style={{ background:'#fff',borderBottom:'1px solid #e8e8e8',position:'sticky',top:0,zIndex:400 }}>
        <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 28px',display:'flex',alignItems:'center',justifyContent:'space-between',height:56 }}>
          <a href="/" style={{ textDecoration:'none',display:'flex',alignItems:'center',gap:10 }}>
            {cfg?.logoImage && <img src={cfg.logoImage} alt={cfg.siteName} width={30} height={30} style={{ objectFit:'contain' }} />}
            <div>
              <div style={{ fontSize:15,fontWeight:900,color:'#1c1c1c',letterSpacing:'-0.3px',lineHeight:1 }}>{cfg?.siteName}</div>
              <div style={{ fontSize:9,fontWeight:700,color:'#e85d04',textTransform:'uppercase',letterSpacing:'1.4px' }}>Guia de Estudo · IBGE PSS 2026</div>
            </div>
          </a>
          <nav style={{ display:'flex',gap:24 }}>
            {[{label:'Início',href:'/'},{label:'Cargos',href:'/#cargos'},{label:'Processo',href:'/#processo'},{label:'Estudos',href:'/#estudos'}].map(l=>(
              <a key={l.label} href={l.href} className="gh2-link">{l.label}</a>
            ))}
          </nav>
          <a href="/#passos" style={{ background:'#e85d04',color:'#fff',fontWeight:700,fontSize:13,padding:'8px 18px',borderRadius:3,textDecoration:'none' }}>
            Ver o guia →
          </a>
        </div>
      </header>
    </>
  );
}

export function AgHeader() {
  const [location] = useLocation();
  const cfg = getSiteConfig();

  if (VARIATION.layoutStyle === 'jornal') {
    return <JornalHeader />;
  }

  if (VARIATION.homepage === 'revista') {
    return <RevistaHeader />;
  }

  if (VARIATION.homepage === 'guide-pf') {
    return <GuideHeader />;
  }

  return (
    <>
      <style>{`
        @keyframes agh-drop{from{opacity:0;transform:translateX(-50%) translateY(-6px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        .agh-tab{position:relative;padding:20px 14px 18px;font-size:13.5px;font-weight:600;color:${C.mid};text-decoration:none;white-space:nowrap;transition:color .15s;border-bottom:3px solid transparent;display:inline-flex;align-items:center;gap:3px;font-family:inherit}
        .agh-tab:hover{color:${C.blue};border-bottom-color:${C.blueMid}}
        .agh-tab.active{color:${C.blue};border-bottom-color:${C.blue}}
        .agh-cta{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:8px 18px;font-size:13.5px;font-weight:700;text-decoration:none;background:${C.blue};color:#fff;border:none;cursor:pointer;font-family:inherit;transition:all .2s;box-shadow:0 2px 8px ${C.blue}33}
        .agh-cta:hover{background:${C.blueDark};transform:translateY(-1px)}
        @media(max-width:960px){.agh-nav{display:none!important}}
      `}</style>

      {/* disclaimer banner */}
      <div style={{ background:'linear-gradient(90deg,#ff6b00 0%,#f7c500 50%,#ff6b00 100%)',padding:'10px 24px',textAlign:'center',backgroundSize:'200% auto',animation:'bannerShift 4s linear infinite' }}>
        <style>{`@keyframes bannerShift{0%{background-position:0% center}100%{background-position:200% center}}`}</style>
        <p style={{ fontSize:12.5,color:'#1a1a1a',margin:0,lineHeight:1.5,fontWeight:700,letterSpacing:.2,textShadow:'0 1px 2px rgba(255,255,255,.3)' }}>
          ⚠️ <strong>Atenção:</strong> Este portal é privado e independente, operado por {cfg.razaoSocial} (CNPJ {cfg.cnpjFormatted}) — sem nenhuma relação com o IBGE, o Governo Federal ou qualquer órgão público. Conteúdo exclusivamente informativo.
        </p>
      </div>

      <header style={{ position:'sticky',top:0,zIndex:300,background:'rgba(255,255,255,.97)',backdropFilter:'blur(10px)',borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1280,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 20px' }}>

          {/* logo */}
          <a href="/" style={{ textDecoration:'none',display:'flex',alignItems:'center',gap:10,paddingRight:20,flexShrink:0 }}>
            {cfg.logoImage ? (
              <img
                src={cfg.logoImage}
                alt={cfg.siteName}
                width={36}
                height={36}
                style={{ objectFit:'contain', flexShrink:0 }}
              />
            ) : (
              <svg width="30" height="30" viewBox="0 0 34 34" fill="none">
                <circle cx="9.5"  cy="9.5"  r="8" fill={C.blue}/>
                <circle cx="24.5" cy="9.5"  r="8" fill={C.red}/>
                <circle cx="9.5"  cy="24.5" r="8" fill={C.green}/>
                <circle cx="24.5" cy="24.5" r="8" fill={C.yellow}/>
              </svg>
            )}
            <div>
              <div style={{ fontSize:14.5,fontWeight:800,color:C.dark,lineHeight:1.1 }}>{cfg.siteName}</div>
              <div style={{ fontSize:9,color:C.muted,textTransform:'uppercase',letterSpacing:.8 }}>{cfg.siteSubtitle}</div>
            </div>
          </a>

          {/* navigation */}
          <nav className="agh-nav" style={{ display:'flex',alignItems:'flex-end',flex:1,overflowX:'visible',gap:0 }}>
            {nav.map(item => {
              const isActive = item.href
                ? (item.href === '/' ? (location === '/' || location === '/anti-google') : location === item.href)
                : false;

              if (item.children) return <Dropdown key={item.label} item={item} isActive={isActive}/>;
              return (
                <a key={item.label} href={item.href} className={`agh-tab${isActive?' active':''}`}>{item.label}</a>
              );
            })}
          </nav>

          {/* actions */}
          <div style={{ display:'flex',alignItems:'center',gap:10,flexShrink:0,paddingLeft:12 }}>
            <a href="/politica-privacidade"
              style={{ fontSize:12,color:C.muted,textDecoration:'none',transition:'color .15s' }}
              onMouseEnter={e=>e.currentTarget.style.color=C.blue}
              onMouseLeave={e=>e.currentTarget.style.color=C.muted}>Legal</a>
            <a href="/#guia" className="agh-cta">Ler o guia →</a>
          </div>

        </div>
      </header>
    </>
  );
}
