import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShieldCheck, HeartPulse } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#FAF7F2] pt-10 pb-16 lg:py-20 border-b border-border-botanical">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage text-forest text-xs font-semibold tracking-wide">
              <Sparkles size={14} className="text-botanical" />
              <span>Doctor-Formulated Classical Ayurveda</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-forest leading-[1.12] tracking-tight">
              Rooted in Nature.
              <br />
              <span className="text-botanical italic font-normal">Made for Your Wellbeing.</span>
            </h1>

            <p className="text-base sm:text-lg text-charcoal-muted leading-relaxed max-w-xl">
              Thoughtfully prepared Ayurvedic tonics, restorative herbal oils, and targeted wellness packs. Formulated under the guidance of Dr. Jegajothi Pandian in Chennai to nurture your body&apos;s natural balance.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/shop?sort=bestseller"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-button text-sm font-semibold bg-forest hover:bg-forest-light text-white shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
              >
                <span>Shop Bestsellers</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-button text-sm font-semibold bg-white hover:bg-stone-50 text-forest border border-forest/20 transition-all"
              >
                <span>Explore All Formulations (44)</span>
              </Link>
            </div>

            {/* Quick credibility bullet points */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-stone-200/60 text-xs text-charcoal-muted">
              <div>
                <span className="font-bold text-forest block text-base sm:text-lg">25+</span>
                <span>Years Clinical Formulations</span>
              </div>
              <div>
                <span className="font-bold text-forest block text-base sm:text-lg">100%</span>
                <span>Prepaid Free Delivery</span>
              </div>
              <div>
                <span className="font-bold text-forest block text-base sm:text-lg">4.8 / 5</span>
                <span>Judge.me Customer Rating</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Art-Directed Product Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Background Decorative Organic Shape */}
              <div className="absolute inset-0 bg-sage rounded-3xl -rotate-2 transform scale-102 opacity-70" />

              {/* Main Card with Spotlight Formulation */}
              <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-stone-200/80">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta bg-terracotta/10 px-2.5 py-1 rounded-badge">
                    Featured Formulation
                  </span>
                  <span className="text-xs font-bold text-forest bg-sage/80 px-2.5 py-1 rounded-badge">
                    Bestseller
                  </span>
                </div>

                {/* Product Image */}
                <div className="relative w-full aspect-square bg-[#FAF8F5] rounded-2xl p-6 overflow-hidden">
                  <Image
                    src="https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/1.png"
                    alt="BoozLiv Herbal Tonic by Ayurraksha"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-contain"
                  />
                </div>

                {/* Mini Card Footer */}
                <div className="mt-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-serif text-lg font-bold text-forest">
                        BoozLiv Herbal Tonic
                      </h2>
                      <p className="text-xs text-charcoal-muted mt-0.5">
                        Targeted Liver Revitalization &amp; Digestive Support
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-forest">₹2,400</span>
                      <span className="text-xs text-stone-400 line-through block">₹2,600</span>
                    </div>
                  </div>

                  <Link
                    href="/product/boozliv"
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-button text-xs font-semibold bg-forest hover:bg-forest-light text-white transition-colors"
                  >
                    <span>View BoozLiv Details</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
