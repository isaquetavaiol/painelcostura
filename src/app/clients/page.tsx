'use client';

import { useState, useRef, useEffect } from 'react';
import BottomNavbar from '@/components/dashboard/bottom-navbar';
import { useUser, useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, UserCircle, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Client {
  id: string;
  name: string;
  phone?: string;
}

interface EditableFieldProps {
  initialValue: string;
  onSave: (newValue: string) => void;
}

function EditableField({ initialValue, onSave }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (value.trim() !== initialValue.trim()) {
      onSave(value);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="h-8"
        />
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSave}><Check className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCancel}><X className="h-4 w-4" /></Button>
      </div>
    );
  }

  return (
    <div onDoubleClick={() => setIsEditing(true)} className="w-full cursor-pointer rounded-md px-2 py-1 hover:bg-muted">
      {value || <span className="text-muted-foreground">N/A</span>}
    </div>
  );
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

  const handleUpdateClient = (clientId: string, field: 'name' | 'phone', value: string) => {
    if (!user || !firestore) return;
    const clientDocRef = doc(firestore, `users/${user.uid}/clients/${clientId}`);
    updateDocumentNonBlocking(clientDocRef, { [field]: value });
    toast({
      title: 'Cliente Atualizado',
      description: `O campo ${field === 'name' ? 'nome' : 'telefone'} foi atualizado.`,
    });
  }


  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-6 p-4 md:p-8 pt-6 pb-28 md:pb-8">
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
          <div className="cards-container">
            {clients.map((client) => (
              <Card
                key={client.id}
                className={cn("animated-card flex flex-col w-64 shrink-0")}
              >
                 <CardHeader>
                  <CardTitle className="truncate">{client.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                   <p className="text-sm text-muted-foreground">{client.phone || 'Nenhum telefone'}</p>
                </CardContent>
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
