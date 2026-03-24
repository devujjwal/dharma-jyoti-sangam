import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard, CalendarHeart, FileText, Landmark, Music, Moon,
  CreditCard, MessageSquare, Settings, Sun, Home,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Festivals", url: "/admin/festivals", icon: CalendarHeart },
  { title: "Articles", url: "/admin/articles", icon: FileText },
  { title: "Temples", url: "/admin/temples", icon: Landmark },
  { title: "Bhajans", url: "/admin/bhajans", icon: Music },
  { title: "Vrats", url: "/admin/vrats", icon: Moon },
  { title: "Plans", url: "/admin/plans", icon: CreditCard },
  { title: "Contacts", url: "/admin/contacts", icon: MessageSquare },
  { title: "Panchang", url: "/admin/panchang", icon: Sun },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && "Admin"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <Home className="h-4 w-4" />
                    {!collapsed && <span>Back to Site</span>}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
