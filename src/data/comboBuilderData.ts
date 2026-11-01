import { ComboProduct, MerchandisingCategory, SkinConcern, VideoLanguageOption } from '@/types/combo';

// Strictly the 5 Merchandising Categories from the Developer Brief
export const MERCHANDISING_CATEGORIES: MerchandisingCategory[] = [
  'All products',
  'External care',
  'Bath & scalp',
  'Internal wellness',
  'Digestive wellness',
  'O3 specialty',
];

// Exactly 13 approved formulations mapped to live WordPress CMS IDs
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
    shortDescription: 'Pre-bath topical herbal oil for targeted soothing of dry, irritated skin, rashes, and scaling.',
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

  // 2. Skin Conditioning Oil (CMS ID 98)
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
    shortDescription: 'Post-bath botanical conditioning oil engineered to lock in moisture and alleviate persistent dryness.',
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

  // 3. SP Soryn Cream (CMS ID 99)
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
    shortDescription: 'Topical Ayurvedic proprietary herbal formulation for targeted skin care support.',
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

  // 4. SkinWell Soap (CMS ID 109)
  {
    id: 10627,
    cmsId: 109,
    name: 'Ayur Raksha SkinWell Soap',
    slug: 'ayur-raksha-skinwell-soap-pack-of-2',
    category: 'Bath & scalp',
    packSize: 'Pack of 2 (150 g)',
    formatTag: 'Unisex · Botanical Soap',
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
    shortDescription: 'Aloe vera and vetiver-infused gentle bath bar for daily sensitive and dry skin cleansing.',
    description:
      'Enriched with Aloe Vera, Vitamin E, and Avocado Oil, SkinWell Soap gently purifies without stripping natural epidermal oils. Both soaps are independently selectable.',
    indications: 'Daily bathing, sensitive skin, dryness, mild itching, and family wellness.',
    ingredients: 'Aloe Barbadensis extract, Vetiveria zizanioides oil, Avocado oil, Vitamin E, Vegetable soap base.',
    directions: 'Lather gently over wet body during bath or shower, then rinse thoroughly with tepid water.',
    storage: 'Keep in a dry soap dish after use to prolong bar life.',
    warnings: 'For external use only. Avoid contact with eyes.',
    href: '/product/ayur-raksha-skinwell-soap-pack-of-2',
    sku: '10627',
    isFlagshipSkinCare: true,
  },

  // 5. Anti-Tan Kalonji Soap (CMS ID 122)
  {
    id: 122,
    cmsId: 122,
    name: 'Ayur Raksha Anti-Tan Kalonji Soap',
    slug: 'ayurraksha-kalonji-soap',
    category: 'Bath & scalp',
    packSize: '75 g (Grade 1)',
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
    shortDescription: 'Pure Nigella Sativa (Kalonji) herbal bath soap with 76% TFM for anti-tan skin refreshment.',
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

  // 6. Herbal Hair Shampoo (CMS ID 96)
  {
    id: 12007,
    cmsId: 96,
    name: 'Ayur Raksha Herbal Hair Shampoo',
    slug: 'ayur-raksha-herbal-shampoo',
    category: 'Bath & scalp',
    packSize: '200 ml',
    formatTag: '200 ml · Scalp Cleanser',
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
    shortDescription: 'Aloe vera-enriched botanical shampoo formulated to cleanse itchy, scaly scalps and maintain root health.',
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

  // 7. Skinwell Food Supplement (CMS ID 107)
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
    shortDescription: 'Herbal dietary supplement designed to provide internal micronutrient and antioxidant skin support.',
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

  // 8. IMU 360 Food Supplement (CMS ID 94)
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
    price: 1298,
    pricePending: false,
    inStock: true,
    doctorGuided: false,
    shortDescription: 'General nutritional and herbal wellness supplement supporting natural defenses and daily vitality.',
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

  // 9. B Derma Ayurvedic Capsules (CMS ID 100)
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
    shortDescription: 'Ayurvedic proprietary formulation advised under VPrime physician guidance for persistent concerns.',
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

  // 10. Ayur Raksha Detox Tea (CMS ID 85)
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
    shortDescription: 'Digestive herbal infusion with Triphala and Senna supporting natural gut equilibrium and comfort.',
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

  // 11. Super Heal O3 Cream (CMS ID 88)
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
    shortDescription: 'Advanced ozonated topical herbal formulation designed for targeted conditioning under clinical supervision.',
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

  // 12. Ayur Raksha Immune O3 Capsules (CMS ID 124)
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
    mrp: 1298,
    price: 1298,
    pricePending: false,
    inStock: true,
    doctorGuided: true,
    shortDescription: 'Specialty enteric-coated ozonated herbal capsules formulated for targeted intestinal delivery.',
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

  // 13. Ayur Raksha Vital O3 Cream (CMS ID 123)
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
    shortDescription: 'Specialty topical ozonated botanical cream designed for doctor-guided vitiligo-related care.',
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
