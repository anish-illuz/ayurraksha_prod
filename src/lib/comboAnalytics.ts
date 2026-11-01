/**
 * Combo Builder Analytics Dispatcher
 * Tracks all 10 required events from the Developer Brief:
 * - select_concern
 * - video_play
 * - video_language
 * - view_product
 * - add_item
 * - remove_item
 * - consult_click
 * - view_combo
 * - add_combo_to_cart
 * - begin_checkout
 */

export type ComboAnalyticsEvent =
  | { event: 'select_concern'; concern_id: string; concern_name: string }
  | { event: 'video_play'; language: string; is_master: boolean }
  | { event: 'video_language'; language: string; available: boolean }
  | { event: 'view_product'; product_id: number; product_name: string; category: string }
  | { event: 'add_item'; product_id: number; product_name: string; price: number | null; quantity: number }
  | { event: 'remove_item'; product_id: number; product_name: string }
  | { event: 'consult_click'; placement: string; current_concern?: string; cart_count?: number }
  | { event: 'view_combo'; item_count: number; total_amount: number; has_pending_items: boolean }
  | { event: 'add_combo_to_cart'; item_count: number; total_amount: number; items: { id: number; name: string; quantity: number }[] }
  | { event: 'begin_checkout'; item_count: number; total_amount: number };

export function trackComboEvent(payload: ComboAnalyticsEvent): void {
  if (typeof window === 'undefined') return;

  try {
    // 1. Google Tag Manager / dataLayer if present
    const win = window as any;
    if (Array.isArray(win.dataLayer)) {
      win.dataLayer.push({
        ...payload,
      });
    }

    // 2. Google Analytics (gtag) if present
    if (typeof win.gtag === 'function') {
      const { event, ...rest } = payload;
      win.gtag('event', event, rest);
    }

    // 3. Meta Pixel (fbq) if present
    if (typeof win.fbq === 'function') {
      if (payload.event === 'add_combo_to_cart') {
        win.fbq('track', 'AddToCart', {
          content_type: 'product_group',
          value: payload.total_amount,
          currency: 'INR',
          num_items: payload.item_count,
        });
      } else if (payload.event === 'begin_checkout') {
        win.fbq('track', 'InitiateCheckout', {
          value: payload.total_amount,
          currency: 'INR',
          num_items: payload.item_count,
        });
      }
    }

    // Development logging
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[ComboBuilder Analytics]`, payload.event, payload);
    }
  } catch (err) {
    console.warn('[Analytics Error]', err);
  }
}
