'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';

const chartConfig = {
  growth: {
    label: 'Receita',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const RevenueGrowthChart = () => {
  const { user } = useUser();
  const firestore = useFirestore();

  const revenueQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/revenues`), orderBy('date', 'asc'));
  }, [user, firestore]);

  const { data: revenues, isLoading } = useCollection<{ date: Timestamp, amount: number }>(revenueQuery);

  const chartData = revenues?.reduce((acc, revenue) => {
    const date = revenue.date.toDate();
    const month = date.toLocaleString('pt-BR', { month: 'long' });
    const existingMonth = acc.find(item => item.month === month);

    if (existingMonth) {
      existingMonth.growth += revenue.amount;
    } else {
      acc.push({ month: month, growth: revenue.amount });
    }
    return acc;
  }, [] as { month: string, growth: number }[]);

  return (
    <Card className="h-full animate-card-in" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
      <CardHeader>
        <CardTitle>Crescimento da Receita</CardTitle>
        <CardDescription>Receita mês a mês</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          {isLoading ? (
             <div className="flex h-full w-full items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : !chartData || chartData.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-muted-foreground">Nenhuma receita registrada ainda.</p>
            </div>
          ) : (
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickFormatter={(value) => `R$${value / 1000}k`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={50}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area
                dataKey="growth"
                type="natural"
                fill="var(--color-growth)"
                fillOpacity={0.4}
                stroke="var(--color-growth)"
                stackId="a"
              />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueGrowthChart;
