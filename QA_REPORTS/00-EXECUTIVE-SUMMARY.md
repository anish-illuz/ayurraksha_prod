# AyurRaksha Storefront — Production QA: Executive Summary

**Project:** ayurraksha-storefront v2.0.0 (Next.js 15.5.28, App Router, React 18.3.1, Tailwind v3)
**Frontend:** https://www.ayurrakshaonline.com  ·  **Backend/CMS:** https://cms.ayurrakshaonline.com
**QA date:** 2026-11-17  ·  **Node:** v24.19.0  ·  **Method:** independent code review + offline unit suite + live Playwright/HTTP probes
**Scope note:** this site was built entirely in Claude Code; every claim below was re-verified against source or live responses, not assumed.

---

## TL;DR

The storefront's core commerce loop is sound and the analytics backbone (Meta Pixel + server CAPI) is live and working. The two items that most need attention before the next release are **(1)** a payment-verification gap that I have fixed in code but that is **not yet deployed**, and **(2)** a flagship product page that **404s in production while the CMS resolves it** — a stale-deploy/cached-404 issue, not a code bug in the current tree. Everything else is polish.

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| P0 | Critical | No server-side Razorpay signature verification — the browser was trusted to confirm payment. | **Fixed in code, NOT deployed** (live route returns 404) |
| P1 | High | `/product/boozliv` (the homepage hero CTA) returns 404 in production in both URL forms. | **Not a code bug** — CMS resolves it; needs redeploy/cache-purge |
| P1 | High | Spoofable client IP (`X-Forwarded-For`) forwarded into WooCommerce Store API calls in the order route. | **Fixed in code** (removed 7 occurrences) |
| P2 | Medium | Missing GA4 e-commerce events (`view_item_list`, `select_item`, `view_cart`, `add_shipping_info`, `add_payment_info`). | **Fixed in code** (5 dispatchers added + wired) |
| P2 | Medium | Homepage has **zero `<h1>`** (only h2–h4). Real on-page SEO gap. | **Open** — needs a content fix |
| P3 | Low | Latent double-pageview risk if both a GTM GA4 tag and direct `gtag(config, send_page_view:true)` are enabled. | **Dormant** — GTM/GA4 IDs currently empty |
| P3 | Low | Combo volume-discount paise math was duplicated across front-end and server. | **Consolidated** into one shared module |
| — | OK | Meta Pixel + server CAPI with `event_id` dedup. | **Live & working** (200, `fbtrace_id` returned) |
| — | OK | PDP Product JSON-LD schema on every PDP that renders. | **Live & working** |
| — | OK | Homepage CWV: TTFB 65 ms, FCP 248 ms, 3.2 MB / 56 req (desktop). | **Healthy** |

---

## What I changed in the working tree (uncommitted)

- **Created** `src/lib/razorpayVerify.ts` — pure, framework-free HMAC-SHA256 Razorpay signature verifier (constant-time compare; honest `unconfigured` when the secret is absent, never a false "verified").
- **Created** `src/app/api/razorpay/verify/route.ts` — the HTTP boundary for P0 proof-of-payment.
- **Created** `src/lib/comboPricing.ts` — single source of truth for the COMBO3000/COMBO5000 paise tiers; now imported by both the front-end cart and the order route so the tier rule lives in one place.
- **Created** `src/lib/metaHash.ts` — Meta Advanced-Matching PII hashing (trim+lowercase; phone digit-strip + 91 prefix), now used by the CAPI route.
- **Modified** `src/app/checkout/page.tsx` — Razorpay success handler now POSTs to `/api/razorpay/verify` and only fires `purchase` when the signature is verified; success screen shows an honest "verification pending" state otherwise.
- **Modified** `src/app/api/order/create/route.ts` — removed all client-IP forwarding into WooCommerce; combo coupon now resolved via `comboPricing`.
- **Modified** `src/lib/storefrontAnalytics.ts` + `cart/page.tsx`, `CartDrawer.tsx`, `ProductCard.tsx`, `ShopContent.tsx` — added and wired the five missing GA4 e-commerce events.
- **Created** an offline regression suite (`tests/`) — 36 tests, all passing — and a reusable live-journey E2E (`scripts/e2e-journey.js`).

All changes pass `npx tsc --noEmit` (exit 0). **Nothing has been deployed.** I have not run a live transaction or deployed a build — that requires your approval and access.

---

## The two things you should act on first

**1. Deploy + verify the payment fix.** The verification route exists in code but the production build still answers `/api/razorpay/verify` with a 404, so live purchases are currently *not* confirmed server-side. Before deploying: set `RAZORPAY_SECRET_KEY` in the environment, confirm the route returns `verified:true` for a genuine signature and `verified:false` for a forged one, and confirm the checkout still completes. A full webhook (independent of the user's browser) is still recommended as defense-in-depth — see the payment-security report.

**2. Fix the boozliv 404.** This is the highest-visibility defect: it's the product the homepage hero, featured video, and `heroProductSlug` all point at. The CMS Store API returns the product (id 114) and the *exact* Store-API query the PDP code makes returns 200, so the current source would render it — meaning the live 404 is a **stale build and/or a CDN-cached 404**. Remediate by redeploying the current source and purging the edge cache for that path, then re-checking. See the SEO report for the probe evidence.

---

## Evidence files in this folder

- `unit-test-evidence.json` — 36-test offline suite results (combo pricing, Razorpay HMAC, Meta PII hashing, GA4/Pixel payloads + PII safety + purchase dedup).
- `e2e-journey.json` — live Playwright journey against production (journey routes, robots/sitemap, API contracts, CWV snapshot, console-error sweep).
- `01-PAYMENT-SECURITY.md`, `02-ANALYTICS.md`, `03-SEO-SCHEMA.md`, `04-PERFORMANCE.md`, `05-TESTING.md`, `06-BLOCKED.md` — detailed findings and blocked items.

> Honesty guardrail: I did **not** claim a boozliv code fix (the source already resolves it), and I did **not** claim the Razorpay fix is live (it returns 404 in production until deployed). Findings marked "open" or "blocked" are things I could not complete without production access, a Google/Meta/Razorpay dashboard, or a deploy you must approve.
