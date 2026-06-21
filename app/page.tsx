import { supabase } from "@/lib/supabase/client";
import Hero from "@/components/public/Hero";
import Experience from "@/components/public/Experience";
import Projects from "@/components/public/Projects";
import Skills from "@/components/public/Skills";
import Education from "@/components/public/Education";
import Contact from "@/components/public/Contact";
import Footer from "@/components/public/Footer";

// Mengatur ISR (Incremental Static Regeneration)
// Next.js akan memperbarui cache halaman publik setiap 60 detik secara latar belakang
export const revalidate = 60;

export default async function Home() {
  // Melakukan fetching data di server secara paralel (Promise.all bisa digunakan, tapi ini lebih mudah dibaca)
  const { data: profile } = await supabase.from("profile").select("*").single();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .single();

  return (
    <main className="min-h-screen bg-white selection:bg-black selection:text-white">
      {/* Header / Navbar publik bisa ditambahkan di sini nanti
       */}

      {/* Memanggil komponen Hero dan mengoper data dari database */}
      <Hero profile={profile} settings={settings} />
      {/* Menyisipkan Section Skills */}
      <Skills />
      {/* Menyisipkan Section Projects */}
      <Projects />
      {/* Section: Experience */}
      <Experience />
      {/* Section: Education */}
      <Education />

      {/* Spacer agar ada jarak sebelum masuk ke area Contact yang berwarna gelap */}
      <div className="flex-1"></div>

      <Contact profile={profile} />
      <Footer settings={settings} />
    </main>
  );
}
