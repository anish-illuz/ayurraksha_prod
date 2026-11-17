/**
 * Combo Builder volume-discount pricing — single source of truth.
 *
 * The combo discount is a real WooCommerce percent coupon (COMBO3000 /
 * COMBO5000) that the order route applies to the cart so the backend order
 * total equals the amount the front-end charges via Razorpay. All tiers are
 * evaluated in PAISE (minor units) to avoid rupee rounding drift.
 *
 * Both the front-end (cart/checkout display) and the server (order creation)
 * import this module so the tier rule lives in exactly one place.
 *
 *  - Combo value above ₹5,000 -> 15% off (coupon COMBO5000)
 *  - Combo value above ₹3,000 -> 10% off (coupon COMBO3000)
 *  - Otherwise -> no combo discount
 *  Single tier only; tiers never stack.
 */

export interface ComboTier {
  /** Inclusive lower bound, in paise. */
  thresholdPaise: number;
  coupon: string;
  percent: number;
}

/** Ordered highest-first so the first match is the top applicable tier. */
export const COMBO_TIERS: readonly ComboTier[] = [
  { thresholdPaise: 500000, coupon: 'COMBO5000', percent: 15 }, // ₹5,000
  { thresholdPaise: 300000, coupon: 'COMBO3000', percent: 10 }, // ₹3,000
];

export interface ComboPricedLine {
  price: number;
  quantity: number;
  isComboItem?: boolean;
}

/**
 * Sum the combo-eligible line items in paise. Non-combo items are ignored.
 * Each line is floored to whole paise (Math.round of rupees*100) exactly as
 * the live code does, so this mirrors the on-screen charge.
 */
export function comboSubtotalPaise(items: readonly ComboPricedLine[]): number {
  let total = 0;
  for (const item of items) {
    if (!item.isComboItem) continue;
    total += Math.round(item.price * 100) * item.quantity;
  }
  return total;
}

/**
 * Pick the applicable combo tier for a given combo subtotal (paise).
 * Returns the top matching tier (highest threshold first) or null.
 */
export function comboCouponFor(subtotalPaise: number): ComboTier | null {
  for (const tier of COMBO_TIERS) {
    if (subtotalPaise >= tier.thresholdPaise) return tier;
  }
  return null;
}

/** Discount in whole-rupees for a combo subtotal (paise). 0 when no tier applies. */
export function comboDiscountRupees(subtotalPaise: number): number {
  const tier = comboCouponFor(subtotalPaise);
  if (!tier) return 0;
  return Math.round((subtotalPaise * tier.percent) / 100) / 100;
}

/** Percent discount (0 when no tier applies). */
export function comboDiscountPercent(subtotalPaise: number): number {
  return comboCouponFor(subtotalPaise)?.percent ?? 0;
}
