import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { siengeClient } from '../lib/sienge-client';
import { 
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
  CostCenterFilters,
  FinancialStats
} from '../types/sienge';

// Hook para contas a pagar (Bill Debt)
export const useBillDebts = (filters?: BillDebtFilters) => {
  return useQuery({
    queryKey: ['bill-debts', filters],
    queryFn: () => siengeClient.getBillDebts(filters),
    enabled: siengeClient.isAuthenticated(),
    staleTime: 2 * 60 * 1000, // 2 minutos (dados mais dinâmicos)
  });
};

export const useBillDebt = (id: number) => {
  return useQuery({
    queryKey: ['bill-debt', id],
    queryFn: () => siengeClient.getBillDebt(id),
    enabled: siengeClient.isAuthenticated() && !!id,
    staleTime: 2 * 60 * 1000,
  });
};

// Hook para contas a receber (Bill Credit)
export const useBillCredits = (filters?: BillCreditFilters) => {
  return useQuery({
    queryKey: ['bill-credits', filters],
    queryFn: () => siengeClient.getBillCredits(filters),
    enabled: siengeClient.isAuthenticated(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useBillCredit = (id: number) => {
  return useQuery({
    queryKey: ['bill-credit', id],
    queryFn: () => siengeClient.getBillCredit(id),
    enabled: siengeClient.isAuthenticated() && !!id,
    staleTime: 2 * 60 * 1000,
  });
};

// Hook para fornecedores (Suppliers)
export const useSuppliers = (filters?: SupplierFilters) => {
  return useQuery({
    queryKey: ['suppliers', filters],
    queryFn: () => siengeClient.getSuppliers(filters),
    enabled: siengeClient.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useSupplier = (id: number) => {
  return useQuery({
    queryKey: ['supplier', id],
    queryFn: () => siengeClient.getSupplier(id),
    enabled: siengeClient.isAuthenticated() && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para centros de custo (Cost Centers)
export const useCostCenters = (filters?: CostCenterFilters) => {
  return useQuery({
    queryKey: ['cost-centers', filters],
    queryFn: () => siengeClient.getCostCenters(filters),
    enabled: siengeClient.isAuthenticated(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCostCenter = (id: number) => {
  return useQuery({
    queryKey: ['cost-center', id],
    queryFn: () => siengeClient.getCostCenter(id),
    enabled: siengeClient.isAuthenticated() && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para categorias
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => siengeClient.getCategories(),
    enabled: siengeClient.isAuthenticated(),
    staleTime: 10 * 60 * 1000, // 10 minutos (dados mais estáticos)
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => siengeClient.getCategory(id),
    enabled: siengeClient.isAuthenticated() && !!id,
    staleTime: 10 * 60 * 1000,
  });
};

// Hook para pagamentos
export const usePayments = (filters?: {
  page?: number;
  size?: number;
  billId?: number;
  paymentDateFrom?: string;
  paymentDateTo?: string;
}) => {
  return useQuery({
    queryKey: ['payments', filters],
    queryFn: () => siengeClient.getPayments(filters),
    enabled: siengeClient.isAuthenticated(),
    staleTime: 2 * 60 * 1000,
  });
};

export const usePayment = (id: number) => {
  return useQuery({
    queryKey: ['payment', id],
    queryFn: () => siengeClient.getPayment(id),
    enabled: siengeClient.isAuthenticated() && !!id,
    staleTime: 2 * 60 * 1000,
  });
};

// Hook para recebimentos
export const useReceipts = (filters?: {
  page?: number;
  size?: number;
  billId?: number;
  receiptDateFrom?: string;
  receiptDateTo?: string;
}) => {
  return useQuery({
    queryKey: ['receipts', filters],
    queryFn: () => siengeClient.getReceipts(filters),
    enabled: siengeClient.isAuthenticated(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useReceipt = (id: number) => {
  return useQuery({
    queryKey: ['receipt', id],
    queryFn: () => siengeClient.getReceipt(id),
    enabled: siengeClient.isAuthenticated() && !!id,
    staleTime: 2 * 60 * 1000,
  });
};

// Hook para dados em tempo real (com polling)
export const useSiengeRealtimeData = (intervalMs: number = 30000) => {
  const [data, setData] = useState<{
    billDebts: BillDebt[];
    billCredits: BillCredit[];
    suppliers: Supplier[];
    costCenters: CostCenter[];
    categories: Category[];
    payments: Payment[];
    receipts: Receipt[];
  }>({
    billDebts: [],
    billCredits: [],
    suppliers: [],
    costCenters: [],
    categories: [],
    payments: [],
    receipts: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!siengeClient.isAuthenticated()) return;

    try {
      const [
        billDebtsRes,
        billCreditsRes,
        suppliersRes,
        costCentersRes,
        categoriesRes,
        paymentsRes,
        receiptsRes
      ] = await Promise.all([
        siengeClient.getBillDebts({ size: 100 }),
        siengeClient.getBillCredits({ size: 100 }),
        siengeClient.getSuppliers({ size: 100 }),
        siengeClient.getCostCenters({ size: 100 }),
        siengeClient.getCategories(),
        siengeClient.getPayments({ size: 100 }),
        siengeClient.getReceipts({ size: 100 }),
      ]);

      setData({
        billDebts: billDebtsRes.content || [],
        billCredits: billCreditsRes.content || [],
        suppliers: suppliersRes.content || [],
        costCenters: costCentersRes.content || [],
        categories: categoriesRes.content || [],
        payments: paymentsRes.content || [],
        receipts: receiptsRes.content || [],
      });
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar dados';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    if (intervalMs > 0) {
      const interval = setInterval(fetchData, intervalMs);
      return () => clearInterval(interval);
    }
  }, [fetchData, intervalMs]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};

// Hook para estatísticas financeiras
export const useSiengeStats = (): FinancialStats => {
  const { data: billDebts } = useBillDebts({ size: 1000 });
  const { data: billCredits } = useBillCredits({ size: 1000 });
  const { data: payments } = usePayments({ size: 1000 });
  const { data: receipts } = useReceipts({ size: 1000 });

  const stats: FinancialStats = {
    totalReceivables: 0,
    totalPayables: 0,
    pendingReceivables: 0,
    pendingPayables: 0,
    overdueReceivables: 0,
    overduePayables: 0,
    totalPayments: 0,
    totalReceipts: 0,
    averagePaymentAmount: 0,
    averageReceiptAmount: 0,
  };

  // Calcular estatísticas de contas a receber
  if (billCredits?.content) {
    billCredits.content.forEach((credit) => {
      stats.totalReceivables += credit.amount;
      if (credit.status === 'PENDING') {
        stats.pendingReceivables += credit.amount;
      } else if (credit.status === 'OVERDUE') {
        stats.overdueReceivables += credit.amount;
      }
    });
  }

  // Calcular estatísticas de contas a pagar
  if (billDebts?.content) {
    billDebts.content.forEach((debt) => {
      stats.totalPayables += debt.amount;
      if (debt.status === 'PENDING') {
        stats.pendingPayables += debt.amount;
      } else if (debt.status === 'OVERDUE') {
        stats.overduePayables += debt.amount;
      }
    });
  }

  // Calcular estatísticas de pagamentos
  if (payments?.content) {
    stats.totalPayments = payments.content.length;
    const totalPaymentAmount = payments.content.reduce((acc, payment) => acc + payment.amount, 0);
    stats.averagePaymentAmount = stats.totalPayments > 0 ? totalPaymentAmount / stats.totalPayments : 0;
  }

  // Calcular estatísticas de recebimentos
  if (receipts?.content) {
    stats.totalReceipts = receipts.content.length;
    const totalReceiptAmount = receipts.content.reduce((acc, receipt) => acc + receipt.amount, 0);
    stats.averageReceiptAmount = stats.totalReceipts > 0 ? totalReceiptAmount / stats.totalReceipts : 0;
  }

  return stats;
};

// Hook para autenticação
export const useSiengeAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await siengeClient.authenticate();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro na autenticação';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isAuthenticated: siengeClient.isAuthenticated(),
    isLoading,
    error,
    authenticate,
    getToken: siengeClient.getCurrentToken,
  };
};