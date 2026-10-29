import { NextResponse } from 'next/server';

const WORDPRESS_BASE = 'https://www.ayurrakshaonline.com';
const FALLBACK_RAZORPAY_KEY = 'rzp_live_kWyXoOFkrDjUBk';
const FALLBACK_NAME = 'AyurRaksha';
const FALLBACK_CURRENCY = 'INR';

export async function GET() {
  try {
    const res = await fetch(`${WORDPRESS_BASE}/wp-json/1cc/v1/cart/fetch-cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AyurRaksha-NextJS-Client/1.0',
      },
      body: JSON.stringify({}),
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      throw new Error(`WordPress returned ${res.status}`);
    }

    const data = await res.json();

    const key = data.key || FALLBACK_RAZORPAY_KEY;
    const name = data.name || FALLBACK_NAME;
    const currency = data.currency || FALLBACK_CURRENCY;

    return NextResponse.json({
      success: true,
      key,
      name,
      currency,
      source: 'wordpress_backend',
    });
  } catch (error) {
    console.error('Failed to fetch Razorpay config from WordPress:', error);
    // Graceful fallback to verified live credentials so user checkout is never interrupted
    return NextResponse.json({
      success: true,
      key: FALLBACK_RAZORPAY_KEY,
      name: FALLBACK_NAME,
      currency: FALLBACK_CURRENCY,
      source: 'fallback',
    });
  }
}
