'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowDown, MessageSquare, Sparkles } from 'lucide-react';
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
    <section className="relative overflow-hidden bg-gradient-to-r from-[#103829] via-[#164736] to-[#1E5640] text-white">
      {/* Ambient background decoration */}
      <div
        className="pointer-events-none absolute -right-32 -bottom-48 h-[550px] w-[550px] rounded-full border border-[#e8d9b1]/15"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left: Compact Heading & Actions */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dba95c]/20 border border-[#dba95c]/30 text-[#f5d79e] text-[11px] font-extrabold uppercase tracking-wider">
              <Sparkles size={12} className="text-[#f5d79e]" />
              <span>AyurRaksha Botanical Wellness</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-normal leading-[1.1] tracking-[-0.04em] text-white">
              Skin care that begins <em className="italic text-[#edc48a] font-serif">with you.</em>
            </h1>

            <p className="text-xs sm:text-sm text-[#e5eee7] leading-[1.6] max-w-xl font-sans">
              Choose from 13 doctor-formulated Ayurvedic skin care essentials, select the products that suit your individual routine, and compose your personalized combination at your own pace.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#builder-catalog"
                onClick={handleScrollToBuilder}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[11px] bg-[#e5b36d] hover:bg-[#d8a459] text-[#183d2d] font-extrabold text-xs tracking-wide transition-all shadow-md active:scale-[0.98]"
              >
                <span>Select Products Below</span>
                <ArrowDown size={14} />
              </a>

              <button
                type="button"
                onClick={handleConsultClick}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[11px] bg-white/10 hover:bg-white/20 border border-white/25 text-white font-extrabold text-xs transition-all shadow-xs"
              >
                <MessageSquare size={14} className="text-[#f5d79e]" />
                <span>Talk to an Ayurvedic Doctor</span>
              </button>
            </div>
          </div>

          {/* Right: Quick 3-Step Guide (Compact, non-intrusive) */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-[18px] border border-white/20 p-4 sm:p-5 text-white space-y-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#edc48a] block">
              HOW COMBO BUILDER WORKS
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#e5b36d] text-[#183d2d] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <p className="text-emerald-50 leading-tight">
                  <strong className="text-white">Choose formulations:</strong> Browse common concerns or select any of the 13 products.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#e5b36d] text-[#183d2d] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-emerald-50 leading-tight">
                  <strong className="text-white">Adjust quantities:</strong> Add either soap, both soaps, oils, or supplements as desired.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#e5b36d] text-[#183d2d] font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <p className="text-emerald-50 leading-tight">
                  <strong className="text-white">Instant checkout:</strong> View product-level savings and complete order securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
