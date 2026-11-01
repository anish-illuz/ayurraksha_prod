'use client';

import React from 'react';
import { Sparkles, Stethoscope } from 'lucide-react';
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
    <div className="bg-white rounded-[20px] border border-[#e4e7df] p-6 mb-6 shadow-xs">
      <div className="font-extrabold text-[13px] text-[#18372b] mb-1.5 tracking-wide">
        What brings you here today?
      </div>

      <p className="text-xs text-[#3c4f44] mb-4 leading-relaxed font-sans">
        Choose a concern to get a suggested starting selection. <em>This is shopping guidance, not a diagnosis.</em> Every selection remains editable.
      </p>

      {/* Concern Chips matching prototype */}
      <div className="flex flex-wrap gap-2">
        {SKIN_CONCERNS.map((concern) => {
          const isActive = concern.id === activeConcern.id;
          return (
            <button
              key={concern.id}
              type="button"
              onClick={() => handleSelect(concern)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#1c513d] text-white shadow-xs border border-[#1c513d]'
                  : 'bg-white hover:bg-stone-50 text-[#283830] border border-[#dce4da]'
              }`}
            >
              {concern.name}
            </button>
          );
        })}
      </div>

      {/* Dynamic Concern Description matching prototype mini-desc */}
      <div className="mt-4 p-3.5 rounded-[9px] bg-[#eef4eb] border border-[#d6e3d6] text-xs text-[#203728] leading-[1.6] space-y-2">
        <div>
          <strong>{activeConcern.name}:</strong> {activeConcern.description}
        </div>

        {activeConcern.clinicalNotice && (
          <div className="pt-2 border-t border-[#d0dcbe] text-[11.5px] text-[#203728] leading-relaxed flex items-start justify-between gap-3">
            <span>{activeConcern.clinicalNotice}</span>
            <button
              type="button"
              onClick={onOpenConsult}
              className="font-extrabold text-[#1c513d] underline hover:text-[#123b2d] whitespace-nowrap inline-flex items-center gap-1"
            >
              <span>Consult Doctor</span>
              <Stethoscope size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
