"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// Mendefinisikan tipe data yang akan diterima dari form frontend
export interface UpdateProfilePayload {
  id: string;
  name: string;
  role: string;
  bio: string;
  email: string;
  linkedin: string;
  location: string;
  image_path: string;
}

export async function updateProfileAction(data: UpdateProfilePayload) {
  try {
    const { error } = await supabaseAdmin
      .from("profile")
      .update({
        name: data.name,
        role: data.role,
        bio: data.bio,
        email: data.email,
        linkedin: data.linkedin,
        location: data.location,
        image_path: data.image_path,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);

    if (error) throw new Error(error.message);

    // Membersihkan cache agar perubahan langsung terlihat jika kita pindah rute
    revalidatePath("/admin/profile");

    return { success: true, message: "Profil berhasil diperbarui!" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal memperbarui profil.",
    };
  }
}
