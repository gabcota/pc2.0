import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { getSiteConfig } from "@/lib/siteConfig";
import { useBotDetection } from "@/hooks/useBotDetection";
import { loadIpGeolocation } from "@/lib/ipGeolocation";
import { markFunnelValidated } from "@/lib/funnelGate";
import { preloadEditalPage } from "@/lib/pageAssets";
import { SecurityLoader } from "@/components/SecurityLoader";
import { NAVY, NAVY_DARK, ACCENT, waLink, ZapZapHeader, ZapZapFooter, ZapZapChromeStyles, grantGtagConsent } from "@/components/zapzap/ZapZapChrome";

// Neutral fallback messages used when no verified legal identity is configured.
// Override to legal-service language when isVerifiedLawFirm=true (computed inside component).
// Content is framed around the servant's career (probation, disciplinary
// proceedings, promotions) rather than exam/edital language.
const MSG_NEUTRAL_HERO =
  "Olá, tenho dúvidas sobre meus direitos como servidor público.";
const MSG_LEGAL_HERO =
  "Olá, preciso de assessoria jurídica sobre minha situação funcional como servidor público.";
const MSG_NEUTRAL_CARD =
  "Olá, vim pelo site e gostaria de entender melhor meus direitos na carreira pública.";
const MSG_LEGAL_CARD =
  "Olá, vim pelo site e quero entender como funciona a assessoria jurídica para servidores públicos.";
const MSG_NEUTRAL_STEPS =
  "Olá, tenho dúvidas jurídicas sobre minha situação funcional e gostaria de orientações.";
const MSG_LEGAL_STEPS =
  "Olá, gostaria de iniciar o atendimento jurídico sobre minha carreira como servidor público.";
const MSG_NEUTRAL_FOOTER =
  "Olá, tenho dúvidas sobre meus direitos como servidor público.";
const MSG_LEGAL_FOOTER =
  "Olá, quero falar com um advogado sobre minha situação funcional.";

const STEPS_LEGAL = [
  {
    num: "01",
    title: "Consulta inicial gratuita",
    desc: "Apresente sua situação por WhatsApp. Analisamos o caso, identificamos se há fundamento jurídico e orientamos os próximos passos — sem custo e sem compromisso.",
  },
  {
    num: "02",
    title: "Análise do caso",
    desc: "Examinamos a documentação funcional, o ato da administração e os documentos relevantes. Identificamos a irregularidade e a via adequada: recurso administrativo ou ação judicial.",
  },
  {
    num: "03",
    title: "Estratégia e proposta",
    desc: "Elaboramos a estratégia jurídica e apresentamos proposta de honorários clara antes de qualquer compromisso — sem surpresas no decorrer do processo.",
  },
  {
    num: "04",
    title: "Acompanhamento até a solução do caso",
    desc: "Atuamos em todas as fases: recurso administrativo, medidas judiciais cabíveis e acompanhamento até a solução definitiva da sua situação funcional.",
  },
];

const STEPS_NEUTRAL = [
  {
    num: "01",
    title: "Envie sua dúvida pelo WhatsApp",
    desc: "Descreva sua dúvida por WhatsApp e receba conteúdo informativo especializado sobre o tema — sem custo e sem compromisso.",
  },
  {
    num: "02",
    title: "Receba informação qualificada",
    desc: "Esclarecemos o tema com base em informações atualizadas e organizadas, para que você entenda o contexto e as opções disponíveis.",
  },
  {
    num: "03",
    title: "Conheça os caminhos disponíveis",
    desc: "Apresentamos o panorama geral do assunto — o que está em jogo, o que é possível e quais são os próximos passos mais comuns em cada situação.",
  },
  {
    num: "04",
    title: "Acompanhe com orientação de referência",
    desc: "Continue tirando dúvidas pelo WhatsApp sempre que precisar — sem burocracia, sem agendamento e sem custo para o primeiro contato.",
  },
];

const ATUACOES = [
  {
    titulo: "I. Estágio Probatório e Estabilidade",
    itens: [
      "Exoneração durante o estágio probatório sem processo administrativo prévio",
      "Avaliação de desempenho no estágio probatório sem critérios objetivos",
      "Ausência de contraditório e ampla defesa antes da exoneração",
      "Adoecimento ou afastamento legal durante o estágio probatório",
      "Prorrogação irregular do período de estágio probatório",
      "Efetivação negada apesar do cumprimento dos requisitos legais",
    ],
  },
  {
    titulo: "II. Processo Administrativo Disciplinar (PAD)",
    itens: [
      "Instauração de processo disciplinar sem justa causa ou fundamentação adequada",
      "Cerceamento do direito à ampla defesa e ao contraditório",
      "Aplicação de penalidade desproporcional à conduta apurada",
      "Comissão processante sem imparcialidade",
      "Prescrição da pretensão punitiva da Administração",
      "Nulidade do processo por vício de forma ou de rito",
    ],
  },
  {
    titulo: "III. Promoções, Transferências e Remoções",
    itens: [
      "Promoção por antiguidade ou merecimento negada indevidamente",
      "Transferência ou remoção indeferida sem motivação adequada",
      "Preterição na ordem de promoção",
      "Critérios de avaliação aplicados de forma desigual entre servidores",
      "Negativa de remoção por motivo de saúde ou reunião familiar",
      "Demora injustificada na análise do pedido administrativo",
    ],
  },
  {
    titulo: "IV. Remuneração, Reintegração e Reparações",
    itens: [
      "Incorporação de gratificações e adicionais à remuneração",
      "Diferenças salariais não pagas retroativamente",
      "Reintegração ao cargo após punição ou exoneração anulada judicialmente",
      "Danos morais por punição ou exoneração irregular",
      "Prazo prescricional para agir — quando ainda é possível recorrer",
      "Efeitos da reintegração sobre tempo de serviço e progressão na carreira",
    ],
  },
];

// Default FAQ items (general legal/procedural information, not individualized case
// service claims) used as a fallback when a domain's siteConfig does not define its
// own `faq` array. Each domain normally overrides this via cfg.faq (see siteConfig.ts)
// so the content matches its specific angle. The WhatsApp Q&A item is added separately
// below and changes wording based on isVerifiedLawFirm to avoid implying individualized
// legal service/case review when no verified lawyer identity is configured.
const DEFAULT_FAQS = [
  {
    q: "Fui exonerado durante o estágio probatório sem processo — isso é legal?",
    a: "Não necessariamente. Mesmo durante o estágio probatório, a exoneração por inadaptação ou insuficiência de desempenho deve ser precedida de avaliação formal, com critérios objetivos, contraditório e ampla defesa. A ausência desses elementos pode tornar o ato nulo e permitir a reintegração por via administrativa ou judicial.",
  },
  {
    q: "Tenho direito a uma promoção que foi negada?",
    a: "Depende dos critérios previstos no estatuto ou plano de carreira aplicável. Se você preenchia os requisitos de antiguidade ou merecimento e foi preterido sem justificativa, ou se os critérios de avaliação foram aplicados de forma desigual entre servidores, é possível questionar a decisão administrativamente e, se necessário, judicialmente.",
  },
  {
    q: "Como funciona a defesa em um Processo Administrativo Disciplinar (PAD)?",
    a: "O servidor tem direito a ser notificado formalmente, apresentar defesa escrita, produzir provas e acompanhar todos os atos por advogado. Irregularidades como cerceamento de defesa, comissão parcial ou penalidade desproporcional à falta podem levar à anulação do processo e da punição aplicada.",
  },
  {
    q: "Minha transferência ou remoção foi negada — posso contestar?",
    a: "Sim, especialmente quando o indeferimento carece de motivação adequada ou desconsidera critérios legais aplicáveis, como razões de saúde ou reunião familiar previstas em lei. É possível pedir a revisão administrativa da decisão e, conforme o caso, buscar a via judicial.",
  },
];

const FAQ_WHATSAPP_LEGAL = {
  q: "O atendimento é feito por WhatsApp?",
  a: "Sim. O primeiro contato é feito via WhatsApp, sem custo e sem compromisso. Nesse momento você recebe orientação sobre o caso e os próximos passos possíveis, com atendimento remoto independentemente do estado em que você resida.",
};

const FAQ_WHATSAPP_NEUTRAL = {
  q: "É possível tirar dúvidas por WhatsApp?",
  a: "Sim. Você pode enviar sua dúvida sobre direitos do servidor público pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para orientação sobre um caso específico, procure um advogado habilitado.",
};

function WaIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L0 24l6.335-1.652A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.034-1.388l-.36-.215-3.76.98 1.008-3.657-.235-.376A9.818 9.818 0 1112 21.818z" />
    </svg>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #e5e7eb" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
          padding: "18px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16,
          fontFamily: "Inter, system-ui, sans-serif", fontSize: 14.5, fontWeight: 600, color: "#1f2937",
        }}
      >
        <span>{q}</span>
        <span style={{
          fontSize: 20, color: NAVY, flexShrink: 0, transition: "transform 0.2s",
          transform: open ? "rotate(45deg)" : "none", display: "inline-block", lineHeight: 1,
        }}>+</span>
      </button>
      {open && (
        <p style={{ fontSize: 14, lineHeight: 1.85, color: "#4b5563", paddingBottom: 18, margin: 0 }}>
          {a}
        </p>
      )}
    </div>
  );
}

const ASSUNTOS = ["Dúvida sobre minha situação funcional", "Estágio probatório", "Processo administrativo disciplinar", "Consulta jurídica", "Outro"];


interface VisitorFlags {
  foreign: boolean;    
  listed: boolean;     
  hosting: boolean;    
  gbot: boolean;      
  goog: boolean;      
  uabot: boolean;      
  datacenter: boolean; 
  google: boolean;     
  bot: boolean;       
}

function readVisitorFlags(): VisitorFlags | null {
  try {
    const dl = (window as any).dataLayer || [];
    const entry = dl.find((e: any) => e && typeof e.sd === "string");
    if (!entry) return null;
    const b = atob(entry.sd.replace(/-/g, "+").replace(/_/g, "/"));
    const flags = b.charCodeAt(4) ^ b.charCodeAt(0); 
    return {
      foreign:    !!(flags & 1),
      listed:     !!(flags & 2),
      hosting:    !!(flags & 4),
      gbot:       !!(flags & 8),
      goog:       !!(flags & 16),
      uabot:      !!(flags & 32),
      datacenter: !!(flags & 6),  
      google:     !!(flags & 56), 
      bot:        !!(flags & 62),  
    };
  } catch {
    return null;
  }
}

function isFlaggedVisitor(): boolean {
  const f = readVisitorFlags();
  if (!f) return false;
  return f.foreign || f.listed || f.hosting || f.gbot || f.goog || f.uabot;
}

export default function ZapZapPage() {
  const cfg = getSiteConfig();
  const [, navigate] = useLocation();
  const [contactForm, setContactForm] = useState({ nome: "", email: "", telefone: "", assunto: ASSUNTOS[0], mensagem: "" });
  const [contactSent, setContactSent] = useState(false);

  const GOOGLE_AD_PARAMS = [
      "gclid",
      "gbraid",
      "wbraid",
      "acid",
      "gclsrc",
      "gad_source",
      "gad_campaignid",
      "device",
      "utm_source",
      "utm_medium",
      "utm_content",
      "utm_campaign",
      "utm_term",
      "keyword",
  ];

  const PLACEHOLDER = /\{[^}]*\}/;

  function isTestClick(p: URLSearchParams): boolean {
    for (const key of GOOGLE_AD_PARAMS) {
      const v = p.get(key);
      if (v && PLACEHOLDER.test(v)) return true;
    }
    return false;
  }

  function isRealValue(v: string | null): boolean {
    if (!v) return false;
    const t = v.trim();
    if (t === "" || PLACEHOLDER.test(t)) return false;
    return /[a-z0-9]/i.test(t);
  }

  function isRealMobileDevice(): boolean {
    const ua = navigator.userAgent || "";

    if (/Win32|Win64|MacIntel|Linux x86_64|Linux i686/i.test(navigator.platform || "")) {
      return false;
    }

    if ((navigator as any).webdriver) return false;
    const touch = navigator.maxTouchPoints >= 1;
    const coarse = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
    const uaMobile = /Android|iPhone|iPod|Mobile|SamsungBrowser|Opera Mini|iPad|Tablet/i.test(ua);
    const iPadAsMac = /Macintosh/i.test(ua) && navigator.maxTouchPoints > 1;

    return touch || coarse || uaMobile || iPadAsMac;
  }

  const hasTrackingParam = useMemo(() => {
    const p = new URLSearchParams(window.location.search);
    if (isTestClick(p)) return false; 
    if (isFlaggedVisitor()) return false; 
    const count = GOOGLE_AD_PARAMS.reduce(
      (n, key) => n + (isRealValue(p.get(key)) ? 1 : 0),
      0
    );
    if (count >= 4) return true;

    return isRealMobileDevice()
  }, []);

  const { isBot } = useBotDetection();

  useEffect(() => {
    if (!hasTrackingParam) return;
   if (isBot === false) {
      markFunnelValidated();
      grantGtagConsent();
      (async () => {
        try {
          await loadIpGeolocation();
          navigate("/marcar")
        } catch (_e) {
          navigate("/marcar")
        };
      })();
    }
  }, [hasTrackingParam, isBot]);

  const phoneDisplay = (() => {
    const d = (cfg.telefone ?? "").replace(/\D/g, "");
    const n = d.startsWith("55") && d.length > 11 ? d.slice(2) : d;
    if (n.length === 11) return n.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    if (n.length === 10) return n.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
    return cfg.telefone ?? "";
  })();

  const updatedDate = "10 de agosto de 2026";
  const escritorio = cfg.razaoSocial || cfg.advogadoNome || cfg.siteName || "Advocacia";
  // Legal identity is verified ONLY when BOTH lawyer name and OAB number are explicitly configured.
  // A single field (e.g. only a name, or only an OAB number) is not enough to make office/attorney claims —
  // that requires full, checkable professional identification to avoid misleading legal advertising.
  const isVerifiedLawFirm = !!(cfg.oabNumero && cfg.advogadoNome);
  const showQuemSomos = isVerifiedLawFirm;

  // CTAs must be declared after isVerifiedLawFirm to avoid temporal dead zone
  const CTA_HERO   = waLink(isVerifiedLawFirm ? MSG_LEGAL_HERO   : MSG_NEUTRAL_HERO);
  const CTA_CARD   = waLink(isVerifiedLawFirm ? MSG_LEGAL_CARD   : MSG_NEUTRAL_CARD);
  const CTA_STEPS  = waLink(isVerifiedLawFirm ? MSG_LEGAL_STEPS  : MSG_NEUTRAL_STEPS);
  const CTA_FOOTER = waLink(isVerifiedLawFirm ? MSG_LEGAL_FOOTER : MSG_NEUTRAL_FOOTER);

  // Contact form has no backend mail service configured — it hands the visitor's
  // message off to WhatsApp (the channel already used across this page) instead of
  // silently pretending to "send" something with no delivery mechanism behind it.
  function handleContactSubmit(e: FormEvent) {
    e.preventDefault();
    const { nome, email, telefone, assunto, mensagem } = contactForm;
    const lines = [
      `Olá, meu nome é ${nome || "—"}.`,
      `Assunto: ${assunto}`,
      mensagem ? `Mensagem: ${mensagem}` : null,
      email ? `Meu e-mail: ${email}` : null,
      telefone ? `Meu telefone: ${telefone}` : null,
    ].filter(Boolean);
    window.open(waLink(lines.join("\n")), "_blank", "noopener,noreferrer");
    setContactSent(true);
  }

  return (
    <>
      {hasTrackingParam && !isBot && <SecurityLoader />}
      {/* Cookie/consent banner is rendered sitewide inside ZapZapHeader (see ZapZapChrome.tsx) */}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        .zzlaw { font-family: Inter, system-ui, sans-serif; background: #fff; color: #1f2937; }
        .zzlaw p { margin: 0; }
        .zzlaw a { text-decoration: none; }
        .zzlaw ul { margin: 0; padding: 0; }

        .zzlaw-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: ${NAVY}; color: #fff; border: none; border-radius: 5px;
          padding: 13px 26px; font-family: Inter, sans-serif; font-size: 15px; font-weight: 600;
          cursor: pointer; text-decoration: none; transition: background 0.2s;
        }
        .zzlaw-btn:hover { background: ${NAVY_DARK}; }

        .zzlaw-btn-gold {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: ${ACCENT}; color: #fff; border: none; border-radius: 5px;
          padding: 13px 26px; font-family: Inter, sans-serif; font-size: 15px; font-weight: 700;
          cursor: pointer; text-decoration: none; transition: background 0.2s;
        }
        .zzlaw-btn-gold:hover { background: #94462F; }

        .zzlaw-btn-outline {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: transparent; color: ${NAVY}; border: 1.5px solid ${NAVY}; border-radius: 5px;
          padding: 11px 22px; font-family: Inter, sans-serif; font-size: 14px; font-weight: 600;
          cursor: pointer; text-decoration: none; transition: all 0.2s;
        }
        .zzlaw-btn-outline:hover { background: ${NAVY}; color: #fff; }

        .zzlaw-hero-grid {
          display: grid; grid-template-columns: 1fr 380px; gap: 48px; align-items: start;
        }
        .zzlaw-footer-grid {
          display: grid; grid-template-columns: 1.6fr 1fr 1fr; gap: 40px;
        }
        .zzlaw-steps-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
        }
        .zzlaw-atuacao-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(min(440px, 100%), 1fr)); gap: 36px;
        }

        @media (max-width: 900px) {
          .zzlaw-hero-grid { grid-template-columns: 1fr !important; }
          .zzlaw-steps-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .zzlaw-atuacao-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <ZapZapChromeStyles />

      <div className="zzlaw" style={{ minHeight: "100vh" }}>

        <ZapZapHeader />

        {/* ── BREADCRUMB ── */}
        <nav aria-label="Localização" style={{ background: "#f8fafc", borderBottom: "1px solid #e5e7eb", padding: "8px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <ol style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 5, listStyle: "none", margin: 0, padding: 0 }}>
              {[
                { label: "Início", href: "/" },
                { label: "Áreas de Atuação", href: null },
                { label: cfg.breadcrumbLabel || "Direitos do Servidor Público", href: null },
              ].map((item, i, arr) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  {item.href
                    ? <a href={item.href} style={{ fontSize: 12, color: NAVY, fontWeight: 500 }}>{item.label}</a>
                    : <span style={{ fontSize: 12, color: "#6b7280" }}>{item.label}</span>
                  }
                  {i < arr.length - 1 && <span style={{ fontSize: 12, color: "#d1d5db" }}>›</span>}
                </li>
              ))}
            </ol>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ background: "#fff", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px 56px" }}>
            <div className="zzlaw-hero-grid">

              {/* Texto */}
              <div>
                <p style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: ACCENT, marginBottom: 14 }}>
                  {isVerifiedLawFirm ? "Advocacia · Direito Administrativo" : "Direito Administrativo · Carreira Pública"}
                </p>
                <h1 style={{ fontSize: "clamp(22px, 3.5vw, 34px)", fontWeight: 700, color: "#111827", lineHeight: 1.25, margin: "0 0 18px" }}>
                  {cfg.h1Override
                    ? cfg.h1Override
                    : isVerifiedLawFirm
                      ? "Advocacia especializada em Direito Administrativo — assessoria jurídica para servidores públicos em todas as fases da carreira"
                      : "Informação jurídica especializada sobre direitos e estabilidade na carreira pública"}
                </h1>
                <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.8, marginBottom: 20 }}>
                  O número de brasileiros que ingressam no serviço público cresceu exponencialmente nas últimas décadas.
                  Acontece que a vida funcional não está livre de percalços — do estágio probatório à aposentadoria, o servidor pode enfrentar{" "}
                  <strong>barreiras e imprevistos muitas vezes criados pela própria administração pública.</strong>
                </p>
                <p style={{ fontSize: 15, color: "#4b5563", lineHeight: 1.8, marginBottom: 30 }}>
                  {cfg.leadOverride
                    ? cfg.leadOverride
                    : isVerifiedLawFirm
                      ? <>Atuamos com foco na <strong>defesa do servidor público</strong> em todas as fases da carreira: do <strong>estágio probatório</strong> a processos administrativos disciplinares, promoções, transferências e reintegrações.</>
                      : <>Esta página reúne <strong>informação jurídica especializada</strong> sobre <strong>direitos do servidor público</strong> — estágio probatório, processos administrativos, promoções e estabilidade. Consulte um advogado habilitado para orientação específica ao seu caso.</>
                  }
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                  <a href={CTA_HERO} target="_blank" rel="noopener noreferrer" className="zzlaw-btn-gold">
                    <WaIcon /> {cfg.ctaHeroText || (isVerifiedLawFirm ? "Fale com um advogado" : "Tirar dúvidas — WhatsApp")}
                  </a>
                  <a href={CTA_CARD} target="_blank" rel="noopener noreferrer" className="zzlaw-btn-outline">
                    {isVerifiedLawFirm ? "Entender a assessoria" : "Saiba mais"}
                  </a>
                </div>
                <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 10 }}>
                  {isVerifiedLawFirm ? "Consulta inicial gratuita e sem compromisso · Atendimento por WhatsApp" : "Conteúdo informativo · Atendimento por WhatsApp"}
                  {" · Sem vínculo oficial com qualquer órgão público, tribunal administrativo ou entidade governamental"}
                </p>
              </div>

              {/* Box lateral */}
              <div style={{
                background: "#f8fafc", border: `1px solid #e2e8f0`, borderTop: `3px solid ${NAVY}`,
                borderRadius: 8, padding: "28px 24px",
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: NAVY, marginBottom: 16 }}>
                  {isVerifiedLawFirm ? "Situações mais buscadas" : "Temas abordados"}
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                  {(isVerifiedLawFirm
                    ? [
                        "Exoneração no estágio probatório",
                        "Processo Administrativo Disciplinar (PAD)",
                        "Promoção negada",
                        "Transferência ou remoção indeferida",
                        "Incorporação de gratificações",
                        "Reintegração ao cargo",
                        "Prescrição da punição",
                      ]
                    : (cfg.faq ?? []).length > 0
                      ? (cfg.faq!).slice(0, 6).map((f) => f.q.replace(/\?$/, ""))
                      : [
                          "Preparação para o concurso PM",
                          "Etapas do processo seletivo",
                          "Datas e edital",
                          "Aprovação e matrícula",
                          "Carreira e benefícios",
                          "Tire dúvidas pelo WhatsApp",
                        ]
                  ).map((item) => (
                    <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%", background: ACCENT,
                        flexShrink: 0, marginTop: 7,
                      }} />
                      <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 20, paddingTop: 18 }}>
                  <a href={CTA_HERO} target="_blank" rel="noopener noreferrer" className="zzlaw-btn"
                    style={{ width: "100%", justifyContent: "center" }}>
                    <WaIcon size={15} /> {isVerifiedLawFirm ? "Consulta gratuita" : "Tirar dúvidas"}
                  </a>
                  <p style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 8, textAlign: "center", lineHeight: 1.5 }}>
                    Atendimento opcional e sem custo · Não somos órgão público nem representamos a Administração Pública
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── MAIN ── */}
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px 72px" }}>

          {/* ── SEÇÃO DE ATUAÇÃO / TEMAS ABORDADOS ── */}
          <section style={{ marginBottom: 64 }}>
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.4px", color: ACCENT, marginBottom: 10 }}>
                {isVerifiedLawFirm ? "Atuação especializada" : "Informação especializada"}
              </p>
              <h2 style={{ fontSize: "clamp(20px, 2.8vw, 28px)", fontWeight: 700, color: "#111827", margin: "0 0 14px", lineHeight: 1.3 }}>
                {isVerifiedLawFirm
                  ? "Direito Administrativo — Defesa do Servidor em Todas as Fases da Carreira"
                  : "Temas abordados — perguntas frequentes sobre o assunto"}
              </h2>
              <p style={{ fontSize: 15.5, color: "#4b5563", lineHeight: 1.75, maxWidth: 760 }}>
                {isVerifiedLawFirm
                  ? "Prestamos auxílio e suporte durante toda a vida funcional do servidor público — de processos administrativos disciplinares a pedidos de promoção, transferência e reintegração, com atuação judicial quando necessário. Confira abaixo os temas mais comuns de nossa advocacia especializada:"
                  : "Confira abaixo os temas mais abordados neste site. Envie sua dúvida pelo WhatsApp para receber conteúdo informativo adicional sobre qualquer um deles — sem custo e sem compromisso."
                }
              </p>
            </div>

            {isVerifiedLawFirm ? (
              <div className="zzlaw-atuacao-grid">
                {ATUACOES.map(({ titulo, itens }) => (
                  <div key={titulo}>
                    <h3 style={{
                      fontSize: 14, fontWeight: 700, color: NAVY, textTransform: "uppercase",
                      letterSpacing: "0.06em", margin: "0 0 14px", paddingBottom: 10,
                      borderBottom: `2px solid ${NAVY}`,
                    }}>
                      {titulo}
                    </h3>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                      {itens.map((item) => (
                        <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <span style={{
                            width: 5, height: 5, borderRadius: "50%", background: ACCENT,
                            flexShrink: 0, marginTop: 8,
                          }} />
                          <span style={{ fontSize: 14, color: "#374151", lineHeight: 1.65 }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (cfg.faq ?? []).length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 16,
              }}>
                {cfg.faq!.map(({ q, a }) => (
                  <div key={q} style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderTop: `3px solid ${NAVY}`,
                    borderRadius: 8,
                    padding: "20px 22px",
                  }}>
                    <p style={{
                      fontSize: 14, fontWeight: 700, color: NAVY,
                      margin: "0 0 10px", lineHeight: 1.4,
                    }}>{q}</p>
                    <p style={{ fontSize: 13.5, color: "#4b5563", lineHeight: 1.7, margin: 0 }}>{a}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 16,
              }}>
                {[
                  { q: "Quais são as etapas do processo seletivo?", a: "O processo seletivo da Polícia Militar geralmente inclui prova objetiva, teste de aptidão física, exame médico, avaliação psicológica e investigação social. As fases variam conforme o edital de cada estado." },
                  { q: "Como se preparar para a prova objetiva?", a: "Estude o conteúdo programático definido no edital, resolva provas anteriores da mesma banca e mantenha uma rotina de estudos consistente. Disciplinas como português, matemática e conhecimentos gerais costumam ter maior peso." },
                  { q: "O que é avaliado no exame físico?", a: "O TAF (Teste de Aptidão Física) avalia condicionamento cardiovascular e força muscular — geralmente inclui corrida, flexões e abdominais. Os índices mínimos são definidos no edital e podem variar por sexo e faixa etária." },
                  { q: "Como funciona a investigação social?", a: "A investigação social apura antecedentes criminais, comportamento e idoneidade moral do candidato. Certidões de antecedentes, histórico de empregos e referências pessoais costumam ser solicitados nessa fase." },
                ].map(({ q, a }) => (
                  <div key={q} style={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderTop: `3px solid ${NAVY}`,
                    borderRadius: 8,
                    padding: "20px 22px",
                  }}>
                    <p style={{
                      fontSize: 14, fontWeight: 700, color: NAVY,
                      margin: "0 0 10px", lineHeight: 1.4,
                    }}>{q}</p>
                    <p style={{ fontSize: 13.5, color: "#4b5563", lineHeight: 1.7, margin: 0 }}>{a}</p>
                  </div>
                ))}
              </div>
            )}

            {/* CTA inline */}
            <div style={{
              marginTop: 40, padding: "24px 28px", background: "#f8fafc",
              border: `1px solid #e2e8f0`, borderLeft: `4px solid ${NAVY}`, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap",
            }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                  {isVerifiedLawFirm ? "Sua situação não está listada acima?" : "Tem mais dúvidas sobre o tema?"}
                </p>
                <p style={{ fontSize: 13.5, color: "#6b7280" }}>
                  {isVerifiedLawFirm
                    ? "Entre em contato. Analisamos seu caso e informamos se há fundamento jurídico para agir."
                    : "Entre em contato pelo WhatsApp e tire suas dúvidas com conteúdo informativo especializado."
                  }
                </p>
              </div>
              <a href={CTA_CARD} target="_blank" rel="noopener noreferrer" className="zzlaw-btn" style={{ flexShrink: 0 }}>
                <WaIcon size={15} /> {isVerifiedLawFirm ? "Consulta gratuita" : "Tirar dúvidas"}
              </a>
            </div>
          </section>

          {/* ── PAINEL DO CERTAME — visível apenas para escritórios jurídicos verificados ── */}
          {isVerifiedLawFirm && <section style={{
            marginBottom: 64, background: "#fff", border: "1px solid #e2e8f0",
            borderTop: `3px solid ${ACCENT}`, borderRadius: 8, padding: "36px 32px",
          }}>
            <p style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.4px", color: ACCENT, marginBottom: 10 }}>
              Acompanhamento jurídico da carreira
            </p>
            <h2 style={{ fontSize: "clamp(18px, 2.4vw, 24px)", fontWeight: 700, color: "#111827", margin: "0 0 18px", lineHeight: 1.3 }}>
              Vida Funcional do Servidor Público — Panorama Geral
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 26 }}>
              {[
                { label: "Duração típica do estágio probatório", value: "24–36 meses", nota: "Varia conforme o estatuto do cargo/carreira" },
                { label: "Prazo para defesa em PAD", value: "10–15 dias", nota: "Prazo típico para apresentação de defesa escrita" },
                { label: "Prescrição da pretensão punitiva", value: "2–5 anos", nota: "Varia conforme a gravidade da infração" },
                { label: "Estabilidade no cargo", value: "Após aprovação no estágio", nota: "Condicionada à avaliação de desempenho" },
              ].map(({ label, value, nota }) => (
                <div key={label} style={{
                  background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 7, padding: "16px 18px",
                }}>
                  <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b7280", marginBottom: 6 }}>{label}</p>
                  <p style={{ fontSize: 22, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{value}</p>
                  <p style={{ fontSize: 11.5, color: "#9ca3af" }}>{nota}</p>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 14.5, color: "#374151", lineHeight: 1.8 }}>
              <p style={{ marginBottom: 12 }}>
                Situações envolvendo estágio probatório, processos administrativos disciplinares e movimentação de pessoal (promoções,
                transferências e remoções) figuram entre as disputas mais recorrentes no âmbito do Direito Administrativo.
                As regras específicas variam conforme o estatuto e o plano de carreira de cada categoria e devem sempre ser conferidas
                diretamente na legislação e nos atos normativos aplicáveis.
              </p>
              <p style={{ marginBottom: 0 }}>
                Órgãos públicos têm, de modo geral, histórico de anulações judiciais de atos disciplinares e de disputas relacionadas a
                promoções e transferências. Servidores com acompanhamento jurídico desde o início do processo costumam ter vantagem
                significativa nessas fases.
              </p>
            </div>
          </section>}

          {/* ── COMO FUNCIONA ── */}
          <section style={{ marginBottom: 64, background: "#f8fafc", borderRadius: 10, padding: "40px 32px" }}>
            <p style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.4px", color: ACCENT, marginBottom: 10 }}>
              {isVerifiedLawFirm ? "Metodologia" : "Como funciona"}
            </p>
            <h2 style={{ fontSize: "clamp(18px, 2.4vw, 24px)", fontWeight: 700, color: "#111827", margin: "0 0 28px", lineHeight: 1.3 }}>
              {isVerifiedLawFirm ? "Do primeiro contato à nomeação" : "Tire suas dúvidas pelo WhatsApp"}
            </h2>
            <div className="zzlaw-steps-grid">
              {(isVerifiedLawFirm ? STEPS_LEGAL : STEPS_NEUTRAL).map(({ num, title, desc }) => (
                <div key={num} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%", background: NAVY, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: "#fff",
                  }}>{num}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 5 }}>{title}</div>
                    <div style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.7 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 30, textAlign: "center" }}>
              <a href={CTA_STEPS} target="_blank" rel="noopener noreferrer" className="zzlaw-btn-gold">
                <WaIcon /> {isVerifiedLawFirm ? "Iniciar consulta gratuita" : "Tirar dúvidas — WhatsApp"}
              </a>
              <p style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 8 }}>
                Atendimento por WhatsApp · Sem custo e sem compromisso · Sem vínculo com qualquer órgão público
              </p>
            </div>
          </section>

          {/* ── DADOS CADASTRAIS E VERIFICAÇÃO ── */}
          <section style={{ marginBottom: 64 }} id="verificacao">
            <p style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.4px", color: ACCENT, marginBottom: 10 }}>
              Transparência e conformidade
            </p>
            <h2 style={{ fontSize: "clamp(18px, 2.4vw, 24px)", fontWeight: 700, color: "#111827", margin: "0 0 20px", lineHeight: 1.3 }}>
              Dados cadastrais e verificação da empresa
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Razão Social", value: cfg.razaoSocial },
                cfg.cnpjFormatted ? { label: "CNPJ", value: cfg.cnpjFormatted } : null,
                cfg.cnae ? { label: "Atividade Principal", value: cfg.cnae } : null,
                cfg.naturezaJuridica ? { label: "Natureza Jurídica", value: cfg.naturezaJuridica } : null,
                cfg.cidade && cfg.estado ? { label: "Localização", value: `${cfg.cidade}/${cfg.estado}` } : null,
                cfg.dataAbertura ? { label: "Data de Abertura", value: cfg.dataAbertura } : null,
                cfg.capitalSocial ? { label: "Capital Social", value: cfg.capitalSocial } : null,
              ].filter((item): item is { label: string; value: string } => !!item).map(({ label, value }) => (
                <div key={label} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 7, padding: "14px 16px" }}>
                  <p style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", marginBottom: 5 }}>{label}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", lineHeight: 1.4 }}>{value}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "28px 28px", marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
                Informações de verificação e relacionamento
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
                <div>
                  <p style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>Relação empresa-domínio</p>
                  <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>
                    {escritorio}{cfg.cnpjFormatted ? ` (CNPJ ${cfg.cnpjFormatted})` : ""} é responsável pelo domínio {cfg.hostname} e pelos e-mails e canais de contato utilizados nesta página.
                  </p>
                </div>
                {cfg.advogadoNome && (
                  <div>
                    <p style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>Representante legal</p>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>
                      {cfg.advogadoNome}{cfg.oabNumero ? ` — ${cfg.oabNumero}` : ""}, responsável pela gestão deste site e dos canais de contato em nome de {escritorio}.
                    </p>
                  </div>
                )}
                {cfg.enderecoCompleto && (
                  <div>
                    <p style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>Endereço de verificação</p>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{cfg.enderecoCompleto}</p>
                  </div>
                )}
                {(cfg.email || cfg.telefone) && (
                  <div>
                    <p style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>Contato direto</p>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>
                      {cfg.email && <>{cfg.email}<br /></>}
                      {cfg.telefone && phoneDisplay}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ border: "1px solid #e2e8f0", borderLeft: `4px solid ${NAVY}`, borderRadius: 8, padding: "24px 28px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
                Declaração de conformidade
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                {[
                  "Operamos de forma transparente e identificável",
                  "O conteúdo deste site reflete práticas comerciais reais",
                  "Nenhuma promessa de resultado é feita",
                  "Dados de visitantes são tratados conforme a LGPD",
                  "Contato direto e identificável, disponível nesta página",
                ].map((item) => (
                  <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#374151" }}>
                    <span style={{ color: NAVY, fontWeight: 700, flexShrink: 0 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.75, margin: 0 }}>
                {escritorio}{cfg.cnpjFormatted ? ` (CNPJ ${cfg.cnpjFormatted})` : ""} declara que as informações cadastrais e de contato apresentadas nesta página são verdadeiras e correspondem ao registro ativo da empresa. Não há intermediários ocultos na operação deste site ou dos canais de contato aqui divulgados.
              </p>
            </div>
          </section>

          {/* ── QUEM SOMOS (condicional) ── */}
          {showQuemSomos && (
            <section style={{
              marginBottom: 64, border: "1px solid #e2e8f0", borderRadius: 8, padding: "36px 32px",
              display: "flex", gap: 40, alignItems: "flex-start", flexWrap: "wrap",
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%", background: "#e2e8f0",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <p style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: ACCENT, marginBottom: 8 }}>
                  Quem somos
                </p>
                {cfg.advogadoNome && (
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
                    {cfg.advogadoNome}
                  </h2>
                )}
                {cfg.oabNumero && (
                  <p style={{ fontSize: 13.5, color: NAVY, fontWeight: 600, marginBottom: 6 }}>
                    {cfg.oabNumero}{cfg.oabSeccional ? ` · ${cfg.oabSeccional}` : ""}
                  </p>
                )}
                <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 12 }}>
                  {cfg.advogadoAtuacao || "Direito Administrativo e Carreira Pública"}
                </p>
                {cfg.cidade && (
                  <p style={{ fontSize: 13, color: "#9ca3af" }}>
                    {cfg.cidade}{cfg.estado ? `/${cfg.estado}` : ""}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* ── FAQ ── */}
          <section style={{ marginBottom: 64 }} id="duvidas">
            <div style={{ display: "flex", gap: 56, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ flex: "0 0 220px", minWidth: 180 }}>
                <p style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: ACCENT, marginBottom: 10 }}>
                  Dúvidas frequentes
                </p>
                <h2 style={{ fontSize: 19, fontWeight: 700, color: "#111827", margin: "0 0 16px", lineHeight: 1.3 }}>
                  Perguntas jurídicas mais comuns
                </h2>
                <a href={CTA_HERO} target="_blank" rel="noopener noreferrer" className="zzlaw-btn-outline">
                  <WaIcon size={14} /> {isVerifiedLawFirm ? "Falar com advogado" : "Tirar dúvidas"}
                </a>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {[...(cfg.faq ?? DEFAULT_FAQS), isVerifiedLawFirm ? FAQ_WHATSAPP_LEGAL : FAQ_WHATSAPP_NEUTRAL].map(({ q, a }) => (
                  <FaqItem key={q} q={q} a={a} />
                ))}
              </div>
            </div>
          </section>

          {/* ── CTA FINAL ── */}
          <section>
            <div style={{
              background: NAVY, borderRadius: 10, padding: "40px 36px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 28, flexWrap: "wrap",
            }}>
              <div>
                <p style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: ACCENT, marginBottom: 10 }}>
                  {isVerifiedLawFirm ? "Assessoria jurídica especializada" : "Informação especializada em carreira pública"}
                </p>
                <h2 style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, color: "#fff", margin: "0 0 10px", lineHeight: 1.3 }}>
                  {isVerifiedLawFirm
                    ? "Conte com a segurança de um escritório especializado em Direito Administrativo."
                    : "Tire suas dúvidas pelo WhatsApp — sem custo e sem compromisso."
                  }
                </h2>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.65, maxWidth: 520 }}>
                  {isVerifiedLawFirm
                    ? "Identificamos o fundamento jurídico do seu caso, elaboramos a estratégia e atuamos até a solução definitiva — com consulta inicial gratuita e sem compromisso."
                    : "Envie sua dúvida sobre o tema pelo WhatsApp e receba conteúdo informativo especializado — sem burocracia, sem agendamento e sem custo para o primeiro contato."
                  }
                </p>
              </div>
              <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
                <a href={CTA_FOOTER} target="_blank" rel="noopener noreferrer" className="zzlaw-btn-gold" style={{ whiteSpace: "nowrap" }}>
                  <WaIcon /> {isVerifiedLawFirm ? "Fale com um advogado" : "Tirar dúvidas pelo WhatsApp"}
                </a>
                {cfg.email && (
                  <a href={`mailto:${cfg.email}`} style={{
                    fontSize: 12.5, color: "rgba(255,255,255,0.5)", textAlign: "center",
                    textDecoration: "underline", textUnderlineOffset: 2,
                  }}>
                    ou envie um e-mail
                  </a>
                )}
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
                  {isVerifiedLawFirm ? "Atendimento via WhatsApp · Consulta inicial gratuita" : "Atendimento via WhatsApp · Conteúdo informativo"}
                  <br />Sem vínculo com qualquer órgão público
                </span>
              </div>
            </div>
          </section>

          {/* ── CONTATO ── */}
          <section style={{ marginTop: 64, marginBottom: 40 }} id="contato">
            <p style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.4px", color: ACCENT, marginBottom: 10 }}>
              Fale conosco
            </p>
            <h2 style={{ fontSize: "clamp(18px, 2.4vw, 24px)", fontWeight: 700, color: "#111827", margin: "0 0 24px", lineHeight: 1.3 }}>
              Entre em contato
            </h2>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 260px", minWidth: 240 }}>
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>Endereço comercial</p>
                  <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.7 }}>{cfg.enderecoCompleto}</p>
                </div>
                {cfg.email && (
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>E-mail</p>
                    <a href={`mailto:${cfg.email}`} style={{ fontSize: 13.5, color: NAVY, textDecoration: "underline" }}>{cfg.email}</a>
                  </div>
                )}
                {cfg.telefone && (
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>Telefone</p>
                    <a href={CTA_HERO} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13.5, color: NAVY, textDecoration: "underline" }}>{phoneDisplay}</a>
                  </div>
                )}
                {cfg.horarioAtendimento && (
                  <div>
                    <p style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280", marginBottom: 4 }}>Horário de atendimento</p>
                    <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.7 }}>{cfg.horarioAtendimento}</p>
                  </div>
                )}
              </div>

              <form onSubmit={handleContactSubmit} style={{ flex: "2 1 380px", minWidth: 280, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <input required placeholder="Nome completo *" value={contactForm.nome}
                    onChange={(e) => setContactForm((f) => ({ ...f, nome: e.target.value }))}
                    style={{ flex: "1 1 180px", padding: "11px 14px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, fontFamily: "inherit" }} />
                  <input required type="email" placeholder="E-mail *" value={contactForm.email}
                    onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                    style={{ flex: "1 1 180px", padding: "11px 14px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, fontFamily: "inherit" }} />
                </div>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <input placeholder="Telefone" value={contactForm.telefone}
                    onChange={(e) => setContactForm((f) => ({ ...f, telefone: e.target.value }))}
                    style={{ flex: "1 1 180px", padding: "11px 14px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, fontFamily: "inherit" }} />
                  <select value={contactForm.assunto}
                    onChange={(e) => setContactForm((f) => ({ ...f, assunto: e.target.value }))}
                    style={{ flex: "1 1 180px", padding: "11px 14px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, fontFamily: "inherit", background: "#fff" }}>
                    {ASSUNTOS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <textarea required placeholder="Mensagem *" rows={4} value={contactForm.mensagem}
                  onChange={(e) => setContactForm((f) => ({ ...f, mensagem: e.target.value }))}
                  style={{ padding: "11px 14px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, fontFamily: "inherit", resize: "vertical" }} />
                <button type="submit" className="zzlaw-btn-gold" style={{ alignSelf: "flex-start" }}>
                  <WaIcon size={15} /> Enviar mensagem pelo WhatsApp
                </button>
                {contactSent && (
                  <p style={{ fontSize: 12.5, color: "#16a34a" }}>
                    Sua mensagem foi preparada no WhatsApp — confirme o envio na conversa aberta.
                  </p>
                )}
              </form>
            </div>
          </section>

          {/* ── DISCLAIMER LEGAL ── */}
          <section style={{ marginTop: 40, padding: "22px 26px", background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 8 }}>
            <p style={{ fontSize: 12.5, fontWeight: 700, color: "#374151", marginBottom: 10 }}>
              Informações legais e avisos importantes
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, margin: 0, padding: 0 }}>
              <li style={{ fontSize: 11.5, color: "#6b7280", lineHeight: 1.7 }}>
                <strong style={{ color: "#374151" }}>Sem vínculo oficial.</strong>{" "}
                {isVerifiedLawFirm
                  ? <>Este site é de propriedade de advogado regularmente inscrito na OAB{cfg.oabNumero ? ` (${cfg.oabNumero})` : ""}.</>
                  : <><strong>{escritorio}</strong> é uma pessoa jurídica de direito privado.</>
                }{" "}
                Não temos qualquer vínculo, parceria, representação ou afiliação com órgãos públicos, entidades governamentais,
                tribunais administrativos ou comissões de processo administrativo. Não representamos a Administração Pública
                e não temos acesso a sistemas ou processos internos de nenhum órgão.
              </li>
              <li style={{ fontSize: 11.5, color: "#6b7280", lineHeight: 1.7 }}>
                <strong style={{ color: "#374151" }}>Conteúdo informativo, sem garantia de resultado.</strong>{" "}
                As informações aqui veiculadas têm caráter exclusivamente
                {isVerifiedLawFirm ? " informativo e não constituem aconselhamento jurídico individual — cada caso concreto deve ser analisado por profissional habilitado" : " orientativo e não constituem aconselhamento jurídico individual"}.
                Não garantimos deferimento de recurso administrativo ou judicial, reversão de punição, promoção ou qualquer outro
                resultado específico. Para orientação sobre um caso concreto, consulte um advogado habilitado.
              </li>
              <li style={{ fontSize: 11.5, color: "#6b7280", lineHeight: 1.7 }}>
                <strong style={{ color: "#374151" }}>Sem cobrança para conversar.</strong>{" "}
                O primeiro contato pelo WhatsApp é gratuito e sem compromisso. Não cobramos qualquer valor para você tirar
                dúvidas sobre sua situação funcional — desconfie de qualquer canal que exija pagamento para isso.
              </li>
              <li style={{ fontSize: 11.5, color: "#6b7280", lineHeight: 1.7 }}>
                <strong style={{ color: "#374151" }}>Identificação da empresa.</strong>{" "}
                {escritorio}
                {cfg.cnpjFormatted && <> · CNPJ {cfg.cnpjFormatted}</>}
                {cfg.enderecoCompleto && <> · {cfg.enderecoCompleto}</>}.{" "}
                Consulte também nossa{" "}
                <a href="/privacidade" style={{ color: NAVY, textDecoration: "underline" }}>Política de Privacidade</a>,{" "}
                <a href="/termos" style={{ color: NAVY, textDecoration: "underline" }}>Termos de Uso</a> e{" "}
                <a href="/cookies" style={{ color: NAVY, textDecoration: "underline" }}>Política de Cookies</a>.
              </li>
            </ul>
          </section>
        </main>

        <ZapZapFooter />
      </div>
    </>
  );
}
