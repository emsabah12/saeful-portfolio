"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Save } from "lucide-react";
import { updateProfileAction } from "@/features/profile/actions";
// Import Server Action Upload
import { uploadImageAction } from "@/features/upload/actions";

// 1. Skema Validasi Form Profile
const profileSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  role: z.string().min(2, "Role profesional wajib diisi"),
  bio: z.string().min(10, "Bio minimal 10 karakter"),
  email: z.string().email("Format email tidak valid"),
  linkedin: z.string().url("URL LinkedIn tidak valid"),
  location: z.string().min(2, "Lokasi wajib diisi"),
  image_path: z.string().min(1, "Foto profil wajib diunggah"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Gaya standar untuk input
const inputClasses =
  "w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white placeholder:text-gray-400 transition-colors";

export default function ProfilePage() {
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // State untuk indikator upload
  const [isUploading, setIsUploading] = useState(false);

  // 2. Fetching Data Profil
  const {
    data: initialData,
    isLoading: isFetching,
    error: fetchError,
  } = useQuery({
    queryKey: ["profile_data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile")
        .select("*")
        .limit(1)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
  });

  // 3. Konfigurasi Form (Menambahkan setValue dan watch)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Memantau path gambar untuk preview
  const currentImagePath = watch("image_path");

  // Mengisi form setelah data di-fetch
  useEffect(() => {
    if (initialData) {
      reset({
        id: initialData.id,
        name: initialData.name || "",
        role: initialData.role || "",
        bio: initialData.bio || "",
        email: initialData.email || "",
        linkedin: initialData.linkedin || "",
        location: initialData.location || "",
        image_path: initialData.image_path || "",
      });
    }
  }, [initialData, reset]);

  // 4. Fungsi Upload Gambar Profil
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran file terlalu besar. Maksimal 2MB.");
      return;
    }

    setIsUploading(true);
    setSubmitMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      // Menyimpan di subfolder "profile" agar rapi di Supabase Storage
      formData.append("folder", "profile");

      const result = await uploadImageAction(formData);

      if (result.success && result.url) {
        setValue("image_path", result.url, { shouldValidate: true });
        setSubmitMessage({
          type: "success",
          text: "Foto profil berhasil diunggah!",
        });
      } else {
        setSubmitMessage({
          type: "error",
          text: result.message || "Gagal unggah foto profil.",
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "Terjadi kesalahan sistem saat unggah.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // 5. Submit Handler
  const onSubmit = async (data: ProfileFormValues) => {
    setSubmitMessage(null);
    const result = await updateProfileAction(data);

    if (result.success) {
      setSubmitMessage({ type: "success", text: result.message });
    } else {
      setSubmitMessage({ type: "error", text: result.message });
    }

    setTimeout(() => setSubmitMessage(null), 3000);
  };

  if (isFetching)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  if (fetchError)
    return (
      <div className="text-red-500 p-8">
        Gagal mengambil data profil: {fetchError.message}
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Profile Information
        </h1>
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
                Full Name
              </label>
              <input {...register("name")} className={inputClasses} />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Role
              </label>
              <input
                {...register("role")}
                placeholder="e.g. Senior Data Analyst"
                className={inputClasses}
              />
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
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
                LinkedIn URL
              </label>
              <input {...register("linkedin")} className={inputClasses} />
              {errors.linkedin && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.linkedin.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input {...register("location")} className={inputClasses} />
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Bio
              </label>
              <textarea
                {...register("bio")}
                rows={6}
                className={inputClasses}
              />
              {errors.bio && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.bio.message}
                </p>
              )}
            </div>

            {/* Area Upload Foto Profil */}
            <div className="p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Foto Profil
              </label>

              <div className="flex flex-col gap-4">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 transition cursor-pointer"
                />

                {isUploading && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" /> Mengunggah ke
                    Supabase...
                  </div>
                )}

                <input type="hidden" {...register("image_path")} />
                {errors.image_path && (
                  <p className="text-red-500 text-xs">
                    {errors.image_path.message}
                  </p>
                )}

                {/* Preview Foto Profil berbentuk Lingkaran */}
                {currentImagePath && !isUploading && (
                  <div className="mt-2 relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto md:mx-0">
                    <img
                      src={currentImagePath}
                      alt="Profile Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isSubmitting || isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSubmitting ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </div>
      </form>
    </div>
  );
}
