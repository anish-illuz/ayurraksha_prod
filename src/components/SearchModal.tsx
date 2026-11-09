'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '@/types/product';
import { searchProducts } from '@/lib/products';
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
  'Organics LaxaHealth',
  'Flow Well',
  'Joint Pain',
  'Psoriasis',
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
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

  const handleSearch = (term: string) => {
    setQuery(term);
    if (term.trim().length > 1) {
      const found = searchProducts(term);
      setResults(found);
      trackSearch(term, found.length);
    } else {
      setResults([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Products"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-forest-dark/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-card shadow-2xl overflow-hidden border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-stone-200">
          <Search size={20} className="text-botanical flex-shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by health concern, formulation, or product name..."
            className="w-full text-base bg-transparent border-0 outline-none text-charcoal placeholder:text-stone-400"
          />
          {query ? (
            <button
              onClick={() => handleSearch('')}
              className="p-1 text-stone-400 hover:text-charcoal transition-colors mr-2"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-charcoal-muted bg-stone-100 hover:bg-stone-200 rounded transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Content Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {query.trim().length === 0 ? (
            <div>
              <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-3">
                Suggested Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item) => (
                  <button
                    key={item}
                    onClick={() => handleSearch(item)}
                    className="px-3 py-1.5 rounded-full text-xs bg-sage-light hover:bg-sage text-forest border border-border-botanical transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div>
              <p className="text-xs font-medium text-charcoal-muted mb-3">
                Found {results.length} product{results.length > 1 ? 's' : ''} for &ldquo;{query}&rdquo;
              </p>
              <div className="space-y-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3.5 p-2.5 rounded-lg hover:bg-ivory transition-colors group"
                  >
                    <div className="relative w-14 h-14 bg-white rounded border border-stone-200 flex-shrink-0 p-1">
                      <Image
                        src={product.images[0] || 'https://www.ayurrakshaonline.com/wp-content/uploads/2024/02/1-1024x1024.jpg'}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-sm font-semibold text-charcoal group-hover:text-botanical transition-colors truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-charcoal-muted truncate">
                        {product.healthConcerns.join(', ')}
                      </p>
                      <span className="text-xs font-bold text-forest">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-stone-300 group-hover:text-botanical group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-charcoal">No products found matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-charcoal-muted mt-1">
                Try searching for a health concern like liver, joint, skin, digestion, or heart.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
