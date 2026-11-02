'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
  id: string;
  title: string;
  tag: string;
  desktopImageSrc: string;
  mobileImageSrc: string;
  imageAlt: string;
  primaryLink: string;
  primaryLabel: string;
}

// Full-bleed master banner artwork across both mobile and desktop
const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'boozliv',
    title: 'Revive Your Liver. Reclaim Your Life with BoozLiv.',
    tag: 'Flagship Liver Care & Detox',
    desktopImageSrc: '/images/banners/boozliv.webp',
    mobileImageSrc: '/images/banners/boozliv-mobile.webp',
    imageAlt: 'BoozLiv Herbal Supplement by AyurRaksha - Revive Your Liver, Reclaim Your Life',
    primaryLink: '/product/boozliv',
    primaryLabel: 'Shop BoozLiv',
  },
  {
    id: 'skin-well-combo',
    title: 'Your Skin Deserves the Best of Ayurveda',
    tag: 'Complete Skin Care Therapy',
    desktopImageSrc: '/images/banners/skin-well-combo.webp',
    mobileImageSrc: '/images/banners/skin-well-combo-mobile.webp',
    imageAlt: 'AyurRaksha Skin Well Combo - Skin Well Capsules, Soap, Healing Oil & Ointment',
    primaryLink: '/product/skin-well-pack',
    primaryLabel: 'Shop Skin Well Combo',
  },
  {
    id: 'varicose-veins',
    title: 'Care for Your Veins. Move with Confidence.',
    tag: 'Varicose Veins Wellness Combo',
    desktopImageSrc: '/images/banners/varicose-veins.webp',
    mobileImageSrc: '/images/banners/varicose-veins-mobile.webp',
    imageAlt: 'AyurRaksha Varicose Veins Wellness Combo - Flow Well Pack, Detox Tea, Verico Prime & Foot Bath',
    primaryLink: '/product/flow-well-pack',
    primaryLabel: 'Shop Varicose Veins Combo',
  },
  {
    id: 'breathe-well',
    title: 'Breathe Better. Feel Clearer Every Day.',
    tag: 'Respiratory Wellness & Relief',
    desktopImageSrc: '/images/banners/breathe-well.webp',
    mobileImageSrc: '/images/banners/breathe-well-mobile.webp',
    imageAlt: 'AyurRaksha Breathe Well Combo - Esnovate Capsules, Detox Tea & Etioment Balm',
    primaryLink: '/product/ayur-raksha-breathe-well-pack',
    primaryLabel: 'Shop Breathe Well Combo',
  },
  {
    id: 'purna-sakthi',
    title: 'Natural Energy. Everyday Vitality.',
    tag: 'Natural Energy & Stamina',
    desktopImageSrc: '/images/banners/purna-sakthi.webp',
    mobileImageSrc: '/images/banners/purna-sakthi-mobile.webp',
    imageAlt: 'Purna Sakthi Ayurvedic Tonic by AyurRaksha - Natural Energy & Everyday Vitality',
    primaryLink: '/product/purna-sakthi-tonic',
    primaryLabel: 'Shop Purna Sakthi',
  },
];

const AUTOPLAY_INTERVAL = 6000; // 6 seconds per slide

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwiping = useRef<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = BANNER_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Autoplay timer with pause on hover
  useEffect(() => {
    if (isPaused || window.matchMedia('(max-width: 767px), (prefers-reduced-motion: reduce)').matches) return;

    const timer = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch Swipe Handlers for mobile & tablet (without interfering with button clicks)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = Math.abs(e.touches[0].clientX - touchStartX.current);
    const diffY = Math.abs(e.touches[0].clientY - touchStartY.current);
    if (diffX > 15 && diffX > diffY) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;
    if (isSwiping.current && Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
    // Keep swipe flag until next touch to suppress accidental clicks.
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#FAF9F5] touch-pan-y"
      onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
      onTouchCancel={() => { touchStartX.current = null; touchStartY.current = null; }}
      onClickCapture={(e) => { if (isSwiping.current) { e.preventDefault(); e.stopPropagation(); } }}
      onKeyDown={handleKeyDown} tabIndex={0} aria-label="AyurRaksha Featured Formulations" aria-roledescription="carousel">
      <div className="relative w-full aspect-[2.05/1] sm:aspect-[2.2/1] md:aspect-[2.28/1] min-h-[160px] sm:min-h-[180px] max-h-[720px] select-none">
        {BANNER_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          // Strictly render only the active slide to eliminate all competing image bandwidth on initial load
          const shouldRenderImage = idx === currentSlide;

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${total}: ${slide.title}`}
            >
              {shouldRenderImage ? (
                <Link
                  href={slide.primaryLink}
                  prefetch={false}
                  tabIndex={isActive ? 0 : -1}
                  className="relative w-full h-full block cursor-pointer"
                  aria-label={slide.primaryLabel}
                >
                  <picture className="w-full h-full block">
                    <source media="(min-width: 768px)" srcSet={slide.desktopImageSrc} />
                    <img
                      src={slide.mobileImageSrc}
                      alt={slide.imageAlt}
                      fetchPriority={idx === 0 ? 'high' : 'low'}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      decoding={idx === 0 ? 'sync' : 'async'}
                      className="object-cover object-center w-full h-full"
                      width={750}
                      height={373}
                    />
                  </picture>
                </Link>
              ) : null}
            </div>
          );
        })}
        <button type="button" onClick={prevSlide} aria-label="Previous slide" className="hidden md:flex absolute left-7 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/95 text-primary shadow-lg items-center justify-center"><ChevronLeft size={22} /></button>
        <button type="button" onClick={nextSlide} aria-label="Next slide" className="hidden md:flex absolute right-7 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/95 text-primary shadow-lg items-center justify-center"><ChevronRight size={22} /></button>
        <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 z-30 items-center gap-2 px-3 py-1.5 rounded-full bg-white/90">
          {BANNER_SLIDES.map((slide, idx) => <button key={slide.id} type="button" onClick={() => goToSlide(idx)} aria-label={`Go to slide ${idx + 1}`} aria-current={idx === currentSlide} className={`h-2 rounded-full ${idx === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-stone-300'}`} />)}
        </div>
      </div>
      <div className="md:hidden flex justify-center items-center gap-2 py-1.5 text-[10px] text-primary/70" aria-hidden="true">
        <span>Swipe to explore</span>{BANNER_SLIDES.map((slide, idx) => <span key={slide.id} className={`h-1 rounded-full ${idx === currentSlide ? 'w-4 bg-primary' : 'w-1 bg-primary/25'}`} />)}
      </div>
    </section>
  );
};
