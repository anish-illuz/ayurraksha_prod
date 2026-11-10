// Compare CMS pack_options + spec_net_quantity vs local for the 6 records.
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
  let s = fs.readFileSync(T + '\\final3-' + id + '.json', 'utf8');
  if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
  const o = JSON.parse(s);
  return o.data && o.data.data ? o.data.data[0] : o.data;
}
function md(d, k) { const m = (d.meta_data || []).find((x) => x.key === k); return m ? m.value : null; }
function arr(d, k) { let v = md(d, k); if (typeof v === 'string') { try { return JSON.parse(v); } catch (e) { return v; } } return v; }
function clean(t) { return (t || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }

for (const id of Object.keys(SLUGS)) {
  const iid = Number(id);
  const d = load(iid);
  const p = larr.find((x) => x.slug === SLUGS[iid]);
  const cmsPack = arr(d, 'pack_options');
  const lclPack = p ? p.packOptions || [] : [];
  const cmsQty = clean(md(d, 'spec_net_quantity'));
  const lclQty = clean(p ? p.netQuantity || p.specNetQuantity || p.packSize || '' : '(n/a)');
  console.log('===== id ' + iid + ' ' + d.name + ' | woo price=' + d.regular_price + ' stock=' + d.stock_status);
  console.log('  CMS pack_options (' + (Array.isArray(cmsPack) ? cmsPack.length : typeof cmsPack) + '):');
  (Array.isArray(cmsPack) ? cmsPack : []).forEach((pk) =>
    console.log('    ' + JSON.stringify({ n: pk.name, sub: pk.subtitle, p: pk.price, r: pk.regularPrice, cnt: pk.packCount }))
  );
  console.log('  LCL packOptions (' + lclPack.length + '):');
  lclPack.forEach((pk) =>
    console.log('    ' + JSON.stringify({ n: pk.name, sub: pk.subtitle, p: pk.price, r: pk.regularPrice, cnt: pk.packCount }))
  );
  console.log('  CMS spec_net_quantity: ' + JSON.stringify(cmsQty));
  console.log('  LCL net quantity     : ' + JSON.stringify(lclQty));
  console.log('');
}
