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
  { service: 'Adjustments', profit: 1860.45 },
  { service: 'Dresses', profit: 3050.80 },
  { service: 'Custom', profit: 2370.00 },
  { service: 'Repairs', profit: 890.10 },
  { service: 'Bridal', profit: 4500.25 },
];

const chartConfig = {
  profit: {
    label: 'Profit',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const ServiceProfitChart = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Service Profitability</CardTitle>
        <CardDescription>Profits from tailoring, dresses, and customizations</CardDescription>
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
                tickFormatter={(value) => `$${value/1000}k`}
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
