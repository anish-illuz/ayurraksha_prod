'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    itemCount,
    subtotal,
    comboDiscount,
    comboDiscountPercent,
    totalPayable,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    checkoutUrl,
  } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isCartOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
      className="fixed inset-0 z-50 flex justify-end bg-forest-dark/60 backdrop-blur-xs transition-opacity duration-300"
      onClick={closeCart}
    >
      <div
        className="w-full max-w-md h-full bg-white shadow-drawer flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-botanical" />
            <h2 className="text-base font-semibold text-charcoal">
              Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </h2>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-1.5 text-stone-400 hover:text-charcoal hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Incentive Banner */}
        <div className="bg-sage/70 px-5 py-2.5 border-b border-border-botanical flex items-center gap-2 text-xs text-forest font-medium">
          <ShieldCheck size={16} className="text-botanical flex-shrink-0" />
          <span>Free delivery on all prepaid orders across India</span>
        </div>

        {/* Cart Items List */}
        <div className="flex-grow overflow-y-auto p-5 divide-y divide-stone-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-sage-light flex items-center justify-center text-botanical mb-4">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-base font-heading font-bold text-charcoal">Your cart is empty</h3>
              <p className="text-xs text-charcoal-muted mt-1.5 max-w-xs">
                Explore our doctor-formulated natural Ayurvedic remedies, tonics, and health combos.
              </p>
              <button
                onClick={closeCart}
                className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-botanical hover:bg-forest text-white transition-colors shadow-xs"
              >
                <span>Shop Best Sellers</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.product.id}-${item.selectedVariant || 'default'}`} className="py-4 flex items-start gap-3.5">
                {/* Thumbnail */}
                <Link
                  href={`/product/${item.product.slug}`}
                  onClick={closeCart}
                  className="relative w-18 h-18 aspect-square bg-[#FDFBF7] rounded-lg border border-stone-200 flex-shrink-0 p-1 overflow-hidden self-start"
                >
                  <Image
                    src={item.product.images?.[0] || 'https://www.ayurrakshaonline.com/wp-content/uploads/2024/02/1-1024x1024.jpg'}
                    alt={item.product.name}
                    fill
                    sizes="72px"
                    className="object-contain"
                  />
                </Link>

                {/* Info & Quantity */}
                <div className="flex-grow min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={closeCart}
                        className="text-xs font-semibold text-charcoal hover:text-botanical transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                        aria-label={`Remove ${item.product.name}`}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {item.selectedVariant && (
                      <p className="text-xs text-charcoal-muted mt-0.5">
                        Pack: <span className="font-semibold text-emerald-800">{item.selectedVariant}</span>
                        {item.isSecondVariantOffer && (
                          <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#8C3A00] text-white">
                            Save 5%
                          </span>
                        )}
                        {item.packCount && item.packCount > 1 && !item.isSecondVariantOffer && (
                          <span className="ml-1 text-[11px] font-medium text-stone-500">
                            ({item.quantity} packs total)
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2.5">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-stone-200 rounded-md bg-stone-50 overflow-hidden">
                      <button
                        onClick={() => {
                          const step = item.packCount && item.packCount > 1 ? item.packCount : 1;
                          updateQuantity(item.product.id, item.quantity - step, item.selectedVariant);
                        }}
                        aria-label="Decrease quantity"
                        className="p-1 text-stone-600 hover:bg-stone-200 transition-colors"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-charcoal">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          const step = item.packCount && item.packCount > 1 ? item.packCount : 1;
                          updateQuantity(item.product.id, item.quantity + step, item.selectedVariant);
                        }}
                        aria-label="Increase quantity"
                        className="p-1 text-stone-600 hover:bg-stone-200 transition-colors"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Price with accurate live variation support */}
                    <div className="text-right">
                      <span className="text-xs font-bold text-forest block">
                        ₹{Math.round((item.variantPrice ?? item.product.price) * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.isSecondVariantOffer ? (
                        <span className="text-[10px] text-stone-400 line-through block">
                          ₹{Math.round((item.originalUnitPrice ?? item.product.price) * item.quantity).toLocaleString('en-IN')}
                        </span>
                      ) : item.product.regularPrice > (item.variantPrice ?? item.product.price) ? (
                        <span className="text-[10px] text-stone-400 line-through block">
                          ₹{Math.round(item.product.regularPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-charcoal">Subtotal</span>
              <span className="text-lg font-bold text-forest">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            {comboDiscount > 0 && (
              <div className="flex items-center justify-between mb-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded">
                <span>Combo Discount ({comboDiscountPercent}% OFF)</span>
                <span>-₹{comboDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            {comboDiscount > 0 && (
              <div className="flex items-center justify-between mb-1.5 pt-1.5 border-t border-stone-200">
                <span className="text-sm font-bold text-charcoal">Total</span>
                <span className="text-lg font-bold text-forest">
                  ₹{totalPayable.toLocaleString('en-IN')}
                </span>
              </div>
            )}
            <p className="text-[11px] text-charcoal-muted mb-4">
              Taxes included. Standard delivery across India.
            </p>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-sm font-bold uppercase tracking-wider bg-botanical hover:bg-forest text-white shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </Link>

            <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-charcoal-muted">
              <span>Razorpay Verified</span>
              <span>•</span>
              <span>UPI / Cards / COD</span>
              <span>•</span>
              <span>Discreet Packing</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
