import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Cost, CostType } from '@/types';
import { saveCost, updateCost, saveVendor } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface CostFormProps {
  initialData?: Cost;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CostForm({ initialData, onSuccess, onCancel }: CostFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    vendorName: '',
    type: 'OPEX' as CostType,
    contract: '',
    monthlyValue: 0,
    annualValue: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    bookedYear: new Date().getFullYear(),
    realizedYTD: 0,
    notes: '',
    costCenter: '',
    glAccount: '',
    project: '',
    tags: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        vendorName: initialData.vendor?.name || '',
        type: initialData.type,
        contract: initialData.contract || '',
        monthlyValue: initialData.monthlyValue,
        annualValue: initialData.annualValue.toString(),
        startDate: initialData.startDate.toISOString().slice(0, 10),
        endDate: initialData.endDate ? initialData.endDate.toISOString().slice(0, 10) : '',
        bookedYear: initialData.bookedYear,
        realizedYTD: initialData.realizedYTD,
        notes: initialData.notes || '',
        costCenter: initialData.costCenter || '',
        glAccount: initialData.glAccount || '',
        project: initialData.project || '',
        tags: initialData.tags.join(', '),
      });
    }
  }, [initialData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const vendor = saveVendor({ name: formData.vendorName });
      
      const costData = {
        vendorId: vendor.id,
        type: formData.type,
        contract: formData.contract || undefined,
        monthlyValue: formData.monthlyValue,
        annualValue: formData.annualValue ? Number(formData.annualValue) : formData.monthlyValue * 12,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        bookedYear: formData.bookedYear,
        realizedYTD: formData.realizedYTD,
        notes: formData.notes || undefined,
        costCenter: formData.costCenter || undefined,
        glAccount: formData.glAccount || undefined,
        project: formData.project || undefined,
        tags: formData.tags.split(/[;,]/).map(s => s.trim()).filter(Boolean),
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
              <Label htmlFor="vendorName">Fornecedor</Label>
              <Input
                id="vendorName"
                value={formData.vendorName}
                onChange={(e) => handleInputChange('vendorName', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
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
              <Label htmlFor="costCenter">Centro de Custo</Label>
              <Input
                id="costCenter"
                value={formData.costCenter}
                onChange={(e) => handleInputChange('costCenter', e.target.value)}
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