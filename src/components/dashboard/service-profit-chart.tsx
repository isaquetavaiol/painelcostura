'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

const chartConfig = {
  profit: {
    label: 'Lucro',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const ServiceProfitChart = () => {
  const { user } = useUser();
  const firestore = useFirestore();

  const servicesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/services`), orderBy('price', 'desc'));
  }, [user, firestore]);

  const { data: services, isLoading } = useCollection<{ name: string, price: number }>(servicesQuery);

  const chartData = services?.map(service => ({
    service: service.name,
    profit: service.price,
  }));

  return (
    <Card className="h-full animate-card-in" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
      <CardHeader>
        <CardTitle>Rentabilidade por Serviço</CardTitle>
        <CardDescription>Lucros de ajustes, vestidos e personalizações</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : !chartData || chartData.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-muted-foreground">Nenhum serviço adicionado ainda.</p>
            </div>
          ) : (
            <BarChart 
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              accessibilityLayer
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="service"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis 
                  tickFormatter={(value) => `R$${value/1000}k`}
                  width={40}
                  tickMargin={5}
                  axisLine={false}
                  tickLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="profit" fill="var(--color-profit)" radius={8} />
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ServiceProfitChart;
