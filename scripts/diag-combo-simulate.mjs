/**
 * Simulates the EXACT combo-order path of /api/order/create, safe (no checkout):
 *   1. read live combo items from the production combo-builder endpoint
 *   2. resolve each item to its LIVE WooCommerce id via Store API, using the
 *      same SLUG_ALIASES fallback the order route's fetchCmsCommerce uses
 *   3. build a cart to the 3000 INR threshold with the LIVE ids
 *   4. apply COMBO3000 and verify the discount registers, exactly like the
 *      route's coupon gate
 *
 * Verdict tells us whether a real combo order would record or abort.
 * Run:  node scripts/diag-combo-simulate.mjs   (safe, no order)
 */
const STORE = 'https://cms.ayurrakshaonline.com/wp-json/wc/store/v1';
const TS = () => Date.now();

// Copied from src/lib/products.ts (the map fetchCmsCommerce falls back on).
const SLUG_ALIASES = {
  'ayur-raksha-skinwell-soap-pack-of-2': 'skinwell-soap-pack-of-2',
  'ayur-raksha-detox-tea': 'ayurraksha-detox-tea',
  'ayur-raksha-imu-360': 'ayurraksha-imu-360',
  'ayur-raksha-skin-conditioning-oil': 'ayurraksha-skin-conditioning-oil',
  'ayur-raksha-herbal-shampoo': 'ayurraksha-herbal-shampoo',
  'ayur-raksha-superheal-o3-cream': 'ayurraksha-superheal-o3-cream',
  'ayur-raksha-skin-well-food-moisturising-gel': 'ayurraksha-skin-well-food-moisturising-gel',
  'skin-well-food-supplement-capsules': 'skin-well-capsules',
  'sp-soryn-cream': 'ayurraksha-sp-soryn-cream',
  'b-derma-capsules': 'ayurraksha-b-derma-capsules',
};

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
      if (attempt < 5) await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw lastErr;
}

// 1. Live combo items.
const comboSlug = process.env.COMBO_SLUG || 'skin-care';
const comboRes = await resFetch(`https://www.ayurrakshaonline.com/api/combo-builder/products?slug=${comboSlug}`);
const comboData = await comboRes.json().catch(() => null);
const items = (comboData?.products || []).filter((p) => Number(p.price) > 0 && p.inStock !== false);
console.log(`[combo items] ${items.length} in-stock, priced items`);

// 2. Resolve each to its live WooCommerce id, with the alias fallback.
const resolved = [];
for (const p of items) {
  const candidates = [p.slug, SLUG_ALIASES[p.slug]].filter((s, i, arr) => s && s !== p.slug || i === 0);
  let live = null;
  for (const s of candidates) {
    const r = await resFetch(`${STORE}/products?slug=${encodeURIComponent(s)}&per_page=1`);
    const list = await r.json().catch(() => null);
    if (Array.isArray(list) && list.length > 0) { live = { ...list[0], triedSlug: s }; break; }
  }
  const ok = live && live.is_in_stock && Number(live.prices?.price || 0) > 0;
  resolved.push({
    slug: p.slug, name: p.name, price: p.price,
    liveId: ok ? live.id : null,
    liveType: live?.type ?? null,
    variations: Array.isArray(live?.variations) ? live.variations.length : 0,
    resolvable: ok,
  });
  console.log(`  "${p.slug}" -> ${ok ? `live_id=${live.id} type=${live.type}` : 'UNRESOLVABLE'}`);
}

// 3. Build a cart to the 3000 INR threshold using LIVE ids.
const pick = resolved.filter((r) => r.resolvable);
if (pick.length === 0) {
  console.log('\nVERDICT: no combo item could resolve to a live product -> every combo order would 400 "item unavailable".');
  process.exit(0);
}
let cartPaise = 0;
const chosen = [];
for (const p of pick) {
  let qty = 1;
  while (cartPaise + qty * p.price * 100 < 300000 && qty < 5) qty += 1;
  chosen.push({ ...p, qty });
  cartPaise += qty * p.price * 100;
  if (cartPaise >= 300000) break;
}
console.log(`\n[chosen combo cart] subtotal ~ INR ${(cartPaise / 100).toFixed(0)}`);

let nonce = '', cartToken = '';
{
  const r = await resFetch(`${STORE}/cart?_nocache=${TS()}`, { headers: { 'User-Agent': 'diag-combo-sim', Accept: 'application/json' } });
  nonce = r.headers.get('Nonce') || '';
  cartToken = r.headers.get('Cart-Token') || '';
  await resFetch(`${STORE}/cart/items?_nocache=${TS()}`, { method: 'DELETE', headers: { 'Nonce': nonce, 'Cart-Token': cartToken } });
}
const hdrs = () => ({ 'User-Agent': 'diag-combo-sim', 'Content-Type': 'application/json', 'Nonce': nonce, 'Cart-Token': cartToken });
for (const c of chosen) {
  const r = await resFetch(`${STORE}/cart/add-item?_nocache=${TS()}`, {
    method: 'POST', headers: hdrs(), body: JSON.stringify({ id: c.liveId, quantity: c.qty }),
  });
  if (r.headers.get('Nonce')) nonce = r.headers.get('Nonce');
  if (r.headers.get('Cart-Token')) cartToken = r.headers.get('Cart-Token');
  console.log(`  add-item live_id=${c.liveId} (${c.slug}) x${c.qty} -> HTTP ${r.status}`);
  if (!r.ok) console.log('   >> add failed -> order route would abort, no order recorded');
}

// 4. Coupon gate — exactly like the route.
const coupon = cartPaise >= 500000 ? 'COMBO5000' : 'COMBO3000';
{
  const r = await resFetch(`${STORE}/cart/apply-coupon?_nocache=${TS()}`, {
    method: 'POST', headers: hdrs(), body: JSON.stringify({ code: coupon }),
  });
  const b = await r.json().catch(() => null);
  if (r.headers.get('Nonce')) nonce = r.headers.get('Nonce');
  if (r.headers.get('Cart-Token')) cartToken = r.headers.get('Cart-Token');
  console.log(`\n[apply-coupon ${coupon}] -> HTTP ${r.status}${r.status >= 400 ? ' BODY: ' + JSON.stringify(b).slice(0, 400) : ''}`);

  const verify = await resFetch(`${STORE}/cart?_nocache=${TS()}`, { method: 'GET', headers: { ...hdrs(), 'Accept': 'application/json' } });
  const c = await verify.json().catch(() => null);
  const codes = Array.isArray(c?.coupons) ? c.coupons.map((x) => String(x?.code || '').toUpperCase()) : [];
  const discountPaise = Number(c?.totals?.total_discount ?? 0);
  console.log(`[cart verify] coupons=${JSON.stringify(codes)} total_discount=${discountPaise} paise; total_price=${c?.totals?.total_price} paise`);

  const passes = r.ok && codes.includes(coupon) && discountPaise > 0;
  console.log('\n=== VERDICT ===');
  if (passes) {
    console.log('Combo order path WORKS: items resolve to live ids, coupon registers, discount > 0. A combo order would be recorded in WooCommerce.');
  } else {
    console.log(`Combo order path FAILS: coupon="${coupon}" registered=${codes.includes(coupon)} discount=${discountPaise}. The order route aborts -> NO ORDER IS RECORDED for combo carts.`);
  }
}
