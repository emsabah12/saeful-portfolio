import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import Navbar from "@/components/public/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Personal Portfolio CMS",
  description: "Modern portfolio built with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            {/* 2. LETAKKAN NAVBAR DI DALAM BODY, SEBELUM CHILDREN */}
            <Navbar />
            {/* PASTIKAN {children} HANYA ADA DI SINI. SATU KALI SAJA. */}
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
