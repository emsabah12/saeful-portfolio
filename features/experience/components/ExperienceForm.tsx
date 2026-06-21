"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createExperienceAction,
  updateExperienceAction,
  ExperiencePayload,
} from "../actions";
import Link from "next/link";

const experienceSchema = z.object({
  id: z.string().optional(),
  role: z.string().min(2, "Role wajib diisi"),
  company: z.string().min(2, "Perusahaan wajib diisi"),
  period: z.string().min(2, "Periode wajib diisi (misal: 2020 - 2023)"),
  description: z.string().min(5, "Deskripsi wajib diisi"),
  sort_order: z.number().int("Harus berupa angka").default(0),
});

type FormValues = z.infer<typeof experienceSchema>;

interface Props {
  initialData?: FormValues; // Jika ada, berarti mode Edit
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialData || { sort_order: 0 },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitMessage(null);

    // Pilih action berdasarkan mode (Edit atau Create)
    const result = isEdit
      ? await updateExperienceAction(data as ExperiencePayload)
      : await createExperienceAction(data as ExperiencePayload);

    if (result.success) {
      setSubmitMessage({ type: "success", text: result.message });
      // Jika sukses tambah/edit, kembali ke halaman list setelah 1 detik
      setTimeout(() => router.push("/admin/experience"), 1000);
    } else {
      setSubmitMessage({ type: "error", text: result.message });
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
          {isEdit ? "Edit Experience" : "Tambah Experience"}
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
                Role / Posisi
              </label>
              <input
                {...register("role")}
                className={inputClasses}
                placeholder="Senior Data Analyst"
              />
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                {...register("company")}
                className={inputClasses}
                placeholder="Tech Innovator Inc."
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
                placeholder="2021 - Present"
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
                Deskripsi Tugas
              </label>
              <textarea
                {...register("description")}
                rows={5}
                className={inputClasses}
                placeholder="Menangani data warehouse..."
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
                className={inputClasses}
              />
              <p className="text-xs text-gray-500 mt-1">
                Angka lebih kecil akan tampil lebih dulu.
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
