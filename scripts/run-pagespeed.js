const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const targetUrl = 'https://www.ayurrakshaonline.com';
const reportsDir = path.resolve(__dirname, '..', 'qa-reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const mobileReport = path.join(reportsDir, 'lh-mobile.json');
const desktopReport = path.join(reportsDir, 'lh-desktop.json');

console.log('Starting Mobile Lighthouse Audit for', targetUrl);
const mobileArgs = [
  'lighthouse',
  targetUrl,
  '--output=json',
  `--output-path="${mobileReport}"`,
  '--only-categories=performance',
  '--form-factor=mobile',
  '--throttling-method=simulate',
  '--chrome-flags="--headless=new --no-sandbox"',
  '--extra-headers="{\\"User-Agent\\":\\"Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36\\"}"',
  '--quiet'
];

const mRes = spawnSync('npx', mobileArgs, { shell: true, stdio: 'inherit', timeout: 180000 });
if (mRes.error) {
  console.error('Mobile audit execution error:', mRes.error);
}

console.log('\nStarting Desktop Lighthouse Audit for', targetUrl);
const desktopArgs = [
  'lighthouse',
  targetUrl,
  '--output=json',
  `--output-path="${desktopReport}"`,
  '--only-categories=performance',
  '--preset=desktop',
  '--chrome-flags="--headless=new --no-sandbox"',
  '--extra-headers="{\\"User-Agent\\":\\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36\\"}"',
  '--quiet'
];

const dRes = spawnSync('npx', desktopArgs, { shell: true, stdio: 'inherit', timeout: 180000 });
if (dRes.error) {
  console.error('Desktop audit execution error:', dRes.error);
}

function parseReport(filePath, label) {
  if (!fs.existsSync(filePath)) {
    console.error(`Report file ${filePath} not found`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const perfScore = Math.round(data.categories.performance.score * 100);
  console.log(`\n========================================`);
  console.log(`  ${label} PERFORMANCE SCORE: ${perfScore}/100`);
  console.log(`========================================`);

  const audits = data.audits;
  const metrics = [
    'first-contentful-paint',
    'largest-contentful-paint',
    'total-blocking-time',
    'cumulative-layout-shift',
    'speed-index',
    'server-response-time',
    'interactive'
  ];
  console.log('\nKey Metrics:');
  for (const m of metrics) {
    if (audits[m]) {
      console.log(`  - ${audits[m].title}: ${audits[m].displayValue} (score: ${audits[m].score})`);
    }
  }

  console.log('\nTop Savings / Opportunities:');
  const opps = Object.values(audits)
    .filter(a => a.details && a.details.type === 'opportunity' && a.numericValue > 50)
    .sort((a, b) => b.numericValue - a.numericValue);

  for (const o of opps.slice(0, 10)) {
    console.log(`  * [${o.id}] ${o.title}: ${o.displayValue} (~${Math.round(o.numericValue)} ms potential saving)`);
  }

  console.log('\nDiagnostics / Major Bottlenecks:');
  const diags = Object.values(audits)
    .filter(a => a.score !== null && a.score < 0.8 && a.details && a.details.type !== 'opportunity')
    .sort((a, b) => (a.score || 0) - (b.score || 0));

  for (const d of diags.slice(0, 8)) {
    console.log(`  ! [${d.id}] ${d.title}: score ${d.score} | ${d.displayValue || ''}`);
  }
}

parseReport(mobileReport, 'MOBILE');
parseReport(desktopReport, 'DESKTOP');
