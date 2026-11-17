# 05 — Automated Testing Strategy & Results

## Design principle

The master prompt asked for an automated regression suite with **mocked/offline** tests
and a separate live-journey path. I built exactly that split:

- **Offline suite** (`tests/`) — dependency-free, runs on Node 24's native TypeScript
  type-stripping plus a small ESM resolve hook for the project's `@/` alias. It imports the
  **real source modules** (not copies), so a regression in the live code fails the tests.
- **Live journey E2E** (`scripts/e2e-journey.js`) — Playwright/Chromium against a target
  URL (default: production). Read-only page checks plus **forged-signature probes** to the
  verify routes. It never places an order, never captures a payment, never sends real PII.

## Making critical logic testable

To avoid testing "a copy of the logic", I extracted the three riskiest bits of pure
computation out of framework-coupled files into small modules the live code imports:

| Pure module | Consumed by | Why extracted |
|-------------|-------------|---------------|
| `src/lib/comboPricing.ts` | `cartContext.tsx`, `order/create/route.ts` | combo discount paise math was duplicated in two places; now one rule |
| `src/lib/razorpayVerify.ts` | `api/razorpay/verify/route.ts` | HMAC proof-of-payment, the P0 fix; must be unit-testable without Next |
| `src/lib/metaHash.ts` | `api/meta/conversions/route.ts` | Meta Advanced-Matching PII hashing rules |

The routes/components kept their HTTP/React responsibilities; only the pure math moved.

## Offline suite — 36 tests, all passing

Run: `npm run test:qa` (or `node tests/run-tests.mjs`). Evidence: `unit-test-evidence.json`.

- **ComboPricing (14):** paise subtotal only counts combo items; tier thresholds are
  inclusive (₹3,000 → 10%, ₹5,000 → 15%); just-below-₹5,000 stays at 10%; tiers never
  stack; paise-exact rounding (`799800p @15% = 1199.70`) so the Woo order total always
  reconciles with the front-end charge.
- **RazorpayVerify (10):** genuine signature verifies; attacker-forged, wrong-order,
  wrong-payment, and empty signatures are rejected; unconfigured secret returns
  `unconfigured`, **never** `verified:true`. This is the unit-level proof for the P0 fix.
- **MetaHash (9):** email/name/city trim+lowercase before SHA-256; phones digit-stripped
  with a 91 country-code prefix for 10-digit Indian mobiles; empty values omitted, not
  hashed to a sentinel.
- **AnalyticsPayload (3):** GA4 `purchase` payload shape (`transaction_id`, `value`,
  `currency: INR`, item array); **no raw PII** in the dataLayer payload or the
  browser-bound Pixel event; `purchase` dedups via a stable `event_id`.

**A bug the suite caught:** my first draft of `razorpayVerify.ts` reported
`reason:'verified'` even when the signature was rejected (`verified:false`). The
"forged signature is rejected" test caught the misleading reason; the module now returns
`invalid` correctly. That is the regression suite doing its job.

## Live journey E2E

Run: `node scripts/e2e-journey.js` (Chromium installed via `npx playwright install
chromium`). Optional: `TARGET_URL=...`, `PLAYWRIGHT_HEADFUL=1`, `E2E_REPORT=path.json`.
Report: `QA_REPORTS/e2e-journey.json` (latest run: 10 PASS / 4 FAIL / 2 SKIP of 16 — the
FAILs are explained below, not all real defects).

What it asserts: homepage load/title/H1, catalog/PDP/cart/checkout routes, PDP Product
JSON-LD, robots.txt + sitemap reachability, **Razorpay /verify rejects a forged
signature**, **Meta /conversions returns a structured non-5xx result**, analytics
bootstrap presence, homepage CWV snapshot (TTFB/FCP/transfer), and a console-error sweep.

### Interpreting the last run honestly

- `TC-PDP-001` "0 Product schema" — **false negative**: the journey probed `/product/boozliv`,
  which 404s in production (see `03-SEO-SCHEMA.md`). Raw-HTML probes confirm Product
  schema IS present on PDPs that render. The E2E should target a known-good slug for that
  check.
- `TC-HOM-002` "no H1" — **true at the time of the run**; the homepage `<h1>` fix is now
  in the working tree (uncommitted, will ship with the deploy) and will turn this green.
- `TC-API-RAZORPAY-001` passed because the live route is a **404 (not yet deployed)**, so
  `verified` came back undefined — it proves the endpoint doesn't exist in production
  yet, not that verification works. Re-run after deploy to see the real contract.
- `TC-GEN-001` "404 resource" console noise — same boozliv 404 surfacing through a
  homepage link, consistent with the finding above.

## What is explicitly NOT covered here (needs real access)

- Real end-to-end **payment capture** (needs a Razorpay sandbox + a test order).
- **CrUX field data / PageSpeed Insights** (needs the Google property).
- **GA4 real-time validation** of the new events (needs the GA4 property).
- **Meta CAPI match-rate quality** (needs Meta Conversions Manager).

All of the above is listed as blocked in `06-BLOCKED.md`.

## Type-safety baseline

`npx tsc --noEmit` → **exit 0** after every change in this pass (payment route, IP-scrub
removal, five analytics events, combo/metaHash consolidation, test harness, homepage H1).
No type errors introduced; the tree stays clean.
