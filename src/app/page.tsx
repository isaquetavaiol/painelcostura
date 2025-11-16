'use client';

import ServiceProfitChart from '@/components/dashboard/service-profit-chart';
import Alerts from '@/components/dashboard/alerts';
import PriceSimulator from '@/components/dashboard/price-simulator';
import BottomNavbar from '@/components/dashboard/bottom-navbar';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-6 p-4 md:p-8 pt-6 pb-28 md:pb-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-7 md:col-span-1">
            <ServiceProfitChart />
          </div>
        </div>
         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
           <div className="lg:col-span-3 md:col-span-1">
             <Alerts />
           </div>
           <div className="lg:col-span-4 md:col-span-1">
             <PriceSimulator />
           </div>
         </div>
      </main>
      <BottomNavbar />
    </div>
  );
}
