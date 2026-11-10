// Build a wc-products-update payload that fixes the contaminated target_indications
// body on the 5 records, mirroring the verified local source of truth.
const fs = require('fs');
const local = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
const larr = Array.isArray(local) ? local : local.products;

const ID_MAP = {
  'dia-well-food-supplement-capsules': 104,
  'flow-well-food-supplement-capsules': 110,
  'organics-herbo-protein-powder': 117,
  'organics-hibiscus-tea-tin': 118,
  'pi-well-food-supplement-capsules': 119,
};
const slug = process.argv[2];
const p = larr.find((x) => x.slug === slug);
if (!p) { console.error('no local product for ' + slug); process.exit(1); }
const id = ID_MAP[slug];
const body = p.targetIndications || p.suitableFor || '';

const out = {
  id,
  meta_data: [
    { key: 'target_indications', value: body },
    { key: '_target_indications', value: '' },
  ],
};
process.stdout.write(JSON.stringify(out));
