// POST { postId, force? } -> emails a published post to all confirmed,
// non-unsubscribed subscribers. Admin-only.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { marked } from "https://esm.sh/marked@12";
import {
  corsHeaders, json, sendBatch,
  NEWSLETTER_FROM, FUNCTIONS_BASE, SITE_URL,
} from "../_shared/util.ts";

const ADMIN_UID = Deno.env.get("ADMIN_UID") ?? "0a9d5f1c-7b3e-4c2a-9e6d-1f2a3b4c5d6e";

function esc(s: string): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  // --- Auth: caller must be the signed-in blog admin ---
  const authHeader = req.headers.get("Authorization") ?? "";
  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user } } = await userClient.auth.getUser();
  if (!user || user.id !== ADMIN_UID) return json({ error: "forbidden" }, 403);

  let postId = "", force = false;
  try {
    const body = await req.json();
    postId = String(body.postId ?? "");
    force = Boolean(body.force);
  } catch {
    return json({ error: "invalid body" }, 400);
  }
  if (!postId) return json({ error: "missing postId" }, 400);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // --- Fetch the post ---
  const { data: post, error: postErr } = await admin
    .from("blog_posts")
    .select("id, slug, title, excerpt, body_md, cover_image_url, published, newsletter_sent_at")
    .eq("id", postId)
    .maybeSingle();
  if (postErr || !post) return json({ error: "post not found" }, 404);
  if (!post.published) return json({ error: "post is not published yet" }, 400);
  if (post.newsletter_sent_at && !force) {
    return json({ error: "already_sent", sentAt: post.newsletter_sent_at }, 409);
  }

  // --- Fetch recipients ---
  const { data: subs, error: subErr } = await admin
    .from("blog_subscribers")
    .select("email, unsubscribe_token")
    .eq("confirmed", true)
    .is("unsubscribed_at", null);
  if (subErr) return json({ error: "could not load subscribers" }, 500);
  if (!subs || subs.length === 0) return json({ ok: true, sent: 0, note: "no confirmed subscribers" });

  // --- Render the post body once ---
  const postUrl = `${SITE_URL}/blog/?slug=${encodeURIComponent(post.slug)}`;
  const bodyHtml = marked.parse(post.body_md || "");

  const buildHtml = (unsubUrl: string) => `
  <div style="font-family:system-ui,Segoe UI,Roboto,sans-serif;max-width:600px;margin:auto;color:#1a1a22;line-height:1.7">
    ${post.cover_image_url ? `<img src="${esc(post.cover_image_url)}" alt="" style="width:100%;border-radius:12px;margin-bottom:1.4rem">` : ""}
    <h1 style="font-size:1.7rem;margin:0 0 1rem">${esc(post.title)}</h1>
    <div>${bodyHtml}</div>
    <p style="margin:2rem 0 0">
      <a href="${postUrl}" style="background:#6366f1;color:#fff;padding:.8rem 1.4rem;border-radius:10px;text-decoration:none;font-weight:600">Read it on the site</a>
    </p>
    <hr style="border:none;border-top:1px solid #e5e5ea;margin:2.4rem 0 1rem">
    <p style="color:#999;font-size:.8rem">
      You're getting this because you subscribed at ${esc(SITE_URL.replace("https://", ""))}.<br>
      <a href="${unsubUrl}" style="color:#999">Unsubscribe</a>
    </p>
  </div>`;

  const emails = subs.map((s) => {
    const unsubUrl = `${FUNCTIONS_BASE}/unsubscribe?token=${s.unsubscribe_token}`;
    return {
      from: NEWSLETTER_FROM,
      to: [s.email],
      subject: post.title,
      html: buildHtml(unsubUrl),
      headers: {
        "List-Unsubscribe": `<${unsubUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    };
  });

  // --- Send in batches of 100 ---
  let sent = 0;
  const errors: string[] = [];
  for (const batch of chunk(emails, 100)) {
    const res = await sendBatch(batch);
    if (res.ok) sent += batch.length;
    else errors.push(await res.text());
  }

  if (sent > 0) {
    await admin.from("blog_posts")
      .update({ newsletter_sent_at: new Date().toISOString() })
      .eq("id", post.id);
  }

  return json({ ok: errors.length === 0, sent, total: emails.length, errors });
});
