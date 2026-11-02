'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
import { Product, PackOption } from '@/types/product';
import { RatingStars } from '@/components/RatingStars';
import { useCart } from '@/lib/cartContext';

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Pack / Course Options
  const packOptions: PackOption[] = product.packOptions && product.packOptions.length > 0
    ? product.packOptions
    : [
        {
          id: 'standard',
          name: 'Standard Course',
          subtitle: product.specNetQuantity || '40 Sachets × 5g (200g net)',
          price: product.price,
          regularPrice: product.regularPrice > product.price ? product.regularPrice : Math.round(product.price * 1.15),
          isDefault: true
        },
        {
          id: 'family',
          name: '3-Month Family Regimen',
          subtitle: '120 Sachets (600g net)',
          price: Math.round(product.price * 2.65),
          regularPrice: Math.round(product.price * 3.4),
          discountBadge: 'Save 22%'
        }
      ];

  const [selectedPackId, setSelectedPackId] = useState<string>(
    packOptions.find(p => p.isDefault)?.id || packOptions[0].id
  );

  const selectedPack = packOptions.find(p => p.id === selectedPackId) || packOptions[0];
  const currentPrice = selectedPack.price;
  const currentRegularPrice = selectedPack.regularPrice || product.regularPrice;
  const currentDiscount = currentRegularPrice > currentPrice
    ? Math.round(((currentRegularPrice - currentPrice) / currentRegularPrice) * 100)
    : product.discountPercent;

  const [isAdded, setIsAdded] = useState(false);
  const [openShipping, setOpenShipping] = useState(false);

  const isAvailable = product.inStock;

  const handleAddToCart = () => {
    addToCart(
      product,
      quantity,
      selectedPack.name,
      currentPrice
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const whatsappInquiryUrl = `https://wa.me/919940388877?text=${encodeURIComponent(
    `Hello Dr. Jegajothi Pandian & AyurRaksha team, I would like to consult about ${product.name} (${selectedPack.name} - ₹${currentPrice}).`
  )}`;

  const categoryName = product.healthConcerns[0] || product.categories[0] || 'Digestive & Gut Health';

  return (
    <div className="flex flex-col space-y-6">
      {/* Category Eyebrow & SKU Pill Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-botanical uppercase tracking-wider">
          {categoryName}
        </span>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#E8EFE6] text-forest border border-forest/10">
          {product.skuBadge || `SKU: ${product.sku || product.id}`}
        </span>
      </div>

      {/* Product Title & Subtitle */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest leading-tight">
          {product.name}
        </h1>
        <p className="mt-1 text-sm sm:text-base text-charcoal/70 font-sans">
          {product.subtitle || 'Ayurvedic Herbal Tea • Single-Serving Powder Sachets'}
        </p>
      </div>

      {/* Rating & Verified Formula Badge */}
      <div className="flex flex-wrap items-center gap-3">
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={16} />
        <span className="text-xs text-charcoal-muted">
          4.8 ({product.reviewCount || 19} verified buyer reviews)
        </span>
        <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <Check size={12} className="text-emerald-700" />
          <span>Verified Formula</span>
        </span>
      </div>

      {/* Short Summary Description */}
      <p className="text-sm sm:text-base text-charcoal/90 leading-relaxed font-sans">
        {product.shortDescription || 'Experience Ayurvedic wellness with this traditional botanical blend crafted to support natural bodily regularity and daily restorative vitality.'}
      </p>

      {/* Mint Green Price Box matching Reference 3.png */}
      <div className="p-4 sm:p-5 bg-[#EEF5EE] rounded-2xl border border-emerald-900/10 space-y-1.5">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-serif font-bold text-forest">
            ₹{currentPrice.toLocaleString('en-IN')}
          </span>
          {currentRegularPrice > currentPrice && (
            <span className="text-lg text-stone-400 line-through">
              ₹{currentRegularPrice.toLocaleString('en-IN')}
            </span>
          )}
          {currentDiscount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E67E22] text-white">
              Save {currentDiscount}%
            </span>
          )}
        </div>
        <p className="text-xs text-forest/80 font-medium">
          Inclusive of all taxes. Free shipping on all prepaid orders across India.
        </p>
      </div>

      {/* Select Pack / Course Radio Cards matching Reference 3.png */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
            Select Pack / Course:
          </label>
          <span className="text-xs text-charcoal-muted">
            Delivered: {selectedPack.subtitle}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {packOptions.map((pack) => {
            const isSelected = selectedPackId === pack.id;
            return (
              <div
                key={pack.id}
                onClick={() => setSelectedPackId(pack.id)}
                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col justify-between relative ${
                  isSelected
                    ? 'border-botanical bg-white shadow-xs'
                    : 'border-stone-200/90 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-botanical' : 'border-stone-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-botanical" />}
                    </div>
                    <span className="text-sm font-bold text-forest">{pack.name}</span>
                  </div>
                  {pack.discountBadge && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-900">
                      {pack.discountBadge}
                    </span>
                  )}
                </div>

                <span className="text-xs text-charcoal-muted block pl-6">
                  {pack.subtitle}
                </span>

                <div className="mt-3 pt-2 border-t border-stone-100 pl-6 flex items-baseline justify-between">
                  <span className="text-base font-bold text-forest">
                    ₹{pack.price.toLocaleString('en-IN')}
                  </span>
                  {pack.regularPrice && pack.regularPrice > pack.price && (
                    <span className="text-xs text-stone-400 line-through">
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
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
          </span>
          <span>In Stock • Dispatched within 1–2 business days from Chennai</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/80 px-3.5 py-2.5 rounded-xl">
          <span className="relative flex h-2.5 w-2.5">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
          </span>
          <span>Currently Out of Stock • Fresh Batch in Preparation</span>
        </div>
      )}

      {/* Quantity Stepper & Add to Cart Controls */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          {isAvailable && (
            <div className="flex items-center border border-stone-200 rounded-2xl bg-white overflow-hidden shadow-2xs">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="p-3.5 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center text-sm font-bold text-charcoal">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="p-3.5 text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          )}

          {/* Add to Cart Button */}
          {isAvailable ? (
            <button
              onClick={handleAddToCart}
              className={`flex-grow inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-base font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.99] ${
                isAdded
                  ? 'bg-forest text-white'
                  : 'bg-[#16382C] hover:bg-[#0E251D] text-white'
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={20} className="flex-shrink-0" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={20} className="flex-shrink-0" />
                  <span>Add to Cart • ₹{(currentPrice * quantity).toLocaleString('en-IN')}</span>
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="flex-grow inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-sm font-semibold bg-stone-200 text-stone-500 cursor-not-allowed border border-stone-300"
            >
              <ShoppingBag size={18} className="flex-shrink-0 text-stone-400" />
              <span>Out of Stock</span>
            </button>
          )}
        </div>

        {/* Doctor Consultation Row matching 3.png */}
        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-charcoal pt-1">
          <div className="flex items-center gap-1.5 text-botanical">
            <Award size={15} />
            <span>Doctor Formulated</span>
          </div>
          <span className="text-stone-300">•</span>
          <a
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-800 hover:text-emerald-900 underline underline-offset-4"
          >
            <MessageSquare size={14} className="text-emerald-700" />
            <span>Dr. Chat Consultation</span>
          </a>
        </div>
      </div>

      {/* 4 Trust Badges Strip matching Reference 3.png */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-center text-xs text-charcoal-muted">
        <div className="p-3 bg-white rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col items-center justify-center">
          <Truck size={18} className="text-botanical mb-1" />
          <span className="font-bold text-forest block text-xs">Free Delivery</span>
          <span className="text-[10px] text-charcoal/70">Prepaid across India</span>
        </div>
        <div className="p-3 bg-white rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col items-center justify-center">
          <ShieldCheck size={18} className="text-botanical mb-1" />
          <span className="font-bold text-forest block text-xs">100% Classical</span>
          <span className="text-[10px] text-charcoal/70">Zero synthetic fillers</span>
        </div>
        <div className="p-3 bg-white rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col items-center justify-center">
          <RefreshCw size={18} className="text-botanical mb-1" />
          <span className="font-bold text-forest block text-xs">7-Day Return</span>
          <span className="text-[10px] text-charcoal/70">Unopened consignment</span>
        </div>
        <div className="p-3 bg-white rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col items-center justify-center">
          <Award size={18} className="text-botanical mb-1" />
          <span className="font-bold text-forest block text-xs">Vaidya Formulated</span>
          <span className="text-[10px] text-charcoal/70">Doctor supervised</span>
        </div>
      </div>

      {/* Shipping terms expandable toggle */}
      <div className="pt-2">
        <button
          onClick={() => setOpenShipping(!openShipping)}
          className="text-xs text-charcoal-muted hover:text-forest flex items-center justify-between w-full py-2 border-t border-stone-200"
        >
          <span>Shipping, Dispatch &amp; Return Policy Details</span>
          <ChevronDown size={14} className={`transition-transform ${openShipping ? 'rotate-180' : ''}`} />
        </button>
        {openShipping && (
          <div className="p-3 bg-white rounded-xl text-xs text-charcoal/80 space-y-1 mt-1 border border-stone-100">
            <p>• <strong>Free Prepaid Delivery:</strong> All prepaid orders ship free anywhere in India.</p>
            <p>• <strong>Cash on Delivery:</strong> Available across India with ₹100 courier convenience charge.</p>
            <p>• <strong>Standard Transit:</strong> 2–4 business days metro, 4–6 days non-metro.</p>
          </div>
        )}
      </div>
    </div>
  );
};
