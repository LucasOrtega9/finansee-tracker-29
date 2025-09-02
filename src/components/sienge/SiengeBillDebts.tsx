import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBillDebts } from "@/hooks/useSiengeData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const SiengeBillDebts = () => {
  const { data: billDebts, isLoading, error } = useBillDebts();

  if (isLoading) return <div>Carregando contas a pagar...</div>;
  if (error) return <div>Erro ao carregar contas a pagar</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'default';
      case 'PENDING': return 'secondary';
      case 'OVERDUE': return 'destructive';
      case 'CANCELLED': return 'outline';
      default: return 'secondary';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contas a Pagar</CardTitle>
        <CardDescription>
          {billDebts?.totalElements || 0} contas encontradas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {billDebts?.content.map((debt) => (
            <div key={debt.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium">{debt.description}</h3>
                <p className="text-sm text-muted-foreground">
                  Fornecedor: {debt.supplier.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Vencimento: {format(new Date(debt.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Centro de Custo: {debt.costCenter.name}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(debt.amount)}</p>
                <Badge variant={getStatusColor(debt.status)}>
                  {debt.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};