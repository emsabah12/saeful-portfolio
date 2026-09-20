
import React, { use } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { ArrowLeft, ExternalLink, Github, Calendar, Layers } from "lucide-react";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { locale } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      {/* Back Button */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{locale === "en" ? "Back to Projects" : "Kembali ke Daftar Proyek"}</span>
      </Link>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase">
          <Layers className="w-3.5 h-3.5" />
          <span>Slug: {slug}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          {locale === "en"
            ? "SaaS Enterprise Analytics Dashboard"
            : "SaaS Enterprise Analytics Dashboard"}
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed">
          {locale === "en"
            ? "A comprehensive case study on building a high-performance analytics platform with sub-second response times using Next.js, Supabase, and PostgreSQL."
            : "Studi kasus komprehensif tentang pembangunan platform analitik berperforma tinggi dengan waktu respon sub-detik menggunakan Next.js, Supabase, dan PostgreSQL."}
        </p>

        {/* Links & Action */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
          <a
            href="https://example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{locale === "en" ? "Visit Live Application" : "Kunjungi Situs Live"}</span>
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-semibold hover:bg-muted transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>{locale === "en" ? "Source Code" : "Kode Sumber"}</span>
          </a>
        </div>
      </div>

      {/* Main Thumbnail Banner */}
      <div className="rounded-2xl overflow-hidden border border-border aspect-video bg-muted">
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
          alt="Project Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Breakdown */}
      <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground leading-relaxed">
        <h2 className="text-2xl font-bold border-b border-border pb-2">
          {locale === "en" ? "Overview & Core Problem" : "Gambaran Umum & Tantangan Utama"}
        </h2>
        <p className="text-muted-foreground">
          {locale === "en"
            ? "Modern web applications require fast insights from large datasets. The challenge was rendering thousands of data points smoothly in the browser without freezing the UI thread."
            : "Aplikasi web modern membutuhkan wawasan cepat dari kumpulan data yang besar. Tantangannya adalah merender ribuan titik data dengan mulus di browser tanpa membekukan thread UI."}
        </p>

        <h2 className="text-2xl font-bold border-b border-border pb-2">
          {locale === "en" ? "Key Technical Achievements" : "Pencapaian Teknis Utama"}
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            {locale === "en"
              ? "Implemented Server-Side Aggregation in PostgreSQL to reduce payload size by 80%."
              : "Mengimplementasikan Agregasi Server-Side di PostgreSQL untuk mengurangi ukuran payload sebesar 80%."}
          </li>
          <li>
            {locale === "en"
              ? "Achieved 98+ Google Lighthouse Performance Score."
              : "Mencapai Skor Performa Google Lighthouse 98+."}
          </li>
        </ul>
      </div>
    </div>
  );
}
