import { Locale } from "@/types";

/**
 * Mengambil nilai atribut teks terlokalisasi berdasarkan preferensi bahasa (EN / ID).
 * Menerapkan prinsip Fallback: Jika nilai bahasa target (misal 'id') kosong/null,
 * fungsi akan secara otomatis mengembalikan nilai bahasa Inggris ('en').
 *
 * @param item - Objek data yang berisi properti berstempel _en dan _id
 * @param fieldPrefix - Nama atribut dasar tanpa akhiran _en / _id (contoh: "headline", "bio", "title")
 * @param locale - Bahasa yang dipilih ('en' | 'id')
 * @returns Teks dalam bahasa yang sesuai atau fallback-nya
 */
export function getLocalizedField<T extends Record<string, any>>(
  item: T,
  fieldPrefix: string,
  locale: Locale
): string {
  if (!item) return "";

  const enKey = `${fieldPrefix}_en`;
  const idKey = `${fieldPrefix}_id`;

  const enValue = item[enKey] || "";
  const idValue = item[idKey];

  if (locale === "id") {
    // Kembalikan versi ID jika ada dan tidak kosong, sebaliknya gunakan versi EN
    return idValue && typeof idValue === "string" && idValue.trim() !== ""
      ? idValue
      : enValue;
  }

  return enValue;
}