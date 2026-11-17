const { chromium, devices } = require('playwright');
const fs = require('fs');

async function auditDevice(isMobile) {
  const label = isMobile ? 'MOBILE' : 'DESKTOP';
  console.log(`\n==============================================`);
  console.log(`  RUNNING PERFORMANCE AUDIT: ${label}`);
  console.log(`==============================================`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });

  const contextOptions = isMobile
    ? {
        ...devices['Pixel 5'],
        locale: 'en-US',
        userAgent: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'
      }
    : {
        viewport: { width: 1440, height: 900 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
      };

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  const requests = [];
  const failedRequests = [];
  const consoleMessages = [];

  page.on('console', msg => consoleMessages.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => consoleMessages.push(`[PAGE ERROR] ${err.message}`));

  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), error: req.failure()?.errorText });
  });

  page.on('response', async res => {
    try {
      const req = res.request();
      const headers = res.headers();
      const contentLength = parseInt(headers['content-length'] || '0', 10);
      requests.push({
        url: req.url(),
        resourceType: req.resourceType(),
        status: res.status(),
        contentLength: contentLength,
        contentType: headers['content-type'] || '',
        timing: res.timing()
      });
    } catch (_) {}
  });

  const startTime = Date.now();
  const response = await page.goto('https://www.ayurrakshaonline.com', {
    waitUntil: 'networkidle',
    timeout: 45000
  }).catch(async (e) => {
    console.log('networkidle timeout or error, falling back to domcontentloaded:', e.message);
    return await page.goto('https://www.ayurrakshaonline.com', { waitUntil: 'load', timeout: 30000 });
  });

  const totalLoadTime = Date.now() - startTime;
  console.log(`Status Code: ${response?.status()} (in ${totalLoadTime}ms)`);

  // Wait 3 seconds for observers
  await page.waitForTimeout(3000);

  // Measure Web Vitals
  const webVitals = await page.evaluate(() => {
    return new Promise((resolve) => {
      const result = {
        fcp: 0,
        lcp: 0,
        lcpElement: 'none',
        cls: 0,
        ttfb: 0,
        domInteractive: 0,
        domContentLoaded: 0,
        loadEvent: 0,
        longTasksCount: 0,
        totalLongTaskDuration: 0
      };

      const nav = performance.getEntriesByType('navigation')[0];
      if (nav) {
        result.ttfb = nav.responseStart - nav.requestStart;
        result.domInteractive = nav.domInteractive;
        result.domContentLoaded = nav.domContentLoadedEventEnd;
        result.loadEvent = nav.loadEventEnd;
      }

      const paint = performance.getEntriesByType('paint');
      const fcpEntry = paint.find(p => p.name === 'first-contentful-paint');
      if (fcpEntry) result.fcp = fcpEntry.startTime;

      // LCP
      try {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const last = entries[entries.length - 1];
          if (last) {
            result.lcp = last.renderTime || last.loadTime || last.startTime;
            result.lcpElement = last.element ? last.element.tagName + (last.element.id ? '#' + last.element.id : '') + (last.element.className ? '.' + last.element.className.split(' ').slice(0, 2).join('.') : '') : (last.url || 'none');
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (_) {}

      // CLS
      try {
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              result.cls += entry.value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
      } catch (_) {}

      // Long Tasks
      try {
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            result.longTasksCount++;
            result.totalLongTaskDuration += entry.duration;
          }
        }).observe({ type: 'longtask', buffered: true });
      } catch (_) {}

      setTimeout(() => resolve(result), 1500);
    });
  });

  console.log(`\n--- ${label} WEB VITALS & METRICS ---`);
  console.log(`TTFB: ${Math.round(webVitals.ttfb)} ms`);
  console.log(`FCP (First Contentful Paint): ${Math.round(webVitals.fcp)} ms`);
  console.log(`LCP (Largest Contentful Paint): ${Math.round(webVitals.lcp)} ms (Target: < 2500ms)`);
  console.log(`LCP Element: ${webVitals.lcpElement}`);
  console.log(`CLS (Cumulative Layout Shift): ${webVitals.cls.toFixed(4)} (Target: < 0.1)`);
  console.log(`DOM Content Loaded: ${Math.round(webVitals.domContentLoaded)} ms`);
  console.log(`Load Event: ${Math.round(webVitals.loadEvent)} ms`);
  console.log(`Long Tasks: ${webVitals.longTasksCount} (Total blocking time approx: ${Math.round(webVitals.totalLongTaskDuration)} ms)`);

  console.log(`\n--- NETWORK ANALYSIS (${requests.length} total requests) ---`);
  const typeSummary = {};
  let totalBytes = 0;
  for (const r of requests) {
    typeSummary[r.resourceType] = (typeSummary[r.resourceType] || { count: 0, bytes: 0 });
    typeSummary[r.resourceType].count++;
    typeSummary[r.resourceType].bytes += r.contentLength;
    totalBytes += r.contentLength;
  }

  for (const [type, info] of Object.entries(typeSummary)) {
    console.log(`  - ${type.padEnd(12)}: ${info.count} requests, ${(info.bytes / 1024).toFixed(1)} KB`);
  }
  console.log(`Total Download Size (via Content-Length): ${(totalBytes / 1024).toFixed(1)} KB`);

  // Print top 8 heaviest assets
  console.log(`\nTop 8 Heaviest Assets:`);
  const sorted = [...requests].sort((a, b) => b.contentLength - a.contentLength).slice(0, 8);
  sorted.forEach(s => {
    console.log(`  * [${s.resourceType}] ${(s.contentLength / 1024).toFixed(1)} KB: ${s.url}`);
  });

  if (failedRequests.length > 0) {
    console.log(`\nFailed Requests (${failedRequests.length}):`);
    failedRequests.forEach(f => console.log(`  ! FAILED: ${f.url} (${f.error})`));
  }

  if (consoleMessages.length > 0) {
    console.log(`\nConsole Warnings/Errors (first 5):`);
    consoleMessages.slice(0, 5).forEach(m => console.log(`  ${m}`));
  }

  await browser.close();
  return { webVitals, requests, failedRequests };
}

async function run() {
  const mobile = await auditDevice(true);
  const desktop = await auditDevice(false);
  fs.writeFileSync('./qa-reports/audit-summary.json', JSON.stringify({ mobile, desktop }, null, 2));
}

run().catch(console.error);
