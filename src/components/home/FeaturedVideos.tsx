'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ArrowRight, X, Sparkles } from 'lucide-react';

interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  subtitle: string;
  description: string;
  linkHref: string;
  linkLabel: string;
  tag: string;
  thumbnail: string;
}

const VIDEOS: VideoItem[] = [
  {
    id: 'boozliv-video',
    youtubeId: 'SNldVaowTzU',
    title: 'Discover BoozLiv',
    subtitle: 'Liver Wellness & Botanical Care',
    description: 'Learn how BoozLiv supports healthy liver function, appetite restoration, and natural metabolic detox.',
    linkHref: '/product/boozliv',
    linkLabel: 'Explore BoozLiv',
    tag: 'Clinical Research Backed',
    thumbnail: 'https://img.youtube.com/vi/SNldVaowTzU/maxresdefault.jpg',
  },
  {
    id: 'skincare-video',
    youtubeId: 'pcjHM-aCKJE',
    title: 'Explore Our Skin Care Combo',
    subtitle: 'Custom Ayurvedic Routine',
    description: 'See how our 13 botanical formulations work synergistically for clear, nourished, and healthy skin.',
    linkHref: '/combo-builder/skin-care',
    linkLabel: 'Build Skin Care Combo',
    tag: 'Customizable Regimen',
    thumbnail: 'https://img.youtube.com/vi/pcjHM-aCKJE/maxresdefault.jpg',
  },
];

export const FeaturedVideos: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  return (
    <section className="py-9 sm:py-16 lg:py-20 bg-[#FAF9F5] border-t border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage text-primary text-xs font-semibold mb-2.5">
            <Sparkles size={13} className="text-gold" />
            <span className="tracking-wider uppercase">FEATURED VIDEOS</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
            Discover What Makes Them Special
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#37443D] max-w-xl mx-auto">
            Get a closer look at two AyurRaksha favourites—BoozLiv and our Skin Care Combo.
          </p>
        </div>

        {/* Video Cards Grid: Two video cards side by side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {VIDEOS.map((item) => (
            <div
              key={item.id}
              className="flex flex-col bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-card-hover transition-all duration-300 group"
            >
              {/* Video Thumbnail with Prominent Play Button */}
              <div
                className="relative aspect-[16/9] w-full bg-stone-900 cursor-pointer overflow-hidden"
                onClick={() => setActiveVideo(item)}
              >
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Tag Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0D2E22]/90 text-white backdrop-blur-xs border border-white/10">
                  {item.tag}
                </div>

                {/* Prominent Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    type="button"
                    aria-label={`Play ${item.title}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 hover:bg-white text-primary flex items-center justify-center shadow-xl transform transition-all duration-300 group-hover:scale-110 active:scale-95 group-hover:shadow-2xl"
                  >
                    <Play size={28} className="fill-primary text-primary ml-1" />
                  </button>
                </div>

                {/* Video Duration / Watch indicator */}
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-black/75 text-white backdrop-blur-xs">
                  Watch Video
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between space-y-4">
                <div>
                  <span className="text-xs font-bold text-primary/80 uppercase tracking-wider block mb-1">
                    {item.subtitle}
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-primary group-hover:text-primary-dark transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#37443D] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveVideo(item)}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark group-hover:underline"
                  >
                    <Play size={15} className="fill-primary" />
                    <span>Watch Video</span>
                  </button>

                  <Link
                    href={item.linkHref}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-charcoal hover:text-primary transition-colors"
                  >
                    <span>{item.linkLabel}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0D2E22] text-white">
              <h3 id="video-modal-title" className="text-sm sm:text-base font-bold truncate pr-4">
                {activeVideo.title} • {activeVideo.subtitle}
              </h3>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Responsive 16:9 iframe embed */}
            <div className="relative aspect-[16/9] w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
