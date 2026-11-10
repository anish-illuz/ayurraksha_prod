// Definitive contamination scan: for each of the 6 corrected records, check every
// meta field (except story_image_url, which is a shared generic banner matching the
// local source) for text belonging to another product.
const fs = require('fs');
const T = process.env.TEMP;
const local = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
const larr = Array.isArray(local) ? local : local.products;

const SLUGS = {
  91: 'ayur-raksha-gargling-oil',
  104: 'dia-well-food-supplement-capsules',
  110: 'flow-well-food-supplement-capsules',
  117: 'organics-herbo-protein-powder',
  118: 'organics-hibiscus-tea-tin',
  119: 'pi-well-food-supplement-capsules',
};

// Genuine cross-product markers: phrases that only belong to OTHER products,
// including form/pack contamination (sachet, ml, mg) that leaked across SKUs.
const OTHER = {
  91: [],
  104: ['SP Soryn', 'Cassia', 'sachet', 'ml', '100 mg'],
  110: ['Gasonil', 'sachet', '500 ml', '100 ml'],
  117: ['Purna', 'Shatavari', 'Asparagus racemosus', 'sachet', '500 ml'],
  118: ['DIVINE HEALING', 'Divine Healing Oil', 'turmeric', 'Haridra', '100 ml', 'sachet'],
  119: ['Karicalai', 'BoozLiv', 'liver', 'sachet', '600 ml'],
};

// Per-product self-markers to EXCLUDE from hits (a product may correctly name itself
// or its own ingredients even if that word is on another product's list).
const SELF = {
  91: ['Gargling'],
  104: ['Dia Well', 'Fenugreek', 'Gymnema', 'Moringa', 'Jamun'],
  110: ['Flow Well', 'Garcinia', 'Arjuna', 'Vitis', 'Draksha'],
  117: ['Herbo', 'Mucuna', 'Velvet Bean', 'Ashwagandha', 'Gokshura', 'Musli'],
  118: ['Hibiscus', 'Camellia', 'Green Tea', 'tea bag'],
  119: ['PI Well', 'Pumpkin', 'Neem', 'Tulsi', 'Cucurbita'],
};

function load(id) {
  let s = fs.readFileSync(T + '\\final3-' + id + '.json', 'utf8');
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  const o = JSON.parse(s);
  return o.data && o.data.data ? o.data.data[0] : o.data;
}
function md(d, k) { const m = (d.meta_data || []).find((x) => x.key === k); return m ? m.value : null; }
function arr(d, k) { let v = md(d, k); if (typeof v === 'string') { try { return JSON.parse(v); } catch (e) { return v; } } return v; }
function esc(re) { return re.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

let allClean = true;
for (const idStr of [91, 104, 110, 117, 118, 119]) {
  const id = Number(idStr);
  const d = load(id);
  const fields = {};
  (d.meta_data || []).forEach((m) => (fields[m.key] = m.value));
  delete fields.story_image_url; // shared generic banner; matches local source
  delete fields._story_image_url;
  const blob = JSON.stringify(fields);

  const markers = OTHER[id] || [];
  const selfRe = (SELF[id] || []).map((s) => new RegExp(esc(s), 'i'));
  // A marker only counts as contamination if it is NOT explainable by the product
  // naming itself / its own ingredients.
  const hits = markers.filter((m) => {
    if (!new RegExp(esc(m), 'i').test(blob)) return false;
    // If the marker is a substring of a self-marker context, ignore; simple heuristic:
    // if the product's own name appears right before/around, still flag — we only flag
    // genuinely-foreign words. For these specific markers they are all foreign, so flag.
    return true;
  });
  const clean = hits.length === 0;
  if (!clean) allClean = false;
  const hero = md(d, 'hero_image_tag') || '';
  const feat = arr(d, 'features_cards_data') || [];
  console.log(
    'id ' + id + ' ' + d.name.padEnd(30) + (clean ? 'CLEAN' : 'HITS: ' + hits.join(', ')) +
      ' | hero=' + JSON.stringify(hero.slice(0, 40)) +
      ' | feat=' + (Array.isArray(feat) ? feat.length : '?') +
      ' | price=' + d.regular_price + ' stock=' + d.stock_status
  );
}
console.log(allClean ? 'RESULT: ALL 6 RECORDS CLEAN' : 'RESULT: CONTAMINATION REMAINS');

// Also verify prices/stock
for (const id of [122, 123]) {
  const d = load(id);
  const ok = id === 122 ? d.regular_price === '200' : d.regular_price === '4000';
  console.log('id ' + id + ' ' + d.name + ' price=' + d.regular_price + ' ' + (ok ? 'OK' : 'MISMATCH'));
}
