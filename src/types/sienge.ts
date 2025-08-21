// Tipos para a API do Sienge

export interface SiengeAuth {
  token: string;
  expiresAt: string;
  userId: string;
}

export interface SiengeConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

export interface Fornecedor {
  id: number;
  codigo: string;
  nome: string;
  cnpjCpf: string;
  email?: string;
  telefone?: string;
  endereco?: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  ativo: boolean;
  dataCadastro: string;
  dataAtualizacao: string;
}

export interface CentroCusto {
  id: number;
  codigo: string;
  nome: string;
  descricao?: string;
  ativo: boolean;
  centroCustoPai?: {
    id: number;
    codigo: string;
    nome: string;
  };
  dataCadastro: string;
  dataAtualizacao: string;
}

export interface LancamentoFinanceiro {
  id: number;
  codigo: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: 'pendente' | 'pago' | 'vencido' | 'cancelado';
  fornecedor: {
    id: number;
    nome: string;
    cnpjCpf: string;
  };
  centroCusto: {
    id: number;
    codigo: string;
    nome: string;
  };
  categoria?: {
    id: number;
    nome: string;
  };
  observacoes?: string;
  dataCadastro: string;
  dataAtualizacao: string;
}

export interface Pagamento {
  id: number;
  lancamentoId: number;
  valor: number;
  dataPagamento: string;
  formaPagamento: string;
  numeroDocumento?: string;
  observacoes?: string;
  dataCadastro: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}