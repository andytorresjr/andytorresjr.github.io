// GET ?token=<confirm_token> -> marks the subscriber confirmed, shows a page.
// Opened directly from the confirmation email, so it returns HTML.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, htmlPage } from "../_shared/util.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const token = new URL(req.url).searchParams.get("token") ?? "";
  if (!token) return htmlPage("Invalid link", "This confirmation link is missing its token.", 400);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data, error } = await admin
    .from("blog_subscribers")
    .update({ confirmed: true, confirmed_at: new Date().toISOString(), unsubscribed_at: null })
    .eq("confirm_token", token)
    .select("email")
    .maybeSingle();

  if (error) {
    console.error("confirm failed", error);
    return htmlPage("Something went wrong", "Please try the link again in a moment.", 500);
  }
  if (!data) {
    return htmlPage("Link not found", "This confirmation link is invalid or has already been used.", 404);
  }

  return htmlPage("You're confirmed! &#10003;", "Thanks &mdash; you'll get new posts in your inbox. No spam, unsubscribe anytime.");
});
