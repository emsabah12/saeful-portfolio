"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteEducationAction } from "@/features/education/actions";
import { useState } from "react";

export default function EducationListPage() {
  const [deleteMessage, setDeleteMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const {
    data: education,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["education_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const handleDelete = async (id: string, degree: string) => {
    if (!window.confirm(`Hapus data pendidikan: ${degree}?`)) return;
    setIsDeleting(id);
    const result = await deleteEducationAction(id);
    if (result.success) {
      setDeleteMessage({ type: "success", text: result.message });
      refetch();
    } else {
      setDeleteMessage({ type: "error", text: result.message });
    }
    setIsDeleting(null);
    setTimeout(() => setDeleteMessage(null), 3000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Education List</h1>
        <Link
          href="/admin/education/create"
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          <Plus className="w-4 h-4" /> <span>Tambah Data</span>
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
          <div className="text-red-500 py-4">Error: {error.message}</div>
        ) : !education || education.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            Belum ada data pendidikan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Tahun</th>
                  <th className="px-4 py-3 font-semibold">Gelar</th>
                  <th className="px-4 py-3 font-semibold">Institusi</th>
                  <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {education.map((edu) => (
                  <tr key={edu.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-gray-900 font-medium">
                      {edu.year}
                    </td>
                    <td className="px-4 py-4 text-gray-900 font-medium">
                      {edu.degree}
                    </td>
                    <td className="px-4 py-4 text-gray-600">{edu.school}</td>
                    <td className="px-4 py-4 flex justify-end gap-2">
                      <Link
                        href={`/admin/education/${edu.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(edu.id, edu.degree)}
                        disabled={isDeleting === edu.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
                      >
                        {isDeleting === edu.id ? (
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
