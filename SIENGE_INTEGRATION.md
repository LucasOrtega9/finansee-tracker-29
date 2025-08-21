# Integração com API do Sienge

Este projeto implementa uma integração completa com a API oficial do Sienge para gerenciamento de dados financeiros, baseada na [documentação oficial](https://api.sienge.com.br/docs/#/bill-debt-v1).

## 🚀 Funcionalidades

### Autenticação OAuth2
- Autenticação segura via OAuth2 Client Credentials
- Gerenciamento automático de tokens
- Refresh automático de sessão

### Dashboard Principal
- **Visão Geral**: Resumo financeiro com métricas principais
- **Fornecedores**: Lista completa de fornecedores cadastrados
- **Centros de Custo**: Hierarquia de centros de custo
- **Contas a Pagar**: Gestão de contas a pagar (Bill Debt)
- **Contas a Receber**: Gestão de contas a receber (Bill Credit)
- **Pagamentos**: Histórico de pagamentos realizados
- **Recebimentos**: Histórico de recebimentos realizados

### Recursos Avançados
- Filtros e busca em tempo real
- Paginação inteligente
- Exportação de dados
- Atualizações automáticas
- Interface responsiva e moderna

## 📋 Pré-requisitos

- Node.js 18+ ou Bun
- Credenciais OAuth2 (Client ID e Client Secret) da API do Sienge
- Acesso à documentação oficial da API

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Configuração da API do Sienge
VITE_SIENGE_API_URL=https://api.sienge.com.br
VITE_SIENGE_CLIENT_ID=seu_client_id_aqui
VITE_SIENGE_CLIENT_SECRET=seu_client_secret_aqui

# Outras configurações
VITE_APP_TITLE=Sienge Dashboard
VITE_APP_VERSION=1.0.0
```

### 2. Instalação de Dependências

```bash
# Usando npm
npm install

# Usando yarn
yarn install

# Usando bun
bun install
```

### 3. Executar o Projeto

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview
```

## 🔌 Endpoints da API

### Autenticação OAuth2
- `POST /oauth/token` - Autenticação via Client Credentials

### Contas a Pagar (Bill Debt)
- `GET /bill-debt/v1` - Lista de contas a pagar
- `GET /bill-debt/v1/{id}` - Detalhes de uma conta a pagar

### Contas a Receber (Bill Credit)
- `GET /bill-credit/v1` - Lista de contas a receber
- `GET /bill-credit/v1/{id}` - Detalhes de uma conta a receber

### Fornecedores (Suppliers)
- `GET /supplier/v1` - Lista de fornecedores
- `GET /supplier/v1/{id}` - Detalhes de um fornecedor

### Centros de Custo (Cost Centers)
- `GET /cost-center/v1` - Lista de centros de custo
- `GET /cost-center/v1/{id}` - Detalhes de um centro de custo

### Categorias
- `GET /category/v1` - Lista de categorias
- `GET /category/v1/{id}` - Detalhes de uma categoria

### Pagamentos
- `GET /payment/v1` - Lista de pagamentos
- `GET /payment/v1/{id}` - Detalhes de um pagamento

### Recebimentos
- `GET /receipt/v1` - Lista de recebimentos
- `GET /receipt/v1/{id}` - Detalhes de um recebimento

## 🏗️ Estrutura do Projeto

```
src/
├── components/sienge/          # Componentes específicos do Sienge
│   ├── SiengeApp.tsx          # Componente principal
│   ├── SiengeLogin.tsx        # Tela de autenticação OAuth2
│   ├── SiengeDashboard.tsx    # Dashboard principal
│   ├── SiengeSuppliers.tsx    # Gestão de fornecedores
│   ├── SiengeCostCenters.tsx  # Gestão de centros de custo
│   ├── SiengeBillDebts.tsx    # Gestão de contas a pagar
│   ├── SiengeBillCredits.tsx  # Gestão de contas a receber
│   ├── SiengePayments.tsx     # Gestão de pagamentos
│   └── SiengeReceipts.tsx     # Gestão de recebimentos
├── hooks/                      # Hooks personalizados
│   ├── useSiengeAuth.ts       # Autenticação OAuth2
│   └── useSiengeData.ts       # Consumo de dados
├── lib/                        # Utilitários e configurações
│   ├── sienge-config.ts       # Configuração da API
│   └── sienge-client.ts       # Cliente HTTP OAuth2
└── types/                      # Tipos TypeScript
    └── sienge.ts              # Interfaces baseadas na documentação oficial
```

## 🎯 Como Usar

### 1. Importar o Componente

```tsx
import { SiengeApp } from '@/components/sienge/SiengeApp';

function App() {
  return (
    <div>
      <SiengeApp />
    </div>
  );
}
```

### 2. Configurar Credenciais OAuth2

Certifique-se de que as variáveis de ambiente estão configuradas corretamente:
- `VITE_SIENGE_CLIENT_ID`
- `VITE_SIENGE_CLIENT_SECRET`

### 3. Acessar o Dashboard

O sistema automaticamente:
- Autentica via OAuth2 Client Credentials
- Gerencia tokens e sessões automaticamente
- Exibe o dashboard com todos os dados

## 🔒 Segurança e OAuth2

- **Autenticação OAuth2**: Usa Client Credentials flow
- **Tokens seguros**: Armazenados com expiração automática
- **Refresh automático**: Renovação automática de tokens
- **Escopo limitado**: Apenas permissões necessárias (read/write)

## 📊 Dados Disponíveis

### Contas a Pagar (Bill Debt)
- Código, descrição, valor
- Data de vencimento e pagamento
- Status (PENDING, PAID, OVERDUE, CANCELLED)
- Fornecedor e centro de custo vinculados

### Contas a Receber (Bill Credit)
- Código, descrição, valor
- Data de vencimento e recebimento
- Status (PENDING, PAID, OVERDUE, CANCELLED)
- Cliente e centro de custo vinculados

### Fornecedores (Suppliers)
- Código, nome, documento (CNPJ/CPF)
- Informações de contato (email, telefone)
- Endereço completo
- Status ativo/inativo

### Centros de Custo (Cost Centers)
- Código e nome
- Descrição opcional
- Hierarquia (centro pai)
- Status ativo/inativo

### Categorias
- Código e nome
- Tipo (EXPENSE ou REVENUE)
- Descrição opcional

### Pagamentos e Recebimentos
- Valor e data
- Método de pagamento/recebimento
- Número do documento
- Observações

## 🚨 Tratamento de Erros

- Retry automático em falhas de rede
- Mensagens de erro baseadas na API oficial
- Fallbacks para dados indisponíveis
- Logs detalhados para debugging

## 🔄 Atualizações

- Dados são atualizados automaticamente
- Polling configurável para dados em tempo real
- Cache inteligente com React Query
- Invalidação automática de cache

## 📱 Responsividade

- Interface adaptável para mobile e desktop
- Componentes otimizados para diferentes tamanhos de tela
- Navegação intuitiva em dispositivos móveis

## 🧪 Testes

Para executar os testes:

```bash
npm run test
```

## 📈 Monitoramento

- Logs de requisições OAuth2
- Métricas de performance
- Tratamento de timeouts
- Monitoramento de erros de autenticação

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🆘 Suporte

Para suporte técnico ou dúvidas sobre a integração:

- Consulte a [documentação oficial da API do Sienge](https://api.sienge.com.br/docs/#/bill-debt-v1)
- Abra uma issue no GitHub
- Entre em contato com a equipe de desenvolvimento

## 🔮 Roadmap

- [ ] Integração com outras APIs financeiras
- [ ] Relatórios avançados baseados na API oficial
- [ ] Notificações em tempo real via webhooks
- [ ] Backup automático de dados
- [ ] Integração com sistemas de BI
- [ ] API REST para terceiros
- [ ] Auditoria completa de ações
- [ ] Suporte a múltiplos ambientes (dev, staging, prod)

## 📚 Documentação da API

Para mais detalhes sobre os endpoints e funcionalidades disponíveis, consulte:

- [Documentação da API do Sienge](https://api.sienge.com.br/docs/#/bill-debt-v1)
- [Especificação OAuth2](https://oauth.net/2/)
- [Padrões REST API](https://restfulapi.net/)