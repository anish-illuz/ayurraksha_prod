'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Copy, Check, AlertCircle, ShieldCheck } from 'lucide-react';
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
  const hasPendingItems = selectedItems.some((item) => item.product.pricePending || item.product.price === null);

  const handleCopySummary = async () => {
    if (selectedItems.length === 0) return;

    const lines = selectedItems.map(
      (item) =>
        `• ${item.product.name} (${item.product.packSize}) × ${item.quantity} — ₹${(
          (item.product.price || 0) * item.quantity
        ).toLocaleString('en-IN')}`
    );

    const summaryText = [
      'AYURRAKSHA — COMBO BUILDER SELECTION',
      '----------------------------------------',
      ...lines,
      '----------------------------------------',
      `Items: ${totalItemsCount} across ${selectedItems.length} products`,
      `Standard MRP Total: ₹${totalMrp.toLocaleString('en-IN')}`,
      genuineSavings > 0 ? `Product Savings: - ₹${genuineSavings.toLocaleString('en-IN')}` : null,
      `Estimated Total Payable: ₹${totalSellingPrice.toLocaleString('en-IN')}${hasPendingItems ? ' (excluding pending items)' : ''}`,
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
        has_pending_items: hasPendingItems,
      });
    } catch {
      // Fallback
    }
  };

  return (
    <aside
      className={`bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-sm flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Header */}
        <div className="pb-4 border-b border-stone-100">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#ab8345] block mb-1">
            Your Personalized Selection
          </span>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#18372b]">
            Your Combo Summary
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {totalItemsCount === 0
              ? 'Add products to see your combination take shape.'
              : `${totalItemsCount} ${totalItemsCount === 1 ? 'item' : 'items'} across ${selectedItems.length} ${
                  selectedItems.length === 1 ? 'product' : 'products'
                }`}
          </p>
        </div>

        {/* Line Items List */}
        <div className="py-4 space-y-3 max-h-[360px] overflow-y-auto divide-y divide-stone-100 pr-1">
          {selectedItems.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <ShoppingBag size={20} />
              </div>
              <p className="text-xs text-stone-500">
                Your combo is currently empty.<br />Select products from the catalogue on the left.
              </p>
            </div>
          ) : (
            selectedItems.map(({ product, quantity }) => {
              const lineTotal = product.price ? product.price * quantity : null;

              return (
                <div key={product.id} className="pt-3 first:pt-0 flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 rounded-xl bg-stone-50 border border-stone-200 flex-shrink-0 p-1 overflow-hidden">
                    <Image
                      src={product.primaryImage}
                      alt={product.name}
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-semibold text-[#18372b] line-clamp-1">
                        {product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="text-stone-400 hover:text-red-700 p-0.5"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div className="text-[10.5px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                      <span>{product.packSize}</span>
                      {product.doctorGuided && (
                        <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1 rounded">
                          Doctor-guided
                        </span>
                      )}
                    </div>

                    {/* Quantity Stepper & Line Price */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="inline-flex items-center border border-stone-200 rounded-md bg-stone-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-700 hover:bg-stone-200"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-stone-900">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-stone-700 hover:bg-stone-200"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#18372b]">
                          {lineTotal !== null ? `₹${lineTotal.toLocaleString('en-IN')}` : 'Price pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Calculations & Checkout */}
      <div className="pt-4 border-t border-stone-200 space-y-3">
        <div className="space-y-1.5 text-xs text-stone-600 font-sans">
          <div className="flex justify-between items-center">
            <span>Total Standard MRP:</span>
            <span className="font-semibold text-stone-800">
              ₹{totalMrp.toLocaleString('en-IN')}
            </span>
          </div>

          {genuineSavings > 0 && (
            <div className="flex justify-between items-center text-emerald-800 font-medium">
              <span>Product Offer Savings:</span>
              <span className="font-bold">− ₹{genuineSavings.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t border-stone-100 text-sm font-bold text-[#18372b]">
            <span>Estimated Combo Total:</span>
            <span className="font-heading text-lg">
              ₹{totalSellingPrice.toLocaleString('en-IN')}
              {hasPendingItems ? '*' : ''}
            </span>
          </div>

          {hasPendingItems && (
            <p className="text-[11px] text-amber-800 leading-tight pt-1">
              * Includes item(s) awaiting price confirmation; final amount calculated upon verification.
            </p>
          )}
        </div>

        {/* Primary Checkout CTA */}
        <button
          type="button"
          disabled={selectedItems.length === 0}
          onClick={onProceedToCheckout}
          className={`w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] ${
            selectedItems.length === 0
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-[#18372b] hover:bg-[#23533e] text-white shadow-emerald-950/10'
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
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 flex items-center justify-center gap-2 border border-stone-200 transition-colors"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-700" />
                <span className="text-emerald-800 font-bold">Combo Summary Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} className="text-stone-500" />
                <span>Copy Combo Summary ↗</span>
              </>
            )}
          </button>
        )}

        {/* Micro Clinical Guarantee */}
        <div className="pt-2 text-[11px] text-stone-500 space-y-1">
          <p className="flex items-start gap-1.5 leading-tight">
            <ShieldCheck size={13} className="text-emerald-700 flex-shrink-0 mt-0.5" />
            <span>Connects directly to existing secure store checkout &amp; Razorpay/COD.</span>
          </p>
          <p className="text-[10.5px] text-stone-400 italic leading-snug">
            Medical suitability should be reviewed before taking doctor-guided formulations.
          </p>
        </div>
      </div>
    </aside>
  );
};
