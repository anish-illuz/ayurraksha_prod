'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, CheckCircle2, ArrowRight } from 'lucide-react';

interface VideoEpisode {
  id: string;
  youtubeId: string;
  episodeNumber?: number;
  badge: string;
  duration: string;
  title: string;
  subtitle: string;
  description?: string;
  isMain?: boolean;
}

const FEATURED_MAIN_VIDEO: VideoEpisode = {
  id: 'main-consultation',
  youtubeId: 'eaOVntVtuSc',
  badge: 'CLINICAL DISCUSSION & DOCTOR Q&A',
  duration: '12:45 Mins',
  title: 'In-Depth Doctor Consultation: The Science of Liver Regeneration',
  subtitle: 'Chief Siddha Physician breaks down how active botanicals like Nilavembu and Keelaneli act at the micro-cellular hepatocyte level to clear fatty accumulation and stabilize liver enzymes.',
  description:
    'Chief Siddha Physician breaks down how active botanicals like Nilavembu and Keelaneli act at the micro-cellular hepatocyte level to clear fatty accumulation and stabilize liver enzymes.',
  isMain: true,
};

const PLAYLIST_EPISODES: VideoEpisode[] = [
  {
    id: 'episode-1',
    youtubeId: 'XCaFz5uwSWE',
    episodeNumber: 1,
    badge: 'EPISODE 1',
    duration: '08:20',
    title: 'Understanding Fatty Liver & Alcohol Damage - Dr. Consultation',
    subtitle: 'Early signs of sluggish metabolism and lipid overload.',
    description:
      'Detailed clinical overview of early fatty liver signs, hepatic lipid accumulation, and how targeted botanical formulations reverse cellular overload.',
  },
  {
    id: 'episode-2',
    youtubeId: 'o8m9RS18tSU',
    episodeNumber: 2,
    badge: 'EPISODE 2',
    duration: '06:42',
    title: 'Reversing High SGOT & SGPT with Siddha Herbs',
    subtitle: 'How 10ml liquid sachets maximize bioavailability.',
    description:
      'Clinical discussion on normalising elevated hepatic enzyme profiles (SGOT, SGPT, Bilirubin) using high-bioavailability liquid herbal decoctions.',
  },
  {
    id: 'episode-3',
    youtubeId: 'xnDfY-FIPjk',
    episodeNumber: 3,
    badge: 'EPISODE 3',
    duration: '10:15',
    title: 'Patient Journey - Overcoming Liver Fatigue & Cirrhosis Early Stage',
    subtitle: 'Real report readings before & after 60-day protocol.',
    description:
      'A patient recounts their 60-day recovery protocol, discussing verified ultrasound findings and blood report improvements.',
  },
];

export const BoozlivSpecialSections: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<VideoEpisode>(FEATURED_MAIN_VIDEO);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const handleSelectVideo = (video: VideoEpisode) => {
    setActiveVideo(video);
    setIsPlaying(true);
  };

  return (
    <div className="mt-10 sm:mt-14 space-y-10 sm:space-y-14">
      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: VIDEO HUB (Doctor Insights & Patient Journeys)    */}
      {/* ------------------------------------------------------------- */}
      <section aria-label="Expert Video Insights" className="space-y-6 sm:space-y-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-botanical uppercase tracking-wider block mb-2">
            EXPERT DISCUSSIONS &amp; REAL EXPERIENCES
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest leading-tight mb-2.5">
            Watch: Doctor Insights &amp; Patient Journeys
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/75 font-sans leading-relaxed max-w-2xl mx-auto">
            Discover clinical discussions on Siddha liver formulation and verified video testimonials explaining
            how Boozliv supports metabolic liver wellness.
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

                  {/* Top-Left Category Badge */}
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

                  {/* Bottom-Right Duration Indicator */}
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-black/80 text-white backdrop-blur-xs">
                    {activeVideo.duration}
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
                {activeVideo.description || activeVideo.subtitle}
              </p>

              {/* Verified Interview Footer */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-sans">
                <div className="inline-flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
                  <span>Verified Clinical Interview</span>
                </div>
                <span className="text-stone-400 font-medium">AyurRaksha Media Archive</span>
              </div>
            </div>
          </div>

          {/* Right Column: Playlist Episode Cards + Disclaimer Banner */}
          <div className="lg:col-span-5 flex flex-col space-y-3 sm:space-y-3.5">
            {PLAYLIST_EPISODES.map((ep) => {
              const isSelected = activeVideo.id === ep.id;
              return (
                <div
                  key={ep.id}
                  onClick={() => handleSelectVideo(ep)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectVideo(ep);
                    }
                  }}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 flex items-center gap-3.5 cursor-pointer group bg-white shadow-2xs ${
                    isSelected
                      ? 'border-emerald-700 ring-2 ring-emerald-700/15'
                      : 'border-stone-200/90 hover:border-emerald-600/40 hover:bg-[#FAF7F2]'
                  }`}
                >
                  {/* Episode Thumbnail */}
                  <div className="relative w-28 sm:w-32 aspect-video bg-stone-900 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={`https://img.youtube.com/vi/${ep.youtubeId}/mqdefault.jpg`}
                      alt={ep.title}
                      fill
                      sizes="140px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-[#16382C]/90 text-white flex items-center justify-center shadow-sm">
                        <Play size={11} className="fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-black/80 text-white">
                      {ep.duration}
                    </div>
                  </div>

                  {/* Episode Info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-0.5">
                      {ep.badge}
                    </span>
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-forest leading-snug line-clamp-2 group-hover:text-emerald-900 transition-colors">
                      {ep.title}
                    </h4>
                    <p className="text-[11px] text-charcoal/70 font-sans line-clamp-1 mt-0.5">
                      {ep.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Bottom Practitioner Notice Banner */}
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#EDF8F2] border border-emerald-500/20 flex items-center justify-center gap-2 text-center text-xs font-semibold text-emerald-900">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
              <span>All discussions led by qualified Ayurvedic and Siddha practitioners.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: CLINICAL REPORT BANNER (Backed by Human Findings) */}
      {/* ------------------------------------------------------------- */}
      <section
        aria-label="Clinical Findings"
        className="rounded-2xl sm:rounded-3xl bg-[#143527] p-6 sm:p-8 lg:p-10 border border-emerald-500/20 shadow-sm text-white"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 tracking-wider uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span>CLINICALLY STUDIED EFFICACY</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
              Backed by Peer-Reviewed Human Clinical Findings
            </h2>
            <p className="text-white/80 text-xs sm:text-sm font-sans leading-relaxed">
              Successfully studied for reversing early-stage fatty liver, supporting cirrhosis care, jaundice
              alleviation, and alcohol-induced toxin clearance in comprehensive cohort studies.
            </p>
          </div>

          <div className="shrink-0">
            <a
              href="https://cms.ayurrakshaonline.com/wp-content/uploads/2026/11/BoozLiv-Clinical-Report.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-[#143527] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap group"
            >
              <span>VIEW CLINICAL REPORT (PDF)</span>
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
