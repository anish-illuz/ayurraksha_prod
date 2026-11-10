// Build a wc-products-update payload that fixes ONLY the story contamination:
//   story_body  <- sanitized local description body (heading as <p>, tailwind classes stripped,
//                  everything from the "Key Features" h3 onwards removed)
//   story_closing <- local storyClosing
// Both the plain and underscore-prefixed meta keys are written to match the CMS convention
// observed on the records (value on the plain key, empty on the _ key).
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

// --- sanitize description into story-body HTML ---
let body = p.description || '';
// cut everything from the second h3 ("Key Features & Benefits") onwards
const kfIdx = body.search(/<h3[^>]*>[^<]*Key Features/i);
if (kfIdx > 0) body = body.slice(0, kfIdx);
// first h3 -> p (CMS convention seen on clean records)
body = body.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/, '<p>$1</p>');
// strip class/style attributes from remaining tags
body = body.replace(/\s+(class|style)="[^"]*"/g, '');
// unescape entities that were in the JSON source
body = body.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
body = body.replace(/\n\s*/g, '');

const closing = p.storyClosing || '';
const out = {
  id,
  meta_data: [
    { key: 'story_body', value: body },
    { key: '_story_body', value: '' },
    { key: 'story_closing', value: closing },
    { key: '_story_closing', value: '' },
  ],
};
process.stdout.write(JSON.stringify(out));
