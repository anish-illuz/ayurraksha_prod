import { NextRequest, NextResponse } from 'next/server';
import { fetchLiveCatalogProducts } from '@/lib/cms';
import { searchProductsEnhanced } from '@/lib/search';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({
      query: '',
      hasExactMatch: false,
      results: [],
      suggestedAlternatives: [],
    });
  }

  try {
    // Fetch live products dynamically from WooCommerce CMS
    const products = await fetchLiveCatalogProducts();
    const searchResponse = searchProductsEnhanced(q, products);

    return NextResponse.json(searchResponse, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (err) {
    console.error('Search API error:', err);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
