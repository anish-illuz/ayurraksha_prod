'use client';

import React from 'react';
import { ShoppingBag, Check, Plus, Minus } from 'lucide-react';
import { Product } from '@/types/product';
import { RatingStars } from '@/components/RatingStars';
import { usePDP } from '@/context/PDPContext';
import { formatPackMeasurement } from '@/lib/formatPack';

interface MobileProductHeaderProps {
  product: Product;
}

export const MobileProductHeader: React.FC<MobileProductHeaderProps> = ({ product }) => {
  const {
    packOptions,
    selectedPack,
    selectedPackId,
    setSelectedPackId,
    quantity,
    setQuantity,
    currentPrice,
    currentRegularPrice,
    currentDiscount,
    isAvailable,
    isAdded,
    handleAddToCart,
  } = usePDP();

  const categoryName = product.healthConcerns[0] || product.categories[0] || 'Ayurvedic Wellness';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs">
      {/* Category Eyebrow & SKU */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-bold text-botanical uppercase tracking-wider">
          {categoryName}
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8EFE6] text-forest border border-forest/10">
          {product.skuBadge || `SKU: ${product.sku || product.id}`}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest leading-tight mb-1.5">
        {product.name}
      </h1>

      {/* Rating & Review Count */}
      <div className="flex items-center gap-2 mb-2.5">
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={15} />
        <span className="text-xs sm:text-sm text-charcoal-muted font-medium">
          {product.rating} ({product.reviewCount || 19} reviews)
        </span>
      </div>

      {/* Key Benefit Summary */}
      <p className="text-xs sm:text-sm text-charcoal/85 leading-relaxed font-sans mb-3.5">
        {product.shortDescription || product.subtitle || 'Traditional botanical formulation crafted for authentic wellness.'}
      </p>

      {/* Synchronized Course Selector Pills */}
      {packOptions.length > 1 && (
        <div className="grid grid-cols-2 gap-2 mb-3.5">
          {packOptions.map((pack) => {
            const isSelected = selectedPackId === pack.id;
            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => setSelectedPackId(pack.id)}
                className={`py-2 px-3 rounded-xl text-left border transition-all text-xs sm:text-sm flex items-center justify-between ${
                  isSelected
                    ? 'border-botanical bg-emerald-50/70 font-bold text-forest shadow-2xs'
                    : 'border-stone-200 bg-stone-50/60 text-charcoal/80 hover:bg-stone-100/70'
                }`}
              >
                <span className="truncate whitespace-nowrap">{formatPackMeasurement(pack.name)}</span>
                <span className="font-bold ml-1.5 text-forest whitespace-nowrap">₹{pack.price}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Price Box + Quantity Stepper + Add to Cart Action Row */}
      <div className="space-y-3 pt-3 border-t border-stone-100">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-forest">
              ₹{(currentPrice * quantity).toLocaleString('en-IN')}
            </span>
            {currentRegularPrice > currentPrice && (
              <span className="text-sm text-stone-400 line-through">
                ₹{(currentRegularPrice * quantity).toLocaleString('en-IN')}
              </span>
            )}
            {currentDiscount > 0 && (
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#E67E22] text-white">
                Save {currentDiscount}%
              </span>
            )}
          </div>

          <span className="text-xs text-emerald-800 font-semibold">
            {isAvailable ? 'In Stock • Free Shipping' : 'Out of Stock'}
          </span>
        </div>

        {/* Quantity Stepper & Add to Cart Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quantity Stepper */}
          {isAvailable && (
            <div className="flex items-center border border-stone-200 rounded-xl bg-white overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="p-2.5 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
              >
                <Minus size={15} />
              </button>
              <span className="w-8 text-center text-sm font-bold text-charcoal">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="p-2.5 text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <Plus size={15} />
              </button>
            </div>
          )}

          {/* Prominent Add to Cart Button */}
          {isAvailable ? (
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-grow inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-bold transition-all shadow-xs active:scale-98 ${
                isAdded
                  ? 'bg-forest text-white'
                  : 'bg-[#16382C] hover:bg-[#0E251D] text-white'
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={16} />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>Add to Cart • ₹{(currentPrice * quantity).toLocaleString('en-IN')}</span>
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="flex-grow py-3 px-5 rounded-xl text-xs sm:text-sm font-semibold bg-stone-200 text-stone-500 cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
