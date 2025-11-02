import Link from 'next/link';
import { LayoutGrid, Trophy } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const BottomNavbar = () => {
    const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

    return (
        <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] z-50">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-full p-3 flex items-center justify-around">
                 <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    <LayoutGrid className="w-6 h-6" />
                </Link>
                <Link href="/leaderboard" className="text-gray-400 hover:text-white transition-colors">
                    <Trophy className="w-6 h-6" />
                </Link>
                <Avatar className="h-8 w-8">
                    {userAvatar ? (
                    <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />
                    ) : null}
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
};

export default BottomNavbar;
