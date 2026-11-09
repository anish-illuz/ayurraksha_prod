/**
 * AyurRaksha Meta Pixel & Conversions API Tracking Utility
 *
 * Implements:
 * 1. Global Meta Pixel client-side dispatch with event_id
 * 2. Automatic _fbp and _fbc cookie resolution
 * 3. Client-to-server CAPI bridging for true deduplicated tracking
 * 4. Safe browser guards (SSR-safe, React 18/19 compatible)
 */

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || '3646833112247628';

/**
 * Generate a cryptographically random or high-entropy event_id
 * for browser Pixel and server-side Conversions API deduplication.
 */
export function generateEventId(prefix = 'evt'): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${timestamp}_${randomStr}`;
}

/**
 * Read cookie value by name in browser context
 */
export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : undefined;
}

/**
 * Extract or compute Meta _fbc click ID cookie
 * If fbclid query param is in the URL, create or return formatted _fbc
 */
export function getFbc(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const existingCookie = getCookie('_fbc');
  if (existingCookie) return existingCookie;

  try {
    const params = new URLSearchParams(window.location.search);
    const fbclid = params.get('fbclid');
    if (fbclid) {
      const creationTime = Date.now();
      return `fb.1.${creationTime}.${fbclid}`;
    }
  } catch {
    // Ignore URL parse errors
  }
  return undefined;
}

/**
 * Extract Meta _fbp browser ID cookie
 */
export function getFbp(): string | undefined {
  return getCookie('_fbp');
}

/**
 * Customer information for Advanced Matching
 */
export interface MetaUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  externalId?: string;
}

export interface MetaCustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: 'product' | 'product_group';
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
  num_items?: number;
  order_id?: string;
  search_string?: string;
  status?: string;
  [key: string]: any;
}

/**
 * Dispatches an event to the browser Meta Pixel (window.fbq)
 * with the provided eventID for deduplication.
 */
export function trackMetaPixelEvent(
  eventName: string,
  customData: MetaCustomData = {},
  eventId?: string
): void {
  if (typeof window === 'undefined') return;

  const win = window as any;
  if (typeof win.fbq !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[Meta Pixel] fbq not available for event: ${eventName}`);
    }
    return;
  }

  try {
    const options = eventId ? { eventID: eventId } : undefined;
    win.fbq('track', eventName, customData, options);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Meta Pixel] track '${eventName}' (eventID: ${eventId || 'none'}):`, customData);
    }
  } catch (err) {
    console.warn(`[Meta Pixel] Error dispatching event: ${eventName}`, err);
  }
}

/**
 * Forwards an event to the Next.js server-side Conversions API route
 * (/api/meta/conversions) asynchronously.
 */
export async function dispatchServerConversion(
  eventName: string,
  eventId: string,
  customData: MetaCustomData = {},
  userData: MetaUserData = {}
): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const fbp = getFbp();
    const fbc = getFbc();
    const eventSourceUrl = window.location.href;

    // Send in background without blocking main execution thread
    fetch('/api/meta/conversions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        eventId,
        eventTime: Math.floor(Date.now() / 1000),
        eventSourceUrl,
        userData: {
          ...userData,
          fbp,
          fbc,
        },
        customData,
      }),
      keepalive: true, // Ensures request completes even if user navigates
    }).catch((err) => {
      // Graceful error logging in dev
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[Meta CAPI] Server dispatch failed:`, err);
      }
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[Meta CAPI Error]`, err);
    }
  }
}

/**
 * Unified Meta Event Tracker
 * Sends the event to BOTH the client-side Meta Pixel AND server-side Conversions API
 * using the EXACT same event_id for 100% accurate deduplication.
 */
export function trackMetaEvent(
  eventName: string,
  customData: MetaCustomData = {},
  userData: MetaUserData = {},
  explicitEventId?: string
): string {
  const eventId = explicitEventId || generateEventId(eventName.toLowerCase().replace(/[^a-z0-9]/g, ''));

  // 1. Client-side Meta Pixel with eventID
  trackMetaPixelEvent(eventName, customData, eventId);

  // 2. Server-side Conversions API with identical eventID
  dispatchServerConversion(eventName, eventId, customData, userData);

  return eventId;
}
