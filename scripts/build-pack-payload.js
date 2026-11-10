// Build a wc-products-update payload that fixes pack_options + spec_net_quantity on
// the 5 records, mirroring the verified local source of truth (products.json).
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
const outFile = process.argv[3]; // optional: write payload to this path (UTF-8, no BOM)
const p = larr.find((x) => x.slug === slug);
if (!p) { console.error('no local product for ' + slug); process.exit(1); }
const id = ID_MAP[slug];

// spec_net_quantity maps to local specNetQuantity (fallback netQuantity)
const netQty = p.specNetQuantity || p.netQuantity || '';
const out = {
  id,
  meta_data: [
    { key: 'pack_options', value: JSON.stringify(p.packOptions || []) },
    { key: '_pack_options', value: '' },
    { key: 'spec_net_quantity', value: netQty },
    { key: '_spec_net_quantity', value: '' },
  ],
};
const payload = JSON.stringify(out);
if (outFile) {
  fs.writeFileSync(outFile, payload, 'utf8');
  console.error('wrote ' + outFile + ' (' + payload.length + ' chars)');
} else {
  process.stdout.write(payload);
}
