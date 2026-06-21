import { supabase } from "@/lib/supabase/client";
import { Briefcase } from "lucide-react";

export default async function Experience() {
  // Fetch data langsung di dalam komponen server
  const { data: experiences, error } = await supabase
    .from("experience")
    .select("*")
    .order("sort_order", { ascending: true });

  // Jika tidak ada data atau terjadi error, jangan render section ini
  if (error || !experiences || experiences.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-12">
          <Briefcase className="w-8 h-8 text-black" />
          <h2 className="text-3xl font-bold text-gray-900">Work Experience</h2>
        </div>

        <div className="relative border-l-2 border-gray-200 ml-3 md:ml-4">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="mb-12 ml-8 relative last:mb-0">
              {/* Titik Timeline */}
              <span className="absolute -left-[41px] flex items-center justify-center w-5 h-5 rounded-full bg-white border-4 border-black ring-4 ring-gray-50" />

              {/* Konten Experience */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {exp.role}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full whitespace-nowrap">
                    {exp.period}
                  </span>
                </div>
                <h4 className="text-lg font-medium text-gray-600 mb-4">
                  {exp.company}
                </h4>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
