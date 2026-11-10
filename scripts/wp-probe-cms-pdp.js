// For each of the 6 CMS products, fetch the CMS product page and check whether the
// contaminated or the corrected step/advisory text is actually rendered.
const https = require('https');
const fs = require('fs');

const rows = [
  { id: 91, slug: 'ayurraksha-gargling-oil', wrong: ['Simmer or Dissolve', 'Consume as Routine'], right: ['Measure the Oil', 'Swish as Directed', 'Spit Out Completely', 'Rinse Mouth Thoroughly'] },
  { id: 104, slug: 'dia-well-food-supplement-capsules', wrong: ['SP Soryn', 'circular motions', 'Cassia fistula'], right: ['Recommended Dosage', 'Monitor Glucose', 'Jamun', 'Syzygium cumini'] },
  { id: 110, slug: 'flow-well-capsules', wrong: ['sachet', 'B-Gasonil', 'lukewarm water', 'eight traditional herbal'], right: ['Evening Dose', 'Staged Clinical Protocol', 'Garcinia cambogia', 'Arjuna'] },
  { id: 117, slug: 'herbo-protein-powder', wrong: ['Purna Sakthi', 'Shatavari', 'Asparagus racemosus', "women's"], right: ['Measure Health Powder', 'Mucuna pruriens', 'Velvet Bean', 'L-DOPA'] },
  { id: 118, slug: 'hibiscus-tea-tin', wrong: ['DIVINE HEALING OIL', 'Do not swallow', 'external use', 'turmeric', 'Haridra'], right: ['Boil Fresh Water', 'Infuse Tea Bag', 'Steep', 'Hibiscus sabdariffa'] },
  { id: 119, slug: 'pi-well-food-supplement-capsules', wrong: ['10 ml', 'sachet', 'Karicalai', 'BoozLiv', 'liver'], right: ['Pumpkin', 'Cucurbita maxima', 'Neem', 'Tulsi'] },
];

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      { headers: { 'User-Agent': 'Mozilla/5.0 AyurRaksha-Audit/1', Accept: 'text/html', 'Connection': 'close' }, timeout: 60000 },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
        res.on('error', reject);
      }
    ).on('error', reject);
  });
}

(async () => {
  for (const r of rows) {
    const url = 'https://cms.ayurrakshaonline.com/product/' + r.slug + '/';
    let res;
    try {
      res = await get(url);
    } catch (e) {
      console.log('id ' + r.id + ' ' + r.slug + ' -> FETCH ERR ' + e.message);
      continue;
    }
    const b = res.body;
    const bodyLower = b.toLowerCase();
    // Only look at rendered visible text: strip scripts/styles first
    const text = b.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
    const has = (s) => text.includes(s);
    const wrongHits = r.wrong.filter((w) => has(w));
    const rightHits = r.right.filter((x) => has(x));
    console.log('\n===== id ' + r.id + ' ' + r.name === '' ? '' : '');
    console.log('id ' + r.id + ' ' + r.slug + '  HTTP ' + res.status + '  (' + b.length + ' bytes)');
    console.log('   WRONG text present : ' + (wrongHits.length ? wrongHits.join(' | ') : 'NONE'));
    console.log('   RIGHT text present : ' + (rightHits.length ? rightHits.join(' | ') : 'NONE'));
  }
})();
