'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Play, X } from 'lucide-react';
import { VIDEO_LANGUAGES } from '@/data/comboBuilderData';
import { VideoLanguageOption } from '@/types/combo';
import { trackComboEvent } from '@/lib/comboAnalytics';

// Tamil Master clinical explainer video for Skin Care Combo Builder
const TAMIL_VIDEO_ID = 'uAMSahKWTvQ';

export const ComboVideoSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<VideoLanguageOption>(VIDEO_LANGUAGES[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  // User requirement: Only show Tamil in this section for now; hide other languages while keeping the layout identical.
  const visibleLanguages = VIDEO_LANGUAGES.filter((lang) => lang.id === 'ta');

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
          <div className="lg:col-span-6 relative bg-gradient-to-br from-[#103829] via-[#123d2e] to-[#142e27] aspect-video w-full rounded-[16px] flex items-center justify-center text-white overflow-hidden shadow-xs">
            {isPlaying ? (
              <div className="relative w-full h-full bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${TAMIL_VIDEO_ID}?autoplay=1&rel=0`}
                  title="Skin Care Combo Explainer Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  className="absolute top-2.5 right-2.5 z-10 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-white/10"
                >
                  <X size={14} />
                  <span>Close Player</span>
                </button>
              </div>
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center group">
                {/* Background YouTube Thumbnail with soft overlay */}
                <Image
                  src={`https://img.youtube.com/vi/${TAMIL_VIDEO_ID}/hqdefault.jpg`}
                  alt="Tamil Video Explainer"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-30 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#103829]/90 via-[#103829]/70 to-[#103829]/50" />

                {/* Center Content Matching Reference Design Image 6.png */}
                <div className="relative z-10 space-y-2.5 max-w-sm">
                  <button
                    type="button"
                    onClick={handlePlayVideo}
                    aria-label="Play Tamil Video Explainer"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#dba95c] hover:bg-[#e6b566] text-[#123b2d] flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 active:scale-95 transition-all cursor-pointer border-0"
                  >
                    <Play size={24} className="fill-[#123b2d] text-[#123b2d] ml-1" />
                  </button>

                  <h4 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                    Tamil Video Preview
                  </h4>

                  <p className="text-xs text-stone-200 font-sans">
                    Master clinical explainer video.
                  </p>

                  <div className="pt-1.5">
                    <button
                      type="button"
                      onClick={handlePlayVideo}
                      className="px-4 py-1.5 rounded-[8px] bg-white/20 hover:bg-white/30 text-xs font-semibold text-white transition-colors cursor-pointer border border-white/20 shadow-xs"
                    >
                      Play Video
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Language Switcher & Notes (Layout kept identical, only Tamil visible) */}
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
              {visibleLanguages.map((lang) => {
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
