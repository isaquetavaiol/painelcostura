'use client';

import BottomNavbar from '@/components/dashboard/bottom-navbar';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Scissors } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export default function ServicesPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const servicesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/services`);
  }, [user, firestore]);

  const { data: services, isLoading } = useCollection<Service>(servicesQuery);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-6 p-4 md:p-8 pt-6 mb-28">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : !services || services.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <Scissors className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold">Nenhum Serviço Adicionado</h2>
              <p className="text-muted-foreground">Adicione seu primeiro serviço usando o botão '+' na barra de navegação.</p>
            </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service, index) => (
              <Card 
                key={service.id} 
                className="flex flex-col animate-card-in" 
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
              >
                <CardHeader>
                  <CardTitle className="truncate">{service.name}</CardTitle>
                  {service.description && <CardDescription className="truncate">{service.description}</CardDescription>}
                </CardHeader>
                <CardContent className="flex-grow"></CardContent>
                <CardFooter>
                    <p className="text-2xl font-bold text-primary">
                        {service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
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
