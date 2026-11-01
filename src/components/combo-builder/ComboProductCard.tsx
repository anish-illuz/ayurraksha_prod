'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Minus, Info, ShieldCheck, Check } from 'lucide-react';
import { ComboProduct } from '@/types/combo';
import { trackComboEvent } from '@/lib/comboAnalytics';

interface ComboProductCardProps {
  product: ComboProduct;
  quantityInCombo: number;
  onUpdateQuantity: (productId: number, delta: number) => void;
  onViewDetails: (product: ComboProduct) => void;
  isHighlighted?: boolean;
  isExcluded?: boolean;
}

export const ComboProductCard: React.FC<ComboProductCardProps> = ({
  product,
  quantityInCombo,
  onUpdateQuantity,
  onViewDetails,
  isHighlighted = false,
  isExcluded = false,
}) => {
  const isSelected = quantityInCombo > 0;
  const isPending = Boolean(product.pricePending) || product.price === null;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPending || !product.inStock) return;
    onUpdateQuantity(product.id, 1);
    trackComboEvent({
      event: 'add_item',
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPending || !product.inStock) return;
    onUpdateQuantity(product.id, 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateQuantity(product.id, -1);
    if (quantityInCombo === 1) {
      trackComboEvent({
        event: 'remove_item',
        product_id: product.id,
        product_name: product.name,
      });
    }
  };

  const handleOpenDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    onViewDetails(product);
  };

  // Genuine savings percentage calculation (only if verified higher MRP exists)
  const hasVerifiedSavings = !isPending && product.mrp !== null && product.price !== null && product.mrp > product.price;
  const savingsPercent = hasVerifiedSavings
    ? Math.round(((product.mrp! - product.price!) / product.mrp!) * 100)
    : 0;

  return (
    <article
      className={`group relative flex flex-col bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
        isSelected
          ? 'border-[#204A3B] shadow-md ring-1 ring-[#204A3B]'
          : isHighlighted
          ? 'border-[#dba95c] shadow-xs'
          : 'border-stone-200 hover:border-stone-300 hover:shadow-xs'
      } ${isExcluded ? 'opacity-65' : ''}`}
    >
      {/* Photo Area - Compact and Touch-Optimized */}
      <div className="relative w-full h-36 sm:h-48 bg-gradient-to-b from-[#F9F7F2] to-[#F1EFEA] p-2 flex items-center justify-center overflow-hidden">
        {/* Chips */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 z-10 pointer-events-none">
          <span className="text-[9.5px] sm:text-[10px] font-bold text-stone-700 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md border border-stone-200 shadow-xs">
            {product.formatTag}
          </span>

          {product.doctorGuided && (
            <span className="text-[9px] sm:text-[9.5px] font-bold text-[#8a5b28] bg-[#fff5e6] px-2 py-0.5 rounded-md border border-[#f0dfc4] shadow-xs">
              Doctor-guided
            </span>
          )}
        </div>

        {/* Product Image */}
        <div
          onClick={handleOpenDetails}
          className="relative w-full h-full cursor-pointer transition-transform duration-300 group-hover:scale-105"
        >
          <Image
            src={product.primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-1.5"
          />
        </div>

        {/* Highlight Banner if concern matches */}
        {isHighlighted && !isSelected && (
          <div className="absolute bottom-1.5 left-2 right-2 bg-[#18372b]/90 backdrop-blur-xs text-white text-[9.5px] sm:text-[10px] font-semibold text-center py-0.5 rounded-md">
            Suggested for your concern
          </div>
        )}
      </div>

      {/* Body Information */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between space-y-2.5">
        <div>
          <h4
            onClick={handleOpenDetails}
            className="font-heading text-sm sm:text-base font-bold text-[#18372b] hover:text-[#23533e] cursor-pointer line-clamp-2 min-h-[2.25rem] sm:min-h-[2.5rem] leading-snug"
          >
            {product.name}
          </h4>

          <p className="text-[11px] sm:text-xs text-stone-600 line-clamp-2 mt-0.5 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="space-y-2.5 pt-2 border-t border-stone-100">
          <div className="flex items-baseline gap-2 flex-wrap">
            {isPending ? (
              <span className="text-[11px] sm:text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                Price pending verification
              </span>
            ) : (
              <>
                <span className="font-sans font-bold text-base sm:text-lg text-[#18372b]">
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
                {hasVerifiedSavings && (
                  <>
                    <span className="font-sans text-xs text-stone-400 line-through">
                      ₹{product.mrp?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9.5px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      SAVE {savingsPercent}%
                    </span>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleOpenDetails}
              className="text-xs font-semibold text-[#204A3B] hover:text-[#17362B] underline inline-flex items-center gap-1 py-1"
            >
              <span>View details</span>
              <Info size={12} />
            </button>

            {/* Selection / Quantity Controls */}
            {isPending ? (
              <button
                type="button"
                disabled
                className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-400 text-xs font-bold cursor-not-allowed border border-stone-200"
              >
                Unavailable
              </button>
            ) : isSelected ? (
              <div className="inline-flex items-center border border-[#18372b] rounded-lg overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                  className="w-7 h-7 flex items-center justify-center text-[#18372b] hover:bg-stone-100 active:bg-stone-200 transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="w-7 text-center text-xs font-bold text-[#18372b] select-none">
                  {quantityInCombo}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  aria-label="Increase quantity"
                  className="w-7 h-7 flex items-center justify-center text-[#18372b] hover:bg-stone-100 active:bg-stone-200 transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className="px-3.5 py-1.5 rounded-lg bg-[#18372b] hover:bg-[#23533e] text-white text-xs font-bold transition-all shadow-xs active:scale-[0.98]"
              >
                + Add to Combo
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
