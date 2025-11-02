
'use client';
import Link from 'next/link';
import { LayoutGrid, Trophy, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const BottomNavbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', icon: <LayoutGrid className="w-6 h-6" /> },
    { href: '/leaderboard', icon: <Trophy className="w-6 h-6" /> },
    { href: '/profile', icon: <User className="w-6 h-6" /> },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-auto z-50">
      <div className="bg-card/80 backdrop-blur-sm rounded-full p-3 flex items-center justify-around border gap-8 px-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'transition-colors',
              pathname === link.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {link.icon}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNavbar;
