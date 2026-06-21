"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import SkillForm from "@/features/skills/components/SkillForm";
import { Loader2 } from "lucide-react";
import { use } from "react";

export default function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["skill", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  if (error || !data)
    return (
      <div className="text-red-500 p-8">Gagal memuat: {error?.message}</div>
    );

  return <SkillForm initialData={data} isEdit={true} />;
}
