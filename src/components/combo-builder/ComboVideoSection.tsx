'use client';

import React, { useState } from 'react';
import { Play, Volume2, Globe, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { VIDEO_LANGUAGES } from '@/data/comboBuilderData';
import { VideoLanguageOption } from '@/types/combo';
import { trackComboEvent } from '@/lib/comboAnalytics';

interface ComboVideoSectionProps {
  onOpenConsult: () => void;
}

export const ComboVideoSection: React.FC<ComboVideoSectionProps> = ({ onOpenConsult }) => {
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

  const handleSkipToBuilder = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('builder-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="video-guide" className="py-12 sm:py-16 bg-[#F8F7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Video Player / Thumbnail */}
          <div className="lg:col-span-6 relative bg-gradient-to-br from-[#123829] to-[#1E5640] min-h-[320px] sm:min-h-[400px] flex items-center justify-center p-6 text-white overflow-hidden">
            {/* Ambient pattern */}
            <div
              className="absolute inset-4 rounded-2xl border border-white/15 pointer-events-none"
              aria-hidden="true"
            />

            {!isPlaying ? (
              <div className="text-center z-10 space-y-4 max-w-sm">
                <button
                  type="button"
                  onClick={handlePlayVideo}
                  aria-label={`Play product explainer in ${selectedLanguage.label}`}
                  className="group relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-white text-[#123829] shadow-xl hover:scale-105 active:scale-95 transition-all mx-auto"
                >
                  <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                  <Play size={32} className="fill-[#123829] translate-x-0.5" />
                </button>

                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-widest text-[#f0c27d] font-bold">
                    {selectedLanguage.label} {selectedLanguage.isMaster ? '(Original Master)' : 'Edition'}
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-normal text-white">
                    Collection Explainer &amp; Regimen Guide
                  </h3>
                  <p className="text-xs text-emerald-100/80 leading-relaxed">
                    Watch our Ayurvedic practitioner explain how to combine topical and internal formulations safely.
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-[11px] text-emerald-200">
                  <Volume2 size={13} />
                  <span>Duration: ~3 mins • Optional educational guide</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-4 text-center z-10 bg-black/40 rounded-xl">
                {selectedLanguage.isAvailable ? (
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[#dba95c] text-[#123829] flex items-center justify-center mx-auto shadow-lg">
                      <Play size={24} className="fill-[#123829] translate-x-0.5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-heading text-xl font-bold text-white">
                        Tamil Master Explainer Ready
                      </h4>
                      <p className="text-xs text-stone-200 max-w-md">
                        AyurRaksha 13-product overview and application guidelines. You can skip at any time and build your combo.
                      </p>
                    </div>
                    <div className="pt-2 flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPlaying(false)}
                        className="px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-xs text-white"
                      >
                        Close Preview
                      </button>
                      <a
                        href="#builder-catalog"
                        onClick={handleSkipToBuilder}
                        className="px-4 py-2 rounded-lg bg-[#dba95c] text-[#123829] text-xs font-bold"
                      >
                        Continue to Builder
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 p-4 bg-white/10 rounded-2xl border border-white/20 max-w-md">
                    <AlertCircle size={28} className="text-[#f0c27d] mx-auto" />
                    <h4 className="text-sm font-bold text-white">
                      {selectedLanguage.label} Audio In Production
                    </h4>
                    <p className="text-xs text-emerald-100 leading-relaxed">
                      {selectedLanguage.statusNote}. To maintain clinical accuracy and dosage precision, AI-dubbed versions are undergoing physician sign-off. Please view the Tamil master or proceed with the builder.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSelectLanguage(VIDEO_LANGUAGES[0])}
                      className="px-4 py-2 rounded-lg bg-white text-[#123829] text-xs font-bold"
                    >
                      Switch to Tamil Master
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Explainer Copy and Language Selector */}
          <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#ab8345] block mb-2">
                Watch &amp; Learn — Optional
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-normal text-[#123b2d] leading-snug">
                Want to know more about our skin care formulations?
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
                Watch our product explainer to understand each formulation, how products are intended to be layered, and how to compare your choices before building your combo.
              </p>
            </div>

            {/* Language Selector */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
                <Globe size={14} className="text-[#b59661]" />
                <span>Choose Language for Explainer</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {VIDEO_LANGUAGES.map((lang) => {
                  const isSelected = selectedLanguage.id === lang.id;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => handleSelectLanguage(lang)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#18372b] text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-[10px] opacity-75">({lang.nativeLabel})</span>
                      {lang.isMaster && (
                        <span className="ml-1 w-2 h-2 rounded-full bg-emerald-400" title="Master video available" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Status Note */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80 text-[11px] text-stone-600 leading-relaxed">
                {selectedLanguage.isAvailable ? (
                  <>
                    <CheckCircle2 size={15} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>{selectedLanguage.label}:</strong> {selectedLanguage.statusNote}. Complete overview of all 13 products with application steps.
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={15} className="text-amber-700 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>{selectedLanguage.label}:</strong> {selectedLanguage.statusNote}. You can watch the Tamil master or proceed directly to shopping.
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handlePlayVideo}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#18372b] hover:bg-[#23533e] text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
              >
                <Play size={15} className="fill-white" />
                <span>Watch the Explainer</span>
              </button>

              <a
                href="#builder-catalog"
                onClick={handleSkipToBuilder}
                className="inline-flex items-center justify-center gap-1.5 text-xs text-stone-600 hover:text-[#18372b] font-semibold py-2 underline transition-colors"
              >
                <span>Skip video and build my combo</span>
                <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
