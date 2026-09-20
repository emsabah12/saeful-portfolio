"use client";

import React from "react";
import Link from "next/link";
import { Project } from "@/types";
import { useLanguage } from "@/components/providers/language-provider";
import { getLocalizedField } from "@/lib/utils/i18n";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { locale } = useLanguage();
  const summary = getLocalizedField(project, "summary", locale);

  return (
    <div className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all flex flex-col h-full shadow-sm hover:shadow-md">
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={project.thumbnail_url}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-background/80 backdrop-blur-md border border-border text-foreground uppercase tracking-wider">
          {project.category}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-xl font-bold text-foreground hover:text-primary transition-colors group-hover/title"
          >
            <span>{project.title}</span>
            <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Tech Stack Badges */}
        <div className="space-y-4 pt-2 border-t border-border/50">
          <div className="flex flex-wrap gap-1.5">
            {project.tech_stack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-secondary text-secondary-foreground"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href={`/projects/${project.slug}`}
              className="text-xs font-semibold text-primary hover:underline"
            >
              {locale === "en" ? "View Case Study" : "Lihat Detail"} →
            </Link>

            <div className="flex items-center gap-2">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="GitHub Repository"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Live Demo"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}