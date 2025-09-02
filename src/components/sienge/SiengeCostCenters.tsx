import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCostCenters } from "@/hooks/useSiengeData";

export const SiengeCostCenters = () => {
  const { data: costCenters, isLoading, error } = useCostCenters();

  if (isLoading) return <div>Carregando centros de custo...</div>;
  if (error) return <div>Erro ao carregar centros de custo</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Centros de Custo</CardTitle>
        <CardDescription>
          {costCenters?.totalElements || 0} centros de custo encontrados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {costCenters?.content.map((center) => (
            <div key={center.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">{center.name}</h3>
                <p className="text-sm text-muted-foreground">Código: {center.code}</p>
                {center.description && (
                  <p className="text-sm text-muted-foreground">{center.description}</p>
                )}
              </div>
              <Badge variant={center.active ? "default" : "secondary"}>
                {center.active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};