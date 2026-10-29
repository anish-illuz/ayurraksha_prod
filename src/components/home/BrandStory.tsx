import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Stethoscope } from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';

export const BrandStory: React.FC = () => {
  return (
    <section className="py-9 sm:py-20 lg:py-24 bg-[#E8EFE7]/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-12 items-center">
          {/* Narrative content: First on mobile */}
          <div className="order-1 lg:order-2 lg:col-span-7 space-y-4 sm:space-y-6 lg:pl-6">
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-primary uppercase tracking-widest block font-sans">
                Our Story &amp; Promise
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight tracking-tight">
                Pure Ayurvedic Care, Made for Everyday Living
              </h2>
            </div>

            <p className="text-base sm:text-lg text-charcoal leading-relaxed font-sans">
              An initiative of <strong>VPrime Innovations</strong>, AyurRaksha brings traditional Ayurvedic care to everyday family life.
            </p>

            <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed font-sans">
              Every tonic, oil, and capsule is thoughtfully formulated with careful attention to ingredient quality, purity, and botanical composition under the guidance of Dr. Jegajothi Pandian. We prioritize carefully selected, high-quality herbs and consistent formulation standards to deliver Ayurvedic wellness products you can trust.
            </p>

            {/* 3 Core Pillars - Compact layout with icon on left and text aligned beside */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 bg-[#FAF9F5] rounded-xl border border-stone-200/70 shadow-xs">
                <CheckCircle2 size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="font-heading text-sm sm:text-base font-bold text-primary leading-tight">
                    Pure Herbal Ingredients
                  </h4>
                  <p className="font-sans text-xs text-charcoal-muted mt-1 leading-snug">
                    Zero hidden steroids, chemicals, or artificial fillers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-[#FAF9F5] rounded-xl border border-stone-200/70 shadow-xs">
                <CheckCircle2 size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="font-heading text-sm sm:text-base font-bold text-primary leading-tight">
                    Doctor Formulated
                  </h4>
                  <p className="font-sans text-xs text-charcoal-muted mt-1 leading-snug">
                    Guided by Dr. Jegajothi Pandian with 25+ years of Ayurvedic experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 bg-[#FAF9F5] rounded-xl border border-stone-200/70 shadow-xs">
                <CheckCircle2 size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h4 className="font-heading text-sm sm:text-base font-bold text-primary leading-tight">
                    Lab Tested Quality
                  </h4>
                  <p className="font-sans text-xs text-charcoal-muted mt-1 leading-snug">
                    Tested for purity, safety, and consistent therapeutic strength.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-primary hover:underline transition-colors group font-sans"
              >
                <span>Read Our Full Story</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Doctor portrait and credentials: Follows the narrative on mobile */}
          <div className="order-2 lg:order-1 lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none overflow-hidden rounded-2xl border border-primary/15 bg-white shadow-card">
              <div className="relative h-64 sm:h-80 lg:h-[400px] bg-sage">
                <Image
                  src="/images/brand/dr-jegajothi-pandian.webp"
                  alt="Dr. Jegajothi Pandian"
                  fill
                  sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 448px, 480px"
                  className="object-cover object-top"
                />
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-sage flex items-center justify-center text-primary flex-shrink-0">
                    <Stethoscope size={22} />
                  </div>
                  <div>
                    <h4 className="font-heading text-lg sm:text-xl font-bold text-primary leading-tight">
                      {SITE_CONFIG.doctor.name}
                    </h4>
                    <p className="font-sans text-xs text-charcoal-muted mt-0.5">
                      Chief Ayurvedic Formulation Expert
                    </p>
                  </div>
                </div>
                <p className="font-sans mt-2.5 text-xs sm:text-sm text-charcoal-muted leading-snug border-t border-stone-100 pt-2">
                  Over 25 years of devoted clinical experience in Ayurvedic formulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

