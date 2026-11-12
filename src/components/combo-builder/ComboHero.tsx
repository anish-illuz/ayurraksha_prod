'use client';

import React from 'react';
import { ArrowDown, Sparkles, Layers, SlidersHorizontal, Tag, ArrowRight } from 'lucide-react';

interface ComboHeroProps {
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

            {/* Primary CTA */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href="#builder-catalog"
                onClick={handleScrollToBuilder}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#1c513b] hover:bg-[#143e2d] text-white font-extrabold text-xs tracking-wide transition-all shadow-md active:scale-[0.98]"
              >
                <span>Select Products</span>
                <ArrowDown size={13} />
              </a>
            </div>
          </div>

          {/* Right: How Combo Builder Works — white card with numbered steps */}
          <div className="lg:col-span-5">
            <div className="bg-white text-[#26352d] rounded-2xl border border-[#dbe4da] shadow-[0_10px_30px_rgba(16,40,29,0.18)] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h2 className="text-[15px] sm:text-base font-extrabold text-[#18372b]">
                  How Combo Builder Works
                </h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8a6020] bg-[#faf6ea] border border-[#e8dcc0] px-2 py-0.5 rounded-full">
                  3 Simple Steps
                </span>
              </div>

              <div className="space-y-3.5">
                {/* Step 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1c513b] text-white text-[11px] font-extrabold flex items-center justify-center flex-shrink-0">
                    01
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#1c513b] mt-0.5 flex-shrink-0">
                      <Layers size={17} />
                    </span>
                    <div>
                      <strong className="text-[12.5px] sm:text-[13px] font-extrabold text-[#18372b] block leading-tight">
                        {stepGuide.step1Title}
                      </strong>
                      <span className="text-[10.5px] sm:text-[11px] text-[#5c6f63] leading-snug block mt-0.5">
                        {stepGuide.step1Desc}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1c513b] text-white text-[11px] font-extrabold flex items-center justify-center flex-shrink-0">
                    02
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#1c513b] mt-0.5 flex-shrink-0">
                      <SlidersHorizontal size={17} />
                    </span>
                    <div>
                      <strong className="text-[12.5px] sm:text-[13px] font-extrabold text-[#18372b] block leading-tight">
                        {stepGuide.step2Title}
                      </strong>
                      <span className="text-[10.5px] sm:text-[11px] text-[#5c6f63] leading-snug block mt-0.5">
                        {stepGuide.step2Desc}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#1c513b] text-white text-[11px] font-extrabold flex items-center justify-center flex-shrink-0">
                    03
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="text-[#1c513b] mt-0.5 flex-shrink-0">
                      <Tag size={17} />
                    </span>
                    <div>
                      <strong className="text-[12.5px] sm:text-[13px] font-extrabold text-[#18372b] block leading-tight">
                        {stepGuide.step3Title}
                      </strong>
                      <span className="text-[10.5px] sm:text-[11px] text-[#5c6f63] leading-snug block mt-0.5">
                        {stepGuide.step3Desc}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="#builder-catalog"
                onClick={handleScrollToBuilder}
                className="mt-4 text-[11.5px] font-extrabold text-[#2e6845] inline-flex items-center gap-1"
              >
                Start your combo
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
