import { NextResponse } from 'next/server';
import { MASTER_COMBO_PRODUCTS } from '@/data/comboBuilderData';
import { ComboProduct } from '@/types/combo';

const WORDPRESS_BASE = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://cms.ayurrakshaonline.com';
const WORDPRESS_STORE_API = `${WORDPRESS_BASE}/wp-json/wc/store/v1`;

export const revalidate = 60; // Cache on server for 60 seconds

export async function GET() {
  try {
    // Fetch live product details from WooCommerce Store API for all 13 products
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const liveFetches = MASTER_COMBO_PRODUCTS.map(async (master) => {
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
          const livePriceRaw = liveItem.prices?.price;
          const liveRegRaw = liveItem.prices?.regular_price;

          const livePrice = typeof livePriceRaw === 'number' ? Math.round(livePriceRaw / 100) : master.price;
          const liveRegPrice = typeof liveRegRaw === 'number' ? Math.round(liveRegRaw / 100) : master.mrp;

          return {
            ...master,
            inStock: liveItem.is_in_stock ?? master.inStock,
            price: livePrice ?? master.price,
            mrp: liveRegPrice && liveRegPrice > (livePrice ?? 0) ? liveRegPrice : (master.mrp ?? livePrice),
          };
        }
      } catch {
        // Fallback to master product on timeout/network error
      }
      return master;
    });

    const normalizedProducts: ComboProduct[] = await Promise.all(liveFetches);
    clearTimeout(timeoutId);

    return NextResponse.json({
      success: true,
      products: normalizedProducts,
      totalCount: normalizedProducts.length,
      source: 'wordpress_live',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        products: MASTER_COMBO_PRODUCTS,
        totalCount: MASTER_COMBO_PRODUCTS.length,
        error: error.message || 'Failed to fetch live WordPress products',
        source: 'fallback',
      },
      { status: 200 }
    );
  }
}
