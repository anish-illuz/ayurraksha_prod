'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag, Check, Tag, Plus, Minus } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/lib/cartContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((prev) => prev + 1);
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

  // Calculate promotional prepaid price (10% extra on prepaid)
  const prepaidDiscountPrice = Math.round(product.price * 0.9);

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-botanical/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Banner Offer Chip */}
      <div className="bg-[#F0F5E6] text-forest text-xs font-semibold py-2 px-3 text-center border-b border-stone-100 flex items-center justify-center gap-1.5">
        <Tag size={13} className="text-botanical flex-shrink-0" />
        <span className="truncate">Prepaid Orders: Free Shipping Across India</span>
      </div>

      {/* Product Image Area - Clean Full Bleed Without Awkward White Box Border */}
      <div className="relative block w-full aspect-square bg-[#FAF8F5] overflow-hidden p-1.5 sm:p-2">
        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
          {product.isBestseller ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-forest text-white shadow-xs">
              BESTSELLER
            </span>
          ) : product.discountPercent >= 15 ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-botanical text-white shadow-xs">
              POPULAR
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-stone-700 text-white shadow-xs">
              AYURVEDIC
            </span>
          )}

          {product.discountPercent > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
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
              className="object-contain w-full h-full"
            />
          </div>
        </Link>
      </div>

      {/* Product Information Body with proper standard Tailwind spacing */}
      <div className="flex flex-col flex-grow p-4 sm:p-5 bg-white space-y-3">
        {/* Product Title (Clean Jost font, standardized height) */}
        <h3 className="font-heading font-bold text-base sm:text-lg text-forest group-hover:text-botanical transition-colors line-clamp-2 min-h-[3rem] leading-snug">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Rating & Concern Row: ★ 4.8 (840) | Liver Wellness */}
        <div className="flex items-center gap-2 text-sm text-charcoal-muted">
          <div className="flex items-center text-botanical font-bold gap-1">
            <Star size={14} className="fill-botanical text-botanical" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-stone-400 text-xs">({product.reviewCount})</span>
          <span className="text-stone-300">|</span>
          <span className="truncate font-medium text-stone-600 text-xs">
            {product.healthConcerns[0] || 'Ayurvedic Care'}
          </span>
        </div>

        {/* Pack / Size Pill Badge */}
        <div>
          <span className="inline-block text-xs font-medium text-stone-600 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
            {sizeLabel}
          </span>
        </div>

        {/* Price Row: ₹Price ₹Regular % OFF */}
        <div className="pt-0.5 flex items-baseline gap-2.5 flex-wrap">
          <span className="font-heading font-bold text-lg sm:text-xl text-forest">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.regularPrice > product.price && (
            <span className="text-xs sm:text-sm text-stone-400 line-through">
              ₹{product.regularPrice.toLocaleString('en-IN')}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="text-xs sm:text-sm font-bold text-botanical">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Special Offer Pill: ⚡ Prepaid Special: ₹X */}
        <div className="bg-[#F4F7EE] border border-[#DCE4CF] rounded-xl px-3 py-2 flex items-center justify-between text-xs sm:text-sm">
          <span className="flex items-center gap-1.5 text-stone-700 font-medium truncate">
            <span className="text-botanical font-bold">⚡</span>
            <span>Prepaid Special:</span>
          </span>
          <span className="font-bold text-forest ml-1">
            ₹{prepaidDiscountPrice.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Quantity Stepper + Add to Cart Action Row */}
        <div className="pt-1 flex items-center gap-2">
          {/* Quantity + / - Stepper */}
          <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 overflow-hidden flex-shrink-0 h-11">
            <button
              onClick={handleDecrement}
              aria-label="Decrease quantity"
              className="w-8 h-full flex items-center justify-center text-stone-700 hover:bg-stone-200 active:scale-90 transition-all disabled:opacity-40"
              disabled={quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span className="w-7 text-center text-sm font-bold text-forest select-none">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              aria-label="Increase quantity"
              className="w-8 h-full flex items-center justify-center text-stone-700 hover:bg-stone-200 active:scale-90 transition-all"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to Cart CTA Button */}
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to cart`}
            className={`flex-grow h-11 inline-flex items-center justify-center gap-2 px-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-xs active:scale-[0.98] ${
              !product.inStock
                ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                : isAdded
                ? 'bg-forest text-white'
                : 'bg-botanical hover:bg-forest text-white'
            }`}
          >
            {!product.inStock ? (
              <span>Out of Stock</span>
            ) : isAdded ? (
              <>
                <Check size={16} />
                <span>Added ({quantity})!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span>Add {quantity > 1 ? `(${quantity})` : ''}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
