---
name: Escopo do SMS OTP
description: Comportamento intencional do funil diante de código incorreto ou falha de envio.
---

O funil deve continuar mesmo quando o código SMS estiver incorreto ou o envio falhar. Corrigir a entrega não inclui tornar a validação do OTP obrigatória.

**Why:** O usuário esclareceu que esse comportamento é proposital e que sua reclamação é sobre o código não chegar.

**How to apply:** Em ajustes de SMS, preservar a continuidade do funil e limitar a correção ao envio, salvo nova solicitação explícita.

A troca do Manager por envio direto deve preservar o funcionamento do funil e permitir voltar ao Manager se der errado.

**Why:** O usuário perguntou se seria a mesma coisa e se depois seria possível mudar para como estava, e pediu deixar isso registrado.

**How to apply:** Planejar uma alteração reversível apenas no transporte dos SMS. Preservar textos, etapas, momentos e condições de disparo; informar que retornar ao Manager não corrige sua credencial inválida.

Para SMS comuns, manter o envio direto pela conta Integra X do usuário como opção principal, sem recolocar o intermediário Manager sem solicitação.

**Why:** O usuário autorizou resolver a falha e confirmou o recebimento da mensagem de reserva no teste direto, após o Manager recusar sua credencial.

**How to apply:** Preservar o envio direto e sua reversibilidade em ajustes futuros. A confirmação vale para a mensagem testada no preview, não comprova entrega de todas as etapas nem publicação.
