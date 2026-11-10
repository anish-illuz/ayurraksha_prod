// Build a wc-products-update payload that fixes the remaining cross-contamination:
//   hero_image_tag       <- local heroImageTag  (each record currently labels a DIFFERENT product)
//   features_cards_data  <- local featureCards  (each record currently carries another product's features)
// Writes plain + underscore-prefixed keys to match the CMS convention.
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

const out = {
  id,
  meta_data: [
    { key: 'hero_image_tag', value: p.heroImageTag || '' },
    { key: '_hero_image_tag', value: '' },
    { key: 'features_cards_data', value: JSON.stringify(p.featureCards || []) },
    { key: '_features_cards_data', value: '' },
  ],
};
process.stdout.write(JSON.stringify(out));
