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
  { category: 'Materials', value: 450, fill: 'var(--color-materials)' },
  { category: 'Rent', value: 1200, fill: 'var(--color-rent)' },
  { category: 'Supplies', value: 250, fill: 'var(--color-supplies)' },
];

const chartConfig = {
  value: {
    label: 'Value',
  },
  materials: {
    label: 'Materials',
    color: 'hsl(var(--chart-1))',
  },
  rent: {
    label: 'Rent',
    color: 'hsl(var(--chart-2))',
  },
  supplies: {
    label: 'Supplies',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

const ExpenseBreakdownChart = () => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="font-headline">Expense Breakdown</CardTitle>
        <CardDescription>Monthly expense distribution</CardDescription>
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
