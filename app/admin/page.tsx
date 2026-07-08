'use client'
// Blog admin — ported from prod (main branch admin/index.html) into the
// redesign UI. Username/password login (no email); write access is enforced
// server-side by Postgres RLS keyed to the admin user id — the client-side
// UID check is only for UX, not security.
import { useCallback, useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import type { User } from '@supabase/supabase-js'
import { LogOut, Plus, ArrowLeft, Trash2, Send } from 'lucide-react'
import {
  supabase,
  type BlogPost,
  CATEGORIES,
  CATEGORY_STYLES,
} from '@/lib/supabase'

const ADMIN_DOMAIN = 'admin.local'
const ADMIN_UID = '0a9d5f1c-7b3e-4c2a-9e6d-1f2a3b4c5d6e'
const toEmail = (u: string) =>
  u.includes('@') ? u.toLowerCase() : `${u.toLowerCase()}@${ADMIN_DOMAIN}`
const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

const inputClass =
  'w-full px-3.5 py-2.5 rounded-lg bg-bg border border-border/60 font-inter text-sm text-text-primary placeholder:text-text-muted/40 focus:outline-none focus:border-accent'
const btnClass =
  'font-space-grotesk font-semibold text-sm px-4 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
const btnSmClass =
  'font-mono text-[11px] px-2.5 py-1.5 rounded border border-border/60 text-text-muted hover:text-text-primary hover:border-accent/50 transition-colors disabled:opacity-50'

// An ISO/UTC timestamp -> the "YYYY-MM-DDTHH:MM" string a datetime-local wants, in LOCAL time.
const toLocalInput = (iso: string) => {
  const d = new Date(iso)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

// ── Login ────────────────────────────────────────────────────────────────────
function Login({ onSignedIn, notice }: { onSignedIn: () => void; notice: string }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState(notice)

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    if (!username.trim()) return setMsg('Enter your username.')
    setMsg('Signing in…')
    const { error } = await supabase.auth.signInWithPassword({
      email: toEmail(username.trim()),
      password,
    })
    if (error) return setMsg('Wrong username or password.')
    onSignedIn()
  }

  return (
    <div className="max-w-sm mx-auto mt-24 p-8 rounded-xl bg-surface border border-border/60">
      <h1 className="font-syne font-black text-2xl text-text-primary mb-1">
        Blog Admin
      </h1>
      <p className="font-inter text-sm text-text-muted mb-6">Sign in to publish.</p>
      <form onSubmit={signIn} className="space-y-3">
        <input
          className={inputClass}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <input
          className={inputClass}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        <button type="submit" className={`${btnClass} w-full bg-accent hover:bg-accent/85 text-white`}>
          Sign in
        </button>
      </form>
      {msg && <p className="mt-3 font-inter text-sm text-text-muted">{msg}</p>}
    </div>
  )
}

// ── Editor ───────────────────────────────────────────────────────────────────
interface EditorProps {
  post: BlogPost | null
  onClose: () => void
}

function Editor({ post, onClose }: EditorProps) {
  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!post)
  const [category, setCategory] = useState(post?.category ?? 'newsletter')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [cover, setCover] = useState(post?.cover_image_url ?? '')
  const [body, setBody] = useState(post?.body_md ?? '')
  const [published, setPublished] = useState(post?.published ?? false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const preview = useMemo(
    () =>
      typeof window === 'undefined'
        ? ''
        : DOMPurify.sanitize(marked.parse(body || '*Nothing to preview yet.*') as string),
    [body]
  )

  async function save() {
    setMsg(null)
    const finalSlug = slug.trim() || slugify(title)
    if (!title.trim() || !finalSlug || !body) {
      return setMsg({ ok: false, text: 'Title, slug, and body are required.' })
    }
    const record: Partial<BlogPost> = {
      title: title.trim(),
      slug: finalSlug,
      category: category as BlogPost['category'],
      excerpt: excerpt.trim() || null,
      cover_image_url: cover.trim() || null,
      body_md: body,
      published,
      published_at: published ? new Date().toISOString() : null,
    }
    setMsg({ ok: true, text: 'Saving…' })
    const { error } = post
      ? await supabase.from('blog_posts').update(record).eq('id', post.id)
      : await supabase.from('blog_posts').insert(record)
    if (error) {
      return setMsg({
        ok: false,
        text: error.code === '23505' ? 'That slug is already used — change it.' : error.message,
      })
    }
    setMsg({ ok: true, text: 'Saved.' })
    setTimeout(onClose, 600)
  }

  async function remove() {
    if (!post || !confirm('Delete this post permanently?')) return
    const { error } = await supabase.from('blog_posts').delete().eq('id', post.id)
    if (error) return alert('Error: ' + error.message)
    onClose()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={onClose} className={`${btnSmClass} inline-flex items-center gap-1.5`}>
          <ArrowLeft size={12} /> Back
        </button>
        <h2 className="font-syne font-bold text-xl text-text-primary">
          {post ? 'Edit post' : 'New post'}
        </h2>
        {post ? (
          <button
            onClick={remove}
            className={`${btnSmClass} inline-flex items-center gap-1.5 hover:!text-red-400 hover:!border-red-400/50`}
          >
            <Trash2 size={12} /> Delete
          </button>
        ) : (
          <span />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-3">
          <input
            className={inputClass}
            placeholder="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (!slugTouched) setSlug(slugify(e.target.value))
            }}
          />
          <input
            className={`${inputClass} font-mono`}
            placeholder="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugTouched(true)
            }}
          />
          <select
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value as BlogPost['category'])}
          >
            {Object.entries(CATEGORIES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input
            className={inputClass}
            placeholder="Excerpt (short summary for cards)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="Cover image URL (optional)"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
          />
          <textarea
            className={`${inputClass} font-mono min-h-[380px] resize-y`}
            placeholder="Write in Markdown…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <label className="flex items-center gap-2 font-inter text-sm text-text-muted cursor-pointer select-none">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="accent-[#6366f1]"
            />
            Published
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={save}
              className={`${btnClass} bg-accent hover:bg-accent/85 text-white`}
            >
              Save
            </button>
            {msg && (
              <p className={`font-inter text-sm ${msg.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                {msg.text}
              </p>
            )}
          </div>
        </div>

        {/* Live preview */}
        <div className="rounded-xl bg-surface border border-border/60 p-6 overflow-y-auto max-h-[640px]">
          <p className="font-mono text-[10px] text-text-muted/50 uppercase tracking-widest mb-4">
            Preview
          </p>
          <div className="blog-prose" dangerouslySetInnerHTML={{ __html: preview }} />
        </div>
      </div>
    </div>
  )
}

// ── Post list ────────────────────────────────────────────────────────────────
function PostList({
  onEdit,
  onNew,
  onSignOut,
  who,
}: {
  onEdit: (p: BlogPost) => void
  onNew: () => void
  onSignOut: () => void
  who: string
}) {
  const [posts, setPosts] = useState<BlogPost[] | null>(null)
  const [error, setError] = useState('')
  const [sendingId, setSendingId] = useState<string | null>(null)
  // Schedule dialog state
  const [sched, setSched] = useState<{ id: string; existing: boolean } | null>(null)
  const [schedWhen, setSchedWhen] = useState('')
  const [schedMsg, setSchedMsg] = useState('')

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('updated_at', { ascending: false })
    if (error) return setError(error.message)
    setPosts(data ?? [])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function togglePublish(p: BlogPost) {
    const publish = !p.published
    const patch: Partial<BlogPost> = { published: publish }
    if (publish) patch.published_at = new Date().toISOString()
    const { error } = await supabase.from('blog_posts').update(patch).eq('id', p.id)
    if (error) alert('Error: ' + error.message)
    load()
  }

  async function sendNewsletter(p: BlogPost) {
    const already = !!p.newsletter_sent_at
    if (
      !confirm(
        already
          ? 'This post was already emailed. Send it to all confirmed subscribers AGAIN?'
          : 'Email this post to all confirmed subscribers now?'
      )
    )
      return
    setSendingId(p.id)
    const { data, error } = await supabase.functions.invoke('send-newsletter', {
      body: { postId: p.id, force: already },
    })
    setSendingId(null)
    if (error || !data?.ok) {
      alert('Send failed: ' + (data?.error || (error as Error)?.message || 'unknown error'))
      return
    }
    alert(`Sent to ${data.sent} of ${data.total} subscriber(s).`)
    load()
  }

  function onSchedule(p: BlogPost, existingIso: string) {
    setSchedMsg('')
    setSchedWhen(
      existingIso
        ? toLocalInput(existingIso)
        : toLocalInput(new Date(Date.now() + 3600000).toISOString())
    )
    setSched({ id: p.id, existing: !!existingIso })
  }

  async function saveSchedule() {
    if (!sched) return
    if (!schedWhen) return setSchedMsg('Pick a date and time.')
    const when = new Date(schedWhen)
    if (isNaN(when.getTime()) || when.getTime() < Date.now())
      return setSchedMsg('Pick a time in the future.')
    const { error } = await supabase
      .from('blog_posts')
      .update({ newsletter_scheduled_at: when.toISOString() })
      .eq('id', sched.id)
    if (error) return setSchedMsg('Error: ' + error.message)
    setSched(null)
    load()
  }

  async function cancelSchedule(p: BlogPost) {
    if (!confirm('Cancel the scheduled send for this post?')) return
    const { error } = await supabase
      .from('blog_posts')
      .update({ newsletter_scheduled_at: null })
      .eq('id', p.id)
    if (error) alert('Error: ' + error.message)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-black text-2xl text-text-primary">Blog Admin</h1>
          <p className="font-mono text-xs text-text-muted/60 mt-0.5">signed in as {who}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onNew}
            className={`${btnClass} inline-flex items-center gap-1.5 bg-accent hover:bg-accent/85 text-white`}
          >
            <Plus size={14} /> New post
          </button>
          <button onClick={onSignOut} className={`${btnSmClass} inline-flex items-center gap-1.5`}>
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </div>

      {error && <p className="font-inter text-sm text-red-400 mb-4">Couldn&apos;t load posts: {error}</p>}
      {posts === null && !error && (
        <p className="font-mono text-sm text-text-muted">Loading…</p>
      )}
      {posts?.length === 0 && (
        <p className="font-inter text-sm text-text-muted">
          No posts yet. Hit “+ New post” to write your first.
        </p>
      )}

      <div className="space-y-2">
        {posts?.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-surface border border-border/60"
          >
            <span
              className={`inline-block font-mono text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                CATEGORY_STYLES[p.category] ?? 'bg-bg text-text-muted border-border'
              }`}
            >
              {CATEGORIES[p.category] ?? p.category}
            </span>
            <div className="flex-1 min-w-[200px]">
              <p className="font-space-grotesk font-semibold text-sm text-text-primary">
                {p.title}
              </p>
              <p className="font-mono text-[11px] text-text-muted/60">
                /{p.slug} · updated {new Date(p.updated_at).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${
                p.published
                  ? 'text-emerald-400 bg-emerald-400/10'
                  : 'text-text-muted/60 bg-bg'
              }`}
            >
              {p.published ? 'Live' : 'Draft'}
            </span>
            {/* Newsletter controls — depend on published / scheduled / sent state */}
            {p.published &&
              (p.newsletter_sent_at ? (
                <button
                  className={`${btnSmClass} inline-flex items-center gap-1`}
                  disabled={sendingId === p.id}
                  title={`Sent ${new Date(p.newsletter_sent_at).toLocaleString()}`}
                  onClick={() => sendNewsletter(p)}
                >
                  {sendingId === p.id ? 'Sending…' : '✓ Re-send'}
                </button>
              ) : p.newsletter_scheduled_at ? (
                <>
                  <span
                    className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-full border bg-amber-400/15 text-amber-400 border-amber-400/30"
                    title={`Scheduled for ${new Date(p.newsletter_scheduled_at).toLocaleString()}`}
                  >
                    🕒 {new Date(p.newsletter_scheduled_at).toLocaleString()}
                  </span>
                  <button
                    className={btnSmClass}
                    onClick={() => onSchedule(p, p.newsletter_scheduled_at!)}
                  >
                    Reschedule
                  </button>
                  <button
                    className={`${btnSmClass} hover:!text-red-400 hover:!border-red-400/50`}
                    onClick={() => cancelSchedule(p)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={`${btnSmClass} inline-flex items-center gap-1`}
                    disabled={sendingId === p.id}
                    title="Email this post to subscribers now"
                    onClick={() => sendNewsletter(p)}
                  >
                    <Send size={11} /> {sendingId === p.id ? 'Sending…' : 'Send email'}
                  </button>
                  <button className={btnSmClass} onClick={() => onSchedule(p, '')}>
                    Schedule
                  </button>
                </>
              ))}
            <button className={btnSmClass} onClick={() => togglePublish(p)}>
              {p.published ? 'Unpublish' : 'Publish'}
            </button>
            <button className={btnSmClass} onClick={() => onEdit(p)}>
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Schedule dialog */}
      {sched && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSched(null)
          }}
        >
          <div className="w-full max-w-md rounded-xl bg-surface border border-border/60 p-7">
            <h2 className="font-syne font-bold text-lg text-text-primary mb-1">
              {sched.existing ? 'Reschedule send' : 'Schedule send'}
            </h2>
            <p className="font-inter text-sm text-text-muted mb-5">
              Pick when this post should be emailed to all confirmed subscribers.
              Times are in your local timezone.
            </p>
            <label className="font-mono text-[10px] text-text-muted/60 uppercase tracking-widest block mb-1.5">
              Send at
            </label>
            <input
              type="datetime-local"
              className={inputClass}
              min={toLocalInput(new Date(Date.now() + 60000).toISOString())}
              value={schedWhen}
              onChange={(e) => setSchedWhen(e.target.value)}
            />
            {schedMsg && (
              <p className="mt-2 font-inter text-sm text-red-400">{schedMsg}</p>
            )}
            <div className="flex justify-end gap-3 mt-5">
              <button className={btnSmClass} onClick={() => setSched(null)}>
                Cancel
              </button>
              <button
                onClick={saveSchedule}
                className={`${btnClass} bg-accent hover:bg-accent/85 text-white`}
              >
                {sched.existing ? 'Reschedule' : 'Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [checked, setChecked] = useState(false)
  const [notice, setNotice] = useState('')
  const [editing, setEditing] = useState<BlogPost | null | 'new'>(null)

  const refresh = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const u = session?.user ?? null
    if (u && u.id !== ADMIN_UID) {
      // Authenticated but not the blog admin
      await supabase.auth.signOut()
      setUser(null)
      setNotice('That account isn’t authorized to publish here.')
    } else {
      setUser(u)
    }
    setChecked(true)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setEditing(null)
  }

  return (
    <main className="min-h-dvh bg-bg pt-16 pb-24">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {!checked ? (
          <p className="font-mono text-sm text-text-muted mt-24 text-center">Loading…</p>
        ) : !user ? (
          <Login onSignedIn={refresh} notice={notice} />
        ) : editing !== null ? (
          <div className="mt-8">
            <Editor
              post={editing === 'new' ? null : editing}
              onClose={() => setEditing(null)}
            />
          </div>
        ) : (
          <div className="mt-8">
            <PostList
              who={(user.email ?? '').split('@')[0]}
              onEdit={(p) => setEditing(p)}
              onNew={() => setEditing('new')}
              onSignOut={signOut}
            />
          </div>
        )}
      </div>
    </main>
  )
}
