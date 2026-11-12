import productsData from '@/data/products.json';
import { Product } from '@/types/product';

const allProducts: Product[] = productsData as Product[];

// Slug aliases between the storefront Product slug and the WordPress CMS
// post_name slug. This table is the single source of truth for that slug
// divergence: products.ts owns it so both catalog slug resolution
// (getProductBySlug) and CMS content fetching (lib/cms.ts) share one map.
// Keys are bundle slugs, values are the CMS post_name.
export const SLUG_ALIASES: Record<string, string> = {
  'etionment-pain-relief-cream': 'etioment-balm',
  'skin-well-food-supplement-capsules': 'skin-well-capsules',
  'flow-well-food-supplement-capsules': 'flow-well-capsules',
  'esnovate-immunity-boosting-capsules': 'esnovate-capsules',
  'sleep-well-food-supplement-capsules': 'sleep-well-capsules',
  'organics-hibiscus-tea-tin': 'hibiscus-tea-tin',
  'organics-herbo-protein-powder': 'herbo-protein-powder',
  'organics-laxahealth-tea-tin': 'laxa-health-tea-tin',
  'purna-sakthi-tonic': 'purna-sakthi',
  'ayur-raksha-superheal-o3-cream': 'ayurraksha-superheal-o3-cream',
  'ayur-raksha-skinwell-soap-pack-of-2': 'skinwell-soap-pack-of-2',
  'ayur-raksha-detox-tea': 'ayurraksha-detox-tea',
  'ayur-raksha-beta-powder': 'ayurraksha-beta-powder',
  'ayur-raksha-gargling-oil': 'ayurraksha-gargling-oil',
  'ayur-raksha-alg': 'ayurraksha-alg',
  'ayur-raksha-creat-capsules': 'ayurraksha-creat-capsules',
  'ayur-raksha-imu-360': 'ayurraksha-imu-360',
  'ayur-raksha-skin-conditioning-oil': 'ayurraksha-skin-conditioning-oil',
  'ayur-raksha-herbal-shampoo': 'ayurraksha-herbal-shampoo',
  'ayur-raksha-premium-high-fiber-health-mix': 'ayurraksha-premium-high-fiber-health-mix',
  'ayur-raksha-skin-well-food-moisturising-gel': 'ayurraksha-skin-well-food-moisturising-gel',
  'ayur-raksha-dant-swasthya': 'ayur-raksha-dant-swasthya',
  'ayur-raksha-foot-bath-powder': 'ayurraksha-foot-bath-powder-300g',
  'hair-well-food-supplement-capsules': 'ayurraksha-hair-well-food-supplement-capsules',
  'sp-soryn-cream': 'ayurraksha-sp-soryn-cream',
  'b-derma-capsules': 'ayurraksha-b-derma-capsules',
  'bpain-out-capsules': 'ayurraksha-bpain-out-capsules',
  'b-gasonil': 'b-gasonil-capsules',
};

// Catalog index by the bundled slug.
const productsBySlug = new Map(allProducts.map((p) => [p.slug, p]));

// Reverse index by the CMS post_name slug, so a URL addressed by the
// CMS-native slug (e.g. /product/ayurraksha-hair-well-.../) resolves to the
// same bundled Product as its storefront slug. Without this, CMS-native URLs
// 404 because generateStaticParams / getProductBySlug only knew the bundle.
const productsByCmsSlug = new Map<string, Product>();
for (const p of allProducts) {
  const cmsSlug = SLUG_ALIASES[p.slug] || p.slug;
  if (!productsByCmsSlug.has(cmsSlug)) productsByCmsSlug.set(cmsSlug, p);
}

/**
 * All slug shapes a Product is reachable at: every bundled slug plus its CMS
 * alias target (when it differs). Consumed by the PDP generateStaticParams so
 * both URL forms are pre-rendered and resolvable.
 */
export function getStaticParamSlugs(): string[] {
  const slugs = new Set<string>();
  for (const p of allProducts) {
    slugs.add(p.slug);
    const cmsSlug = SLUG_ALIASES[p.slug] || p.slug;
    if (cmsSlug !== p.slug) slugs.add(cmsSlug);
  }
  return Array.from(slugs);
}

export function getAllProducts(): Product[] {
  return allProducts;
}

// Resolve a slug to its Product. The bundled slug wins; a slug matching a CMS
// post_name (an alias target) falls back to the reverse index. Products whose
// bundle and CMS slugs agree resolve through either lookup, so this is a safe
// strict extension: it only widens which URLs 200, never redirects an existing
// one to a different product.
export function getProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  return productsBySlug.get(slug) ?? productsByCmsSlug.get(slug);
}

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

  const matched = allProducts.filter((p) =>
    p.healthConcerns.some((c) => {
      const cLower = c.toLowerCase();
      return searchTerms.some((term) => cLower.includes(term) || term.includes(cLower));
    })
  );

  // Guarantee required priority products appear first per client requirement
  if (normalizedSlug === 'liver-wellness') {
    const boozliv = matched.find((p) => p.slug === 'boozliv');
    if (boozliv) {
      return [boozliv, ...matched.filter((p) => p.slug !== 'boozliv')];
    }
  }

  if (normalizedSlug === 'skin-dermatology') {
    const divine = matched.find((p) => p.slug === 'divine-healing-oil');
    if (divine) {
      return [divine, ...matched.filter((p) => p.slug !== 'divine-healing-oil')];
    }
  }

  return matched;
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

export function getProductById(id: number): Product | undefined {
  return allProducts.find(product => product.id === id);
}
