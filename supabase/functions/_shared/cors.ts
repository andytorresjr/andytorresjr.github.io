// Shared CORS headers for browser-invoked functions.
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Minimal styled HTML page returned by the confirm / unsubscribe link handlers.
export function page(title: string, message: string, accent = "#6366f1"): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<style>
  :root { color-scheme: dark; }
  body { margin:0; min-height:100vh; display:grid; place-items:center;
    background:#080808; color:#e7e7ea; font-family: ui-sans-serif, system-ui, -apple-system, "Inter", sans-serif; }
  .card { max-width:440px; margin:1.5rem; padding:2.4rem; text-align:center;
    background:#0e0e12; border:1px solid #23232b; border-radius:16px; }
  h1 { font-size:1.4rem; margin:0 0 .6rem; }
  p { color:#a1a1aa; line-height:1.6; margin:0 0 1.4rem; }
  a { display:inline-block; color:#fff; text-decoration:none; font-weight:600;
    padding:.6rem 1.2rem; border-radius:10px; background:${accent}; }
</style></head><body>
  <div class="card"><h1>${title}</h1><p>${message}</p>
  <a href="https://andrestorresjr.com/blog/">← Back to the blog</a></div>
</body></html>`;
}
