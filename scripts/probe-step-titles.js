// Inspect how step titles containing '&' are actually rendered on the PDP.
const http = require('http'),
  fs = require('fs');
function f(slug) {
  return new Promise((res) => {
    const r = http.get({ host: 'localhost', port: 3000, path: '/product/' + slug + '/', headers: { 'User-Agent': 'v' } }, (x) => {
      let b = '';
      x.on('data', (c) => (b += c));
      x.on('end', () => res(b));
    });
    r.on('error', (e) => res('ERR ' + e.message));
    r.setTimeout(15000, () => r.destroy(new Error('timeout')));
  });
}

const probes = [
  ['ayurraksha-detox-tea', ['Boil', 'Simmer', 'Strain', 'Sip Warm']],
  ['ayurraksha-herbal-shampoo', ['Wet Hair', 'Lather', 'Rinse', 'Scalp']],
  ['divine-healing-oil', ['Clean', 'Prepare Area', 'Massage Gently', 'Apply']],
  ['ayurraksha-skinwell-soap-pack-of-2', ['Lather', 'Rinse', 'Pat Dry']],
];

(async () => {
  for (const [slug, words] of probes) {
    const body = await f(slug);
    console.log('\n===== ' + slug + ' (' + body.length + ' bytes) =====');
    words.forEach((w) => {
      const present = body.includes(w);
      // find a snippet around the first match
      let snippet = '';
      if (present) {
        const i = body.indexOf(w);
        snippet = body.slice(Math.max(0, i - 60), i + w.length + 40).replace(/\n/g, ' ').replace(/>\s*</g, ' | ');
      }
      console.log('  [' + (present ? 'Y' : 'N') + '] "' + w + '"  ' + snippet.slice(0, 90));
    });
  }
})();
