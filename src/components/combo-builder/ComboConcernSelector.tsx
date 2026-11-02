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
    <div className="bg-white rounded-[20px] border border-[#e4e7df] p-6 mb-6 shadow-xs">
      <div className="font-extrabold text-[13px] text-[#18372b] mb-1.5 tracking-wide">
        {title}
      </div>

      <p className="text-xs text-[#3c4f44] mb-4 leading-relaxed font-sans">
        {description}
      </p>

      {/* Concern Chips */}
      <div className="flex flex-wrap gap-2">
        {concerns.map((concern) => {
          const isActive = concern.id === activeConcern.id;
          const isWarningChip = Boolean(concern.isEmergencyPathway);
          return (
            <button
              key={concern.id}
              type="button"
              onClick={() => handleSelect(concern)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                isActive
                  ? isWarningChip
                    ? 'bg-rose-700 text-white shadow-xs border border-rose-700'
                    : 'bg-[#1c513d] text-white shadow-xs border border-[#1c513d]'
                  : isWarningChip
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200'
                  : 'bg-white hover:bg-stone-50 text-[#283830] border border-[#dce4da]'
              }`}
            >
              {concern.name}
            </button>
          );
        })}
      </div>

      {/* Dynamic Concern Description */}
      {isEmergency ? (
        <div className="mt-4 p-4 rounded-[12px] bg-rose-50 border border-rose-200 text-xs text-rose-950 leading-[1.6] space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-rose-800 text-[13px]">
            <ShieldAlert size={16} className="text-rose-700 flex-shrink-0" />
            <span>Clinical Notice & Medical Safeguard</span>
          </div>
          <p className="text-rose-900">
            <strong>{activeConcern.name}:</strong> {activeConcern.description}
          </p>
          {activeConcern.emergencyNotice && (
            <div className="pt-2 border-t border-rose-200 text-[11.5px] text-rose-900 font-medium">
              {activeConcern.emergencyNotice}
            </div>
          )}
          <div className="pt-1 flex items-center justify-between gap-3">
            <span className="text-[11px] text-rose-800">
              Do not delay standard clinical care for acute symptoms.
            </span>
            <button
              type="button"
              onClick={onOpenConsult}
              className="font-extrabold text-rose-800 hover:text-rose-950 underline whitespace-nowrap inline-flex items-center gap-1"
            >
              <span>Speak to Doctor</span>
              <Stethoscope size={12} />
            </button>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};
