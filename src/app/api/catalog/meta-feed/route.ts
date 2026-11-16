import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/products';
import { getCmsProductId, getMpn, CMS_PRODUCT_ID_MAP } from '@/lib/metaProductMap';
import { Product } from '@/types/product';

const WORDPRESS_BASE =
  process.env.WORDPRESS_API_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  'https://cms.ayurrakshaonline.com';

const PRODUCTION_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://ayurrakshaonline.com';

// Clean domain string without trailing slash
const BASE_DOMAIN = PRODUCTION_SITE_URL.replace(/\/+$/, '');

// Every request regenerates the feed from the live WooCommerce data so
// backend updates propagate immediately.
export const dynamic = 'force-dynamic';

function escapeXml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Meta ad-policy scrubber. The feed descriptions are pulled verbatim from the
 * WooCommerce short descriptions; a few carry efficacy-superlative claims
 * ("clinically proven") that are the likeliest disapproval trigger for a
 * supplement catalog. This strips the flagged phrase family from feed-only
 * copy (it does NOT touch the live PDP description on the storefront).
 */
function scrubPolicyRiskClaims(text: string): string {
  if (!text) return text;
  return text
    .replace(/\bclinically (?:proven|studied|verified|tested|demonstrated)\b/gi, 'backed by')
    .replace(/\bclinically\b/gi, '')
    .replace(/\bguaranteed (?:results?|cure|recovery|weight ?loss|success)\b/gi, '')
    .replace(/\b(cure|cures|cured)\b/gi, 'support')
    .replace(/\b(reverse|reverses|reversing) (?:fatty liver|cirrhosis|jaundice|disease|aging)\b/gi, 'support healthy')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function ensureAbsoluteImageUrl(url: string | null | undefined): string {
  if (!url) return `${BASE_DOMAIN}/images/logo.png`;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `${BASE_DOMAIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

/**
 * The WooCommerce Store API returns prices as paise STRINGS (e.g. "99900"),
 * not numbers. Coerce to whole-rupee numbers; 0 when the value is absent or
 * not a positive amount. A wrong `typeof` check here previously made every
 * live catalogue item emit 0.00 INR.
 */
function parsePaiseToRupees(value: unknown): number {
  const n = Math.round(Number(value) / 100);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export async function GET() {
  try {
    let feedItems: Array<{
      id: string;
      title: string;
      description: string;
      link: string;
      imageLink: string;
      additionalImages: string[];
      availability: 'in stock' | 'out of stock';
      price: number;
      salePrice?: number;
      brand: string;
      mpn: string;
      category: string;
      productType: string;
    }> = [];

    // Attempt 1: Fetch live products directly from WooCommerce Store API
    try {
      const res = await fetch(`${WORDPRESS_BASE}/wp-json/wc/store/v1/products?per_page=100`, {
        headers: {
          'User-Agent': 'AyurRaksha-MetaCatalogFeed/2.0',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });

      if (res.ok) {
        const wcProducts = await res.json();
        if (Array.isArray(wcProducts) && wcProducts.length > 0) {
          feedItems = wcProducts.map((p: any) => {
            const slug = p.slug;
            // Canonical CMS product ID shared by the catalog, Meta Pixel and
            // CAPI, so events and catalog items reconcile by g:id.
            const id = getCmsProductId({ id: p.id, slug });
            // Store API prices are paise strings - coerce properly so live
            // items never emit 0.00 INR.
            const priceInRupees = parsePaiseToRupees(p.prices?.price);
            const regPriceInRupees = parsePaiseToRupees(p.prices?.regular_price) || priceInRupees;
            const salePriceInRupees = p.prices?.sale_price
              ? parsePaiseToRupees(p.prices.sale_price)
              : undefined;

            const primaryImage = p.images?.[0]?.src || '';
            const additional = (p.images || []).slice(1).map((img: any) => img.src).filter(Boolean);

            const categoryName = p.categories?.[0]?.name || 'Ayurvedic Wellness';
            const cleanDesc = scrubPolicyRiskClaims(
              stripHtml(p.short_description || p.description || p.name)
            );

            return {
              id,
              title: p.name,
              description: cleanDesc.slice(0, 5000),
              link: `${BASE_DOMAIN}/product/${slug}/`,
              imageLink: ensureAbsoluteImageUrl(primaryImage),
              additionalImages: additional.map((img: string) => ensureAbsoluteImageUrl(img)),
              availability: p.is_in_stock ? 'in stock' : 'out of stock',
              price: regPriceInRupees > priceInRupees ? regPriceInRupees : priceInRupees,
              salePrice: salePriceInRupees || (regPriceInRupees > priceInRupees ? priceInRupees : undefined),
              brand: 'AyurRaksha',
              mpn: getMpn({ slug, sku: p.sku }),
              category: 'Health & Beauty > Health Care > Alternative Medicine',
              productType: categoryName,
            };
          });
        }
      }
    } catch (wcErr) {
      console.warn('Failed to fetch from WooCommerce Store API, falling back to local canonical products:', wcErr);
    }

    // Fallback: If WooCommerce returned empty or failed, use canonical products.json
    if (!feedItems.length) {
      const allLocal = getAllProducts();
      feedItems = allLocal.map((p: Product) => {
        const id = getCmsProductId(p);
        const cleanDesc = scrubPolicyRiskClaims(
          stripHtml(p.cleanDescription || p.shortDescription || p.description)
        );
        const primaryImage = p.images[0] || '';
        const additional = p.images.slice(1);
        const categoryName = p.healthConcerns[0] || p.categories[0] || 'Ayurvedic Wellness';

        return {
          id,
          title: p.name,
          description: cleanDesc.slice(0, 5000),
          link: `${BASE_DOMAIN}/product/${p.slug}/`,
          imageLink: ensureAbsoluteImageUrl(primaryImage),
          additionalImages: additional.map((img) => ensureAbsoluteImageUrl(img)),
          availability: p.inStock ? 'in stock' : 'out of stock',
          price: p.regularPrice > p.price ? p.regularPrice : p.price,
          salePrice: p.regularPrice > p.price ? p.price : undefined,
          brand: 'AyurRaksha',
          mpn: getMpn({ slug: p.slug, sku: p.sku }),
          category: 'Health & Beauty > Health Care > Alternative Medicine',
          productType: categoryName,
        };
      });
    }

    // Build standard Meta / Google Merchant Center RSS 2.0 XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>AyurRaksha Meta Ecommerce Product Catalogue</title>
    <link>${escapeXml(BASE_DOMAIN)}</link>
    <description>Authentic classical Ayurvedic wellness supplements and tonics by AyurRaksha.</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${feedItems
  .map(
    (item) => `    <item>
      <g:id>${escapeXml(item.id)}</g:id>
      <g:title><![CDATA[${item.title}]]></g:title>
      <g:description><![CDATA[${item.description}]]></g:description>
      <g:link>${escapeXml(item.link)}</g:link>
      <g:image_link>${escapeXml(item.imageLink)}</g:image_link>
${item.additionalImages
  .slice(0, 5)
  .map((img) => `      <g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`)
  .join('\n')}
      <g:availability>${item.availability}</g:availability>
      <g:price>${item.price}.00 INR</g:price>
${item.salePrice && item.salePrice < item.price ? `      <g:sale_price>${item.salePrice}.00 INR</g:sale_price>` : ''}
      <g:condition>new</g:condition>
      <g:brand>${escapeXml(item.brand)}</g:brand>
      <g:mpn>${escapeXml(item.mpn)}</g:mpn>
      <g:google_product_category>${escapeXml(item.category)}</g:google_product_category>
      <g:product_type>${escapeXml(item.productType)}</g:product_type>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (error: any) {
    console.error('Error generating Meta Product Catalog feed:', error);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><error>${escapeXml(error.message || 'Server Error')}</error>`,
      { status: 500, headers: { 'Content-Type': 'application/xml' } }
    );
  }
}
