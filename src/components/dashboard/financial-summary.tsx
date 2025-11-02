import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
  LineChart,
} from 'lucide-react';

const FinancialSummary = () => {
  const summaryData = [
    {
      title: 'Daily Revenue',
      value: '$1,895.50',
      icon: <CircleDollarSign className="h-6 w-6 text-muted-foreground" />,
      change: '+15.2% from yesterday',
    },
    {
      title: 'Daily Expenses',
      value: '$450.75',
      icon: <TrendingDown className="h-6 w-6 text-muted-foreground" />,
      change: '-5.1% from yesterday',
    },
    {
      title: 'Net Profit',
      value: '$1,444.75',
      icon: <TrendingUp className="h-6 w-6 text-muted-foreground" />,
      change: '+20.3% from yesterday',
    },
    {
      title: 'Revenue Forecast',
      value: '$25,500',
      icon: <LineChart className="h-6 w-6 text-muted-foreground" />,
      change: 'for this month',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryData.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-body">{item.title}</CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FinancialSummary;
