"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Project, ProjectCategory, ContentStatus } from "@/types";
import { projectFormSchema } from "@/lib/validations";
import {
  FolderGit2,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Github,
  Search,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  Star,
} from "lucide-react";

export default function AdminProjectsPage() {
  const supabase = createClient();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary_en: "",
    summary_id: "",
    description_en: "",
    description_id: "",
    thumbnail_url: "",
    tech_stack_input: "",
    live_url: "",
    github_url: "",
    category: "web" as ProjectCategory,
    is_featured: false,
    status: "published" as ContentStatus,
    order_index: 0,
  });

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("order_index", { ascending: true })
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProjects(data as Project[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const showToast = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        slug: project.slug,
        summary_en: project.summary_en || "",
        summary_id: project.summary_id || "",
        description_en: project.description_en || "",
        description_id: project.description_id || "",
        thumbnail_url: project.thumbnail_url || "",
        tech_stack_input: project.tech_stack ? project.tech_stack.join(", ") : "",
        live_url: project.live_url || "",
        github_url: project.github_url || "",
        category: project.category || "web",
        is_featured: project.is_featured,
        status: project.status || "published",
        order_index: project.order_index || 0,
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        slug: "",
        summary_en: "",
        summary_id: "",
        description_en: "",
        description_id: "",
        thumbnail_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
        tech_stack_input: "Next.js, TypeScript, Tailwind CSS, Supabase",
        live_url: "",
        github_url: "",
        category: "web",
        is_featured: false,
        status: "published",
        order_index: projects.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      // Auto-generate slug jika membuat data baru
      slug: !editingProject
        ? title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
        : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const tech_stack = formData.tech_stack_input
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const payload = {
      title: formData.title,
      slug: formData.slug,
      summary_en: formData.summary_en,
      summary_id: formData.summary_id || null,
      description_en: formData.description_en,
      description_id: formData.description_id || null,
      thumbnail_url: formData.thumbnail_url,
      tech_stack,
      live_url: formData.live_url || null,
      github_url: formData.github_url || null,
      category: formData.category,
      is_featured: formData.is_featured,
      status: formData.status,
      order_index: Number(formData.order_index),
    };

    // Validasi Zod
    const validation = projectFormSchema.safeParse(payload);
    if (!validation.success) {
      const errorMsg = validation.error.errors.map((err) => err.message).join(", ");
      showToast("error", `Validasi Gagal: ${errorMsg}`);
      setSubmitting(false);
      return;
    }

    try {
      if (editingProject) {
        // UPDATE
        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", editingProject.id);

        if (error) throw error;
        showToast("success", "Proyek berhasil diperbarui!");
      } else {
        // INSERT
        const { error } = await supabase.from("projects").insert([payload]);

        if (error) throw error;
        showToast("success", "Proyek baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      console.error("[Project Mutation Error]:", err);
      showToast("error", err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus proyek "${title}"?`)) return;

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;

      showToast("success", "Proyek berhasil dihapus.");
      fetchProjects();
    } catch (err: any) {
      console.error("[Delete Error]:", err);
      showToast("error", err.message || "Gagal menghapus proyek.");
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <FolderGit2 className="w-7 h-7 text-primary" />
            <span>Manajemen Proyek Portofolio</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola pameran karya, status publikasi, dan tautan repositori proyek Anda.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Proyek Baru</span>
        </button>
      </div>

      {/* Search & Counter Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari judul proyek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="text-xs font-semibold text-muted-foreground">
          Total Proyek: <span className="text-foreground">{projects.length}</span> Item
        </div>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="text-center py-16 space-y-3 bg-card rounded-2xl border border-border">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-xs text-muted-foreground font-medium">Memuat data proyek...</p>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-foreground">
              <thead className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">Proyek</th>
                  <th className="px-4 py-3.5 font-semibold">Kategori</th>
                  <th className="px-4 py-3.5 font-semibold">Tech Stack</th>
                  <th className="px-4 py-3.5 font-semibold text-center">Featured</th>
                  <th className="px-4 py-3.5 font-semibold text-center">Status</th>
                  <th className="px-4 py-3.5 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.thumbnail_url}
                          alt={project.title}
                          className="w-12 h-12 rounded-xl object-cover border border-border shrink-0 bg-muted"
                        />
                        <div className="space-y-0.5 max-w-xs">
                          <h2 className="font-bold text-foreground text-sm truncate">
                            {project.title}
                          </h2>
                          <p className="text-[11px] text-muted-foreground truncate">
                            /{project.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 uppercase font-semibold text-[11px] text-muted-foreground">
                      {project.category}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {project.tech_stack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-secondary text-secondary-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            +{project.tech_stack.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {project.is_featured ? (
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                          project.status === "published"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}
                      >
                        {project.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenModal(project)}
                          className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit Proyek"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="p-1.5 rounded-lg border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          title="Hapus Proyek"
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
          <FolderGit2 className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
          <p className="text-xs text-muted-foreground font-medium">
            Belum ada data proyek. Klik "Tambah Proyek Baru" untuk membuat pameran karya pertama Anda.
          </p>
        </div>
      )}

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-lg font-bold text-foreground">
                {editingProject ? "Edit Data Proyek" : "Tambah Proyek Baru"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Judul */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Judul Proyek *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="SaaS Analytics Dashboard"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="saas-analytics-dashboard"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>

                {/* Ringkasan EN */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Ringkasan Singkat (EN) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.summary_en}
                    onChange={(e) =>
                      setFormData({ ...formData, summary_en: e.target.value })
                    }
                    placeholder="Real-time analytics platform built for high-throughput metrics..."
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Ringkasan ID */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Ringkasan Singkat (ID)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.summary_id}
                    onChange={(e) =>
                      setFormData({ ...formData, summary_id: e.target.value })
                    }
                    placeholder="Platform analitik real-time yang dibangun untuk visualisasi data..."
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Tech Stack */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    Teknologi / Tech Stack (Pisahkan dengan Koma) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tech_stack_input}
                    onChange={(e) =>
                      setFormData({ ...formData, tech_stack_input: e.target.value })
                    }
                    placeholder="Next.js, TypeScript, Supabase, Tailwind CSS"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Thumbnail URL */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">
                    URL Gambar Thumbnail *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.thumbnail_url}
                    onChange={(e) =>
                      setFormData({ ...formData, thumbnail_url: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  />
                </div>

                {/* Live URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Tautan Live Demo
                  </label>
                  <input
                    type="url"
                    value={formData.live_url}
                    onChange={(e) =>
                      setFormData({ ...formData, live_url: e.target.value })
                    }
                    placeholder="https://myproject.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* GitHub URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Tautan GitHub Repository
                  </label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) =>
                      setFormData({ ...formData, github_url: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Kategori Proyek
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as ProjectCategory,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="web">Web Application</option>
                    <option value="mobile">Mobile Application</option>
                    <option value="ui_ux">UI/UX Design</option>
                    <option value="open_source">Open Source Tool</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Status Publikasi
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as ContentStatus,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="published">Published (Tampil Publik)</option>
                    <option value="draft">Draft (Sembunyikan)</option>
                  </select>
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

                {/* Featured Checkbox */}
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) =>
                      setFormData({ ...formData, is_featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="is_featured"
                    className="text-xs font-semibold text-foreground cursor-pointer"
                  >
                    Tampilkan di Highlight Beranda (Featured)
                  </label>
                </div>
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
                    <span>Simpan Proyek</span>
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