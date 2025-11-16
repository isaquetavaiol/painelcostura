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
import { FolderKanban, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  name: string;
  description?: string;
  startDate: Timestamp;
}

const projectFormSchema = z.object({
  name: z.string().min(1, 'O nome do projeto é obrigatório.'),
  description: z.string().optional(),
});

export default function ProjectsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projectsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/projects`);
  }, [user, firestore]);

  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
  });

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    form.reset({
      name: project.name,
      description: project.description,
    });
    setEditDialogOpen(true);
  };
  
  const handleDeleteProject = (projectId: string) => {
    if (!user || !firestore) return;
    const projectDocRef = doc(firestore, `users/${user.uid}/projects/${projectId}`);
    deleteDocumentNonBlocking(projectDocRef);
    toast({
      title: 'Projeto Excluído',
      description: 'O projeto foi removido com sucesso.',
    });
  };

  async function onEditSubmit(values: z.infer<typeof projectFormSchema>) {
    if (!user || !firestore || !selectedProject) return;

    const projectDocRef = doc(firestore, `users/${user.uid}/projects/${selectedProject.id}`);
    updateDocumentNonBlocking(projectDocRef, values);
    
    toast({
      title: 'Projeto Atualizado',
      description: `${values.name} foi atualizado com sucesso.`,
    });
    
    setEditDialogOpen(false);
    setSelectedProject(null);
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-6 p-4 md:p-8 pt-6 pb-28 md:pb-8">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : !projects || projects.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <FolderKanban className="w-16 h-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold">Nenhum Projeto Adicionado</h2>
              <p className="text-muted-foreground">Adicione seu primeiro projeto usando o botão '+' na barra de navegação.</p>
            </div>
        ) : (
          <div className="cards-container">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className={cn(
                  "animated-card flex flex-col w-64 shrink-0"
                )}
              >
                <CardHeader>
                  <CardTitle className="truncate">{project.name}</CardTitle>
                  {project.description && <CardDescription className="line-clamp-2 h-[40px]">{project.description}</CardDescription>}
                </CardHeader>
                <CardContent className="flex-grow">
                   <p className="text-sm text-muted-foreground">
                        Iniciado em: {project.startDate?.toDate().toLocaleDateString('pt-BR') || 'N/A'}
                    </p>
                </CardContent>
                <CardFooter className="gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditClick(project)}>
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
                            Essa ação não pode ser desfeita. Isso excluirá permanentemente o projeto.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProject(project.id)}>Excluir</AlertDialogAction>
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
              <DialogTitle>Editar Projeto</DialogTitle>
              <DialogDescription>
                Atualize os detalhes do projeto.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Projeto</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Vestido de Noiva" {...field} />
                      </FormControl>
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
                          placeholder="Descreva o projeto em detalhes..."
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
    