import { getSiteConfig } from "@/lib/siteConfig";
import { ZapZapHeader, ZapZapFooter, ZapZapChromeStyles, NAVY } from "@/components/zapzap/ZapZapChrome";

type Content = string | ((razaoSocial: string, cnpjFormatted: string, email: string, enderecoCompleto: string, advogadoNome: string, isVerifiedLawFirm: boolean) => string);

const SECTIONS: { id: string; title: string; content: Content }[] = [
  {
    id: "objeto",
    title: "1. Objeto e Aceitação",
    content: (razaoSocial, cnpjFormatted, _email, _endereco, _advogado, isVerifiedLawFirm) =>
      `Estes Termos de Uso regem o acesso e a utilização deste portal, mantido por ${razaoSocial}${cnpjFormatted ? ` (CNPJ ${cnpjFormatted})` : ""}.

${isVerifiedLawFirm
  ? "Somos uma sociedade de advocacia especializada em Direito Previdenciário e concursos públicos, devidamente inscrita na OAB. Este portal presta conteúdo informativo sobre o concurso público do INSS 2026 e viabiliza o contato de candidatos interessados em assessoria jurídica."
  : "Este portal presta conteúdo informativo sobre o concurso público do INSS 2026, incluindo editais, prazos, cargos e orientações gerais aos candidatos. Não somos um órgão governamental, banca organizadora ou entidade pública."}

Ao acessar este portal ou iniciar contato via WhatsApp, o Usuário declara ter lido, compreendido e aceito integralmente estes Termos de Uso. Caso não concorde, o Usuário deve abster-se de utilizar os serviços.

Reservamo-nos o direito de alterar estes Termos a qualquer momento, comunicando alterações por este portal. O uso continuado após a publicação implica aceitação das novas condições.`,
  },
  {
    id: "definicoes",
    title: "2. Definições",
    content: `Para os fins destes Termos:

"Portal": este website e seus recursos digitais associados.
"Usuário" ou "Candidato": pessoa física que acessa o portal ou utiliza os canais de contato disponibilizados.
"Conteúdo": textos, materiais informativos e orientações sobre o concurso público do INSS 2026 disponibilizados neste portal.
"Atendimento": comunicação via WhatsApp, e-mail ou telefone disponibilizados neste portal.`,
  },
  {
    id: "servicos",
    title: "3. Descrição dos Serviços",
    content: (_razaoSocial, _cnpj, _email, _endereco, _advogado, isVerifiedLawFirm) =>
      `Este portal disponibiliza aos candidatos ao concurso público do INSS 2026:

3.1. Conteúdo informativo — notícias, prazos, cargos, requisitos e demais dados públicos sobre o certame, com base em fontes oficiais.

3.2. Canal de contato — formulário e WhatsApp para que o candidato esclareça dúvidas ou solicite atendimento.

${isVerifiedLawFirm
  ? "3.3. Assessoria jurídica — mediante contratação específica, prestamos serviços advocatícios relacionados a direitos do candidato no certame, tais como questionamento de editais, recursos administrativos e defesa em processos correlatos, sempre nos termos do contrato de honorários firmado com o cliente.\n\nImportante: o conteúdo informativo deste portal não constitui, por si só, prestação de serviço advocatício nem substitui consulta jurídica individual."
  : "3.3. Nenhum conteúdo deste portal constitui aconselhamento jurídico individual, garantia de aprovação ou informação privilegiada sobre o concurso. Para orientação específica ao seu caso, procure um advogado devidamente inscrito na OAB."}`,
  },
  {
    id: "responsabilidades",
    title: "4. Responsabilidades das Partes",
    content: `4.1. Nossas responsabilidades
• Manter as informações do portal atualizadas e alinhadas às fontes oficiais do certame, sempre que possível.
• Manter sigilo sobre os dados fornecidos pelo Usuário, nos termos da Política de Privacidade.
• Apresentar com clareza o escopo de qualquer serviço contratado e seus honorários, antes de qualquer compromisso financeiro.

4.2. Responsabilidades do Usuário
• Fornecer informações verdadeiras e completas ao entrar em contato.
• Consultar sempre o edital oficial e os canais oficiais do concurso antes de tomar decisões definitivas.
• Compreender que a aprovação em concurso público depende do esforço próprio, da concorrência e de fatores externos a este portal.`,
  },
  {
    id: "honorarios",
    title: "5. Honorários, Pagamento e Direito de Arrependimento",
    content: `5.1. Transparência
Caso qualquer serviço pago seja contratado, os honorários são apresentados ao Usuário antes de qualquer compromisso financeiro, em contrato específico. Não existem cobranças ocultas nem assinaturas recorrentes sem consentimento expresso.

5.2. Início dos serviços contratados
O início da prestação de qualquer serviço pago está condicionado à confirmação do pagamento e à assinatura do respectivo contrato de honorários.

5.3. Direito de arrependimento (art. 49 do Código de Defesa do Consumidor — Lei nº 8.078/1990)
Para contratações realizadas fora do estabelecimento comercial (inclusive por WhatsApp ou internet), o Usuário tem direito de desistir no prazo de 7 (sete) dias corridos a partir da contratação, sem qualquer penalidade ou justificativa, bastando comunicar a desistência pelo mesmo canal de atendimento.

5.4. Reembolso
Em caso de exercício do direito de arrependimento no prazo legal, o reembolso integral será processado em até 10 dias úteis após a comunicação da desistência.`,
  },
  {
    id: "propriedade",
    title: "6. Propriedade Intelectual",
    content: `Todo o conteúdo disponibilizado neste portal — incluindo textos, logotipos, layouts e materiais informativos — é de titularidade dos responsáveis pelo portal ou de seus licenciantes, protegido pela Lei nº 9.610/1998 (Lei de Direitos Autorais).

É vedado ao Usuário reproduzir, distribuir, modificar, publicar ou explorar comercialmente qualquer conteúdo deste portal sem autorização prévia e expressa.

O uso indevido de conteúdo protegido sujeita o infrator às sanções civis e criminais previstas na legislação brasileira.`,
  },
  {
    id: "limitacao",
    title: "7. Limitação de Responsabilidade",
    content: `7.1. Este portal não garante aprovação em qualquer concurso público. A aprovação depende do esforço do candidato, da concorrência, da banca organizadora e de outros fatores externos ao escopo deste portal.

7.2. Não temos acesso a informações privilegiadas sobre bancas, gabaritos, resultados ou editais antes de sua publicação oficial no Diário Oficial da União.

7.3. Não nos responsabilizamos por decisões administrativas de órgãos públicos, alterações em editais, cancelamentos ou adiamentos de concursos — fatores inteiramente externos ao nosso escopo de atuação.

7.4. Em nenhuma hipótese nossa responsabilidade excederá o valor efetivamente pago pelo Usuário por serviços eventualmente contratados.`,
  },
  {
    id: "rescisao",
    title: "8. Vigência, Suspensão e Rescisão",
    content: `8.1. Estes Termos vigoram por prazo indeterminado enquanto o Usuário fizer uso do portal ou dos serviços.

8.2. Podemos suspender ou encerrar o atendimento a qualquer Usuário que: forneça informações falsas; utilize os serviços de forma abusiva ou contrária à boa-fé; descumpra qualquer disposição destes Termos.

8.3. O Usuário pode encerrar sua relação conosco a qualquer momento, comunicando sua decisão pelo canal de atendimento, observadas as condições de reembolso descritas na seção 5.

8.4. A rescisão não afeta direitos e obrigações já constituídos antes de sua ocorrência.`,
  },
  {
    id: "foro",
    title: "9. Lei Aplicável e Foro",
    content: (razaoSocial, _cnpj, _email, enderecoCompleto) =>
      `Estes Termos são regidos pelas leis da República Federativa do Brasil. As partes elegem o foro da comarca do domicílio de ${razaoSocial}${enderecoCompleto ? ` (${enderecoCompleto})` : ""} para dirimir quaisquer controvérsias, com renúncia expressa a qualquer outro, por mais privilegiado que seja, salvo disposição legal em contrário.

Para dúvidas ou solicitações relacionadas a estes Termos, entre em contato pelo WhatsApp ou e-mail indicados neste portal.`,
  },
];

export default function TermosPage() {
  const cfg = getSiteConfig();
  const isVerifiedLawFirm = !!(cfg.oabNumero && cfg.advogadoNome);

  function renderContent(c: Content): string {
    if (typeof c === "function") {
      return c(cfg.razaoSocial, cfg.cnpjFormatted ?? "", cfg.email ?? "", cfg.enderecoCompleto ?? "", cfg.advogadoNome ?? "", isVerifiedLawFirm);
    }
    return c;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .tp { font-family: 'Inter', system-ui, sans-serif; background: #F4F6FB; color: #0A1628; min-height: 100vh; }
        .tp h1, .tp h2 { margin: 0; }
        .tp p { margin: 0; }
        .tp a { text-decoration: none; }
        .tp-content { max-width: 800px; margin: 0 auto; padding: 48px 24px 80px; }
        .tp-section { margin-bottom: 44px; scroll-margin-top: 80px; }
        .tp-section h2 { font-size: 20px; font-weight: 700; color: #0A1628; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #dbe3f0; }
        .tp-section p { font-size: 14.5px; color: #3D4F72; line-height: 1.85; white-space: pre-line; }
        .tp-toc { background: #fff; border: 1px solid #dbe3f0; border-radius: 12px; padding: 22px 26px; margin-bottom: 44px; }
        .tp-toc-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: ${NAVY}; margin-bottom: 12px; }
        .tp-toc ol { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; }
        .tp-toc li a { font-size: 13.5px; color: ${NAVY}; }
        .tp-toc li a:hover { text-decoration: underline; }
        .tp-highlight { background: rgba(200,164,74,0.1); border: 1px solid rgba(200,164,74,0.35); border-radius: 10px; padding: 14px 18px; margin-top: 14px; }
        .tp-highlight p { font-size: 13.5px; color: #8a6d1f; line-height: 1.65; }
        @media (max-width: 600px) { .tp-content { padding: 32px 16px 60px; } }
      `}</style>
      <ZapZapChromeStyles />

      <div className="tp">
        <ZapZapHeader />

        <div className="tp-content">
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY }}>Legal</span>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, color: "#0A1628", margin: "8px 0 6px", lineHeight: 1.15 }}>Termos de Uso</h1>
            <p style={{ fontSize: 13, color: "#8BA3CC" }}>Última atualização: 1º de junho de 2026</p>
          </div>

          <div style={{ background: "rgba(26,46,74,0.05)", border: `1px solid rgba(26,46,74,0.15)`, borderRadius: 10, padding: "16px 20px", marginBottom: 36 }}>
            <p style={{ fontSize: 13.5, color: NAVY, lineHeight: 1.7, margin: 0 }}>
              <strong>Em resumo:</strong> este portal traz conteúdo informativo sobre o concurso público do INSS 2026
              {isVerifiedLawFirm ? " e viabiliza contato com assessoria jurídica especializada." : "."} Não garantimos aprovação em concursos — isso depende de você.
              Prezamos pela transparência total: eventuais honorários são apresentados antes de qualquer pagamento, não há cobranças ocultas e você tem direito de arrependimento de 7 dias conforme o CDC.
            </p>
          </div>

          <div className="tp-toc">
            <div className="tp-toc-label">Índice</div>
            <ol>
              {SECTIONS.map((s) => (
                <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>
              ))}
            </ol>
          </div>

          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="tp-section">
              <h2>{s.title}</h2>
              <p>{renderContent(s.content)}</p>
              {s.id === "honorarios" && (
                <div className="tp-highlight">
                  <p>
                    <strong>Sem cobranças automáticas:</strong> nenhuma cobrança é realizada sem sua confirmação explícita.
                    Todos os valores são apresentados antes do pagamento. Você tem 7 dias para se arrepender sem custo algum (art. 49 do CDC).
                  </p>
                </div>
              )}
            </section>
          ))}

          <div style={{ background: "#fff", border: "1px solid #dbe3f0", borderRadius: 12, padding: "18px 24px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "#8BA3CC" }}>Veja também:</span>
            <a href="/privacidade" style={{ fontSize: 14, color: NAVY, fontWeight: 600 }}>→ Política de Privacidade</a>
            <a href="/cookies" style={{ fontSize: 14, color: NAVY, fontWeight: 600 }}>→ Política de Cookies</a>
          </div>
        </div>

        <ZapZapFooter />
      </div>
    </>
  );
}
