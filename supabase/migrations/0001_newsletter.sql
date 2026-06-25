-- Newsletter: double opt-in + unsubscribe + send tracking
-- Safe to run multiple times.

-- 1. Make sure the subscribers table exists (it should already, from the blog feature)
create table if not exists public.blog_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  source      text,
  created_at  timestamptz not null default now()
);

-- 2. Columns the newsletter pipeline needs
alter table public.blog_subscribers
  add column if not exists confirmed         boolean     not null default false,
  add column if not exists confirm_token     uuid        not null default gen_random_uuid(),
  add column if not exists unsubscribe_token uuid        not null default gen_random_uuid(),
  add column if not exists confirmed_at      timestamptz,
  add column if not exists unsubscribed_at   timestamptz;

create index if not exists blog_subscribers_confirm_token_idx     on public.blog_subscribers (confirm_token);
create index if not exists blog_subscribers_unsubscribe_token_idx on public.blog_subscribers (unsubscribe_token);

-- 3. Track which posts have already been emailed (prevents accidental double-sends)
alter table public.blog_posts
  add column if not exists newsletter_sent_at timestamptz;

-- 4. Lock the subscriber list down (step 5 in the plan).
--    Edge Functions use the service-role key, which BYPASSES RLS, so the
--    public browser key needs no access at all to this table. We remove the
--    old "anyone can insert" policy and grant the anon role nothing.
alter table public.blog_subscribers enable row level security;

drop policy if exists "anon can subscribe"        on public.blog_subscribers;
drop policy if exists "Public can insert"         on public.blog_subscribers;
drop policy if exists "Enable insert for anon"    on public.blog_subscribers;
drop policy if exists "blog_subscribers_insert"   on public.blog_subscribers;
-- (If you named your original insert policy something else, drop it too.)

revoke all on public.blog_subscribers from anon;
-- No policies for anon => with RLS on, the browser key can neither read nor
-- write this table. All access now flows through Edge Functions.
