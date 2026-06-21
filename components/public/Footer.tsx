interface FooterProps {
  settings: {
    footer_text: string;
  };
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-black text-gray-500 py-8 border-t border-gray-900 text-center text-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>
          {settings?.footer_text || "© 2026 Portfolio. All rights reserved."}
        </p>
        <p>Built with Next.js & Supabase</p>
      </div>
    </footer>
  );
}
