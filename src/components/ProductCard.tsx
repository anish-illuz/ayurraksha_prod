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
  const [isComboAdded, setIsComboAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleQuickComboAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    try {
      const saved = localStorage.getItem('ayurraksha_combo_selection_v2');
      const comboCart = saved ? JSON.parse(saved) : {};
      comboCart[product.id] = (comboCart[product.id] || 0) + quantity;
      localStorage.setItem('ayurraksha_combo_selection_v2', JSON.stringify(comboCart));
      setIsComboAdded(true);
      setTimeout(() => setIsComboAdded(false), 1800);
    } catch {
      // Ignore
    }
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

  // Determine size/pack label accurately based on product title or category
  const titleSizeMatch = product.name.match(/\b(\d+)\s*(ml|g)\b/i);
  const isTablet = product.name.toLowerCase().includes('tablet');

  const sizeLabel = (product.variants.find(v => v.default) || product.variants[0])?.name || (
    titleSizeMatch ? `${titleSizeMatch[1]} ${titleSizeMatch[2]}` :
    product.specNetQuantity ? product.specNetQuantity :
    isTablet ? '60 Tablets' :
    product.categorySlugs.includes('oil') ? '100 ml' :
    product.categorySlugs.includes('tonic') ? '200 ml' :
    product.categorySlugs.includes('capsules') ? '60 Capsules' :
    product.categorySlugs.includes('powder') ? '100 g' :
    product.categorySlugs.includes('soap') ? 'Pack of 2' :
    'Standard Pack'
  );

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-botanical/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Area - Clean Full Bleed Without Awkward White Box Border */}
      <div className="relative block w-full aspect-square bg-[#FAF8F5] overflow-hidden p-1.5 sm:p-2">
        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
          {product.isBestseller ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-forest text-white shadow-xs">
              BESTSELLER
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-stone-800 text-white shadow-xs">
              AYURVEDIC
            </span>
          )}
        </div>

        {/* Clickable Image */}
        <Link href={`/product/${product.slug}`} prefetch={false} className="relative block w-full h-full">
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

      {/* Product Information Body with responsive padding */}
      <div className="flex flex-col flex-grow p-2 sm:p-4 bg-white space-y-2 sm:space-y-3">
        {/* Product Title (Larger and clearer for mobile scanning) */}
        <h3 className="font-heading font-bold text-[15px] sm:text-base md:text-lg text-forest group-hover:text-botanical transition-colors line-clamp-2 min-h-[2.85rem] leading-snug">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Rating & Concern Row: ★ 4.8 (840) | Liver Wellness */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-charcoal">
          <div className="flex items-center text-botanical font-bold gap-1">
            <Star size={12} className="fill-botanical text-botanical flex-shrink-0" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-stone-600 font-semibold text-[11px] sm:text-xs">({product.reviewCount})</span>
          <span className="text-stone-300">|</span>
          <span className="truncate max-w-[130px] font-medium text-stone-700 text-[11px] sm:text-xs">
            {product.healthConcerns[0] || 'Ayurvedic Care'}
          </span>
        </div>

        {/* Pack / Size Pill Badge */}
        <div>
          <span className="inline-block text-[11px] sm:text-xs font-semibold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
            {sizeLabel}
          </span>
        </div>

        {/* Price Row: ₹Price ₹Regular % OFF */}
        <div className="pt-0.5 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
          <span className="font-heading font-bold text-lg md:text-xl text-forest">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.regularPrice > product.price && (
            <span className="text-[11px] sm:text-sm text-stone-500 font-normal line-through">
              ₹{product.regularPrice.toLocaleString('en-IN')}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="text-[11px] sm:text-xs font-bold text-botanical">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Quantity Stepper + Primary Add to Cart Action Row */}
        <div className="pt-2 flex items-stretch gap-2">
          {/* Quantity + / - Stepper */}
          <div className="flex items-center border border-stone-300 rounded-lg sm:rounded-xl bg-stone-50 overflow-hidden flex-shrink-0 h-10">
            <button
              onClick={handleDecrement}
              aria-label="Decrease quantity"
              className="w-9 h-full flex items-center justify-center text-stone-700 hover:bg-stone-200 active:scale-90 transition-all disabled:opacity-40"
              disabled={quantity <= 1 || !product.inStock}
            >
              <Minus size={11} />
            </button>
            <span className="w-6 text-center text-xs sm:text-sm font-bold text-forest select-none">
              {quantity}
            </span>
            <button
              disabled={!product.inStock}
              onClick={handleIncrement}
              aria-label="Increase quantity"
              className="w-9 h-full flex items-center justify-center text-stone-700 hover:bg-stone-200 active:scale-90 transition-all"
            >
              <Plus size={11} />
            </button>
          </div>

          {/* Primary Add to Cart CTA Button */}
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to cart`}
            className={`flex-1 min-w-0 h-10 inline-flex items-center justify-center gap-1.5 px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold uppercase tracking-tight whitespace-nowrap transition-all duration-200 shadow-xs active:scale-[0.98] ${
              !product.inStock
                ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                : isAdded
                ? 'bg-forest text-white'
                : 'bg-botanical hover:bg-forest text-white'
            }`}
          >
            {!product.inStock ? (
              <span className="whitespace-nowrap">Out of Stock</span>
            ) : isAdded ? (
              <>
                <Check size={14} className="flex-shrink-0" />
                <span className="whitespace-nowrap">Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} className="flex-shrink-0" />
                <span className="whitespace-nowrap">Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
