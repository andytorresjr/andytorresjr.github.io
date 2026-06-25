# Newsletter deliverability — future tasks

Context: emails are authenticated correctly (SPF, DKIM, DMARC all pass and align —
verified via public DNS on 2026-06-25). Some recipients still saw newsletters land
in spam. That's almost always **sender reputation** (new domain, low volume) plus a
few content/config signals — not an auth failure.

Status legend: ✅ done in code · ⬜ your task

---

## ✅ Done (in code)
- **Multipart emails (text + HTML).** Confirmation and newsletter now include a
  plain-text part (HTML-only is a common spam trigger). See `_shared/send.ts` and
  `subscribe/index.ts`. Requires redeploying `subscribe`, `send-newsletter`,
  `dispatch-scheduled`.
- **Optional Reply-To** via the `NEWSLETTER_REPLY_TO` secret (see below).

## ⬜ Your tasks

### 1. Strengthen the DMARC record  (DNS — biggest config win)
Current `_dmarc.andrestorresjr.com` TXT is bare: `v=DMARC1; p=none`.
Replace with:
```
v=DMARC1; p=none; rua=mailto:dmarc@andrestorresjr.com; adkim=s; aspf=s; fo=1
```
- `rua=` → you start receiving weekly aggregate reports (visibility into failures).
- Keep `p=none` for ~2 weeks, confirm reports are clean, then tighten to
  `p=quarantine`. Don't jump straight to `p=reject`.

### 2. Set a real Reply-To  (legitimacy signal)
```powershell
supabase secrets set NEWSLETTER_REPLY_TO="andres@andrestorresjr.com"
```
Use an inbox you actually monitor. (Code already includes it when this is set.)

### 3. Build sender reputation  (the real fix for "new sender → spam")
- **Send consistently** (steady cadence beats big bursts after silence).
- In the first few sends, **ask readers to reply** and to **add
  `newsletter@andrestorresjr.com` to their contacts** — a reply or contact-add is
  the strongest "not spam" signal, especially for Gmail/Apple Mail.
- Ask the people who reported it went to spam to click **"Not spam"** / drag it to
  their inbox. That directly trains the filter for your domain.
- Double opt-in (already in place) helps — only confirmed, engaged addresses get mail.
- Periodically prune hard bounces / long-term non-openers; mailing dead addresses
  hurts reputation.

### 4. Content hygiene  (minor, free)
- Keep a healthy text-to-image ratio (not one big image with little text).
- Avoid spammy subjects (ALL CAPS, "FREE!!!", excessive emoji/punctuation).
- Keep links on your own domain / Supabase (already the case — no shorteners).

### 5. (Optional) Add an in-email nudge
Add a small line at the bottom of the newsletter template like:
"If this landed in spam, reply 'hi' or drag it to your inbox so future ones arrive
properly." Proven early-stage trick. Ask Claude to add it to `_shared/send.ts`.

---

## How to verify auth anytime
```bash
nslookup -type=TXT resend._domainkey.andrestorresjr.com 1.1.1.1   # DKIM key present
nslookup -type=TXT send.andrestorresjr.com 1.1.1.1                # SPF: include:amazonses.com
nslookup -type=TXT _dmarc.andrestorresjr.com 1.1.1.1             # DMARC policy
```
Or send a test to a Gmail address and use **Show original** to confirm SPF/DKIM/DMARC = PASS.
Tools: mail-tester.com (gives a spam score), Google Postmaster Tools (domain reputation).
