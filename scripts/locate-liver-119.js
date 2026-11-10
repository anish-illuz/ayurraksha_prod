// Find every meta field on id 119 that still mentions "liver" (BoozLiv contamination),
// and print the local source equivalents so we know what to write.
const fs = require('fs');
const T = process.env.TEMP;
let s = fs.readFileSync(T + '\\final2-119.json', 'utf8');
if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
const o = JSON.parse(s);
const d = o.data && o.data.data ? o.data.data[0] : o.data;

const re = /liver/i;
console.log('--- id 119 PI Well: fields matching "liver" ---');
for (const m of d.meta_data || []) {
  const v = String(m.value || '');
  if (re.test(v)) {
    console.log('KEY: ' + m.key);
    console.log('   value: ' + v.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 300));
    console.log('');
  }
}
// woo-level fields
for (const k of ['description', 'short_description']) {
  const v = String(d[k] || '');
  if (re.test(v)) console.log('WOO ' + k + ': ' + v.replace(/<[^>]+>/g, ' ').slice(0, 300));
}

// local source
const local = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
const larr = Array.isArray(local) ? local : local.products;
const p = larr.find((x) => x.slug === 'pi-well-food-supplement-capsules');
console.log('\n--- local PI Well fields that should replace them ---');
console.log('keyFeaturesBenefits: ' + JSON.stringify(p.keyFeaturesBenefits || p.keyFeatures || '(n/a)'));
console.log('description has liver? ' + /liver/i.test(p.description || ''));
console.log('warnings: ' + JSON.stringify(p.warnings));
