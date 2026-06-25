// GET or POST ?token=<unsubscribe_token> -> marks the subscriber unsubscribed.
// GET is for the link in the email footer; POST supports one-click
// List-Unsubscribe-Post from mail clients.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, htmlPage, json } from "../_shared/util.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const token = new URL(req.url).searchParams.get("token") ?? "";
  if (!token) {
    return req.method === "POST"
      ? json({ error: "missing token" }, 400)
      : htmlPage("Invalid link", "This unsubscribe link is missing its token.", 400);
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { error } = await admin
    .from("blog_subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token);

  if (error) {
    console.error("unsubscribe failed", error);
    return req.method === "POST"
      ? json({ error: "failed" }, 500)
      : htmlPage("Something went wrong", "Please try the link again in a moment.", 500);
  }

  // One-click (RFC 8058) clients just need a 200.
  if (req.method === "POST") return json({ ok: true });
  return htmlPage("Unsubscribed", "You won't receive any more newsletters. Changed your mind? You can subscribe again anytime.");
});
