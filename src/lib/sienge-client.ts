import { siengeConfig, siengeEndpoints, getDefaultHeaders, getAuthHeaders, getOAuth2Config, validateSiengeConfig } from './sienge-config';
import { 
  ApiResponse, 
  ApiError, 
  SiengeAuth, 
  BillDebt, 
  BillCredit, 
  Supplier, 
  CostCenter, 
  Category,
  Payment,
  Receipt,
  BillDebtFilters,
  BillCreditFilters,
  SupplierFilters,
  CostCenterFilters
} from '../types/sienge';

class SiengeApiClient {
  private baseUrl: string;
  private timeout: number;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

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
    requireAuth: boolean = true
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      // Verificar se precisa renovar o token
      if (requireAuth && this.shouldRefreshToken()) {
        await this.authenticate();
      }

      const headers = requireAuth && this.accessToken 
        ? { ...getDefaultHeaders(this.accessToken), ...options.headers }
        : { ...getDefaultHeaders(), ...options.headers };

      const response = await fetch(url, {
        ...options,
        headers,
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

  private shouldRefreshToken(): boolean {
    if (!this.accessToken || !this.tokenExpiry) return true;
    
    // Renovar token 5 minutos antes da expiração
    const now = Date.now();
    const refreshTime = this.tokenExpiry - (5 * 60 * 1000);
    
    return now >= refreshTime;
  }

  // Autenticação OAuth2
  async authenticate(): Promise<SiengeAuth> {
    const oauthConfig = getOAuth2Config();
    const formData = new URLSearchParams();
    
    Object.entries(oauthConfig).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await this.request<SiengeAuth>(siengeEndpoints.auth, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    }, false);

    // Armazenar token e calcular expiração
    this.accessToken = response.access_token;
    this.tokenExpiry = Date.now() + (response.expires_in * 1000);
    
    return response;
  }

  // Contas a Pagar (Bill Debt)
  async getBillDebts(filters?: BillDebtFilters): Promise<ApiResponse<BillDebt>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `${siengeEndpoints.billDebts}?${queryParams.toString()}`;
    return this.request<ApiResponse<BillDebt>>(endpoint, { method: 'GET' });
  }

  async getBillDebt(id: number): Promise<BillDebt> {
    const endpoint = siengeEndpoints.billDebt(id);
    return this.request<BillDebt>(endpoint, { method: 'GET' });
  }

  // Contas a Receber (Bill Credit)
  async getBillCredits(filters?: BillCreditFilters): Promise<ApiResponse<BillCredit>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `${siengeEndpoints.billCredits}?${queryParams.toString()}`;
    return this.request<ApiResponse<BillCredit>>(endpoint, { method: 'GET' });
  }

  async getBillCredit(id: number): Promise<BillCredit> {
    const endpoint = siengeEndpoints.billCredit(id);
    return this.request<BillCredit>(endpoint, { method: 'GET' });
  }

  // Fornecedores (Suppliers)
  async getSuppliers(filters?: SupplierFilters): Promise<ApiResponse<Supplier>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `${siengeEndpoints.suppliers}?${queryParams.toString()}`;
    return this.request<ApiResponse<Supplier>>(endpoint, { method: 'GET' });
  }

  async getSupplier(id: number): Promise<Supplier> {
    const endpoint = siengeEndpoints.supplier(id);
    return this.request<Supplier>(endpoint, { method: 'GET' });
  }

  // Centros de Custo (Cost Centers)
  async getCostCenters(filters?: CostCenterFilters): Promise<ApiResponse<CostCenter>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `${siengeEndpoints.costCenters}?${queryParams.toString()}`;
    return this.request<ApiResponse<CostCenter>>(endpoint, { method: 'GET' });
  }

  async getCostCenter(id: number): Promise<CostCenter> {
    const endpoint = siengeEndpoints.costCenter(id);
    return this.request<CostCenter>(endpoint, { method: 'GET' });
  }

  // Categorias
  async getCategories(): Promise<ApiResponse<Category>> {
    const endpoint = siengeEndpoints.categories;
    return this.request<ApiResponse<Category>>(endpoint, { method: 'GET' });
  }

  async getCategory(id: number): Promise<Category> {
    const endpoint = siengeEndpoints.category(id);
    return this.request<Category>(endpoint, { method: 'GET' });
  }

  // Pagamentos
  async getPayments(filters?: {
    page?: number;
    size?: number;
    billId?: number;
    paymentDateFrom?: string;
    paymentDateTo?: string;
  }): Promise<ApiResponse<Payment>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `${siengeEndpoints.payments}?${queryParams.toString()}`;
    return this.request<ApiResponse<Payment>>(endpoint, { method: 'GET' });
  }

  async getPayment(id: number): Promise<Payment> {
    const endpoint = siengeEndpoints.payment(id);
    return this.request<Payment>(endpoint, { method: 'GET' });
  }

  // Recebimentos
  async getReceipts(filters?: {
    page?: number;
    size?: number;
    billId?: number;
    receiptDateFrom?: string;
    receiptDateTo?: string;
  }): Promise<ApiResponse<Receipt>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `${siengeEndpoints.receipts}?${queryParams.toString()}`;
    return this.request<ApiResponse<Receipt>>(endpoint, { method: 'GET' });
  }

  async getReceipt(id: number): Promise<Receipt> {
    const endpoint = siengeEndpoints.receipt(id);
    return this.request<Receipt>(endpoint, { method: 'GET' });
  }

  // Método para verificar se está autenticado
  isAuthenticated(): boolean {
    return !!this.accessToken && !this.shouldRefreshToken();
  }

  // Método para obter o token atual
  getCurrentToken(): string | null {
    return this.accessToken;
  }
}

// Instância singleton do cliente
export const siengeClient = new SiengeApiClient();
export default siengeClient;