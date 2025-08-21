import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  Clock
} from 'lucide-react';
import { usePagamentos } from '@/hooks/useSiengeData';

interface SiengePagamentosProps {
  token: string;
}

export const SiengePagamentos: React.FC<SiengePagamentosProps> = ({ token }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const { data, isLoading, error, refetch } = usePagamentos(token, {
    page,
    pageSize,
    dataInicio: dataInicio || undefined,
    dataFim: dataFim || undefined,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const handleFilterChange = () => {
    setPage(1);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando pagamentos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar dados</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()}>Tentar novamente</Button>
        </CardContent>
      </Card>
    );
  }

  const pagamentos = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pagamentos</h2>
          <p className="text-gray-600">
            Gerencie os pagamentos realizados no sistema
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Número do documento, observações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => {
                  setDataInicio(e.target.value);
                  handleFilterChange();
                }}
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => {
                  setDataFim(e.target.value);
                  handleFilterChange();
                }}
                className="text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pagamentos</CardTitle>
          <CardDescription>
            {pagination ? `${pagination.total} pagamentos encontrados` : 'Carregando...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Lançamento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data Pagamento</TableHead>
                  <TableHead>Forma Pagamento</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead>Data Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagamentos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      <CreditCard className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>Nenhum pagamento encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  pagamentos.map((pagamento: any) => (
                    <TableRow key={pagamento.id}>
                      <TableCell className="font-mono text-sm">
                        #{pagamento.id}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">Lançamento #{pagamento.lancamentoId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono font-bold text-green-600">
                          {formatCurrency(pagamento.valor)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium">
                            {formatDate(pagamento.dataPagamento)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <Badge variant="outline">
                            {pagamento.formaPagamento}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {pagamento.numeroDocumento ? (
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-mono">
                              {pagamento.numeroDocumento}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Não informado</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {pagamento.observacoes ? (
                          <div className="max-w-xs">
                            <span className="text-sm text-gray-600">
                              {pagamento.observacoes}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Sem observações</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {formatDate(pagamento.dataCadastro)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setPage(Math.max(1, page - 1))}
                      className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(pagination.totalPages, page - 2 + i));
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setPage(pageNum)}
                          isActive={pageNum === page}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                      className={page >= pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              
              <div className="text-center text-sm text-gray-600 mt-2">
                Página {page} de {pagination.totalPages} • 
                {pagination.total} pagamentos • 
                {pagination.pageSize} por página
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};