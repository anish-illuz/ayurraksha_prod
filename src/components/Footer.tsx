import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, MessageSquare, ShieldCheck } from 'lucide-react';
import { HEALTH_CONCERNS, SITE_CONFIG } from '@/data/siteConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-dark text-stone-300 pt-16 pb-12 border-t border-forest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group bg-white/95 rounded-xl px-3 py-2 shadow-xs transition-transform hover:scale-[1.02]" aria-label="Ayurraksha Home">
              <div className="relative h-10 w-36">
                <Image
                  src="/images/logo.png"
                  alt="Ayurraksha"
                  fill
                  sizes="144px"
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm">
              Rooted in classical Ayurvedic pharmacology and backed by contemporary research. An initiative of VPrime Innovations, dedicated to natural vitality, metabolic balance, and holistic healing.
            </p>
            <div className="pt-2">
              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-button text-xs font-semibold bg-primary hover:bg-primary-dark text-white transition-colors"
              >
                <MessageSquare size={14} />
                <span>Chat with Ayurvedic Consultant</span>
              </a>
            </div>
          </div>

          {/* Shop by Concern */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Health Concerns
            </h4>
            <ul className="space-y-2 text-xs">
              {HEALTH_CONCERNS.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/concern/${c.slug}`}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/shop" className="text-emerald-400 font-semibold hover:underline">
                  All 44 Formulations →
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shipping-policy" className="hover:text-emerald-400 transition-colors">
                  Shipping &amp; Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-returns" className="hover:text-emerald-400 transition-colors">
                  Refund &amp; Returns Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-emerald-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About Dr. Jegajothi Pandian
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-emerald-400 transition-colors">
                  Clinical Case Studies &amp; Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Contact &amp; Clinic
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  {SITE_CONFIG.address.street}, {SITE_CONFIG.address.area}, {SITE_CONFIG.address.city} {SITE_CONFIG.address.postalCode}, {SITE_CONFIG.address.state}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-emerald-400 flex-shrink-0" />
                <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-white transition-colors">
                  {SITE_CONFIG.displayPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-emerald-400 flex-shrink-0" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-white transition-colors">
                  {SITE_CONFIG.email}
                </a>
              </div>
              <div className="pt-2 text-[11px] text-stone-500">
                Mon – Sat: 9:30 AM – 6:30 PM IST
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="py-6 border-b border-stone-800 text-[11px] text-stone-400 leading-relaxed">
          <p>
            <strong className="text-stone-300">Disclaimer:</strong> Ayurraksha products are Ayurvedic and herbal dietary supplements formulated to promote natural health, balance, and well-being. Statements regarding dietary supplements have not been evaluated by any governmental drug administration to diagnose, treat, cure, or prevent any chronic disease. Please consult with a qualified Ayurvedic physician or medical doctor before beginning any new healthcare regimen, particularly if pregnant, lactating, taking prescription medication, or suffering from a pre-existing medical condition.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Ayurraksha Online (VPrime Innovations). All rights reserved.
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <span className="px-2 py-0.5 rounded bg-stone-800 border border-stone-700">Razorpay Secured</span>
            <span className="px-2 py-0.5 rounded bg-stone-800 border border-stone-700">UPI / RuPay</span>
            <span className="px-2 py-0.5 rounded bg-stone-800 border border-stone-700">Visa / Mastercard</span>
            <span className="px-2 py-0.5 rounded bg-stone-800 border border-stone-700">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
