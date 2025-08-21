import { useState, useEffect } from 'react';
import { CostCenter, CostType } from '@/types';
import { getCostCenters, saveCostCenter, updateCostCenter, deleteCostCenter } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function CostCenters() {
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [editingCostCenter, setEditingCostCenter] = useState<CostCenter | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<CostType | 'all'>('all');
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'OPEX' as CostType,
    description: '',
  });

  useEffect(() => {
    loadCostCenters();
  }, []);

  const loadCostCenters = () => {
    setCostCenters(getCostCenters());
  };

  const filteredCostCenters = costCenters.filter(cc => {
    const matchesSearch = cc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (cc.description && cc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || cc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.code.trim()) {
      toast({
        title: "Erro",
        description: "Nome e código são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingCostCenter) {
        updateCostCenter(editingCostCenter.id, {
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          type: formData.type,
          description: formData.description.trim() || undefined,
        });
        toast({
          title: "Sucesso",
          description: "Centro de custo atualizado com sucesso",
        });
      } else {
        saveCostCenter({
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          type: formData.type,
          description: formData.description.trim() || undefined,
        });
        toast({
          title: "Sucesso",
          description: "Centro de custo cadastrado com sucesso",
        });
      }

      resetForm();
      loadCostCenters();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar centro de custo",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (costCenter: CostCenter) => {
    setEditingCostCenter(costCenter);
    setFormData({
      name: costCenter.name,
      code: costCenter.code,
      type: costCenter.type,
      description: costCenter.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (costCenter: CostCenter) => {
    if (window.confirm(`Tem certeza que deseja excluir o centro de custo "${costCenter.name}"?`)) {
      if (deleteCostCenter(costCenter.id)) {
        toast({
          title: "Sucesso",
          description: "Centro de custo excluído com sucesso",
        });
        loadCostCenters();
      } else {
        toast({
          title: "Erro",
          description: "Erro ao excluir centro de custo",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', code: '', type: 'OPEX', description: '' });
    setEditingCostCenter(null);
  };

  const opexCount = costCenters.filter(cc => cc.type === 'OPEX').length;
  const capexCount = costCenters.filter(cc => cc.type === 'CAPEX').length;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            Centros de Custo
          </h1>
          <p className="text-muted-foreground">Gerencie as linhas de orçamento OPEX e CAPEX</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Centro de Custo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCostCenter ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome do centro de custo"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="CC001"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo *</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({ ...formData, type: value as CostType })}
                >
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
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição opcional do centro de custo"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingCostCenter ? 'Atualizar' : 'Cadastrar'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-chart-1">{opexCount}</div>
            <p className="text-xs text-muted-foreground">Centros OPEX</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-chart-3">{capexCount}</div>
            <p className="text-xs text-muted-foreground">Centros CAPEX</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{costCenters.length}</div>
            <p className="text-xs text-muted-foreground">Total de Centros</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <Label htmlFor="search">Buscar centro de custo</Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nome, código ou descrição..."
              />
            </div>
            <div>
              <Label>Filtrar por tipo</Label>
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as CostType | 'all')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="OPEX">OPEX</SelectItem>
                  <SelectItem value="CAPEX">CAPEX</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Centers List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Centros de Custo ({filteredCostCenters.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCostCenters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || typeFilter !== 'all' ? 'Nenhum centro de custo encontrado' : 'Nenhum centro de custo cadastrado'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">Código</th>
                    <th className="text-left py-3 px-4 font-medium">Nome</th>
                    <th className="text-left py-3 px-4 font-medium">Tipo</th>
                    <th className="text-left py-3 px-4 font-medium">Descrição</th>
                    <th className="text-left py-3 px-4 font-medium">Cadastrado em</th>
                    <th className="text-right py-3 px-4 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCostCenters.map((costCenter) => (
                    <tr key={costCenter.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono font-medium">{costCenter.code}</td>
                      <td className="py-3 px-4 font-medium">{costCenter.name}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          costCenter.type === 'OPEX' 
                            ? 'bg-chart-1/20 text-chart-1' 
                            : 'bg-chart-3/20 text-chart-3'
                        }`}>
                          {costCenter.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground max-w-xs truncate">
                        {costCenter.description || '—'}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(costCenter.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(costCenter)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(costCenter)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}