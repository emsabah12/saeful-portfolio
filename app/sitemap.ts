import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initializing lightweight Supabase Client for build-time/ISR indexing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saeful.dev';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: projects } = await supabase
        .from('projects')
        .select('slug, updated_at')
        .eq('status', 'published');

      if (projects) {
        projectRoutes = projects.map((p) => ({
          url: `${baseUrl}/projects/${p.slug}`,
          lastModified: new Date(p.updated_at || Date.now()),
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        }));
      }
    }
  } catch (error) {
    console.error('Sitemap project indexing error:', error);
  }

  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: posts } = await supabase
        .from('posts')
        .select('slug, updated_at')
        .eq('status', 'published');

      if (posts) {
        postRoutes = posts.map((p) => ({
          url: `${baseUrl}/blog/${p.slug}`,
          lastModified: new Date(p.updated_at || Date.now()),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));
      }
    }
  } catch (error) {
    console.error('Sitemap post indexing error:', error);
  }

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}