'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Package, Star, ShoppingBag, Check } from 'lucide-react';
import { getProductsByCategory } from '@/lib/products';
import { useCart } from '@/lib/cartContext';
import { Product } from '@/types/product';

interface PackCardProps {
  pack: Product;
}

const PackCard: React.FC<PackCardProps> = ({ pack }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = React.useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(pack, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const imageSrc = pack.images[0] || 'https://www.ayurrakshaonline.com/wp-content/uploads/2024/04/join-well-combo.webp';
  const prepaidDiscountPrice = Math.round(pack.price * 0.9);

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-stone-200/90 overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-primary/40 group">
      {/* 1. Pack photograph */}
      <Link href={`/product/${pack.slug}`} className="relative block w-full aspect-square bg-[#F7F9F5] p-5 overflow-hidden">
        <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
          <Image
            src={imageSrc}
            alt={pack.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain"
          />
        </div>
      </Link>

      <div className="flex flex-col flex-grow p-5 space-y-3">
        {/* 2. Pack name */}
        <h3 className="font-heading text-lg sm:text-xl font-bold text-primary group-hover:text-primary-dark transition-colors line-clamp-2 min-h-[3rem] leading-snug">
          <Link href={`/product/${pack.slug}`}>{pack.name}</Link>
        </h3>

        {/* 3. Short pack-contents summary */}
        <p className="text-xs sm:text-sm text-charcoal-muted line-clamp-2 leading-relaxed">
          {pack.shortDescription || 'Doctor-recommended synergistic Ayurvedic wellness combo.'}
        </p>

        {/* 4. Verified customer rating, if available */}
        <div className="flex items-center gap-1.5 text-xs text-charcoal-muted">
          <div className="flex items-center text-primary font-bold gap-1">
            <Star size={14} className="fill-gold text-gold" />
            <span>{pack.rating.toFixed(1)}</span>
          </div>
          <span>({pack.reviewCount} verified reviews)</span>
        </div>

        {/* 5. Original price and current price & 6. Discount percentage */}
        <div className="pt-1 flex items-baseline gap-2.5 flex-wrap">
          <span className="font-heading font-bold text-xl sm:text-2xl text-primary">
            ₹{pack.price.toLocaleString('en-IN')}
          </span>
          {pack.regularPrice > pack.price && (
            <span className="text-sm text-stone-400 line-through">
              ₹{pack.regularPrice.toLocaleString('en-IN')}
            </span>
          )}
          {pack.discountPercent > 0 && (
            <span className="text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {pack.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* 7. Prepaid offer */}
        <div className="bg-[#FAF9F5] border border-stone-200/80 rounded-xl px-3 py-2 text-xs flex items-center justify-between">
          <span className="text-stone-600 font-medium">⚡ Prepaid Offer:</span>
          <span className="font-bold text-primary">₹{prepaidDiscountPrice.toLocaleString('en-IN')} + Free Ship</span>
        </div>

        {/* 8. Add to Cart button */}
        <div className="pt-2">
          <button
            onClick={handleAdd}
            aria-label={`Add ${pack.name} to cart`}
            className={`w-full h-11 sm:h-12 inline-flex items-center justify-center gap-2 px-4 rounded-[8px] text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-xs active:scale-[0.98] ${
              isAdded
                ? 'bg-emerald-800 text-white'
                : 'bg-primary hover:bg-primary-dark text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check size={18} className="flex-shrink-0" />
                <span className="whitespace-nowrap">Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={18} className="flex-shrink-0" />
                <span className="whitespace-nowrap">Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const FeaturedCombos: React.FC = () => {
  const packs = getProductsByCategory('health-packs').slice(0, 4);

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage text-primary text-xs font-semibold mb-2.5">
              <Package size={14} className="text-primary" />
              <span>Complete Healing Regimens</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
              Wellness Packs &amp; Combos
            </h2>
            <p className="mt-3 text-base sm:text-lg text-charcoal-muted max-w-xl">
              Save more with doctor-recommended combos designed to work together for comprehensive, everyday bodily support.
            </p>
          </div>

          <Link
            href="/category/health-packs"
            className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-primary hover:underline transition-colors"
          >
            <span>Explore All Wellness Packs</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packs.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </div>
    </section>
  );
};
