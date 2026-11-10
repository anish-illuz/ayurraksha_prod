// Full dump of features_cards_data (CMS) vs featureCards (local) for the 6 records.
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
  const cms = arr(d, 'features_cards_data') || [];
  const lcl = p ? p.featureCards || [] : [];
  console.log('===== id ' + iid + ' ' + d.name);
  console.log('CMS features_cards_data (' + (Array.isArray(cms) ? cms.length : '?') + '):');
  (Array.isArray(cms) ? cms : [cms]).forEach(function (c, i) {
    const t = c.title || c.badge || c.eyebrow || '?';
    const dd = (c.description || c.text || '').slice(0, 90);
    const img = c.image || '';
    console.log('  ' + i + ' ' + JSON.stringify({ t: t, d: dd, i: img }));
  });
  console.log('LCL featureCards (' + lcl.length + '):');
  lcl.forEach(function (c, i) {
    const t = c.title || c.badge || '?';
    const dd = (c.description || c.text || '').slice(0, 90);
    const img = c.image || '';
    console.log('  ' + i + ' ' + JSON.stringify({ t: t, d: dd, i: img }));
  });
  console.log('');
}
