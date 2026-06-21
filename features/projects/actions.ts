"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface ProjectPayload {
  id?: string;
  title: string;
  tech_stack: string[]; // Pastikan bertipe Array
  description: string;
  image_path: string;
  period: string;
  link: string;
  featured: boolean;
  sort_order: number;
}

export async function deleteProjectAction(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/projects");
    return { success: true, message: "Project berhasil dihapus." };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menghapus project.",
    };
  }
}

export async function createProjectAction(data: ProjectPayload) {
  try {
    const { error } = await supabaseAdmin.from("projects").insert([
      {
        title: data.title,
        tech_stack: data.tech_stack,
        description: data.description,
        image_path: data.image_path,
        period: data.period,
        link: data.link,
        featured: data.featured,
        sort_order: data.sort_order,
      },
    ]);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/projects");
    return { success: true, message: "Project berhasil ditambahkan!" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal menambah project.",
    };
  }
}

export async function updateProjectAction(data: ProjectPayload) {
  try {
    if (!data.id) throw new Error("ID tidak ditemukan");

    const { error } = await supabaseAdmin
      .from("projects")
      .update({
        title: data.title,
        tech_stack: data.tech_stack,
        description: data.description,
        image_path: data.image_path,
        period: data.period,
        link: data.link,
        featured: data.featured,
        sort_order: data.sort_order,
      })
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    revalidatePath("/admin/projects");
    return { success: true, message: "Project berhasil diperbarui!" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Gagal memperbarui project.",
    };
  }
}
