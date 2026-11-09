import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Meta Conversions API (CAPI) Server Route
 * Endpoint: POST /api/meta/conversions
 *
 * Implements:
 * 1. Secure server-to-server dispatch to Meta Graph API v19.0
 * 2. SHA-256 hashing for all customer data (email, phone, name, city, state, zip, country)
 * 3. Client IP and User-Agent capture from incoming headers
 * 4. Deduplication matching with browser Pixel eventID
 * 5. In-memory Purchase deduplication guard to prevent duplicate transaction calls
 * 6. Protection of Meta Access Token (never sent to client)
 */

const META_PIXEL_ID =
  process.env.META_PIXEL_ID ||
  process.env.NEXT_PUBLIC_META_PIXEL_ID ||
  '3646833112247628';

const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

// In-memory cache to prevent duplicate purchase events from triggering multiple CAPI calls
const processedPurchases = new Set<string>();

/**
 * Normalizes and computes SHA-256 hash according to Meta specifications
 */
function hashParam(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Normalizes phone numbers (removes non-digits, ensures country code)
 */
function hashPhone(phone: string | undefined | null): string | undefined {
  if (!phone) return undefined;
  // Strip all non-digit characters
  let digits = phone.replace(/\D/g, '');
  // Default to Indian country code 91 if 10-digit number
  if (digits.length === 10) {
    digits = `91${digits}`;
  }
  return crypto.createHash('sha256').update(digits).digest('hex');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventName, eventId, eventTime, eventSourceUrl, userData = {}, customData = {} } = body;

    if (!eventName || !eventId) {
      return NextResponse.json(
        { success: false, error: 'Missing required eventName or eventId' },
        { status: 400 }
      );
    }

    // Purchase deduplication guard
    if (eventName === 'Purchase' && customData.order_id) {
      const orderKey = `order_${customData.order_id}`;
      if (processedPurchases.has(orderKey)) {
        return NextResponse.json({
          success: true,
          status: 'deduplicated',
          message: `Purchase event for order ${customData.order_id} already sent to CAPI.`,
        });
      }
      processedPurchases.add(orderKey);
      // Keep set bounded
      if (processedPurchases.size > 2000) {
        const oldest = processedPurchases.values().next().value;
        if (oldest) processedPurchases.delete(oldest);
      }
    }

    // Extract network and browser context
    const headerUserAgent = req.headers.get('user-agent') || 'Mozilla/5.0';
    const forwardedFor = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '';

    // Prepare hashed user_data
    const normalizedUserData: Record<string, any> = {
      client_ip_address: clientIp || undefined,
      client_user_agent: headerUserAgent,
    };

    if (userData.email) {
      normalizedUserData.em = [hashParam(userData.email)];
    }
    if (userData.phone) {
      normalizedUserData.ph = [hashPhone(userData.phone)];
    }
    if (userData.firstName) {
      normalizedUserData.fn = [hashParam(userData.firstName)];
    }
    if (userData.lastName) {
      normalizedUserData.ln = [hashParam(userData.lastName)];
    }
    if (userData.city) {
      normalizedUserData.ct = [hashParam(userData.city)];
    }
    if (userData.state) {
      normalizedUserData.st = [hashParam(userData.state)];
    }
    if (userData.zip) {
      normalizedUserData.zp = [hashParam(userData.zip)];
    }
    if (userData.country) {
      normalizedUserData.country = [hashParam(userData.country || 'in')];
    }
    if (userData.externalId) {
      normalizedUserData.external_id = [hashParam(String(userData.externalId))];
    }
    if (userData.fbp) {
      normalizedUserData.fbp = userData.fbp;
    }
    if (userData.fbc) {
      normalizedUserData.fbc = userData.fbc;
    }

    // Build the Meta Conversions API event payload
    const eventPayload: Record<string, any> = {
      event_name: eventName,
      event_time: eventTime || Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: eventSourceUrl || 'https://ayurrakshaonline.com/',
      action_source: 'website',
      user_data: normalizedUserData,
      custom_data: {
        ...customData,
        currency: customData.currency || 'INR',
      },
    };

    // If Meta Access Token is configured, dispatch directly to Meta Graph API
    if (META_ACCESS_TOKEN) {
      const graphApiUrl = `https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`;

      const metaRequestPayload: Record<string, any> = {
        data: [eventPayload],
      };

      if (META_TEST_EVENT_CODE) {
        metaRequestPayload.test_event_code = META_TEST_EVENT_CODE;
      }

      const metaRes = await fetch(graphApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AyurRaksha-ConversionsAPI/2.0',
        },
        body: JSON.stringify(metaRequestPayload),
      });

      const metaResult = await metaRes.json().catch(() => ({}));

      if (!metaRes.ok) {
        console.error('[Meta CAPI Error]', metaResult);
        return NextResponse.json(
          {
            success: false,
            error: metaResult.error?.message || 'Meta CAPI request failed',
            eventId,
          },
          { status: metaRes.status }
        );
      }

      return NextResponse.json({
        success: true,
        events_received: metaResult.events_received || 1,
        fbtrace_id: metaResult.fbtrace_id,
        eventId,
      });
    }

    // If token is awaiting configuration, log gracefully and return success
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Meta CAPI] Prepared payload (awaiting META_ACCESS_TOKEN):`, eventPayload);
    }

    return NextResponse.json({
      success: true,
      status: 'queued_pending_token',
      eventId,
      message: 'CAPI payload successfully constructed. Awaiting META_ACCESS_TOKEN in production environment.',
    });
  } catch (error: any) {
    console.error('Error in Conversions API route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal CAPI error' },
      { status: 500 }
    );
  }
}
