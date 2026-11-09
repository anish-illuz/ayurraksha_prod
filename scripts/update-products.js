const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 1. AyurRaksha Detox Tea
const dt = products.find(p => p.slug === 'ayurraksha-detox-tea');
if (dt) {
  dt.ritualSteps = [
    { stepNumber: 1, title: 'Measure Fresh Water', description: 'Measure 100 ml of fresh drinking water into a small boiling pan.' },
    { stepNumber: 2, title: 'Add One Sachet', description: 'Empty the contents of one single-serving sachet (5 g) of AyurRaksha Detox Tea into the water.' },
    { stepNumber: 3, title: 'Boil & Simmer', description: 'Bring to a gentle boil and simmer on low heat for 3–5 minutes until reduced to about 75 ml.' },
    { stepNumber: 4, title: 'Strain & Sip Warm', description: 'Strain into a cup and sip warm before bedtime as the final step in your evening routine.' }
  ];
  dt.packOptions = [
    { id: 'standard', name: '1 pack · 40 sachets', subtitle: '40 sachets × 5g = 200g', price: 750, regularPrice: 862, isDefault: true, packCount: 1 },
    { id: 'family', name: '3 packs · 120 sachets', subtitle: '120 sachets value bundle', price: 1988, regularPrice: 2586, discountBadge: 'Save 23%', packCount: 3 }
  ];
  dt.advisoryGuidelines = [
    'Not recommended for use during pregnancy or while breastfeeding.',
    'Avoid use during episodes of acute diarrhea or severe abdominal pain.',
    'Consult a healthcare professional before use if taking prescribed medication.'
  ];
}

// 2. Migro Prime Tablets
const mpt = products.find(p => p.slug === 'migro-prime-tablets');
if (mpt) {
  mpt.ritualSteps = [
    { stepNumber: 1, title: 'Recommended Dose', description: 'Take 1 tablet two to three times daily after meals.' },
    { stepNumber: 2, title: 'Take with Water', description: 'Swallow whole with a full glass of fresh drinking water.' },
    { stepNumber: 3, title: 'Follow Daily Schedule', description: 'Maintain consistent daily timing after food as advised by your healthcare practitioner.' }
  ];
  mpt.ingredientCards = [
    { badge: 'PRIMARY HERB', commonName: 'Thippili / Long Pepper', latinName: 'Piper longum', description: 'Classical rejuvenator traditionally valued for clearing head heaviness and micro-circulation.', bioactive: 'Piperine 1.5%', derivative: 'Fruit Spike Extract', image: '/images/ingredients/black-pepper-seeds.jpg' },
    { badge: 'DIGESTIVE HERB', commonName: 'Katuki / Kutki', latinName: 'Picrorhiza kurroa', description: 'Bitter botanical supporting gentle hepatic detoxification and digestive equilibrium.', bioactive: 'Kutkin 4%', derivative: 'Rhizome Extract', image: '/images/ingredients/turmeric-rhizome.jpg' },
    { badge: 'WARMING HERB', commonName: 'Sukku / Dry Ginger', latinName: 'Zingiber officinale', description: 'Traditional digestive stimulant that eases occasional nausea and head discomfort.', bioactive: 'Gingerols 5%', derivative: 'Rhizome Powder', image: '/images/ingredients/dry-ginger-sunthi.png' },
    { badge: 'BIOAVAILABILITY', commonName: 'Milagu / Black Pepper', latinName: 'Piper nigrum', description: 'Enhances bioavailability and assimilation of synergistic botanical bioactives.', bioactive: 'Piperine 95%', derivative: 'Fruit Seed Extract', image: '/images/ingredients/black-pepper-seeds.jpg' },
    { badge: 'BALANCING HERB', commonName: 'Kadukkai / Haritaki', latinName: 'Terminalia chebula', description: 'Revered Ayurvedic fruit supporting metabolic balance and natural elimination.', bioactive: 'Chebulic acid 20%', derivative: 'Pericarp Extract', image: '/images/ingredients/kadukkai-haritaki.webp' }
  ];
}

// 3. Etioment Pain Relief Roll-On
const err = products.find(p => p.slug === 'etioment-pain-relief-roll-on-50ml');
if (err) {
  err.ritualSteps = [
    { stepNumber: 1, title: 'Clean & Dry Area', description: 'Ensure the intended application area is clean and completely dry before applying.' },
    { stepNumber: 2, title: 'Shake Before Use', description: 'Shake the roll-on bottle gently to evenly distribute the active botanical essential oils.' },
    { stepNumber: 3, title: 'Apply with Light Pressure', description: 'Roll the applicator ball smoothly over sore muscles or joints with light, circular pressure.' },
    { stepNumber: 4, title: 'Allow to Dry', description: 'Allow 2–3 minutes for complete absorption. Wash hands after application.' }
  ];
  err.advisoryGuidelines = [
    'For external topical application only. Do not swallow.',
    'Do not apply on broken skin, open wounds, burns, or near eyes.',
    'Wash hands thoroughly after use. If irritation occurs, discontinue use.'
  ];
}

// 4. Superheal O3 Cream
const shc = products.find(p => p.slug === 'ayur-raksha-superheal-o3-cream');
if (shc) {
  shc.ritualSteps = [
    { stepNumber: 1, title: 'Clean & Pat Dry', description: 'Cleanse the skin area gently with mild soap and pat dry with a soft clean towel.' },
    { stepNumber: 2, title: 'Dispense Cream', description: 'Take a small amount of SuperHeal O3 Cream onto clean fingertips.' },
    { stepNumber: 3, title: 'Apply & Massage Lightly', description: 'Gently apply over the affected area in smooth, light strokes until absorbed.' },
    { stepNumber: 4, title: 'Repeat as Directed', description: 'Apply 2 to 3 times daily or as clinically advised by your healthcare practitioner.' }
  ];
  shc.advisoryGuidelines = [
    'For external topical application only. Do not swallow.',
    'Refrigerate after opening (4°C–10°C). Do not freeze.',
    'Avoid contact with eyes and mucous membranes. Discontinue if redness occurs.'
  ];
}

// 5. Dant Swasthya
const ds = products.find(p => p.slug === 'ayur-raksha-dant-swasthya');
if (ds) {
  ds.ritualSteps = [
    { stepNumber: 1, title: 'Measure Tooth Powder', description: 'Take a small pinch (about 1–2 g) of Dant Swasthya tooth powder.' },
    { stepNumber: 2, title: 'Apply to Toothbrush or Fingertip', description: 'Place onto a wet, soft-bristled toothbrush or clean fingertip.' },
    { stepNumber: 3, title: 'Clean & Massage Gently', description: 'Brush teeth and massage gums gently in small circular motions for 2–3 minutes.' },
    { stepNumber: 4, title: 'Rinse Mouth Thoroughly', description: 'Spit out completely and rinse mouth thoroughly with clean water. Do not swallow.' }
  ];
  ds.advisoryGuidelines = [
    'For dental and oral hygiene only. Do not swallow.',
    'Spitting out completely and thorough water rinsing required after brushing.',
    'Store in a cool, dry place. Keep container tightly closed away from moisture.'
  ];
  ds.ingredientCards = [
    { badge: 'ORAL CARE', commonName: 'Lavangam / Clove Flower Buds', latinName: 'Syzygium aromaticum', description: 'Traditional aromatic spice valued for refreshing breath and comforting gums.', bioactive: 'Eugenol 85%', derivative: 'Dried Flower Buds', image: '/images/ingredients/clove-buds.jpg' },
    { badge: 'COOLING AROMATIC', commonName: 'Puthina Uppu / Mint Crystals', latinName: 'Mentha arvensis', description: 'Natural botanical crystals delivering an invigorating, clean oral sensation.', bioactive: 'L-Menthol 99%', derivative: 'Crystalline Extract', image: '/images/ingredients/menthol-peppermint.png' },
    { badge: 'ASTRINGENT', commonName: 'Fitkari / Alum Crystals', latinName: 'Potassium Alum', description: 'Classical mineral astringent traditionally used to support healthy gum tightness.', bioactive: 'Mineral Complex', derivative: 'Purified Crystals', image: '/images/ingredients/alum-crystals.png' },
    { badge: 'HERBAL CLEANSER', commonName: 'Karpur / Natural Camphor', latinName: 'Cinnamomum camphora', description: 'Traditional purifying aromatic supporting enduring oral freshness.', bioactive: 'Camphor Terpenes', derivative: 'Bark Sublimate', image: '/images/ingredients/camphor-flakes.png' }
  ];
}

// 6. Premium High Fiber Health Mix
const hmx = products.find(p => p.slug === 'ayur-raksha-premium-high-fiber-health-mix');
if (hmx) {
  hmx.ritualSteps = [
    { stepNumber: 1, title: 'Measure Health Mix', description: 'Take 2 to 3 tablespoons of AyurRaksha Health Mix powder.' },
    { stepNumber: 2, title: 'Mix with Warm Milk', description: 'Add to 1 cup (200 ml) of warm milk or water and stir well to ensure a smooth blend.' },
    { stepNumber: 3, title: 'Simmer on Low Flame', description: 'Heat on a low flame for 2–3 minutes, stirring continuously until smoothly cooked.' },
    { stepNumber: 4, title: 'Sweeten & Serve Warm', description: 'Add jaggery, honey, or your preferred sweetener to taste. Serve warm for breakfast.' }
  ];
  hmx.advisoryGuidelines = [
    'ALLERGEN WARNING: Contains barley, soy, peanuts, and almonds.',
    'Store in an airtight container in a cool, dry place after opening.',
    'Always use a clean, dry spoon to dispense powder.'
  ];
}

// 7. Gargling Oil
const go = products.find(p => p.slug === 'ayur-raksha-gargling-oil');
if (go) {
  go.ritualSteps = [
    { stepNumber: 1, title: 'Measure the Oil', description: 'Measure 10–15 ml of AyurRaksha Gargling Oil into a small cup.' },
    { stepNumber: 2, title: 'Swish as Directed', description: 'Swish gently between teeth and around the mouth for 2–3 minutes.' },
    { stepNumber: 3, title: 'Spit Out Completely', description: 'Spit out the oil completely into a trash or sink. Do not swallow.' },
    { stepNumber: 4, title: 'Rinse Mouth Thoroughly', description: 'Rinse mouth thoroughly with warm water to clear residual oil.' }
  ];
  go.advisoryGuidelines = [
    'DO NOT SWALLOW. For oral swishing and gargling hygiene only.',
    'Not recommended for children under 6 years without adult supervision.',
    'Store in a cool, dry place away from direct sunlight.'
  ];
}

// 8. AyurRaksha ALG
const alg = products.find(p => p.slug === 'ayur-raksha-alg');
if (alg) {
  alg.ritualSteps = [
    { stepNumber: 1, title: 'Take Recommended Amount', description: 'Take 1 to 2 capsules daily as advised on the package label.' },
    { stepNumber: 2, title: 'Take with Water', description: 'Swallow whole with a full glass of fresh drinking water after food.' },
    { stepNumber: 3, title: 'Follow Daily Schedule', description: 'Maintain consistent daily timing as part of your regular wellness routine.' }
  ];
  alg.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('clove') || c.commonName.toLowerCase().includes('krambu')) {
      c.image = '/images/ingredients/clove-buds.jpg';
    }
  });
}

// 9. Creat Capsules
const creat = products.find(p => p.slug === 'ayur-raksha-creat-capsules');
if (creat) {
  creat.price = 1299;
  creat.ritualSteps = [
    { stepNumber: 1, title: 'Take Recommended Dose', description: 'Take 1 to 2 capsules daily as directed on the package label.' },
    { stepNumber: 2, title: 'Take with Water', description: 'Consume with a full glass of fresh drinking water after food.' },
    { stepNumber: 3, title: 'Follow Daily Schedule', description: 'Take consistently morning and evening for sustained botanical support.' }
  ];
  creat.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('pepper') || c.commonName.toLowerCase().includes('milagu')) {
      c.image = '/images/ingredients/black-pepper-seeds.jpg';
    }
    if (c.commonName.toLowerCase().includes('katuki') || c.commonName.toLowerCase().includes('kutki')) {
      c.image = '/images/ingredients/turmeric-rhizome.jpg';
    }
  });
}

// 10. IMU 360
const imu = products.find(p => p.slug === 'ayur-raksha-imu-360');
if (imu) {
  imu.price = 1299;
  imu.ritualSteps = [
    { stepNumber: 1, title: 'Take Recommended Dose', description: 'Take 1 capsule twice daily after meals with water.' },
    { stepNumber: 2, title: 'Take with Water', description: 'Swallow whole with a full glass of drinking water.' },
    { stepNumber: 3, title: 'Follow Daily Schedule', description: 'Maintain a consistent daily schedule for sustained immune and vitality balance.' }
  ];
  imu.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('turmeric') || c.commonName.toLowerCase().includes('manjal')) {
      c.image = '/images/ingredients/turmeric-rhizome.jpg';
    }
  });
}

// 11. BPain Out Capsules
const bp = products.find(p => p.slug === 'bpain-out-capsules');
if (bp) {
  bp.specNetQuantity = '30 Capsules (15-Day Pack)';
  bp.ritualSteps = [
    { stepNumber: 1, title: 'Take Recommended Dose', description: 'Take 1 to 2 capsules with warm water after meals.' },
    { stepNumber: 2, title: 'Take with Warm Water', description: 'Swallow with a full glass of warm drinking water.' },
    { stepNumber: 3, title: 'Follow Daily Schedule', description: 'Take twice daily, morning and evening, for joint and muscular comfort.' }
  ];
}

// 12. Herbal Shampoo
const hs = products.find(p => p.slug === 'ayur-raksha-herbal-shampoo');
if (hs) {
  hs.ritualSteps = [
    { stepNumber: 1, title: 'Wet Hair & Scalp', description: 'Wet your hair and scalp thoroughly with lukewarm water.' },
    { stepNumber: 2, title: 'Apply & Work into Lather', description: 'Apply 10–15 ml of shampoo, massage gently into scalp to create a rich lather.' },
    { stepNumber: 3, title: 'Leave On for 2–3 Minutes', description: 'Allow botanical extracts to nourish the scalp for 2 to 3 minutes.' },
    { stepNumber: 4, title: 'Rinse Thoroughly', description: 'Rinse hair and scalp thoroughly with clean water until completely clear.' },
    { stepNumber: 5, title: 'Use Twice a Week', description: 'Use 2 to 3 times a week for optimal scalp balance and natural hair softness.' }
  ];
  hs.advisoryGuidelines = [
    'For external hair and scalp cleansing only. Do not swallow.',
    'Avoid contact with eyes. In case of accidental contact, rinse thoroughly with clean water.'
  ];
  hs.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('hibiscus') || c.commonName.toLowerCase().includes('sembaruthi')) {
      c.image = '/images/ingredients/hibiscus-petals.jpg';
    }
  });
}

// 13. Hair Well Capsules
const hw = products.find(p => p.slug === 'hair-well-food-supplement-capsules');
if (hw) {
  hw.inStock = true;
  hw.ritualSteps = [
    { stepNumber: 1, title: 'Take Recommended Dose', description: 'Take 1 to 2 capsules daily after meals.' },
    { stepNumber: 2, title: 'Take with Water', description: 'Swallow whole with a full glass of water.' },
    { stepNumber: 3, title: 'Follow Daily Schedule', description: 'Take consistently each day to support internal follicle and scalp nourishment.' }
  ];
  hw.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('curry') || c.commonName.toLowerCase().includes('karuveppilai')) {
      c.image = '/images/ingredients/curry-leaves.jpg';
    }
    if (c.commonName.toLowerCase().includes('ashwagandha')) {
      c.image = '/images/ingredients/ashwagandha-root.jpg';
    }
  });
}

// 14. Skin Conditioning Oil
const sco = products.find(p => p.slug === 'ayur-raksha-skin-conditioning-oil');
if (sco) {
  sco.specNetQuantity = '100 ml';
  sco.ritualSteps = [
    { stepNumber: 1, title: 'Clean & Pat Dry', description: 'After bathing, gently pat the skin dry with a soft towel.' },
    { stepNumber: 2, title: 'Dispense Oil', description: 'Pour a few drops of Skin Conditioning Oil into clean palms.' },
    { stepNumber: 3, title: 'Apply & Massage Gently', description: 'Apply smoothly across dry or tight skin areas with gentle circular strokes.' },
    { stepNumber: 4, title: 'Allow to Absorb', description: 'Allow 3–5 minutes for full botanical absorption before dressing.' }
  ];
  sco.advisoryGuidelines = [
    'For external dermatological application only. Do not swallow.',
    'Perform a 24-hour patch test before first use.',
    'Avoid contact with eyes and mucous membranes.'
  ];
  sco.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('vetpalai') || c.latinName.toLowerCase().includes('wrightia')) {
      c.image = '/images/ingredients/wrightia-tinctoria.jpg';
    }
  });
}

// 15. SP Soryn Cream
const sp = products.find(p => p.slug === 'sp-soryn-cream');
if (sp) {
  sp.specNetQuantity = '50 g';
  sp.ritualSteps = [
    { stepNumber: 1, title: 'Clean the Area', description: 'Gently wash the affected skin area with mild soap and warm water, then pat dry.' },
    { stepNumber: 2, title: 'Apply Thin Layer', description: 'Take a small amount of SP Soryn Cream and apply a thin, even layer.' },
    { stepNumber: 3, title: 'Smooth Gently', description: 'Spread smoothly with light fingertip strokes without rubbing vigorously.' },
    { stepNumber: 4, title: 'Follow Daily Schedule', description: 'Apply 2 to 3 times daily as guided by your Ayurvedic healthcare practitioner.' }
  ];
  sp.advisoryGuidelines = [
    'For external topical application only. Do not swallow.',
    'Avoid contact with eyes, mouth, and broken skin.',
    'Use strictly under qualified Ayurvedic clinical oversight.'
  ];
  sp.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('turmeric') || c.commonName.toLowerCase().includes('manjal') || c.commonName.toLowerCase().includes('kuth') || c.commonName.toLowerCase().includes('costus')) {
      c.image = '/images/ingredients/turmeric-rhizome.jpg';
    }
  });
}

// 16. B Derma Capsules
const bd = products.find(p => p.slug === 'b-derma-capsules');
if (bd) {
  bd.ritualSteps = [
    { stepNumber: 1, title: 'Prescribed Dosage', description: 'Take dosage strictly as advised by your Ayurvedic physician (typically 1-0-1 after food).' },
    { stepNumber: 2, title: 'Take with Warm Water', description: 'Swallow with a glass of warm water after meals.' },
    { stepNumber: 3, title: 'Daily Timing', description: 'Take twice daily, morning and evening, for sustained internal skin balance.' }
  ];
}

// 17. Skin Well Moisturising Gel (URGENT)
const smg = products.find(p => p.slug === 'ayur-raksha-skin-well-food-moisturising-gel');
if (smg) {
  smg.ritualSteps = [
    { stepNumber: 1, title: 'Clean & Dry Skin', description: 'Gently clean the affected skin area with mild soap and pat completely dry.' },
    { stepNumber: 2, title: 'Apply the Gel', description: 'Dispense a small amount of Skin Well Moisturising Gel onto clean fingertips.' },
    { stepNumber: 3, title: 'Spread Gently', description: 'Spread the gel smoothly in light, circular strokes across dry or irritated skin.' },
    { stepNumber: 4, title: 'Allow to Absorb', description: 'Allow 2–3 minutes for complete absorption before dressing or applying other products.' }
  ];
  smg.advisoryGuidelines = [
    'FOR EXTERNAL USE ONLY. DO NOT SWALLOW OR CONSUME.',
    'Avoid contact with eyes. In case of contact, rinse immediately with clean water.',
    'Perform a 24-hour patch test before first use. Discontinue if irritation develops.'
  ];
}

// 18. Beta Powder
const bpw = products.find(p => p.slug === 'ayur-raksha-beta-powder');
if (bpw) {
  bpw.inStock = true;
  bpw.ritualSteps = [
    { stepNumber: 1, title: 'Measure One Pinch', description: 'Take one pinch (approx. 1 g) of Beta Powder.' },
    { stepNumber: 2, title: 'Take on Empty Stomach', description: 'Consume on an empty stomach in the morning followed by a sip of warm water.' },
    { stepNumber: 3, title: 'Daily Routine', description: 'Take consistently each morning as part of your regular metabolic routine.' }
  ];
}

// 19. Etioment Pain Relief Cream / Balm (URGENT)
const epc = products.find(p => p.slug === 'etionment-pain-relief-cream');
if (epc) {
  epc.name = 'AyurRaksha Etioment Pain Relief Cream / Balm';
  epc.specNetQuantity = '50 g';
  epc.ritualSteps = [
    { stepNumber: 1, title: 'Clean & Dry Area', description: 'Clean the affected joint, neck, shoulder, or muscular area with warm water and pat dry.' },
    { stepNumber: 2, title: 'Apply Balm / Cream', description: 'Take a small quantity of Etioment Balm onto clean fingertips.' },
    { stepNumber: 3, title: 'Massage Lightly', description: 'Gently massage into the skin with smooth circular motions until absorbed.' },
    { stepNumber: 4, title: 'Repeat as Needed', description: 'Apply 2 to 3 times daily as needed for physical comfort. Wash hands after use.' }
  ];
  epc.advisoryGuidelines = [
    'FOR EXTERNAL APPLICATION ONLY. DO NOT SWALLOW.',
    'Do not apply on broken, weeping, or damaged skin.',
    'Avoid contact with eyes and face. Wash hands thoroughly after application.'
  ];
}

// 20. Dia Well Capsules
const dw = products.find(p => p.slug === 'dia-well-food-supplement-capsules');
if (dw) {
  dw.ritualSteps = [
    { stepNumber: 1, title: 'Recommended Dosage', description: 'Take 1 to 2 capsules daily as advised on the package label.' },
    { stepNumber: 2, title: 'Take with Water', description: 'Consume with a glass of fresh drinking water after food.' },
    { stepNumber: 3, title: 'Monitor Glucose Levels', description: 'Maintain routine blood glucose monitoring and follow your doctor guidance.' }
  ];
  dw.advisoryGuidelines = [
    'Consult your physician if you are using insulin, oral glucose-lowering drugs, or other prescription medications.',
    'Do not adjust or discontinue prescribed diabetes medications without clinician consultation.'
  ];
  dw.ingredientCards = [
    { badge: 'METABOLIC HERB', commonName: 'Vendhayam / Fenugreek Seed', latinName: 'Trigonella foenum-graecum', description: 'Classical dietary seed supporting natural post-meal glucose and metabolic balance.', bioactive: 'Galactomannan 50%', derivative: 'Defatted Seed Extract', image: '/images/ingredients/fenugreek-seeds.jpg' },
    { badge: 'SUGAR DESTROYER', commonName: 'Sirukurinjan / Gymnema', latinName: 'Gymnema sylvestre', description: 'Revered Ayurvedic herb known as Meshashringi, traditionally supporting pancreatic health.', bioactive: 'Gymnemic acids 25%', derivative: 'Leaf Extract', image: '/images/ingredients/gymnema-sylvestre-gurmar.jpg' },
    { badge: 'NUTRIENT DENSE', commonName: 'Murungai / Moringa Leaf', latinName: 'Moringa oleifera', description: 'Rich in antioxidants and trace minerals to support cellular vitality.', bioactive: 'Polyphenols 10%', derivative: 'Dehydrated Leaf Powder', image: '/images/ingredients/moringa-leaves.jpg' },
    { badge: 'ANTIOXIDANT HERB', commonName: 'Naval / Jamun Seed', latinName: 'Syzygium cumini', description: 'Traditional fruit seed extract supporting carbohydrate metabolism and balance.', bioactive: 'Jamboline 15%', derivative: 'Seed Powder', image: '/images/ingredients/syzygium-cumini-jamun.jpg' }
  ];
}

// 21. B Gasonil
const bg = products.find(p => p.slug === 'b-gasonil');
if (bg) {
  bg.ritualSteps = [
    { stepNumber: 1, title: 'Morning Dose', description: 'Take 1 capsule before breakfast with a glass of warm water.' },
    { stepNumber: 2, title: 'Evening Dose', description: 'Take 1 capsule before dinner with a glass of warm water.' },
    { stepNumber: 3, title: 'Consistent Routine', description: 'Take consistently before meals to support comfortable digestion and reduce gas.' }
  ];
  bg.ingredientCards = [
    { badge: 'COOLING ROOT', commonName: 'Vettiveroides / Kuruver', latinName: 'Coleus vettiveroides', description: 'Aromatic digestive root traditionally used for easing abdominal warmth and spasms.', bioactive: 'Essential Oils 2%', derivative: 'Root Extract', image: '/images/ingredients/coleus-vettiveroides-kuruver.jpg' },
    { badge: 'GENTLE LAXATIVE', commonName: 'Kadukkai / Haritaki', latinName: 'Terminalia chebula', description: 'King of medicines in Ayurveda, promoting comfortable intestinal transit and balance.', bioactive: 'Tannins 30%', derivative: 'Pericarp Extract', image: '/images/ingredients/kadukkai-haritaki.webp' },
    { badge: 'CARMINATIVE', commonName: 'Sombu / Sweet Fennel', latinName: 'Foeniculum vulgare', description: 'Soothing aromatic seed that calms digestive fullness and eases bloating.', bioactive: 'Anethole 60%', derivative: 'Seed Extract', image: '/images/ingredients/fennel-seeds.jpg' }
  ];
}

// 22. Booznil
const bz = products.find(p => p.slug === 'booznil');
if (bz) {
  bz.ritualSteps = [
    { stepNumber: 1, title: 'Morning Sachet', description: 'Take 1 sachet before breakfast with water.' },
    { stepNumber: 2, title: 'Evening Sachet', description: 'Take 1 sachet before dinner with water.' },
    { stepNumber: 3, title: 'Daily Regularity', description: 'Take consistently twice daily to support metabolic and liver health.' }
  ];
}

// 23. Skin Well Food Supplement Capsules
const swc = products.find(p => p.slug === 'skin-well-food-supplement-capsules');
if (swc) {
  swc.ritualSteps = [
    { stepNumber: 1, title: 'Recommended Dosage', description: 'Take 1 to 2 capsules daily with water after meals.' },
    { stepNumber: 2, title: 'Take with Water', description: 'Consume with a full glass of water.' },
    { stepNumber: 3, title: 'Nightly Consistency', description: 'Maintain this routine consistently for lasting internal skin support.' }
  ];
  swc.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('turmeric') || c.commonName.toLowerCase().includes('manjal')) {
      c.image = '/images/ingredients/turmeric-rhizome.jpg';
    }
  });
}

// 24. Save Heart
const svh = products.find(p => p.slug === 'save-heart');
if (svh) {
  svh.specNetQuantity = '500 ml';
  svh.packOptions = [
    { id: 'standard', name: 'Standard Course', subtitle: '500 ml – 1 Bottle', price: 1199, regularPrice: 1299, isDefault: true, packCount: 1 },
    { id: 'family', name: '3-Month Family Regimen', subtitle: '3 Bottles Value Bundle (1500 ml)', price: 3177, regularPrice: 3897, discountBadge: 'Save 18%', packCount: 3 }
  ];
  svh.ritualSteps = [
    { stepNumber: 1, title: 'Measure Morning Dose', description: 'Measure 15–20 ml of Save Heart tonic in the provided measuring cup.' },
    { stepNumber: 2, title: 'Dilute with Water', description: 'Mix with half a glass of lukewarm water and stir gently.' },
    { stepNumber: 3, title: 'Consume Before Breakfast', description: 'Drink in the morning before food as part of your cardiovascular care.' },
    { stepNumber: 4, title: 'Follow Daily Routine', description: 'Take daily alongside healthy dietary habits and light physical activity.' }
  ];
  svh.advisoryGuidelines = [
    'Consult your cardiologist or physician before use if you are taking blood thinners, blood pressure medication, or glucose-lowering drugs.',
    'Do not discontinue or modify any prescribed cardiovascular medication without doctor consultation.',
    'Store in a cool, dark place. Shake bottle well before each use.'
  ];
}

// 25. SkinWell Soap — Pack of 2
const sws = products.find(p => p.slug === 'ayur-raksha-skinwell-soap-pack-of-2');
if (sws) {
  sws.specNetQuantity = 'Pack of 2 (2 × 75 g)';
  sws.ritualSteps = [
    { stepNumber: 1, title: 'Wet Skin', description: 'Moisten your skin thoroughly with lukewarm water during bath or shower.' },
    { stepNumber: 2, title: 'Lather Gently', description: 'Work the SkinWell soap bar into a rich, creamy botanical lather between palms.' },
    { stepNumber: 3, title: 'Cleanse Body', description: 'Massage gently over the body, paying attention to sensitive or dry areas.' },
    { stepNumber: 4, title: 'Rinse & Pat Dry', description: 'Rinse off thoroughly with clean water and gently pat dry with a soft towel.' }
  ];
  sws.advisoryGuidelines = [
    'For external bathing use only. Do not swallow.',
    'Avoid contact with eyes. In case of eye contact, rinse immediately with clean water.',
    'Keep in a well-drained soap tray after use to extend bar longevity.'
  ];
  sws.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('avocado')) {
      c.image = '/images/ingredients/avocado-fruit.jpg';
    }
  });
}

// 26. Flow Well Capsules
const fwc = products.find(p => p.slug === 'flow-well-food-supplement-capsules');
if (fwc) {
  fwc.ritualSteps = [
    { stepNumber: 1, title: 'Evening Dose', description: 'Take 2 capsules at night after dinner with a full glass of warm water.' },
    { stepNumber: 2, title: 'Take with Warm Water', description: 'Swallow with a full glass of warm drinking water.' },
    { stepNumber: 3, title: 'Circulation Routine', description: 'Rest with legs slightly elevated when seated to encourage venous return.' },
    { stepNumber: 4, title: 'Staged Clinical Protocol', description: 'Follow the progressive protocol outlined by your Ayurvedic physician for 90 days.' }
  ];
  fwc.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('grape') || c.latinName.toLowerCase().includes('vitis')) {
      c.image = '/images/ingredients/grape-seed.jpg';
    }
  });
}

// 27. LaxaHealth Tea (TIN - URGENT)
const lh = products.find(p => p.slug === 'organics-laxahealth-tea-tin');
if (lh) {
  lh.specNetQuantity = '40 Tea Bags in Tin (approx. 80 g)';
  lh.specProductForm = '40 Tea Bags in Tin';
  lh.ritualSteps = [
    { stepNumber: 1, title: 'Boil Fresh Water', description: 'Boil 150 ml of fresh drinking water.' },
    { stepNumber: 2, title: 'Infuse Tea Bag 3–5 Minutes', description: 'Place one LaxaHealth tea bag into cup and steep for 3 to 5 minutes.' },
    { stepNumber: 3, title: 'Remove Tea Bag', description: 'Remove the bag without squeezing. Do not add milk.' },
    { stepNumber: 4, title: 'Sip Warm at Bedtime', description: 'Sip warm before bedtime for comfortable overnight digestive ease.' }
  ];
  lh.advisoryGuidelines = [
    'Contains Senna (Cassia angustifolia). Do not use continuously for more than 7 days without medical advice.',
    'Not recommended for children under 12 years of age.',
    'Do not use during pregnancy or while breastfeeding.',
    'Avoid use in cases of intestinal obstruction, acute inflammatory bowel disease, or unexplained abdominal pain.'
  ];
  lh.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('fennel') || c.commonName.toLowerCase().includes('sombu')) {
      c.image = '/images/ingredients/fennel-seeds.jpg';
    }
  });
}

// 28. Purna Sakthi Tonic
const pst = products.find(p => p.slug === 'purna-sakthi-tonic');
if (pst) {
  pst.specNetQuantity = '500 ml';
  pst.packOptions = [
    { id: 'standard', name: 'Standard Course', subtitle: '500 ml – 1 Bottle', price: 1299, regularPrice: 1399, isDefault: true, packCount: 1 },
    { id: 'family', name: '3-Month Family Regimen', subtitle: '3 Bottles Value Bundle (1500 ml)', price: 3442, regularPrice: 4197, discountBadge: 'Save 18%', packCount: 3 }
  ];
  pst.ritualSteps = [
    { stepNumber: 1, title: 'Measure Recommended Dose', description: 'Measure 15–20 ml of Purna Sakthi tonic using a clean measuring cup.' },
    { stepNumber: 2, title: 'Dilute in Warm Water', description: 'Mix with an equal quantity (15–20 ml) of warm drinking water.' },
    { stepNumber: 3, title: 'Take Twice Daily', description: 'Consume twice daily, once after breakfast and once after dinner.' },
    { stepNumber: 4, title: 'Consistent Routine', description: 'Maintain this routine consistently for 3 to 6 months for optimal reproductive vitality.' }
  ];
  pst.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('curry') || c.commonName.toLowerCase().includes('karuveppilai')) {
      c.image = '/images/ingredients/curry-leaves.jpg';
    }
    if (c.commonName.toLowerCase().includes('ashwagandha') || c.commonName.toLowerCase().includes('amukkira')) {
      c.image = '/images/ingredients/ashwagandha-root.jpg';
    }
  });
}

// 29. Divine Healing Oil
const dho = products.find(p => p.slug === 'divine-healing-oil');
if (dho) {
  dho.specNetQuantity = '100 ml';
  dho.packOptions = [
    { id: 'standard', name: 'Standard Course', subtitle: '100 ml – 1 Bottle', price: 800, regularPrice: 900, isDefault: true, packCount: 1 },
    { id: 'family', name: '3-Month Family Regimen', subtitle: '3 Bottles Value Bundle (300 ml)', price: 2120, regularPrice: 2700, discountBadge: 'Save 21%', packCount: 3 }
  ];
  dho.ritualSteps = [
    { stepNumber: 1, title: 'Clean & Prepare Area', description: 'Cleanse the skin area gently and pat dry before application.' },
    { stepNumber: 2, title: 'Dispense the Oil', description: 'Pour 10–15 ml of Divine Healing Oil into your palm.' },
    { stepNumber: 3, title: 'Apply & Massage Gently', description: 'Apply over affected intact skin, massaging gently in smooth circular motions.' },
    { stepNumber: 4, title: 'Wash Off with Mild Soap', description: 'Leave on for 15–20 minutes before bathing; wash off with mild cleanser like SkinWell Soap.' }
  ];
  dho.advisoryGuidelines = [
    'For external topical application on intact skin only. Do not swallow.',
    'Do not apply over open wounds, weeping ulcers, or infected lesions without medical supervision.',
    'Avoid contact with eyes and mucous membranes. Perform a 24-hour patch test before first use.'
  ];
  dho.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('turmeric') || c.commonName.toLowerCase().includes('manjal')) {
      c.image = '/images/ingredients/turmeric-rhizome.jpg';
    }
  });
}

// 30. Boozliv
const bzl = products.find(p => p.slug === 'boozliv');
if (bzl) {
  bzl.ritualSteps = [
    { stepNumber: 1, title: 'Empty One Sachet', description: 'Empty the contents of one single-serving sachet of BoozLiv into a glass.' },
    { stepNumber: 2, title: 'Mix with Warm Water', description: 'Add 100 ml of fresh drinking water and stir thoroughly.' },
    { stepNumber: 3, title: 'Drink Before Meals', description: 'Drink in the morning and evening before meals as directed by your physician.' }
  ];
  bzl.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('pepper') || c.commonName.toLowerCase().includes('milagu')) {
      c.image = '/images/ingredients/black-pepper-seeds.jpg';
    }
    if (c.commonName.toLowerCase().includes('fennel') || c.commonName.toLowerCase().includes('shombu')) {
      c.image = '/images/ingredients/fennel-seeds.jpg';
    }
  });
}

// 31. Esnovate Capsules
const esn = products.find(p => p.slug === 'esnovate-immunity-boosting-capsules');
if (esn) {
  esn.ritualSteps = [
    { stepNumber: 1, title: 'Take Recommended Dose', description: 'Take 1 to 2 capsules daily with water after meals.' },
    { stepNumber: 2, title: 'Take with Water', description: 'Swallow with a full glass of lukewarm drinking water.' },
    { stepNumber: 3, title: 'Follow Daily Schedule', description: 'Take once or twice daily, morning and evening, for respiratory comfort.' }
  ];
  esn.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('pepper') || c.commonName.toLowerCase().includes('thippili')) {
      c.image = '/images/ingredients/black-pepper-seeds.jpg';
    }
  });
}

// 32. Dhayani Herbal Hair Oil
const dho2 = products.find(p => p.slug === 'dhayani-herbal-hair-oil-100ml');
if (dho2) {
  dho2.specNetQuantity = '100 ml';
  dho2.inStock = true;
  dho2.packOptions = [
    { id: 'standard', name: 'Standard Course', subtitle: '100 ml – 1 Bottle', price: 350, regularPrice: 400, isDefault: true, packCount: 1 },
    { id: 'family', name: '3-Month Family Regimen', subtitle: '3 Bottles Value Bundle (300 ml)', price: 928, regularPrice: 1200, discountBadge: 'Save 23%', packCount: 3 }
  ];
  dho2.ritualSteps = [
    { stepNumber: 1, title: 'Apply to Scalp & Roots', description: 'Pour 10–15 ml of Dhayani Herbal Hair Oil onto palms and apply to scalp.' },
    { stepNumber: 2, title: 'Massage with Fingertips', description: 'Massage gently with fingertips in circular motions for 5–10 minutes.' },
    { stepNumber: 3, title: 'Leave On for 45 Minutes', description: 'Allow the botanical oil to nourish roots for at least 45 minutes or overnight.' },
    { stepNumber: 4, title: 'Wash with Herbal Shampoo', description: 'Wash off thoroughly with AyurRaksha Herbal Shampoo and warm water.' },
    { stepNumber: 5, title: 'Repeat 2–3 Times Weekly', description: 'Use 2 to 3 times weekly for strong, lustrous hair.' }
  ];
  dho2.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('onion') || c.commonName.toLowerCase().includes('vengayam')) {
      c.image = '/images/ingredients/red-onion.jpg';
    }
  });
}

// 33. Herbo Protein Powder
const hpp = products.find(p => p.slug === 'organics-herbo-protein-powder');
if (hpp) {
  hpp.inStock = true;
  hpp.ritualSteps = [
    { stepNumber: 1, title: 'Measure Health Powder', description: 'Take 1 to 2 scoops (approx. 20–30 g) of Herbo Protein Powder.' },
    { stepNumber: 2, title: 'Mix with Milk or Water', description: 'Add to 200 ml of warm milk, water, or your favorite smoothie.' },
    { stepNumber: 3, title: 'Stir or Blend Thoroughly', description: 'Shake in a shaker or blend thoroughly until completely smooth.' },
    { stepNumber: 4, title: 'Consume Daily', description: 'Drink once daily, preferably with breakfast or post-workout.' }
  ];
  hpp.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('ashwagandha')) {
      c.image = '/images/ingredients/ashwagandha-root.jpg';
    }
  });
}

// 34. Hibiscus Tea
const ht = products.find(p => p.slug === 'organics-hibiscus-tea-tin');
if (ht) {
  ht.specNetQuantity = '40 Tea Bags in Tin';
  ht.specProductForm = '40 Tea Bags in Tin';
  ht.ritualSteps = [
    { stepNumber: 1, title: 'Boil Fresh Water', description: 'Boil 150–200 ml of fresh drinking water.' },
    { stepNumber: 2, title: 'Infuse Tea Bag', description: 'Place one hibiscus tea bag in a cup and pour hot water.' },
    { stepNumber: 3, title: 'Steep 3–5 Minutes', description: 'Allow to steep for 3 to 5 minutes to release deep ruby anthocyanins.' },
    { stepNumber: 4, title: 'Enjoy Hot or Iced', description: 'Enjoy warm, or chill with ice and fresh lemon for a cooling infusion.' }
  ];
  ht.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('hibiscus') || c.commonName.toLowerCase().includes('sembaruthi')) {
      c.image = '/images/ingredients/hibiscus-petals.jpg';
    }
  });
}

// 35. Pi Well Capsules
const pi = products.find(p => p.slug === 'pi-well-food-supplement-capsules');
if (pi) {
  pi.inStock = true;
  pi.ritualSteps = [
    { stepNumber: 1, title: 'Take Recommended Dose', description: 'Take 1 to 2 capsules daily with water after meals.' },
    { stepNumber: 2, title: 'Take with Water', description: 'Swallow with a glass of fresh drinking water.' },
    { stepNumber: 3, title: 'Follow Daily Schedule', description: 'Maintain regular daily routine to support vascular comfort.' }
  ];
}

// 36. Sleep Well Capsules
const sw = products.find(p => p.slug === 'sleep-well-food-supplement-capsules');
if (sw) {
  sw.ritualSteps = [
    { stepNumber: 1, title: 'Bedtime Dosage', description: 'Take 1 to 2 capsules 30–45 minutes before sleep.' },
    { stepNumber: 2, title: 'Take with Warm Water or Milk', description: 'Swallow with a glass of warm water or warm milk.' },
    { stepNumber: 3, title: 'Restful Sleep Routine', description: 'Dim ambient lights and disconnect from screens for restful sleep.' }
  ];
  sw.advisoryGuidelines = [
    'Consult your healthcare professional if you are taking prescription sleeping medicines, sedatives, antidepressants, or other psychiatric medicines.',
    'Do not drive or operate machinery immediately after taking this product.',
    'Keep out of reach of children. Store in a cool, dry place.'
  ];
  sw.ingredientCards.forEach(c => {
    if (c.commonName.toLowerCase().includes('ashwagandha') || c.commonName.toLowerCase().includes('amukkira')) {
      c.image = '/images/ingredients/ashwagandha-root.jpg';
    }
  });
}

fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');
console.log('Successfully updated products.json for all 36 products!');
