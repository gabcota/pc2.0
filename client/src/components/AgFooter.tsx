import { getSiteConfig } from '@/lib/siteConfig';
import { VARIATION } from '@/lib/variationConfig';

const C = {
  blue:'#4285F4', red:'#EA4335', yellow:'#FBBC04', green:'#34A853',
};

const legalLinks = [
  { label:'Política de Privacidade', href:'/politica-privacidade' },
  { label:'Termos de Uso',           href:'/termos-de-uso' },
  { label:'Aviso de Isenção',        href:'/aviso-isencao' },
  { label:'Cookies',                 href:'/cookies' },
];

const contentLinks = [
  { label:'Guia de inscrição',    href:'/#guia' },
  { label:'Cargos',               href:'/#cargos' },
  { label:'Processo seletivo',    href:'/#processo' },
  { label:'Plano de estudos',     href:'/#estudos' },
  { label:'FAQ',                  href:'/#faq' },
];

function JornalFooter() {
  const cfg = getSiteConfig();
  return (
    <footer style={{ background:'#0D0E0F',borderTop:'3px solid #C0392B',fontFamily:'Arial,sans-serif' }}>
      <div style={{ maxWidth:1200,margin:'0 auto',padding:'40px 24px 24px' }}>
        <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:40,flexWrap:'wrap',marginBottom:36 }}>

          <div style={{ maxWidth:320 }}>
            <div style={{ fontFamily:"'Georgia','Times New Roman',serif",fontSize:22,fontWeight:900,color:'#fff',marginBottom:8,letterSpacing:'-0.5px' }}>
              {cfg.siteName}
            </div>
            <p style={{ fontSize:12,color:'#6B7280',lineHeight:1.75,margin:0 }}>{cfg.disclaimer}</p>
            <p style={{ fontSize:11,color:'#4B5563',lineHeight:1.7,margin:'10px 0 0',borderTop:'1px solid #1e2022',paddingTop:10 }}>
              {cfg.razaoSocial} · CNPJ {cfg.cnpjFormatted}<br/>
              {cfg.enderecoCompleto}
              {cfg.telefone && <><br/><a href={`tel:${cfg.telefone.replace(/\D/g,'')}`} style={{ color:'#6B7280',textDecoration:'none' }}>{cfg.telefone}</a></>}
            </p>
          </div>

          <div style={{ display:'flex',gap:48,flexWrap:'wrap' }}>
            <div>
              <p style={{ fontSize:10,fontWeight:800,color:'#C0392B',textTransform:'uppercase',letterSpacing:1.2,marginBottom:12 }}>Conteúdo</p>
              <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                {contentLinks.map(l=>(
                  <a key={l.label} href={l.href}
                    style={{ fontSize:13,color:'#9CA3AF',textDecoration:'none',transition:'color .15s' }}
                    onMouseEnter={e=>e.currentTarget.style.color='#fff'}
                    onMouseLeave={e=>e.currentTarget.style.color='#9CA3AF'}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize:10,fontWeight:800,color:'#C0392B',textTransform:'uppercase',letterSpacing:1.2,marginBottom:12 }}>Legal</p>
              <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                {legalLinks.map(l=>(
                  <a key={l.label} href={l.href}
                    style={{ fontSize:13,color:'#9CA3AF',textDecoration:'none',transition:'color .15s' }}
                    onMouseEnter={e=>e.currentTarget.style.color='#fff'}
                    onMouseLeave={e=>e.currentTarget.style.color='#9CA3AF'}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop:'1px solid #1e2022',paddingTop:20,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10 }}>
          <p style={{ fontSize:11,color:'#374151',margin:0 }}>
            © 2026 {cfg.razaoSocial} — CNPJ {cfg.cnpjFormatted}. Portal informativo independente.
          </p>
          <p style={{ fontSize:10,color:'#374151',margin:0,fontStyle:'italic' }}>
            Este portal não tem vínculo com o IBGE, o Governo Federal ou qualquer órgão público.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── RevistaFooter ────────────────────────────────── */
function RevistaFooter() {
  const cfg = getSiteConfig();
  return (
    <footer style={{ background:'#222',borderTop:'3px solid #B00000',padding:'36px 0 20px',fontFamily:'Arial,sans-serif' }}>
      <div style={{ maxWidth:1140,margin:'0 auto',padding:'0 20px' }}>
        <div style={{ display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:24,marginBottom:24 }}>
          <div>
            <div style={{ fontSize:20,fontWeight:900,color:'#fff',fontFamily:"'Georgia',serif",marginBottom:8 }}>{cfg.siteName}</div>
            <p style={{ fontSize:12,color:'rgba(255,255,255,.45)',maxWidth:400,lineHeight:1.7,margin:0 }}>{cfg.disclaimer}</p>
          </div>
          <div style={{ display:'flex',gap:20,flexWrap:'wrap' }}>
            {legalLinks.map(l=>(
              <a key={l.label} href={l.href}
                style={{ fontSize:12,color:'rgba(255,255,255,.35)',textDecoration:'none',transition:'color .2s' }}
                onMouseEnter={e=>e.currentTarget.style.color='#fff'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.35)'}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,.1)',paddingTop:18 }}>
          <p style={{ fontSize:11,color:'rgba(255,255,255,.22)',lineHeight:1.7,margin:'0 0 4px' }}>
            {cfg.razaoSocial}{cfg.cnpjFormatted ? ` · CNPJ ${cfg.cnpjFormatted}` : ''}
          </p>
          {cfg.enderecoCompleto && <p style={{ fontSize:11,color:'rgba(255,255,255,.22)',lineHeight:1.7,margin:'0 0 4px' }}>{cfg.enderecoCompleto}</p>}
          {cfg.telefone && <p style={{ fontSize:11,color:'rgba(255,255,255,.22)',lineHeight:1.7,margin:'0 0 4px' }}><a href={`tel:${cfg.telefone.replace(/\D/g,'')}`} style={{ color:'rgba(255,255,255,.35)',textDecoration:'none' }}>{cfg.telefone}</a></p>}
          <p style={{ fontSize:11,color:'rgba(255,255,255,.15)',lineHeight:1.7,margin:0 }}>
            Portal informativo privado e independente. Não possui vínculo com o IBGE, o Governo Federal ou qualquer banca organizadora de processos seletivos.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── GuideFooter ──────────────────────────────────── */
function GuideFooter() {
  const cfg = getSiteConfig();
  return (
    <footer style={{ background:'#0d0d0d',borderTop:'3px solid #e85d04',padding:'36px 0 20px',fontFamily:'Arial,sans-serif' }}>
      <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 28px' }}>
        <div style={{ display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:24,marginBottom:24 }}>
          <div>
            <div style={{ fontSize:18,fontWeight:900,color:'#fff',letterSpacing:'-0.3px',marginBottom:8 }}>
              {cfg.siteName}
              <span style={{ fontSize:10,fontWeight:700,color:'#e85d04',marginLeft:10,textTransform:'uppercase',letterSpacing:'1.4px' }}>Guia IBGE</span>
            </div>
            <p style={{ fontSize:12,color:'rgba(255,255,255,.42)',maxWidth:400,lineHeight:1.75,margin:0 }}>{cfg.disclaimer}</p>
          </div>
          <div style={{ display:'flex',gap:20,flexWrap:'wrap',alignItems:'flex-start' }}>
            {legalLinks.map(l=>(
              <a key={l.label} href={l.href}
                style={{ fontSize:12,color:'rgba(255,255,255,.32)',textDecoration:'none',transition:'color .15s' }}
                onMouseEnter={e=>e.currentTarget.style.color='#e85d04'}
                onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.32)'}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,.08)',paddingTop:16 }}>
          <p style={{ fontSize:11,color:'rgba(255,255,255,.2)',lineHeight:1.7,margin:'0 0 4px' }}>
            {cfg.razaoSocial}{cfg.cnpjFormatted ? ` · CNPJ ${cfg.cnpjFormatted}` : ''}
            {cfg.enderecoCompleto ? ` · ${cfg.enderecoCompleto}` : ''}
            {cfg.telefone ? <> · <a href={`tel:${cfg.telefone.replace(/\D/g,'')}`} style={{ color:'rgba(255,255,255,.3)',textDecoration:'none' }}>{cfg.telefone}</a></> : ''}
          </p>
          <p style={{ fontSize:11,color:'rgba(255,255,255,.12)',lineHeight:1.7,margin:0 }}>
            Portal informativo privado e independente. Não possui vínculo com o IBGE, o Governo Federal ou qualquer banca organizadora de processos seletivos.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function AgFooter() {
  const cfg = getSiteConfig();

  if (VARIATION.layoutStyle === 'jornal') {
    return <JornalFooter />;
  }

  if (VARIATION.homepage === 'revista') {
    return <RevistaFooter />;
  }

  if (VARIATION.homepage === 'guide-pf') {
    return <GuideFooter />;
  }

  return (
    <footer style={{ background:'#111213',borderTop:'1px solid #2A2B2D',fontFamily:"'Google Sans','Roboto',Arial,sans-serif" }}>

      {/* main area */}
      <div style={{ maxWidth:1100,margin:'0 auto',padding:'52px 24px 40px' }}>

        {/* top row: logo + nav links */}
        <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:40,flexWrap:'wrap',marginBottom:44 }}>

          {/* brand */}
          <div style={{ maxWidth:340 }}>
            <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14 }}>
              <svg width="26" height="26" viewBox="0 0 34 34" fill="none">
                <circle cx="9.5"  cy="9.5"  r="8" fill={C.blue}/>
                <circle cx="24.5" cy="9.5"  r="8" fill={C.red}/>
                <circle cx="9.5"  cy="24.5" r="8" fill={C.green}/>
                <circle cx="24.5" cy="24.5" r="8" fill={C.yellow}/>
              </svg>
              <span style={{ fontSize:15,fontWeight:800,color:'#fff',letterSpacing:'-.3px' }}>{cfg.siteName}</span>
            </div>
            <p style={{ fontSize:13,color:'#6B7280',lineHeight:1.75,margin:0 }}>
              {cfg.disclaimer}
            </p>
            <p style={{ fontSize:11,color:'#6B7280',lineHeight:1.7,margin:'10px 0 0',borderTop:'1px solid #1e2022',paddingTop:10 }}>
              Operado por <strong>{cfg.razaoSocial}</strong> · CNPJ {cfg.cnpjFormatted}<br/>
              {cfg.enderecoCompleto}
              {cfg.telefone && <><br/><a href={`tel:${cfg.telefone.replace(/\D/g,'')}`} style={{ color:'#6B7280',textDecoration:'none' }}>{cfg.telefone}</a></>}
            </p>
          </div>

          {/* two link columns */}
          <div style={{ display:'flex',gap:56,flexWrap:'wrap' }}>
            <div>
              <p style={{ fontSize:11,fontWeight:800,color:'#4B5563',textTransform:'uppercase',letterSpacing:1,marginBottom:14 }}>Conteúdo</p>
              <div style={{ display:'flex',flexDirection:'column',gap:9 }}>
                {contentLinks.map(l=>(
                  <a key={l.label} href={l.href}
                    style={{ fontSize:13,color:'#9CA3AF',textDecoration:'none',transition:'color .15s' }}
                    onMouseEnter={e=>e.currentTarget.style.color='#fff'}
                    onMouseLeave={e=>e.currentTarget.style.color='#9CA3AF'}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize:11,fontWeight:800,color:'#4B5563',textTransform:'uppercase',letterSpacing:1,marginBottom:14 }}>Legal</p>
              <div style={{ display:'flex',flexDirection:'column',gap:9 }}>
                {legalLinks.map(l=>(
                  <a key={l.label} href={l.href}
                    style={{ fontSize:13,color:'#9CA3AF',textDecoration:'none',transition:'color .15s' }}
                    onMouseEnter={e=>e.currentTarget.style.color='#fff'}
                    onMouseLeave={e=>e.currentTarget.style.color='#9CA3AF'}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* bottom bar */}
        <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12 }}>
          <p style={{ fontSize:11,color:'#374151',margin:0,lineHeight:1.6 }}>
            © 2026 {cfg.razaoSocial} — CNPJ {cfg.cnpjFormatted}. Site privado, informativo e independente.
          </p>
          <div style={{ display:'flex',gap:5,alignItems:'center' }}>
            {[C.blue,C.red,C.yellow,C.green].map(c=>(
              <span key={c} style={{ width:8,height:8,borderRadius:'50%',background:c,display:'inline-block',opacity:.7 }}/>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
