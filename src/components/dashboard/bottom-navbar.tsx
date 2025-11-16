'use client';
import Link from 'next/link';
import {
  LayoutGrid,
  User,
  FolderKanban,
  Scissors,
  DollarSign,
  Plus,
  UserPlus,
  ArrowDown,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';

const serviceFormSchema = z.object({
  name: z.string().min(1, 'O nome do serviço é obrigatório.'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'O preço deve ser um número positivo.'),
});

const clientFormSchema = z.object({
  name: z.string().min(1, 'O nome do cliente é obrigatório.'),
  phone: z.string().optional(),
});

const projectFormSchema = z.object({
  name: z.string().min(1, 'O nome do projeto é obrigatório.'),
  description: z.string().optional(),
});

const revenueFormSchema = z.object({
  description: z.string().optional(),
  amount: z.coerce.number().min(0, 'O valor deve ser um número positivo.'),
  date: z.date({ required_error: 'A data é obrigatória.' }),
});


const BottomNavbar = () => {
  const pathname = usePathname();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const serviceForm = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: { name: '', description: '', price: 0 },
  });

  const clientForm = useForm<z.infer<typeof clientFormSchema>>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: { name: '', phone: '' },
  });

  const projectForm = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { name: '', description: '' },
  });
  
  const revenueForm = useForm<z.infer<typeof revenueFormSchema>>({
    resolver: zodResolver(revenueFormSchema),
    defaultValues: { amount: 0, description: '' },
  });

  const navLinks = [
    { href: '/', icon: <LayoutGrid className="w-6 h-6" /> },
    { href: '/projects', icon: <FolderKanban className="w-6 h-6" /> },
    { href: '/services', icon: <Scissors className="w-6 h-6" /> },
    { href: '/revenue', icon: <DollarSign className="w-6 h-6" /> },
    { href: '/expenses', icon: <ArrowDown className="w-6 h-6" /> },
    { href: '/clients', icon: <UserPlus className="w-6 h-6" /> },
    { href: '/profile', icon: <User className="w-6 h-6" /> },
  ];

  const leftLinks = navLinks.slice(0, 3);
  const rightLinks = navLinks.slice(3);


  async function onServiceSubmit(values: z.infer<typeof serviceFormSchema>) {
    if (!user || !firestore) return;
    const servicesCollection = collection(firestore, `users/${user.uid}/services`);
    addDocumentNonBlocking(servicesCollection, values);
    toast({ title: 'Serviço Adicionado', description: `${values.name} foi adicionado.` });
    serviceForm.reset();
    setDialogOpen(false);
  }

  async function onClientSubmit(values: z.infer<typeof clientFormSchema>) {
    if (!user || !firestore) return;
    const clientsCollection = collection(firestore, `users/${user.uid}/clients`);
    addDocumentNonBlocking(clientsCollection, values);
    toast({ title: 'Cliente Adicionado', description: `${values.name} foi adicionado.` });
    clientForm.reset();
    setDialogOpen(false);
  }

  async function onProjectSubmit(values: z.infer<typeof projectFormSchema>) {
    if (!user || !firestore) return;
    const projectsCollection = collection(firestore, `users/${user.uid}/projects`);
    addDocumentNonBlocking(projectsCollection, {
      ...values,
      startDate: serverTimestamp(),
    });
    toast({ title: 'Projeto Adicionado', description: `${values.name} foi adicionado.` });
    projectForm.reset();
    setDialogOpen(false);
  }

  async function onRevenueSubmit(values: z.infer<typeof revenueFormSchema>) {
    if (!user || !firestore) return;
    const revenuesCollection = collection(firestore, `users/${user.uid}/revenues`);
    addDocumentNonBlocking(revenuesCollection, {
      ...values,
      date: Timestamp.fromDate(values.date),
    });
    toast({ title: 'Receita Adicionada', description: `Um novo registro de receita foi adicionado.` });
    revenueForm.reset();
    setDialogOpen(false);
  }


  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-auto z-50">
      <div className="bg-card/80 backdrop-blur-sm rounded-full p-2 flex items-center justify-around border gap-1">
        {leftLinks.map((link) => (
          <Button 
            key={link.href}
            variant="ghost"
            size="icon"
            className={cn(
              'rounded-full w-12 h-12',
              pathname === link.href ? 'bg-primary/20 text-primary' : 'text-muted-foreground'
            )}
            asChild
          >
            <Link href={link.href}>
              {link.icon}
            </Link>
          </Button>
        ))}

        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="icon"
              className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 mx-2"
            >
              <Plus className="w-7 h-7" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Tabs defaultValue="service" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="service">Serviço</TabsTrigger>
                <TabsTrigger value="client">Cliente</TabsTrigger>
                <TabsTrigger value="project">Projeto</TabsTrigger>
                <TabsTrigger value="revenue">Receita</TabsTrigger>
              </TabsList>
              <TabsContent value="service">
                <DialogHeader className="text-center">
                  <DialogTitle>Adicionar Novo Serviço</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes do novo serviço que você deseja oferecer.
                  </DialogDescription>
                </DialogHeader>
                <Form {...serviceForm}>
                  <form onSubmit={serviceForm.handleSubmit(onServiceSubmit)} className="space-y-4 py-4">
                    <FormField
                      control={serviceForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Serviço</FormLabel>
                          <FormControl>
                            <Input placeholder="ex: Terno Sob Medida" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={serviceForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preço (R$)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="ex: 250,00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={serviceForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição (Opcional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Descreva o serviço em detalhes..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter className="justify-center">
                       <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
                      <Button type="submit">Adicionar Serviço</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="client">
                 <DialogHeader className="text-center">
                  <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                  <DialogDescription>
                    Preencha os dados básicos do seu novo cliente.
                  </DialogDescription>
                </DialogHeader>
                <Form {...clientForm}>
                  <form onSubmit={clientForm.handleSubmit(onClientSubmit)} className="space-y-4 py-4">
                    <FormField
                      control={clientForm.control}
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
                      control={clientForm.control}
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
                    <DialogFooter className="justify-center">
                      <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
                      <Button type="submit">Adicionar Cliente</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="project">
                <DialogHeader className="text-center">
                  <DialogTitle>Adicionar Novo Projeto</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes do novo projeto.
                  </DialogDescription>
                </DialogHeader>
                <Form {...projectForm}>
                  <form onSubmit={projectForm.handleSubmit(onProjectSubmit)} className="space-y-4 py-4">
                    <FormField
                      control={projectForm.control}
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
                      control={projectForm.control}
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
                    <DialogFooter className="justify-center">
                      <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
                      <Button type="submit">Adicionar Projeto</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </TabsContent>
               <TabsContent value="revenue">
                <DialogHeader className="text-center">
                  <DialogTitle>Adicionar Nova Receita</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes do novo registro de receita.
                  </DialogDescription>
                </DialogHeader>
                <Form {...revenueForm}>
                  <form onSubmit={revenueForm.handleSubmit(onRevenueSubmit)} className="space-y-4 py-4">
                    <FormField
                      control={revenueForm.control}
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
                      control={revenueForm.control}
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
                      control={revenueForm.control}
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
                    <DialogFooter className="justify-center">
                       <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
                      <Button type="submit">Adicionar Receita</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
        
        {rightLinks.map((link) => (
          <Button 
            key={link.href}
            variant="ghost"
            size="icon"
            className={cn(
              'rounded-full w-12 h-12',
              pathname === link.href ? 'bg-primary/20 text-primary' : 'text-muted-foreground'
            )}
            asChild
          >
            <Link href={link.href}>
              {link.icon}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
