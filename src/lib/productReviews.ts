/**
 * Live product reviews for the PDP, sourced from the WordPress backend at
 * cms.ayurrakshaonline.com.
 *
 * The "Customer Reviews for WooCommerce" plugin stores its reviews as
 * standard WooCommerce product reviews, so they are readable through the
 * authenticated WooCommerce REST API (wc/v3) that the order-creation route
 * already uses. The public Store API's /products/reviews collection cannot
 * be filtered by product, so per-product review lists come from
 * wc/v3/products/reviews?product=<id>.
 *
 * No PII is forwarded to the client: only the reviewer display name, rating,
 * verified flag, cleaned review text, display date and avatar URL.
 */

const WORDPRESS_BASE = process.env.WORDPRESS_API_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://cms.ayurrakshaonline.com';

export interface PdpReview {
  id: number;
  reviewer: string;
  rating: number; // 0 = unrated
  verified: boolean;
  review: string; // clean text, HTML-stripped
  date: string; // e.g. "12 Apr 2026"
  avatar?: string;
}

function decodeEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'" /* opening quote */)
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&nbsp;/g, ' ');
}

/** Strip HTML tags + decode entities into plain, single-spaced text. */
export function cleanReviewText(html: string): string {
  const s = decodeEntities(html || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return s;
}

/** Format a UTC or local ISO-ish string into a readable date (IST). */
function formatDate(gmt: string, local: string): string {
  const iso = gmt || local;
  if (!iso) return '';
  // WC API date fields are naive local/GMT strings without a zone marker.
  const asUTC = /Z$|[+-]\d{2}:?\d{2}$/.test(iso) ? iso : iso + 'Z';
  const d = new Date(asUTC);
  if (Number.isNaN(d.getTime())) return '';
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    }).format(d);
  } catch {
    return '';
  }
}

/**
 * Map one raw wc/v3 review object into a client-safe PdpReview.
 * Returns null when the row has neither text nor a reviewer name.
 * Exported for unit testing.
 */
export function mapReview(raw: unknown): PdpReview | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const text = cleanReviewText(String(r.review ?? ''));
  const reviewer = String(r.reviewer ?? '').trim();
  if (!text && !reviewer) return null;

  const rating = Number(r.rating);
  const avatar =
    r.reviewer_avatar_urls && typeof r.reviewer_avatar_urls === 'object'
      ? (r.reviewer_avatar_urls as Record<string, string>)['96'] ||
        (r.reviewer_avatar_urls as Record<string, string>)['48']
      : undefined;

  return {
    id: Number(r.id) || 0,
    reviewer: reviewer || 'Verified Customer',
    rating: Number.isFinite(rating) && rating > 0 ? Math.min(5, Math.round(rating)) : 0,
    verified: r.verified === true,
    review: text,
    date: formatDate(String(r.date_created_gmt ?? ''), String(r.date_created ?? '')),
    avatar: typeof avatar === 'string' && avatar ? avatar : undefined,
  };
}

/**
 * Review texts the CMS may repeat verbatim at several ratings for the same
 * reviewer (one review row per rating variant). Deduplicate by text,
 * keeping the highest-rated row of each, in original (most-recent-first)
 * order. Exported for unit testing.
 */
export function dedupeReviews(reviews: PdpReview[], limit = 6): PdpReview[] {
  const byText = new Map<string, PdpReview>();
  for (const r of reviews) {
    const key = r.review.trim() || `reviewer:${r.reviewer}:${r.id}`;
    const prev = byText.get(key);
    if (!prev || r.rating > prev.rating) byText.set(key, r);
  }
  return Array.from(byText.values()).slice(0, limit);
}

// Per-process caches keep PDP loads fast and stop re-hitting the CMS for
// review-less products (they re-check after the TTL, so newly posted reviews
// still surface quickly).
const noReviewsCache = new Map<number, number>();
const NO_REVIEWS_TTL_MS = 5 * 60 * 1000;

/**
 * Fetch the most recent approved, deduplicated reviews for a WooCommerce
 * product from cms.ayurrakshaonline.com. Returns [] on any failure (missing
 * credentials, network error, non-200) so the PDP simply falls back to its
 * curated testimonials instead of failing the page. The raw backend list is
 * deduplicated (duplicate texts keep their highest rating) and capped at
 * `limit` before returning.
 */
export async function fetchCmsProductReviews(productId: number, limit = 6): Promise<PdpReview[]> {
  if (!Number.isInteger(productId) || productId <= 0) return [];
  const key = process.env.WC_CONSUMER_KEY || '';
  const secret = process.env.WC_CONSUMER_SECRET || '';
  if (!key || !secret) return [];

  const cachedNoReviews = noReviewsCache.get(productId);
  if (cachedNoReviews !== undefined && Date.now() - cachedNoReviews < NO_REVIEWS_TTL_MS) {
    return [];
  }

  try {
    // Pull a wider window so post-deduplication the PDP still has enough
    // distinct recent reviews.
    const perPage = Math.min(50, Math.max(limit * 2, 10));
    const url =
      `${WORDPRESS_BASE}/wp-json/wc/v3/products/reviews` +
      `?product=${encodeURIComponent(String(productId))}` +
      `&per_page=${perPage}&status=approve&orderby=date_gmt&order=desc`;
    const res = await fetch(url, {
      // Reviews are low-churn; data-cache keeps PDP loads fast while new
      // backend reviews still surface within minutes.
      cache: 'no-store',
      next: { revalidate: 300 },
      headers: {
        Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`,
        Accept: 'application/json',
        'User-Agent': 'AyurRaksha-NextJS/1.0',
      },
    });
    if (!res.ok) return [];
    const data: unknown = await res.json();
    const rows = Array.isArray(data)
      ? data.map(mapReview).filter((r): r is PdpReview => r !== null)
      : [];
    const deduped = dedupeReviews(rows, limit);
    noReviewsCache.set(productId, Date.now());
    if (deduped.length === 0) noReviewsCache.set(productId, Date.now());
    return deduped;
  } catch {
    return [];
  }
}
