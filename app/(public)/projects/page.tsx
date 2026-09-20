"use client";

import React, { useState } from "react";
import { Project } from "@/types";
import { useLanguage } from "@/components/providers/language-provider";
import { ProjectCard } from "@/components/public/project-card";
import { Search, FolderGit2 } from "lucide-react";

// Mock Data Sampel
const sampleProjects: Project[] = [
  {
    id: "proj-1",
    title: "SaaS Enterprise Analytics Dashboard",
    slug: "saas-analytics-dashboard",
    summary_en: "Real-time analytics platform built for high-throughput metrics and custom data visualization.",
    summary_id: "Platform analitik real-time yang dibangun untuk visualisasi data dan metrik performa tinggi.",
    description_en: "Architected end-to-end fullstack platform with Next.js App Router, Tailwind CSS, and PostgreSQL.",
    description_id: "Merancang platform fullstack dari hulu ke hilir dengan Next.js App Router, Tailwind CSS, dan PostgreSQL.",
    thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    tech_stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"],
    live_url: "https://example.com",
    github_url: "https://github.com",
    category: "web",
    is_featured: true,
    status: "published",
    order_index: 1,
    created_at: "",
    updated_at: "",
  },
  {
    id: "proj-2",
    title: "AI Technical Documentation Generator",
    slug: "ai-docs-generator",
    summary_en: "Automated tool converting source code comments into beautiful interactive documentation sites.",
    summary_id: "Alat otomatis yang mengubah komentar kode sumber menjadi situs dokumentasi interaktif.",
    description_en: "Leveraged LLMs and Markdown parsers to generate comprehensive technical documentation.",
    description_id: "Memanfaatkan LLM dan parser Markdown untuk menghasilkan dokumentasi teknis yang komprehensif.",
    thumbnail_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop",
    tech_stack: ["React", "Node.js", "OpenAI API", "Tailwind CSS"],
    live_url: "https://example.com",
    github_url: "https://github.com",
    category: "open_source",
    is_featured: true,
    status: "published",
    order_index: 2,
    created_at: "",
    updated_at: "",
  },
];

// PENTING: Wajib menggunakan `export default`
export default function ProjectsPage() {
  const { locale } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { key: "all", labelEn: "All Projects", labelId: "Semua Proyek" },
    { key: "web", labelEn: "Web Apps", labelId: "Aplikasi Web" },
    { key: "mobile", labelEn: "Mobile", labelId: "Aplikasi Mobile" },
    { key: "ui_ux", labelEn: "UI/UX Design", labelId: "Desain UI/UX" },
    { key: "open_source", labelEn: "Open Source", labelId: "Open Source" },
  ];

  const filteredProjects = sampleProjects.filter((project) => {
    const matchesCategory =
      selectedCategory === "all" || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tech_stack.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10 py-6">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>{locale === "en" ? "Portfolio Showcase" : "Pameran Karya"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {locale === "en" ? "Featured Projects & Case Studies" : "Proyek & Studi Kasus Unggulan"}
        </h1>
        <p className="text-muted-foreground max-w-2xl text-base">
          {locale === "en"
            ? "Explore a collection of web applications, open-source tools, and cloud architectures I've built."
            : "Eksplorasi koleksi aplikasi web, perkakas open-source, dan arsitektur cloud yang telah saya bangun."}
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-y border-border py-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                selectedCategory === cat.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {locale === "en" ? cat.labelEn : cat.labelId}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={locale === "en" ? "Search tech or title..." : "Cari teknologi atau judul..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-border bg-card text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-3 border border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground font-medium">
            {locale === "en" ? "No projects found matching your criteria." : "Tidak ada proyek yang sesuai dengan pencarian Anda."}
          </p>
        </div>
      )}
    </div>
  );
}