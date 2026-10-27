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
