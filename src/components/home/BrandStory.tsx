import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Stethoscope } from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';

export const BrandStory: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-[#F4EFE6] border-b border-border-botanical overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
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
              <div className="absolute -bottom-6 -right-3 sm:-right-6 bg-white p-4 sm:p-5 rounded-2xl shadow-dropdown border border-border-botanical max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage flex items-center justify-center text-botanical flex-shrink-0">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-forest">
                      {SITE_CONFIG.doctor.name}
                    </h4>
                    <p className="text-[10px] text-charcoal-muted">
                      Chief Ayurvedic Formulation Expert
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-charcoal-muted leading-tight border-t border-stone-100 pt-2">
                  Over 25+ years refining classical remedies for contemporary health challenges.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-botanical uppercase tracking-widest block">
                Our Story &amp; Promise
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-forest leading-tight tracking-tight">
                Pure Ayurvedic Care, Made for Everyday Living
              </h2>
            </div>

            <p className="text-sm sm:text-base text-charcoal leading-relaxed">
              At Ayurraksha, we believe that true wellbeing starts with pure, natural care. An initiative of <strong>VPrime Innovations</strong> in Chennai, our mission is to make authentic Ayurvedic healing accessible, safe, and effective for modern families.
            </p>

            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              Unlike ordinary health products, every tonic, oil, and capsule is developed with rigorous attention to purity and botanical potency under the clinical supervision of Dr. Jegajothi Pandian. We source only genuine, high-grade herbs so you receive remedies you can trust.
            </p>

            {/* 3 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-xs">
                <CheckCircle2 size={18} className="text-botanical mb-1.5" />
                <h4 className="text-xs font-bold text-forest">100% Pure Herbs</h4>
                <p className="text-[11px] text-charcoal-muted mt-0.5">Zero hidden steroids, chemicals, or artificial fillers.</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-xs">
                <CheckCircle2 size={18} className="text-botanical mb-1.5" />
                <h4 className="text-xs font-bold text-forest">Doctor Formulated</h4>
                <p className="text-[11px] text-charcoal-muted mt-0.5">Guided by Dr. Jegajothi Pandian with 25+ years experience.</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200/80 shadow-xs">
                <CheckCircle2 size={18} className="text-botanical mb-1.5" />
                <h4 className="text-xs font-bold text-forest">Lab Tested Quality</h4>
                <p className="text-[11px] text-charcoal-muted mt-0.5">Tested for purity, safety, and consistent therapeutic strength.</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-bold text-forest hover:text-botanical transition-colors group"
              >
                <span>Read Our Full Story</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
