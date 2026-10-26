import React from 'react';
import Link from 'next/link';
import { ArrowRight, Activity, ShieldCheck, Sparkles, Heart, Coffee, Zap, Wind, Sun, LucideIcon } from 'lucide-react';
import { HEALTH_CONCERNS } from '@/data/siteConfig';

const ICON_MAP: Record<string, LucideIcon> = {
  Activity,
  ShieldCheck,
  Sparkles,
  Heart,
  Coffee,
  Zap,
  Wind,
  Sun,
};

export const CategoryGrid: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-sm font-bold text-botanical uppercase tracking-wider block mb-2.5">
            Targeted Herbal Care
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-tight">
            Shop by Health Need
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-charcoal-muted leading-relaxed">
            Choose your health goal below to explore doctor-recommended herbal tonics, supplements, and oils crafted for everyday wellness.
          </p>
        </div>

        {/* 8 Concern Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HEALTH_CONCERNS.map((c) => {
            const Icon = ICON_MAP[c.icon] || Sparkles;
            return (
              <Link
                key={c.id}
                href={`/concern/${c.slug}`}
                className="group relative flex flex-col p-6 sm:p-7 bg-white rounded-2xl border border-stone-200/90 shadow-sm transition-all duration-300 hover:shadow-card-hover hover:border-botanical/60 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-sage-light group-hover:bg-sage flex items-center justify-center text-botanical transition-colors mb-5 shadow-xs">
                  <Icon size={26} />
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-forest group-hover:text-botanical transition-colors leading-snug">
                  {c.name}
                </h3>

                <p className="text-sm sm:text-[15px] text-stone-600 mt-2.5 leading-relaxed flex-grow">
                  {c.description}
                </p>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center text-sm font-semibold text-forest group-hover:text-botanical">
                  <span>Explore Products</span>
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
