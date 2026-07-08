import { createClient } from '@supabase/supabase-js'

// Publishable (anon) key — safe to ship; all write access is enforced
// server-side by Postgres RLS. Same project as prod (main branch).
const SB_URL = 'https://splknhwqpdudqmnzfdpx.supabase.co'
const SB_KEY = 'sb_publishable_K9O8BGdztxhpELznMGRceg_i_OeRjE0'

export const supabase = createClient(SB_URL, SB_KEY)

export interface BlogPost {
  id: string
  slug: string
  title: string
  category: 'newsletter' | 'update' | 'educational'
  excerpt: string | null
  cover_image_url: string | null
  body_md: string | null
  published: boolean
  published_at: string | null
  newsletter_sent_at: string | null
  newsletter_scheduled_at: string | null
  created_at: string
  updated_at: string
}

export const CATEGORIES: Record<string, string> = {
  newsletter: 'Newsletter',
  update: 'Update',
  educational: 'Educational',
}

export const CATEGORY_STYLES: Record<string, string> = {
  newsletter: 'bg-accent/15 text-indigo-300 border-accent/30',
  update: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  educational: 'bg-accent-2/15 text-cyan-300 border-accent-2/30',
}

export const fmtDate = (d: string | null | undefined) =>
  d
    ? new Date(d).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''
