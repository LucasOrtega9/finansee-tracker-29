export type CostType = 'OPEX' | 'CAPEX';

export interface Vendor {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Budget {
  id: string;
  year: number;
  type: CostType;
  amount: number;
  createdAt: Date;
}

export interface Cost {
  id: string;
  vendorId: string;
  vendor?: Vendor;
  type: CostType;
  contract?: string;
  monthlyValue: number;
  annualValue: number;
  startDate: Date;
  endDate?: Date;
  bookedYear: number;
  realizedYTD: number;
  notes?: string;
  costCenter?: string;
  glAccount?: string;
  project?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface KPIData {
  OPEX: {
    annual: number;
    realized: number;
    budget: number;
    balance: number;
  };
  CAPEX: {
    annual: number;
    realized: number;
    budget: number;
    balance: number;
  };
}