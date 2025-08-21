import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Cost, CostType, Vendor, CostCenter, CostAllocation } from '@/types';
import { saveCost, updateCost, saveVendor, getVendors, getCostCenters } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { differenceInMonths, parseISO } from 'date-fns';

interface CostFormProps {
  initialData?: Cost;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CostForm({ initialData, onSuccess, onCancel }: CostFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  
  const [formData, setFormData] = useState({
    vendorId: '',
    vendorName: '',
    costCenterId: '',
    type: 'OPEX' as CostType,
    contract: '',
    monthlyValue: 0,
    annualValue: '',
    totalValue: 0,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    bookedYear: new Date().getFullYear(),
    realizedYTD: 0,
    notes: '',
    glAccount: '',
    project: '',
    tags: '',
    useAllocation: false,
    allocations: [] as CostAllocation[],
  });

  useEffect(() => {
    setVendors(getVendors());
    loadCostCenters();
  }, []);

  const loadCostCenters = () => {
    setCostCenters(getCostCenters());
  };

  useEffect(() => {
    // Update cost centers when type changes
    loadCostCenters();
  }, [formData.type]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        vendorId: initialData.vendorId,
        vendorName: initialData.vendor?.name || '',
        costCenterId: initialData.costCenterId || '',
        type: initialData.type,
        contract: initialData.contract || '',
        monthlyValue: initialData.monthlyValue,
        annualValue: initialData.annualValue.toString(),
        totalValue: calculateTotalValue(initialData.monthlyValue, initialData.startDate.toISOString().slice(0, 10), initialData.endDate?.toISOString().slice(0, 10)),
        startDate: initialData.startDate.toISOString().slice(0, 10),
        endDate: initialData.endDate ? initialData.endDate.toISOString().slice(0, 10) : '',
        bookedYear: initialData.bookedYear,
        realizedYTD: initialData.realizedYTD,
        notes: initialData.notes || '',
        glAccount: initialData.glAccount || '',
        project: initialData.project || '',
        tags: initialData.tags.join(', '),
        useAllocation: initialData.useAllocation || false,
        allocations: initialData.allocations || [],
      });
    }
  }, [initialData]);

  const calculateTotalValue = (monthlyValue: number, startDate: string, endDate?: string): number => {
    if (!startDate || !monthlyValue) return 0;
    
    const start = parseISO(startDate);
    const end = endDate ? parseISO(endDate) : new Date(start.getFullYear(), 11, 31); // End of year if no end date
    
    const months = Math.max(1, differenceInMonths(end, start) + 1);
    return monthlyValue * months;
  };

  useEffect(() => {
    const total = calculateTotalValue(formData.monthlyValue, formData.startDate, formData.endDate);
    setFormData(prev => ({ ...prev, totalValue: total }));
  }, [formData.monthlyValue, formData.startDate, formData.endDate]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addAllocation = () => {
    setFormData(prev => ({
      ...prev,
      allocations: [...prev.allocations, { costCenterId: '', percentage: 0 }]
    }));
  };

  const removeAllocation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      allocations: prev.allocations.filter((_, i) => i !== index)
    }));
  };

  const updateAllocation = (index: number, field: keyof CostAllocation, value: any) => {
    setFormData(prev => ({
      ...prev,
      allocations: prev.allocations.map((allocation, i) => 
        i === index ? { ...allocation, [field]: value } : allocation
      )
    }));
  };

  const getTotalAllocationPercentage = () => {
    return formData.allocations.reduce((sum, allocation) => sum + allocation.percentage, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let vendorId = formData.vendorId;
      
      // If vendorName is filled but no vendorId, create new vendor
      if (formData.vendorName && !vendorId) {
        const vendor = saveVendor({ name: formData.vendorName });
        vendorId = vendor.id;
      }
      
      if (!vendorId) {
        throw new Error('Fornecedor é obrigatório');
      }
      
      const costData = {
        vendorId,
        type: formData.type,
        costCenterId: formData.useAllocation ? undefined : (formData.costCenterId || undefined),
        contract: formData.contract || undefined,
        monthlyValue: formData.monthlyValue,
        annualValue: formData.annualValue ? Number(formData.annualValue) : formData.monthlyValue * 12,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        bookedYear: formData.bookedYear,
        realizedYTD: formData.realizedYTD,
        notes: formData.notes || undefined,
        glAccount: formData.glAccount || undefined,
        project: formData.project || undefined,
        tags: formData.tags.split(/[;,]/).map(s => s.trim()).filter(Boolean),
        useAllocation: formData.useAllocation,
        allocations: formData.useAllocation ? formData.allocations : [],
      };

      if (initialData) {
        updateCost(initialData.id, costData);
        toast({
          title: "Custo atualizado",
          description: "O custo foi atualizado com sucesso.",
        });
      } else {
        saveCost(costData);
        toast({
          title: "Custo criado",
          description: "O custo foi criado com sucesso.",
        });
      }

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o custo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Editar Custo' : 'Novo Custo'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="vendor">Fornecedor</Label>
              <Select 
                value={formData.vendorId || 'new'} 
                onValueChange={(value) => {
                  if (value === 'new') {
                    handleInputChange('vendorId', '');
                    handleInputChange('vendorName', '');
                  } else {
                    const vendor = vendors.find(v => v.id === value);
                    handleInputChange('vendorId', value);
                    handleInputChange('vendorName', vendor?.name || '');
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">+ Novo fornecedor</SelectItem>
                  {vendors.map(vendor => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {(!formData.vendorId || formData.vendorId === 'new') && (
                <Input
                  className="mt-2"
                  placeholder="Nome do novo fornecedor"
                  value={formData.vendorName}
                  onChange={(e) => handleInputChange('vendorName', e.target.value)}
                  required
                />
              )}
            </div>
            
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type || 'OPEX'} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEX">OPEX</SelectItem>
                  <SelectItem value="CAPEX">CAPEX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Switch
                  id="useAllocation"
                  checked={formData.useAllocation}
                  onCheckedChange={(value) => handleInputChange('useAllocation', value)}
                />
                <Label htmlFor="useAllocation">Rateio de centro de custo</Label>
              </div>
              
              {!formData.useAllocation ? (
                <>
                  <Label htmlFor="costCenter">Centro de Custo</Label>
                  <Select 
                    value={formData.costCenterId || 'none'} 
                    onValueChange={(value) => handleInputChange('costCenterId', value === 'none' ? '' : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um centro de custo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      {costCenters
                        .filter(cc => cc.type === formData.type)
                        .map(costCenter => (
                          <SelectItem key={costCenter.id} value={costCenter.id}>
                            {costCenter.code} - {costCenter.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {costCenters.filter(cc => cc.type === formData.type).length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Nenhum centro {formData.type} cadastrado
                    </p>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Rateio por Centro de Custo</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addAllocation}>
                      + Adicionar Rateio
                    </Button>
                  </div>
                  
                  {formData.allocations.map((allocation, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label>Centro de Custo</Label>
                        <Select
                          value={allocation.costCenterId}
                          onValueChange={(value) => updateAllocation(index, 'costCenterId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {costCenters
                              .filter(cc => cc.type === formData.type)
                              .map(costCenter => (
                                <SelectItem key={costCenter.id} value={costCenter.id}>
                                  {costCenter.code} - {costCenter.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-24">
                        <Label>%</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={allocation.percentage}
                          onChange={(e) => updateAllocation(index, 'percentage', Number(e.target.value))}
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeAllocation(index)}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                  
                  {formData.allocations.length > 0 && (
                    <div className="text-sm">
                      <span className={getTotalAllocationPercentage() !== 100 ? "text-destructive" : "text-muted-foreground"}>
                        Total: {getTotalAllocationPercentage().toFixed(2)}%
                      </span>
                      {getTotalAllocationPercentage() !== 100 && (
                        <span className="text-destructive ml-2">
                          (deve somar 100%)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="contract">Contrato</Label>
              <Input
                id="contract"
                value={formData.contract}
                onChange={(e) => handleInputChange('contract', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="monthlyValue">Valor Mensal</Label>
              <Input
                id="monthlyValue"
                type="number"
                step="0.01"
                value={formData.monthlyValue}
                onChange={(e) => handleInputChange('monthlyValue', Number(e.target.value))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="annualValue">Valor Anual (opcional)</Label>
              <Input
                id="annualValue"
                type="number"
                step="0.01"
                value={formData.annualValue}
                onChange={(e) => handleInputChange('annualValue', e.target.value)}
                placeholder="Auto calculado se vazio"
              />
            </div>
            
            <div>
              <Label htmlFor="totalValue">Valor Total (calculado)</Label>
              <Input
                id="totalValue"
                type="number"
                step="0.01"
                value={formData.totalValue.toFixed(2)}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Calculado automaticamente baseado no período
              </p>
            </div>
            
            <div>
              <Label htmlFor="bookedYear">Ano</Label>
              <Input
                id="bookedYear"
                type="number"
                value={formData.bookedYear}
                onChange={(e) => handleInputChange('bookedYear', Number(e.target.value))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="startDate">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="endDate">Data de Fim</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="realizedYTD">Realizado YTD</Label>
              <Input
                id="realizedYTD"
                type="number"
                step="0.01"
                value={formData.realizedYTD}
                onChange={(e) => handleInputChange('realizedYTD', Number(e.target.value))}
              />
            </div>
            
            
            <div>
              <Label htmlFor="glAccount">GL / Conta Contábil</Label>
              <Input
                id="glAccount"
                value={formData.glAccount}
                onChange={(e) => handleInputChange('glAccount', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="project">Projeto</Label>
              <Input
                id="project"
                value={formData.project}
                onChange={(e) => handleInputChange('project', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="tag1, tag2, tag3"
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}