'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { getBestsellers } from '@/lib/products';

export const Bestsellers: React.FC = () => {
  const bestsellers = getBestsellers(8);
  const [filter, setFilter] = useState<'all' | 'tonic' | 'oil' | 'capsules' | 'health-packs'>('all');

  const filtered = filter === 'all'
    ? bestsellers
    : bestsellers.filter((p) => p.categorySlugs.includes(filter));

  return (
    <section className="py-9 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:gap-6 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage text-primary text-xs font-semibold mb-2.5">
              <Sparkles size={14} className="text-gold" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
              Our Bestsellers
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#37443D] max-w-xl">
              Our most popular doctor-formulated herbal remedies, trusted by thousands of customers across India.
            </p>
          </div>

          {/* Quick Category Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 text-sm font-medium">
            {[
              { label: 'All Bestsellers', val: 'all' },
              { label: 'Tonics & Syrups', val: 'tonic' },
              { label: 'Herbal Oils', val: 'oil' },
              { label: 'Capsules', val: 'capsules' },
              { label: 'Wellness Packs', val: 'health-packs' },
            ].map((tab) => (
              <button
                key={tab.val}
                onClick={() => setFilter(tab.val as any)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-xs sm:text-sm font-semibold ${
                  filter === tab.val
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-charcoal'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-4 rounded-xl bg-sage px-4 py-3 text-sm text-primary">Free shipping across India on all prepaid orders.</p>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} priority={false} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 sm:mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 h-12 rounded-[8px] text-sm font-semibold bg-primary hover:bg-primary-dark text-white transition-all shadow-xs active:scale-[0.98]"
          >
            <span>Explore All Formulations</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};
