import { AlertTriangle, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Alerts = () => {
  const alerts = [
    {
      id: 1,
      icon: <AlertTriangle className="h-4 w-4" />,
      title: 'Pagamento Atrasado',
      description: 'A fatura nº 1034 para J. Doe está 5 dias atrasada.',
      variant: 'destructive',
    },
    {
      id: 2,
      icon: <Target className="h-4 w-4" />,
      title: 'Meta não Atingida',
      description: 'A meta de receita mensal está 85% concluída.',
      variant: 'default',
    },
    {
      id: 3,
      icon: <AlertTriangle className="h-4 w-4" />,
      title: 'Estoque Baixo de Material',
      description: 'O tecido de seda está acabando. Restam apenas 2 metros.',
      variant: 'destructive',
    },
  ];

  return (
    <Card className="h-full animate-card-in" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
      <CardHeader>
        <CardTitle>Alertas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Alert key={alert.id} variant={alert.variant as 'default' | 'destructive'}>
              {alert.icon}
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Alerts;
