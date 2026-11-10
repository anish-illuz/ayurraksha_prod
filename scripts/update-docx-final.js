// Final regeneration of the corrections document status labels.
//  1. Strip every existing "Status:" paragraph (they were partly mis-scoped/stale).
//  2. Insert one truthful status label per correction item, anchored on the item's
//     HEADING paragraph (unique, stable text), so each label sits directly under its item.
// The status/notes reflect what was verified on the live preview (desktop + 375px mobile)
// and what was written into the CMS and confirmed by API read-back.
const fs = require('fs');

const xmlPath = process.argv[2]; // edited/extracted document.xml
let xml = fs.readFileSync(xmlPath, 'utf8');
if (xml.charCodeAt(0) === 0xfeff) xml = xml.slice(1);

function createStatusParagraph(status, note) {
  const isPartial = /PARTIALLY/.test(status);
  const isDone = /DONE/.test(status) && !isPartial;
  const colorVal = isDone ? '167B40' : isPartial ? 'B45309' : 'C0392B';
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const notePart = note ? '<w:r><w:rPr><w:i/><w:color w:val="2C3E50"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve"> — ' + esc(note) + '</w:t></w:r>' : '';
  return '<w:p><w:pPr><w:spacing w:before="80" w:after="160"/><w:jc w:val="left"/></w:pPr>' +
    '<w:r><w:rPr><w:b/><w:color w:val="' + colorVal + '"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">Status: ' + esc(status) + '</w:t></w:r>' +
    notePart +
    '</w:p>';
}

// Split into top-level <w:p> blocks (document.xml).
function blocksOf(s) {
  return s.match(/<w:p\b[\s\S]*?<\/w:p>/g) || [];
}
function textOf(p) {
  const ts = p.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g) || [];
  return ts.map((t) => t.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>$/, '')).join('')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

// ---- 1. STRIP existing status labels ----
let blocks = blocksOf(xml);
const before = blocks.length;
blocks = blocks.filter((p) => !textOf(p).trim().startsWith('Status:'));
xml = xml.replace(/<w:p\b[\s\S]*?<\/w:p>/g, (p) => (textOf(p).trim().startsWith('Status:') ? '' : p));
console.log('stripped ' + (before - blocks.length) + ' existing status paragraphs');

// ---- 2. THE FINAL STATUS TABLE (64 items), anchored on unique heading text ----
const D = '✅ DONE';
const P = '🟡 PARTIALLY DONE';
const N = '❌ NOT DONE';
const labels = [
  // General PDP fixes (items 1-7)
  ['REMOVE GENERIC DRINKING INSTRUCTIONS', D, "Verified across all 48 product pages on the live preview: no generic drink/simmer instructions on topical or oral-care products; each shows type-appropriate steps and external-use warnings."],
  ['CORRECT THE INSTRUCTION HEADINGS', D, "Instruction headings match each product type (oil, cream, shampoo, soap, capsule, powder, tea) and no longer carry the generic “Simmer or Dissolve / Consume as Routine” titles."],
  ['SHOW ALL STEPS', D, "The PDP renders the full step set (up to 4–5) with no cutoff, on desktop and 375px mobile."],
  ['KEEP PRODUCT INFORMATION IN THE RIGHT SECTION', D, "Content is organised into About / Key benefits / Ingredients / How to use / Precautions / Specifications sections on every product page."],
  ['REMOVE THE REPEATED GENERIC SECTION', D, "No repeated generic “Traditional Ayurvedic Wellness” accordion or reused combination imagery remains on the product pages."],
  ['CORRECT ALL INGREDIENT IMAGES', D, "74 ingredient image files are present on disk; product ingredient cards now point to the correct botanicals (clove, sesame, coconut, moringa, neem, ashwagandha, hibiscus spot-checked)."],
  ['as one word in editable website text', D, "Standardised to one word across editable text (product data now 0 two-word occurrences, ~546 one-word). Packaging artwork is untouched. Four stray two-word strings in the Foot Bath / Skin Conditioning copy were corrected and re-verified."],
  // Pricing (section 8)
  ['PREPAID PRICE', D, "Kalonji Soap price synchronised to ₹200 on the shop, PDP and Skin Care Builder; CMS WooCommerce id 122 updated to 200 and confirmed by API read-back. Prepaid offer held at 5% (₹190) per client decision."],
  ['SKIN CARE BUILDER', D, "Skin Care Builder shows Kalonji at ₹200; CMS id 122 now 200 (read-back confirmed). Verified on desktop and 375px mobile."],
  ['VITAL O3 CREAM', D, "Vital O3 shown at ₹4,000 in the Skin Care Builder; CMS WooCommerce id 123 updated to 4000 and confirmed by API read-back."],
  ['CHECK ALL PREPAID OFFERS', P, "5% prepaid discount verified UNIFORMLY on the local Next.js storefront preview (product/pack cards and all four combo builders). Live check on www.ayurrakshaonline.com (2026-11-10): the public WordPress/Elementor checkout does NOT apply a 5% price discount. It charges full price (Kalonji Rs200 and Vital O3 Rs4000, both on_sale=false, no discount line) and there is no active 5% coupon; the only prepaid offer on the live site is a \"Get Free Shipping On Prepaid Orders\" banner. The advertised 5% therefore still does not match the price charged at the live checkout - the 5% was verified on the preview only. Needs client confirmation: enable a 5% discount on the live WooCommerce checkout, or confirm the approved offer is free-shipping-only (in which case update the advertised card copy)."],
  ['CHECK COMBO SUBTOTALS', D, "Selection, volume discounts and cart/checkout totals verified across all four builders on the live preview."],
  // Individual pages (section 9)
  ['AYURRAKSHA DETOX TEA', D, "Brewing headings match the boiling steps; pack labels (40 sachets ₹750 / 120 sachets ₹1,988) display fully; senna references removed. Verified on live preview."],
  ['MIGRO PRIME TABLETS', D, "Generic tea instructions replaced with tablet directions (1 tablet 2–3× daily after meals); 5 ingredients listed. Page verified on live preview."],
  ['ROLL-ON', D, "Topical headings (clean & dry, apply, allow to dry) and external-use precautions verified on live preview."],
  ['SUPERHEAL O3 CREAM', D, "Cream-application headings and topical precautions verified on live preview."],
  ['DANT SWASTHYA', D, "Tooth-powder application/rinsing headings and oral precautions verified on live preview."],
  ['PREMIUM HIGH FIBER HEALTH MIX', D, "Preparation heading uses milk; barley/soy/peanut/almond allergy warning retained. Verified on live preview."],
  ['GARGling OIL', D, "Verified on live preview (desktop + 375px mobile): steps are Measure the Oil → Swish as Directed → Spit Out Completely → Rinse Mouth Thoroughly, DO-NOT-SWALLOW warning prominent, clove image corrected. Contaminated CMS record id 91 (old “Simmer/Consume as Routine” titles + generic images) was updated and confirmed by API read-back."],
  ['AYURRAKSHA ALG', D, "Capsule headings and complete ingredient list verified on live preview."],
  ['CREAT CAPSULES', D, "Capsule headings, complete ingredients and price ₹1,299 verified on live preview."],
  ['IMU 360', D, "Capsule headings and complete ingredients verified on live preview."],
  ['BPAIN OUT CAPSULES', D, "Generic drinking instructions removed; capsule directions and 15-day pack specified. Verified on live preview."],
  ['HERBAL SHAMPOO', D, "Shampoo application/rinse headings (twice weekly) and hibiscus image verified on live preview."],
  ['HAIR WELL CAPSULES', D, "Capsule headings and botanical cards verified on live preview."],
  ['SKIN CONDITIONING OIL', D, "Topical headings; Wrightia tinctoria + virgin coconut oil listed with image. Verified on live preview."],
  ['SP SORYN CREAM', D, "Cream-application headings and topical precautions verified on live preview."],
  ['B DERMA CAPSULES', D, "Doctor-guided capsule headings and botanical cards verified on live preview."],
  ['SKIN WELL MOISTURISING GEL', D, "Drinking instructions removed; clean-&-dry / apply / absorb directions and external-use precautions restored. Verified on live preview."],
  ['BETA POWDER', D, "One-pinch-on-empty-stomach instruction and in-stock status verified on live preview."],
  ['CREAM / BALM', D, "Drinking instructions removed; external application directions and do-not-swallow precautions restored. Verified on live preview."],
  ['DIA WELL CAPSULES', D, "Verified on live preview (desktop + mobile): capsule headings, formula highlights Fenugreek/Gymnema/Moringa/Jamun, insulin & prescription-medication warning restored. Contaminated CMS record id 104 was fully cleaned: a verification pass found the contamination extended beyond steps/ingredient to the story, hero image tag, feature cards, target indications and pack options (all carried SP Soryn / other-product content); every one of those fields was corrected to Dia Well's own data and confirmed clean by a full API read-back."],
  ['B GASONIL', D, "Sachet directions and sweet-fennel image verified on live preview."],
  ['BOOZNIL', D, "Sachet directions verified on live preview."],
  ['SKIN WELL FOOD SUPPLEMENT CAPSULES', D, "Capsule directions and complete botanical list verified on live preview."],
  ['SAVE HEART', D, "Tonic headings; 500 ml quantity verified across builder/shop/PDP; heart-medication warning retained. Verified on live preview."],
  ['SKINWELL SOAP', D, "Soap-use headings, external-use/eye precautions and the avocado card verified on live preview."],
  ['FLOW WELL CAPSULES', D, "Verified on live preview (desktop + mobile): staged capsule directions (Evening Dose → Staged Clinical Protocol) and the grape seed / Vitis vinifera card. Contaminated CMS record id 110 was fully cleaned: a verification pass found the contamination extended beyond steps/ingredient to the story, hero image tag, feature cards, target indications and pack options (all carried B-Gasonil / other-product content); every one of those fields was corrected to Flow Well's own data and confirmed clean by a full API read-back."],
  ['LAXAHEALTH TEA', D, "40 tea bags; tea-bag preparation; senna precautions restored; generic long-term statement removed. Verified on live preview."],
  ['PURNA SAKTHI TONIC', D, "Tonic headings; 500 ml consistent; curry-leaf image. Verified on live preview."],
  ['DIVINE HEALING OIL', D, "Topical headings; 100 ml; external-use/wound precautions. Verified on live preview."],
  ['BOOZLIV', D, "Sachet headings; Siddha context; black-pepper image. Verified on live preview."],
  ['ESNOVATE CAPSULES', D, "Capsule directions (1–2 daily with water after meals); 5 ingredients. Verified on live preview."],
  ['DHAYANI HERBAL HAIR OIL', D, "Hair-oil headings with 45-min leave-on; red-onion image; 100 ml. Verified on live preview."],
  ['HERBO PROTEIN POWDER', D, "Verified on live preview: powder directions (measure/mix/stir/consume), Mucuna pruriens (Velvet Bean) + Ashwagandha/Gokshura/Musli cards, L-DOPA context. Contaminated CMS record id 117 was fully cleaned: a verification pass found the contamination extended beyond steps/ingredient to the story, hero image tag, feature cards, target indications and pack options (all carried Purna Sakthi / other-product content); every one of those fields was corrected to Herbo Protein's own data (100g jar, 800/920) and confirmed clean by a full API read-back. Note: shown in stock in the storefront; physical warehouse stock level not confirmed."],
  ['HIBISCUS TEA', D, "Verified on live preview: 40 tea bags, brewing steps (Boil Fresh Water → Infuse Tea Bag → Steep 3–5 Mins → Enjoy Hot or Iced), hibiscus-petal + green-tea cards, no Divine-Healing-Oil contamination. Contaminated CMS record id 118 was fully cleaned: a verification pass found the contamination extended beyond steps/ingredient to the story, hero image tag, feature cards, target indications and pack options (all carried Divine Healing Oil / other-product content, and a wrong “external use only” advisory); every one of those fields was corrected to Hibiscus Tea's own data (40 tea bags, 400/460) and confirmed clean by a full API read-back. Note: currently shown out of stock in the storefront."],
  ['PI WELL CAPSULES', D, "Verified on live preview: capsule directions, formula scoped to Pumpkin/Neem/Tulsi, no sachet/BoozLiv contamination. Contaminated CMS record id 119 was fully cleaned: a verification pass found the contamination extended beyond steps/ingredient to the story, hero image tag, feature cards, target indications and pack options (all carried BoozLiv / liver-syrup / other-product content, including a sachet form “60 sachets × 10 ml”); every one of those fields was corrected to PI Well's own data (60 capsules per bottle, 1199/1299) and confirmed clean by a full API read-back. Note: shown in stock; physical warehouse stock not confirmed."],
  ['SLEEP WELL CAPSULES', D, "Bedtime dosage with warm milk/water; prescription-sleep-medicine warning; ashwagandha image. Verified on live preview."],
  // Combo builder corrections
  ['SKIN CARE COMBO BUILDER', D, "All 13 required products present and verified on live preview (desktop + 375px mobile): Divine Healing Oil, Skin Conditioning Oil, SP Soryn Cream, SkinWell Soap, Anti-Tan Kalonji Soap, Herbal Hair Shampoo, Skin Well Food Supplement, IMU 360, B Derma, Detox Tea, SuperHeal O3 Cream, Immune O3 Capsules, Vital O3 Cream. Kalonji ₹200, Vital O3 ₹4,000; CMS ids 122/123 synced and read-back confirmed."],
  ['VARICOSE VEINS', D, "Intro shortened; 5 products • 5 categories corrected; urgent-care warning for open wounds/bleeding retained. Verified on live preview."],
  ['BREATH EASY', D, "Urgent-care warning for breathing difficulty retained. Verified on live preview."],
  ['CARDIAC WELLNESS', D, "Save Heart quantity verified at 500 ml; chest-pain emergency warning present. Verified on live preview."],
  ['TEST ALL FOUR BUILDERS', D, "Selection/removal, volume discounts, mobile layout and cart/checkout integration verified on all four builders (desktop + 375px mobile)."],
  // Mobile / pages
  ['Main page banners', D, "Clear “Shop Now” CTA on each banner; verified on live preview (desktop + 375px mobile) with no horizontal overflow."],
  ['MOBILE SHOP PAGE', D, "Verified at 375px mobile: product names enlarged, pack size shown, category labels untruncated, single Add to Cart button; no horizontal overflow."],
  ['CONCERN AND CATEGORY FILTERS', D, "Verified at 375px mobile: “Skin & Botanical Care” filter label correct; products categorised appropriately."],
  ['DETOX TEA MOBILE PAGE', D, "Verified at 375px mobile: full pack labels/prices, product image shown early, purchase button reachable; no overflow."],
  ['PRODUCT PAGE SECTION HEADINGS', D, "Customer-friendly headings (About this product, Key benefits, Ingredients, How to use, Precautions, Delivery & returns) verified on product pages at desktop + mobile."],
  ['BLOG PAGE', D, "62 articles render; titles shortened and formatted cleanly; excerpts concise. Verified on live preview."],
  ['MOBILE TEXT CLARITY', D, "Contrast and text sizes verified at 375px mobile; review counts, crossed-out prices and discount badges readable without zooming."],
  ['About us page', D, "Verified on desktop + 375px mobile: doctor biography and commitment card present and left-aligned."],
  ['BESTSELLERS LINK', D, "The /shop/?sort=bestsellers route is live and shows a Bestseller indicator; the navigation link wires to it."],
  ['ORDER TRACKING', D, "A dedicated /order-tracking/ page (“Track your order”) with waybill/courier fields is live, plus the account portal and WhatsApp assistance."],
  ['Mobile design', D, "All 10 mobile design standards applied (font system, mobile text sizes, contrast, banner CTAs, shop cards, PDP sections, pack selector, combo builders, about/blog, checkout) and verified at 375px mobile."],
];

// ---- 3. INSERT each label right after its heading block ----
let inserted = 0, missing = [], ambiguous = [];
for (const [anchor, status, note] of labels) {
  const matches = blocks.filter((p) => textOf(p).includes(anchor));
  if (matches.length === 0) { missing.push(anchor); continue; }
  if (matches.length > 1) ambiguous.push(anchor + ' (' + matches.length + ')');
  const target = matches[0];
  const statusP = createStatusParagraph(status, note);
  xml = xml.replace(target, target + statusP);
  blocks = blocksOf(xml); // re-scan so subsequent anchors see the new labels
  inserted++;
}

console.log('inserted ' + inserted + ' of ' + labels.length);
if (missing.length) console.log('MISSING anchors:\n  ' + missing.join('\n  '));
if (ambiguous.length) console.log('AMBIGUOUS anchors (>1 block):\n  ' + ambiguous.join('\n  '));

fs.writeFileSync(xmlPath, xml, 'utf8');
console.log('wrote ' + xmlPath + ' (' + xml.length + ' bytes)');
