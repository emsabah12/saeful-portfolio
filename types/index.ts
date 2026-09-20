/**
 * Tipe Bahasa yang Didukung Aplikasi
 */
export type Locale = "en" | "id";

/**
 * Tipe Kategori Keahlian (Skills)
 */
export type SkillCategory =
  | "frontend"
  | "backend"
  | "devops"
  | "database"
  | "soft_skill";

/**
 * Tipe Kategori Proyek
 */
export type ProjectCategory = "web" | "mobile" | "ui_ux" | "open_source";

/**
 * Tipe Status Draf/Publikasi
 */
export type ContentStatus = "draft" | "published";

/**
 * Antarmuka Tautan Media Sosial
 */
export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

/**
 * Antarmuka Tabel Profiles
 */
export interface Profile {
  id: string;
  full_name: string;
  headline_en: string;
  headline_id?: string | null;
  bio_en: string;
  bio_id?: string | null;
  avatar_url?: string | null;
  resume_url?: string | null;
  email: string;
  phone?: string | null;
  location?: string | null;
  social_links: SocialLink[];
  updated_at: string;
}

/**
 * Antarmuka Tabel Skills
 */
export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 1 - 100
  icon_name?: string | null;
  order_index: number;
  created_at: string;
}

/**
 * Antarmuka Tabel Experiences
 */
export interface Experience {
  id: string;
  company_name: string;
  position_en: string;
  position_id?: string | null;
  description_en: string;
  description_id?: string | null;
  location?: string | null;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  order_index: number;
  created_at: string;
}

/**
 * Antarmuka Tabel Educations
 */
export interface Education {
  id: string;
  institution_name: string;
  degree_en: string;
  degree_id?: string | null;
  field_of_study_en: string;
  field_of_study_id?: string | null;
  start_date: string;
  end_date?: string | null;
  gpa?: string | null;
  created_at: string;
}

/**
 * Antarmuka Tabel Projects
 */
export interface Project {
  id: string;
  title: string;
  slug: string;
  summary_en: string;
  summary_id?: string | null;
  description_en: string;
  description_id?: string | null;
  thumbnail_url: string;
  tech_stack: string[];
  live_url?: string | null;
  github_url?: string | null;
  category: ProjectCategory;
  is_featured: boolean;
  status: ContentStatus;
  order_index: number;
  created_at: string;
  updated_at: string;
}

/**
 * Antarmuka Tabel Posts (Blog)
 */
export interface Post {
  id: string;
  title_en: string;
  title_id?: string | null;
  slug: string;
  content_en: string;
  content_id?: string | null;
  excerpt_en: string;
  excerpt_id?: string | null;
  cover_image_url?: string | null;
  tags: string[];
  reading_time_min: number;
  status: ContentStatus;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Antarmuka Tabel Messages (Contact Form)
 */
export interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  is_read: boolean;
  ip_address?: string | null;
  created_at: string;
}

/**
 * Generic Type untuk Respons API Standard
 */
export interface ApiResponse<T = null> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}