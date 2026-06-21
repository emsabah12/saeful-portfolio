"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// Tipe data yang diharapkan dari form
export interface UpdateSettingsPayload {
  id: string;
  site_title: string;
  meta_description: string;
  profile_image: string;
  email: string;
  location: string;
  footer_text: string;
  github_url?: string;
  linkedin_url?: string;
}

export async function updateSiteSettingsAction(data: UpdateSettingsPayload) {
  try {
    const { error } = await supabaseAdmin
      .from("site_settings")
      .update({
        site_title: data.site_title,
        meta_description: data.meta_description,
        profile_image: data.profile_image,
        email: data.email,
        location: data.location,
        footer_text: data.footer_text,
        github_url: data.github_url,
        linkedin_url: data.linkedin_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);

    if (error) throw new Error(error.message);

    // Membersihkan cache rute ini agar data terbaru langsung tampil
    revalidatePath("/admin/settings");

    return { success: true, message: "Pengaturan berhasil diperbarui!" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal memperbarui pengaturan.",
    };
  }
}
