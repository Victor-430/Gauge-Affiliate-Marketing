import {
  LayoutDashboard,
  Users,
  SendHorizontal,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { mockAssociate } from "@/data/mockData";

const navItems = [
  {
    title: "Dashboard",
    url: "/associate/dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  { title: "Leads", url: "/associate/leads", icon: Users, active: true },
  { title: "Submit Lead", url: "#", icon: SendHorizontal, active: true },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-6 border-b border-white ">
        <div className="flex items-center gap-2">
         
            <img src="/gauge-logo.png" alt="logo" className="w-20"/>
          
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild disabled={!item.active}>
                    
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `${isActive} ? "bg-black text-sidebar-accent-foreground font-medium" : "flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
        
            <LogOut />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              logout
            </p>
          
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
