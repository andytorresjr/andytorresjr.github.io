// Shared newsletter-send logic, used by both `send-newsletter` (manual, admin)
// and `dispatch-scheduled` (cron). Renders a published post and emails it to all
// confirmed, non-unsubscribed subscribers via Resend, then stamps
// `newsletter_sent_at` so it can't go out twice.
import { marked } from "https://esm.sh/marked@12";
import {
  sendBatch, NEWSLETTER_FROM, FUNCTIONS_BASE, SITE_URL,
} from "./util.ts";

// deno-lint-ignore no-explicit-any
type Admin = any;

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  body_md?: string | null;
  cover_image_url?: string | null;
  published?: boolean;
  newsletter_sent_at?: string | null;
}

export interface SendResult {
  ok: boolean;
  sent: number;
  total: number;
  errors: string[];
  note?: string;
}

function esc(s: string): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

// Renders `post` and emails it to all confirmed subscribers. On at least one
// successful batch, sets `newsletter_sent_at` and clears any pending schedule.
export async function sendPostToSubscribers(admin: Admin, post: Post): Promise<SendResult> {
  const { data: subs, error: subErr } = await admin
    .from("blog_subscribers")
    .select("email, unsubscribe_token")
    .eq("confirmed", true)
    .is("unsubscribed_at", null);
  if (subErr) return { ok: false, sent: 0, total: 0, errors: ["could not load subscribers"] };
  if (!subs || subs.length === 0) return { ok: true, sent: 0, total: 0, note: "no confirmed subscribers" };

  const postUrl = `${SITE_URL}/blog/?slug=${encodeURIComponent(post.slug)}`;
  const bodyHtml = marked.parse(post.body_md || "");

  const buildHtml = (unsubUrl: string) => `
  <div style="font-family:system-ui,Segoe UI,Roboto,sans-serif;max-width:600px;margin:auto;color:#1a1a22;line-height:1.7">
    ${post.cover_image_url ? `<img src="${esc(post.cover_image_url)}" alt="" style="width:100%;border-radius:12px;margin-bottom:1.4rem">` : ""}
    <h1 style="font-size:1.7rem;margin:0 0 1rem">${esc(post.title)}</h1>
    <div>${bodyHtml}</div>
    <p style="margin:2rem 0 0">
      <a href="${postUrl}" style="background:#6366f1;color:#fff;padding:.8rem 1.4rem;border-radius:10px;text-decoration:none;font-weight:600">Read it on the site</a>
    </p>
    <hr style="border:none;border-top:1px solid #e5e5ea;margin:2.4rem 0 1rem">
    <p style="color:#999;font-size:.8rem">
      You're getting this because you subscribed at ${esc(SITE_URL.replace("https://", ""))}.<br>
      <a href="${unsubUrl}" style="color:#999">Unsubscribe</a>
    </p>
  </div>`;

  const emails = subs.map((s: { email: string; unsubscribe_token: string }) => {
    const unsubUrl = `${FUNCTIONS_BASE}/unsubscribe?token=${s.unsubscribe_token}`;
    return {
      from: NEWSLETTER_FROM,
      to: [s.email],
      subject: post.title,
      html: buildHtml(unsubUrl),
      headers: {
        "List-Unsubscribe": `<${unsubUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    };
  });

  let sent = 0;
  const errors: string[] = [];
  for (const batch of chunk(emails, 100)) {
    const res = await sendBatch(batch);
    if (res.ok) sent += batch.length;
    else errors.push(await res.text());
  }

  if (sent > 0) {
    await admin.from("blog_posts")
      .update({ newsletter_sent_at: new Date().toISOString(), newsletter_scheduled_at: null })
      .eq("id", post.id);
  }

  return { ok: errors.length === 0, sent, total: emails.length, errors };
}
