import { createBrowserClient } from "@supabase/ssr";

/**
 * Membuat Supabase Client untuk lingkungan Browser (Client Components).
 * Digunakan pada komponen yang memiliki directive 'use client'.
 * 
 * @returns Supabase Client Instance (Browser)
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
