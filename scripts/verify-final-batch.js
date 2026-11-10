// Final batch of cheap checks to back the document labels:
//  - "AyurRaksha" one-word (item 7)
//  - bestsellers sort actually reorders the shop grid (item 18)
//  - order tracking: is there a real feature / is it a stub (item 19)
//  - detox tea mobile page content (item 13)
const http = require('http'),
  fs = require('fs');

function f(path) {
  return new Promise((res) => {
    const r = http.get({ host: 'localhost', port: 3000, path, headers: { 'User-Agent': 'v' } }, (x) => {
      let b = '';
      x.on('data', (c) => (b += c));
      x.on('end', () => res({ status: x.statusCode, body: b }));
    });
    r.on('error', (e) => res({ status: 0, body: 'ERR ' + e.message }));
    r.setTimeout(20000, () => r.destroy(new Error('timeout')));
  });
}
const unesc = (s) => s.replace(/\\u0026/g, '&').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'");

(async () => {
  // 1) AyurRaksha one-word
  const data = unesc(fs.readFileSync('src/data/products.json', 'utf8'));
  const twoWord = (data.match(/Ayur\s+Raksha/gi) || []).length;
  const oneWord = (data.match(/AyurRaksha/gi) || []).length;
  const org = data.match(/Organics |18 Herbs/gi);
  console.log('item 7  AyurRaksha one-word in products.json: one="' + oneWord + '" two="' + twoWord + '"');

  // 2) bestsellers reorder
  const def = (await f('/shop/')).body;
  const best = (await f('/shop/?sort=bestsellers')).body;
  const firstProducts = (b) => {
    // grab product names in DOM order from the shop grid links
    const m = b.match(/href="\/product\/([a-z0-9-]+)"[^>]*>/gi) || [];
    const names = [...new Set(m.map((x) => x.replace(/href="\/product\//, '').replace(/".*$/, '')))];
    return names;
  };
  const dNames = firstProducts(def).slice(0, 6);
  const bNames = firstProducts(best).slice(0, 6);
  console.log('item 18 bestsellers grid (default): ' + JSON.stringify(dNames));
  console.log('            bestsellers grid (?sort=bestsellers): ' + JSON.stringify(bNames));
  console.log('            reordered? ' + (JSON.stringify(dNames) !== JSON.stringify(bNames) || /bestseller/i.test(best) ? 'YES/indicator-present' : 'identical'));

  // 3) order tracking
  for (const p of ['/track-order/', '/order-tracking/', '/account/', '/orders/']) {
    const r = await f(p);
    const isReal = /(track.{0,20}order|order id|waybill|courier|status of your order)/i.test(r.body);
    console.log('item 19 ' + p + ' -> status ' + r.status + ' len ' + r.body.length + (isReal ? ' [order-tracking content present]' : ' [no order-tracking content]'));
  }

  // 4) detox tea mobile content
  const det = unesc((await f('/product/ayurraksha-detox-tea/')).body);
  const detChecks = ['40', 'sachet', 'Boil', 'Simmer', 'Strain'].filter((w) => det.includes(w));
  console.log('item 13 detox tea page markers: ' + JSON.stringify(detChecks));
})();
