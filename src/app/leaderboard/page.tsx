import BottomNavbar from '@/components/dashboard/bottom-navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Trophy } from 'lucide-react';

const leaderboardData = [
  { rank: 1, name: 'Alexandre Dubois', profit: 5230.75, avatarId: 'user-avatar-2' },
  { rank: 2, name: 'Juliette Moreau', profit: 4980.50, avatarId: 'user-avatar-3' },
  { rank: 3, name: 'Claude Michel', profit: 4850.00, avatarId: 'user-avatar-4' },
  { rank: 4, name: 'Sophie Laurent', profit: 4500.25, avatarId: 'user-avatar-5' },
  { rank: 5, name: 'Pierre Martin', profit: 4200.90, avatarId: 'user-avatar-6' },
  { rank: 6, name: 'Marie Leclerc', profit: 3950.00, avatarId: 'user-avatar-7' },
];

const getTrophyColor = (rank: number) => {
  if (rank === 1) return 'text-yellow-400';
  if (rank === 2) return 'text-gray-400';
  if (rank === 3) return 'text-yellow-600';
  return 'text-muted-foreground';
};

export default function LeaderboardPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-6 p-4 md:p-8 pt-6 mb-32">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
         <Card>
          <CardHeader>
              <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
              <ul className="space-y-4">
                  {leaderboardData.map((user) => {
                      const avatar = PlaceHolderImages.find(p => p.id === user.avatarId);
                      return (
                          <li key={user.rank} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                              <Trophy className={`w-6 h-6 ${getTrophyColor(user.rank)}`} />
                              <span className="font-bold text-lg w-6">{user.rank}</span>
                              <Avatar>
                                  {avatar ? <AvatarImage src={avatar.imageUrl} /> : null}
                                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <span className="flex-1 font-medium">{user.name}</span>
                              <span className="font-semibold text-primary">
                                  {user.profit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                              </span>
                          </li>
                      )
                  })}
              </ul>
          </CardContent>
         </Card>
      </main>
      <BottomNavbar />
    </div>
  );
}
