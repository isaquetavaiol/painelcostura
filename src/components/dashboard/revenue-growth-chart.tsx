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

const chartData = [
  { month: 'Janeiro', growth: 5.2 },
  { month: 'Fevereiro', growth: 7.8 },
  { month: 'Março', growth: 6.5 },
  { month: 'Abril', growth: 9.1 },
  { month: 'Maio', growth: 11.4 },
  { month: 'Junho', growth: 10.2 },
];

const chartConfig = {
  growth: {
    label: 'Crescimento',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const RevenueGrowthChart = () => {
  return (
    <Card className="h-full animate-card-in" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
      <CardHeader>
        <CardTitle>Crescimento da Receita</CardTitle>
        <CardDescription>Percentual de crescimento da receita mês a mês</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
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
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
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
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueGrowthChart;
