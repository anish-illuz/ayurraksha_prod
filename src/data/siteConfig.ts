export interface HealthConcern {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  heroProductSlug: string;
}

export const HEALTH_CONCERNS: HealthConcern[] = [
  {
    id: 'liver-wellness',
    name: 'Liver Wellness & Detox',
    slug: 'liver-wellness',
    description: 'Time-tested botanical formulations for natural liver vitality and digestive comfort.',
    icon: 'Activity',
    heroProductSlug: 'boozliv',
  },
  {
    id: 'pain-joints',
    name: 'Joint & Muscle Care',
    slug: 'pain-joints',
    description: 'Deep penetrating herbal oils and formulations for joint mobility and soothing relief.',
    icon: 'ShieldCheck',
    heroProductSlug: 'divine-healing-oil',
  },
  {
    id: 'skin-dermatology',
    name: 'Skin & Botanical Care',
    slug: 'skin-dermatology',
    description: 'Purifying botanical care, nutrient-dense oils, and natural soaps for lasting skin balance.',
    icon: 'Sparkles',
    heroProductSlug: 'ayur-raksha-skinwell-soap-pack-of-2',
  },
  {
    id: 'heart-cardiac',
    name: 'Heart & Cardiovascular',
    slug: 'heart-cardiac',
    description: 'Nourishing herbal cardiac support designed to maintain balanced cardiovascular rhythm.',
    icon: 'Heart',
    heroProductSlug: 'save-heart',
  },
  {
    id: 'digestive-health',
    name: 'Digestive & Gut Health',
    slug: 'digestive-health',
    description: 'Natural herbal infusions, fiber blends, and tonics for smooth gut equilibrium.',
    icon: 'Coffee',
    heroProductSlug: 'organics-laxahealth-tea-tin',
  },
  {
    id: 'vascular-veins',
    name: 'Circulation & Vein Care',
    slug: 'vascular-veins',
    description: 'Formulations engineered to assist healthy blood flow and lower limb comfort.',
    icon: 'Zap',
    heroProductSlug: 'flow-well-food-supplement-capsules',
  },
  {
    id: 'respiratory-care',
    name: 'Respiratory Wellness',
    slug: 'respiratory-care',
    description: 'Herbal defense supplements for clear breathing and seasonal resilience.',
    icon: 'Wind',
    heroProductSlug: 'esnovate-immunity-boosting-capsules',
  },
  {
    id: 'immunity-vitality',
    name: 'Vitality & Rejuvenation',
    slug: 'immunity-vitality',
    description: 'Holistic restorative tonics crafted to replenish stamina and natural defenses.',
    icon: 'Sun',
    heroProductSlug: 'purna-sakthi-tonic',
  },
];

export const PRODUCT_FORMATS = [
  { name: 'All Formats', slug: 'all' },
  { name: 'Tonics & Syrups', slug: 'tonic' },
  { name: 'Herbal Oils', slug: 'oil' },
  { name: 'Supplement Capsules', slug: 'capsules' },
  { name: 'Health Packs & Combos', slug: 'health-packs' },
  { name: 'Herbal Powders & Teas', slug: 'powder' },
  { name: 'Botanical Creams', slug: 'cream' },
  { name: 'Ayurvedic Soaps', slug: 'soap' },
];

export const SITE_CONFIG = {
  name: 'AyurRaksha Online',
  legalName: 'VPrime Innovations',
  domain: 'https://www.ayurrakshaonline.com',
  tagline: 'Natural Ayurvedic Remedies for Everyday Health',
  shortDescription: 'Doctor-formulated Ayurvedic wellness supplements, herbal tonics, and natural personal care formulated in Chennai, India.',
  phone: '+91 9940388877',
  displayPhone: '+91 99403 88877',
  whatsappUrl: 'https://wa.me/919940388877?text=Hi%20AyurRaksha,%20I%20would%20like%20to%20inquire%20about%20your%20products',
  email: 'support@ayurrakshaonline.com',
  corporateEmail: 'info@vprimecorp.in',
  ordersEmail: 'orders@vprimecorp.in',
  address: {
    street: '251, First Floor, New Tiny Sector',
    area: 'Ambattur Industrial Estate',
    city: 'Chennai',
    state: 'Tamil Nadu',
    postalCode: '600058',
    country: 'India',
  },
  doctor: {
    name: 'Dr. Jegajothi Pandian',
    title: 'Chief Ayurvedic Medical Officer & Formulation Scientist',
    experience: 'Over 25 years of experience in Ayurvedic formulations and holistic therapeutics.',
  },
  shipping: {
    prepaidThreshold: 0, // Free on all prepaid orders
    prepaidText: 'Free shipping on all prepaid orders across India',
    dispatchTime: 'Dispatched within 1–2 business days',
    codFee: 100,
    deliveryMetro: '2–5 business days',
    deliveryNonMetro: '5–7 business days',
  },
  reviews: {
    averageRating: 4.8,
    totalReviews: 840,
    provider: 'Judge.me',
    verifiedText: 'Verified Customer Reviews',
  },
};
