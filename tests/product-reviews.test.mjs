/**
 * Unit tests for the PDP review mapping rule (src/lib/productReviews.ts) —
 * the logic that turns raw wc/v3 (WooCommerce REST API) review rows into the
 * client-safe PdpReview shape shown on the product page.
 */
import { mapReview, cleanReviewText, dedupeReviews } from '../src/lib/productReviews.ts';
import { assert, suite } from './assert.mjs';

const t = suite('ProductReviews');

// --- cleanReviewText -------------------------------------------------------
t.test('strips HTML and decodes entities', () => {
  assert.equals(
    cleanReviewText('<p>Great product &amp; fast delivery.</p>'),
    'Great product & fast delivery.',
    'tags + entities'
  );
});

t.test('collapses <br> and blank lines to single spaces', () => {
  assert.equals(
    cleanReviewText('<p>line one<br>line two</p>\n\n'),
    'line one line two',
    'br + newline collapse'
  );
});

t.test('returns empty string for empty input', () => {
  assert.equals(cleanReviewText(''), '', 'empty');
});

// --- mapReview -------------------------------------------------------------
t.test('maps a full wc/v3 review row', () => {
  const r = mapReview({
    id: 358,
    reviewer: 'Nithyasree Kalairani',
    reviewer_email: 'someone@example.com', // must NOT leak
    review: '<p>I feel lighter and healthier since I started using BoozLiv</p>\n',
    rating: 5,
    verified: true,
    date_created: '2025-11-19T07:42:39',
    date_created_gmt: '2025-11-19T07:42:39',
    reviewer_avatar_urls: { '48': 'https://example.com/a-48.png', '96': 'https://example.com/a-96.png' },
  });
  assert.equals(r.reviewer, 'Nithyasree Kalairani', 'reviewer name');
  assert.equals(r.rating, 5, 'rating');
  assert.equals(r.verified, true, 'verified flag');
  assert.equals(r.review, 'I feel lighter and healthier since I started using BoozLiv', 'clean text');
  assert.equals(typeof r.avatar, 'string', 'avatar 96 preferred');
  assert.notContainsDeep(r, 'reviewer_email', 'email not forwarded to client');
  assert.notContainsDeep(r, 'someone@example.com', 'raw email value not forwarded');
  assert.truthy(/2025/.test(r.date), 'date includes year');
});

t.test('unrated review maps to rating 0, verified false', () => {
  const r = mapReview({
    id: 205,
    reviewer: 'A Customer',
    review: '<p>Nice</p>',
    rating: null,
    verified: false,
    date_created_gmt: '2025-11-19T07:42:39',
  });
  assert.equals(r.rating, 0, 'null rating -> 0');
  assert.equals(r.verified, false, 'verified false');
});

t.test('row with neither text nor reviewer is dropped (null)', () => {
  assert.equals(mapReview({ id: 1, review: '', reviewer: '  ' }), null, 'empty row dropped');
});

t.test('null / non-object input is dropped', () => {
  assert.equals(mapReview(null), null, 'null input');
  assert.equals(mapReview('garbage'), null, 'non-object input');
});

// --- dedupeReviews ---------------------------------------------------------
const mk = (id, text, rating, reviewer = 'A') => ({
  id,
  reviewer: reviewer,
  rating,
  verified: true,
  review: text,
  date: '1 Nov 2026',
});

t.test('dedupes identical texts, keeping the highest-rated row', () => {
  const out = dedupeReviews([
    mk(1, 'Great oil', 0),
    mk(2, 'Great oil', 5),
    mk(3, 'Great oil', 3),
  ]);
  assert.equals(out.length, 1, 'one row per text');
  assert.equals(out[0].rating, 5, 'keeps highest rating');
});

t.test('keeps distinct texts and respects the limit', () => {
  const out = dedupeReviews([
    mk(1, 'text one', 5),
    mk(2, 'text two', 4),
    mk(3, 'text three', 5),
  ], 2);
  assert.equals(out.length, 2, 'capped at limit');
  assert.equals(out[0].review, 'text one', 'most-recent order kept');
});

t.test('same text from different reviewers collapses to the best-rated row', () => {
  const out = dedupeReviews([
    mk(1, 'same words', 3, 'Ravi'),
    mk(2, 'same words', 5, 'Lakshmi'),
  ]);
  assert.equals(out.length, 1, 'one row');
  assert.equals(out[0].reviewer, 'Lakshmi', 'best rating wins');
});
