/**
 * Razorpay Standard Checkout — pure signature-verification helper.
 *
 * Kept free of framework imports so the exact HMAC logic the live
 * `/api/razorpay/verify` route relies on can be unit-tested directly and reused
 * (e.g. by a webhook handler). The route wires this to an HTTP boundary.
 *
 * Standard Checkout proof-of-payment:
 *   signature = HMAC_SHA256( `${order_id}|${payment_id}` , RAZORPAY_SECRET_KEY )
 *
 * The secret is server-only. When it is not configured, the result is an
 * honest "unconfigured" — never a false "verified".
 */
import crypto from 'crypto';

export interface RazorpayVerifyInput {
  orderId: string;
  paymentId: string;
  signature: string;
  secret: string;
}

export type RazorpayVerifyReason = 'verified' | 'invalid' | 'missing_fields' | 'unconfigured';

export interface RazorpayVerifyResult {
  verified: boolean;
  reason: RazorpayVerifyReason;
}

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/**
 * Verify a Razorpay Standard Checkout response. Pure and deterministic.
 */
export function verifyRazorpaySignature(input: RazorpayVerifyInput): RazorpayVerifyResult {
  const orderId = String(input.orderId || '').trim();
  const paymentId = String(input.paymentId || '').trim();
  const signature = String(input.signature || '').trim();
  const secret = String(input.secret || '').trim();

  // No payment id -> nothing to verify.
  if (!paymentId) return { verified: false, reason: 'missing_fields' };
  // Standard Checkout requires the order id to bind the signature.
  if (!orderId) return { verified: false, reason: 'missing_fields' };
  if (!signature) return { verified: false, reason: 'missing_fields' };
  // Without the secret we cannot prove the payment. Never claim verified.
  if (!secret) return { verified: false, reason: 'unconfigured' };

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  // Normalize case and compare in constant time to avoid a timing oracle.
  const ok = constantTimeEqual(expected, signature.toLowerCase());
  return { verified: ok, reason: ok ? 'verified' : 'invalid' };
}
