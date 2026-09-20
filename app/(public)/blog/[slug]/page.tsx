"use client";

import React, { use } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";
import { ArrowLeft, Clock, Calendar, Share2, Bookmark } from "lucide-react";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { locale } = useLanguage();

  return (
    <article className="max-w-3xl mx-auto space-y-8 py-6">
      {/* Back Link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{locale === "en" ? "Back to Articles" : "Kembali ke Daftar Artikel"}</span>
      </Link>

      {/* Article Header */}
      <div className="space-y-4 border-b border-border pb-6">
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            15 Feb 2026
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary" />
            7 {locale === "en" ? "min read" : "menit baca"}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
          {locale === "en"
            ? "Building Scalable Web Applications with Next.js 15 & Supabase"
            : "Membangun Aplikasi Web Skalabel dengan Next.js 15 & Supabase"}
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed">
          {locale === "en"
            ? "A comprehensive architectural guide on structuring React Server Components, securing endpoints with RLS, and deploying on Vercel."
            : "Panduan arsitektur komprehensif dalam menyusun React Server Components, mengamankan endpoint dengan RLS, dan deployment ke Vercel."}
        </p>
      </div>

      {/* Content Body */}
      <div className="space-y-6 text-foreground leading-relaxed text-base">
        <p>
          {locale === "en"
            ? "Modern web architecture demands both speed and security. By pairing Next.js App Router with Supabase's PostgreSQL backend, developers can achieve sub-second page rendering while enforcing tight database permissions."
            : "Arsitektur web modern menuntut kecepatan dan keamanan sekaligus. Dengan memadukan Next.js App Router dan backend PostgreSQL Supabase, pengembang dapat mencapai waktu muat sub-detik sekaligus menerapkan izin basis data yang ketat."}
        </p>

        <h2 className="text-2xl font-bold text-foreground pt-4 border-b border-border pb-2">
          1. React Server Components & Performance
        </h2>
        <p className="text-muted-foreground">
          {locale === "en"
            ? "By fetching data directly inside Server Components, we eliminate unnecessary client-side JS bundles and reduce Network Waterfall latency."
            : "Dengan mengambil data secara langsung di dalam Server Components, kita mengeliminasi bundle JS client-side yang tidak perlu dan mengurangi latensi Network Waterfall."}
        </p>

        <h2 className="text-2xl font-bold text-foreground pt-4 border-b border-border pb-2">
          2. Row Level Security (RLS) as Defense-in-Depth
        </h2>
        <p className="text-muted-foreground">
          {locale === "en"
            ? "Never rely solely on API route guards. RLS policies ensure that even if an API endpoint is exposed, malicious users cannot write to unauthorized database rows."
            : "Jangan pernah hanya mengandalkan API route guard. Kebijakan RLS menjamin bahwa meskipun sebuah API endpoint terekspos, pengguna jahat tidak dapat menulis ke baris data tanpa izin."}
        </p>
      </div>
    </article>
  );
}