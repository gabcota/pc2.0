# Pix Bolt — implantação e retorno manual

## Sem migração

Não há mudança em shared/schema.ts, migrations, Procfile ou configuração Drizzle.
O estado da Bolt fica no namespace `application_data._bolt` de `pix_transactions`,
preservando os demais campos JSON. Usa os campos existentes para valor, status,
Pix, dados do candidato e vínculo com a inscrição. Datas e controle de lease
são atualizados atomicamente no PostgreSQL com relógio do banco, compartilhados
por todos os dynos; não existe cache de servidor apenas em memória.

O release continua executando `db:migrate` como antes. Nenhuma migração foi
adicionada por esta integração. Se o banco de destino não possuir os campos
existentes do projeto, parar e apresentar a diferença e SQL antes de qualquer ação.

## Config Vars na Heroku (e Secrets no preview)

- `PAYMENT_GATEWAY=bolt`. Ausente também seleciona Bolt. Só `bolt` e `paglemon`
  são válidos; valores antigos como `novaera` devem ser substituídos manualmente.
- `BOLT_PUBLIC_KEY` e `BOLT_SECRET_KEY`: somente no servidor, pelo mecanismo
  seguro da plataforma. Não colocar em Git, prefixar com VITE_, ou enviar no chat.
- `PAYMENT_WEBHOOK_BASE_URL`: origem pública HTTPS deste aplicativo, sem caminho,
  query ou credenciais. Não há valor padrão. O servidor acrescenta
  `/api/utmify/bolt`. Não usar o endereço temporário do preview para produção.
- Manter as credenciais atuais `PAGLEMON_PUBLIC_KEY` / `PAGLEMON_SECRET_KEY`
  para retorno manual, sem disponibilizá-las à Bolt.

Não foi feita publicação, cobrança real nem mudança no banco de produção.
Configurar o webhook do painel Bolt para o aplicativo correto. A conta é
compartilhada: notificações de IDs que não existem localmente como Bolt recebem
200 e são ignoradas, sem consulta à API. O servidor não envia vendas à Utmify
no modo Bolt; o envio fica a cargo da configuração do painel Bolt.

## Comportamento e limites

- Valores de criação são centavos; no frontend são reais. Consulta aceita raiz
  ou envelope data e interpreta reais, admitindo centavos apenas se exatamente
  iguais ao valor salvo. Alterar cotação não altera o valor de Pix emitido.
- Telefones inválidos utilizam 11999999999, não um Pix substituto.
- A confirmação é uma atualização atômica com marcador persistente: não duplica
  a venda ou o efeito de confirmação entre polling e webhooks repetidos.
- Notificação SMS reutiliza o helper atual, sem alterar texto ou regras. Sua
  execução é reivindicada uma vez; uma interrupção de processo após a confirmação
  pode impedir a notificação. Não há alegação de entrega “exactly once” de SMS.
- Consultas compartilham o próximo instante permitido e um lease com expiração
  para recuperar processos interrompidos. A API tem timeout de 10 segundos.
  Respostas 429 respeitam Retry-After e nunca revertem pagamento confirmado.
- Cache do navegador no modo Bolt só é exibido após encontrar a cobrança
  persistida pelo endpoint local; códigos e valores do cache não são confiáveis.
- Códigos legados fixos/simulados foram preservados, não removidos: e-Social,
  texto de fallback em PagamentoPage, código literal do modal ConfirmarDadosPage
  e caminhos legados do servidor. Guardas da Bolt não permitem utilizá-los.

## Testes seguros

`node --import tsx --test tests/bolt-payments.test.ts`

Os clientes, respostas e registros desses testes são simulados; não chamam a
Bolt, PagLemon, NovaEra, Utmify ou SMS. Cobrem unidades monetárias, payload,
telefone, UTMs, IDs de outra aplicação, duplicidade/concorrência, cache e 429.
Testes do navegador devem interceptar as chamadas de pagamento e SMS antes de
abrir páginas que geram Pix automaticamente.

Há também um smoke test de navegador em `tests/bolt-browser.mjs`, com Chromium
headless via CDP na porta 9223. Ele intercepta as chamadas antes da navegação,
simula indisponibilidade, verifica UTMs, rejeita cache legado e confirma que
o campo Pix e o valor exibidos vêm do registro persistido, não do cache.

Antes da ativação pública, conferir configurações e o funcionamento do banco
existente. Qualquer teste de cobrança real exige autorização separada.

## Retorno manual

Definir `PAYMENT_GATEWAY=paglemon`, manter suas credenciais e reiniciar os dynos.
Não existe fallback automático. No modo Bolt nem criação, consulta ou webhook
PagLemon são executados. No modo PagLemon, a Bolt fica inativa.
Transações do provedor desativado não são consultadas através do outro provedor.
Limpar/recarregar a página ao alternar o modo; não reaproveitar Pix de outro
gateway. Não apagar registros ou credenciais para reverter.
