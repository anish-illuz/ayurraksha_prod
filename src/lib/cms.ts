import { Product, ProductAcf } from '@/types/product';
import { getAllProducts, SLUG_ALIASES } from './products';
import { matchRecommendedProducts } from './recommendedProducts';

const CMS_DOMAIN = 'https://cms.ayurrakshaonline.com';

// SLUG_ALIASES (bundle slug -> CMS post_name) lives in lib/products.ts so
// catalog slug resolution and CMS content fetching share one authoritative
// table. Re-exported here for any existing importer of lib/cms.
export { SLUG_ALIASES };

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
 * Resolve recommended products strictly from the WordPress ACF
 * `recommended_products` field.
 *
 * The ACF field is the single source of truth: only the products explicitly
 * selected there are returned. No related, similar, bestseller, category or
 * tag based fallback is ever applied. When the field is empty - or nothing in
 * it resolves to a catalog product - an empty list is returned and the PDP
 * hides the entire Recommended Products section.
 */
export function resolveRecommendedProducts(
  recommendedText: string | undefined,
  currentProduct: Product,
  limit = 4
): Product[] {
  return matchRecommendedProducts(recommendedText, getAllProducts(), currentProduct, limit);
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
