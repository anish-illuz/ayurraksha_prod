'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Copy, Check, ShieldCheck } from 'lucide-react';
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

  const genuineSavings = Math.max(0, totalMrp - totalSellingPrice);

  const handleCopySummary = async () => {
    if (selectedItems.length === 0) return;

    const lines = selectedItems.map(
      (item) =>
        `• ${item.product.name} (${item.product.packSize}) × ${item.quantity} — ₹${(
          (item.product.price || 0) * item.quantity
        ).toLocaleString('en-IN')}`
    );

    const summaryText = [
      'AYURRAKSHA — SKIN CARE COMBO',
      '----------------------------------------',
      ...lines,
      '----------------------------------------',
      `Items: ${totalItemsCount} across ${selectedItems.length} products`,
      `Standard MRP Total: ₹${totalMrp.toLocaleString('en-IN')}`,
      genuineSavings > 0 ? `Product Savings: - ₹${genuineSavings.toLocaleString('en-IN')}` : null,
      `Estimated Total Payable: ₹${totalSellingPrice.toLocaleString('en-IN')}`,
      '----------------------------------------',
      'Configured at: https://www.ayurrakshaonline.com/combo-builder',
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
        total_amount: totalSellingPrice,
        has_pending_items: false,
      });
    } catch {
      // Fallback
    }
  };

  return (
    <aside
      className={`bg-white rounded-[19px] border border-[#dfe7dc] p-6 shadow-[0_16px_40px_rgba(22,63,45,0.065)] flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header */}
        <div className="pb-3 border-b border-[#edf0eb]">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.17em] text-[#ab8345] block mb-1">
            YOUR PERSONALIZED SELECTION
          </span>
          <h3 className="font-serif text-[23px] font-normal text-[#18372b] tracking-[-0.02em]">
            Your Skin Care Combo
          </h3>
          <p className="text-xs text-[#3c4f44] mt-0.5">
            {totalItemsCount === 0
              ? 'Add products to see your combination take shape.'
              : `${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'items'} across ${selectedItems.length} ${
                  selectedItems.length === 1 ? 'product' : 'products'
                }`}
          </p>
        </div>

        {/* Line Items List matching prototype */}
        <div className="py-2 space-y-2.5 max-h-[350px] overflow-y-auto divide-y divide-[#f0f2ed] pr-1">
          {selectedItems.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#f4f7f2] text-stone-400 flex items-center justify-center mx-auto">
                <ShoppingBag size={18} />
              </div>
              <p className="text-xs text-[#3c4f44] leading-relaxed">
                Your selection is empty.<br />Choose a product to get started.
              </p>
            </div>
          ) : (
            selectedItems.map(({ product, quantity }) => {
              const lineTotal = (product.price || 0) * quantity;

              return (
                <div key={product.id} className="pt-2.5 first:pt-0 flex items-start justify-between gap-3">
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

      {/* Calculations & Checkout matching prototype cart-math */}
      <div className="pt-3 border-t border-[#e6ece3] space-y-2.5">
        <div className="space-y-1.5 text-xs text-[#283830] font-sans">
          <div className="flex justify-between items-center">
            <span>Total standard price</span>
            <strong className="text-[#18372b]">₹{totalMrp.toLocaleString('en-IN')}</strong>
          </div>

          {genuineSavings > 0 && (
            <div className="flex justify-between items-center text-[#25764d] font-bold">
              <span>Product offer savings</span>
              <span>− ₹{genuineSavings.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-[#e6ece3] text-sm text-[#123b2d] font-bold">
            <span className="font-sans text-[13px] font-bold">Estimated total</span>
            <span className="font-serif text-[19px] font-bold">
              ₹{totalSellingPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Primary Checkout CTA */}
        <button
          type="button"
          disabled={selectedItems.length === 0}
          onClick={onProceedToCheckout}
          className={`w-full py-3.5 px-4 rounded-[11px] text-xs sm:text-[13px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] ${
            selectedItems.length === 0
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-[#123b2d] hover:bg-[#235b43] text-white'
          }`}
        >
          <span>Proceed to Checkout</span>
          <ArrowRight size={15} />
        </button>

        {/* Copy Summary Button matching prototype */}
        {selectedItems.length > 0 && (
          <button
            type="button"
            onClick={handleCopySummary}
            className="w-full py-2.5 px-4 rounded-[11px] text-xs font-bold text-[#183d2d] bg-white hover:bg-stone-50 flex items-center justify-center gap-2 border border-[#d5dfd4] transition-colors shadow-2xs"
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

        {/* Footnote notes matching prototype */}
        <div className="pt-2 text-[10.5px] text-[#4d6355] text-center leading-[1.6]">
          Live checkout, inventory and pricing are connected to WooCommerce.
        </div>

        <div className="p-3 rounded-[11px] bg-[#fff9ec] border border-[#f0e2bf] text-[11px] text-[#5c4620] leading-[1.6]">
          Doctor-guided products require confirmation of suitability and instructions. These suggestions do not replace medical evaluation.
        </div>
      </div>
    </aside>
  );
};
