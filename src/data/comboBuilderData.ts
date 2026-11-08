import {
  ComboProduct,
  MerchandisingCategory,
  SkinConcern,
  ComboConcern,
  VideoLanguageOption,
  ComboBuilderInfo,
  ComboBuilderConfig,
} from '@/types/combo';

// Strictly the 5 Merchandising Categories from the Developer Brief
export const MERCHANDISING_CATEGORIES: MerchandisingCategory[] = [
  'All products',
  'External care',
  'Bath & scalp',
  'Internal wellness',
  'Digestive wellness',
  'O3 specialty',
];

// Exactly 13 approved formulations with accurate store prices and pack sizes
export const MASTER_COMBO_PRODUCTS: ComboProduct[] = [
  // 1. Divine Healing Oil (CMS ID 113)
  {
    id: 7689,
    cmsId: 113,
    name: 'Ayur Raksha Divine Healing Oil',
    slug: 'divine-healing-oil',
    category: 'External care',
    packSize: '100 ml',
    formatTag: '100 ml · Pre-Bath Oil',
    primaryImage: '/images/products/divine-healing-oil.webp',
    gallery: [
      '/images/products/divine-healing-oil.webp',
      'https://cms.ayurrakshaonline.com/wp-content/uploads/2026/11/healing-oil.png',
    ],
    mrp: 800,
    price: 800,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'Soothe dry-feeling skin with a traditional pre-bath herbal oil massage.',
    description:
      'A time-honoured botanical formulation traditionally used for soothing topical discomfort, itching, dermatitis, and skin irritation prior to bathing.',
    indications: 'Dry skin, scaling, mild rashes, itching, and general pre-bath skin nourishment.',
    ingredients: 'Wrightia tinctoria (Swetha Kutaja), Coconut oil base, Neem extracts, and traditional herbal decoctions.',
    directions:
      'Apply a small amount to the affected skin area 15–20 minutes before bathing, gently massaging in circular motions. Wash off with a mild cleanser like Skinwell Soap.',
    storage: 'Store in a cool, dry place away from direct sunlight. Keep cap tightly closed.',
    warnings: 'For external use only. Perform a patch test before first use. Avoid contact with eyes.',
    href: '/product/divine-healing-oil',
    sku: '7689',
    isFlagshipSkinCare: true,
  },

  // 2. Skin Conditioning Oil (CMS ID 98) — Main Store price: ₹799
  {
    id: 11378,
    cmsId: 98,
    name: 'Ayur Raksha Skin Conditioning Oil',
    slug: 'ayur-raksha-skin-conditioning-oil',
    category: 'External care',
    packSize: '100 ml',
    formatTag: '100 ml · Post-Bath Oil',
    primaryImage: '/images/products/ayur-raksha-skin-conditioning-oil.webp',
    gallery: [
      '/images/products/ayur-raksha-skin-conditioning-oil.webp',
      'https://cms.ayurrakshaonline.com/wp-content/uploads/2026/11/skin-conditioning-oil.png',
    ],
    mrp: 799,
    price: 799,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'Nourish post-bath skin with Vetpalai and coconut oil for a soft, supple feel.',
    description:
      'Formulated with nutrient-dense herbal extracts to deeply hydrate and condition dry, tight skin after cleansing.',
    indications: 'Post-shower skin hydration, rough texture, xerosis, and moisture barrier restoration.',
    ingredients: 'Sesamum indicum (Sesame seed oil), Aloe vera extract, Vetiver oil, and traditional conditioning herbs.',
    directions:
      'After bathing, gently pat skin dry. Apply a few drops over clean skin and allow 3–5 minutes for complete absorption before dressing.',
    storage: 'Store in a cool, dry place at room temperature.',
    warnings: 'For external topical application only. Discontinue if redness occurs.',
    href: '/product/ayur-raksha-skin-conditioning-oil',
    sku: '11378',
    isFlagshipSkinCare: true,
  },

  // 3. SP Soryn Cream (CMS ID 99) — Available in main store for ₹799
  {
    id: 11387,
    cmsId: 99,
    name: 'SP Soryn Cream',
    slug: 'sp-soryn-cream',
    category: 'External care',
    packSize: '50 g',
    formatTag: 'Doctor-guided · Cream',
    primaryImage: '/images/products/sp-soryn-cream.webp',
    gallery: [
      '/images/products/sp-soryn-cream.webp',
      'https://cms.ayurrakshaonline.com/wp-content/uploads/2026/11/SP-Soryn.png',
    ],
    mrp: 799,
    price: 799,
    pricePending: false,
    inStock: true,
    doctorGuided: true,
    shortDescription: 'Give stubborn skin concerns the focused care of traditional Ayurvedic herbs.',
    description:
      'An Ayurvedic proprietary topical formulation developed for targeted skin support with traditional botanicals.',
    indications: 'Physician-supervised skin support for localized stubborn rashes and dermatological conditions.',
    ingredients: 'Ayurvedic proprietary herbal extracts in an emulsion base.',
    directions:
      'Use strictly under the guidance of a qualified Ayurvedic physician. Apply a thin layer to clean skin 2 to 3 times daily as advised.',
    storage: 'Store in a cool, dry place below 25°C. Do not freeze.',
    warnings:
      'Doctor-guided product. Ringworm and fungal infections require appropriate clinical assessment; this product should not be considered a substitute for evidence-based antifungal therapy without medical consultation.',
    href: '/product/sp-soryn-cream',
    sku: '11387',
    isFlagshipSkinCare: true,
  },

  // 4. SkinWell Soap (Pack of 2) (CMS ID 109) — Clarified: Pack of 2 (2 × 75 g = 150 g)
  {
    id: 10627,
    cmsId: 109,
    name: 'Ayur Raksha SkinWell Soap (Pack of 2)',
    slug: 'ayur-raksha-skinwell-soap-pack-of-2',
    category: 'Bath & scalp',
    packSize: 'Pack of 2 (2 × 75 g)',
    formatTag: 'Pack of 2 · Botanical Soap',
    primaryImage: '/images/products/ayur-raksha-skinwell-soap-pack-of-2.webp',
    gallery: [
      '/images/products/ayur-raksha-skinwell-soap-pack-of-2.webp',
      'https://cms.ayurrakshaonline.com/wp-content/uploads/2026/11/skin-well-soap.png',
    ],
    mrp: 250,
    price: 250,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'Cleanse gently with aloe vera, vitamin E and nourishing avocado oil.',
    description:
      'Enriched with Aloe Vera, Vitamin E, and Avocado Oil, SkinWell Soap gently purifies without stripping natural epidermal oils. Supplied as a convenient Pack of 2 bars. Both soaps are independently selectable.',
    indications: 'Daily bathing, sensitive skin, dryness, mild itching, and family wellness.',
    ingredients: 'Aloe Barbadensis extract, Vetiveria zizanioides oil, Avocado oil, Vitamin E, Vegetable soap base.',
    directions: 'Lather gently over wet body during bath or shower, then rinse thoroughly with tepid water.',
    storage: 'Keep in a dry soap dish after use to prolong bar life.',
    warnings: 'For external use only. Avoid contact with eyes.',
    href: '/product/ayur-raksha-skinwell-soap-pack-of-2',
    sku: '10627',
    isFlagshipSkinCare: true,
  },

  // 5. Anti-Tan Kalonji Soap (CMS ID 122) — Main Store price: ₹250
  {
    id: 122,
    cmsId: 122,
    name: 'Ayur Raksha Anti-Tan Kalonji Soap',
    slug: 'ayurraksha-kalonji-soap',
    category: 'Bath & scalp',
    packSize: 'Single Bar (75 g)',
    formatTag: 'Kalonji · Bath Bar',
    primaryImage: '/images/products/ayur-raksha-kalonji-soap.webp',
    gallery: [
      '/images/products/ayur-raksha-kalonji-soap.webp',
      'https://cms.ayurrakshaonline.com/wp-content/uploads/2026/11/Kalonji-Soap.png',
    ],
    mrp: 250,
    price: 250,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'Refresh dull, sun-exposed skin with the botanical goodness of kalonji.',
    description:
      'Harnesses the traditional properties of Kalonji (Black Seed / Karunjeeragam) to soothe sun-exposed skin, reduce the appearance of tanning, and provide deep botanical nourishment.',
    indications: 'Sun-exposed skin, tanning, everyday body cleansing, and uneven skin tone.',
    ingredients: 'Nigella Sativa (Kalonji) extract, Virgin Coconut oil, Grade 1 TFM (76%) soap base.',
    directions: 'Work into a rich lather on wet skin, leave on for 1–2 minutes, and rinse thoroughly.',
    storage: 'Keep in a well-drained soap tray.',
    warnings: 'For external application only.',
    href: '/shop',
    sku: 'AYUR-KALONJI-SOAP',
    isFlagshipSkinCare: true,
  },

  // 6. Herbal Hair Shampoo (CMS ID 96) — Corrected quantity: 100 ml (matching Shop)
  {
    id: 12007,
    cmsId: 96,
    name: 'Ayur Raksha Herbal Hair Shampoo',
    slug: 'ayur-raksha-herbal-shampoo',
    category: 'Bath & scalp',
    packSize: '100 ml',
    formatTag: '100 ml · Scalp Cleanser',
    primaryImage: '/images/products/ayur-raksha-herbal-shampoo.webp',
    gallery: [
      '/images/products/ayur-raksha-herbal-shampoo.webp',
      'https://cms.ayurrakshaonline.com/wp-content/uploads/2026/11/herbal-shampoo.png',
    ],
    mrp: 499,
    price: 399,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'Refresh your scalp and soften your hair with aloe, hibiscus and amla.',
    description:
      'A gentle, sulfate-conscious Ayurvedic formulation combining Aloe vera, Shikakai, and Bhringraj to cleanse the scalp without irritation.',
    indications: 'Scalp flaking, itchiness, dryness, and gentle hair cleansing.',
    ingredients: 'Aloe barbadensis, Acacia concinna (Shikakai), Eclipta alba (Bhringraj), Hibiscus rosa-sinensis.',
    directions: 'Apply to wet scalp and hair, gently massage into lather, and rinse thoroughly. Repeat if desired.',
    storage: 'Store away from direct heat and sunlight.',
    warnings: 'Avoid contact with eyes. Rinse immediately if contact occurs.',
    href: '/product/ayur-raksha-herbal-shampoo',
    sku: '12007',
    isFlagshipSkinCare: true,
  },

  // 7. Skinwell Food Supplement (CMS ID 107) — Main Store price: ₹1,199 (MRP ₹1,299)
  {
    id: 7688,
    cmsId: 107,
    name: 'Skinwell Food Supplement',
    slug: 'skin-well-food-supplement-capsules',
    category: 'Internal wellness',
    packSize: '60 Capsules',
    formatTag: '60 Caps · Food Supplement',
    primaryImage: '/images/products/skin-well-food-supplement-capsules.webp',
    gallery: [
      '/images/products/skin-well-food-supplement-capsules.webp',
      'https://cms.ayurrakshaonline.com/wp-content/uploads/2026/11/skin-well-capsules.png',
    ],
    mrp: 1299,
    price: 1199,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'Nourish your skin-wellness routine from within with eight traditional Ayurvedic botanicals.',
    description:
      'Features eight traditional Ayurvedic botanicals including Manjistha, Sariva, and Khadira, curated to nurture skin balance from within.',
    indications: 'Internal nutritional support for skin radiance, cellular defense, and metabolic balance.',
    ingredients: 'Rubia cordifolia (Manjistha), Hemidesmus indicus (Sariva), Acacia catechu (Khadira), Azadirachta indica.',
    directions: 'Take 1 to 2 capsules daily after meals with warm water, or as recommended by a health professional.',
    storage: 'Store in a cool, dry place. Protect from moisture and direct sunlight.',
    warnings:
      'Dietary supplement; not intended to diagnose, treat, or cure any disease. Consult a physician before use if pregnant or nursing.',
    href: '/product/skin-well-food-supplement-capsules',
    sku: '7688',
    isFlagshipSkinCare: true,
  },

  // 8. IMU 360 Food Supplement (CMS ID 94) — Main Store price: ₹1,299
  {
    id: 22738,
    cmsId: 94,
    name: 'IMU 360 Food Supplement',
    slug: 'ayur-raksha-imu-360',
    category: 'Internal wellness',
    packSize: '60 Capsules',
    formatTag: '60 Caps · Vitality Support',
    primaryImage: '/images/products/ayur-raksha-imu-360.webp',
    gallery: [
      '/images/products/ayur-raksha-imu-360.webp',
      'https://cms.ayurrakshaonline.com/wp-content/uploads/2026/11/IMU-360.png',
    ],
    mrp: 1299,
    price: 1299,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'Support everyday immunity and vitality with seven traditional Ayurvedic botanicals.',
    description:
      'A multi-botanical dietary capsule formulation featuring Amla, Ashwagandha, and Guduchi to support physical stamina and bodily homeostasis.',
    indications: 'General vitality, immune equilibrium, antioxidant protection, and fatigue resistance.',
    ingredients: 'Emblica officinalis (Amla), Withania somnifera (Ashwagandha), Tinospora cordifolia (Guduchi), Curcuma longa.',
    directions: 'Take 1 capsule twice daily with water after meals, or as advised by your healthcare practitioner.',
    storage: 'Store in a cool, dry place. Keep container tightly closed.',
    warnings: 'Dietary supplement. Keep out of reach of children.',
    href: '/product/ayur-raksha-imu-360',
    sku: '22738',
    isFlagshipSkinCare: true,
  },

  // 9. B Derma Ayurvedic Capsules (CMS ID 100) — Main Store price: ₹799
  {
    id: 11317,
    cmsId: 100,
    name: 'B Derma Ayurvedic Capsules',
    slug: 'b-derma-capsules',
    category: 'Internal wellness',
    packSize: '60 Capsules',
    formatTag: 'Doctor-guided · Proprietary',
    primaryImage: '/images/products/b-derma-capsules.webp',
    gallery: [
      '/images/products/b-derma-capsules.webp',
      'https://cms.ayurrakshaonline.com/wp-content/uploads/2026/10/B-Derma.png',
    ],
    mrp: 799,
    price: 799,
    pricePending: false,
    inStock: true,
    doctorGuided: true,
    shortDescription: 'Bring Ayurvedic skin wellness from within into your doctor-guided routine.',
    description:
      'A specialized classical Ayurvedic proprietary composition recommended for persistent or recurring skin disharmonies under professional clinical oversight.',
    indications: 'Physician-directed support for chronic dermatological balance and Rakta Shodhana.',
    ingredients: 'Classical Ayurvedic proprietary botanical extracts. Complete formula on medical package.',
    directions:
      'Dosage strictly as directed by a VPrime Ayurvedic physician (typically 1-0-1 or 1-1-1 after food with warm water). No autonomous self-dosing recommended.',
    storage: 'Store in a cool, dark place away from moisture.',
    warnings: 'Ayurvedic proprietary medicine. Always take under medical guidance.',
    href: '/product/b-derma-capsules',
    sku: '11317',
    isFlagshipSkinCare: true,
  },

  // 10. Ayur Raksha Detox Tea (CMS ID 85) — Main Store price: ₹750
  {
    id: 27739,
    cmsId: 85,
    name: 'Ayur Raksha Detox Tea',
    slug: 'ayurraksha-detox-tea',
    category: 'Digestive wellness',
    packSize: '40 Sachets × 5 g',
    formatTag: '40 Sachets · Herbal Infusion',
    primaryImage: '/images/products/ayur-raksha-detox-tea.webp',
    gallery: [
      '/images/products/ayur-raksha-detox-tea.webp',
      'https://cms.ayurrakshaonline.com/wp-content/uploads/2026/10/detox-tea.png',
    ],
    mrp: 750,
    price: 750,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'Support digestive wellness and natural regularity with Triphala and Avuri.',
    description:
      'A time-tested herbal blend of Triphala, Avuri, and warm digestive carminatives created to encourage comfortable overnight gut motility and elimination.',
    indications: 'Digestive sluggishness, occasional constipation, abdominal heaviness, and metabolic reset.',
    ingredients: 'Triphala (Haritaki, Bibhitaki, Amalaki), Cassia angustifolia (Avuri / Senna), Ginger, Cumin.',
    directions:
      'Empty one 5 g sachet into 100 ml of boiling water. Simmer gently until reduced to about 75 ml, strain if preferred or sip warm before bedtime.',
    storage: 'Store sachets in airtight container after opening outer carton.',
    warnings:
      'Not recommended for pregnant or lactating women, or in acute diarrhea. This tea is a digestive support option, not a compulsory skin care prerequisite.',
    href: '/product/ayurraksha-detox-tea',
    sku: '27739',
    isFlagshipSkinCare: true,
  },

  // 11. Super Heal O3 Cream (CMS ID 88) — Main Store price: ₹3,999
  {
    id: 22867,
    cmsId: 88,
    name: 'Super Heal O3 Cream',
    slug: 'ayur-raksha-superheal-o3-cream',
    category: 'O3 specialty',
    packSize: '30 g',
    formatTag: 'O3 · Doctor-guided Cream',
    primaryImage: '/images/products/ayur-raksha-superheal-o3-cream.webp',
    gallery: [
      '/images/products/ayur-raksha-superheal-o3-cream.webp',
      'https://cms.ayurrakshaonline.com/wp-content/uploads/2026/11/super-heal-03.png',
    ],
    mrp: 3999,
    price: 3999,
    pricePending: false,
    inStock: true,
    doctorGuided: true,
    shortDescription: 'Discover physician-guided O3 care for eczema- and psoriasis-related skin concerns.',
    description:
      'Combines ozonated botanical oils with traditional Ayurvedic healing herbs to deliver oxygen-rich topical support for complex, stubborn skin concerns.',
    indications: 'Targeted skin conditioning, persistent scaling, dryness, and stubborn localized patches.',
    ingredients: 'Ozonated natural oils, Wrightia tinctoria, Curcuma aromatica, Pongamia pinnata extracts.',
    directions:
      'Cleanse skin thoroughly. Apply a small amount to the localized area twice daily as advised by your Ayurvedic physician.',
    storage: 'Store in a cool place, preferably refrigerated (4°C–10°C) after opening. Do not freeze.',
    warnings:
      'Doctor-guided formulation. Avoid unsupported claims of rapid disease reversal. Consult a VPrime doctor before application on sensitive areas.',
    href: '/product/ayur-raksha-superheal-o3-cream',
    sku: '22867',
    isFlagshipSkinCare: true,
  },

  // 12. Ayur Raksha Immune O3 Capsules (CMS ID 124) — Main Store price: ₹2,500
  {
    id: 124,
    cmsId: 124,
    name: 'Ayur Raksha Immune O3 Capsules',
    slug: 'ayurraksha-immuno3-immunity-booster-capsules',
    category: 'O3 specialty',
    packSize: '60 Capsules',
    formatTag: 'Enteric-Coated · O3 Capsules',
    primaryImage: '/images/products/ayur-raksha-immuno3-capsules.webp',
    gallery: [
      '/images/products/ayur-raksha-immuno3-capsules.webp',
      'https://cms.ayurrakshaonline.com/wp-content/uploads/2026/11/ImmunO3-capsules.png',
    ],
    mrp: 2500,
    price: 2500,
    pricePending: false,
    inStock: true,
    doctorGuided: true,
    shortDescription: 'Take wellness beyond the surface with O3 capsules designed for intestinal release.',
    description:
      'Developed with enteric-coating technology to protect active botanical ozonides past gastric acids, delivering systemic antioxidant support directly to the intestinal tract.',
    indications: 'Cellular protection, deep tissue rejuvenation, and systemic immune balance.',
    ingredients: 'Ozonated plant triglycerides, Phyllanthus emblica, Piper nigrum, Enteric polymer capsule shell.',
    directions:
      'Take 1 capsule once or twice daily on an empty stomach with a full glass of water, or as prescribed by your VPrime physician.',
    storage: 'Store tightly sealed in a cool, dry place away from heat and moisture.',
    warnings:
      'Doctor-guided product. Claims regarding severe organ or autoimmune diseases require clinical review. Consult your doctor.',
    href: '/shop',
    sku: 'AYUR-IMMUN-O3',
    isFlagshipSkinCare: true,
  },

  // 13. Ayur Raksha Vital O3 Cream (CMS ID 123) — Main Store price: ₹3,999
  {
    id: 123,
    cmsId: 123,
    name: 'Ayur Raksha Vital O3 Cream',
    slug: 'ayurraksha-vital-o3-anti-vitiligo-cream',
    category: 'O3 specialty',
    packSize: '30 g',
    formatTag: 'O3 · Doctor-guided Cream',
    primaryImage: '/images/products/ayur-raksha-vital-o3-cream.webp',
    gallery: [
      '/images/products/ayur-raksha-vital-o3-cream.webp',
      'https://cms.ayurrakshaonline.com/wp-content/uploads/2026/11/Vital-O3-cream.png',
    ],
    mrp: 3999,
    price: 3999,
    pricePending: false,
    inStock: true,
    doctorGuided: true,
    shortDescription: 'Explore specialized, doctor-guided O3 care for vitiligo-related pigmentation concerns.',
    description:
      'A specialized ozonated botanical cream formulated to nurture melanocyte micro-environment and nourish depigmented areas under physician guidance.',
    indications: 'Doctor-guided supportive topical application for localized depigmentation and vitiligo concerns.',
    ingredients: 'Ozonated herbal lipids, Psoralea corylifolia (Bakuchi) purified extract, Wrightia tinctoria.',
    directions:
      'Apply a thin film to targeted areas as directed by your Ayurvedic physician. Mild morning sun exposure (5–10 mins) only if explicitly advised by clinician.',
    storage: 'Store in a cool place, preferably refrigerated (4°C–10°C) after opening.',
    warnings:
      'Vitiligo requires medical assessment. Do not claim this cream alone halts spread or guarantees repigmentation. Use strictly under doctor guidance.',
    href: '/shop',
    sku: 'AYUR-VITAL-O3',
    isFlagshipSkinCare: true,
  },
];

export const SKIN_CONCERNS: SkinConcern[] = [
  {
    id: 'browse',
    name: 'Explore all 13 products',
    shortDesc: 'Curate your own routine freely from the complete 13-product catalogue.',
    description:
      'Browse all 13 products at your own pace across all 5 care categories. Nothing is automatically added to your combo — every product is your choice.',
    highlightedProductIds: [],
    requiresDoctorGuidance: false,
  },
  {
    id: 'dryness',
    name: 'Dryness & mild itching',
    shortDesc: 'Suggested starting shortlist: Skin Conditioning Oil + SkinWell Soap.',
    description:
      'Recommended focus on lipid-replenishing moisture care and gentle, non-stripping cleansing. You may also explore Divine Healing Oil or internal nourishment.',
    clinicalNotice:
      'This shortlist is shopping guidance, not a diagnosis. Add or remove any product according to your individual routine.',
    highlightedProductIds: [11378, 10627, 7689],
    requiresDoctorGuidance: false,
  },
  {
    id: 'chronic',
    name: 'Persistent eczema / psoriasis',
    shortDesc: 'Specialty-care shortlist with physician-guided options and gentle cleansers.',
    description:
      'For long-standing flaking, scaling, or chronic itching. Highlights specialty O3 formulations, gentle cleansers, and internal botanical support.',
    clinicalNotice:
      'Persistent skin conditions require holistic review. Speak with a qualified VPrime Ayurvedic physician before beginning medicated or O3 formulations.',
    highlightedProductIds: [10627, 12007, 22867, 124, 11317, 7688],
    requiresDoctorGuidance: true,
  },
  {
    id: 'fungal',
    name: 'Possible ringworm / fungal issue',
    shortDesc: 'Targeted hygiene shortlist; conventional body oils are excluded.',
    description:
      'For itchy, spreading, circular, or fungal-looking skin discomfort. Highlights cleansing soaps and SP Soryn Cream, with conventional oils excluded from recommendations.',
    clinicalNotice:
      'Ringworm (Padar Thamarai) requires professional clinical diagnosis and effective antifungal assessment. Do not imply botanical creams replace validated antifungal protocols.',
    highlightedProductIds: [11387, 10627, 122, 12007],
    excludedProductIds: [7689, 11378], // Exclude oils from this pathway per brief
    requiresDoctorGuidance: true,
  },
  {
    id: 'vitiligo',
    name: 'Vitiligo-related concerns',
    shortDesc: 'Targeted support shortlist requiring clinical dermatological evaluation.',
    description:
      'Highlights Vital O3 Cream, Immune O3 Capsules, and Detox Tea for systemic balance under professional physician direction.',
    clinicalNotice:
      'Vitiligo calls for qualified dermatological and Ayurvedic assessment. Do not rely on cosmetic products alone to halt progression or promise repigmentation.',
    highlightedProductIds: [123, 124, 27739],
    excludedProductIds: [7689],
    requiresDoctorGuidance: true,
  },
];

export const VIDEO_LANGUAGES: VideoLanguageOption[] = [
  {
    id: 'ta',
    label: 'Tamil',
    nativeLabel: 'தமிழ்',
    isMaster: true,
    isAvailable: true,
    statusNote: 'Master clinical explainer video',
  },
  {
    id: 'en',
    label: 'English',
    nativeLabel: 'English',
    isAvailable: false,
    statusNote: 'English voice-dubbed version in clinical review',
  },
  {
    id: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
    isAvailable: false,
    statusNote: 'Hindi dubbed edition in production',
  },
  {
    id: 'ml',
    label: 'Malayalam',
    nativeLabel: 'മലയാളം',
    isAvailable: false,
    statusNote: 'Malayalam dubbed edition in production',
  },
  {
    id: 'te',
    label: 'Telugu',
    nativeLabel: 'తెలుగు',
    isAvailable: false,
    statusNote: 'Telugu dubbed edition in production',
  },
  {
    id: 'kn',
    label: 'Kannada',
    nativeLabel: 'ಕನ್ನಡ',
    isAvailable: false,
    statusNote: 'Kannada dubbed edition in production',
  },
];

// ============================================================================
// 4 COMBO BUILDERS MASTER DIRECTORY (FOR NAVIGATION & DROPDOWN)
// ============================================================================

export const COMBO_BUILDERS: ComboBuilderInfo[] = [
  {
    id: 'skin-care',
    slug: 'skin-care',
    name: 'Skin Care Combo Builder',
    shortName: 'Skin Care',
    description: '13 physician-approved topical and internal formulations for sensitive, dry, and chronic skin concerns.',
    badge: '13 Formulations',
    productCount: 13,
    categoryCount: 5,
    href: '/combo-builder/skin-care',
    accentColor: '#18372b',
    popular: true,
  },
  {
    id: 'varicose-veins',
    slug: 'varicose-veins',
    name: 'Varicose Veins Combo Builder',
    shortName: 'Varicose Veins',
    description: '5 targeted formulations for healthy circulation, heavy legs, and intact lower-leg skin comfort.',
    badge: '5 Products',
    productCount: 5,
    categoryCount: 4,
    href: '/combo-builder/varicose-veins',
    accentColor: '#1c513d',
  },
  {
    id: 'breath-easy',
    slug: 'breath-easy',
    name: 'Breath Easy Combo Builder',
    shortName: 'Breath Easy',
    description: '3 customer-configurable herbal products for muscle soreness, digestive routine, and skin nourishment.',
    badge: '3 Products',
    productCount: 3,
    categoryCount: 3,
    href: '/combo-builder/breath-easy',
    accentColor: '#2b4c3f',
  },
  {
    id: 'cardiac-wellness',
    slug: 'cardiac-wellness',
    name: 'Cardiac Wellness Combo Builder',
    shortName: 'Cardiac Wellness',
    description: '3 customer-configurable heart-wellness, peripheral circulation, and digestive formulations.',
    badge: '3 Products',
    productCount: 3,
    categoryCount: 3,
    href: '/combo-builder/cardiac-wellness',
    accentColor: '#163d30',
  },
];

// ============================================================================
// 1. VARICOSE VEINS COMBO BUILDER DATA (5 PRODUCTS)
// ============================================================================

export const VARICOSE_VEINS_CATEGORIES: MerchandisingCategory[] = [
  'All products',
  'Internal wellness',
  'External care',
  'Bath & scalp',
  'O3 specialty',
  'Digestive wellness',
];

export const VARICOSE_VEINS_PRODUCTS: ComboProduct[] = [
  // 1. Flow Well Food Supplement Capsules (CMS ID 4254)
  {
    id: 4254,
    cmsId: 4254,
    name: 'Flow Well Food Supplement Capsules',
    slug: 'flow-well-food-supplement-capsules',
    category: 'Internal wellness',
    packSize: '60 Capsules',
    formatTag: '60 Caps · Leg & Circulation',
    primaryImage: '/images/products/flow-well-food-supplement-capsules.webp',
    gallery: [
      '/images/products/flow-well-food-supplement-capsules.webp',
      'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/Ayur-Raksha-Flow-Well-Food-Supplement-Capsules-1.png',
      'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/Ayur-Raksha-Flow-Well-Food-Supplement-Capsules-2.png',
    ],
    mrp: 1299,
    price: 1199,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'Support healthy blood circulation and bring comfort to heavy, tired legs.',
    description:
      'Formulated with classical Ayurvedic herbs to help maintain healthy peripheral circulation, venous tone, and lower limb comfort. Traditionally taken as part of a daily vascular wellness routine.',
    indications: 'Leg heaviness, fatigue after standing, peripheral circulation balance, and everyday vascular comfort.',
    ingredients: 'Punarnava (Boerhavia diffusa), Guggulu (Commiphora mukul), Gotu Kola (Centella asiatica), and synergist botanicals.',
    directions: 'Take 2 capsules at night after food with warm water, or as advised by your healthcare practitioner.',
    storage: 'Store in a cool, dry place away from direct sunlight. Keep bottle tightly closed.',
    warnings: 'Dietary supplement. Consult your physician if pregnant, nursing, or taking blood thinners.',
    href: '/product/flow-well-food-supplement-capsules',
    sku: '4254',
  },

  // 2. Ayur Raksha Divine Healing Oil (CMS ID 113)
  {
    id: 7689,
    cmsId: 113,
    name: 'Ayur Raksha Divine Healing Oil',
    slug: 'divine-healing-oil',
    category: 'External care',
    packSize: '100 ml',
    formatTag: '100 ml · Pre-Bath Oil',
    primaryImage: '/images/products/divine-healing-oil.webp',
    gallery: [
      '/images/products/divine-healing-oil.webp',
      'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/AYUR-RAKSHA-OIL_new.png',
    ],
    mrp: 800,
    price: 800,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'Soothe dry, irritated skin with the nourishing power of eight traditional Ayurvedic herbs.',
    description:
      'A pre-bath botanical massage oil for intact, dry, or uncomfortable-feeling lower-leg skin. Nourishes the epidermal barrier with eight classical Ayurvedic herbs. Massage gently upwards from foot to knee; do not apply forceful pressure directly over bulging varicose veins.',
    indications: 'Dry lower-leg skin, mild surface tightness, scaling, and pre-bath epidermal nourishment.',
    ingredients: 'Wrightia tinctoria (Swetha Kutaja), Coconut oil base, Neem extracts, and traditional herbal decoctions.',
    directions:
      'Apply gently on intact lower-leg skin 15–20 minutes before bathing, stroking smoothly upward from ankle to knee without pressing on bulging veins. Wash off with a mild cleanser like SkinWell Soap.',
    storage: 'Store at room temperature. Keep cap tightly sealed.',
    warnings:
      'For external use on intact skin only. Do not apply over open venous ulcers, broken skin, or thrombophlebitis without clinician guidance.',
    href: '/product/divine-healing-oil',
    sku: '7689',
  },

  // 3. Ayur Raksha SkinWell Soap (Pack of 2) (CMS ID 109)
  {
    id: 10627,
    cmsId: 109,
    name: 'Ayur Raksha SkinWell Soap (Pack of 2)',
    slug: 'ayur-raksha-skinwell-soap-pack-of-2',
    category: 'Bath & scalp',
    packSize: 'Pack of 2 (2 × 75 g)',
    formatTag: 'Pack of 2 · Botanical Soap',
    primaryImage: '/images/products/ayur-raksha-skinwell-soap-pack-of-2.webp',
    gallery: [
      '/images/products/ayur-raksha-skinwell-soap-pack-of-2.webp',
      'https://www.ayurrakshaonline.com/wp-content/uploads/2024/03/Untitled-1-1.webp',
    ],
    mrp: 250,
    price: 250,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'Enjoy gentle botanical cleansing that leaves your skin feeling soft, fresh and comfortable.',
    description:
      'Enriched with Aloe Vera, Vitamin E, and Avocado Oil, SkinWell Soap provides ultra-gentle cleansing that respects sensitive, dry lower-leg skin without stripping natural lipids.',
    indications: 'Daily bathing, sensitive lower-leg skin, dryness, and non-stripping hygiene.',
    ingredients: 'Aloe Barbadensis extract, Vetiveria zizanioides oil, Avocado oil, Vitamin E, Vegetable soap base.',
    directions: 'Work into a mild lather with tepid water and wash gently over intact skin. Rinse thoroughly and pat dry.',
    storage: 'Keep in a well-drained soap dish after use.',
    warnings: 'For external use on intact skin only. Avoid contact with eyes.',
    href: '/product/ayur-raksha-skinwell-soap-pack-of-2',
    sku: '10627',
  },

  // 4. Ayur Raksha Super Heal O3 Cream (CMS ID 88)
  {
    id: 22867,
    cmsId: 88,
    name: 'Ayur Raksha Super Heal O3 Cream',
    slug: 'ayur-raksha-superheal-o3-cream',
    category: 'O3 specialty',
    packSize: '30 g',
    formatTag: 'O3 · Doctor-guided Cream',
    primaryImage: '/images/products/ayur-raksha-superheal-o3-cream.webp',
    gallery: [
      '/images/products/ayur-raksha-superheal-o3-cream.webp',
      'https://www.ayurrakshaonline.com/wp-content/uploads/2025/05/Ayur-Raksha-SuperHeal-O3-Cream.png',
    ],
    mrp: 3999,
    price: 3999,
    pricePending: false,
    inStock: true,
    doctorGuided: true,
    shortDescription: 'Give stressed, dry skin specialized nourishment with olive-oil-based O3 care.',
    description:
      'Advanced physician-guided ozonated topical formulation. Delivers oxygenated botanical lipids for stubborn, discolored, or stressed skin areas needing specialized nourishment.',
    indications: 'Doctor-guided topical care for localized persistent dryness, induration, and stubborn dermatological patches.',
    ingredients: 'Ozonated natural olive lipids, Wrightia tinctoria, Curcuma aromatica, Pongamia pinnata extracts.',
    directions:
      'Use strictly under the guidance of an Ayurvedic physician. Cleanse the area, apply a thin film twice daily, and refrigerate after opening.',
    storage: 'Store in a cool place, preferably refrigerated (4°C–10°C) after opening. Do not freeze.',
    warnings:
      'Doctor-guided product. Not recommended for open wounds, active venous ulcers, or bleeding areas without clinical supervision.',
    href: '/product/ayur-raksha-superheal-o3-cream',
    sku: '22867',
  },

  // 5. Ayur Raksha Detox Tea (CMS ID 85)
  {
    id: 27739,
    cmsId: 85,
    name: 'Ayur Raksha Detox Tea',
    slug: 'ayurraksha-detox-tea',
    category: 'Digestive wellness',
    packSize: '40 Sachets × 5 g',
    formatTag: '40 Sachets · Herbal Infusion',
    primaryImage: '/images/products/ayur-raksha-detox-tea.webp',
    gallery: [
      '/images/products/ayur-raksha-detox-tea.webp',
      'https://cms.ayurrakshaonline.com/wp-content/uploads/2026/10/detox-tea.png',
    ],
    mrp: 750,
    price: 750,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'Make digestive wellness part of your routine with a refreshing herbal tea ritual.',
    description:
      'An optional digestive-wellness herbal infusion featuring Triphala and warm carminatives. Completely independent of varicose care; supports comfortable overnight elimination and metabolic freshness.',
    indications: 'Digestive regularity, occasional sluggishness, and general metabolic wellness.',
    ingredients: 'Triphala (Haritaki, Bibhitaki, Amalaki), Cassia angustifolia (Avuri / Senna), Ginger, Cumin.',
    directions:
      'Empty one 5 g sachet into 100 ml boiling water, simmer gently until reduced to about 75 ml, and sip warm before bedtime.',
    storage: 'Store sachets in an airtight container in a dry place.',
    warnings: 'Not recommended during pregnancy, lactation, or in acute diarrhea. Digestive support option.',
    href: '/product/ayurraksha-detox-tea',
    sku: '27739',
  },
];

export const VARICOSE_VEINS_CONCERNS: ComboConcern[] = [
  {
    id: 'explore-all',
    name: 'Explore all 5 products',
    shortDesc: 'Curate your leg-wellness and skin care routine freely from all 5 products.',
    description:
      'Browse all 5 formulations at your own pace. All product choices remain completely optional, and nothing is added automatically.',
    highlightedProductIds: [],
    requiresDoctorGuidance: false,
  },
  {
    id: 'visible-veins',
    name: 'Visible veins / leg heaviness',
    shortDesc: 'Suggested starting shortlist: Flow Well Capsules + Divine Healing Oil.',
    description:
      'Exploration of Flow Well herbal circulation capsules and gentle lower-leg care with Divine Healing Oil. Persistent heaviness or swelling may require medical evaluation.',
    clinicalNotice:
      'This shortlist provides shopping guidance, not a diagnosis. Persistent leg swelling or visible varicose veins should be evaluated by a vascular specialist.',
    highlightedProductIds: [4254, 7689],
    requiresDoctorGuidance: false,
  },
  {
    id: 'dry-itchy',
    name: 'Dry / itchy lower-leg skin',
    shortDesc: 'Suggested starting shortlist: SkinWell Soap + Divine Healing Oil.',
    description:
      'Focus on gentle, non-stripping cleansing and pre-bath botanical skin nourishment for intact, dry lower-leg skin.',
    clinicalNotice:
      'Gentle cleansing and barrier nourishment for intact skin only. Avoid vigorous rubbing or high pressure over prominent veins.',
    highlightedProductIds: [10627, 7689],
    requiresDoctorGuidance: false,
  },
  {
    id: 'darkening',
    name: 'Skin darkening / persistent irritation',
    shortDesc: 'Targeted skin care with physician-guided O3 options.',
    description:
      'For skin discoloration (stasis pigmentation) or chronic irritation. Highlights gentle cleansing, healing oil, and physician-guided Super Heal O3 Cream.',
    clinicalNotice:
      'Discoloration in venous disease deserves professional medical assessment. O3 specialty care is doctor-guided.',
    highlightedProductIds: [10627, 7689, 22867],
    requiresDoctorGuidance: true,
  },
  {
    id: 'open-wound',
    name: 'Open wound / bleeding / rapidly swollen leg',
    shortDesc: 'Clinical safeguard: Immediate medical evaluation is required.',
    description:
      'Open sores, active venous ulcers, sudden calf swelling, or bleeding veins require urgent clinical medical assessment. Topical products and self-care oils are NOT recommended for unhealed ulcers.',
    emergencyNotice:
      'IMPORTANT MEDICAL SAFEGUARD: Do not self-treat active ulcers, bleeding, or sudden asymmetrical leg swelling with topical oils or creams. Please consult a qualified vascular surgeon or visit an emergency medical facility.',
    isEmergencyPathway: true,
    highlightedProductIds: [],
    requiresDoctorGuidance: true,
  },
];

// ============================================================================
// 2. BREATH EASY COMBO BUILDER DATA (3 PRODUCTS)
// ============================================================================

export const BREATH_EASY_CATEGORIES: MerchandisingCategory[] = [
  'All products',
  'Joint & Muscle Care',
  'Internal wellness',
  'Digestive wellness',
];

export const BREATH_EASY_PRODUCTS: ComboProduct[] = [
  // 1. B Derma Ayurvedic Capsules (CMS ID 100)
  {
    id: 11317,
    cmsId: 100,
    name: 'B Derma Ayurvedic Capsules',
    slug: 'b-derma-capsules',
    category: 'Internal wellness',
    packSize: '60 Capsules',
    formatTag: 'Doctor-guided · Skin Support',
    primaryImage: '/images/products/b-derma-capsules.webp',
    gallery: [
      '/images/products/b-derma-capsules.webp',
      'https://www.ayurrakshaonline.com/wp-content/uploads/2024/03/bderma-feature.webp',
    ],
    mrp: 799,
    price: 799,
    pricePending: false,
    inStock: true,
    doctorGuided: true,
    shortDescription: 'Nourish your skin from within with specialized Ayurvedic botanical care.',
    description:
      'An Ayurvedic proprietary formulation developed for internal skin balance, blood cleansing (Rakta Shodhana), and soothing dermatological irritation under physician guidance.',
    indications: 'Physician-supervised internal botanical care for skin radiance and metabolic equilibrium.',
    ingredients: 'Classical Ayurvedic proprietary botanical extracts.',
    directions: 'Take strictly as advised by your Ayurvedic physician (typically 1 capsule twice daily with warm water).',
    storage: 'Store in a cool, dry place away from direct sunlight.',
    warnings: 'Doctor-guided proprietary medicine. Consult a qualified doctor before use. Does not treat respiratory conditions.',
    href: '/product/b-derma-capsules',
    sku: '11317',
  },

  // 2. Etionment Pain Relief Cream (CMS ID 6319)
  {
    id: 6319,
    cmsId: 6319,
    name: 'Etionment Pain Relief Cream (50 g)',
    slug: 'etionment-pain-relief-cream',
    category: 'Joint & Muscle Care',
    packSize: '50 g',
    formatTag: 'Pain-Relief Cream · 50 g',
    primaryImage: '/images/products/etionment-pain-relief-cream.webp',
    gallery: [
      '/images/products/etionment-pain-relief-cream.webp',
      'https://www.ayurrakshaonline.com/wp-content/uploads/2024/01/Etionment-1.webp',
    ],
    mrp: 400,
    price: 350,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'Soothe aching muscles and stiff joints with targeted herbal pain-relief care.',
    description:
      'A fast-acting topical botanical balm formulated with natural active extracts and Vitamin E to soothe everyday muscular aches, stiff neck, shoulder fatigue, and joint soreness.',
    indications: 'Topical soothing of muscle stiffness, joint tightness, backache, and everyday body fatigue.',
    ingredients: 'Botanical essential oils, Gaultheria procumbens (Wintergreen), Mentha arvensis, Vitamin E, and cream base.',
    directions: 'Gently massage a small amount onto sore muscles or joints 2–3 times daily. Wash hands after use.',
    storage: 'Store in a cool, dry place. Keep tube cap tightly closed.',
    warnings: 'For external application only. Do not apply on face, chest for breathing relief, or on broken skin.',
    href: '/product/etionment-pain-relief-cream',
    sku: '6319',
  },

  // 3. Ayur Raksha Detox Tea (CMS ID 85)
  {
    id: 27739,
    cmsId: 85,
    name: 'Ayur Raksha Detox Tea',
    slug: 'ayurraksha-detox-tea',
    category: 'Digestive wellness',
    packSize: '40 Sachets × 5 g',
    formatTag: '40 Sachets · Herbal Infusion',
    primaryImage: '/images/products/ayur-raksha-detox-tea.webp',
    gallery: [
      '/images/products/ayur-raksha-detox-tea.webp',
      'https://cms.ayurrakshaonline.com/wp-content/uploads/2026/10/detox-tea.png',
    ],
    mrp: 750,
    price: 750,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'Make digestive wellness part of your routine with a refreshing herbal tea ritual.',
    description:
      'A soothing digestive infusion made with Triphala, Senna, and carminative herbs to support smooth overnight digestion and natural gut regularity.',
    indications: 'Digestive wellness, comfortable elimination, and metabolic reset.',
    ingredients: 'Triphala (Haritaki, Bibhitaki, Amalaki), Cassia angustifolia (Avuri / Senna), Ginger, Cumin.',
    directions: 'Simmer 1 sachet in 100 ml water for 5 minutes (reduced to ~75 ml) and drink warm before bed.',
    storage: 'Store sachets in an airtight container.',
    warnings: 'Not for acute respiratory complaints or during pregnancy.',
    href: '/product/ayurraksha-detox-tea',
    sku: '27739',
  },
];

export const BREATH_EASY_CONCERNS: ComboConcern[] = [
  {
    id: 'explore-all',
    name: 'Explore all 3 products',
    shortDesc: 'Display B Derma, Etionment 50G, and Detox Tea without mandatory preselection.',
    description:
      'Curate your personal selection freely from the 3 formulations. Each item is independently selectable with no forced items.',
    highlightedProductIds: [],
    requiresDoctorGuidance: false,
  },
  {
    id: 'muscle-discomfort',
    name: 'Muscle & joint soreness',
    shortDesc: 'Suggested starting item: Etionment 50G Pain Relief Cream.',
    description:
      'Highlights Etionment topical balm for everyday muscular fatigue, joint stiffness, and physical comfort.',
    clinicalNotice:
      'Etionment is formulated for musculoskeletal comfort. It is not formulated to relieve chest tightness, asthma, or respiratory symptoms.',
    highlightedProductIds: [6319],
    requiresDoctorGuidance: false,
  },
  {
    id: 'digestive-routine',
    name: 'Digestive routine',
    shortDesc: 'Suggested starting item: Ayur Raksha Detox Tea.',
    description:
      'Highlights Detox Tea as an optional herbal infusion to support comfortable evening digestion and natural gut equilibrium.',
    clinicalNotice:
      'Detox Tea is an herbal digestive support option, not a respiratory medication.',
    highlightedProductIds: [27739],
    requiresDoctorGuidance: false,
  },
  {
    id: 'skin-guidance',
    name: 'Skin-related guidance',
    shortDesc: 'Doctor-guided herbal option: B Derma Capsules.',
    description:
      'Displays B Derma proprietary capsules for physician-guided internal skin balance and radiance.',
    clinicalNotice:
      'B Derma is an Ayurvedic proprietary medicine for skin wellness. It does not provide pulmonary or respiratory benefits.',
    highlightedProductIds: [11317],
    requiresDoctorGuidance: true,
  },
  {
    id: 'breathing-difficulty',
    name: 'Breathing difficulty / wheeze / chest tightness',
    shortDesc: 'Clinical safeguard: Urgent medical evaluation required.',
    description:
      'Shortness of breath, acute wheezing, or chest tightness requires prompt medical attention. These wellness products are not a substitute for emergency respiratory medical care.',
    emergencyNotice:
      'EMERGENCY CLINICAL NOTICE: Severe shortness of breath, asthma attacks, or chest tightness require immediate hospital emergency or pulmonologist evaluation. Do not delay seeking medical care.',
    isEmergencyPathway: true,
    highlightedProductIds: [],
    requiresDoctorGuidance: true,
  },
];

// ============================================================================
// 3. CARDIAC WELLNESS COMBO BUILDER DATA (3 PRODUCTS)
// ============================================================================

export const CARDIAC_WELLNESS_CATEGORIES: MerchandisingCategory[] = [
  'All products',
  'Tonics & Elixirs',
  'Internal wellness',
  'Digestive wellness',
];

export const CARDIAC_WELLNESS_PRODUCTS: ComboProduct[] = [
  // 1. AyurRaksha Save Heart (CMS ID 7695)
  {
    id: 7695,
    cmsId: 7695,
    name: 'AyurRaksha Save Heart Tonic',
    slug: 'save-heart',
    category: 'Tonics & Elixirs',
    packSize: '500 ml',
    formatTag: '500 ml · Heart Tonic',
    primaryImage: '/images/products/save-heart.webp',
    gallery: [
      '/images/products/save-heart.webp',
      'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/Save-Heart-1.png',
      'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/Save-heart-3-1.png',
    ],
    mrp: 1299,
    price: 1199,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'Put your heart first with an Ayurvedic herbal tonic formulated for cardiovascular wellness.',
    description:
      'An Ayurvedic herbal tonic combining classical cardio-protective herbs such as Arjuna and Pushkarmool to help maintain balanced cardiovascular rhythm, natural lipid balance, and vitality.',
    indications: 'Cardiovascular wellness routine, antioxidant support, physical stamina, and vitality.',
    ingredients: 'Terminalia arjuna (Arjuna bark), Inula racemosa (Pushkarmool), Boerhavia diffusa, and herbal decoction base.',
    directions: 'Take 9 ml to 15 ml in the morning with warm water, or as directed by your Ayurvedic physician.',
    storage: 'Store in a cool, dark place away from direct sunlight. Shake well before use.',
    warnings:
      'Dietary herbal tonic. Does NOT replace prescribed cardiovascular medication, emergency care, or cardiologist treatment.',
    href: '/product/save-heart',
    sku: '7695',
  },

  // 2. Flow Well Food Supplement Capsules (CMS ID 4254)
  {
    id: 4254,
    cmsId: 4254,
    name: 'Flow Well Food Supplement Capsules',
    slug: 'flow-well-food-supplement-capsules',
    category: 'Internal wellness',
    packSize: '60 Capsules',
    formatTag: '60 Caps · Circulation Care',
    primaryImage: '/images/products/flow-well-food-supplement-capsules.webp',
    gallery: [
      '/images/products/flow-well-food-supplement-capsules.webp',
      'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/Ayur-Raksha-Flow-Well-Food-Supplement-Capsules-1.png',
    ],
    mrp: 1299,
    price: 1199,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'Support healthy blood circulation and bring comfort to heavy, tired legs.',
    description:
      'An Ayurvedic dietary supplement supporting peripheral circulation, vascular resilience, and energy balance. Traditionally used alongside heart wellness routines.',
    indications: 'Peripheral circulation, leg comfort, stamina, and cellular nourishment.',
    ingredients: 'Punarnava, Guggulu, Gotu Kola, and traditional synergy extracts.',
    directions: 'Take 2 capsules at night after food with warm water, or as advised by your healthcare practitioner.',
    storage: 'Keep container tightly closed in a cool, dry place.',
    warnings: 'Consult your cardiologist if you are on blood thinners or cardiac prescriptions.',
    href: '/product/flow-well-food-supplement-capsules',
    sku: '4254',
  },

  // 3. Ayur Raksha Detox Tea (CMS ID 85)
  {
    id: 27739,
    cmsId: 85,
    name: 'Ayur Raksha Detox Tea',
    slug: 'ayurraksha-detox-tea',
    category: 'Digestive wellness',
    packSize: '40 Sachets × 5 g',
    formatTag: '40 Sachets · Herbal Infusion',
    primaryImage: '/images/products/ayur-raksha-detox-tea.webp',
    gallery: [
      '/images/products/ayur-raksha-detox-tea.webp',
      'https://cms.ayurrakshaonline.com/wp-content/uploads/2026/10/detox-tea.png',
    ],
    mrp: 750,
    price: 750,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'Make digestive wellness part of your routine with a refreshing herbal tea ritual.',
    description:
      'A refreshing herbal infusion created with Triphala and digestive botanicals. Keeps digestive wellness a separate, optional part of your daily health routine.',
    indications: 'Digestive equilibrium, comfortable overnight motility, and metabolic detox.',
    ingredients: 'Triphala (Haritaki, Bibhitaki, Amalaki), Cassia angustifolia, Ginger, Cumin.',
    directions: 'Boil 1 sachet in 100 ml water for 5 minutes, reduce to 75 ml, and sip warm at night.',
    storage: 'Store sachets in airtight container.',
    warnings: 'Digestive support option. Not a treatment for cardiac conditions.',
    href: '/product/ayurraksha-detox-tea',
    sku: '27739',
  },
];

export const CARDIAC_WELLNESS_CONCERNS: ComboConcern[] = [
  {
    id: 'explore-all',
    name: 'Explore all 3 products',
    shortDesc: 'Display all three choices independently. Customers select each item on their own.',
    description:
      'Explore Save Heart tonic, Flow Well circulation capsules, and Detox Tea at your own pace with zero compulsory items.',
    highlightedProductIds: [],
    requiresDoctorGuidance: false,
  },
  {
    id: 'general-heart',
    name: 'General heart-wellness interest',
    shortDesc: 'Suggested starting product: Save Heart Herbal Tonic.',
    description:
      'Explore Save Heart tonic formulated with classical Arjuna for heart-wellness support. Does not replace physician-prescribed heart medications.',
    clinicalNotice:
      'Save Heart is an Ayurvedic wellness formulation. It does not replace prescription cardiac medicines, urgent hospital care, or doctor advice.',
    highlightedProductIds: [7695],
    requiresDoctorGuidance: false,
  },
  {
    id: 'leg-heaviness',
    name: 'Leg heaviness / circulation interest',
    shortDesc: 'Suggested starting product: Flow Well Capsules.',
    description:
      'Explore Flow Well capsules formulated to assist healthy peripheral blood circulation and lower-leg comfort.',
    clinicalNotice:
      'Lower limb symptoms may stem from cardiovascular, venous, or metabolic factors and warrant medical consultation.',
    highlightedProductIds: [4254],
    requiresDoctorGuidance: false,
  },
  {
    id: 'digestive-interest',
    name: 'Digestive-wellness interest',
    shortDesc: 'Optional separate ritual: Ayur Raksha Detox Tea.',
    description:
      'Keep digestive balance an easy, separate part of your evening routine with Detox Tea.',
    clinicalNotice:
      'Detox Tea is an independent digestive-wellness option; it is not a heart formulation.',
    highlightedProductIds: [27739],
    requiresDoctorGuidance: false,
  },
  {
    id: 'on-heart-meds',
    name: 'On heart medicines / existing condition',
    shortDesc: 'Medication check and physician consultation required.',
    description:
      'Patients taking antihypertensives, blood thinners, antiplatelets, or diuretics should have an interaction review before taking herbal supplements.',
    clinicalNotice:
      'MEDICATION SAFETY CHECK: Always review any supplement with your treating cardiologist before adding it to prescribed heart medicines. Never discontinue or adjust prescription medications.',
    highlightedProductIds: [7695, 4254],
    requiresDoctorGuidance: true,
  },
  {
    id: 'chest-pain',
    name: 'Chest pain / severe breathlessness',
    shortDesc: 'Emergency medical care warning: Seek emergency care immediately.',
    description:
      'Chest pain, tightness, radiation to the arm or jaw, or acute shortness of breath is a medical emergency. Emergency symptoms must never enter a shopping routine.',
    emergencyNotice:
      'URGENT MEDICAL WARNING: If you or someone you are caring for experiences chest pain, pressure, or acute breathlessness, call emergency medical services immediately or go to the nearest emergency room. Do not purchase or consume wellness products.',
    isEmergencyPathway: true,
    highlightedProductIds: [],
    requiresDoctorGuidance: true,
  },
];

// ============================================================================
// COMPLETE BUILDER CONFIGS
// ============================================================================

export const SKIN_CARE_CONFIG: ComboBuilderConfig = {
  id: 'skin-care',
  slug: 'skin-care',
  name: 'Skin Care Combo Builder',
  heroTagline: 'AyurRaksha Botanical Wellness',
  heroTitle: 'Skin care that begins',
  heroHighlight: 'with you.',
  heroDescription:
    'Choose from 13 doctor-formulated Ayurvedic skin care essentials, select the products that suit your individual routine, and compose your personalized combination at your own pace.',
  heroBadge: '13 Formulations',
  catalogSubtitle: 'Browse, compare and customize your selection with live store prices. No products are added without your choice.',
  catalogCountBadge: '13 Products • 5 Categories',
  storageKey: 'ayurraksha_combo_selection_v2',
  stepGuide: {
    step1Title: 'Choose formulations:',
    step1Desc: 'Browse common concerns or select any of the 13 products.',
    step2Title: 'Adjust quantities:',
    step2Desc: 'Add either soap, both soaps, oils, or supplements as desired.',
    step3Title: 'Instant checkout:',
    step3Desc: 'View product-level savings and complete order securely.',
  },
  categories: MERCHANDISING_CATEGORIES,
  products: MASTER_COMBO_PRODUCTS,
  concerns: SKIN_CONCERNS,
  consultationHeading: 'Still deciding? Speak with a VPrime Ayurvedic physician.',
  consultationText:
    'Get a free personal consultation to discuss your skin concerns before choosing a routine. Consultation is completely optional; shopping remains in your hands.',
  consultationFocus: 'Skin Care Guidance',
  metaTitle: 'Skin Care Combo Builder — Build Your Routine | AyurRaksha Online',
  metaDescription:
    'Build your personalized Ayurvedic skin care combo from 13 doctor-formulated herbal products. Enjoy live savings and optional free physician consultations.',
};

export const VARICOSE_VEINS_CONFIG: ComboBuilderConfig = {
  id: 'varicose-veins',
  slug: 'varicose-veins',
  name: 'Varicose Veins Combo Builder',
  heroTagline: 'Circulation & Lower-Leg Comfort',
  heroTitle: 'Vascular wellness that supports',
  heroHighlight: 'every step.',
  heroDescription:
    'Build your personalized routine for healthy circulation, heavy-feeling legs, and gentle skin care from 5 doctor-formulated Ayurvedic preparations. Every product is individually selectable.',
  heroBadge: '5 Products',
  catalogSubtitle:
    'Select the capsules, pre-bath massage oil, botanical soap, O3 cream, or tea that match your routine. No forced items.',
  catalogCountBadge: '5 Products • 4 Categories',
  storageKey: 'ayurraksha_varicose_combo_v1',
  stepGuide: {
    step1Title: 'Select your focus:',
    step1Desc: 'Choose leg heaviness, dry skin, or explore all 5 products.',
    step2Title: 'Customize combo:',
    step2Desc: 'Pick any combination of capsules, oil, soap, or specialty cream.',
    step3Title: 'Direct checkout:',
    step3Desc: 'Automatic volume savings applied to your cart at checkout.',
  },
  categories: VARICOSE_VEINS_CATEGORIES,
  products: VARICOSE_VEINS_PRODUCTS,
  concerns: VARICOSE_VEINS_CONCERNS,
  consultationHeading: 'Need advice on lower-leg care? Speak with a VPrime physician.',
  consultationText:
    'Get free, personalized Ayurvedic guidance on circulation care, intact skin massage techniques, and healthy daily habits. Completely optional.',
  consultationFocus: 'Varicose Veins & Circulation Guidance',
  metaTitle: 'Varicose Veins Combo Builder — Custom Circulation Routine | AyurRaksha',
  metaDescription:
    'Create your custom Varicose Veins and circulation combo from 5 Ayurvedic formulations including Flow Well, Divine Healing Oil, and SkinWell Soap.',
};

export const BREATH_EASY_CONFIG: ComboBuilderConfig = {
  id: 'breath-easy',
  slug: 'breath-easy',
  name: 'Breath Easy Combo Builder',
  heroTagline: 'Targeted Comfort & Wellness',
  heroTitle: 'Everyday comfort crafted',
  heroHighlight: 'for your vitality.',
  heroDescription:
    'Curate your personal combination from 3 authentic Ayurvedic preparations for muscle soreness, digestive routine, and skin nourishment. Each item is completely optional.',
  heroBadge: '3 Products',
  catalogSubtitle:
    'Compare and select pain-relief cream, digestive tea, or doctor-guided skin capsules with transparent store pricing.',
  catalogCountBadge: '3 Products • 3 Categories',
  storageKey: 'ayurraksha_breath_combo_v1',
  stepGuide: {
    step1Title: 'Review formulations:',
    step1Desc: 'Explore targeted muscle relief, digestive tea, or skin care.',
    step2Title: 'Choose quantities:',
    step2Desc: 'Select exactly what you need without any compulsory items.',
    step3Title: 'Seamless order:',
    step3Desc: 'Take advantage of tiered volume discounts and secure delivery.',
  },
  categories: BREATH_EASY_CATEGORIES,
  products: BREATH_EASY_PRODUCTS,
  concerns: BREATH_EASY_CONCERNS,
  consultationHeading: 'Have questions about these formulations? Consult a doctor.',
  consultationText:
    'Talk with a certified VPrime Ayurvedic doctor to discuss proper topical application and proprietary herbal usage. Free and non-binding.',
  consultationFocus: 'Breath Easy Formulations Guidance',
  metaTitle: 'Breath Easy Combo Builder — Customized Herbal Routine | AyurRaksha',
  metaDescription:
    'Customize your Breath Easy combo from 3 Ayurvedic formulations: Etionment pain-relief cream, B Derma capsules, and Detox Tea.',
};

export const CARDIAC_WELLNESS_CONFIG: ComboBuilderConfig = {
  id: 'cardiac-wellness',
  slug: 'cardiac-wellness',
  name: 'Cardiac Wellness Combo Builder',
  heroTagline: 'Cardiovascular Vitality & Balance',
  heroTitle: 'Heart wellness inspired',
  heroHighlight: 'by pure Ayurveda.',
  heroDescription:
    'Curate your cardiovascular wellness, circulation, and digestive routine from 3 classical Ayurvedic preparations. Completely customer-configurable with zero forced items.',
  heroBadge: '3 Products',
  catalogSubtitle:
    'Independently choose Save Heart tonic, Flow Well circulation capsules, and Detox Tea. View live prices and verified discounts.',
  catalogCountBadge: '3 Products • 3 Categories',
  storageKey: 'ayurraksha_cardiac_combo_v1',
  stepGuide: {
    step1Title: 'Select your interest:',
    step1Desc: 'Browse heart tonic, circulation support, or digestive tea.',
    step2Title: 'Set your quantities:',
    step2Desc: 'Add one, two, or all three products based on your preferences.',
    step3Title: 'Checkout with savings:',
    step3Desc: 'Enjoy volume savings up to 15% off and free doorstep delivery.',
  },
  categories: CARDIAC_WELLNESS_CATEGORIES,
  products: CARDIAC_WELLNESS_PRODUCTS,
  concerns: CARDIAC_WELLNESS_CONCERNS,
  consultationHeading: 'Taking heart medication? Talk to an Ayurvedic physician first.',
  consultationText:
    'We provide free Ayurvedic physician consultations to review your health routine and ensure safe, responsible supplement selection alongside any prescribed medications.',
  consultationFocus: 'Cardiac Wellness & Medication Review',
  metaTitle: 'Cardiac Wellness Combo Builder — Heart & Circulation Routine | AyurRaksha',
  metaDescription:
    'Build your custom Cardiac Wellness combo from 3 Ayurvedic formulations including Save Heart tonic, Flow Well capsules, and Detox Tea.',
};

export const COMBO_CONFIGS: Record<string, ComboBuilderConfig> = {
  'skin-care': SKIN_CARE_CONFIG,
  'varicose-veins': VARICOSE_VEINS_CONFIG,
  'breath-easy': BREATH_EASY_CONFIG,
  'cardiac-wellness': CARDIAC_WELLNESS_CONFIG,
};

export function getComboConfig(slug: string): ComboBuilderConfig | undefined {
  return COMBO_CONFIGS[slug];
}
