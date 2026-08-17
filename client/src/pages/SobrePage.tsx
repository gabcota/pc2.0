import { getSiteConfig } from "@/lib/siteConfig";
import { ZapZapHeader, ZapZapFooter, ZapZapChromeStyles, NAVY, ACCENT, estadoNomeCompleto } from "@/components/zapzap/ZapZapChrome";

const ATUACOES = [
  {
    title: "Estágio Probatório e Estabilidade",
    text: "Orientação em avaliações de desempenho, prazos e recursos administrativos durante os primeiros anos de exercício do cargo.",
  },
  {
    title: "Processo Administrativo Disciplinar (PAD)",
    text: "Acompanhamento e defesa técnica em sindicâncias e processos disciplinares, com foco no respeito ao contraditório e à ampla defesa.",
  },
  {
    title: "Promoções, Transferências e Remoções",
    text: "Análise de indeferimentos e omissões da Administração em progressões funcionais, transferências e remoções.",
  },
  {
    title: "Remuneração e Reintegração",
    text: "Revisão de descontos indevidos, diferenças remuneratórias e pedidos de reintegração ao cargo.",
  },
];

export default function SobrePage() {
  const cfg = getSiteConfig();
  const isVerifiedLawFirm = !!(cfg.oabNumero && cfg.advogadoNome);
  const escritorio = cfg.razaoSocial || cfg.advogadoNome || cfg.siteName;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .sb { font-family: 'Inter', system-ui, sans-serif; background: #F4F6FB; color: #0A1628; min-height: 100vh; }
        .sb h1, .sb h2, .sb h3 { margin: 0; }
        .sb p { margin: 0; }
        .sb-content { max-width: 880px; margin: 0 auto; padding: 48px 24px 80px; }
        .sb-hero { margin-bottom: 40px; }
        .sb-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: ${NAVY}; }
        .sb-lead { font-size: 15.5px; color: #3D4F72; line-height: 1.8; margin-top: 16px; max-width: 680px; }
        .sb-section { margin-bottom: 44px; }
        .sb-section h2 { font-size: 20px; font-weight: 700; color: #0A1628; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #D0D9F0; }
        .sb-section p { font-size: 14.5px; color: #3D4F72; line-height: 1.85; }
        .sb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        @media (max-width: 640px) { .sb-grid { grid-template-columns: 1fr; } }
        .sb-card { background: #fff; border: 1px solid #D0D9F0; border-radius: 12px; padding: 20px 22px; }
        .sb-card h3 { font-size: 14.5px; font-weight: 700; color: #0A1628; margin-bottom: 8px; }
        .sb-card p { font-size: 13.5px; color: #5A6B8C; line-height: 1.7; }
        .sb-facts { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 8px; }
        .sb-fact { background: #fff; border: 1px solid #D0D9F0; border-radius: 10px; padding: 12px 16px; font-size: 12.5px; color: #3D4F72; }
        .sb-fact strong { color: #0A1628; }
        @media (max-width: 600px) { .sb-content { padding: 32px 16px 60px; } }
      `}</style>
      <ZapZapChromeStyles />

      <div className="sb">
        <ZapZapHeader />

        <div className="sb-content">
          <div className="sb-hero">
            <span className="sb-eyebrow">Sobre</span>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, color: "#0A1628", margin: "8px 0 0", lineHeight: 1.15 }}>
              {escritorio}
            </h1>
            <p className="sb-lead">
              {isVerifiedLawFirm
                ? "Somos uma sociedade de advocacia dedicada ao Direito Administrativo e à carreira do servidor público, oferecendo orientação e defesa técnica em todas as fases da vida funcional — do estágio probatório à aposentadoria."
                : "Mantemos este portal com conteúdo informativo sobre direitos e estabilidade na carreira pública, ajudando servidores a entender processos administrativos, promoções e demais temas da vida funcional."}
            </p>
          </div>

          <div className="sb-section">
            <h2>Quem somos</h2>
            <p>
              {escritorio} atua no acompanhamento jurídico de servidores públicos em momentos decisivos da carreira, com foco em Direito Administrativo. Não temos qualquer vínculo com órgãos públicos, entidades governamentais ou comissões de processo administrativo — nossa atuação é independente e voltada exclusivamente à defesa dos direitos do servidor.
            </p>
            <p style={{ marginTop: 14 }}>
              Este site é mantido para divulgação de conteúdo jurídico informativo sobre direitos do servidor público e para viabilizar o primeiro contato com nossa equipe, feito diretamente pelo WhatsApp indicado neste portal — sem custo e sem compromisso.
            </p>
          </div>

          <div className="sb-section">
            <h2>Áreas de atuação</h2>
            <div className="sb-grid">
              {ATUACOES.map((a) => (
                <div key={a.title} className="sb-card">
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="sb-section">
            <h2>Como trabalhamos</h2>
            <p>
              O primeiro contato é feito por WhatsApp, de forma direta e sem custo, para entender a situação do servidor e indicar os próximos passos possíveis. Havendo interesse em assessoria jurídica formal, os termos são apresentados com transparência antes de qualquer compromisso. Nenhuma informação disponibilizada neste portal substitui a análise individual de um profissional habilitado.
            </p>
          </div>

          <div className="sb-section">
            <h2>Dados institucionais</h2>
            <div className="sb-facts">
              {cfg.cnpjFormatted && <div className="sb-fact"><strong>CNPJ:</strong> {cfg.cnpjFormatted}</div>}
              {cfg.naturezaJuridica && <div className="sb-fact"><strong>Natureza jurídica:</strong> {cfg.naturezaJuridica}</div>}
              {cfg.cnae && <div className="sb-fact"><strong>Atividade:</strong> {cfg.cnae}</div>}
              {cfg.horarioAtendimento && <div className="sb-fact"><strong>Atendimento:</strong> {cfg.horarioAtendimento}</div>}
              {(cfg.cidade || cfg.estado) && (
                <div className="sb-fact">
                  <strong>Localização:</strong> {cfg.cidade}{cfg.estado ? ` — ${estadoNomeCompleto(cfg.estado)} (${cfg.estado})` : ""}
                </div>
              )}
            </div>
          </div>

          <div style={{ background: "#EEF2FF", border: "1px solid #C7D2F0", borderRadius: 10, padding: "16px 20px", marginBottom: 36 }}>
            <p style={{ fontSize: 13.5, color: NAVY, lineHeight: 1.7 }}>
              <strong>Aviso:</strong> as informações deste site têm caráter exclusivamente informativo e não constituem aconselhamento jurídico individual. Para orientação específica ao seu caso, fale com um profissional habilitado pelo WhatsApp indicado neste portal.
            </p>
          </div>

          <div style={{ background: "#fff", border: "1px solid #D0D9F0", borderRadius: 12, padding: "18px 24px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "#8BA3CC" }}>Veja também:</span>
            <a href="/privacidade" style={{ fontSize: 14, color: NAVY, fontWeight: 600 }}>→ Política de Privacidade</a>
            <a href="/termos" style={{ fontSize: 14, color: NAVY, fontWeight: 600 }}>→ Termos de Uso</a>
            <a href="/" style={{ fontSize: 14, color: ACCENT, fontWeight: 600 }}>→ Página inicial</a>
          </div>
        </div>

        <ZapZapFooter />
      </div>
    </>
  );
}
