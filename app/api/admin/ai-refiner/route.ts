import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Validasi skema input Zod
const RequestSchema = z.object({
  text: z.string().min(5, 'Teks minimal 5 karakter untuk diproses oleh AI.'),
  action: z.enum(['summarize', 'polish', 'generate_tags', 'translate']),
  targetLang: z.enum(['en', 'id']).optional().default('id'),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Verifikasi Otentikasi Admin via Supabase Session
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Middleware handles session refresh
            }
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Akses khusus Admin terotentikasi.' },
        { status: 401 }
      );
    }

    // 2. Parse & Validasi Payload Request
    const body = await req.json();
    const validation = RequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payload tidak valid.',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { text, action, targetLang } = validation.data;

    // 3. Persiapan Prompt untuk Google Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            'GEMINI_API_KEY belum dikonfigurasi pada Environment Variables.',
        },
        { status: 500 }
      );
    }

    let systemPrompt = '';
    switch (action) {
      case 'summarize':
        systemPrompt = `Anda adalah asisten AI editor teknis berpengalaman. Buat ringkasan/ekserp (excerpt) singkat, padat, dan menarik sepanjang 2-3 kalimat dari teks berikut dalam bahasa ${
          targetLang === 'en' ? 'Inggris' : 'Indonesia'
        }. Jangan sertakan pengantar, langsung berikan teks ringkasan saja.`;
        break;

      case 'polish':
        systemPrompt = `Anda adalah Senior Technical Content Editor. Perbaiki tata bahasa, kejelasan struktur kalimat, dan kerapian istilah teknis (technical vocabulary) pada artikel berikut dalam bahasa ${
          targetLang === 'en' ? 'Inggris' : 'Indonesia'
        }. Pertahankan format Markdown. Langsung hasilkan teks perbaikan tanpa penjelasan tambahan.`;
        break;

      case 'generate_tags':
        systemPrompt = `Ekstrak 4 sampai 6 kata kunci/tag teknologi paling relevan dari artikel berikut. Kembalikan HANYA daftar kata kunci yang dipisahkan oleh koma tanpa nomor atau simbol lain. Contoh format output: Next.js, TypeScript, Architecture, Supabase.`;
        break;

      case 'translate':
        systemPrompt = `Terjemahkan teks artikel teknis berikut secara akurat ke Bahasa ${
          targetLang === 'en' ? 'Inggris' : 'Indonesia'
        } dengan tetap mempertahankan gaya bahasa profesional dan format Markdown asli. Langsung berikan hasil terjemahan saja.`;
        break;
    }

    // 4. Memanggil REST API Google Gemini 2.5 Flash
    const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    const geminiResponse = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `\n\n--- TEKS KONTEN ---\n${text}` },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error('Gemini API Error:', errorData);
      return NextResponse.json(
        {
          success: false,
          error: 'Gagal memproses permintaan ke Google Gemini AI Service.',
        },
        { status: 502 }
      );
    }

    const geminiData = await geminiResponse.json();
    const generatedContent =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    return NextResponse.json({
      success: true,
      action,
      result: generatedContent,
    });
  } catch (error: any) {
    console.error('AI Refiner Handler Exception:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error pada AI Handler.' },
      { status: 500 }
    );
  }
}