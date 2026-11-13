'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, MessageSquare, ArrowRight, CheckCircle2, ChevronDown, Tag, Droplets, Footprints, Wind, HeartPulse, type LucideIcon } from 'lucide-react';
import { ComboHero } from '@/components/combo-builder/ComboHero';
import { ComboVideoSection } from '@/components/combo-builder/ComboVideoSection';
import { ComboConcernSelector } from '@/components/combo-builder/ComboConcernSelector';
import { ComboProductCard } from '@/components/combo-builder/ComboProductCard';
import { ComboCartSummary } from '@/components/combo-builder/ComboCartSummary';
import { ComboMobileStickyBar } from '@/components/combo-builder/ComboMobileStickyBar';
import { ComboProductDetailModal } from '@/components/combo-builder/ComboProductDetailModal';
import { ComboConsultModal } from '@/components/combo-builder/ComboConsultModal';
import { COMBO_BUILDERS } from '@/data/comboBuilderData';
import { ComboBuilderConfig, ComboProduct, MerchandisingCategory, ComboConcern } from '@/types/combo';
import { useCart } from '@/lib/cartContext';
import { getProductById } from '@/lib/products';
import { trackComboEvent } from '@/lib/comboAnalytics';

// Builder icon lookup (per slug)
const BUILDER_ICONS: Record<string, LucideIcon> = {
  'skin-care': Droplets,
  'varicose-veins': Footprints,
  'breath-easy': Wind,
  'cardiac-wellness': HeartPulse,
};

interface DynamicComboBuilderProps {
  config: ComboBuilderConfig;
  showVideoExplainer?: boolean;
}

export const DynamicComboBuilder: React.FC<DynamicComboBuilderProps> = ({
  config,
  showVideoExplainer = false,
}) => {
  const router = useRouter();
  const { addToCart } = useCart();

  // State: products loaded for this combo
  const [products, setProducts] = useState<ComboProduct[]>(config.products);
  const [comboCart, setComboCart] = useState<Record<number, number>>({});
  const [activeCategory, setActiveCategory] = useState<MerchandisingCategory>('All products');
  const [activeConcern, setActiveConcern] = useState<ComboConcern>(config.concerns[0] || {
    id: 'explore-all',
    name: 'Explore all products',
    shortDesc: 'Curate your routine freely.',
    description: 'Browse all products.',
    highlightedProductIds: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [detailProduct, setDetailProduct] = useState<ComboProduct | null>(null);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load saved combo cart from localStorage using the combo-specific storage key
  useEffect(() => {
    try {
      const saved = localStorage.getItem(config.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setComboCart(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
    setMounted(true);
  }, [config.storageKey]);

  // Pull live prices, MRP and stock from the CMS backend (cms.ayurrakshaonline.com)
  // so the builder never shows a stale bundled price. The static config values
  // render immediately and are replaced in place once the live fetch resolves;
  // on a fetch failure the bundled snapshot is kept.
  useEffect(() => {
    let cancelled = false;
    async function loadLivePrices() {
      try {
        const res = await fetch(`/api/combo-builder/products?slug=${encodeURIComponent(config.slug)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !Array.isArray(data?.products) || data.products.length === 0) return;
        // Merge live commerce fields into the catalog products by id.
        setProducts((prev) =>
          prev.map((p) => {
            const live = data.products.find((l: ComboProduct) => l.id === p.id);
            if (!live) return p;
            return {
              ...p,
              price: live.price ?? p.price,
              mrp: live.mrp ?? p.mrp,
              inStock: live.inStock ?? p.inStock,
              pricePending: live.pricePending ?? p.pricePending,
            };
          })
        );
      } catch {
        // Offline / transient failure: retain the bundled prices.
      }
    }
    loadLivePrices();
    return () => {
      cancelled = true;
    };
  }, [config.slug]);

  // Save combo cart to localStorage on change
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(config.storageKey, JSON.stringify(comboCart));
    } catch {
      // Ignore storage errors
    }
  }, [comboCart, mounted, config.storageKey]);

  // Reset active concern and category if config changes
  useEffect(() => {
    setProducts(config.products);
    setActiveCategory('All products');
    setActiveConcern(config.concerns[0]);
    setSearchQuery('');
  }, [config]);

  // Quantity modification
  const handleUpdateQuantity = (productId: number, delta: number) => {
    setComboCart((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, Math.min(20, current + delta));
      const updated = { ...prev };
      if (next === 0) {
        delete updated[productId];
      } else {
        updated[productId] = next;
      }
      return updated;
    });
  };

  const handleRemoveItem = (productId: number) => {
    setComboCart((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
    trackComboEvent({
      event: 'remove_item',
      product_id: productId,
      product_name: products.find((p) => p.id === productId)?.name || 'Product',
    });
  };

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      // If active concern is an emergency safeguard pathway, do not display routine products
      if (activeConcern.isEmergencyPathway) {
        return false;
      }

      // Symptom / Concern filter: If a specific concern is selected and has highlighted items
      if (
        activeConcern.id !== 'browse' &&
        activeConcern.id !== 'explore-all' &&
        activeConcern.highlightedProductIds.length > 0 &&
        !activeConcern.highlightedProductIds.includes(p.id)
      ) {
        return false;
      }

      // Category filter
      if (activeCategory !== 'All products' && p.category !== activeCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.shortDescription.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesTag = p.formatTag.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesTag) {
          return false;
        }
      }
      return true;
    });

    // Sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // featured: keep original order (flagship products first via a stable marker)
        sorted.sort((a, b) => {
          if (a.isFlagshipSkinCare && !b.isFlagshipSkinCare) return -1;
          if (!a.isFlagshipSkinCare && b.isFlagshipSkinCare) return 1;
          return 0;
        });
        break;
    }

    return sorted;
  }, [products, activeConcern, activeCategory, searchQuery, sortBy]);

  // Selected products for modal and checkout context
  const selectedProductsList = useMemo(() => {
    return products.filter((p) => (comboCart[p.id] || 0) > 0);
  }, [products, comboCart]);

  // Handoff to existing store checkout
  const handleProceedToCheckout = () => {
    const itemsToAdd = selectedProductsList.map((p) => ({
      product: p,
      quantity: comboCart[p.id],
    }));

    if (itemsToAdd.length === 0) return;

    // Track analytics events
    const totalAmount = itemsToAdd.reduce(
      (sum, item) => sum + (item.product.price || 0) * item.quantity,
      0
    );

    trackComboEvent({
      event: 'add_combo_to_cart',
      item_count: itemsToAdd.reduce((sum, item) => sum + item.quantity, 0),
      total_amount: totalAmount,
      items: itemsToAdd.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
      })),
    });

    trackComboEvent({
      event: 'begin_checkout',
      item_count: itemsToAdd.reduce((sum, item) => sum + item.quantity, 0),
      total_amount: totalAmount,
    });

    // Add each selected item to the global CartContext as a Combo Builder item
    itemsToAdd.forEach(({ product, quantity }) => {
      const canonical = getProductById(product.id);
      if (canonical && product.price !== null) {
        addToCart(canonical, quantity, undefined, undefined, undefined, 1, true);
      }
    });

    // Seamlessly navigate to checkout
    router.push('/checkout');
  };

  const comboUrl = `https://www.ayurrakshaonline.com/combo-builder/${config.slug}`;

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-[#26352D] pb-32 lg:pb-16 font-sans">
      {/* 1. Dynamic Hero Section */}
      <ComboHero
        tagline={config.heroTagline}
        title={config.heroTitle}
        highlight={config.heroHighlight}
        description={config.heroDescription}
        badge={config.heroBadge}
        stepGuide={config.stepGuide}
      />

      {/* 2. Horizontal Combo Switcher Strip (numbered icon chips) */}
      <section className="bg-white border-b border-[#e4e7df] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0 scrollbar-none">
            {COMBO_BUILDERS.map((builder, index) => {
              const isCurrent = builder.slug === config.slug;
              const Icon = BUILDER_ICONS[builder.slug] || Droplets;
              return (
                <Link
                  key={builder.id}
                  href={builder.href}
                  className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-[13px] font-bold transition-all whitespace-nowrap border ${
                    isCurrent
                      ? 'bg-[#18372b] text-white border-[#18372b] shadow-xs'
                      : 'bg-white text-[#3c5445] hover:bg-stone-50 border-[#dbe4da]'
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-extrabold ${
                      isCurrent ? 'bg-white/20 text-white' : 'bg-[#eef3ec] text-[#2e6845]'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon size={14} className={isCurrent ? 'text-white' : 'text-[#2e6845]'} />
                    {builder.shortName}
                  </span>
                  {builder.popular && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wide ${
                        isCurrent ? 'bg-white/20 text-white' : 'bg-[#eaf6ee] text-[#2e6845]'
                      }`}
                    >
                      Most Popular
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Main Interactive Product Selection directly after Hero */}
      <section id="builder-catalog" className="pt-3 sm:pt-4 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-3 pb-2 border-b border-[#e4e7df]">
            <div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-[#8a6020] block mb-0.5">
                CURATE YOUR ROUTINE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#18372b] tracking-[-0.03em]">
                {config.slug === 'skin-care' ? 'What Does Your Skin Need?' : config.name}
              </h2>
              <p className="text-xs text-[#283830] mt-0.5 leading-relaxed">
                {config.catalogSubtitle}
              </p>
            </div>

            <div className="flex flex-col gap-1.5 self-start sm:self-auto">
              <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#3c5445] bg-white px-2.5 py-1 rounded-full border border-[#d8e4da] shadow-xs">
                {config.catalogCountBadge}
              </div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-[#2f7d54] px-2.5 py-1 rounded-full shadow-xs">
                3 Simple Steps
              </div>
            </div>
          </div>

          {/* Builder Layout: Left Browsing + Right Sticky Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Products Workspace (Span 8 on desktop) */}
            <main className="lg:col-span-8 space-y-3.5 sm:space-y-4">
              {/* Optional Concern-based Discovery Selector */}
              <ComboConcernSelector
                activeConcernId={activeConcern.id}
                onSelectConcern={setActiveConcern}
                onOpenConsult={() => setIsConsultOpen(true)}
                concerns={config.concerns}
              />

              {/* Catalog sub-header + compact control row */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-[15px] sm:text-base font-extrabold text-[#18372b]">
                    {activeCategory === 'All products' ? 'Browse All' : activeCategory}
                  </h3>
                  <span className="text-[10.5px] text-[#5c6f63]">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white p-2.5 sm:p-3 rounded-[14px] border border-[#e4e7df] shadow-xs">
                  {/* Category dropdown */}
                  <div className="relative">
                    <select
                      value={activeCategory}
                      onChange={(e) => setActiveCategory(e.target.value as MerchandisingCategory)}
                      aria-label="Filter by category"
                      className="appearance-none pl-3 pr-8 py-1.5 rounded-[9px] bg-stone-50 border border-[#dce5da] text-xs font-extrabold text-[#18372b] focus:bg-white focus:outline-none focus:border-[#244e3b] cursor-pointer"
                    >
                      {config.categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat === 'All products' ? 'All Products' : cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={13}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                    />
                  </div>

                  {/* Sort dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      aria-label="Sort products"
                      className="appearance-none pl-3 pr-8 py-1.5 rounded-[9px] bg-stone-50 border border-[#dce5da] text-xs font-extrabold text-[#18372b] focus:bg-white focus:outline-none focus:border-[#244e3b] cursor-pointer"
                    >
                      <option value="featured">Sort: Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                    <ChevronDown
                      size={13}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                    />
                  </div>

                  {/* Volume-discount badge */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] bg-[#faf6ea] border border-[#e8dcc0] text-[11px] font-extrabold text-[#8a6020]">
                    <Tag size={13} />
                    <span>10-15% Volume Discounts</span>
                  </span>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {activeConcern.isEmergencyPathway ? (
                  <div className="col-span-2 py-12 px-6 text-center bg-rose-50 rounded-2xl border border-rose-200 space-y-3">
                    <p className="text-sm font-bold text-rose-900 max-w-lg mx-auto">
                      {activeConcern.emergencyNotice ||
                        'Routine products are withheld for this clinical pathway. Please seek qualified medical care.'}
                    </p>
                    <div className="pt-2 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsConsultOpen(true)}
                        className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs"
                      >
                        Book Free Physician Guidance
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveConcern(config.concerns[0])}
                        className="px-4 py-2.5 rounded-xl bg-white text-charcoal border border-stone-300 font-bold text-xs"
                      >
                        Reset to All Products
                      </button>
                    </div>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="col-span-2 py-16 text-center bg-white rounded-2xl border border-stone-200">
                    <p className="text-sm font-semibold text-stone-700">
                      No products match your search or category filter.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory('All products');
                        setSearchQuery('');
                      }}
                      className="mt-3 text-xs font-bold text-[#18372b] underline"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  filteredProducts.map((product) => {
                    const isHighlighted = activeConcern.highlightedProductIds.includes(product.id);
                    const isExcluded = activeConcern.excludedProductIds?.includes(product.id);

                    return (
                      <ComboProductCard
                        key={product.id}
                        product={product}
                        quantityInCombo={comboCart[product.id] || 0}
                        onUpdateQuantity={handleUpdateQuantity}
                        onViewDetails={(p) => setDetailProduct(p)}
                        isHighlighted={isHighlighted}
                        isExcluded={isExcluded}
                      />
                    );
                  })
                )}
              </div>

              {/* Optional Video Guide (e.g. Skin Care Master Explainer) */}
              {showVideoExplainer && <ComboVideoSection />}
            </main>

            {/* Right Column: Desktop Sticky Cart Summary (Span 4) */}
            <div className="hidden lg:block lg:col-span-4 sticky top-24">
              <ComboCartSummary
                comboCart={comboCart}
                products={products}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onProceedToCheckout={handleProceedToCheckout}
                onOpenConsult={() => setIsConsultOpen(true)}
                comboName={config.name}
                comboUrl={comboUrl}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Compact Horizontal Doctor Consultation Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        <div className="relative overflow-hidden bg-[#123b2d] text-white rounded-[18px] p-4 sm:p-6 lg:p-7 shadow-lg">
          {/* Subtle ambient decoration */}
          <div
            className="pointer-events-none absolute -right-20 -bottom-36 w-80 h-80 rounded-full border border-[#f4e2b5]/15"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">
            {/* Left: Concise Text */}
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#e2bf88] block">
                NEED EXPERT GUIDANCE?
              </span>
              <h3 className="font-serif text-xl sm:text-2xl lg:text-[26px] font-normal leading-tight text-white">
                Not Sure What to Choose? We&apos;re Here to Help.
              </h3>
              <p className="text-xs sm:text-[13px] text-[#d1e2d5] leading-relaxed">
                Get a FREE consultation with a VPrime Ayurvedic doctor to find products suited to your skin concerns.
              </p>
              <p className="text-[11px] text-[#9fc0a9] pt-0.5">
                Consultation is optional. You&apos;re always in control of your combo.
              </p>
            </div>

            {/* Right: Muted-Gold CTA Button */}
            <div className="flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsConsultOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-[11px] bg-[#e5b36d] hover:bg-[#d8a459] text-[#183d2d] font-extrabold text-xs sm:text-[13px] shadow-md transition-all active:scale-[0.98] whitespace-nowrap"
              >
                <span>Book My Free Consultation →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Mobile Sticky Bottom Bar and Sheet */}
      <ComboMobileStickyBar
        comboCart={comboCart}
        products={products}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
        onOpenConsult={() => setIsConsultOpen(true)}
        comboName={config.name}
        comboUrl={comboUrl}
      />

      {/* 6. Modals: Product Details Drawer & Consultation Modal */}
      <ComboProductDetailModal
        product={detailProduct}
        quantityInCombo={detailProduct ? comboCart[detailProduct.id] || 0 : 0}
        onUpdateQuantity={handleUpdateQuantity}
        onClose={() => setDetailProduct(null)}
        onOpenConsult={() => setIsConsultOpen(true)}
      />

      <ComboConsultModal
        isOpen={isConsultOpen}
        onClose={() => setIsConsultOpen(false)}
        selectedConcernName={activeConcern.name}
        selectedProducts={selectedProductsList}
        consultationFocus={config.consultationFocus}
        consultationHeading="Free Ayurvedic Doctor Consultation"
        consultationSubtitle={config.consultationText}
      />
    </div>
  );
};
