'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { getBestsellers } from '@/lib/products';
import { Product } from '@/types/product';

export const Bestsellers: React.FC = () => {
  const bestsellers = getBestsellers(8);
  const [filter, setFilter] = useState<'all' | 'tonic' | 'oil' | 'capsules'>('all');

  const filtered = filter === 'all'
    ? bestsellers
    : bestsellers.filter((p) => p.categorySlugs.includes(filter));

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-border-botanical">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-semibold text-botanical uppercase tracking-widest block mb-2">
              Customer Favorites
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest tracking-tight">
              Most Trusted Formulations
            </h2>
            <p className="mt-2 text-sm text-charcoal-muted max-w-xl">
              Backed by hundreds of verified patient reviews across India. Pure, unadulterated herbal efficacy.
            </p>
          </div>

          {/* Quick Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg overflow-x-auto text-xs font-semibold text-charcoal">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filter === 'all' ? 'bg-white text-forest shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              All Bestsellers
            </button>
            <button
              onClick={() => setFilter('tonic')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filter === 'tonic' ? 'bg-white text-forest shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Tonics
            </button>
            <button
              onClick={() => setFilter('oil')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filter === 'oil' ? 'bg-white text-forest shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Oils
            </button>
            <button
              onClick={() => setFilter('capsules')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                filter === 'capsules' ? 'bg-white text-forest shadow-xs' : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              Capsules
            </button>
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-button text-xs font-semibold bg-forest hover:bg-forest-light text-white transition-colors"
          >
            <span>View All 44 Formulations</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};
