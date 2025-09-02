import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBillCredits } from "@/hooks/useSiengeData";

export const SiengeBillCredits = () => {
  const { data: billCredits, isLoading, error } = useBillCredits();

  if (isLoading) return <div>Carregando contas a receber...</div>;
  if (error) return <div>Erro ao carregar contas a receber</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contas a Receber</CardTitle>
        <CardDescription>
          Contas a receber do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {billCredits?.content?.map((credit) => (
            <div key={credit.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{credit.description}</h3>
                <p className="text-sm text-muted-foreground">
                  Cliente: {credit.customer.name}
                </p>
              </div>
              <Badge variant="default">
                {credit.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};