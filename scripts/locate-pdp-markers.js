// For the 3 flagged PDPs, find the exact context of each NEG marker in:
//  (a) the served preview HTML, and
//  (b) the local products.json for that product's OWN fields.
// Purpose: distinguish real contamination (marker in the product's own copy) from a
// legitimate "Recommended to Pair" / related-product reference (marker in another
// product's card).
const fs = require('fs');
const local = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
const larr = Array.isArray(local) ? local : local.products;

const TARGETS = [
  ['organics-herbo-protein-powder', ['Purna']],
  ['organics-hibiscus-tea-tin', ['Divine Healing Oil']],
  ['pi-well-food-supplement-capsules', ['BoozLiv']],
];

function clean(t) { return String(t || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }

for (const [slug, markers] of TARGETS) {
  const p = larr.find((x) => x.slug === slug);
  console.log('\n===== ' + slug + ' (' + p.name + ')');
  console.log('--- marker in the PRODUCT\'S OWN local fields? ---');
  let selfHit = false;
  for (const m of markers) {
    for (const k of Object.keys(p)) {
      const v = String(p[k] || '');
      if (v.includes(m)) {
        console.log('  SELF HIT: ' + k + ' -> ' + clean(v).slice(0, 140));
        selfHit = true;
      }
    }
  }
  if (!selfHit) console.log('  (none) - marker NOT in this product\'s own local fields');

  console.log('--- does a "recommended to pair" / related field reference it? ---');
  for (const k of Object.keys(p)) {
    if (/pair|related|recommend|cross|bundle/i.test(k)) {
      const v = p[k];
      console.log('  ' + k + ': ' + JSON.stringify(v).slice(0, 200));
    }
  }
  // Which catalog product is "Purna" / "Divine Healing Oil" / "BoozLiv" the name of?
  console.log('--- catalog product owning this name ---');
  for (const m of markers) {
    const owners = larr.filter((x) => (x.name || '').includes(m) || (x.slug || '').includes(m.toLowerCase().replace(/\s+/g, '-')));
    console.log('  "' + m + '" is product name/slug of: ' + (owners.length ? owners.map((o) => o.slug).join(', ') : '(no direct owner)'));
  }
}
