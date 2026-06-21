import { supabase } from "@/lib/supabase/client";
import { GraduationCap } from "lucide-react";

export default async function Education() {
  const { data: education, error } = await supabase
    .from("education")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !education || education.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-12">
          <GraduationCap className="w-8 h-8 text-black" />
          <h2 className="text-3xl font-bold text-gray-900">Education</h2>
        </div>

        <div className="space-y-8">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="flex flex-col md:flex-row gap-4 md:gap-8 bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="md:w-1/4 shrink-0">
                <span className="inline-block px-4 py-1.5 bg-black text-white text-sm font-bold rounded-full mb-2">
                  {edu.year}
                </span>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {edu.degree}
                </h3>
                <h4 className="text-lg font-medium text-gray-600 mb-3">
                  {edu.school}
                </h4>
                {edu.score && (
                  <p className="text-sm font-semibold text-gray-500 mb-3 border-l-2 border-gray-300 pl-3">
                    {edu.score}
                  </p>
                )}
                <p className="text-gray-600 leading-relaxed">
                  {edu.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
