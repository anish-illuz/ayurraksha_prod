'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/lib/cartContext';

interface StickyMobileBarProps {
  product: Product;
}

export const StickyMobileBar: React.FC<StickyMobileBarProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past 450px
      setIsVisible(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuickAdd = () => {
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

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
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-forest">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.regularPrice > product.price && (
                <span className="text-[10px] text-stone-400 line-through">
                  ₹{product.regularPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleQuickAdd}
          className={`flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-button text-xs font-semibold transition-all ${
            isAdded
              ? 'bg-forest text-white'
              : 'bg-botanical hover:bg-forest text-white'
          }`}
        >
          {isAdded ? (
            <>
              <Check size={14} />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag size={14} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
