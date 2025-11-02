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
  { month: 'January', growth: 5.2 },
  { month: 'February', growth: 7.8 },
  { month: 'March', growth: 6.5 },
  { month: 'April', growth: 9.1 },
  { month: 'May', growth: 11.4 },
  { month: 'June', growth: 10.2 },
];

const chartConfig = {
  growth: {
    label: 'Growth',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const RevenueGrowthChart = () => {
  return (
    <Card className="h-full animate-card-in" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
      <CardHeader>
        <CardTitle>Revenue Growth</CardTitle>
        <CardDescription>Month-over-month revenue growth percentage</CardDescription>
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
