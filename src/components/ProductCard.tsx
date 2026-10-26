'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag, Check, Tag } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/lib/cartContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const primaryImage = product.images[0] || 'https://www.ayurrakshaonline.com/wp-content/uploads/2024/02/1-1024x1024.jpg';
  const secondaryImage = product.images[1] || primaryImage;

  // Determine size/pack label
  const sizeLabel = product.variants[0]?.name || (
    product.categorySlugs.includes('oil') ? '100 ml' :
    product.categorySlugs.includes('tonic') ? '200 ml' :
    product.categorySlugs.includes('capsules') ? '60 Capsules' :
    product.categorySlugs.includes('powder') ? '100 g' :
    product.categorySlugs.includes('soap') ? 'Pack of 2' :
    'Standard Pack'
  );

  // Calculate promotional prepaid price (extra 5% or 10% on prepaid)
  const prepaidDiscountPrice = Math.round(product.price * 0.9);

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/90 overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-botanical/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Banner Offer Chip */}
      <div className="bg-[#F0F5F1] text-forest text-[11px] font-semibold py-1.5 px-3 text-center border-b border-stone-100 flex items-center justify-center gap-1.5">
        <Tag size={12} className="text-botanical" />
        <span>Prepaid Orders: Free Shipping Across India</span>
      </div>

      {/* Product Image Area */}
      <div className="relative block w-full aspect-square bg-[#FAF8F5] overflow-hidden p-6">
        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          {product.isBestseller ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-forest text-white shadow-xs">
              BESTSELLER
            </span>
          ) : product.discountPercent >= 15 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-800 text-white shadow-xs">
              POPULAR
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-stone-800 text-white shadow-xs">
              AYURVEDIC
            </span>
          )}

          {product.discountPercent > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Clickable Image */}
        <Link href={`/product/${product.slug}`} className="relative block w-full h-full">
          <div className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
            <Image
              src={isHovered && secondaryImage !== primaryImage ? secondaryImage : primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              className="object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Product Information Body */}
      <div className="flex flex-col flex-grow p-4.5 bg-white space-y-2">
        {/* Product Title (Clean Jost/Inter font) */}
        <h3 className="font-heading font-semibold text-sm sm:text-base text-charcoal group-hover:text-botanical transition-colors line-clamp-2 min-h-[2.75rem] leading-snug">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Rating & Concern Row: ★ 4.8 (840) | Liver Detox */}
        <div className="flex items-center gap-1.5 text-xs text-charcoal-muted">
          <div className="flex items-center text-emerald-700 font-bold gap-0.5">
            <Star size={13} className="fill-emerald-600 text-emerald-600" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-stone-400">({product.reviewCount})</span>
          <span className="text-stone-300">|</span>
          <span className="truncate font-medium text-stone-600">
            {product.healthConcerns[0] || 'Ayurvedic Care'}
          </span>
        </div>

        {/* Pack / Size Pill Badge */}
        <div>
          <span className="inline-block text-[11px] font-medium text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
            {sizeLabel}
          </span>
        </div>

        {/* Price Row: ₹Price ₹Regular % OFF */}
        <div className="pt-1 flex items-baseline gap-2 flex-wrap">
          <span className="font-heading font-bold text-base sm:text-lg text-forest">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.regularPrice > product.price && (
            <span className="text-xs text-stone-400 line-through">
              ₹{product.regularPrice.toLocaleString('en-IN')}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="text-xs font-bold text-emerald-700">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Special Offer Pill: 🏷️ Get it for ₹X */}
        <div className="bg-[#FAF7EE] border border-[#E9DEC5] rounded-lg px-2.5 py-1.5 flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1 text-stone-700 font-medium truncate">
            <span className="text-amber-600 font-bold">⚡</span>
            <span>Prepaid Special:</span>
          </span>
          <span className="font-bold text-forest ml-1">
            ₹{prepaidDiscountPrice.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Full-Width Add to Cart CTA Button */}
        <div className="pt-2">
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to cart`}
            className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-xs active:scale-[0.98] ${
              isAdded
                ? 'bg-forest text-white'
                : 'bg-botanical hover:bg-forest text-white'
            } disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed`}
          >
            {isAdded ? (
              <>
                <Check size={15} />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={15} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
