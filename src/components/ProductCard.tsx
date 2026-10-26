'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { RatingStars } from './RatingStars';
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

  return (
    <div
      className="group relative flex flex-col bg-white rounded-card border border-stone-200/80 overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-botanical/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        {product.discountPercent > 0 ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-badge text-[11px] font-semibold bg-terracotta text-white shadow-sm">
            Save {product.discountPercent}%
          </span>
        ) : (
          <span />
        )}
        {product.healthConcerns[0] && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-badge text-[10px] font-medium bg-sage/90 text-forest backdrop-blur-xs">
            {product.healthConcerns[0]}
          </span>
        )}
      </div>

      {/* Product Image Link */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block w-full aspect-square bg-[#FDFBF7] overflow-hidden p-6"
      >
        <div className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
          <Image
            src={isHovered && secondaryImage !== primaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-contain transition-opacity duration-300"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-grow p-4 bg-white">
        {/* Rating */}
        <div className="mb-1.5">
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-charcoal group-hover:text-botanical transition-colors line-clamp-2 min-h-[2.5rem]">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Short Factual Description */}
        <p className="mt-1 text-xs text-charcoal-muted line-clamp-2 leading-relaxed flex-grow">
          {product.shortDescription || product.cleanDescription}
        </p>

        {/* Price & Action */}
        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-forest">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.regularPrice > product.price && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{product.regularPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block">
              Free Shipping on Prepaid
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to cart`}
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-button text-xs font-semibold transition-all duration-200 active:scale-95 ${
              isAdded
                ? 'bg-botanical text-white'
                : 'bg-forest hover:bg-forest-light text-white'
            } disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed`}
          >
            {isAdded ? (
              <>
                <Check size={14} />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
