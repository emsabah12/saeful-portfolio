'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FolderGit2,
  FileText,
  Mail,
  TrendingUp,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  RefreshCw,
  Rocket,
  Sparkles,
  Save,
  Upload,
  Bold,
  Italic,
  Heading,
  Code,
  Quote,
  ListOrdered,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  Activity,
  Zap,
  Globe,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { AnalyticsSummaryResponse } from '@/app/api/admin/analytics/route';

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  image: string;
  techStack: string[];
  status: 'published' | 'draft';
  updatedAt: string;
  category: 'ai' | 'cloud' | 'web';
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: '1',
    title: 'DevFlow Edge Architecture',
    slug: 'devflow.internal.network',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop',
    techStack: ['Next.js 15', 'Go Edge', 'Tailwind'],
    status: 'published',
    updatedAt: '2026-02-18 14:32',
    category: 'cloud',
  },
  {
    id: '2',
    title: 'Semantic Vector Router',
    slug: 'vector-hub.orchestrator.io',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=300&auto=format&fit=crop',
    techStack: ['Python', 'Qdrant', 'FastAPI'],
    status: 'published',
    updatedAt: '2026-02-14 09:12',
    category: 'ai',
  },
  {
    id: '3',
    title: 'Realtime Mesh Telemetry',
    slug: 'mesh.staging.devcraft.app',
    image:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=300&auto=format&fit=crop',
    techStack: ['Rust', 'WebSockets', 'SvelteKit'],
    status: 'draft',
    updatedAt: '2026-02-11 22:45',
    category: 'web',
  },
];

export default function AdminDashboardPage() {
  // Realtime Analytics State
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummaryResponse['metrics'] | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState<boolean>(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // UI & Table States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(INITIAL_PROJECTS);

  // Markdown Studio States
  const [activeLang, setActiveLang] = useState<'en' | 'id'>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [postTitle, setPostTitle] = useState('Architecting Scalable Micro-frontends on Edge Runtime');
  const [postSlug, setPostSlug] = useState('scalable-micro-frontends-edge-runtime');
  const [postCategory, setPostCategory] = useState('Edge Computing');

  const [markdownEn, setMarkdownEn] = useState(
    '# Architecting Scalable Micro-frontends on Edge Runtime\n\nHigh-throughput digital experiences demand isolation of blast radiuses. When orchestrating decoupled UI components, running compute at the CDN edge reduces global latency drastically.\n\n## Core Architectural Guarantees\n\n1. **Sub-15ms Time to First Byte** via automated georouting.\n2. **Independent Deployments** decoupled from the monolith host.\n3. **Resilient SSR Hydration** using streaming React server components.'
  );

  const [markdownId, setMarkdownId] = useState(
    '# Merancang Mikro-frontend Skalabel pada Edge Runtime\n\nPengalaman digital berkinerja tinggi membutuhkan isolasi radius dampak. Saat mengalirkan komponen UI terpisah, menjalankan komputasi di CDN edge mengurangi latensi global secara drastis.\n\n## Jaminan Arsitektur Utama\n\n1. **Waktu ke Byte Pertama Sub-15ms** melalui georouting otomatis.\n2. **Penyebaran Independen** terpisah dari host monolit.\n3. **Hidrasi SSR Tangguh** menggunakan streaming komponen server React.'
  );

  // Fetch Analytics from API Route
  const fetchAnalytics = useCallback(async () => {
    try {
      setIsSyncing(true);
      setAnalyticsError(null);
      const res = await fetch('/api/admin/analytics');
      const json: AnalyticsSummaryResponse = await res.json();

      if (json.success && json.metrics) {
        setAnalyticsData(json.metrics);
      } else {
        setAnalyticsError('Gagal memuat telemetri analitik.');
      }
    } catch (err) {
      console.error('Failed to fetch analytics telemetry:', err);
      setAnalyticsError('Kesalahan jaringan saat mengambil data analitik.');
    } finally {
      setIsLoadingAnalytics(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const filteredProjects = projectsList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAutoTranslate = async () => {
    setIsTranslating(true);
    try {
      setTimeout(() => {
        setMarkdownId(
          '# Merancang Mikro-frontend Skalabel pada Edge Runtime\n\nPengalaman digital berkinerja tinggi membutuhkan isolasi radius dampak. Saat mengalirkan komponen UI terpisah, menjalankan komputasi di CDN edge mengurangi latensi global secara drastis.\n\n## Jaminan Arsitektur Utama\n\n1. **Waktu ke Byte Pertama Sub-15ms** melalui georouting otomatis.\n2. **Penyebaran Independen** terpisah dari host monolit.\n3. **Hidrasi SSR Tangguh** menggunakan streaming komponen server React.'
        );
        setActiveLang('id');
        setIsTranslating(false);
      }, 800);
    } catch (err) {
      console.error('Translation error:', err);
      setIsTranslating(false);
    }
  };

  const insertMarkdownSyntax = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('markdownSource') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = activeLang === 'en' ? markdownEn : markdownId;
    const selectedText = currentText.substring(start, end) || 'teks';
    const newText =
      currentText.substring(0, start) +
      `${prefix}${selectedText}${suffix}` +
      currentText.substring(end);

    if (activeLang === 'en') {
      setMarkdownEn(newText);
    } else {
      setMarkdownId(newText);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0f131c] text-[#dfe2ef] p-6 lg:p-8 font-sans">
      {/* Ambient Lighting Background */}
      <div className="absolute top-0 left-1/4 w-96 h-48 bg-[#4d8eff]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[#8c909f] text-xs uppercase tracking-wider font-medium">
            <span>CMS Studio</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#adc6ff] font-semibold">FASE 2 Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#dfe2ef]">Mission Control</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#F9FAFB] tracking-tight mt-1">
            DevCraft Engine Core
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAnalytics}
            disabled={isSyncing}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1c1f29] hover:bg-[#353943] text-[#dfe2ef] text-sm font-medium transition-all shadow-sm border border-[#1F293D] disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#adc6ff] ${
                isSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'
              }`}
            />
            <span>{isSyncing ? 'Syncing...' : 'Sync Supabase'}</span>
          </button>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4d8eff] text-[#00285d] text-sm font-bold hover:bg-[#adc6ff] transition-all shadow-md shadow-[#4d8eff]/20"
          >
            <Rocket className="w-4 h-4" />
            <span>Deploy Site</span>
          </a>
        </div>
      </div>

      {/* Analytics Error Notification */}
      {analyticsError && (
        <div className="mb-6 p-4 rounded-xl bg-[#93000a]/20 border border-[#93000a]/40 text-[#ffb4ab] text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{analyticsError}</span>
        </div>
      )}

      {/* 1. Telemetry Metrics Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Metric 1: Projects */}
        <div className="bg-[#1c1f29] p-5 rounded-xl border border-[#1F293D] shadow-md hover:bg-[#262a34] transition-colors flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[#8c909f] uppercase tracking-wider font-semibold">
                Total Projects
              </span>
              <p className="text-3xl font-black text-[#F9FAFB] mt-1">
                {isLoadingAnalytics ? (
                  <Loader2 className="w-6 h-6 animate-spin text-[#adc6ff]" />
                ) : (
                  analyticsData?.projects.total ?? projectsList.length
                )}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#4d8eff]/10 flex items-center justify-center text-[#adc6ff]">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#1F293D]/50">
            <div className="flex items-center gap-1 text-[#4edea3] text-xs font-semibold">
              <ArrowUpRight className="w-4 h-4" />
              <span>
                {analyticsData
                  ? `${analyticsData.projects.published} Published`
                  : 'Active catalog'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#8c909f]">
              {analyticsData ? `${analyticsData.projects.drafts} drafts` : ''}
            </span>
          </div>
        </div>

        {/* Metric 2: Blog Posts */}
        <div className="bg-[#1c1f29] p-5 rounded-xl border border-[#1F293D] shadow-md hover:bg-[#262a34] transition-colors flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[#8c909f] uppercase tracking-wider font-semibold">
                Blog Entries
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-[#F9FAFB]">
                  {isLoadingAnalytics ? (
                    <Loader2 className="w-6 h-6 animate-spin text-[#ffb786]" />
                  ) : (
                    analyticsData?.posts.total ?? 18
                  )}
                </span>
                <span className="text-xs text-[#8c909f]">
                  / {analyticsData?.posts.drafts ?? 4} drafts
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#df7412]/20 flex items-center justify-center text-[#ffb786]">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#1F293D]/50">
            <span className="text-xs text-[#c2c6d6]">
              {analyticsData?.posts.totalReadingTimeMin ?? 45} min total read time
            </span>
            <div className="w-16 h-2 bg-[#0a0e17] rounded-full overflow-hidden">
              <div className="h-full bg-[#df7412] w-[80%] rounded-full" />
            </div>
          </div>
        </div>

        {/* Metric 3: Inquiries */}
        <div className="bg-[#1c1f29] p-5 rounded-xl border border-[#1F293D] shadow-md hover:bg-[#262a34] transition-colors flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[#8c909f] uppercase tracking-wider font-semibold">
                Inquiries
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-3xl font-black text-[#F9FAFB]">
                  {isLoadingAnalytics ? (
                    <Loader2 className="w-6 h-6 animate-spin text-[#ffb4ab]" />
                  ) : (
                    analyticsData?.messages.total ?? 5
                  )}
                </span>
                {(analyticsData?.messages.unread ?? 0) > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping" />
                )}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#93000a]/40 flex items-center justify-center text-[#ffb4ab]">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#1F293D]/50">
            <span className="text-xs text-[#ffb4ab] font-medium">
              {analyticsData?.messages.unread ?? 0} Unread Messages
            </span>
            <span className="text-xs font-mono text-[#8c909f]">
              {analyticsData?.messages.read ?? 0} processed
            </span>
          </div>
        </div>

        {/* Metric 4: Web Vitals & Traffic */}
        <div className="bg-[#1c1f29] p-5 rounded-xl border border-[#1F293D] shadow-md hover:bg-[#262a34] transition-colors flex flex-col justify-between group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[#8c909f] uppercase tracking-wider font-semibold">
                Lighthouse Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-[#4edea3]">
                  {isLoadingAnalytics ? (
                    <Loader2 className="w-6 h-6 animate-spin text-[#4edea3]" />
                  ) : (
                    analyticsData?.webVitals.performanceScore ?? 98
                  )}
                </span>
                <span className="text-xs text-[#8c909f]">/ 100</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#00a572]/20 flex items-center justify-center text-[#4edea3]">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between pt-2 border-t border-[#1F293D]/50">
            <div className="flex items-center gap-1 text-[#4edea3] text-xs font-semibold">
              <Activity className="w-4 h-4" />
              <span>TTFB: {analyticsData?.webVitals.ttfbMs ?? 142}ms</span>
            </div>
            <span className="text-[11px] font-mono text-[#8c909f]">
              LCP: {analyticsData?.webVitals.lcpSec ?? 1.2}s
            </span>
          </div>
        </div>
      </section>

      {/* 2. Top Pages & Traffic Telemetry Preview */}
      {analyticsData && (
        <section className="bg-[#1c1f29] rounded-xl border border-[#1F293D] shadow-lg p-5 mb-8">
          <div className="flex items-center justify-between pb-4 border-b border-[#1F293D] mb-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#adc6ff]" />
              <h3 className="text-sm font-bold text-[#F9FAFB]">
                Realtime Traffic Insights & Top Performing Pages
              </h3>
            </div>
            <span className="text-xs font-mono text-[#8c909f]">
              Updated: {new Date(analyticsData.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Pages List */}
            <div className="space-y-2">
              <span className="text-xs text-[#8c909f] font-semibold uppercase tracking-wider block mb-2">
                Top Viewed Paths
              </span>
              {analyticsData.topPages.map((page, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#0a0e17] border border-[#1F293D] text-xs"
                >
                  <div className="flex flex-col max-w-[70%]">
                    <span className="font-semibold text-[#F9FAFB] truncate">{page.title}</span>
                    <span className="font-mono text-[#8c909f]">{page.path}</span>
                  </div>
                  <span className="font-mono text-[#adc6ff] font-bold">
                    {page.views.toLocaleString()} views
                  </span>
                </div>
              ))}
            </div>

            {/* 7-Day Trend Micro Bars */}
            <div>
              <span className="text-xs text-[#8c909f] font-semibold uppercase tracking-wider block mb-2">
                7-Day Pageview Volume
              </span>
              <div className="bg-[#0a0e17] p-4 rounded-lg border border-[#1F293D] flex items-end justify-between h-[180px]">
                {analyticsData.trafficTrends.map((trend, i) => {
                  const maxViews = 300;
                  const heightPct = Math.min(100, Math.round((trend.pageviews / maxViews) * 100));
                  return (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-full max-w-[28px] bg-[#1c1f29] rounded-t relative group flex items-end">
                        <div
                          style={{ height: `${heightPct}%` }}
                          className="w-full bg-[#4d8eff] rounded-t hover:bg-[#adc6ff] transition-all"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#8c909f]">
                        {trend.date.substring(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Featured Projects Table */}
      <section className="bg-[#1c1f29] rounded-xl border border-[#1F293D] shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#4d8eff]/10 text-[#adc6ff] flex items-center justify-center">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F9FAFB]">Featured Case Studies & Projects</h2>
              <p className="text-xs text-[#9CA3AF]">Sync, catalog and inspect live deployments across edge clusters.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-[#0a0e17] px-3 py-1.5 rounded-lg text-[#dfe2ef] border border-[#1F293D]">
              <Search className="w-4 h-4 text-[#8c909f]" />
              <input
                type="text"
                placeholder="Filter projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-[#F9FAFB] px-2 focus:outline-none placeholder:text-[#8c909f] w-36 lg:w-48"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#0a0e17] text-xs text-[#dfe2ef] px-3 py-2 rounded-lg border border-[#1F293D] focus:outline-none cursor-pointer"
            >
              <option value="all">All Disciplines</option>
              <option value="ai">AI / LLM Orchestration</option>
              <option value="cloud">Edge Infrastructure</option>
              <option value="web">Fullstack Platforms</option>
            </select>

            <a
              href="/admin/projects"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#adc6ff] text-[#002e6a] text-xs font-bold hover:bg-[#4d8eff] transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Manage Projects</span>
            </a>
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#181b25] text-[#8c909f] text-xs uppercase tracking-wider border-b border-[#1F293D]">
                <th className="py-3 px-4 rounded-l-lg">Preview</th>
                <th className="py-3 px-4">Project Title</th>
                <th className="py-3 px-4">Tech Stack</th>
                <th className="py-3 px-4">Deployment Status</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-4 text-right rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F293D]">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-[#262a34] transition-colors group">
                    <td className="py-3 px-4">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-14 h-9 object-cover rounded shadow border border-[#1F293D]"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#F9FAFB]">{project.title}</span>
                        <span className="text-xs font-mono text-[#8c909f]">{project.slug}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-[#0a0e17] text-[#9CA3AF] text-[11px] font-mono border border-[#1F293D]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {project.status === 'published' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#4edea3]/10 text-[#4edea3] text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#424754]/30 text-[#c2c6d6] text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8c909f]" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-[#8c909f]">{project.updatedAt}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <a
                          href="/admin/projects"
                          title="Edit Entry"
                          className="p-1.5 rounded hover:bg-[#31353f] text-[#c2c6d6] hover:text-[#adc6ff] transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </a>
                        <a
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Preview Public URL"
                          className="p-1.5 rounded hover:bg-[#31353f] text-[#c2c6d6] hover:text-[#4edea3] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          title="Purge Record"
                          onClick={() => setProjectsList(projectsList.filter((p) => p.id !== project.id))}
                          className="p-1.5 rounded hover:bg-[#93000a] text-[#c2c6d6] hover:text-[#ffb4ab] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-sm text-[#8c909f]">
                    Tidak ada proyek yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Split-Screen Markdown Blog Studio */}
      <section className="bg-[#1c1f29] rounded-xl border border-[#1F293D] shadow-lg p-6">
        <div className="flex flex-col gap-4 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#ffb786]/20 text-[#ffb786] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#F9FAFB]">Split-Screen Markdown Blog Studio</h2>
                <p className="text-xs text-[#9CA3AF]">
                  Author in technical markdown with synchronous live bilingual rendering.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center bg-[#0a0e17] p-1 rounded-lg border border-[#1F293D]">
                <button
                  onClick={() => setActiveLang('en')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                    activeLang === 'en'
                      ? 'bg-[#4d8eff] text-[#00285d] font-bold'
                      : 'text-[#8c909f] hover:text-[#dfe2ef]'
                  }`}
                >
                  EN (Original)
                </button>
                <button
                  onClick={() => setActiveLang('id')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                    activeLang === 'id'
                      ? 'bg-[#4d8eff] text-[#00285d] font-bold'
                      : 'text-[#8c909f] hover:text-[#dfe2ef]'
                  }`}
                >
                  ID (Translated)
                </button>
              </div>

              <button
                onClick={handleAutoTranslate}
                disabled={isTranslating}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#df7412] text-[#461f00] text-xs font-bold hover:bg-[#ffb786] transition-all shadow"
              >
                <Sparkles className={`w-4 h-4 ${isTranslating ? 'animate-spin' : ''}`} />
                <span>{isTranslating ? 'Translating...' : 'Auto-Translate to ID'}</span>
              </button>

              <a
                href="/admin/posts"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#4d8eff] text-[#00285d] text-xs font-bold hover:bg-[#adc6ff] transition-all shadow"
              >
                <Save className="w-4 h-4" />
                <span>Go to Blog Studio</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-[#181b25] p-3 rounded-lg border border-[#1F293D]">
            <div className="md:col-span-6 flex flex-col">
              <label className="text-xs text-[#8c909f] mb-1">Post Title ({activeLang.toUpperCase()})</label>
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="bg-[#0a0e17] text-[#F9FAFB] text-xs px-3 py-1.5 rounded border border-[#1F293D] focus:outline-none"
              />
            </div>
            <div className="md:col-span-3 flex flex-col">
              <label className="text-xs text-[#8c909f] mb-1">Slug URL</label>
              <input
                type="text"
                value={postSlug}
                onChange={(e) => setPostSlug(e.target.value)}
                className="bg-[#0a0e17] text-[#8c909f] text-xs font-mono px-3 py-1.5 rounded border border-[#1F293D] focus:outline-none"
              />
            </div>
            <div className="md:col-span-3 flex flex-col">
              <label className="text-xs text-[#8c909f] mb-1">Category</label>
              <select
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value)}
                className="bg-[#0a0e17] text-[#dfe2ef] text-xs px-3 py-1.5 rounded border border-[#1F293D] focus:outline-none cursor-pointer"
              >
                <option value="Edge Computing">Edge Computing</option>
                <option value="Full-Stack Engineering">Full-Stack Engineering</option>
                <option value="System Design">System Design</option>
                <option value="DevOps & CI/CD">DevOps & CI/CD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Toolbar Formatter */}
        <div className="flex items-center justify-between bg-[#0a0e17] px-4 py-2 rounded-t-lg border-x border-t border-[#1F293D]">
          <div className="flex items-center gap-1">
            <button
              onClick={() => insertMarkdownSyntax('**', '**')}
              className="p-1 rounded text-[#8c909f] hover:text-[#dfe2ef] hover:bg-[#1c1f29]"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertMarkdownSyntax('*', '*')}
              className="p-1 rounded text-[#8c909f] hover:text-[#dfe2ef] hover:bg-[#1c1f29]"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertMarkdownSyntax('## ')}
              className="p-1 rounded text-[#8c909f] hover:text-[#dfe2ef] hover:bg-[#1c1f29]"
              title="Heading"
            >
              <Heading className="w-4 h-4" />
            </button>
            <span className="text-[#424754] mx-1">|</span>
            <button
              onClick={() => insertMarkdownSyntax('`', '`')}
              className="p-1 rounded text-[#8c909f] hover:text-[#dfe2ef] hover:bg-[#1c1f29]"
              title="Inline Code"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertMarkdownSyntax('> ')}
              className="p-1 rounded text-[#8c909f] hover:text-[#dfe2ef] hover:bg-[#1c1f29]"
              title="Quote Block"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              onClick={() => insertMarkdownSyntax('1. ')}
              className="p-1 rounded text-[#8c909f] hover:text-[#dfe2ef] hover:bg-[#1c1f29]"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => alert('Supabase Storage Bucket Uploader Triggered')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1c1f29] hover:bg-[#353943] text-[#adc6ff] text-xs font-medium border border-[#1F293D]"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload to Supabase Storage</span>
          </button>
        </div>

        {/* Split Screen Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[380px] rounded-b-lg border border-[#1F293D] overflow-hidden">
          {/* Raw Monospace Input */}
          <div className="bg-[#0a0e17] p-4 border-b lg:border-b-0 lg:border-r border-[#1F293D]">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1F293D]/50 text-xs text-[#8c909f]">
              <span className="font-mono uppercase">Raw Markdown Editor ({activeLang.toUpperCase()})</span>
              <span>{activeLang === 'en' ? markdownEn.length : markdownId.length} chars</span>
            </div>
            <textarea
              id="markdownSource"
              value={activeLang === 'en' ? markdownEn : markdownId}
              onChange={(e) =>
                activeLang === 'en' ? setMarkdownEn(e.target.value) : setMarkdownId(e.target.value)
              }
              className="w-full h-72 bg-transparent text-[#F9FAFB] font-mono text-xs resize-none focus:outline-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Live Preview Render */}
          <div className="bg-[#181b25] p-4">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1F293D]/50 text-xs text-[#8c909f]">
              <span className="font-mono uppercase">Live Preview Output</span>
              <span className="text-[#4edea3] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Sync Active
              </span>
            </div>

            <div className="prose prose-invert prose-xs max-w-none text-[#dfe2ef] space-y-3">
              <h1 className="text-xl font-bold text-[#F9FAFB] tracking-tight">
                {activeLang === 'en'
                  ? 'Architecting Scalable Micro-frontends on Edge Runtime'
                  : 'Merancang Mikro-frontend Skalabel pada Edge Runtime'}
              </h1>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                {activeLang === 'en'
                  ? 'High-throughput digital experiences demand isolation of blast radiuses. When orchestrating decoupled UI components, running compute at the CDN edge reduces global latency drastically.'
                  : 'Pengalaman digital berkinerja tinggi membutuhkan isolasi radius dampak. Saat mengalirkan komponen UI terpisah, menjalankan komputasi di CDN edge mengurangi latensi global secara drastis.'}
              </p>

              <div className="p-3 bg-[#0a0e17] rounded-lg border border-[#1F293D] mt-3">
                <h2 className="text-sm font-semibold text-[#adc6ff] mb-2">
                  {activeLang === 'en' ? 'Core Architectural Guarantees' : 'Jaminan Arsitektur Utama'}
                </h2>
                <ol className="list-decimal list-inside space-y-1 text-xs text-[#c2c6d6]">
                  <li>
                    <strong>{activeLang === 'en' ? 'Sub-15ms Time to First Byte' : 'Waktu ke Byte Pertama Sub-15ms'}</strong>{' '}
                    {activeLang === 'en' ? 'via automated georouting.' : 'melalui georouting otomatis.'}
                  </li>
                  <li>
                    <strong>{activeLang === 'en' ? 'Independent Deployments' : 'Penyebaran Independen'}</strong>{' '}
                    {activeLang === 'en' ? 'decoupled from the monolith host.' : 'terpisah dari host monolit.'}
                  </li>
                  <li>
                    <strong>{activeLang === 'en' ? 'Resilient SSR Hydration' : 'Hidrasi SSR Tangguh'}</strong>{' '}
                    {activeLang === 'en' ? 'using streaming React server components.' : 'menggunakan streaming komponen server React.'}
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}