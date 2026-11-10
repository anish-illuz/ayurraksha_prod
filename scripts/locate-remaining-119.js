// For the 5 records, map every foreign marker to the exact CMS meta keys that still
// contain it, and show the local source field that should replace it.
const fs = require('fs');
const T = process.env.TEMP;
const local = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
const larr = Array.isArray(local) ? local : local.products;
const SLUGS = {
  104: 'dia-well-food-supplement-capsules',
  110: 'flow-well-food-supplement-capsules',
  117: 'organics-herbo-protein-powder',
  118: 'organics-hibiscus-tea-tin',
  119: 'pi-well-food-supplement-capsules',
};
const OTHER = {
  104: ['SP Soryn', 'Cassia', 'sachet', 'ml', '100 mg'],
  110: ['Gasonil', 'sachet', '500 ml', '100 ml'],
  117: ['Purna', 'Shatavari', 'Asparagus racemosus', 'sachet', '500 ml'],
  118: ['DIVINE HEALING', 'Divine Healing Oil', 'turmeric', 'Haridra', '100 ml', 'sachet'],
  119: ['Karicalai', 'BoozLiv', 'liver', 'sachet', '600 ml'],
};
function load(id) {
  let s = fs.readFileSync(T + '\\final3-' + id + '.json', 'utf8');
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  const o = JSON.parse(s);
  return o.data && o.data.data ? o.data.data[0] : o.data;
}
function esc(re) { return re.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

for (const idStr of [104, 110, 117, 118, 119]) {
  const id = Number(idStr);
  const d = load(id);
  const p = larr.find((x) => x.slug === SLUGS[id]);
  console.log('===== id ' + id + ' ' + d.name);
  const markers = OTHER[id];
  // For each marker, list the meta keys containing it (skip _prefixed + story_image_url)
  for (const m of markers) {
    const re = new RegExp(esc(m), 'i');
    const hitKeys = (d.meta_data || [])
      .filter((mm) => !/^_/.test(mm.key) && mm.key !== 'story_image_url')
      .filter((mm) => re.test(String(mm.value || '')))
      .map((mm) => mm.key);
    // woo-level
    const wooKeys = ['description', 'short_description']
      .filter((k) => re.test(String(d[k] || '')));
    if (hitKeys.length || wooKeys.length) {
      console.log('  marker "' + m + '" in: ' + [...hitKeys, ...wooKeys].join(', '));
    }
  }
  // Now dump the full value of the suspicious quantity/direction fields
  console.log('  -- field values --');
  const get = (k) => (d.meta_data || []).find((x) => x.key === k);
  for (const k of ['net_quantity', 'how_to_use_directions', 'ingredients_materials', 'product_full_description', 'key_features_benefits']) {
    const g = get(k);
    if (g) {
      const v = String(g.value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      const localHint = k === 'net_quantity' ? p.netQuantity : k === 'spec_net_quantity' ? p.specNetQuantity : null;
      console.log('  ' + k + ' = ' + JSON.stringify(v.slice(0, 160)) + (localHint ? '  [local ' + (k === 'net_quantity' ? 'netQuantity' : '') + '=' + JSON.stringify(localHint) + ']' : ''));
    }
  }
  console.log('');
}
