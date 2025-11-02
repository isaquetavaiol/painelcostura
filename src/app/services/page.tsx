
import BottomNavbar from '@/components/dashboard/bottom-navbar';

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-6 p-4 md:p-8 pt-6 mb-28">
        <h1 className="text-3xl font-bold">Serviços</h1>
        {/* Page content goes here */}
      </main>
      <BottomNavbar />
    </div>
  );
}
