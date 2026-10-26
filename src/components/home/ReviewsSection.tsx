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
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center text-botanical">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} className="fill-botanical" />
                ))}
              </div>
              <span className="text-xs font-bold text-forest">
                {SITE_CONFIG.reviews.averageRating} / 5.0
              </span>
              <span className="text-xs text-charcoal-muted">
                ({SITE_CONFIG.reviews.totalReviews} Verified Customer Reviews)
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest tracking-tight">
              Real Stories of Natural Recovery
            </h2>
            <p className="mt-2 text-sm text-charcoal-muted max-w-xl">
              Genuine experiences from individuals across India who found sustained vitality and relief through Ayurraksha formulations.
            </p>
          </div>

          <div className="text-xs text-charcoal-muted flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-stone-200">
            <ShieldCheck size={16} className="text-emerald-700" />
            <span>Verified by {SITE_CONFIG.reviews.provider}</span>
          </div>
        </div>

        {/* 6 Grid Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VERIFIED_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between p-6 bg-white rounded-card border border-stone-200/80 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-botanical/30"
            >
              <div>
                {/* Stars & Verified */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-botanical">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={14} className="fill-botanical" />
                    ))}
                  </div>
                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      <ShieldCheck size={12} />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-forest mb-2">
                  &ldquo;{rev.title}&rdquo;
                </h3>

                <p className="text-xs text-charcoal-muted leading-relaxed italic">
                  {rev.content}
                </p>
              </div>

              {/* Author & Product Info */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-charcoal block">
                    {rev.author}
                  </span>
                  <span className="text-[11px] text-charcoal-muted">
                    {rev.location}
                  </span>
                </div>
                <Link
                  href={`/product/${rev.productSlug}`}
                  className="text-[11px] font-semibold text-forest hover:text-botanical bg-sage-light hover:bg-sage px-2.5 py-1 rounded transition-colors"
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
