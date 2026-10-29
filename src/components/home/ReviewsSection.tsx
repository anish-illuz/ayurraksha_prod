import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShieldCheck } from 'lucide-react';
import { VERIFIED_REVIEWS } from '@/data/reviews';
import { SITE_CONFIG } from '@/data/siteConfig';
import { getProductBySlug } from '@/lib/products';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-9 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Judge.me Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:gap-6 sm:mb-12">
          <div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2.5">
              <div className="flex items-center text-gold">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={18} className="fill-gold" />
                ))}
              </div>
              <span className="text-sm font-bold text-primary">
                {SITE_CONFIG.reviews.averageRating} / 5.0
              </span>
              <span className="basis-full sm:basis-auto text-sm text-charcoal-muted">
                ({SITE_CONFIG.reviews.totalReviews} Verified Customer Reviews)
              </span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
              What Our Customers Say
            </h2>
            <p className="mt-3 text-base sm:text-lg text-charcoal-muted max-w-xl">
              Explore genuine customer experiences with AyurRaksha products.
            </p>
          </div>

          <div className="text-xs sm:text-sm text-charcoal-muted flex items-center gap-2 bg-[#FAF9F5] px-4 py-2.5 rounded-xl border border-stone-200/80 shadow-xs">
            <ShieldCheck size={18} className="text-emerald-700" />
            <span>Verified Customer Reviews • Judge.me</span>
          </div>
        </div>

        {/* 6 Grid Review Cards with Authentic Product Thumbnails */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-7">
          {VERIFIED_REVIEWS.map((rev) => {
            const product = getProductBySlug(rev.productSlug);
            const thumbImg = product?.images[0] || 'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/1.png';

            return (
              <div
                key={rev.id}
                className="flex flex-col justify-between p-4 sm:p-7 bg-[#FAF9F5] rounded-2xl border border-stone-200/80 shadow-xs transition-all duration-300 hover:shadow-card-hover hover:border-primary/40 group"
              >
                <div>
                  {/* Stars & Verified */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center text-gold">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={16} className="fill-gold" />
                      ))}
                    </div>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                        <ShieldCheck size={13} />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-heading text-lg sm:text-xl font-bold text-primary mb-2 leading-snug">
                    &ldquo;{rev.title}&rdquo;
                  </h3>

                  <p className="text-sm text-charcoal leading-relaxed italic">
                    {rev.content}
                  </p>
                </div>

                {/* Author & Linked Product Thumbnail at Bottom */}
                <div className="mt-4 pt-3 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-sm font-bold text-charcoal block">
                      {rev.author}
                    </span>
                    <span className="text-xs text-charcoal-muted">
                      {rev.location}
                    </span>
                  </div>

                  {/* Small Authentic Product Thumbnail linking to Product Page */}
                  <Link
                    href={`/product/${rev.productSlug}`}
                    className="flex items-center gap-2.5 p-1.5 pr-3 bg-white hover:bg-sage/50 border border-stone-200/90 rounded-xl transition-all group/prod max-w-[190px]"
                    title={`View ${rev.productName}`}
                  >
                    <div className="relative w-9 h-9 rounded-lg bg-[#F7F9F5] flex-shrink-0 overflow-hidden p-1">
                      <Image
                        src={thumbImg}
                        alt={rev.productName}
                        fill
                        sizes="36px"
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xs font-semibold text-primary truncate group-hover/prod:underline">
                      {rev.productName}
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
