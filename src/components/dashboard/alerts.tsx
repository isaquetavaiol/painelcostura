import { AlertTriangle, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Alerts = () => {
  const alerts: any[] = [
    // Example alerts, this will be replaced by dynamic data
  ];

  return (
    <Card className="h-full animate-card-in" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
      <CardHeader>
        <CardTitle>Alertas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <p className="text-muted-foreground text-center">Nenhum alerta no momento.</p>
          ) : (
            alerts.map((alert) => (
              <Alert key={alert.id} variant={alert.variant as 'default' | 'destructive'}>
                {alert.icon}
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
              </Alert>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Alerts;
