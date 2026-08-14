import { getSiteConfig } from "@/lib/siteConfig";
import { ZapZapHeader, ZapZapFooter, ZapZapChromeStyles, NAVY } from "@/components/zapzap/ZapZapChrome";

const COOKIE_TYPES = [
  {
    tipo: "Cookies estritamente necessários",
    color: "#1A3FAA",
    bg: "#EEF2FF",
    border: "#C7D2F0",
    icon: "🔒",
    desc: "Indispensáveis para o funcionamento técnico básico do site. Sem eles, páginas não carregam corretamente e recursos essenciais de segurança ficam desativados. Não podem ser desativados por meio de nossas configurações.",
    exemplos: [
      { nome: "session_id", finalidade: "Mantém a sessão ativa durante a navegação entre páginas", duracao: "Sessão" },
      { nome: "csrf_token", finalidade: "Proteção contra ataques de falsificação de requisição entre sites (CSRF)", duracao: "Sessão" },
      { nome: "consent_v", finalidade: "Registra o status da aceitação ou rejeição do banner de cookies", duracao: "12 meses" },
      { nome: "sec_flags", finalidade: "Flags de segurança para detectar e bloquear tentativas de acesso malicioso", duracao: "Sessão" },
    ],
  },
  {
    tipo: "Cookies analíticos e de desempenho",
    color: "#0D2049",
    bg: "#F4F6FB",
    border: "#D0D9F0",
    icon: "📊",
    desc: "Coletam informações sobre como os visitantes utilizam o site — páginas mais acessadas, tempo de permanência, origem dos acessos. Todos os dados são anonimizados e usados apenas para fins estatísticos agregados.",
    exemplos: [
      { nome: "_ga", finalidade: "Google Analytics — identifica sessões únicas. IP anonimizado antes do armazenamento.", duracao: "2 anos" },
      { nome: "_gid", finalidade: "Google Analytics — distingue usuários entre sessões no mesmo dia", duracao: "24 horas" },
      { nome: "_gat", finalidade: "Google Analytics — limita a taxa de requisições ao servidor de coleta", duracao: "1 minuto" },
      { nome: "_ga_XXXXXXX", finalidade: "Google Analytics 4 — armazena estado da sessão para análise de fluxo de navegação", duracao: "2 anos" },
    ],
  },
  {
    tipo: "Cookies funcionais",
    color: "#92550a",
    bg: "#fff8ee",
    border: "#f0d080",
    icon: "⚙️",
    desc: "Permitem que o site lembre preferências e configurações do usuário entre visitas, oferecendo experiência mais personalizada sem que o visitante precise reconfigurar a cada acesso.",
    exemplos: [
      { nome: "theme_pref", finalidade: "Armazena preferência de tema (modo claro ou escuro)", duracao: "1 ano" },
      { nome: "faq_state", finalidade: "Memoriza quais perguntas do FAQ foram expandidas pelo usuário", duracao: "30 dias" },
      { nome: "lang_pref", finalidade: "Preferência de idioma de exibição do conteúdo", duracao: "1 ano" },
    ],
  },
];

type SectionContent = string | ((razaoSocial: string, cnpjFormatted: string, email: string) => string);

const SECTIONS: { id: string; title: string; content: SectionContent }[] = [
  {
    id: "c1",
    title: "1. O que são cookies?",
    content: `Cookies são pequenos arquivos de texto gerados por um servidor web e armazenados no dispositivo do usuário quando este acessa um site. Nas visitas subsequentes, o navegador reenvia automaticamente o cookie ao servidor, permitindo que o site reconheça o dispositivo e recupere informações da sessão anterior.

Além dos cookies tradicionais, tecnologias similares podem ser utilizadas para fins equivalentes: pixel tags, web beacons, armazenamento local (localStorage), armazenamento de sessão (sessionStorage) e IndexedDB. Esta Política abrange todas essas tecnologias sob o termo genérico "cookies".`,
  },
  {
    id: "c2",
    title: "2. Por que utilizamos cookies?",
    content: `Utilizamos cookies exclusivamente para finalidades legítimas e transparentes:

• Funcionamento técnico essencial — garantir que as páginas carreguem corretamente, que os mecanismos de segurança estejam ativos e que a sessão do usuário seja mantida durante a navegação.
• Análise de audiência agregada e anonimizada — compreender, de forma estatística, como os visitantes utilizam o portal, sem qualquer identificação individual.
• Melhoria contínua do conteúdo — identificar seções de maior interesse e priorizar melhorias relevantes.
• Registro de consentimento — armazenar sua decisão sobre cookies para não exibir o banner repetidamente.

Não utilizamos cookies para publicidade comportamental, retargeting ou compartilhamento de dados com terceiros para fins publicitários.`,
  },
  {
    id: "c3",
    title: "3. Base legal (LGPD e Marco Civil)",
    content: `O uso de cookies por este portal está amparado nas seguintes bases legais:

Cookies estritamente necessários: legítimo interesse do controlador (art. 7º, IX, da LGPD) para garantir o funcionamento técnico e a segurança do portal. Não requerem consentimento prévio, pois são indispensáveis ao serviço.

Cookies analíticos com anonimização de IP: legítimo interesse do controlador (art. 7º, IX, da LGPD). A anonimização do endereço IP ocorre antes de qualquer transmissão, eliminando a possibilidade de identificação individual do visitante.

Cookies funcionais: consentimento do titular (art. 7º, I, da LGPD), manifestado por meio do banner de consentimento exibido na primeira visita.

Cookies de marketing comportamental: NÃO UTILIZAMOS esta categoria de cookies. Este portal não integra redes de publicidade comportamental ou plataformas de retargeting.`,
  },
  {
    id: "c5",
    title: "5. Cookies de terceiros integrados",
    content: `5.1. Google Analytics (Google LLC)
Finalidade: análise de audiência, métricas de desempenho e relatórios agregados de comportamento de navegação.
Configuração adotada: anonimização de IP ativada; compartilhamento de dados com o Google desabilitado; uso para personalização desabilitado; dados retidos pelo prazo mínimo disponível (14 meses).
Política de privacidade do Google: https://policies.google.com/privacy
Opt-out do Google Analytics: https://tools.google.com/dlpage/gaoptout

5.2. Infraestrutura de hospedagem
O provedor de hospedagem pode instalar cookies técnicos de balanceamento de carga e otimização de entrega (CDN). Esses cookies são estritamente necessários e não contêm informações pessoais identificáveis.`,
  },
  {
    id: "c6",
    title: "6. Como gerenciar ou bloquear cookies",
    content: `Você pode gerenciar cookies a qualquer momento pelas configurações do seu navegador:

Chrome: Menu (⋮) → Configurações → Privacidade e segurança → Cookies e outros dados do site
Firefox: Menu (☰) → Configurações → Privacidade e Segurança → Cookies e dados do site
Safari: Preferências → Privacidade → Gerenciar dados do site
Edge: Menu (⋯) → Configurações → Cookies e permissões do site

Para excluir especificamente da análise do Google Analytics, instale a extensão oficial em: https://tools.google.com/dlpage/gaoptout

A desativação de cookies estritamente necessários pode comprometer o funcionamento correto do portal. A desativação de cookies analíticos e funcionais não prejudica o acesso ao conteúdo principal.`,
  },
  {
    id: "c7",
    title: "7. Duração dos cookies",
    content: `Cookies de sessão (session cookies): existem apenas durante a sessão de navegação ativa e são excluídos automaticamente quando o navegador é fechado.

Cookies persistentes (persistent cookies): permanecem armazenados pelo período especificado em seu atributo de expiração — detalhado na tabela da seção 4 — ou até que você os exclua manualmente.

Você pode excluir todos os cookies persistentes a qualquer momento pelas configurações do seu navegador, independentemente de sua data de expiração.`,
  },
  {
    id: "c8",
    title: "8. Transferência internacional de dados",
    content: `O uso do Google Analytics implica a transferência de dados de navegação (anonimizados) para servidores da Google LLC nos Estados Unidos. Esta transferência ocorre ao amparo das Standard Contractual Clauses (SCCs) adotadas pelo Google para conformidade com legislações de proteção de dados aplicáveis.

A anonimização do IP ocorre antes de qualquer transmissão, de modo que o endereço IP completo nunca é armazenado pela ferramenta.`,
  },
  {
    id: "c9",
    title: "9. Conformidade com a LGPD",
    content: (razaoSocial: string, cnpjFormatted: string) =>
      `${razaoSocial}${cnpjFormatted ? ` (CNPJ ${cnpjFormatted})` : ""} adota as seguintes práticas em conformidade com a LGPD (Lei nº 13.709/2018):

Transparência: todas as tecnologias de rastreamento utilizadas estão identificadas nesta Política, com indicação de finalidade, duração e compartilhamento.

Consentimento informado: o Usuário é informado por meio de banner exibido na primeira visita, com opções claras de aceitação ou recusa. O consentimento pode ser revogado a qualquer momento.

Minimização de dados: coletamos apenas os dados necessários; aplicamos anonimização de IP no Google Analytics; não utilizamos cookies para perfilamento individual.

Direito de oposição e revogação: o Usuário pode opor-se ao uso de cookies não essenciais e revogar o consentimento a qualquer momento pelas configurações do navegador.`,
  },
  {
    id: "c10",
    title: "10. Atualizações e contato",
    content: (razaoSocial: string, _cnpjFormatted: string, email: string) =>
      `Esta Política pode ser revisada periodicamente. A data da última atualização está indicada no início desta página. Alterações que impliquem novos cookies ou novos terceiros serão comunicadas por meio do banner de consentimento na próxima visita.

Para dúvidas, solicitações de exercício de direitos LGPD ou revogação de consentimento:

Responsável: ${razaoSocial}
${email ? `E-mail: ${email}` : ""}
Atendimento via WhatsApp: disponível neste portal.

Prazo de resposta: até 15 (quinze) dias úteis para solicitações de direitos LGPD; até 5 (cinco) dias úteis para dúvidas gerais.`,
  },
];

export default function CookiesPoliticaPage() {
  const cfg = getSiteConfig();

  function renderContent(c: SectionContent): string {
    if (typeof c === "function") return c(cfg.razaoSocial, cfg.cnpjFormatted ?? "", cfg.email ?? "");
    return c;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .cp2 { font-family: 'Inter', system-ui, sans-serif; background: #F4F6FB; color: #0A1628; min-height: 100vh; }
        .cp2 h1, .cp2 h2 { margin: 0; }
        .cp2 p { margin: 0; }
        .cp2 a { text-decoration: none; }
        .cp2-content { max-width: 820px; margin: 0 auto; padding: 48px 24px 80px; }
        .cp2-section { margin-bottom: 44px; scroll-margin-top: 80px; }
        .cp2-section h2 { font-size: 20px; font-weight: 700; color: #0A1628; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #D0D9F0; }
        .cp2-section p { font-size: 14.5px; color: #3D4F72; line-height: 1.85; white-space: pre-line; }
        .cp2-toc { background: #fff; border: 1px solid #D0D9F0; border-radius: 12px; padding: 22px 26px; margin-bottom: 44px; }
        .cp2-toc-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: ${NAVY}; margin-bottom: 12px; }
        .cp2-toc ol { margin: 0; padding-left: 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; }
        .cp2-toc li a { font-size: 13px; color: ${NAVY}; }
        .cp2-toc li a:hover { text-decoration: underline; }
        .cp2-cookie-card { border: 1px solid #D0D9F0; border-radius: 14px; overflow: hidden; margin-bottom: 20px; }
        .cp2-cookie-head { padding: 18px 22px; border-bottom: 1px solid #D0D9F0; display: flex; align-items: flex-start; gap: 14px; }
        .cp2-cookie-body { padding: 0 22px 18px; overflow-x: auto; }
        .cp2-table { width: 100%; border-collapse: collapse; margin-top: 16px; min-width: 440px; }
        .cp2-table th { text-align: left; font-size: 11px; font-weight: 800; color: #8BA3CC; text-transform: uppercase; letter-spacing: 0.08em; padding-bottom: 10px; border-bottom: 2px solid #E8EDF8; }
        .cp2-table td { padding: 10px 16px 10px 0; font-size: 13px; border-bottom: 1px solid #F0FDF4; vertical-align: top; color: #3D4F72; }
        .cp2-table td:last-child { padding-right: 0; white-space: nowrap; color: #8BA3CC; }
        .cp2-table td:first-child { font-family: monospace; font-weight: 700; white-space: nowrap; }
        @media (max-width: 600px) {
          .cp2-content { padding: 32px 16px 60px; }
          .cp2-toc ol { grid-template-columns: 1fr; }
        }
      `}</style>
      <ZapZapChromeStyles />

      <div className="cp2">
        <ZapZapHeader />

        <div className="cp2-content">
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY }}>Legal</span>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, color: "#0A1628", margin: "8px 0 6px", lineHeight: 1.15 }}>Política de Cookies</h1>
            <p style={{ fontSize: 13, color: "#8BA3CC" }}>Última atualização: 1º de junho de 2026</p>
          </div>

          <div style={{ background: "#EEF2FF", border: "1px solid #C7D2F0", borderRadius: 10, padding: "16px 20px", marginBottom: 36 }}>
            <p style={{ fontSize: 13.5, color: NAVY, lineHeight: 1.7, margin: 0 }}>
              <strong>Em resumo:</strong> usamos cookies para funcionamento técnico e análise de audiência anonimizada (Google Analytics com IP anonimizado).
              Não usamos cookies de publicidade comportamental. Você pode gerenciar ou bloquear cookies pelo seu navegador a qualquer momento,
              sem prejudicar o acesso ao conteúdo principal deste portal.
            </p>
          </div>

          <div className="cp2-toc">
            <div className="cp2-toc-label">Índice</div>
            <ol>
              {["O que são cookies?", "Por que utilizamos cookies?", "Base legal (LGPD)", "Tipos de cookies utilizados", "Cookies de terceiros", "Como gerenciar cookies", "Duração dos cookies", "Transferência internacional", "Conformidade com a LGPD", "Atualizações e contato"].map((t, i) => (
                <li key={i}><a href={`#c${i + 1}`}>{i + 1}. {t}</a></li>
              ))}
            </ol>
          </div>

          {/* Sections 1–3 */}
          {SECTIONS.slice(0, 3).map((s) => (
            <section key={s.id} id={s.id} className="cp2-section">
              <h2>{s.title}</h2>
              <p>{renderContent(s.content)}</p>
            </section>
          ))}

          {/* Section 4: Cookie type tables */}
          <section id="c4" className="cp2-section">
            <h2>4. Tipos de cookies utilizados</h2>
            {COOKIE_TYPES.map((ct) => (
              <div key={ct.tipo} className="cp2-cookie-card">
                <div className="cp2-cookie-head" style={{ background: ct.bg, borderColor: ct.border }}>
                  <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{ct.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#0A1628", marginBottom: 4 }}>{ct.tipo}</div>
                    <div style={{ fontSize: 13, color: "#3D4F72", lineHeight: 1.65 }}>{ct.desc}</div>
                  </div>
                </div>
                <div className="cp2-cookie-body">
                  <table className="cp2-table">
                    <thead>
                      <tr><th>Nome</th><th>Finalidade</th><th>Duração</th></tr>
                    </thead>
                    <tbody>
                      {ct.exemplos.map((ex) => (
                        <tr key={ex.nome}>
                          <td style={{ color: ct.color }}>{ex.nome}</td>
                          <td>{ex.finalidade}</td>
                          <td>{ex.duracao}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </section>

          {/* Remaining sections */}
          {SECTIONS.slice(3).map((s) => (
            <section key={s.id} id={s.id} className="cp2-section">
              <h2>{s.title}</h2>
              <p>{renderContent(s.content)}</p>
            </section>
          ))}

          {/* Cross-links */}
          <div style={{ background: "#fff", border: "1px solid #D0D9F0", borderRadius: 12, padding: "18px 24px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "#8BA3CC" }}>Veja também:</span>
            <a href="/privacidade" style={{ fontSize: 14, color: NAVY, fontWeight: 600 }}>→ Política de Privacidade</a>
            <a href="/termos" style={{ fontSize: 14, color: NAVY, fontWeight: 600 }}>→ Termos de Uso</a>
          </div>
        </div>

        <ZapZapFooter />
      </div>
    </>
  );
}
