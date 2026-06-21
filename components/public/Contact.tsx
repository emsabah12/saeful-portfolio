// import { Mail, MapPin, Linkedin } from "lucide-react";
import Link from "next/link";

interface ContactProps {
  profile: {
    email: string;
    location: string;
    linkedin: string;
  };
}

export default function Contact({ profile }: ContactProps) {
  if (!profile) return null;

  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-6">
          Let's Work Together
        </h2>
        <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
          I'm always open to discussing new projects, creative ideas, or
          opportunities to be part of your vision.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Email */}
          <div className="flex flex-col items-center p-6 bg-gray-900 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              {/* <Mail className="w-6 h-6 text-white" /> */}
            </div>
            <h3 className="text-lg font-bold mb-2">Email</h3>
            <a
              href={`mailto:${profile.email}`}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {profile.email}
            </a>
          </div>

          {/* Location */}
          <div className="flex flex-col items-center p-6 bg-gray-900 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              {/* <MapPin className="w-6 h-6 text-white" /> */}
            </div>
            <h3 className="text-lg font-bold mb-2">Location</h3>
            <span className="text-gray-400">{profile.location}</span>
          </div>

          {/* LinkedIn */}
          <div className="flex flex-col items-center p-6 bg-gray-900 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              {/* <Linkedin className="w-6 h-6 text-white" /> */}
            </div>
            <h3 className="text-lg font-bold mb-2">LinkedIn</h3>
            <Link
              href={profile.linkedin || "#"}
              target="_blank"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Connect with me
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
