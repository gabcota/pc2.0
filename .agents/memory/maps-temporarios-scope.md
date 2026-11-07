---
name: Escopo da API de locais
description: Limites definidos para a nova API de delegacias na temporarios.
---

A nova API de locais deve ser usada somente na `/temporarios`. Manter a API atual da `/agendamento-medico` e não apagar nenhuma integração anterior; a anterior da `/temporarios` fica apenas de lado.

**Why:** o usuário informou falha na API da temporarios e pediu expressamente substituição isolada com preservação das integrações existentes.

**How to apply:** isolar a escolha do provedor por uso da página, sem trocar auxiliares ou credenciais do Google compartilhados com o caminho médico.
