"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Experience, Education } from "@/types";
import { getLocalizedField } from "@/lib/utils/i18n";
import { Briefcase, GraduationCap, Calendar, MapPin } from "lucide-react";

interface TimelineProps {
  experiences?: Experience[];
  educations?: Education[];
}

const defaultExperiences: Experience[] = [
  {
    id: "exp-1",
    company_name: "Tech Solutions Inc.",
    position_en: "Senior Fullstack Engineer",
    position_id: "Senior Fullstack Engineer",
    description_en: "Architected and built scalable microservices using Next.js, Node.js, and Supabase. Led a engineering team of 5 developers.",
    description_id: "Merancang dan membangun layanan web skalabel menggunakan Next.js, Node.js, dan Supabase. Memimpin tim pengembang beranggotakan 5 orang.",
    location: "Jakarta, Indonesia (Hybrid)",
    start_date: "2023-01-01",
    end_date: null,
    is_current: true,
    order_index: 1,
    created_at: "",
  },
  {
    id: "exp-2",
    company_name: "Digital Studio Corp",
    position_en: "Frontend Web Developer",
    position_id: "Pengembang Web Frontend",
    description_en: "Developed interactive web applications with React, TypeScript, and Tailwind CSS. Improved page speed scores by 40%.",
    description_id: "Mengembangkan aplikasi web interaktif dengan React, TypeScript, dan Tailwind CSS. Meningkatkan skor kecepatan halaman sebesar 40%.",
    location: "Bandung, Indonesia",
    start_date: "2021-06-01",
    end_date: "2022-12-31",
    is_current: false,
    order_index: 2,
    created_at: "",
  },
];

const defaultEducations: Education[] = [
  {
    id: "edu-1",
    institution_name: "Universitas Komputer Indonesia",
    degree_en: "Bachelor of Computer Science",
    degree_id: "Sarjana Ilmu Komputer",
    field_of_study_en: "Informatics Engineering",
    field_of_study_id: "Teknik Informatika",
    start_date: "2017-09-01",
    end_date: "2021-07-01",
    gpa: "3.85 / 4.00",
    created_at: "",
  },
];

export function Timeline({
  experiences = defaultExperiences,
  educations = defaultEducations,
}: TimelineProps) {
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<"experience" | "education">("experience");

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return locale === "en" ? "Present" : "Sekarang";
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === "en" ? "en-US" : "id-ID", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Switcher Tab: Experience vs Education */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab("experience")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "experience"
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{locale === "en" ? "Work Experience" : "Pengalaman Kerja"}</span>
        </button>

        <button
          onClick={() => setActiveTab("education")}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "education"
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>{locale === "en" ? "Education" : "Pendidikan"}</span>
        </button>
      </div>

      {/* Vertical Timeline View */}
      <div className="relative border-l-2 border-border ml-3 sm:ml-4 space-y-8 pl-6 sm:pl-8">
        {activeTab === "experience"
          ? experiences.map((exp) => {
              const position = getLocalizedField(exp, "position", locale);
              const description = getLocalizedField(exp, "description", locale);

              return (
                <div key={exp.id} className="relative group">
                  {/* Timeline Dot Indicator */}
                  <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors" />

                  <div className="p-5 rounded-2xl border border-border bg-card space-y-3 shadow-sm hover:border-primary/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-foreground">{position}</h3>
                      <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-secondary px-3 py-1 rounded-full w-fit">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>
                          {formatDate(exp.start_date)} - {exp.is_current ? (locale === "en" ? "Present" : "Sekarang") : formatDate(exp.end_date)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-primary">{exp.company_name}</p>

                    {exp.location && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{exp.location}</span>
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">{description}</p>
                  </div>
                </div>
              );
            })
          : educations.map((edu) => {
              const degree = getLocalizedField(edu, "degree", locale);
              const field = getLocalizedField(edu, "field_of_study", locale);

              return (
                <div key={edu.id} className="relative group">
                  {/* Timeline Dot Indicator */}
                  <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors" />

                  <div className="p-5 rounded-2xl border border-border bg-card space-y-3 shadow-sm hover:border-primary/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="text-lg font-bold text-foreground">{edu.institution_name}</h3>
                      <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-secondary px-3 py-1 rounded-full w-fit">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>
                          {formatDate(edu.start_date)} - {formatDate(edu.end_date)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-primary">
                      {degree} - {field}
                    </p>

                    {edu.gpa && (
                      <p className="text-xs text-muted-foreground font-medium">
                        GPA: <span className="text-foreground font-semibold">{edu.gpa}</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}