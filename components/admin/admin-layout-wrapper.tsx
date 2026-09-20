"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  userEmail?: string;
  unreadMessagesCount?: number;
}

export function AdminLayoutWrapper({
  children,
  userEmail,
  unreadMessagesCount = 0,
}: AdminLayoutWrapperProps) {
  const pathname = usePathname();

  // Jika halaman adalah /admin/login, tampilkan konten langsung tanpa sidebar & header
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Sidebar Panel */}
      <AdminSidebar unreadMessagesCount={unreadMessagesCount} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        <AdminHeader userEmail={userEmail} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}