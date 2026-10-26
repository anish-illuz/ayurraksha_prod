'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Search, ShoppingBag, ChevronDown, Leaf } from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { SearchModal } from './SearchModal';
import { CartDrawer } from './CartDrawer';
import { MobileDrawer } from './MobileDrawer';
import { useCart } from '@/lib/cartContext';
import { HEALTH_CONCERNS, SITE_CONFIG } from '@/data/siteConfig';

export const Header: React.FC = () => {
  const { itemCount, openCart } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-200">
        <AnnouncementBar />

        {/* Main Navbar */}
        <div
          className={`w-full bg-white/95 backdrop-blur-md transition-all duration-200 border-b ${
            isScrolled ? 'border-stone-200 shadow-xs' : 'border-stone-100'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
            {/* Left: Mobile Menu & Desktop Brand */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileOpen(true)}
                aria-label="Open mobile navigation menu"
                className="lg:hidden p-2 text-charcoal hover:text-botanical hover:bg-stone-100 rounded-lg transition-colors"
              >
                <Menu size={22} />
              </button>

              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-full bg-forest text-ivory flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs">
                  <Leaf size={18} className="text-emerald-300" />
                </div>
                <div>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-forest tracking-tight block leading-none">
                    Ayurraksha
                  </span>
                  <span className="text-[10px] text-charcoal-muted tracking-widest uppercase block mt-0.5">
                    Ayurvedic Wellness
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-charcoal">
              <Link
                href="/shop"
                className="hover:text-botanical transition-colors py-2"
              >
                Shop All
              </Link>

              {/* Mega Dropdown: Shop by Concern */}
              <div
                className="relative group py-2"
                onMouseEnter={() => setActiveDropdown('concern')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className="flex items-center gap-1 hover:text-botanical transition-colors"
                  aria-expanded={activeDropdown === 'concern'}
                >
                  <span>Shop by Concern</span>
                  <ChevronDown size={14} className="text-stone-400 group-hover:text-botanical transition-transform group-hover:rotate-180" />
                </button>

                {activeDropdown === 'concern' && (
                  <div className="absolute top-full -left-20 w-[640px] bg-white rounded-card shadow-dropdown border border-border-botanical p-6 animate-in fade-in-50 duration-150 grid grid-cols-2 gap-4">
                    {HEALTH_CONCERNS.map((c) => (
                      <Link
                        key={c.id}
                        href={`/concern/${c.slug}`}
                        className="flex flex-col p-3 rounded-lg hover:bg-ivory transition-colors group/item"
                      >
                        <span className="text-xs font-bold text-forest group-hover/item:text-botanical transition-colors">
                          {c.name}
                        </span>
                        <span className="text-[11px] text-charcoal-muted mt-0.5 line-clamp-1">
                          {c.description}
                        </span>
                      </Link>
                    ))}
                    <div className="col-span-2 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="text-charcoal-muted">Formulated in Chennai under clinical guidance</span>
                      <Link href="/shop" className="text-forest font-semibold hover:text-botanical">
                        View Entire Catalogue (44) →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/shop?sort=bestseller"
                className="hover:text-botanical transition-colors py-2"
              >
                Bestsellers
              </Link>

              <Link
                href="/category/health-packs"
                className="hover:text-botanical transition-colors py-2"
              >
                Combos &amp; Packs
              </Link>

              <Link
                href="/about"
                className="hover:text-botanical transition-colors py-2"
              >
                Our Story
              </Link>

              <Link
                href="/blog"
                className="hover:text-botanical transition-colors py-2"
              >
                Journal
              </Link>
            </nav>

            {/* Right: Search & Cart Trigger */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search store"
                className="flex items-center gap-2 p-2 text-charcoal hover:text-botanical hover:bg-stone-100 rounded-lg transition-colors"
              >
                <Search size={20} />
                <span className="hidden sm:inline text-xs text-charcoal-muted">Search</span>
              </button>

              <button
                onClick={openCart}
                aria-label={`Open cart with ${itemCount} items`}
                className="relative flex items-center gap-2 py-2 px-3 bg-forest hover:bg-forest-light text-white rounded-button transition-all shadow-xs"
              >
                <ShoppingBag size={18} />
                <span className="hidden sm:inline text-xs font-semibold">Cart</span>
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[11px] font-bold bg-emerald-400 text-forest">
                  {itemCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modals and Drawers */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer />
      <MobileDrawer isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
};
