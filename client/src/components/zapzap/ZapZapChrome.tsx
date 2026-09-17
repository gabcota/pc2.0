import { useEffect, useState } from "react";
import { getSiteConfig } from "@/lib/siteConfig";

// Shared header/footer used across ZapZapPage and its legal pages (/privacidade,
// /termos, /cookies) so the site presents one consistent identity everywhere.
// Keep this in sync with ZapZapPage — it is the single source of truth for the
// header/footer; do not fork a second copy in another file.

export const NAVY = "#183D32";
export const NAVY_DARK = "#102A22";
export const ACCENT = "#B85C3E"; // terracotta accent — institutional and welcoming

const UF_NOMES: Record<string, string> = {
  AC: "Acre", AL: "Alagoas", AP: "Amapá", AM: "Amazonas", BA: "Bahia", CE: "Ceará",
  DF: "Distrito Federal", ES: "Espírito Santo", GO: "Goiás", MA: "Maranhão",
  MT: "Mato Grosso", MS: "Mato Grosso do Sul", MG: "Minas Gerais", PA: "Pará",
  PB: "Paraíba", PR: "Paraná", PE: "Pernambuco", PI: "Piauí", RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte", RS: "Rio Grande do Sul", RO: "Rondônia", RR: "Roraima",
  SC: "Santa Catarina", SP: "São Paulo", SE: "Sergipe", TO: "Tocantins",
};

export function estadoNomeCompleto(uf?: string): string {
  if (!uf) return "";
  return UF_NOMES[uf.toUpperCase()] ?? uf;
}

export function waLink(msg: string): string {
  const raw = getSiteConfig()?.telefone ?? "";
  const digits = raw.replace(/\D/g, "");
  const number = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

export function WaIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.845L0 24l6.335-1.652A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.034-1.388l-.36-.215-3.76.98 1.008-3.657-.235-.376A9.818 9.818 0 1112 21.818z" />
    </svg>
  );
}

const COOKIE_CONSENT_KEY = "zz_cookie_consent";

/**
 * Pushes a Consent Mode v2 "update" to grant storage/ads consent. Complements
 * the "default" (denied) signal set server-side in domainTracking.ts before
 * gtm.js loads — this only ever moves consent from denied to granted, never
 * the reverse, matching Google's Consent Mode v2 contract.
 */
export function grantGtagConsent(): void {
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

export function hasCookieConsentDecision(): boolean {
  return !!localStorage.getItem(COOKIE_CONSENT_KEY);
}

/**
 * Sitewide cookie/consent banner — rendered once via ZapZapHeader so every
 * page sharing the chrome (home + /privacidade, /termos, /sobre, /cookies)
 * shows the same consent choice, instead of only the homepage having one.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!saved) setVisible(true);
    else if (saved === "granted") grantGtagConsent();
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "granted");
    grantGtagConsent();
    setVisible(false);
  }
  function declineNonEssential() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "denied");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: "rgba(10,18,32,0.97)", borderTop: "1px solid rgba(255,255,255,0.07)",
      padding: "14px 20px", backdropFilter: "blur(8px)", fontFamily: "Inter, system-ui, sans-serif",
    }}>
      <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <p style={{ margin: 0, fontSize: 13, color: "#cbd5e1", lineHeight: 1.55, flex: 1, minWidth: 240 }}>
          <strong style={{ color: "#fff" }}>Cookies & privacidade.</strong>{" "}
          Usamos cookies para melhorar sua navegação e medir a eficácia de nossas campanhas. Consulte nossa{" "}
          <a href="/privacidade" style={{ color: "#F0B5A1", textDecoration: "underline" }}>Política de Privacidade</a> e{" "}
          <a href="/cookies" style={{ color: "#F0B5A1", textDecoration: "underline" }}>Política de Cookies</a>.
        </p>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={declineNonEssential} style={{
            background: "transparent", color: "#94a3b8", border: "1px solid rgba(148,163,184,0.3)",
            borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
          }}>Só essenciais</button>
          <button onClick={accept} style={{
            background: NAVY, color: "#fff", border: "none",
            borderRadius: 6, padding: "8px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
          }}>Aceitar</button>
        </div>
      </div>
    </div>
  );
}

export function useZapZapChrome() {
  const cfg = getSiteConfig();

  const phoneDisplay = (() => {
    const d = (cfg.telefone ?? "").replace(/\D/g, "");
    const n = d.startsWith("55") && d.length > 11 ? d.slice(2) : d;
    if (n.length === 11) return n.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    if (n.length === 10) return n.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
    return cfg.telefone ?? "";
  })();

  const escritorio = cfg.razaoSocial || cfg.advogadoNome || cfg.siteName || "Advocacia";
  // Legal identity is verified ONLY when BOTH lawyer name and OAB number are explicitly
  // configured — see siteConfig.ts. A single field is not enough to make office/attorney
  // claims, to avoid misleading legal advertising.
  const isVerifiedLawFirm = !!(cfg.oabNumero && cfg.advogadoNome);

  const CTA_HERO = waLink(
    isVerifiedLawFirm
      ? "Olá, preciso de assessoria jurídica sobre minha situação funcional como servidor público."
      : "Olá, tenho dúvidas sobre meus direitos como servidor público."
  );
  const CTA_FOOTER = waLink(
    isVerifiedLawFirm
      ? "Olá, quero falar com um advogado sobre minha situação funcional."
      : "Olá, tenho dúvidas sobre meus direitos como servidor público."
  );

  return { cfg, phoneDisplay, escritorio, isVerifiedLawFirm, CTA_HERO, CTA_FOOTER };
}

// CSS needed by ZapZapHeader/ZapZapFooter. Inject once per page via <ZapZapChromeStyles />.
export function ZapZapChromeStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      .zzlaw-btn-gold {
        display: inline-flex; align-items: center; justify-content: center; gap: 8px;
        background: ${ACCENT}; color: #fff; border: none; border-radius: 5px;
        padding: 13px 26px; font-family: Inter, sans-serif; font-size: 15px; font-weight: 700;
        cursor: pointer; text-decoration: none; transition: background 0.2s;
      }
      .zzlaw-btn-gold:hover { background: #94462F; }
      .zzlaw-header-inner {
        display: flex; align-items: center; justify-content: space-between; height: 62px; gap: 12px;
      }
      .zzlaw-header-cta { display: flex; align-items: center; gap: 20px; }
      .zzlaw-header-phone { display: flex; align-items: center; gap: 6px; }
      .zzlaw-footer-grid { display: grid; grid-template-columns: 1.6fr 1fr 1fr; gap: 40px; }
      @media (max-width: 680px) {
        .zzlaw-footer-grid { grid-template-columns: 1fr !important; }
      }
      @media (max-width: 560px) {
        .zzlaw-header-inner { height: auto; flex-wrap: wrap; padding: 10px 0; row-gap: 8px; }
        .zzlaw-header-phone { display: none; }
        .zzlaw-header-cta { gap: 10px; }
      }
      @media (max-width: 400px) {
        .zzlaw-header-inner > a > div > div:last-child { display: none; }
      }
    `}</style>
  );
}

export function ZapZapHeader() {
  const { cfg, escritorio, isVerifiedLawFirm, phoneDisplay, CTA_HERO } = useZapZapChrome();

  return (
    <>
      <CookieConsentBanner />

      {/* ── DISCLAIMER BAR ── */}
      <div style={{ background: "#FFF4EF", borderBottom: "1px solid #E8B7A7", padding: "7px 20px" }}>
        <p style={{ maxWidth: 1100, margin: "0 auto", fontSize: 11.5, color: "#6F3022", lineHeight: 1.5, textAlign: "center", fontFamily: "Inter, system-ui, sans-serif" }}>
          <span aria-hidden="true">⚠️</span>{" "}
          <strong>Aviso:</strong>{" "}
          {isVerifiedLawFirm
            ? <>site de propriedade de advogado regularmente inscrito na OAB, sem vínculo com órgãos públicos, entidades governamentais ou comissões de processo administrativo. Nenhuma informação aqui constitui aconselhamento jurídico individual nem garante resultado. Consulte um profissional habilitado.</>
            : <>canal independente de informação, sem vínculo com órgãos públicos, entidades governamentais ou comissões de processo administrativo. Não representamos a Administração Pública e não cobramos qualquer valor para conversar. Para orientação específica ao seu caso, consulte um profissional habilitado.</>
          }
        </p>
      </div>

      {/* ── HEADER ── */}
      <header style={{
        background: NAVY, position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 12px rgba(0,0,0,0.25)", fontFamily: "Inter, system-ui, sans-serif",
      }}>
        <div className="zzlaw-header-inner" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", minWidth: 0 }}>
            {cfg.logoImage
              ? <img src={cfg.logoImage} alt={escritorio} style={{ height: 34, objectFit: "contain", filter: "brightness(0) invert(1)" }} />
              : (
                <div style={{
                  width: 34, height: 34, borderRadius: 6, border: `1.5px solid ${ACCENT}`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="3" x2="12" y2="21" />
                    <path d="M4 7l8-4 8 4" />
                    <path d="M4 7l4 8H0L4 7z" />
                    <path d="M20 7l4 8h-8l4-8z" />
                  </svg>
                </div>
              )
            }
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", lineHeight: 1.15 }}>{escritorio}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", fontWeight: 500, textTransform: "uppercase" }}>
                {isVerifiedLawFirm ? "Advocacia · Direito Administrativo" : "Direito Administrativo · Carreira Pública"}
              </div>
            </div>
          </a>

          <div className="zzlaw-header-cta">
            {cfg.telefone && (
              <a href={CTA_HERO} target="_blank" rel="noopener noreferrer" className="zzlaw-header-phone"
                style={{ fontSize: 13.5, color: "rgba(255,255,255,0.8)", textDecoration: "none", fontWeight: 500, whiteSpace: "nowrap" }}>
                <WaIcon size={14} />
                {phoneDisplay}
              </a>
            )}
            <a href={CTA_HERO} target="_blank" rel="noopener noreferrer" className="zzlaw-btn-gold"
              style={{ fontSize: 13, padding: "8px 18px", borderRadius: 5, whiteSpace: "nowrap" }}>
              {isVerifiedLawFirm ? "Fale com um advogado" : "Fale com um especialista"}
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

export function ZapZapFooter() {
  const { cfg, escritorio, isVerifiedLawFirm, phoneDisplay, CTA_HERO } = useZapZapChrome();

  return (
    <footer style={{ background: "#f1f5f9", borderTop: "1px solid #e2e8f0", padding: "40px 24px 26px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="zzlaw-footer-grid" style={{ marginBottom: 30 }}>

          {/* Col 1 — escritório */}
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 6 }}>{escritorio}</div>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65, marginBottom: 10 }}>
              {isVerifiedLawFirm
                ? "Advocacia especializada em Direito Administrativo. Defesa do servidor público em todas as fases da carreira."
                : "Informação jurídica especializada sobre direitos e estabilidade na carreira pública."
              }
            </p>
            {cfg.cnpjFormatted && (
              <p style={{ fontSize: 11.5, color: "#9ca3af", lineHeight: 1.6, margin: "0 0 8px" }}>
                CNPJ: {cfg.cnpjFormatted}
              </p>
            )}
            {cfg.oabNumero && (
              <p style={{ fontSize: 11.5, color: "#9ca3af", marginBottom: 8 }}>
                {cfg.oabNumero}{cfg.oabSeccional ? ` · ${cfg.oabSeccional}` : ""}
              </p>
            )}
            {(cfg.endereco || cfg.cidade) && (
              <div style={{ fontSize: 11.5, color: "#9ca3af", lineHeight: 1.75 }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#6b7280", marginBottom: 4 }}>
                  Localização
                </div>
                {cfg.endereco && <>{cfg.endereco}<br /></>}
                {cfg.bairro && <>{cfg.bairro}<br /></>}
                {cfg.cidade && <>{cfg.cidade}{cfg.estado ? ` — ${estadoNomeCompleto(cfg.estado)} (${cfg.estado})` : ""}<br /></>}
                {cfg.cep && <>CEP {cfg.cep}</>}
              </div>
            )}
          </div>

          {/* Col 2 — navegação */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#374151", marginBottom: 14 }}>
              Navegação
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { href: "/sobre", label: "Sobre" },
                { href: "/#verificacao", label: "Verificação Comercial" },
                { href: "/#duvidas", label: "Dúvidas Frequentes" },
                { href: "/#contato", label: "Fale Conosco" },
                { href: "/privacidade", label: "Política de Privacidade" },
                { href: "/termos", label: "Termos de Uso" },
                { href: "/cookies", label: "Política de Cookies" },
              ].map(({ href, label }) => (
                <a key={label} href={href} style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = NAVY)}
                  onMouseLeave={e => (e.currentTarget.style.color = "#6b7280")}
                >{label}</a>
              ))}
            </div>
          </div>

          {/* Col 3 — contato */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#374151", marginBottom: 14 }}>
              Contato
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cfg.telefone && (
                <a href={CTA_HERO} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#6b7280", textDecoration: "none" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <WaIcon size={13} />
                  </div>
                  {phoneDisplay}
                </a>
              )}
              {cfg.email && (
                <a href={`mailto:${cfg.email}`}
                  style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#6b7280", textDecoration: "none" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  {cfg.email}
                </a>
              )}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 18 }}>
          <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, textAlign: "center", lineHeight: 1.7 }}>
            <strong style={{ color: "#6b7280" }}>{escritorio}</strong>
            {isVerifiedLawFirm
              ? " — Advocacia especializada em Direito Administrativo. Nenhuma informação neste site constitui aconselhamento jurídico individual. Consulte um profissional habilitado."
              : " — Informações orientativas sobre direitos do servidor público. Não constituem aconselhamento jurídico individual."
            }
            {cfg.cnpjFormatted && <> · CNPJ {cfg.cnpjFormatted}</>}
            {cfg.oabNumero && <> · {cfg.oabNumero}</>}
            {" "}·{" "}<a href="/privacidade" style={{ color: "#9ca3af", textDecoration: "underline" }}>Privacidade</a>
            {" "}·{" "}<a href="/termos" style={{ color: "#9ca3af", textDecoration: "underline" }}>Termos</a>
          </p>
          <p style={{ fontSize: 10.5, color: "#b0b8c4", margin: "8px 0 0", textAlign: "center" }}>
            Site em conformidade com as diretrizes de operações comerciais do Google Ads.{" "}
            <a href="/#verificacao" style={{ color: "#b0b8c4", textDecoration: "underline" }}>Ver informações de verificação</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
