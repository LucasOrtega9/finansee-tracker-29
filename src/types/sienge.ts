// Tipos baseados na documentação oficial da API do Sienge
// https://api.sienge.com.br/docs/#/bill-debt-v1

export interface SiengeAuth {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface SiengeConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  timeout: number;
}

// Tipos para Contas a Pagar (Bill Debt)
export interface BillDebt {
  id: number;
  code: string;
  description: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  supplier: {
    id: number;
    name: string;
    document: string;
  };
  costCenter: {
    id: number;
    code: string;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para Contas a Receber (Bill Credit)
export interface BillCredit {
  id: number;
  code: string;
  description: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  customer: {
    id: number;
    name: string;
    document: string;
  };
  costCenter: {
    id: number;
    code: string;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para Fornecedores (Suppliers)
export interface Supplier {
  id: number;
  code: string;
  name: string;
  document: string;
  email?: string;
  phone?: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tipos para Centros de Custo (Cost Centers)
export interface CostCenter {
  id: number;
  code: string;
  name: string;
  description?: string;
  active: boolean;
  parentCostCenter?: {
    id: number;
    code: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Tipos para Categorias
export interface Category {
  id: number;
  code: string;
  name: string;
  description?: string;
  active: boolean;
  type: 'EXPENSE' | 'REVENUE';
  createdAt: string;
  updatedAt: string;
}

// Tipos para Pagamentos
export interface Payment {
  id: number;
  billId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  documentNumber?: string;
  observations?: string;
  createdAt: string;
}

// Tipos para Recebimentos
export interface Receipt {
  id: number;
  billId: number;
  amount: number;
  receiptDate: string;
  receiptMethod: string;
  documentNumber?: string;
  observations?: string;
  createdAt: string;
}

// Tipos para Filtros de busca
export interface BillDebtFilters {
  page?: number;
  size?: number;
  status?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  supplierId?: number;
  costCenterId?: number;
  categoryId?: number;
  amountFrom?: number;
  amountTo?: number;
}

export interface BillCreditFilters {
  page?: number;
  size?: number;
  status?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  customerId?: number;
  costCenterId?: number;
  categoryId?: number;
  amountFrom?: number;
  amountTo?: number;
}

export interface SupplierFilters {
  page?: number;
  size?: number;
  active?: boolean;
  search?: string;
}

export interface CostCenterFilters {
  page?: number;
  size?: number;
  active?: boolean;
  search?: string;
}

// Respostas da API
export interface ApiResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  empty: boolean;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

// Estatísticas
export interface FinancialStats {
  totalReceivables: number;
  totalPayables: number;
  pendingReceivables: number;
  pendingPayables: number;
  overdueReceivables: number;
  overduePayables: number;
  totalPayments: number;
  totalReceipts: number;
  averagePaymentAmount: number;
  averageReceiptAmount: number;
}