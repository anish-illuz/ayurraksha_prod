// Scoped SSR verification of the 6 disputed PDPs on the rebuilt preview (localhost:3000).
// Checks each product's OWN section (served HTML up to the "Recommended to Pair" heading,
// with <head> stripped so the site-wide SEO keyword list doesn't create false hits).
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
  'dia-well-food-supplement-capsules': ['SP Soryn', 'Cassia', 'circular motions'],
  'flow-well-food-supplement-capsules': ['Gasonil', 'lukewarm'],
  'organics-herbo-protein-powder': ['Purna', 'Shatavari', 'Asparagus racemosus', '500 ml'],
  'organics-hibiscus-tea-tin': ['DIVINE HEALING', 'Divine Healing Oil', 'turmeric', 'external use only'],
  'pi-well-food-supplement-capsules': ['BoozLiv', 'Karicalai', 'sachet'],
};
const BASE = 'http://localhost:3000/';
let allOk = true;
for (const slug of slugs) {
  const r = await fetch(BASE + 'product/' + slug + '/');
  const raw = await r.text();
  const headEnd = raw.indexOf('</head>');
  let body = headEnd > -1 ? raw.slice(headEnd) : raw;
  const cut = body.indexOf('Recommended to Pair');
  const scoped = cut > -1 ? body.slice(0, cut) : body;
  const posMissing = (POS[slug] || []).filter((w) => !scoped.includes(w));
  const negHits = (NEG[slug] || []).filter((w) => scoped.includes(w));
  const twoWord = (scoped.match(/Ayur\s+Raksha/g) || []).length;
  // separate word-boundary check for "liver" on PI Well (avoid "Delivery")
  const liverWord = slug === 'pi-well-food-supplement-capsules' ? (scoped.match(/\bliver\b/gi) || []) : [];
  const ok = r.status === 200 && posMissing.length === 0 && negHits.length === 0 && twoWord === 0 && liverWord.length === 0;
  if (!ok) allOk = false;
  console.log(
    slug + ' | HTTP ' + r.status +
      ' | missing=[' + posMissing.join(',') + ']' +
      ' | contaminated=[' + negHits.join(',') + ']' +
      ' | twoWordBrand=' + twoWord +
      (liverWord.length ? ' | liverWord=[' + liverWord.join(',') + ']' : '') +
      ' | ' + (ok ? 'OK' : 'FAIL')
  );
}
console.log(allOk ? 'ALL 6 PDPs OK (scoped)' : 'SOME PDPs FAILED (scoped)');
