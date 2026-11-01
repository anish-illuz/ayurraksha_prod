'use client';

import React from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
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
      className={`group relative flex flex-col bg-white rounded-[17px] border transition-all duration-200 overflow-hidden ${
        isSelected
          ? 'border-[#8eb7a0] shadow-[0_0_0_1px_#8eb7a0,0_10px_32px_rgba(17,64,39,0.06)]'
          : isHighlighted
          ? 'border-[#dba95c] shadow-xs'
          : 'border-[#e6e7e0] hover:border-stone-300 shadow-[0_4px_14px_rgba(17,64,39,0.025)]'
      } ${isExcluded ? 'opacity-65' : ''}`}
    >
      {/* Photo Area with enlarged product display and minimal empty margin */}
      <div className="relative w-full aspect-[4/3] min-h-[190px] sm:min-h-[210px] bg-radial from-[#f4ead7] via-[#f4f4e8] to-[#f0f2e9] p-1.5 sm:p-2 flex items-center justify-center overflow-hidden">
        {/* Chips */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10 pointer-events-none">
          <span className="text-[9.5px] font-extrabold text-[#3a5242] bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-[5px] border border-[#e4e3d9] shadow-xs">
            {product.formatTag}
          </span>

          {product.doctorGuided && (
            <span className="text-[9px] font-extrabold text-[#7a4e1e] bg-[#fff5e6] px-2 py-0.5 rounded-[5px] border border-[#f0dfc4] shadow-xs">
              Doctor-guided
            </span>
          )}
        </div>

        {/* Product Image - Scaled prominently to fill the frame */}
        <div
          onClick={handleOpenDetails}
          className="relative w-full h-full cursor-pointer transition-transform duration-300 group-hover:scale-105"
        >
          <Image
            src={product.primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain w-full h-full scale-[1.04]"
          />
        </div>

        {/* Highlight Banner if concern matches */}
        {isHighlighted && !isSelected && (
          <div className="absolute bottom-1.5 left-2 right-2 bg-[#1c513d]/90 backdrop-blur-xs text-white text-[9.5px] font-bold text-center py-0.5 rounded-md">
            Suggested for your concern
          </div>
        )}
      </div>

      {/* Body Information */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between space-y-2.5">
        <div>
          <h4
            onClick={handleOpenDetails}
            className="font-sans text-[14px] font-bold text-[#18372b] hover:text-[#23533e] cursor-pointer line-clamp-2 min-h-[40px] leading-[1.38]"
          >
            {product.name}
          </h4>

          <p className="text-[11.5px] text-[#3c4f44] line-clamp-2 mt-1 leading-[1.55] min-h-[36px]">
            {product.shortDescription}
          </p>
        </div>

        {/* Pricing & Actions matching prototype */}
        <div className="space-y-3 pt-2 border-t border-[#f0f2ed]">
          <div className="flex items-baseline gap-2 flex-wrap">
            {isPending ? (
              <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                Price pending
              </span>
            ) : (
              <>
                <span className="font-sans text-[17px] font-extrabold text-[#18372b]">
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
                {hasVerifiedSavings && (
                  <>
                    <span className="font-sans text-xs text-[#738478] line-through">
                      ₹{product.mrp?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10.5px] font-extrabold text-[#25764d]">
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
              className="text-[11.5px] font-extrabold text-[#2e6845] hover:text-[#18372b] underline py-1"
            >
              View details ↗
            </button>

            {/* Selection / Quantity Controls */}
            {isPending ? (
              <button
                type="button"
                disabled
                className="px-3 py-1.5 rounded-[8px] bg-stone-100 text-stone-500 text-xs font-bold cursor-not-allowed border border-stone-200"
              >
                Unavailable
              </button>
            ) : isSelected ? (
              <div className="inline-flex items-center border border-[#dbe3d9] rounded-[8px] overflow-hidden bg-white h-[33px] shadow-xs">
                <button
                  type="button"
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                  className="w-[31px] h-[31px] flex items-center justify-center text-[#17482e] hover:bg-stone-100 font-extrabold text-[17px] transition-colors"
                >
                  −
                </button>
                <span className="w-[27px] text-center text-xs font-extrabold text-[#18372b] select-none">
                  {quantityInCombo}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  aria-label="Increase quantity"
                  className="w-[31px] h-[31px] flex items-center justify-center text-[#17482e] hover:bg-stone-100 font-extrabold text-[17px] transition-colors"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className="px-3.5 py-2 rounded-[8px] bg-[#1c513b] hover:bg-[#143e2d] text-white text-[11.5px] font-extrabold transition-all shadow-xs active:scale-[0.98]"
              >
                + Add
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
