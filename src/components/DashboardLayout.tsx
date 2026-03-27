import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="mr-2" />
              <span className="text-sm font-medium text-foreground hidden sm:inline">Psychometric Assessment Portal</span>
            </div>
            <div className="flex items-center gap-3">
              {user?.companyName && (
                <Badge variant="outline" className="text-xs hidden sm:flex">{user.companyName}</Badge>
              )}
              <Badge variant="secondary" className="text-xs capitalize">
                {user?.role?.replace("_", " ")}
              </Badge>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
