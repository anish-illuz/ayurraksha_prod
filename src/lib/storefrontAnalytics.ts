import { Product, CartItem } from '@/types/product';
import { getCmsProductId } from '@/lib/metaProductMap';
import { trackMetaEvent, MetaUserData } from '@/lib/metaPixel';

/**
 * AyurRaksha Storefront E-Commerce Analytics Dispatcher
 *
 * Dispatches standard GA4 e-commerce events and Meta Pixel standard events
 * synchronized with Meta Conversions API (CAPI) and strict deduplication guards.
 *
 * Product IDs are normalized to canonical WooCommerce CMS Product IDs (85-124)
 * ensuring 100% ID matching between:
 * 1. Meta Product Catalogue feed
 * 2. Meta Pixel browser events
 * 3. Meta Conversions API server events
 */

interface OrderItemSummary {
  product?: { id: number; slug?: string; name: string; categories?: string[] };
  id?: number;
  slug?: string;
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
  customerName?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

function getSafeWindow(): any {
  if (typeof window === 'undefined') return null;
  return window as any;
}

/**
 * GA4 / GTM / Meta Pixel: ViewContent (view_item)
 * Triggered on Product Detail Page (PDP) view
 */
export function trackViewItem(product: Product): void {
  const win = getSafeWindow();
  if (!win) return;

  const cmsId = getCmsProductId(product);
  const itemCategory = product.healthConcerns?.[0] || product.categories?.[0] || 'Ayurvedic Formulations';
  const itemData = {
    item_id: cmsId,
    item_name: product.name,
    item_category: itemCategory,
    price: product.price,
    quantity: 1,
  };

  try {
    // 1. Google Tag Manager dataLayer
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

    // 2. Google Analytics 4
    if (typeof win.gtag === 'function') {
      win.gtag('event', 'view_item', {
        currency: 'INR',
        value: product.price,
        items: [itemData],
      });
    }

    // 3. Meta Pixel & Conversions API (deduplicated)
    trackMetaEvent('ViewContent', {
      content_name: product.name,
      content_category: itemCategory,
      content_ids: [cmsId],
      content_type: 'product',
      value: product.price,
      currency: 'INR',
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics] ViewContent tracked for product ${cmsId} (${product.name}):`, itemData);
    }
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
}

/**
 * GA4 / GTM / Meta Pixel: AddToCart (add_to_cart)
 * Triggered only after a product is successfully added to the cart
 */
export function trackAddToCart(
  product: Product,
  quantity = 1,
  variantName?: string,
  price?: number
): void {
  const win = getSafeWindow();
  if (!win) return;

  const cmsId = getCmsProductId(product);
  const itemPrice = price ?? product.price;
  const itemCategory = product.healthConcerns?.[0] || product.categories?.[0] || 'Ayurvedic Formulations';
  const itemData = {
    item_id: cmsId,
    item_name: product.name,
    item_variant: variantName || 'Standard',
    item_category: itemCategory,
    price: itemPrice,
    quantity,
  };

  try {
    // 1. Google Tag Manager dataLayer
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

    // 2. Google Analytics 4
    if (typeof win.gtag === 'function') {
      win.gtag('event', 'add_to_cart', {
        currency: 'INR',
        value: itemPrice * quantity,
        items: [itemData],
      });
    }

    // 3. Meta Pixel & Conversions API (deduplicated)
    trackMetaEvent('AddToCart', {
      content_name: product.name,
      content_category: itemCategory,
      content_ids: [cmsId],
      content_type: 'product',
      contents: [
        {
          id: cmsId,
          quantity,
          item_price: itemPrice,
        },
      ],
      value: itemPrice * quantity,
      currency: 'INR',
      num_items: quantity,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics] AddToCart tracked for product ${cmsId} (${product.name}):`, itemData);
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

  const cmsId = getCmsProductId(product);
  const itemData = {
    item_id: cmsId,
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
 * GA4 / GTM / Meta Pixel: InitiateCheckout (begin_checkout)
 * Triggered when a customer navigates to checkout or initiates checkout with items
 */
export function trackBeginCheckout(items: CartItem[], totalAmount: number): void {
  const win = getSafeWindow();
  if (!win || !items.length) return;

  const formattedItems = items.map((item) => {
    const cmsId = getCmsProductId(item.product);
    return {
      item_id: cmsId,
      item_name: item.product.name,
      item_variant: item.selectedVariant || 'Standard',
      price: item.variantPrice ?? item.product.price,
      quantity: item.quantity,
    };
  });

  const contentIds = formattedItems.map((i) => i.item_id);
  const contents = formattedItems.map((i) => ({
    id: i.item_id,
    quantity: i.quantity,
    item_price: i.price,
  }));
  const numItems = formattedItems.reduce((sum, i) => sum + i.quantity, 0);

  try {
    // 1. Google Tag Manager dataLayer
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

    // 2. Google Analytics 4
    if (typeof win.gtag === 'function') {
      win.gtag('event', 'begin_checkout', {
        currency: 'INR',
        value: totalAmount,
        items: formattedItems,
      });
    }

    // 3. Meta Pixel & Conversions API (deduplicated)
    trackMetaEvent('InitiateCheckout', {
      content_ids: contentIds,
      contents,
      value: totalAmount,
      currency: 'INR',
      num_items: numItems,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('[Analytics] InitiateCheckout tracked:', totalAmount, formattedItems);
    }
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
}

/**
 * GA4 / GTM / Meta Pixel: Purchase
 * Triggered ONLY after backend confirms payment or order completion.
 * Enforces strict session and order deduplication with a shared event_id.
 */
export function trackPurchase(order: PurchasePayload): void {
  const win = getSafeWindow();
  if (!win) return;

  const orderId = String(order.orderId);
  const dedupeKey = `ayurraksha_tracked_purchase_${orderId}`;

  // Strict browser deduplication guard
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
    const cmsId = getCmsProductId(item.product || { id: item.id, slug: item.slug });
    const name = item.product?.name || item.name || `Ayurvedic Formulation #${cmsId}`;
    const price = item.variantPrice ?? item.price ?? 0;
    return {
      item_id: cmsId,
      item_name: name,
      price,
      quantity: item.quantity || 1,
    };
  });

  const contentIds = formattedItems.map((i) => i.item_id);
  const contents = formattedItems.map((i) => ({
    id: i.item_id,
    quantity: i.quantity,
    item_price: i.price,
  }));
  const numItems = formattedItems.reduce((sum, i) => sum + i.quantity, 0);

  // Stable event ID for exact browser and server deduplication
  const eventId = `purchase_${orderId}`;

  const userData: MetaUserData = {
    email: order.customerEmail,
    phone: order.customerPhone,
    firstName: order.customerName,
    city: order.city,
    state: order.state,
    zip: order.pincode,
    country: 'IN',
    externalId: orderId,
  };

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

    // 3. Meta Pixel & Conversions API (deduplicated via eventId)
    trackMetaEvent(
      'Purchase',
      {
        content_ids: contentIds,
        content_type: 'product',
        contents,
        value: order.totalAmount,
        currency: 'INR',
        num_items: numItems,
        order_id: orderId,
      },
      userData,
      eventId
    );

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics] Purchase SUCCESS for Order #${orderId} (eventID: ${eventId}):`, order);
    }
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
}

/**
 * Meta Pixel & GA4: Search
 * Track product searches
 */
export function trackSearch(query: string, resultCount?: number): void {
  const win = getSafeWindow();
  if (!win || !query.trim()) return;

  try {
    if (typeof win.gtag === 'function') {
      win.gtag('event', 'search', {
        search_term: query,
      });
    }

    trackMetaEvent('Search', {
      search_string: query,
      content_type: 'product',
      num_items: resultCount,
    });
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
}

/**
 * Meta Pixel & GA4: Lead
 * Track contact form and clinical inquiry submissions
 */
export function trackLead(leadType: string, userData?: MetaUserData): void {
  const win = getSafeWindow();
  if (!win) return;

  try {
    if (typeof win.gtag === 'function') {
      win.gtag('event', 'generate_lead', {
        lead_type: leadType,
      });
    }

    trackMetaEvent(
      'Lead',
      {
        content_name: leadType,
        status: 'submitted',
      },
      userData
    );
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
}
