// GET ?token=<confirm_token> -> marks the subscriber confirmed, then redirects
// to the blog with a status banner. Opened directly from the confirmation email.
// (We redirect rather than render HTML here: Edge Functions on *.supabase.co are
// sandboxed and can't serve a real HTML page.)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, redirect, UUID_RE } from "../_shared/util.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const token = new URL(req.url).searchParams.get("token") ?? "";
  if (!UUID_RE.test(token)) return redirect("/blog/?sub=invalid");

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
    return redirect("/blog/?sub=error");
  }
  if (!data) return redirect("/blog/?sub=invalid");

  return redirect("/blog/?sub=confirmed");
});
