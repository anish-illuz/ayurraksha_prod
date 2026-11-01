'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, ShieldCheck, AlertCircle, Sparkles, Check } from 'lucide-react';
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

  const isPending = Boolean(product.pricePending) || product.price === null;
  const isSelected = quantityInCombo > 0;
  const hasVerifiedSavings = !isPending && product.mrp !== null && product.price !== null && product.mrp > product.price;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#FAF9F5] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-stone-200 text-[#18372b]">
              {product.category}
            </span>
            <span className="text-xs text-stone-500">•</span>
            <span className="text-xs text-stone-600 font-medium">{product.packSize}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            {/* Product Photography */}
            <div className="sm:col-span-5 bg-gradient-to-b from-[#F7F5EE] to-[#EFECE1] rounded-2xl p-4 flex items-center justify-center aspect-square relative border border-stone-200">
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
                <div className="absolute top-2.5 left-2.5 bg-[#fff7eb] border border-[#f0dfc4] text-[#8a5b28] text-[9.5px] font-bold px-2 py-0.5 rounded">
                  Doctor-guided
                </div>
              )}
            </div>

            {/* Key Information & Price */}
            <div className="sm:col-span-7 space-y-3">
              <h3 id="product-modal-title" className="font-heading text-xl sm:text-2xl font-bold text-[#18372b] leading-snug">
                {product.name}
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Price row */}
              <div className="pt-2 flex items-baseline gap-2.5">
                {isPending ? (
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                    Pricing pending administrative confirmation
                  </span>
                ) : (
                  <>
                    <span className="font-heading text-2xl font-bold text-[#18372b]">
                      ₹{product.price?.toLocaleString('en-IN')}
                    </span>
                    {hasVerifiedSavings && (
                      <>
                        <span className="text-sm text-stone-400 line-through">
                          ₹{product.mrp?.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Save ₹{((product.mrp || 0) - (product.price || 0)).toLocaleString('en-IN')}
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Add / Qty CTA inside Modal */}
              <div className="pt-3">
                {isPending ? (
                  <p className="text-xs text-amber-700 italic">
                    This formulation is awaiting pricing verification and cannot be purchased directly.
                  </p>
                ) : isSelected ? (
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center border border-[#18372b] rounded-xl overflow-hidden bg-white shadow-xs">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, -1)}
                        className="w-10 h-10 flex items-center justify-center text-[#18372b] hover:bg-stone-100"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-[#18372b]">
                        {quantityInCombo}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(product.id, 1)}
                        className="w-10 h-10 flex items-center justify-center text-[#18372b] hover:bg-stone-100"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <Check size={14} />
                      <span>Added to your combo</span>
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(product.id, 1)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#18372b] hover:bg-[#23533e] text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-all"
                  >
                    Add to Combo
                  </button>
                )}
              </div>
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* Deep Details: Indications, Ingredients, Directions, Storage, Warnings */}
          <div className="space-y-4 text-xs leading-relaxed text-stone-700">
            {product.indications && (
              <div>
                <strong className="block text-stone-900 font-serif text-sm mb-1">
                  Indications &amp; Recommended Role:
                </strong>
                <p className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                  {product.indications}
                </p>
              </div>
            )}

            {product.ingredients && (
              <div>
                <strong className="block text-stone-900 font-serif text-sm mb-1">
                  Key Ingredients &amp; Botanicals:
                </strong>
                <p className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                  {product.ingredients}
                </p>
              </div>
            )}

            {product.directions && (
              <div>
                <strong className="block text-stone-900 font-serif text-sm mb-1">
                  Directions for Use:
                </strong>
                <p className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                  {product.directions}
                </p>
              </div>
            )}

            {product.warnings && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900">
                <strong className="flex items-center gap-1.5 font-bold mb-1">
                  <AlertCircle size={14} className="text-amber-700" />
                  <span>Safety Precautions &amp; Clinical Guardrails:</span>
                </strong>
                <p className="text-[11.5px] leading-relaxed">
                  {product.warnings}
                </p>
              </div>
            )}

            {product.storage && (
              <p className="text-[11px] text-stone-500">
                <strong>Storage:</strong> {product.storage}
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-500">
            <ShieldCheck size={16} className="text-emerald-700" />
            <span>Official AyurRaksha Ayurvedic Formulation • Chennai, India</span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenConsult();
            }}
            className="text-xs font-bold text-[#18372b] hover:underline"
          >
            Consult Doctor About This Product →
          </button>
        </div>
      </div>
    </div>
  );
};
