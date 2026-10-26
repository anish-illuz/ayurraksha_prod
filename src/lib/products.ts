import productsData from '@/data/products.json';
import { Product } from '@/types/product';

const allProducts: Product[] = productsData as Product[];

// Canonical mapping between Health Concern slugs and matching tags/terms
export const CONCERN_SLUG_MAP: Record<string, string[]> = {
  'liver-wellness': [
    'liver-wellness',
    'liver wellness',
    'liver wellness & detox',
    'liver detox',
    'liver',
  ],
  'pain-joints': [
    'pain-joints',
    'pain & joints',
    'joint & muscle care',
    'joint and muscle care',
    'joints',
    'pain',
  ],
  'skin-dermatology': [
    'skin-dermatology',
    'skin & dermatology',
    'skin & botanical care',
    'skin and botanical care',
    'skin care',
    'dermatology',
    'skin',
  ],
  'heart-cardiac': [
    'heart-cardiac',
    'heart & cardiac',
    'heart & cardiovascular',
    'cardiac',
    'cardiovascular',
    'heart',
  ],
  'digestive-health': [
    'digestive-health',
    'digestive health',
    'digestive & gut health',
    'digestive and gut health',
    'gut health',
    'digestion',
  ],
  'vascular-veins': [
    'vascular-veins',
    'vascular & piles',
    'circulation & vein care',
    'circulation and vein care',
    'vascular',
    'veins',
    'piles',
  ],
  'respiratory-care': [
    'respiratory-care',
    'respiratory care',
    'respiratory wellness',
    'respiratory',
    'breathing',
    'cold',
  ],
  'immunity-vitality': [
    'immunity-vitality',
    'immunity & vitality',
    'vitality & rejuvenation',
    'vitality and rejuvenation',
    'vitality',
    'rejuvenation',
    'immunity',
  ],
};

export function getAllProducts(): Product[] {
  return allProducts;
}

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((p) => p.slug === slug);
}

export function getBestsellers(limit = 8): Product[] {
  const bestsellers = allProducts.filter((p) => p.isBestseller);
  if (bestsellers.length >= limit) {
    return bestsellers.slice(0, limit);
  }
  // Fill with highest rated if needed
  const others = allProducts.filter((p) => !p.isBestseller);
  return [...bestsellers, ...others].slice(0, limit);
}

export function getProductsByConcern(concernSlug: string): Product[] {
  const normalizedSlug = concernSlug.toLowerCase().trim();
  const searchTerms = CONCERN_SLUG_MAP[normalizedSlug] || [normalizedSlug, normalizedSlug.replace(/-/g, ' ')];

  return allProducts.filter((p) =>
    p.healthConcerns.some((c) => {
      const cLower = c.toLowerCase();
      return searchTerms.some((term) => cLower.includes(term) || term.includes(cLower));
    })
  );
}

export function getProductsByCategory(categorySlug: string): Product[] {
  if (categorySlug === 'all') return allProducts;
  return allProducts.filter((p) =>
    p.categorySlugs.some((s) => s.toLowerCase() === categorySlug.toLowerCase())
  );
}

export function getRelatedProducts(currentProduct: Product, limit = 4): Product[] {
  return allProducts
    .filter((p) => p.id !== currentProduct.id)
    .filter((p) =>
      p.healthConcerns.some((c) => currentProduct.healthConcerns.includes(c)) ||
      p.categories.some((cat) => currentProduct.categories.includes(cat))
    )
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  if (!query || query.trim() === '') return [];
  const q = query.toLowerCase().trim();
  return allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.cleanDescription.toLowerCase().includes(q) ||
      p.healthConcerns.some((c) => c.toLowerCase().includes(q)) ||
      p.categories.some((cat) => cat.toLowerCase().includes(q))
  );
}
