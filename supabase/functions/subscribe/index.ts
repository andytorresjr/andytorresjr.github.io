// POST { email, source? } -> creates/updates a subscriber and emails a
// confirmation link (double opt-in). Public; no auth required.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  corsHeaders, json, EMAIL_RE, sendOne,
  NEWSLETTER_FROM, FUNCTIONS_BASE, SITE_URL,
} from "../_shared/util.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  let email = "", source = "blog";
  try {
    const body = await req.json();
    email = String(body.email ?? "").trim().toLowerCase();
    if (body.source) source = String(body.source);
  } catch {
    return json({ error: "invalid body" }, 400);
  }
  if (!EMAIL_RE.test(email)) return json({ error: "invalid email" }, 400);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Upsert. Re-subscribing clears a prior unsubscribe; confirmed stays as-is.
  const { data: row, error } = await admin
    .from("blog_subscribers")
    .upsert({ email, source, unsubscribed_at: null }, { onConflict: "email" })
    .select("confirm_token, confirmed")
    .single();

  if (error || !row) {
    console.error("subscribe upsert failed", error);
    return json({ error: "could not subscribe" }, 500);
  }

  if (row.confirmed) {
    return json({ ok: true, status: "already_confirmed" });
  }

  const confirmUrl = `${FUNCTIONS_BASE}/confirm?token=${row.confirm_token}`;
  const res = await sendOne({
    from: NEWSLETTER_FROM,
    to: [email],
    subject: "Confirm your subscription",
    html: `
      <div style="font-family:system-ui,Segoe UI,Roboto,sans-serif;max-width:480px;margin:auto;color:#1a1a22">
        <h2 style="font-size:1.3rem">One more step</h2>
        <p style="color:#444;line-height:1.6">Thanks for subscribing to Andres Torres Jr.'s newsletter.
        Please confirm your email so I know it's really you:</p>
        <p style="margin:1.6rem 0">
          <a href="${confirmUrl}" style="background:#6366f1;color:#fff;padding:.8rem 1.4rem;
             border-radius:10px;text-decoration:none;font-weight:600">Confirm subscription</a>
        </p>
        <p style="color:#888;font-size:.85rem">If you didn't request this, just ignore this email —
        you won't be added.</p>
        <p style="color:#888;font-size:.8rem">${SITE_URL.replace("https://", "")}</p>
      </div>`,
  });

  if (!res.ok) {
    console.error("resend confirmation failed", await res.text());
    return json({ error: "could not send confirmation email" }, 502);
  }

  return json({ ok: true, status: "confirmation_sent" });
});
