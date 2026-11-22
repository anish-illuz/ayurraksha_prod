'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag, Check, Tag, Plus, Minus } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/lib/cartContext';
import { trackSelectItem } from '@/lib/storefrontAnalytics';
import { getProductSpecBadge } from '@/lib/formatPack';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  /** GA4 `select_item` item_list_name; defaults to 'Shop'. */
  itemList?: string;
  /** 1-based position of the product within its list (GA4 index param). */
  selectItemIndex?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  priority = false,
  itemList = 'Shop',
  selectItemIndex,
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isComboAdded, setIsComboAdded] = useState(false);

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

  // GA4/GTM select_item: fired when the customer chooses this product from a
  // list. Attached to the card's navigational links WITHOUT preventDefault so
  // next/link still navigates to the PDP.
  const handleCardSelect = (e: React.MouseEvent) => {
    trackSelectItem(product, itemList, selectItemIndex ?? 1);
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

  const primaryImage = product.images[0] || 'https://cms.ayurrakshaonline.com/wp-content/uploads/2024/02/1-1024x1024.jpg';

  // Pack / size badge sourced strictly from WordPress ACF "Product Specifications".
  // If the specification is missing or unavailable, the badge is hidden.
  const specBadge = getProductSpecBadge(product);

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:border-botanical/50"
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
        <Link href={`/product/${product.slug}`} prefetch={false} onClick={handleCardSelect} className="relative block w-full h-full">
          <div className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
            <Image
              src={primaryImage}
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
          <Link href={`/product/${product.slug}`} onClick={handleCardSelect}>{product.name}</Link>
        </h3>

        {/* Rating & Concern Row: ★ 4.8 (840) | Liver Wellness */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-charcoal">
          <div className="flex items-center text-botanical font-bold gap-1">
            <Star size={12} className="fill-botanical text-botanical flex-shrink-0" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-stone-600 font-semibold text-[11px] sm:text-xs">({product.reviewCount})</span>
          {product.healthConcerns[0] && (
            <>
              <span className="text-stone-300">|</span>
              <span className="truncate max-w-[130px] font-medium text-stone-700 text-[11px] sm:text-xs">
                {product.healthConcerns[0]}
              </span>
            </>
          )}
        </div>

        {/* Pack / Size Pill Badge — sourced strictly from ACF Product Specifications; hidden when unavailable */}
        {specBadge ? (
          <div>
            <span className="inline-block text-[11px] sm:text-xs font-semibold text-stone-800 bg-stone-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-stone-200">
              {specBadge}
            </span>
          </div>
        ) : null}

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

        {/* Quantity Stepper + Primary Add to Cart Action Row.
            On mobile (< sm), controls stack vertically (h-8 stepper, h-9 button)
            so the Add to Cart button has full card width and is never clipped or wrapped.
            On sm+ screens, side-by-side with streamlined stepper (w-[84px] h-10). */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2">
          {/* Quantity + / - Stepper */}
          <div className="flex items-center justify-between border border-stone-300 rounded-lg sm:rounded-xl bg-stone-50 overflow-hidden flex-shrink-0 h-8 sm:h-10 w-full sm:w-[84px]">
            <button
              onClick={handleDecrement}
              aria-label="Decrease quantity"
              className="w-8 sm:w-7 h-full flex items-center justify-center text-stone-700 hover:bg-stone-200 active:scale-90 transition-all disabled:opacity-40"
              disabled={quantity <= 1 || !product.inStock}
            >
              <Minus size={11} />
            </button>
            <span className="flex-1 text-center text-xs sm:text-sm font-bold text-forest select-none">
              {quantity}
            </span>
            <button
              disabled={!product.inStock}
              onClick={handleIncrement}
              aria-label="Increase quantity"
              className="w-8 sm:w-7 h-full flex items-center justify-center text-stone-700 hover:bg-stone-200 active:scale-90 transition-all"
            >
              <Plus size={11} />
            </button>
          </div>

          {/* Primary Add to Cart CTA Button */}
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to cart`}
            className={`w-full sm:flex-1 min-w-0 h-9 sm:h-10 inline-flex items-center justify-center gap-1.5 px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold uppercase tracking-tight whitespace-nowrap transition-all duration-200 shadow-xs active:scale-[0.98] ${
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
