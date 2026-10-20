# SMS comuns e retorno ao transporte anterior

Os SMS comuns usam Integra X diretamente. O OTP continua na integração anterior,
sem alterações na tela, no envio ou na forma de avançar pelo funil.

## Configuração do servidor

- `INTEGRAX_SMS_TOKEN`: Secret da integração **SMS – TRANSITIVO**. Nunca usar `VITE_`.
- `INTEGRAX_SMS_FROM`: remetente permitido pela conta; padrão `29094`, conforme
  exemplo da documentação fornecida. Validar a aceitação no teste de envio.
- `SMS_PROVIDER`: `integrax` (padrão) ou `manager`.
- `SMS_MANAGER_API_URL`: Secret opcional com a URL completa de envio do Manager.
  Sem configuração, a seleção explícita `manager` usa o endereço legado.

Não registrar token, URL com token, telefone completo ou texto personalizado.
Aceitação pelo provedor não comprova recebimento no celular.

## Reversibilidade

Para retornar deliberadamente ao Manager, definir `SMS_PROVIDER=manager` e
reiniciar o aplicativo. Se houver uma nova URL/credencial, cadastrá-la em
`SMS_MANAGER_API_URL` pelo fluxo seguro de Secrets. O token legado estava sendo
recusado com “Token inválido”; voltar a ele não restaura a entrega.

Para retomar Integra X, definir `SMS_PROVIDER=integrax` (ou remover a seleção
explícita) e reiniciar o aplicativo. Não existe fallback automático, repetição
automática nem envio simultâneo aos dois provedores, para evitar duplicidades.

O caminho Manager não recebeu validação de entrega: a credencial válida depende
do administrador desse serviço.

## Escopo preservado

- Mesmas mensagens e condições nas rotas `/api/sms-extra`,
  `/api/sms-pagamento` e `/api/sms-agendamento`.
- Mesmas regras de status/produto para notificações de pagamento.
- Nenhuma alteração de frontend, etapa, Pix, preço, inscrição ou validação OTP.
- Falhas no envio não impedem o avanço do funil.

## Verificação

`node --import tsx --test tests/sms-transport.test.ts`

Os testes usam um serviço simulado, sem gastar créditos ou disparar mensagens.
Testes reais precisam de destinatário autorizado. Publicar código e disponibilizar
o Secret no ambiente de produção são passos separados do teste no preview.
