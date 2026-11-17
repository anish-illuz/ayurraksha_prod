const { chromium, devices } = require('playwright');

async function testPerformance(isMobile) {
  const browser = await chromium.launch({ headless: true });
  const contextOptions = isMobile
    ? { ...devices['Pixel 5'], locale: 'en-US' }
    : { viewport: { width: 1366, height: 768 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36' };

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  const resources = [];
  page.on('response', async (response) => {
    try {
      const req = response.request();
      resources.push({
        url: req.url(),
        type: req.resourceType(),
        status: response.status(),
        size: (await response.body().catch(() => Buffer.alloc(0))).length,
        timing: response.timing()
      });
    } catch (_) {}
  });

  console.log(`\nNavigating to https://www.ayurrakshaonline.com (${isMobile ? 'MOBILE' : 'DESKTOP'})...`);
  const response = await page.goto('https://www.ayurrakshaonline.com', { waitUntil: 'load', timeout: 30000 });
  console.log(`Initial Status: ${response.status()}`);

  // Wait a bit for LCP / deferred scripts
  await page.waitForTimeout(4000);

  // Measure performance timings via browser performance API
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;

    return {
      ttfb: nav ? nav.responseStart - nav.requestStart : 0,
      domInteractive: nav ? nav.domInteractive : 0,
      domContentLoaded: nav ? nav.domContentLoadedEventEnd : 0,
      loadComplete: nav ? nav.loadEventEnd : 0,
      fcp: fcp
    };
  });

  // Calculate resource breakdowns
  let totalBytes = 0;
  const breakdown = {};
  for (const r of resources) {
    totalBytes += r.size;
    breakdown[r.type] = (breakdown[r.type] || 0) + r.size;
  }

  console.log(`--- ${isMobile ? 'MOBILE' : 'DESKTOP'} METRICS ---`);
  console.log(`TTFB: ${Math.round(metrics.ttfb)} ms`);
  console.log(`FCP: ${Math.round(metrics.fcp)} ms`);
  console.log(`DOM Content Loaded: ${Math.round(metrics.domContentLoaded)} ms`);
  console.log(`Load Complete: ${Math.round(metrics.loadComplete)} ms`);
  console.log(`Total Transferred: ${(totalBytes / 1024).toFixed(1)} KB across ${resources.length} requests`);
  console.log('Breakdown by type:');
  for (const [type, size] of Object.entries(breakdown)) {
    console.log(`  - ${type}: ${(size / 1024).toFixed(1)} KB`);
  }

  // Find largest resources
  console.log('Top 5 Largest Resources:');
  const sorted = [...resources].sort((a, b) => b.size - a.size).slice(0, 5);
  sorted.forEach(s => {
    console.log(`  * [${s.type}] ${(s.size / 1024).toFixed(1)} KB: ${s.url.substring(0, 90)}`);
  });

  await browser.close();
  return { metrics, breakdown, resources };
}

async function run() {
  await testPerformance(true);
  await testPerformance(false);
}

run().catch(console.error);
