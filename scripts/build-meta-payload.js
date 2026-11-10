// Build a wc-products-update meta_data payload for a given slug by mirroring the
// verified local products.json content into the CMS meta keys that carry the PDP sections.
// Emits JSON to stdout: { "id": <n>, "meta_data": [ {key, value}, ... ] }
// Only the contaminated/defective keys are written; everything else is untouched.
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
const arr = Array.isArray(data) ? data : data.products;

// CMS product id keyed by the local slug that maps to that record.
const ID_MAP = {
  'ayur-raksha-gargling-oil': 91,
  'dia-well-food-supplement-capsules': 104,
  'flow-well-food-supplement-capsules': 110,
  'organics-herbo-protein-powder': 117,
  'organics-hibiscus-tea-tin': 118,
  'pi-well-food-supplement-capsules': 119,
};

const slug = process.argv[2];
const p = arr.find((x) => x.slug === slug);
if (!p) {
  console.error('no local product for slug', slug);
  process.exit(1);
}
const id = ID_MAP[slug];
if (!id) {
  console.error('no CMS id for slug', slug);
  process.exit(1);
}

// Helper: store an array under a meta key as a JSON string (matches how the CMS persists these).
const str = (v) => (typeof v === 'string' ? v : JSON.stringify(v));

// Step titles/descriptions are stored in how_to_use_directions (newline list) and
// ritual_steps_data (JSON array of {stepNumber,title,description}).
const stepDescs = (p.ritualSteps || []).map((s) => s.description).join('\n');
const stepTitles = (p.ritualSteps || []).map((s) => s.title).join('\n');
const joinLines = (a) => (a || []).join('\n');

const out = {
  id,
  meta_data: [
    // Contaminated / defective keys that the correction doc targets:
    { key: 'ritual_steps_data', value: str(p.ritualSteps || []) },
    { key: '_ritual_steps_data', value: str(p.ritualSteps || []) },
    { key: 'how_to_use_directions', value: joinLines(p.ritualSteps ? p.ritualSteps.map((s) => s.description) : p.directions ? p.directions.split('\n') : []) },
    { key: '_how_to_use_directions', value: joinLines(p.ritualSteps ? p.ritualSteps.map((s) => s.description) : p.directions ? p.directions.split('\n') : []) },
    // Advisory (topical vs oral) — carry the product's own warnings / advisory lines:
    { key: 'advisory_guidelines', value: joinLines(p.advisoryGuidelines || p.warnings || []) },
    { key: '_advisory_guidelines', value: joinLines(p.advisoryGuidelines || p.warnings || []) },
    { key: 'warnings_precautions', value: joinLines(p.warnings || p.advisoryGuidelines || []) },
    { key: '_warnings_precautions', value: joinLines(p.warnings || p.advisoryGuidelines || []) },
    // Ingredient cards (fixes wrong image + wrong commonName + wrong product):
    { key: 'ingredients_cards_data', value: str(p.ingredientCards || p.ingredients || []) },
    { key: '_ingredients_cards_data', value: str(p.ingredientCards || p.ingredients || []) },
  ],
};

process.stdout.write(JSON.stringify(out, null, 1));
