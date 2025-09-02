import { SiengeConfig } from '../types/sienge';

// Configuração da API do Sienge baseada na documentação oficial
// https://api.sienge.com.br/docs/#/bill-debt-v1
export const siengeConfig: SiengeConfig = {
  baseUrl: import.meta.env.VITE_SIENGE_API_URL || 'https://api.sienge.com.br',
  clientId: import.meta.env.VITE_SIENGE_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_SIENGE_CLIENT_SECRET || '',
  timeout: 30000, // 30 segundos
};

// Endpoints da API baseados na documentação oficial
export const siengeEndpoints = {
  // Autenticação OAuth2
  auth: '/oauth/token',
  
  // Contas a Pagar (Bill Debt)
  billDebts: '/bill-debt/v1',
  billDebt: (id: number) => `/bill-debt/v1/${id}`,
  
  // Contas a Receber (Bill Credit)
  billCredits: '/bill-credit/v1',
  billCredit: (id: number) => `/bill-credit/v1/${id}`,
  
  // Fornecedores (Suppliers)
  suppliers: '/supplier/v1',
  supplier: (id: number) => `/supplier/v1/${id}`,
  
  // Centros de Custo (Cost Centers)
  costCenters: '/cost-center/v1',
  costCenter: (id: number) => `/cost-center/v1/${id}`,
  
  // Categorias
  categories: '/category/v1',
  category: (id: number) => `/category/v1/${id}`,
  
  // Pagamentos
  payments: '/payment/v1',
  payment: (id: number) => `/payment/v1/${id}`,
  
  // Recebimentos
  receipts: '/receipt/v1',
  receipt: (id: number) => `/receipt/v1/${id}`,
} as const;

// Headers padrão para as requisições
export const getDefaultHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': token ? `Bearer ${token}` : '',
});

// Headers para autenticação OAuth2
export const getAuthHeaders = () => ({
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'application/json',
});

// Validação da configuração
export const validateSiengeConfig = (): boolean => {
  if (!siengeConfig.baseUrl) {
    console.error('Sienge API URL não configurada');
    return false;
  }
  
  if (!siengeConfig.clientId) {
    console.error('Sienge Client ID não configurado');
    return false;
  }
  
  if (!siengeConfig.clientSecret) {
    console.error('Sienge Client Secret não configurado');
    return false;
  }
  
  return true;
};

// Configuração para autenticação OAuth2
export const getOAuth2Config = () => ({
  grant_type: 'client_credentials',
  client_id: siengeConfig.clientId,
  client_secret: siengeConfig.clientSecret,
  scope: 'read write',
});