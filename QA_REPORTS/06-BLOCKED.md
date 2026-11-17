# 06 — Blocked / Not-Verifiable Items

The master prompt says: do not assume access to a Google account, GTM/GA4 property,
Razorpay dashboard, WordPress admin, SSH, VPS, production DB, or a live order capture
unless that access actually exists. I have **none** of those here. The items below are
things that are correct in code but **cannot be confirmed end-to-end** without that
access or your explicit go-ahead. This is the honest list of what is outstanding.

## A. Needs a deploy (build/ops action — no code change from me)

| # | Item | What must happen | Evidence it's pending |
|---|------|------------------|----------------------|
| A1 | **Razorpay verify route is not live** | Deploy the current build; the P0 fix ships with it. | `POST /api/razorpay/verify` → **404** in production today |
| A2 | **`/product/boozliv` 404** | Redeploy + CDN cache purge, then re-check both URL forms. | Live 404 despite CMS resolving it (id 114). **Ops, not code** — decided with the user. |
| A3 | **Homepage `<h1>`** | Ships with the deploy. | Added in `src/app/page.tsx` (uncommitted); homepage had 0 h1 tags live |

## B. Needs a secret / dashboard I do not have

| # | Item | Where |
|---|------|-------|
| B1 | **Set `RAZORPAY_SECRET_KEY`** in the server environment, then verify a genuine signature returns `verified:true` and a forged one returns `verified:false` | Razorpay dashboard (server key). `RAZORPAY_KEY_ID` is the public key already in `.env.local`; the **secret** is a separate value and is not present anywhere in the repo/env — expected. |
| B2 | **Add a Razorpay webhook** (`payment.captured`) for independent, server-to-server payment confirmation | Razorpay dashboard — register the webhook URL + webhook secret |
| B3 | **Configure GA4 / GTM** (`NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GTM_ID`) and validate the 5 new e-commerce events in real time | Google account. Both IDs are empty today, so Google-side collection is off |
| B4 | **Resolve the latent double-pageview** — pick one pageview source (GTM GA4 tag vs direct `gtag`), only relevant once a GA4 property is connected | Google account |
| B5 | **Confirm Meta CAPI match quality** (Advanced-Matching score) | Meta Conversions Manager. The CAPI route is live (returns `fbtrace_id`), but match-rate quality is a dashboard metric I can't see |

## C. Needs real transactions / field data I cannot run

| # | Item |
|---|------|
| C1 | **Real end-to-end payment capture** (Razorpay sandbox → verified order → Woo order total reconciles with the combo paise math). The offline suite proves the math and the HMAC contract; only a live test proves the full loop. |
| C2 | **CrUX / PageSpeed Insights field data** for INP/LCP. I captured a single-pass lab snapshot (TTFB/FCP/transfer) in `04-PERFORMANCE.md`; field data needs the Google property. |
| C3 | **Full backlink / GSC indexation audit** — needs the Google Search Console property. |

## D. Things I deliberately did NOT do (out of scope / would touch unrelated work)

- No deploy, no live order, no payment capture (per the non-negotiable safety rules).
- No edits to WordPress/WooCommerce backend content (all backend changes go through
  `cms.ayurrakshaonline.com` per project memory; I only read from it).
- No changes to the pre-existing untracked `qa-reports/*` scratch files or the older
  `scripts/*.ps1`/`*.js` QA utilities — I left unrelated work alone.
- No new third-party runtime dependencies (the offline suite is dependency-free on
  purpose, so `npm run test:qa` works without a reinstall).

## E. What I *can* hand off and re-run instantly

- `npm run typecheck` → `tsc --noEmit` (currently exit 0)
- `npm run test:qa` → 36/36 offline tests
- `node scripts/e2e-journey.js` → refresh `QA_REPORTS/e2e-journey.json` against any target
- `node scripts/probe-live.mjs` → quick live HTTP ground-truth of PDP/boozliv/CMS status

---

### Bottom line
The code-side remediation (payment verification, spoofed-IP removal, GA4 e-commerce
events, pricing/PII-hashing consolidation, homepage H1, and a green offline regression
suite) is complete in the working tree and committed per your approval. What remains is
**purely operational** — a deploy, a cache purge for boozliv, and the dashboard/secret
configurations in B–C that only you (or a teammate with that access) can finish. None of
the "blocked" items indicate a code defect; they indicate the boundary of what I can
verify without production access.
