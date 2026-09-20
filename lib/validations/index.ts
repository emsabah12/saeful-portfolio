import { z } from "zod";

/**
 * Skema Validasi untuk Public Contact Form
 */
export const contactFormSchema = z.object({
  sender_name: z
    .string()
    .min(2, { message: "Nama minimal 2 karakter." })
    .max(100, { message: "Nama maksimal 100 karakter." }),
  sender_email: z
    .string()
    .email({ message: "Format alamat email tidak valid." }),
  subject: z
    .string()
    .min(3, { message: "Subjek minimal 3 karakter." })
    .max(200, { message: "Subjek maksimal 200 karakter." }),
  message: z
    .string()
    .min(10, { message: "Pesan minimal 10 karakter." })
    .max(2000, { message: "Pesan maksimal 2000 karakter." }),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

/**
 * Skema Validasi Form Profil Admin
 */
export const profileFormSchema = z.object({
  full_name: z.string().min(2, "Nama lengkap harus diisi."),
  headline_en: z.string().min(5, "Headline (EN) harus diisi."),
  headline_id: z.string().optional().nullable(),
  bio_en: z.string().min(10, "Bio (EN) harus diisi."),
  bio_id: z.string().optional().nullable(),
  avatar_url: z.string().url("URL Avatar tidak valid.").optional().nullable(),
  resume_url: z.string().url("URL Resume tidak valid.").optional().nullable(),
  email: z.string().email("Email tidak valid."),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
});

export type ProfileFormInput = z.infer<typeof profileFormSchema>;

/**
 * Skema Validasi Form Skill Admin
 */
export const skillFormSchema = z.object({
  name: z.string().min(1, "Nama skill harus diisi."),
  category: z.enum(["frontend", "backend", "devops", "database", "soft_skill"]),
  proficiency: z.number().min(1).max(100),
  icon_name: z.string().optional().nullable(),
  order_index: z.number().default(0),
});

export type SkillFormInput = z.infer<typeof skillFormSchema>;

/**
 * Skema Validasi Form Proyek Admin
 */
export const projectFormSchema = z.object({
  title: z.string().min(3, "Judul proyek minimal 3 karakter."),
  slug: z.string().min(3, "Slug proyek harus diisi."),
  summary_en: z.string().min(10, "Ringkasan (EN) harus diisi."),
  summary_id: z.string().optional().nullable(),
  description_en: z.string().min(20, "Deskripsi (EN) harus diisi."),
  description_id: z.string().optional().nullable(),
  thumbnail_url: z.string().min(1, "URL Thumbnail wajib ada."),
  tech_stack: z.array(z.string()).min(1, "Pilih minimal 1 teknologi."),
  live_url: z.string().url("URL Live tidak valid.").optional().or(z.literal("")),
  github_url: z.string().url("URL GitHub tidak valid.").optional().or(z.literal("")),
  category: z.enum(["web", "mobile", "ui_ux", "open_source"]),
  is_featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("published"),
  order_index: z.number().default(0),
});

export type ProjectFormInput = z.infer<typeof projectFormSchema>;

/**
 * Skema Validasi Form Artikel/Blog Admin
 */
export const postFormSchema = z.object({
  title_en: z.string().min(3, "Judul (EN) minimal 3 karakter."),
  title_id: z.string().optional().nullable(),
  slug: z.string().min(3, "Slug artikel harus diisi."),
  content_en: z.string().min(20, "Konten (EN) minimal 20 karakter."),
  content_id: z.string().optional().nullable(),
  excerpt_en: z.string().min(10, "Ringkasan (EN) harus diisi."),
  excerpt_id: z.string().optional().nullable(),
  cover_image_url: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  reading_time_min: z.number().min(1).default(5),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type PostFormInput = z.infer<typeof postFormSchema>;