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
  const [openTab, setOpenTab] = useState<'desc' | 'dosage' | 'shipping'>('desc');

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant || undefined);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant || undefined);
    // User is automatically shown cart with direct checkout handoff
  };

  const whatsappInquiryUrl = `https://wa.me/919940388877?text=${encodeURIComponent(
    `Hello Dr. Jegajothi Pandian & Ayurraksha team, I would like to inquire about ${product.name} (₹${product.price}).`
  )}`;

  return (
    <div className="flex flex-col space-y-6">
      {/* Brand & Category badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-botanical uppercase tracking-wider">
          Ayurraksha Classical Formulation
        </span>
        {product.healthConcerns[0] && (
          <span className="px-2 py-0.5 rounded-badge text-[11px] font-medium bg-sage text-forest">
            {product.healthConcerns[0]}
          </span>
        )}
      </div>

      {/* Product Title */}
      <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-forest leading-tight">
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

      {/* Price & Savings */}
      <div className="p-4 bg-white rounded-xl border border-stone-200/80 space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl sm:text-3xl font-bold text-forest">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.regularPrice > product.price && (
            <span className="text-base text-stone-400 line-through">
              ₹{product.regularPrice.toLocaleString('en-IN')}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-badge text-xs font-bold bg-terracotta text-white">
              Save {product.discountPercent}%
            </span>
          )}
        </div>
        <p className="text-[11px] text-charcoal-muted">
          Inclusive of all taxes. Free shipping on all prepaid orders across India.
        </p>
      </div>

      {/* Variant / Pack Selector (if product has packs) */}
      {product.variants.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
            Select Course / Pack Size:
          </label>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((v) => (
              <button
                key={v.name}
                onClick={() => setSelectedVariant(v.name)}
                className={`px-4 py-2 rounded-button text-xs font-semibold border transition-all ${
                  selectedVariant === v.name
                    ? 'border-botanical bg-sage-light text-forest shadow-xs'
                    : 'border-stone-200 bg-white text-charcoal hover:border-stone-300'
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* In Stock Status */}
      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
        </span>
        <span>In Stock • Dispatched from Chennai within 24 Hours</span>
      </div>

      {/* Quantity & Add to Cart Controls */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
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

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`flex-grow inline-flex items-center justify-center gap-2 py-3 px-6 rounded-button text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-[0.99] ${
              isAdded
                ? 'bg-forest text-white'
                : 'bg-botanical hover:bg-forest text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check size={18} />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={18} />
                <span>Add to Cart • ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
              </>
            )}
          </button>
        </div>

        {/* WhatsApp Consultation Action */}
        <a
          href={whatsappInquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-button text-xs font-semibold bg-white border border-emerald-700/30 text-emerald-800 hover:bg-emerald-50 transition-colors"
        >
          <MessageSquare size={16} className="text-emerald-700" />
          <span>Consult Dr. Jegajothi Pandian About This Formulation</span>
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
