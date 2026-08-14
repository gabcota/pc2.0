# Instruções de Deploy no Fly.io

## Pré-requisitos

1. **Instalar o Fly CLI:**
   ```bash
   # macOS
   brew install flyctl
   
   # Linux/WSL
   curl -L https://fly.io/install.sh | sh
   
   # Windows
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Fazer login no Fly.io:**
   ```bash
   flyctl auth login
   ```

3. **Verificar se você tem conta no Fly.io:**
   - Crie uma conta gratuita em https://fly.io/app/sign-up
   - A conta gratuita inclui recursos suficientes para testar a aplicação

## Deploy Automático (Recomendado)

Execute o script de deploy automatizado:

```bash
./deploy-fly.sh
```

Este script irá:
- Verificar se o Fly CLI está instalado
- Fazer build da aplicação com otimizações
- Criar a aplicação no Fly.io (se não existir)
- Configurar o banco PostgreSQL
- Fazer o deploy

## Deploy Manual

### 1. Preparar a Aplicação

```bash
# Fazer build de produção
node scripts/build-deploy.js
```

### 2. Inicializar a Aplicação no Fly.io

```bash
# Para nova aplicação
flyctl launch --no-deploy

# Para aplicação existente
flyctl deploy
```

### 3. Configurar Banco de Dados PostgreSQL

```bash
# Criar banco PostgreSQL
flyctl postgres create --name military-recruitment-platform-db --region gru

# Conectar banco à aplicação
flyctl postgres attach military-recruitment-platform-db
```

### 4. Configurar Variáveis de Ambiente

```bash
# Definir variáveis necessárias
flyctl secrets set NODE_ENV=production
flyctl secrets set DATABASE_URL="sua_url_do_banco"

# Para APIs externas (se necessário)
flyctl secrets set GOOGLE_MAPS_API_KEY="sua_chave"
flyctl secrets set ANTHROPIC_API_KEY="sua_chave"
```

### 5. Fazer Deploy

```bash
flyctl deploy
```

## Configurações Importantes

### Região
- Configurado para `gru` (São Paulo, Brasil) para menor latência
- Pode ser alterado no arquivo `fly.toml`

### Recursos
- **CPU:** 1 vCPU compartilhada
- **Memória:** 512MB
- **Armazenamento:** Volume persistente montado em `/data`

### Monitoramento
- Health checks configurados em `/`
- Verificação HTTP a cada 10 segundos
- Verificação TCP a cada 15 segundos

## Comandos Úteis

```bash
# Ver status da aplicação
flyctl status

# Ver logs em tempo real
flyctl logs

# Abrir shell na aplicação
flyctl ssh console

# Ver métricas
flyctl metrics

# Escalar aplicação
flyctl scale count 2

# Ver configuração atual
flyctl config show

# Reiniciar aplicação
flyctl restart
```

## Configuração de Domínio Customizado

```bash
# Adicionar domínio personalizado
flyctl certs create seudominio.com

# Verificar certificados
flyctl certs list

# Ver configuração DNS necessária
flyctl certs show seudominio.com
```

## Backup e Restore do Banco

```bash
# Fazer backup
flyctl postgres db dump military-recruitment-platform-db

# Restore (se necessário)
flyctl postgres db restore backup.sql military-recruitment-platform-db
```

## Custos Estimados

### Plano Gratuito (Hobby)
- Inclui recursos básicos para desenvolvimento e testes
- Até 3 aplicações pequenas
- 160 horas/mês de compute

### Plano Pago
- CPU compartilhada: ~$2/mês
- Memória (512MB): ~$2/mês
- PostgreSQL: ~$10/mês
- Tráfego: geralmente gratuito para volumes normais

## Troubleshooting

### Erro de Build
```bash
# Limpar cache e tentar novamente
flyctl deploy --no-cache
```

### Erro de Conexão com Banco
```bash
# Verificar se o banco está conectado
flyctl postgres list
flyctl postgres attach military-recruitment-platform-db
```

### Aplicação não Responde
```bash
# Ver logs para diagnóstico
flyctl logs --app military-recruitment-platform

# Reiniciar se necessário
flyctl restart
```

### Verificar Health Checks
```bash
# Ver status detalhado
flyctl status --all
```

## Segurança

- HTTPS forçado automaticamente
- Certificados SSL gerenciados automaticamente
- Variáveis de ambiente criptografadas
- Rede privada entre serviços

## Monitoramento em Produção

1. **Logs:** `flyctl logs` para monitorar em tempo real
2. **Métricas:** Dashboard disponível em https://fly.io/dashboard
3. **Alertas:** Configurar notificações por email para downtime
4. **Performance:** Usar `flyctl metrics` para análise de performance

Após o deploy, sua aplicação estará disponível em:
`https://military-recruitment-platform.fly.dev`