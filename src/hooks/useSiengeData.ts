import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { siengeClient } from '../lib/sienge-client';
import { Fornecedor, CentroCusto, LancamentoFinanceiro, Pagamento } from '../types/sienge';

// Hook para fornecedores
export const useFornecedores = (token: string, params?: {
  page?: number;
  pageSize?: number;
  ativo?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['fornecedores', params],
    queryFn: () => siengeClient.getFornecedores(token, params),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useFornecedor = (token: string, id: number) => {
  return useQuery({
    queryKey: ['fornecedor', id],
    queryFn: () => siengeClient.getFornecedor(token, id),
    enabled: !!token && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para centros de custo
export const useCentrosCusto = (token: string, params?: {
  page?: number;
  pageSize?: number;
  ativo?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['centros-custo', params],
    queryFn: () => siengeClient.getCentrosCusto(token, params),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCentroCusto = (token: string, id: number) => {
  return useQuery({
    queryKey: ['centro-custo', id],
    queryFn: () => siengeClient.getCentroCusto(token, id),
    enabled: !!token && !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para lançamentos financeiros
export const useLancamentos = (token: string, params?: {
  page?: number;
  pageSize?: number;
  tipo?: 'receita' | 'despesa';
  status?: string;
  dataInicio?: string;
  dataFim?: string;
  fornecedorId?: number;
  centroCustoId?: number;
}) => {
  return useQuery({
    queryKey: ['lancamentos', params],
    queryFn: () => siengeClient.getLancamentos(token, params),
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 minutos (dados mais dinâmicos)
  });
};

export const useLancamento = (token: string, id: number) => {
  return useQuery({
    queryKey: ['lancamento', id],
    queryFn: () => siengeClient.getLancamento(token, id),
    enabled: !!token && !!id,
    staleTime: 2 * 60 * 1000,
  });
};

// Hook para pagamentos
export const usePagamentos = (token: string, params?: {
  page?: number;
  pageSize?: number;
  dataInicio?: string;
  dataFim?: string;
  lancamentoId?: number;
}) => {
  return useQuery({
    queryKey: ['pagamentos', params],
    queryFn: () => siengeClient.getPagamentos(token, params),
    enabled: !!token,
    staleTime: 2 * 60 * 1000,
  });
};

export const usePagamento = (token: string, id: number) => {
  return useQuery({
    queryKey: ['pagamento', id],
    queryFn: () => siengeClient.getPagamento(token, id),
    enabled: !!token && !!id,
    staleTime: 2 * 60 * 1000,
  });
};

// Hook para dados em tempo real (com polling)
export const useSiengeRealtimeData = (token: string, intervalMs: number = 30000) => {
  const [data, setData] = useState<{
    fornecedores: Fornecedor[];
    centrosCusto: CentroCusto[];
    lancamentos: LancamentoFinanceiro[];
    pagamentos: Pagamento[];
  }>({
    fornecedores: [],
    centrosCusto: [],
    lancamentos: [],
    pagamentos: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      const [fornecedoresRes, centrosCustoRes, lancamentosRes, pagamentosRes] = await Promise.all([
        siengeClient.getFornecedores(token, { pageSize: 100 }),
        siengeClient.getCentrosCusto(token, { pageSize: 100 }),
        siengeClient.getLancamentos(token, { pageSize: 100 }),
        siengeClient.getPagamentos(token, { pageSize: 100 }),
      ]);

      setData({
        fornecedores: fornecedoresRes.data || [],
        centrosCusto: centrosCustoRes.data || [],
        lancamentos: lancamentosRes.data || [],
        pagamentos: pagamentosRes.data || [],
      });
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar dados';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

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

// Hook para estatísticas
export const useSiengeStats = (token: string) => {
  const { data: lancamentos } = useLancamentos(token, { pageSize: 1000 });
  const { data: pagamentos } = usePagamentos(token, { pageSize: 1000 });

  const stats = {
    totalReceitas: 0,
    totalDespesas: 0,
    receitasPendentes: 0,
    despesasPendentes: 0,
    receitasVencidas: 0,
    despesasVencidas: 0,
    totalPagamentos: 0,
    valorMedioPagamento: 0,
  };

  if (lancamentos?.data) {
    lancamentos.data.forEach((lancamento: any) => {
      if (lancamento.tipo === 'receita') {
        stats.totalReceitas += lancamento.valor;
        if (lancamento.status === 'pendente') {
          stats.receitasPendentes += lancamento.valor;
        } else if (lancamento.status === 'vencido') {
          stats.receitasVencidas += lancamento.valor;
        }
      } else {
        stats.totalDespesas += lancamento.valor;
        if (lancamento.status === 'pendente') {
          stats.despesasPendentes += lancamento.valor;
        } else if (lancamento.status === 'vencido') {
          stats.despesasVencidas += lancamento.valor;
        }
      }
    });
  }

  if (pagamentos?.data) {
    stats.totalPagamentos = pagamentos.data.length;
    const totalValor = pagamentos.data.reduce((acc: number, pag: any) => acc + pag.valor, 0);
    stats.valorMedioPagamento = stats.totalPagamentos > 0 ? totalValor / stats.totalPagamentos : 0;
  }

  return stats;
};