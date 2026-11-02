export interface FeatureCard {
  title: string;
  description: string;
  icon?: string;
}

export interface IngredientCard {
  badge: string;
  commonName: string;
  latinName: string;
  description: string;
  bioactive?: string;
  derivative?: string;
  image?: string;
}

export interface RitualStep {
  stepNumber: number;
  title: string;
  description: string;
  icon?: string;
}

export interface PackOption {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  regularPrice?: number;
  discountBadge?: string;
  isDefault?: boolean;
}

export interface ProductVariant {
  id?: number;
  name: string;
  slug: string;
  price?: number;
  regularPrice?: number;
  salePrice?: number;
  discountPercent?: number;
  inStock?: boolean;
  default?: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  regularPrice: number;
  salePrice: number;
  discountPercent: number;
  onSale: boolean;
  categories: string[];
  categorySlugs: string[];
  healthConcerns: string[];
  isBestseller: boolean;
  images: string[];
  rating: number;
  reviewCount: number;
  shortDescription: string;
  description: string;
  cleanDescription: string;
  inStock: boolean;
  variants: ProductVariant[];
  sku?: string;

  // Comprehensive ACF Structured Fields matching Document & Reference UI
  subtitle?: string;
  skuBadge?: string;
  heroImageBadge?: string;
  heroImageTag?: string;
  packOptions?: PackOption[];

  // Doctor guidance banner
  doctorBannerTitle?: string;
  doctorBannerText?: string;

  // Editorial Story
  storyEyebrow?: string;
  storyTitle?: string;
  storyBody?: string[];
  storyClosing?: string;
  principleBadge?: string;
  principleTitle?: string;
  principleText?: string;
  storyImage?: string;

  // Key Features & Therapeutic Benefits (6 Cards)
  featuresEyebrow?: string;
  featuresTitle?: string;
  featuresBadge?: string;
  featureCards?: FeatureCard[];
  features?: string[];

  // Botanical Ingredients Breakdown (Detailed Herb Cards)
  ingredientsEyebrow?: string;
  ingredientsTitle?: string;
  ingredientsSubtitle?: string;
  ingredientCards?: IngredientCard[];
  ingredients?: string[];

  // The Evening Ritual / How to Prepare (4 Steps)
  ritualEyebrow?: string;
  ritualTitle?: string;
  ritualSubtitle?: string;
  ritualSteps?: RitualStep[];
  howToUse?: string[];

  // Bottom Indications & Specifications
  targetIndications?: string;
  targetIndicationsBadge?: string;
  suitableFor?: string;
  advisoryGuidelines?: string[];
  warnings?: string[];
  specNetQuantity?: string;
  specProductForm?: string;
  specOrigin?: string;
  specDisclosures?: string;
  storage?: string;
  netQuantity?: string;
  fullDescription?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
  variantPrice?: number;
  variantId?: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
}
