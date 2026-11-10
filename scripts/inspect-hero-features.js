// Inspect hero_image_tag, story_image_url, features_cards_data on the 6 records,
// alongside the local source values, to decide precisely what to fix.
const fs = require('fs');
const T = process.env.TEMP;
const local = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
const larr = Array.isArray(local) ? local : local.products;
const SLUGS = {
  91: 'ayur-raksha-gargling-oil',
  104: 'dia-well-food-supplement-capsules',
  110: 'flow-well-food-supplement-capsules',
  117: 'organics-herbo-protein-powder',
  118: 'organics-hibiscus-tea-tin',
  119: 'pi-well-food-supplement-capsules',
};
function load(id) {
  let s = fs.readFileSync(T + '\\final-' + id + '.json', 'utf8');
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  const o = JSON.parse(s);
  return o.data && o.data.data ? o.data.data[0] : o.data;
}
function md(d, k) { const m = (d.meta_data || []).find((x) => x.key === k); return m ? m.value : null; }
function arr(d, k) { let v = md(d, k); if (typeof v === 'string') { try { return JSON.parse(v); } catch (e) { return v; } } return v; }

for (const id of Object.keys(SLUGS)) {
  const iid = Number(id);
  const d = load(iid);
  const p = larr.find((x) => x.slug === SLUGS[iid]);
  console.log('===== id ' + iid + ' ' + d.name);
  console.log('  CMS hero_image_tag : ' + JSON.stringify(md(d, 'hero_image_tag')));
  console.log('  LCL heroImageTag   : ' + JSON.stringify(p ? p.heroImageTag : '(n/a)'));
  console.log('  CMS story_image_url: ' + JSON.stringify(md(d, 'story_image_url')));
  console.log('  LCL storyImage     : ' + JSON.stringify(p ? p.storyImage : '(n/a)'));
  const feat = arr(d, 'features_cards_data');
  if (Array.isArray(feat) && feat.length) {
    console.log('  CMS features_cards_data (' + feat.length + '): ' + feat.map((f) => f.title || f.badge || JSON.stringify(f).slice(0, 40)).join(' | '));
    const featBlob = JSON.stringify(feat);
    console.log('    -> mentions Shatavari? ' + /Shatavari/i.test(featBlob) + ' | Mucuna? ' + /Mucuna/i.test(featBlob));
    console.log('    LCL feature card keys: ' + JSON.stringify(p ? Object.keys(p).filter((k) => /feature/i.test(k)) : []));
  }
}
