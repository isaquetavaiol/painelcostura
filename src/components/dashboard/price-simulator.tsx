'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calculator } from 'lucide-react';

const formSchema = z.object({
  materialCost: z.coerce.number().min(0, { message: 'Deve ser um número positivo' }),
  laborTime: z.coerce.number().min(0, { message: 'Deve ser um número positivo' }),
});

const HOURLY_RATE = 75; // Valor da hora de trabalho do ateliê

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
    const profitMargin = 1.3; // 30% de margem de lucro
    const price = (values.materialCost + values.laborTime * HOURLY_RATE) * profitMargin;
    setSuggestedPrice(price);
  }

  return (
    <Card className="h-full flex flex-col animate-card-in" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
      <CardHeader>
        <CardTitle>Simulador de Preços</CardTitle>
        <CardDescription>Sugira preços ideais para projetos.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-grow flex flex-col">
          <CardContent className="space-y-4 flex-grow">
            <FormField
              control={form.control}
              name="materialCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custos de Material (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="ex: 50,00" {...field} />
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
                  <FormLabel>Tempo de Trabalho (horas)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="ex: 4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {suggestedPrice !== null && (
              <div className="pt-4 text-center">
                 <p className="text-sm text-muted-foreground">Preço Sugerido:</p>
                 <p className="text-3xl font-bold text-primary">
                   {suggestedPrice.toLocaleString('pt-BR', {
                     style: 'currency',
                     currency: 'BRL',
                   })}
                 </p>
                 <p className="text-xs text-muted-foreground">(inclui 30% de margem de lucro)</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Calcular Preço
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default PriceSimulator;
