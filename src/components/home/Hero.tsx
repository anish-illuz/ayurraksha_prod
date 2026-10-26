'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  Check,
  Sparkles,
  ShieldCheck,
  Truck,
  Award,
  Zap,
} from 'lucide-react';
import productsData from '@/data/products.json';
import { Product } from '@/types/product';
import { useCart } from '@/lib/cartContext';

interface CarouselItem {
  slug: string;
  badgeLabel: string;
  badgeType: 'bestseller' | 'featured' | 'popular' | 'saver';
  shortTagline: string;
  packSize: string;
  keyBenefit: string;
}

const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    slug: 'boozliv',
    badgeLabel: 'Featured Formulation',
    badgeType: 'featured',
    shortTagline: 'Targeted Liver Revitalization & Digestive Support',
    packSize: '60 x 10ml Herbal Tonic',
    keyBenefit: 'Supports liver enzyme balance, natural detox, and smooth digestion',
  },
  {
    slug: 'ayur-raksha-cardiac-combo',
    badgeLabel: 'Doctor Recommended Combo',
    badgeType: 'bestseller',
    shortTagline: 'Complete Heart Health & Healthy Circulation',
    packSize: '2-Bottle Value Pack',
    keyBenefit: 'Strengthens cardiac muscles, supports healthy blood pressure and stamina',
  },
  {
    slug: 'dia-well-food-supplement-capsules',
    badgeLabel: 'Customer Favorite',
    badgeType: 'popular',
    shortTagline: 'Natural Blood Sugar & Daily Metabolism Balance',
    packSize: '60 Herbal Capsules',
    keyBenefit: 'Helps maintain healthy glucose balance and prevents mid-day fatigue',
  },
  {
    slug: 'purna-sakthi-tonic',
    badgeLabel: 'Best Value Deal',
    badgeType: 'saver',
    shortTagline: 'Restorative Daily Energy, Stamina & Immunity',
    packSize: '200 ml Ayurvedic Tonic',
    keyBenefit: 'Replenishes energy reserves, calms stress, and builds natural defenses',
  },
  {
    slug: 'divine-healing-oil',
    badgeLabel: 'Fast Acting Relief',
    badgeType: 'bestseller',
    shortTagline: 'Soothing Joint Mobility & Deep Muscle Relief',
    packSize: '100 ml Herbal Pain Oil',
    keyBenefit: 'Quick penetrating botanical oil for stiff joints, knees, and back pain',
  },
];

export const Hero: React.FC = () => {
  const { addToCart } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [addedSlug, setAddedSlug] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Map carousel items to full Product data
  const carouselProducts = React.useMemo(() => {
    const all = productsData as Product[];
    return CAROUSEL_ITEMS.map((item) => {
      const prod = all.find((p) => p.slug === item.slug);
      return {
        ...item,
        product: prod,
      };
    }).filter((item): item is CarouselItem & { product: Product } => Boolean(item.product));
  }, []);

  const totalSlides = carouselProducts.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    timerRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide, totalSlides]);

  const currentItem = carouselProducts[currentIndex];
  const activeProduct = currentItem?.product;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!activeProduct) return;
    addToCart(activeProduct, 1);
    setAddedSlug(activeProduct.slug);
    setTimeout(() => {
      setAddedSlug(null);
    }, 2000);
  };

  const isCurrentAdded = activeProduct ? addedSlug === activeProduct.slug : false;
  const prepaidDiscountPrice = activeProduct ? Math.round(activeProduct.price * 0.9) : 0;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAFAF8] via-[#F4F7EE] to-[#FAFAF8] pt-8 pb-14 sm:pt-12 sm:pb-18 lg:py-20 border-b border-border-botanical">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

          {/* Left Column: Clean Shopify-style Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D7E3C4] shadow-xs text-xs font-semibold text-forest">
              <span className="flex h-2 w-2 rounded-full bg-botanical animate-pulse" />
              <Sparkles size={14} className="text-botanical" />
              <span>Doctor-Formulated Ayurvedic Care</span>
            </div>

            {/* Headline in normal, natural English */}
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-bold text-forest leading-[1.12] tracking-tight">
              Natural Remedies for{' '}
              <span className="text-botanical italic font-normal">Everyday Health.</span>
            </h1>

            {/* Clear, approachable description */}
            <p className="text-base sm:text-lg text-charcoal-muted leading-relaxed max-w-xl">
              Doctor-formulated herbal tonics, restorative oils, and daily health combos created under clinical guidance in Chennai. Made from 100% natural herbs to help your body feel balanced, energized, and protected.
            </p>

            {/* Action CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/shop?sort=bestseller"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold bg-botanical hover:bg-forest text-white shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
              >
                <span>Shop Best Sellers</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold bg-white hover:bg-stone-50 text-forest border border-stone-300 transition-all shadow-xs"
              >
                <span>Browse All Products (44)</span>
              </Link>
            </div>

            {/* Trust & Proof Strip */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-200/80 text-xs sm:text-sm text-charcoal-muted">
              <div>
                <span className="font-bold text-forest block text-lg sm:text-xl">25+ Years</span>
                <span>Clinical Doctor Practice</span>
              </div>
              <div>
                <span className="font-bold text-forest block text-lg sm:text-xl">Free Delivery</span>
                <span>On All Prepaid Orders</span>
              </div>
              <div>
                <span className="font-bold text-forest block text-lg sm:text-xl">4.8 / 5.0</span>
                <span>800+ Verified Reviews</span>
              </div>
            </div>

            {/* Clean reassurance badge */}
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-700 bg-white/80 backdrop-blur-xs py-2.5 px-4 rounded-xl border border-stone-200/70 w-fit">
              <ShieldCheck size={18} className="text-botanical flex-shrink-0" />
              <span>100% Pure Botanical Ingredients • Zero Hidden Steroids or Chemicals</span>
            </div>
          </div>

          {/* Right Column: Interactive Shopify-Style Product Carousel */}
          <div
            className="lg:col-span-6 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {activeProduct && (
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Background glow accent */}
                <div className="absolute -inset-1 bg-gradient-to-r from-botanical/20 to-forest/10 rounded-3xl blur-xl opacity-60" />

                {/* Main Product Showcase Card */}
                <div className="relative bg-white rounded-3xl p-5 sm:p-7 shadow-xl border border-stone-200/90 transition-all">

                  {/* Top Badges & Navigation Controls */}
                  <div className="flex items-center justify-between mb-4 gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#B85D19] bg-[#FDF2EC] border border-[#F3DACB] px-3.5 py-1.5 rounded-full">
                        {currentItem.badgeLabel}
                      </span>
                      {activeProduct.isBestseller && (
                        <span className="inline-flex items-center text-xs sm:text-sm font-bold text-[#2A5E10] bg-[#EEF5E5] border border-[#D5E6C1] px-3 py-1.5 rounded-full">
                          Bestseller
                        </span>
                      )}
                    </div>

                    {/* Circular Prev / Next Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prevSlide}
                        aria-label="Previous featured product"
                        className="w-9 h-9 rounded-full bg-stone-100 hover:bg-botanical hover:text-white text-stone-700 flex items-center justify-center transition-colors shadow-xs"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextSlide}
                        aria-label="Next featured product"
                        className="w-9 h-9 rounded-full bg-stone-100 hover:bg-botanical hover:text-white text-stone-700 flex items-center justify-center transition-colors shadow-xs"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Product Image Area with Soft Background */}
                  <Link
                    href={`/product/${activeProduct.slug}`}
                    className="group relative block w-full aspect-[4/3] sm:aspect-[16/11] bg-gradient-to-b from-[#F9FAF7] to-[#F1F6EA] rounded-2xl p-4 sm:p-6 overflow-hidden border border-stone-100"
                  >
                    <div className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
                      <Image
                        key={activeProduct.slug}
                        src={activeProduct.images[0] || 'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/1.png'}
                        alt={activeProduct.name}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 500px"
                        className="object-contain"
                      />
                    </div>

                    {/* Pack size pill on bottom left of image */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-md text-xs font-semibold text-forest shadow-xs border border-stone-200/80">
                      {currentItem.packSize}
                    </div>

                    {/* Discount badge if on sale */}
                    {activeProduct.discountPercent > 0 && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white font-bold text-xs sm:text-sm px-3 py-1 rounded-full shadow-xs">
                        {activeProduct.discountPercent}% OFF
                      </div>
                    )}
                  </Link>

                  {/* Product Details Section */}
                  <div className="mt-5 space-y-3.5">
                    {/* Title and Rating Row */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-forest hover:text-botanical transition-colors">
                          <Link href={`/product/${activeProduct.slug}`}>
                            {activeProduct.name}
                          </Link>
                        </h2>
                        <p className="text-sm sm:text-base text-stone-600 font-medium mt-1">
                          {currentItem.shortTagline}
                        </p>
                      </div>

                      {/* Star Rating */}
                      <div className="flex flex-col items-end flex-shrink-0">
                        <div className="flex items-center gap-1 text-botanical font-bold text-sm">
                          <Star size={16} className="fill-botanical text-botanical" />
                          <span>{activeProduct.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-xs text-stone-400 mt-0.5">
                          ({activeProduct.reviewCount} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Key Benefit Description in Natural English */}
                    <p className="text-sm sm:text-[15px] text-charcoal-muted leading-relaxed line-clamp-2">
                      {currentItem.keyBenefit}
                    </p>

                    {/* Price and Prepaid Offer Box */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                      {/* Price Display */}
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-heading text-2xl sm:text-3xl font-bold text-forest">
                          ₹{activeProduct.price.toLocaleString('en-IN')}
                        </span>
                        {activeProduct.regularPrice > activeProduct.price && (
                          <span className="text-base text-stone-400 line-through">
                            ₹{activeProduct.regularPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        {activeProduct.discountPercent > 0 && (
                          <span className="text-xs sm:text-sm font-bold text-botanical bg-[#F0F5E6] px-2.5 py-1 rounded-md border border-[#DCE8CD]">
                            Save ₹{(activeProduct.regularPrice - activeProduct.price).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Prepaid delivery discount */}
                      <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-forest bg-[#F4F7EE] px-3 py-1.5 rounded-xl border border-[#DCE4CF]">
                        <Zap size={15} className="text-botanical" />
                        <span>Prepaid Special: <strong>₹{prepaidDiscountPrice.toLocaleString('en-IN')}</strong></span>
                      </div>
                    </div>

                    {/* Actions: Add to Cart and View Details */}
                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={handleQuickAdd}
                        disabled={!activeProduct.inStock}
                        aria-label={`Add ${activeProduct.name} to cart`}
                        className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-xs active:scale-[0.98] ${
                          isCurrentAdded
                            ? 'bg-forest text-white'
                            : 'bg-botanical hover:bg-forest text-white'
                        }`}
                      >
                        {isCurrentAdded ? (
                          <>
                            <Check size={18} />
                            <span>Added to Cart!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={18} />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={`/product/${activeProduct.slug}`}
                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-semibold bg-stone-100 hover:bg-stone-200 text-charcoal transition-colors text-center"
                      >
                        <span>View Details</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>

                    {/* Slide Dots Indicator */}
                    <div className="pt-3 flex items-center justify-center gap-2">
                      {carouselProducts.map((item, idx) => (
                        <button
                          key={item.slug}
                          onClick={() => goToSlide(idx)}
                          aria-label={`Go to slide ${idx + 1}: ${item.product.name}`}
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            idx === currentIndex
                              ? 'w-7 bg-botanical'
                              : 'w-2.5 bg-stone-300 hover:bg-stone-400'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Clickable Product Thumbnail Tabs for Instant Selection */}
                    <div className="pt-2.5 border-t border-stone-100 flex items-center gap-2 overflow-x-auto pb-1">
                      {carouselProducts.map((item, idx) => {
                        const isActive = idx === currentIndex;
                        return (
                          <button
                            key={item.slug}
                            onClick={() => goToSlide(idx)}
                            className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                              isActive
                                ? 'bg-forest text-white shadow-xs'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-charcoal'
                            }`}
                          >
                            {item.product.name.replace('Ayur Raksha ', '')}
                          </button>
                        );
                      })}
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
