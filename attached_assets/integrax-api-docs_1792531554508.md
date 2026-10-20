# IntegraX — Documentação da API Externa (para IA/LLM)

Você é um assistente que vai implementar uma integração com a API da IntegraX
(plataforma de SMS, RCS, Voz e Números Virtuais). Use os endpoints abaixo.

## Autenticação
- Toda rota usa o TOKEN da integração (obtido no painel IntegraX em /dashboard/external).
- Quando a URL tem `{TOKEN}`, substitua pelo token no PATH.
- Quando indicado `Authorization: Bearer {TOKEN}`, envie o token no header.
- Content-Type: application/json em todos os POST.

## Convenções
- Telefones no formato E.164 sem "+" (ex: 5511999999999).
- Respostas de sucesso trazem `success`/`error: 0`; erros vêm com HTTP 4xx e `message`.
- `{RENTAL_ID}` e afins são placeholders de path — substitua pelos ids reais.

---

## Disparo de SMS

```
POST https://sms.aresfun.com/v1/integration/{TOKEN}/send-sms
```

Endpoint para envio de SMS simples.

**Body (exemplo):**
```json
{
  "to": [
    "55119999999"
  ],
  "from": "29094",
  "message": "Mensagem enviada via API"
}
```

---

## Envio de OTP (2Factory)

```
POST https://sms.aresfun.com/v1/integration/{TOKEN}/send-otp
```

Envia um código de verificação para o usuário.

**Body (exemplo):**
```json
{
  "to": "55119999999",
  "message_default": "Sua conta, verifique com o codigo: [code] ",
  "from": "29094",
  "qtd_digits": 5,
  "with_text": true,
  "expires_in": 10
}
```

---

## Validar OTP

```
POST https://sms.aresfun.com/v1/integration/{TOKEN}/verify-otp
```

Valida o código recebido pelo usuário.

**Body (exemplo):**
```json
{
  "code": "1MP5L",
  "phone": "551199999999"
}
```

---

## RCS Text (Basic)

```
POST https://sms.aresfun.com/v1/integration/{TOKEN}/send-rcs
```

Envio de mensagem RCS simples apenas com texto.

**Body (exemplo):**
```json
{
  "to": [
    "5511999999999"
  ],
  "message": "Olá! Esta é uma mensagem RCS Basic (apenas texto).",
  "from": "SENDER_APROVADO",
  "rcsType": "BASIC",
  "fallback": {
    "type": "sms",
    "from": "29093",
    "text": "fallback de sms"
  }
}
```

---

## RCS Single Card

```
POST https://sms.aresfun.com/v1/integration/{TOKEN}/send-rcs
```

Envio de RCS com card interativo (imagem, botões e ações).

**Body (exemplo):**
```json
{
  "to": [
    "5511999999999"
  ],
  "message": "Confira nossa oferta especial!",
  "from": "SENDER_APROVADO",
  "fallback": {
    "type": "sms",
    "from": "29093",
    "text": "fallback de sms"
  },
  "rcsMessage": {
    "card": {
      "title": "Oferta Exclusiva! 🚀",
      "description": "Clique no botão abaixo para garantir seu desconto de 50%.",
      "media": {
        "file": {
          "url": "https://sua-imagem-aqui.com/promo.jpg"
        },
        "height": "MEDIUM"
      },
      "suggestions": [
        {
          "type": "OPEN_URL",
          "text": "Ir para o Site",
          "url": "https://seusite.com/promo",
          "postbackData": "https://seusite.com/promo"
        },
        {
          "type": "REPLY",
          "text": "Tenho Interesse",
          "postbackData": "user_interested_promo_1"
        }
      ]
    }
  }
}
```

---

## RCS Carousel

```
POST https://sms.aresfun.com/v1/integration/{TOKEN}/send-rcs
```

Envio de RCS com carrossel de cards (múltiplos produtos ou ofertas).

**Body (exemplo):**
```json
{
  "to": [
    "5511999999999"
  ],
  "message": "Veja nossos produtos:",
  "from": "SENDER_APROVADO",
  "fallback": {
    "type": "sms",
    "from": "29093",
    "text": "fallback de sms"
  },
  "rcsMessage": {
    "carousel": {
      "cards": [
        {
          "title": "Produto A",
          "description": "R$ 99,00",
          "media": {
            "file": {
              "url": "https://link-da-imagem-a.jpg"
            }
          },
          "suggestions": [
            {
              "type": "OPEN_URL",
              "text": "Comprar",
              "url": "https://loja.com/a",
              "postbackData": "https://seusite.com/promo"
            }
          ]
        },
        {
          "title": "Produto B",
          "description": "R$ 149,00",
          "media": {
            "file": {
              "url": "https://link-da-imagem-b.jpg"
            }
          },
          "suggestions": [
            {
              "type": "OPEN_URL",
              "text": "Comprar",
              "url": "https://loja.com/b",
              "postbackData": "https://seusite.com/promo"
            }
          ]
        }
      ]
    }
  }
}
```

---

## Chamada de Voz — TTS (texto → fala)

```
POST https://sms.aresfun.com/v1/integration/{TOKEN}/send-voice
```

Dispara uma chamada que lê o texto em voz natural via TTS. Voz default: Camila (pt-br). LIMITE: texto máx 500 caracteres (~40s de fala) — pra áudios maiores use audioFileUrl. A cobrança é flat por chamada tentada, independente da duração real.

**Body (exemplo):**
```json
{
  "to": [
    "5511999999999"
  ],
  "from": "554399999999",
  "text": "Olá, sua entrega chegou! Responda digitando 1 para confirmar.",
  "language": "pt-BR",
  "voice": {
    "name": "Camila",
    "gender": "female"
  },
  "dlr": "https://seu-webhook.com/voz-status"
}
```

---

## Chamada de Voz — Áudio pré-gravado (MP3)

```
POST https://sms.aresfun.com/v1/integration/{TOKEN}/send-voice
```

Dispara uma chamada que toca um arquivo de áudio público. REQUISITOS: URL HTTPS + extensão mp3/wav/aac/ogg/m4a/aiff/mp2/mp4/wma + tamanho máx 4MB (limite ≈ 4min de áudio). Ideal pra confirmações com voz humana gravada.

**Body (exemplo):**
```json
{
  "to": [
    "5511999999999"
  ],
  "from": "554399999999",
  "audioFileUrl": "https://cdn.seusite.com/audios/boas-vindas.mp3",
  "dlr": "https://seu-webhook.com/voz-status"
}
```

---

## Consulta de CPF

```
POST https://sms.aresfun.com/v1/integration/{TOKEN}/consult
```

Consulta informações detalhadas de um ou mais CPFs.

**Body (exemplo):**
```json
{
  "documents": [
    "00000000001",
    "00000000002"
  ],
  "type": "cpf",
  "showPhoneValid": true,
  "showRestrictions": true
}
```

---

## Consulta de Telefone

```
POST https://sms.aresfun.com/v1/integration/{TOKEN}/consult-phone
```

Consulta informações básicas de um número de telefone.

**Body (exemplo):**
```json
{
  "phones": [
    "551199999999"
  ]
}
```

---

## Consulta de Telefone Premium

```
POST https://sms.aresfun.com/v1/integration/{TOKEN}/consult-phone-premium
```

Consulta informações avançadas de um número de telefone.

**Body (exemplo):**
```json
{
  "phones": [
    "551199999999"
  ]
}
```

---

## Consulta de Saldo/Créditos

```
GET https://sms.aresfun.com/v1/integration/{TOKEN}/consult/credits
```

Verifica o saldo disponível para consultas e disparos.

---

## Números Virtuais — Listar disponíveis

```
GET https://api.integraflux.com/phone-numbers/api/available?ddd=11&limit=200
```

**Auth:** `Authorization: Bearer {TOKEN}`

Lista os números virtuais disponíveis para compra. Parâmetros opcionais: "ddd" filtra por DDD e "limit" define quantos retornar (sem "limit" retorna todos, teto de 1000). A resposta traz "total" (quantidade total disponível) e "count" (quantos vieram nesta resposta).

---

## Números Virtuais — Comprar número

```
POST https://api.integraflux.com/phone-numbers/api/buy
```

**Auth:** `Authorization: Bearer {TOKEN}`

Compra um número virtual. Todos os campos do payload são opcionais: sem "phone_id" e sem "ddd", compra QUALQUER número disponível (auto-pick); com "ddd", pega qualquer um daquele DDD; com "phone_id", compra o número específico. "mode" aceita "subscription" (padrão — cobra na hora, número fica ativo) ou "temporary". Retorna o "rental_id" usado nas demais rotas.

**Body (exemplo):**
```json
{
  "mode": "subscription",
  "ddd": null,
  "phone_id": null
}
```

---

## Números Virtuais — Meus números

```
GET https://api.integraflux.com/phone-numbers/api/rentals
```

**Auth:** `Authorization: Bearer {TOKEN}`

Lista os números que você comprou, com os dados de cada número e o respectivo "rental_id". Por padrão retorna TODOS (ativos, cancelados e expirados) — cada item traz o campo "status". Use o filtro opcional "?status=" para restringir: ?status=active (só ativos), ?status=cancelled, ou lista separada por vírgula, ex.: ?status=active,reserved. Valores válidos: reserved, active, expired, cancelled.

---

## Números Virtuais — SMS recebidos

```
GET https://api.integraflux.com/phone-numbers/api/rentals/{RENTAL_ID}/sms
```

**Auth:** `Authorization: Bearer {TOKEN}`

Retorna os SMS recebidos em um número específico. Use o "rental_id" devolvido na compra ou na rota "Meus números". Cada SMS traz remetente, corpo, código OTP extraído (quando houver) e data de recebimento.

---

## Números Virtuais — Cancelar assinatura

```
POST https://api.integraflux.com/phone-numbers/api/rentals/{RENTAL_ID}/cancel-refund
```

**Auth:** `Authorization: Bearer {TOKEN}`

Cancela uma assinatura (subscription) ATIVA. O reembolso é condicional: se o número AINDA NÃO recebeu nenhum SMS com código OTP/verificação, o valor integral pago volta ao saldo da conta ("refunded": true); se já recebeu algum código, o cancelamento acontece do mesmo jeito, mas SEM reembolso ("refunded": false) — a próxima mensalidade apenas deixa de ser cobrada. Não funciona para "temporary". Após o cancelamento, o número some da sua conta. A resposta traz "refunded", "refunded_brl" e "otp_sms_count". Body vazio.

---

_Gerado automaticamente pela IntegraX em 2026-10-20._