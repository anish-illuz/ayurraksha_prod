'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Sparkles, ArrowRight, Check } from 'lucide-react';

export const ExitIntentDiscountModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // 1. Strict guard: NEVER show to users who have placed an order
    const hasOrdered = typeof window !== 'undefined' && localStorage.getItem('ayurraksha_has_ordered') === 'true';
    if (hasOrdered) return;

    // 2. Check if dismissed or already shown in this session
    const hasShown = typeof window !== 'undefined' && sessionStorage.getItem('ayurraksha_exit_discount_shown');
    if (hasShown) return;

    // 3. Do not trigger on active checkout completion
    if (pathname === '/checkout') return;

    let triggered = false;

    const triggerPopup = () => {
      // Re-verify ordering state before opening
      const orderConfirmed = typeof window !== 'undefined' && localStorage.getItem('ayurraksha_has_ordered') === 'true';
      if (orderConfirmed || triggered) return;

      triggered = true;
      setIsVisible(true);
      sessionStorage.setItem('ayurraksha_exit_discount_shown', 'true');
    };

    // Desktop exit-intent: detect cursor moving toward top exit / tab bar
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 20) {
        triggerPopup();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    // Mobile & tab-switch intent: user switching tabs or switching apps before purchasing
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sessionStorage.setItem('ayurraksha_exit_intent_primed', 'true');
      } else if (document.visibilityState === 'visible' && sessionStorage.getItem('ayurraksha_exit_intent_primed') === 'true') {
        sessionStorage.removeItem('ayurraksha_exit_intent_primed');
        triggerPopup();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Mobile fallback: engage after 35 seconds of browsing without placing an order
    const timer = setTimeout(() => {
      if (window.innerWidth < 768) {
        triggerPopup();
      }
    }, 35000);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(timer);
    };
  }, [pathname]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-discount-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-[22px] border border-[#d8e4da] shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close discount popup"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-[#18372b] flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8EE] border border-[#EADBBD] text-[#8a6020] text-[11px] font-extrabold uppercase tracking-wider mx-auto">
            <Sparkles size={13} className="text-[#dba95c]" />
            <span>Limited-Time Wellness Savings</span>
          </div>

          <h2 id="exit-discount-title" className="font-serif text-2xl sm:text-3xl font-bold text-[#18372b] leading-tight">
            Build Your Combo &amp; Save Up to 15% Today
          </h2>

          <p className="text-xs sm:text-[13px] text-[#283830] leading-relaxed max-w-md mx-auto">
            Create your custom skin care routine with AyurRaksha classical formulations and unlock automatic volume discounts:
          </p>

          {/* Discount Cards Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-left">
            {/* 10% Tier */}
            <div className="p-4 rounded-[14px] bg-[#F4F7EE] border border-[#DCE4CF] space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#25764d] block">
                TIER 1 SAVINGS
              </span>
              <div className="font-serif text-2xl font-bold text-[#18372b]">
                10% OFF
              </div>
              <p className="text-[11px] text-[#283830] leading-snug">
                Orders above <strong>₹2,000</strong>
              </p>
            </div>

            {/* 15% Tier */}
            <div className="p-4 rounded-[14px] bg-[#FAF8EE] border border-[#EADBBD] space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8a6020] block">
                TIER 2 SAVINGS
              </span>
              <div className="font-serif text-2xl font-bold text-[#18372b]">
                15% OFF
              </div>
              <p className="text-[11px] text-[#283830] leading-snug">
                Orders above <strong>₹5,000</strong>
              </p>
            </div>
          </div>

          {/* Automatic Application Notice */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#25764d] font-bold pt-1">
            <Check size={15} />
            <span>Applied automatically at checkout — no coupon code required!</span>
          </div>

          {/* Call to Action to Combo Builder */}
          <div className="pt-2">
            <Link
              href="/combo-builder"
              onClick={handleClose}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-[11px] bg-[#123b2d] hover:bg-[#235b43] text-white font-extrabold text-xs sm:text-[13px] uppercase tracking-wider shadow-md transition-all active:scale-[0.98]"
            >
              <span>Build My Combo &amp; Claim Discount</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <p className="text-[11px] text-[#6b7d72] pt-1">
            Free shipping across India on all prepaid orders • Razorpay &amp; Cash on Delivery
          </p>
        </div>
      </div>
    </div>
  );
};
