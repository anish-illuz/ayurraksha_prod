import React from 'react';
import Link from 'next/link';
import { ArrowRight, Package } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { getProductsByCategory } from '@/lib/products';

export const FeaturedCombos: React.FC = () => {
  const packs = getProductsByCategory('health-packs').slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-ivory border-b border-border-botanical">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sage text-forest text-xs font-semibold mb-2">
              <Package size={14} className="text-botanical" />
              <span>Synergistic Wellness</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest tracking-tight">
              Featured Health Packs &amp; Combos
            </h2>
            <p className="mt-2 text-sm text-charcoal-muted max-w-xl">
              Carefully curated complementary formulations that work synergistically for comprehensive, multi-angle bodily support.
            </p>
          </div>

          <Link
            href="/category/health-packs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-forest hover:text-botanical transition-colors"
          >
            <span>View All Health Packs</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {packs.map((pack) => (
            <ProductCard key={pack.id} product={pack} />
          ))}
        </div>
      </div>
    </section>
  );
};
