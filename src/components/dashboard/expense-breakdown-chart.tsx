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

const chartData = [
  { category: 'Materiais', value: 450, fill: 'var(--color-materials)' },
  { category: 'Aluguel', value: 1200, fill: 'var(--color-rent)' },
  { category: 'Suprimentos', value: 250, fill: 'var(--color-supplies)' },
];

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
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseBreakdownChart;
