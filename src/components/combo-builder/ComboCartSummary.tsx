'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus, ArrowRight, Copy, Check, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { ComboProduct } from '@/types/combo';
import { trackComboEvent } from '@/lib/comboAnalytics';

interface ComboCartSummaryProps {
  comboCart: Record<number, number>;
  products: ComboProduct[];
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemoveItem: (productId: number) => void;
  onProceedToCheckout: () => void;
  onOpenConsult: () => void;
  className?: string;
  isMobileDrawer?: boolean;
  comboName?: string;
  comboUrl?: string;
}

export const ComboCartSummary: React.FC<ComboCartSummaryProps> = ({
  comboCart,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onOpenConsult,
  className = '',
  isMobileDrawer = false,
  comboName = 'AYURRAKSHA — SKIN CARE COMBO',
  comboUrl = 'https://www.ayurrakshaonline.com/combo-builder',
}) => {
  const [copied, setCopied] = useState(false);

  // Selected products with quantity > 0
  const selectedItems = products
    .filter((p) => (comboCart[p.id] || 0) > 0)
    .map((p) => ({
      product: p,
      quantity: comboCart[p.id],
    }));

  const totalItemsCount = selectedItems.reduce((acc, item) => acc + item.quantity, 0);

  // Sum calculations
  const totalMrp = selectedItems.reduce((sum, item) => {
    const itemMrp = item.product.mrp ?? item.product.price ?? 0;
    return sum + itemMrp * item.quantity;
  }, 0);

  const totalSellingPrice = selectedItems.reduce((sum, item) => {
    const itemPrice = item.product.price ?? 0;
    return sum + itemPrice * item.quantity;
  }, 0);

  // Tiered Volume Discount (mirrors the store's configured rules in cartContext):
  // - Combo value above ₹5,000 -> 15% OFF
  // - Combo value above ₹3,000 -> 10% OFF
  // Single tier only, never stacked.
  let tierDiscountPercent = 0;
  let tierDiscountAmount = 0;
  let amountToNextTier = 0;

  if (totalSellingPrice > 5000) {
    tierDiscountPercent = 15;
    tierDiscountAmount = Math.round(totalSellingPrice * 0.15);
  } else if (totalSellingPrice > 3000) {
    tierDiscountPercent = 10;
    tierDiscountAmount = Math.round(totalSellingPrice * 0.10);
    amountToNextTier = Math.max(0, 5000 - totalSellingPrice);
  } else {
    amountToNextTier = Math.max(0, 3000 - totalSellingPrice);
  }

  const finalPayableTotal = Math.max(0, totalSellingPrice - tierDiscountAmount);
  const totalCombinedSavings = (totalMrp - totalSellingPrice) + tierDiscountAmount;

  const handleCopySummary = async () => {
    if (selectedItems.length === 0) return;

    const lines = selectedItems.map(
      (item) =>
        `• ${item.product.name} (${item.product.packSize}) × ${item.quantity} — ₹${(
          (item.product.price || 0) * item.quantity
        ).toLocaleString('en-IN')}`
    );

    const summaryText = [
      comboName.toUpperCase(),
      '----------------------------------------',
      ...lines,
      '----------------------------------------',
      `Items: ${totalItemsCount} across ${selectedItems.length} products`,
      `Standard Product Total: ₹${totalSellingPrice.toLocaleString('en-IN')}`,
      tierDiscountAmount > 0
        ? `Flash Volume Discount (${tierDiscountPercent}% OFF): - ₹${tierDiscountAmount.toLocaleString('en-IN')}`
        : null,
      `Final Amount Payable: ₹${finalPayableTotal.toLocaleString('en-IN')}`,
      '----------------------------------------',
      `Configured at: ${comboUrl}`,
      'Doctor Consultation available via VPrime Health Care (+91 99403 88877)',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
      trackComboEvent({
        event: 'view_combo',
        item_count: totalItemsCount,
        total_amount: finalPayableTotal,
        has_pending_items: false,
      });
    } catch {
      // Fallback
    }
  };

  return (
    <aside
      className={`bg-white rounded-[18px] border border-[#dfe7dc] p-4 sm:p-5 shadow-[0_12px_32px_rgba(22,63,45,0.06)] flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header */}
        <div className="pb-2.5 border-b border-[#edf0eb]">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#ab8345] block">
              COMBO BASKET
            </span>
            {totalItemsCount > 0 && (
              <span className="text-[11px] font-extrabold text-[#25764d] bg-[#eef7f0] px-2 py-0.5 rounded-full">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <h3 className="font-serif text-xl sm:text-[22px] font-normal text-[#18372b] tracking-[-0.02em] mt-0.5">
            {comboName.replace(/ Builder/i, '')}
          </h3>
          <p className="text-[11.5px] text-[#4d6355]">
            {totalItemsCount === 0
              ? 'Select products on the left to start building.'
              : `${selectedItems.length} unique ${selectedItems.length === 1 ? 'product' : 'products'} selected`}
          </p>
        </div>

        {/* Tiered Volume Discount Presentation */}
        <div className="mt-2.5 p-2.5 rounded-[11px] bg-[#FAF8EE] border border-[#EADBBD] text-xs space-y-1.5">
          <div className="flex items-center justify-between font-bold text-[#18372b]">
            <span className="flex items-center gap-1.5 text-[11.5px]">
              <Tag size={13} className="text-[#ab8345]" />
              <span>Volume Discounts:</span>
            </span>
            <span className="text-[11px] font-extrabold text-[#25764d]">
              {tierDiscountPercent === 15
                ? '15% OFF Applied'
                : tierDiscountPercent === 10
                ? '10% OFF Applied'
                : '10% & 15% OFF'}
            </span>
          </div>

          {/* Threshold Explanation */}
          <div className="text-[10.5px] text-[#5c4a28] flex items-center justify-between border-t border-[#eadbbd]/60 pt-1.5">
            <span>Above <strong>₹3,000</strong>: <strong>10% OFF</strong></span>
            <span>Above <strong>₹5,000</strong>: <strong>15% OFF</strong></span>
          </div>

          {/* Dynamic Next-Offer Guidance */}
          <div className="text-[11px] text-[#18372b] pt-1">
            {tierDiscountPercent === 15 ? (
              <p className="text-[#25764d] font-bold flex items-center gap-1">
                <Check size={13} className="flex-shrink-0" />
                <span>Maximum 15% discount unlocked on your order.</span>
              </p>
            ) : tierDiscountPercent === 10 ? (
              <p>
                <strong className="text-[#25764d]">10% OFF unlocked.</strong> Add <strong className="text-[#8a6020]">₹{amountToNextTier.toLocaleString('en-IN')}</strong> more to unlock <strong className="text-[#25764d]">15% OFF</strong>.
              </p>
            ) : (
              <p>
                You&apos;re at the base price. Add <strong className="text-[#8a6020]">₹{amountToNextTier.toLocaleString('en-IN')}</strong> more to unlock <strong className="text-[#25764d]">10% OFF</strong>.
              </p>
            )}
          </div>

          {/* Milestone Progress bar */}
          <div className="space-y-1 pt-1">
            <div className="w-full bg-[#E5DFCC] h-2 rounded-full overflow-hidden relative">
              <div
                className="bg-[#25764d] h-full transition-all duration-300 rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((totalSellingPrice / 5000) * 100))}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[9.5px] text-stone-500 font-medium px-0.5">
              <span>₹0</span>
              <span className={totalSellingPrice > 3000 ? 'text-[#25764d] font-bold' : ''}>₹3,000 · 10%</span>
              <span className={totalSellingPrice > 5000 ? 'text-[#25764d] font-bold' : ''}>₹5,000 · 15%</span>
            </div>
          </div>
        </div>

        {/* Line Items List */}
        <div className="py-2 space-y-2 max-h-[300px] overflow-y-auto divide-y divide-[#f0f2ed] pr-0.5">
          {selectedItems.length === 0 ? (
            <div className="py-3 px-3 text-center rounded-[10px] bg-stone-50/70 border border-dashed border-stone-200 my-1">
              <p className="text-[11px] text-[#4d6355] leading-snug">
                Your basket is empty. Add a product to see your running total and savings.
              </p>
            </div>
          ) : (
            selectedItems.map(({ product, quantity }) => {
              const lineTotal = (product.price || 0) * quantity;

              return (
                <div key={product.id} className="pt-2.5 first:pt-0 flex items-start justify-between gap-2.5">
                  {/* Thumbnail & Title */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12px] font-bold text-[#18372b] leading-[1.3] line-clamp-2">
                      {product.name}
                    </h4>

                    <div className="text-[10px] text-[#4d6355] flex items-center gap-1.5 mt-0.5">
                      <span>{product.packSize}</span>
                      {product.doctorGuided && (
                        <span>• Doctor-guided</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1.5">
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center border border-[#dbe3d9] rounded-[6px] bg-white h-[26px] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-[#18372b] hover:bg-stone-100 font-extrabold text-sm"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-[#18372b]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#18372b] hover:bg-stone-100 font-extrabold text-sm"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        className="text-[10.5px] text-[#a0695b] hover:text-red-700 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Line Total */}
                  <div className="text-right whitespace-nowrap pt-0.5">
                    <span className="text-xs font-extrabold text-[#18372b]">
                      ₹{lineTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Calculations & Checkout */}
      <div className="pt-2.5 border-t border-[#e6ece3] space-y-2">
        <div className="space-y-1.5 text-xs text-[#283830] font-sans">
          <div className="flex justify-between items-center">
            <span>Product Subtotal</span>
            <strong className="text-[#18372b]">₹{totalSellingPrice.toLocaleString('en-IN')}</strong>
          </div>

          {tierDiscountAmount > 0 && (
            <div className="flex justify-between items-center text-[#25764d] font-bold">
              <span>Volume Discount ({tierDiscountPercent}% OFF)</span>
              <span>− ₹{tierDiscountAmount.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-[#e6ece3] text-sm text-[#123b2d] font-bold">
            <span className="font-sans text-[13px] font-bold">Final Amount Payable</span>
            <span className="font-serif text-[20px] font-bold">
              ₹{finalPayableTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Primary Checkout CTA */}
        <button
          type="button"
          disabled={selectedItems.length === 0}
          onClick={onProceedToCheckout}
          className={`w-full py-3 px-4 rounded-[11px] text-xs sm:text-[13px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] ${
            selectedItems.length === 0
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-[#123b2d] hover:bg-[#235b43] text-white'
          }`}
        >
          <span>Proceed to Checkout</span>
          <ArrowRight size={15} />
        </button>

        {/* Copy Summary Button */}
        {selectedItems.length > 0 && (
          <button
            type="button"
            onClick={handleCopySummary}
            className="w-full py-2 px-4 rounded-[11px] text-xs font-bold text-[#183d2d] bg-white hover:bg-stone-50 flex items-center justify-center gap-2 border border-[#d5dfd4] transition-colors shadow-2xs"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-700" />
                <span className="text-emerald-800">Combo Summary Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} className="text-stone-500" />
                <span>Copy Combo Summary ↗</span>
              </>
            )}
          </button>
        )}

        {/* Footnote notes */}
        <div className="pt-1 text-[10.5px] text-[#4d6355] text-center leading-tight">
          Applied automatically at checkout. No coupon code needed.
        </div>
      </div>
    </aside>
  );
};
