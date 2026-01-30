import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background dark">
      <AdminSidebar />
      <main className="ml-64 min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
