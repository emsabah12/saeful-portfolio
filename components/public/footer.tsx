"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

/**
 * Komponen Footer Publik.
 */
export function Footer() {
  const { locale } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card text-card-foreground transition-colors mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <Link href="/" className="font-bold text-xl text-foreground">
              Saeful<span className="text-primary">.dev</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              {locale === "en"
                ? "Fullstack Software Engineer specializing in modern web applications, clean architecture, and scalable systems."
                : "Fullstack Software Engineer yang berfokus pada aplikasi web modern, arsitektur bersih, dan sistem yang skalabel."}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              {locale === "en" ? "Navigation" : "Navigasi"}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/projects" className="hover:text-foreground transition-colors">
                  {locale === "en" ? "Projects Portfolio" : "Portofolio Proyek"}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition-colors">
                  {locale === "en" ? "Articles & Blog" : "Artikel & Blog"}
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-foreground transition-colors">
                  {locale === "en" ? "Get in Touch" : "Hubungi Saya"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">
              {locale === "en" ? "Connect" : "Media Sosial"}
            </h4>
            <div className="flex gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@example.com"
                className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {currentYear} Saeful. All rights reserved.</p>
          <p>Built with Next.js, Supabase & Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
