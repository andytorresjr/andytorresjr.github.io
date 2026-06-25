# Newsletter setup — remaining manual steps

The code is done (migration, 4 Edge Functions, blog form, admin "Send email" button).
What's left needs your hands because it touches Supabase secrets, the database, and Resend DNS.

## What I need from you (Resend)
1. **API key** — Resend → API Keys → create one with **Sending access**. Copy it (starts with `re_`).
2. **Verified domain** — Resend → Domains → `andrestorresjr.com` must show **Verified**
   (SPF + DKIM + DMARC DNS records added at your registrar). If it isn't verified yet, do that first; sends will fail otherwise.
3. **From address** — confirm you want `newsletter@andrestorresjr.com` (the default). It just needs to be on the verified domain; the mailbox doesn't have to exist.

---

## Step 1 — Install + link the Supabase CLI (one time)
```powershell
npm install -g supabase
supabase login                       # opens browser
supabase link --project-ref splknhwqpdudqmnzfdpx
```

## Step 2 — Set the secrets
```powershell
supabase secrets set `
  RESEND_API_KEY="re_xxxxxxxxxxxx" `
  NEWSLETTER_FROM="Andres Torres Jr. <newsletter@andrestorresjr.com>" `
  SITE_URL="https://andrestorresjr.com"
```
(`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY` are injected automatically — don't set them.)
If your admin user id ever differs from the one hard-coded in `admin/index.html`, also set `ADMIN_UID="<uuid>"`.

## Step 3 — Run the database migration
Either:
```powershell
supabase db push
```
Or paste `supabase/migrations/0001_newsletter.sql` into the Supabase dashboard → SQL Editor → Run.

This adds the double opt-in / unsubscribe columns and **locks the subscriber table** so the
public browser key can no longer read or write it (step 5 of the plan — all access now goes
through the functions, which use the service-role key).

> ⚠️ Check the policy names: the migration drops a few common names for the old "anyone can
> insert" policy. If you named yours something else, open the dashboard →
> Authentication → Policies → `blog_subscribers` and delete any remaining anon policy.

## Step 4 — Deploy the functions
```powershell
supabase functions deploy subscribe
supabase functions deploy confirm
supabase functions deploy unsubscribe
supabase functions deploy send-newsletter
```
`config.toml` already marks `subscribe`/`confirm`/`unsubscribe` as public (`verify_jwt = false`)
and keeps `send-newsletter` authenticated. If your CLI ignores that, append `--no-verify-jwt`
to the first three deploy commands.

## Step 5 — Test end to end
1. Go to `https://andrestorresjr.com/blog/`, subscribe with your own email.
   → you should see "check your inbox to confirm" and get a confirmation email.
2. Click **Confirm** → "You're confirmed" page.
3. In `/admin/`, open a published post → **Send email** → you receive it.
4. Click **Unsubscribe** in the footer → confirm you're removed.
5. (Optional) In Supabase → Table editor → `blog_subscribers`, confirm your row shows
   `confirmed = true` and the right tokens.

## How it works day to day
- A reader subscribes → gets a confirmation email → only **confirmed** addresses ever receive a newsletter.
- You publish a post in `/admin/`, then click **Send email**. It goes to every confirmed,
  non-unsubscribed subscriber, each with a one-click unsubscribe link.
- A post can only be sent once unless you confirm the "send AGAIN?" prompt (tracked via
  `blog_posts.newsletter_sent_at`).
