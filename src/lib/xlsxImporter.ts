import * as XLSX from 'xlsx';
import { CostType } from '@/types';
import { saveVendor, saveCost, saveBudget } from './storage';

const COLUMN_MAPPINGS = {
  fornecedor: ['fornecedor', 'vendor', 'fornec', 'supplier'],
  contrato: ['contrato', 'contract'],
  tipo: ['tipo', 'type', 'categoria'],
  valorMensal: ['valor mensal', 'mensal', 'monthly', 'valor_mensal', 'valor (mensal)', 'vl mensal'],
  valorAnual: ['valor anual', 'anual', 'annual', 'valor_anual', 'valor (anual)', 'vl anual'],
  inicio: ['início', 'inicio', 'start', 'data início', 'data inicio', 'start date', 'inicio contrato'],
  fim: ['fim', 'término', 'termino', 'end', 'data fim', 'end date', 'fim contrato'],
  ano: ['ano', 'year'],
  orcado: ['orçado', 'orcado', 'budget', 'orçamento', 'orcamento'],
  realizado: ['realizado', 'realizado ytd', 'ytd', 'spent', 'acumulado'],
  notas: ['notas', 'obs', 'observação', 'observacoes', 'notes'],
  cc: ['centro de custo', 'cc', 'cost center', 'centro custo'],
  gl: ['gl', 'conta contábil', 'conta contabil', 'account', 'gl account'],
  projeto: ['projeto', 'project'],
  tags: ['tags', 'tag']
};

function normalizeColumnName(name: string): string {
  return name.toString().trim().toLowerCase();
}

function findColumn(row: any, columnKeys: string[]): any {
  const columns = Object.keys(row);
  const found = columns.find(col => 
    columnKeys.includes(normalizeColumnName(col))
  );
  return found ? row[found] : undefined;
}

function parseNumber(value: any): number {
  if (value == null || value === '') return 0;
  if (typeof value === 'number') return value;
  
  let str = String(value).trim();
  // Handle Brazilian number format (1.234.567,89)
  str = str.replace(/\./g, '').replace(',', '.');
  const num = Number(str);
  return isNaN(num) ? 0 : num;
}

function parseDate(value: any): Date | null {
  if (!value && value !== 0) return null;
  
  // Excel date serial number
  if (typeof value === 'number') {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(epoch.getTime() + value * 24 * 3600 * 1000);
  }
  
  const str = String(value).trim();
  if (!str) return null;
  
  // Brazilian date format (dd/mm/yyyy)
  const match = str.match(/^(\d{1,2})[\/](\d{1,2})[\/](\d{2,4})$/);
  if (match) {
    const year = match[3].length === 2 ? ('20' + match[3]) : match[3];
    return new Date(Number(year), Number(match[2]) - 1, Number(match[1]));
  }
  
  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export async function importCostsFromSheet(worksheet: XLSX.WorkSheet, typeHint: CostType): Promise<void> {
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  
  for (const row of rows) {
    const vendorName = String(findColumn(row, COLUMN_MAPPINGS.fornecedor) || '').trim() || '—';
    const contract = String(findColumn(row, COLUMN_MAPPINGS.contrato) || '').trim() || undefined;
    
    const typeRaw = String(findColumn(row, COLUMN_MAPPINGS.tipo) || '').toUpperCase();
    const type: CostType = (typeRaw === 'OPEX' || typeRaw === 'CAPEX') ? typeRaw as CostType : typeHint;
    
    const monthlyValue = parseNumber(findColumn(row, COLUMN_MAPPINGS.valorMensal));
    const annualValueRaw = findColumn(row, COLUMN_MAPPINGS.valorAnual);
    const annualValue = parseNumber(annualValueRaw != null && annualValueRaw !== '' ? annualValueRaw : monthlyValue * 12);
    
    const startDate = parseDate(findColumn(row, COLUMN_MAPPINGS.inicio)) || new Date(new Date().getFullYear(), 0, 1);
    const endDate = parseDate(findColumn(row, COLUMN_MAPPINGS.fim)) || undefined;
    const bookedYear = Number(findColumn(row, COLUMN_MAPPINGS.ano)) || startDate.getFullYear();
    const realizedYTD = parseNumber(findColumn(row, COLUMN_MAPPINGS.realizado));
    const notes = String(findColumn(row, COLUMN_MAPPINGS.notas) || '').trim() || undefined;
    
    const costCenter = String(findColumn(row, COLUMN_MAPPINGS.cc) || '').trim() || undefined;
    const glAccount = String(findColumn(row, COLUMN_MAPPINGS.gl) || '').trim() || undefined;
    const project = String(findColumn(row, COLUMN_MAPPINGS.projeto) || '').trim() || undefined;
    
    const tagsRaw = findColumn(row, COLUMN_MAPPINGS.tags);
    const tags = Array.isArray(tagsRaw)
      ? tagsRaw.map((x: any) => String(x))
      : (typeof tagsRaw === 'string' ? tagsRaw.split(/[;,]/).map(s => s.trim()).filter(Boolean) : []);
    
    // Save vendor and cost
    const vendor = saveVendor({ name: vendorName });
    
    saveCost({
      vendorId: vendor.id,
      type,
      contract,
      monthlyValue,
      annualValue,
      startDate,
      endDate,
      bookedYear,
      realizedYTD,
      notes,
      costCenterLegacy: costCenter,
      glAccount,
      project,
      tags,
    });
    
    // Save budget if specified
    const budgetAmount = parseNumber(findColumn(row, COLUMN_MAPPINGS.orcado));
    if (budgetAmount > 0) {
      saveBudget({
        year: bookedYear,
        type,
        amount: budgetAmount,
      });
    }
  }
}

export async function importBudgetsFromSheet(worksheet: XLSX.WorkSheet): Promise<void> {
  const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  
  for (const row of rows) {
    const year = Number(row['Year'] || row['Ano'] || row['ano'] || row['year']);
    if (!year) continue;
    
    const type = String(row['Type'] || row['type'] || row['Categoria'] || row['categoria'] || '').toUpperCase();
    const opex = row['OPEX'] ?? row['Orçado OPEX'] ?? row['orcado opex'];
    const capex = row['CAPEX'] ?? row['Orçado CAPEX'] ?? row['orcado capex'];
    const amount = row['Amount'] ?? row['amount'] ?? row['Orçado'] ?? row['orcado'];
    
    // Format 1: Year|Type|Amount
    if (amount && (type === 'OPEX' || type === 'CAPEX')) {
      const value = parseNumber(amount);
      saveBudget({
        year,
        type: type as CostType,
        amount: value,
      });
      continue;
    }
    
    // Format 2: Year|OPEX|CAPEX
    const opexNum = parseNumber(opex);
    const capexNum = parseNumber(capex);
    
    if (opexNum > 0) {
      saveBudget({
        year,
        type: 'OPEX',
        amount: opexNum,
      });
    }
    
    if (capexNum > 0) {
      saveBudget({
        year,
        type: 'CAPEX',
        amount: capexNum,
      });
    }
  }
}

export async function importWorkbook(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { cellDates: false });
        
        const sheetNames = workbook.SheetNames;
        const findSheet = (keywords: string[]) => 
          sheetNames.find(name => 
            keywords.some(keyword => 
              name.toLowerCase().includes(keyword.toLowerCase())
            )
          );
        
        // Find sheets
        const opexSheet = findSheet(['opex']);
        const capexSheet = findSheet(['capex']);
        const budgetSheet = findSheet(['budget', 'orcado', 'orçamento', 'orcamento']);
        
        // Import costs
        if (opexSheet) {
          await importCostsFromSheet(workbook.Sheets[opexSheet], 'OPEX');
        }
        
        if (capexSheet) {
          await importCostsFromSheet(workbook.Sheets[capexSheet], 'CAPEX');
        }
        
        // Import budgets
        if (budgetSheet) {
          await importBudgetsFromSheet(workbook.Sheets[budgetSheet]);
        }
        
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}