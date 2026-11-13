import { NextResponse } from 'next/server';
import { getComboConfig } from '@/data/comboBuilderData';
import { ComboProduct } from '@/types/combo';

const WORDPRESS_BASE = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://cms.ayurrakshaonline.com';
const WORDPRESS_STORE_API = `${WORDPRESS_BASE}/wp-json/wc/store/v1`;

export const revalidate = 60; // Cache on server for 60 seconds

// Parse a WooCommerce Store API price (minor units / paise, returned as a
// string) into whole rupees. Returns 0 when the value is missing or invalid.
function toRupees(value: unknown): number {
  const n = parseInt(String(value ?? ''), 10);
  return Number.isFinite(n) ? n / 100 : 0;
}

/**
 * Live commerce fields for every product in a given combo builder, fetched
 * from the WordPress WooCommerce Store API (cms.ayurrakshaonline.com). The CMS
 * is the single source of truth for price, MRP and stock: the bundled
 * comboBuilderData values are only returned as an offline fallback.
 *
 * Accepts `?slug=<builder-slug>` (default: skin-care). All four combo builder
 * slugs are supported so every builder shows backend prices.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || 'skin-care';
  const config = getComboConfig(slug) ?? getComboConfig('skin-care');
  const masterProducts = config!.products;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const liveFetches = masterProducts.map(async (master) => {
      try {
        const res = await fetch(`${WORDPRESS_STORE_API}/products/${master.cmsId}`, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'AyurRaksha-ComboBuilder/2.0',
            'Accept': 'application/json',
          },
          next: { revalidate: 60 },
        });

        if (res.ok) {
          const liveItem = await res.json();
          const livePrice = toRupees(liveItem.prices?.price);
          const liveRegPrice = toRupees(liveItem.prices?.regular_price);

          const price = livePrice > 0 ? livePrice : master.price;
          // Only surface a live MRP when it is valid and genuinely above the
          // selling price; otherwise keep the bundled MRP (or the price).
          const mrp = liveRegPrice > 0 && liveRegPrice > (livePrice || 0)
            ? liveRegPrice
            : master.mrp ?? price;

          return {
            ...master,
            inStock: liveItem.is_in_stock ?? master.inStock,
            price,
            mrp,
            pricePending: false,
          } as ComboProduct;
        }
      } catch {
        // Fallback to the bundled master product on timeout/network error.
      }
      return master;
    });

    const normalizedProducts: ComboProduct[] = await Promise.all(liveFetches);
    clearTimeout(timeoutId);

    return NextResponse.json({
      success: true,
      slug,
      products: normalizedProducts,
      totalCount: normalizedProducts.length,
      source: 'wordpress_live',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        slug,
        products: masterProducts,
        totalCount: masterProducts.length,
        error: error.message || 'Failed to fetch live WordPress products',
        source: 'fallback',
      },
      { status: 200 }
    );
  }
}
