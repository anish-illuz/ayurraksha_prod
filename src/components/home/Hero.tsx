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
  bgColorFrom: string;
  bgColorTo: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'boozliv',
    tag: 'Flagship Liver Care',
    headlineMain: 'Revitalize Your Liver.',
    headlineHighlight: 'Feel Re-Energized Every Day.',
    description:
      'Doctor-formulated with 100% natural botanical extracts to maintain healthy liver enzymes, support gentle daily detox, and promote smooth digestive comfort.',
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
    bgColorFrom: 'from-[#F4F7EE]',
    bgColorTo: 'to-[#EAF2DE]',
  },
  {
    id: 'cardiac-combo',
    tag: 'Heart & Circulation',
    headlineMain: 'Nourish Your Heart.',
    headlineHighlight: 'Support Healthy Circulation.',
    description:
      'A comprehensive 2-bottle doctor-guided bundle designed to strengthen cardiac vitality, promote balanced blood flow, and support everyday stamina.',
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
    bgColorFrom: 'from-[#FAF6F2]',
    bgColorTo: 'to-[#F2EAE0]',
  },
  {
    id: 'purna-sakthi',
    tag: 'Daily Stamina & Vitality',
    headlineMain: 'Pure Natural Energy.',
    headlineHighlight: 'No Afternoon Crashes.',
    description:
      'Authentic Ayurvedic restorative tonic that replenishes stamina reserves, calms daily stress, and strengthens deep natural immunity for active lifestyles.',
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
    bgColorFrom: 'from-[#F7F9F2]',
    bgColorTo: 'to-[#EEF5E3]',
  },
  {
    id: 'healing-oil',
    tag: 'Fast Joint & Muscle Relief',
    headlineMain: 'Move With Ease.',
    headlineHighlight: 'Soothe Stiff Joints & Muscles.',
    description:
      'Deep-penetrating classical herbal oil for fast, soothing relief from knee discomfort, stiffness, and muscle fatigue. Enriched with time-tested healing herbs.',
    primaryCtaText: 'Shop Divine Healing Oil',
    primaryCtaLink: '/product/divine-healing-oil',
    secondaryCtaText: 'View Pain Remedies',
    secondaryCtaLink: '/concern/pain-joints',
    priceNote: 'Only ₹800 • 100ml Pure Herbal Oil',
    imageSrc: 'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/AYUR-RAKSHA-OIL_new.png',
    imageAlt: 'Ayur Raksha Divine Healing Oil',
    badge1: 'Fast Penetrating',
    badge2: 'Joint & Back Relief',
    ratingText: '4.8 ★ (210+ Reviews)',
    bgColorFrom: 'from-[#F5F8F4]',
    bgColorTo: 'to-[#EBF3E8]',
  },
  {
    id: 'dia-well',
    tag: 'Metabolism & Blood Sugar',
    headlineMain: 'Healthy Blood Sugar.',
    headlineHighlight: 'Balanced Daily Metabolism.',
    description:
      'Formulated with standardized botanical extracts to support healthy glucose balance, reduce fatigue, and maintain daily vitality without side effects.',
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
    bgColorFrom: 'from-[#F9FAF6]',
    bgColorTo: 'to-[#EDF4E4]',
  },
];

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = HERO_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(nextSlide, 6500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide]);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-[#FAFBF8] via-[#F4F7EE] to-[#FAFBF8] border-b border-border-botanical select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-r from-botanical/10 via-primary-light/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Slide Stage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Left Column: Big Editorial Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left z-10">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#D7E3C4] shadow-xs text-xs sm:text-sm font-bold text-forest">
              <Sparkles size={16} className="text-botanical" />
              <span>{slide.tag}</span>
            </div>

            {/* Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-forest leading-[1.12] tracking-tight transition-all duration-300">
              {slide.headlineMain}{' '}
              <span className="text-botanical italic font-normal block sm:inline">
                {slide.headlineHighlight}
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-charcoal-muted leading-relaxed max-w-2xl transition-all duration-300">
              {slide.description}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href={slide.primaryCtaLink}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold bg-botanical hover:bg-forest text-white shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
              >
                <span>{slide.primaryCtaText}</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                href={slide.secondaryCtaLink}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold bg-white hover:bg-stone-50 text-forest border border-stone-300 transition-all shadow-xs"
              >
                <span>{slide.secondaryCtaText}</span>
              </Link>
            </div>

            {/* Price Note & Reassurance */}
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

          {/* Right Column: Hero Visual with Organic Shape and Floating Benefit Badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Atmospheric Organic Soft Backdrop */}
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">

              {/* Layered soft background circles */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#E8F0DC] via-[#F4F8EC] to-white rounded-full scale-100 sm:scale-105 shadow-inner border border-stone-200/60" />
              <div className="absolute inset-4 bg-white/70 backdrop-blur-xs rounded-full" />

              {/* Floating Top Badge: Rating */}
              <div className="absolute -top-3 right-4 sm:right-6 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-dropdown border border-border-botanical flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center text-botanical font-bold text-xs sm:text-sm">
                  <Star size={15} className="fill-botanical text-botanical mr-1" />
                  <span>{slide.ratingText}</span>
                </div>
              </div>

              {/* Floating Left Pill: Benefit 1 */}
              <div className="absolute top-1/4 -left-4 sm:-left-6 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-dropdown border border-stone-200/90 flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="w-2 h-2 rounded-full bg-botanical" />
                <span className="text-xs sm:text-sm font-bold text-forest">{slide.badge1}</span>
              </div>

              {/* Floating Bottom Pill: Benefit 2 */}
              <div className="absolute -bottom-3 left-6 sm:left-10 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-dropdown border border-stone-200/90 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <ShieldCheck size={16} className="text-botanical" />
                <span className="text-xs sm:text-sm font-bold text-forest">{slide.badge2}</span>
              </div>

              {/* Central High-Res Product Hero Visual */}
              <Link
                href={slide.primaryCtaLink}
                className="relative z-10 w-4/5 h-4/5 block group transition-transform duration-500 hover:scale-105"
              >
                <Image
                  key={slide.id}
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 450px"
                  className="object-contain drop-shadow-2xl transition-all duration-500"
                />
              </Link>
            </div>
          </div>

        </div>

        {/* Carousel Bottom Control Bar: Interactive Tabs & Arrows */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-stone-200/80 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Quick-Switch Slide Tabs */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {HERO_SLIDES.map((item, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`group text-left px-4 py-2.5 rounded-xl transition-all flex items-center gap-2.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-forest text-white shadow-sm'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80'
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      isActive ? 'text-emerald-300' : 'text-stone-400 group-hover:text-botanical'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-bold">{item.tag}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls: Slide Dots & Circular Arrows */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}: ${item.tag}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'w-8 bg-botanical' : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                  }`}
                />
              ))}
            </div>

            {/* Circular Next & Prev Buttons */}
            <div className="flex items-center gap-2 border-l border-stone-200 pl-4">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="w-10 h-10 rounded-full bg-white hover:bg-botanical hover:text-white text-forest border border-stone-200 flex items-center justify-center transition-colors shadow-xs active:scale-95"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="w-10 h-10 rounded-full bg-white hover:bg-botanical hover:text-white text-forest border border-stone-200 flex items-center justify-center transition-colors shadow-xs active:scale-95"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
