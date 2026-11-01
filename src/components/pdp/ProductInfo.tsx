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
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Product } from '@/types/product';
import { RatingStars } from '@/components/RatingStars';
import { useCart } from '@/lib/cartContext';
import { SITE_CONFIG } from '@/data/siteConfig';

interface ProductInfoProps {
  product: Product;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.find((v) => v.default)?.name || product.variants[0]?.name || ''
  );
  const [isAdded, setIsAdded] = useState(false);
  const [isAddedToCombo, setIsAddedToCombo] = useState(false);
  const [openTab, setOpenTab] = useState<'desc' | 'dosage' | 'shipping'>('desc');

  const handleAddToCombo = () => {
    try {
      const saved = localStorage.getItem('ayurraksha_combo_selection_v2');
      const comboCart = saved ? JSON.parse(saved) : {};
      comboCart[product.id] = (comboCart[product.id] || 0) + quantity;
      localStorage.setItem('ayurraksha_combo_selection_v2', JSON.stringify(comboCart));
      setIsAddedToCombo(true);
      setTimeout(() => setIsAddedToCombo(false), 2400);
    } catch {
      // Ignore
    }
  };

  // Match selected variation directly from WooCommerce data
  const currentVariant = product.variants.find((v) => v.name === selectedVariant) || product.variants[0];
  const currentPrice = currentVariant?.price ?? product.price;
  const currentRegularPrice = currentVariant?.regularPrice ?? (product.regularPrice > product.price ? product.regularPrice : currentPrice);
  const currentDiscount = currentRegularPrice > currentPrice
    ? Math.round(((currentRegularPrice - currentPrice) / currentRegularPrice) * 100)
    : product.discountPercent;

  // Determine stock availability for product or selected variant
  const isAvailable = (currentVariant?.inStock ?? true) && product.inStock;

  const handleAddToCart = () => {
    addToCart(
      product,
      quantity,
      selectedVariant || undefined,
      currentPrice,
      currentVariant?.id
    );
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(
      product,
      quantity,
      selectedVariant || undefined,
      currentPrice,
      currentVariant?.id
    );
  };

  const whatsappInquiryUrl = `https://wa.me/919940388877?text=${encodeURIComponent(
    `Hello Dr. Jegajothi Pandian & AyurRaksha team, I would like to inquire about ${product.name}${
      selectedVariant ? ` (${selectedVariant})` : ''
    } (₹${currentPrice}).`
  )}`;

  return (
    <div id="product-purchase-options" className="flex flex-col space-y-6">
      {/* Brand & Category badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-botanical uppercase tracking-wider">
          AyurRaksha Classical Formulation
        </span>
        {product.healthConcerns[0] && (
          <span className="px-2 py-0.5 rounded-badge text-[11px] font-medium bg-sage text-forest">
            {product.healthConcerns[0]}
          </span>
        )}
      </div>

      {/* Product Title */}
      <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-forest leading-tight">
        {product.name}
      </h1>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-3">
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={16} />
        <span className="text-xs text-charcoal-muted">•</span>
        <span className="text-xs text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded">
          Verified Formulation
        </span>
      </div>

      {/* Brief product-specific introduction immediately below title/rating before price */}
      <p className="text-sm sm:text-base text-charcoal/90 leading-relaxed font-sans border-l-2 border-primary/30 pl-3 py-0.5">
        {product.cleanDescription || product.shortDescription || 'Authentic doctor-formulated classical Ayurvedic preparation crafted with standardized botanical extracts for daily wellness.'}
      </p>

      {/* Dynamic Price & Savings directly linked to selected variation */}
      <div className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-bold text-forest">
            ₹{currentPrice.toLocaleString('en-IN')}
          </span>
          {currentRegularPrice > currentPrice && (
            <span className="text-base text-stone-400 line-through">
              ₹{currentRegularPrice.toLocaleString('en-IN')}
            </span>
          )}
          {currentDiscount > 0 && (
            <span className="px-2 py-0.5 rounded-badge text-xs font-bold bg-terracotta text-white">
              Save {currentDiscount}%
            </span>
          )}
        </div>
        <p className="text-[11px] text-charcoal-muted">
          Inclusive of all taxes. Free shipping on all prepaid orders across India.
        </p>
      </div>

      {/* Variant / Pack Selector directly with dynamic WooCommerce prices */}
      {product.variants.length > 0 && (
        <div id="product-purchase-options" className="space-y-2 scroll-mt-24">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
              Select Pack / Course:
            </label>
            {selectedVariant && (
              <span className="text-xs font-semibold text-botanical">
                Selected: {selectedVariant}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => {
              const isSelected = selectedVariant === v.name;
              return (
                <button
                  key={v.name}
                  onClick={() => setSelectedVariant(v.name)}
                  className={`px-4 py-2.5 rounded-button text-xs font-semibold border transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'border-botanical bg-sage-light text-forest shadow-xs'
                      : 'border-stone-200 bg-white text-charcoal hover:border-stone-300'
                  }`}
                >
                  <span>{v.name}</span>
                  {v.price && (
                    <span
                      className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-botanical text-white'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      ₹{v.price.toLocaleString('en-IN')}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

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
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/80 px-3.5 py-2.5 rounded-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
          </span>
          <span>Currently Out of Stock • Fresh Batch in Preparation</span>
        </div>
      )}

      {/* Quantity & Add to Cart Controls */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          {isAvailable && (
            <div className="flex items-center border border-stone-200 rounded-button bg-white overflow-hidden shadow-xs">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="p-3 text-stone-600 hover:bg-stone-100 disabled:opacity-40 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center text-sm font-bold text-charcoal">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="p-3 text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          )}

          {/* Add to Cart Button */}
          {isAvailable ? (
            <button
              onClick={handleAddToCart}
              className={`flex-grow inline-flex items-center justify-center gap-2 py-3 px-6 rounded-button text-sm font-semibold whitespace-nowrap transition-all shadow-md hover:shadow-lg active:scale-[0.99] ${
                isAdded
                  ? 'bg-forest text-white'
                  : 'bg-botanical hover:bg-forest text-white'
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
                  <span className="whitespace-nowrap">Add to Cart • ₹{(currentPrice * quantity).toLocaleString('en-IN')}</span>
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="flex-grow inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-button text-sm font-semibold whitespace-nowrap bg-stone-200 text-stone-500 cursor-not-allowed border border-stone-300 shadow-none"
            >
              <ShoppingBag size={18} className="flex-shrink-0 text-stone-400" />
              <span>Out of Stock</span>
            </button>
          )}
        </div>

        {/* WhatsApp Consultation Action */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleAddToCombo}
            disabled={!isAvailable}
            className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-button text-xs font-bold transition-all border ${
              isAddedToCombo
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-sage-light hover:bg-sage text-forest border-forest/20'
            }`}
          >
            {isAddedToCombo ? (
              <>
                <Check size={14} className="flex-shrink-0" />
                <span>Added to Combo!</span>
              </>
            ) : (
              <>
                <Sparkles size={14} className="text-[#b49a70]" />
                <span>Add to Custom Combo</span>
              </>
            )}
          </button>

          <Link
            href="/combo-builder"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-button text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 transition-colors"
          >
            <span>Customise in Combo Builder →</span>
          </Link>
        </div>

        <a
          href={whatsappInquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-button text-xs font-semibold bg-white border border-emerald-700/30 text-emerald-800 hover:bg-emerald-50 transition-colors"
        >
          <MessageSquare size={16} className="text-emerald-700" />
          <span>{isAvailable ? 'Consult Dr. Jegajothi Pandian About This Formulation' : 'Notify Me When Available via WhatsApp Consultation'}</span>
        </a>
      </div>

      {/* Trust Mini Strip */}
      <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-charcoal-muted">
        <div className="p-2.5 bg-white rounded-lg border border-stone-200/80">
          <Truck size={16} className="mx-auto text-botanical mb-1" />
          <span className="font-semibold text-charcoal block">Free Delivery</span>
          <span>Prepaid across India</span>
        </div>
        <div className="p-2.5 bg-white rounded-lg border border-stone-200/80">
          <ShieldCheck size={16} className="mx-auto text-botanical mb-1" />
          <span className="font-semibold text-charcoal block">100% Ayurvedic</span>
          <span>Zero harmful steroids</span>
        </div>
        <div className="p-2.5 bg-white rounded-lg border border-stone-200/80">
          <RefreshCw size={16} className="mx-auto text-botanical mb-1" />
          <span className="font-semibold text-charcoal block">7-Day Return</span>
          <span>Unopened packs</span>
        </div>
      </div>

      {/* Accordion Tabs for Full Description, Ingredients, Dosage, Policies */}
      <div className="border-t border-stone-200 pt-6 space-y-3">
        {/* Overview */}
        <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setOpenTab(openTab === 'desc' ? ('' as any) : 'desc')}
            className="w-full p-4 flex items-center justify-between text-left text-sm font-bold text-forest"
          >
            <span>Overview &amp; Therapeutic Action</span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${
                openTab === 'desc' ? 'rotate-180 text-botanical' : ''
              }`}
            />
          </button>
          {openTab === 'desc' && (
            <div className="p-4 pt-0 text-xs sm:text-sm text-charcoal-muted leading-relaxed border-t border-stone-100 mt-2">
              <p className="whitespace-pre-line">
                {product.cleanDescription || product.shortDescription}
              </p>
            </div>
          )}
        </div>

        {/* Directions for Use */}
        <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setOpenTab(openTab === 'dosage' ? ('' as any) : 'dosage')}
            className="w-full p-4 flex items-center justify-between text-left text-sm font-bold text-forest"
          >
            <span>Dosage &amp; Directions for Use</span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${
                openTab === 'dosage' ? 'rotate-180 text-botanical' : ''
              }`}
            />
          </button>
          {openTab === 'dosage' && (
            <div className="p-4 pt-0 text-xs sm:text-sm text-charcoal-muted leading-relaxed border-t border-stone-100 mt-2 space-y-2">
              <p>
                <strong>General Guidance:</strong> For internal tonics and capsules, take with lukewarm water after meals or as directed by an Ayurvedic physician. For external therapeutic oils, warm gently between palms and massage in circular strokes over the affected area.
              </p>
              <p className="text-[11px] text-stone-500 italic">
                Store in a cool, dry place away from direct sunlight. Keep cap tightly closed after every use.
              </p>
            </div>
          )}
        </div>

        {/* Shipping & Returns */}
        <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
          <button
            onClick={() => setOpenTab(openTab === 'shipping' ? ('' as any) : 'shipping')}
            className="w-full p-4 flex items-center justify-between text-left text-sm font-bold text-forest"
          >
            <span>Shipping &amp; Return Terms</span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${
                openTab === 'shipping' ? 'rotate-180 text-botanical' : ''
              }`}
            />
          </button>
          {openTab === 'shipping' && (
            <div className="p-4 pt-0 text-xs sm:text-sm text-charcoal-muted leading-relaxed border-t border-stone-100 mt-2 space-y-1.5">
              <p>• <strong>Prepaid Orders:</strong> 100% Free Shipping throughout India.</p>
              <p>• <strong>Cash on Delivery:</strong> Available across India with a ₹100 courier convenience charge.</p>
              <p>• <strong>Delivery Time:</strong> 2 to 5 business days for Metro cities, 5 to 7 days for non-metro locations.</p>
              <p>• <strong>7-Day Returns:</strong> Unopened products with safety seals intact can be returned within 7 days of delivery.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
