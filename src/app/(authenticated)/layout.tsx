"use client";

import Link from "next/link";
import * as React from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { LayoutDashboard, Users, Package, FileText, BarChart, Settings, LogOut, Loader, Menu, ChevronLeft, History, CircleDollarSign } from "lucide-react";
import Logo from "@/components/logo";
import { MobileHeader } from "./components/mobile-header";
import { useAuthContext } from "@/context/AuthContext";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", permission: "dashboard.view" },
  { href: "/customers", icon: Users, label: "Customers", permission: "customers.list" },
  { href: "/products", icon: Package, label: "Products", permission: "products.list" },
  { href: "/invoices", icon: FileText, label: "Invoices", permission: "invoices.list" },
  { href: "/payments", icon: CircleDollarSign, label: "Payments", permission: "payments.list" },
  { href: "/reports", icon: BarChart, label: "Reports", permission: "reports.view" },
  { href: "/users", icon: Users, label: "Users", permission: "users.list" },
  { href: "/activity", icon: History, label: "Activity", permission: "activities.list" },
];

function CustomSidebarTrigger() {
  const { open } = useSidebar();
  return (
    <SidebarTrigger className="md:block hidden">
      {open ? <ChevronLeft /> : <Menu />}
    </SidebarTrigger>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  React.useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  return <>{children}</>;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuthContext();
  useAuthGuard(); // redirects automatically if user=null
  const pathname = usePathname();

  // Filter nav items based on permissions
  const filteredNavItems = React.useMemo(() => {
    if (!user) return [];
    if (user.role === 'admin') return navItems;
    return navItems.filter(item => !item.permission || user.permissions?.includes(item.permission));
  }, [user]);

  // show loading spinner while fetching user
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
            <div className="group-data-[collapsible=icon]:hidden">
              <Logo />
            </div>
            <CustomSidebarTrigger />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    item.href === "/dashboard"
                      ? pathname === item.href
                      : pathname.startsWith(item.href)
                  }
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={{ children: "Settings" }}>
                <Link href="/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={logout} tooltip={{ children: "Logout" }}>
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://picsum.photos/100" alt={user?.name || "User"} />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium text-sidebar-foreground">
                {user?.name || user?.username}
              </span>
              <span className="text-xs text-sidebar-foreground/70">
                {user?.email}
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <MobileHeader />
        <LayoutContent>{children}</LayoutContent>
      </SidebarInset>
    </SidebarProvider>
  );
}
