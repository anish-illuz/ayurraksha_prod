import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Permanent 301 redirects.
 *
 * These live in middleware (rather than `redirects()` in next.config.js)
 * because the project sets `trailingSlash: true`, which makes Next emit its
 * permanent config redirects as `308` (method-preserving) instead of the
 * literal `301` the client requested. Middleware runs before Next's built-in
 * trailing-slash normalizer, so we can return a true `301` ourselves and
 * match on both the with-slash and no-slash forms of each URL.
 *
 * Map: broken/legacy URL (no-trailing-slash) -> canonical destination.
 * Both `<key>` and `<key>/` resolve to the same 301.
 */
const REDIRECTS: Record<string, string> = {
  '/ayur-raksha-join-well-pack': '/combo-builder/varicose-veins/',
  '/flow-well-pack': '/combo-builder/cardiac-wellness/',
  '/skin-well-pack': '/combo-builder/skin-care/',
  '/skin-well-food-supplement-capsules': '/product/skin-well-food-supplement-capsules/',
  '/boozliv-liver-tonic-for-fatty-liver': '/product/boozliv/',
  '/boozliv': '/product/boozliv/',
  // Trashed in the CMS backend: the PDPs no longer resolve, so send any
  // indexed/linked URL for the removed products to the shop page.
  '/product/ayur-raksha-beta-powder': '/shop/',
  '/product/ayurraksha-beta-powder': '/shop/',
  '/product/ayur-raksha-premium-high-fiber-health-mix': '/shop/',
  '/product/ayurraksha-premium-high-fiber-health-mix': '/shop/',
  '/product/pi-well-food-supplement-capsules': '/shop/',
  '/product/organics-laxahealth-tea-tin': '/shop/',
  '/product/dhayani-herbal-hair-oil-100ml': '/shop/',
  '/product/organics-herbo-protein-powder': '/shop/',
  '/product/organics-hibiscus-tea-tin': '/shop/',
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const key = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
  const destination = REDIRECTS[key];
  if (destination) {
    return NextResponse.redirect(new URL(destination, req.nextUrl.origin), 301);
  }
  return NextResponse.next();
}

export const config = {
  // Only run on the redirected paths; keep the hot path untouched.
  // Both the with-slash and no-slash form of each URL are listed so the
  // 301 fires on either, before Next's trailing-slash normalizer (308).
  matcher: [
    '/ayur-raksha-join-well-pack',
    '/ayur-raksha-join-well-pack/',
    '/flow-well-pack',
    '/flow-well-pack/',
    '/skin-well-pack',
    '/skin-well-pack/',
    '/skin-well-food-supplement-capsules',
    '/skin-well-food-supplement-capsules/',
    '/boozliv-liver-tonic-for-fatty-liver',
    '/boozliv-liver-tonic-for-fatty-liver/',
    '/boozliv',
    '/boozliv/',
    '/product/ayur-raksha-beta-powder',
    '/product/ayur-raksha-beta-powder/',
    '/product/ayurraksha-beta-powder',
    '/product/ayurraksha-beta-powder/',
    '/product/ayur-raksha-premium-high-fiber-health-mix',
    '/product/ayur-raksha-premium-high-fiber-health-mix/',
    '/product/ayurraksha-premium-high-fiber-health-mix',
    '/product/ayurraksha-premium-high-fiber-health-mix/',
    '/product/pi-well-food-supplement-capsules',
    '/product/pi-well-food-supplement-capsules/',
    '/product/organics-laxahealth-tea-tin',
    '/product/organics-laxahealth-tea-tin/',
    '/product/dhayani-herbal-hair-oil-100ml',
    '/product/dhayani-herbal-hair-oil-100ml/',
    '/product/organics-herbo-protein-powder',
    '/product/organics-herbo-protein-powder/',
    '/product/organics-hibiscus-tea-tin',
    '/product/organics-hibiscus-tea-tin/',
  ],
};
