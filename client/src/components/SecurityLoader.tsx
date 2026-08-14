import { useState, useEffect } from 'react';

type Stage = 'checking' | 'human' | 'done';

export function SecurityLoader() {
  const [stage, setStage] = useState<Stage>('checking');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('human'), 620);
    const t2 = setTimeout(() => setStage('done'), 1280);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const barWidth =
    stage === 'checking' ? '35%' :
    stage === 'human'    ? '75%' :
                           '100%';

  const label =
    stage === 'checking' ? 'Verificando conexão segura' :
    stage === 'human'    ? 'Carregando conteúdo' :
                           'Conteúdo carregado';

  // Paleta inspirada no padrão visual do gov.br (azul institucional)
  const govBlue = '#1451B4';
  const govBlueDark = '#0C326F';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      fontFamily: 'Rawline, "Segoe UI", Arial, sans-serif',
    }}>
      <style>{`
        @keyframes sl-spin { to { transform: rotate(360deg); } }
        @keyframes sl-fadein { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: none; } }
        @keyframes sl-pulse { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
      `}</style>

      {/* Faixa superior — imitando a barra institucional azul do gov.br */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: 4,
        background: '#dce3ea',
      }}>
        <div style={{
          height: '100%',
          width: barWidth,
          background: govBlue,
          transition: 'width .5s cubic-bezier(.4,0,.2,1)',
        }} />
      </div>

      {/* Faixa de identidade institucional */}
      <div style={{
        position: 'fixed',
        top: 4, left: 0, right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '10px 0',
        background: govBlueDark,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="1" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '0.04em',
        }}>
          ambiente seguro
        </span>
      </div>

      {/* Spinner circular no estilo gov.br */}
      <div style={{
        position: 'relative',
        width: 56,
        height: 56,
        marginBottom: 28,
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '4px solid #e6ecf6',
        }} />
        {stage !== 'done' ? (
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '4px solid transparent',
            borderTopColor: govBlue,
            borderRightColor: govBlue,
            animation: 'sl-spin .8s linear infinite',
          }} />
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke="#168821" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        )}
      </div>

      {/* Rótulo principal */}
      <p key={stage} style={{
        fontSize: 15,
        fontWeight: 600,
        color: stage === 'done' ? '#168821' : govBlueDark,
        margin: '0 0 8px',
        letterSpacing: '0.01em',
        animation: 'sl-fadein .2s ease',
      }}>
        {label}
      </p>

      {/* Sublabel */}
      <p style={{
        fontSize: 12,
        color: '#6c7480',
        margin: 0,
        letterSpacing: '0.01em',
        animation: stage !== 'done' ? 'sl-pulse 1.4s ease-in-out infinite' : 'none',
      }}>
        {stage !== 'done' ? 'Aguarde, isso pode levar alguns segundos…' : 'Redirecionando…'}
      </p>
    </div>
  );
}
