'use client';
import Link from 'next/link';
import {
  LayoutGrid,
  User,
  FolderKanban,
  Scissors,
  DollarSign,
  Banknote,
  Plus,
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
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const serviceFormSchema = z.object({
  name: z.string().min(1, 'Service name is required.'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be a positive number.'),
});

const BottomNavbar = () => {
  const pathname = usePathname();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
    },
  });

  const navLinks = [
    { href: '/', icon: <LayoutGrid className="w-6 h-6" />, label: 'Dashboard' },
    { href: '/projects', icon: <FolderKanban className="w-6 h-6" />, label: 'Projects' },
    { href: '/services', icon: <Scissors className="w-6 h-6" />, label: 'Services' },
  ];

  const secondaryNavLinks = [
      { href: '/revenue', icon: <DollarSign className="w-6 h-6" />, label: 'Revenue' },
      { href: '/expenses', icon: <Banknote className="w-6 h-6" />, label: 'Expenses' },
      { href: '/profile', icon: <User className="w-6 h-6" />, label: 'Profile' },
  ]

  async function onSubmit(values: z.infer<typeof serviceFormSchema>) {
    if (!user || !firestore) return;

    const servicesCollection = collection(firestore, `users/${user.uid}/services`);
    addDocumentNonBlocking(servicesCollection, values);
    
    toast({
      title: 'Service Added',
      description: `${values.name} has been successfully added.`,
    });
    
    form.reset();
    setDialogOpen(false);
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-auto z-50">
      <div className="bg-card/80 backdrop-blur-sm rounded-full p-3 flex items-center justify-around border gap-3 px-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex flex-col items-center gap-1 transition-colors w-14 text-center',
              pathname === link.href
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {link.icon}
            <span className="text-xs">{link.label}</span>
          </Link>
        ))}

        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="w-16 h-16 rounded-full flex flex-col items-center justify-center gap-1 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs font-bold">Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>
                Fill out the details for the new service you want to offer.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Custom Suit Tailoring" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 250.00" {...field} />
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
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the service in detail..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Add Service</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

         {secondaryNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex flex-col items-center gap-1 transition-colors w-14 text-center',
              pathname === link.href
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {link.icon}
            <span className="text-xs">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
