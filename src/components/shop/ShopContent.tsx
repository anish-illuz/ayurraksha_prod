'use client';

import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, X, ChevronDown, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/ProductCard';
import { HEALTH_CONCERNS, PRODUCT_FORMATS } from '@/data/siteConfig';

interface ShopContentProps {
  initialProducts: Product[];
  title: string;
  description: string;
  initialConcern?: string;
  initialCategory?: string;
}

export const ShopContent: React.FC<ShopContentProps> = ({
  initialProducts,
  title,
  description,
  initialConcern,
  initialCategory,
}) => {
  const [selectedConcern, setSelectedConcern] = useState<string>(initialConcern || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter and Sort Pipeline
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by Concern
    if (selectedConcern !== 'all') {
      const concernObj = HEALTH_CONCERNS.find((c) => c.slug === selectedConcern);
      const concernName = concernObj ? concernObj.name.toLowerCase() : selectedConcern.replace(/-/g, ' ');
      result = result.filter((p) =>
        p.healthConcerns.some((c) => c.toLowerCase().includes(concernName) || concernName.includes(c.toLowerCase()))
      );
    }

    // Filter by Format Category
    if (selectedCategory !== 'all') {
      result = result.filter((p) =>
        p.categorySlugs.includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by Price Range
    if (selectedPriceRange === 'under-500') {
      result = result.filter((p) => p.price < 500);
    } else if (selectedPriceRange === '500-1500') {
      result = result.filter((p) => p.price >= 500 && p.price <= 1500);
    } else if (selectedPriceRange === '1500-3000') {
      result = result.filter((p) => p.price > 1500 && p.price <= 3000);
    } else if (selectedPriceRange === 'above-3000') {
      result = result.filter((p) => p.price > 3000);
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    } else if (sortBy === 'bestseller') {
      result.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }

    return result;
  }, [initialProducts, selectedConcern, selectedCategory, selectedPriceRange, sortBy]);

  const hasActiveFilters =
    selectedConcern !== (initialConcern || 'all') ||
    selectedCategory !== (initialCategory || 'all') ||
    selectedPriceRange !== 'all';

  const resetFilters = () => {
    setSelectedConcern(initialConcern || 'all');
    setSelectedCategory(initialCategory || 'all');
    setSelectedPriceRange('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Header */}
      <div className="mb-8 pb-6 border-b border-stone-200">
        <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-forest">
          {title}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-charcoal-muted max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>

      {/* Control Bar: Filters toggle, Active filters, Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-button text-xs font-semibold bg-white border border-stone-200 text-charcoal shadow-xs hover:bg-stone-50"
          >
            <SlidersHorizontal size={14} className="text-botanical" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-botanical" />
            )}
          </button>

          <span className="text-xs font-medium text-charcoal-muted">
            Showing <strong className="text-charcoal font-bold">{filteredProducts.length}</strong> formulations
          </span>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs">
          <label htmlFor="shop-sort" className="text-charcoal-muted hidden sm:inline">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="shop-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-stone-200 rounded-button px-3 py-2 pr-8 text-xs font-semibold text-charcoal focus:outline-none focus:border-botanical shadow-xs cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="bestseller">Bestsellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-charcoal-muted">Active Filters:</span>
          {selectedConcern !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-badge text-xs bg-sage text-forest">
              <span>Concern: {selectedConcern}</span>
              <button onClick={() => setSelectedConcern('all')} aria-label="Remove filter">
                <X size={12} />
              </button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-badge text-xs bg-sage text-forest">
              <span>Format: {selectedCategory}</span>
              <button onClick={() => setSelectedCategory('all')} aria-label="Remove filter">
                <X size={12} />
              </button>
            </span>
          )}
          {selectedPriceRange !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-badge text-xs bg-sage text-forest">
              <span>Price Range</span>
              <button onClick={() => setSelectedPriceRange('all')} aria-label="Remove filter">
                <X size={12} />
              </button>
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-xs text-botanical hover:underline font-semibold ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid with Sidebar Filter on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 pr-4 border-r border-stone-200/80">
          {/* Health Concern Filter */}
          <div>
            <h3 className="text-xs font-bold text-forest uppercase tracking-wider mb-3">
              Health Concern
            </h3>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => setSelectedConcern('all')}
                className={`flex items-center justify-between w-full py-1.5 px-2 rounded-md transition-colors ${
                  selectedConcern === 'all'
                    ? 'bg-sage text-forest font-bold'
                    : 'text-charcoal hover:bg-stone-100'
                }`}
              >
                <span>All Concerns</span>
                {selectedConcern === 'all' && <Check size={14} />}
              </button>
              {HEALTH_CONCERNS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedConcern(c.slug)}
                  className={`flex items-center justify-between w-full py-1.5 px-2 rounded-md transition-colors text-left ${
                    selectedConcern === c.slug
                      ? 'bg-sage text-forest font-bold'
                      : 'text-charcoal hover:bg-stone-100'
                  }`}
                >
                  <span className="truncate pr-2">{c.name}</span>
                  {selectedConcern === c.slug && <Check size={14} className="flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* Format Filter */}
          <div>
            <h3 className="text-xs font-bold text-forest uppercase tracking-wider mb-3">
              Product Format
            </h3>
            <div className="space-y-1 text-xs">
              {PRODUCT_FORMATS.map((f) => (
                <button
                  key={f.slug}
                  onClick={() => setSelectedCategory(f.slug)}
                  className={`flex items-center justify-between w-full py-1.5 px-2 rounded-md transition-colors text-left ${
                    selectedCategory === f.slug
                      ? 'bg-sage text-forest font-bold'
                      : 'text-charcoal hover:bg-stone-100'
                  }`}
                >
                  <span>{f.name}</span>
                  {selectedCategory === f.slug && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* Price Range */}
          <div>
            <h3 className="text-xs font-bold text-forest uppercase tracking-wider mb-3">
              Price Range
            </h3>
            <div className="space-y-1 text-xs">
              {[
                { label: 'All Prices', val: 'all' },
                { label: 'Under ₹500', val: 'under-500' },
                { label: '₹500 to ₹1,500', val: '500-1500' },
                { label: '₹1,500 to ₹3,000', val: '1500-3000' },
                { label: 'Above ₹3,000', val: 'above-3000' },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => setSelectedPriceRange(p.val)}
                  className={`flex items-center justify-between w-full py-1.5 px-2 rounded-md transition-colors text-left ${
                    selectedPriceRange === p.val
                      ? 'bg-sage text-forest font-bold'
                      : 'text-charcoal hover:bg-stone-100'
                  }`}
                >
                  <span>{p.label}</span>
                  {selectedPriceRange === p.val && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-card border border-stone-200">
              <h3 className="font-heading text-lg font-bold text-forest">No formulations match your selection</h3>
              <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto">
                Try clearing some filters or searching for alternative health concerns.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 rounded-button text-xs font-semibold bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-forest-dark/60 backdrop-blur-xs"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <div
            className="w-full max-w-xs h-full bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
              <h2 className="text-sm font-bold text-forest">Filter Formulations</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-stone-400 hover:text-charcoal"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-5 space-y-6">
              {/* Concern */}
              <div>
                <h4 className="text-xs font-bold text-forest uppercase tracking-wider mb-2">Health Concern</h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedConcern('all')}
                    className={`block w-full text-left py-1.5 px-2 rounded ${selectedConcern === 'all' ? 'bg-sage font-bold' : ''}`}
                  >
                    All Concerns
                  </button>
                  {HEALTH_CONCERNS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConcern(c.slug)}
                      className={`block w-full text-left py-1.5 px-2 rounded ${selectedConcern === c.slug ? 'bg-sage font-bold' : ''}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div>
                <h4 className="text-xs font-bold text-forest uppercase tracking-wider mb-2">Format</h4>
                <div className="space-y-1 text-xs">
                  {PRODUCT_FORMATS.map((f) => (
                    <button
                      key={f.slug}
                      onClick={() => setSelectedCategory(f.slug)}
                      className={`block w-full text-left py-1.5 px-2 rounded ${selectedCategory === f.slug ? 'bg-sage font-bold' : ''}`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-xs font-bold text-forest uppercase tracking-wider mb-2">Price Range</h4>
                <div className="space-y-1 text-xs">
                  {[
                    { label: 'All Prices', val: 'all' },
                    { label: 'Under ₹500', val: 'under-500' },
                    { label: '₹500 to ₹1,500', val: '500-1500' },
                    { label: '₹1,500 to ₹3,000', val: '1500-3000' },
                    { label: 'Above ₹3,000', val: 'above-3000' },
                  ].map((p) => (
                    <button
                      key={p.val}
                      onClick={() => setSelectedPriceRange(p.val)}
                      className={`block w-full text-left py-1.5 px-2 rounded ${selectedPriceRange === p.val ? 'bg-sage font-bold' : ''}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex gap-2">
              <button
                onClick={resetFilters}
                className="w-1/2 py-2.5 rounded-button text-xs font-semibold bg-white border border-stone-200 text-charcoal"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-1/2 py-2.5 rounded-button text-xs font-semibold bg-primary text-white"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
