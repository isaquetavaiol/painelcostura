'use client';

import { useMemo } from 'react';
import BottomNavbar from '@/components/dashboard/bottom-navbar';
import { useUser, useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Trash2, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  phone?: string;
}

export default function ClientsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const clientsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/clients`);
  }, [user, firestore]);

  const { data: clients, isLoading } = useCollection<Client>(clientsQuery);

  const handleDeleteClient = (clientId: string) => {
    if (!user || !firestore) return;
    const clientDocRef = doc(firestore, `users/${user.uid}/clients/${clientId}`);
    deleteDocumentNonBlocking(clientDocRef);
    toast({
      title: 'Cliente Excluído',
      description: 'O cliente foi removido com sucesso.',
    });
  };

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
      <BottomNavbar />
    </div>
  );
}
