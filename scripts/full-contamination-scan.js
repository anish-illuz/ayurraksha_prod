// Exhaustive scan: for each of the 6 corrected CMS records, check EVERY meta field
// (and woo description/short_description) for text belonging to any OTHER product
// in the catalog. Any hit = contamination still present.
const fs = require('fs');
const T = process.env.TEMP;
const local = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
const larr = Array.isArray(local) ? local : local.products;

// Cross-product markers: each product's distinctive names/forms.
const MARKERS = [
  'SP Soryn', 'Soryn', 'B-Gasonil', 'B Gasonil', 'BoozLiv', 'Purna Sakthi', 'Purṇa',
  'DIVINE HEALING OIL', 'Divine Healing Oil', 'Kalonji', 'Vital O3', 'SuperHeal',
  'Immune O3', 'Cassia fistula', 'Shatavari', 'Asparagus racemosus', 'Karicalai',
  'Dhayani', 'Etiment', 'Migro Prime', 'Dant Swasthya', 'Sleep Well', 'LaxaHealth',
  'B Pain Out', 'Bpain', 'Esunate', 'Esnoeate', 'Esnovate', 'Mucuna',
];
// Mucuna is Herbo's own — exclude per-product below via OWN markers.
const OWN = {
  91: ['Gargling', 'AyurRaksha Gargling Oil'],
  104: ['Dia Well'],
  110: ['Flow Well', 'Garcinia', 'Arjuna'],
  117: ['Herbo Protein', 'Mucuna pruriens', 'Velvet Bean'],
  118: ['HIBISCUS TEA', 'Hibiscus'],
  119: ['PI Well'],
};

function load(id) {
  let s = fs.readFileSync(T + '\\final-' + id + '.json', 'utf8');
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  const o = JSON.parse(s);
  return o.data && o.data.data ? o.data.data[0] : o.data;
}

let allClean = true;
for (const id of [91, 104, 110, 117, 118, 119]) {
  const d = load(id);
  const fields = {};
  (d.meta_data || []).forEach((m) => (fields[m.key] = m.value));
  fields.__woo_description = d.description || '';
  fields.__woo_short = d.short_description || '';
  // Flatten to plain text for marker search
  const blob = JSON.stringify(fields).replace(/<[^>]+>/g, ' ');
  const hits = [];
  for (const marker of MARKERS) {
    const re = new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (!re.test(blob)) continue;
    // It's fine if the marker belongs to this product's own name; but our marker list
    // is all OTHER products, so any hit is a candidate. Verify with own-name overlap.
    const ownOk = (OWN[id] || []).some((o) => marker === o);
    if (ownOk) continue;
    hits.push(marker);
  }
  const clean = hits.length === 0;
  if (!clean) allClean = false;
  console.log(
    'id ' + id + ' ' + d.name + ' | price ' + d.regular_price + ' | ' + (clean ? 'CLEAN' : 'CONTAMINATED: ' + hits.join(', '))
  );
  if (hits.length) {
    // Show which fields carry the hit
    for (const marker of hits) {
      const re = new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      const badFields = Object.keys(fields).filter((k) => re.test(String(fields[k])));
      console.log('   "' + marker + '" found in: ' + badFields.join(', '));
    }
  }
}
console.log(allClean ? '\nRESULT: ALL 6 RECORDS CLEAN' : '\nRESULT: CONTAMINATION REMAINS');
