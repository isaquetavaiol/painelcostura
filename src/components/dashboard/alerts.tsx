import { AlertTriangle, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Alerts = () => {
  const alerts = [
    {
      id: 1,
      icon: <AlertTriangle className="h-4 w-4" />,
      title: 'Overdue Payment',
      description: 'Invoice #1034 for J. Doe is 5 days overdue.',
      variant: 'destructive',
    },
    {
      id: 2,
      icon: <Target className="h-4 w-4" />,
      title: 'Target Unmet',
      description: 'Monthly revenue goal is 85% complete.',
      variant: 'default',
    },
    {
      id: 3,
      icon: <AlertTriangle className="h-4 w-4" />,
      title: 'Low Material Stock',
      description: 'Silk fabric is running low. Only 2 meters left.',
      variant: 'destructive',
    },
  ];

  return (
    <Card className="h-full animate-card-in" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
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
