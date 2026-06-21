"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface EducationPayload {
  id?: string;
  degree: string;
  school: string;
  year: string;
  score?: string;
  description: string;
  sort_order: number;
}

export async function deleteEducationAction(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("education")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/education");
    return { success: true, message: "Data pendidikan berhasil dihapus." };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menghapus data.",
    };
  }
}

export async function createEducationAction(data: EducationPayload) {
  try {
    const { error } = await supabaseAdmin.from("education").insert([
      {
        degree: data.degree,
        school: data.school,
        year: data.year,
        score: data.score,
        description: data.description,
        sort_order: data.sort_order,
      },
    ]);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/education");
    return { success: true, message: "Data pendidikan berhasil ditambahkan!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal menambah data." };
  }
}

export async function updateEducationAction(data: EducationPayload) {
  try {
    if (!data.id) throw new Error("ID tidak ditemukan");

    const { error } = await supabaseAdmin
      .from("education")
      .update({
        degree: data.degree,
        school: data.school,
        year: data.year,
        score: data.score,
        description: data.description,
        sort_order: data.sort_order,
      })
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/education");
    return { success: true, message: "Data pendidikan berhasil diperbarui!" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal memperbarui data.",
    };
  }
}
