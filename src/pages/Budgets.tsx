import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBudgets, saveBudget } from '@/lib/storage';
import { formatCurrency } from '@/lib/calculations';
import { Budget, CostType } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function Budgets() {
  const { toast } = useToast();
  
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [opexAmount, setOpexAmount] = useState<number>(0);
  const [capexAmount, setCapexAmount] = useState<number>(0);

  const loadBudgets = () => {
    const budgetsData = getBudgets(year);
    setBudgets(budgetsData);
    
    // Load current values into form
    const opexBudget = budgetsData.find(b => b.type === 'OPEX');
    const capexBudget = budgetsData.find(b => b.type === 'CAPEX');
    
    setOpexAmount(opexBudget ? opexBudget.amount : 0);
    setCapexAmount(capexBudget ? capexBudget.amount : 0);
  };

  useEffect(() => {
    loadBudgets();
  }, [year]);

  const handleSaveBudget = async (type: CostType, amount: number) => {
    setLoading(true);
    
    try {
      saveBudget({
        year,
        type,
        amount,
      });
      
      loadBudgets();
      
      toast({
        title: "Orçamento atualizado",
        description: `Orçamento ${type} para ${year} foi atualizado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o orçamento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadCurrentValues = () => {
    loadBudgets();
    toast({
      title: "Valores carregados",
      description: "Os valores atuais foram carregados nos campos de edição.",
    });
  };

  const currentOpex = budgets.find(b => b.type === 'OPEX');
  const currentCapex = budgets.find(b => b.type === 'CAPEX');

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestão de Orçamentos</h1>
        <div className="flex items-center gap-2">
          <Label>Ano:</Label>
          <Select value={year?.toString() || new Date().getFullYear().toString()} onValueChange={(value) => setYear(Number(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[year - 1, year, year + 1].map(y => (
                <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Current Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Orçamento OPEX {year}
              <span className="text-sm font-normal text-muted-foreground">
                {currentOpex ? `Atualizado em ${currentOpex.createdAt.toLocaleDateString('pt-BR')}` : 'Não definido'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-4">
              {formatCurrency(currentOpex?.amount || 0)}
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="opex-amount">Novo valor OPEX</Label>
                <Input
                  id="opex-amount"
                  type="number"
                  step="0.01"
                  value={opexAmount}
                  onChange={(e) => setOpexAmount(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              <Button 
                onClick={() => handleSaveBudget('OPEX', opexAmount)}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Salvando...' : 'Salvar OPEX'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Orçamento CAPEX {year}
              <span className="text-sm font-normal text-muted-foreground">
                {currentCapex ? `Atualizado em ${currentCapex.createdAt.toLocaleDateString('pt-BR')}` : 'Não definido'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-4">
              {formatCurrency(currentCapex?.amount || 0)}
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="capex-amount">Novo valor CAPEX</Label>
                <Input
                  id="capex-amount"
                  type="number"
                  step="0.01"
                  value={capexAmount}
                  onChange={(e) => setCapexAmount(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              <Button 
                onClick={() => handleSaveBudget('CAPEX', capexAmount)}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Salvando...' : 'Salvar CAPEX'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleLoadCurrentValues}>
              Carregar Valores Atuais
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setOpexAmount(0);
                setCapexAmount(0);
              }}
            >
              Limpar Campos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Budget History */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Orçamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Ano</th>
                  <th className="text-left py-3 px-2">Tipo</th>
                  <th className="text-left py-3 px-2">Valor</th>
                  <th className="text-left py-3 px-2">Data de Criação</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((budget) => (
                  <tr key={budget.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-2 font-medium">{budget.year}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        budget.type === 'OPEX' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {budget.type}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-medium">{formatCurrency(budget.amount)}</td>
                    <td className="py-3 px-2">{budget.createdAt.toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {budgets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum orçamento definido para {year}.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}