"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function deleteExperienceAction(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("experience")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

    // Membersihkan cache agar daftar terbaru langsung ter-render setelah data dihapus
    revalidatePath("/admin/experience");

    return { success: true, message: "Pengalaman kerja berhasil dihapus." };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menghapus data.",
    };
  }
}

export interface ExperiencePayload {
  id?: string; // Optional karena saat Create belum punya ID
  role: string;
  company: string;
  period: string;
  description: string;
  sort_order: number;
}

export async function createExperienceAction(data: ExperiencePayload) {
  try {
    const { error } = await supabaseAdmin.from("experience").insert([
      {
        role: data.role,
        company: data.company,
        period: data.period,
        description: data.description,
        sort_order: data.sort_order,
      },
    ]);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/experience");
    return { success: true, message: "Pengalaman kerja berhasil ditambahkan!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal menambah data." };
  }
}

export async function updateExperienceAction(data: ExperiencePayload) {
  try {
    if (!data.id) throw new Error("ID tidak ditemukan");

    const { error } = await supabaseAdmin
      .from("experience")
      .update({
        role: data.role,
        company: data.company,
        period: data.period,
        description: data.description,
        sort_order: data.sort_order,
      })
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/experience");
    return { success: true, message: "Pengalaman kerja berhasil diperbarui!" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal memperbarui data.",
    };
  }
}
