// GET or POST ?token=<unsubscribe_token> -> marks the subscriber unsubscribed.
// GET is the link in the email footer (redirects to the blog with a banner);
// POST supports one-click List-Unsubscribe-Post from mail clients (returns JSON).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, redirect, json, UUID_RE } from "../_shared/util.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const token = new URL(req.url).searchParams.get("token") ?? "";
  if (!UUID_RE.test(token)) {
    return req.method === "POST"
      ? json({ error: "missing token" }, 400)
      : redirect("/blog/?sub=invalid");
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
      : redirect("/blog/?sub=error");
  }

  // One-click (RFC 8058) clients just need a 200.
  if (req.method === "POST") return json({ ok: true });
  return redirect("/blog/?sub=unsubscribed");
});
