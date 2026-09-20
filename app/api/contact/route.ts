import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import { createClient } from "@/lib/supabase/server";
import { ApiResponse } from "@/types";

/**
 * In-Memory Rate Limiter Store
 * Map<IPAddress, { count: number, resetTime: number }>
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 Menit
const MAX_REQUESTS_PER_WINDOW = 3; // Maksimal 3 kali pengiriman

/**
 * Utility Helper untuk mengecek & menerapkan Rate Limit berdasarkan IP Address
 */
function checkRateLimit(ip: string): { isLimited: boolean; remainingMs: number } {
  const now = Date.now();
  const userRate = rateLimitMap.get(ip);

  // Jika IP belum terdaftar atau window waktu sudah kedaluwarsa, reset counter
  if (!userRate || now > userRate.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return { isLimited: false, remainingMs: 0 };
  }

  // Jika masih dalam window dan batas tercapai
  if (userRate.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      isLimited: true,
      remainingMs: userRate.resetTime - now,
    };
  }

  // Increament counter
  userRate.count += 1;
  return { isLimited: false, remainingMs: 0 };
}

/**
 * Route Handler: POST /api/contact
 * Menerima, memvalidasi, menyimpan pesan contact form, dan mengirimkan notifikasi email ke Admin.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Dapatkan IP Address Pengirim (dari Header Reverse Proxy Vercel/Nginx)
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 2. Cek Rate Limiting
    const { isLimited, remainingMs } = checkRateLimit(clientIp);
    if (isLimited) {
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      const errorResponse: ApiResponse = {
        success: false,
        error: `Anda telah mencapai batas pengiriman pesan. Silakan coba lagi dalam ${remainingMinutes} menit.`,
      };
      return NextResponse.json(errorResponse, { status: 429 });
    }

    // 3. Parse Body Request
    const body = await request.json();

    // 4. Validasi Input Menggunakan Zod Schema
    const validationResult = contactFormSchema.safeParse(body);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.errors
        .map((err) => err.message)
        .join(", ");

      const errorResponse: ApiResponse = {
        success: false,
        error: `Validasi gagal: ${formattedErrors}`,
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { sender_name, sender_email, subject, message } = validationResult.data;

    // 5. Simpan Pesan ke Supabase Database (`messages` table)
    const supabase = await createClient();
    const { error: dbError } = await supabase.from("messages").insert([
      {
        sender_name,
        sender_email,
        subject,
        message,
        ip_address: clientIp,
        is_read: false,
      },
    ]);

    if (dbError) {
      console.error("[Database Error - Contact API]:", dbError.message);
      const errorResponse: ApiResponse = {
        success: false,
        error: "Gagal menyimpan pesan ke basis data. Silakan coba beberapa saat lagi.",
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    // 6. Pengiriman Notifikasi Email via Resend REST API (Jika API Key Dikonfigurasi)
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (resendApiKey && adminEmail) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Portfolio Contact Form <onboarding@resend.dev>",
            to: [adminEmail],
            reply_to: sender_email,
            subject: `[Contact Form] ${subject} - dari ${sender_name}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; background-color: #ffffff;">
                <h2 style="color: #2563eb; margin-top: 0;">Pesan Baru dari Portfolio</h2>
                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
                <p><strong>Pengirim:</strong> ${sender_name} (&lt;${sender_email}&gt;)</p>
                <p><strong>Subjek:</strong> ${subject}</p>
                <p><strong>IP Address:</strong> ${clientIp}</p>
                <div style="background-color: #f3f4f6; padding: 16px; border-radius: 6px; margin-top: 16px;">
                  <p style="margin: 0; white-space: pre-wrap; color: #1f2937;">${message}</p>
                </div>
                <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0 16px 0;" />
                <p style="font-size: 12px; color: #6b7280; text-align: center; margin: 0;">
                  Pesan ini dikirim otomatis via Contact Form Saeful Portfolio.
                </p>
              </div>
            `,
          }),
        });
      } catch (emailError) {
        // Catat error email tetapi jangan gagalkan respons publik karena data sudah tersimpan di DB
        console.error("[Email Delivery Error - Resend]:", emailError);
      }
    }

    // 7. Berikan Respons Sukses
    const successResponse: ApiResponse = {
      success: true,
      message: "Pesan Anda berhasil terkirim! Terima kasih telah menghubungi.",
    };
    return NextResponse.json(successResponse, { status: 201 });
  } catch (error) {
    console.error("[Unhandled Exception - Contact API]:", error);
    const errorResponse: ApiResponse = {
      success: false,
      error: "Terjadi kesalahan internal pada server.",
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}