'use client';

import React from 'react';
import { ArrowDown, MessageSquare, Sparkles, Layers, SlidersHorizontal, Tag, ArrowRight } from 'lucide-react';
import { trackComboEvent } from '@/lib/comboAnalytics';

interface ComboHeroProps {
  onOpenConsult: () => void;
  tagline?: string;
  title?: string;
  highlight?: string;
  description?: string;
  badge?: string;
  stepGuide?: {
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
}

export const ComboHero: React.FC<ComboHeroProps> = ({
  onOpenConsult,
  tagline = 'AyurRaksha Botanical Wellness',
  title = 'Build Your Own',
  highlight = 'Skin Care Combo',
  description = "Explore 13 Ayurvedic essentials and create a skincare routine that's uniquely yours.",
  badge = '13 Formulations',
  stepGuide = {
    step1Title: 'Choose Products',
    step1Desc: 'Pick from 13 essentials',
    step2Title: 'Adjust Quantities',
    step2Desc: 'Customize to your routine',
    step3Title: 'Checkout & Save',
    step3Desc: 'Unlock up to 15% discount',
  },
}) => {
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
    <section className="relative overflow-hidden bg-gradient-to-r from-[#103829] via-[#164736] to-[#1E5640] text-white">
      {/* Ambient background decoration */}
      <div
        className="pointer-events-none absolute -right-32 -bottom-48 h-[500px] w-[500px] rounded-full border border-[#e8d9b1]/15"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
          {/* Left: Compact Heading & Actions */}
          <div className="lg:col-span-7 space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#dba95c]/20 border border-[#dba95c]/30 text-[#f5d79e] text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles size={12} className="text-[#f5d79e]" />
              <span>{tagline}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-[40px] font-normal leading-[1.12] tracking-[-0.035em] text-white">
              {title}{' '}
              {highlight && <em className="italic text-[#edc48a] font-serif">{highlight}</em>}
            </h1>

            <p className="text-xs sm:text-sm text-[#e5eee7] leading-[1.55] max-w-xl font-sans">
              {description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
              <a
                href="#builder-catalog"
                onClick={handleScrollToBuilder}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[10px] bg-[#e5b36d] hover:bg-[#d8a459] text-[#183d2d] font-extrabold text-xs tracking-wide transition-all shadow-md active:scale-[0.98]"
              >
                <span>Select Products Below</span>
                <ArrowDown size={13} />
              </a>

              <button
                type="button"
                onClick={handleConsultClick}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-[10px] bg-white/10 hover:bg-white/20 border border-white/25 text-white font-extrabold text-xs transition-all shadow-xs"
              >
                <MessageSquare size={13} className="text-[#f5d79e]" />
                <span>Talk to an Ayurvedic Doctor</span>
              </button>
            </div>
          </div>

          {/* Right: Simplified 3-Step Guide with Icons */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-[16px] border border-white/20 p-3.5 sm:p-4 text-white">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#edc48a] block mb-2.5">
              HOW COMBO BUILDER WORKS
            </span>
            <div className="grid grid-cols-3 gap-2 text-center items-start">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#e5b36d] text-[#183d2d] flex items-center justify-center mb-1.5 shadow-xs">
                  <Layers size={15} />
                </div>
                <strong className="text-[11px] sm:text-xs text-white font-bold leading-tight block">
                  {stepGuide.step1Title}
                </strong>
                <span className="text-[9.5px] sm:text-[10px] text-emerald-100/80 leading-tight mt-0.5">
                  {stepGuide.step1Desc}
                </span>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center relative">
                <div className="w-8 h-8 rounded-full bg-[#e5b36d] text-[#183d2d] flex items-center justify-center mb-1.5 shadow-xs">
                  <SlidersHorizontal size={15} />
                </div>
                <strong className="text-[11px] sm:text-xs text-white font-bold leading-tight block">
                  {stepGuide.step2Title}
                </strong>
                <span className="text-[9.5px] sm:text-[10px] text-emerald-100/80 leading-tight mt-0.5">
                  {stepGuide.step2Desc}
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#e5b36d] text-[#183d2d] flex items-center justify-center mb-1.5 shadow-xs">
                  <Tag size={15} />
                </div>
                <strong className="text-[11px] sm:text-xs text-white font-bold leading-tight block">
                  {stepGuide.step3Title}
                </strong>
                <span className="text-[9.5px] sm:text-[10px] text-emerald-100/80 leading-tight mt-0.5">
                  {stepGuide.step3Desc}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
