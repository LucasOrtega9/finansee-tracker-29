export type CostType = 'OPEX' | 'CAPEX';

export interface Vendor {
  id: string;
  name: string;
  cpf?: string;
  createdAt: Date;
}

export interface CostCenter {
  id: string;
  name: string;
  code: string;
  type: CostType;
  description?: string;
  createdAt: Date;
}

export interface Budget {
  id: string;
  year: number;
  type: CostType;
  amount: number;
  createdAt: Date;
}

export interface CostAllocation {
  costCenterId: string;
  percentage: number;
}

export interface Cost {
  id: string;
  vendorId: string;
  vendor?: Vendor;
  costCenterId?: string;
  costCenter?: CostCenter;
  type: CostType;
  contract?: string;
  monthlyValue: number;
  annualValue: number;
  startDate: Date;
  endDate?: Date;
  bookedYear: number;
  realizedYTD: number;
  notes?: string;
  glAccount?: string;
  project?: string;
  tags: string[];
  useAllocation: boolean;
  allocations: CostAllocation[];
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