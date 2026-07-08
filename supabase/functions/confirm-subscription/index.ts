// GET ?token=... — public link target. Marks a subscriber confirmed.
import { createClient } from "npm:@supabase/supabase-js@2";
import { page } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const html = (body: string, status = 200) =>
  new Response(body, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });

Deno.serve(async (req) => {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  if (!token) return html(page("Invalid link", "This confirmation link is missing its token."), 400);

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE);
  const { data, error } = await sb
    .from("blog_subscribers")
    .update({ confirmed: true, confirmed_at: new Date().toISOString(), unsubscribed_at: null })
    .eq("token", token)
    .select("email")
    .maybeSingle();

  if (error || !data) {
    return html(page("Link not found", "This confirmation link is invalid or has expired."), 404);
  }
  return html(page("You're subscribed! 🎉", "Thanks for confirming. You'll get new posts and the occasional newsletter in your inbox.", "#22c55e"));
});
