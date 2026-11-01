'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowDown, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { trackComboEvent } from '@/lib/comboAnalytics';

interface ComboHeroProps {
  onOpenConsult: () => void;
}

export const ComboHero: React.FC<ComboHeroProps> = ({ onOpenConsult }) => {
  const handleScrollToBuilder = (e: React.MouseEvent) => {
    e.preventDefault();
    const builderEl = document.getElementById('builder-catalog');
    if (builderEl) {
      builderEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConsultClick = () => {
    trackComboEvent({ event: 'consult_click', placement: 'hero' });
    onOpenConsult();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0F3528] via-[#164736] to-[#1E5640] text-white">
      {/* Decorative ambient background rings matching prototype */}
      <div
        className="pointer-events-none absolute -right-48 -bottom-72 h-[680px] w-[680px] rounded-full border border-white/10 opacity-40 shadow-[0_0_0_80px_rgba(255,255,255,0.015)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-radial from-[#dba95c]/15 to-transparent blur-2xl"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading and Value Proposition */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dba95c]/20 border border-[#dba95c]/30 text-[#f5d79e] text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={13} className="text-[#f5d79e]" />
              <span>AyurRaksha Botanical Wellness</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-white">
              Skin care that begins <em className="italic text-[#f2cb93] font-serif">with you.</em>
            </h1>

            <p className="text-sm sm:text-base text-emerald-50/90 leading-relaxed max-w-2xl font-sans">
              Explore 13 doctor-formulated Ayurvedic skin care essentials, select the products that suit your individual routine, and compose your personalized combination at your own pace.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#builder-catalog"
                onClick={handleScrollToBuilder}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#e5b36d] hover:bg-[#d9a254] text-[#123b2d] font-bold text-xs sm:text-sm tracking-wide uppercase shadow-lg shadow-black/10 transition-all active:scale-[0.98]"
              >
                <span>Start Building Combo</span>
                <ArrowDown size={16} />
              </a>

              <button
                type="button"
                onClick={handleConsultClick}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-xs sm:text-sm transition-all"
              >
                <MessageSquare size={16} className="text-[#f5d79e]" />
                <span>Talk to an Ayurvedic Doctor</span>
              </button>
            </div>

            {/* Micro Metadata */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-100/80">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#f5d79e]" />
                <span>13 Products</span>
              </span>
              <span>•</span>
              <span>5 Care Categories</span>
              <span>•</span>
              <span>Full control over your selections</span>
              <span>•</span>
              <span>No mandatory items</span>
            </div>
          </div>

          {/* Right Column: Hero Real Photography Showcase */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-md aspect-square sm:aspect-[4/3] lg:aspect-square flex items-center justify-center">
              {/* Soft gold halo */}
              <div
                className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#dba95c]/20 via-[#4e8568]/30 to-transparent blur-xl"
                aria-hidden="true"
              />

              {/* Showcase 3 flagship products with real photography */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                {/* Product 1: Divine Healing Oil */}
                <div className="absolute left-2 sm:left-4 bottom-4 w-36 sm:w-44 aspect-[3/4] bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-white/30 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                  <div className="relative w-full h-28 sm:h-36">
                    <Image
                      src="/images/products/divine-healing-oil.webp"
                      alt="AyurRaksha Divine Healing Oil"
                      fill
                      sizes="176px"
                      priority
                      className="object-contain"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-[10px] uppercase font-bold text-[#b49a70] tracking-wider block">
                      Pre-Bath Oil
                    </span>
                    <strong className="text-xs text-stone-900 font-serif line-clamp-1">
                      Divine Healing Oil
                    </strong>
                  </div>
                </div>

                {/* Product 2: SuperHeal O3 Cream (Center) */}
                <div className="relative z-20 w-44 sm:w-52 aspect-[3/4] bg-white rounded-2xl p-3.5 shadow-2xl border border-[#dba95c]/40 transform -translate-y-2">
                  <div className="relative w-full h-32 sm:h-40">
                    <Image
                      src="/images/products/ayur-raksha-superheal-o3-cream.webp"
                      alt="SuperHeal O3 Cream"
                      fill
                      sizes="208px"
                      priority
                      className="object-contain"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                      O3 Specialty
                    </span>
                    <strong className="text-xs sm:text-sm text-stone-900 font-serif line-clamp-1">
                      SuperHeal O3 Cream
                    </strong>
                  </div>
                </div>

                {/* Product 3: Skin Conditioning Oil */}
                <div className="absolute right-2 sm:right-4 bottom-4 w-36 sm:w-44 aspect-[3/4] bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-white/30 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                  <div className="relative w-full h-28 sm:h-36">
                    <Image
                      src="/images/products/ayur-raksha-skin-conditioning-oil.webp"
                      alt="Skin Conditioning Oil"
                      fill
                      sizes="176px"
                      priority
                      className="object-contain"
                    />
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-[10px] uppercase font-bold text-[#b49a70] tracking-wider block">
                      Post-Bath Care
                    </span>
                    <strong className="text-xs text-stone-900 font-serif line-clamp-1">
                      Conditioning Oil
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
