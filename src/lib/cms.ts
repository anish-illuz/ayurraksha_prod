import { Product, ProductAcf } from '@/types/product';
import { getAllProducts } from './products';
import { matchRecommendedProducts } from './recommendedProducts';

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
  'organics-laxahealth-tea-tin': 'laxa-health-tea-tin',
  'purna-sakthi-tonic': 'purna-sakthi',
  'ayur-raksha-superheal-o3-cream': 'ayurraksha-superheal-o3-cream',
  'ayur-raksha-skinwell-soap-pack-of-2': 'skinwell-soap-pack-of-2',
  'ayurraksha-skinwell-soap-pack-of-2': 'skinwell-soap-pack-of-2',
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
