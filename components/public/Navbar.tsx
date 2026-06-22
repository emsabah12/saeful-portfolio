"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

// KONFIGURASI MENU DINAMIS:
// Anda cukup menambah/mengedit teks di dalam Array ini jika ingin mengubah menu
const navLinks = [
  { title: "Beranda", url: "/" },
  { title: "Semua Project", url: "/projects" },
  // Anda bisa menambahkan link ke section spesifik di Home, misal: { title: "Skills", url: "/#skills" }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // Untuk mendeteksi halaman aktif

  // TAMBAHKAN KODE INI:
  // Jika URL mengarah ke admin atau halaman login, kembalikan null (sembunyikan Navbar)
  if (pathname.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  // Deteksi event scroll untuk efek melayang & mengecil
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* AREA NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? "py-3 bg-white/80 backdrop-blur-md shadow-sm" // Efek saat di-scroll (Mengecil & Blur)
            : "py-6 bg-transparent" // Efek default saat di paling atas
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
          {/* Logo / Nama */}
          <Link
            href="/"
            className="text-xl font-extrabold text-gray-900 tracking-tight"
          >
            Saeful<span className="text-blue-600">.</span>
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.url;
              return (
                <Link
                  key={index}
                  href={link.url}
                  className={`text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {link.title}
                </Link>
              );
            })}

            {/* Tombol Login Admin (Opsional, khusus untuk Anda) */}
            {/* <Link
              href="/login"
              className="px-5 py-2 text-sm font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition"
            >
              Admin Panel
            </Link> */}
          </nav>

          {/* Tombol Hamburger Mobile */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Menu Mobile (Muncul jika tombol hamburger diklik) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden flex flex-col gap-6">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4"
            >
              {link.title}
            </Link>
          ))}
          {/* <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-4 px-6 py-4 text-center text-lg font-bold text-white bg-black rounded-xl"
          >
            Admin Panel
          </Link> */}
        </div>
      )}
    </>
  );
}
