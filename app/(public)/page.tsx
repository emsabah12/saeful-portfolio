import React from "react";
import { Hero } from "@/components/public/hero";
import { SkillsMatrix } from "@/components/public/skills-matrix";
import { Timeline } from "@/components/public/timeline";

export default function HomePage() {
  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <Hero />

      {/* Skills Matrix Section */}
      <section id="skills" className="scroll-mt-24 space-y-6 border-t border-border pt-12">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Keahlian Teknis & Skill Set
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Teknologi dan perkakas yang saya kuasai dalam membangun arsitektur perangkat lunak modern.
          </p>
        </div>
        <SkillsMatrix />
      </section>

      {/* Timeline Section: Experience & Education */}
      <section id="experience" className="scroll-mt-24 space-y-6 border-t border-border pt-12">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Pengalaman & Pendidikan
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Jejak karir profesional dan latar belakang akademis saya.
          </p>
        </div>
        <Timeline />
      </section>

      {/* Anchor Section Contact Placeholder */}
      <section id="contact" className="scroll-mt-24 border-t border-border pt-12 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          Hubungi Saya
        </h2>
        <p className="text-muted-foreground">
          Bagian ini akan memuat form kontak interaktif yang terhubung ke API `/api/contact`.
        </p>
      </section>
    </div>
  );
}