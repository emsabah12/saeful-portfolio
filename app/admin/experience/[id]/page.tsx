"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import ExperienceForm from "@/features/experience/components/ExperienceForm";
import { Loader2 } from "lucide-react";
import { use } from "react";

// Di Next.js 15, params diakses menggunakan React.use() untuk komponen client
export default function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap params
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["experience", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-red-500 p-8 bg-white rounded-xl shadow-sm border border-gray-200">
        Gagal mengambil data: {error?.message}
      </div>
    );
  }

  return <ExperienceForm initialData={data} isEdit={true} />;
}
