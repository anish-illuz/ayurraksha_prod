import { NextRequest, NextResponse } from 'next/server';
import { fetchCmsCommerce } from '@/lib/cms';

/**
 * Review submission for the PDP "Write a review" form.
 *
 * Creates the review on the WordPress backend (cms.ayurrakshaonline.com)
 * through the authenticated WooCommerce REST API (wc/v3) - the same store
 * where the "Customer Reviews for WooCommerce" plugin persists reviews and
 * the PDP already reads its live review list. Created reviews come back
 * with status "approved", so the next PDP load shows them.
 *
 * Guards:
 *  - strict field validation (rating 1-5 required, name + review length);
 *  - in-memory throttles per visitor+product and per product so a single
 *    form cannot flood the backend;
 *  - duplicate rejection: the plugin stores one review row per
 *    reviewer+rating, so an existing same-name/same-rating row returns
 *    409 instead of creating a second copy.
 */

export const dynamic = 'force-dynamic';

const WORDPRESS_BASE =
  process.env.WORDPRESS_API_URL ||
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  'https://cms.ayurrakshaonline.com';

const THROTTLE_WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_VISITOR_PRODUCT = 3;
const MAX_PER_PRODUCT = 5;
const recentSubmissions = new Map<string, number[]>();

function allowSubmission(key: string, max: number): boolean {
  const now = Date.now();
  const kept = (recentSubmissions.get(key) || []).filter((t) => t > now - THROTTLE_WINDOW_MS);
  if (kept.length >= max) {
    recentSubmissions.set(key, kept);
    return false;
  }
  kept.push(now);
  recentSubmissions.set(key, kept);
  // Occasional sweep keeps the map bounded even under many distinct keys.
  if (recentSubmissions.size > 500) {
    Array.from(recentSubmissions.entries()).forEach(([k, ts]) => {
      if (!ts.length || ts[ts.length - 1] < now - THROTTLE_WINDOW_MS) recentSubmissions.delete(k);
    });
  }
  return true;
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for') || '';
  const first = fwd.split(',')[0]?.trim();
  return first || req.headers.get('cf-connecting-ip') || 'unknown';
}

export async function POST(req: NextRequest) {
  const wcKey = process.env.WC_CONSUMER_KEY || '';
  const wcSecret = process.env.WC_CONSUMER_SECRET || '';
  if (!wcKey || !wcSecret) {
    return NextResponse.json(
      { success: false, error: 'Reviews are currently unavailable. Please try again later.' },
      { status: 503 },
    );
  }

  let body: {
    productSlug?: string;
    rating?: number;
    reviewer?: string;
    review?: string;
    email?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 });
  }

  const slug = String(body.productSlug || '').trim().toLowerCase();
  const rating = Number(body.rating);
  const reviewer = String(body.reviewer || '').trim();
  const reviewText = String(body.review || '').trim();
  const email = String(body.email || '').trim();

  if (!slug) {
    return NextResponse.json({ success: false, error: 'Product is missing.' }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { success: false, error: 'Please select a star rating (1-5) before submitting.' },
      { status: 400 },
    );
  }
  if (reviewer.length < 2 || reviewer.length > 50) {
    return NextResponse.json(
      { success: false, error: 'Please enter your name (2-50 characters).' },
      { status: 400 },
    );
  }
  if (reviewText.length < 10 || reviewText.length > 2000) {
    return NextResponse.json(
      {
        success: false,
        error: 'Your review should be between 10 and 2,000 characters.',
      },
      { status: 400 },
    );
  }
  if (email.length > 0 && !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { success: false, error: 'Please enter a valid email address, or leave it blank.' },
      { status: 400 },
    );
  }

  const ip = clientIp(req);
  if (!allowSubmission(`visitor:${ip}|${slug}`, MAX_PER_VISITOR_PRODUCT)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many reviews submitted recently. Please come back in a while.',
      },
      { status: 429 },
    );
  }
  if (!allowSubmission(`product:${slug}`, MAX_PER_PRODUCT)) {
    return NextResponse.json(
      {
        success: false,
        error: 'This product is receiving a lot of reviews right now. Please try again shortly.',
      },
      { status: 429 },
    );
  }

  // Resolve the live WooCommerce id (CMS is the source of truth; bundled
  // slugs and CMS-native slugs both resolve through the alias table).
  const cms = await fetchCmsCommerce(slug);
  if (!cms || !cms.cmsProductId) {
    return NextResponse.json(
      { success: false, error: 'This product could not be found in the store.' },
      { status: 404 },
    );
  }

  const authHeaders: Record<string, string> = {
    Authorization: `Basic ${Buffer.from(`${wcKey}:${wcSecret}`).toString('base64')}`,
    Accept: 'application/json',
    'User-Agent': 'AyurRaksha-NextJS/1.0',
  };

  // Duplicate guard: the Customer Reviews plugin keeps one row per
  // reviewer + rating, so the same name re-submitting the same rating is a
  // duplicate, not a second review.
  try {
    const dupRes = await fetch(
      `${WORDPRESS_BASE}/wp-json/wc/v3/products/reviews?product=${cms.cmsProductId}&status=all&per_page=100`,
      { headers: authHeaders, cache: 'no-store' },
    );
    if (dupRes.ok) {
      const rows: unknown = await dupRes.json();
      if (
        Array.isArray(rows) &&
        rows.some(
          (r: any) =>
            String(r?.reviewer || '')
              .toLowerCase()
              .trim() === reviewer.toLowerCase() &&
            Number(r?.rating) === rating,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            duplicate: true,
            error:
              'You have already shared a review for this product at this rating. Thanks - no need to submit it again.',
          },
          { status: 409 },
        );
      }
    }
  } catch {
    // Duplicate check is best-effort; a failure must not block submission.
  }

  const createRes = await fetch(`${WORDPRESS_BASE}/wp-json/wc/v3/products/reviews`, {
    method: 'POST',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: cms.cmsProductId,
      reviewer,
      reviewer_email: email,
      rating,
      review: reviewText,
      status: 'approved',
    }),
    cache: 'no-store',
  });

  if (createRes.status === 201) {
    const created: any = await createRes.json().catch(() => ({}));
    return NextResponse.json({
      success: true,
      reviewId: Number(created?.id) || 0,
      reviewer,
      rating,
      message: 'Thank you! Your review has been published.',
    });
  }

  console.error(
    `Review create failed for ${slug} (${cms.cmsProductId}): HTTP ${createRes.status}`,
    (await createRes.text()).slice(0, 300),
  );
  return NextResponse.json(
    { success: false, error: 'We could not submit your review. Please try again later.' },
    { status: 502 },
  );
}
