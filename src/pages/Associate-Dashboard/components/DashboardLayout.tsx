import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router";

export function DashboardLayout() {
  return (
    <SidebarProvider >
      <div className="min-h-screen flex w-full ">
        <AppSidebar  />
        <main className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b px-4">
            <SidebarTrigger />
          </header>
          <div className="flex-1 p-6 lg:p-8"><Outlet /></div>
        </main>
      </div>
    </SidebarProvider>
  );
}
