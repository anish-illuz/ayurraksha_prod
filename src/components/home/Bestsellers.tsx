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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-light text-forest text-xs font-semibold mb-2">
              <Sparkles size={13} className="text-botanical" />
              <span>Customer Favorites &amp; Verified Results</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-forest tracking-tight">
              Most Trusted Formulations
            </h2>
            <p className="mt-2 text-sm text-charcoal-muted max-w-xl">
              Doctor-formulated classical remedies backed by hundreds of verified patient reviews across India.
            </p>
          </div>

          {/* Quick Category Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 text-xs font-semibold">
            {[
              { label: 'All Bestsellers', val: 'all' },
              { label: 'Tonics', val: 'tonic' },
              { label: 'Therapeutic Oils', val: 'oil' },
              { label: 'Capsules', val: 'capsules' },
              { label: 'Health Packs', val: 'health-packs' },
            ].map((tab) => (
              <button
                key={tab.val}
                onClick={() => setFilter(tab.val as any)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  filter === tab.val
                    ? 'bg-forest text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-charcoal'
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
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-forest hover:bg-forest-light text-white transition-all shadow-xs"
          >
            <span>Explore All 44 Formulations</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};
