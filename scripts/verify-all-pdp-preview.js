// Fetch every individual PDP from the running local preview and check its How-to-Use
// headings against the product data (no generic "Simmer or Dissolve" / "Consume as Routine"),
// presence of the expected step count, and stock flag.
const http = require('http');

const SLUGS_FILE = process.env.TEMP + '\\slugs.txt';
const DATA_FILE = 'src/data/products.json';
const PORT = 3000;

const fs = require('fs');
const slugs = fs.readFileSync(SLUGS_FILE, 'utf8').trim().split('\n').filter(Boolean);
const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const arr = Array.isArray(data) ? data : data.products;
const bySlug = {};
arr.forEach((p) => (bySlug[p.slug] = p));

function fetchPage(slug) {
  return new Promise((resolve) => {
    const req = http.get({ host: 'localhost', port: PORT, path: '/product/' + slug + '/', headers: { 'User-Agent': 'verify/1' } }, (res) => {
      let b = '';
      res.on('data', (c) => (b += c));
      res.on('end', () => resolve({ status: res.statusCode, body: b }));
    });
    req.on('error', (e) => resolve({ status: 0, body: '', err: e.message }));
    req.setTimeout(15000, () => req.destroy(new Error('timeout')));
  });
}

(async () => {
  let ok = 0, bad = 0;
  const problems = [];
  for (const slug of slugs) {
    const p = bySlug[slug];
    const r = await fetchPage(slug);
    if (r.status !== 200 || !p) {
      bad++;
      problems.push({ slug, issue: 'fetch/status ' + r.status });
      continue;
    }
    const html = r.body;
    const issues = [];
    // generic contaminated headings must be absent
    if (html.includes('Simmer or Dissolve')) issues.push('has generic "Simmer or Dissolve" heading');
    if (html.includes('Consume as Routine')) issues.push('has generic "Consume as Routine" heading');
    // each ritual step title from data should be present
    const steps = p.ritualSteps || [];
    steps.forEach((s) => {
      if (s.title && !html.includes(s.title)) issues.push('missing step title: ' + s.title);
    });
    // out of stock should surface
    if (p.inStock === false && !/out of stock|notify me/i.test(html)) issues.push('out-of-stock not surfaced');
    if (issues.length === 0) ok++;
    else {
      bad++;
      problems.push({ slug, name: p.name, stock: p.inStock, issues });
    }
  }
  console.log('PDP checks: ' + ok + ' clean / ' + bad + ' with issues (of ' + slugs.length + ')');
  problems.forEach((x) => {
    console.log('  -', x.slug, x.name ? '("' + x.name + '")' : '', x.issue ? '| ' + x.issue : '');
    if (x.issues) x.issues.forEach((i) => console.log('        *', i));
  });
})();
