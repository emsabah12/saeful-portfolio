'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Sparkles,
  Save,
  CheckCircle2,
  X,
  Bold,
  Italic,
  Heading,
  Code,
  Quote,
  ListOrdered,
  Tag,
  Clock,
  Globe,
  Upload,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';

export interface PostItem {
  id: string;
  title_en: string;
  title_id?: string;
  slug: string;
  content_en: string;
  content_id?: string;
  excerpt_en: string;
  excerpt_id?: string;
  cover_image_url?: string;
  tags: string[];
  reading_time_min: number;
  status: 'draft' | 'published';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

const INITIAL_POSTS: PostItem[] = [
  {
    id: '101',
    title_en: 'Architecting Scalable Micro-frontends on Edge Runtime',
    title_id: 'Merancang Mikro-frontend Skalabel pada Edge Runtime',
    slug: 'architecting-scalable-micro-frontends-edge-runtime',
    content_en: `# Architecting Scalable Micro-frontends on Edge Runtime\n\nHigh-throughput digital experiences demand isolation of blast radiuses. When orchestrating decoupled UI components, running compute at the CDN edge reduces global latency drastically.\n\n## Core Architectural Guarantees\n\n1. **Sub-15ms Time to First Byte** via automated georouting.\n2. **Independent Deployments** decoupled from the monolith host.\n3. **Resilient SSR Hydration** using streaming React server components.`,
    content_id: `# Merancang Mikro-frontend Skalabel pada Edge Runtime\n\nPengalaman digital berkinerja tinggi membutuhkan isolasi radius dampak. Saat mengalirkan komponen UI terpisah, menjalankan komputasi di CDN edge mengurangi latensi global secara drastis.\n\n## Jaminan Arsitektur Utama\n\n1. **Waktu ke Byte Pertama Sub-15ms** melalui georouting otomatis.\n2. **Penyebaran Independen** terpisah dari host monolit.\n3. **Hidrasi SSR Tangguh** menggunakan streaming komponen server React.`,
    excerpt_en: 'How to decouple monolith UIs and deploy React micro-frontends directly to Vercel Edge Network.',
    excerpt_id: 'Cara memisahkan UI monolit dan mengoperasikan mikro-frontend React langsung ke Vercel Edge Network.',
    cover_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
    tags: ['Architecture', 'Next.js', 'Edge Runtime'],
    reading_time_min: 6,
    status: 'published',
    published_at: '2026-02-15 10:00',
    created_at: '2026-02-14 09:00',
    updated_at: '2026-02-15 10:00',
  },
  {
    id: '102',
    title_en: 'Zero-Downtime Database Migrations with Supabase & Postgres',
    title_id: 'Migrasi Database Zero-Downtime dengan Supabase & Postgres',
    slug: 'zero-downtime-database-migrations-supabase-postgres',
    content_en: `# Zero-Downtime Database Migrations with Supabase & Postgres\n\nExecuting DDL migrations in high-concurrency production environments requires strict adherence to non-blocking schema evolution principles.\n\n\`\`\`sql\n-- Add column as nullable first\nALTER TABLE public.posts ADD COLUMN reading_time_min INTEGER DEFAULT 5;\n\`\`\``,
    content_id: `# Migrasi Database Zero-Downtime dengan Supabase & Postgres\n\nMengeksekusi migrasi DDL pada lingkungan produksi berkapasitas tinggi memerlukan kepatuhan ketat pada prinsip evolusi skema non-blocking.`,
    excerpt_en: 'Best practices for applying schema updates safely without locking tables or dropping active connections.',
    excerpt_id: 'Praktik terbaik menerapkan pembaruan skema secara aman tanpa mengunci tabel atau memutuskan koneksi aktif.',
    cover_image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
    tags: ['PostgreSQL', 'Supabase', 'DevOps'],
    reading_time_min: 8,
    status: 'published',
    published_at: '2026-02-01 14:20',
    created_at: '2026-01-30 11:00',
    updated_at: '2026-02-01 14:20',
  },
  {
    id: '103',
    title_en: 'Building Event-Driven Telemetry Pipelines in Rust',
    title_id: 'Membangun Pipeline Telemetri Event-Driven dalam Rust',
    slug: 'building-event-driven-telemetry-pipelines-rust',
    content_en: `# Building Event-Driven Telemetry Pipelines in Rust\n\nDraft article exploring async WebSockets and memory safety guarantees for microsecond telemetry collection.`,
    content_id: `# Membangun Pipeline Telemetri Event-Driven dalam Rust\n\nDraf artikel mengeksplorasi WebSockets asinkron dan jaminan keamanan memori untuk pengumpulan telemetri mikrodetik.`,
    excerpt_en: 'An architectural breakdown of processing 100k events/sec with minimal memory footprint.',
    excerpt_id: 'Rincian arsitektur pemrosesan 100rb event/detik dengan konsumsi memori minimal.',
    cover_image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
    tags: ['Rust', 'Telemetry', 'Distributed Systems'],
    reading_time_min: 12,
    status: 'draft',
    created_at: '2026-02-18 16:45',
    updated_at: '2026-02-18 16:45',
  },
];

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Modal & Form States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<'en' | 'id'>('en');
  const [isTranslating, setIsTranslating] = useState(false);

  // Form Fields
  const [formTitleEn, setFormTitleEn] = useState('');
  const [formTitleId, setFormTitleId] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formExcerptEn, setFormExcerptEn] = useState('');
  const [formExcerptId, setFormExcerptId] = useState('');
  const [formContentEn, setFormContentEn] = useState('');
  const [formContentId, setFormContentId] = useState('');
  const [formCoverUrl, setFormCoverUrl] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formReadingTime, setFormReadingTime] = useState(5);
  const [formStatus, setFormStatus] = useState<'draft' | 'published'>('published');

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      const matchesTag = selectedTag === 'all' || post.tags.includes(selectedTag);

      return matchesSearch && matchesStatus && matchesTag;
    });
  }, [posts, searchQuery, statusFilter, selectedTag]);

  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setFormTitleEn('');
    setFormTitleId('');
    setFormSlug('');
    setFormExcerptEn('');
    setFormExcerptId('');
    setFormContentEn('# New Technical Article\n\nWrite your markdown content here...');
    setFormContentId('# Artikel Teknis Baru\n\nTulis konten markdown Anda di sini...');
    setFormCoverUrl('https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=600&auto=format&fit=crop');
    setFormTags('Next.js, TypeScript, Architecture');
    setFormReadingTime(5);
    setFormStatus('published');
    setActiveLang('en');
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (post: PostItem) => {
    setEditingPost(post);
    setFormTitleEn(post.title_en);
    setFormTitleId(post.title_id || '');
    setFormSlug(post.slug);
    setFormExcerptEn(post.excerpt_en);
    setFormExcerptId(post.excerpt_id || '');
    setFormContentEn(post.content_en);
    setFormContentId(post.content_id || '');
    setFormCoverUrl(post.cover_image_url || '');
    setFormTags(post.tags.join(', '));
    setFormReadingTime(post.reading_time_min);
    setFormStatus(post.status);
    setActiveLang('en');
    setIsEditorOpen(true);
  };

  const handleAutoTranslate = async () => {
    setIsTranslating(true);
    setTimeout(() => {
      if (formTitleEn && !formTitleId) {
        setFormTitleId(`[ID] ${formTitleEn}`);
      }
      if (formExcerptEn && !formExcerptId) {
        setFormExcerptId(`[ID] ${formExcerptEn}`);
      }
      if (formContentEn) {
        setFormContentId(
          formContentEn
            .replace('# ', '# [Terjemahan] ')
            .replace('High-throughput', 'Pengalaman digital berkinerja tinggi')
        );
      }
      setActiveLang('id');
      setIsTranslating(false);
    }, 600);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const updatedSlug = formSlug || formTitleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (editingPost) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editingPost.id
            ? {
                ...p,
                title_en: formTitleEn,
                title_id: formTitleId || undefined,
                slug: updatedSlug,
                excerpt_en: formExcerptEn,
                excerpt_id: formExcerptId || undefined,
                content_en: formContentEn,
                content_id: formContentId || undefined,
                cover_image_url: formCoverUrl,
                tags: tagArray,
                reading_time_min: Number(formReadingTime),
                status: formStatus,
                updated_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
              }
            : p
        )
      );
    } else {
      const newPost: PostItem = {
        id: String(Date.now()),
        title_en: formTitleEn,
        title_id: formTitleId || undefined,
        slug: updatedSlug,
        excerpt_en: formExcerptEn,
        excerpt_id: formExcerptId || undefined,
        content_en: formContentEn,
        content_id: formContentId || undefined,
        cover_image_url: formCoverUrl,
        tags: tagArray,
        reading_time_min: Number(formReadingTime),
        status: formStatus,
        published_at: formStatus === 'published' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined,
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
        updated_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      setPosts((prev) => [newPost, ...prev]);
    }
    setIsEditorOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      setPosts((prev) => prev.filter((p) => p.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const insertMarkdownSyntax = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('markdownTextarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = activeLang === 'en' ? formContentEn : formContentId;
    const selectedText = currentText.substring(start, end) || 'sample_text';
    const newText =
      currentText.substring(0, start) +
      `${prefix}${selectedText}${suffix}` +
      currentText.substring(end);

    if (activeLang === 'en') {
      setFormContentEn(newText);
    } else {
      setFormContentId(newText);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0f131c] text-[#dfe2ef] p-6 lg:p-8 font-sans">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-48 bg-[#4d8eff]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header & Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8c909f] font-semibold">
            <span>CMS Studio</span>
            <span>/</span>
            <span className="text-[#adc6ff]">Blog & Articles</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#F9FAFB] tracking-tight mt-1">
            Articles & Thought Leadership
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Publish markdown articles with live bilingual rendering and automated SEO tags.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#4d8eff] text-[#00285d] text-sm font-bold hover:bg-[#adc6ff] transition-all shadow-md shadow-[#4d8eff]/20 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#1c1f29] p-5 rounded-xl border border-[#1F293D] shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8c909f] uppercase tracking-wider font-semibold">Total Articles</span>
            <p className="text-3xl font-black text-[#F9FAFB] mt-1">{posts.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#4d8eff]/10 text-[#adc6ff] flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1c1f29] p-5 rounded-xl border border-[#1F293D] shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8c909f] uppercase tracking-wider font-semibold">Published</span>
            <p className="text-3xl font-black text-[#4edea3] mt-1">
              {posts.filter((p) => p.status === 'published').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#00a572]/20 text-[#4edea3] flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1c1f29] p-5 rounded-xl border border-[#1F293D] shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8c909f] uppercase tracking-wider font-semibold">Drafts</span>
            <p className="text-3xl font-black text-[#ffb786] mt-1">
              {posts.filter((p) => p.status === 'draft').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#df7412]/20 text-[#ffb786] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1c1f29] p-5 rounded-xl border border-[#1F293D] shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8c909f] uppercase tracking-wider font-semibold">Total Tags</span>
            <p className="text-3xl font-black text-[#adc6ff] mt-1">{allTags.length}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#adc6ff]/10 text-[#adc6ff] flex items-center justify-center">
            <Tag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {}
      <div className="bg-[#1c1f29] rounded-xl border border-[#1F293D] p-5 mb-8 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1F293D]">
          <div className="flex items-center bg-[#0a0e17] px-3 py-2 rounded-lg border border-[#1F293D] w-full lg:w-80">
            <Search className="w-4 h-4 text-[#8c909f]" />
            <input
              type="text"
              placeholder="Search title, slug, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-[#F9FAFB] px-2 focus:outline-none placeholder:text-[#8c909f] w-full"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-[#0a0e17] text-xs text-[#dfe2ef] px-3 py-2 rounded-lg border border-[#1F293D] focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>

            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="bg-[#0a0e17] text-xs text-[#dfe2ef] px-3 py-2 rounded-lg border border-[#1F293D] focus:outline-none cursor-pointer"
            >
              <option value="all">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        {}
        <div className="overflow-x-auto w-full mt-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#181b25] text-[#8c909f] text-xs uppercase tracking-wider border-b border-[#1F293D]">
                <th className="py-3 px-4 rounded-l-lg">Cover</th>
                <th className="py-3 px-4">Title & Slug</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-4">Read Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F293D]">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#262a34] transition-colors group">
                    <td className="py-3 px-4">
                      {post.cover_image_url ? (
                        <img
                          src={post.cover_image_url}
                          alt={post.title_en}
                          className="w-14 h-9 object-cover rounded border border-[#1F293D]"
                        />
                      ) : (
                        <div className="w-14 h-9 rounded bg-[#0a0e17] border border-[#1F293D] flex items-center justify-center text-xs text-[#8c909f]">
                          No Img
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col max-w-md">
                        <span className="text-sm font-semibold text-[#F9FAFB] line-clamp-1">
                          {post.title_en}
                        </span>
                        <span className="text-xs font-mono text-[#8c909f] line-clamp-1">{post.slug}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-[#0a0e17] text-[#adc6ff] text-[11px] font-mono border border-[#1F293D]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-[#c2c6d6]">
                      {post.reading_time_min} min
                    </td>
                    <td className="py-3 px-4">
                      {post.status === 'published' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#4edea3]/10 text-[#4edea3] text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#df7412]/20 text-[#ffb786] text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#df7412]" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(post)}
                          className="p-1.5 rounded hover:bg-[#31353f] text-[#c2c6d6] hover:text-[#adc6ff] transition-colors"
                          title="Edit Article"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded hover:bg-[#31353f] text-[#c2c6d6] hover:text-[#4edea3] transition-colors"
                          title="Preview Public Page"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => setDeleteTargetId(post.id)}
                          className="p-1.5 rounded hover:bg-[#93000a] text-[#c2c6d6] hover:text-[#ffb4ab] transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-sm text-[#8c909f]">
                    No articles found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1c1f29] border border-[#1F293D] rounded-xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F293D] bg-[#181b25]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#adc6ff]" />
                <h2 className="text-lg font-bold text-[#F9FAFB]">
                  {editingPost ? 'Edit Article Studio' : 'Create New Technical Article'}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#0a0e17] p-1 rounded-lg border border-[#1F293D]">
                  <button
                    type="button"
                    onClick={() => setActiveLang('en')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                      activeLang === 'en'
                        ? 'bg-[#4d8eff] text-[#00285d]'
                        : 'text-[#8c909f] hover:text-[#dfe2ef]'
                    }`}
                  >
                    EN (Original)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLang('id')}
                    className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                      activeLang === 'id'
                        ? 'bg-[#4d8eff] text-[#00285d]'
                        : 'text-[#8c909f] hover:text-[#dfe2ef]'
                    }`}
                  >
                    ID (Translated)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAutoTranslate}
                  disabled={isTranslating}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#df7412] text-[#461f00] text-xs font-bold hover:bg-[#ffb786] transition-all"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isTranslating ? 'animate-spin' : ''}`} />
                  <span>{isTranslating ? 'Translating...' : 'Auto-Translate'}</span>
                </button>

                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1 rounded text-[#8c909f] hover:text-[#F9FAFB] hover:bg-[#31353f]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSavePost} className="p-6 overflow-y-auto space-y-5">
              {/* Top Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 flex flex-col">
                  <label className="text-xs text-[#8c909f] font-semibold mb-1">
                    Article Title ({activeLang.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    required
                    value={activeLang === 'en' ? formTitleEn : formTitleId}
                    onChange={(e) =>
                      activeLang === 'en'
                        ? setFormTitleEn(e.target.value)
                        : setFormTitleId(e.target.value)
                    }
                    placeholder="e.g. Architecting Scalable Micro-frontends"
                    className="bg-[#0a0e17] text-[#F9FAFB] text-sm px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none focus:border-[#4d8eff]"
                  />
                </div>

                <div className="md:col-span-4 flex flex-col">
                  <label className="text-xs text-[#8c909f] font-semibold mb-1">Slug URL *</label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="architecting-scalable-micro-frontends"
                    className="bg-[#0a0e17] text-[#8c909f] text-xs font-mono px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-6 flex flex-col">
                  <label className="text-xs text-[#8c909f] font-semibold mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={formCoverUrl}
                    onChange={(e) => setFormCoverUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="bg-[#0a0e17] text-[#F9FAFB] text-xs px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-3 flex flex-col">
                  <label className="text-xs text-[#8c909f] font-semibold mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Next.js, TypeScript"
                    className="bg-[#0a0e17] text-[#F9FAFB] text-xs px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-3 flex flex-col">
                  <label className="text-xs text-[#8c909f] font-semibold mb-1">Reading Time (Min)</label>
                  <input
                    type="number"
                    min={1}
                    value={formReadingTime}
                    onChange={(e) => setFormReadingTime(Number(e.target.value))}
                    className="bg-[#0a0e17] text-[#F9FAFB] text-xs px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none"
                  />
                </div>

                <div className="md:col-span-12 flex flex-col">
                  <label className="text-xs text-[#8c909f] font-semibold mb-1">
                    Excerpt / Short Summary ({activeLang.toUpperCase()})
                  </label>
                  <textarea
                    rows={2}
                    value={activeLang === 'en' ? formExcerptEn : formExcerptId}
                    onChange={(e) =>
                      activeLang === 'en'
                        ? setFormExcerptEn(e.target.value)
                        : setFormExcerptId(e.target.value)
                    }
                    placeholder="Brief summary for list cards..."
                    className="bg-[#0a0e17] text-[#F9FAFB] text-xs px-3.5 py-2 rounded-lg border border-[#1F293D] focus:outline-none resize-none"
                  />
                </div>
              </div>

              {}
              <div className="border border-[#1F293D] rounded-lg overflow-hidden">
                <div className="flex items-center justify-between bg-[#0a0e17] px-4 py-2 border-b border-[#1F293D]">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax('**', '**')}
                      className="p-1.5 rounded text-[#8c909f] hover:text-[#dfe2ef] hover:bg-[#1c1f29]"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax('*', '*')}
                      className="p-1.5 rounded text-[#8c909f] hover:text-[#dfe2ef] hover:bg-[#1c1f29]"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax('## ')}
                      className="p-1.5 rounded text-[#8c909f] hover:text-[#dfe2ef] hover:bg-[#1c1f29]"
                      title="Heading 2"
                    >
                      <Heading className="w-4 h-4" />
                    </button>
                    <span className="text-[#424754] mx-1">|</span>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax('`', '`')}
                      className="p-1.5 rounded text-[#8c909f] hover:text-[#dfe2ef] hover:bg-[#1c1f29]"
                      title="Inline Code"
                    >
                      <Code className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax('> ')}
                      className="p-1.5 rounded text-[#8c909f] hover:text-[#dfe2ef] hover:bg-[#1c1f29]"
                      title="Quote Block"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax('1. ')}
                      className="p-1.5 rounded text-[#8c909f] hover:text-[#dfe2ef] hover:bg-[#1c1f29]"
                      title="Numbered List"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-xs text-[#8c909f] font-mono">
                    Markdown Studio ({activeLang.toUpperCase()})
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[300px]">
                  {/* Left: Raw Markdown Textarea */}
                  <div className="bg-[#0a0e17] p-3 border-b lg:border-b-0 lg:border-r border-[#1F293D]">
                    <textarea
                      id="markdownTextarea"
                      value={activeLang === 'en' ? formContentEn : formContentId}
                      onChange={(e) =>
                        activeLang === 'en'
                          ? setFormContentEn(e.target.value)
                          : setFormContentId(e.target.value)
                      }
                      rows={14}
                      className="w-full h-full bg-transparent text-[#F9FAFB] font-mono text-xs resize-none focus:outline-none leading-relaxed"
                      spellCheck={false}
                    />
                  </div>

                  {/* Right: Live Preview Output */}
                  <div className="bg-[#181b25] p-4 overflow-y-auto max-h-[360px]">
                    <div className="prose prose-invert prose-xs max-w-none space-y-2 text-[#dfe2ef]">
                      <h2 className="text-lg font-bold text-[#F9FAFB] border-b border-[#1F293D] pb-1">
                        {activeLang === 'en' ? formTitleEn || 'Untitled' : formTitleId || formTitleEn}
                      </h2>
                      <p className="text-xs text-[#9CA3AF] italic">
                        {activeLang === 'en' ? formExcerptEn : formExcerptId}
                      </p>
                      <pre className="p-3 bg-[#0a0e17] rounded border border-[#1F293D] text-[11px] font-mono text-[#adc6ff] whitespace-pre-wrap">
                        {activeLang === 'en' ? formContentEn : formContentId}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="flex items-center justify-between pt-4 border-t border-[#1F293D]">
                <div className="flex items-center gap-3">
                  <label className="text-xs text-[#8c909f] font-semibold">Publication Status:</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="bg-[#0a0e17] text-xs text-[#dfe2ef] px-3 py-1.5 rounded-lg border border-[#1F293D] focus:outline-none cursor-pointer"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 rounded-lg bg-[#0a0e17] text-[#c2c6d6] text-xs font-semibold hover:bg-[#31353f] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#4d8eff] text-[#00285d] text-xs font-bold hover:bg-[#adc6ff] transition-all shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Article</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1f29] border border-[#1F293D] rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 text-[#ffb4ab] mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-[#F9FAFB]">Confirm Article Deletion</h3>
            </div>
            <p className="text-xs text-[#9CA3AF] mb-6 leading-relaxed">
              Are you sure you want to permanently purge this article from your CMS database? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-lg bg-[#0a0e17] text-[#c2c6d6] text-xs font-semibold hover:bg-[#31353f] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-[#93000a] text-[#ffdad6] text-xs font-bold hover:bg-[#ffb4ab] hover:text-[#690005] transition-all"
              >
                Purge Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}