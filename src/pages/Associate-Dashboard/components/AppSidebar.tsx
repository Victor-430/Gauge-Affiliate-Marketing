import { LayoutDashboard, Users, SendHorizontal, LogOut } from "lucide-react";
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
    <Sidebar className="border-r-0 ">
      <SidebarHeader className="p-6 border-b border-gray-50 bg-black ">
        <div className="flex items-center gap-2">
          <img src="/Gauge logo-white.png" alt="logo" className="w-20" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 bg-black ">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild disabled={!item.active}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-white text-white font-medium"
                          : "flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                      }
                    >
                      <item.icon className="h-4 w-4 " />
                      <span className=" ">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-6 pb-10 pt-3 border-t border-sidebar-border bg-black">
        <div className="flex cursor-pointer items-center gap-3">
          <LogOut className="text-white" />
          <p className="text-sm text-white   truncate">Logout</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
