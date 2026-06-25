// Cron-triggered. Finds published posts whose scheduled send time has passed
// and that haven't been emailed yet, and sends each one. Called every minute by
// a pg_cron job (see supabase/migrations/0002_schedule.sql). Not user-facing:
// authenticated by a shared CRON_SECRET header, not a JWT.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/util.ts";
import { sendPostToSubscribers } from "../_shared/send.ts";

const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // --- Auth: only the cron job (which knows CRON_SECRET) may trigger this ---
  if (!CRON_SECRET || req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return json({ error: "forbidden" }, 403);
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // --- Find posts that are due ---
  const nowIso = new Date().toISOString();
  const { data: due, error } = await admin
    .from("blog_posts")
    .select("id, slug, title, excerpt, body_md, cover_image_url, published, newsletter_sent_at, newsletter_scheduled_at")
    .eq("published", true)
    .is("newsletter_sent_at", null)
    .not("newsletter_scheduled_at", "is", null)
    .lte("newsletter_scheduled_at", nowIso)
    .order("newsletter_scheduled_at", { ascending: true });
  if (error) return json({ error: "could not load scheduled posts" }, 500);
  if (!due || due.length === 0) return json({ ok: true, dispatched: 0 });

  // --- Send each due post (sequentially, to stay well under Resend limits) ---
  const results = [];
  for (const post of due) {
    const r = await sendPostToSubscribers(admin, post);
    results.push({ id: post.id, slug: post.slug, ...r });
  }

  return json({ ok: results.every((r) => r.ok), dispatched: results.length, results });
});
