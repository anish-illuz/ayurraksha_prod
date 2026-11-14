import { Product, ProductAcf } from '@/types/product';
import { getAllProducts, getProductBySlug, SLUG_ALIASES } from './products';
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
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categories: string[];
  categorySlugs: string[];
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

    const categories = Array.isArray(p.categories)
      ? p.categories.map((c: any) => (typeof c?.name === 'string' ? decodeHtmlEntities(c.name) : '')).filter(Boolean)
      : [];
    const categorySlugs = Array.isArray(p.categories)
      ? p.categories.map((c: any) => (typeof c?.slug === 'string' ? c.slug : '')).filter(Boolean)
      : [];

    return {
      cmsProductId: Number(p.id) || 0,
      name: typeof p.name === 'string' ? decodeHtmlEntities(p.name) : '',
      slug: typeof p.slug === 'string' ? p.slug : '',
      description: typeof p.description === 'string' ? p.description : '',
      shortDescription: typeof p.short_description === 'string' ? stripTags(p.short_description) : '',
      categories,
      categorySlugs,
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
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&nbsp;/g, ' ');
}

/**
 * Fetch a complete Product object directly from the WooCommerce + WordPress
 * backend at cms.ayurrakshaonline.com. No product content is hardcoded.
 *
 * Every field (name, pricing, variations, stock, rating, images, categories,
 * description, and all ACF content) is read from the live CMS. When at least
 * one CMS source loads, CMS values are used strictly and empty CMS fields stay
 * empty (the matching PDP section hides).
 *
 * The bundled products.json snapshot is only used as an offline resilience
 * fallback when BOTH CMS fetches fail, and only for the fields the CMS did
 * not return. Ingredient images are never fetched from the backend: the ACF
 * `ingredients` names are matched against the static botanical image library
 * (src/lib/ingredientImages.ts), the one element that is intentionally static.
 */
export async function fetchDynamicProduct(slug: string): Promise<Product | null> {
  if (!slug) return null;

  // Fetch ACF content and WooCommerce commerce in parallel, both from cms.ayurrakshaonline.com
  const [cmsData, cmsCommerce] = await Promise.all([
    fetchCmsProduct(slug),
    fetchCmsCommerce(slug),
  ]);

  const cmsLoaded = Boolean(cmsData || cmsCommerce);

  // Offline resilience only: when the CMS could not be reached at all, hand
  // back the bundled snapshot so a page can still render. This is NOT a content
  // source - every cmsLoaded=true path below reads strictly from the CMS.
  const baseProduct = cmsLoaded ? undefined : getProductBySlug(slug);
  if (!cmsLoaded && !baseProduct) return null;

  // Live WooCommerce variations from cms.ayurrakshaonline.com
  const liveVariants = cmsCommerce?.variantDetails?.map((v) => ({
    id: v.id,
    name: v.variationLabel.replace(/^Packs:\s*/i, '').trim() || `Variation ${v.id}`,
    slug: String(v.id),
    price: Number.isFinite(v.price) && v.price > 0 ? v.price : undefined,
    regularPrice: Number.isFinite(v.regularPrice) && v.regularPrice > 0 ? v.regularPrice : undefined,
    salePrice: Number.isFinite(v.salePrice) && v.salePrice > 0 ? v.salePrice : undefined,
    discountPercent:
      v.regularPrice > v.price
        ? Math.round(((v.regularPrice - v.price) / v.regularPrice) * 100)
        : 0,
    inStock: v.inStock,
  }));

  const price = cmsCommerce ? cmsCommerce.price : baseProduct?.price ?? 0;
  const regularPrice = cmsCommerce ? cmsCommerce.regularPrice : baseProduct?.regularPrice ?? price;
  const salePrice = cmsCommerce ? cmsCommerce.salePrice : baseProduct?.salePrice ?? price;
  const discountPercent =
    regularPrice > price
      ? Math.max(0, Math.round(((regularPrice - price) / (regularPrice || 1)) * 100))
      : (baseProduct?.discountPercent ?? 0);

  const rawAcf: ProductAcf = cmsData?.acf || {};

  const acf: ProductAcf = {
    key_benefits: (rawAcf.key_benefits || '').trim(),
    ingredients: (rawAcf.ingredients || '').trim(),
    how_to_use: (rawAcf.how_to_use || '').trim(),
    care_before_use: (rawAcf.care_before_use || '').trim(),
    product_specifications: (rawAcf.product_specifications || '').trim(),
    recommended_products: (rawAcf.recommended_products || '').trim(),
  };

  // ACF text drives the PDP sections. When the CMS loaded, only the CMS field
  // is used (an empty field stays empty so the section hides); only a fully
  // offline render falls back to the bundled snapshot text.
  const acfText = (field: keyof ProductAcf, bundled?: string): string => {
    const fromCms = (acf[field] as string) || '';
    if (fromCms.trim()) return fromCms;
    return cmsLoaded ? '' : (bundled || '');
  };

  // Construct the dynamic product strictly from cms.ayurrakshaonline.com
  const product: Product = {
    id: (cmsCommerce?.cmsProductId || cmsData?.id || baseProduct?.id) ?? 0,
    cmsProductId: cmsCommerce?.cmsProductId || cmsData?.id || baseProduct?.cmsProductId,
    name: cmsData?.title || cmsCommerce?.name || baseProduct?.name || '',
    slug: baseProduct?.slug || cmsCommerce?.slug || cmsData?.slug || slug,
    price,
    regularPrice,
    salePrice,
    discountPercent,
    onSale: cmsCommerce ? cmsCommerce.onSale : (baseProduct?.onSale ?? false),
    inStock: cmsCommerce ? cmsCommerce.inStock : (baseProduct?.inStock ?? true),
    rating: cmsCommerce && cmsCommerce.rating > 0 ? cmsCommerce.rating : (baseProduct?.rating ?? 0),
    reviewCount: cmsCommerce ? cmsCommerce.reviewCount : (baseProduct?.reviewCount ?? 0),
    sku: cmsCommerce?.sku || baseProduct?.sku || '',
    description: cmsData?.description || cmsCommerce?.description || baseProduct?.description || '',
    shortDescription: cmsData?.shortDescription || cmsCommerce?.shortDescription || baseProduct?.shortDescription || '',
    cleanDescription: stripTags(cmsData?.description || cmsCommerce?.description || baseProduct?.cleanDescription || ''),
    images: cmsCommerce && cmsCommerce.images.length > 0 ? cmsCommerce.images : baseProduct?.images ?? [],
    categories: cmsCommerce?.categories?.length ? cmsCommerce.categories : baseProduct?.categories ?? [],
    categorySlugs: cmsCommerce?.categorySlugs?.length ? cmsCommerce.categorySlugs : baseProduct?.categorySlugs ?? [],
    healthConcerns: cmsCommerce?.categories?.length ? cmsCommerce.categories : baseProduct?.healthConcerns ?? [],
    isBestseller: baseProduct?.isBestseller ?? false,
    variants: liveVariants && liveVariants.length > 0 ? liveVariants : baseProduct?.variants ?? [],

    // Dynamic WordPress ACF fields from cms.ayurrakshaonline.com
    acf,
    keyBenefits: acfText('key_benefits', baseProduct?.keyBenefits),
    ingredientsText: acfText('ingredients', baseProduct?.ingredientsText),
    howToUseText: acfText('how_to_use', baseProduct?.howToUseText),
    careBeforeUse: acfText('care_before_use', baseProduct?.careBeforeUse),
    productSpecifications: acfText('product_specifications', baseProduct?.productSpecifications),
    recommendedProductsText: acfText('recommended_products', baseProduct?.recommendedProductsText),

    cmsLoaded,

    // Marketing/snapshot copy ships only in the fully-offline path. When the
    // CMS is the source of truth these are intentionally left unset so the
    // PDP never surfaces stale bundled copy alongside live content.
    subtitle: cmsLoaded ? undefined : baseProduct?.subtitle,
    skuBadge: cmsLoaded ? undefined : baseProduct?.skuBadge,
    featuresBadge: cmsLoaded ? undefined : baseProduct?.featuresBadge,
    ingredientsSubtitle: cmsLoaded ? undefined : baseProduct?.ingredientsSubtitle,
    ritualSubtitle: cmsLoaded ? undefined : baseProduct?.ritualSubtitle,
    featureCards: cmsLoaded ? undefined : baseProduct?.featureCards,
    ingredientCards: cmsLoaded ? undefined : baseProduct?.ingredientCards,
    ritualSteps: cmsLoaded ? undefined : baseProduct?.ritualSteps,
    advisoryGuidelines: cmsLoaded ? undefined : baseProduct?.advisoryGuidelines,
    warnings: cmsLoaded ? undefined : baseProduct?.warnings,
    specNetQuantity: cmsLoaded ? undefined : baseProduct?.specNetQuantity,
    specProductForm: cmsLoaded ? undefined : baseProduct?.specProductForm,
    specOrigin: cmsLoaded ? undefined : baseProduct?.specOrigin,
    specDisclosures: cmsLoaded ? undefined : baseProduct?.specDisclosures,
  };

  return product;
}
