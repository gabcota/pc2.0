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

  const accent = '#1451B4';
  const accentDone = '#168821';

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
      `}</style>

      {/* Spinner circular, único indicador visual de progresso */}
      <div style={{
        position: 'relative',
        width: 36,
        height: 36,
        marginBottom: 20,
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2.5px solid #eceff3',
        }} />
        {stage !== 'done' ? (
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2.5px solid transparent',
            borderTopColor: accent,
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={accentDone} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        )}
      </div>

      {/* Rótulo principal */}
      <p key={stage} style={{
        fontSize: 14,
        fontWeight: 500,
        color: stage === 'done' ? accentDone : '#33383f',
        margin: '0 0 4px',
        animation: 'sl-fadein .2s ease',
      }}>
        {label}
      </p>

      {/* Sublabel */}
      <p style={{
        fontSize: 12,
        color: '#9aa0aa',
        margin: '0 0 24px',
      }}>
        {stage !== 'done' ? 'Aguarde um instante…' : 'Redirecionando…'}
      </p>

      {/* Barra de progresso fina */}
      <div style={{
        width: 120,
        height: 2,
        borderRadius: 2,
        background: '#eceff3',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: barWidth,
          background: stage === 'done' ? accentDone : accent,
          borderRadius: 2,
          transition: 'width .5s cubic-bezier(.4,0,.2,1), background .3s ease',
        }} />
      </div>
    </div>
  );
}
