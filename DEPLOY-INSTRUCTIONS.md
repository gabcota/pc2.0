# Instruções de Deploy

## Para Deploy Automático (Replit)

Configure o deploy no Replit com estas configurações:

**Build Command:**
```
node scripts/build-deploy.js
```

**Run Command:**
```
node dist/index.js
```

## Para Deploy Manual

### 1. Execute o Build de Deploy
```bash
node scripts/build-deploy.js
```

### 2. Verificar Arquivos Gerados
Confirme que estes arquivos existem:
- `dist/index.js` (servidor)
- `dist/public/index.html`
- `dist/public/assets/[hash].css`
- `dist/public/assets/[hash].js`
- `dist/public/integrity.json`

### 3. Deploy dos Arquivos
Faça upload de toda a pasta `dist/` para seu servidor.

### 4. Iniciar o Servidor
```bash
cd dist
node index.js
```

## Variáveis de Ambiente Necessárias

Configure estas variáveis no seu ambiente de produção:
- `NODE_ENV=production`
- `DATABASE_URL` (se usando PostgreSQL)
- `PORT` (porta do servidor, padrão: 5000)

## Verificação de Deploy

Após o deploy, verifique:
1. Site carrega normalmente
2. F12 está bloqueado
3. Menu direito desabilitado
4. Classes CSS estão obfuscadas (inspecionar elemento)
5. Console bloqueado

## Arquivos Removidos Automaticamente

O script de deploy remove automaticamente:
- `class-mapping.json`
- `BUILD-PRODUCTION.md`
- `COMO-USAR-BUILD-PRODUCAO.md`
- `.gitignore.production`

Estes arquivos contêm informações sensíveis e não devem ir para produção.