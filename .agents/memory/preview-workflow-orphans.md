---
name: Processos antigos no preview
description: Um servidor antigo pode continuar ocupando a porta mesmo depois de parar o workflow.
---

O status de um workflow não garante que todos os processos antigos do servidor tenham sido encerrados neste ambiente.

**Why:** um reinício falhou por porta ocupada; mesmo após parar o workflow, um grupo antigo do aplicativo continuava escutando e atendendo requisições.

**How to apply:** antes de alterar portas ou o código por esse erro, conferir o listener e a árvore de processos. Encerrar apenas o grupo antigo identificado do aplicativo, preservando o sandbox e os serviços do editor, e reiniciar o workflow gerenciado.
