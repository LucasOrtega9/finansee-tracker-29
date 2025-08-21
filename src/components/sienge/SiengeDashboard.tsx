import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  RefreshCw
} from 'lucide-react';
import { useSiengeAuth } from '@/hooks/useSiengeAuth';
import { useSiengeStats } from '@/hooks/useSiengeData';
import { SiengeSuppliers } from './SiengeSuppliers';
import { SiengeCostCenters } from './SiengeCostCenters';
import { SiengeBillDebts } from './SiengeBillDebts';
import { SiengeBillCredits } from './SiengeBillCredits';
import { SiengePayments } from './SiengePayments';
import { SiengeReceipts } from './SiengeReceipts';

export const SiengeDashboard: React.FC = () => {
  const { auth, logout } = useSiengeAuth();
  const stats = useSiengeStats();
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
                Conectado via OAuth2
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
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
            <TabsTrigger value="cost-centers">Centros de Custo</TabsTrigger>
            <TabsTrigger value="bill-debts">Contas a Pagar</TabsTrigger>
            <TabsTrigger value="bill-credits">Contas a Receber</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
            <TabsTrigger value="receipts">Recebimentos</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Contas a Receber */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contas a Receber</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.totalReceivables)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pendentes: {formatCurrency(stats.pendingReceivables)}
                  </p>
                </CardContent>
              </Card>

              {/* Total Contas a Pagar */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contas a Pagar</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(stats.totalPayables)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pendentes: {formatCurrency(stats.pendingPayables)}
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
                    stats.totalReceivables - stats.totalPayables >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(stats.totalReceivables - stats.totalPayables)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receber - Pagar
                  </p>
                </CardContent>
              </Card>

              {/* Total Pagamentos */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pagamentos</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.totalPayments}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Média: {formatCurrency(stats.averagePaymentAmount)}
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
                    {stats.overdueReceivables > 0 || stats.overduePayables > 0 ? '!' : '0'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.overdueReceivables > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        Contas a receber vencidas
                      </span>
                    </div>
                    <Badge variant="destructive">
                      {formatCurrency(stats.overdueReceivables)}
                    </Badge>
                  </div>
                )}
                
                {stats.overduePayables > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        Contas a pagar vencidas
                      </span>
                    </div>
                    <Badge variant="destructive">
                      {formatCurrency(stats.overduePayables)}
                    </Badge>
                  </div>
                )}

                {stats.overdueReceivables === 0 && stats.overduePayables === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Nenhuma conta vencida</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fornecedores */}
          <TabsContent value="suppliers">
            <SiengeSuppliers />
          </TabsContent>

          {/* Centros de Custo */}
          <TabsContent value="cost-centers">
            <SiengeCostCenters />
          </TabsContent>

          {/* Contas a Pagar */}
          <TabsContent value="bill-debts">
            <SiengeBillDebts />
          </TabsContent>

          {/* Contas a Receber */}
          <TabsContent value="bill-credits">
            <SiengeBillCredits />
          </TabsContent>

          {/* Pagamentos */}
          <TabsContent value="payments">
            <SiengePayments />
          </TabsContent>

          {/* Recebimentos */}
          <TabsContent value="receipts">
            <SiengeReceipts />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};