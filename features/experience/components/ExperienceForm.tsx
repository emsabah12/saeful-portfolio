"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createExperienceAction, updateExperienceAction } from "../actions";

// 1. SKEMA ZOD: sort_order dikembalikan menjadi z.number() biasa
const experienceSchema = z.object({
  id: z.string().optional(),
  role: z.string().min(2, "Peran / Jabatan wajib diisi"),
  company: z.string().min(2, "Nama Perusahaan wajib diisi"),
  period: z.string().min(2, "Periode wajib diisi"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  sort_order: z.number().int("Harus berupa angka valid"),
});

type FormValues = z.infer<typeof experienceSchema>;

interface Props {
  initialData?: any;
  isEdit?: boolean;
}

const inputClasses =
  "w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white placeholder:text-gray-400 transition-colors";

export default function ExperienceForm({ initialData, isEdit = false }: Props) {
  const router = useRouter();
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 2. USEFORM: defaultValues disuplai lengkap di sini
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialData || {
      role: "",
      company: "",
      period: "",
      description: "",
      sort_order: 0,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitMessage(null);

    const payload = {
      id: data.id,
      role: data.role,
      company: data.company,
      period: data.period,
      description: data.description,
      sort_order: data.sort_order,
    };

    try {
      const result = isEdit
        ? await updateExperienceAction(payload)
        : await createExperienceAction(payload);

      if (result.success) {
        setSubmitMessage({ type: "success", text: result.message });
        setTimeout(() => router.push("/admin/experience"), 1000);
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
          href="/admin/experience"
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Pengalaman Kerja" : "Tambah Pengalaman Kerja"}
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
                Peran / Jabatan
              </label>
              <input
                {...register("role")}
                className={inputClasses}
                placeholder="Software Engineer..."
              />
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Perusahaan
              </label>
              <input
                {...register("company")}
                className={inputClasses}
                placeholder="PT Teknologi Nusantara"
              />
              {errors.company && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.company.message}
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
                placeholder="Jan 2021 - Present"
              />
              {errors.period && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.period.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Pekerjaan
              </label>
              <textarea
                {...register("description")}
                rows={6}
                className={inputClasses}
                placeholder="Bertanggung jawab atas..."
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
                // 3. Ditambahkan { valueAsNumber: true }
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
