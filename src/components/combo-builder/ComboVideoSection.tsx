'use client';

import React, { useState } from 'react';
import { ChevronDown, Play, Volume2, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';
import { VIDEO_LANGUAGES } from '@/data/comboBuilderData';
import { VideoLanguageOption } from '@/types/combo';
import { trackComboEvent } from '@/lib/comboAnalytics';

export const ComboVideoSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<VideoLanguageOption>(VIDEO_LANGUAGES[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSelectLanguage = (lang: VideoLanguageOption) => {
    setSelectedLanguage(lang);
    trackComboEvent({
      event: 'video_language',
      language: lang.label,
      available: lang.isAvailable,
    });
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
    trackComboEvent({
      event: 'video_play',
      language: selectedLanguage.label,
      is_master: Boolean(selectedLanguage.isMaster),
    });
  };

  return (
    <div className="border-t border-[#e4e7df] bg-[#f0eee6]/80 rounded-[18px] overflow-hidden my-6">
      {/* Expandable Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#e9e6dc] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#18372b] text-white flex items-center justify-center text-xs pl-0.5 flex-shrink-0">
            ▶
          </div>
          <div>
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#8a6020] block">
              OPTIONAL CLINICAL GUIDE
            </span>
            <strong className="text-sm font-sans text-[#18372b]">
              Watch Product Explainer Guide (Tamil Master &amp; Dubbed Editions)
            </strong>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#18372b]">
          <span>{isOpen ? 'Collapse Guide' : 'Watch Explainer'}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Expanded Content */}
      {isOpen && (
        <div className="p-5 sm:p-7 border-t border-[#e4e0d4] bg-white grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-in fade-in duration-200">
          {/* Video Visual Frame */}
          <div className="lg:col-span-6 relative bg-gradient-to-br from-[#103829] via-[#123d2e] to-[#142e27] min-h-[220px] rounded-[16px] flex items-center justify-center p-6 text-white overflow-hidden">
            {!isPlaying ? (
              <div className="text-center z-10 space-y-3 max-w-sm">
                <button
                  type="button"
                  onClick={handlePlayVideo}
                  aria-label={`Play product explainer in ${selectedLanguage.label}`}
                  className="w-16 h-16 rounded-full bg-white text-[#123b2d] flex items-center justify-center text-2xl pl-1 mx-auto shadow-md hover:scale-105 active:scale-95 transition-all border-0"
                >
                  ▶
                </button>
                <div className="text-[11px] uppercase tracking-wider text-[#f2e5cf] font-bold">
                  {selectedLanguage.label} {selectedLanguage.isMaster ? '(Master)' : 'Edition'}
                </div>
                <p className="text-xs text-[#dce8df]">
                  Learn how to safely combine and apply the 13 formulations.
                </p>
              </div>
            ) : (
              <div className="text-center p-4 z-10 space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#dba95c] text-[#123b2d] flex items-center justify-center mx-auto text-lg font-bold">
                  ▶
                </div>
                <h4 className="font-serif text-lg font-bold text-white">
                  {selectedLanguage.label} Video Preview
                </h4>
                <p className="text-xs text-stone-200">
                  {selectedLanguage.statusNote}.
                </p>
                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  className="mt-2 px-3 py-1.5 rounded-[8px] bg-white/20 text-xs text-white hover:bg-white/30"
                >
                  Close Player
                </button>
              </div>
            )}
          </div>

          {/* Language Switcher & Notes */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8a6020] block mb-1">
                SELECT A LANGUAGE
              </span>
              <p className="text-xs text-[#283830] leading-relaxed">
                Choose a language below. The Tamil recording serves as the verified master audio.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {VIDEO_LANGUAGES.map((lang) => {
                const isSelected = selectedLanguage.id === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => handleSelectLanguage(lang)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#214a37] text-white shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-[#283830] border border-[#d9dfd1]'
                    }`}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-[9px] bg-[#FAF9F5] border border-[#d6ded5] text-xs text-[#203728]">
              <strong>{selectedLanguage.label}:</strong> {selectedLanguage.statusNote}.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
