import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  FolderGit2,
  FileText,
  Code2,
  Mail,
  ArrowUpRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Inbox,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch metric counts secara paralel dari Supabase
  const [
    { count: projectsCount },
    { count: postsCount },
    { count: unreadMessagesCount },
    { count: skillsCount },
    { data: recentMessages },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
    supabase.from("skills").select("*", { count: "exact", head: true }),
    supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const metrics = [
    {
      title: "Total Proyek",
      count: projectsCount || 0,
      label: "Showcase Portofolio",
      icon: FolderGit2,
      href: "/admin/projects",
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Artikel Blog",
      count: postsCount || 0,
      label: "Publikasi Teknis",
      icon: FileText,
      href: "/admin/posts",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Pesan Belum Dibaca",
      count: unreadMessagesCount || 0,
      label: "Kotak Masuk Contact Form",
      icon: Mail,
      href: "/admin/messages",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Keahlian Teknis",
      count: skillsCount || 0,
      label: "Skills Matrix Item",
      icon: Code2,
      href: "/admin/skills",
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Overview CMS Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Selamat datang kembali! Kelola konten portofolio dan pesan masuk Anda di sini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Proyek Baru</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all shadow-sm hover:shadow-md space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl border ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              <div>
                <p className="text-3xl font-black text-foreground tracking-tight">
                  {item.count}
                </p>
                <h2 className="text-sm font-semibold text-foreground mt-1">
                  {item.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.label}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Contact Messages Section */}
      <div className="p-6 rounded-2xl border border-border bg-card space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Inbox className="w-5 h-5 text-primary" />
              <span>Pesan Masuk Terbaru</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              5 pesan kontak terbaru yang dikirim oleh pengunjung publik.
            </p>
          </div>

          <Link
            href="/admin/messages"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua Pesan</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Recent Messages List Table */}
        {recentMessages && recentMessages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-foreground">
              <thead className="bg-muted text-muted-foreground uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-semibold">Pengirim</th>
                  <th className="px-4 py-3 font-semibold">Subjek</th>
                  <th className="px-4 py-3 font-semibold">Tanggal</th>
                  <th className="px-4 py-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {recentMessages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3.5 font-semibold">
                      <div>{msg.sender_name}</div>
                      <div className="text-[11px] text-muted-foreground font-normal">
                        {msg.sender_email}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 max-w-xs truncate font-medium">
                      {msg.subject}
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(msg.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      {msg.is_read ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-secondary text-muted-foreground">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Dibaca</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-500">
                          <AlertCircle className="w-3 h-3" />
                          <span>Baru</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-border rounded-xl space-y-2">
            <Mail className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
            <p className="text-xs text-muted-foreground font-medium">
              Belum ada pesan masuk dari form kontak publik.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
