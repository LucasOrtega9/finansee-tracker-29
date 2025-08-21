import { Cost, Vendor, Budget, CostType } from '@/types';

const STORAGE_KEYS = {
  COSTS: 'capex_opex_costs',
  VENDORS: 'capex_opex_vendors',
  BUDGETS: 'capex_opex_budgets',
};

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Vendors
export function getVendors(): Vendor[] {
  const data = localStorage.getItem(STORAGE_KEYS.VENDORS);
  return data ? JSON.parse(data) : [];
}

export function saveVendor(vendor: Omit<Vendor, 'id' | 'createdAt'>): Vendor {
  const vendors = getVendors();
  const existing = vendors.find(v => v.name === vendor.name);
  
  if (existing) return existing;
  
  const newVendor: Vendor = {
    id: generateId(),
    ...vendor,
    createdAt: new Date(),
  };
  
  vendors.push(newVendor);
  localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
  return newVendor;
}

export function updateVendor(id: string, updates: Partial<Vendor>): Vendor | null {
  const vendors = getVendors();
  const index = vendors.findIndex(v => v.id === id);
  
  if (index === -1) return null;
  
  vendors[index] = {
    ...vendors[index],
    ...updates,
  };
  
  localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
  return vendors[index];
}

export function deleteVendor(id: string): boolean {
  const vendors = getVendors();
  const filtered = vendors.filter(v => v.id !== id);
  
  if (filtered.length === vendors.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(filtered));
  return true;
}

// Costs
export function getCosts(filters?: { 
  year?: number; 
  type?: CostType; 
  search?: string; 
}): Cost[] {
  const data = localStorage.getItem(STORAGE_KEYS.COSTS);
  let costs: Cost[] = data ? JSON.parse(data).map((c: any) => ({
    ...c,
    startDate: new Date(c.startDate),
    endDate: c.endDate ? new Date(c.endDate) : undefined,
    createdAt: new Date(c.createdAt),
    updatedAt: new Date(c.updatedAt),
  })) : [];

  const vendors = getVendors();
  costs = costs.map(cost => ({
    ...cost,
    vendor: vendors.find(v => v.id === cost.vendorId),
  }));

  if (filters?.year) {
    costs = costs.filter(c => c.bookedYear === filters.year);
  }
  
  if (filters?.type) {
    costs = costs.filter(c => c.type === filters.type);
  }
  
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    costs = costs.filter(c => 
      c.vendor?.name.toLowerCase().includes(search) ||
      c.contract?.toLowerCase().includes(search) ||
      c.notes?.toLowerCase().includes(search) ||
      c.project?.toLowerCase().includes(search) ||
      c.costCenter?.toLowerCase().includes(search) ||
      c.glAccount?.toLowerCase().includes(search)
    );
  }

  return costs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function saveCost(cost: Omit<Cost, 'id' | 'createdAt' | 'updatedAt'>): Cost {
  const costs = JSON.parse(localStorage.getItem(STORAGE_KEYS.COSTS) || '[]');
  
  const newCost: Cost = {
    id: generateId(),
    ...cost,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  costs.push(newCost);
  localStorage.setItem(STORAGE_KEYS.COSTS, JSON.stringify(costs));
  return newCost;
}

export function updateCost(id: string, updates: Partial<Cost>): Cost | null {
  const costs = JSON.parse(localStorage.getItem(STORAGE_KEYS.COSTS) || '[]');
  const index = costs.findIndex((c: Cost) => c.id === id);
  
  if (index === -1) return null;
  
  costs[index] = {
    ...costs[index],
    ...updates,
    updatedAt: new Date(),
  };
  
  localStorage.setItem(STORAGE_KEYS.COSTS, JSON.stringify(costs));
  return costs[index];
}

export function deleteCost(id: string): boolean {
  const costs = JSON.parse(localStorage.getItem(STORAGE_KEYS.COSTS) || '[]');
  const filtered = costs.filter((c: Cost) => c.id !== id);
  
  if (filtered.length === costs.length) return false;
  
  localStorage.setItem(STORAGE_KEYS.COSTS, JSON.stringify(filtered));
  return true;
}

// Budgets
export function getBudgets(year?: number): Budget[] {
  const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
  let budgets: Budget[] = data ? JSON.parse(data).map((b: any) => ({
    ...b,
    createdAt: new Date(b.createdAt),
  })) : [];

  if (year) {
    budgets = budgets.filter(b => b.year === year);
  }

  return budgets;
}

export function saveBudget(budget: Omit<Budget, 'id' | 'createdAt'>): Budget {
  const budgets = JSON.parse(localStorage.getItem(STORAGE_KEYS.BUDGETS) || '[]');
  const existingIndex = budgets.findIndex(
    (b: Budget) => b.year === budget.year && b.type === budget.type
  );
  
  if (existingIndex !== -1) {
    budgets[existingIndex] = {
      ...budgets[existingIndex],
      amount: budget.amount,
    };
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    return budgets[existingIndex];
  }
  
  const newBudget: Budget = {
    id: generateId(),
    ...budget,
    createdAt: new Date(),
  };
  
  budgets.push(newBudget);
  localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  return newBudget;
}