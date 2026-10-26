'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  ShieldCheck,
  Sparkles,
  Truck,
  CheckCircle2,
  Stethoscope,
  Award,
} from 'lucide-react';

interface HeroSlide {
  id: string;
  tag: string;
  headlineMain: string;
  headlineHighlight: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  priceNote: string;
  imageSrc: string;
  imageAlt: string;
  badge1: string;
  badge2: string;
  ratingText: string;
  bgGlow: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'boozliv',
    tag: 'Flagship Liver Care & Daily Detox',
    headlineMain: 'Revitalize Your Liver.',
    headlineHighlight: 'Feel Re-Energized Every Day.',
    description:
      'Doctor-formulated with 100% natural botanical extracts to maintain healthy liver enzymes, flush toxins, and promote smooth digestive comfort.',
    primaryCtaText: 'Shop BoozLiv Tonic',
    primaryCtaLink: '/product/boozliv',
    secondaryCtaText: 'Explore Best Sellers',
    secondaryCtaLink: '/shop?sort=bestseller',
    priceNote: 'Starting at ₹2,400 • Free Delivery Across India',
    imageSrc: 'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/1.png',
    imageAlt: 'BoozLiv Herbal Tonic by Ayurraksha',
    badge1: '100% Botanical Extracts',
    badge2: 'Targeted Liver Detox',
    ratingText: '4.9 ★ (180+ Reviews)',
    bgGlow: 'from-[#80A03C]/20 via-[#58702E]/15 to-transparent',
  },
  {
    id: 'cardiac-combo',
    tag: 'Heart Vitality & Blood Pressure',
    headlineMain: 'Nourish Your Heart.',
    headlineHighlight: 'Support Healthy Circulation.',
    description:
      'A comprehensive 2-bottle doctor-guided bundle crafted to strengthen heart muscles, support balanced cholesterol, and maintain everyday stamina.',
    primaryCtaText: 'Shop Cardiac Combo',
    primaryCtaLink: '/product/ayur-raksha-cardiac-combo',
    secondaryCtaText: 'View All Combos',
    secondaryCtaLink: '/category/health-packs',
    priceNote: 'Bundle Deal: ₹2,499 • Save ₹399',
    imageSrc: 'https://www.ayurrakshaonline.com/wp-content/uploads/2024/04/cardiac-combo.webp',
    imageAlt: 'Ayur Raksha Cardiac Health Combo',
    badge1: 'Doctor-Recommended',
    badge2: '2-in-1 Value Pack',
    ratingText: '4.8 ★ (120+ Reviews)',
    bgGlow: 'from-[#B45309]/15 via-[#80A03C]/15 to-transparent',
  },
  {
    id: 'purna-sakthi',
    tag: 'Natural Energy & Stamina',
    headlineMain: 'Pure Natural Energy.',
    headlineHighlight: 'Zero Afternoon Crashes.',
    description:
      'Traditional Ayurvedic restorative tonic that replenishes stamina reserves, calms daily stress, and strengthens deep natural immunity.',
    primaryCtaText: 'Shop Purna Sakthi',
    primaryCtaLink: '/product/purna-sakthi-tonic',
    secondaryCtaText: 'Browse Tonics',
    secondaryCtaLink: '/category/tonic',
    priceNote: 'Special Offer: ₹1,299 • Save 24%',
    imageSrc: 'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/Purna-Sakthi-1.webp',
    imageAlt: 'Purna Sakthi Restorative Herbal Tonic',
    badge1: 'Zero Stimulants',
    badge2: 'Natural Stamina',
    ratingText: '4.9 ★ (150+ Reviews)',
    bgGlow: 'from-[#80A03C]/20 via-[#95B847]/15 to-transparent',
  },
  {
    id: 'healing-oil',
    tag: 'Fast Joint & Muscle Relief',
    headlineMain: 'Move With Ease.',
    headlineHighlight: 'Soothe Stiff Joints & Muscles.',
    description:
      'Deep-penetrating classical herbal oil for fast, soothing relief from knee stiffness, joint aches, and muscle fatigue. Enriched with time-tested healing herbs.',
    primaryCtaText: 'Shop Divine Healing Oil',
    primaryCtaLink: '/product/divine-healing-oil',
    secondaryCtaText: 'Browse Pain Relief',
    secondaryCtaLink: '/concern/pain-joints',
    priceNote: 'Only ₹800 • 100ml Pure Herbal Oil',
    imageSrc: 'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/AYUR-RAKSHA-OIL_new.png',
    imageAlt: 'Ayur Raksha Divine Healing Oil',
    badge1: 'Fast Penetrating',
    badge2: 'Joint & Back Relief',
    ratingText: '4.8 ★ (210+ Reviews)',
    bgGlow: 'from-[#58702E]/20 via-[#80A03C]/15 to-transparent',
  },
  {
    id: 'dia-well',
    tag: 'Metabolism & Blood Sugar',
    headlineMain: 'Healthy Blood Sugar.',
    headlineHighlight: 'Balanced Daily Metabolism.',
    description:
      'Standardized botanical extracts to support healthy daily glucose balance, reduce fatigue, and maintain active vitality without side effects.',
    primaryCtaText: 'Shop Dia Well Capsules',
    primaryCtaLink: '/product/dia-well-food-supplement-capsules',
    secondaryCtaText: 'Browse Capsules',
    secondaryCtaLink: '/category/capsules',
    priceNote: '₹1,199 • 60 Vegetarian Capsules',
    imageSrc: 'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/Ayur-Raksha-Dia-Well-Food-Supplement-Capsules-1.png',
    imageAlt: 'Dia Well Food Supplement Capsules',
    badge1: '100% Herbal Purity',
    badge2: 'Sugar & Energy Balance',
    ratingText: '5.0 ★ (90+ Reviews)',
    bgGlow: 'from-[#80A03C]/20 via-[#58702E]/15 to-transparent',
  },
];

const AUTOPLAY_DURATION = 6000; // 6 seconds

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const total = HERO_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % total);
    setProgress(0);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + total) % total);
    setProgress(0);
  }, [total]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  // Timer & Smooth Progress animation
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 50; // update progress every 50ms
    const step = (intervalTime / AUTOPLAY_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#FAFBF8] via-[#F4F7EE] to-[#FAFBF8] border-b border-border-botanical select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Featured Ayurvedic Remedies"
    >
      {/* Animated Atmospheric Background Glow that shifts with each slide */}
      <div
        key={`glow-${slide.id}`}
        className={`absolute top-1/4 right-1/4 w-[600px] h-[500px] bg-gradient-to-r ${slide.bgGlow} rounded-full blur-3xl pointer-events-none transition-all duration-1000 animate-hero-glow`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-14 sm:pb-18 lg:pt-16 lg:pb-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Left Column: Animated Value Proposition & Headlines */}
          <div
            key={`content-${slide.id}`}
            className="lg:col-span-7 space-y-6 text-left z-10 animate-hero-text"
          >
            {/* Tag Pill with Pulse Animation */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#D7E3C4] shadow-xs text-xs sm:text-sm font-bold text-forest">
              <span className="flex h-2 w-2 rounded-full bg-botanical animate-pulse" />
              <Sparkles size={16} className="text-botanical" />
              <span>{slide.tag}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest leading-[1.12] tracking-tight">
              {slide.headlineMain}{' '}
              <span className="text-botanical italic font-normal block sm:inline">
                {slide.headlineHighlight}
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-charcoal-muted leading-relaxed max-w-2xl">
              {slide.description}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href={slide.primaryCtaLink}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold bg-botanical hover:bg-forest text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98] group"
              >
                <span>{slide.primaryCtaText}</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={slide.secondaryCtaLink}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold bg-white hover:bg-stone-50 text-forest border border-stone-300 transition-all shadow-xs hover:border-botanical"
              >
                <span>{slide.secondaryCtaText}</span>
              </Link>
            </div>

            {/* Price Note & Free Delivery Reassurance */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold text-stone-600">
              <span className="flex items-center gap-1.5 text-forest">
                <CheckCircle2 size={16} className="text-botanical" />
                <span>{slide.priceNote}</span>
              </span>
              <span className="hidden sm:inline text-stone-300">•</span>
              <span className="flex items-center gap-1.5">
                <Truck size={16} className="text-botanical" />
                <span>Prepaid Free Delivery</span>
              </span>
            </div>

            {/* Credibility Counter Strip */}
            <div className="pt-6 grid grid-cols-3 gap-6 border-t border-stone-200/80 text-xs sm:text-sm text-charcoal-muted max-w-xl">
              <div>
                <span className="font-heading font-bold text-forest block text-xl sm:text-2xl">25+ Years</span>
                <span>Doctor Practice</span>
              </div>
              <div>
                <span className="font-heading font-bold text-forest block text-xl sm:text-2xl">100% Pure</span>
                <span>Herbal Extracts</span>
              </div>
              <div>
                <span className="font-heading font-bold text-forest block text-xl sm:text-2xl">4.8 / 5.0</span>
                <span>800+ Reviews</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Visual with Organic Levitation Animation */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">

              {/* Layered Background Discs with Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#E8F0DC] via-[#F4F8EC] to-white rounded-full scale-100 sm:scale-105 shadow-inner border border-stone-200/60 transition-transform duration-700" />
              <div className="absolute inset-4 bg-white/70 backdrop-blur-xs rounded-full" />

              {/* Floating Top Badge: Rating with Smooth Float Animation */}
              <div className="absolute -top-2 right-4 sm:right-6 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-dropdown border border-border-botanical flex items-center gap-2 animate-badge-float">
                <div className="flex items-center text-botanical font-bold text-xs sm:text-sm">
                  <Star size={15} className="fill-botanical text-botanical mr-1" />
                  <span>{slide.ratingText}</span>
                </div>
              </div>

              {/* Floating Left Pill: Benefit 1 with Delayed Float Animation */}
              <div className="absolute top-1/4 -left-4 sm:-left-6 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-dropdown border border-stone-200/90 flex items-center gap-2 animate-badge-float-delayed">
                <span className="w-2 h-2 rounded-full bg-botanical" />
                <span className="text-xs sm:text-sm font-bold text-forest">{slide.badge1}</span>
              </div>

              {/* Floating Bottom Pill: Benefit 2 */}
              <div className="absolute -bottom-2 left-6 sm:left-10 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-dropdown border border-stone-200/90 flex items-center gap-2 animate-badge-float">
                <ShieldCheck size={16} className="text-botanical" />
                <span className="text-xs sm:text-sm font-bold text-forest">{slide.badge2}</span>
              </div>

              {/* Central Floating Animated Product Visual */}
              <Link
                href={slide.primaryCtaLink}
                key={`img-${slide.id}`}
                className="relative z-10 w-4/5 h-4/5 block group animate-hero-image"
              >
                <div className="relative w-full h-full animate-hero-float">
                  <Image
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 450px"
                    className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Link>
            </div>
          </div>

        </div>

        {/* Minimalist Floating Navigation Controls & Smooth Animated Progress Bar */}
        <div className="mt-10 pt-6 border-t border-stone-200/70 flex items-center justify-between">

          {/* Clean Slide Counter + Interactive Animated Progress Dots */}
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-xs sm:text-sm font-bold text-forest tracking-wider">
              0{currentSlide + 1} <span className="text-stone-400 font-normal">/ 0{total}</span>
            </span>

            {/* Animated Dots with Active Progress Fill */}
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((item, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <button
                    key={item.id}
                    onClick={() => goToSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}: ${item.tag}`}
                    className={`relative h-2 rounded-full transition-all duration-300 overflow-hidden ${
                      isActive ? 'w-10 bg-stone-200' : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                    }`}
                  >
                    {isActive && (
                      <span
                        className="absolute inset-y-0 left-0 bg-botanical rounded-full transition-all ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sleek Prev / Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full bg-white hover:bg-botanical hover:text-white text-forest border border-stone-200/90 flex items-center justify-center transition-all shadow-xs hover:shadow active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="w-10 h-10 rounded-full bg-white hover:bg-botanical hover:text-white text-forest border border-stone-200/90 flex items-center justify-center transition-all shadow-xs hover:shadow active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
