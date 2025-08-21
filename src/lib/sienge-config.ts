import { SiengeConfig } from '../types/sienge';

// Configuração da API do Sienge
export const siengeConfig: SiengeConfig = {
  baseUrl: process.env.VITE_SIENGE_API_URL || 'https://api.sienge.com.br',
  apiKey: process.env.VITE_SIENGE_API_KEY || '',
  timeout: 30000, // 30 segundos
};

// Endpoints da API
export const siengeEndpoints = {
  auth: '/auth/token',
  fornecedores: '/fornecedores',
  centrosCusto: '/centros-custo',
  lancamentos: '/lancamentos-financeiros',
  pagamentos: '/pagamentos',
  categorias: '/categorias',
} as const;

// Headers padrão para as requisições
export const getDefaultHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': token ? `Bearer ${token}` : '',
  'X-API-Key': siengeConfig.apiKey,
});

// Validação da configuração
export const validateSiengeConfig = (): boolean => {
  if (!siengeConfig.baseUrl) {
    console.error('Sienge API URL não configurada');
    return false;
  }
  
  if (!siengeConfig.apiKey) {
    console.error('Sienge API Key não configurada');
    return false;
  }
  
  return true;
};