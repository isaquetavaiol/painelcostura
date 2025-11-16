
import BottomNavbar from '@/components/dashboard/bottom-navbar';

export default function ExpensesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-6 p-4 md:p-8 pt-6 pb-28 md:pb-8">
        <h1 className="text-3xl font-bold">Despesas</h1>
        {/* Page content goes here */}
      </main>
      <BottomNavbar />
    </div>
  );
}
