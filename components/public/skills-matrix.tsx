"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Skill, SkillCategory } from "@/types";
import { Code2, Server, Database, Terminal, HeartHandshake, Layers } from "lucide-react";

interface SkillsMatrixProps {
  initialSkills?: Skill[];
}

// Data sampel awal jika data dari database belum diisi
const defaultSkills: Skill[] = [
  { id: "1", name: "Next.js", category: "frontend", proficiency: 92, order_index: 1, created_at: "" },
  { id: "2", name: "React", category: "frontend", proficiency: 95, order_index: 2, created_at: "" },
  { id: "3", name: "TypeScript", category: "frontend", proficiency: 90, order_index: 3, created_at: "" },
  { id: "4", name: "Tailwind CSS", category: "frontend", proficiency: 95, order_index: 4, created_at: "" },
  { id: "5", name: "Node.js", category: "backend", proficiency: 88, order_index: 5, created_at: "" },
  { id: "6", name: "Express.js", category: "backend", proficiency: 85, order_index: 6, created_at: "" },
  { id: "7", name: "PostgreSQL", category: "database", proficiency: 88, order_index: 7, created_at: "" },
  { id: "8", name: "Supabase", category: "database", proficiency: 90, order_index: 8, created_at: "" },
  { id: "9", name: "Docker", category: "devops", proficiency: 78, order_index: 9, created_at: "" },
  { id: "10", name: "Git & GitHub", category: "devops", proficiency: 92, order_index: 10, created_at: "" },
  { id: "11", name: "Problem Solving", category: "soft_skill", proficiency: 95, order_index: 11, created_at: "" },
  { id: "12", name: "Team Leadership", category: "soft_skill", proficiency: 85, order_index: 12, created_at: "" },
];

export function SkillsMatrix({ initialSkills = defaultSkills }: SkillsMatrixProps) {
  const { locale } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories: { key: string; labelEn: string; labelId: string; icon: React.ReactNode }[] = [
    { key: "all", labelEn: "All Skills", labelId: "Semua Keahlian", icon: <Layers className="w-4 h-4" /> },
    { key: "frontend", labelEn: "Frontend", labelId: "Frontend", icon: <Code2 className="w-4 h-4" /> },
    { key: "backend", labelEn: "Backend", labelId: "Backend", icon: <Server className="w-4 h-4" /> },
    { key: "database", labelEn: "Database", labelId: "Database", icon: <Database className="w-4 h-4" /> },
    { key: "devops", labelEn: "DevOps & Tools", labelId: "DevOps & Alat", icon: <Terminal className="w-4 h-4" /> },
    { key: "soft_skill", labelEn: "Soft Skills", labelId: "Soft Skills", icon: <HeartHandshake className="w-4 h-4" /> },
  ];

  const filteredSkills = activeCategory === "all"
    ? initialSkills
    : initialSkills.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeCategory === cat.key
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {cat.icon}
            <span>{locale === "en" ? cat.labelEn : cat.labelId}</span>
          </button>
        ))}
      </div>

      {/* Skills Progress Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors space-y-3"
          >
            <div className="flex items-center justify-between text-sm font-semibold text-foreground">
              <span>{skill.name}</span>
              <span className="text-xs font-medium text-primary">{skill.proficiency}%</span>
            </div>
            {/* Progress Bar Container */}
            <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${skill.proficiency}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}