// Robust single-page fetcher with retries (some Hostinger edges drop keep-alive).
const https = require('https');
const fs = require('fs');

const url = process.argv[2];
const outPath = process.argv[3];

function get(url, attempt = 0) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          Connection: 'close',
        },
        timeout: 60000,
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
        res.on('error', reject);
      }
    );
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', (e) => {
      if (attempt < 3) setTimeout(() => get(url, attempt + 1).then(resolve, reject), 1500);
      else reject(e);
    });
  });
}

(async () => {
  const r = await get(url);
  if (outPath) fs.writeFileSync(outPath, r.body);
  const b = r.body;
  console.log(`status=${r.status} len=${b.length} url=${url}`);
  const g = (re) => (b.match(re) || [])[1];
  console.log('  title      :', (g(/<title[^>]*>([\s\S]*?)<\/title>/i) || '').trim().slice(0, 110));
  console.log('  generator  :', g(/generator" content="([^"]+)"/i) || '-');
  console.log('  body class :', (g(/<body class="([^"]*)"/i) || '').slice(0, 160));
  console.log('  h1         :', (g(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120));
  console.log('  canonical  :', g(/<link rel="canonical" href="([^"]+)"/i) || '-');
})().catch((e) => {
  console.error('FAILED', url, e.message);
  process.exit(1);
});
