'use client';

import React from 'react';
import {
  LayoutGrid,
  Droplets,
  Stethoscope,
  ShieldAlert,
  Eye,
  ScanFace,
  AlertTriangle,
  HelpCircle,
  Heart,
  type LucideIcon,
} from 'lucide-react';
import { SKIN_CONCERNS } from '@/data/comboBuilderData';
import { ComboConcern } from '@/types/combo';
import { trackComboEvent } from '@/lib/comboAnalytics';

// Concern icon lookup (by id, with a sensible fallback)
const CONCERN_ICONS: Record<string, LucideIcon> = {
  'explore-all': LayoutGrid,
  browse: LayoutGrid,
  dryness: Droplets,
  chronic: ScanFace,
  fungal: ShieldAlert,
  vitiligo: Eye,
  'visible-veins': Droplets,
  'dry-itchy': Droplets,
  darkening: ScanFace,
  'open-wound': AlertTriangle,
  'muscle-discomfort': Stethoscope,
  'digestive-routine': HelpCircle,
  'skin-guidance': Stethoscope,
  'breathing-difficulty': AlertTriangle,
  'general-heart': Heart,
  'leg-heaviness': Droplets,
  'digestive-interest': HelpCircle,
  'on-heart-meds': Stethoscope,
  'chest-pain': AlertTriangle,
};

interface ComboConcernSelectorProps {
  activeConcernId: string;
  onSelectConcern: (concern: ComboConcern) => void;
  onOpenConsult: () => void;
  concerns?: ComboConcern[];
}

export const ComboConcernSelector: React.FC<ComboConcernSelectorProps> = ({
  activeConcernId,
  onSelectConcern,
  onOpenConsult,
  concerns = SKIN_CONCERNS,
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
    <div className="space-y-2.5">
      {/* Concern Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
        {concerns.map((concern) => {
          const isActive = concern.id === activeConcern.id;
          const isWarningCard = Boolean(concern.isEmergencyPathway);
          const Icon = CONCERN_ICONS[concern.id] || HelpCircle;

          return (
            <button
              key={concern.id}
              type="button"
              onClick={() => handleSelect(concern)}
              className={`group text-left bg-white rounded-[14px] border p-3 sm:p-3.5 transition-all shadow-xs ${
                isWarningCard
                  ? 'border-rose-200 hover:border-rose-300'
                  : isActive
                  ? 'border-[#1c513b] ring-1 ring-[#1c513b] shadow-[0_6px_18px_rgba(17,64,39,0.08)]'
                  : 'border-[#e6e7e0] hover:border-stone-300'
              }`}
            >
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center mb-2.5 ${
                  isWarningCard
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-[#eef3ec] text-[#2e6845] group-hover:bg-[#e2ece1]'
                }`}
              >
                <Icon size={18} />
              </div>

              {/* Title */}
              <p
                className={`text-[12.5px] sm:text-[13px] font-extrabold leading-snug ${
                  isWarningCard ? 'text-rose-800' : 'text-[#18372b]'
                }`}
              >
                {concern.name}
              </p>

              {/* Short description */}
              <p className="text-[10.5px] sm:text-[11px] text-[#5c6f63] leading-snug mt-1 line-clamp-2">
                {concern.shortDesc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Single Small Information Strip */}
      {isEmergency ? (
        <div className="p-2.5 rounded-[10px] bg-rose-50 border border-rose-200 text-xs text-rose-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
        <div className="px-3 py-1.5 rounded-[9px] bg-[#f4f7f2] border border-[#dbe6d9] text-[11px] text-[#203728] flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3">
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
