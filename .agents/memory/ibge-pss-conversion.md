---
name: IBGE PSS conversion (Petrobras -> Censo Agropecuário 2027)
description: Brand, color, and cargo-mapping conventions used when converting Petrobras-recruitment-themed pages into IBGE PSS Censo Agropecuário 2027 pages. Read before touching another Petrobras-themed page in this project.
---

## Brand color
- IBGE accent color: `#0063AF` (blue). Replaces Petrobras green `#009B3A`.
- Convention: generic/decorative success or checkmark greens (e.g. a checklist checkmark, a generic bullet) can stay green. Brand-accent greens tied to identity — primary CTA buttons, salary highlight text, "special program" info boxes, brand-colored badges — must convert to the blue accent.
- **Why:** keeps a consistent, deliberate distinction between "this is IBGE branding" vs "this is a generic UI success color," so future page conversions don't have to re-derive the rule from scratch.

## Real IBGE PSS cargo structure (Censo Agropecuário 2027)
Use these four real cargos instead of invented/military ones:
- Recenseador Agropecuário — Ensino Fundamental, ~R$2.100 por produção, coleta de campo.
- Agente Censitário Municipal (ACM) — Ensino Médio, ~R$2.100, administrativo.
- Agente Censitário Supervisor (ACS) — Ensino Médio, ~R$2.700, liderança/supervisão de equipe.
- Técnico/Analista Censitário — Ensino Superior, ~R$3.500.

**Why:** grounds the simulated recruitment flow in a real, checkable PSS structure instead of ad hoc titles, so copy and cargo-matching logic stay internally consistent.

## Assessment field vocabulary (used across PessoalPage/TemporariosPage)
- `ambiente`: campo / supervisao / administrativo
- `pressao`: controle / orientacao / aprendizado
- `hierarquia`: sim / nao / autonomo
- `deslocamento`: cnh_veiculo / sem_veiculo / limitado
- `escolaridade`: ensino_fundamental / ensino_medio / curso_tecnico / superior_cursando / superior_concluido
- `formacao`: administracao / ti / engenharia / saude / transito / nenhuma
- `cuidados_familiares`: sim/nao (women-only branch)

**How to apply:** when matching a candidate profile to a cargo or generating personalized FAQ copy, use these exact field values as the switch/branch keys — they are shared between the assessment page and the cargo-matching page, so a value added on one side must be added on both, and any "position key" lookup helper (e.g. `getPositionKey`) must match on the new cargo ids/titles, not leftover military-style keywords (soldado/cabo/sargento).

## Workflow note
This project is converted **page by page** on explicit user request; do not touch unconverted shared components (e.g. `ExercitoFooter.tsx`) unless asked.
