'use client';

import React from 'react';
import { MessageSquare, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
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

  // Content configurations based on Developer Brief exact placements
  if (placement === 'after_explainer') {
    return (
      <div
        className={`bg-gradient-to-r from-[#E5EEE2] via-[#EEF4EB] to-[#F1F1E7] border border-[#D6E3D6] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 my-6 shadow-xs ${className}`}
      >
        <div className="space-y-1">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#ab8345] block">
            Personal Guidance
          </span>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#18372b]">
            Not sure which products to choose?
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
            Book a <strong>FREE consultation</strong> with a qualified Ayurvedic physician at VPrime Health Care. Discuss your specific skin concerns before composing a routine.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#18372b] hover:bg-[#24533e] text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-xs transition-all flex-shrink-0"
        >
          <MessageSquare size={16} className="text-[#f5d79e]" />
          <span>Book Free Doctor Consultation ↗</span>
        </button>
      </div>
    );
  }

  if (placement === 'inside_builder') {
    return (
      <div
        className={`bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-6 shadow-xs ${className}`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <HeartPulse size={16} className="text-[#ab8345]" />
            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#18372b]">
              Need help selecting the right combination?
            </h3>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed max-w-lg">
            Speak with a qualified VPrime Ayurvedic physician — <strong>FREE</strong>. Get clinical advice before adding doctor-guided proprietary or O3 formulations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-[#18372b] hover:text-white text-[#18372b] font-bold text-xs whitespace-nowrap border border-stone-300 transition-all flex-shrink-0"
        >
          <span>Get Free Doctor Guidance</span>
          <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  // Final placement: Before checkout / final consult section
  return (
    <section className={`relative overflow-hidden bg-[#123b2d] text-white rounded-3xl p-8 sm:p-12 my-12 shadow-xl ${className}`}>
      {/* Decorative ambient halo */}
      <div
        className="pointer-events-none absolute -right-32 -bottom-48 w-[480px] h-[480px] rounded-full border border-white/10 opacity-30 shadow-[0_0_0_60px_rgba(255,255,255,0.02)]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#e2bf88] block">
          We are here to guide you
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl font-normal leading-tight text-white">
          Want professional guidance before purchasing?
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
          Book your <strong>FREE VPrime Ayurvedic doctor consultation</strong> to discuss your skin concerns before choosing a routine. Consultation is completely optional; shopping remains entirely in your hands.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#e5b36d] hover:bg-[#d8a459] text-[#123b2d] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <MessageSquare size={16} />
            <span>Book My Free Doctor Consultation ↗</span>
          </button>
          <span className="text-xs text-emerald-200/80">
            • Average response time: under 1 hour
          </span>
        </div>
      </div>
    </section>
  );
};
