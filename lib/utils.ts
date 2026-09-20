import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Menggabungkan nama kelas CSS Tailwind secara konsisten tanpa bentrokan atribut.
 * Menggunakan `clsx` untuk evaluasi kondisional dan `tailwind-merge` untuk resolusi konflik.
 *
 * @param inputs - Daftar kelas CSS atau kondisi boolean
 * @returns String gabungan kelas CSS Tailwind
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
