'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, CheckCircle2 } from 'lucide-react';

interface LanguageVideo {
  id: string;
  youtubeId: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
}

// Language versions of the Divine Healing Oil product-guidance video.
const LANGUAGE_VIDEOS: LanguageVideo[] = [
  {
    id: 'tamil',
    youtubeId: '5OnBsPBa9Tk',
    badge: 'Tamil',
    title: 'Divine Healing Oil — Usage Guidance (Tamil)',
    subtitle: 'Practitioner demonstration of application, dosage and routine in Tamil.',
    description:
      'A qualified practitioner demonstrates how to apply Divine Healing Oil — correct dosage, daily routine and safety guidance — explained in Tamil.',
  },
  {
    id: 'english',
    youtubeId: '1b6MScpZKkU',
    badge: 'English',
    title: 'Divine Healing Oil — Usage Guidance (English)',
    subtitle: 'Practitioner demonstration of application, dosage and routine in English.',
    description:
      'A qualified practitioner demonstrates how to apply Divine Healing Oil — correct dosage, daily routine and safety guidance — explained in English.',
  },
  {
    id: 'hindi',
    youtubeId: 'utPPt2DHIDM',
    badge: 'Hindi',
    title: 'Divine Healing Oil — Usage Guidance (Hindi)',
    subtitle: 'Practitioner demonstration of application, dosage and routine in Hindi.',
    description:
      'A qualified practitioner demonstrates how to apply Divine Healing Oil — correct dosage, daily routine and safety guidance — explained in Hindi.',
  },
  {
    id: 'telugu',
    youtubeId: 'Ow-jHFaJEH8',
    badge: 'Telugu',
    title: 'Divine Healing Oil — Usage Guidance (Telugu)',
    subtitle: 'Practitioner demonstration of application, dosage and routine in Telugu.',
    description:
      'A qualified practitioner demonstrates how to apply Divine Healing Oil — correct dosage, daily routine and safety guidance — explained in Telugu.',
  },
];

/**
 * The "Usage Guidance Videos" hub — Divine Healing Oil's supporting media
 * section, offered in Tamil, English, Hindi and Telugu. Rendered below the
 * product details so the purchase path stays uncluttered.
 */
export const DivineHealingOilVideoHub: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<LanguageVideo>(LANGUAGE_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleSelectVideo = (video: LanguageVideo) => {
    setActiveVideo(video);
    setIsPlaying(true);
  };

  return (
    <div className="mt-10 sm:mt-14">
      <section aria-label="Usage Guidance Videos" className="space-y-6 sm:space-y-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-botanical uppercase tracking-wider block mb-2">
            PRACTITIONER-LED USAGE GUIDANCE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest leading-tight mb-2.5">
            Watch: How to Use Divine Healing Oil
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/75 font-sans leading-relaxed max-w-2xl mx-auto">
            Step-by-step application guidance led by a qualified practitioner, available in Tamil,
            English, Hindi and Telugu — choose your preferred language below.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Left Column: Featured Video Player Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden flex flex-col justify-between">
            {/* 16:9 Video Display Container */}
            <div className="relative aspect-video w-full bg-stone-950 overflow-hidden group">
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <>
                  <Image
                    src={`https://img.youtube.com/vi/${activeVideo.youtubeId}/hqdefault.jpg`}
                    alt={activeVideo.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Top-Left Language Badge */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#16382C]/90 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border border-white/10 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{activeVideo.badge}</span>
                  </div>

                  {/* Center Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(true)}
                      aria-label={`Play ${activeVideo.title}`}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#16382C]/90 hover:bg-[#16382C] text-white flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 active:scale-95 cursor-pointer border border-white/20"
                    >
                      <Play size={24} className="fill-white text-white ml-1" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Video Details Content */}
            <div className="p-5 sm:p-6 space-y-3">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-forest leading-snug">
                {activeVideo.title}
              </h3>
              <p className="text-xs sm:text-sm text-charcoal/80 font-sans leading-relaxed">
                {activeVideo.description}
              </p>

              {/* Practitioner Footer */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-sans">
                <div className="inline-flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
                  <span>Guided by a Qualified Practitioner</span>
                </div>
                <span className="text-stone-400 font-medium">AyurRaksha Media Archive</span>
              </div>
            </div>
          </div>

          {/* Right Column: Language Version Cards */}
          <div className="lg:col-span-5 flex flex-col space-y-3 sm:space-y-3.5">
            {LANGUAGE_VIDEOS.map((video) => {
              const isSelected = activeVideo.id === video.id;
              return (
                <div
                  key={video.id}
                  onClick={() => handleSelectVideo(video)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectVideo(video);
                    }
                  }}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 flex items-center gap-3.5 cursor-pointer group bg-white shadow-2xs ${
                    isSelected
                      ? 'border-emerald-700 ring-2 ring-emerald-700/15'
                      : 'border-stone-200/90 hover:border-emerald-600/40 hover:bg-[#FAF7F2]'
                  }`}
                >
                  {/* Language Thumbnail */}
                  <div className="relative w-28 sm:w-32 aspect-video bg-stone-900 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                      fill
                      sizes="140px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#16382C]/90 text-white flex items-center justify-center shadow-sm">
                        <Play size={11} className="fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Language Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-0.5">
                      {video.badge} VERSION
                    </span>
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-forest leading-snug line-clamp-2 group-hover:text-emerald-900 transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-[11px] text-charcoal/70 font-sans line-clamp-1 mt-0.5">
                      {video.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Bottom Practitioner Notice Banner */}
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#EDF8F2] border border-emerald-500/20 flex items-center justify-center gap-2 text-center text-xs font-semibold text-emerald-900">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
              <span>All guidance is led by qualified Ayurvedic and Siddha practitioners.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
