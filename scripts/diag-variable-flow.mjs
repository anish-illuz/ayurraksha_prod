/**
 * Decisive check for the variable-product (boozliv) order path:
 *   1. Does the WooCommerce Store API accept variation id 28305 in a cart?
 *   2. Does it accept the PARENT id 114 (what the order route sends when a
 *      cart item has no valid variantId)?
 *   3. Can we read the recent order log (REST API) to confirm which product
 *      types actually landed (and which are missing)?
 *
 * SAFE: cart-level probes only; no checkout POST.
 * Run:  node scripts/diag-variable-flow.mjs
 */
const STORE = 'https://cms.ayurrakshaonline.com/wp-json/wc/store/v1';
const TS = () => Date.now();

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

async function freshCart() {
  const r = await resFetch(`${STORE}/cart?_nocache=${TS()}`, { headers: { 'User-Agent': 'diag-var', Accept: 'application/json' } });
  let nonce = r.headers.get('Nonce') || '';
  let cartToken = r.headers.get('Cart-Token') || '';
  const del = await resFetch(`${STORE}/cart/items?_nocache=${TS()}`, { method: 'DELETE', headers: { 'Nonce': nonce, 'Cart-Token': cartToken } });
  if (del.headers.get('Nonce')) nonce = del.headers.get('Nonce');
  if (del.headers.get('Cart-Token')) cartToken = del.headers.get('Cart-Token');
  return { nonce, cartToken };
}

function addProbe(label, id) {
  return (async () => {
    const { nonce, cartToken } = await freshCart();
    const r = await resFetch(`${STORE}/cart/add-item?_nocache=${TS()}`, {
      method: 'POST',
      headers: { 'User-Agent': 'diag-var', 'Content-Type': 'application/json', 'Nonce': nonce, 'Cart-Token': cartToken },
      body: JSON.stringify({ id, quantity: 1 }),
    });
    const b = await r.text();
    console.log(`${label}: add-item id=${id} -> HTTP ${r.status}${r.status >= 400 ? ' ' + b.slice(0, 200) : ''}`);
    return r.status;
  })();
}

// 1. Variation id (what the PDP's valid carts send).
await addProbe('[A] boozliv VARIATION id=28305', 28305);
// 2. Parent id (what the order route sends when variantId is missing/invalid).
await addProbe('[B] boozliv PARENT id=114', 114);

// 3. Order-log readability (REST API v3, no auth -> expect 401; store API is public).
try {
  const r = await resFetch('https://cms.ayurrakshaonline.com/wp-json/wc/v3/orders?per_page=10&status=any');
  const b = await r.text();
  console.log(`\n[wv3 orders readability] HTTP ${r.status}${r.status === 401 ? ' (needs REST keys - as expected; cannot read order log from here)' : ''}`);
  if (r.ok) console.log(b.slice(0, 600));
} catch (e) {
  console.log(`\n[wv3 orders readability] ${String(e.message).slice(0, 100)}`);
}

// 4. How many orders exist in the CMS admin, per day, in the last 7 days?
//    (Store API does not expose orders publicly; use the CMS "last order" hint
//    via the public store endpoints only where possible.)
console.log('\n--- Summary: if [A]=201 and [B]=400, carts that send the parent id fail, matching customer symptom #3. ---');
