'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Truck,
  ShieldCheck,
  RefreshCw,
  MessageSquare,
  Award,
  ChevronDown
} from 'lucide-react';
import { Product } from '@/types/product';
import { RatingStars } from '@/components/RatingStars';
import { usePDP } from '@/context/PDPContext';
import { formatPackMeasurement } from '@/lib/formatPack';
import { trackViewItem } from '@/lib/storefrontAnalytics';

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const {
    hasVariants,
    packOptions,
    selectedPack,
    selectedPackId,
    setSelectedPackId,
    quantity,
    incrementQuantity,
    decrementQuantity,
    currentPrice,
    currentRegularPrice,
    currentDiscount,
    totalPrice,
    isSecondVariant,
    savingsAmount,
    isAvailable,
    isAdded,
    handleAddToCart,
  } = usePDP();

  const [openShipping, setOpenShipping] = useState(false);

  useEffect(() => {
    trackViewItem(product);
  }, [product]);

  const whatsappInquiryUrl = 'https://wa.me/919940388877';

  const categoryName = product.healthConcerns[0] || product.categories[0] || 'Digestive & Gut Health';

  return (
    <div className="flex flex-col space-y-4 sm:space-y-5">
      {/* Category Eyebrow & SKU Pill Header (Desktop only - mobile shown in MobileProductHeader) */}
      <div className="hidden lg:flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-botanical uppercase tracking-wider">
          {categoryName}
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E8EFE6] text-forest border border-forest/10">
          {product.skuBadge || `SKU: ${product.sku || product.id}`}
        </span>
      </div>

      {/* Product Title & Subtitle (Desktop only) */}
      <div className="hidden lg:block">
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest leading-tight">
          {product.name}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-charcoal/70 font-sans">
          {product.subtitle || 'Ayurvedic Herbal Blend • Single-Serving Powder Sachets'}
        </p>
      </div>

      {/* Rating with Verified Reviews Count (Desktop only) */}
      <div className="hidden lg:flex items-center gap-2.5">
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={15} showText={false} />
        <span className="text-xs text-charcoal font-semibold">
          {product.rating} ({product.reviewCount || 19} verified reviews)
        </span>
      </div>

      {/* Short Summary Description (Desktop only) */}
      <p className="hidden lg:block text-sm sm:text-base text-charcoal/85 leading-relaxed font-sans">
        {product.shortDescription || 'Experience Ayurvedic wellness with this traditional botanical blend crafted to support natural bodily regularity and daily restorative vitality.'}
      </p>

      {/* Compact Price Row: Price + Original Price + Savings (Desktop only) */}
      <div className="hidden lg:flex flex-wrap items-baseline gap-x-3 gap-y-1.5 p-3.5 bg-[#EEF5EE] rounded-xl border border-emerald-900/10">
        <span className="text-2xl sm:text-3xl font-serif font-bold text-forest">
          ₹{totalPrice.toLocaleString('en-IN')}
        </span>
        {currentRegularPrice * quantity > totalPrice && (
          <span className="text-sm sm:text-base text-stone-400 line-through">
            ₹{(currentRegularPrice * quantity).toLocaleString('en-IN')}
          </span>
        )}
        {savingsAmount > 0 && (
          <span className="text-xs sm:text-sm font-bold text-emerald-800">
            You save ₹{savingsAmount.toLocaleString('en-IN')} ({currentDiscount}%)
          </span>
        )}
      </div>

      {/* Select Variant Radio Cards - ONLY when backend-configured variants exist */}
      {hasVariants && packOptions.length > 1 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">
              Select Variant:
            </label>
            {selectedPack.subtitle && (
              <span className="text-[11px] text-charcoal-muted whitespace-nowrap">
                {formatPackMeasurement(selectedPack.subtitle)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {packOptions.map((pack) => {
              const isSelected = selectedPackId === pack.id;
              const isOutOfStock = pack.inStock === false;
              return (
                <div
                  key={pack.id}
                  onClick={() => setSelectedPackId(pack.id)}
                  aria-disabled={isOutOfStock}
                  className={`p-3 sm:p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between relative ${
                    isOutOfStock
                      ? 'border-stone-200/70 bg-stone-50 opacity-60 cursor-not-allowed'
                      : isSelected
                        ? 'cursor-pointer border-botanical bg-white shadow-2xs'
                        : 'cursor-pointer border-stone-200/90 bg-white hover:border-stone-300'
                  }`}
                >
                  {isOutOfStock && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-stone-200 text-stone-600 whitespace-nowrap">
                      Out of stock
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-botanical' : isOutOfStock ? 'border-stone-200' : 'border-stone-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-botanical" />}
                      </div>
                      <span className={`text-xs sm:text-sm font-bold whitespace-nowrap ${isOutOfStock ? 'text-stone-400 line-through' : 'text-forest'}`}>
                        {formatPackMeasurement(pack.name)}
                      </span>
                    </div>
                    {!isOutOfStock && pack.discountBadge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900 shrink-0 whitespace-nowrap">
                        {pack.discountBadge}
                      </span>
                    )}
                  </div>

                  {pack.subtitle && (
                    <span className={`text-[11px] block pl-5 mb-2 whitespace-nowrap ${isOutOfStock ? 'text-stone-300' : 'text-charcoal-muted'}`}>
                      {formatPackMeasurement(pack.subtitle)}
                    </span>
                  )}

                  <div className={`pt-1.5 border-t pl-5 flex items-baseline justify-between ${isOutOfStock ? 'border-stone-200/60' : 'border-stone-100'}`}>
                    <span className={`text-sm sm:text-base font-bold whitespace-nowrap ${isOutOfStock ? 'text-stone-400' : 'text-forest'}`}>
                      ₹{pack.price.toLocaleString('en-IN')}
                    </span>
                    {pack.regularPrice && pack.regularPrice > pack.price && (
                      <span className="text-[11px] text-stone-400 line-through whitespace-nowrap">
                        ₹{pack.regularPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stock Status Indicator */}
      {isAvailable ? (
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span>In Stock • Dispatched within 1–2 business days</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/80 px-3 py-2 rounded-xl">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600" />
          </span>
          <span>Currently Out of Stock • Fresh Batch in Preparation</span>
        </div>
      )}

      {/* Quantity Stepper & Add to Cart Controls */}
      <div className="space-y-2 pt-0.5">
        <div className="flex items-center gap-2.5">
          {/* Quantity Selector */}
          {isAvailable && (
            <div className="flex items-center border border-stone-200 rounded-xl bg-white overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="p-2.5 sm:p-3 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
              >
                <Minus size={15} />
              </button>
              <span className="w-9 text-center text-xs sm:text-sm font-bold text-charcoal">
                {quantity}
              </span>
              <button
                type="button"
                onClick={incrementQuantity}
                aria-label="Increase quantity"
                className="p-2.5 sm:p-3 text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <Plus size={15} />
              </button>
            </div>
          )}

          {/* Add to Cart Button */}
          {isAvailable ? (
            <button
              onClick={handleAddToCart}
              className={`flex-grow inline-flex items-center justify-center gap-2 py-3 sm:py-3.5 px-5 rounded-xl text-sm sm:text-base font-bold transition-all shadow-sm hover:shadow active:scale-[0.99] ${
                isAdded
                  ? 'bg-forest text-white'
                  : 'bg-[#16382C] hover:bg-[#0E251D] text-white'
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={18} className="flex-shrink-0" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} className="flex-shrink-0" />
                  <span>Add to Cart • ₹{totalPrice.toLocaleString('en-IN')}</span>
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="flex-grow inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs sm:text-sm font-semibold bg-stone-200 text-stone-500 cursor-not-allowed border border-stone-300"
            >
              <ShoppingBag size={16} className="flex-shrink-0 text-stone-400" />
              <span>Out of Stock</span>
            </button>
          )}
        </div>

        {/* Doctor Consultation Link */}
        <div className="flex items-center justify-center gap-2 text-xs text-charcoal/80 pt-1">
          <span>Need guidance?</span>
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
          >
            <MessageSquare size={13} className="text-emerald-700" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Single Compact Trust & Delivery Row with Expandable Details */}
      <div className="pt-1">
        <p className="text-xs font-bold text-forest mb-1.5">You can expect</p>
        <div className="bg-white rounded-xl border border-stone-200/90 shadow-2xs p-2.5 sm:p-3">
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
            <div className="flex items-center gap-1.5">
              <Truck size={15} className="text-botanical shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-forest">Free Shipping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw size={15} className="text-botanical shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-forest">7-Day Return</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-botanical shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-forest">Cash on Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award size={15} className="text-botanical shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-forest">AyurRaksha Care</span>
            </div>
          </div>

          <button
            onClick={() => setOpenShipping(!openShipping)}
            aria-expanded={openShipping}
            className="mt-1.5 text-[11px] font-semibold text-charcoal-muted hover:text-forest flex items-center gap-1"
          >
            <span>How it works</span>
            <ChevronDown size={12} className={`transition-transform ${openShipping ? 'rotate-180' : ''}`} />
          </button>
          {openShipping && (
            <div className="mt-1.5 pt-2 border-t border-stone-100 text-[11px] sm:text-xs text-charcoal/80 space-y-1">
              <p><strong>Free Prepaid Delivery:</strong> All prepaid orders ship free anywhere in India.</p>
              <p><strong>7-Day Return:</strong> Unopened packs can be returned within 7 days.</p>
              <p><strong>Cash on Delivery:</strong> Pay at your doorstep, pan-India. Transit: 2–4 days metro, 4–6 days non-metro.</p>
              <p><strong>AyurRaksha Care:</strong> Doctor guidance available on WhatsApp for personal recommendations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
