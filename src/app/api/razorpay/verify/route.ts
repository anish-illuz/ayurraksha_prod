import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpayVerify';

/**
 * Razorpay Standard Checkout — server-side signature verification.
 *
 * The Standard Checkout SDK returns { razorpay_order_id, razorpay_payment_id,
 * razorpay_signature } to the browser on success. That response is NOT trusted:
 * a malicious client can forge it. The only trustworthy proof that a payment
 * happened is the HMAC-SHA256 signature Razorpay computes server-side, which
 * this route recomputes with the secret key (server-only) and compares.
 *
 * The HMAC logic lives in lib/razorpayVerify (pure, framework-free) so it is
 * unit-tested directly and reusable by a webhook handler. This file is only the
 * HTTP boundary.
 *
 * Safe when RAZORPAY_SECRET_KEY is not configured: returns a structured
 * "unconfigured" result (never a false "verified") so the checkout UI can show
 * an honest "verification pending" state instead of claiming a paid order.
 */

export const dynamic = 'force-dynamic';

interface VerifyBody {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

interface VerifyResult {
  success: boolean;
  verified: boolean;
  /** 'verified' | 'invalid' | 'missing_fields' | 'unconfigured' | 'error' */
  reason: 'verified' | 'invalid' | 'missing_fields' | 'unconfigured' | 'error';
  paymentId?: string;
  orderId?: string;
  message?: string;
}

export async function POST(req: Request) {
  try {
    let body: VerifyBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, verified: false, reason: 'missing_fields', error: 'Invalid JSON body' } as VerifyResult,
        { status: 400 }
      );
    }

    const orderId = String(body.razorpay_order_id || '').trim();
    const paymentId = String(body.razorpay_payment_id || '').trim();
    const signature = String(body.razorpay_signature || '').trim();

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

    const result = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature,
      secret: process.env.RAZORPAY_SECRET_KEY ?? '',
    });

    const payload: VerifyResult = {
      success: result.verified,
      verified: result.verified,
      reason: result.reason,
      paymentId,
      orderId,
      message:
        result.reason === 'verified'
          ? 'Payment signature verified.'
          : result.reason === 'unconfigured'
            ? 'Razorpay server-side verification is not configured (RAZORPAY_SECRET_KEY missing). The order is recorded; payment confirmation is pending.'
            : result.reason === 'invalid'
              ? 'Payment signature did not match.'
              : 'Missing fields for Razorpay signature verification.',
    };

    // Field-missing and unconfigured still 200 (the order may be valid, just
    // unconfirmable); an actual mismatch is a 400 client error.
    const status = result.reason === 'invalid' || result.reason === 'missing_fields' ? 400 : 200;
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
