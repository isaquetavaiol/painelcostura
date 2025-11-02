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

const chartData = [
  { service: 'Ajustes', profit: 1860.45 },
  { service: 'Vestidos', profit: 3050.80 },
  { service: 'Personalizado', profit: 2370.00 },
  { service: 'Reparos', profit: 890.10 },
  { service: 'Noivas', profit: 4500.25 },
];

const chartConfig = {
  profit: {
    label: 'Lucro',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const ServiceProfitChart = () => {
  return (
    <Card className="h-full animate-card-in" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
      <CardHeader>
        <CardTitle>Rentabilidade por Serviço</CardTitle>
        <CardDescription>Lucros de ajustes, vestidos e personalizações</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart 
            data={chartData}
            margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
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
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="profit" fill="var(--color-profit)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ServiceProfitChart;
