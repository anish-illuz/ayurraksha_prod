/**
 * Minimal dependency-free assertion helpers for the Node test runner.
 * Records pass/fail into a shared results array; async tests register a
 * pending promise so the runner can settle everything before reporting.
 */

export const results = [];
const PENDING = new Set();

function record(suite, name, ok, details = '') {
  results.push({ suite, name, status: ok ? 'PASS' : 'FAIL', details });
}

export function suite(name) {
  const s = {
    test: (testName, fn, ...args) => {
      try {
        const r = fn(...args);
        if (r && typeof r.then === 'function') {
          // Async test: resolve/reject settles the record.
          PENDING.add(
            r.then(
              () => record(name, testName, true),
              (e) => record(name, testName, false, e?.message || String(e)),
            ),
          );
          return r;
        }
        record(name, testName, true);
      } catch (e) {
        record(name, testName, false, e?.message || String(e));
      }
      return undefined;
    },
  };
  return s;
}

export const assert = {
  equals(actual, expected, label = '') {
    const a = JSON.stringify(actual);
    const b = JSON.stringify(expected);
    if (a !== b) throw new Error(`${label} expected ${b}, got ${a}`);
  },
  truthy(value, label = '') {
    if (!value) throw new Error(`${label} expected truthy, got ${JSON.stringify(value)}`);
  },
  falsy(value, label = '') {
    if (value) throw new Error(`${label} expected falsy, got ${JSON.stringify(value)}`);
  },
  /** Deep string search — proves PII is absent from an event payload. */
  notContainsDeep(obj, forbidden, label = '') {
    const flat = JSON.stringify(obj);
    if (flat.includes(forbidden)) {
      throw new Error(`${label} payload must not contain PII ${JSON.stringify(forbidden)}; found it`);
    }
  },
};

/** Await every async test that registered a pending promise. */
export function flush() {
  return Promise.allSettled(Array.from(PENDING));
}

export function summary() {
  const total = results.length;
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = total - passed;
  return { total, passed, failed, results };
}

export function printSummary() {
  const s = summary();
  console.log('\n===============================================================');
  console.log(`TOTAL: ${s.total} | PASSED: ${s.passed} | FAILED: ${s.failed}`);
  console.log('===============================================================');
  for (const r of s.results) {
    const mark = r.status === 'PASS' ? 'PASS' : 'FAIL';
    console.log(`[${mark}] ${r.suite} > ${r.name}${r.details ? ` -- ${r.details}` : ''}`);
  }
  return s;
}
