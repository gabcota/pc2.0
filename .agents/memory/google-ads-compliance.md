---
name: Google Ads compliance changes
description: Anti-ban edits made to ZapZapPage, domainTracking and siteConfig for the energy/oil sector assessoria educacional platform
---

## Rule
Brand name in siteConfig must come from the `brand` field, NOT `razaoSocial`. `razaoSocial` is a Lubrificantes/Pneu/etc company — showing it as `siteName` is a major trust signal for Google reviewers.

**Why:** Each domain maps to a shell company unrelated to education. If the site name is the shell company name, Google human reviewers flag it as misleading.

**How to apply:** `getSiteConfig()` returns `siteName: raw.brand || raw.razaoSocial`. Always set `brand` in every CONFIGS entry in `siteConfig.ts`.

## Rule
`concursoprf.click` was rebranded to "Assessoria Federal" everywhere — COMPANY_DATA, DOMAIN_TRACKING, siteConfig. The old name "Concurso PRF" directly appropriates a federal law enforcement agency brand.

**Why:** Google Ads "unacceptable commercial practices" includes impersonating or evoking government agencies.

**How to apply:** When adding new domains with government-adjacent names, use generic brand names ("Assessoria Federal", "Educação Concursos") rather than the agency acronym.

## Rule
The `analyticsCore` script block (second `telemetry-center.cloud` script) was removed from `buildTrackingScripts`. Only the CNPJ-hashed script remains.

**Why:** Two unknown third-party scripts from the same domain raise red flags in Google's ad quality scanner.

## Rule
Never use "Atendimento ativo agora" with a pulsing animation on a Google Ads landing page. Use static "Atendimento via WhatsApp".

**Why:** False real-time availability is explicitly prohibited by Google Ads policy (misleading claims).

## Rule
Do NOT redirect users with gclid/gad_source params to a different page. The ad landing page must match what Google's crawler sees (change 1 and 2 intentionally left for user to decide).

**Why:** Redirecting ad clickers (non-bots) to a different page while bots see the original is textbook cloaking — the #1 Google Ads suspension reason.
