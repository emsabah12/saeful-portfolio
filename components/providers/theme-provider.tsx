"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/**
 * Wrapper Provider untuk penanganan Tema (Dark/Light Mode).
 * Membungkus aplikasi agar variabel CSS tema di globals.css terapkan secara dinamis.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}