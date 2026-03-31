import {
  LayoutDashboard,
  Users,
  SendHorizontal,
  LogOut,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/loginAuthContext";
import { useAssociateData } from "@/hooks/useAssociateData";

const ASSOCIATE_STATIC_NAV_ITEMS = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    active: true,
  },
  {
    title: "Leads",
    url: "/leads",
    icon: Users,
    active: true,
  },
];

const ADMIN_NAV_ITEMS = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    active: true,
  },
  { title: "All Leads", url: "/leads", icon: FileText, active: true },
  { title: "Reports", url: "/reports", icon: BarChart3, active: true },
  { title: "Settings", url: "#", icon: Settings, active: false },
];

type Sidebar = "admin" | "associate";

export function AppSidebar({ role }: AppSidebarProps) {
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  const { associate } = useAssociateData();

  const handleNavClick = () => {
    setOpenMobile(false);
  };

  const navItems =
    role === "admin"
      ? ADMIN_NAV_ITEMS
      : [
          ...ASSOCIATE_STATIC_NAV_ITEMS,
          {
            title: "Submit Lead",
            url: `/submit-lead?ref=${associate?.uniqueCode || ""}`,
            icon: SendHorizontal,
            active: true,
          },
        ];

  const { logout } = useAuth();

  const handleLogout = () => {
    navigate("/login");
    logout();
  };

  return (
    <Sidebar className="border-r-0">
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
                      onClick={handleNavClick}
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
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={handleLogout}
        >
          <LogOut className="text-white" />
          <p className="text-sm text-white   truncate">Logout</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
