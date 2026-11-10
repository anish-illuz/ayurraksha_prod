// Inspect story_* / description / key meta fields on the 6 CMS records to see which
// still carry cross-product contamination after the steps/ingredients/advisory fix.
const fs = require('fs');
const T = process.env.TEMP;
function load(id) {
  let s = fs.readFileSync(T + '\\verify-' + id + '.json', 'utf8');
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  const o = JSON.parse(s);
  return o.data && o.data.data ? o.data.data[0] : o.data;
}
const products = [
  [91, 'ayur-raksha-gargling-oil'],
  [104, 'dia-well-food-supplement-capsules'],
  [110, 'flow-well-food-supplement-capsules'],
  [117, 'organics-herbo-protein-powder'],
  [118, 'organics-hibiscus-tea-tin'],
  [119, 'pi-well-food-supplement-capsules'],
];
const local = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
const larr = Array.isArray(local) ? local : local.products;

for (const [id, slug] of products) {
  const d = load(id);
  const get = (k) => { const m = (d.meta_data || []).find((x) => x.key === k); return m ? m.value : null; };
  const clean = (t) => (t || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const storyTitle = get('story_title');
  const storyBody = get('story_body') || '';
  const storyClosing = get('story_closing');
  const wooDesc = clean(d.description).slice(0, 100);
  const wooShort = clean(d.short_description).slice(0, 100);
  const p = larr.find((x) => x.slug === slug);
  const localName = p ? p.name : slug;
  console.log('===== id ' + id + ' ' + d.name);
  console.log('  local name: ' + localName);
  console.log('  story_title: ' + JSON.stringify(storyTitle));
  console.log('  story_body (first 120): ' + JSON.stringify(storyBody.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 120)));
  console.log('  story_closing: ' + JSON.stringify((storyClosing || '').slice(0, 120)));
  console.log('  woo description (first 100): ' + JSON.stringify(wooDesc));
  console.log('  woo short_description (first 100): ' + JSON.stringify(wooShort));
  const kfb = get('key_features_benefits') || '';
  console.log('  key_features_benefits (first 90): ' + JSON.stringify(kfb.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 90)));
}
