import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Entrypoint Middleware Global Next.js.
 * Memanggil handler penyegaran sesi dan proteksi rute Supabase.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Filter matcher untuk menjalankan middleware pada semua rute kecuali:
     * - _next/static (file statis Next.js)
     * - _next/image (optimasi gambar)
     * - favicon.ico (ikon browser)
     * - File publik (.png, .jpg, .svg, .pdf, dsb)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)",
  ],
};