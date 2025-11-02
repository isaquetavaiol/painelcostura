'use client';

import { Pie, PieChart, Cell } from 'recharts';
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
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

const chartConfig = {
  value: {
    label: 'Valor',
  },
  materials: {
    label: 'Materiais',
    color: 'hsl(var(--chart-1))',
  },
  rent: {
    label: 'Aluguel',
    color: 'hsl(var(--chart-2))',
  },
  supplies: {
    label: 'Suprimentos',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

const ExpenseBreakdownChart = () => {
    const { user } = useUser();
    const firestore = useFirestore();

    const expensesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/expenses`);
    }, [user, firestore]);

    const { data: expenses, isLoading } = useCollection<{ category: string; amount: number }>(expensesQuery);

    const chartData = expenses?.map((expense, index) => ({
        category: expense.category,
        value: expense.amount,
        fill: `var(--color-chart-${(index % 3) + 1})`,
    }));

  return (
    <Card className="flex flex-col h-full animate-card-in" style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}>
      <CardHeader>
        <CardTitle>Detalhamento de Despesas</CardTitle>
        <CardDescription>Distribuição mensal de despesas</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : !chartData || chartData.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center">
                <p className="text-muted-foreground">Nenhuma despesa registrada ainda.</p>
            </div>
          ) : (
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
            </Pie>
             <ChartLegend
                content={<ChartLegendContent nameKey="category" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseBreakdownChart;
