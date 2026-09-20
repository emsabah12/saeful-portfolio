-- ============================================================================
-- LANGKAH 3: SCHEMA DDL & ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. TABEL PROFILES (Data Identitas Utama Admin)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(100) NOT NULL,
    headline_en TEXT NOT NULL,
    headline_id TEXT,
    bio_en TEXT NOT NULL,
    bio_id TEXT,
    avatar_url TEXT,
    resume_url TEXT,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    location VARCHAR(100),
    social_links JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 2. TABEL SKILLS (Keahlian Teknis & Soft Skills)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL CHECK (category IN ('frontend', 'backend', 'devops', 'database', 'soft_skill')),
    proficiency INTEGER CHECK (proficiency BETWEEN 1 AND 100),
    icon_name VARCHAR(50),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. TABEL EXPERIENCES (Riwayat Pengalaman Kerja)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(100) NOT NULL,
    position_en VARCHAR(100) NOT NULL,
    position_id VARCHAR(100),
    description_en TEXT NOT NULL,
    description_id TEXT,
    location VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 4. TABEL EDUCATIONS (Riwayat Pendidikan Formal/Informal)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.educations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_name VARCHAR(100) NOT NULL,
    degree_en VARCHAR(100) NOT NULL,
    degree_id VARCHAR(100),
    field_of_study_en VARCHAR(100) NOT NULL,
    field_of_study_id VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    gpa VARCHAR(10),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 5. TABEL PROJECTS (Pameran Karya/Portofolio Proyek)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    summary_en TEXT NOT NULL,
    summary_id TEXT,
    description_en TEXT NOT NULL,
    description_id TEXT,
    thumbnail_url TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    live_url TEXT,
    github_url TEXT,
    category VARCHAR(50) DEFAULT 'web',
    is_featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 6. TABEL POSTS (Artikel Blog & Technical Writing)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en VARCHAR(200) NOT NULL,
    title_id VARCHAR(200),
    slug VARCHAR(200) UNIQUE NOT NULL,
    content_en TEXT NOT NULL,
    content_id TEXT,
    excerpt_en TEXT NOT NULL,
    excerpt_id TEXT,
    cover_image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    reading_time_min INTEGER DEFAULT 5,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 7. TABEL MESSAGES (Kotak Pesan Masuk / Contact Form)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name VARCHAR(100) NOT NULL,
    sender_email VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- KONFIGURASI ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS pada seluruh tabel
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- POLICY 1: PUBLIC READ ACCESS (Pengunjung umum/anonim)
-- ----------------------------------------------------------------------------
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Public skills are viewable by everyone" 
    ON public.skills FOR SELECT USING (true);

CREATE POLICY "Public experiences are viewable by everyone" 
    ON public.experiences FOR SELECT USING (true);

CREATE POLICY "Public educations are viewable by everyone" 
    ON public.educations FOR SELECT USING (true);

-- Hanya publikasikan proyek dan postingan yang bertanda status = 'published'
CREATE POLICY "Published projects are viewable by everyone" 
    ON public.projects FOR SELECT USING (status = 'published');

CREATE POLICY "Published posts are viewable by everyone" 
    ON public.posts FOR SELECT USING (status = 'published');

-- ----------------------------------------------------------------------------
-- POLICY 2: PUBLIC INSERT ACCESS (Contact Form)
-- ----------------------------------------------------------------------------
-- Mengizinkan pengunjung anonim mengirim pesan ke tabel messages
CREATE POLICY "Public can submit contact messages" 
    ON public.messages FOR INSERT WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- POLICY 3: AUTHENTICATED ADMIN FULL ACCESS (CRUD penuh untuk Admin)
-- ----------------------------------------------------------------------------
CREATE POLICY "Admin full access on profiles" 
    ON public.profiles FOR ALL TO authenticated USING (true);

CREATE POLICY "Admin full access on skills" 
    ON public.skills FOR ALL TO authenticated USING (true);

CREATE POLICY "Admin full access on experiences" 
    ON public.experiences FOR ALL TO authenticated USING (true);

CREATE POLICY "Admin full access on educations" 
    ON public.educations FOR ALL TO authenticated USING (true);

CREATE POLICY "Admin full access on projects" 
    ON public.projects FOR ALL TO authenticated USING (true);

CREATE POLICY "Admin full access on posts" 
    ON public.posts FOR ALL TO authenticated USING (true);

CREATE POLICY "Admin full access on messages" 
    ON public.messages FOR ALL TO authenticated USING (true);
