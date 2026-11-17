/**
 * Unit tests for Meta Conversions API PII hashing (Advanced Matching).
 *
 * Exercises the REAL pure source (src/lib/metaHash.ts) used by the
 * /api/meta/conversions route. Confirms PII is SHA-256 hashed with the exact
 * Meta normalisation (trim + lowercase; phones stripped to digits with a 91
 * country code) and that empty values are omitted, not hashed to a sentinel.
 */
import crypto from 'node:crypto';
import { hashMetaParam, hashMetaPhone } from '../src/lib/metaHash.ts';
import { assert, suite } from './assert.mjs';

const t = suite('MetaHash');

function sha256(v) {
  return crypto.createHash('sha256').update(v).digest('hex');
}

// --- string PII ----------------------------------------------------------
t.test('email is trimmed + lowercased + SHA-256', () => {
  assert.equals(hashMetaParam('  John@Example.COM  '), sha256('john@example.com'), 'email');
});

t.test('name/city/state/country are lowercased before hashing', () => {
  assert.equals(hashMetaParam('ChENNAI'), sha256('chennai'), 'city');
});

t.test('empty/whitespace value returns undefined (field omitted)', () => {
  assert.equals(hashMetaParam(''), undefined, 'empty string');
  assert.equals(hashMetaParam('   '), undefined, 'whitespace');
  assert.equals(hashMetaParam(null), undefined, 'null');
  assert.equals(hashMetaParam(undefined), undefined, 'undefined');
});

t.test('output is lowercase hex, 64 chars', () => {
  const h = hashMetaParam('jane@example.com');
  assert.truthy(/^[0-9a-f]{64}$/.test(h), 'hex shape');
});

// --- phone PII -----------------------------------------------------------
t.test('phone is stripped to digits before hashing', () => {
  assert.equals(hashMetaPhone('+91 98765 43210'), sha256('919876543210'), 'formatted phone');
});

t.test('10-digit Indian mobile gets 91 country-code prefix', () => {
  assert.equals(hashMetaPhone('9876543210'), sha256('919876543210'), '10-digit -> 91-prefixed');
});

t.test('already country-coded number is NOT double-prefixed', () => {
  // 12 digits (91 + 10) -> used as-is, no extra 91.
  assert.equals(hashMetaPhone('919876543210'), sha256('919876543210'), '12-digit unchanged');
});

t.test('empty phone returns undefined', () => {
  assert.equals(hashMetaPhone(''), undefined, 'empty');
  assert.equals(hashMetaPhone('abc'), undefined, 'non-digits only');
});
