'use client';

import React from 'react';
import { Sparkles, Stethoscope, AlertTriangle, ShieldAlert } from 'lucide-react';
import { SKIN_CONCERNS } from '@/data/comboBuilderData';
import { ComboConcern, SkinConcern } from '@/types/combo';
import { trackComboEvent } from '@/lib/comboAnalytics';

interface ComboConcernSelectorProps {
  activeConcernId: string;
  onSelectConcern: (concern: ComboConcern) => void;
  onOpenConsult: () => void;
  concerns?: ComboConcern[];
  title?: string;
  description?: string;
}

export const ComboConcernSelector: React.FC<ComboConcernSelectorProps> = ({
  activeConcernId,
  onSelectConcern,
  onOpenConsult,
  concerns = SKIN_CONCERNS,
  title = 'What brings you here today?',
  description = 'Choose a concern to get a suggested starting selection. This is shopping guidance, not a diagnosis. Every selection remains editable.',
}) => {
  const activeConcern = concerns.find((c) => c.id === activeConcernId) || concerns[0];

  const handleSelect = (concern: ComboConcern) => {
    onSelectConcern(concern);
    trackComboEvent({
      event: 'select_concern',
      concern_id: concern.id,
      concern_name: concern.name,
    });
  };

  const isEmergency = Boolean(activeConcern.isEmergencyPathway || activeConcern.emergencyNotice);

  return (
    <div className="bg-white rounded-[14px] border border-[#e4e7df] p-3 sm:p-3.5 mb-3.5 shadow-xs">
      <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8a6020] block mb-2">
        Filter by Concern
      </span>

      {/* Concern Chips */}
      <div className="flex flex-wrap gap-1.5">
        {concerns.map((concern) => {
          const isActive = concern.id === activeConcern.id;
          const isWarningChip = Boolean(concern.isEmergencyPathway);
          return (
            <button
              key={concern.id}
              type="button"
              onClick={() => handleSelect(concern)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? isWarningChip
                    ? 'bg-rose-700 text-white shadow-xs border border-rose-700'
                    : 'bg-[#18372b] text-white shadow-xs border border-[#18372b]'
                  : isWarningChip
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200'
                  : 'bg-stone-50 hover:bg-stone-100 text-[#283830] border border-[#dce4da]'
              }`}
            >
              {concern.name}
            </button>
          );
        })}
      </div>

      {/* Single Small Information Strip */}
      {isEmergency ? (
        <div className="mt-2.5 p-2.5 rounded-[10px] bg-rose-50 border border-rose-200 text-xs text-rose-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-start gap-2">
            <ShieldAlert size={15} className="text-rose-700 flex-shrink-0 mt-0.5" />
            <p className="text-rose-900 text-[11.5px] leading-snug">
              <strong>{activeConcern.name}:</strong> {activeConcern.emergencyNotice || activeConcern.description}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenConsult}
            className="font-extrabold text-xs text-rose-800 hover:text-rose-950 underline whitespace-nowrap self-end sm:self-auto flex-shrink-0"
          >
            Consult Doctor →
          </button>
        </div>
      ) : (
        <div className="mt-2 px-3 py-1.5 rounded-[9px] bg-[#f4f7f2] border border-[#dbe6d9] text-[11px] text-[#203728] flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3">
          <div className="leading-snug">
            <span className="font-bold text-[#18372b]">{activeConcern.name}: </span>
            <span className="text-[#3c5445]">{activeConcern.shortDesc || activeConcern.description}</span>
          </div>

          {activeConcern.requiresDoctorGuidance && (
            <button
              type="button"
              onClick={onOpenConsult}
              className="font-extrabold text-[#1c513d] hover:text-[#123b2d] underline whitespace-nowrap self-start sm:self-auto flex-shrink-0 inline-flex items-center gap-1"
            >
              <span>Consult Doctor</span>
              <Stethoscope size={11} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
