'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, ShoppingBag, ChevronDown } from 'lucide-react';
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between relative">
            {/* Left: Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileOpen(true)}
                aria-label="Open mobile navigation menu"
                className="p-2 text-charcoal hover:text-botanical hover:bg-stone-100 rounded-lg transition-colors"
              >
                <Menu size={22} />
              </button>
            </div>

            {/* Brand Logo - Centered on Mobile, Left-aligned on Desktop */}
            <div className="flex items-center justify-center lg:justify-start flex-1 lg:flex-initial">
              <Link href="/" className="flex items-center group py-1" aria-label="Ayurraksha Home">
                <div className="relative h-10 sm:h-12 w-36 sm:w-44 transition-transform duration-200 group-hover:scale-[1.02]">
                  <Image
                    src="/images/logo.png"
                    alt="Ayurraksha"
                    fill
                    priority
                    sizes="(max-width: 640px) 144px, 176px"
                    className="object-contain object-center lg:object-left"
                  />
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[15px] font-semibold text-charcoal">
              <Link
                href="/shop"
                className="relative py-2 hover:text-primary transition-colors after:absolute after:bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                Shop
              </Link>

              {/* Mega Dropdown: Shop by Concern */}
              <div
                className="relative group py-2"
                onMouseEnter={() => setActiveDropdown('concern')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className="flex items-center gap-1.5 hover:text-primary transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-primary after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:origin-left"
                  aria-expanded={activeDropdown === 'concern'}
                >
                  <span>Shop by Concern</span>
                  <ChevronDown size={15} className="text-stone-400 group-hover:text-primary transition-transform group-hover:rotate-180" />
                </button>

                {activeDropdown === 'concern' && (
                  <div className="absolute top-full -left-20 w-[680px] bg-white rounded-2xl shadow-xl border border-stone-200/80 p-6 animate-in fade-in-50 duration-150 grid grid-cols-2 gap-4">
                    {HEALTH_CONCERNS.map((c) => (
                      <Link
                        key={c.id}
                        href={`/concern/${c.slug}`}
                        className="flex flex-col p-3 rounded-xl hover:bg-ivory transition-colors group/item"
                      >
                        <span className="text-sm font-bold text-forest group-hover/item:text-primary transition-colors">
                          {c.name}
                        </span>
                        <span className="text-xs text-charcoal-muted mt-1 line-clamp-1">
                          {c.description}
                        </span>
                      </Link>
                    ))}
                    <div className="col-span-2 pt-3 border-t border-stone-100 flex items-center justify-between text-sm">
                      <span className="text-charcoal-muted text-xs">Doctor-formulated Ayurvedic wellness • Chennai, India</span>
                      <Link href="/shop" className="text-primary font-bold hover:underline">
                        View All Formulations →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/shop?sort=bestseller"
                className="relative py-2 hover:text-primary transition-colors after:absolute after:bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                Bestsellers
              </Link>

              <Link
                href="/category/health-packs"
                className="relative py-2 hover:text-primary transition-colors after:absolute after:bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                Wellness Packs
              </Link>

              <Link
                href="/about"
                className="relative py-2 hover:text-primary transition-colors after:absolute after:bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                Our Story
              </Link>

              <Link
                href="/blog"
                className="relative py-2 hover:text-primary transition-colors after:absolute after:bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                Blog
              </Link>
            </nav>

            {/* Right: Search & Cart Trigger */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search store"
                className="p-2.5 text-charcoal hover:text-primary hover:bg-stone-100 rounded-full transition-colors"
              >
                <Search size={21} />
              </button>

              <button
                onClick={openCart}
                aria-label={`Open cart with ${itemCount} items`}
                className="relative p-2.5 text-charcoal hover:text-primary hover:bg-stone-100 rounded-full transition-colors"
              >
                <ShoppingBag size={22} className="stroke-[1.75]" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold bg-primary text-white flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
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
