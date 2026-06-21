"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface SkillPayload {
  id?: string;
  skill_name: string;
  category: string;
  technical: string[];
  sort_order: number;
}

export async function deleteSkillAction(id: string) {
  try {
    const { error } = await supabaseAdmin.from("skills").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/skills");
    return { success: true, message: "Keahlian berhasil dihapus." };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menghapus data.",
    };
  }
}

export async function createSkillAction(data: SkillPayload) {
  try {
    const { error } = await supabaseAdmin.from("skills").insert([
      {
        skill_name: data.skill_name,
        category: data.category,
        technical: data.technical,
        sort_order: data.sort_order,
      },
    ]);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/skills");
    return { success: true, message: "Keahlian berhasil ditambahkan!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal menambah data." };
  }
}

export async function updateSkillAction(data: SkillPayload) {
  try {
    if (!data.id) throw new Error("ID tidak ditemukan");

    const { error } = await supabaseAdmin
      .from("skills")
      .update({
        skill_name: data.skill_name,
        category: data.category,
        technical: data.technical,
        sort_order: data.sort_order,
      })
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/skills");
    return { success: true, message: "Keahlian berhasil diperbarui!" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal memperbarui data.",
    };
  }
}
