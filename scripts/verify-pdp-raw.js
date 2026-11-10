// Reliable SSR verification: check POS/NEG markers against the FULL raw served HTML
// (no scope cut, since step/direction content lives in the escaped RSC flight payload).
// NEG markers are the specific foreign-product names that must not appear anywhere on
// the page's own content. POS markers must appear somewhere in the raw HTML.
const slugs = [
  'ayur-raksha-gargling-oil',
  'dia-well-food-supplement-capsules',
  'flow-well-food-supplement-capsules',
  'organics-herbo-protein-powder',
  'organics-hibiscus-tea-tin',
  'pi-well-food-supplement-capsules',
];
const POS = {
  'ayur-raksha-gargling-oil': ['Measure the Oil', 'Swish as Directed', 'Spit Out Completely', 'Rinse Mouth Thoroughly', 'DO NOT SWALLOW'],
  'dia-well-food-supplement-capsules': ['Fenugreek', 'Gymnema', 'Moringa', 'Recommended Dosage'],
  'flow-well-food-supplement-capsules': ['Garcinia', 'Arjuna', 'Evening Dose'],
  'organics-herbo-protein-powder': ['Mucuna', 'Velvet Bean', '100g'],
  'organics-hibiscus-tea-tin': ['Hibiscus', 'Boil Fresh Water', '40 Tea Bags'],
  'pi-well-food-supplement-capsules': ['Pumpkin', 'Neem', 'Tulsi', '60 Capsules'],
};
const NEG = {
  'ayur-raksha-gargling-oil': ['Simmer or Dissolve', 'Consume as Routine'],
  'dia-well-food-supplement-capsules': ['SP Soryn', 'Cassia fistula'],
  'flow-well-food-supplement-capsules': ['Gasonil'],
  'organics-herbo-protein-powder': ['Purna', 'Shatavari', 'Asparagus racemosus'],
  'organics-hibiscus-tea-tin': ['Divine Healing Oil', 'Haridra'],
  'pi-well-food-supplement-capsules': ['BoozLiv', 'Karicalai'],
};
const BASE = 'http://localhost:3000/';
let allOk = true;
for (const slug of slugs) {
  const r = await fetch(BASE + 'product/' + slug + '/');
  const raw = await r.text();
  const posMissing = (POS[slug] || []).filter((w) => !raw.includes(w));
  const negHits = (NEG[slug] || []).filter((w) => raw.includes(w));
  const twoWord = (raw.match(/Ayur\s+Raksha/g) || []).length;
  const ok = r.status === 200 && posMissing.length === 0 && negHits.length === 0 && twoWord === 0;
  if (!ok) allOk = false;
  console.log(
    slug.padEnd(42) + ' | HTTP ' + r.status +
      ' | missing=[' + posMissing.join(',') + ']' +
      ' | contaminated=[' + negHits.join(',') + ']' +
      ' | twoWordBrand=' + twoWord +
      ' | ' + (ok ? 'OK' : 'FAIL')
  );
}
console.log(allOk ? '\nALL 6 PDPs OK (raw HTML)' : '\nSOME PDPs FAILED (raw HTML)');
