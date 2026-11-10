const fs = require('fs');
const local = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
const larr = Array.isArray(local) ? local : local.products;
const p = larr.find(x => x.slug === 'pi-well-food-supplement-capsules');

console.log('=== PI Well local fields containing "sachet":');
let found = false;
for (const k of Object.keys(p)) {
  const v = String(p[k] || '');
  if (/sachet/i.test(v)) { console.log('  ' + k + ': ' + v.slice(0, 160)); found = true; }
}
if (!found) console.log('  (none) - sachet NOT in PI Well local data');

console.log('\n=== PI Well packOptions:');
console.log(JSON.stringify(p.packOptions, null, 1));
console.log('=== PI Well price/stock:');
console.log('  price=' + (p.price ?? p.mrp) + ' inStock=' + (p.inStock ?? p.stockStatus ?? '?'));

console.log('\n=== Local products that DO contain "40 Sachets":');
larr.forEach(x => { if (/40 Sachets/i.test(JSON.stringify(x))) console.log('  ' + x.slug + ' (' + x.name + ')'); });
console.log('=== Local products with BoozLiv in storyImage:');
larr.forEach(x => { if (/boozliv/i.test(String(x.storyImage || ''))) console.log('  ' + x.slug); });
