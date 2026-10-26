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
    <section className="py-16 sm:py-20 bg-white border-b border-border-botanical">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sage-light text-forest text-sm font-bold mb-2.5">
              <Sparkles size={14} className="text-botanical" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-forest tracking-tight">
              Our Best Sellers
            </h2>
            <p className="mt-3 text-base sm:text-lg text-charcoal-muted max-w-xl">
              Our most popular doctor-formulated herbal remedies, trusted by thousands of customers across India.
            </p>
          </div>

          {/* Quick Category Pill Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 md:pb-0 text-sm font-semibold">
            {[
              { label: 'All Best Sellers', val: 'all' },
              { label: 'Tonics & Syrups', val: 'tonic' },
              { label: 'Herbal Oils', val: 'oil' },
              { label: 'Capsules', val: 'capsules' },
              { label: 'Combos & Packs', val: 'health-packs' },
            ].map((tab) => (
              <button
                key={tab.val}
                onClick={() => setFilter(tab.val as any)}
                className={`px-5 py-2.5 rounded-full whitespace-nowrap transition-all ${
                  filter === tab.val
                    ? 'bg-forest text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-charcoal'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-forest hover:bg-forest-light text-white transition-all shadow-xs"
          >
            <span>Shop All 44 Products</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};
