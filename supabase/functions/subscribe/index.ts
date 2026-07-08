// POST { email, source } — public. Adds a pending subscriber and emails a
// double opt-in confirmation link. Uses the service role to bypass RLS.
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@4";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const NEWSLETTER_FROM = Deno.env.get("NEWSLETTER_FROM")!; // e.g. "Andy Torres <newsletter@andrestorresjr.com>"

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let email = "";
  let source = "blog";
  try {
    const body = await req.json();
    email = String(body.email ?? "").trim().toLowerCase();
    if (body.source) source = String(body.source).slice(0, 40);
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return json({ error: "Enter a valid email address." }, 400);
  }

  const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

  // Look for an existing subscriber.
  const { data: existing } = await sb
    .from("blog_subscribers")
    .select("id, token, confirmed, unsubscribed_at")
    .eq("email", email)
    .maybeSingle();

  let token: string;
  if (existing) {
    if (existing.confirmed && !existing.unsubscribed_at) {
      return json({ ok: true, status: "already_confirmed" });
    }
    // Re-subscribing or never confirmed: clear any prior unsubscribe and reuse token.
    token = existing.token;
    await sb
      .from("blog_subscribers")
      .update({ unsubscribed_at: null, source })
      .eq("id", existing.id);
  } else {
    const { data: inserted, error } = await sb
      .from("blog_subscribers")
      .insert({ email, source })
      .select("token")
      .single();
    if (error) return json({ error: "Could not subscribe. Try again later." }, 500);
    token = inserted.token;
  }

  // Send the confirmation email.
  const confirmUrl = `${SUPABASE_URL}/functions/v1/confirm-subscription?token=${token}`;
  const resend = new Resend(RESEND_API_KEY);
  const { error: sendErr } = await resend.emails.send({
    from: NEWSLETTER_FROM,
    to: email,
    subject: "Confirm your subscription",
    html: `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;color:#1a1a1a">
      <h2 style="font-size:1.25rem">Almost there 👋</h2>
      <p style="color:#444;line-height:1.6">Tap the button below to confirm you'd like occasional newsletters and updates from Andres Torres Jr. If you didn't request this, you can ignore this email.</p>
      <p style="margin:1.5rem 0"><a href="${confirmUrl}" style="background:#6366f1;color:#fff;text-decoration:none;padding:.7rem 1.4rem;border-radius:10px;font-weight:600;display:inline-block">Confirm subscription</a></p>
      <p style="color:#888;font-size:.8rem">Or paste this link into your browser:<br>${confirmUrl}</p>
    </div>`,
  });
  if (sendErr) {
    console.error("Resend error:", sendErr);
    return json({ error: "Could not send confirmation email." }, 502);
  }

  return json({ ok: true, status: "confirmation_sent" });
});
