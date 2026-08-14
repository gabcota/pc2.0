#!/bin/bash

# Script para deploy no Fly.io
echo "🚀 Iniciando deploy no Fly.io..."

# Verificar se o Fly CLI está instalado
if ! command -v flyctl &> /dev/null; then
    echo "❌ Fly CLI não encontrado. Instale em: https://fly.io/docs/getting-started/installing-flyctl/"
    exit 1
fi

# Verificar se está logado no Fly.io
if ! flyctl auth whoami &> /dev/null; then
    echo "❌ Você não está logado no Fly.io. Execute: flyctl auth login"
    exit 1
fi

# Fazer build da aplicação usando o script de deploy otimizado
echo "📦 Executando build de produção..."
if [ -f "scripts/build-deploy.js" ]; then
    node scripts/build-deploy.js
else
    npm run build
fi

# Verificar se os arquivos foram gerados
if [ ! -f "dist/index.js" ]; then
    echo "❌ Arquivo dist/index.js não encontrado. Build falhou."
    exit 1
fi

# Verificar se a aplicação já existe
APP_NAME=$(grep "^app = " fly.toml | cut -d'"' -f2)
if flyctl apps list | grep -q "$APP_NAME"; then
    echo "📋 Aplicação $APP_NAME já existe. Fazendo deploy..."
    flyctl deploy
else
    echo "🆕 Criando nova aplicação no Fly.io..."
    flyctl launch --no-deploy
    
    echo "🔧 Configurando PostgreSQL..."
    flyctl postgres create --name "${APP_NAME}-db" --region gru
    flyctl postgres attach "${APP_NAME}-db"
    
    echo "📤 Fazendo deploy inicial..."
    flyctl deploy
fi

echo "✅ Deploy concluído!"
echo "🌐 Sua aplicação está disponível em: https://${APP_NAME}.fly.dev"

# Verificar status da aplicação
echo "📊 Status da aplicação:"
flyctl status