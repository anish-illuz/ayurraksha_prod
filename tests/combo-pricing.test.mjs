/**
 * Unit tests for the Combo Builder volume-discount pricing rule.
 *
 * These exercise the REAL shared source (src/lib/comboPricing.ts) — the same
 * module the front-end cart and the server order route import — so the tests
 * prove the live pricing rule, not a copy of it.
 */
import {
  comboSubtotalPaise,
  comboCouponFor,
  comboDiscountRupees,
  comboDiscountPercent,
  COMBO_TIERS,
} from '../src/lib/comboPricing.ts';
import { assert, suite, flush } from './assert.mjs';

const t = suite('ComboPricing');

// --- comboSubtotalPaise: only combo items count, in paise ---------------
t.test('comboSubtotalPaise sums only combo items in paise', () => {
  const items = [
    { price: 799.9, quantity: 2, isComboItem: true }, // 2*80000 p = 159980 p
    { price: 500, quantity: 5, isComboItem: false }, // ignored
  ];
  assert.equals(comboSubtotalPaise(items), 159980, 'paise subtotal');
});

t.test('comboSubtotalPaise floors to whole paise', () => {
  const items = [{ price: 799.9, quantity: 1, isComboItem: true }]; // 79990 p
  assert.equals(comboSubtotalPaise(items), 79990, 'single item paise');
});

t.test('comboSubtotalPaise is 0 with no combo items', () => {
  assert.equals(comboSubtotalPaise([{ price: 100, quantity: 3, isComboItem: false }]), 0, 'no combo items');
});

// --- tier selection -------------------------------------------------------
t.test('below ₹3,000 -> no coupon', () => {
  assert.falsy(comboCouponFor(299999), 'just under 300000 p');
});

t.test('₹3,000 inclusive -> COMBO3000 (10%)', () => {
  const tier = comboCouponFor(300000);
  assert.equals(tier?.coupon, 'COMBO3000', 'coupon');
  assert.equals(tier?.percent, 10, 'percent');
});

t.test('₹5,000 inclusive -> COMBO5000 (15%)', () => {
  const tier = comboCouponFor(500000);
  assert.equals(tier?.coupon, 'COMBO5000', 'coupon');
  assert.equals(tier?.percent, 15, 'percent');
});

t.test('just below ₹5,000 -> COMBO3000, not COMBO5000', () => {
  assert.equals(comboCouponFor(499999)?.coupon, 'COMBO3000', '4999.99 stays 10%');
});

t.test('exactly 0 -> no coupon', () => {
  assert.falsy(comboCouponFor(0), 'zero subtotal');
});

// --- discount amount (paise-exact) ---------------------------------------
t.test('₹5,000 x 15% = ₹750 discount', () => {
  assert.equals(comboDiscountRupees(500000), 750, '500000p @15%');
});

t.test('₹3,000 x 10% = ₹300 discount', () => {
  assert.equals(comboDiscountRupees(300000), 300, '300000p @10%');
});

t.test('below threshold -> 0 discount', () => {
  assert.equals(comboDiscountRupees(299999), 0, 'no discount under 300000p');
});

t.test('paise-exact rounding (e.g. 799800p @15% = 119970p = ₹1199.70)', () => {
  // 799800 * 15 / 100 = 119970 paise = 1199.70 rupees. This is the exact
  // reconciliation the order route relies on so the Woo order total equals
  // the front-end charge.
  assert.equals(comboDiscountRupees(799800), 1199.7, 'paise-exact discount');
});

t.test('discount percent reflects the tier, 0 otherwise', () => {
  assert.equals(comboDiscountPercent(300000), 10, '10% at 300000');
  assert.equals(comboDiscountPercent(500000), 15, '15% at 500000');
  assert.equals(comboDiscountPercent(0), 0, '0% at zero');
});

t.test('tiers never stack (single top tier)', () => {
  // A ₹6,000 subtotal takes the 15% tier, not 10%+15%.
  assert.equals(comboDiscountPercent(600000), 15, 'only top tier applies');
  assert.equals(COMBO_TIERS.length, 2, 'two tiers defined');
});
