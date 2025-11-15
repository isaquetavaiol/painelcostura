'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { DollarSign, Percent, Users, Calculator } from 'lucide-react';
import { cn } from "@/lib/utils";

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  bill: z.coerce.number().positive({ message: 'Bill must be a positive number.' }),
  tipPercent: z.coerce
    .number()
    .min(0, { message: 'Tip cannot be negative.' })
    .max(100, { message: 'Tip cannot exceed 100%.' }),
  numPeople: z.coerce.number().int().min(1, { message: 'Must be at least 1 person.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface CalculationResults {
  totalTip: number;
  grandTotal: number;
  subtotalPerPerson: number;
  tipPerPerson: number;
  totalPerPerson: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export function TippingCalculator() {
  const [results, setResults] = useState<CalculationResults | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bill: undefined,
      tipPercent: 15,
      numPeople: 1,
    },
  });

  function onSubmit(values: FormValues) {
    const { bill, tipPercent, numPeople } = values;

    const totalTip = bill * (tipPercent / 100);
    const grandTotal = bill + totalTip;
    const subtotalPerPerson = bill / numPeople;
    const tipPerPerson = totalTip / numPeople;
    const totalPerPerson = grandTotal / numPeople;

    setResults({
      totalTip,
      grandTotal,
      subtotalPerPerson,
      tipPerPerson,
      totalPerPerson,
    });
  }

  return (
    <div className="w-full max-w-2xl">
      <Card className="w-full shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl text-primary">Split It!</CardTitle>
          <CardDescription className="pt-2">A friendly tipping calculator to split the bill with friends.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="bill"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bill Amount</FormLabel>
                      <div className="relative">
                        <DollarSign className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input type="number" placeholder="0.00" min="0" step="0.01" className="pl-10" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numPeople"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of People</FormLabel>
                       <div className="relative">
                        <Users className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input type="number" min="1" step="1" className="pl-10" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="tipPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tip Percentage</FormLabel>
                     <div className="relative">
                        <Percent className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input type="number" min="0" step="1" className="pl-10" {...field} />
                        </FormControl>
                      </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full text-lg font-bold" size="lg">
                <Calculator className="mr-2 h-5 w-5" />
                Calculate
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {results && (
        <div className="mt-8 w-full animate-in fade-in-0 zoom-in-95 duration-500">
          <Card className="shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle className="text-center font-headline text-2xl">Your Split</CardTitle>
            </CardHeader>
            <CardContent className={`grid grid-cols-1 ${form.getValues('numPeople') > 1 ? 'md:grid-cols-2' : ''} gap-6`}>
                <div className="space-y-4 rounded-lg border bg-background p-6 shadow-inner">
                    <h3 className="text-center text-lg font-semibold text-primary">{form.getValues('numPeople') > 1 ? 'Total Bill' : 'Your Bill'}</h3>
                    <Separator />
                    <ResultRow label="Subtotal" value={formatCurrency(form.getValues('bill'))} />
                    <ResultRow label={`Tip (${form.getValues('tipPercent')}%)`} value={formatCurrency(results.totalTip)} isAccent />
                    <Separator />
                    <ResultRow label="Grand Total" value={formatCurrency(results.grandTotal)} isLarge />
                </div>
                {form.getValues('numPeople') > 1 && (
                    <div className="space-y-4 rounded-lg border bg-background p-6 shadow-inner">
                        <h3 className="text-center text-lg font-semibold text-primary">Per Person ({form.getValues('numPeople')})</h3>
                        <Separator />
                        <ResultRow label="Subtotal" value={formatCurrency(results.subtotalPerPerson)} />
                        <ResultRow label="Tip" value={formatCurrency(results.tipPerPerson)} isAccent />
                        <Separator />
                        <ResultRow label="Total" value={formatCurrency(results.totalPerPerson)} isLarge />
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

const ResultRow = ({ label, value, isAccent = false, isLarge = false }: { label: string, value: string, isAccent?: boolean, isLarge?: boolean }) => (
    <div className={`flex items-baseline justify-between ${isLarge ? 'font-bold' : ''}`}>
        <span className={cn('text-sm', isAccent ? 'text-accent' : 'text-muted-foreground')}>{label}</span>
        <span className={cn(
            'font-medium',
            isLarge ? 'text-xl text-foreground' : 'text-foreground',
            isAccent ? 'text-accent' : ''
        )}>{value}</span>
    </div>
);
