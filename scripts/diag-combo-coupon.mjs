/**
 * Diagnostics: do the combo-coupon and variable-product order paths work on
 * the live CMS?
 *
 *   - Combo: build a Store API cart to the 3000 INR threshold, apply
 *     COMBO3000, read the cart back, and check the discount registered —
 *     EXACTLY like /api/order/create does. If the coupon does not register,
 *     the order route hard-aborts with "Could not apply the combo discount"
 *     and NO ORDER IS EVER CREATED.
 *   - Variable: send a clearly-marked test order for a VARIABLE product
 *     (boozliv, id 114) through the deployed /api/order/create.
 *
 * SAFE BY DEFAULT: no checkout / no live-endpoint POST.
 *   --checkout : one marked COMBO test order via the production route
 *   --variable : one marked VARIABLE test order via the production route
 *
 * Run:  node scripts/diag-combo-coupon.mjs [--checkout] [--variable]
 */
const STORE = 'https://cms.ayurrakshaonline.com/wp-json/wc/store/v1';
const LIVE_ENDPOINT = 'https://www.ayurrakshaonline.com/api/order/create';
const DO_CHECKOUT = process.argv.includes('--checkout');
const DO_VARIABLE = process.argv.includes('--variable');

const TS = () => Date.now();

// The CMS sits behind a flaky edge; a single 10s connect timeout must not
// kill the whole probe. Retry with a longer timeout.
async function resFetch(url, init = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 60000);
      const res = await fetch(url, { ...init, signal: ctrl.signal });
      clearTimeout(to);
      return res;
    } catch (e) {
      lastErr = e;
      if (attempt < 5) {
        console.log(`    (transient ${String(e.message || e).slice(0, 60)}; retry ${attempt + 1}/5 in 2s)`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }
  throw lastErr;
}

// Fresh cart session helper.
async function freshCart() {
  const r = await resFetch(`${STORE}/cart?_nocache=${TS()}`, { headers: { 'User-Agent': 'diag-combo', Accept: 'application/json' } });
  let nonce = r.headers.get('Nonce') || '';
  let cartToken = r.headers.get('Cart-Token') || '';
  const del = await resFetch(`${STORE}/cart/items?_nocache=${TS()}`, { method: 'DELETE', headers: { 'Nonce': nonce, 'Cart-Token': cartToken } });
  if (del.headers.get('Nonce')) nonce = del.headers.get('Nonce');
  if (del.headers.get('Cart-Token')) cartToken = del.headers.get('Cart-Token');
  return { nonce, cartToken, cart: await r.json().catch(() => null) };
}

// ---------------------------------------------------------------------------
// 1. Live combo items + payment-method availability
// ---------------------------------------------------------------------------
const comboSlug = process.env.COMBO_SLUG || 'skin-care';
const comboRes = await resFetch(`https://www.ayurrakshaonline.com/api/combo-builder/products?slug=${comboSlug}`);
const comboData = await comboRes.json().catch(() => null);
console.log(`[combo-builder/${comboSlug}] HTTP ${comboRes.status}`);
const items = comboData?.products || [];
for (const p of items) console.log(`  item id=${p.id} slug="${p.slug}" name="${p.name}" price=${p.price} inStock=${p.inStock}`);

try {
  const pm = await (await resFetch(`${STORE}/payment-methods?_nocache=${TS()}`)).json();
  console.log(`[payment-methods] available: ${JSON.stringify((pm?.available_payment_methods || []).map((m) => m.id))}`);
} catch (e) {
  console.log(`[payment-methods] probe error: ${e.message}`);
}

// ---------------------------------------------------------------------------
// 1b. Store API product TYPE for every combo slug (parent id, type, variations)
//     - this is what the ORDER ROUTE actually uses (it resolves by slug, not
//       by the bundled id the combo endpoint reports).
// ---------------------------------------------------------------------------
console.log('\n[store-api product types for combo slugs]');
for (const p of items) {
  try {
    const r = await resFetch(`${STORE}/products?slug=${encodeURIComponent(p.slug)}&per_page=1`);
    const list = await r.json().catch(() => null);
    const sp = Array.isArray(list) ? list[0] : null;
    if (!sp) {
      console.log(`  slug="${p.slug}": NOT FOUND in Store API -> order route will 400 "item unavailable" for ANY cart containing it`);
      continue;
    }
    const vars = Array.isArray(sp.variations) ? sp.variations.length : 0;
    console.log(`  slug="${p.slug}": live_id=${sp.id} type=${sp.type} variations=${vars} inStock=${sp.is_in_stock}`);
    if (sp.type === 'variable') {
      console.log(`    >> VARIABLE: the order route requires an in-stock variantId; without one it 400s and NO ORDER IS RECORDED`);
    }
  } catch (e) {
    console.log(`  slug="${p.slug}": lookup error ${String(e.message).slice(0, 50)}`);
  }
}

// ---------------------------------------------------------------------------
// 2. Variable-product test through the deployed route (boozliv)
// ---------------------------------------------------------------------------
if (DO_VARIABLE) {
  // Fetch boozliv's live variation ids from the Store API.
  const blRes = await resFetch(`${STORE}/products?slug=boozliv&per_page=1`);
  const blList = await blRes.json().catch(() => null);
  const bl = Array.isArray(blList) ? blList[0] : null;
  const boozVariations = bl?.variations?.length ? bl.variations : [null];
  const variantId = Number(process.env.VARIANT_ID) || (boozVariations[0]?.id || 0);
  const payload = {
    items: [{ product: { id: 114, slug: 'boozliv' }, quantity: 1, isComboItem: false, variantId }],
    customer: {
      name: 'Diag Variable', phone: '9876543210',
      address: 'DIAGNOSTIC VARIABLE TEST - safe to delete',
      city: 'Chennai', state: 'Tamil Nadu', pincode: '600058',
      email: 'orders@ayurrakshaonline.com',
    },
    paymentMethod: 'cod',
    customerNote: 'DIAGNOSTIC VARIABLE TEST ORDER - safe to delete',
  };
  const r = await resFetch(LIVE_ENDPOINT, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  const body = await r.text();
  console.log(`\n[VARIABLE] POST ${LIVE_ENDPOINT} (boozliv id=114) -> HTTP ${r.status}`);
  console.log(body.slice(0, 1000));
}

// ---------------------------------------------------------------------------
// 3. Combo coupon path
// ---------------------------------------------------------------------------
if (items.length === 0) {
  console.log('\nNo combo items available - cannot probe the coupon path.');
  process.exit(0);
}

const pick = items.filter((i) => Number(i.price) > 0 && i.inStock !== false);
let cartPaise = 0;
const chosen = [];
for (const p of pick) {
  let qty = 1;
  while (cartPaise + qty * p.price * 100 < 300000 && qty < 5) qty += 1;
  chosen.push({ id: p.id, slug: p.slug, name: p.name, price: p.price, qty });
  cartPaise += qty * p.price * 100;
  if (cartPaise >= 300000) break;
}
console.log(`\n[chosen combo cart] target >= 3000 INR; items: ${JSON.stringify(chosen)}; subtotal ~ ${(cartPaise / 100).toFixed(0)} INR`);

const { nonce: initNonce, cartToken: initToken } = await freshCart();
let nonce = initNonce, cartToken = initToken;
const hdrs = () => ({ 'User-Agent': 'diag-combo', 'Content-Type': 'application/json', 'Nonce': nonce, 'Cart-Token': cartToken });

for (const c of chosen) {
  const r = await resFetch(`${STORE}/cart/add-item?_nocache=${TS()}`, {
    method: 'POST', headers: hdrs(), body: JSON.stringify({ id: c.id, quantity: c.qty }),
  });
  if (r.headers.get('Nonce')) nonce = r.headers.get('Nonce');
  if (r.headers.get('Cart-Token')) cartToken = r.headers.get('Cart-Token');
  const b = await r.text();
  console.log(`  add-item id=${c.id} (${c.slug}) x${c.qty} -> HTTP ${r.status}${r.status >= 400 ? ' ' + b.slice(0, 200) : ''}`);
}

const coupon = cartPaise >= 500000 ? 'COMBO5000' : 'COMBO3000';
{
  const r = await resFetch(`${STORE}/cart/apply-coupon?_nocache=${TS()}`, {
    method: 'POST', headers: hdrs(), body: JSON.stringify({ code: coupon }),
  });
  const b = await r.json().catch(() => null);
  if (r.headers.get('Nonce')) nonce = r.headers.get('Nonce');
  if (r.headers.get('Cart-Token')) cartToken = r.headers.get('Cart-Token');
  console.log(`\n[apply-coupon ${coupon}] -> HTTP ${r.status}${r.status >= 400 ? ' BODY: ' + JSON.stringify(b).slice(0, 400) : ''}`);
  if (!r.ok) console.log('   >> COUPON REJECTED -> order route throws and NO ORDER IS CREATED.');
}

{
  const r = await resFetch(`${STORE}/cart?_nocache=${TS()}`, { method: 'GET', headers: { ...hdrs(), 'Accept': 'application/json' } });
  const c = await r.json().catch(() => null);
  const codes = Array.isArray(c?.coupons) ? c.coupons.map((x) => String(x?.code || '').toUpperCase()) : [];
  const discountPaise = Number(c?.totals?.total_discount ?? 0);
  console.log(`\n[cart verify] coupons=${JSON.stringify(codes)} total_discount=${discountPaise} paise; total_price=${c?.totals?.total_price} paise`);
  if (!codes.includes(coupon) || discountPaise <= 0) {
    console.log(`   >> COUPON DID NOT REGISTER -> order route aborts with "Could not apply the combo discount" and NO ORDER IS CREATED.`);
  } else {
    console.log(`   >> coupon registered fine (INR ${(discountPaise / 100).toFixed(0)} off).`);
  }
}

if (!DO_CHECKOUT) {
  console.log('\n--- Stopped before checkout (safe mode). ---');
  process.exit(0);
}

// 4. One marked combo test order through the deployed route.
const payload = {
  items: chosen.map((c) => ({ product: { id: c.id, slug: c.slug }, quantity: c.qty, isComboItem: true })),
  customer: {
    name: 'Diag Combo', phone: '9876543210',
    address: 'DIAGNOSTIC COMBO TEST - safe to delete',
    city: 'Chennai', state: 'Tamil Nadu', pincode: '600058',
    email: 'orders@ayurrakshaonline.com',
  },
  paymentMethod: 'cod',
  customerNote: 'DIAGNOSTIC COMBO TEST ORDER - safe to delete',
};
console.log('\n[live-endpoint combo payload]\n' + JSON.stringify(payload, null, 2));
const r = await resFetch(LIVE_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
console.log(`POST ${LIVE_ENDPOINT} -> HTTP ${r.status}`);
console.log((await r.text()).slice(0, 1200));
