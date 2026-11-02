'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Clock,
  Package,
  Heart,
  Droplets,
  Award,
  ChevronRight
} from 'lucide-react';
import { Product } from '@/types/product';

interface ProductDetailsSectionsProps {
  product: Product;
}

export const ProductDetailsSections: React.FC<ProductDetailsSectionsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'features' | 'ingredients' | 'howToUse' | 'safety'>('all');

  const hasFeatures = product.features && product.features.length > 0;
  const hasIngredients = product.ingredients && product.ingredients.length > 0;
  const hasHowToUse = product.howToUse && product.howToUse.length > 0;
  const hasSuitable = Boolean(product.suitableFor);
  const hasWarnings = product.warnings && product.warnings.length > 0;
  const hasSpecs = Boolean(product.netQuantity || product.storage);
  const hasStory = Boolean(product.fullDescription || product.description);

  // If no structured fields exist at all, fall back to simple overview
  if (!hasFeatures && !hasIngredients && !hasHowToUse && !hasStory) {
    return null;
  }

  return (
    <section className="mt-12 lg:mt-16 border-t border-stone-200/90 pt-12 sm:pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage text-forest text-xs font-semibold uppercase tracking-wider mb-3">
            <Leaf size={14} className="text-botanical" />
            <span>Complete Formulation Details</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest leading-tight">
            Authentic Clinical Heritage &amp; Usage
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal/80 leading-relaxed font-sans">
            Formulated under the clinical guidance of Dr. Jegajothi Pandian, combining India’s classical Ayurvedic traditions with modern quality standards.
          </p>
        </div>

        {/* 1. Full Editorial Story / Description */}
        {hasStory && (
          <div className="mb-14 bg-gradient-to-br from-white to-[#FAF7F2] rounded-2xl border border-stone-200/80 p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sage/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-4 text-botanical font-semibold text-xs uppercase tracking-wider">
                <Sparkles size={16} />
                <span>Therapeutic Philosophy &amp; Story</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest mb-4">
                The Heritage Behind {product.name}
              </h3>
              <div
                className="prose prose-stone max-w-none text-charcoal/90 text-sm sm:text-base leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{
                  __html: product.fullDescription || product.description
                }}
              />
            </div>
          </div>
        )}

        {/* 2-Column Grid: Key Benefits & Botanical Ingredients */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-14">
          {/* Key Benefits (Left / 6 cols) */}
          {hasFeatures && (
            <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                      <Heart size={20} />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                        Key Features &amp; Benefits
                      </h3>
                      <span className="text-xs text-charcoal-muted">Therapeutic actions &amp; wellness properties</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-sage text-forest text-xs font-bold">
                    {product.features?.length} Highlights
                  </span>
                </div>

                <ul className="space-y-3.5">
                  {product.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <CheckCircle2 size={13} className="text-emerald-700" />
                      </div>
                      <span className="text-sm text-charcoal/90 leading-relaxed font-sans">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50/50 p-3 rounded-xl">
                <ShieldCheck size={16} className="text-emerald-700 flex-shrink-0" />
                <span>100% natural herbal ingredients with zero synthetic adulterants.</span>
              </div>
            </div>
          )}

          {/* Botanical Ingredients (Right / 6 cols) */}
          {hasIngredients && (
            <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                      <Leaf size={20} />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                        Botanical Ingredients
                      </h3>
                      <span className="text-xs text-charcoal-muted">Active herbs &amp; classical preparations</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    {product.ingredients?.length} Botanicals
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {product.ingredients?.map((ing, idx) => {
                    const parts = ing.split(/–|-/);
                    const latin = parts[0]?.trim();
                    const common = parts.slice(1).join('–').trim();

                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-stone-50/80 border border-stone-200/60 hover:bg-sage-light/40 transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-botanical flex-shrink-0" />
                          <div>
                            <span className="text-sm font-semibold text-forest block">
                              {latin}
                            </span>
                            {common && (
                              <span className="text-xs text-charcoal-muted">
                                {common}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-botanical/80 px-2 py-0.5 rounded bg-white border border-stone-200/60 flex-shrink-0">
                          Ayurvedic Herb
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-medium text-amber-900 bg-amber-50/60 p-3 rounded-xl">
                <Award size={16} className="text-amber-800 flex-shrink-0" />
                <span>Standardized botanical extracts prepared according to classical texts.</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Directions for Use & Daily Routine */}
        {hasHowToUse && (
          <div className="mb-14 bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-10 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center font-bold">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-forest">
                    How to Use / Directions
                  </h3>
                  <span className="text-xs text-charcoal-muted">Recommended preparation, timing and dosage</span>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-100 text-sky-900 self-start sm:self-auto">
                Step-by-Step Guide
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {product.howToUse?.map((step, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border border-stone-200 bg-gradient-to-b from-stone-50/50 to-white relative flex flex-col justify-between"
                >
                  <div>
                    <div className="w-8 h-8 rounded-full bg-forest text-white text-xs font-bold flex items-center justify-center mb-3 shadow-xs">
                      {idx + 1}
                    </div>
                    <span className="text-xs uppercase font-bold text-botanical tracking-wider block mb-1">
                      Step {idx + 1}
                    </span>
                    <p className="text-sm font-medium text-charcoal leading-relaxed">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Suitability, Warnings & Specifications Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Suitable For */}
          {hasSuitable && (
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 text-botanical font-bold text-xs uppercase tracking-wider mb-3">
                  <CheckCircle2 size={16} />
                  <span>Suitable For</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-forest mb-2">
                  Target Indications
                </h4>
                <p className="text-sm text-charcoal/90 leading-relaxed font-sans">
                  {product.suitableFor}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-charcoal-muted">
                Suitable for long-term daily health routines as recommended.
              </div>
            </div>
          )}

          {/* Warnings & Precautions */}
          {hasWarnings && (
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 text-amber-800 font-bold text-xs uppercase tracking-wider mb-3">
                  <AlertCircle size={16} />
                  <span>Safety &amp; Precautions</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-forest mb-2">
                  Advisory Guidelines
                </h4>
                <ul className="space-y-2">
                  {product.warnings?.map((w, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-charcoal/80 flex items-start gap-2">
                      <span className="text-amber-700 font-bold mt-0.5">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-charcoal-muted">
                Consult a physician if you are pregnant, nursing, or on prescribed medication.
              </div>
            </div>
          )}

          {/* Specifications: Net Quantity & Storage */}
          {hasSpecs && (
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 text-forest font-bold text-xs uppercase tracking-wider mb-3">
                  <Package size={16} />
                  <span>Product Specifications</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-forest mb-3">
                  Packaging &amp; Storage
                </h4>

                <div className="space-y-3">
                  {product.netQuantity && (
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                      <span className="text-xs text-charcoal-muted block mb-0.5">Net Quantity / Pack Size:</span>
                      <span className="text-sm font-bold text-forest">{product.netQuantity}</span>
                    </div>
                  )}

                  {product.storage && (
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                      <span className="text-xs text-charcoal-muted block mb-0.5">Storage Instructions:</span>
                      <span className="text-sm font-semibold text-charcoal">{product.storage}</span>
                    </div>
                  )}

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
                    <span className="text-xs text-charcoal-muted block mb-0.5">Origin &amp; Manufacturing:</span>
                    <span className="text-sm font-semibold text-charcoal">Formulated in Chennai, India</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
