import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import { useSiengeAuth } from '@/hooks/useSiengeAuth';
import { useSiengeStats } from '@/hooks/useSiengeData';
import { SiengeFornecedores } from './SiengeFornecedores';
import { SiengeCentrosCusto } from './SiengeCentrosCusto';
import { SiengeLancamentos } from './SiengeLancamentos';
import { SiengePagamentos } from './SiengePagamentos';

export const SiengeDashboard: React.FC = () => {
  const { auth, logout } = useSiengeAuth();
  const stats = useSiengeStats(auth?.token || '');
  const [activeTab, setActiveTab] = useState('overview');

  if (!auth) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Sienge Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Conectado como: {auth.userId}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
            <TabsTrigger value="centros-custo">Centros de Custo</TabsTrigger>
            <TabsTrigger value="lancamentos">Lançamentos</TabsTrigger>
            <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Receitas */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.totalReceitas)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receitas pendentes: {formatCurrency(stats.receitasPendentes)}
                  </p>
                </CardContent>
              </Card>

              {/* Total Despesas */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(stats.totalDespesas)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Despesas pendentes: {formatCurrency(stats.despesasPendentes)}
                  </p>
                </CardContent>
              </Card>

              {/* Saldo */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saldo</CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${
                    stats.totalReceitas - stats.totalDespesas >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(stats.totalReceitas - stats.totalDespesas)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receitas - Despesas
                  </p>
                </CardContent>
              </Card>

              {/* Pagamentos */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Pagamentos</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.totalPagamentos}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Média: {formatCurrency(stats.valorMedioPagamento)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Alertas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Alertas e Notificações</span>
                  <Badge variant="destructive" className="ml-2">
                    {stats.receitasVencidas > 0 || stats.despesasVencidas > 0 ? '!' : '0'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.receitasVencidas > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        Receitas vencidas
                      </span>
                    </div>
                    <Badge variant="destructive">
                      {formatCurrency(stats.receitasVencidas)}
                    </Badge>
                  </div>
                )}
                
                {stats.despesasVencidas > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        Despesas vencidas
                      </span>
                    </div>
                    <Badge variant="destructive">
                      {formatCurrency(stats.despesasVencidas)}
                    </Badge>
                  </div>
                )}

                {stats.receitasVencidas === 0 && stats.despesasVencidas === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Nenhum lançamento vencido</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fornecedores */}
          <TabsContent value="fornecedores">
            <SiengeFornecedores token={auth.token} />
          </TabsContent>

          {/* Centros de Custo */}
          <TabsContent value="centros-custo">
            <SiengeCentrosCusto token={auth.token} />
          </TabsContent>

          {/* Lançamentos */}
          <TabsContent value="lancamentos">
            <SiengeLancamentos token={auth.token} />
          </TabsContent>

          {/* Pagamentos */}
          <TabsContent value="pagamentos">
            <SiengePagamentos token={auth.token} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};