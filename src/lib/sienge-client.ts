import { siengeConfig, siengeEndpoints, getDefaultHeaders, validateSiengeConfig } from './sienge-config';
import { ApiResponse, ApiError, SiengeAuth } from '../types/sienge';

class SiengeApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    if (!validateSiengeConfig()) {
      throw new Error('Configuração da API do Sienge inválida');
    }
    
    this.baseUrl = siengeConfig.baseUrl;
    this.timeout = siengeConfig.timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...getDefaultHeaders(token),
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Timeout na requisição para a API do Sienge');
        }
        throw error;
      }
      
      throw new Error('Erro desconhecido na comunicação com a API do Sienge');
    }
  }

  // Autenticação
  async authenticate(username: string, password: string): Promise<SiengeAuth> {
    const response = await this.request<SiengeAuth>(siengeEndpoints.auth, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    return response.data;
  }

  // Fornecedores
  async getFornecedores(token: string, params?: {
    page?: number;
    pageSize?: number;
    ativo?: boolean;
    search?: string;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.ativo !== undefined) queryParams.append('ativo', params.ativo.toString());
    if (params?.search) queryParams.append('search', params.search);

    const endpoint = `${siengeEndpoints.fornecedores}?${queryParams.toString()}`;
    return this.request<any[]>(endpoint, { method: 'GET' }, token);
  }

  async getFornecedor(token: string, id: number): Promise<ApiResponse<any>> {
    const endpoint = `${siengeEndpoints.fornecedores}/${id}`;
    return this.request<any>(endpoint, { method: 'GET' }, token);
  }

  // Centros de Custo
  async getCentrosCusto(token: string, params?: {
    page?: number;
    pageSize?: number;
    ativo?: boolean;
    search?: string;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.ativo !== undefined) queryParams.append('ativo', params.ativo.toString());
    if (params?.search) queryParams.append('search', params.search);

    const endpoint = `${siengeEndpoints.centrosCusto}?${queryParams.toString()}`;
    return this.request<any[]>(endpoint, { method: 'GET' }, token);
  }

  async getCentroCusto(token: string, id: number): Promise<ApiResponse<any>> {
    const endpoint = `${siengeEndpoints.centrosCusto}/${id}`;
    return this.request<any>(endpoint, { method: 'GET' }, token);
  }

  // Lançamentos Financeiros
  async getLancamentos(token: string, params?: {
    page?: number;
    pageSize?: number;
    tipo?: 'receita' | 'despesa';
    status?: string;
    dataInicio?: string;
    dataFim?: string;
    fornecedorId?: number;
    centroCustoId?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.tipo) queryParams.append('tipo', params.tipo);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.dataInicio) queryParams.append('dataInicio', params.dataInicio);
    if (params?.dataFim) queryParams.append('dataFim', params.dataFim);
    if (params?.fornecedorId) queryParams.append('fornecedorId', params.fornecedorId.toString());
    if (params?.centroCustoId) queryParams.append('centroCustoId', params.centroCustoId.toString());

    const endpoint = `${siengeEndpoints.lancamentos}?${queryParams.toString()}`;
    return this.request<any[]>(endpoint, { method: 'GET' }, token);
  }

  async getLancamento(token: string, id: number): Promise<ApiResponse<any>> {
    const endpoint = `${siengeEndpoints.lancamentos}/${id}`;
    return this.request<any>(endpoint, { method: 'GET' }, token);
  }

  // Pagamentos
  async getPagamentos(token: string, params?: {
    page?: number;
    pageSize?: number;
    dataInicio?: string;
    dataFim?: string;
    lancamentoId?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params?.dataInicio) queryParams.append('dataInicio', params.dataInicio);
    if (params?.dataFim) queryParams.append('dataFim', params.dataFim);
    if (params?.lancamentoId) queryParams.append('lancamentoId', params.lancamentoId.toString());

    const endpoint = `${siengeEndpoints.pagamentos}?${queryParams.toString()}`;
    return this.request<any[]>(endpoint, { method: 'GET' }, token);
  }

  async getPagamento(token: string, id: number): Promise<ApiResponse<any>> {
    const endpoint = `${siengeEndpoints.pagamentos}/${id}`;
    return this.request<any>(endpoint, { method: 'GET' }, token);
  }
}

// Instância singleton do cliente
export const siengeClient = new SiengeApiClient();
export default siengeClient;