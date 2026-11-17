// Boozliv root-cause probe — the EXACT paths fetchStoreProduct uses (run: node scripts/probe-live.mjs)
const CMS = 'https://cms.ayurrakshaonline.com/wp-json';

// fetchStoreProduct(slug) -> ${STORE_API}/products?slug=<slug>&per_page=1
const probes = ['boozliv', 'ayurraksha-detox-tea'];
for (const slug of probes) {
  const url = `${CMS}/wc/store/v1/products?slug=${encodeURIComponent(slug)}&per_page=1`;
  const r = await fetch(url);
  const body = await r.text();
  let parsed = null;
  try { parsed = JSON.parse(body); } catch { /* empty */ }
  const n = Array.isArray(parsed) ? parsed.length : 'n/a';
  const id = Array.isArray(parsed) && parsed[0] ? parsed[0].id : null;
  const type = Array.isArray(parsed) && parsed[0] ? parsed[0].type : null;
  const variations = Array.isArray(parsed) && parsed[0] && Array.isArray(parsed[0].variations) ? parsed[0].variations.length : 0;
  console.log(`StoreAPI ?slug=${slug} -> HTTP ${r.status}, items=${n}, id=${id}, type=${type}, variations=${variations}`);
}

// Does boozliv resolve via the exact Store API slug path (id 114)?
console.log('--- raw boozliv Store API body (first 300) ---');
const raw = await (await fetch(`${CMS}/wc/store/v1/products?slug=boozliv&per_page=1`)).text();
console.log(raw.slice(0, 300));
