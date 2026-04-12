import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import AdminGuard from "./AdminGuard";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

export default function AdminLayout() {
  // Prevent search engines from indexing admin pages
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";
    return () => {
      if (meta) meta.content = "index, follow";
    };
  }, []);

  return (
    <AdminGuard>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-14 flex items-center border-b border-border px-4 bg-card">
              <SidebarTrigger className="mr-4" />
              <span className="font-devanagari-serif font-bold text-foreground">Admin Panel</span>
            </header>
            <main className="flex-1 p-4 md:p-6 bg-background overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AdminGuard>
  );
}
