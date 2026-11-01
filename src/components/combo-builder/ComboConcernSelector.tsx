'use client';

import React from 'react';
import { AlertCircle, HelpCircle, Sparkles, Stethoscope } from 'lucide-react';
import { SKIN_CONCERNS } from '@/data/comboBuilderData';
import { SkinConcern } from '@/types/combo';
import { trackComboEvent } from '@/lib/comboAnalytics';

interface ComboConcernSelectorProps {
  activeConcernId: string;
  onSelectConcern: (concern: SkinConcern) => void;
  onOpenConsult: () => void;
}

export const ComboConcernSelector: React.FC<ComboConcernSelectorProps> = ({
  activeConcernId,
  onSelectConcern,
  onOpenConsult,
}) => {
  const activeConcern = SKIN_CONCERNS.find((c) => c.id === activeConcernId) || SKIN_CONCERNS[0];

  const handleSelect = (concern: SkinConcern) => {
    onSelectConcern(concern);
    trackComboEvent({
      event: 'select_concern',
      concern_id: concern.id,
      concern_name: concern.name,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 mb-6 shadow-xs">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#ab8345]" />
          <h3 className="text-sm font-bold text-[#18372b] uppercase tracking-wider">
            What brings you here today?
          </h3>
        </div>
        <span className="text-[11px] text-stone-500 hidden sm:inline">
          Optional Shopping Shortlist
        </span>
      </div>

      <p className="text-xs text-stone-600 mb-4 leading-relaxed">
        Choose a skin concern to highlight a suggested starting shortlist. <em>This is guided shopping discovery, not a clinical diagnosis.</em> No products are automatically added to your combo.
      </p>

      {/* Concern Chips */}
      <div className="flex flex-wrap gap-2 sm:gap-2.5">
        {SKIN_CONCERNS.map((concern) => {
          const isActive = concern.id === activeConcern.id;
          return (
            <button
              key={concern.id}
              type="button"
              onClick={() => handleSelect(concern)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#18372b] text-white shadow-xs border border-[#18372b]'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
              }`}
            >
              {concern.name}
            </button>
          );
        })}
      </div>

      {/* Dynamic Concern Description & Clinical Guardrails */}
      <div className="mt-4 p-3.5 rounded-xl bg-[#F4F7EE] border border-[#DCE4CF] text-xs space-y-2">
        <div className="text-stone-700 leading-relaxed font-sans">
          <strong>{activeConcern.name}:</strong> {activeConcern.description}
        </div>

        {activeConcern.clinicalNotice && (
          <div className="flex items-start gap-2 pt-2 border-t border-[#D0DCBE] text-[11px] text-stone-700 leading-relaxed">
            <AlertCircle size={15} className="text-[#a0695b] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{activeConcern.clinicalNotice}</span>
              <button
                type="button"
                onClick={onOpenConsult}
                className="ml-1.5 font-bold text-[#18372b] underline hover:text-[#23533e] inline-flex items-center gap-1"
              >
                <span>Ask our Ayurvedic doctor</span>
                <Stethoscope size={11} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
