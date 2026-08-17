import { getSiteConfig } from "@/lib/siteConfig";
import { ZapZapHeader, ZapZapFooter, ZapZapChromeStyles, NAVY } from "@/components/zapzap/ZapZapChrome";

type Content = string | ((razaoSocial: string, cnpjFormatted: string, email: string, enderecoCompleto: string, isVerifiedLawFirm: boolean) => string);

const SECTIONS: { id: string; title: string; content: Content }[] = [
  {
    id: "identificacao",
    title: "1. Identificação do Controlador e do Serviço",
    content: (razaoSocial, cnpjFormatted, email, enderecoCompleto, isVerifiedLawFirm) =>
      `${razaoSocial}${cnpjFormatted ? ` (CNPJ ${cnpjFormatted})` : ""}, doravante denominada "Controladora", é a responsável pelo tratamento dos dados pessoais coletados neste portal, na qualidade de controladora de dados nos termos da Lei nº 13.709/2018 (LGPD).

O que fazemos: ${isVerifiedLawFirm
  ? "somos uma sociedade de advocacia especializada em Direito Administrativo e Carreira do Servidor Público, prestando conteúdo informativo e assessoria jurídica a servidores públicos."
  : "mantemos este portal com conteúdo informativo sobre direitos e estabilidade na carreira pública, incluindo estágio probatório, processos administrativos e orientações gerais a servidores."} Não temos qualquer vínculo com órgãos públicos, entidades governamentais ou comissões de processo administrativo.

Endereço: ${enderecoCompleto || "Conforme registro nos órgãos competentes."}
E-mail de contato: ${email || "Disponível neste portal."}

Esta Política de Privacidade informa de forma transparente quais dados são coletados, para que são utilizados, com quem são compartilhados e quais são os seus direitos como titular dos dados.`,
  },
  {
    id: "dados",
    title: "2. Dados Pessoais Coletados",
    content: `Coletamos dados pessoais apenas na medida necessária para as finalidades declaradas nesta Política.

2.1. Dados fornecidos voluntariamente pelo usuário
• Nome completo
• Número de telefone / WhatsApp — nosso canal principal de atendimento
• Endereço de e-mail (quando fornecido)
• Informações compartilhadas voluntariamente durante o atendimento via WhatsApp ou formulário de contato

2.2. Dados coletados automaticamente
• Endereço IP (anonimizado antes do armazenamento pelo Google Analytics)
• Tipo e versão de navegador e sistema operacional
• Páginas acessadas e tempo de permanência
• URL de origem (referrer)
• Identificadores de sessão (cookies — veja nossa Política de Cookies em /cookies)

2.3. Dados que NÃO coletamos
Não coletamos dados sensíveis (saúde, origem racial, convicções religiosas, biometria, dados financeiros) sem consentimento específico e destacado, conforme exige o art. 11 da LGPD.`,
  },
  {
    id: "finalidade",
    title: "3. Finalidade e Base Legal do Tratamento",
    content: `O tratamento dos seus dados ocorre estritamente para as finalidades abaixo, fundamentadas nas bases legais previstas no art. 7º da LGPD:

3.1. Prestação dos serviços deste portal (art. 7º, V — execução de contrato ou diligências pré-contratuais)
Utilizamos seus dados para responder solicitações, viabilizar contato e, quando aplicável, formalizar a prestação de serviços jurídicos contratados.

3.2. Atendimento e comunicação via WhatsApp (art. 7º, I — consentimento)
O contato via WhatsApp pressupõe o consentimento do titular, que pode ser revogado a qualquer momento mediante solicitação expressa.

3.3. Melhoria dos serviços e análise de audiência (art. 7º, IX — legítimo interesse)
Dados analíticos anonimizados são utilizados para compreender o desempenho do portal e melhorar a experiência. O IP é anonimizado antes de qualquer armazenamento.

3.4. Cumprimento de obrigações legais (art. 7º, II)
Quando exigido por lei ou autoridade judicial competente, podemos tratar dados para cumprimento de obrigação legal ou regulatória.`,
  },
  {
    id: "cookies",
    title: "4. Cookies e Tecnologias Similares",
    content: `Utilizamos cookies para funcionamento técnico essencial e análise de audiência anonimizada. Não utilizamos cookies de publicidade comportamental ou retargeting.

Para informações detalhadas sobre os tipos de cookies, suas finalidades, duração e como gerenciá-los, consulte nossa Política de Cookies em /cookies.

Você pode gerenciar ou bloquear cookies a qualquer momento pelas configurações do seu navegador, sem perder acesso ao conteúdo principal deste portal.`,
  },
  {
    id: "compartilhamento",
    title: "5. Compartilhamento de Dados",
    content: `Não vendemos, alugamos ou comercializamos seus dados pessoais. O compartilhamento ocorre apenas nas seguintes situações:

5.1. Prestadores de serviço (operadores)
Parceiros tecnológicos que auxiliam na operação do portal (provedores de hospedagem, ferramentas de análise) atuam como operadores de dados e estão contratualmente obrigados a tratar os dados apenas conforme nossas instruções.

5.2. Google Analytics
Utilizamos o Google Analytics com anonimização de IP. Os dados são transmitidos de forma anonimizada e usados exclusivamente para fins estatísticos agregados. O Google LLC atua como operador neste contexto.

5.3. Obrigações legais
Podemos compartilhar dados quando exigido por ordem judicial ou autoridade regulatória competente, dentro dos limites da lei.

5.4. O que NÃO fazemos
• Não compartilhamos dados com órgãos governamentais, exceto por exigência legal.
• Não cedemos dados para fins publicitários de terceiros.
• Não vendemos bases de dados de usuários ou clientes.`,
  },
  {
    id: "direitos",
    title: "6. Seus Direitos como Titular (LGPD — Art. 18)",
    content: `A LGPD garante os seguintes direitos, que podem ser exercidos mediante solicitação ao nosso canal de atendimento:

I — Confirmação da existência de tratamento dos seus dados
II — Acesso aos dados pessoais que tratamos sobre você
III — Correção de dados incompletos, inexatos ou desatualizados
IV — Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos
V — Portabilidade dos dados a outro fornecedor de serviço
VI — Eliminação dos dados tratados com base no seu consentimento
VII — Informação sobre compartilhamento com terceiros
VIII — Informação sobre a possibilidade de não fornecer consentimento e suas consequências
IX — Revogação do consentimento a qualquer momento

Para exercer qualquer destes direitos, entre em contato pelo WhatsApp ou e-mail indicados neste portal. Respondemos em até 15 (quinze) dias úteis.`,
  },
  {
    id: "seguranca",
    title: "7. Segurança dos Dados",
    content: `Adotamos medidas técnicas e organizacionais para proteger seus dados pessoais contra acesso não autorizado, perda, alteração ou divulgação indevida:

• Comunicação via protocolo HTTPS (TLS) em todas as páginas
• Anonimização de dados de navegação via Google Analytics
• Controle de acesso restrito a sistemas internos
• Revisão periódica das políticas de segurança da informação

Em caso de incidente de segurança que possa acarretar risco relevante aos titulares, comunicaremos à ANPD (Autoridade Nacional de Proteção de Dados) e aos afetados no prazo legalmente estabelecido.`,
  },
  {
    id: "retencao",
    title: "8. Retenção dos Dados",
    content: `Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta Política ou para atender a obrigações legais:

• Dados de atendimento e eventuais serviços jurídicos contratados: pelo período da prestação do serviço e por até 5 (cinco) anos após o encerramento, para cumprimento de obrigações legais e defesa em processos.
• Dados de navegação anonimizados (Google Analytics): até 14 meses.
• Registros de consentimento de cookies: 12 meses.
• Comunicações via WhatsApp: pelo período necessário ao atendimento e conforme prazo legal aplicável.

Após o término do prazo, os dados são eliminados ou anonimizados de forma segura.`,
  },
  {
    id: "contato",
    title: "9. Contato e Exercício de Direitos",
    content: (razaoSocial, cnpjFormatted, email) =>
      `Para dúvidas, solicitações de exercício de direitos LGPD ou comunicações relacionadas a esta Política:

Responsável: ${razaoSocial}${cnpjFormatted ? ` · CNPJ ${cnpjFormatted}` : ""}
${email ? `E-mail: ${email}` : ""}
Atendimento via WhatsApp: disponível neste portal (botão de WhatsApp no topo desta página).

Prazo de resposta: até 15 (quinze) dias úteis para solicitações de direitos LGPD; até 5 (cinco) dias úteis para dúvidas gerais.

Esta Política pode ser atualizada periodicamente. A versão vigente é sempre a disponível nesta página, com a data de atualização indicada abaixo do título. Recomendamos verificação regular.`,
  },
];

export default function PrivacidadePage() {
  const cfg = getSiteConfig();
  const isVerifiedLawFirm = !!(cfg.oabNumero && cfg.advogadoNome);

  function renderContent(c: Content): string {
    if (typeof c === "function") {
      return c(cfg.razaoSocial, cfg.cnpjFormatted ?? "", cfg.email ?? "", cfg.enderecoCompleto ?? "", isVerifiedLawFirm);
    }
    return c;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .pp { font-family: 'Inter', system-ui, sans-serif; background: #F4F6FB; color: #0A1628; min-height: 100vh; }
        .pp h1, .pp h2 { margin: 0; }
        .pp p { margin: 0; }
        .pp a { text-decoration: none; }
        .pp-content { max-width: 800px; margin: 0 auto; padding: 48px 24px 80px; }
        .pp-section { margin-bottom: 44px; scroll-margin-top: 80px; }
        .pp-section h2 { font-size: 20px; font-weight: 700; color: #0A1628; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #D0D9F0; }
        .pp-section p { font-size: 14.5px; color: #3D4F72; line-height: 1.85; white-space: pre-line; }
        .pp-toc { background: #fff; border: 1px solid #D0D9F0; border-radius: 12px; padding: 22px 26px; margin-bottom: 44px; }
        .pp-toc-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: ${NAVY}; margin-bottom: 12px; }
        .pp-toc ol { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; }
        .pp-toc li a { font-size: 13.5px; color: ${NAVY}; }
        .pp-toc li a:hover { text-decoration: underline; }
        @media (max-width: 600px) { .pp-content { padding: 32px 16px 60px; } }
      `}</style>
      <ZapZapChromeStyles />

      <div className="pp">
        <ZapZapHeader />

        <div className="pp-content">
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: NAVY }}>Legal</span>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, color: "#0A1628", margin: "8px 0 6px", lineHeight: 1.15 }}>Política de Privacidade</h1>
            <p style={{ fontSize: 13, color: "#8BA3CC" }}>Última atualização: 1º de junho de 2026</p>
          </div>

          <div style={{ background: "#EEF2FF", border: "1px solid #C7D2F0", borderRadius: 10, padding: "16px 20px", marginBottom: 36 }}>
            <p style={{ fontSize: 13.5, color: NAVY, lineHeight: 1.7, margin: 0 }}>
              <strong>Em resumo:</strong> coletamos apenas os dados necessários para atender sua solicitação (principalmente nome e WhatsApp para contato). Não vendemos dados, não usamos publicidade comportamental e você pode exercer seus direitos LGPD a qualquer momento pelo nosso WhatsApp ou e-mail.
            </p>
          </div>

          <div className="pp-toc">
            <div className="pp-toc-label">Índice</div>
            <ol>
              {SECTIONS.map((s) => (
                <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>
              ))}
            </ol>
          </div>

          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className="pp-section">
              <h2>{s.title}</h2>
              <p>{renderContent(s.content)}</p>
            </section>
          ))}

          <div style={{ background: "#fff", border: "1px solid #D0D9F0", borderRadius: 12, padding: "18px 24px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "#8BA3CC" }}>Veja também:</span>
            <a href="/termos" style={{ fontSize: 14, color: NAVY, fontWeight: 600 }}>→ Termos de Uso</a>
            <a href="/cookies" style={{ fontSize: 14, color: NAVY, fontWeight: 600 }}>→ Política de Cookies</a>
          </div>
        </div>

        <ZapZapFooter />
      </div>
    </>
  );
}
