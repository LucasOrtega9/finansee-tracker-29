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
  FolderOpen,
  CheckCircle,
  XCircle,
  ChevronRight
} from 'lucide-react';
import { useCostCenters } from '@/hooks/useSiengeData';

interface SiengeCentrosCustoProps {
  token: string;
}

export const SiengeCentrosCusto: React.FC<SiengeCentrosCustoProps> = ({ token }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [ativoFilter, setAtivoFilter] = useState<boolean | undefined>(undefined);

  const { data, isLoading, error, refetch } = useCostCenters({
    page,
    size: pageSize,
    active: ativoFilter,
    search: searchTerm || undefined,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  const handleFilterChange = (value: string) => {
    if (value === 'all') {
      setAtivoFilter(undefined);
    } else {
      setAtivoFilter(value === 'true');
    }
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando centros de custo...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar dados</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => refetch()}>Tentar novamente</Button>
        </CardContent>
      </Card>
    );
  }

  const centrosCusto = data?.content || [];
  const pagination = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Centros de Custo</h2>
          <p className="text-gray-600">
            Gerencie os centros de custo do sistema
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
          <div className="flex flex-col lg:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar centros de custo por código ou nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={ativoFilter === undefined ? 'all' : ativoFilter.toString()}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os status</option>
                <option value="true">Ativos</option>
                <option value="false">Inativos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Centros de Custo */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Centros de Custo</CardTitle>
          <CardDescription>
            {pagination ? `${pagination.totalElements} centros de custo encontrados` : 'Carregando...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Centro Pai</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {centrosCusto.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      <FolderOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>Nenhum centro de custo encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  centrosCusto.map((centro: any) => (
                    <TableRow key={centro.id}>
                      <TableCell className="font-mono text-sm">
                        {centro.codigo}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{centro.nome}</div>
                      </TableCell>
                      <TableCell>
                        {centro.descricao ? (
                          <span className="text-sm text-gray-600">{centro.descricao}</span>
                        ) : (
                          <span className="text-gray-400 text-sm">Sem descrição</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {centro.centroCustoPai ? (
                          <div className="flex items-center text-sm text-gray-600">
                            <ChevronRight className="h-3 w-3 mr-1" />
                            {centro.centroCustoPai.codigo} - {centro.centroCustoPai.nome}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Centro raiz</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={centro.ativo ? "default" : "secondary"}>
                          {centro.ativo ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ativo
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Inativo
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(centro.dataCadastro)}
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
                {pagination.totalElements} centros de custo • 
                {pagination.size} por página
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};