/**
 * Order-route item -> WooCommerce id/price resolution (pure, framework-free).
 *
 * The order route must send WooCommerce a product id it actually accepts:
 *
 *  - Simple product: the parent product id.
 *  - Variable product: a live variation id, NOT the parent id. The Store API
 *    rejects a variable product's parent id with
 *    "Missing attributes for variable product", which makes the whole order
 *    400 and no order is recorded.
 *
 * Cart items can reach the route with a missing or stale variantId:
 *  - shop-grid quick-add (ProductCard) adds the product with no variantId;
 *  - localStorage carts saved before a WooCommerce re-save carry old
 *    variation ids that no longer match the live catalog;
 *  - the bundled products.json can still describe a product as "simple"
 *    (no variants) while the live product is variable.
 *
 * Rule (kept identical to the pre-fix route behavior except where noted):
 *  1. Simple product -> use the parent id.
 *  2. Variable + requested variantId matches a live in-stock variation ->
 *     use exactly that variation (the customer's chosen pack).
 *  3. Variable + requested variantId missing or out of stock -> REJECT
 *     (return null). We never silently swap an explicitly chosen pack for
 *     another one, because that would charge a different price than the
 *     customer saw.
 *  4. Variable + no variantId at all -> fall back to the default in-stock
 *     live variation (first in-stock, else first). This is the fix: a
 *     variable-product item without a pack no longer kills the whole order.
 *
 * 5. No live variation is in stock -> reject.
 */

export interface LiveVariant {
  id: number;
  price?: number;
  inStock: boolean;
  variationLabel?: string;
}

export type ResolvedItemTarget =
  | { useParent: true }
  | { useParent: false; variantId: number; price?: number; label?: string };

export function resolveItemVariant(
  productType: string,
  variantDetails: readonly LiveVariant[],
  requestedVariantId?: number | null,
): ResolvedItemTarget | null {
  if (productType !== 'variable') return { useParent: true };

  if (requestedVariantId !== undefined && requestedVariantId !== null) {
    const requested = variantDetails.find((v) => v.id === requestedVariantId);
    if (!requested || !requested.inStock) return null;
    return { useParent: false, variantId: requested.id, price: requested.price, label: requested.variationLabel };
  }

  const fallback = variantDetails.find((v) => v.inStock) || variantDetails[0];
  if (!fallback || !fallback.inStock) return null;
  return { useParent: false, variantId: fallback.id, price: fallback.price, label: fallback.variationLabel };
}
