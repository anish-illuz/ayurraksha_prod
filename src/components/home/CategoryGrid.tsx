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
    <section className="py-16 sm:py-20 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-semibold text-botanical uppercase tracking-widest block mb-2">
            Targeted Herbal Care
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-forest tracking-tight">
            Shop by Health Need
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal-muted leading-relaxed">
            Choose your health goal below to explore doctor-recommended herbal tonics, supplements, and oils crafted for everyday wellness.
          </p>
        </div>

        {/* 8 Concern Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HEALTH_CONCERNS.map((c) => {
            const Icon = ICON_MAP[c.icon] || Sparkles;
            return (
              <Link
                key={c.id}
                href={`/concern/${c.slug}`}
                className="group relative flex flex-col p-6 bg-white rounded-card border border-stone-200/80 transition-all duration-300 hover:shadow-card-hover hover:border-botanical/40 hover:-translate-y-0.5"
              >
                <div className="w-12 h-12 rounded-full bg-sage-light group-hover:bg-sage flex items-center justify-center text-botanical transition-colors mb-4">
                  <Icon size={22} />
                </div>

                <h3 className="text-base font-bold text-charcoal group-hover:text-botanical transition-colors">
                  {c.name}
                </h3>

                <p className="text-xs text-charcoal-muted mt-2 leading-relaxed flex-grow">
                  {c.description}
                </p>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center text-xs font-semibold text-forest group-hover:text-botanical">
                  <span>Explore Products</span>
                  <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
