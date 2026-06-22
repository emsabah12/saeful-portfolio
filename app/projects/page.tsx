import { supabase } from "@/lib/supabase/client";
import { ArrowLeft, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "All Projects | Saeful Portfolio",
  description: "Daftar lengkap portfolio project yang telah saya kerjakan.",
};

interface Project {
  id: string;
  title: string;
  description: string;
  image_path: string;
  tech_stack: string[];
  link: string;
  period: string;
}

export default async function AllProjectsPage() {
  // QUERY SUPABASE: Mengambil SEMUA data project tanpa batasan, diurutkan berdasarkan sort_order
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Gagal memuat data project.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* NAVIGASI BACK & HEADER */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-black font-medium transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Semua Project
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Kumpulan riwayat karya, eksperimen, dan proyek profesional yang
            pernah saya kerjakan.
          </p>
        </div>

        {/* GRID LAYOUT DAFTAR PROJECT */}
        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: Project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                {/* Image Container - Mengarah ke Detail Project */}
                <Link
                  href={`/projects/${project.id}`}
                  className="relative w-full h-60 bg-gray-100 overflow-hidden block"
                >
                  <img
                    src={project.image_path}
                    alt={project.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>

                {/* Content Container */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div>
                      {/* Title - Mengarah ke Detail Project */}
                      <Link href={`/projects/${project.id}`}>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight mb-1 hover:text-blue-600 transition-colors">
                          {project.title}
                        </h2>
                      </Link>
                      <p className="text-sm font-medium text-gray-500">
                        {project.period}
                      </p>
                    </div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 bg-gray-50 rounded-full text-gray-600 hover:bg-black hover:text-white transition-all shrink-0"
                        title="Kunjungi Project (External Link)"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Deskripsi: Dibatasi maksimal 3 baris menggunakan line-clamp-3 */}
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack & Tombol Detail di posisi bawah (mt-auto) */}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack?.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-md border border-gray-200"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack?.length > 3 && (
                        <span className="px-3 py-1 bg-gray-50 text-gray-400 text-xs font-medium rounded-md border border-gray-200">
                          +{project.tech_stack.length - 3}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/projects/${project.id}`}
                      className="text-sm font-semibold text-black flex items-center gap-1 group/link hover:text-blue-600 transition-colors w-max"
                    >
                      Baca Selengkapnya
                      <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
            <p className="text-gray-500">Belum ada project yang ditambahkan.</p>
          </div>
        )}
      </div>
    </main>
  );
}
