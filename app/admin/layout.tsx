"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jika tidak loading dan tidak ada user, redirect ke login
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Menampilkan state loading saat Firebase sedang memverifikasi token
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
      </div>
    );
  }

  // Jika tidak ada user, render null agar UI tidak bocor sebelum redirect berjalan
  if (!user) {
    return null;
  }

  // Jika lolos otentikasi, render UI Admin
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar untuk Desktop */}
      <Sidebar />

      {/* Main Content Area: Diberi margin kiri 64 (256px) untuk memberikan ruang bagi Sidebar yang fixed */}
      <main className="flex-1 md:ml-64 p-8">{children}</main>
    </div>
  );
}
