'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { getAllProducts } from '@/lib/products';
import { searchProductsEnhanced, SearchResultItem, SearchResponse } from '@/lib/search';
import { trackSearch } from '@/lib/storefrontAnalytics';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  'BoozLiv',
  'Divine Healing Oil',
  'Purna Sakthi Tonic',
  'SkinWell Soap',
  'Flow Well',
  'Joint Pain',
  'Psoriasis',
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [alternatives, setAlternatives] = useState<SearchResultItem[]>([]);
  const [correctedQuery, setCorrectedQuery] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
      setAlternatives([]);
      setCorrectedQuery(undefined);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const executeSearch = async (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) {
      setResults([]);
      setAlternatives([]);
      setCorrectedQuery(undefined);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      // 1. Fetch dynamic products and search results from live WooCommerce CMS backend
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data: SearchResponse = await res.json();
        setResults(data.results || []);
        setAlternatives(data.suggestedAlternatives || []);
        setCorrectedQuery(data.correctedQuery);
        trackSearch(trimmed, (data.results || []).length);
        setIsLoading(false);
        return;
      }
    } catch {
      // Network fallback
    }

    // 2. Client-side resilience fallback using the full product catalog
    const localData = searchProductsEnhanced(trimmed, getAllProducts());
    setResults(localData.results);
    setAlternatives(localData.suggestedAlternatives);
    setCorrectedQuery(localData.correctedQuery);
    trackSearch(trimmed, localData.results.length);
    setIsLoading(false);
  };

  const handleSearchChange = (term: string) => {
    setQuery(term);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (term.trim().length === 0) {
      setResults([]);
      setAlternatives([]);
      setCorrectedQuery(undefined);
      setIsLoading(false);
      return;
    }

    // Real-time suggestions as customer types (180ms debounce)
    debounceTimerRef.current = setTimeout(() => {
      executeSearch(term);
    }, 180);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Products"
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-3 sm:px-4 bg-forest-dark/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-card shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[85vh] sm:max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar - Preserves Existing Design Language */}
        <div className="relative flex items-center px-3.5 sm:px-4 py-3 sm:py-3.5 border-b border-stone-200 flex-shrink-0">
          <Search size={20} className="text-botanical flex-shrink-0 mr-2.5 sm:mr-3" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by health concern, formulation, or product name..."
            className="w-full text-sm sm:text-base bg-transparent border-0 outline-none text-charcoal placeholder:text-stone-400"
          />
          {query ? (
            <button
              onClick={() => handleSearchChange('')}
              className="p-1 text-stone-400 hover:text-charcoal transition-colors mr-2"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-charcoal-muted bg-stone-100 hover:bg-stone-200 rounded transition-colors flex-shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Content Area - Responsive with smooth touch scrolling */}
        <div className="overflow-y-auto p-3.5 sm:p-6 space-y-4">
          {query.trim().length === 0 ? (
            <div>
              <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2.5">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setQuery(item);
                      executeSearch(item);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs bg-sage-light hover:bg-sage text-forest border border-border-botanical transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Typo Correction Notification Banner */}
              {correctedQuery && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-sage-light border border-border-botanical text-xs text-forest">
                  <Sparkles size={14} className="text-gold flex-shrink-0" />
                  <span>
                    Showing smart results for <strong className="capitalize">{correctedQuery}</strong>
                  </span>
                </div>
              )}

              {/* Primary Search Results */}
              {results.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-charcoal-muted">
                      {results.length} product{results.length > 1 ? 's' : ''} found
                    </p>
                    {isLoading && (
                      <span className="text-[11px] text-stone-400 italic">Updating...</span>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    {results.map(({ product, matchType, matchReason }) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-2 sm:p-2.5 rounded-xl hover:bg-ivory active:bg-stone-100 transition-colors border border-transparent hover:border-stone-200 group"
                      >
                        {/* Product Image */}
                        <div className="relative w-13 h-13 sm:w-14 sm:h-14 bg-[#FAF8F5] rounded-lg border border-stone-200 flex-shrink-0 p-1 overflow-hidden">
                          <Image
                            src={product.images[0] || 'https://cms.ayurrakshaonline.com/wp-content/uploads/2024/02/1-1024x1024.jpg'}
                            alt={product.name}
                            fill
                            sizes="56px"
                            className="object-contain"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow min-w-0 pr-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-semibold text-charcoal group-hover:text-botanical transition-colors truncate max-w-full">
                              {product.name}
                            </h4>
                            {matchType === 'typo' && (
                              <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                Suggested
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] sm:text-xs text-charcoal-muted truncate">
                            {matchReason || product.healthConcerns.join(', ')}
                          </p>

                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-xs font-bold text-forest">
                              ₹{product.price.toLocaleString('en-IN')}
                            </span>
                            {product.regularPrice > product.price && (
                              <span className="text-[10px] text-stone-400 line-through">
                                ₹{product.regularPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                            {product.discountPercent > 0 && (
                              <span className="text-[10px] font-semibold text-botanical">
                                {product.discountPercent}% OFF
                              </span>
                            )}
                          </div>
                        </div>

                        <ArrowRight size={15} className="text-stone-300 group-hover:text-botanical group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-6 sm:py-8 text-center bg-stone-50 rounded-xl border border-stone-200 px-4">
                  <AlertCircle size={24} className="mx-auto text-stone-400 mb-2" />
                  <p className="text-sm font-semibold text-charcoal">No exact matches for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto">
                    Check your spelling or browse our recommended Ayurvedic formulations below.
                  </p>
                </div>
              )}

              {/* Smart Recommendations & Alternatives */}
              {alternatives.length > 0 && (
                <div className="pt-2 border-t border-stone-100">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Sparkles size={13} className="text-gold" />
                    <p className="text-xs font-bold text-forest uppercase tracking-wider">
                      {results.length > 0 ? 'You May Also Consider' : 'Recommended Formulations'}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    {alternatives.map(({ product, matchReason }) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-ivory active:bg-stone-100 transition-colors border border-stone-200/80 group"
                      >
                        <div className="relative w-12 h-12 bg-[#FAF8F5] rounded-lg border border-stone-200 flex-shrink-0 p-1 overflow-hidden">
                          <Image
                            src={product.images[0] || 'https://cms.ayurrakshaonline.com/wp-content/uploads/2024/02/1-1024x1024.jpg'}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-contain"
                          />
                        </div>

                        <div className="flex-grow min-w-0 pr-1">
                          <h4 className="text-xs sm:text-sm font-semibold text-charcoal group-hover:text-botanical transition-colors truncate">
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-charcoal-muted truncate">
                            {matchReason || product.healthConcerns[0] || 'Ayurvedic wellness'}
                          </p>
                          <span className="text-xs font-bold text-forest">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <ArrowRight size={14} className="text-stone-300 group-hover:text-botanical group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

