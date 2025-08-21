import { Cost, Budget, KPIData, CostType } from '@/types';

export function calculateKPIs(costs: Cost[], budgets: Budget[]): KPIData {
  const opexCosts = costs.filter(c => c.type === 'OPEX');
  const capexCosts = costs.filter(c => c.type === 'CAPEX');
  
  const opexBudget = budgets.find(b => b.type === 'OPEX')?.amount || 0;
  const capexBudget = budgets.find(b => b.type === 'CAPEX')?.amount || 0;
  
  const opexAnnual = opexCosts.reduce((sum, c) => sum + c.annualValue, 0);
  const capexAnnual = capexCosts.reduce((sum, c) => sum + c.annualValue, 0);
  
  const opexRealized = opexCosts.reduce((sum, c) => sum + c.realizedYTD, 0);
  const capexRealized = capexCosts.reduce((sum, c) => sum + c.realizedYTD, 0);
  
  return {
    OPEX: {
      annual: opexAnnual,
      realized: opexRealized,
      budget: opexBudget,
      balance: opexBudget - opexRealized,
    },
    CAPEX: {
      annual: capexAnnual,
      realized: capexRealized,
      budget: capexBudget,
      balance: capexBudget - capexRealized,
    },
  };
}

export function getTopVendorsBySpending(costs: Cost[], limit = 10): Array<[string, number]> {
  const vendorTotals = new Map<string, number>();
  
  costs.forEach(cost => {
    if (cost.vendor) {
      const current = vendorTotals.get(cost.vendor.name) || 0;
      vendorTotals.set(cost.vendor.name, current + cost.annualValue);
    }
  });
  
  return Array.from(vendorTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function getCostsByType(costs: Cost[]): { OPEX: number; CAPEX: number } {
  const opex = costs.filter(c => c.type === 'OPEX').reduce((sum, c) => sum + c.annualValue, 0);
  const capex = costs.filter(c => c.type === 'CAPEX').reduce((sum, c) => sum + c.annualValue, 0);
  
  return { OPEX: opex, CAPEX: capex };
}