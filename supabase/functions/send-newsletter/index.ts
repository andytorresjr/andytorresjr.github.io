// POST { postId, force? } -> emails a published post to all confirmed,
// non-unsubscribed subscribers. Admin-only.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, json } from "../_shared/util.ts";
import { sendPostToSubscribers } from "../_shared/send.ts";

const ADMIN_UID = Deno.env.get("ADMIN_UID") ?? "0a9d5f1c-7b3e-4c2a-9e6d-1f2a3b4c5d6e";

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

  const result = await sendPostToSubscribers(admin, post);
  return json(result);
});
