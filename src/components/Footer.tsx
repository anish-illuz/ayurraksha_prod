'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
} from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#0D2E22] text-[#F6F1E7] overflow-hidden border-t border-[#184534]">
      {/* Soft botanical ambient gradients */}
      <div
        className="hidden lg:block absolute left-0 top-0 w-96 h-96 pointer-events-none opacity-20 bg-radial from-[#1E5C45] to-transparent"
        aria-hidden="true"
      />
      <div
        className="hidden lg:block absolute right-0 bottom-0 w-96 h-96 pointer-events-none opacity-25 bg-radial from-[#1A4D39] to-transparent"
        aria-hidden="true"
      />

      {/* Main 4-Column Footer Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 sm:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-0 items-start">

          {/* Column 1: Brand & Contact Info (Span 4) */}
          <div className="lg:col-span-4 lg:pr-8 space-y-5">
            {/* Original White Ayurraksha Brand Logo (increased by 50% from h-12 w-44 to h-[72px] w-[264px]) */}
            <div>
              <Link href="/" className="inline-block group" aria-label="AyurRaksha Homepage">
                <div className="relative h-[72px] w-[264px] max-w-full">
                  <Image
                    src="/images/logo-white.png"
                    alt="AyurRaksha - Rooted in Ayurveda"
                    fill
                    sizes="264px"
                    priority
                    className="object-contain object-left transition-opacity group-hover:opacity-90"
                  />
                </div>
              </Link>

              {/* Subtitle in Gold matching 11.webp */}
              <div className="mt-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] text-[#C9AD79] uppercase leading-tight font-sans">
                ROOTED IN AYURVEDA<br />
                FOR A HEALTHIER TOMORROW
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3 text-xs sm:text-sm text-[#F6F1E7]/85 pt-1">
              <MapPin size={18} className="text-[#C9AD79] flex-shrink-0 mt-0.5" />
              <address className="not-italic leading-relaxed font-sans">
                251, First Floor,<br />
                New Tiny Sector,<br />
                Ambattur Industrial Estate,<br />
                Chennai 600058
              </address>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <Phone size={17} className="text-[#C9AD79] flex-shrink-0" />
              <a
                href={`tel:${SITE_CONFIG.phone}`}
                className="text-sm sm:text-base font-bold text-[#F6F1E7] hover:text-[#C9AD79] transition-colors tracking-wide font-sans"
              >
                99403-88877
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail size={17} className="text-[#C9AD79] flex-shrink-0" />
              <a
                href="mailto:info@vprimecorp.in"
                className="text-xs sm:text-sm text-[#F6F1E7]/90 hover:text-[#C9AD79] transition-colors font-sans"
              >
                info@vprimecorp.in
              </a>
            </div>

            {/* Social Icons matching 11.webp circular outline buttons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/ayurrakshaonline/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ayurraksha on Instagram"
                className="w-8 h-8 rounded-full border border-[#C9AD79]/60 text-[#F6F1E7] hover:bg-[#C9AD79] hover:text-[#0D2E22] hover:border-[#C9AD79] transition-all flex items-center justify-center"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://www.facebook.com/VPrimeCare/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ayurraksha on Facebook"
                className="w-8 h-8 rounded-full border border-[#C9AD79]/60 text-[#F6F1E7] hover:bg-[#C9AD79] hover:text-[#0D2E22] hover:border-[#C9AD79] transition-all flex items-center justify-center"
              >
                <Facebook size={15} />
              </a>
              <a
                href="https://www.youtube.com/@ayurrakshaonline"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ayurraksha on YouTube"
                className="w-8 h-8 rounded-full border border-[#C9AD79]/60 text-[#F6F1E7] hover:bg-[#C9AD79] hover:text-[#0D2E22] hover:border-[#C9AD79] transition-all flex items-center justify-center"
              >
                <Youtube size={15} />
              </a>
            </div>
          </div>

          {/* Column 2: SHOP (Span 2) with vertical divider matching 11.webp */}
          <div className="lg:col-span-2 lg:border-l lg:border-[#1E4D3A]/60 lg:pl-6 xl:pl-8 space-y-4">
            <div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-[#C9AD79] tracking-wider uppercase whitespace-nowrap">
                SHOP
              </h4>
              <div className="w-8 h-[2px] bg-[#C9AD79] mt-2 mb-4" />
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#F6F1E7]/85 font-sans">
              <li>
                <Link href="/shop" className="hover:text-[#C9AD79] transition-colors block">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#C9AD79] transition-colors block">
                  Shop by Concern
                </Link>
              </li>
              <li>
                <Link href="/shop?sort=bestseller" className="hover:text-[#C9AD79] transition-colors block">
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link href="/category/health-packs" className="hover:text-[#C9AD79] transition-colors block">
                  Wellness Packs
                </Link>
              </li>
              <li>
                <Link href="/category/powder" className="hover:text-[#C9AD79] transition-colors block">
                  Ayurvedic Teas
                </Link>
              </li>
              <li>
                <Link href="/category/oil" className="hover:text-[#C9AD79] transition-colors block">
                  Personal Care
                </Link>
              </li>
              <li>
                <Link href="/concern/pain-joints" className="hover:text-[#C9AD79] transition-colors block">
                  Pain Relief
                </Link>
              </li>
              <li>
                <Link href="/concern/digestive-health" className="hover:text-[#C9AD79] transition-colors block">
                  Digestive Health
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: ABOUT AYURRAKSHA (Span 3 - Guaranteed single line) with vertical divider matching 11.webp */}
          <div className="lg:col-span-3 lg:border-l lg:border-[#1E4D3A]/60 lg:pl-6 xl:pl-8 space-y-4">
            <div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-[#C9AD79] tracking-wider uppercase whitespace-nowrap">
                ABOUT AYURRAKSHA
              </h4>
              <div className="w-8 h-[2px] bg-[#C9AD79] mt-2 mb-4" />
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#F6F1E7]/85 font-sans">
              <li>
                <Link href="/about" className="hover:text-[#C9AD79] transition-colors block">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#C9AD79] transition-colors block">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C9AD79] transition-colors block">
                  Our Locations
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C9AD79] transition-colors block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: CUSTOMER CARE (Span 3) with vertical divider matching 11.webp */}
          <div className="lg:col-span-3 lg:border-l lg:border-[#1E4D3A]/60 lg:pl-6 xl:pl-8 space-y-4">
            <div>
              <h4 className="font-serif text-base sm:text-lg font-bold text-[#C9AD79] tracking-wider uppercase whitespace-nowrap">
                CUSTOMER CARE
              </h4>
              <div className="w-8 h-[2px] bg-[#C9AD79] mt-2 mb-4" />
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#F6F1E7]/85 font-sans">
              <li>
                <Link href="/order-tracking" className="hover:text-[#C9AD79] transition-colors block">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#C9AD79] transition-colors block">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-returns" className="hover:text-[#C9AD79] transition-colors block">
                  Return &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-[#C9AD79] transition-colors block">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#C9AD79] transition-colors block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#C9AD79] transition-colors block">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Darker Bottom Section matching 11.webp (#071C14) */}
      <div className="relative z-10 bg-[#071C14] text-[#F6F1E7] border-t border-[#143B2C] pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Disclaimer & Payment Methods Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

            {/* Left Box: DISCLAIMER (Span 7) with Left Gold Border */}
            <div className="lg:col-span-7 border-l-2 border-[#C9AD79] pl-4 sm:pl-5 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9AD79] block">
                DISCLAIMER
              </span>
              <p className="text-xs sm:text-[13px] text-[#F6F1E7]/80 leading-relaxed font-sans">
                AyurRaksha products are Ayurvedic and herbal dietary supplements formulated to promote natural health, balance and well-being. They are not intended to diagnose, treat, cure or prevent any disease. Please consult a qualified Ayurvedic physician or medical doctor before use, especially if you are pregnant, lactating, taking medication or have a pre-existing medical condition.
              </p>
            </div>

            {/* Right Box: PAYMENT METHODS (Span 5) with Vertical Divider */}
            <div className="lg:col-span-5 lg:border-l lg:border-[#1E4D3A]/60 lg:pl-8 space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9AD79] block">
                PAYMENT METHODS
              </span>

              {/* 4 Clean Payment Badges matching 11.webp */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {/* 1. Visa */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-14 h-9 rounded-md bg-white flex items-center justify-center shadow-xs px-1">
                    <span className="font-bold text-[#1A1F71] text-xs tracking-wider italic font-sans">
                      VISA
                    </span>
                  </div>
                  <span className="text-[11px] text-[#F6F1E7]/70 font-sans">Visa</span>
                </div>

                {/* 2. Mastercard */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-14 h-9 rounded-md bg-[#1B1B1B] border border-stone-700 flex items-center justify-center shadow-xs relative overflow-hidden">
                    <div className="w-4 h-4 rounded-full bg-[#EB001B] opacity-90 -mr-1.5" />
                    <div className="w-4 h-4 rounded-full bg-[#F79E1B] opacity-90" />
                  </div>
                  <span className="text-[11px] text-[#F6F1E7]/70 font-sans">Mastercard</span>
                </div>

                {/* 3. UPI */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-14 h-9 rounded-md bg-white flex items-center justify-center shadow-xs px-1 gap-0.5">
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-[#097939] transform rotate-45" />
                    <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[8px] border-t-[#ED752E] transform rotate-45 -ml-1" />
                    <span className="font-bold text-stone-900 text-[10px] ml-0.5 font-sans">UPI</span>
                  </div>
                  <span className="text-[11px] text-[#F6F1E7]/70 font-sans">UPI</span>
                </div>

                {/* 4. Cash on Delivery */}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-14 h-9 rounded-md bg-[#0D2E22] border border-[#C9AD79]/60 flex items-center justify-center shadow-xs px-1">
                    <span className="font-bold text-[#F6F1E7] text-[10px] tracking-wider font-sans">
                      COD
                    </span>
                  </div>
                  <span className="text-[11px] text-[#F6F1E7]/70 font-sans">Cash on Delivery</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Copyright & Legal Links Row matching 11.webp */}
          <div className="border-t border-[#163D2E] pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F6F1E7]/70 font-sans">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} AyurRaksha Online (VPrime Innovations). All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[#F6F1E7]/70">
              <Link href="/shipping-policy" className="hover:text-[#C9AD79] transition-colors">
                Shipping Policy
              </Link>
              <span>|</span>
              <Link href="/refund-returns" className="hover:text-[#C9AD79] transition-colors">
                Return &amp; Refund Policy
              </Link>
              <span>|</span>
              <Link href="/terms-of-service" className="hover:text-[#C9AD79] transition-colors">
                Terms &amp; Conditions
              </Link>
              <span>|</span>
              <Link href="/privacy-policy" className="hover:text-[#C9AD79] transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
