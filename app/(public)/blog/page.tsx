"use client";

import React, { useState } from "react";
import { Post } from "@/types";
import { useLanguage } from "@/components/providers/language-provider";
import { PostCard } from "@/components/public/post-card";
import { Search, BookOpen } from "lucide-react";

// Mock Sample Posts Data
const samplePosts: Post[] = [
  {
    id: "post-1",
    title_en: "Building Scalable Web Applications with Next.js 15 & Supabase",
    title_id: "Membangun Aplikasi Web Skalabel dengan Next.js 15 & Supabase",
    slug: "building-scalable-apps-nextjs-supabase",
    content_en: "Full article content in English...",
    content_id: "Konten artikel lengkap dalam Bahasa Indonesia...",
    excerpt_en: "A deep dive into clean architecture, server components, and Row Level Security best practices.",
    excerpt_id: "Panduan mendalam tentang arsitektur bersih, server components, dan best practices Row Level Security.",
    tags: ["Next.js", "Supabase", "Architecture"],
    reading_time_min: 7,
    status: "published",
    published_at: "2026-02-15",
    created_at: "",
    updated_at: "",
  },
  {
    id: "post-2",
    title_en: "Mastering TypeScript Generics and Zod Validations",
    title_id: "Menguasai Generics TypeScript dan Validasi Zod",
    slug: "mastering-typescript-generics-and-zod",
    content_en: "Full article content in English...",
    content_id: "Konten artikel lengkap dalam Bahasa Indonesia...",
    excerpt_en: "How end-to-end type safety eliminates runtime exceptions in production apps.",
    excerpt_id: "Bagaimana type safety end-to-end mengeliminasi runtime exception pada aplikasi produksi.",
    tags: ["TypeScript", "Zod", "WebDev"],
    reading_time_min: 5,
    status: "published",
    published_at: "2026-01-20",
    created_at: "",
    updated_at: "",
  },
];

export default function BlogPage() {
  const { locale } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = samplePosts.filter((post) => {
    const title = locale === "en" ? post.title_en : post.title_id || post.title_en;
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{locale === "en" ? "Articles & Writings" : "Artikel & Tulisan"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {locale === "en" ? "Technical Thoughts & Engineering Blog" : "Pemikiran Teknis & Blog Rekayasa Web"}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-base">
          {locale === "en"
            ? "Insights, tutorials, and architectural patterns on modern web development."
            : "Wawasan, tutorial, dan pola arsitektur seputar pengembangan web modern."}
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-md border-b border-border pb-4">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
        <input
          type="text"
          placeholder={locale === "en" ? "Search articles by title or tag..." : "Cari artikel berdasarkan judul atau tag..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      {/* Posts List */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-3 border border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground font-medium">
            {locale === "en" ? "No articles found matching your query." : "Tidak ada artikel yang sesuai dengan pencarian Anda."}
          </p>
        </div>
      )}
    </div>
  );
}