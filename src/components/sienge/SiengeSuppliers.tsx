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
  Building2,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useSuppliers } from '@/hooks/useSiengeData';

export const SiengeSuppliers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0); // API usa base 0
  const [size] = useState(20);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);

  const { data, isLoading, error, refetch } = useSuppliers({
    page,
    size,
    active: activeFilter,
    search: searchTerm || undefined,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    refetch();
  };

  const handleFilterChange = (value: string) => {
    if (value === 'all') {
      setActiveFilter(undefined);
    } else {
      setActiveFilter(value === 'true');
    }
    setPage(0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando fornecedores...</span>
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

  const suppliers = data?.content || [];
  const pagination = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fornecedores</h2>
          <p className="text-gray-600">
            Gerencie os fornecedores cadastrados no sistema Sienge
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
                  placeholder="Buscar fornecedores por nome, código ou documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={activeFilter === undefined ? 'all' : activeFilter.toString()}
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

      {/* Tabela de Fornecedores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
          <CardDescription>
            {pagination ? `${pagination.totalElements} fornecedores encontrados` : 'Carregando...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      <Building2 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>Nenhum fornecedor encontrado</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-mono text-sm">
                        {supplier.code}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{supplier.name}</div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {supplier.document}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {supplier.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-3 w-3 mr-1" />
                              {supplier.email}
                            </div>
                          )}
                          {supplier.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-3 w-3 mr-1" />
                              {supplier.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {supplier.address ? (
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {supplier.address.city}, {supplier.address.state}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Não informado</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={supplier.active ? "default" : "secondary"}>
                          {supplier.active ? (
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
                        {formatDate(supplier.createdAt)}
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
                      onClick={() => setPage(Math.max(0, page - 1))}
                      className={page <= 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = Math.max(0, Math.min(pagination.totalPages - 1, page - 2 + i));
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setPage(pageNum)}
                          isActive={pageNum === page}
                          className="cursor-pointer"
                        >
                          {pageNum + 1}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setPage(Math.min(pagination.totalPages - 1, page + 1))}
                      className={page >= pagination.totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              
              <div className="text-center text-sm text-gray-600 mt-2">
                Página {page + 1} de {pagination.totalPages} • 
                {pagination.totalElements} fornecedores • 
                {pagination.size} por página
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};