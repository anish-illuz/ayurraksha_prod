'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, ArrowRight, Instagram, Facebook, Youtube, Check } from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-white text-[#26352D] pt-14 pb-10 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main 4-Column Grid matching reference image */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-stone-200">

          {/* Left Column: Brand, Address, Phone, Email */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block" aria-label="Ayurraksha Home">
              <div className="relative h-12 w-48">
                <Image
                  src="/images/logo.png"
                  alt="Ayurraksha"
                  fill
                  sizes="192px"
                  className="object-contain object-left"
                />
              </div>
            </Link>

            {/* Address with larger, clear, legible font */}
            <p className="text-base italic text-[#26352D] leading-relaxed">
              251, First Floor,<br />
              New Tiny Sector,<br />
              Ambattur Industrial Estate,<br />
              Chennai 600058
            </p>

            {/* Phone */}
            <div className="flex items-center gap-3 pt-1">
              <Phone size={22} className="text-[#26352D] flex-shrink-0" />
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="text-lg font-bold text-[#26352D] tracking-wide hover:text-[#9E2A2B] transition-colors"
              >
                99403-88877
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail size={22} className="text-[#26352D] flex-shrink-0" />
              <a
                href="mailto:info@vprimecorp.in"
                className="text-base font-semibold text-[#26352D] hover:text-[#9E2A2B] transition-colors"
              >
                info@vprimecorp.in
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links 1 (SHOP ALL, CONSULT A DOCTOR, etc.) */}
          <div className="lg:col-span-2">
            <ul className="space-y-4 text-sm sm:text-[15px] font-bold uppercase tracking-wider text-[#9E2A2B]">
              <li>
                <Link href="/shop" className="hover:underline transition-colors block">
                  SHOP ALL
                </Link>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline transition-colors block"
                >
                  CONSULT A DOCTOR
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:underline transition-colors block">
                  OUR LOCATIONS
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:underline transition-colors block">
                  SHIPPING POLICY
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:underline transition-colors block">
                  TERMS &amp; CONDITIONS
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation Links 2 (BLOG, ORDER TRACKING, etc.) */}
          <div className="lg:col-span-2">
            <ul className="space-y-4 text-sm sm:text-[15px] font-bold uppercase tracking-wider text-[#9E2A2B]">
              <li>
                <Link href="/blog" className="hover:underline transition-colors block">
                  BLOG
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:underline transition-colors block">
                  ORDER TRACKING
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline transition-colors block">
                  CONTACT US
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:underline transition-colors block">
                  PRIVACY POLICY
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline transition-colors block">
                  ABOUT US
                </Link>
              </li>
              <li>
                <Link href="/refund-returns" className="hover:underline transition-colors block">
                  RETURN &amp; REFUND POLICY
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: JOIN OUR MAILING LIST & FOLLOW US */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <h4 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#26352D] mb-3.5">
                JOIN OUR MAILING LIST
              </h4>

              {isSubscribed ? (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-sm font-semibold text-emerald-800 flex items-center gap-2">
                  <Check size={18} />
                  <span>Thank you for subscribing!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center">
                  <label htmlFor="footer-email-input" className="sr-only">
                    Enter Email
                  </label>
                  <input
                    id="footer-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter Email"
                    className="flex-grow px-4 py-3 bg-white border border-stone-300 rounded-l-md text-base text-[#26352D] placeholder:text-stone-400 focus:outline-none focus:border-stone-500 h-[48px]"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="px-5 py-3 bg-[#9FB8A6] hover:bg-[#8DA895] text-white rounded-r-md transition-colors flex items-center justify-center flex-shrink-0 h-[48px]"
                  >
                    <ArrowRight size={20} />
                  </button>
                </form>
              )}
            </div>

            {/* Follow Us with clean outline social icons */}
            <div>
              <h4 className="text-base sm:text-lg font-bold uppercase tracking-wider text-[#26352D] mb-3.5">
                FOLLOW US
              </h4>
              <div className="flex items-center gap-5 text-[#26352D]">
                <a
                  href="https://www.instagram.com/ayurrakshaonline/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Ayurraksha on Instagram"
                  className="hover:text-[#9E2A2B] transition-colors p-1"
                >
                  <Instagram size={28} className="stroke-[1.75]" />
                </a>
                <a
                  href="https://www.facebook.com/VPrimeCare/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Ayurraksha on Facebook"
                  className="hover:text-[#9E2A2B] transition-colors p-1"
                >
                  <Facebook size={28} className="stroke-[1.75]" />
                </a>
                <a
                  href="https://www.youtube.com/@ayurrakshaonline"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe to Ayurraksha on YouTube"
                  className="hover:text-[#9E2A2B] transition-colors p-1"
                >
                  <Youtube size={28} className="stroke-[1.75]" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Regulatory Disclaimer */}
        <div className="py-6 border-b border-stone-200 text-xs text-stone-500 leading-relaxed">
          <p>
            <strong className="text-stone-700">Disclaimer:</strong> Ayurraksha products are Ayurvedic and herbal dietary supplements formulated to promote natural health, balance, and well-being. Statements regarding dietary supplements have not been evaluated by any governmental drug administration to diagnose, treat, cure, or prevent any chronic disease. Please consult with a qualified Ayurvedic physician or medical doctor before beginning any new healthcare regimen, particularly if pregnant, lactating, taking prescription medication, or suffering from a pre-existing medical condition.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Ayurraksha Online (VPrime Innovations). All rights reserved.
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-600">
            <span className="px-2 py-0.5 rounded bg-stone-100 border border-stone-300">Razorpay Secured</span>
            <span className="px-2 py-0.5 rounded bg-stone-100 border border-stone-300">UPI / RuPay</span>
            <span className="px-2 py-0.5 rounded bg-stone-100 border border-stone-300">Visa / Mastercard</span>
            <span className="px-2 py-0.5 rounded bg-stone-100 border border-stone-300">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
