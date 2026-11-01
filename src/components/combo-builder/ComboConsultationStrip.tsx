'use client';

import React from 'react';
import { MessageSquare, ArrowRight, HeartPulse } from 'lucide-react';
import { ConsultationPlacement } from '@/types/combo';
import { trackComboEvent } from '@/lib/comboAnalytics';

interface ComboConsultationStripProps {
  placement: ConsultationPlacement;
  onOpenConsult: () => void;
  className?: string;
}

export const ComboConsultationStrip: React.FC<ComboConsultationStripProps> = ({
  placement,
  onOpenConsult,
  className = '',
}) => {
  const handleClick = () => {
    trackComboEvent({ event: 'consult_click', placement });
    onOpenConsult();
  };

  // Placement 1: After explainer
  if (placement === 'after_explainer') {
    return (
      <div
        className={`bg-gradient-to-r from-[#e5eee2] via-[#eaf2e7] to-[#f1f1e7] border border-[#d6e3d6] rounded-[18px] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 my-6 shadow-xs ${className}`}
      >
        <div className="space-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.17em] text-[#ab8345] block">
            PERSONAL GUIDANCE
          </span>
          <h3 className="font-serif text-2xl font-normal text-[#18372b]">
            Not sure where to begin?
          </h3>
          <p className="text-xs sm:text-[13px] text-[#26372d] leading-relaxed max-w-xl">
            Book a <strong>free consultation</strong> with a qualified Ayurvedic physician at VPrime Health Care. Discuss your specific skin concerns before composing a routine.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[11px] bg-[#123b2d] hover:bg-[#235b43] text-white font-extrabold text-xs sm:text-[13px] whitespace-nowrap shadow-sm transition-all flex-shrink-0"
        >
          <span>Book Free Doctor Consultation ↗</span>
        </button>
      </div>
    );
  }

  // Placement 2: Inside product builder
  if (placement === 'inside_builder') {
    return (
      <div
        className={`bg-white border border-[#e4e7df] rounded-[18px] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-6 shadow-xs ${className}`}
      >
        <div className="space-y-1">
          <h3 className="font-serif text-[22px] font-normal text-[#18372b]">
            Need help comparing products?
          </h3>
          <p className="text-xs sm:text-[13px] text-[#283830] leading-relaxed max-w-xl">
            Speak with a qualified Ayurvedic physician before adding doctor-guided formulations. Consultation is free and optional.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[11px] bg-[#123b2d] hover:bg-[#235b43] text-white font-extrabold text-xs whitespace-nowrap transition-all shadow-xs flex-shrink-0"
        >
          <span>Get Free Guidance</span>
        </button>
      </div>
    );
  }

  // Placement 3: Final consultation banner
  return (
    <section className={`relative overflow-hidden bg-[#123b2d] text-white rounded-[23px] p-8 sm:p-14 my-14 shadow-xl ${className}`}>
      {/* Decorative ambient ring matching prototype */}
      <div
        className="pointer-events-none absolute -right-24 -bottom-52 w-[600px] h-[600px] rounded-full border border-[#f4e2b5]/20 shadow-[0_0_0_62px_rgba(255,255,255,0.025),0_0_0_130px_rgba(255,255,255,0.015)]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl space-y-4">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.17em] text-[#e2bf88] block">
          WE'RE HERE TO GUIDE YOU
        </span>
        <h2 className="font-serif text-3xl sm:text-[39px] font-normal leading-[1.16] tracking-[-0.04em] text-white">
          Still deciding? Speak with a VPrime Ayurvedic physician.
        </h2>
        <p className="text-xs sm:text-sm text-[#d1e2d5] leading-[1.75]">
          Get a free consultation to discuss your skin concerns before choosing a routine. Consultation is optional; shopping remains in your hands.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-[11px] bg-[#e5b36d] hover:bg-[#d8a459] text-[#183d2d] font-extrabold text-xs sm:text-[13px] shadow-md transition-all active:scale-[0.98]"
          >
            <span>Book My Free Doctor Consultation ↗</span>
          </button>
        </div>
      </div>
    </section>
  );
};
