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

  const whatsappInquiryUrl = `https://wa.me/919940388877?text=${encodeURIComponent(
    `Hello Dr. Jegajothi Pandian & AyurRaksha team, I would like to consult about ${product.name} (${selectedPack.name} - ₹${currentPrice}).`
  )}`;

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

      {/* Mint Green Price Box matching Reference 3.png (Desktop only) */}
      <div className="hidden lg:block p-4 sm:p-5 bg-[#EEF5EE] rounded-2xl border border-emerald-900/10 space-y-1.5">
        <div className="flex items-baseline gap-2.5">
          <span className="text-3xl sm:text-4xl font-serif font-bold text-forest">
            ₹{totalPrice.toLocaleString('en-IN')}
          </span>
          {isSecondVariant && currentRegularPrice > totalPrice && (
            <span className="text-base sm:text-lg text-stone-400 line-through">
              ₹{currentRegularPrice.toLocaleString('en-IN')}
            </span>
          )}
          {isSecondVariant && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#8C3A00] text-white shadow-2xs">
              Save 5%
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-forest/80 font-medium">
          {isSecondVariant
            ? `Special 5% second-variant bundle savings applied (Save ₹${savingsAmount.toLocaleString('en-IN')} on 3 units). Inclusive of all taxes.`
            : 'Inclusive of all taxes. Free express shipping on all prepaid orders across India.'}
        </p>
      </div>

      {/* Select Pack / Course Radio Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider">
            Select Course / Pack Size:
          </label>
          <span className="text-[11px] text-charcoal-muted whitespace-nowrap">
            {formatPackMeasurement(selectedPack.subtitle)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {packOptions.map((pack) => {
            const isSelected = selectedPackId === pack.id;
            return (
              <div
                key={pack.id}
                onClick={() => setSelectedPackId(pack.id)}
                className={`cursor-pointer p-3 sm:p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between relative ${
                  isSelected
                    ? 'border-botanical bg-white shadow-2xs'
                    : 'border-stone-200/90 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-botanical' : 'border-stone-300'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-botanical" />}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-forest whitespace-nowrap">{formatPackMeasurement(pack.name)}</span>
                  </div>
                  {pack.discountBadge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900 shrink-0 whitespace-nowrap">
                      {pack.discountBadge}
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-charcoal-muted block pl-5 mb-2 whitespace-nowrap">
                  {formatPackMeasurement(pack.subtitle)}
                </span>

                <div className="pt-1.5 border-t border-stone-100 pl-5 flex items-baseline justify-between">
                  <span className="text-sm sm:text-base font-bold text-forest whitespace-nowrap">
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
                disabled={quantity <= (selectedPack.packCount || 1)}
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
          <span>Need dosage guidance?</span>
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-950 underline underline-offset-4"
          >
            <MessageSquare size={13} className="text-emerald-700" />
            <span>Chat with Vaidya Team</span>
          </a>
        </div>
      </div>

      {/* 4 Practical Purchase Assurance Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center text-xs">
        <div className="p-2 sm:p-2.5 bg-white rounded-xl border border-stone-200/90 shadow-2xs flex flex-col items-center justify-center">
          <Truck size={16} className="text-botanical mb-0.5" />
          <span className="font-bold text-forest block text-[11px]">Free Shipping</span>
          <span className="text-[9px] text-charcoal/70">Prepaid orders</span>
        </div>
        <div className="p-2 sm:p-2.5 bg-white rounded-xl border border-stone-200/90 shadow-2xs flex flex-col items-center justify-center">
          <RefreshCw size={16} className="text-botanical mb-0.5" />
          <span className="font-bold text-forest block text-[11px]">7-Day Return</span>
          <span className="text-[9px] text-charcoal/70">Unopened packs</span>
        </div>
        <div className="p-2 sm:p-2.5 bg-white rounded-xl border border-stone-200/90 shadow-2xs flex flex-col items-center justify-center">
          <ShieldCheck size={16} className="text-botanical mb-0.5" />
          <span className="font-bold text-forest block text-[11px]">Cash on Delivery</span>
          <span className="text-[9px] text-charcoal/70">Pan-India available</span>
        </div>
        <div className="p-2 sm:p-2.5 bg-white rounded-xl border border-stone-200/90 shadow-2xs flex flex-col items-center justify-center">
          <Award size={16} className="text-botanical mb-0.5" />
          <span className="font-bold text-forest block text-[11px]">AyurRaksha Care</span>
          <span className="text-[9px] text-charcoal/70">Doctor guidance</span>
        </div>
      </div>

      {/* Shipping terms expandable toggle */}
      <div className="pt-1">
        <button
          onClick={() => setOpenShipping(!openShipping)}
          className="text-[11px] text-charcoal-muted hover:text-forest flex items-center justify-between w-full py-1.5 border-t border-stone-200"
        >
          <span>Shipping, Dispatch &amp; Return Policy Details</span>
          <ChevronDown size={13} className={`transition-transform ${openShipping ? 'rotate-180' : ''}`} />
        </button>
        {openShipping && (
          <div className="p-3 bg-white rounded-xl text-xs text-charcoal/80 space-y-1 mt-1 border border-stone-100">
            <p>• <strong>Free Prepaid Delivery:</strong> All prepaid orders ship free anywhere in India.</p>
            <p>• <strong>Cash on Delivery:</strong> Available across India with standard courier handling.</p>
            <p>• <strong>Standard Transit:</strong> 2–4 business days metro, 4–6 days non-metro.</p>
          </div>
        )}
      </div>
    </div>
  );
};
