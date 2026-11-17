# 07 — Order Recording: Root Cause & Fix (2026-11-17)

## Symptom (reported)
Orders stopped appearing in WooCommerce **recently**. Customers see a generic
error at checkout. Backend order log shows missing orders while the site looked
fine.

## Live diagnosis (against production, 2026-11-17)

| Scenario (through deployed /api/order/create) | Result |
| --- | --- |
| Simple product COD (detox-tea) | ✅ 28413 recorded |
| Variable product with valid variantId (boozliv + 28305) | ✅ 28414 recorded |
| Combo cart ≥ ₹3,000 + COMBO3000 coupon gate | ✅ 28420 recorded |
| **Variable product, missing/stale variantId** | ❌ 400 "An item is unavailable or has an invalid quantity" — **nothing recorded** |

WooCommerce itself rejects the parent id of a variable product
(`woocommerce_rest_missing_attributes: "Missing attributes for variable
product"`). The old order route dropped such items and then rejected the entire
order.

## Why "started recently"
The shop-grid quick-add (`ProductCard.handleQuickAdd`) adds a product **without
a variantId**. For the three variable products (boozliv, booznil,
herbo-protein-powder) every such cart line — plus any localStorage cart that
carries a variant id that no longer matches the live catalog after a
WooCommerce re-save — killed the whole order. BoozLiv is the homepage hero
product, so this is a high-traffic failure path.

## Fix (working tree, 2026-11-17)
- `src/lib/orderItemResolution.ts` (new): pure, unit-tested rule
  `resolveItemVariant(type, variantDetails, requestedVariantId)`:
  - simple → parent id;
  - variable + valid in-stock requested pack → that exact pack (never a silent
    price swap);
  - variable + missing/stale pack → **fallback to first in-stock live
    variation** (the fix);
  - no live variation in stock → reject.
- `src/app/api/order/create/route.ts`: item resolution now delegates to that
  rule. Also guards `last_name` (WooCommerce rejects empty last_name; a
  single-word customer name previously fell through to `''`).
- `tests/order-item-resolution.test.mjs`: 10 unit cases (suite total now 46,
  all passing; `tsc --noEmit` clean).

## Verification
- Local dev route + **production CMS**: POST boozliv with no variantId →
  order **28421** recorded, status `processing` (books variation 28305, ₹2,400).
- Before the fix the identical payload returned 400 with no order.

## Residual risk / follow-ups
1. **Deploy**: the fix is in the working tree; production (www) still runs the
   old route until deployed. Until then, the failure continues for variable
   products.
2. **Cleanup**: diagnostic orders 28413, 28414, 28417, 28419, 28420, 28421 are
   marked "DIAGNOSTIC … safe to delete" (email
   orders@ayurrakshaonline.com, phone 9876543210, COD). Delete them from WP
   admin after this report is acknowledged.
3. **Frontend hardening (optional, separate change)**: give
   `ProductCard.handleQuickAdd` a live-variant lookup for variable products so
   the cart stores the real variant id/price instead of relying on the route's
   fallback. The route fallback is the safety net; this would improve the
   price shown in the cart (fallback books the default variation at its price,
   which matches the PDP default selection, so amounts are still correct).
4. **Stale out-of-stock items**: `cartContext` already purges localStorage
   lines whose bundled variant is out of stock, but live stock is only
   re-checked on the route. A cart item whose *live* stock flipped to false
   between session and checkout still 400s the order (intended, but a
   friendlier cart-level stock refresh would reduce support load).
