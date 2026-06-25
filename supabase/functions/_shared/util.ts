// Shared helpers for the newsletter Edge Functions.

export const SITE_URL = Deno.env.get("SITE_URL") ?? "https://andrestorresjr.com";

// e.g. "Andres Torres Jr. <newsletter@andrestorresjr.com>"
export const NEWSLETTER_FROM =
  Deno.env.get("NEWSLETTER_FROM") ?? "Andres Torres Jr. <newsletter@andrestorresjr.com>";

export const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";

export const FUNCTIONS_BASE = `${Deno.env.get("SUPABASE_URL")}/functions/v1`;

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function htmlPage(title: string, message: string, status = 200): Response {
  const page = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0e0e12;
       color:#e7e7ea;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  .card{max-width:460px;margin:2rem;padding:2.4rem;border:1px solid #26262e;border-radius:16px;
        background:#16161c;text-align:center}
  h1{font-size:1.4rem;margin:0 0 .6rem}
  p{color:#a8a8b3;line-height:1.6;margin:0 0 1.4rem}
  a{display:inline-block;padding:.7rem 1.3rem;border-radius:10px;background:#6366f1;
    color:#fff;text-decoration:none;font-weight:600}
</style></head><body><div class="card">
  <h1>${title}</h1><p>${message}</p>
  <a href="${SITE_URL}/blog/">Back to the blog</a>
</div></body></html>`;
  return new Response(page, {
    status,
    headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
  });
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Send one or more emails through Resend (batch endpoint, max 100 per call).
export async function sendBatch(emails: unknown[]): Promise<Response> {
  return await fetch("https://api.resend.com/emails/batch", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emails),
  });
}

export async function sendOne(email: unknown): Promise<Response> {
  return await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(email),
  });
}
