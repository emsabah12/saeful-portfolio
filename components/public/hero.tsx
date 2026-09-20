"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { ArrowRight, FileDown, Mail, Github, Linkedin, Twitter, Sparkles } from "lucide-react";

/**
 * Komponen Hero Section Utama pada Halaman Beranda Publik.
 */
export function Hero() {
  const { locale } = useLanguage();

  const techBadges = [
    "Next.js 15",
    "TypeScript",
    "React 19",
    "Tailwind CSS",
    "Supabase",
    "PostgreSQL",
  ];

  return (
    <section className="py-12 md:py-20 flex flex-col justify-center min-h-[calc(100vh-8rem)]">
      <div className="space-y-8">
        {/* Status Badge: Open for Opportunities */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>
            {locale === "en"
              ? "Available for New Opportunities & Freelance"
              : "Tersedia untuk Proyek & Peluang Karir Baru"}
          </span>
        </div>

        {/* Main Heading & Headline */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            {locale === "en" ? (
              <>
                Hi, I'm <span className="text-primary">Saeful</span>. <br />
                Building Scalable Web Systems & Modern Apps.
              </>
            ) : (
              <>
                Halo, Saya <span className="text-primary">Saeful</span>. <br />
                Pengembang Aplikasi Web Skalabel & Arsitektur Modern.
              </>
            )}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {locale === "en"
              ? "Fullstack Software Engineer specializing in Next.js, TypeScript, and Cloud Architecture. Passionate about clean code, high performance, and exceptional user experiences."
              : "Fullstack Software Engineer yang berfokus pada Next.js, TypeScript, dan Arsitektur Cloud. Berdedikasi pada kode yang bersih, performa tinggi, dan pengalaman pengguna yang luar biasa."}
          </p>
        </div>

        {/* Action Buttons / CTA */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg"
          >
            <span>{locale === "en" ? "Explore Projects" : "Lihat Proyek"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-colors"
          >
            <Mail className="w-4 h-4 text-primary" />
            <span>{locale === "en" ? "Get in Touch" : "Hubungi Saya"}</span>
          </Link>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-colors"
          >
            <FileDown className="w-4 h-4 text-emerald-500" />
            <span>{locale === "en" ? "Download Resume" : "Unduh CV"}</span>
          </a>
        </div>

        {/* Social Links & Tech Stack Badges */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground font-medium">
              {locale === "en" ? "Connect:" : "Media Sosial:"}
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter Profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Core Tech Stack Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium mr-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Core Tech:
            </span>
            {techBadges.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-secondary text-secondary-foreground border border-border/50"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}