import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Membuat Supabase Client untuk lingkungan Server.
 * Menangani baca/tulis cookie autentikasi secara aman di sisi server Next.js (App Router).
 * 
 * Catatan: Membutuhkan `await cookies()` sesuai spesifikasi Next.js 15+.
 * 
 * @returns Supabase Client Instance (Server)
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Dipanggil dari Server Component: pengubahan cookie diabaikan 
            // karena header HTTP response sudah terlanjur dikirim ke browser.
            // Penyegaran cookie aktual ditangani oleh Middleware (`lib/supabase/middleware.ts`).
          }
        },
      },
    }
  );
}