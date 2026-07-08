-- Newsletter: scheduled sends.
-- Adds a per-post "send at this time" column and a pg_cron job that, every
-- minute, asks the `dispatch-scheduled` Edge Function to send anything that's due.
-- Safe to run multiple times.

-- 1. When to email a post. NULL = not scheduled. Cleared when the send happens.
alter table public.blog_posts
  add column if not exists newsletter_scheduled_at timestamptz;

-- Fast lookup of "due but not yet sent" posts.
create index if not exists blog_posts_newsletter_scheduled_idx
  on public.blog_posts (newsletter_scheduled_at)
  where newsletter_scheduled_at is not null and newsletter_sent_at is null;

-- 2. Extensions that let Postgres run a schedule and make HTTP calls.
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 3. The recurring job.
--    BEFORE running this block, replace the CRON_SECRET placeholder below with a
--    long random string, and set the SAME value as the `CRON_SECRET` secret on
--    the dispatch-scheduled function:
--        supabase secrets set CRON_SECRET='<that-same-string>'
--    (Generate one with, e.g.,  openssl rand -hex 32 )

-- Drop an older copy of the job if you're re-running this migration.
select cron.unschedule('dispatch-scheduled-newsletters')
where exists (select 1 from cron.job where jobname = 'dispatch-scheduled-newsletters');

select cron.schedule(
  'dispatch-scheduled-newsletters',
  '* * * * *',  -- every minute
  $$
  select net.http_post(
    url     := 'https://splknhwqpdudqmnzfdpx.supabase.co/functions/v1/dispatch-scheduled',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'x-cron-secret', 'REPLACE_WITH_CRON_SECRET'
    ),
    body    := '{}'::jsonb
  );
  $$
);
