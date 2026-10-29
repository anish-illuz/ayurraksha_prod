'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProductBySlug } from '@/lib/products';
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
  secondaryLink: string;
  secondaryLabel: string;
}

// Full-bleed master banner artwork across both mobile and desktop
const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'boozliv',
    title: 'BoozLiv. Rooted in Ayurveda.',
    tag: 'Flagship Liver Care & Detox',
    desktopImageSrc: '/images/banners/boozliv.webp',
    mobileImageSrc: '/images/banners/boozliv-mobile.webp',
    imageAlt: 'BoozLiv Herbal Tonic & Sachet by AyurRaksha - Rooted in Ayurveda',
    primaryLink: '/product/boozliv',
    primaryLabel: 'Explore BoozLiv',
    secondaryLink: '/shop?sort=bestseller',
    secondaryLabel: 'View Bestsellers',
  },
  {
    id: 'cardiac-combo',
    title: 'Nourish Your Heart. Support Healthy Circulation.',
    tag: 'Heart Vitality & Blood Pressure',
    desktopImageSrc: '/images/banners/cardiac-combo.webp',
    mobileImageSrc: '/images/banners/cardiac-combo-mobile.webp',
    imageAlt: 'AyurRaksha Cardiac Health Combo - Save Heart, Laxa Health Tea, Dia Well',
    primaryLink: '/product/ayur-raksha-cardiac-combo',
    primaryLabel: 'Shop Cardiac Combo',
    secondaryLink: '/category/health-packs',
    secondaryLabel: 'View All Combos',
  },
  {
    id: 'healing-oil',
    title: 'Move With Ease. Soothe Joint & Knee Pain.',
    tag: 'Fast Joint & Muscle Relief',
    desktopImageSrc: '/images/banners/healing-oil.webp',
    mobileImageSrc: '/images/banners/healing-oil-mobile.webp',
    imageAlt: 'AyurRaksha Divine Healing Oil - Joint, Muscle & Knee Pain Relief',
    primaryLink: '/product/divine-healing-oil',
    primaryLabel: 'Shop Divine Healing Oil',
    secondaryLink: '/concern/pain-joints',
    secondaryLabel: 'Browse Pain Relief',
  },
  {
    id: 'purna-sakthi',
    title: 'Pure Natural Energy. Zero Afternoon Crashes.',
    tag: 'Natural Energy & Stamina',
    desktopImageSrc: '/images/banners/purna-sakthi.webp',
    mobileImageSrc: '/images/banners/purna-sakthi-mobile.webp',
    imageAlt: 'Purna Sakthi Restorative Herbal Tonic by AyurRaksha - Energy & Vitality',
    primaryLink: '/product/purna-sakthi-tonic',
    primaryLabel: 'Shop Purna Sakthi',
    secondaryLink: '/category/tonic',
    secondaryLabel: 'Browse Tonics',
  },
];

const AUTOPLAY_INTERVAL = 6000; // 6 seconds per slide

export const Hero: React.FC = () => {

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwiping = useRef<boolean>(false);

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
          return (
            <div key={slide.id} className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
              aria-hidden={!isActive} role="group" aria-roledescription="slide" aria-label={`${idx + 1} of ${total}: ${slide.title}`}>
              {/* Mobile Banner Artwork */}
              <Link href={slide.primaryLink} tabIndex={isActive ? 0 : -1} className="md:hidden relative w-full h-full block cursor-pointer" aria-label={slide.primaryLabel}>
                <Image src={slide.mobileImageSrc} alt={slide.imageAlt} fill priority={idx === 0} sizes="100vw" className="object-cover object-center w-full h-full" />
              </Link>
              {/* Desktop Banner Artwork */}
              <Link href={slide.primaryLink} tabIndex={isActive ? 0 : -1} className="hidden md:block relative w-full h-full cursor-pointer" aria-label={slide.primaryLabel}>
                <Image src={slide.desktopImageSrc} alt={slide.imageAlt} fill priority={idx === 0} sizes="100vw" className="object-cover object-center w-full h-full" />
              </Link>
              {isActive && <Link href={slide.secondaryLink} aria-label={slide.secondaryLabel} className="hidden md:block absolute left-[23%] bottom-[14%] w-[16%] h-[16%] rounded-full focus:ring-2 focus:ring-primary" />}
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
