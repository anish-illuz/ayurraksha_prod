'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, Lock } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useCart } from '@/lib/cartContext';
import { SITE_CONFIG } from '@/data/siteConfig';

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
    checkoutUrl,
  } = useCart();

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <Breadcrumb items={[{ name: 'Shopping Cart', url: '/cart' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest mb-2">
          Your Shopping Cart
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted mb-8">
          Review your selected Ayurvedic formulations before continuing to secure checkout.
        </p>

        {items.length === 0 ? (
          <div className="bg-white rounded-card border border-stone-200 p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-sage-light text-botanical flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} />
            </div>
            <h2 className="font-serif text-xl font-bold text-forest">Your cart is currently empty</h2>
            <p className="text-xs text-charcoal-muted mt-2">
              Explore our classical Ayurvedic tonics, therapeutic oils, and holistic health packs.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-button text-xs font-semibold bg-forest hover:bg-forest-light text-white transition-colors"
            >
              <span>Explore Formulations (44)</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items Table */}
            <div className="lg:col-span-8 bg-white rounded-card border border-stone-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <span className="text-xs font-bold text-forest uppercase tracking-wider">
                  Product Details ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs text-stone-400 hover:text-red-600 transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              <div className="divide-y divide-stone-100">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedVariant || 'default'}`}
                    className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Thumbnail & Title */}
                    <div className="flex items-center gap-4 min-w-0">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="relative w-20 h-20 bg-[#FDFBF7] rounded-lg border border-stone-200 p-1 flex-shrink-0 overflow-hidden"
                      >
                        <Image
                          src={item.product.images[0] || 'https://www.ayurrakshaonline.com/wp-content/uploads/2024/02/1-1024x1024.jpg'}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-contain"
                        />
                      </Link>

                      <div className="min-w-0">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="text-sm font-semibold text-charcoal hover:text-botanical transition-colors line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        {item.selectedVariant && (
                          <p className="text-xs text-charcoal-muted mt-0.5">
                            Pack: <span className="font-medium text-charcoal">{item.selectedVariant}</span>
                          </p>
                        )}
                        <span className="text-xs font-bold text-forest sm:hidden block mt-1">
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Item Subtotal */}
                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6">
                      <div className="flex items-center border border-stone-200 rounded-button bg-stone-50 overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant)}
                          aria-label="Decrease quantity"
                          className="p-1.5 text-stone-600 hover:bg-stone-200 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-xs font-semibold text-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant)}
                          aria-label="Increase quantity"
                          className="p-1.5 text-stone-600 hover:bg-stone-200 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="text-right min-w-[5rem]">
                        <span className="text-sm font-bold text-forest">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                        aria-label={`Remove ${item.product.name}`}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary & Checkout Card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-card border border-stone-200 p-6 shadow-xs space-y-4">
                <h2 className="font-serif text-lg font-bold text-forest pb-3 border-b border-stone-100">
                  Order Summary
                </h2>

                <div className="space-y-2.5 text-xs text-charcoal-muted">
                  <div className="flex items-center justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-charcoal">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-emerald-800">
                    <span className="flex items-center gap-1">
                      <Truck size={14} />
                      <span>Prepaid Delivery</span>
                    </span>
                    <span className="font-semibold">FREE</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Applicable Taxes</span>
                    <span>Included</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-forest">Total Payable</span>
                  <span className="text-xl font-bold text-forest">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <a
                  href={checkoutUrl}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-button text-sm font-semibold bg-botanical hover:bg-forest text-white shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
                >
                  <Lock size={16} />
                  <span>Proceed to Secure Checkout</span>
                </a>

                <div className="pt-2 text-center text-[11px] text-charcoal-muted space-y-1">
                  <p>Payments processed securely via Razorpay gateway.</p>
                  <p>UPI, Cards, NetBanking, and Cash on Delivery supported.</p>
                </div>
              </div>

              {/* Trust Card */}
              <div className="bg-sage-light p-4 rounded-card border border-border-botanical space-y-2 text-xs text-charcoal-muted">
                <div className="flex items-center gap-2 text-forest font-semibold">
                  <ShieldCheck size={16} className="text-botanical" />
                  <span>Doctor Consultation Support</span>
                </div>
                <p className="text-[11px]">
                  Need guidance on dosage or formulation compatibility? Consult Dr. Jegajothi Pandian on WhatsApp at{' '}
                  <a
                    href={SITE_CONFIG.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-botanical font-semibold underline"
                  >
                    {SITE_CONFIG.displayPhone}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
