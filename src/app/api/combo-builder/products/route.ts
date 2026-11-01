import { NextResponse } from 'next/server';
import { ALL_STORE_COMBO_PRODUCTS, CORE_13_COMBO_PRODUCTS } from '@/data/comboBuilderData';
import { ComboProduct } from '@/types/combo';

const WORDPRESS_STORE_API = 'https://cms.ayurrakshaonline.com/wp-json/wc/store/v1';

export const revalidate = 60; // Cache on server for 60 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope'); // 'all' or 'flagship'
    const baseProducts = scope === 'all' ? ALL_STORE_COMBO_PRODUCTS : CORE_13_COMBO_PRODUCTS;

    // Attempt to fetch live stock & prices from WooCommerce Store API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

    let liveProductsMap: Record<number, any> = {};

    try {
      const res = await fetch(`${WORDPRESS_STORE_API}/products?per_page=100`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'AyurRaksha-ComboBuilder/2.0',
          'Accept': 'application/json',
        },
        next: { revalidate: 60 },
      });

      if (res.ok) {
        const liveList = await res.json();
        if (Array.isArray(liveList)) {
          liveList.forEach((item: any) => {
            liveProductsMap[item.id] = item;
          });
        }
      }
    } catch {
      // Gracefully fall back to master catalogue if CMS is temporarily unreachable
    } finally {
      clearTimeout(timeoutId);
    }

    // Merge live data with master catalogue
    const normalizedProducts: ComboProduct[] = baseProducts.map((master) => {
      const liveItem = liveProductsMap[master.cmsId];

      if (!liveItem) {
        return master;
      }

      // Respect Developer Brief pricing rules:
      // - SP Soryn price is explicitly pending (do not un-pend without management approval)
      if (master.pricePending) {
        return {
          ...master,
          inStock: liveItem.is_in_stock ?? master.inStock,
        };
      }

      // Check live price in paise
      const livePriceRaw = liveItem.prices?.price;
      const livePrice = typeof livePriceRaw === 'number' ? Math.round(livePriceRaw / 100) : master.price;

      return {
        ...master,
        inStock: liveItem.is_in_stock ?? master.inStock,
        price: livePrice ?? master.price,
      };
    });

    return NextResponse.json({
      success: true,
      products: normalizedProducts,
      totalCount: normalizedProducts.length,
      source: Object.keys(liveProductsMap).length > 0 ? 'wordpress_live' : 'master_cache',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        products: CORE_13_COMBO_PRODUCTS,
        error: error.message || 'Failed to fetch live products',
        source: 'fallback',
      },
      { status: 200 }
    );
  }
}
