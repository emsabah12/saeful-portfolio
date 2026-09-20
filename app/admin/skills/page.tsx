"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Skill, SkillCategory } from "@/types";
import { skillFormSchema } from "@/lib/validations";
import {
  Code2,
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Layers,
} from "lucide-react";

export default function AdminSkillsPage() {
  const supabase = createClient();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "frontend" as SkillCategory,
    proficiency: 90,
    icon_name: "",
    order_index: 0,
  });

  const fetchSkills = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSkills(data as Skill[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        icon_name: skill.icon_name || "",
        order_index: skill.order_index,
      });
    } else {
      setEditingSkill(null);
      setFormData({
        name: "",
        category: "frontend",
        proficiency: 85,
        icon_name: "",
        order_index: skills.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: formData.name,
      category: formData.category,
      proficiency: Number(formData.proficiency),
      icon_name: formData.icon_name || null,
      order_index: Number(formData.order_index),
    };

    const validation = skillFormSchema.safeParse(payload);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map((err) => err.message).join(", ");
      showToast("error", `Validasi Gagal: ${errorMsg}`);
      setSubmitting(false);
      return;
    }

    try {
      if (editingSkill) {
        const { error } = await supabase
          .from("skills")
          .update(payload)
          .eq("id", editingSkill.id);

        if (error) throw error;
        showToast("success", "Keahlian berhasil diperbarui!");
      } else {
        const { error } = await supabase.from("skills").insert([payload]);

        if (error) throw error;
        showToast("success", "Keahlian baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      fetchSkills();
    } catch (err: any) {
      console.error("[Skill Mutation Error]:", err);
      showToast("error", err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus keahlian "${name}"?`)) return;

    try {
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) throw error;

      showToast("success", "Keahlian berhasil dihapus.");
      fetchSkills();
    } catch (err: any) {
      console.error("[Delete Error]:", err);
      showToast("error", err.message || "Gagal menghapus keahlian.");
    }
  };

  const filteredSkills = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 text-sm font-semibold ${
            notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
              : "bg-destructive/10 border-destructive/30 text-destructive"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Code2 className="w-7 h-7 text-primary" />
            <span>Manajemen Keahlian (Skills Matrix)</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Atur keahlian teknis, kategori, dan persentase penguasaan teknologi Anda.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Skill Baru</span>
        </button>
      </div>

      {/* Search & Counter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari nama skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="text-xs font-semibold text-muted-foreground">
          Total Skills: <span className="text-foreground">{skills.length}</span> Item
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="text-center py-16 space-y-3 bg-card rounded-2xl border border-border">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-xs text-muted-foreground font-medium">Memuat data keahlian...</p>
        </div>
      ) : filteredSkills.length > 0 ? (
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-foreground">
              <thead className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">Nama Skill</th>
                  <th className="px-4 py-3.5 font-semibold">Kategori</th>
                  <th className="px-4 py-3.5 font-semibold">Kemahiran</th>
                  <th className="px-4 py-3.5 font-semibold text-center">Order Index</th>
                  <th className="px-4 py-3.5 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-foreground">
                      {skill.name}
                    </td>
                    <td className="px-4 py-3.5 uppercase font-semibold text-[10px] text-muted-foreground">
                      <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border/50">
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3 max-w-xs">
                        <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <span className="font-semibold text-xs text-primary">
                          {skill.proficiency}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center font-semibold text-muted-foreground">
                      {skill.order_index}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal(skill)}
                          className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit Skill"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id, skill.name)}
                          className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Hapus Skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 space-y-3 bg-card rounded-2xl border border-dashed border-border">
          <Code2 className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
          <p className="text-xs text-muted-foreground font-medium">
            Belum ada data keahlian. Klik "Tambah Skill Baru" untuk menambahkan matriks skill Anda.
          </p>
        </div>
      )}

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-lg font-bold text-foreground">
                {editingSkill ? "Edit Skill" : "Tambah Skill Baru"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama Skill */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Nama Keahlian / Skill *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Next.js"
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Kategori */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Kategori *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as SkillCategory,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                  <option value="database">Database</option>
                  <option value="devops">DevOps & Tools</option>
                  <option value="soft_skill">Soft Skill</option>
                </select>
              </div>

              {/* Proficiency Level */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">
                    Tingkat Kemahiran (Proficiency %) *
                  </label>
                  <span className="text-xs font-bold text-primary">
                    {formData.proficiency}%
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={formData.proficiency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      proficiency: Number(e.target.value),
                    })
                  }
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* Order Index */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Urutan Prioritas (Order Index)
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order_index: Number(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Skill</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}