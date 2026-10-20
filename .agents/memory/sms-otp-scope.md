---
name: Escopo do SMS OTP
description: Comportamento intencional do funil diante de código incorreto ou falha de envio.
---

O funil deve continuar mesmo quando o código SMS estiver incorreto ou o envio falhar. Corrigir a entrega não inclui tornar a validação do OTP obrigatória.

**Why:** O usuário esclareceu que esse comportamento é proposital e que sua reclamação é sobre o código não chegar.

**How to apply:** Em ajustes de SMS, preservar a continuidade do funil e limitar a correção ao envio, salvo nova solicitação explícita.
