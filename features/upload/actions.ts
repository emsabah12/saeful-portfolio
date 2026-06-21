"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "general";

    if (!file) {
      throw new Error("File tidak ditemukan dari form.");
    }

    // PENTING: Konversi Next.js File Object menjadi Node Buffer
    // Ini mencegah proses upload "hang" atau membeku di server
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileExt = file.name.split(".").pop();
    const uniqueFileName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1000)}.${fileExt}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("portfolio_images")
      .upload(uniqueFileName, buffer, {
        contentType: file.type, // Wajib disertakan saat menggunakan Buffer
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from("portfolio_images")
      .getPublicUrl(uniqueFileName);

    return {
      success: true,
      url: publicUrlData.publicUrl,
    };
  } catch (error: any) {
    console.error("Upload Error:", error); // Muncul di terminal server untuk debugging
    return {
      success: false,
      message: error.message || "Gagal mengunggah gambar.",
    };
  }
}
