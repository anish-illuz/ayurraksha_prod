// Locate every field on id 119 mentioning "sachet", plus local pack_options.
const fs = require('fs');
const T = process.env.TEMP;
let s = fs.readFileSync(T + '\\final3-119.json', 'utf8');
if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
const o = JSON.parse(s);
const d = o.data && o.data.data ? o.data.data[0] : o.data;
function md(d, k) { const m = (d.meta_data || []).find((x) => x.key === k); return m ? m.value : null; }

const re = /sachet/i;
console.log('--- id 119: fields matching "sachet" ---');
for (const m of d.meta_data || []) {
  const v = String(m.value || '');
  if (re.test(v)) {
    console.log('KEY: ' + m.key);
    console.log('   value: ' + v.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 260));
    console.log('');
  }
}

// local source
const local = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
const larr = Array.isArray(local) ? local : local.products;
const p = larr.find((x) => x.slug === 'pi-well-food-supplement-capsules');
console.log('--- local PI Well pack-related fields ---');
for (const k of Object.keys(p)) {
  if (/pack|variant|size|options/i.test(k)) {
    console.log(k + ': ' + JSON.stringify(p[k]).slice(0, 300));
  }
}
