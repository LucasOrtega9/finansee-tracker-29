import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useReceipts } from "@/hooks/useSiengeData";

export const SiengeReceipts = () => {
  const { data: receipts, isLoading, error } = useReceipts();

  if (isLoading) return <div>Carregando recebimentos...</div>;
  if (error) return <div>Erro ao carregar recebimentos</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recebimentos</CardTitle>
        <CardDescription>
          Recebimentos do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {receipts?.content?.map((receipt) => (
            <div key={receipt.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Recebimento #{receipt.id}</h3>
                <p className="text-sm text-muted-foreground">
                  Data: {receipt.receiptDate}
                </p>
              </div>
              <p className="font-medium">R$ {receipt.amount}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};