/**
 * Unit tests for the order-route item/variant resolution rule
 * (src/lib/orderItemResolution.ts) — the logic behind the "variable product
 * with a missing/stale variantId kills the whole order" P0 fix.
 */
import { resolveItemVariant } from '../src/lib/orderItemResolution.ts';
import { assert, suite } from './assert.mjs';

const t = suite('OrderItemResolution');

const VARIANTS = [
  { id: 28305, price: 2400, inStock: true, variationLabel: '30 Days Pack' },
  { id: 28306, price: 3850, inStock: false, variationLabel: '60 Days Pack' },
];

// --- simple products ------------------------------------------------------
t.test('simple product books the parent id, no variant', () => {
  const r = resolveItemVariant('simple', [], undefined);
  assert.equals(r, { useParent: true }, 'simple + no variantId');
});

t.test('simple product ignores a stray variantId (bundles may carry one)', () => {
  const r = resolveItemVariant('simple', VARIANTS, 28305);
  assert.equals(r, { useParent: true }, 'simple + stray variantId still parent');
});

// --- variable + explicit pack --------------------------------------------
t.test('variable + in-stock requested pack books exactly that pack', () => {
  const r = resolveItemVariant('variable', VARIANTS, 28305);
  assert.equals(r, { useParent: false, variantId: 28305, price: 2400, label: '30 Days Pack' }, 'requested pack');
});

t.test('variable + explicitly requested OUT-OF-STOCK pack is rejected (no silent swap)', () => {
  const r = resolveItemVariant('variable', VARIANTS, 28306);
  assert.equals(r, null, 'requested pack out of stock');
});

t.test('variable + STALE variantId (not in live details) is rejected', () => {
  const r = resolveItemVariant('variable', VARIANTS, 99999);
  assert.equals(r, null, 'unknown variant id');
});

// --- variable + no pack (the actual customer failure) ---------------------
t.test('variable + no variantId falls back to the first in-stock live variation', () => {
  const r = resolveItemVariant('variable', VARIANTS, undefined);
  assert.equals(r?.useParent, false, 'books a variation, not the parent');
  assert.equals(r?.variantId, 28305, 'first in-stock variation');
  assert.equals(r?.price, 2400, 'that variation price');
});

t.test('fallback skips out-of-stock firsts and picks the first available one', () => {
  const mixed = [
    { id: 1, price: 100, inStock: false },
    { id: 2, price: 200, inStock: true },
    { id: 3, price: 300, inStock: true },
  ];
  const r = resolveItemVariant('variable', mixed, undefined);
  assert.equals(r?.variantId, 2, 'skips the out-of-stock first variation');
});

t.test('variable with no live variations in stock is rejected', () => {
  const r = resolveItemVariant('variable', [
    { id: 1, price: 100, inStock: false },
    { id: 2, price: 200, inStock: false },
  ], undefined);
  assert.equals(r, null, 'no in-stock variation -> null');
});

t.test('variable with an empty live variation list is rejected', () => {
  const r = resolveItemVariant('variable', [], undefined);
  assert.equals(r, null, 'no variations at all -> null');
});

// --- real-world snapshot: boozliv live variations -------------------------
t.test('boozliv live snapshot: no variantId books the 30-day default pack', () => {
  const boozlivLive = [
    { id: 28305, price: 2400, inStock: true, variationLabel: '30 Days Pack' },
    { id: 28306, price: 3850, inStock: true, variationLabel: '60 Days Pack' },
  ];
  const r = resolveItemVariant('variable', boozlivLive, undefined);
  assert.equals(r?.variantId, 28305, 'default in-stock pack (matches bundle default)');
});
