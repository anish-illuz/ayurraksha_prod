// Confirm which field holds the net-quantity text for each of the 5 slugs, so the
// pack payload writes the correct spec_net_quantity value (not blank).
const fs = require('fs');
const local = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
const larr = Array.isArray(local) ? local : local.products;
const slugs = [
  'dia-well-food-supplement-capsules',
  'flow-well-food-supplement-capsules',
  'organics-herbo-protein-powder',
  'organics-hibiscus-tea-tin',
  'pi-well-food-supplement-capsules',
];
for (const slug of slugs) {
  const p = larr.find((x) => x.slug === slug);
  const fields = ['netQuantity', 'specNetQuantity', 'packSize', 'net_quantity'];
  const present = fields.filter((k) => p[k] !== undefined && p[k] !== '');
  console.log('=== ' + slug);
  console.log('  net-qty source fields: ' + (present.length ? present.join(', ') : '(NONE)'));
  for (const k of present) console.log('    ' + k + ' = ' + JSON.stringify(p[k]));
  // fallback: if none of the above, show the packOptions[0].subtitle as the likely value
  if (!present.length && p.packOptions && p.packOptions[0])
    console.log('  -> packOptions[0].subtitle = ' + JSON.stringify(p.packOptions[0].subtitle));
}
