import { supabase } from "@/lib/supabase/client";
import { ArrowLeft, ExternalLink, Calendar, Code2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// 1. PERBAIKAN TIPE DATA: Jadikan params sebagai Promise
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image_path: string;
  tech_stack: string[];
  link: string;
  period: string;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  // 2. PERBAIKAN PEMANGGILAN: Gunakan 'await' sebelum membaca params
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // QUERY SUPABASE: Mengambil 1 data spesifik berdasarkan ID
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  // Jika error atau data tidak ditemukan, alihkan ke halaman 404 Not Found
  if (error || !project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        {/* NAVIGASI BACK */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-black font-medium transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Daftar Project
        </Link>

        {/* HEADER SECTION */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="font-medium">{project.period}</span>
            </div>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium hover:underline transition-all"
              >
                <ExternalLink className="w-5 h-5" />
                Kunjungi Project Live
              </a>
            )}
          </div>
        </div>

        {/* HERO IMAGE */}
        <div className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-sm border border-gray-100">
          <img
            src={project.image_path}
            alt={`Tangkapan layar dari ${project.title}`}
            className="object-cover w-full h-full"
          />
        </div>

        {/* KONTEN UTAMA: Tech Stack & Deskripsi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* KIRI: Informasi Teknis (Tech Stack) */}
          <div className="md:col-span-1 space-y-6">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-5 h-5 text-gray-900" />
                <h3 className="text-lg font-bold text-gray-900">Teknologi</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tech_stack?.map((tech: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-white text-gray-700 text-sm font-semibold rounded-lg border border-gray-200 shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* KANAN: Deskripsi Lengkap */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Tentang Project
            </h3>
            {/* Class whitespace-pre-wrap sangat penting di sini. */}
            {/* <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p> */}
            {/* KANAN: Deskripsi Lengkap */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Tentang Project
              </h3>

              {/* PERBAIKAN: Gunakan dangerouslySetInnerHTML dan kelas prose */}
              <div
                className="prose prose-lg max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
