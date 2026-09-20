"use client";

import React from "react";
import Link from "next/link";
import { Post } from "@/types";
import { useLanguage } from "@/components/providers/language-provider";
import { getLocalizedField } from "@/lib/utils/i18n";
import { Clock, Calendar, ArrowRight } from "lucide-react";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { locale } = useLanguage();
  const title = getLocalizedField(post, "title", locale);
  const excerpt = getLocalizedField(post, "excerpt", locale);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(
      locale === "en" ? "en-US" : "id-ID",
      { month: "short", day: "numeric", year: "numeric" }
    );
  };

  return (
    <article className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 transition-all flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md">
      <div className="space-y-3">
        {/* Post Meta */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            {formatDate(post.published_at || post.created_at)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary" />
            {post.reading_time_min} {locale === "en" ? "min read" : "menit baca"}
          </span>
        </div>

        {/* Title & Excerpt */}
        <Link href={`/blog/${post.slug}`} className="block space-y-2">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {excerpt}
          </p>
        </Link>
      </div>

      {/* Tags & Read More Link */}
      <div className="space-y-4 pt-2 border-t border-border/50">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-secondary text-secondary-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:gap-2 transition-all"
        >
          <span>{locale === "en" ? "Read Article" : "Baca Artikel"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}