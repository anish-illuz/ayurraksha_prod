import { Product, CartItem } from '@/types/product';

/**
 * AyurRaksha Storefront E-Commerce Analytics Dispatcher
 * Dispatches standard GA4 e-commerce events and Meta Pixel events
 * with strict deduplication guards to prevent duplicate transactions.
 */

interface OrderItemSummary {
  product?: { id: number; name: string; categories?: string[] };
  id?: number;
  name?: string;
  quantity: number;
  price?: number;
  variantPrice?: number;
}

export interface PurchasePayload {
  orderId: string;
  paymentId?: string;
  paymentMethod: 'razorpay' | 'cod';
  totalAmount: number;
  items: OrderItemSummary[];
  customerEmail?: string;
  customerPhone?: string;
}

function getSafeWindow(): any {
  if (typeof window === 'undefined') return null;
  return window as any;
}

/**
 * GA4 / GTM / Meta Pixel: view_item
 */
export function trackViewItem(product: Product): void {
  const win = getSafeWindow();
  if (!win) return;

  const itemCategory = product.healthConcerns?.[0] || product.categories?.[0] || 'Ayurvedic Formulations';
  const itemData = {
    item_id: String(product.id),
    item_name: product.name,
    item_category: itemCategory,
    price: product.price,
    quantity: 1,
  };

  try {
    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({
        event: 'view_item',
        ecommerce: {
          currency: 'INR',
          value: product.price,
          items: [itemData],
        },
      });
    }

    if (typeof win.gtag === 'function') {
      win.gtag('event', 'view_item', {
        currency: 'INR',
        value: product.price,
        items: [itemData],
      });
    }

    if (typeof win.fbq === 'function') {
      win.fbq('track', 'ViewContent', {
        content_name: product.name,
        content_ids: [String(product.id)],
        content_type: 'product',
        value: product.price,
        currency: 'INR',
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('[Analytics] view_item:', itemData);
    }
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
}

/**
 * GA4 / GTM / Meta Pixel: add_to_cart
 */
export function trackAddToCart(
  product: Product,
  quantity = 1,
  variantName?: string,
  price?: number
): void {
  const win = getSafeWindow();
  if (!win) return;

  const itemPrice = price ?? product.price;
  const itemData = {
    item_id: String(product.id),
    item_name: product.name,
    item_variant: variantName || 'Standard',
    item_category: product.healthConcerns?.[0] || product.categories?.[0] || 'Ayurvedic Formulations',
    price: itemPrice,
    quantity,
  };

  try {
    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          currency: 'INR',
          value: itemPrice * quantity,
          items: [itemData],
        },
      });
    }

    if (typeof win.gtag === 'function') {
      win.gtag('event', 'add_to_cart', {
        currency: 'INR',
        value: itemPrice * quantity,
        items: [itemData],
      });
    }

    if (typeof win.fbq === 'function') {
      win.fbq('track', 'AddToCart', {
        content_name: product.name,
        content_ids: [String(product.id)],
        content_type: 'product',
        value: itemPrice * quantity,
        currency: 'INR',
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('[Analytics] add_to_cart:', itemData);
    }
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
}

/**
 * GA4 / GTM: remove_from_cart
 */
export function trackRemoveFromCart(
  product: Product,
  quantity = 1,
  variantName?: string
): void {
  const win = getSafeWindow();
  if (!win) return;

  const itemData = {
    item_id: String(product.id),
    item_name: product.name,
    item_variant: variantName || 'Standard',
    price: product.price,
    quantity,
  };

  try {
    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({
        event: 'remove_from_cart',
        ecommerce: {
          currency: 'INR',
          value: product.price * quantity,
          items: [itemData],
        },
      });
    }

    if (typeof win.gtag === 'function') {
      win.gtag('event', 'remove_from_cart', {
        currency: 'INR',
        value: product.price * quantity,
        items: [itemData],
      });
    }
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
}

/**
 * GA4 / GTM / Meta Pixel: begin_checkout
 */
export function trackBeginCheckout(items: CartItem[], totalAmount: number): void {
  const win = getSafeWindow();
  if (!win || !items.length) return;

  const formattedItems = items.map((item) => ({
    item_id: String(item.product.id),
    item_name: item.product.name,
    item_variant: item.selectedVariant || 'Standard',
    price: item.variantPrice ?? item.product.price,
    quantity: item.quantity,
  }));

  try {
    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({
        event: 'begin_checkout',
        ecommerce: {
          currency: 'INR',
          value: totalAmount,
          items: formattedItems,
        },
      });
    }

    if (typeof win.gtag === 'function') {
      win.gtag('event', 'begin_checkout', {
        currency: 'INR',
        value: totalAmount,
        items: formattedItems,
      });
    }

    if (typeof win.fbq === 'function') {
      win.fbq('track', 'InitiateCheckout', {
        value: totalAmount,
        currency: 'INR',
        num_items: items.reduce((sum, i) => sum + i.quantity, 0),
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('[Analytics] begin_checkout:', totalAmount, formattedItems);
    }
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
}

/**
 * GA4 / GTM / Meta Pixel: purchase (with strict session deduplication)
 */
export function trackPurchase(order: PurchasePayload): void {
  const win = getSafeWindow();
  if (!win) return;

  const orderId = String(order.orderId);
  const dedupeKey = `ayurraksha_tracked_purchase_${orderId}`;

  // Strict deduplication guard
  try {
    if (sessionStorage.getItem(dedupeKey) === 'true') {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[Analytics] Purchase event already tracked for Order #${orderId}. Suppressing duplicate.`);
      }
      return;
    }
    sessionStorage.setItem(dedupeKey, 'true');
  } catch {
    // Continue even if sessionStorage is blocked
  }

  const formattedItems = order.items.map((item) => {
    const id = item.product?.id || item.id || 0;
    const name = item.product?.name || item.name || 'Ayurvedic Product';
    const price = item.variantPrice ?? item.price ?? 0;
    return {
      item_id: String(id),
      item_name: name,
      price,
      quantity: item.quantity || 1,
    };
  });

  try {
    // 1. Google Tag Manager dataLayer
    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({
        event: 'purchase',
        ecommerce: {
          transaction_id: orderId,
          value: order.totalAmount,
          currency: 'INR',
          tax: 0,
          shipping: order.paymentMethod === 'cod' ? 100 : 0,
          items: formattedItems,
        },
      });
    }

    // 2. Google Analytics 4
    if (typeof win.gtag === 'function') {
      win.gtag('event', 'purchase', {
        transaction_id: orderId,
        value: order.totalAmount,
        currency: 'INR',
        tax: 0,
        shipping: order.paymentMethod === 'cod' ? 100 : 0,
        items: formattedItems,
      });
    }

    // 3. Meta Pixel
    if (typeof win.fbq === 'function') {
      win.fbq('track', 'Purchase', {
        value: order.totalAmount,
        currency: 'INR',
        content_type: 'product',
        contents: formattedItems.map((i) => ({ id: i.item_id, quantity: i.quantity })),
      });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics] Purchase SUCCESS for Order #${orderId}:`, order);
    }
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
}
