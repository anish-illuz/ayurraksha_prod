// Confirm /order-tracking/ is a real page and locate the 4 two-word "Ayur Raksha" strings.
const http = require('http'),
  fs = require('fs');

function f(path) {
  return new Promise((res) => {
    http
      .get({ host: 'localhost', port: 3000, path, headers: { 'User-Agent': 'v' } }, (x) => {
        let b = '';
        x.on('data', (c) => (b += c));
        x.on('end', () => res({ status: x.statusCode, body: b }));
      })
      .on('error', (e) => res({ status: 0, body: 'ERR ' + e.message }));
  });
}
const unesc = (s) => s.replace(/\\u0026/g, '&').replace(/&amp;/g, '&').replace(/&quot;/g, '"');

(async () => {
  const r = await f('/order-tracking/');
  const h1 = (unesc(r.body).match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1];
  console.log('/order-tracking/ status ' + r.status + ' | h1: ' + (h1 || '').replace(/<[^>]+>/g, '').trim().slice(0, 80));
  console.log('  has waybill/courier/tracking inputs: ' + /waybill|courier|tracking number|order number/i.test(unesc(r.body)));
  console.log('  has a form/input: ' + /<input|<form/i.test(r.body));

  const data = unesc(fs.readFileSync('src/data/products.json', 'utf8'));
  const re = /Ayur Raksha/gi;
  let m;
  const ctx = [];
  while ((m = re.exec(data))) {
    ctx.push(JSON.stringify(data.slice(m.index - 40, m.index + 12)).slice(-56));
  }
  console.log('\nTwo-word "Ayur Raksha" occurrences in products.json: ' + ctx.length);
  ctx.forEach((c) => console.log('  ...' + c));
})();
