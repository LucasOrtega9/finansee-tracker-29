# Integração com API do Sienge

Este projeto implementa uma integração completa com a API do Sienge para gerenciamento de dados financeiros.

## 🚀 Funcionalidades

### Autenticação
- Login seguro com credenciais da API do Sienge
- Gerenciamento automático de tokens
- Refresh automático de sessão

### Dashboard Principal
- **Visão Geral**: Resumo financeiro com métricas principais
- **Fornecedores**: Lista completa de fornecedores cadastrados
- **Centros de Custo**: Hierarquia de centros de custo
- **Lançamentos**: Controle de receitas e despesas
- **Pagamentos**: Histórico de pagamentos realizados

### Recursos Avançados
- Filtros e busca em tempo real
- Paginação inteligente
- Exportação de dados
- Atualizações automáticas
- Interface responsiva e moderna

## 📋 Pré-requisitos

- Node.js 18+ ou Bun
- Credenciais de acesso à API do Sienge
- URL da API do Sienge

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Configuração da API do Sienge
VITE_SIENGE_API_URL=https://api.sienge.com.br
VITE_SIENGE_API_KEY=sua_chave_api_aqui

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

### Autenticação
- `POST /auth/token` - Autenticação de usuário

### Fornecedores
- `GET /fornecedores` - Lista de fornecedores
- `GET /fornecedores/{id}` - Detalhes de um fornecedor

### Centros de Custo
- `GET /centros-custo` - Lista de centros de custo
- `GET /centros-custo/{id}` - Detalhes de um centro de custo

### Lançamentos Financeiros
- `GET /lancamentos-financeiros` - Lista de lançamentos
- `GET /lancamentos-financeiros/{id}` - Detalhes de um lançamento

### Pagamentos
- `GET /pagamentos` - Lista de pagamentos
- `GET /pagamentos/{id}` - Detalhes de um pagamento

## 🏗️ Estrutura do Projeto

```
src/
├── components/sienge/          # Componentes específicos do Sienge
│   ├── SiengeApp.tsx          # Componente principal
│   ├── SiengeLogin.tsx        # Tela de login
│   ├── SiengeDashboard.tsx    # Dashboard principal
│   ├── SiengeFornecedores.tsx # Gestão de fornecedores
│   ├── SiengeCentrosCusto.tsx # Gestão de centros de custo
│   ├── SiengeLancamentos.tsx  # Gestão de lançamentos
│   └── SiengePagamentos.tsx   # Gestão de pagamentos
├── hooks/                      # Hooks personalizados
│   ├── useSiengeAuth.ts       # Autenticação
│   └── useSiengeData.ts       # Consumo de dados
├── lib/                        # Utilitários e configurações
│   ├── sienge-config.ts       # Configuração da API
│   └── sienge-client.ts       # Cliente HTTP
└── types/                      # Tipos TypeScript
    └── sienge.ts              # Interfaces da API
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

### 2. Configurar Credenciais

Certifique-se de que as variáveis de ambiente estão configuradas corretamente.

### 3. Acessar o Dashboard

O sistema automaticamente:
- Exibe a tela de login se não autenticado
- Redireciona para o dashboard após autenticação
- Gerencia sessões e tokens automaticamente

## 🔒 Segurança

- Tokens são armazenados no localStorage (considere usar httpOnly cookies em produção)
- Refresh automático de tokens
- Validação de credenciais
- Timeout configurável para requisições

## 📊 Dados Disponíveis

### Fornecedores
- Código, nome, CNPJ/CPF
- Informações de contato (email, telefone)
- Endereço completo
- Status ativo/inativo

### Centros de Custo
- Código e nome
- Descrição opcional
- Hierarquia (centro pai)
- Status ativo/inativo

### Lançamentos Financeiros
- Tipo (receita/despesa)
- Valor e descrição
- Datas de vencimento e pagamento
- Status (pendente, pago, vencido, cancelado)
- Vinculação com fornecedor e centro de custo

### Pagamentos
- Valor e data
- Forma de pagamento
- Número do documento
- Observações

## 🚨 Tratamento de Erros

- Retry automático em falhas de rede
- Mensagens de erro amigáveis
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

- Logs de requisições
- Métricas de performance
- Tratamento de timeouts
- Monitoramento de erros

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

- Abra uma issue no GitHub
- Consulte a documentação da API do Sienge
- Entre em contato com a equipe de desenvolvimento

## 🔮 Roadmap

- [ ] Integração com outras APIs financeiras
- [ ] Relatórios avançados
- [ ] Notificações em tempo real
- [ ] Backup automático de dados
- [ ] Integração com sistemas de BI
- [ ] API REST para terceiros
- [ ] Webhooks para eventos
- [ ] Auditoria completa de ações