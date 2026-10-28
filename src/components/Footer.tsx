'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  ShieldCheck,
  CreditCard,
  Banknote,
  QrCode,
  Truck,
  ArrowRight,
} from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#163D30] text-[#F6F1E7] border-t border-[#1F4E3E]">
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 sm:pt-16 sm:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-8">

          {/* Column 1: Brand & Contact (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <Link href="/" className="inline-block" aria-label="Ayurraksha Homepage">
                <div className="relative h-12 w-48 bg-white/95 px-3 py-1.5 rounded-lg shadow-sm">
                  <Image
                    src="/images/logo.png"
                    alt="Ayurraksha"
                    fill
                    sizes="192px"
                    className="object-contain object-left p-1"
                  />
                </div>
              </Link>
              <p className="mt-3 text-xs tracking-wider uppercase font-semibold text-[#C9AD79]">
                Classical Ayurveda • Doctor Formulated
              </p>
            </div>

            <p className="text-sm text-[#F6F1E7]/80 leading-relaxed font-sans max-w-sm">
              Rooted in classical Ayurvedic pharmacology overseen by Dr. Jegajothi Pandian. Natural, pure herbal extracts crafted to restore balance from within.
            </p>

            {/* Address */}
            <div className="flex items-start gap-3 text-xs sm:text-sm text-[#F6F1E7]/85 pt-1">
              <MapPin size={18} className="text-[#C9AD79] flex-shrink-0 mt-0.5" />
              <address className="not-italic leading-relaxed">
                251, First Floor, New Tiny Sector,<br />
                Ambattur Industrial Estate,<br />
                Chennai, Tamil Nadu – 600058
              </address>
            </div>

            {/* Phone & Email */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-3">
                <Phone size={17} className="text-[#C9AD79] flex-shrink-0" />
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="text-sm sm:text-base font-bold text-[#F6F1E7] hover:text-[#C9AD79] transition-colors tracking-wide"
                >
                  99403-88877
                </a>
                <span className="text-xs text-[#C9AD79]/80 font-medium">(Customer Care)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={17} className="text-[#C9AD79] flex-shrink-0" />
                <a
                  href="mailto:info@vprimecorp.in"
                  className="text-xs sm:text-sm text-[#F6F1E7]/90 hover:text-[#C9AD79] transition-colors"
                >
                  info@vprimecorp.in
                </a>
              </div>
            </div>

            {/* Social Media Row - Displayed once with official channels */}
            <div className="pt-2">
              <span className="text-xs uppercase tracking-widest text-[#C9AD79] font-bold block mb-3">
                Follow AyurRaksha
              </span>
              <div className="flex items-center gap-3.5">
                <a
                  href="https://www.instagram.com/ayurrakshaonline/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ayurraksha on Instagram"
                  className="w-9 h-9 rounded-full bg-[#1F4E3E] text-[#F6F1E7] hover:bg-[#C9AD79] hover:text-[#163D30] transition-all flex items-center justify-center shadow-xs"
                >
                  <Instagram size={17} />
                </a>
                <a
                  href="https://www.facebook.com/VPrimeCare/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ayurraksha on Facebook"
                  className="w-9 h-9 rounded-full bg-[#1F4E3E] text-[#F6F1E7] hover:bg-[#C9AD79] hover:text-[#163D30] transition-all flex items-center justify-center shadow-xs"
                >
                  <Facebook size={17} />
                </a>
                <a
                  href="https://www.youtube.com/@ayurrakshaonline"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ayurraksha on YouTube"
                  className="w-9 h-9 rounded-full bg-[#1F4E3E] text-[#F6F1E7] hover:bg-[#C9AD79] hover:text-[#163D30] transition-all flex items-center justify-center shadow-xs"
                >
                  <Youtube size={17} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Shop Formulations (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-lg sm:text-xl font-bold text-[#C9AD79] tracking-wide border-b border-[#235343] pb-2.5">
              Shop AyurRaksha
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#F6F1E7]/80">
              <li>
                <Link href="/shop" className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9AD79] text-xs">›</span> All Products &amp; Tonics
                </Link>
              </li>
              <li>
                <Link href="/category/health-packs" className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9AD79] text-xs">›</span> Therapeutic Health Packs
                </Link>
              </li>
              <li>
                <Link href="/concern/liver-wellness" className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9AD79] text-xs">›</span> Liver Care &amp; Detox
                </Link>
              </li>
              <li>
                <Link href="/concern/pain-joints" className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9AD79] text-xs">›</span> Joint Comfort &amp; Pain Relief
                </Link>
              </li>
              <li>
                <Link href="/concern/skin-dermatology" className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9AD79] text-xs">›</span> Skin Disorders &amp; Hair Wellness
                </Link>
              </li>
              <li>
                <Link href="/concern/digestive-health" className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9AD79] text-xs">›</span> Digestion &amp; Gut Balance
                </Link>
              </li>
              <li>
                <Link href="/product/purna-sakthi-tonic" className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9AD79] text-xs">›</span> Women&apos;s Health &amp; Hormonal Balance
                </Link>
              </li>
              <li>
                <Link href="/category/powder" className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9AD79] text-xs">›</span> Herbal Botanical Teas
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About Ayurraksha (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-serif text-lg sm:text-xl font-bold text-[#C9AD79] tracking-wide border-b border-[#235343] pb-2.5">
              About Ayurraksha
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#F6F1E7]/80">
              <li>
                <Link href="/about" className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9AD79] text-xs">›</span> Our Story &amp; Heritage
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9AD79] text-xs">›</span> Dr. Jegajothi Pandian
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9AD79] text-xs">›</span> Ayurvedic Journal &amp; Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9AD79] text-xs">›</span> Clinic Locations
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9AD79] text-xs">›</span> Contact Support
                </Link>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5 font-medium text-[#C9AD79]"
                >
                  <span className="text-xs">›</span> Free Doctor Consultation
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Care & Order Tracking (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-lg sm:text-xl font-bold text-[#C9AD79] tracking-wide border-b border-[#235343] pb-2.5">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#F6F1E7]/80">
              <li>
                <Link
                  href="/order-tracking"
                  className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5 font-bold text-[#F6F1E7]"
                >
                  <Truck size={14} className="text-[#C9AD79]" />
                  <span>Order Tracking</span>
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9AD79] text-xs">›</span> Shipping &amp; Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-returns" className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9AD79] text-xs">›</span> Return &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9AD79] text-xs">›</span> Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#C9AD79] transition-colors flex items-center gap-1.5">
                  <span className="text-[#C9AD79] text-xs">›</span> Privacy &amp; Data Policy
                </Link>
              </li>
            </ul>

            {/* Quick Order Tracking Action Callout */}
            <div className="pt-2">
              <Link
                href="/order-tracking"
                className="w-full inline-flex items-center justify-between px-4 py-3 rounded-xl bg-[#1F4E3E] hover:bg-[#25604C] text-[#F6F1E7] border border-[#2B6A55] text-xs font-semibold transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-[#C9AD79]" />
                  <span>Track Your Order</span>
                </div>
                <ArrowRight size={14} className="text-[#C9AD79] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Darker Green Bottom Section (#0E261E) */}
      <div className="bg-[#0E261E] text-[#F6F1E7]/70 border-t border-[#1A3D31] py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* Regulatory Disclaimer Box with High Readability */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#133228] border border-[#1E4537] text-sm leading-relaxed text-[#F6F1E7]/80">
            <div className="flex items-start gap-2.5">
              <ShieldCheck size={18} className="text-[#C9AD79] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#C9AD79] block mb-1 uppercase tracking-wider font-sans text-[11px]">
                  Ayurvedic Regulatory &amp; Health Disclaimer
                </strong>
                <p>
                  AyurRaksha products are classical Ayurvedic and herbal dietary supplements formulated to promote natural health, balance, and constitutional well-being. Statements regarding these herbal preparations have not been evaluated by any governmental food and drug administration to diagnose, treat, cure, or prevent any chronic disease. Please consult with a qualified Ayurvedic physician or medical doctor before beginning any new healthcare regimen, particularly if you are pregnant, lactating, taking prescription pharmaceutical medication, or managing a pre-existing medical condition.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods - Displayed strictly as icons with name */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 pt-1 border-b border-[#1A3D31] pb-6">
            <span className="text-xs uppercase tracking-widest text-[#C9AD79] font-bold">
              Verified Payment Methods
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#143329] border border-[#235343] text-xs font-medium text-[#F6F1E7]">
                <CreditCard size={14} className="text-[#C9AD79]" />
                <span>Visa</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#143329] border border-[#235343] text-xs font-medium text-[#F6F1E7]">
                <CreditCard size={14} className="text-[#C9AD79]" />
                <span>Mastercard</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#143329] border border-[#235343] text-xs font-medium text-[#F6F1E7]">
                <QrCode size={14} className="text-[#C9AD79]" />
                <span>UPI / QR</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#143329] border border-[#235343] text-xs font-medium text-[#F6F1E7]">
                <CreditCard size={14} className="text-[#C9AD79]" />
                <span>RuPay</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#143329] border border-[#235343] text-xs font-medium text-[#F6F1E7]">
                <Banknote size={14} className="text-[#C9AD79]" />
                <span>Cash on Delivery</span>
              </div>
            </div>
          </div>

          {/* Copyright & Legal Navigation Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F6F1E7]/60">
            <p className="text-center sm:text-left">
              &copy; {new Date().getFullYear()} AyurRaksha Online (VPrime Innovations). All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#F6F1E7]/70">
              <Link href="/shipping-policy" className="hover:text-[#C9AD79] transition-colors">
                Shipping Policy
              </Link>
              <span>•</span>
              <Link href="/refund-returns" className="hover:text-[#C9AD79] transition-colors">
                Refund &amp; Returns
              </Link>
              <span>•</span>
              <Link href="/terms-of-service" className="hover:text-[#C9AD79] transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
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
