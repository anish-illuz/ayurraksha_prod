// Dump target_indications + target_indications_badge for all 6 records, next to the
// local product name/description focus, to spot any remaining foreign text.
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
  let s = fs.readFileSync(T + '\\final2-' + id + '.json', 'utf8');
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  const o = JSON.parse(s);
  return o.data && o.data.data ? o.data.data[0] : o.data;
}
function md(d, k) { const m = (d.meta_data || []).find((x) => x.key === k); return m ? m.value : null; }
const clean = (t) => (t || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

for (const id of Object.keys(SLUGS)) {
  const iid = Number(id);
  const d = load(iid);
  const p = larr.find((x) => x.slug === SLUGS[iid]);
  const descHead = clean(p.description).slice(0, 80);
  console.log('id ' + iid + ' ' + d.name);
  console.log('  target_indications_badge: ' + JSON.stringify(md(d, 'target_indications_badge')));
  console.log('  target_indications      : ' + JSON.stringify(clean(md(d, 'target_indications')).slice(0, 160)));
  console.log('  local description focus : ' + JSON.stringify(descHead));
  console.log('');
}
