---
name: Restrições da integração Bolt
description: Preferência por JSON existente, autorização separada para migrações e conta Bolt compartilhada.
---

Na integração Bolt, primeiro reutilizar estruturas e campos JSON existentes sem alterar o schema. Só se isso for realmente impossível, apresentar a estrutura e o SQL e aguardar aprovação separada.

**Why:** o usuário exigiu evitar migração e lembrou que o release executa migrações automaticamente no deploy; aprovar a integração não autoriza uma mudança de schema.

**How to apply:** preservar essa restrição em futuras alterações de cache, idempotência e status. Não incluir migração executável junto de mudanças comuns antes da autorização específica.

A mesma conta Bolt é usada por outro projeto.

**Why:** o usuário explicou que o webhook do painel envia transações de toda a conta para este servidor.

**How to apply:** um ID não registrado como cobrança Bolt deste aplicativo deve ser reconhecido com HTTP 200 e ignorado, sem consulta remota ou tratamento como erro.

Preservar o PagLemon para retorno manual e não apagar silenciosamente os códigos fixos legados.

**Why:** o usuário pediu a possibilidade de retorno e exigiu ser avisado dos códigos fixos antes de alterá-los.

**How to apply:** manter o caminho Bolt isolado de provedores e códigos legados; qualquer limpeza do legado precisa de autorização própria. Nunca usar os códigos legados como contingência da Bolt.
