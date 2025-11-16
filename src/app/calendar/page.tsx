'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, Timestamp } from 'firebase/firestore';
import BottomNavbar from '@/components/dashboard/bottom-navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import CustomCalendar from '@/components/custom-calendar';

interface Project {
  id: string;
  name: string;
  endDate?: Timestamp;
}

interface Service {
    id: string;
    name: string;
    endDate?: Timestamp;
}

export default function CalendarPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const projectsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/projects`);
  }, [user, firestore]);

  const servicesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/services`);
  }, [user, firestore]);

  const { data: projects, isLoading: isLoadingProjects } = useCollection<Project>(projectsQuery);
  const { data: services, isLoading: isLoadingServices } = useCollection<Service>(servicesQuery);

  const deliveryDays = useMemo(() => {
    const projectDays = projects?.filter((p) => p.endDate).map((p) => p.endDate!.toDate()) || [];
    const serviceDays = services?.filter((s) => s.endDate).map((s) => s.endDate!.toDate()) || [];
    return [...projectDays, ...serviceDays];
  }, [projects, services]);

  const selectedDayProjects = useMemo(() => {
    if (!date || !projects) return [];
    return projects.filter((p) =>
      p.endDate && isSameDay(p.endDate.toDate(), date)
    );
  }, [date, projects]);

  const selectedDayServices = useMemo(() => {
    if (!date || !services) return [];
    return services.filter((s) =>
      s.endDate && isSameDay(s.endDate.toDate(), date)
    );
  }, [date, services]);

  if (isUserLoading || isLoadingProjects || isLoadingServices) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const hasDeliveries = selectedDayProjects.length > 0 || selectedDayServices.length > 0;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col items-center space-y-6 p-4 pt-6 pb-28 md:p-8 md:pb-8">
        <CustomCalendar
            selected={date}
            onSelect={(d) => setDate(d)}
            deliveryDays={deliveryDays}
        />
        
        {date && (
           <div className="w-full max-w-md">
            <Card>
                <CardHeader>
                <CardTitle>
                    Entregas para {format(date, "dd 'de' MMMM", { locale: ptBR })}
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {!hasDeliveries ? (
                        <p className="text-muted-foreground">Nenhuma entrega para este dia.</p>
                    ) : (
                        <>
                            {selectedDayProjects.map(project => (
                                <div key={project.id} className="flex items-center justify-between rounded-md bg-muted p-3">
                                <p className="font-medium">{project.name}</p>
                                <Badge variant="default">Projeto</Badge>
                                </div>
                            ))}
                            {selectedDayServices.map(service => (
                                <div key={service.id} className="flex items-center justify-between rounded-md bg-muted p-3">
                                <p className="font-medium">{service.name}</p>
                                <Badge variant="secondary">Serviço</Badge>
                                </div>
                            ))}
                        </>
                    )}
                </CardContent>
            </Card>
           </div>
        )}
      </main>
      <BottomNavbar />
    </div>
  );
}
