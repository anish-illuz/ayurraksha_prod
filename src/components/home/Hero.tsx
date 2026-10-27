'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface BannerSlide {
  id: string;
  title: string;
  tag: string;
  desktopImageSrc: string;
  imageAlt: string;
  primaryLink: string;
  primaryLabel: string;
  secondaryLink: string;
  secondaryLabel: string;
}

// 4 Flagship Hero Banners - completely cleaned of side navigation arrows and non-flagship slides
const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'boozliv',
    title: 'BoozLiv. Rooted in Ayurveda.',
    tag: 'Flagship Liver Care & Detox',
    desktopImageSrc: '/images/banners/boozliv.webp',
    imageAlt: 'BoozLiv Herbal Tonic & Sachet by Ayur Raksha - Rooted in Ayurveda',
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
    imageAlt: 'Ayur Raksha Cardiac Health Combo - Save Heart, Laxa Health Tea, Dia Well',
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
    imageAlt: 'Ayur Raksha Divine Healing Oil - Joint, Muscle & Knee Pain Relief',
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
    imageAlt: 'Purna Sakthi Restorative Herbal Tonic by Ayur Raksha - Energy & Vitality',
    primaryLink: '/product/purna-sakthi-tonic',
    primaryLabel: 'Shop Purna Sakthi',
    secondaryLink: '/category/tonic',
    secondaryLabel: 'Browse Tonics',
  },
];

const AUTOPLAY_INTERVAL = 6000; // 6 seconds per slide

export const Hero: React.FC = () => {
  const router = useRouter();
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
    if (isPaused) return;

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
    isSwiping.current = false;
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
    <section
      className="relative w-full overflow-hidden bg-[#FAF9F5]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Ayur Raksha Featured Formulations"
      aria-roledescription="carousel"
    >
      {/*
        Full-Bleed Master Banner across all devices (Mobile, Tablet, Laptop, Desktop):
        - Uses the authentic high-resolution master banner artwork with 0% distortion
        - Aspect ratio matched to master artwork: aspect-[2.2/1] on mobile, aspect-[2.28/1] on desktop
        - Clean full-bleed edge-to-edge presentation
        - Interactive hotspots mapped directly over the artwork's primary & secondary buttons
        - Left & Right navigation arrows completely removed as requested
      */}
      <div className="relative w-full aspect-[2.2/1] sm:aspect-[2.25/1] md:aspect-[2.28/1] min-h-[165px] sm:min-h-[220px] max-h-[720px] overflow-hidden select-none">
        {BANNER_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${total}: ${slide.title}`}
            >
              {/* Entire banner is a clickable link to product page */}
              <Link
                href={slide.primaryLink}
                tabIndex={isActive ? 0 : -1}
                className="block relative w-full h-full cursor-pointer focus:outline-hidden"
                title={`${slide.title} - ${slide.primaryLabel}`}
              >
                <Image
                  src={slide.desktopImageSrc}
                  alt={slide.imageAlt}
                  fill
                  priority={idx === 0}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
                  className="object-cover object-center w-full h-full"
                />

                <span className="sr-only">
                  {slide.title}. Click to shop {slide.primaryLabel}.
                </span>
              </Link>

              {/* Interactive CTA Hotspot Overlay (mapped directly over artwork buttons without visual duplication) */}
              {isActive && (
                <div className="absolute inset-0 pointer-events-none z-20">
                  {/* Primary CTA Button Hotspot (e.g. "Explore BoozLiv →") */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      router.push(slide.primaryLink);
                    }}
                    tabIndex={0}
                    aria-label={slide.primaryLabel}
                    title={slide.primaryLabel}
                    className="absolute left-[5%] sm:left-[6%] bottom-[12%] sm:bottom-[14%] w-[20%] sm:w-[18%] md:w-[16%] h-[18%] sm:h-[16%] rounded-full pointer-events-auto cursor-pointer focus:ring-2 focus:ring-primary focus:outline-hidden transition-all bg-transparent active:bg-black/10"
                  />

                  {/* Secondary CTA Button Hotspot (e.g. "View Bestsellers") */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      router.push(slide.secondaryLink);
                    }}
                    tabIndex={0}
                    aria-label={slide.secondaryLabel}
                    title={slide.secondaryLabel}
                    className="absolute left-[26%] sm:left-[25%] md:left-[23%] bottom-[12%] sm:bottom-[14%] w-[20%] sm:w-[18%] md:w-[16%] h-[18%] sm:h-[16%] rounded-full pointer-events-auto cursor-pointer focus:ring-2 focus:ring-primary focus:outline-hidden transition-all bg-transparent active:bg-black/10"
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Clean Centered Pagination Indicator Dots (No side arrows) */}
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/80 backdrop-blur-xs border border-stone-200/60 shadow-xs">
          {BANNER_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={`dot-${slide.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(idx);
                }}
                aria-label={`Go to slide ${idx + 1}: ${slide.title}`}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'w-5 sm:w-7 bg-primary shadow-2xs'
                    : 'w-1.5 sm:w-2 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
