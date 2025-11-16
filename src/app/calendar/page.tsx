'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, Timestamp } from 'firebase/firestore';
import BottomNavbar from '@/components/dashboard/bottom-navbar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

interface Project {
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

  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  const deliveryDays = useMemoFirebase(() => {
    if (!projects) return [];
    return projects
      .filter((p) => p.endDate)
      .map((p) => p.endDate!.toDate());
  }, [projects]);

  const selectedDayProjects = useMemoFirebase(() => {
    if (!date || !projects) return [];
    return projects.filter((p) =>
      p.endDate && isSameDay(p.endDate.toDate(), date)
    );
  }, [date, projects]);

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col items-center justify-center space-y-6 p-4 md:p-8 pt-6 pb-28 md:pb-8">
        <Card className="w-full max-w-md">
          <CardContent className="p-2 md:p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
              locale={ptBR}
              modifiers={{
                delivery: deliveryDays || [],
              }}
              modifiersStyles={{
                delivery: {
                  color: 'hsl(var(--primary-foreground))',
                  backgroundColor: 'hsl(var(--primary))',
                },
              }}
            />
          </CardContent>
        </Card>
        
        {date && selectedDayProjects && selectedDayProjects.length > 0 && (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                Entregas para {format(date, "dd 'de' MMMM", { locale: ptBR })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedDayProjects.map(project => (
                <div key={project.id} className="flex items-center justify-between rounded-md bg-muted p-3">
                  <p className="font-medium">{project.name}</p>
                  <Badge variant="default">Projeto</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

         {date && (!selectedDayProjects || selectedDayProjects.length === 0) && (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                Entregas para {format(date, "dd 'de' MMMM", { locale: ptBR })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Nenhuma entrega para este dia.</p>
            </CardContent>
          </Card>
        )}
      </main>
      <BottomNavbar />
    </div>
  );
}