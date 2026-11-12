'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronUp, X } from 'lucide-react';
import { ComboProduct } from '@/types/combo';
import { ComboCartSummary } from './ComboCartSummary';

interface ComboMobileStickyBarProps {
  comboCart: Record<number, number>;
  products: ComboProduct[];
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemoveItem: (productId: number) => void;
  onProceedToCheckout: () => void;
  onOpenConsult: () => void;
  comboName?: string;
  comboUrl?: string;
}

export const ComboMobileStickyBar: React.FC<ComboMobileStickyBarProps> = ({
  comboCart,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onOpenConsult,
  comboName = 'Combo Builder',
  comboUrl = 'https://www.ayurrakshaonline.com/combo-builder',
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const selectedItems = products.filter((p) => (comboCart[p.id] || 0) > 0);
  const totalCount = selectedItems.reduce((acc, p) => acc + (comboCart[p.id] || 0), 0);
  const totalAmount = selectedItems.reduce((acc, p) => acc + (p.price || 0) * (comboCart[p.id] || 0), 0);
  const hasPending = selectedItems.some((p) => p.pricePending || p.price === null);

  useEffect(() => {
    if (isSheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSheetOpen]);

  return (
    <>
      {/* Sticky Bottom Bar on Mobile with Safe Area Padding */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#103829] text-white px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_24px_rgba(0,0,0,0.18)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-[#f4e2b5] flex-shrink-0">
            <ShoppingBag size={18} />
          </div>
          <div>
            <span className="text-[10px] text-emerald-100/80 block leading-tight">
              {totalCount} {totalCount === 1 ? 'item' : 'items'} · ₹{totalAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-bold text-[#f4e2b5] leading-tight block">
              {hasPending ? 'Price pending at checkout' : totalCount >= 1 ? '10–15% volume savings applied' : 'Add products to unlock savings'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSheetOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#e5b36d] hover:bg-[#d8a459] text-[#183d2d] text-xs font-extrabold shadow-md active:scale-[0.98]"
        >
          <span>View Combo</span>
          <ChevronUp size={14} />
        </button>
      </div>

      {/* Expandable Bottom Drawer Sheet on Mobile */}
      {isSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Combo Basket Details"
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200"
          onClick={() => setIsSheetOpen(false)}
        >
          <div
            className="w-full max-h-[85vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle & Close */}
            <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between bg-[#FAF9F5]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-1 rounded-full bg-stone-300 block" />
                <span className="text-xs font-bold text-[#18372b] uppercase tracking-wider">
                  {comboName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSheetOpen(false)}
                aria-label="Close combo sheet"
                className="p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Cart Content */}
            <div className="overflow-y-auto p-4">
              <ComboCartSummary
                comboCart={comboCart}
                products={products}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
                onProceedToCheckout={() => {
                  setIsSheetOpen(false);
                  onProceedToCheckout();
                }}
                onOpenConsult={() => {
                  setIsSheetOpen(false);
                  onOpenConsult();
                }}
                isMobileDrawer={true}
                comboName={comboName}
                comboUrl={comboUrl}
                className="border-0 p-0 shadow-none"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
