---
name: Domínios e medição sem GTM
description: Regra do usuário para cadastrar novos domínios e preservar a medição via Cloudflare e Google.
---

Não configurar mais GTM nos novos domínios deste projeto. O usuário informou: “nos ligamos o dominio na cloudflare direto no google para marcar mais precisamente”.

**Why:** o usuário corrigiu o procedimento de cadastro e explicou que sua medição atual não usa GTM.

**How to apply:** não copiar GTM de outros domínios nem introduzir um container novo. Não remover configurações antigas de outros domínios sem pedido. Se for necessário alterar a medição, esclarecer qual recurso do Google está conectado, pois o usuário não especificou isso.

O cadastro de um domínio inclui duas partes distintas: identidade e dados correspondentes no aplicativo; conexão à publicação e DNS. O preview, sozinho, não confirma a configuração do domínio público.

**Why:** o usuário forneceu esse procedimento como referência para o cadastro de domínios.

**How to apply:** distinguir no resultado o que foi cadastrado no código do que foi conectado e testado no domínio real; não anunciar a conexão pública como concluída apenas por cadastrar a identidade no aplicativo.
