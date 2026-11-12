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
    description: 'Your liver works hard every day. Give it the herbal care it deserves.',
    icon: 'Activity',
    heroProductSlug: 'boozliv',
  },
  {
    id: 'pain-joints',
    name: 'Joint & Muscle Care',
    slug: 'pain-joints',
    description: 'Keep moving, keep doing what you love. Discover herbal care for everyday comfort.',
    icon: 'ShieldCheck',
    heroProductSlug: 'bpain-out-capsules',
  },
  {
    id: 'skin-dermatology',
    name: 'Skin & Botanical Care',
    slug: 'skin-dermatology',
    description: "Love the skin you're in! Discover botanical care for a naturally radiant glow.",
    icon: 'Sparkles',
    heroProductSlug: 'divine-healing-oil',
  },
  {
    id: 'heart-cardiac',
    name: 'Heart & Cardiovascular',
    slug: 'heart-cardiac',
    description: 'Show your heart some love with thoughtfully crafted Ayurvedic wellness essentials.',
    icon: 'Heart',
    heroProductSlug: 'save-heart',
  },
  {
    id: 'digestive-health',
    name: 'Digestive & Gut Health',
    slug: 'digestive-health',
    description: 'A happier gut starts with mindful care. Discover herbal support for digestive wellness.',
    icon: 'Coffee',
    heroProductSlug: 'ayurraksha-detox-tea',
  },
  {
    id: 'vascular-veins',
    name: 'Circulation & Vein Care',
    slug: 'vascular-veins',
    description: 'Your legs carry you through life. Give them the care and attention they deserve.',
    icon: 'Zap',
    heroProductSlug: 'flow-well-food-supplement-capsules',
  },
  {
    id: 'respiratory-care',
    name: 'Respiratory Wellness',
    slug: 'respiratory-care',
    description: 'Every breath matters. Discover traditional herbal care for respiratory wellness.',
    icon: 'Wind',
    heroProductSlug: 'esnovate-immunity-boosting-capsules',
  },
  {
    id: 'immunity-vitality',
    name: 'Vitality & Rejuvenation',
    slug: 'immunity-vitality',
    description: 'Bring back the joy of feeling your best with Ayurvedic vitality and wellness essentials.',
    icon: 'Sun',
    heroProductSlug: 'purna-sakthi-tonic',
  },
];

export const PRODUCT_FORMATS = [
  { name: 'All Formats', slug: 'all' },
  { name: 'Tonics & Syrups', slug: 'tonic' },
  { name: 'Herbal Oils', slug: 'oil' },
  { name: 'Supplement Capsules', slug: 'capsules' },
  { name: 'Herbal Powders & Teas', slug: 'powder' },
  { name: 'Botanical Creams', slug: 'cream' },
  { name: 'Ayurvedic Soaps', slug: 'soap' },
];

export const SITE_CONFIG = {
  name: 'AyurRaksha Online',
  legalName: 'VPrime Innovations',
  domain: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ayurrakshaonline.com',
  cmsDomain: process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://cms.ayurrakshaonline.com',
  tagline: 'Natural Ayurvedic Remedies for Everyday Health',
  shortDescription: 'Authentic classical Ayurvedic wellness supplements, herbal tonics, and natural personal care crafted in Chennai, India.',
  phone: '+91 9940388877',
  displayPhone: '+91 99403 88877',
  whatsappUrl: 'https://wa.me/919940388877',
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
    title: 'Senior Ayurvedic Medical Consultant & Physician',
    experience: 'Over 25 years of clinical medical consultation experience in Ayurvedic care.',
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
