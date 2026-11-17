/**
 * Meta Conversions API — customer-data hashing (pure, framework-free).
 *
 * Meta's Advanced Matching requires PII (email, phone, name, city, state, zip,
 * country, external id) to be sent as SHA-256 hashes, never in the clear. This
 * module holds the exact hashing rules so they can be unit-tested directly and
 * reused by the `/api/meta/conversions` route (and any future CAPI dispatcher).
 *
 *   - Strings are trimmed + lowercased before hashing.
 *   - Phones are normalized to digits; 10-digit Indian numbers get a `91`
 *     country-code prefix, matching Meta's documented convention.
 *
 * Output is always lowercase hex (64 chars for a real input).
 */
import crypto from 'crypto';

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/**
 * Hash a Meta text PII param (email, first/last name, city, state, zip,
 * country, external id). Returns undefined for empty values so the caller
 * omits the field entirely.
 */
export function hashMetaParam(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = String(value).trim().toLowerCase();
  if (!normalized) return undefined;
  return sha256(normalized);
}

/**
 * Hash a phone number for Meta `ph`. Strips non-digits, adds `91` for a
 * 10-digit Indian mobile, then SHA-256. Returns undefined when empty.
 */
export function hashMetaPhone(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  let digits = String(value).replace(/\D/g, '');
  if (!digits) return undefined;
  if (digits.length === 10) digits = `91${digits}`;
  return sha256(digits);
}
