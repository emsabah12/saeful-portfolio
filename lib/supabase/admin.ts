import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseServiceKey) {
  console.warn(
    "Peringatan: SUPABASE_SERVICE_ROLE_KEY belum diisi di .env.local",
  );
}

// Client ini memiliki hak akses penuh ke database, mengabaikan RLS.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
