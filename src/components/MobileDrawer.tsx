'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronDown, Phone, MessageSquare, ShieldCheck, Heart } from 'lucide-react';
import { HEALTH_CONCERNS, PRODUCT_FORMATS, SITE_CONFIG } from '@/data/siteConfig';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const [concernsOpen, setConcernsOpen] = useState(true);
  const [formatsOpen, setFormatsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Esc key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 flex justify-start bg-forest-dark/60 backdrop-blur-xs transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-left duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-ivory">
          <div>
            <span className="font-serif text-lg font-bold text-forest tracking-tight">Ayurraksha</span>
            <p className="text-[10px] text-charcoal-muted uppercase tracking-wider">Ayurvedic Wellness</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-1.5 text-stone-400 hover:text-charcoal hover:bg-stone-200/60 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-grow overflow-y-auto px-5 py-4 space-y-4">
          {/* Main Links */}
          <div className="space-y-1">
            <Link
              href="/shop"
              onClick={onClose}
              className="flex items-center justify-between py-2 text-sm font-semibold text-charcoal hover:text-botanical transition-colors"
            >
              <span>Shop All Products</span>
              <span className="text-[11px] font-bold text-botanical bg-sage px-2 py-0.5 rounded-badge">44</span>
            </Link>
            <Link
              href="/shop?sort=bestseller"
              onClick={onClose}
              className="flex items-center py-2 text-sm font-semibold text-charcoal hover:text-botanical transition-colors"
            >
              <span>Bestsellers</span>
            </Link>
            <Link
              href="/category/health-packs"
              onClick={onClose}
              className="flex items-center py-2 text-sm font-semibold text-charcoal hover:text-botanical transition-colors"
            >
              <span>Combos &amp; Health Packs</span>
            </Link>
          </div>

          <hr className="border-stone-100" />

          {/* Shop by Concern Accordion */}
          <div>
            <button
              onClick={() => setConcernsOpen(!concernsOpen)}
              className="flex items-center justify-between w-full py-1 text-xs font-bold text-forest uppercase tracking-wider"
            >
              <span>Shop by Health Concern</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${concernsOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {concernsOpen && (
              <div className="mt-2 pl-2 space-y-1.5 border-l-2 border-sage">
                {HEALTH_CONCERNS.map((concern) => (
                  <Link
                    key={concern.id}
                    href={`/concern/${concern.slug}`}
                    onClick={onClose}
                    className="block py-1.5 text-xs text-charcoal hover:text-botanical font-medium transition-colors"
                  >
                    {concern.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Shop by Format Accordion */}
          <div>
            <button
              onClick={() => setFormatsOpen(!formatsOpen)}
              className="flex items-center justify-between w-full py-1 text-xs font-bold text-forest uppercase tracking-wider"
            >
              <span>Shop by Format</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${formatsOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {formatsOpen && (
              <div className="mt-2 pl-2 space-y-1.5 border-l-2 border-sage">
                {PRODUCT_FORMATS.filter((f) => f.slug !== 'all').map((format) => (
                  <Link
                    key={format.slug}
                    href={`/category/${format.slug}`}
                    onClick={onClose}
                    className="block py-1.5 text-xs text-charcoal hover:text-botanical font-medium transition-colors"
                  >
                    {format.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <hr className="border-stone-100" />

          {/* Institutional Links */}
          <div className="space-y-2 text-xs font-medium text-charcoal">
            <Link href="/about" onClick={onClose} className="block py-1 hover:text-botanical transition-colors">
              Our Story &amp; Dr. Jegajothi Pandian
            </Link>
            <Link href="/blog" onClick={onClose} className="block py-1 hover:text-botanical transition-colors">
              Clinical Journal &amp; Stories
            </Link>
            <Link href="/contact" onClick={onClose} className="block py-1 hover:text-botanical transition-colors">
              Customer Support &amp; Locations
            </Link>
          </div>
        </div>

        {/* WhatsApp & Contact Footer */}
        <div className="p-4 border-t border-stone-200 bg-sage-light">
          <a
            href={SITE_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-button text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
          >
            <MessageSquare size={16} />
            <span>Consult on WhatsApp</span>
          </a>
          <div className="mt-2.5 flex items-center justify-center gap-2 text-[11px] text-charcoal-muted">
            <Phone size={12} className="text-botanical" />
            <span>{SITE_CONFIG.displayPhone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
