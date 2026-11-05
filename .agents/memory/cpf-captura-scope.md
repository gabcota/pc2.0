---
name: Escopo da troca de CPF
description: Limites definidos pelo usuário para a troca temporária da API de CPF na captura.
---

A troca temporária da API de CPF deve afetar somente a página `/captura`. Preservar a API anterior para retorno manual, sem usá-la automaticamente nessa consulta. Não alterar as APIs do Google, consultas das outras páginas ou o fluxo existente de salvamento e passagem dos dados para as próximas páginas.

**Why:** o usuário confirmou repetidamente que deseja somente substituir a fonte dos dados de CPF, mantendo o funil e as outras integrações iguais.

**How to apply:** manter o novo provedor isolado da rota compartilhada pelas demais páginas e preservar o contrato que o preenchimento e a persistência do funil já consomem.
