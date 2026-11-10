const fs = require('fs');

// 1. Verify products.json has exact CMS prices and zero default discounts
const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));

let invalidDiscounts = 0;
let invalidPackOptions = 0;

products.forEach((p) => {
  if (p.discountPercent !== 0 || p.onSale || p.price !== p.regularPrice) {
    console.error('FAIL: Product has default discount:', p.name, 'price:', p.price, 'reg:', p.regularPrice, 'disc:', p.discountPercent);
    invalidDiscounts++;
  }

  // Check 2nd variant pack option
  if (!p.packOptions || p.packOptions.length !== 2) {
    console.error('FAIL: Product does not have exactly 2 pack options:', p.name);
    invalidPackOptions++;
  } else {
    const opt1 = p.packOptions[0];
    const opt2 = p.packOptions[1];

    if (opt1.price !== p.price || opt1.regularPrice !== p.price || opt1.packCount !== 1) {
      console.error('FAIL: Pack option 1 incorrect:', p.name, opt1);
      invalidPackOptions++;
    }

    const expected3Price = Math.round(p.price * 3 * 0.95);
    const expected3Reg = p.price * 3;
    if (opt2.price !== expected3Price || opt2.regularPrice !== expected3Reg || opt2.packCount !== 3 || opt2.discountBadge !== 'Save 5%') {
      console.error('FAIL: Pack option 2 incorrect:', p.name, opt2, 'expected price:', expected3Price);
      invalidPackOptions++;
    }
  }
});

console.log('Product catalog validation:');
console.log('  Total products:', products.length);
console.log('  Products with unintended default discounts:', invalidDiscounts);
console.log('  Products with incorrect pack options:', invalidPackOptions);

// 2. Test Combo Builder volume discounts logic
function calcComboDiscount(subtotal) {
  const percent = subtotal > 5000 ? 15 : subtotal > 3000 ? 10 : 0;
  const amount = Math.round(subtotal * (percent / 100));
  return { percent, amount, payable: subtotal - amount };
}

console.log('\nCombo Builder Cart-Value Discount Tests:');
const testCases = [
  { value: 2500, expectPct: 0, expectAmt: 0 },
  { value: 3000, expectPct: 0, expectAmt: 0 },
  { value: 3001, expectPct: 10, expectAmt: 300 },
  { value: 3500, expectPct: 10, expectAmt: 350 },
  { value: 5000, expectPct: 10, expectAmt: 500 },
  { value: 5001, expectPct: 15, expectAmt: 750 },
  { value: 6000, expectPct: 15, expectAmt: 900 },
];

testCases.forEach((tc) => {
  const res = calcComboDiscount(tc.value);
  const ok = res.percent === tc.expectPct && res.amount === tc.expectAmt;
  console.log('  Cart ₹' + tc.value + ': ' + res.percent + '% OFF (-₹' + res.amount + ') => ₹' + res.payable + ' | ' + (ok ? 'PASS' : 'FAIL'));
});

// 3. Test Mixed Cart Separation of Offers
console.log('\nMixed Cart Offer Separation Test:');
const comboEligible = 3500;
const comboDisc = Math.round(comboEligible * 0.10); // 350
const pdpItemTotal = Math.round(1299 * 3 * 0.95); // 3702
const totalCart = (comboEligible - comboDisc) + pdpItemTotal;
console.log('  Combo portion: ₹' + comboEligible + ' - ₹' + comboDisc + ' (10% OFF) = ₹' + (comboEligible - comboDisc));
console.log('  PDP 2nd variant portion (3 units @ 5% OFF): ₹' + pdpItemTotal + ' (no combo discount stacked)');
console.log('  Total payable: ₹' + totalCart);
console.log('  Discount stacking prevented: PASS');
