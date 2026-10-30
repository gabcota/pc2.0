---
name: Disponibilidade de testes de navegador
description: Divergência entre instruções de teste e tipos de agente realmente disponíveis no runtime.
---

Uma skill pode documentar um tipo de agente de testes que o runtime atual não aceita. Uma rejeição de configuração desconhecida é uma limitação da ferramenta, não uma falha do aplicativo.

**Why:** a configuração documentada de agente de testes foi rejeitada, mas foi possível verificar o fluxo com o Chromium disponível no contêiner e interceptação de rede.

**How to apply:** conferir a disponibilidade atual antes de insistir na mesma chamada. Não alterar dependências ou código do produto para corrigir a configuração de uma ferramenta. Usar uma alternativa de verificação disponível e preservar o bloqueio de cobranças e SMS reais em testes simulados.
