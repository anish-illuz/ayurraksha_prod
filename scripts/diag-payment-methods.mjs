/**
 * Quick check: what payment methods does the live store offer *with a populated
 * cart* (the real customer state), vs a bare cart?
 */
const STORE = 'https://cms.ayurrakshaonline.com/wp-json/wc/store/v1';
const TS = () => Date.now();

async function resFetch(url, init = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 45000);
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

// Bare cart (no items) — the state my earlier probe used.
let nonce = '', cartToken = '';
{
  const r = await resFetch(`${STORE}/cart?_nocache=${TS()}`, { headers: { 'User-Agent': 'diag-pm', Accept: 'application/json' } });
  nonce = r.headers.get('Nonce') || '';
  cartToken = r.headers.get('Cart-Token') || '';
}
const pm1 = await (await resFetch(`${STORE}/payment-methods?_nocache=${TS()}`, {
  headers: { 'Nonce': nonce, 'Cart-Token': cartToken, 'Accept': 'application/json' },
})).json().catch(() => null);
console.log(`[bare cart] payment-methods available: ${JSON.stringify((pm1?.available_payment_methods || []).map((m) => m.id))}`);

// Now add an in-stock item (product 85) to mimic a real customer cart, then re-query.
{
  const r = await resFetch(`${STORE}/cart/add-item?_nocache=${TS()}`, {
    method: 'POST',
    headers: { 'User-Agent': 'diag-pm', 'Content-Type': 'application/json', 'Nonce': nonce, 'Cart-Token': cartToken },
    body: JSON.stringify({ id: 85, quantity: 1 }),
  });
  if (r.headers.get('Nonce')) nonce = r.headers.get('Nonce');
  if (r.headers.get('Cart-Token')) cartToken = r.headers.get('Cart-Token');
  const cart = await r.json().catch(() => null);
  console.log(`[add item 85] HTTP ${r.status}, cart items=${cart?.items?.length}`);
}
const pm2 = await (await resFetch(`${STORE}/payment-methods?_nocache=${TS()}`, {
  headers: { 'Nonce': nonce, 'Cart-Token': cartToken, 'Accept': 'application/json' },
})).json().catch(() => null);
console.log(`[populated cart] payment-methods available: ${JSON.stringify((pm2?.available_payment_methods || []).map((m) => ({ id: m.id, title: m.title, method: m.method })))}`);
if ((pm2?.available_payment_methods || []).length === 0) {
  console.log('   >> NO payment methods available even with items in cart -> WooCommerce is misconfigured (no active COD / no active gateway); every real checkout would fail at "payment selection"');
}
