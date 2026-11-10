// Re-verify all PDPs with HTML entity unescaping (step titles use & → &amp;).
const http = require('http'),
  fs = require('fs');
const slugs = fs.readFileSync(process.env.TEMP + '\\slugs.txt', 'utf8').trim().split('\n').filter(Boolean);
const data = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
const arr = Array.isArray(data) ? data : data.products;
const bySlug = {};
arr.forEach((p) => (bySlug[p.slug] = p));

function f(slug) {
  return new Promise((res) => {
    const r = http.get({ host: 'localhost', port: 3000, path: '/product/' + slug + '/', headers: { 'User-Agent': 'v' } }, (x) => {
      let b = '';
      x.on('data', (c) => (b += c));
      x.on('end', () => res({ status: x.statusCode, body: b }));
    });
    r.on('error', (e) => res({ status: 0, body: '', err: e.message }));
    r.setTimeout(15000, () => r.destroy(new Error('timeout')));
  });
}

// Handle HTML entities AND the JSON & escape used in the RSC payload (ampersand).
const unesc = (s) =>
  s
    .replace(/\\u0026/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'");

(async () => {
  let ok = 0,
    bad = 0;
  const problems = [];
  for (const slug of slugs) {
    const p = bySlug[slug];
    const r = await f(slug);
    if (r.status !== 200 || !p) {
      bad++;
      problems.push(slug + ' -> status ' + r.status);
      continue;
    }
    const html = unesc(r.body);
    const issues = [];
    if (html.includes('Simmer or Dissolve')) issues.push('generic "Simmer or Dissolve" heading present');
    if (html.includes('Consume as Routine')) issues.push('generic "Consume as Routine" heading present');
    (p.ritualSteps || []).forEach((s) => {
      if (s.title && !html.includes(s.title)) issues.push('missing step title: ' + s.title);
    });
    if (p.inStock === false && !/out of stock|notify me/i.test(html)) issues.push('out-of-stock not surfaced');
    if (issues.length === 0) ok++;
    else {
      bad++;
      problems.push(slug + ' (' + (p.name || '') + '): ' + issues.join(' | '));
    }
  }
  console.log('PDP checks: ' + ok + ' clean / ' + bad + ' with issues (of ' + slugs.length + ')');
  problems.forEach((x) => console.log('  - ' + x));
})().catch((e) => console.error(e.message));
