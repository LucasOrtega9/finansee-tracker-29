import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePayments } from "@/hooks/useSiengeData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const SiengePayments = () => {
  const { data: payments, isLoading, error } = usePayments();

  if (isLoading) return <div>Carregando pagamentos...</div>;
  if (error) return <div>Erro ao carregar pagamentos</div>;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagamentos</CardTitle>
        <CardDescription>
          {payments?.totalElements || 0} pagamentos encontrados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments?.content.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Pagamento #{payment.id}</h3>
                <p className="text-sm text-muted-foreground">
                  Data: {format(new Date(payment.paymentDate), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Método: {payment.paymentMethod}
                </p>
                {payment.documentNumber && (
                  <p className="text-sm text-muted-foreground">
                    Documento: {payment.documentNumber}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium">{formatCurrency(payment.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};