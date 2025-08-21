import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CostForm } from '@/components/CostForm';
import { getCosts, deleteCost } from '@/lib/storage';
import { importWorkbook } from '@/lib/xlsxImporter';
import { formatCurrency } from '@/lib/calculations';
import { Cost, CostType } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function Costs() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [costs, setCosts] = useState<Cost[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCost, setEditingCost] = useState<Cost | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // Filters
  const [year, setYear] = useState(new Date().getFullYear());
  const [type, setType] = useState<CostType | 'all'>('all');
  const [search, setSearch] = useState('');

  const loadCosts = () => {
    const filters: any = { year };
    if (type !== 'all') filters.type = type;
    if (search) filters.search = search;
    
    const costsData = getCosts(filters);
    setCosts(costsData);
  };

  useEffect(() => {
    loadCosts();
  }, [year, type, search]);

  const handleImport = async (file: File) => {
    setLoading(true);
    try {
      await importWorkbook(file);
      loadCosts();
      toast({
        title: "Importação concluída",
        description: "Os dados foram importados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImport(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este custo?')) return;
    
    const success = deleteCost(id);
    if (success) {
      loadCosts();
      toast({
        title: "Custo excluído",
        description: "O custo foi excluído com sucesso.",
      });
    }
  };

  const handleEdit = (cost: Cost) => {
    setEditingCost(cost);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setEditingCost(null);
    setShowForm(false);
    loadCosts();
  };

  const handleFormCancel = () => {
    setEditingCost(null);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestão de Custos</h1>
        <Button onClick={() => setShowForm(true)}>
          Novo Custo
        </Button>
      </div>

      {/* Filters and Import */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros e Importação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <Label>Ano</Label>
              <Select value={year?.toString() || new Date().getFullYear().toString()} onValueChange={(value) => setYear(Number(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[year - 1, year, year + 1].map(y => (
                    <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Tipo</Label>
              <Select value={type || 'all'} onValueChange={(value) => setType(value as CostType | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="OPEX">OPEX</SelectItem>
                  <SelectItem value="CAPEX">CAPEX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2">
              <Label>Busca</Label>
              <Input
                placeholder="Fornecedor, contrato, CC, projeto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div>
              <Label>Importar XLSX</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  {loading ? 'Importando...' : 'Selecionar'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Upload em lote via Excel (.xlsx)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Costs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Custos ({costs.length} registros)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Fornecedor</th>
                  <th className="text-left py-3 px-2">Tipo</th>
                  <th className="text-left py-3 px-2">Contrato</th>
                  <th className="text-left py-3 px-2">Mensal</th>
                  <th className="text-left py-3 px-2">Anual</th>
                  <th className="text-left py-3 px-2">Total Período</th>
                  <th className="text-left py-3 px-2">Ano</th>
                  <th className="text-left py-3 px-2">Centro de Custo</th>
                  <th className="text-left py-3 px-2">GL</th>
                  <th className="text-left py-3 px-2">Projeto</th>
                  <th className="text-left py-3 px-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {costs.map((cost) => {
                  const totalPeriod = cost.endDate 
                    ? cost.monthlyValue * (Math.max(1, Math.floor((cost.endDate.getTime() - cost.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)) + 1))
                    : cost.annualValue;
                  
                  return (
                    <tr key={cost.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-2 font-medium">{cost.vendor?.name}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          cost.type === 'OPEX' 
                            ? 'bg-chart-1/20 text-chart-1' 
                            : 'bg-chart-3/20 text-chart-3'
                        }`}>
                          {cost.type}
                        </span>
                      </td>
                      <td className="py-3 px-2">{cost.contract || '-'}</td>
                      <td className="py-3 px-2">{formatCurrency(cost.monthlyValue)}</td>
                      <td className="py-3 px-2 font-medium">{formatCurrency(cost.annualValue)}</td>
                      <td className="py-3 px-2 font-medium text-primary">{formatCurrency(totalPeriod)}</td>
                      <td className="py-3 px-2">{cost.bookedYear}</td>
                      <td className="py-3 px-2">{cost.costCenter?.name || cost.costCenterLegacy || '-'}</td>
                      <td className="py-3 px-2">{cost.glAccount || '-'}</td>
                      <td className="py-3 px-2">{cost.project || '-'}</td>
                    <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(cost)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(cost.id)}
                          >
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {costs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum custo encontrado para os filtros selecionados.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form Modal/Section */}
      {showForm && (
        <CostForm
          initialData={editingCost || undefined}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
}