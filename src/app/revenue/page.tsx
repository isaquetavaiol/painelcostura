'use client';

import { useState } from 'react';
import BottomNavbar from '@/components/dashboard/bottom-navbar';
import { useUser, useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc, Timestamp } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DollarSign, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

interface Revenue {
  id: string;
  description?: string;
  amount: number;
  date: Timestamp;
}

const revenueFormSchema = z.object({
  description: z.string().optional(),
  amount: z.coerce.number().min(0, 'O valor deve ser um número positivo.'),
  date: z.date({ required_error: 'A data é obrigatória.' }),
});

export default function RevenuePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRevenue, setSelectedRevenue] = useState<Revenue | null>(null);

  const revenuesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/revenues`);
  }, [user, firestore]);

  const { data: revenues, isLoading } = useCollection<Revenue>(revenuesQuery);

  const form = useForm<z.infer<typeof revenueFormSchema>>({
    resolver: zodResolver(revenueFormSchema),
  });

  const handleEditClick = (revenue: Revenue) => {
    setSelectedRevenue(revenue);
    form.reset({
      description: revenue.description,
      amount: revenue.amount,
      date: revenue.date.toDate(),
    });
    setEditDialogOpen(true);
  };
  
  const handleDeleteRevenue = (revenueId: string) => {
    if (!user || !firestore) return;
    const revenueDocRef = doc(firestore, `users/${user.uid}/revenues/${revenueId}`);
    deleteDocumentNonBlocking(revenueDocRef);
    toast({
      title: 'Receita Excluída',
      description: 'O registro de receita foi removido com sucesso.',
    });
  };

  async function onEditSubmit(values: z.infer<typeof revenueFormSchema>) {
    if (!user || !firestore || !selectedRevenue) return;

    const revenueDocRef = doc(firestore, `users/${user.uid}/revenues/${selectedRevenue.id}`);
    updateDocumentNonBlocking(revenueDocRef, {
      ...values,
      date: Timestamp.fromDate(values.date),
    });
    
    toast({
      title: 'Receita Atualizada',
      description: `O registro foi atualizado com sucesso.`,
    });
    
    setEditDialogOpen(false);
    setSelectedRevenue(null);
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-6 p-4 md:p-8 pt-6 pb-28 md:pb-8">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : !revenues || revenues.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <DollarSign className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold">Nenhuma Receita Adicionada</h2>
              <p className="text-muted-foreground">Adicione seu primeiro registro de receita usando o botão '+' na barra de navegação.</p>
            </div>
        ) : (
          <div className="cards-container">
            {revenues.map((revenue) => (
              <Card 
                key={revenue.id} 
                className={cn(
                  "animated-card flex flex-col w-64 shrink-0"
                )}
              >
                <CardHeader>
                  <CardTitle className="truncate text-2xl font-bold text-primary">
                    {revenue.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </CardTitle>
                  {revenue.description && <CardDescription className="line-clamp-2 h-[40px]">{revenue.description}</CardDescription>}
                </CardHeader>
                <CardContent className="flex-grow">
                   <p className="text-sm text-muted-foreground">
                        Data: {revenue.date?.toDate().toLocaleDateString('pt-BR') || 'N/A'}
                    </p>
                </CardContent>
                <CardFooter className="gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditClick(revenue)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita. Isso excluirá permanentemente o registro de receita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteRevenue(revenue.id)}>Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
        <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Receita</DialogTitle>
              <DialogDescription>
                Atualize os detalhes do registro de receita.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="ex: 150,00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data da Receita</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Escolha uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva a origem da receita..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit">Salvar Alterações</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      <BottomNavbar />
    </div>
  );
}
