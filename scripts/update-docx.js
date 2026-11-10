const fs = require('fs');
const path = require('path');

const xmlPath = path.join(process.env.TEMP, 'docx_extracted', 'word', 'document.xml');
let xml = fs.readFileSync(xmlPath, 'utf8');

function createStatusParagraph(statusText, noteText) {
  const isPartial = statusText.includes('PARTIALLY');
  const isDone = statusText.includes('DONE') && !isPartial;
  const colorVal = isDone ? '167B40' : (isPartial ? 'B45309' : 'C0392B');

  const escapedNote = (noteText || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const escapedStatus = statusText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return '<w:p><w:pPr><w:spacing w:before="120" w:after="120"/><w:jc w:val="left"/></w:pPr>' +
         '<w:r><w:rPr><w:b/><w:color w:val="' + colorVal + '"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">Status: ' + escapedStatus + '</w:t></w:r>' +
         (escapedNote ? '<w:r><w:rPr><w:i/><w:color w:val="2C3E50"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve"> — ' + escapedNote + '</w:t></w:r>' : '') +
         '</w:p>';
}

const statusMap = [
  { match: 'REMOVE GENERIC DRINKING INSTRUCTIONS', status: '✅ DONE', note: 'Generic drinking instructions removed across all 24 external/topical products. Added prominent "For external use only" warnings on all topical, bath, and oral care formulations.' },
  { match: 'CORRECT THE INSTRUCTION HEADINGS', status: '✅ DONE', note: 'Instruction headings aligned to actual product types (Oils/Creams: Clean → Apply → Massage → Allow to absorb; Shampoo: Wet hair → Apply → Lather → Rinse; Soap: Wet skin → Lather → Rinse → Pat dry; Gargling Oil: Measure → Swish → Spit out → Rinse; Capsules: Take recommended amount → Take with water → Follow timing).' },
  { match: 'SHOW ALL STEPS', status: '✅ DONE', note: 'PDP template displays all steps (up to 5 steps, with responsive multi-column layout) without cutoff.' },
  { match: 'KEEP PRODUCT INFORMATION IN THE RIGHT SECTION', status: '✅ DONE', note: 'Information organized into distinct sections: Short description, Full description, Ingredients, How to Use, Precautions, and Specifications.' },
  { match: 'REMOVE THE REPEATED GENERIC SECTION', status: '✅ DONE', note: 'Removed the repeated generic "Traditional Ayurvedic Wellness, Naturally Inspired" accordion and removed reused combination imagery.' },
  { match: 'CORRECT ALL INGREDIENT IMAGES', status: '✅ DONE', note: 'Replaced all mismatched images with verified authentic botanical photography: Hibiscus (red flower), Clove (botanical buds), Turmeric (rhizome/flower), Black Pepper (botanical seeds), Red Onion (red onions), Avocado (avocado fruit), and Wrightia tinctoria.' },
  { match: 'AyurRaksha', status: '✅ DONE', note: 'AyurRaksha standardized as one word across all editable storefront text. Packaging artwork preserved.' },
  { match: 'KALONJI SOAP — PREPAID PRICE', status: '✅ DONE', note: 'Synchronized across shop (₹200), advertised prepaid price (₹190, 5% off), and checkout (₹190).' },
  { match: 'KALONJI SOAP — SKIN CARE BUILDER', status: '🟡 PARTIALLY DONE', note: 'Completed on storefront: price synchronized to ₹200 across Skin Care Builder, shop, and cart. Pending in WordPress CMS: WooCommerce product ID 122 currently holds ₹250 and needs regular price updated to ₹200 in wp-admin.' },
  { match: 'VITAL O3 CREAM', status: '🟡 PARTIALLY DONE', note: 'Completed on storefront: price synchronized to ₹4,000 across Skin Care Builder, shop, and cart. Pending in WordPress CMS: WooCommerce product ID 123 currently holds ₹3,999 and needs regular price updated to ₹4,000 in wp-admin.' },
  { match: 'CHECK ALL PREPAID OFFERS', status: '✅ DONE', note: 'Synchronized all product cards, featured pack cards, and checkout to uniform 5% prepaid discount.' },
  { match: 'CHECK COMBO SUBTOTALS', status: '✅ DONE', note: 'Validated selection, volume discounts, and cart/checkout totals across all builders.' },
  { match: 'AYURRAKSHA DETOX TEA', status: '✅ DONE', note: 'Preparation headings match boiling steps. Pack labels (1 pack · 40 sachets — ₹750, 3 packs · 120 sachets — ₹1,988) displayed completely. Senna references removed.' },
  { match: 'MIGRO PRIME TABLETS', status: '✅ DONE', note: 'Generic tea instructions removed. Approved tablet directions added (1 tablet 2–3 times daily after meals). Complete 5 ingredients listed.' },
  { match: 'ETIOMENT PAIN RELIEF ROLL-ON', status: '✅ DONE', note: 'Topical headings applied (Clean & dry, shake, apply, allow to dry). External precautions visible.' },
  { match: 'SUPERHEAL O3 CREAM', status: '✅ DONE', note: 'Cream application headings and topical precautions applied. Authentic botanical images verified.' },
  { match: 'DANT SWASTHYA', status: '✅ DONE', note: 'Tooth powder application and rinsing headings applied. Oral precautions visible. Clove image replaced with authentic clove buds.' },
  { match: 'PREMIUM HIGH FIBER HEALTH MIX', status: '✅ DONE', note: 'Preparation heading uses milk. Allergy warning for barley, soy, peanuts, almonds retained.' },
  { match: 'GARGling OIL', status: '✅ DONE', note: 'Verified on website: Headings updated (Measure the Oil → Swish as Directed → Spit Out Completely → Rinse Mouth Thoroughly). "Do not swallow" warning prominent. Clove image updated with authentic buds.' },
  { match: 'AYURRAKSHA ALG', status: '✅ DONE', note: 'Capsule headings and complete approved ingredients displayed. Authentic clove image applied.' },
  { match: 'CREAT CAPSULES', status: '✅ DONE', note: 'Capsule headings, complete approved ingredients, authentic black pepper image. Price verified at ₹1,299.' },
  { match: 'IMU 360', status: '✅ DONE', note: 'Capsule headings, complete approved ingredients, authentic turmeric image. Price verified at ₹1,299.' },
  { match: 'BPAIN OUT CAPSULES', status: '✅ DONE', note: 'Generic drinking instructions removed. Capsule directions added. 15-day pack (30 capsules) specified.' },
  { match: 'HERBAL SHAMPOO', status: '✅ DONE', note: 'Shampoo application and rinsing headings applied (twice a week). Hibiscus image replaced with authentic red flower.' },
  { match: 'HAIR WELL CAPSULES', status: '✅ DONE', note: 'Capsule headings. Curry leaf and ashwagandha images verified. In-stock status confirmed.' },
  { match: 'SKIN CONDITIONING OIL', status: '✅ DONE', note: 'Topical application headings. Wrightia tinctoria and virgin coconut oil listed with authentic Wrightia photo. External use noted.' },
  { match: 'SP SORYN CREAM', status: '✅ DONE', note: 'Cream application headings and topical precautions applied. Turmeric rhizome image verified.' },
  { match: 'B DERMA CAPSULES', status: '✅ DONE', note: 'Capsule headings and botanical cards verified.' },
  { match: 'SKIN WELL MOISTURISING GEL — URGENT', status: '✅ DONE', note: 'Drinking instructions completely removed. Clean & dry, apply gel, allow to absorb directions added. Restored external-use, eye-contact, and patch-test precautions.' },
  { match: 'BETA POWDER', status: '✅ DONE', note: 'One pinch on empty stomach in morning instructions added. In-stock confirmed.' },
  { match: 'ETIOMENT PAIN RELIEF CREAM / BALM — URGENT', status: '✅ DONE', note: 'Drinking instructions completely removed. External application instructions added. External-use, do-not-swallow, damaged-skin precautions restored.' },
  { match: 'DIA WELL CAPSULES', status: '✅ DONE', note: 'Capsule headings. Formula highlights Fenugreek, Gymnema, Moringa, Jamun. Restored prescription medication warning.' },
  { match: 'B GASONIL', status: '✅ DONE', note: 'Capsule directions (1 before breakfast, 1 before dinner). Replaced fenugreek image with authentic sweet fennel seeds.' },
  { match: 'BOOZNIL', status: '✅ DONE', note: 'Sachet directions (1 before breakfast, 1 before dinner).' },
  { match: 'SKIN WELL FOOD SUPPLEMENT CAPSULES', status: '✅ DONE', note: 'Capsule directions and complete botanical list visible with verified images.' },
  { match: 'SAVE HEART', status: '✅ DONE', note: 'Tonic headings. Quantity verified at 500 ml across builder, shop, and PDP. Heart medication warning retained.' },
  { match: 'SKINWELL SOAP — PACK OF 2', status: '✅ DONE', note: 'Soap-use headings. External-use and eye-contact precautions. Avocado card updated with authentic avocado fruit.' },
  { match: 'FLOW WELL CAPSULES', status: '🟡 PARTIALLY DONE', note: 'Completed on website: Staged capsule directions added and grape seed/Vitis vinifera card updated. Needs user/doctor input: Confirm exact packaging text for Vitis vinifera fruit dried powder vs grape seed on the physical label.' },
  { match: 'LAXAHEALTH TEA — URGENT', status: '✅ DONE', note: '40 tea bags in tin. Tea bag preparation. Senna precautions restored. Removed generic long-term non-dependency statement.' },
  { match: 'PURNA SAKTHI TONIC', status: '✅ DONE', note: 'Tonic headings. Verified at 500 ml consistently. Authentic curry leaf image applied.' },
  { match: 'DIVINE HEALING OIL', status: '✅ DONE', note: 'Topical application headings. 100 ml quantity displayed. External-use and wound precautions visible.' },
  { match: 'BOOZLIV', status: '✅ DONE', note: 'Sachet headings. Siddha formulation context respected. Authentic black pepper image verified.' },
  { match: 'ESNOVATE CAPSULES', status: '✅ DONE', note: 'Capsule directions (1–2 capsules daily with water after meals). Complete 5 ingredients and authentic images.' },
  { match: 'DHAYANI HERBAL HAIR OIL', status: '✅ DONE', note: 'Hair oil headings with 45-min leave-on. Replaced garlic image with authentic red onions. 100 ml quantity.' },
  { match: 'HERBO PROTEIN POWDER', status: '🟡 PARTIALLY DONE', note: 'Completed on website: Powder directions added and authentic images applied (set to in-stock). Needs user input: Confirm whether physical warehouse stock is in-stock or out-of-stock, and whether the multi-botanical formula or single-herb Mucuna matches the current production jar.' },
  { match: 'HIBISCUS TEA', status: '✅ DONE', note: 'Verified on website: 40 tea bags in tin. Tea-brewing headings (Boil Water → Infuse 1 Tea Bag → Steep 3–5 Mins → Enjoy Hot or Iced). Replaced hamburger image with authentic red hibiscus flower.' },
  { match: 'PI WELL CAPSULES', status: '🟡 PARTIALLY DONE', note: 'Completed on website: Capsule headings applied, formula scoped to Pumpkin, Neem, and Tulsi (set to in-stock). Needs user input: Confirm whether physical warehouse stock is in-stock or out-of-stock.' },
  { match: 'SLEEP WELL CAPSULES', status: '✅ DONE', note: 'Bedtime dosage with warm milk or water. Restored warning for prescription sleep medicines. Authentic ashwagandha image.' },
  { match: 'SKIN CARE COMBO BUILDER', status: '🟡 PARTIALLY DONE', note: 'Completed on storefront: All 13 products and hooks retained. Detox tea without senna. Kalonji Soap ₹200. Vital O3 ₹4,000. Matching cart and checkout totals. Pending in WordPress CMS: WooCommerce backend product IDs 122 and 123 prices.' },
  { match: 'VARICOSE VEINS COMBO BUILDER', status: '✅ DONE', note: 'Shortened intro. Corrected count to 5 products • 5 categories. Retained urgent-care warning for open wounds/bleeding.' },
  { match: 'BREATH EASY COMBO BUILDER', status: '✅ DONE', note: 'Retained urgent-care warning for breathing difficulty.' },
  { match: 'CARDIAC WELLNESS COMBO BUILDER', status: '✅ DONE', note: 'Save Heart quantity verified at 500 ml consistently.' },
  { match: 'TEST ALL FOUR BUILDERS', status: '✅ DONE', note: 'Selecting/removing, volume discounts, mobile layout, and cart/checkout integration verified.' },
  { match: 'Main page banners', status: '✅ DONE', note: 'Clear "Shop Now" button added to each banner slide linking directly to correct products/combos. Navigation arrows separated from text.' },
  { match: 'MOBILE SHOP PAGE', status: '✅ DONE', note: 'Verified on mobile viewport: Product names increased to 15–16px. Pack size clearly shown. Category labels untruncated. Prominent single Add to Cart button.' },
  { match: 'CONCERN AND CATEGORY FILTERS', status: '✅ DONE', note: 'Verified on mobile viewport: Skin filter displays approved label "Skin & Botanical Care". Products categorized appropriately.' },
  { match: 'DETOX TEA MOBILE PAGE', status: '✅ DONE', note: 'Verified on mobile viewport: Full pack labels and prices: 1 pack · 40 sachets — ₹750, 3 packs · 120 sachets — ₹1,988. Product image displayed early. Purchase button easy to find.' },
  { match: 'PRODUCT PAGE SECTION HEADINGS', status: '✅ DONE', note: 'Verified on desktop and mobile: Replaced technical headings with approved customer-friendly headings (About this product, Key benefits, Ingredients, How to use, Precautions, Delivery & returns).' },
  { match: 'BLOG PAGE', status: '✅ DONE', note: 'Article titles shortened and formatted cleanly. Excerpts are brief, meaningful, and do not truncate abruptly.' },
  { match: 'MOBILE TEXT CLARITY', status: '✅ DONE', note: 'Verified on mobile viewport: Increased text contrast for review counts, crossed-out prices, and discount badges (>= 4.5:1). Headings, prices, and buttons readable without zooming.' },
  { match: 'About us page', status: '✅ DONE', note: 'Verified on desktop and mobile: Updated with exact approved copy. Doctor biography and long paragraphs left-aligned. Commitment card descriptions enlarged.' },
  { match: 'BESTSELLERS LINK', status: '✅ DONE', note: 'Verified on live preview: Bestsellers navigation link opens shop page with Bestsellers sort automatically selected and applied.' },
  { match: 'ORDER TRACKING', status: '✅ DONE', note: 'Direct order tracking support via customer account portal and instant WhatsApp assistance.' },
  { match: 'Mobile design', status: '✅ DONE', note: 'Verified across mobile viewport: All 10 mobile design standards applied: font system (Cormorant Garamond + Inter), mobile text sizes, darkened contrast colors, banner CTAs, mobile shop cards, PDP sections, pack selector labels, combo builders, and checkout form styling.' }
];

let insertedCount = 0;
for (const item of statusMap) {
  const parts = item.match.split(/\s+/).map(p => p.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const pattern = parts.join('[\\s\\S]*?');
  const regex = new RegExp('(<w:p[^>]*>(?:(?!<\\/w:p>)[\\s\\S])*?' + pattern + '[\\s\\S]*?<\\/w:p>)', 'i');
  const match = xml.match(regex);
  if (match) {
    const statusP = createStatusParagraph(item.status, item.note);
    xml = xml.replace(match[0], match[0] + statusP);
    insertedCount++;
  } else {
    console.log('Could not find match for:', item.match);
  }
}

console.log('Successfully matched and inserted ' + insertedCount + ' status labels out of ' + statusMap.length);
fs.writeFileSync(xmlPath, xml, 'utf8');
