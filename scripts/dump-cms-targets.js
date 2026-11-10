// Dump the full local products.json records for the 6 CMS-target slugs so we can
// build meta_data payloads that mirror the verified storefront content.
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
const arr = Array.isArray(data) ? data : data.products;

const slugs = [
  'ayur-raksha-gargling-oil',
  'dia-well-food-supplement-capsules',
  'flow-well-food-supplement-capsules',
  'organics-herbo-protein-powder',
  'organics-hibiscus-tea-tin',
  'pi-well-food-supplement-capsules',
];

for (const slug of slugs) {
  const p = arr.find((x) => x.slug === slug);
  if (!p) {
    console.log('MISSING:', slug);
    continue;
  }
  const fields = ['name', 'description', 'warnings', 'directions', 'ingredients', 'keyFeaturesBenefits', 'keyFeatures'];
  const o = {};
  fields.forEach((f) => {
    if (p[f] !== undefined) o[f] = p[f];
  });
  o.ingredientCards = p.ingredientCards || p.ingredients || [];
  o.ritualSteps = p.ritualSteps || [];
  o.advisoryGuidelines = p.advisoryGuidelines;
  o.slug = slug;
  console.log('\n==================== ' + slug + ' ====================');
  console.log(JSON.stringify(o, null, 1));
}
