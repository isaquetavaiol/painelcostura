'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calculator, Wand2 } from 'lucide-react';

const formSchema = z.object({
  materialCost: z.coerce.number().min(0, { message: 'Must be a positive number' }),
  laborTime: z.coerce.number().min(0, { message: 'Must be a positive number' }),
});

const HOURLY_RATE = 75; // Atelier's hourly labor rate

const PriceSimulator = () => {
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      materialCost: 0,
      laborTime: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const profitMargin = 1.3; // 30% profit margin
    const price = (values.materialCost + values.laborTime * HOURLY_RATE) * profitMargin;
    setSuggestedPrice(price);
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">Price Simulator</CardTitle>
        <CardDescription>Suggest optimal project prices.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-grow flex flex-col">
          <CardContent className="space-y-4 flex-grow">
            <FormField
              control={form.control}
              name="materialCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Costs ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="laborTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Labor Time (hours)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {suggestedPrice !== null && (
              <div className="pt-4 text-center">
                 <p className="text-sm text-muted-foreground">Suggested Price:</p>
                 <p className="text-3xl font-bold text-accent">
                   {suggestedPrice.toLocaleString('en-US', {
                     style: 'currency',
                     currency: 'USD',
                   })}
                 </p>
                 <p className="text-xs text-muted-foreground">(includes 30% profit margin)</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Price
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default PriceSimulator;
