export type MerchandisingCategory =
  | 'All products'
  | 'External care'
  | 'Bath & scalp'
  | 'Internal wellness'
  | 'Digestive wellness'
  | 'O3 specialty'
  | 'Tonics & Elixirs'
  | 'Joint & Muscle Care'
  | 'All Store Formulations';

export interface ComboProduct {
  id: number;
  cmsId: number;
  name: string;
  slug: string;
  category: MerchandisingCategory;
  packSize: string;
  formatTag: string;
  primaryImage: string;
  gallery: string[];
  mrp: number | null; // Verified standard MRP (null if pending or unverified)
  price: number | null; // Selling price (null if pending)
  pricePending?: boolean;
  inStock: boolean;
  doctorGuided: boolean;
  shortDescription: string;
  description: string;
  indications?: string;
  ingredients?: string;
  directions?: string;
  storage?: string;
  warnings?: string;
  href?: string;
  sku: string;
  isFlagshipSkinCare?: boolean;
}

export interface SkinConcern {
  id: string;
  name: string;
  shortDesc: string;
  description: string;
  clinicalNotice?: string;
  emergencyNotice?: string;
  isEmergencyPathway?: boolean;
  highlightedProductIds: number[];
  excludedProductIds?: number[];
  requiresDoctorGuidance?: boolean;
}

export type ComboConcern = SkinConcern;

export interface ComboBuilderInfo {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  badge: string;
  productCount: number;
  categoryCount?: number;
  href: string;
  accentColor?: string;
  bgGradient?: string;
  popular?: boolean;
}

export interface ComboBuilderConfig {
  id: string;
  slug: string;
  name: string;
  heroTagline: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroBadge: string;
  catalogSubtitle: string;
  catalogCountBadge: string;
  storageKey: string;
  stepGuide: {
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  categories: MerchandisingCategory[];
  products: ComboProduct[];
  concerns: ComboConcern[];
  consultationHeading: string;
  consultationText: string;
  consultationFocus: string;
  metaTitle: string;
  metaDescription: string;
}

export interface VideoLanguageOption {
  id: string;
  label: string;
  nativeLabel: string;
  isMaster?: boolean;
  isAvailable: boolean;
  statusNote: string;
}

export type ConsultationPlacement =
  | 'hero'
  | 'after_explainer'
  | 'inside_builder'
  | 'before_checkout'
  | 'product_drawer';

export interface ComboCartItem {
  product: ComboProduct;
  quantity: number;
}
