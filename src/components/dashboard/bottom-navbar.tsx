
'use client';
import Link from 'next/link';
import { LayoutGrid, User, FolderKanban, Scissors, DollarSign, Banknote } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const BottomNavbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', icon: <LayoutGrid className="w-6 h-6" />, label: 'Dashboard' },
    { href: '/projects', icon: <FolderKanban className="w-6 h-6" />, label: 'Projects' },
    { href: '/services', icon: <Scissors className="w-6 h-6" />, label: 'Services' },
    { href: '/revenue', icon: <DollarSign className="w-6 h-6" />, label: 'Revenue' },
    { href: '/expenses', icon: <Banknote className="w-6 h-6" />, label: 'Expenses' },
    { href: '/profile', icon: <User className="w-6 h-6" />, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-auto z-50">
      <div className="bg-card/80 backdrop-blur-sm rounded-full p-3 flex items-center justify-around border gap-6 px-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex flex-col items-center gap-1 transition-colors w-12',
              pathname === link.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
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
