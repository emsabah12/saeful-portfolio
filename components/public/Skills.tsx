import { supabase } from "@/lib/supabase/client";
import { Wrench, CheckCircle2 } from "lucide-react";

interface Skill {
  id: string;
  skill_name: string;
  category: string;
  technical: string[]; // Sekarang array of string
  sort_order: number;
}

export default async function Skills() {
  const { data: skills, error } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !skills || skills.length === 0) return null;

  // Grouping berdasarkan kategori
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-12">
          <Wrench className="w-8 h-8 text-black" />
          <h2 className="text-3xl font-bold text-gray-900">
            Technical Expertise & Soft Skills
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {Object.entries(groupedSkills).map(([category, items]) => (
            <div
              key={category}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-100">
                {category}
              </h3>

              <div className="space-y-8">
                {items.map((item) => (
                  <div key={item.id}>
                    {/* Judul Skill Utama (Misal: Data Analyst) */}
                    <h4 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 bg-black rounded-full" />
                      {item.skill_name}
                    </h4>

                    {/* Daftar Sub-teknik (Misal: A/B Testing, EDA, dll) */}
                    {item.technical && item.technical.length > 0 && (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 pl-4">
                        {item.technical.map((tech, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-gray-600 text-sm"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            <span>{tech}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
