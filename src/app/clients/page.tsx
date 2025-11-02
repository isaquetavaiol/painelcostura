'use client';

import { useState } from 'react';
import BottomNavbar from '@/components/dashboard/bottom-navbar';
import { useUser, useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Pencil, Trash2, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  phone?: string;
}

const clientFormSchema = z.object({
  name: z.string().min(1, 'O nome do cliente é obrigatório.'),
  phone: z.string().optional(),
});


export default function ClientsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const clientsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/clients`);
  }, [user, firestore]);

  const { data: clients, isLoading } = useCollection<Client>(clientsQuery);

  const form = useForm<z.infer<typeof clientFormSchema>>({
    resolver: zodResolver(clientFormSchema),
  });

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    form.reset({
      name: client.name,
      phone: client.phone,
    });
    setEditDialogOpen(true);
  };
  
  const handleDeleteClient = (clientId: string) => {
    if (!user || !firestore) return;
    const clientDocRef = doc(firestore, `users/${user.uid}/clients/${clientId}`);
    deleteDocumentNonBlocking(clientDocRef);
    toast({
      title: 'Cliente Excluído',
      description: 'O cliente foi removido com sucesso.',
    });
  };

  async function onEditSubmit(values: z.infer<typeof clientFormSchema>) {
    if (!user || !firestore || !selectedClient) return;

    const clientDocRef = doc(firestore, `users/${user.uid}/clients/${selectedClient.id}`);
    updateDocumentNonBlocking(clientDocRef, values);
    
    toast({
      title: 'Cliente Atualizado',
      description: `${values.name} foi atualizado com sucesso.`,
    });
    
    setEditDialogOpen(false);
    setSelectedClient(null);
  }


  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-6 p-4 md:p-8 pt-6 mb-28">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : !clients || clients.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <UserCircle className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold">Nenhum Cliente Adicionado</h2>
              <p className="text-muted-foreground">Adicione seu primeiro cliente usando o botão '+' na barra de navegação.</p>
            </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {clients.map((client, index) => (
              <Card 
                key={client.id} 
                className="flex flex-col animate-card-in" 
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
              >
                <CardHeader>
                  <CardTitle className="truncate">{client.name}</CardTitle>
                  {client.phone && <CardDescription className="line-clamp-2 h-[40px]">{client.phone}</CardDescription>}
                </CardHeader>
                <CardContent className="flex-grow" />
                <CardFooter className="gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditClick(client)}>
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
                            Essa ação não pode ser desfeita. Isso excluirá permanentemente o cliente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteClient(client.id)}>Excluir</AlertDialogAction>
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
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>
                Atualize os detalhes do cliente.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Juliana Costa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone (Opcional)</FormLabel>
                      <FormControl>
                         <Input type="tel" placeholder="ex: (11) 98765-4321" {...field} />
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
