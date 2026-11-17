/**
 * AyurRaksha storefront — offline QA test runner.
 *
 * Dependency-free (runs on Node 24 native type-stripping + a module resolve
 * hook for the project's "@" alias). Executes the unit/integration contracts
 * that do NOT require production, a browser, or a live gateway:
 *
 *   - Combo pricing rule (shared front-end / server module)
 *   - Razorpay Standard Checkout signature verification (P0 proof-of-payment)
 *   - Meta CAPI PII hashing (Advanced Matching)
 *   - GA4 / Meta ecommerce event payloads + PII safety + purchase dedup
 *
 * Usage:  npm run test:qa   (or)  node tests/run-tests.mjs
 *
 * These are MOCKED/offline tests. They never place orders, touch the gateway,
 * or hit the live CMS. Live-journey E2E and payment-capture scenarios are run
 * separately via Playwright against a sandbox and are documented in the
 * reports, not executed here.
 */
import { register } from 'node:module';

// Keep output clean: suppress dev-mode console.log noise from analytics modules.
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Register the "@" -> ./src resolve hook so real source modules (which use
// @/ imports) load under plain Node. Runs in the loader thread.
register(new URL('./hooks.mjs', import.meta.url));

const testFiles = [
  './combo-pricing.test.mjs',
  './razorpay-verify.test.mjs',
  './meta-hash.test.mjs',
  './order-item-resolution.test.mjs',
  './analytics-payload.test.mjs',
];

for (const f of testFiles) {
  await import(f);
}

// Settle any async tests that registered a pending promise.
const { flush, printSummary } = await import('./assert.mjs');
await flush();

const s = printSummary();

// Write a machine-readable evidence snapshot for the QA reports (QA_REPORTS/).
try {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const outDir = path.resolve(process.cwd(), 'QA_REPORTS');
  fs.mkdirSync(outDir, { recursive: true });
  const snapshot = {
    runner: 'node-native-type-stripping',
    generatedAt: new Date().toISOString(),
    node: process.version,
    nodeModules: process.features.typescript ? 'typescript=strip' : 'no-native-ts',
    target: 'offline-unit (no browser, no gateway, no live CMS)',
    ...s,
  };
  fs.writeFileSync(path.join(outDir, 'unit-test-evidence.json'), JSON.stringify(snapshot, null, 2));
  console.log(`\nUnit evidence written to QA_REPORTS/unit-test-evidence.json`);
} catch (e) {
  console.log(`(skipped evidence write: ${e.message})`);
}

process.exitCode = s.failed > 0 ? 1 : 0;
