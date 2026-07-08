// POST { postId } — ADMIN ONLY (JWT verified + UID check). Emails a published
// blog post to all confirmed, non-unsubscribed subscribers via Resend.
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@4";
import { marked } from "npm:marked@12";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const NEWSLETTER_FROM = Deno.env.get("NEWSLETTER_FROM")!;
const SITE_URL = Deno.env.get("SITE_URL") ?? "https://andrestorresjr.com";
const ADMIN_UID = "0a9d5f1c-7b3e-4c2a-9e6d-1f2a3b4c5d6e";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function emailHtml(post: { title: string; body_md: string }, postUrl: string, unsubUrl: string) {
  const bodyHtml = marked.parse(post.body_md, { async: false }) as string;
  return `<div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:0 16px;color:#1a1a1a">
    <h1 style="font-size:1.5rem;line-height:1.3;margin:1.5rem 0 1rem">${post.title}</h1>
    <div style="font-size:1rem;line-height:1.7;color:#333">${bodyHtml}</div>
    <p style="margin:2rem 0 1rem"><a href="${postUrl}" style="color:#6366f1;font-weight:600">Read it on the blog →</a></p>
    <hr style="border:none;border-top:1px solid #e5e5e5;margin:2rem 0 1rem" />
    <p style="font-size:.78rem;color:#999;line-height:1.5">You're receiving this because you subscribed at andrestorresjr.com.<br>
    <a href="${unsubUrl}" style="color:#999">Unsubscribe</a></p>
  </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // --- Authorize: must be the blog admin ---
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Not authenticated." }, 401);
  const authClient = createClient(SUPABASE_URL, ANON_KEY);
  const { data: { user }, error: userErr } = await authClient.auth.getUser(token);
  if (userErr || !user || user.id !== ADMIN_UID) {
    return json({ error: "Not authorized." }, 403);
  }

  let postId = "";
  try {
    postId = String((await req.json()).postId ?? "");
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (!postId) return json({ error: "Missing postId." }, 400);

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

  const { data: post, error: postErr } = await sb
    .from("blog_posts")
    .select("id, slug, title, body_md, published")
    .eq("id", postId)
    .single();
  if (postErr || !post) return json({ error: "Post not found." }, 404);
  if (!post.published) return json({ error: "Publish the post before sending it." }, 400);

  const { data: subs, error: subsErr } = await sb
    .from("blog_subscribers")
    .select("email, token")
    .eq("confirmed", true)
    .is("unsubscribed_at", null);
  if (subsErr) return json({ error: "Could not load subscribers." }, 500);
  if (!subs || subs.length === 0) return json({ error: "No confirmed subscribers to send to yet." }, 400);

  const postUrl = `${SITE_URL}/blog/?slug=${post.slug}`;
  const resend = new Resend(RESEND_API_KEY);

  let sent = 0;
  const errors: string[] = [];
  for (const batch of chunk(subs, 100)) {
    const payload = batch.map((s) => {
      const unsubUrl = `${SUPABASE_URL}/functions/v1/unsubscribe?token=${s.token}`;
      return {
        from: NEWSLETTER_FROM,
        to: s.email,
        subject: post.title,
        html: emailHtml(post, postUrl, unsubUrl),
        headers: {
          "List-Unsubscribe": `<${unsubUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      };
    });
    const { data, error } = await resend.batch.send(payload);
    if (error) {
      errors.push(error.message ?? String(error));
    } else {
      sent += data?.data?.length ?? batch.length;
    }
  }

  if (sent === 0 && errors.length) {
    return json({ error: "Send failed: " + errors[0] }, 502);
  }
  return json({ ok: true, sent, total: subs.length, errors });
});
