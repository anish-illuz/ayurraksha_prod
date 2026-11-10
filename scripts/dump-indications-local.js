// Extract local targetIndications + targetIndicationsBadge for the 5 slugs so we can
// build the CMS fix payload.
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
  console.log('=== ' + slug);
  console.log('  targetIndications      : ' + JSON.stringify(p.targetIndications || '(n/a)'));
  console.log('  targetIndicationsBadge: ' + JSON.stringify(p.targetIndicationsBadge || '(n/a)'));
  console.log('  suitableFor            : ' + JSON.stringify(p.suitableFor || '(n/a)'));
}
