"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { Menu, X, FileDown } from "lucide-react";

/**
 * Komponent Header Navigation Bar Publik.
 */
export function Navbar() {
  const { locale } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/#about", label: locale === "en" ? "About" : "Tentang" },
    { href: "/#skills", label: locale === "en" ? "Skills" : "Keahlian" },
    { href: "/#experience", label: locale === "en" ? "Experience" : "Pengalaman" },
    { href: "/projects", label: locale === "en" ? "Projects" : "Proyek" },
    { href: "/blog", label: locale === "en" ? "Blog" : "Artikel" },
    { href: "/#contact", label: locale === "en" ? "Contact" : "Kontak" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="font-bold text-xl tracking-tight text-foreground hover:text-primary transition-colors">
          Saeful<span className="text-primary">.dev</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls & Switchers */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <FileDown className="w-4 h-4" />
            <span>{locale === "en" ? "Resume" : "Unduh CV"}</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground"
            >
              <FileDown className="w-4 h-4" />
              <span>{locale === "en" ? "Download Resume" : "Unduh CV"}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}