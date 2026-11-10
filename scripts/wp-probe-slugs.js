// Probe a list of /product/<slug>/ URLs on a host, report status + title.
const https = require('https');
const fs = require('fs');

const host = process.argv[2];
const listFile = process.argv[3];
const slugs = fs.readFileSync(listFile, 'utf8').trim().split(/\r?\n/).filter(Boolean);

function probe(slug) {
  return new Promise((resolve) => {
    const req = https.get(
      `https://${host}/product/${encodeURIComponent(slug)}/`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
          Accept: 'text/html',
          Connection: 'close',
        },
        timeout: 45000,
      },
      (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          resolve({ slug, status: res.statusCode, loc: res.headers.location });
          res.resume();
          return;
        }
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          const title = (body.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
          resolve({ slug, status: res.statusCode, title: (title || '').trim().slice(0, 90), postid: (body.match(/postid-(\d+)/) || [])[1] || '' });
        });
      }
    );
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', (e) => resolve({ slug, status: 'ERR', err: e.message }));
  });
}

(async () => {
  const results = [];
  for (const s of slugs) results.push(await probe(s));
  for (const r of results)
    console.log(
      `${String(r.status).padEnd(5)} ${String(r.postid || '-').padEnd(6)} ${r.slug.padEnd(46)} ${r.loc || r.title || r.err || ''}`
    );
  fs.writeFileSync(listFile + '.results.json', JSON.stringify({ host, results }, null, 2));
})();
