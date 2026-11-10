const fs = require('fs');
const T = 'C:\\Users\\anish\\AppData\\Local\\Temp\\';
const www = JSON.parse(fs.readFileSync(T + 'store-www.json', 'utf8'));
const cms = JSON.parse(fs.readFileSync(T + 'store-cms.json', 'utf8'));

const byId = (d) => Object.fromEntries(d.products.map((p) => [p.id, p]));
const W = byId(www), C = byId(cms);
const allIds = [...new Set([...Object.keys(W).map(Number), ...Object.keys(C).map(Number)])].sort((a, b) => a - b);

const target = process.argv[2] ? process.argv[2].split(',').map(Number) : null;

console.log('ID   | WWW name / price / stock            | CMS name / price / stock');
console.log('-'.repeat(120));
for (const id of allIds) {
  if (target && !target.includes(id)) continue;
  const w = W[id], c = C[id];
  const fmt = (p) => (p ? `${p.price}|${p.regular_price}|${p.stock_status}` : '-');
  console.log(`${String(id).padEnd(4)} | ${(w ? w.name : '—').slice(0, 42).padEnd(42)} ${fmt(w).padEnd(22)} | ${(c ? c.name : '—').slice(0, 42).padEnd(42)} ${fmt(c)}`);
}

// slug overlap
const wSlugs = new Set(www.products.map((p) => p.slug));
const cSlugs = new Set(cms.products.map((p) => p.slug));
const shared = [...wSlugs].filter((s) => cSlugs.has(s));
console.log('\nshared slugs:', shared.length, '/ www:', www.products.length, 'cms:', cms.products.length);
const idMismatch = shared.filter((s) => {
  const w = www.products.find((p) => p.slug === s);
  const c = cms.products.find((p) => p.slug === s);
  return w.id !== c.id;
});
console.log('shared slugs with DIFFERENT ids:', idMismatch.length);
idMismatch.slice(0, 50).forEach((s) => {
  const w = www.products.find((p) => p.slug === s);
  const c = cms.products.find((p) => p.slug === s);
  console.log('   ', s, '| www id', w.id, w.price, '| cms id', c.id, c.price);
});
