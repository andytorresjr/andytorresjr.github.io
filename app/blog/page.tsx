'use client'
// Blog — ported from prod (main branch blog/index.html) into the redesign UI.
// Same data model & routing (?slug=) backed by Supabase blog_posts.
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TextAnimation from '@/components/ui/scroll-text'
import { ArrowLeft } from 'lucide-react'
import {
  supabase,
  type BlogPost,
  CATEGORIES,
  CATEGORY_STYLES,
  fmtDate,
} from '@/lib/supabase'

function CategoryChip({ category }: { category: string }) {
  return (
    <span
      className={`inline-block w-fit font-mono text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
        CATEGORY_STYLES[category] ?? 'bg-surface text-text-muted border-border'
      }`}
    >
      {CATEGORIES[category] ?? category}
    </span>
  )
}

// ── Single post view ─────────────────────────────────────────────────────────
function PostView({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [state, setState] = useState<'loading' | 'error' | 'missing' | 'ready'>('loading')
  const [bodyHtml, setBodyHtml] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle()
      if (cancelled) return
      if (error) return setState('error')
      if (!data) return setState('missing')
      document.title = `${data.title} — Andres Torres Jr.`
      setBodyHtml(DOMPurify.sanitize(marked.parse(data.body_md || '') as string))
      setPost(data)
      setState('ready')
      window.scrollTo(0, 0)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [slug])

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-12">
      <a
        href="/blog/"
        className="inline-flex items-center gap-1.5 font-space-grotesk text-sm font-semibold text-accent hover:text-accent-2 transition-colors mb-8"
      >
        <ArrowLeft size={14} /> All posts
      </a>

      {state === 'loading' && (
        <p className="font-mono text-sm text-text-muted py-8">Loading…</p>
      )}
      {state === 'error' && (
        <p className="font-mono text-sm text-text-muted py-8">
          Couldn&apos;t load this post.
        </p>
      )}
      {state === 'missing' && (
        <p className="font-mono text-sm text-text-muted py-8">Post not found.</p>
      )}

      {state === 'ready' && post && (
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-4 mb-4">
            <CategoryChip category={post.category} />
            <time className="font-mono text-xs text-text-muted/60">
              {fmtDate(post.published_at || post.created_at)}
            </time>
          </div>
          <h1 className="font-syne font-black text-3xl md:text-5xl text-text-primary leading-[1.1] tracking-tight mb-8">
            {post.title}
          </h1>
          {post.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_image_url}
              alt=""
              className="w-full rounded-lg mb-10 border border-border/60"
            />
          )}
          <div
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </motion.article>
      )}
    </div>
  )
}

// ── Subscribe box ────────────────────────────────────────────────────────────
function SubscribeBox() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err' | 'info'; text: string } | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg({ kind: 'info', text: 'Subscribing…' })
    const { data, error } = await supabase.functions.invoke('subscribe', {
      body: { email: email.trim(), source: 'blog' },
    })
    if (error || !data?.ok) {
      setMsg({ kind: 'err', text: 'Something went wrong. Try again later.' })
      return
    }
    setMsg({
      kind: 'ok',
      text:
        data.status === 'already_confirmed'
          ? "You're already on the list — thank you!"
          : "Almost there — check your inbox to confirm your subscription. (Don't forget to check your spam if you can't find it)",
    })
    setEmail('')
  }

  return (
    <div className="mt-20 rounded-xl border border-border/60 p-8 md:p-10 text-center bg-gradient-to-br from-accent/10 to-accent-2/5">
      <h3 className="font-syne font-black text-2xl text-text-primary mb-2">
        Get new posts in your inbox
      </h3>
      <p className="font-inter text-sm text-text-muted mb-6">
        Subscribe for occasional newsletters &amp; updates. No spam, unsubscribe anytime.
      </p>
      <form
        onSubmit={onSubmit}
        className="flex flex-wrap justify-center gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-label="Email address"
          className="flex-1 min-w-[220px] px-4 py-3 rounded-lg bg-surface border border-border/60 font-inter text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="font-space-grotesk font-semibold text-sm bg-accent hover:bg-accent/85 text-white px-6 py-3 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Subscribe
        </button>
      </form>
      {msg && (
        <p
          role="status"
          className={`mt-4 font-inter text-sm ${
            msg.kind === 'ok'
              ? 'text-emerald-400'
              : msg.kind === 'err'
                ? 'text-red-400'
                : 'text-text-muted'
          }`}
        >
          {msg.text}
        </p>
      )}
    </div>
  )
}

// ── Confirm / unsubscribe status banner (?sub= from email redirects) ─────────
const SUB_MSGS: Record<string, { tone: 'ok' | 'info' | 'err'; text: string }> = {
  confirmed: {
    tone: 'ok',
    text: "You're confirmed! ✓ You'll get new posts in your inbox. Thanks for subscribing.",
  },
  unsubscribed: {
    tone: 'info',
    text: "You've been unsubscribed. Sorry to see you go — you can resubscribe anytime below.",
  },
  invalid: {
    tone: 'err',
    text: 'That link is invalid or was already used. Try subscribing again below.',
  },
  error: {
    tone: 'err',
    text: 'Something went wrong — please try the link again in a moment.',
  },
}

const BANNER_TONES: Record<string, string> = {
  ok: 'border-l-emerald-400',
  info: 'border-l-accent',
  err: 'border-l-red-400',
}

function SubStatusBanner({ sub }: { sub: string }) {
  const [dismissed, setDismissed] = useState(false)
  const status = SUB_MSGS[sub]

  useEffect(() => {
    // Drop the param so a refresh doesn't show the banner again.
    if (!status) return
    const params = new URLSearchParams(window.location.search)
    params.delete('sub')
    const qs = params.toString()
    window.history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''))
  }, [status])

  if (!status || dismissed) return null
  return (
    <div
      role="status"
      className={`flex items-center gap-3 mb-10 px-5 py-4 rounded-lg bg-surface border border-border/60 border-l-4 ${BANNER_TONES[status.tone]}`}
    >
      <span className="flex-1 font-inter text-sm text-text-primary leading-relaxed">
        {status.text}
      </span>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setDismissed(true)}
        className="text-text-muted/60 hover:text-text-primary text-xl leading-none px-1 transition-colors"
      >
        ×
      </button>
    </div>
  )
}

// ── List view ────────────────────────────────────────────────────────────────
function ListView() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null)
  const [errored, setErrored] = useState(false)
  const [cat, setCat] = useState('all')

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id,slug,title,category,excerpt,cover_image_url,published_at,created_at')
        .eq('published', true)
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
      if (cancelled) return
      if (error) return setErrored(true)
      setPosts((data ?? []) as BlogPost[])
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const visible = useMemo(
    () => (posts ?? []).filter((p) => cat === 'all' || p.category === cat),
    [posts, cat]
  )

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      {/* Header */}
      <span className="font-mono text-[10px] text-accent uppercase tracking-[0.3em] block mb-4">
        Writing
      </span>
      <TextAnimation
        as="h1"
        text="Blog"
        direction="up"
        className="font-syne font-black text-4xl md:text-6xl text-text-primary mb-4"
      />
      <p className="font-inter text-base text-text-muted max-w-xl mb-10">
        Newsletters, build updates, and things I&apos;m learning in embedded
        systems &amp; software.
      </p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2.5 mb-12" role="tablist" aria-label="Filter posts by category">
        {['all', ...Object.keys(CATEGORIES)].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`font-mono text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-200 ${
              cat === c
                ? 'bg-accent text-white border-accent'
                : 'bg-transparent text-text-muted border-border hover:border-accent/50 hover:text-text-primary'
            }`}
          >
            {c === 'all' ? 'All' : CATEGORIES[c]}
          </button>
        ))}
      </div>

      {/* Posts */}
      {errored ? (
        <p className="font-mono text-sm text-text-muted py-8">
          Couldn&apos;t load posts right now.
        </p>
      ) : posts === null ? (
        <p className="font-mono text-sm text-text-muted py-8">Loading posts…</p>
      ) : visible.length === 0 ? (
        <p className="font-mono text-sm text-text-muted py-8">
          No posts here yet — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((p, i) => (
            <motion.a
              key={p.id}
              href={`/blog/?slug=${encodeURIComponent(p.slug)}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: 'easeOut' }}
              whileHover={{ y: -3 }}
              className="group flex flex-col rounded-xl overflow-hidden bg-surface border border-border/60 hover:border-accent/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {p.cover_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.cover_image_url}
                  alt=""
                  loading="lazy"
                  className="h-44 w-full object-cover"
                />
              )}
              <div className="flex flex-col gap-3 p-6 flex-1">
                <CategoryChip category={p.category} />
                <h2 className="font-space-grotesk font-bold text-lg text-text-primary leading-snug group-hover:text-accent transition-colors">
                  {p.title}
                </h2>
                {p.excerpt && (
                  <p className="font-inter text-sm text-text-muted leading-relaxed flex-1">
                    {p.excerpt}
                  </p>
                )}
                <time className="font-mono text-[11px] text-text-muted/60 mt-auto pt-2">
                  {fmtDate(p.published_at || p.created_at)}
                </time>
              </div>
            </motion.a>
          ))}
        </div>
      )}

      <SubscribeBox />
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
function BlogContent() {
  const params = useSearchParams()
  const slug = params.get('slug')
  const sub = params.get('sub')
  if (slug) return <PostView slug={slug} />
  return (
    <>
      {sub && (
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SubStatusBanner sub={sub} />
        </div>
      )}
      <ListView />
    </>
  )
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-dvh bg-bg pt-32 pb-24">
        <Suspense
          fallback={
            <p className="max-w-7xl mx-auto px-6 md:px-12 font-mono text-sm text-text-muted">
              Loading…
            </p>
          }
        >
          <BlogContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
