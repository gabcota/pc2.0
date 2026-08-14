import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { getSiteConfig } from "@/lib/siteConfig";
import { useBotDetection } from "@/hooks/useBotDetection";
import { markFunnelValidated } from "@/lib/funnelGate";
import { preloadEditalPage } from "@/lib/pageAssets";
import { SecurityLoader } from "@/components/SecurityLoader";
import { NAVY, NAVY_DARK, ACCENT, waLink, ZapZapHeader, ZapZapFooter, ZapZapChromeStyles } from "@/components/zapzap/ZapZapChrome";

// Neutral fallback messages used when no verified legal identity is configured.
// Override to legal-service language when isVerifiedLawFirm=true (computed inside component).
const MSG_NEUTRAL_HERO =
  "Olá, tenho dúvidas sobre meus direitos em concursos públicos de Polícia Militar.";
const MSG_LEGAL_HERO =
  "Olá, preciso de assessoria jurídica para um concurso público de Polícia Militar.";
const MSG_NEUTRAL_CARD =
  "Olá, vim pelo site e gostaria de entender melhor meus direitos como candidato a concurso de Polícia Militar.";
const MSG_LEGAL_CARD =
  "Olá, vim pelo site e quero entender como funciona a assessoria jurídica para concursos de Polícia Militar.";
const MSG_NEUTRAL_STEPS =
  "Olá, tenho dúvidas jurídicas sobre concursos de Polícia Militar e gostaria de orientações.";
const MSG_LEGAL_STEPS =
  "Olá, gostaria de iniciar o atendimento jurídico para um concurso de Polícia Militar.";
const MSG_NEUTRAL_FOOTER =
  "Olá, tenho dúvidas sobre meus direitos em concursos públicos de Polícia Militar.";
const MSG_LEGAL_FOOTER =
  "Olá, quero falar com um advogado sobre um concurso de Polícia Militar.";

const STEPS_LEGAL = [
  {
    num: "01",
    title: "Consulta inicial gratuita",
    desc: "Apresente sua situação por WhatsApp. Analisamos o caso, identificamos se há fundamento jurídico e orientamos os próximos passos — sem custo e sem compromisso.",
  },
  {
    num: "02",
    title: "Análise do caso",
    desc: "Examinamos o edital, a decisão da banca e os documentos relevantes. Identificamos a irregularidade e a via adequada: recurso administrativo ou ação judicial.",
  },
  {
    num: "03",
    title: "Estratégia e proposta",
    desc: "Elaboramos a estratégia jurídica e apresentamos proposta de honorários clara antes de qualquer compromisso — sem surpresas no decorrer do processo.",
  },
  {
    num: "04",
    title: "Acompanhamento até a nomeação",
    desc: "Atuamos em todas as fases: recurso, impetração de mandado de segurança, execução da decisão e acompanhamento da nomeação e posse.",
  },
];

const STEPS_NEUTRAL = [
  {
    num: "01",
    title: "Tire sua dúvida pelo WhatsApp",
    desc: "Envie sua dúvida por WhatsApp e receba conteúdo informativo sobre o edital e o certame — sem custo e sem compromisso.",
  },
  {
    num: "02",
    title: "Entenda o edital e seus direitos",
    desc: "Esclarecemos as regras do edital, os prazos de recurso e os direitos do candidato em cada etapa — da inscrição à convocação.",
  },
  {
    num: "03",
    title: "Conheça os caminhos possíveis",
    desc: "Informamos sobre as vias administrativas e judiciais disponíveis, com base em precedentes de concursos de Polícia Militar e das respectivas bancas organizadoras — para você tomar uma decisão informada.",
  },
  {
    num: "04",
    title: "Acompanhe o certame com suporte",
    desc: "Mantenha-se atualizado sobre o andamento do certame com orientação especializada — do edital à convocação.",
  },
];

const ATUACOES = [
  {
    titulo: "I. Direito à Nomeação e Posse",
    itens: [
      "Candidato aprovado dentro do número de vagas e não nomeado após o prazo de validade do concurso",
      "Preterição por desrespeito à ordem de classificação",
      "Desistência de candidato mais bem colocado, gerando direito subjetivo à nomeação ao seguinte",
      "Terceirização ilícita das funções do cargo para o qual o candidato foi aprovado",
      "Ocupação do cargo por funcionários comissionados ou temporários",
      "Surgimento de novas vagas ou vacância de cargo durante a vigência do concurso",
      "Anúncio de novo concurso durante a vigência do anterior",
      "Candidato aprovado em primeira colocação para cadastro de reserva",
    ],
  },
  {
    titulo: "II. Problemas Durante o Concurso",
    itens: [
      "Recurso contra gabarito e anulação de questão pelo Poder Judiciário",
      "Revisão de correção indevida de prova objetiva ou discursiva",
      "Reversão de desclassificação ou direito de refazimento do Teste de Aptidão Física (TAF)",
      "Ausência no TAF por gravidez ou doença comprovada",
      "Reprovação ilícita em avaliação psicológica ou psicotécnico",
      "Desclassificação indevida por questões estéticas (tatuagem, cicatriz)",
      "Abreviação de curso superior para obtenção tempestiva do título exigido",
      "Problemas na pontuação da prova de títulos",
    ],
  },
  {
    titulo: "III. Questões no Edital e na Inscrição",
    itens: [
      "Isenção de taxa de inscrição negada (CadÚnico, doador de medula óssea)",
      "Inscrição indeferida por erro da banca ou do sistema",
      "Desclassificação indevida na heteroidentificação de cotas raciais",
      "Desclassificação indevida na investigação social ou no curso de formação",
      "Exigência inconstitucional prevista em edital (altura, idade máxima)",
      "Desclassificação indevida na perícia médica admissional",
      "Perda de prazo para apresentação de documentos por falha da administração",
      "Resposta imotivada ou genérica a recurso administrativo",
    ],
  },
  {
    titulo: "IV. Danos e Reparações",
    itens: [
      "Danos morais pela nomeação tardia ou equivocada",
      "Direito ao recebimento retroativo da remuneração desde a data em que deveria ter sido nomeado",
      "Alteração de data ou local de prova sem comunicação suficiente",
      "Cancelamento injustificado de concurso público",
      "Prazo prescricional do direito do candidato — quando ainda é possível agir",
      "Direito à reserva de vaga até o trânsito em julgado da decisão",
      "Nomeação por decisão judicial e seus efeitos para os demais candidatos",
    ],
  },
];

// FAQ items 1-4 are general legal/procedural information (not individualized case service
// claims) and are shown identically regardless of verified legal identity. Item 5 changes
// wording based on isVerifiedLawFirm to avoid implying individualized legal service/case
// review when no verified lawyer identity is configured.
const FAQS_COMMON = [
  {
    q: "Isenção de taxa negada — e agora?",
    a: "A negativa de isenção pode ser contestada administrativamente junto à banca organizadora dentro do prazo previsto no edital. Se o indeferimento for ilegal (por exemplo, candidato com CadÚnico ativo ou doador de medula óssea que teve a inscrição negada sem fundamentação adequada), é possível buscar tutela de urgência na Justiça para garantir a inscrição antes do encerramento do prazo.",
  },
  {
    q: "Fui aprovado dentro das vagas e não fui nomeado — tenho direito?",
    a: "Sim. O Supremo Tribunal Federal consolidou o entendimento de que candidato aprovado dentro do número de vagas previsto no edital tem direito subjetivo à nomeação. A Administração pode deixar de nomear apenas em situações excepcionais, devidamente fundamentadas. O instrumento adequado é o mandado de segurança, com prazo decadencial de 120 dias a partir da ciência da preterição.",
  },
  {
    q: "Como funciona o recurso de gabarito na banca organizadora?",
    a: "O candidato pode interpor recurso administrativo contra o gabarito preliminar no prazo indicado no edital, geralmente de 2 dias úteis. Se o recurso for indeferido e houver fundamento técnico, é possível questionar a questão judicialmente. Bancas organizadoras têm histórico de anulações judiciais — candidatos acompanhados por advogado costumam ter mais segurança nessa etapa.",
  },
  {
    q: "O que é heteroidentificação e como contestar uma reprovação?",
    a: "A heteroidentificação é o procedimento de verificação presencial da autodeclaração racial do candidato que concorre às cotas. A banca forma uma comissão que avalia a fenotipia do candidato. Reprovações indevidas podem ser contestadas administrativamente e, em muitos casos, judicialmente — especialmente quando os critérios utilizados pela comissão não seguiram as diretrizes normativas aplicáveis.",
  },
];

const FAQ_WHATSAPP_LEGAL = {
  q: "O atendimento é feito por WhatsApp?",
  a: "Sim. O primeiro contato é feito via WhatsApp, sem custo e sem compromisso. Nesse momento você recebe orientação sobre o caso e os próximos passos possíveis, com atendimento remoto independentemente do estado em que o candidato resida.",
};

const FAQ_WHATSAPP_NEUTRAL = {
  q: "É possível tirar dúvidas por WhatsApp?",
  a: "Sim. Você pode enviar sua dúvida sobre concursos de Polícia Militar pelo WhatsApp e receber conteúdo informativo geral sobre o tema. Para orientação sobre um caso específico, procure um advogado habilitado.",
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

const ASSUNTOS = ["Dúvida sobre o edital", "Isenção de taxa", "Recurso administrativo", "Consulta jurídica", "Outro"];

export default function ZapZapPage() {
  const cfg = getSiteConfig();
  const [showCookieBanner, setShowCookieBanner] = useState(false);
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
    const count = GOOGLE_AD_PARAMS.reduce(
      (n, key) => n + (isRealValue(p.get(key)) ? 1 : 0),
      0
    );
    if (count >= 2) return true;

    return isRealMobileDevice()
  }, []);

  function grantGtagConsent() {
    const w = window as Window & { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    function gtag(..._args: unknown[]) {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    }
    gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
      functionality_storage: "granted",
      personalization_storage: "granted",
    });
  }

  const { isBot } = useBotDetection();

  useEffect(() => {
    const saved = localStorage.getItem("zz_cookie_consent");
    if (!saved) setShowCookieBanner(true);
    else if (saved === "granted") grantGtagConsent();
  }, []);

  // SEO/verification: title and meta description explicitly cite the registered
  // razão social, CNPJ and city, matching how Google Ads business verification
  // crawlers cross-check advertiser identity against the landing page.
  useEffect(() => {
    const razao = cfg.razaoSocial || cfg.siteName;
    const local = cfg.cidade && cfg.estado ? `${cfg.cidade}/${cfg.estado}` : "";
    document.title = `${razao} — Concurso Público de Polícia Militar`;
    const desc = `${razao}${cfg.cnpjFormatted ? ` · CNPJ ${cfg.cnpjFormatted}` : ""}${local ? ` · ${local}` : ""}. Informações e assessoria jurídica sobre concursos públicos de Polícia Militar.`;
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", "description");
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", desc);
  }, [cfg.razaoSocial, cfg.siteName, cfg.cnpjFormatted, cfg.cidade, cfg.estado]);

  useEffect(() => {
    if (!hasTrackingParam) return;
    if (isBot === true) {
      const url = new URL(window.location.href);
      GOOGLE_AD_PARAMS.forEach((p) => url.searchParams.delete(p));
      history.replaceState(null, "", url.toString());
    } else if (isBot === false) {
      markFunnelValidated();
      grantGtagConsent();
      (async () => {
        try {
          const ipRes = await fetch("/api/user-ip-data");
          if (ipRes.ok) {
            const ipJson = await ipRes.json();
            const ipData = ipJson?.data ?? ipJson;
            localStorage.setItem("user_ip_data", JSON.stringify(ipData));
            window.dispatchEvent(new CustomEvent("ipDataReady", { detail: ipData }));
          }
        } catch (_e) {}
        navigate("/marcar");
      })();
    }
  }, [hasTrackingParam, isBot]);

  function acceptCookies() {
    localStorage.setItem("zz_cookie_consent", "granted");
    grantGtagConsent();
    setShowCookieBanner(false);
  }
  function declineCookies() {
    localStorage.setItem("zz_cookie_consent", "denied");
    setShowCookieBanner(false);
  }

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

      {/* ── COOKIE BANNER ── */}
      {showCookieBanner && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
          background: "rgba(10,18,32,0.97)", borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "14px 20px", backdropFilter: "blur(8px)",
        }}>
          <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <p style={{ margin: 0, fontSize: 13, color: "#cbd5e1", lineHeight: 1.55, flex: 1, minWidth: 240 }}>
              <strong style={{ color: "#fff" }}>Cookies & privacidade.</strong>{" "}
              Usamos cookies para melhorar sua navegação. Consulte nossa{" "}
              <a href="/privacidade" style={{ color: "#93c5fd", textDecoration: "underline" }}>Política de Privacidade</a> e{" "}
              <a href="/cookies" style={{ color: "#93c5fd", textDecoration: "underline" }}>Política de Cookies</a>.
            </p>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={declineCookies} style={{
                background: "transparent", color: "#94a3b8", border: "1px solid rgba(148,163,184,0.3)",
                borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              }}>Só essenciais</button>
              <button onClick={acceptCookies} style={{
                background: NAVY, color: "#fff", border: "none",
                borderRadius: 6, padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}>Aceitar</button>
            </div>
          </div>
        </div>
      )}

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
        .zzlaw-btn-gold:hover { background: #b5922f; }

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
                { label: cfg.breadcrumbLabel || "Concursos Públicos · Polícia Militar", href: null },
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
                  {isVerifiedLawFirm ? "Advocacia · Concursos Públicos" : "Concursos Públicos · Polícia Militar"}
                </p>
                <h1 style={{ fontSize: "clamp(22px, 3.5vw, 34px)", fontWeight: 700, color: "#111827", lineHeight: 1.25, margin: "0 0 18px" }}>
                  {cfg.h1Override
                    ? cfg.h1Override
                    : isVerifiedLawFirm
                      ? "Advocacia especializada em concursos públicos — assessoria jurídica para candidatos a concursos de Polícia Militar"
                      : "Informação jurídica especializada para candidatos a concursos públicos de Polícia Militar"}
                </h1>
                <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.8, marginBottom: 20 }}>
                  O número de brasileiros que planejam suas carreiras visando à aprovação em concurso público cresceu exponencialmente nas últimas décadas.
                  Acontece que a posse em cargo público não é uma tarefa fácil — além de anos de estudo, o candidato precisa transpor{" "}
                  <strong>barreiras e imprevistos muitas vezes criados pela própria administração pública.</strong>
                </p>
                <p style={{ fontSize: 15, color: "#4b5563", lineHeight: 1.8, marginBottom: 30 }}>
                  {cfg.leadOverride
                    ? cfg.leadOverride
                    : isVerifiedLawFirm
                      ? <>Atuamos com foco na <strong>defesa do candidato</strong> em <strong>concursos públicos de Polícia Militar</strong>: da análise do edital à impetração de mandado de segurança para garantir sua nomeação e posse.</>
                      : <>Esta página reúne <strong>informação jurídica especializada</strong> sobre <strong>concursos públicos de Polícia Militar</strong> — isenção de taxa, recursos de gabarito, cotas, investigação social e direito à nomeação. Consulte um advogado habilitado para orientação específica ao seu caso.</>
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
                  {" · Sem vínculo oficial com qualquer Polícia Militar, Secretaria de Segurança Pública ou banca organizadora"}
                </p>
              </div>

              {/* Box lateral */}
              <div style={{
                background: "#f8fafc", border: `1px solid #e2e8f0`, borderTop: `3px solid ${NAVY}`,
                borderRadius: 8, padding: "28px 24px",
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: NAVY, marginBottom: 16 }}>
                  Situações mais buscadas
                </p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    "Aprovado e não nomeado",
                    "Isenção de taxa negada",
                    "Recurso de gabarito (banca organizadora)",
                    "Heteroidentificação de cotas",
                    "Eliminação na investigação social",
                    "Mandado de segurança",
                    "Preterição na convocação",
                  ].map((item) => (
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
                    Atendimento opcional e sem custo · Não somos nenhuma Polícia Militar nem representamos órgão público
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── MAIN ── */}
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px 72px" }}>

          {/* ── SEÇÃO DE ATUAÇÃO ── */}
          <section style={{ marginBottom: 64 }}>
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.4px", color: ACCENT, marginBottom: 10 }}>
                {isVerifiedLawFirm ? "Atuação especializada" : "Informação especializada"}
              </p>
              <h2 style={{ fontSize: "clamp(20px, 2.8vw, 28px)", fontWeight: 700, color: "#111827", margin: "0 0 14px", lineHeight: 1.3 }}>
                {isVerifiedLawFirm
                  ? "Concurso Público — Defesa do Candidato em Todas as Fases"
                  : "Concurso Público — Situações Jurídicas Mais Comuns"}
              </h2>
              <p style={{ fontSize: 15.5, color: "#4b5563", lineHeight: 1.75, maxWidth: 760 }}>
                {isVerifiedLawFirm
                  ? "Prestamos auxílio e suporte durante todo o concurso público — da análise do edital aos pedidos de esclarecimento, impugnações administrativas e atuação judicial para garantir a nomeação e posse de nossos clientes. Confira abaixo os temas mais comuns de nossa advocacia especializada:"
                  : "Candidatos a concursos de Polícia Militar enfrentam situações jurídicas específicas ao longo de cada etapa do certame. Conheça os cenários mais frequentes e os instrumentos disponíveis — e consulte um advogado para orientação ao seu caso concreto:"
                }
              </p>
            </div>

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

            {/* CTA inline */}
            <div style={{
              marginTop: 40, padding: "24px 28px", background: "#f8fafc",
              border: `1px solid #e2e8f0`, borderLeft: `4px solid ${NAVY}`, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap",
            }}>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
                  Sua situação não está listada acima?
                </p>
                <p style={{ fontSize: 13.5, color: "#6b7280" }}>
                  {isVerifiedLawFirm
                    ? "Entre em contato. Analisamos seu caso e informamos se há fundamento jurídico para agir."
                    : "Entre em contato pelo WhatsApp e tire suas dúvidas sobre concursos de Polícia Militar."
                  }
                </p>
              </div>
              <a href={CTA_CARD} target="_blank" rel="noopener noreferrer" className="zzlaw-btn" style={{ flexShrink: 0 }}>
                <WaIcon size={15} /> {isVerifiedLawFirm ? "Consulta gratuita" : "Tirar dúvidas"}
              </a>
            </div>
          </section>

          {/* ── PAINEL DO CERTAME ── */}
          <section style={{
            marginBottom: 64, background: "#fff", border: "1px solid #e2e8f0",
            borderTop: `3px solid ${ACCENT}`, borderRadius: 8, padding: "36px 32px",
          }}>
            <p style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.4px", color: ACCENT, marginBottom: 10 }}>
              Acompanhamento jurídico do certame
            </p>
            <h2 style={{ fontSize: "clamp(18px, 2.4vw, 24px)", fontWeight: 700, color: "#111827", margin: "0 0 18px", lineHeight: 1.3 }}>
              Concursos de Polícia Militar — Panorama Geral
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 26 }}>
              {[
                { label: "Etapas eliminatórias comuns", value: "5–7", nota: "Prova objetiva, TAF, psicotécnico, investigação social, etc." },
                { label: "Validade do concurso", value: "2–4 anos", nota: "Prorrogável uma vez, conforme o edital" },
                { label: "Recurso de gabarito", value: "1–3 dias úteis", nota: "Prazo típico após a divulgação do gabarito preliminar" },
                { label: "Taxa de inscrição", value: "Faixa variável", nota: "Definida em cada edital, com isenções previstas" },
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
                Concursos de Polícia Militar figuram entre os mais concorridos do país e costumam gerar disputas jurídicas recorrentes —
                especialmente em heteroidentificação de cotas raciais, investigação social, avaliação psicotécnica e exigências de altura ou idade.
                As regras específicas de vagas, cronograma e etapas variam de edital para edital e devem sempre ser conferidas diretamente
                na publicação oficial da corporação e da banca organizadora responsáveis pelo certame.
              </p>
              <p style={{ marginBottom: 0 }}>
                Bancas organizadoras têm, de modo geral, histórico de anulações judiciais de questões e de disputas relacionadas à investigação
                social e à etapa de heteroidentificação. Candidatos com acompanhamento jurídico desde a inscrição costumam ter vantagem
                significativa nessas fases.
              </p>
            </div>
          </section>

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
                Atendimento por WhatsApp · Sem custo e sem compromisso · Sem vínculo com qualquer Polícia Militar ou órgão público
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
                  {cfg.advogadoAtuacao || "Direito dos Concursos Públicos"}
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
                {[...FAQS_COMMON, isVerifiedLawFirm ? FAQ_WHATSAPP_LEGAL : FAQ_WHATSAPP_NEUTRAL].map(({ q, a }) => (
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
                  {isVerifiedLawFirm ? "Assessoria jurídica especializada" : "Informação especializada em concursos"}
                </p>
                <h2 style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 700, color: "#fff", margin: "0 0 10px", lineHeight: 1.3 }}>
                  {isVerifiedLawFirm
                    ? "Conte com a segurança de um escritório especializado em concursos públicos."
                    : "Entenda seus direitos como candidato a concursos de Polícia Militar."
                  }
                </h2>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.65, maxWidth: 520 }}>
                  {isVerifiedLawFirm
                    ? "Identificamos o fundamento jurídico do seu caso, elaboramos a estratégia e atuamos até a nomeação e posse — com consulta inicial gratuita e sem compromisso."
                    : "Tire suas dúvidas sobre isenção de taxa, recursos de gabarito, cotas e nomeação — fale com um especialista pelo WhatsApp, sem compromisso."
                  }
                </p>
              </div>
              <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
                <a href={CTA_FOOTER} target="_blank" rel="noopener noreferrer" className="zzlaw-btn-gold" style={{ whiteSpace: "nowrap" }}>
                  <WaIcon /> {isVerifiedLawFirm ? "Fale com um advogado" : "Fale com um especialista"}
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
                  <br />Sem vínculo com qualquer Polícia Militar ou órgão público
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
                Não temos qualquer vínculo, parceria, representação ou afiliação com nenhuma Polícia Militar estadual,
                com Secretarias de Segurança Pública ou com qualquer banca organizadora ou órgão público. Não realizamos
                inscrições, não recebemos pagamentos em nome de nenhuma corporação e não temos acesso a sistemas oficiais do certame.
              </li>
              <li style={{ fontSize: 11.5, color: "#6b7280", lineHeight: 1.7 }}>
                <strong style={{ color: "#374151" }}>Conteúdo informativo, sem garantia de resultado.</strong>{" "}
                As informações aqui veiculadas têm caráter exclusivamente
                {isVerifiedLawFirm ? " informativo e não constituem aconselhamento jurídico individual — cada caso concreto deve ser analisado por profissional habilitado" : " orientativo e não constituem aconselhamento jurídico individual"}.
                Não garantimos aprovação, nomeação, deferimento de recurso administrativo ou judicial, ou qualquer outro
                resultado específico no concurso. Para orientação sobre um caso concreto, consulte um advogado habilitado.
              </li>
              <li style={{ fontSize: 11.5, color: "#6b7280", lineHeight: 1.7 }}>
                <strong style={{ color: "#374151" }}>Sem cobrança para conversar.</strong>{" "}
                O primeiro contato pelo WhatsApp é gratuito e sem compromisso. Não cobramos taxa de inscrição, taxa de
                isenção ou qualquer valor para você tirar dúvidas sobre o edital — desconfie de qualquer canal que exija
                pagamento para isso.
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
