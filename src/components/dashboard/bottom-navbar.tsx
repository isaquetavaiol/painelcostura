import Link from 'next/link';
import { LayoutGrid, Trophy, User } from 'lucide-react';

const BottomNavbar = () => {
    return (
        <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] z-50">
            <div className="bg-card/80 backdrop-blur-sm rounded-full p-3 flex items-center justify-around border">
                 <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    <LayoutGrid className="w-6 h-6" />
                </Link>
                <Link href="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">
                    <Trophy className="w-6 h-6" />
                </Link>
                 <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    <User className="w-6 h-6" />
                </Link>
            </div>
        </div>
    );
};

export default BottomNavbar;
