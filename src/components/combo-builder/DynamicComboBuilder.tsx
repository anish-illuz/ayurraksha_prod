'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
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
    return products.filter((p) => {
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
  }, [products, activeConcern, activeCategory, searchQuery]);

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
        onOpenConsult={() => setIsConsultOpen(true)}
        tagline={config.heroTagline}
        title={config.heroTitle}
        highlight={config.heroHighlight}
        description={config.heroDescription}
        badge={config.heroBadge}
        stepGuide={config.stepGuide}
      />

      {/* 2. Horizontal Combo Switcher Strip (Quick cross-navigation between all 4 builders) */}
      <section className="bg-white border-b border-[#e4e7df] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-forest/70 whitespace-nowrap">
              Explore Combo Builders:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
              {COMBO_BUILDERS.map((builder) => {
                const isCurrent = builder.slug === config.slug;
                return (
                  <Link
                    key={builder.id}
                    href={builder.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      isCurrent
                        ? 'bg-[#18372b] text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200/80 text-charcoal'
                    }`}
                  >
                    <span>{builder.name}</span>
                    <span
                      className={`text-[9.5px] px-1.5 py-0.2 rounded-full ${
                        isCurrent
                          ? 'bg-white/20 text-white'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {builder.badge}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Interactive Product Selection directly after Hero */}
      <section id="builder-catalog" className="pt-6 sm:pt-8 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-4 border-b border-[#e4e7df]">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#8a6020] block mb-1">
                CURATE YOUR ROUTINE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#18372b] tracking-[-0.035em]">
                {config.name}
              </h2>
              <p className="text-xs sm:text-[13px] text-[#283830] mt-0.5 leading-relaxed">
                {config.catalogSubtitle}
              </p>
            </div>

            <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#3c5445] bg-white px-3 py-1.5 rounded-full border border-[#d8e4da] self-start sm:self-auto shadow-xs">
              {config.catalogCountBadge}
            </div>
          </div>

          {/* Builder Layout: Left Browsing + Right Sticky Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Products Workspace (Span 8 on desktop) */}
            <main className="lg:col-span-8 space-y-6">
              {/* Optional Concern-based Discovery Selector */}
              <ComboConcernSelector
                activeConcernId={activeConcern.id}
                onSelectConcern={setActiveConcern}
                onOpenConsult={() => setIsConsultOpen(true)}
                concerns={config.concerns}
              />

              {/* Navigation Tools: Categories and Search Filter */}
              <div className="space-y-3">
                {activeConcern.id !== 'browse' && activeConcern.id !== 'explore-all' && (
                  <div className="flex items-center justify-between bg-[#FAF8EE] border border-[#EADBBD] px-4 py-2.5 rounded-[12px] text-xs">
                    <span className="font-bold text-[#18372b]">
                      {activeConcern.isEmergencyPathway
                        ? `Emergency notice active for ${activeConcern.name}`
                        : `Showing ${filteredProducts.length} ${
                            filteredProducts.length === 1 ? 'formulation' : 'formulations'
                          } approved for ${activeConcern.name}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveConcern(config.concerns[0])}
                      className="text-[#8a6020] hover:text-[#18372b] font-extrabold underline transition-colors"
                    >
                      Show all {products.length} products ↗
                    </button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-[16px] border border-[#e4e7df] shadow-xs">
                  {/* Horizontal Category Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {config.categories.map((cat) => {
                      const isActive = activeCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setActiveCategory(cat)}
                          className={`px-3 py-1.5 rounded-[10px] text-xs font-extrabold whitespace-nowrap transition-colors ${
                            isActive
                              ? 'bg-[#244e3b] text-white shadow-xs border border-[#244e3b]'
                              : 'text-[#3c5445] hover:text-[#18372b] hover:bg-[#eef3ec] border border-transparent'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Bar */}
                  <div className="relative min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Search ${products.length} products...`}
                      aria-label="Search products"
                      className="w-full pl-8 pr-3 py-1.5 rounded-[9px] bg-stone-50 border border-[#dce5da] text-xs text-[#18372b] placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#244e3b]"
                    />
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* 4. Single Elegant Doctor Consultation Strip before footer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="relative overflow-hidden bg-[#123b2d] text-white rounded-[23px] p-8 sm:p-12 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#e2bf88] block">
              WE'RE HERE TO GUIDE YOU
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
              {config.consultationHeading}
            </h3>
            <p className="text-xs sm:text-sm text-[#d1e2d5] leading-[1.7]">
              {config.consultationText}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsConsultOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[11px] bg-[#e5b36d] hover:bg-[#d8a459] text-[#183d2d] font-extrabold text-xs sm:text-[13px] shadow-md transition-all active:scale-[0.98]"
              >
                <MessageSquare size={16} />
                <span>Book My Free Doctor Consultation ↗</span>
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
