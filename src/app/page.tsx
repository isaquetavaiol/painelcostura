import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Home,
  LineChart,
  Users,
  Settings,
  Scissors,
  Wallet,
} from 'lucide-react';
import Header from '@/components/dashboard/header';
import FinancialSummary from '@/components/dashboard/financial-summary';
import ServiceProfitChart from '@/components/dashboard/service-profit-chart';
import RevenueGrowthChart from '@/components/dashboard/revenue-growth-chart';
import ExpenseBreakdownChart from '@/components/dashboard/expense-breakdown-chart';
import Alerts from '@/components/dashboard/alerts';
import PriceSimulator from '@/components/dashboard/price-simulator';
import { SewingMachineIcon } from '@/components/icons/sewing-machine-icon';

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Scissors className="text-accent h-8 w-8" />
            <h1 className="text-2xl font-headline font-semibold text-sidebar-foreground">
              Atelier
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Dashboard">
                <Home />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Analytics">
                <LineChart />
                Analytics
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Customers">
                <Users />
                Customers
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Services">
                <SewingMachineIcon className="h-4 w-4" />
                Services
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton tooltip="Finances">
                <Wallet />
                Finances
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <FinancialSummary />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4">
              <ServiceProfitChart />
            </div>
            <div className="lg:col-span-3">
              <RevenueGrowthChart />
            </div>
          </div>
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
             <div className="lg:col-span-3">
               <ExpenseBreakdownChart />
             </div>
             <div className="lg:col-span-2">
               <Alerts />
             </div>
             <div className="lg:col-span-2">
               <PriceSimulator />
             </div>
           </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
