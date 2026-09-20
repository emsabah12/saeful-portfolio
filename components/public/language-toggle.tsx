"use client";

import React from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Globe } from "lucide-react";

/**
 * Tombol Pemindah Bahasa Publik (EN / ID).
 */
export function LanguageToggle() {
  const { locale, toggleLocale } = useLanguage();

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label="Toggle Language"
      title="Ganti Bahasa / Switch Language"
    >
      <Globe className="w-4 h-4 text-primary" />
      <span>{locale === "en" ? "EN" : "ID"}</span>
    </button>
  );
}