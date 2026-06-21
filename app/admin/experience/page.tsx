"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteExperienceAction } from "@/features/experience/actions";
import { useState } from "react";

// Tipe data sesuai skema database
interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  sort_order: number;
}

export default function ExperienceListPage() {
  const [deleteMessage, setDeleteMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // 1. Fetching Data List
  const {
    data: experiences,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["experience_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("sort_order", { ascending: true }) // Mengurutkan sesuai PRD
        .order("created_at", { ascending: false }); // Urutan cadangan

      if (error) throw new Error(error.message);
      return data as Experience[];
    },
  });

  // 2. Handler Hapus Data
  const handleDelete = async (id: string, role: string) => {
    // Meminta konfirmasi browser sederhana sebelum menghapus
    if (
      !window.confirm(`Apakah Anda yakin ingin menghapus pengalaman: ${role}?`)
    ) {
      return;
    }

    setIsDeleting(id);
    setDeleteMessage(null);

    const result = await deleteExperienceAction(id);

    if (result.success) {
      setDeleteMessage({ type: "success", text: result.message });
      refetch(); // Memanggil ulang data tabel setelah berhasil dihapus
    } else {
      setDeleteMessage({ type: "error", text: result.message });
    }

    setIsDeleting(null);
    setTimeout(() => setDeleteMessage(null), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Experience List</h1>

        {/* Tombol Tambah Data (Akan diarahkan ke halaman create di milestone selanjutnya) */}
        <Link
          href="/admin/experience/create"
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Data</span>
        </Link>
      </div>

      <div className="p-6">
        {deleteMessage && (
          <div
            className={`p-4 mb-6 rounded-md text-sm font-medium ${deleteMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {deleteMessage.text}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-red-500 py-4">
            Gagal mengambil data: {error.message}
          </div>
        ) : !experiences || experiences.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            Belum ada data pengalaman kerja. Klik "Tambah Data" untuk memulai.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Urutan</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Company</th>
                  <th className="px-4 py-3 font-semibold">Period</th>
                  <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {experiences.map((exp) => (
                  <tr
                    key={exp.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 text-gray-900 font-medium">
                      {exp.sort_order}
                    </td>
                    <td className="px-4 py-4 text-gray-900 font-medium">
                      {exp.role}
                    </td>
                    <td className="px-4 py-4 text-gray-600">{exp.company}</td>
                    <td className="px-4 py-4 text-gray-600">{exp.period}</td>
                    <td className="px-4 py-4 flex justify-end gap-2">
                      {/* Tombol Edit */}
                      <Link
                        href={`/admin/experience/${exp.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
                        title="Edit Data"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>

                      {/* Tombol Hapus */}
                      <button
                        onClick={() => handleDelete(exp.id, exp.role)}
                        disabled={isDeleting === exp.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition disabled:opacity-50"
                        title="Hapus Data"
                      >
                        {isDeleting === exp.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
