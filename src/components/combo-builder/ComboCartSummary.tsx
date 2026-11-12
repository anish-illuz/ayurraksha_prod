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
      className={`bg-white rounded-[18px] border border-[#dfe7dc] p-4 sm:p-5 shadow-[0_12px_32px_rgba(22,63,45,0.06)] flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="pb-3 border-b border-[#edf0eb]">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#ab8345] block">
            COMBO BASKET
          </span>
          <span className="text-[11px] font-extrabold text-[#18372b] bg-[#eef3ec] px-2 py-0.5 rounded-full">
            {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
          </span>
        </div>
        <h3 className="font-serif text-xl sm:text-[22px] font-normal text-[#18372b] tracking-[-0.02em] mt-0.5">
          {comboName.replace(/ Builder/i, '')}
        </h3>
      </div>

      {/* Combo Savings */}
      <div className="mt-3.5">
        <h4 className="text-[13px] sm:text-[14px] font-extrabold text-[#18372b] mb-2">
          Combo Savings
        </h4>

        {/* Tiered progress bar with markers */}
        <div className="relative h-2.5 bg-[#e5dfcc] rounded-full overflow-hidden mb-1.5">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#2f7d54] to-[#25764d] rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.round((totalSellingPrice / 5000) * 100))}%` }}
          />
          <span className="absolute inset-y-0 left-[60%] w-px bg-white/50" aria-hidden="true" />
        </div>
        <div className="flex justify-between text-[9.5px] text-stone-500 font-medium px-0.5 mb-3">
          <span>0%</span>
          <span className={totalSellingPrice > 3000 ? 'text-[#25764d] font-bold' : ''}>10%</span>
          <span className={totalSellingPrice > 5000 ? 'text-[#25764d] font-bold' : ''}>15%</span>
        </div>

        {/* Two side-by-side benefit cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`rounded-[11px] border p-2.5 ${
            totalSellingPrice > 3000
              ? 'bg-[#eef7f0] border-[#25764d]'
              : 'bg-[#FAF8EE] border-[#EADBBD]'
          }`}>
            <p className="text-[11px] font-extrabold text-[#18372b]">10% Combo Savings</p>
            <p className="text-[9.5px] text-[#5c4a28] leading-snug mt-0.5">
              Get 10% off your combo when your order total is above <strong>₹3,000</strong>.
            </p>
          </div>
          <div className={`rounded-[11px] border p-2.5 ${
            totalSellingPrice > 5000
              ? 'bg-[#eef7f0] border-[#25764d]'
              : 'bg-[#FAF8EE] border-[#EADBBD]'
          }`}>
            <p className="text-[11px] font-extrabold text-[#18372b]">15% Combo Savings</p>
            <p className="text-[9.5px] text-[#5c4a28] leading-snug mt-0.5">
              Get 15% off your combo when your order total is above <strong>₹5,000</strong>.
            </p>
          </div>
        </div>

        {/* Dynamic next-offer nudge */}
        {totalSellingPrice > 0 && tierDiscountPercent < 15 && (
          <p className="text-[11px] text-[#18372b] mt-2.5 leading-snug">
            {tierDiscountPercent === 10 ? (
              <>
                <strong className="text-[#25764d]">10% OFF applied.</strong> Add{' '}
                <strong className="text-[#8a6020]">
                  ₹{amountToNextTier.toLocaleString('en-IN')}
                </strong>{' '}
                more to unlock <strong className="text-[#25764d]">15% OFF</strong>.
              </>
            ) : (
              <>
                Add{' '}
                <strong className="text-[#8a6020]">
                  ₹{amountToNextTier.toLocaleString('en-IN')}
                </strong>{' '}
                more to unlock <strong className="text-[#25764d]">10% OFF</strong>.
              </>
            )}
          </p>
        )}
        {tierDiscountPercent === 15 && (
          <p className="text-[11px] font-bold text-[#25764d] mt-2.5 flex items-center gap-1">
            <Check size={13} className="flex-shrink-0" />
            Maximum 15% discount unlocked.
          </p>
        )}

        {/* Auto-apply note */}
        <div className="mt-3 px-3 py-2 rounded-[10px] bg-[#eef3ec] border border-[#dbe6d9] text-[10.5px] text-[#203728] leading-snug flex items-start gap-2">
          <Tag size={13} className="text-[#25764d] flex-shrink-0 mt-0.5" />
          <span>
            Your combo savings will be applied automatically at checkout based on your order total. No coupon code needed.
          </span>
        </div>
      </div>

      {/* Items in Combo */}
      <div className="mt-4">
        <h4 className="text-[13px] sm:text-[14px] font-extrabold text-[#18372b] mb-2">
          Items in Combo
        </h4>

        <div className="space-y-2 max-h-[260px] overflow-y-auto pr-0.5">
          {selectedItems.length === 0 ? (
            <div className="py-4 px-3 text-center rounded-[10px] bg-stone-50/70 border border-dashed border-stone-200">
              <p className="text-[11px] text-[#4d6355] leading-snug">
                No items added yet. Click <strong>+ Add</strong> on any product to start your combo.
              </p>
            </div>
          ) : (
            selectedItems.map(({ product, quantity }) => {
              const lineTotal = (product.price || 0) * quantity;

              return (
                <div key={product.id} className="flex items-start justify-between gap-2.5 py-2 first:pt-0 border-b border-[#f0f2ed] last:border-0">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[12px] font-bold text-[#18372b] leading-[1.3] line-clamp-2">
                      {product.name}
                    </h4>
                    <div className="text-[10px] text-[#4d6355] mt-0.5">
                      {product.packSize}
                      {product.doctorGuided && <span> • Doctor-guided</span>}
                    </div>

                    <div className="flex items-center gap-2.5 mt-1.5">
                      <div className="inline-flex items-center border border-[#dbe3d9] rounded-[6px] bg-white h-[24px] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-[#18372b] hover:bg-stone-100 font-extrabold text-sm"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-[11px] font-bold text-[#18372b]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#18372b] hover:bg-stone-100 font-extrabold text-sm"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        className="text-[10px] text-[#a0695b] hover:text-red-700 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right whitespace-nowrap">
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
      <div className="mt-4 pt-3 border-t border-[#e6ece3] space-y-2">
        <div className="flex justify-between items-center text-xs text-[#283830]">
          <span>Product Subtotal</span>
          <strong className="text-[#18372b]">₹{totalSellingPrice.toLocaleString('en-IN')}</strong>
        </div>

        {tierDiscountAmount > 0 && (
          <div className="flex justify-between items-center text-xs text-[#25764d] font-bold">
            <span>Volume Discount ({tierDiscountPercent}% OFF)</span>
            <span>− ₹{tierDiscountAmount.toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-sm text-[#123b2d] font-bold">
          <span className="font-sans text-[13px]">Final Payable</span>
          <span className="font-serif text-[20px] font-bold">
            ₹{finalPayableTotal.toLocaleString('en-IN')}
          </span>
        </div>

        <button
          type="button"
          disabled={selectedItems.length === 0}
          onClick={onProceedToCheckout}
          className={`w-full py-3 px-4 rounded-[11px] text-xs sm:text-[13px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] ${
            selectedItems.length === 0
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-[#1c513b] hover:bg-[#143e2d] text-white'
          }`}
        >
          <span>Proceed to Checkout</span>
          <ArrowRight size={15} />
        </button>

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
                <span>Copy Combo Summary</span>
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );
};
