'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface LanguageVideo {
  id: string;
  youtubeId: string;
  language: string;
}

// Language versions of the Divine Healing Oil product video.
const LANGUAGE_VIDEOS: LanguageVideo[] = [
  { id: 'tamil', youtubeId: '5OnBsPBa9Tk', language: 'Tamil' },
  { id: 'english', youtubeId: '1b6MScpZKkU', language: 'English' },
  { id: 'hindi', youtubeId: 'utPPt2DHIDM', language: 'Hindi' },
  { id: 'telugu', youtubeId: 'Ow-jHFaJEH8', language: 'Telugu' },
];

/**
 * A basic product video section for the Divine Healing Oil PDP, with the
 * video available in Tamil, English, Hindi and Telugu.
 */
export const DivineHealingOilVideoHub: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<LanguageVideo>(LANGUAGE_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleSelectVideo = (video: LanguageVideo) => {
    setActiveVideo(video);
    setIsPlaying(true);
  };

  return (
    <section aria-label="Product Video" className="mt-10 sm:mt-14 space-y-6">
      {/* Section Heading */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest leading-tight mb-2">
          Watch &amp; Learn About Divine Healing Oil
        </h2>
      </div>

      {/* Player + Language Options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Player Card */}
        <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden">
          <div className="relative aspect-video w-full bg-stone-950 overflow-hidden group">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={`${activeVideo.language} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <>
                <Image
                  src={`https://img.youtube.com/vi/${activeVideo.youtubeId}/hqdefault.jpg`}
                  alt={`${activeVideo.language} video`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-md bg-[#16382C]/90 text-white text-[11px] font-bold uppercase tracking-wider border border-white/10">
                  {activeVideo.language}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    aria-label={`Play ${activeVideo.language} video`}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#16382C]/90 hover:bg-[#16382C] text-white flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 active:scale-95 cursor-pointer border border-white/20"
                  >
                    <Play size={24} className="fill-white text-white ml-1" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Language Options */}
        <div className="lg:col-span-4 flex flex-col gap-2.5">
          {LANGUAGE_VIDEOS.map((video) => {
            const isSelected = activeVideo.id === video.id;
            return (
              <button
                key={video.id}
                type="button"
                onClick={() => handleSelectVideo(video)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-emerald-700 ring-2 ring-emerald-700/15 bg-white'
                    : 'border-stone-200/90 bg-white hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="relative w-20 aspect-video bg-stone-900 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={`https://img.youtube.com/vi/${video.youtubeId}/default.jpg`}
                    alt={video.language}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <span className={`text-sm font-bold ${isSelected ? 'text-emerald-800' : 'text-forest'}`}>
                  {video.language}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
