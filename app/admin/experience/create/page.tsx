import ExperienceForm from "@/features/experience/components/ExperienceForm";

export default function CreateExperiencePage() {
  // Hanya merender form tanpa initialData agar form kosong
  return <ExperienceForm isEdit={false} />;
}
