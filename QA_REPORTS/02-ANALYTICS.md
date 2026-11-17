# 02 — Analytics (GA4 / Google Tag Manager / Meta Pixel + CAPI)

## What is actually live in production

I probed the production DOM/HTML rather than trusting the env files:

- **Meta Pixel + server CAPI: LIVE and working.** `POST /api/meta/conversions` returns
  `HTTP 200` with `{"success":true,"events_received":1,"fbtrace_id":"A1XOQBUc_..."}` —
  `fbtrace_id` is only returned when the server call genuinely reaches Meta's Graph API.
  The dual-dispatch (browser `fbq('track')` + server CAPI) uses an identical `event_id`,
  so Meta dedups the two sources. Raw PII is sent **only** to our own CAPI route, which
  SHA-256 hashes it (`src/lib/metaHash.ts`) before Meta sees it. This is correct and
  should stay as the primary purchase-attribution source.
- **GTM and GA4: NOT live.** `AnalyticsScripts.tsx` only injects the GTM container when
  `NEXT_PUBLIC_GTM_ID` is set and the GA4 `gtag` script when `NEXT_PUBLIC_GA4_ID` is set.
  Both are empty in the deployed config, so neither script tag is emitted. `window.dataLayer`
  and `window.fbq` still exist at runtime (the app bootstraps `dataLayer` and the Meta Pixel
  unconditionally), but Google-side collection is off until the IDs are configured.
- The homepage CWV snapshot in `e2e-journey.json` confirms the analytics bootstrap is
  present (`dataLayer=true fbq=true`).

## Finding — missing GA4 e-commerce events (P2), fixed in code

The pre-existing GA4 surface covered `view_item`, `add_to_cart`, `begin_checkout`,
`purchase`, `search`, `generate_lead` — but was missing five e-commerce events Google's
enhanced setup expects. I added dispatchers to `src/lib/storefrontAnalytics.ts` and wired
them:

| Event | Where it fires | Source |
|-------|----------------|--------|
| `view_item_list` | shop grid on product-set / filter / sort change | `src/components/shop/ShopContent.tsx` |
| `select_item` | product-card image/title click (navigates, no `preventDefault`) | `src/components/ProductCard.tsx` |
| `view_cart` | cart page mount and cart-drawer open | `src/app/cart/page.tsx`, `src/components/CartDrawer.tsx` |
| `add_shipping_info` | delivery form submit on checkout | `src/app/checkout/page.tsx` |
| `add_payment_info` | payment-method radio select on checkout | `src/app/checkout/page.tsx` |

All payloads carry `item_id` via `CMS_PRODUCT_ID_MAP`/`getCmsProductId` so GA4 and Meta
share the same canonical id. The `purchase` event still gates on the Razorpay verify
result (see `01-PAYMENT-SECURITY.md`) rather than firing unconditionally.

## Offline verification

`tests/analytics-payload.test.mjs` loads the **real** dispatcher with stubbed browser
globals and proves:
- the GA4 `purchase` payload has `transaction_id`, `value`, `currency:'INR'`, and
  per-item `item_id`/`item_name`/`price`/`quantity`;
- **no raw PII** (email / phone / name / pincode) reaches the GA4 `dataLayer` payload or
  the browser-bound Meta Pixel event data;
- `purchase` dedups on the Meta path via a stable `event_id` (`purchase_<orderId>`).

All passing. See `QA_REPORTS/unit-test-evidence.json`.

## Finding — latent double-pageview (P3, dormant)

`AnalyticsScripts.tsx` emits a direct `gtag('config', '<GA4_ID>', { send_page_view:true })`
when a GA4 ID is set. If the GTM container *also* carries a GA4 tag that auto-logs
`page_view`, the same pageview would be double-counted. Today this is **dormant** (both
IDs empty), but it will bite the moment a GA4 property is connected. Recommended: when
you enable GA4 via GTM, turn `send_page_view` off in the GTM GA4 tag *or* drop the direct
`gtag` script, and keep exactly one pageview source. Decide once, and re-test.

## Still open / blocked

- Configuring `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_GTM_ID` and validating in GA4
  real-time / GTM Preview requires the Google account — not available to me.
- Confirming Meta Advanced-Matching quality (does Meta report high/low match rate?)
  requires the Meta Conversions Manager dashboard — not available to me.
