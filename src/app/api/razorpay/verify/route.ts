import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpayVerify';

/**
 * Razorpay Standard Checkout — server-side payment verification & WooCommerce sync.
 *
 * Verification Strategy:
 * 1. Primary: Constant-time HMAC-SHA256 signature verification when razorpay_order_id,
 *    razorpay_payment_id, and razorpay_signature are present.
 * 2. Resilient API Fallback: If razorpay_order_id or razorpay_signature is absent
 *    (e.g. orderless/legacy checkout) or HMAC verification fails, query Razorpay's
 *    official API (GET /v1/payments/:id) with Basic Auth to verify the payment's
 *    actual status ('captured' or 'authorized').
 *
 * WooCommerce Order Synchronization:
 * When payment is verified and a woocommerce_order_id is supplied, this route
 * immediately updates the WooCommerce order via WooCommerce REST API v3:
 *   - Status: 'processing'
 *   - Transaction ID: razorpay_payment_id
 *   - set_paid: true
 *   - Order note recording the payment confirmation
 * This transitions the order out of 'pending payment' in WooCommerce, triggers
 * customer notification emails, and queues clinical fulfillment.
 */

export const dynamic = 'force-dynamic';

const WORDPRESS_BASE = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://cms.ayurrakshaonline.com';

interface VerifyBody {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  woocommerce_order_id?: string | number;
}

interface VerifyResult {
  success: boolean;
  verified: boolean;
  /** 'verified' | 'invalid' | 'missing_fields' | 'unconfigured' | 'error' */
  reason: 'verified' | 'invalid' | 'missing_fields' | 'unconfigured' | 'error';
  paymentId?: string;
  orderId?: string;
  woocommerceOrderId?: string | number;
  woocommerceUpdated?: boolean;
  message?: string;
}

/**
 * Query Razorpay API directly to verify payment status when signature is absent
 * or to cross-verify. Returns true if status is 'captured' or 'authorized'.
 */
async function verifyViaRazorpayApi(paymentId: string, keyId: string, secretKey: string): Promise<boolean> {
  try {
    const auth = Buffer.from(`${keyId}:${secretKey}`).toString('base64');
    const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'User-Agent': 'AyurRaksha-NextJS/1.0',
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(`[RazorpayVerify] API check for ${paymentId} returned status ${res.status}`);
      return false;
    }

    const data = await res.json();
    return data.status === 'captured' || data.status === 'authorized';
  } catch (err) {
    console.error(`[RazorpayVerify] Error querying Razorpay API for ${paymentId}:`, err);
    return false;
  }
}

/**
 * Update WooCommerce order to 'processing' and attach payment transaction ID.
 */
async function markWooCommerceOrderPaid(
  wooOrderId: string | number,
  paymentId: string,
  razorpayOrderId?: string
): Promise<boolean> {
  const ck = process.env.WC_CONSUMER_KEY;
  const cs = process.env.WC_CONSUMER_SECRET;

  if (!ck || !cs) {
    console.warn('[RazorpayVerify] WC_CONSUMER_KEY or WC_CONSUMER_SECRET not configured; WooCommerce status update skipped.');
    return false;
  }

  const id = String(wooOrderId).trim();
  if (!id) return false;

  try {
    const auth = Buffer.from(`${ck}:${cs}`).toString('base64');

    // 1. Update order status to processing and set transaction id
    const updateRes = await fetch(`${WORDPRESS_BASE}/wp-json/wc/v3/orders/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'AyurRaksha-NextJS/1.0',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        status: 'processing',
        transaction_id: paymentId,
        set_paid: true,
      }),
      cache: 'no-store',
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text().catch(() => '');
      console.error(`[RazorpayVerify] Failed to update WooCommerce order #${id} (HTTP ${updateRes.status}):`, errText);
      return false;
    }

    // 2. Add an audit note to the order
    const noteText = razorpayOrderId
      ? `Payment verified via Razorpay Standard Checkout. Razorpay Order: ${razorpayOrderId}, Payment ID: ${paymentId}. Status updated to processing.`
      : `Payment verified via Razorpay. Payment ID: ${paymentId}. Status updated to processing.`;

    await fetch(`${WORDPRESS_BASE}/wp-json/wc/v3/orders/${encodeURIComponent(id)}/notes`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'User-Agent': 'AyurRaksha-NextJS/1.0',
      },
      body: JSON.stringify({
        note: noteText,
        customer_note: false,
      }),
      cache: 'no-store',
    }).catch((err) => console.warn('[RazorpayVerify] Could not add order note:', err));

    return true;
  } catch (err) {
    console.error(`[RazorpayVerify] Error updating WooCommerce order #${id}:`, err);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    let body: VerifyBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, verified: false, reason: 'missing_fields', message: 'Invalid JSON body' } as VerifyResult,
        { status: 400 }
      );
    }

    const orderId = String(body.razorpay_order_id || '').trim();
    const paymentId = String(body.razorpay_payment_id || '').trim();
    const signature = String(body.razorpay_signature || '').trim();
    const wooOrderId = body.woocommerce_order_id ? String(body.woocommerce_order_id).trim() : undefined;

    // Missing payment id: hard 400.
    if (!paymentId) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          reason: 'missing_fields',
          message: 'razorpay_payment_id is required',
        } as VerifyResult,
        { status: 400 }
      );
    }

    const secretKey = process.env.RAZORPAY_SECRET_KEY ?? '';
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_kWyXoOFkrDjUBk';

    let verified = false;
    let reason: VerifyResult['reason'] = 'invalid';

    // Strategy 1: HMAC signature verification (if order_id and signature are present)
    if (orderId && signature && secretKey) {
      const hmacResult = verifyRazorpaySignature({
        orderId,
        paymentId,
        signature,
        secret: secretKey,
      });

      if (hmacResult.verified) {
        verified = true;
        reason = 'verified';
      }
    }

    // Strategy 2: If signature verification was not possible (orderless mode or missing order_id/signature)
    // or signature check failed, verify directly via Razorpay API
    if (!verified && secretKey && keyId) {
      const apiVerified = await verifyViaRazorpayApi(paymentId, keyId, secretKey);
      if (apiVerified) {
        verified = true;
        reason = 'verified';
      }
    }

    // If still unverified and secret is unconfigured
    if (!verified && !secretKey) {
      reason = 'unconfigured';
    } else if (!verified && (!orderId || !signature) && !secretKey) {
      reason = 'missing_fields';
    }

    // Update WooCommerce order if payment is verified
    let woocommerceUpdated = false;
    if (verified && wooOrderId) {
      woocommerceUpdated = await markWooCommerceOrderPaid(wooOrderId, paymentId, orderId);
    }

    const payload: VerifyResult = {
      success: verified,
      verified,
      reason,
      paymentId,
      orderId,
      woocommerceOrderId: wooOrderId,
      woocommerceUpdated,
      message:
        reason === 'verified'
          ? (woocommerceUpdated
              ? 'Payment verified and WooCommerce order updated to processing.'
              : 'Payment signature verified.')
          : reason === 'unconfigured'
            ? 'Razorpay server-side verification is not configured (RAZORPAY_SECRET_KEY missing). The order is recorded; payment confirmation is pending.'
            : reason === 'invalid'
              ? 'Payment signature did not match.'
              : 'Missing fields for Razorpay signature verification.',
    };

    const status = reason === 'invalid' || reason === 'missing_fields' ? 400 : 200;
    return NextResponse.json(payload, { status });
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      {
        success: false,
        verified: false,
        reason: 'error',
        message: error.message || 'Verification error',
      } as VerifyResult,
      { status: 500 }
    );
  }
}

