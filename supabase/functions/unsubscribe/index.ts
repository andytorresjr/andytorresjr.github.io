// GET/POST ?token=... — public. Marks a subscriber unsubscribed.
// Supports RFC 8058 one-click unsubscribe (POST) and link clicks (GET).
import { createClient } from "npm:@supabase/supabase-js@2";
import { page } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const html = (body: string, status = 200) =>
  new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });

Deno.serve(async (req) => {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  if (!token) return html(page("Invalid link", "This unsubscribe link is missing its token."), 400);

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE);
  const { data, error } = await sb
    .from("blog_subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("token", token)
    .select("email")
    .maybeSingle();

  // One-click (List-Unsubscribe-Post) just needs a 200.
  if (req.method === "POST") {
    return new Response(error || !data ? "not found" : "ok", { status: error || !data ? 404 : 200 });
  }
  if (error || !data) {
    return html(page("Link not found", "This unsubscribe link is invalid or has already been used."), 404);
  }
  return html(page("You've been unsubscribed", "You won't receive any more emails from this list. Changed your mind? You can resubscribe anytime on the blog.", "#71717a"));
});
