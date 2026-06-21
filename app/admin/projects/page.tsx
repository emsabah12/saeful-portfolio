"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { Loader2, Plus, Pencil, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { deleteProjectAction } from "@/features/projects/actions";
import { useState } from "react";

export default function ProjectsListPage() {
  const [deleteMessage, setDeleteMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const {
    data: projects,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["projects_list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Hapus project: ${title}?`)) return;
    setIsDeleting(id);
    const result = await deleteProjectAction(id);
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
        <h1 className="text-2xl font-bold text-gray-900">Projects List</h1>
        <Link
          href="/admin/projects/create"
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
        >
          <Plus className="w-4 h-4" /> <span>Tambah Project</span>
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
        ) : !projects || projects.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            Belum ada project.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Judul</th>
                  <th className="px-4 py-3 font-semibold">Tech Stack</th>
                  <th className="px-4 py-3 font-semibold">Featured</th>
                  <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-gray-900 font-medium">
                      {proj.title}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {proj.tech_stack?.join(", ") || "-"}
                    </td>
                    <td className="px-4 py-4">
                      {proj.featured ? (
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 flex justify-end gap-2">
                      <Link
                        href={`/admin/projects/${proj.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(proj.id, proj.title)}
                        disabled={isDeleting === proj.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
                      >
                        {isDeleting === proj.id ? (
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
