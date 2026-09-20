import React from "react";
import { createClient } from "@/lib/supabase/server";
import { AdminLayoutWrapper } from "@/components/admin/admin-layout-wrapper";

export const metadata = {
  title: "Admin CMS Dashboard - Saeful Portfolio",
  description: "Content Management System untuk mengelola portofolio personal.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Dapatkan sesi user aktif di server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ambil jumlah pesan belum dibaca
  const { count: unreadCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  return (
    <AdminLayoutWrapper
      userEmail={user?.email || "admin@saeful.dev"}
      unreadMessagesCount={unreadCount || 0}
    >
      {children}
    </AdminLayoutWrapper>
  );
}
