
'use client';

import BottomNavbar from '@/components/dashboard/bottom-navbar';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const auth = useAuth();
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 flex items-center justify-center space-y-6 p-4 md:p-8 pt-6 pb-28 md:pb-8">
        <Card className="w-full max-w-md">
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              {user?.photoURL ? (
                <AvatarImage src={user.photoURL} alt="User Avatar" />
              ) : userAvatar ? (
                <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />
              ) : null}
              <AvatarFallback className="text-3xl">{user?.email?.[0].toUpperCase() ?? 'A'}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{user.displayName || user.email}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">E-mail</span>
                    <span>{user.email}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Membro desde</span>
                    <span>{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</span>
                </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" className="w-full" onClick={handleLogout}>Sair</Button>
          </CardFooter>
        </Card>
      </main>
      <BottomNavbar />
    </div>
  );
}
