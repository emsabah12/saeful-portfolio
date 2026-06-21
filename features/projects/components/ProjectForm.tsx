"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createProjectAction,
  updateProjectAction,
  ProjectPayload,
} from "../actions";
// 1. IMPORT YANG HILANG DITAMBAHKAN DI SINI:
import { uploadImageAction } from "@/features/upload/actions";
import Link from "next/link";
import Image from "next/image";

// Skema Form
const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Judul wajib diisi"),
  tech_stack_string: z.string().min(2, "Isi minimal 1 teknologi"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  image_path: z.string().min(1, "Path gambar wajib diisi"),
  period: z.string().min(2, "Periode wajib diisi"),
  link: z.string().url("Format URL tidak valid").optional().or(z.literal("")),
  featured: z.boolean().default(false),
  sort_order: z.number().int("Harus angka").default(0),
});

type FormValues = z.infer<typeof projectSchema>;

interface Props {
  initialData?: any;
  isEdit?: boolean;
}

const inputClasses =
  "w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white placeholder:text-gray-400 transition-colors";

export default function ProjectForm({ initialData, isEdit = false }: Props) {
  const router = useRouter();
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const defaultTechStack = initialData?.tech_stack
    ? initialData.tech_stack.join(", ")
    : "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          tech_stack_string: defaultTechStack,
          link: initialData.link || "",
        }
      : { sort_order: 0, featured: false, link: "", image_path: "" },
  });

  const currentImagePath = watch("image_path");

  // 2. FUNGSI UPLOAD YANG SUDAH DIPERBAIKI MENGGUNAKAN TRY-CATCH
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
      // Diperbaiki: Server Action mencari key "folder", bukan "portfolio_images"
      formData.append("folder", "db_portfolio");

      const result = await uploadImageAction(formData);

      if (result.success && result.url) {
        setValue("image_path", result.url, { shouldValidate: true });
        setSubmitMessage({
          type: "success",
          text: "Gambar berhasil diunggah!",
        });
      } else {
        setSubmitMessage({
          type: "error",
          text: result.message || "Gagal unggah gambar",
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "Terjadi kesalahan sistem saat unggah gambar.",
      });
    } finally {
      // Pasti dieksekusi meskipun sukses atau error
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitMessage(null);

    const techArray = data.tech_stack_string
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const payload: ProjectPayload = {
      id: data.id,
      title: data.title,
      tech_stack: techArray,
      description: data.description,
      image_path: data.image_path,
      period: data.period,
      link: data.link || "",
      featured: data.featured,
      sort_order: data.sort_order,
    };

    const result = isEdit
      ? await updateProjectAction(payload)
      : await createProjectAction(payload);

    if (result.success) {
      setSubmitMessage({ type: "success", text: result.message });
      setTimeout(() => router.push("/admin/projects"), 1000);
    } else {
      setSubmitMessage({ type: "error", text: result.message });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Project" : "Tambah Project"}
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
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul Project
              </label>
              <input
                {...register("title")}
                className={inputClasses}
                placeholder="Dashboard Analytics"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Periode
              </label>
              <input
                {...register("period")}
                className={inputClasses}
                placeholder="Q1 2025"
              />
              {errors.period && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.period.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tech Stack (Pisahkan dengan Koma)
              </label>
              <input
                {...register("tech_stack_string")}
                className={inputClasses}
                placeholder="React, Node.js, PostgreSQL"
              />
              <p className="text-xs text-gray-500 mt-1">
                Contoh: Python, SQL, Tableau
              </p>
              {errors.tech_stack_string && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.tech_stack_string.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL / Link Project
              </label>
              <input
                {...register("link")}
                className={inputClasses}
                placeholder="https://github.com/..."
              />
              {errors.link && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.link.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Singkat
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className={inputClasses}
                placeholder="Project ini bertujuan untuk..."
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="p-4 border border-dashed border-gray-300 rounded-xl bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Gambar Project
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

                {currentImagePath && !isUploading && (
                  <div className="mt-2 relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={currentImagePath}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  {...register("sort_order", { valueAsNumber: true })}
                  className="w-24 px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
                />
              </div>

              <div className="flex items-center gap-2 mt-5">
                <input
                  type="checkbox"
                  id="featured"
                  {...register("featured")}
                  className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
                />
                <label
                  htmlFor="featured"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Jadikan Project Unggulan (Featured)
                </label>
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
            {isSubmitting ? "Menyimpan..." : "Simpan Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
