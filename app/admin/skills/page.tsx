"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Plus, Pencil, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { deleteSkillAction } from "@/features/skills/actions";
import { useState } from "react";

export default function SkillsListPage() {
  const [deleteMessage, setDeleteMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const {
    data: skills,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["skills_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Hapus keahlian: ${name}?`)) return;
    setIsDeleting(id);
    const result = await deleteSkillAction(id);
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
        <h1 className="text-2xl font-bold text-gray-900">Skills List</h1>
        <Link
          href="/admin/skills/create"
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          <Plus className="w-4 h-4" /> <span>Tambah Keahlian</span>
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
        ) : !skills || skills.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            Belum ada data keahlian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nama Keahlian</th>
                  <th className="px-4 py-3 font-semibold">Kategori</th>
                  <th className="px-4 py-3 font-semibold">Teknis</th>
                  <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {skills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-gray-900 font-medium">
                      {skill.skill_name}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-medium">
                        {skill.category}
                      </span>
                    </td>
                    {/* <td className="px-4 py-4">
                      {skill.technical ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td> */}
                    <td className="px-4 py-4 text-gray-600">
                      {skill.technical
                        ? `${skill.technical.length} teknik`
                        : "0 teknik"}
                    </td>
                    <td className="px-4 py-4 flex justify-end gap-2">
                      <Link
                        href={`/admin/skills/${skill.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(skill.id, skill.skill_name)}
                        disabled={isDeleting === skill.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
                      >
                        {isDeleting === skill.id ? (
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
