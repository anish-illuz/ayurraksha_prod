/**
 * Tests for the GA4 / Meta ecommerce event payloads (Phase 7 + Phase 8).
 *
 * Loads the REAL dispatcher (src/lib/storefrontAnalytics.ts) with browser
 * globals stubbed, and verifies:
 *  - GA4 purchase payload shape (transaction_id / value / currency / items).
 *  - PII safety: no raw email / phone / name in GA4 (dataLayer) payloads or
 *    in browser-bound Meta Pixel events.
 *  - Purchase deduplication on the Meta path: a repeated call for the same
 *    order fires the browser Pixel Purchase event once.
 *
 * Note: raw PII in Meta CAPI is expected and correct — it is sent only to our
 * OWN server route, which SHA-256 hashes it before Meta sees it. The test
 * therefore asserts the *browser* surfaces (GA4 + Pixel) carry no raw PII.
 *
 * IMPORTANT (harness): each test installs fresh browser globals and dispatches
 * SYNCHRONOUSLY within the same test, so the stubbed `window` the dispatcher
 * reads is the one this test created. The module is imported once at top level
 * (globals are read lazily at call-time, not import-time).
 */
import assertNode from 'node:assert/strict';
import { assert, suite } from './assert.mjs';
import { trackPurchase } from '../src/lib/storefrontAnalytics.ts';

const t = suite('AnalyticsPayload');

// --- Browser-global harness ---------------------------------------------
// Installs deterministic, per-test browser globals so the dispatcher reads a
// controllable dataLayer / fbq / fetch AND a fresh localStorage + sessionStorage
// (the module dedups Meta events via localStorage and GA4 events via
// sessionStorage). Fresh per test, shared within a test's calls.
function mapStorage() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => void store.set(k, String(v)),
    removeItem: (k) => void store.delete(k),
    clear: () => void store.clear(),
    key: (i) => Array.from(store.keys())[i] ?? null,
    get length() {
      return store.size;
    },
  };
}

function defineGlobal(name, value) {
  try {
    Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
  } catch {
    globalThis[name] = value;
  }
}

function installBrowserGlobals() {
  const dataLayer = [];
  const gtagCalls = [];
  const fbqCalls = [];

  const win = {
    location: { href: 'https://www.ayurrakshaonline.com/checkout/', search: '' },
    dataLayer,
    gtag: (...args) => gtagCalls.push(args),
    fbq: (...args) => fbqCalls.push(args),
    // Controlled fetch: records and resolves, so Meta CAPI dispatch never
    // throws (no network, no real /api/meta/conversions call).
    fetch: async () => ({ ok: true, json: async () => ({ success: true }) }),
  };

  defineGlobal('window', win);
  defineGlobal('document', { cookie: '' });
  defineGlobal('localStorage', mapStorage());
  defineGlobal('sessionStorage', mapStorage());
  // Bare `fetch` (used by the Meta CAPI dispatcher) — stub it so the relative
  // /api/meta/conversions URL resolves to a clean no-op under Node instead of
  // throwing "Failed to parse URL".
  const fetchStub = async () => ({ ok: true, json: async () => ({ success: true }) });
  defineGlobal('fetch', fetchStub);

  return { dataLayer, gtagCalls, fbqCalls };
}

function sampleOrder() {
  return {
    orderId: '12345',
    paymentId: 'pay_TEST123',
    paymentMethod: 'cod',
    customerName: 'Ramesh Kumar',
    customerPhone: '9876543210',
    customerEmail: 'ramesh@example.com',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600058',
    items: [{ product: { id: 85, slug: 'ayurraksha-detox-tea', name: 'AyurRaksha Detox Tea' }, quantity: 2, price: 750 }],
    totalAmount: 1500,
  };
}

function findPurchase(dataLayer) {
  return dataLayer.find((e) => e.event === 'purchase');
}

// --- payload shape -------------------------------------------------------
t.test('GA4 purchase payload has transaction_id, value, currency, items', () => {
  const h = installBrowserGlobals();
  trackPurchase(sampleOrder());
  const p = findPurchase(h.dataLayer);
  assert.truthy(p, 'purchase event pushed to dataLayer');
  assert.equals(p.ecommerce.transaction_id, '12345', 'transaction_id');
  assert.equals(p.ecommerce.value, 1500, 'value');
  assert.equals(p.ecommerce.currency, 'INR', 'currency');
  assertNode.equal(p.ecommerce.items.length, 1, 'one item');
  assertNode.equal(p.ecommerce.items[0].item_name, 'AyurRaksha Detox Tea', 'item name');
  assertNode.equal(p.ecommerce.items[0].quantity, 2, 'quantity');
});

// --- PII safety (browser surfaces only) ----------------------------------
t.test('no raw PII in the GA4 purchase payload', () => {
  const h = installBrowserGlobals();
  const order = sampleOrder();
  trackPurchase(order);
  const p = findPurchase(h.dataLayer);
  assert.truthy(p, 'purchase event present');
  assert.notContainsDeep(p, order.customerEmail, 'email');
  assert.notContainsDeep(p, order.customerPhone, 'phone');
  assert.notContainsDeep(p, order.customerName, 'name');
  assert.notContainsDeep(p, order.pincode, 'pincode');
});

t.test('no raw PII in browser-bound Meta Pixel event data', () => {
  const h = installBrowserGlobals();
  const order = sampleOrder();
  trackPurchase(order);
  // The fbq('track', 'Purchase', customData, {eventID}) call: customData
  // (3rd arg) is what the browser Pixel sends to Meta — it must carry no raw PII.
  const purchaseFbq = h.fbqCalls.find((c) => c[0] === 'track' && c[1] === 'Purchase');
  assert.truthy(purchaseFbq, 'Pixel Purchase event fired');
  const customData = purchaseFbq[2];
  assert.notContainsDeep(customData, order.customerEmail, 'email');
  assert.notContainsDeep(customData, order.customerPhone, 'phone');
  assert.notContainsDeep(customData, order.customerName, 'name');
});

// --- deduplication (Meta path) ------------------------------------------
t.test('Meta Purchase event deduplicates on a second call for the same order', () => {
  const h = installBrowserGlobals();
  const order = sampleOrder();
  trackPurchase(order);
  trackPurchase(order); // same order id -> second browser Purchase suppressed
  const count = h.fbqCalls.filter((c) => c[0] === 'track' && c[1] === 'Purchase').length;
  assert.equals(count, 1, 'exactly one Pixel Purchase event per order');
});
