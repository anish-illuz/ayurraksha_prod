/**
 * Diagnostics: replicate the /api/order/create WooCommerce Store API flow
 * against cms.ayurrakshaonline.com and report exactly where it breaks.
 *
 * SAFE BY DEFAULT: this stops after building the cart (init -> clear -> add ->
 * update-customer -> read-back) and does NOT execute the checkout POST, so it
 * creates no order in the live backend. Pass --checkout to also run a single
 * controlled test order (explicitly requested).
 *
 * Run:  node scripts/diag-order-flow.mjs [--checkout]
 *
 * --live-endpoint : POST a single controlled COD test order through the DEPLOYED
 *                   production route https://www.ayurrakshaonline.com/api/order/create
 *                   (the exact path real customer orders take). Creates ONE order,
 *                   clearly marked for deletion.
 */
const STORE = 'https://cms.ayurrakshaonline.com/wp-json/wc/store/v1';
const LIVE_ENDPOINT = 'https://www.ayurrakshaonline.com/api/order/create';
const DO_CHECKOUT = process.argv.includes('--checkout');
const DO_LIVE = process.argv.includes('--live-endpoint');

// A known in-stock product to probe.
const PRODUCT_ID = Number(process.env.PRODUCT_ID || 85); // ayurraksha-detox-tea (simple)

const TS = () => Date.now();
function dump(label, res, body) {
  const b = body && typeof body === 'object' ? JSON.stringify(body, null, 2).slice(0, 900) : String(body).slice(0, 900);
  console.log(`\n### ${label} -> HTTP ${res.status}`);
  if (res.status >= 400) console.log(b);
  return body;
}

// 0. Is the Store API even reachable, and is the target product in stock?
{
  const r = await fetch(`${STORE}/products/${PRODUCT_ID}?per_page=1`, { headers: { Accept: 'application/json' } });
  const list = await r.json().catch(() => null);
  const p = Array.isArray(list) ? list[0] : list;
  console.log(`[0] product ${PRODUCT_ID}: HTTP ${r.status}, type=${p?.type}, in_stock=${p?.is_in_stock}, price=${p?.prices?.price}`);
  if (!p?.is_in_stock) console.log('    >> product not in stock -> order route will 400 "item unavailable"');
}

if (DO_LIVE) {
  // Decisive test: the exact path a real customer COD order takes.
  const payload = {
    items: [{ product: { id: PRODUCT_ID, slug: 'ayurraksha-detox-tea' }, quantity: 1, isComboItem: false }],
    customer: {
      name: 'Diag Order',
      phone: '9876543210',
      address: 'DIAGNOSTIC TEST - safe to delete',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600058',
      email: 'orders@ayurrakshaonline.com',
    },
    paymentMethod: 'cod',
    customerNote: 'DIAGNOSTIC TEST ORDER via production route - safe to delete',
  };
  const r = await fetch(LIVE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await r.text();
  console.log(`\n### POST ${LIVE_ENDPOINT} -> HTTP ${r.status}`);
  console.log(body.slice(0, 1200));
  process.exit(0);
}

// 1. Init a fresh cart session.
let nonce = '', cartToken = '';
{
  const r = await fetch(`${STORE}/cart?_nocache=${TS()}`, {
    headers: { 'User-Agent': 'diag-order-flow', 'Accept': 'application/json', 'Cache-Control': 'no-store' },
    cache: 'no-store',
  });
  nonce = r.headers.get('Nonce') || '';
  cartToken = r.headers.get('Cart-Token') || '';
  const cart = await r.json().catch(() => null);
  dump('[1] GET /cart (init)', r, {
    nonce: nonce ? 'present' : 'MISSING',
    cartToken: cartToken ? 'present' : 'MISSING',
    items_count: cart?.items?.length,
    coupons: cart?.coupons,
    needs_shipping: cart?.needs_shipping,
  });
  if (!nonce) console.log('    >> No Nonce header -> subsequent Store API calls will fail (auth gate)');
  if (!cartToken) console.log('    >> No Cart-Token header -> session is broken');
}

const hdrs = () => ({
  'User-Agent': 'diag-order-flow',
  'Content-Type': 'application/json',
  'Nonce': nonce,
  'Cart-Token': cartToken,
});

// 2. Clear any leftover items.
{
  const r = await fetch(`${STORE}/cart/items?_nocache=${TS()}`, { method: 'DELETE', headers: hdrs(), cache: 'no-store' });
  const b = await r.text();
  dump('[2] DELETE /cart/items (clear)', r, b === '' ? '(cleared)' : b);
  if (r.headers.get('Nonce')) nonce = r.headers.get('Nonce');
  if (r.headers.get('Cart-Token')) cartToken = r.headers.get('Cart-Token');
}

// 3. Add the item.
{
  const r = await fetch(`${STORE}/cart/add-item?_nocache=${TS()}`, {
    method: 'POST',
    headers: hdrs(),
    body: JSON.stringify({ id: PRODUCT_ID, quantity: 1 }),
    cache: 'no-store',
  });
  const body = await r.json().catch(() => null);
  dump('[3] POST /cart/add-item', r, body ? {
    items: body?.items?.length,
    item_ids: (body?.items || []).map((i) => i.id),
    errors: body?.errors,
  } : body);
  if (r.headers.get('Nonce')) nonce = r.headers.get('Nonce');
  if (r.headers.get('Cart-Token')) cartToken = r.headers.get('Cart-Token');
  if (!r.ok) console.log('    >> add-item FAILED -> the whole order route throws here (500 to the client)');
}

// 4. Update customer (shipping address) so rates calculate.
{
  const payload = {
    shipping_address: {
      first_name: 'Diag', last_name: 'Order', address_1: '12 Test Street',
      city: 'Chennai', state: 'TN', postcode: '600058', country: 'IN', phone: '9876543210',
    },
    billing_address: {
      first_name: 'Diag', last_name: 'Order', address_1: '12 Test Street',
      city: 'Chennai', state: 'TN', postcode: '600058', country: 'IN',
      email: 'orders@ayurrakshaonline.com', phone: '9876543210',
    },
  };
  const r = await fetch(`${STORE}/cart/update-customer?_nocache=${TS()}`, {
    method: 'POST', headers: hdrs(), body: JSON.stringify(payload), cache: 'no-store',
  });
  dump('[4] POST /cart/update-customer', r, 'ok');
  if (r.headers.get('Nonce')) nonce = r.headers.get('Nonce');
  if (r.headers.get('Cart-Token')) cartToken = r.headers.get('Cart-Token');
}

// 5. Read the cart back and inspect totals + whether shipping is resolvable.
{
  const r = await fetch(`${STORE}/cart?_nocache=${TS()}`, {
    method: 'GET', headers: { 'User-Agent': 'diag-order-flow', 'Accept': 'application/json', 'Nonce': nonce, 'Cart-Token': cartToken }, cache: 'no-store',
  });
  const c = await r.json().catch(() => null);
  console.log(`\n[5] cart after build: items=${c?.items?.length}, needs_shipping=${c?.needs_shipping}, needs_payment=${c?.needs_payment}`);
  console.log(`    totals: ${JSON.stringify(c?.totals)}`);
  console.log(`    shipping_lines: ${JSON.stringify(c?.shipping_lines)}`);
  console.log(`    coupons: ${JSON.stringify(c?.coupons)}`);
}

if (!DO_CHECKOUT) {
  console.log('\n--- Stopped before checkout (safe mode). Re-run with --checkout to place ONE test order. ---');
  process.exit(0);
}

// 6. Execute checkout (ONLY when explicitly requested).
{
  const payload = {
    billing_address: {
      first_name: 'Diag', last_name: 'Order', address_1: '12 Test Street',
      city: 'Chennai', state: 'TN', postcode: '600058', country: 'IN',
      email: 'orders@ayurrakshaonline.com', phone: '9876543210',
    },
    shipping_address: {
      first_name: 'Diag', last_name: 'Order', address_1: '12 Test Street',
      city: 'Chennai', state: 'TN', postcode: '600058', country: 'IN', phone: '9876543210',
    },
    payment_method: 'cod',
    customer_note: 'DIAGNOSTIC TEST ORDER - safe to delete',
    extensions: { 'woocommerce/order-attribution': { source_type: 'typein', referrer: '(none)', user_agent: 'diag-order-flow' } },
  };
  const r = await fetch(`${STORE}/checkout?_nocache=${TS()}`, {
    method: 'POST', headers: hdrs(), body: JSON.stringify(payload), cache: 'no-store',
  });
  const body = await r.json().catch(() => null);
  dump('[6] POST /checkout', r, body ? {
    order_id: body?.order_id,
    order_number: body?.order_number,
    order_key: body?.order_key,
    status: body?.status,
    payment_result: body?.payment_result,
    errors: body?.errors || (body?.message ? body.message : null),
  } : body);
  console.log('\n--- End of diagnostic. ---');
}
