"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { createSkillAction, updateSkillAction, SkillPayload } from "../actions";
import Link from "next/link";

const skillSchema = z.object({
  id: z.string().optional(),
  skill_name: z.string().min(1, "Nama keahlian utama wajib diisi"),
  category: z.string().min(1, "Kategori wajib diisi"),
  technical_string: z.string().min(2, "Isi minimal 1 teknik spesifik"), // Validasi string form
  sort_order: z.number().int("Harus berupa angka").default(0),
});

type FormValues = z.infer<typeof skillSchema>;

interface Props {
  initialData?: any;
  isEdit?: boolean;
}

const inputClasses =
  "w-full px-4 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-black text-gray-900 bg-white placeholder:text-gray-400 transition-colors";

export default function SkillForm({ initialData, isEdit = false }: Props) {
  const router = useRouter();
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Jika Edit, gabungkan array dari DB dengan enter (\n)
  // const defaultTechnical = initialData?.technical
  //   ? initialData.technical.join("\n")
  //   : "";
  // Mengecek secara aman apakah data benar-benar Array sebelum di-join
  const defaultTechnical = Array.isArray(initialData?.technical)
    ? initialData.technical.join("\n")
    : "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: initialData
      ? { ...initialData, technical_string: defaultTechnical }
      : { sort_order: 0, technical_string: "" },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitMessage(null);

    // Mengubah teks yang dipisah enter menjadi Array
    const techArray = data.technical_string
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "" && item !== "-"); // Menghapus baris kosong atau tanda strip

    const payload: SkillPayload = {
      id: data.id,
      skill_name: data.skill_name,
      category: data.category,
      technical: techArray, // Kirim sebagai Array
      sort_order: data.sort_order,
    };

    const result = isEdit
      ? await updateSkillAction(payload)
      : await createSkillAction(payload);

    if (result.success) {
      setSubmitMessage({ type: "success", text: result.message });
      setTimeout(() => router.push("/admin/skills"), 1000);
    } else {
      setSubmitMessage({ type: "error", text: result.message });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex items-center gap-4">
        <Link
          href="/admin/skills"
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Skill" : "Tambah Skill"}
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
                Nama Skill Utama
              </label>
              <input
                {...register("skill_name")}
                className={inputClasses}
                placeholder="Misal: Data Analyst"
              />
              {errors.skill_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.skill_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori Pengelompokan
              </label>
              <input
                {...register("category")}
                className={inputClasses}
                placeholder="Misal: Analytics & Data Science"
              />
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message}
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
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daftar Teknik Spesifik (Technical)
              </label>
              <textarea
                {...register("technical_string")}
                rows={10}
                className={inputClasses}
                placeholder="Statistical Analysis&#10;Hypothesis Testing&#10;A/B Testing"
              />
              <p className="text-xs text-gray-500 mt-2">
                Pisahkan setiap teknik dengan{" "}
                <strong>Enter (Baris Baru)</strong>. Tidak perlu mengetik tanda
                strip (-).
              </p>
              {errors.technical_string && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.technical_string.message}
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
