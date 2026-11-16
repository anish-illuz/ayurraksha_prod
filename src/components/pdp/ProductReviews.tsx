'use client';

import React from 'react';
import { Star, ShieldCheck, MapPin } from 'lucide-react';
import { Product } from '@/types/product';
import { VERIFIED_REVIEWS } from '@/data/reviews';

interface ProductReviewsProps {
  product: Product;
}

/**
 * Customer reviews for the PDP. The star aggregate (rating + review count) is
 * the live WooCommerce average from cms.ayurrakshaonline.com (product.rating /
 * product.reviewCount), never a bundled value. The individual verified review
 * cards are the curated customer testimonials matching this product's slug.
 * The whole section hides when the backend reports no reviews.
 */
export const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const reviews = VERIFIED_REVIEWS.filter((r) => r.productSlug === product.slug);
  const rating = product.rating || 0;
  const reviewCount = product.reviewCount || 0;

  // No backend reviews and no curated cards: nothing to show.
  if (reviewCount <= 0 && reviews.length === 0) return null;

  const displayRating = rating > 0 ? rating : reviews.length > 0 ? 5 : 0;

  return (
    <section
      aria-label="Customer Reviews"
      className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl bg-white border border-stone-200/90 shadow-2xs overflow-hidden"
    >
      <div className="p-5 sm:p-7">
        {/* Header: live WooCommerce aggregate from the CMS */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 sm:pb-5 border-b border-stone-100">
          <div>
            <span className="text-[11px] font-semibold text-botanical uppercase tracking-wider block mb-1">
              Customer Reviews
            </span>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-forest leading-snug">
              What our customers say
            </h2>
          </div>

          {/* Live aggregate rating - from cms.ayurrakshaonline.com */}
          {reviewCount > 0 ? (
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-bold text-forest leading-none">
                    {displayRating.toFixed(1)}
                  </span>
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={15}
                        className={i <= Math.round(displayRating) ? 'fill-current' : 'text-stone-300'}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-stone-500">
                  {reviewCount.toLocaleString('en-IN')} verified reviews
                </span>
              </div>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-200 shrink-0">
              <ShieldCheck size={14} />
              <span>Verified customer feedback</span>
            </div>
          )}
        </div>

        {/* Verified review cards */}
        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-5">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="p-4 sm:p-4.5 rounded-xl sm:rounded-2xl bg-[#FAF7F2] border border-stone-200/70"
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={13}
                        className={i <= review.rating ? 'fill-current' : 'text-stone-300'}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400">{review.date}</span>
                </div>

                <h3 className="text-sm sm:text-[15px] font-bold text-forest leading-snug mb-1.5">
                  {review.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-charcoal/80 font-sans leading-relaxed mb-3">
                  {review.content}
                </p>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-2.5 border-t border-stone-200/70">
                  <span className="text-xs font-bold text-charcoal">{review.author}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-stone-500">
                    <MapPin size={11} className="text-stone-400" />
                    {review.location}
                  </span>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                      <ShieldCheck size={12} />
                      Verified buyer
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
