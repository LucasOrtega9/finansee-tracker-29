# Configuração de Ambiente - Sienge Dashboard

Este documento explica como configurar as variáveis de ambiente para o projeto Sienge Dashboard.

## 🚀 Configuração Rápida

### 1. Copiar arquivo de exemplo
```bash
cp .env.example .env
```

### 2. Configurar credenciais OAuth2
Edite o arquivo `.env` e configure:
```bash
VITE_SIENGE_CLIENT_ID=seu_client_id_real
VITE_SIENGE_CLIENT_SECRET=seu_client_secret_real
```

### 3. Executar o projeto
```bash
npm run dev
```

## 📁 Arquivos de Ambiente

### `.env.example`
- **Propósito**: Template com todas as variáveis disponíveis
- **Uso**: Copiar para `.env` e configurar
- **Commit**: ✅ Sim (template público)

### `.env`
- **Propósito**: Configuração principal do projeto
- **Uso**: Configurações específicas do ambiente
- **Commit**: ❌ Não (contém credenciais)

### `.env.local`
- **Propósito**: Configurações locais de desenvolvimento
- **Uso**: Override de configurações para desenvolvimento
- **Commit**: ❌ Não (configurações locais)

### `.env.development`
- **Propósito**: Configurações específicas de desenvolvimento
- **Uso**: Ambiente de desenvolvimento
- **Commit**: ✅ Sim (configurações padrão)

### `.env.production`
- **Propósito**: Configurações específicas de produção
- **Uso**: Ambiente de produção
- **Commit**: ✅ Sim (configurações padrão)

## 🔑 Variáveis Obrigatórias

### API do Sienge
```bash
# URL da API (obrigatória)
VITE_SIENGE_API_URL=https://api.sienge.com.br

# Credenciais OAuth2 (obrigatórias)
VITE_SIENGE_CLIENT_ID=seu_client_id_aqui
VITE_SIENGE_CLIENT_SECRET=seu_client_secret_aqui
```

### Aplicativo
```bash
# Nome e versão (obrigatórias)
VITE_APP_TITLE=Sienge Dashboard
VITE_APP_VERSION=1.0.0
```

## ⚙️ Variáveis Opcionais

### Desenvolvimento
```bash
# Ambiente
NODE_ENV=development

# Servidor local
VITE_DEV_SERVER_PORT=3000
VITE_DEV_SERVER_HOST=localhost
```

### Performance
```bash
# Timeout da API (padrão: 30s)
VITE_API_TIMEOUT=30000

# Atualização automática (padrão: 30s)
VITE_DATA_REFRESH_INTERVAL=30000

# Cache React Query (padrão: 5min)
VITE_QUERY_CACHE_TIME=300000
```

### Logs
```bash
# Nível de log (debug, info, warn, error)
VITE_LOG_LEVEL=info

# Logs da API
VITE_API_LOGGING=true

# Logs de performance
VITE_PERFORMANCE_LOGGING=false
```

### Features
```bash
# Modo escuro
VITE_ENABLE_DARK_MODE=true

# Notificações push
VITE_ENABLE_PUSH_NOTIFICATIONS=false

# Exportação de dados
VITE_ENABLE_DATA_EXPORT=true

# Filtros avançados
VITE_ENABLE_ADVANCED_FILTERS=true
```

## 🔒 Segurança

### ❌ NUNCA commite
- `.env` (contém credenciais reais)
- `.env.local` (configurações locais)
- Qualquer arquivo com credenciais

### ✅ Pode commitar
- `.env.example` (template público)
- `.env.development` (configurações padrão)
- `.env.production` (configurações padrão)

## 🌍 Ambientes

### Desenvolvimento Local
```bash
# Usar .env.local para configurações específicas
cp .env.example .env.local
# Editar .env.local com suas credenciais
```

### Desenvolvimento (Equipe)
```bash
# Usar .env.development para configurações compartilhadas
cp .env.example .env.development
# Configurar credenciais de desenvolvimento
```

### Produção
```bash
# Usar variáveis de ambiente do servidor
# NÃO usar arquivos .env em produção
```

## 🚨 Troubleshooting

### Erro: "Configuração da API do Sienge inválida"
**Causa**: Credenciais OAuth2 não configuradas
**Solução**: Configure `VITE_SIENGE_CLIENT_ID` e `VITE_SIENGE_CLIENT_SECRET`

### Erro: "Timeout na requisição"
**Causa**: `VITE_API_TIMEOUT` muito baixo
**Solução**: Aumente o valor (ex: 60000 para 60s)

### Erro: "API não responde"
**Causa**: URL da API incorreta
**Solução**: Verifique `VITE_SIENGE_API_URL`

### Dados não atualizam
**Causa**: `VITE_DATA_REFRESH_INTERVAL` muito alto
**Solução**: Diminua o valor (ex: 15000 para 15s)

## 📋 Checklist de Configuração

- [ ] Copiou `.env.example` para `.env`
- [ ] Configurou `VITE_SIENGE_CLIENT_ID`
- [ ] Configurou `VITE_SIENGE_CLIENT_SECRET`
- [ ] Verificou `VITE_SIENGE_API_URL`
- [ ] Configurou `VITE_APP_TITLE` e `VITE_APP_VERSION`
- [ ] Ajustou configurações de performance conforme necessário
- [ ] Configurou logs para desenvolvimento
- [ ] Testou a conexão com a API

## 🔄 Atualizações

### Adicionar nova variável
1. Adicione no `.env.example`
2. Documente aqui
3. Use no código com `import.meta.env.VITE_NOVA_VARIAVEL`

### Remover variável
1. Remova do `.env.example`
2. Atualize documentação
3. Remova do código

## 📞 Suporte

Para problemas com configuração de ambiente:
1. Verifique este documento
2. Consulte o troubleshooting
3. Abra uma issue no GitHub
4. Entre em contato com a equipe

## 📚 Referências

- [Documentação da API do Sienge](https://api.sienge.com.br/docs/#/bill-debt-v1)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [OAuth2 Client Credentials](https://oauth.net/2/grant-types/client-credentials/)