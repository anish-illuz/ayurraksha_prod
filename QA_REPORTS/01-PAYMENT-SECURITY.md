# 01 — Payment Security (Razorpay Standard Checkout)

## The original defect (P0)

The production checkout used Razorpay **Standard Checkout** with a **client-only** success
handler. On success the browser callback received
`{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` and the app fired
`trackPurchase` and marked the order paid with **no server-side check** that the signature
was genuine. A malicious user can construct that object and forge a "success" for an amount
(or any amount) they did not actually pay. There was no `RAZORPAY_SECRET_KEY`, no
`/api/razorpay/verify` route, and no webhook anywhere in the tree.

## The fix (in code, not yet deployed)

- `src/lib/razorpayVerify.ts` — pure `verifyRazorpaySignature({orderId, paymentId, signature, secret})`
  that recomputes `HMAC-SHA256(orderId|paymentId, secret)` and compares in **constant time**.
  - No secret configured → returns `{verified:false, reason:'unconfigured'}`. It **never** claims
    "verified" when it cannot prove the payment.
  - Missing fields → `missing_fields`; mismatch → `invalid`; genuine → `verified`.
- `src/app/api/razorpay/verify/route.ts` — the HTTP boundary. 400 on missing payment id or a
  genuine mismatch; 200 with `verified:true` only when the HMAC matches; 200 with
  `reason:'unconfigured'` when the secret is absent so the UI can show "payment recorded,
  confirmation pending".
- `src/app/checkout/page.tsx` — the Razorpay success handler now POSTs the three signature
  fields to `/api/razorpay/verify`. `trackPurchase` fires **only** on `verified:true`; otherwise
  the success screen shows a "Payment Pending Verification" state. This closes the
  forge-and-fake-purchase path for the Standard Checkout flow.

## Secondary fix: spoofable client IP (P1)

`src/app/api/order/create/route.ts` previously forwarded the request's `X-Forwarded-For`
header into the WooCommerce Store API calls (7 occurrences). That lets a client assert its
own IP to the backend. All of it has been removed; the backend now records the real
server-trusted IP.

## Offline verification

`tests/razorpay-verify.test.mjs` (10 cases) proves the real HMAC logic:
- a genuine signature verifies;
- an attacker-computed signature is rejected;
- a signature for the wrong order id or wrong payment id is rejected;
- case-insensitivity (Razorpay returns lowercase hex) still verifies;
- an unconfigured secret never yields `verified:true`.

All passing. See `QA_REPORTS/unit-test-evidence.json`.

## Live status — must not be overstated

I probed the **production** route:

```
POST https://www.ayurrakshaonline.com/api/razorpay/verify
  -> HTTP 404 (Next.js app shell, not the verify route)
```

So the verification endpoint is **not live yet** — the production build predates the fix.
Nothing about this being "shipped" is true until it is deployed. I have not deployed it
(that needs your approval and access), and I have not run a live payment.

## Before the next deploy (checklist)

1. Set `RAZORPAY_SECRET_KEY` in the server environment (server-only; must not ship to the
   client — `RAZORPAY_KEY_ID`/`NEXT_PUBLIC_RAZORPAY_KEY_ID` are the public publishable key,
   the secret is a different value from the Razorpay dashboard).
2. Redeploy; re-run `POST /api/razorpay/verify` with a **genuine** captured signature and
   confirm `verified:true`, then with a forged one and confirm `verified:false`.
3. Confirm the checkout still completes end-to-end on a sandbox/test key first, then live.

## Still recommended (defense-in-depth, not yet implemented)

The Standard-Checkout verification runs in the user's browser session, so it is only as
durable as that session. For a payment you can rely on across browser closes, add a
**Razorpay webhook** (server-to-server, signed by the gateway) that marks the order paid
in WooCommerce when `payment.captured` fires, and keep the `/api/razorpay/verify` route as
the user-facing confirmation. This requires the Razorpay dashboard to register the webhook
URL and supply the webhook secret — I have not done that and cannot without access.
