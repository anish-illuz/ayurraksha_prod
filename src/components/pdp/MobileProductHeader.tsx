'use client';

import React, { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { Product, PackOption } from '@/types/product';
import { RatingStars } from '@/components/RatingStars';
import { useCart } from '@/lib/cartContext';

interface MobileProductHeaderProps {
  product: Product;
}

export const MobileProductHeader: React.FC<MobileProductHeaderProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

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
          isDefault: true,
        },
        {
          id: 'family',
          name: '3-Month Regimen',
          subtitle: '120 Sachets (600g net)',
          price: Math.round(product.price * 2.65),
          regularPrice: Math.round(product.price * 3.4),
          discountBadge: 'Save 22%',
        },
      ];

  const [selectedPackId, setSelectedPackId] = useState<string>(
    packOptions.find((p) => p.isDefault)?.id || packOptions[0].id
  );

  const selectedPack = packOptions.find((p) => p.id === selectedPackId) || packOptions[0];
  const currentPrice = selectedPack.price;
  const currentRegularPrice = selectedPack.regularPrice || product.regularPrice;
  const currentDiscount = currentRegularPrice > currentPrice
    ? Math.round(((currentRegularPrice - currentPrice) / currentRegularPrice) * 100)
    : product.discountPercent;

  const isAvailable = product.inStock;

  const handleAddToCart = () => {
    addToCart(product, 1, selectedPack.name, currentPrice);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const categoryName = product.healthConcerns[0] || product.categories[0] || 'Ayurvedic Wellness';

  return (
    <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs">
      {/* Category Eyebrow & SKU */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[11px] font-bold text-botanical uppercase tracking-wider">
          {categoryName}
        </span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#E8EFE6] text-forest border border-forest/10">
          {product.skuBadge || `SKU: ${product.sku || product.id}`}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="font-serif text-2xl font-bold text-forest leading-tight mb-1">
        {product.name}
      </h1>

      {/* Rating & Review Count */}
      <div className="flex items-center gap-2 mb-2">
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={14} />
        <span className="text-xs text-charcoal-muted">
          {product.rating} ({product.reviewCount || 19} reviews)
        </span>
      </div>

      {/* Key Benefit Summary */}
      <p className="text-xs text-charcoal/80 leading-relaxed font-sans mb-3 line-clamp-2">
        {product.shortDescription || product.subtitle || 'Traditional botanical formulation crafted for authentic wellness.'}
      </p>

      {/* Compact Course Selector Pills */}
      {packOptions.length > 1 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {packOptions.map((pack) => {
            const isSelected = selectedPackId === pack.id;
            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => setSelectedPackId(pack.id)}
                className={`py-1.5 px-2.5 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                  isSelected
                    ? 'border-botanical bg-emerald-50/60 font-bold text-forest shadow-2xs'
                    : 'border-stone-200 bg-stone-50/50 text-charcoal/80 hover:bg-stone-100/60'
                }`}
              >
                <span className="truncate">{pack.name}</span>
                <span className="font-bold ml-1 text-forest">₹{pack.price}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Price Box + Quick Add to Cart CTA */}
      <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-stone-100">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-serif font-bold text-forest">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {currentRegularPrice > currentPrice && (
              <span className="text-xs text-stone-400 line-through">
                ₹{currentRegularPrice.toLocaleString('en-IN')}
              </span>
            )}
            {currentDiscount > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#E67E22] text-white">
                Save {currentDiscount}%
              </span>
            )}
          </div>
          <span className="text-[10px] text-emerald-800 font-medium block">
            {isAvailable ? 'In Stock • Free Express Shipping' : 'Out of Stock'}
          </span>
        </div>

        {/* Prominent Add to Cart Button */}
        {isAvailable ? (
          <button
            onClick={handleAddToCart}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 ${
              isAdded
                ? 'bg-forest text-white'
                : 'bg-[#16382C] hover:bg-[#0E251D] text-white active:scale-95'
            }`}
          >
            {isAdded ? (
              <>
                <Check size={15} />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={15} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        ) : (
          <button
            disabled
            className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-stone-200 text-stone-500 cursor-not-allowed shrink-0"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};
