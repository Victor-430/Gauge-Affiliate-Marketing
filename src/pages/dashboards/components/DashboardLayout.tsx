import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router";



export function DashboardLayout({role}:AppSidebarProps) {
  return (
    <SidebarProvider >
      <div className="min-h-screen flex w-full ">
        <AppSidebar  role = {role}/>
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

// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { AdminSidebar } from "@/components/AdminSidebar";

// export function AdminLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <SidebarProvider>
//       <div className="min-h-screen flex w-full">
//         <AdminSidebar />
//         <main className="flex-1 flex flex-col">
//           <header className="h-14 flex items-center border-b border-border px-4">
//             <SidebarTrigger />
//           </header>
//           <div className="flex-1 p-6 lg:p-8">{children}</div>
//         </main>
//       </div>
//     </SidebarProvider>
//   );
// }


// render outlet based on params (associate or admin)