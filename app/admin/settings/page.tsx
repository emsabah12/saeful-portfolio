"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Save } from "lucide-react";
import { updateSiteSettingsAction } from "@/features/settings/actions";

// 1. Skema Validasi Form
const settingsSchema = z.object({
  id: z.string(),
  site_title: z.string().min(3, "Judul website minimal 3 karakter"),
  meta_description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  profile_image: z.string().min(1, "Path gambar wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  location: z.string().min(3, "Lokasi wajib diisi"),
  footer_text: z.string().min(1, "Footer wajib diisi"),
  github_url: z.string().url("URL tidak valid").optional().or(z.literal("")),
  linkedin_url: z.string().url("URL tidak valid").optional().or(z.literal("")),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

// Gaya standar untuk semua input agar konsisten dan tahan terhadap Dark Mode browser
const inputClasses =
  "w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white placeholder:text-gray-400 transition-colors";

export default function SettingsPage() {
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 2. Fetching data awal dengan React Query
  const {
    data: initialData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
  });

  // 3. Konfigurasi Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
  });

  // Mengisi form setelah data berhasil diambil
  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        site_title: initialData.site_title || "",
        meta_description: initialData.meta_description || "",
        profile_image: initialData.profile_image || "",
        email: initialData.email || "",
        location: initialData.location || "",
        footer_text: initialData.footer_text || "",
        github_url: initialData.github_url || "",
        linkedin_url: initialData.linkedin_url || "",
      });
    }
  }, [initialData, reset]);

  // 4. Handle Submit via Server Action
  const onSubmit = async (data: SettingsFormValues) => {
    setSubmitMessage(null);
    const result = await updateSiteSettingsAction(data);

    if (result.success) {
      setSubmitMessage({ type: "success", text: result.message });
    } else {
      setSubmitMessage({ type: "error", text: result.message });
    }

    // Menghilangkan pesan setelah 3 detik
    setTimeout(() => setSubmitMessage(null), 3000);
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 p-8">
        Gagal mengambil data: {error.message}
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {submitMessage && (
          <div
            className={`p-4 rounded-md text-sm font-medium ${submitMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {submitMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kolom Kiri */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Title
              </label>
              <input {...register("site_title")} className={inputClasses} />
              {errors.site_title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.site_title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description (SEO)
              </label>
              <textarea
                {...register("meta_description")}
                rows={3}
                className={inputClasses}
              />
              {errors.meta_description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.meta_description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Footer Text
              </label>
              <input {...register("footer_text")} className={inputClasses} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image Path
              </label>
              <input
                {...register("profile_image")}
                placeholder="/images/profile/avatar.webp"
                className={inputClasses}
              />
              <p className="text-xs text-gray-500 mt-1">
                Sesuai standar PRD: Simpan path relatif GitHub.
              </p>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                {...register("email")}
                type="email"
                className={inputClasses}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input {...register("location")} className={inputClasses} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GitHub URL
              </label>
              <input
                {...register("github_url")}
                placeholder="https://github.com/..."
                className={inputClasses}
              />
              {errors.github_url && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.github_url.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn URL
              </label>
              <input
                {...register("linkedin_url")}
                placeholder="https://linkedin.com/in/..."
                className={inputClasses}
              />
              {errors.linkedin_url && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.linkedin_url.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </form>
    </div>
  );
}
