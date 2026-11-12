'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { COMBO_BUILDERS } from '@/data/comboBuilderData';

const COMBO_IMAGE_MAP: Record<string, string> = {
  'skin-care': '/images/banners/skin-well-combo.webp',
  'varicose-veins': '/images/banners/varicose-veins.webp',
  'breath-easy': '/images/banners/breathe-well.webp',
  'cardiac-wellness': '/images/banners/cardiac-combo.webp',
};

export const FeaturedCombos: React.FC = () => {
  return (
    <section className="py-9 sm:py-20 lg:py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:gap-6 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage text-primary text-xs font-semibold mb-2.5">
              <Layers size={14} className="text-primary" />
              <span>Personalized Wellness</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
              Build Your Own Combo
            </h2>
            <p className="mt-3 text-base sm:text-lg text-charcoal-muted max-w-xl">
              Build your customized routine from authentic Ayurvedic formulations. Select your preferred products and save up to 15% with volume discounts.
            </p>
          </div>

          <Link
            href="/combo-builder"
            className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-primary hover:underline transition-colors"
          >
            <span>Explore All Combo Builders</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMBO_BUILDERS.map((combo) => {
            const imageSrc = COMBO_IMAGE_MAP[combo.slug] || '/images/banners/boozliv-desktop.webp';
            return (
              <div
                key={combo.id}
                className="flex flex-col bg-white rounded-2xl border border-stone-200/90 overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-primary/40 group"
              >
                {/* Visual Banner Thumbnail */}
                <Link
                  href={combo.href}
                  className="relative block w-full aspect-[4/3] bg-[#F7F9F5] overflow-hidden"
                >
                  <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                    <Image
                      src={imageSrc}
                      alt={combo.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {combo.popular && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary text-white shadow-xs">
                      <Sparkles size={11} className="text-gold" />
                      Most Popular
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white/90 text-primary backdrop-blur-xs shadow-2xs">
                    {combo.badge}
                  </span>
                </Link>

                <div className="flex flex-col flex-grow p-5 space-y-3">
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-primary group-hover:text-primary-dark transition-colors line-clamp-2 min-h-[3.25rem] leading-snug">
                    <Link href={combo.href}>{combo.name}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-[#37443D] leading-relaxed flex-grow">
                    {combo.description}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={combo.href}
                      className="w-full h-11 sm:h-12 inline-flex items-center justify-center gap-2 px-4 rounded-[8px] text-xs sm:text-sm font-semibold whitespace-nowrap bg-primary hover:bg-primary-dark text-white transition-all duration-200 shadow-xs active:scale-[0.98]"
                    >
                      <span>Build Your Combo</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
