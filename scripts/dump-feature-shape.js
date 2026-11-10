// Print the exact JSON shape of one CMS features_cards_data entry and one local
// featureCards entry, so the fix payload serializes to the right field names.
const fs = require('fs');
const T = process.env.TEMP;
const local = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
const larr = Array.isArray(local) ? local : local.products;

// CMS side: read features_cards_data from a saved record (id 104).
let s = fs.readFileSync(T + '\\final-104.json', 'utf8');
if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
const o = JSON.parse(s);
const d = o.data && o.data.data ? o.data.data[0] : o.data;
const featRaw = (d.meta_data || []).find((m) => m.key === 'features_cards_data').value;
let feat;
try { feat = JSON.parse(featRaw); } catch (e) { feat = featRaw; }
console.log('=== CMS features_cards_data[0] (id 104) ===');
console.log(JSON.stringify(Array.isArray(feat) ? feat[0] : feat, null, 2));

// Local side
const p = larr.find((x) => x.slug === 'dia-well-food-supplement-capsules');
console.log('\n=== local featureCards[0] (dia-well) ===');
console.log(JSON.stringify(p.featureCards ? p.featureCards[0] : p.featureCards, null, 2));
console.log('\nlocal featureCards keys union:');
const keys = new Set();
larr.forEach((x) => (x.featureCards || []).forEach((c) => Object.keys(c).forEach((k) => keys.add(k))));
console.log('  ' + [...keys].join(', '));
console.log('\nCMS feature card keys union (all 6 records):');
const cmsKeys = new Set();
for (const id of [91, 104, 110, 117, 118, 119]) {
  let t = fs.readFileSync(T + '\\final-' + id + '.json', 'utf8');
  if (t.charCodeAt(0) === 0xfeff) t = t.slice(1);
  const dd = JSON.parse(t).data;
  const r = (dd.meta_data || []).find((m) => m.key === 'features_cards_data');
  let a = r ? r.value : null;
  try { a = JSON.parse(a); } catch (e) {}
  (Array.isArray(a) ? a : [a]).forEach((c) => c && Object.keys(c).forEach((k) => cmsKeys.add(k)));
}
console.log('  ' + [...cmsKeys].join(', '));
