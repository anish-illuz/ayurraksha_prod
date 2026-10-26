import React from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, Quote } from 'lucide-react';
import { VERIFIED_REVIEWS } from '@/data/reviews';
import { SITE_CONFIG } from '@/data/siteConfig';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-ivory border-b border-border-botanical">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Judge.me Badge */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="flex items-center text-botanical">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={18} className="fill-botanical" />
                ))}
              </div>
              <span className="text-sm font-bold text-forest">
                {SITE_CONFIG.reviews.averageRating} / 5.0
              </span>
              <span className="text-sm text-charcoal-muted">
                ({SITE_CONFIG.reviews.totalReviews} Verified Customer Reviews)
              </span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-tight">
              Customer Reviews &amp; Experiences
            </h2>
            <p className="mt-3 text-base sm:text-lg text-charcoal-muted max-w-xl">
              Real feedback from customers across India who trust Ayurraksha remedies for their daily health and wellness.
            </p>
          </div>

          <div className="text-xs sm:text-sm text-charcoal-muted flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-stone-200 shadow-xs">
            <ShieldCheck size={18} className="text-emerald-700" />
            <span>Verified by {SITE_CONFIG.reviews.provider}</span>
          </div>
        </div>

        {/* 6 Grid Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VERIFIED_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between p-6 sm:p-7 bg-white rounded-2xl border border-stone-200/90 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-botanical/40"
            >
              <div>
                {/* Stars & Verified */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center text-botanical">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={16} className="fill-botanical" />
                    ))}
                  </div>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      <ShieldCheck size={13} />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-forest mb-2 leading-snug">
                  &ldquo;{rev.title}&rdquo;
                </h3>

                <p className="text-sm sm:text-[15px] text-charcoal leading-relaxed italic">
                  {rev.content}
                </p>
              </div>

              {/* Author & Product Info */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-charcoal block">
                    {rev.author}
                  </span>
                  <span className="text-xs text-charcoal-muted">
                    {rev.location}
                  </span>
                </div>
                <Link
                  href={`/product/${rev.productSlug}`}
                  className="text-xs font-semibold text-forest hover:text-botanical bg-sage-light hover:bg-sage px-3 py-1.5 rounded-lg transition-colors"
                >
                  {rev.productName}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
