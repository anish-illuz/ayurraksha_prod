'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, ShieldCheck, Check } from 'lucide-react';
import { ComboProduct } from '@/types/combo';
import { trackComboEvent } from '@/lib/comboAnalytics';

interface ComboProductDetailModalProps {
  product: ComboProduct | null;
  quantityInCombo: number;
  onUpdateQuantity: (productId: number, delta: number) => void;
  onClose: () => void;
  onOpenConsult: () => void;
}

export const ComboProductDetailModal: React.FC<ComboProductDetailModalProps> = ({
  product,
  quantityInCombo,
  onUpdateQuantity,
  onClose,
  onOpenConsult,
}) => {
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
      trackComboEvent({
        event: 'view_product',
        product_id: product.id,
        product_name: product.name,
        category: product.category,
      });
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const isSelected = quantityInCombo > 0;
  const hasVerifiedSavings = product.mrp !== null && product.price !== null && product.mrp > product.price;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-[20px] shadow-2xl border border-[#dfe7dc] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#FAF9F5] border-b border-[#e4e7df] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-[5px] bg-white border border-[#d8e4da] text-[#18372b]">
              {product.category}
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs text-[#283830] font-bold">{product.packSize}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-[#18372b] flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            {/* Product Photography */}
            <div className="sm:col-span-5 bg-radial from-[#f4ead7] via-[#f4f4e8] to-[#f0f2e9] rounded-[16px] p-4 flex items-center justify-center aspect-square relative border border-[#e4e7df]">
              <div className="relative w-full h-full">
                <Image
                  src={product.primaryImage}
                  alt={product.name}
                  fill
                  sizes="240px"
                  priority
                  className="object-contain p-2"
                />
              </div>

              {product.doctorGuided && (
                <div className="absolute top-2.5 left-2.5 bg-[#fff7eb] border border-[#f0dfc4] text-[#7a4e1e] text-[9.5px] font-extrabold px-2 py-0.5 rounded-[5px]">
                  Doctor-guided
                </div>
              )}
            </div>

            {/* Key Information & Price */}
            <div className="sm:col-span-7 space-y-3">
              <h3 id="product-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-[#18372b] leading-snug">
                {product.name}
              </h3>

              <p className="text-xs sm:text-[13px] text-[#283830] leading-[1.6]">
                {product.description}
              </p>

              {/* Price row */}
              <div className="pt-2 flex items-baseline gap-2.5">
                <span className="font-sans text-2xl font-extrabold text-[#18372b]">
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
                {hasVerifiedSavings && (
                  <>
                    <span className="text-sm text-[#738478] line-through font-sans">
                      ₹{product.mrp?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold text-[#25764d] bg-emerald-50 px-2 py-0.5 rounded">
                      Save ₹{((product.mrp || 0) - (product.price || 0)).toLocaleString('en-IN')}
                    </span>
                  </>
                )}
              </div>

              {/* Add / Qty CTA inside Modal */}
              <div className="pt-3">
                {isSelected ? (
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center border border-[#dbe3d9] rounded-[8px] overflow-hidden bg-white shadow-xs">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, -1)}
                        className="w-9 h-9 flex items-center justify-center text-[#18372b] hover:bg-stone-100 font-extrabold text-base"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-bold text-sm text-[#18372b]">
                        {quantityInCombo}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, 1)}
                        className="w-9 h-9 flex items-center justify-center text-[#18372b] hover:bg-stone-100 font-extrabold text-base"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-[#25764d] font-bold flex items-center gap-1">
                      <Check size={14} />
                      <span>Added to your combo</span>
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(product.id, 1)}
                    className="w-full sm:w-auto px-6 py-3 rounded-[11px] bg-[#123b2d] hover:bg-[#235b43] text-white text-xs font-extrabold uppercase tracking-wider shadow-xs transition-all"
                  >
                    + Add to Combo
                  </button>
                )}
              </div>
            </div>
          </div>

          <hr className="border-[#f0f2ed]" />

          {/* Deep Details: Indications, Ingredients, Directions, Storage, Warnings */}
          <div className="space-y-4 text-xs leading-relaxed text-[#283830]">
            {product.indications && (
              <div>
                <strong className="block text-[#18372b] font-sans text-xs font-bold mb-1">
                  Indications &amp; Recommended Role:
                </strong>
                <p className="bg-[#FAF9F5] p-3 rounded-[10px] border border-[#e4e7df] text-[#283830]">
                  {product.indications}
                </p>
              </div>
            )}

            {product.ingredients && (
              <div>
                <strong className="block text-[#18372b] font-sans text-xs font-bold mb-1">
                  Key Ingredients &amp; Botanicals:
                </strong>
                <p className="bg-[#FAF9F5] p-3 rounded-[10px] border border-[#e4e7df] text-[#283830]">
                  {product.ingredients}
                </p>
              </div>
            )}

            {product.directions && (
              <div>
                <strong className="block text-[#18372b] font-sans text-xs font-bold mb-1">
                  Directions for Use:
                </strong>
                <p className="bg-[#FAF9F5] p-3 rounded-[10px] border border-[#e4e7df] text-[#283830]">
                  {product.directions}
                </p>
              </div>
            )}

            {product.warnings && (
              <div className="p-3.5 rounded-[10px] bg-[#fff9ec] border border-[#f0e2bf] text-[#5c4620]">
                <strong className="block font-bold mb-1">
                  Safety Precautions:
                </strong>
                <p className="text-[11.5px] leading-relaxed">
                  {product.warnings}
                </p>
              </div>
            )}

            {product.storage && (
              <p className="text-[11.5px] text-[#4d6355]">
                <strong>Storage:</strong> {product.storage}
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF9F5] border-t border-[#e4e7df] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#4d6355]">
            <ShieldCheck size={16} className="text-[#25764d]" />
            <span>Official AyurRaksha Ayurvedic Formulation • Chennai, India</span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenConsult();
            }}
            className="text-xs font-extrabold text-[#1c513d] hover:underline"
          >
            Consult Doctor About This Product →
          </button>
        </div>
      </div>
    </div>
  );
};
