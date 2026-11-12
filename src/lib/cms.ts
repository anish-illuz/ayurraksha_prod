import { Product, ProductAcf } from '@/types/product';
import { getAllProducts, getRelatedProducts } from '@/lib/products';

const CMS_DOMAIN = 'https://cms.ayurrakshaonline.com';

// Slug aliases between frontend storefront slugs and WordPress CMS post_name slugs
export const SLUG_ALIASES: Record<string, string> = {
  'etionment-pain-relief-cream': 'etioment-balm',
  'skin-well-food-supplement-capsules': 'skin-well-capsules',
  'flow-well-food-supplement-capsules': 'flow-well-capsules',
  'esnovate-immunity-boosting-capsules': 'esnovate-capsules',
  'sleep-well-food-supplement-capsules': 'sleep-well-capsules',
  'organics-hibiscus-tea-tin': 'hibiscus-tea-tin',
  'organics-herbo-protein-powder': 'herbo-protein-powder',
  'organics-laxahealth-tea-tin': 'laxa-health-tea',
  'ayur-raksha-superheal-o3-cream': 'ayurraksha-superheal-o3-cream',
  'ayur-raksha-skinwell-soap-pack-of-2': 'ayurraksha-skinwell-soap',
  'ayurraksha-skinwell-soap-pack-of-2': 'ayurraksha-skinwell-soap',
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
};

export interface CmsProductResponse {
  id: number;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  acf: ProductAcf;
}

/**
 * Fetch dynamic product data and ACF fields directly from WordPress backend
 * Endpoint: cms.ayurrakshaonline.com/wp-json/wp/v2/product?slug={slug}
 */
export async function fetchCmsProduct(slug: string): Promise<CmsProductResponse | null> {
  if (!slug) return null;

  const slugsToTry = [slug];
  const alias = SLUG_ALIASES[slug];
  if (alias && alias !== slug) {
    slugsToTry.push(alias);
  }

  for (const s of slugsToTry) {
    try {
      const url = `${CMS_DOMAIN}/wp-json/wp/v2/product?slug=${encodeURIComponent(s)}&_fields=id,slug,title,content,excerpt,acf`;
      const res = await fetch(url, {
        next: { revalidate: 60 },
        headers: {
          Accept: 'application/json',
        },
      });

      if (!res.ok) continue;

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) continue;

      const item = data[0];
      const rawAcf: ProductAcf = item.acf || {};

      return {
        id: item.id,
        slug: item.slug,
        title: item.title?.rendered ? decodeHtmlEntities(item.title.rendered) : '',
        description: item.content?.rendered || '',
        shortDescription: item.excerpt?.rendered ? stripTags(item.excerpt.rendered) : '',
        acf: {
          key_benefits: (rawAcf.key_benefits || '').trim(),
          ingredients: (rawAcf.ingredients || '').trim(),
          how_to_use: (rawAcf.how_to_use || '').trim(),
          care_before_use: (rawAcf.care_before_use || '').trim(),
          product_specifications: (rawAcf.product_specifications || '').trim(),
          recommended_products: (rawAcf.recommended_products || '').trim(),
        },
      };
    } catch (err) {
      console.error(`Error querying CMS for slug "${s}":`, err);
    }
  }

  return null;
}

/**
 * Resolve recommended products from the WordPress ACF `recommended_products` field.
 * Matches product names against the active catalog.
 */
export function resolveRecommendedProducts(
  recommendedText: string | undefined,
  currentProduct: Product,
  limit = 4
): Product[] {
  const all = getAllProducts();
  if (!recommendedText || !recommendedText.trim()) {
    return getRelatedProducts(currentProduct, limit);
  }

  // Split by newlines, commas, or common separators
  const rawTerms = recommendedText
    .split(/[\r\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const matched: Product[] = [];
  const matchedIds = new Set<number>([currentProduct.id]);

  for (const term of rawTerms) {
    const termClean = term.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
    if (!termClean) continue;

    // 1. Direct match
    const exact = all.find(
      (p) =>
        !matchedIds.has(p.id) &&
        (p.name.toLowerCase() === termClean ||
          p.slug.toLowerCase() === termClean ||
          p.name.toLowerCase().includes(termClean) ||
          termClean.includes(p.name.toLowerCase()))
    );

    if (exact) {
      matched.push(exact);
      matchedIds.add(exact.id);
      if (matched.length >= limit) break;
      continue;
    }

    // 2. Token overlap match (e.g. "BoozLiv", "Hibiscus Tea", "Detox Tea")
    const words = termClean.split(/\s+/).filter((w) => w.length > 3);
    if (words.length > 0) {
      const partial = all.find((p) => {
        if (matchedIds.has(p.id)) return false;
        const pName = p.name.toLowerCase();
        return words.filter((w) => pName.includes(w)).length >= Math.min(2, words.length);
      });
      if (partial) {
        matched.push(partial);
        matchedIds.add(partial.id);
        if (matched.length >= limit) break;
      }
    }
  }

  if (matched.length > 0) {
    if (matched.length < limit) {
      const fallbackRelated = getRelatedProducts(currentProduct, limit - matched.length).filter(
        (p) => !matchedIds.has(p.id)
      );
      return [...matched, ...fallbackRelated];
    }
    return matched.slice(0, limit);
  }

  return getRelatedProducts(currentProduct, limit);
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ');
}
