'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle, ArrowRight, Copy, Check, Sparkles } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const couponCode = 'WELCOME10';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsSubmitted(true);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('ayurraksha_newsletter_subscribed', 'true');
          localStorage.setItem('ayurraksha_welcome_coupon', couponCode);
        } catch {
          // ignore
        }
      }
    }
  };

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-[#FAF7F2] border-t border-stone-200/60 text-charcoal">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 border border-stone-200/80 shadow-xs">
          {!isSubmitted ? (
            /* Balanced Two-Column / Centered Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Offer Content */}
              <div className="lg:col-span-6 space-y-3 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage text-primary text-xs font-semibold">
                  <Sparkles size={13} className="text-gold" />
                  <span>First-Order Exclusive</span>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-primary leading-tight">
                  Your Wellness Journey Starts with 10% Off
                </h2>

                <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
                  Subscribe for your first-order offer, Ayurvedic wellness tips and exclusive AyurRaksha updates.
                </p>

                <div className="pt-1 text-xs text-charcoal-muted">
                  <span>✓ 10% instant discount</span> • <span>✓ Free delivery on prepaid orders</span> • <span>✓ Zero spam</span>
                </div>
              </div>

              {/* Right Column: Prominent Email Field & CTA */}
              <div className="lg:col-span-6">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 max-w-md mx-auto lg:max-w-none"
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email Address
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email address"
                      className="flex-grow px-4 h-13 rounded-xl text-sm sm:text-base bg-white border-2 border-stone-200 text-charcoal placeholder:text-stone-400 focus:outline-none focus:border-primary shadow-xs transition-colors"
                    />
                    <button
                      type="submit"
                      className="h-13 inline-flex items-center justify-center gap-2 px-6 rounded-xl text-sm sm:text-base font-bold bg-primary hover:bg-primary-dark text-white transition-all shadow-sm active:scale-[0.98] whitespace-nowrap"
                    >
                      <span>Unlock My 10% Off</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                  <p className="text-[11px] sm:text-xs text-charcoal-muted text-center lg:text-left">
                    By subscribing, you agree to receive promotional emails. Offer valid on your first order. Unsubscribe anytime.
                  </p>
                </form>
              </div>
            </div>
          ) : (
            /* Successful Subscription State with Coupon Code Reveal */
            <div className="text-center max-w-xl mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle size={26} />
              </div>

              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary">
                Welcome to AyurRaksha!
              </h3>

              <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
                Thank you for subscribing. Here is your 10% off code for your first order:
              </p>

              {/* Coupon Code Display Box with 1-Click Copy */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F5] border-2 border-dashed border-[#164232]/40 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-md mx-auto">
                <div className="text-left">
                  <span className="text-[10px] font-bold text-[#8a6020] uppercase tracking-wider block">
                    FIRST ORDER COUPON CODE
                  </span>
                  <strong className="font-mono text-xl sm:text-2xl font-bold text-primary tracking-wider">
                    {couponCode}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-primary text-white hover:bg-primary-dark transition-all shadow-xs active:scale-95"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <p className="text-xs text-[#283830]">
                Apply code <strong>{couponCode}</strong> at checkout. Valid on all prepaid orders across India with free shipping.
              </p>

              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-xl text-xs sm:text-sm font-semibold bg-primary hover:bg-primary-dark text-white transition-all shadow-xs"
                >
                  <span>Start Shopping with 10% Off</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
