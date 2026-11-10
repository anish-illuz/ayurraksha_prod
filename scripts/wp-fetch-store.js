// Fetch the full WooCommerce Store API catalog from a host and dump a compact index.
const https = require('https');

const host = process.argv[2];
const outPath = process.argv[3];

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'AyurRaksha-Audit/1.0', Accept: 'application/json' } }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
          resolve(JSON.parse(body));
        });
      })
      .on('error', reject);
  });
}

(async () => {
  const all = [];
  let page = 1;
  for (;;) {
    const batch = await get(`https://${host}/wp-json/wc/store/v1/products?per_page=100&page=${page}`);
    all.push(...batch);
    if (batch.length < 100) break;
    page++;
    if (page > 15) break;
  }
  const index = all.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    price: Math.round(p.prices.price / 100),
    regular_price: Math.round(p.prices.regular_price / 100),
    currency: p.prices.currency_code,
    in_stock: p.is_in_stock,
    stock_status: p.stock_status,
    on_sale: p.on_sale,
    type: p.type,
    images: (p.images || []).map((i) => i.src),
    categories: (p.categories || []).map((c) => c.name),
  }));
  require('fs').writeFileSync(outPath, JSON.stringify({ host, count: index.length, products: index }, null, 2));
  console.log(`${host}: ${index.length} products -> ${outPath}`);
})().catch((e) => {
  console.error('FAILED', e.message);
  process.exit(1);
});
