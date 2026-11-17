# 04 — Performance & Core Web Vitals

## Homepage snapshot (desktop, Chromium, Playwright)

Captured live in `e2e-journey.json` (`TC-PERF-001`):

- **HTTP 200**
- **TTFB ≈ 65 ms**
- **FCP ≈ 248 ms**
- **≈ 3,230 KB** transferred across **56 requests**

These are lab numbers on a single desktop pass, not field data. TTFB and FCP are
healthy. The 3.2 MB transfer is the main thing to watch — it is dominated by product
imagery and the JS chunk set (Next.js app chunks + PDP/hero components).

## What is already good

- `next.config.js` forces `formats: ['image/avif', 'image/webp']` with a one-year
  `minimumCacheTTL` on `next/image`, so catalog/hero imagery is served in modern
  compressed formats and cached aggressively.
- PDPs and commerce routes are `force-dynamic`, so no stale pre-render bloat, and
  CMS content is fetched on demand.

## Open performance items (lab-verified direction, not yet remediated)

- **Payload budget:** 56 requests / 3.2 MB on the homepage. Audit the top-N largest
  resources (the E2E already records per-type breakdown and top-5 largest into
  `e2e-journey.json` when run with the `resources` capture). Priorities: lazy-load
  below-the-fold hero/PDP image sets, confirm AVIF is actually being served
  (some CDNs fall back to WebP), and split any large above-the-fold JS chunk.
- **INP / LCP field data:** not available to me. CrUX + Google PageSpeed Insights
  field data need the Google account (blocked — see `06-BLOCKED.md`).
- **Mobile pass:** the existing `scripts/test-playwright.js` already does a mobile
  (Pixel 5) perf pass; I have not re-run it against production this session. The
  reusable `scripts/e2e-journey.js` can be re-run with `PLAYWRIGHT_HEADFUL=1` to watch
  any of these live.

## Honesty guardrail

These are single-pass lab measurements from one machine on 2026-11-17. They are not
a CrUX field-data substitute and not a multi-run average. Treat the numbers as a
directional baseline to beat after the perf work, not as a "the site is fast" claim.
