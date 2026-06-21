"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createEducationAction, updateEducationAction } from "../actions"; // Asumsi path action Anda

// 1. SKEMA ZOD (DIPERBAIKI)
// Menggunakan z.coerce.number() tanpa .default() untuk mencegah konflik Resolver RHF
const educationSchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(2, "Gelar/Jurusan wajib diisi"),
  school: z.string().min(2, "Nama instansi/sekolah wajib diisi"),
  year: z.string().min(2, "Tahun wajib diisi"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  score: z.string().optional().or(z.literal("")),
  sort_order: z.number().int("Harus berupa angka valid"),
});

type FormValues = z.infer<typeof educationSchema>;

interface Props {
  initialData?: any;
  isEdit?: boolean;
}

const inputClasses =
  "w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white placeholder:text-gray-400 transition-colors";

export default function EducationForm({ initialData, isEdit = false }: Props) {
  const router = useRouter();
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 2. INISIALISASI USEFORM (DIPERBAIKI)
  // Tanggung jawab defaultValues diserahkan sepenuhnya ke React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: initialData || {
      degree: "",
      school: "",
      year: "",
      description: "",
      score: "",
      sort_order: 0, // Default disuplai di sini
    },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitMessage(null);

    const payload = {
      id: data.id,
      degree: data.degree,
      school: data.school,
      year: data.year,
      description: data.description,
      score: data.score || "",
      sort_order: data.sort_order,
    };

    try {
      const result = isEdit
        ? await updateEducationAction(payload)
        : await createEducationAction(payload);

      if (result.success) {
        setSubmitMessage({ type: "success", text: result.message });
        setTimeout(() => router.push("/admin/education"), 1000);
      } else {
        setSubmitMessage({ type: "error", text: result.message });
      }
    } catch (error: any) {
      setSubmitMessage({ type: "error", text: "Terjadi kesalahan sistem." });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex items-center gap-4">
        <Link
          href="/admin/education"
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Riwayat Pendidikan" : "Tambah Riwayat Pendidikan"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {submitMessage && (
          <div
            className={`p-4 rounded-md text-sm font-medium ${
              submitMessage.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {submitMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gelar / Jurusan
              </label>
              <input
                {...register("degree")}
                className={inputClasses}
                placeholder="S.Pd. Pendidikan ..."
              />
              {errors.degree && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.degree.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instansi / Universitas / Sekolah
              </label>
              <input
                {...register("school")}
                className={inputClasses}
                placeholder="Universitas Terbuka"
              />
              {errors.school && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.school.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tahun
              </label>
              <input
                {...register("year")}
                className={inputClasses}
                placeholder="2018 - 2022"
              />
              {errors.year && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.year.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nilai / IPK (Opsional)
              </label>
              <input
                {...register("score")}
                className={inputClasses}
                placeholder="IPK: 3.85 / 4.00"
              />
              {errors.score && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.score.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi
              </label>
              <textarea
                {...register("description")}
                rows={6}
                className={inputClasses}
                placeholder="Fokus studi pada..."
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order (Urutan Tampil)
              </label>
              <input
                type="number"
                {...register("sort_order", { valueAsNumber: true })}
                className="w-24 px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                Angka terkecil tampil lebih dulu (0, 1, 2, dst).
              </p>
              {errors.sort_order && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.sort_order.message}
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
            {isSubmitting ? "Menyimpan..." : "Simpan Data"}
          </button>
        </div>
      </form>
    </div>
  );
}
