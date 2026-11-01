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
  highlightedProductIds: number[];
  excludedProductIds?: number[];
  requiresDoctorGuidance?: boolean;
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
