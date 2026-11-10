// Ground the remaining "DONE" labels by fetching these pages from the running preview
// and checking for the specific markers the corrections ask for.
const http = require('http'),
  fs = require('fs');

const unesc = (s) =>
  s.replace(/\\u0026/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'");

function f(path) {
  return new Promise((res) => {
    const r = http.get({ host: 'localhost', port: 3000, path, headers: { 'User-Agent': 'v' } }, (x) => {
      let b = '';
      x.on('data', (c) => (b += c));
      x.on('end', () => res({ status: x.statusCode, body: unesc(b) }));
    });
    r.on('error', (e) => res({ status: 0, body: 'ERR ' + e.message }));
    r.setTimeout(20000, () => r.destroy(new Error('timeout')));
  });
}

const checks = [
  ['/about/', 'About us page (17)', ['Dr.', 'commitment', 'biograph']],
  ['/blog/', 'Blog page (15)', ['article', 'Excerpt', 'Read']],
  ['/shop/', 'Shop / filters (12)', ['Skin & Botanical Care', 'Digestive', 'filter']],
  ['/shop/?sort=bestsellers', 'Bestsellers sort (18)', ['Bestseller']],
];

(async () => {
  for (const [path, label, markers] of checks) {
    const r = await f(path);
    const body = r.body;
    const res = {};
    markers.forEach((m) => (res[m] = body.toLowerCase().includes(m.toLowerCase())));
    console.log('\n== ' + label + '  [' + path + ']  status=' + r.status + ' len=' + body.length);
    for (const [m, found] of Object.entries(res)) console.log('  [' + (found ? 'Y' : 'N') + '] ' + m);
  }

  // Home page banners / CTA (item 10)
  const home = await f('/');
  const hasShopNow = /shop now/i.test(home.body);
  const ctaLinks = (home.body.match(/href="\/(shop|combo-builder|product)\/[^"]*"/g) || []).length;
  console.log('\n== Main page banners (10)  [/]  status=' + home.status + ' len=' + home.body.length);
  console.log('  [Y/N] "Shop Now" CTA: ' + hasShopNow);
  console.log('  internal CTA links found: ' + ctaLinks);

  // Ingredient image files on disk (item 6)
  console.log('\n== Ingredient images on disk (item 6) ==');
  const imgDir = 'public/images/ingredients';
  if (fs.existsSync(imgDir)) {
    const files = fs.readdirSync(imgDir);
    console.log('  ' + imgDir + ': ' + files.length + ' files');
    const sample = ['clove', 'sesame', 'coconut', 'moringa', 'neem', 'ashwagandha', 'hibiscus'];
    sample.forEach((s) => {
      const hit = files.filter((x) => x.toLowerCase().includes(s));
      console.log('  [' + (hit.length ? 'Y' : 'N') + '] ' + s + ' -> ' + (hit[0] || '(none)'));
    });
  } else {
    console.log('  ' + imgDir + ' does not exist');
    // try alternatives
    ['public/images', 'public', 'src/images', 'public/images/products'].forEach((d) => {
      if (fs.existsSync(d)) console.log('    exists: ' + d + ' (' + fs.readdirSync(d).length + ' entries)');
    });
  }
})();
