import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KPICard } from '@/components/KPICard';
import { BarChart, PieChart } from '@/components/Charts';
import { getCosts, getBudgets } from '@/lib/storage';
import { calculateKPIs, getTopVendorsBySpending, formatCurrency, getCostsByType } from '@/lib/calculations';
import { Cost, Budget } from '@/types';

export default function Dashboard() {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const loadData = () => {
      const costsData = getCosts({ year });
      const budgetsData = getBudgets(year);
      setCosts(costsData);
      setBudgets(budgetsData);
    };

    loadData();
  }, [year]);

  const kpis = calculateKPIs(costs, budgets);
  const topVendors = getTopVendorsBySpending(costs, 10);
  const costsByType = getCostsByType(costs);
  
  const vendorLabels = topVendors.map(([name]) => name);
  const vendorData = topVendors.map(([, amount]) => amount);
  
  const totalVendors = new Set(costs.map(cost => cost.vendor?.name).filter(Boolean)).size;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Ano:</label>
          <select 
            className="rounded border border-input bg-background px-3 py-2 text-sm"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[year - 1, year, year + 1].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* OPEX KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="OPEX Orçado"
          value={formatCurrency(kpis.OPEX.budget)}
        />
        <KPICard
          title="OPEX Realizado"
          value={formatCurrency(kpis.OPEX.realized)}
        />
        <KPICard
          title="OPEX Anual (Contratado)"
          value={formatCurrency(kpis.OPEX.annual)}
        />
        <KPICard
          title="OPEX Saldo"
          value={formatCurrency(kpis.OPEX.balance)}
          variant={kpis.OPEX.balance >= 0 ? 'positive' : 'negative'}
        />
      </div>

      {/* CAPEX KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard
          title="CAPEX Orçado"
          value={formatCurrency(kpis.CAPEX.budget)}
        />
        <KPICard
          title="CAPEX Realizado"
          value={formatCurrency(kpis.CAPEX.realized)}
        />
        <KPICard
          title="CAPEX Anual (Contratado)"
          value={formatCurrency(kpis.CAPEX.annual)}
        />
        <KPICard
          title="CAPEX Saldo"
          value={formatCurrency(kpis.CAPEX.balance)}
          variant={kpis.CAPEX.balance >= 0 ? 'positive' : 'negative'}
        />
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KPICard
          title="Total Anual (Todos os Custos)"
          value={formatCurrency(kpis.OPEX.annual + kpis.CAPEX.annual)}
          subtitle="Soma de todos os custos contratados"
        />
        <KPICard
          title="Fornecedores Ativos"
          value={totalVendors.toString()}
          subtitle="Fornecedores com contratos ativos"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Fornecedores por Gasto Anual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {vendorLabels.length > 0 ? (
                <BarChart 
                  labels={vendorLabels} 
                  data={vendorData} 
                  title="Gasto Anual" 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Tipo (Anual)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {costsByType.OPEX > 0 || costsByType.CAPEX > 0 ? (
                <PieChart 
                  labels={['OPEX', 'CAPEX']} 
                  data={[costsByType.OPEX, costsByType.CAPEX]} 
                  title="Distribuição Anual" 
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}