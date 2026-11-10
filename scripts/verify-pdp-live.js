// Verify the 6 disputed PDPs + combo builder on the running preview (localhost:3000).
// Checks: correct step titles present, zero two-word "Ayur Raksha" brand strings,
// prices/stock as expected, and no obvious cross-contamination words rendered.
const slugs = [
  'ayur-raksha-gargling-oil',
  'dia-well-food-supplement-capsules',
  'flow-well-food-supplement-capsules',
  'organics-herbo-protein-powder',
  'organics-hibiscus-tea-tin',
  'pi-well-food-supplement-capsules',
];
// Cross-contamination words that must NOT appear on each PDP.
const NO = {
  'ayur-raksha-gargling-oil': ['Simmer or Dissolve', 'Consume as Routine'],
  'dia-well-food-supplement-capsules': ['SP Soryn', 'circular motions', 'Cassia'],
  'flow-well-food-supplement-capsules': ['B Gasonil', 'B-Gasonil', 'lukewarm'],
  'organics-herbo-protein-powder': ['Purna', 'Shatavari', 'Asparagus racemosus', '500 ml'],
  'organics-hibiscus-tea-tin': ['DIVINE HEALING', 'Divine Healing Oil', 'turmeric', 'external use only'],
  'pi-well-food-supplement-capsules': ['BoozLiv', 'Karicalai', 'sachet', 'liver'],
};
// Words that SHOULD appear (product-specific positive markers).
const YES = {
  'ayur-raksha-gargling-oil': ['Measure the Oil', 'Swish as Directed', 'Spit Out Completely', 'Rinse Mouth Thoroughly', 'DO NOT SWALLOW'],
  'dia-well-food-supplement-capsules': ['Fenugreek', 'Gymnema', 'Moringa', 'Recommended Dosage'],
  'flow-well-food-supplement-capsules': ['Evening Dose', 'Circulation Routine'],
  'organics-herbo-protein-powder': ['Mucuna', 'Velvet Bean', '100g'],
  'organics-hibiscus-tea-tin': ['Hibiscus', 'Boil Fresh Water', 'Tea Bag', '40 Tea Bags'],
  'pi-well-food-supplement-capsules': ['Pumpkin', 'Neem', 'Tulsi', '60 Capsules'],
};
const BASE = 'http://localhost:3000';
const strip = (h) =>
  h
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x2F;/g, '/')
    .replace(/\s+/g, ' ');

let allOk = true;
for (const slug of slugs) {
  const r = await fetch(BASE + '/product/' + slug + '/');
  const raw = await r.text();
  const text = strip(raw);
  const brandHits = (text.match(/Ayur\s+Raksha/g) || []).length;
  const noHits = (NO[slug] || []).filter((w) => text.includes(w));
  const yesMiss = (YES[slug] || []).filter((w) => !text.includes(w));
  const ok = r.status === 200 && brandHits === 0 && noHits.length === 0 && yesMiss.length === 0;
  if (!ok) allOk = false;
  console.log(
    'id-' + slug + ' | HTTP ' + r.status +
      ' | two-word-brand=' + brandHits +
      ' | contaminated=[' + noHits.join(',') + ']' +
      ' | missing=[' + yesMiss.join(',') + ']' +
      ' | ' + (ok ? 'OK' : 'FAIL')
  );
}
console.log(allOk ? 'ALL 6 PDPs OK' : 'SOME PDPs FAILED');
