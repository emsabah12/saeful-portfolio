import Image from "next/image";
import Link from "next/link";
// Kita hapus 'Linkedin' dari import lucide-react
import { FileText, Mail, MapPin } from "lucide-react";

// Tipe data yang diharapkan dari props
interface HeroProps {
  profile: {
    name: string;
    role: string;
    bio: string;
    email: string;
    linkedin: string;
    location: string;
    image_path: string;
  };
  settings: {
    resume_url?: string;
  };
}

export default function Hero({ profile, settings }: HeroProps) {
  // Fallback gambar default jika image_path kosong/error
  const imageSrc = profile?.image_path || "/images/profile/default.webp";

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Bagian Teks (Kiri) */}
          <div className="order-2 lg:order-1 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium mb-6">
              <MapPin className="w-4 h-4" />
              {profile?.location || "Location not set"}
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-4">
              Hi, I'm {profile?.name || "John Doe"}
            </h1>

            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-600 mb-6">
              {profile?.role || "Professional Role"}
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mb-8">
              {profile?.bio || "Short bio goes here."}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {settings?.resume_url && (
                <Link
                  href={settings.resume_url}
                  target="_blank"
                  className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                >
                  <FileText className="w-5 h-5" />
                  <span>Download Resume</span>
                </Link>
              )}

              <Link
                href={`mailto:${profile?.email}`}
                className="flex items-center gap-2 bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                <Mail className="w-5 h-5" />
                <span>Contact Me</span>
              </Link>

              <Link
                href={profile?.linkedin || "#"}
                target="_blank"
                className="flex items-center justify-center p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                aria-label="LinkedIn Profile"
              >
                {/* SVG Native LinkedIn menggantikan komponen lucide */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Bagian Gambar (Kanan) */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              <Image
                src={imageSrc}
                alt={profile?.name || "Profile Picture"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 256px, 384px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
