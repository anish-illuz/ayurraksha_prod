import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Stethoscope } from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';

export const BrandStory: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-[#E8EFE7]/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Atmospheric Image & Doctor Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card border border-stone-200">
                <Image
                  src="https://www.ayurrakshaonline.com/wp-content/uploads/2025/06/Ayurvedic-tonic-for-liver.jpg"
                  alt="Traditional Ayurvedic herbs and formulations at Ayurraksha"
                  fill
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover"
                />
              </div>

              {/* Floating Doctor Credibility Card */}
              <div className="absolute -bottom-6 -right-3 sm:-right-6 bg-white p-5 rounded-2xl shadow-dropdown border border-primary/15 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-sage flex items-center justify-center text-primary flex-shrink-0">
                    <Stethoscope size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary">
                      {SITE_CONFIG.doctor.name}
                    </h4>
                    <p className="text-xs text-charcoal-muted">
                      Chief Ayurvedic Formulation Expert
                    </p>
                  </div>
                </div>
                <p className="mt-2.5 text-xs sm:text-sm text-charcoal-muted leading-snug border-t border-stone-100 pt-2">
                  Over 25 years of experience in Ayurvedic formulations.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6">
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-primary uppercase tracking-widest block">
                Our Story &amp; Promise
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight tracking-tight">
                Pure Ayurvedic Care, Made for Everyday Living
              </h2>
            </div>

            <p className="text-base sm:text-lg text-charcoal leading-relaxed">
              At AyurRaksha, we believe that true wellbeing begins with the goodness of nature and the wisdom of traditional Ayurveda. An initiative of <strong>VPrime Innovations</strong>, our mission is to make authentic Ayurvedic wellness solutions accessible and relevant to modern families.
            </p>

            <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
              Every tonic, oil, and capsule is thoughtfully formulated with careful attention to ingredient quality, purity, and botanical composition under the guidance of Dr. Jegajothi Pandian. We prioritize carefully selected, high-quality herbs and consistent formulation standards to deliver Ayurvedic wellness products you can trust.
            </p>

            {/* 3 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-stone-200/90 shadow-xs">
                <CheckCircle2 size={20} className="text-primary mb-2" />
                <h4 className="text-sm sm:text-base font-bold text-primary">100% Pure Herbs</h4>
                <p className="text-xs sm:text-sm text-charcoal-muted mt-1">Zero hidden steroids, chemicals, or artificial fillers.</p>
              </div>

              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-stone-200/90 shadow-xs">
                <CheckCircle2 size={20} className="text-primary mb-2" />
                <h4 className="text-sm sm:text-base font-bold text-primary">Doctor Formulated</h4>
                <p className="text-xs sm:text-sm text-charcoal-muted mt-1">Guided by Dr. Jegajothi Pandian with 25+ years of experience.</p>
              </div>

              <div className="p-4 sm:p-5 bg-white rounded-2xl border border-stone-200/90 shadow-xs">
                <CheckCircle2 size={20} className="text-primary mb-2" />
                <h4 className="text-sm sm:text-base font-bold text-primary">Lab Tested Quality</h4>
                <p className="text-xs sm:text-sm text-charcoal-muted mt-1">Tested for purity, safety, and consistent therapeutic strength.</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-primary hover:underline transition-colors group"
              >
                <span>Read Our Full Story</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
