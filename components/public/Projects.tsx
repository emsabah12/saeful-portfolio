import { supabase } from "@/lib/supabase/client";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  image_path: string;
  tech_stack: string[];
  link: string;
  period: string;
}

export default async function FeaturedProjects() {
  // 1. QUERY SUPABASE: Hanya ambil yang featured, urutkan, dan batasi 3 data
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true) // Wajib dicentang "Featured" di CMS
    .order("sort_order", { ascending: true })
    .limit(3); // Maksimal 3 kolom

  if (error || !projects || projects.length === 0) return null;

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-600 max-w-2xl text-lg">
              Beberapa karya pilihan yang telah saya kerjakan.
            </p>
          </div>

          {/* Tombol Desktop untuk ke halaman Semua Project */}
          <Link
            href="/projects"
            className="hidden md:flex items-center gap-2 text-black font-semibold hover:underline group"
          >
            Lihat Semua Project
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 2. GRID LAYOUT: 1 Kolom di HP, 2 di Tablet, 3 di Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: Project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col"
            >
              {/* Image Container */}
              <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
                <img
                  src={project.image_path}
                  alt={project.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content Container */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {project.period}
                    </p>
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack - Ditaruh di bawah menggunakan mt-auto agar sejajar */}
                <div className="mt-auto flex flex-wrap gap-2">
                  {project.tech_stack?.slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack?.length > 3 && (
                    <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-full">
                      +{project.tech_stack.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Mobile untuk ke halaman Semua Project */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/projects"
            className="flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition shadow-md hover:shadow-lg"
          >
            Lihat Semua Project <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
