import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, FolderGit2 } from "lucide-react";

export default async function Projects() {
  // Mengambil data projects, diurutkan berdasarkan featured lalu sort_order
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error || !projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-12">
          <FolderGit2 className="w-8 h-8 text-black" />
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Projects
          </h2>
        </div>

        {/* Grid Layout untuk Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Bagian Gambar */}
              <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                <Image
                  src={project.image_path || "/images/projects/default.webp"}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {project.featured && (
                  <div className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
                    Featured
                  </div>
                )}
              </div>

              {/* Bagian Konten */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                    {project.title}
                  </h3>
                  {project.link && (
                    <Link
                      href={project.link}
                      target="_blank"
                      className="text-gray-400 hover:text-black transition-colors"
                      title="View Project"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-4">{project.period}</p>

                <p className="text-gray-600 mb-6 flex-1 line-clamp-3">
                  {project.description}
                </p>

                {/* Bagian Tech Stack */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
                    {project.tech_stack.map((tech: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
