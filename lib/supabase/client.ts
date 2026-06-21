// Import fungsi pembuat client dari library Supabase
import { createClient } from "@supabase/supabase-js";

// Mengambil URL dan Key dari Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Validasi awal untuk mencegah aplikasi berjalan jika kredensial Supabase tidak ditemukan
if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase credentials are missing. Please check your .env.local file.");
}

// Membuat instance Supabase client
// Client ini akan digunakan untuk operasi CRUD ke PostgreSQL Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);