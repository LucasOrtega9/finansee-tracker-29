# Prompt para Desenvolvimento Backend - Integração Sienge

## 🎯 Objetivo
Criar um backend Node.js/Express robusto para integração com a API do Sienge, incluindo autenticação OAuth2, endpoints RESTful, cache inteligente e processamento de dados financeiros.

## 📋 Especificações Técnicas

### Stack Tecnológico
- **Runtime**: Node.js 18+ ou Bun
- **Framework**: Express.js com TypeScript
- **Autenticação**: OAuth2 (client_credentials)
- **Cache**: Redis ou Node-cache
- **Banco de Dados**: PostgreSQL ou SQLite
- **Validação**: Zod ou Joi
- **Logging**: Winston
- **Testes**: Jest + Supertest

### Estrutura do Projeto
```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── sienge.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── billDebts.controller.ts
│   │   ├── billCredits.controller.ts
│   │   ├── suppliers.controller.ts
│   │   ├── costCenters.controller.ts
│   │   └── dashboard.controller.ts
│   ├── services/
│   │   ├── sienge.service.ts
│   │   ├── cache.service.ts
│   │   └── webhook.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── validation.middleware.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── BillDebt.ts
│   │   ├── Supplier.ts
│   │   └── CostCenter.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── sienge.routes.ts
│   │   └── api.routes.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   └── helpers.ts
│   └── app.ts
├── tests/
├── docs/
└── package.json
```

## 🔐 Implementações Obrigatórias

### 1. Autenticação OAuth2 com Sienge
```typescript
// Implementar em src/services/sienge.service.ts
class SiengeService {
  private async authenticate(): Promise<SiengeAuth>
  private async refreshToken(): Promise<void>
  private isTokenValid(): boolean
  
  // Métodos principais da API
  async getBillDebts(filters: BillDebtFilters): Promise<ApiResponse<BillDebt>>
  async getBillCredits(filters: BillCreditFilters): Promise<ApiResponse<BillCredit>>
  async getSuppliers(filters: SupplierFilters): Promise<ApiResponse<Supplier>>
  async getCostCenters(filters: CostCenterFilters): Promise<ApiResponse<CostCenter>>
  async getPayments(filters: PaymentFilters): Promise<ApiResponse<Payment>>
}
```

### 2. Endpoints RESTful
```typescript
// Rotas principais (src/routes/sienge.routes.ts)
GET    /api/sienge/auth/status          // Status da autenticação
POST   /api/sienge/auth/connect         // Conectar com Sienge
GET    /api/sienge/dashboard            // Dashboard com estatísticas
GET    /api/sienge/bill-debts           // Contas a pagar
GET    /api/sienge/bill-credits         // Contas a receber
GET    /api/sienge/suppliers            // Fornecedores
GET    /api/sienge/cost-centers         // Centros de custo
GET    /api/sienge/payments             // Pagamentos
GET    /api/sienge/receipts             // Recebimentos
GET    /api/sienge/categories           // Categorias
POST   /api/sienge/sync                 // Sincronização manual
```

### 3. Sistema de Cache Inteligente
```typescript
// src/services/cache.service.ts
class CacheService {
  // Cache com TTL diferentes por tipo de dado
  private static readonly CACHE_TTL = {
    AUTH_TOKEN: 3300, // 55 min (token expira em 1h)
    SUPPLIERS: 300,   // 5 min
    COST_CENTERS: 300, // 5 min
    BILL_DEBTS: 120,  // 2 min
    BILL_CREDITS: 120, // 2 min
    PAYMENTS: 60,     // 1 min
    RECEIPTS: 60      // 1 min
  };
  
  async get<T>(key: string): Promise<T | null>
  async set(key: string, value: any, ttl?: number): Promise<void>
  async invalidate(pattern: string): Promise<void>
}
```

### 4. Middleware de Segurança
```typescript
// src/middleware/auth.middleware.ts
export const authenticateToken = (req: Request, res: Response, next: NextFunction)
export const validateSiengeConnection = (req: Request, res: Response, next: NextFunction)

// src/middleware/rateLimit.middleware.ts
export const rateLimitSienge = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // 30 requests por minuto por IP
  message: 'Muitas requisições para a API Sienge'
});
```

### 5. Processamento de Dados e Estatísticas
```typescript
// src/controllers/dashboard.controller.ts
export const getDashboardStats = async (req: Request, res: Response) => {
  // Calcular estatísticas financeiras
  // Agrupar dados por período
  // Gerar gráficos e métricas
  // Retornar dados formatados para o frontend
}
```

## 🔄 Sincronização e Webhooks

### Sistema de Sincronização
```typescript
// src/services/webhook.service.ts
class WebhookService {
  // Sincronização automática a cada 15 minutos
  async scheduledSync(): Promise<void>
  
  // Sincronização manual via endpoint
  async manualSync(entities: string[]): Promise<SyncResult>
  
  // Processar webhooks do Sienge (se disponível)
  async processWebhook(payload: SiengeWebhook): Promise<void>
}
```

## 📊 Banco de Dados

### Esquema Principal
```sql
-- Tabelas para cache local e auditoria
CREATE TABLE sienge_sync_log (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  sync_date TIMESTAMP DEFAULT NOW(),
  records_count INTEGER,
  status VARCHAR(20) DEFAULT 'success',
  error_message TEXT
);

CREATE TABLE sienge_credentials (
  id SERIAL PRIMARY KEY,
  client_id VARCHAR(255) NOT NULL,
  client_secret VARCHAR(255) NOT NULL,
  base_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cache de dados críticos (opcional)
CREATE TABLE cached_bill_debts (
  id INTEGER PRIMARY KEY,
  sienge_data JSONB NOT NULL,
  cached_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Comandos de Inicialização

### Package.json
```json
{
  "name": "sienge-integration-backend",
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "seed": "tsx src/scripts/seed.ts"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "axios": "^1.6.2",
    "redis": "^4.6.10",
    "pg": "^8.11.3",
    "zod": "^3.22.4",
    "winston": "^3.11.0",
    "node-cron": "^3.0.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.0",
    "tsx": "^4.6.0",
    "typescript": "^5.3.2",
    "jest": "^29.7.0",
    "@types/jest": "^29.5.8",
    "supertest": "^6.3.3"
  }
}
```

## 🌐 Variáveis de Ambiente
```env
# Servidor
PORT=3001
NODE_ENV=development

# Sienge API
SIENGE_API_URL=https://api.sienge.com.br
SIENGE_CLIENT_ID=your_client_id
SIENGE_CLIENT_SECRET=your_client_secret

# Banco de Dados
DATABASE_URL=postgresql://user:password@localhost:5432/sienge_db

# Redis
REDIS_URL=redis://localhost:6379

# Segurança
JWT_SECRET=your_jwt_secret
API_SECRET_KEY=your_api_secret

# Logs
LOG_LEVEL=info
```

## 📈 Funcionalidades Avançadas

### 1. Sistema de Retry com Backoff
```typescript
// Para requisições que falham
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T>
```

### 2. Compressão de Respostas
```typescript
// Middleware para compressão
app.use(compression());
```

### 3. Monitoramento e Métricas
```typescript
// Endpoints de health check
GET /health              // Status do servidor
GET /health/sienge       // Status da conexão Sienge
GET /health/database     // Status do banco
GET /health/cache        // Status do cache
```

### 4. Documentação Automática
```typescript
// Swagger/OpenAPI
GET /api-docs            // Documentação interativa
```

## 🧪 Testes Obrigatórios

### Cobertura Mínima: 80%
- Testes de integração com Sienge API
- Testes de autenticação OAuth2
- Testes de cache e invalidação
- Testes de rate limiting
- Testes de endpoints RESTful
- Testes de sincronização

## 📝 Logs e Auditoria

### Estrutura de Logs
```typescript
// Logs estruturados em JSON
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "service": "sienge-api",
  "action": "get_bill_debts",
  "user_id": "12345",
  "duration_ms": 245,
  "status": "success",
  "records_count": 150
}
```

## 🚨 Tratamento de Erros

### Classes de Erro Customizadas
```typescript
export class SiengeAPIError extends Error
export class AuthenticationError extends Error
export class RateLimitError extends Error
export class ValidationError extends Error
```

## 🔧 Deploy e Produção

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/app.js"]
```

### Scripts de Deploy
```bash
# Build e deploy
npm run build
docker build -t sienge-backend .
docker run -d -p 3001:3001 --env-file .env sienge-backend
```

---

## ✅ Checklist de Implementação

- [ ] Configuração do projeto TypeScript/Express
- [ ] Implementação do cliente OAuth2 Sienge
- [ ] Sistema de cache com Redis
- [ ] Endpoints RESTful completos
- [ ] Middleware de segurança e rate limiting
- [ ] Sistema de logs estruturados
- [ ] Testes unitários e de integração
- [ ] Documentação da API
- [ ] Sistema de sincronização automática
- [ ] Deploy com Docker
- [ ] Monitoramento e health checks

**Meta: Backend completo, seguro e escalável em 2-3 dias de desenvolvimento!**