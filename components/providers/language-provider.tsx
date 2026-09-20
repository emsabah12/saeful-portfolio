"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale } from "@/types";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = "saeful_portfolio_locale";

/**
 * Provider untuk mengelola state bahasa global (EN/ID) di seluruh komponen client.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Load preferensi bahasa dari localStorage saat komponen pertama dimuat
  useEffect(() => {
    const savedLocale = localStorage.getItem(LANGUAGE_KEY) as Locale;
    if (savedLocale === "en" || savedLocale === "id") {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LANGUAGE_KEY, newLocale);
  };

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "id" : "en";
    setLocale(nextLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, toggleLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Custom Hook untuk mengakses state & switcher bahasa di komponen client mana saja.
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage harus digunakan di dalam LanguageProvider");
  }
  return context;
}