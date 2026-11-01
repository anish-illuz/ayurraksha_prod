'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles } from 'lucide-react';
import { ComboHero } from '@/components/combo-builder/ComboHero';
import { ComboHowItWorks } from '@/components/combo-builder/ComboHowItWorks';
import { ComboVideoSection } from '@/components/combo-builder/ComboVideoSection';
import { ComboConsultationStrip } from '@/components/combo-builder/ComboConsultationStrip';
import { ComboConcernSelector } from '@/components/combo-builder/ComboConcernSelector';
import { ComboProductCard } from '@/components/combo-builder/ComboProductCard';
import { ComboCartSummary } from '@/components/combo-builder/ComboCartSummary';
import { ComboMobileStickyBar } from '@/components/combo-builder/ComboMobileStickyBar';
import { ComboProductDetailModal } from '@/components/combo-builder/ComboProductDetailModal';
import { ComboConsultModal } from '@/components/combo-builder/ComboConsultModal';
import { MASTER_COMBO_PRODUCTS, MERCHANDISING_CATEGORIES, SKIN_CONCERNS } from '@/data/comboBuilderData';
import { ComboProduct, MerchandisingCategory, SkinConcern } from '@/types/combo';
import { useCart } from '@/lib/cartContext';
import { getProductById } from '@/lib/products';
import { trackComboEvent } from '@/lib/comboAnalytics';

const STORAGE_KEY = 'ayurraksha_combo_selection_v2';

export default function ComboBuilderPage() {
  const router = useRouter();
  const { addToCart } = useCart();

  // State: Exclusively the 13 approved products
  const [products, setProducts] = useState<ComboProduct[]>(MASTER_COMBO_PRODUCTS);
  const [comboCart, setComboCart] = useState<Record<number, number>>({});
  const [activeCategory, setActiveCategory] = useState<MerchandisingCategory>('All products');
  const [activeConcern, setActiveConcern] = useState<SkinConcern>(SKIN_CONCERNS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [detailProduct, setDetailProduct] = useState<ComboProduct | null>(null);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load saved combo cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
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
  }, []);

  // Save combo cart to localStorage on change
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comboCart));
    } catch {
      // Ignore
    }
  }, [comboCart, mounted]);

  // Fetch live product updates directly from WooCommerce server API layer
  useEffect(() => {
    fetch('/api/combo-builder/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length === 13) {
          setProducts(data.products);
        }
      })
      .catch((err) => {
        console.warn('Using master catalog fallback:', err);
      });
  }, []);

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

  // Filtered products calculation (strictly among the 13 approved products)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
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
  }, [products, activeCategory, searchQuery]);

  // Selected products for modal context
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

    // Add each selected item to the global CartContext
    itemsToAdd.forEach(({ product, quantity }) => {
      const canonical = getProductById(product.id);
      if (canonical && product.price !== null) {
        addToCart(canonical, quantity);
      }
    });

    // Seamlessly navigate to checkout
    router.push('/checkout');
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-[#26352D] pb-32 lg:pb-16 font-sans">
      {/* 1. Hero Section */}
      <ComboHero onOpenConsult={() => setIsConsultOpen(true)} />

      {/* 2. 3-Step Explanation */}
      <ComboHowItWorks />

      {/* 3. Educational Video Section */}
      <ComboVideoSection onOpenConsult={() => setIsConsultOpen(true)} />

      {/* 4. Consultation CTA #1 (After explainer) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ComboConsultationStrip
          placement="after_explainer"
          onOpenConsult={() => setIsConsultOpen(true)}
        />
      </div>

      {/* 5. Main Interactive Builder Workspace */}
      <section id="builder-catalog" className="pt-6 sm:pt-10 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#ab8345] block mb-1">
                Curate Your Routine
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-normal text-[#123b2d]">
                Build Your Skin Care Combo
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Browse, compare and compose your individual combination — with live WordPress pricing.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700">
              <Sparkles size={13} className="text-[#b59661]" />
              <span>13 Approved Formulations • 5 Merchandising Categories</span>
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
              />

              {/* Navigation Tools: Categories and Search Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
                {/* Horizontal Category Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                  {MERCHANDISING_CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                          isActive
                            ? 'bg-[#18372b] text-white shadow-xs'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
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
                    placeholder="Search 13 formulations..."
                    aria-label="Search products"
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:border-[#18372b]"
                  />
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {filteredProducts.length === 0 ? (
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

              {/* Consultation Strip #2 (Inside builder) */}
              <ComboConsultationStrip
                placement="inside_builder"
                onOpenConsult={() => setIsConsultOpen(true)}
              />
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
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Final Consultation Invitation #3 (Before checkout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ComboConsultationStrip
          placement="before_checkout"
          onOpenConsult={() => setIsConsultOpen(true)}
        />
      </div>

      {/* 7. Mobile Sticky Bottom Bar and Sheet */}
      <ComboMobileStickyBar
        comboCart={comboCart}
        products={products}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
        onOpenConsult={() => setIsConsultOpen(true)}
      />

      {/* 8. Modals: Product Details Drawer & Consultation Modal */}
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
      />
    </div>
  );
}
