/**
 * Decisive customer-failure simulation through the DEPLOYED production route.
 *
 * Each scenario models a plausible customer cart and shows whether the order
 * is recorded or the whole order is rejected with the generic error the
 * customer sees. Scenarios 1-4 are EXPECTED to 400 (no order created);
 * scenario 5 is one clearly-marked combo test order (safe to delete).
 *
 * Run:  node scripts/diag-customer-scenarios.mjs
 */
const LIVE = 'https://www.ayurrakshaonline.com/api/order/create';

async function resFetch(url, init = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 60000);
      const res = await fetch(url, { ...init, signal: ctrl.signal });
      clearTimeout(to);
      return res;
    } catch (e) {
      lastErr = e;
      if (attempt < 4) await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw lastErr;
}

const customer = {
  name: 'Scenario Probe',
  phone: '9876543210',
  address: 'SCENARIO PROBE - safe to delete',
  city: 'Chennai',
  state: 'Tamil Nadu',
  pincode: '600058',
  email: 'orders@ayurrakshaonline.com',
};

async function order(label, items, paymentMethod = 'cod') {
  const payload = {
    items,
    customer,
    paymentMethod,
    customerNote: 'DIAGNOSTIC SCENARIO PROBE - safe to delete',
  };
  const r = await resFetch(LIVE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const body = await r.json().catch(() => null);
  const ok = r.ok && body?.success === true;
  console.log(`\n${label}`);
  console.log(`  items: ${JSON.stringify(items)}`);
  console.log(`  -> HTTP ${r.status} ${ok ? `ORDER RECORDED (#${body.orderNumber})` : `NO ORDER. error: ${body?.error || r.status}`}`);
  return ok;
}

// 1. Cart with an OUT-OF-STOCK item (ayur-raksha-herbal-shampoo, confirmed in_stock=false).
await order('[1] OOS item in cart', [
  { product: { id: 28334, slug: 'ayur-raksha-herbal-shampoo' }, quantity: 1, isComboItem: false },
]);

// 2. OOS item + a healthy item (whole-cart rejection? or does one bad item kill the order?)
await order('[2] OOS item + healthy item', [
  { product: { id: 85, slug: 'ayurraksha-detox-tea' }, quantity: 1, isComboItem: false },
  { product: { id: 28334, slug: 'ayur-raksha-herbal-shampoo' }, quantity: 1, isComboItem: false },
]);

// 3. Variable product WITHOUT variantId (stale cart / no pack selected).
await order('[3] BoozLiv variable, no variantId', [
  { product: { id: 114, slug: 'boozliv' }, quantity: 1, isComboItem: false },
]);

// 4. Invalid qty edge (qty 0).
await order('[4] qty zero', [
  { product: { id: 85, slug: 'ayurraksha-detox-tea' }, quantity: 0, isComboItem: false },
]);

// 5. Combo order through the deployed route (the combo coupon gate), clearly marked.
await order('[5] Combo cart >= 3000 INR, COD (coupon gate)', [
  { product: { id: 113, slug: 'divine-healing-oil' }, quantity: 4, isComboItem: true },
]);

console.log('\n--- Done. ---');
