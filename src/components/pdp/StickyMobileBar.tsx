'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { usePDP } from '@/context/PDPContext';

interface StickyMobileBarProps {
  product: Product;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({ product }) => {
  const {
    selectedPack,
    quantity,
    currentPrice,
    currentRegularPrice,
    totalPrice,
    isSecondVariant,
    isAvailable,
    isAdded,
    handleAddToCart,
  } = usePDP();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past 450px
      setIsVisible(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2.5 shadow-lg animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-11 h-11 bg-white rounded border border-stone-200 flex-shrink-0 p-0.5">
            <Image
              src={product.images[0] || 'https://www.ayurrakshaonline.com/wp-content/uploads/2024/02/1-1024x1024.jpg'}
              alt={product.name}
              fill
              sizes="44px"
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-charcoal truncate">
              {product.name}
            </h4>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded truncate max-w-[140px]">
                {selectedPack.name} (Qty: {quantity})
              </span>
              <span className="text-sm font-bold text-forest">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
              {isSecondVariant && currentRegularPrice > totalPrice && (
                <span className="text-[10px] text-stone-400 line-through">
                  ₹{currentRegularPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>

        {isAvailable ? (
          <button
            onClick={handleAddToCart}
            className={`flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-button text-xs font-semibold whitespace-nowrap transition-all shadow-xs active:scale-95 ${
              isAdded
                ? 'bg-forest text-white'
                : 'bg-[#16382C] hover:bg-[#0E251D] text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check size={14} className="flex-shrink-0" />
                <span className="whitespace-nowrap">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} className="flex-shrink-0" />
                <span className="whitespace-nowrap">
                  Add to Cart • ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </>
            )}
          </button>
        ) : (
          <button
            disabled
            className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-button text-xs font-semibold whitespace-nowrap bg-stone-200 text-stone-500 cursor-not-allowed border border-stone-300"
          >
            <span>Out of Stock</span>
          </button>
        )}
      </div>
    </div>
  );
};
