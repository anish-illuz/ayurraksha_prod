import { Product, ProductAcf } from '@/types/product';
import { getAllProducts, SLUG_ALIASES } from './products';
import { matchRecommendedProducts } from './recommendedProducts';

const CMS_DOMAIN = 'https://cms.ayurrakshaonline.com';
const STORE_API = `${CMS_DOMAIN}/wp-json/wc/store/v1`;

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

/**
 * Live commerce fields for a PDP, fetched from the WordPress WooCommerce
 * Store API. Amounts are returned by the API in minor units (paise,
 * `currency_minor_unit`), so `price`/`regularPrice` here are in paise.
 */
export interface CmsVariantDetail {
  id: number;
  price: number;
  regularPrice: number;
  salePrice: number;
  onSale: boolean;
  inStock: boolean;
  variationLabel: string;
}

/**
 * Live commerce fields for a PDP, fetched from the WordPress WooCommerce
 * Store API. `price`/`regularPrice`/`salePrice` are in whole rupees.
 */
export interface CmsCommerceData {
  /** Woo product id (for order/Store API cart operations). */
  cmsProductId: number;
  price: number;
  regularPrice: number;
  salePrice: number;
  onSale: boolean;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  sku: string;
  images: string[];
  variantIds: number[];
  variantDetails: CmsVariantDetail[];
  /** Woo product type: 'simple', 'variable', 'grouped', 'external'. */
  type: string;
}

/** Parse a Store API price string (paise) into a number, 0 when absent. */
function parseStorePrice(value: unknown): number {
  const n = parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) ? n : 0;
}

async function fetchStoreProduct(slug: string): Promise<any | null> {
  try {
    const res = await fetch(`${STORE_API}/products?slug=${encodeURIComponent(slug)}&per_page=1`, {
      next: { revalidate: 60 },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return data[0];
  } catch {
    return null;
  }
}

/**
 * Fetch a single variation's live price/stock by its numeric variation id.
 * The Store API item route accepts variation ids directly, and variation
 * slugs are not queryable through the item collection.
 */
async function fetchStoreVariation(variationId: number): Promise<any | null> {
  try {
    const res = await fetch(`${STORE_API}/products/${variationId}`, {
      next: { revalidate: 60 },
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetch live commerce data for a PDP directly from the WordPress backend
 * (cms.ayurrakshaonline.com, WooCommerce Store API).
 *
 * The CMS is the single source of truth for product name, prices,
 * variations, images, stock and ratings. The bundled products.json values
 * are only used as an offline fallback when this fetch fails.
 */
export async function fetchCmsCommerce(slug: string): Promise<CmsCommerceData | null> {
  if (!slug) return null;

  const slugsToTry = [slug];
  const alias = SLUG_ALIASES[slug];
  if (alias && alias !== slug) slugsToTry.push(alias);

  for (const s of slugsToTry) {
    const p = await fetchStoreProduct(s);
    if (!p || typeof p !== 'object') continue;

    const prices = p.prices || {};
    const price = parseStorePrice(prices.price);
    const regularPrice = parseStorePrice(prices.regular_price) || price;
    const salePrice = parseStorePrice(prices.sale_price) || price;

    // Gallery: the CMS media library is the source of truth for product images.
    const images = Array.isArray(p.images)
      ? p.images.map((img: any) => img?.src).filter((u: string) => typeof u === 'string' && u.length > 0)
      : [];

    // Variations: list ids from the parent response, then hydrate each with
    // its own live price/stock so variant pricing and availability always
    // match the backend.
    const variantIds: number[] = Array.isArray(p.variations)
      ? p.variations.map((v: any) => Number(v?.id)).filter((n: number) => Number.isFinite(n) && n > 0)
      : [];

    const detailResults = await Promise.all(
      variantIds.map((vid) => fetchStoreVariation(vid).then((v: any | null) => v && typeof v === 'object' ? v : null))
    );

    // Per-variant price/stock/attributes for the PDP variant selector.
    // Prices are normalized to whole rupees (API returns paise), matching the
    // top-level commerce fields.
    const toRupees = (paise: number) => paise / 100;
    const variantDetails = detailResults.map((v: any, i: number) => {
      const vPrice = parseStorePrice(v?.prices?.price);
      const vRegular = parseStorePrice(v?.prices?.regular_price) || vPrice;
      const vSale = parseStorePrice(v?.prices?.sale_price) || vPrice;
      return {
        id: variantIds[i],
        price: toRupees(vPrice),
        regularPrice: toRupees(vRegular),
        salePrice: toRupees(vSale),
        onSale: Boolean(v?.on_sale),
        inStock: Boolean(v?.is_in_stock),
        // Variation-level label (e.g. "Packs: 30 Days Pack") for display.
        variationLabel: typeof v?.variation === 'string' && v.variation ? v.variation : '',
      };
    });

    return {
      cmsProductId: Number(p.id) || 0,
      price: price / 100,
      regularPrice: regularPrice / 100,
      salePrice: salePrice / 100,
      onSale: Boolean(p.on_sale),
      inStock: Boolean(p.is_in_stock),
      rating: Number(p.average_rating) || 0,
      reviewCount: Number(p.review_count) || 0,
      sku: typeof p.sku === 'string' ? p.sku : '',
      images,
      variantIds,
      variantDetails,
      type: typeof p.type === 'string' ? p.type : '',
    };
  }

  return null;
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
