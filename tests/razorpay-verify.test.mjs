/**
 * Unit tests for Razorpay Standard Checkout server-side signature verification.
 *
 * These exercise the REAL pure source (src/lib/razorpayVerify.ts) — the same
 * HMAC logic the live /api/razorpay/verify route relies on. This is the core of
 * the P0 finding: a payment must be provably confirmed before it is treated as
 * paid. The tests prove a FORGED signature fails and a genuine one passes.
 */
import crypto from 'node:crypto';
import { verifyRazorpaySignature } from '../src/lib/razorpayVerify.ts';
import { assert, suite } from './assert.mjs';

const t = suite('RazorpayVerify');

const SECRET = 'test_secret_key';
const ORDER = 'order_1AbCdEf';
const PAYMENT = 'pay_1XyZaBc';

function forgeSignature(orderId, paymentId, secret) {
  return crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
}

// --- genuine signatures verify ------------------------------------------
t.test('a genuine signature verifies', () => {
  const sig = forgeSignature(ORDER, PAYMENT, SECRET);
  const r = verifyRazorpaySignature({ orderId: ORDER, paymentId: PAYMENT, signature: sig, secret: SECRET });
  assert.truthy(r.verified, 'verified flag');
  assert.equals(r.reason, 'verified', 'reason');
});

t.test('signature is case-insensitive (Razorpay returns lowercase hex)', () => {
  const sig = forgeSignature(ORDER, PAYMENT, SECRET).toUpperCase();
  const r = verifyRazorpaySignature({ orderId: ORDER, paymentId: PAYMENT, signature: sig, secret: SECRET });
  assert.truthy(r.verified, 'uppercase sig still verifies');
});

// --- forged / wrong signatures must NOT verify --------------------------
t.test('a forged signature (attacker-computed) is rejected', () => {
  const attackerSig = forgeSignature(ORDER, PAYMENT, 'attacker_secret');
  const r = verifyRazorpaySignature({ orderId: ORDER, paymentId: PAYMENT, signature: attackerSig, secret: SECRET });
  assert.falsy(r.verified, 'must not verify');
  assert.equals(r.reason, 'invalid', 'reason');
});

t.test('a signature for a different order id is rejected', () => {
  const sig = forgeSignature('order_OTHER', PAYMENT, SECRET);
  const r = verifyRazorpaySignature({ orderId: ORDER, paymentId: PAYMENT, signature: sig, secret: SECRET });
  assert.falsy(r.verified, 'cross-order sig rejected');
  assert.equals(r.reason, 'invalid', 'reason');
});

t.test('a signature for a different payment id is rejected', () => {
  const sig = forgeSignature(ORDER, 'pay_OTHER', SECRET);
  const r = verifyRazorpaySignature({ orderId: ORDER, paymentId: PAYMENT, signature: sig, secret: SECRET });
  assert.falsy(r.verified, 'cross-payment sig rejected');
});

t.test('an empty signature is rejected as missing', () => {
  const r = verifyRazorpaySignature({ orderId: ORDER, paymentId: PAYMENT, signature: '', secret: SECRET });
  assert.falsy(r.verified, 'empty sig');
  assert.equals(r.reason, 'missing_fields', 'reason');
});

// --- missing fields / unconfigured secret --------------------------------
t.test('missing payment id -> missing_fields', () => {
  const r = verifyRazorpaySignature({ orderId: ORDER, paymentId: '', signature: 'abc', secret: SECRET });
  assert.equals(r.reason, 'missing_fields', 'reason');
  assert.falsy(r.verified, 'not verified');
});

t.test('missing order id -> missing_fields (Standard Checkout needs it)', () => {
  const r = verifyRazorpaySignature({ orderId: '', paymentId: PAYMENT, signature: 'abc', secret: SECRET });
  assert.equals(r.reason, 'missing_fields', 'reason');
});

t.test('unconfigured secret NEVER claims verified', () => {
  // Even with all three fields present, without the secret we must report
  // "unconfigured", not "verified". This is the safe default for production
  // until RAZORPAY_SECRET_KEY is set.
  const sig = forgeSignature(ORDER, PAYMENT, 'whatever');
  const r = verifyRazorpaySignature({ orderId: ORDER, paymentId: PAYMENT, signature: sig, secret: '' });
  assert.falsy(r.verified, 'must not verify without secret');
  assert.equals(r.reason, 'unconfigured', 'reason');
});

t.test('whitespace-only secret is treated as unconfigured', () => {
  const sig = forgeSignature(ORDER, PAYMENT, 'x');
  const r = verifyRazorpaySignature({ orderId: ORDER, paymentId: PAYMENT, signature: sig, secret: '   ' });
  assert.equals(r.reason, 'unconfigured', 'trimmed empty secret');
});
