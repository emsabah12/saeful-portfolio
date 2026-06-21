import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co", // Mengizinkan semua gambar dari Supabase
      },
    ],
  },
};

export default nextConfig;
