'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  Leaf,
  Clock,
  Package,
  Award,
  ChevronDown,
  Flame,
  Moon,
  Sun,
  Coffee,
  FlaskConical,
  Droplets,
  CheckCircle2,
  HeartHandshake
} from 'lucide-react';
import { Product, RitualStep } from '@/types/product';
import { formatPackMeasurement } from '@/lib/formatPack';

interface ProductDetailsSectionsProps {
  product: Product;
}

// Dynamic icon resolver that matches the actual step action
function getStepActionIcon(step: RitualStep, idx: number) {
  const text = `${step.title} ${step.description}`.toLowerCase();
  if (text.includes('lather') || text.includes('soap') || text.includes('wash') || text.includes('rinse')) {
    return <Droplets key={idx} size={20} className="text-stone-700" />;
  }
  if (text.includes('apply') || text.includes('massage') || text.includes('roll') || text.includes('spread')) {
    return <Sparkles key={idx} size={20} className="text-stone-700" />;
  }
  if (text.includes('swish') || text.includes('spit') || text.includes('gargle') || text.includes('brush') || text.includes('teeth')) {
    return <Droplets key={idx} size={20} className="text-stone-700" />;
  }
  if (text.includes('boil') || text.includes('simmer') || text.includes('heat') || text.includes('warm water') || text.includes('infuse')) {
    return <Flame key={idx} size={20} className="text-stone-700" />;
  }
  if (text.includes('night') || text.includes('bedtime') || text.includes('sleep') || text.includes('dinner')) {
    return <Moon key={idx} size={20} className="text-stone-700" />;
  }
  if (text.includes('morning') || text.includes('empty stomach') || text.includes('breakfast')) {
    return <Sun key={idx} size={20} className="text-stone-700" />;
  }
  if (text.includes('shake') || text.includes('measure') || text.includes('drops') || text.includes('tablespoon') || text.includes('pinch')) {
    return <FlaskConical key={idx} size={20} className="text-stone-700" />;
  }
  if (text.includes('tea') || text.includes('sachet') || text.includes('brew') || text.includes('sip') || text.includes('drink')) {
    return <Coffee key={idx} size={20} className="text-stone-700" />;
  }
  if (text.includes('dry') || text.includes('leave on') || text.includes('wait') || text.includes('minutes')) {
    return <Clock key={idx} size={20} className="text-stone-700" />;
  }
  const fallbackIcons = [
    <CheckCircle2 key={idx} size={20} className="text-stone-700" />,
    <Sparkles key={idx} size={20} className="text-stone-700" />,
    <Leaf key={idx} size={20} className="text-stone-700" />
  ];
  return fallbackIcons[idx % fallbackIcons.length];
}

type SectionKey =
  | 'overview'
  | 'whyChoose'
  | 'whatsInside'
  | 'howToUse'
  | 'careBeforeUse'
  | 'specifications';

// Compact accordion row: icon + single heading + expand arrow
const SectionAccordion: React.FC<{
  id: SectionKey;
  icon: React.ReactNode;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ id, icon, title, open, onToggle, children }) => (
  <div className="bg-white rounded-xl sm:rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={`accordion-${id}`}
      className="w-full p-3.5 sm:p-4 text-left flex items-center gap-3 hover:bg-stone-50/70 transition-colors cursor-pointer"
    >
      <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF7F2] border border-stone-200/80 flex items-center justify-center text-botanical shrink-0">
        {icon}
      </span>
      <h3 className="font-serif text-base sm:text-lg font-bold text-forest flex-1 min-w-0 truncate">
        {title}
      </h3>
      <ChevronDown
        size={18}
        className={`shrink-0 text-stone-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      />
    </button>
    {open && (
      <div id={`accordion-${id}`} className="p-4 sm:p-5 border-t border-stone-100">
        {children}
      </div>
    )}
  </div>
);

export const ProductDetailsSections: React.FC<ProductDetailsSectionsProps> = ({ product }) => {
  // Accordion state: all sections collapsed by default
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    overview: false,
    whyChoose: false,
    whatsInside: false,
    howToUse: false,
    careBeforeUse: false,
    specifications: false,
  });

  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Feature cards icons mapping
  const featureIcons = [
    <Sparkles key={0} size={22} className="text-emerald-700" />,
    <Leaf key={1} size={22} className="text-emerald-700" />,
    <ShieldCheck key={2} size={22} className="text-emerald-700" />,
    <Package key={3} size={22} className="text-emerald-700" />,
    <Moon key={4} size={22} className="text-emerald-700" />
  ];

  // Product specification rows (rendered only when a value exists)
  const specRows = [
    { label: 'Net Quantity', value: formatPackMeasurement(product.specNetQuantity) },
    { label: 'Product Form', value: product.specProductForm },
    { label: 'Origin', value: product.specOrigin },
    { label: 'Disclosures', value: product.specDisclosures },
  ].filter((row) => row.value);

  return (
    <div className="mt-6 sm:mt-8 space-y-4">
      {/* ============================================================== */}
      {/* COMPACT ACCORDION DESIGN (MATCHING REFERENCE MOCKUP)           */}
      {/* Headlines:                                                     */}
      {/* 1. Product Overview                                            */}
      {/* 2. Why Choose This Product?                                    */}
      {/* 3. What's Inside?                                              */}
      {/* 4. How to Use                                                  */}
      {/* 5. Care Before Use                                             */}
      {/* 6. Product Specifications                                      */}
      {/* ============================================================== */}
      <div className="space-y-2.5 sm:space-y-3">
        {/* Accordion 1: Product Overview */}
        <SectionAccordion
          id="overview"
          icon={<BookOpen size={16} />}
          title="Product Overview"
          open={openSections.overview}
          onToggle={() => toggleSection('overview')}
        >
          <div className="space-y-3">
            {product.description ? (
              <div
                className="prose prose-stone max-w-none text-charcoal/85 text-sm sm:text-base leading-relaxed font-sans space-y-3 [&>h3]:font-serif [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-forest [&>h3]:pt-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>p]:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <div className="text-charcoal/85 text-sm sm:text-base leading-relaxed space-y-3 font-sans">
                <p>{product.shortDescription}</p>
                <p>{product.cleanDescription}</p>
              </div>
            )}
          </div>
        </SectionAccordion>

        {/* Accordion 2: Why Choose This Product? */}
        <SectionAccordion
          id="whyChoose"
          icon={<Sparkles size={16} />}
          title="Why Choose This Product?"
          open={openSections.whyChoose}
          onToggle={() => toggleSection('whyChoose')}
        >
          <div>
            {product.featuresBadge && (
              <div className="mb-4 pb-3 border-b border-stone-100">
                <span className="px-3 py-1 rounded-full bg-[#E8EFE6] text-forest text-xs font-bold border border-forest/10">
                  {product.featuresBadge}
                </span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {product.featureCards && product.featureCards.length > 0 ? (
                product.featureCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-stone-200/80 bg-stone-50/50 hover:bg-[#FAF7F2] transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-lg bg-white border border-stone-200/80 flex items-center justify-center mb-2.5 shadow-2xs">
                        {featureIcons[idx % featureIcons.length]}
                      </div>
                      <h4 className="font-serif text-sm sm:text-base font-bold text-forest mb-1">
                        {card.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
                        {card.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="sm:col-span-2 lg:col-span-3 text-sm text-charcoal-muted">
                  Features available in product formulation sheet.
                </div>
              )}
            </div>
          </div>
        </SectionAccordion>

        {/* Accordion 3: What's Inside? */}
        <SectionAccordion
          id="whatsInside"
          icon={<Leaf size={16} />}
          title="What's Inside?"
          open={openSections.whatsInside}
          onToggle={() => toggleSection('whatsInside')}
        >
          <div>
            {product.ingredientsSubtitle && (
              <p className="text-xs sm:text-sm text-charcoal/70 mb-4">
                {product.ingredientsSubtitle}
              </p>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {product.ingredientCards?.map((herb, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-stone-200/90 bg-white overflow-hidden shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-24 sm:h-32 bg-stone-100 overflow-hidden">
                      <Image
                        src={herb.image || '/images/ingredients/traditional-raw-ayurvedic-herbs-mortar.webp'}
                        alt={herb.latinName}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#16382C]/90 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                        {herb.badge}
                      </div>
                    </div>
                    <div className="p-3 sm:p-3.5">
                      <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block mb-0.5 truncate">
                        {herb.commonName}
                      </span>
                      <h4 className="font-serif text-xs sm:text-sm font-bold text-forest italic mb-1 line-clamp-1">
                        {herb.latinName}
                      </h4>
                      <p className="text-xs text-charcoal/80 leading-relaxed font-sans line-clamp-3">
                        {herb.description}
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] font-semibold text-charcoal-muted">
                    <span className="truncate">{herb.bioactive || 'Active Extract'}</span>
                    <span className="truncate ml-1">{herb.derivative || 'Natural'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionAccordion>

        {/* Accordion 4: How to Use */}
        <SectionAccordion
          id="howToUse"
          icon={<Clock size={16} />}
          title="How to Use"
          open={openSections.howToUse}
          onToggle={() => toggleSection('howToUse')}
        >
          <div>
            {/* External Use Notice for Topical & Rinse Products */}
            {(product.categorySlugs.some((c) => ['oil', 'cream', 'soap', 'shampoo'].includes(c)) ||
              product.name.toLowerCase().includes('oil') ||
              product.name.toLowerCase().includes('cream') ||
              product.name.toLowerCase().includes('gel') ||
              product.name.toLowerCase().includes('soap') ||
              product.name.toLowerCase().includes('shampoo') ||
              product.name.toLowerCase().includes('balm') ||
              product.name.toLowerCase().includes('roll-on') ||
              product.name.toLowerCase().includes('gargling') ||
              product.name.toLowerCase().includes('tooth powder')) && (
              <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={14} className="text-amber-700 shrink-0" />
                <span>For External / Topical Use Only • Do Not Swallow</span>
              </div>
            )}

            <p className="text-xs sm:text-sm text-charcoal/70 mb-4 max-w-2xl">
              {product.ritualSubtitle && !product.ritualSubtitle.toLowerCase().includes('decoction') && !product.ritualSubtitle.toLowerCase().includes('burning delicate')
                ? product.ritualSubtitle
                : 'Follow the approved application and dosage directions for optimal results.'}
            </p>

            {(() => {
              const stepCount = product.ritualSteps?.length || 4;
              const gridColsClass =
                stepCount <= 2
                  ? 'grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl'
                  : stepCount === 3
                    ? 'grid grid-cols-1 sm:grid-cols-3 gap-3'
                    : stepCount === 4
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'
                      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3';

              return (
                <div className={gridColsClass}>
                  {product.ritualSteps?.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-stone-200/90 bg-[#FAF7F2] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#16382C] text-white text-xs font-bold flex items-center justify-center shadow-2xs">
                            {step.stepNumber}
                          </div>
                          <div className="w-6 h-6 rounded-lg bg-white border border-stone-200/80 flex items-center justify-center">
                            {getStepActionIcon(step, idx)}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-botanical uppercase tracking-wider block mb-0.5">
                          STEP {step.stepNumber < 10 ? `0${step.stepNumber}` : step.stepNumber}
                        </span>
                        <h4 className="font-serif text-sm font-bold text-forest mb-1">
                          {step.title}
                        </h4>
                        <p className="text-xs text-charcoal/80 leading-relaxed font-sans">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </SectionAccordion>

        {/* Accordion 5: Care Before Use */}
        <SectionAccordion
          id="careBeforeUse"
          icon={<ShieldCheck size={16} />}
          title="Care Before Use"
          open={openSections.careBeforeUse}
          onToggle={() => toggleSection('careBeforeUse')}
        >
          <div>
            <div className="flex items-start gap-2.5 mb-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-900">
              <ShieldCheck size={15} className="text-amber-700 shrink-0 mt-0.5" />
              <p className="text-[11px] sm:text-xs font-semibold leading-relaxed">
                Please read these precautions before using this product.
              </p>
            </div>
            <ul className="space-y-1.5">
              {product.advisoryGuidelines && product.advisoryGuidelines.length > 0 ? (
                product.advisoryGuidelines.map((guide, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-charcoal/80 leading-relaxed">
                    <span className="text-amber-700 font-bold mt-0.5">•</span>
                    <span>{guide}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-start gap-2 text-xs sm:text-sm text-charcoal/80 leading-relaxed">
                  <span className="text-amber-700 font-bold mt-0.5">•</span>
                  <span>
                    Consult a qualified practitioner before use if you are pregnant, nursing, or on
                    medication. Store in a cool, dry place away from direct sunlight.
                  </span>
                </li>
              )}
            </ul>
          </div>
        </SectionAccordion>

        {/* Accordion 6: Product Specifications */}
        <SectionAccordion
          id="specifications"
          icon={<Package size={16} />}
          title="Product Specifications"
          open={openSections.specifications}
          onToggle={() => toggleSection('specifications')}
        >
          <div>
            {specRows.length > 0 ? (
              <div className="space-y-1.5">
                {specRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4 text-xs sm:text-sm py-1.5 border-b border-stone-100 last:border-b-0"
                  >
                    <span className="text-charcoal-muted">{row.label}</span>
                    <span className="font-semibold text-forest text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-charcoal-muted">
                Full specifications are listed on the product packaging.
              </p>
            )}
          </div>
        </SectionAccordion>
      </div>

      {/* ============================================================== */}
      {/* SIMPLIFIED QUALITY & TRUST STRIP                               */}
      {/* Four compact icons with clear, meaningful headings:            */}
      {/* 1. GMP-Certified Manufacturing                                 */}
      {/* 2. Quality Tested                                              */}
      {/* 3. Ayurvedic Expertise                                         */}
      {/* 4. Botanical Ingredients                                       */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-stone-200/80 shadow-2xs text-center">
        <div className="flex flex-col items-center gap-1.5">
          <Award size={22} className="text-botanical" />
          <span className="text-xs sm:text-[13px] font-bold text-forest">GMP-Certified Manufacturing</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <ShieldCheck size={22} className="text-botanical" />
          <span className="text-xs sm:text-[13px] font-bold text-forest">Quality Tested</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <HeartHandshake size={22} className="text-botanical" />
          <span className="text-xs sm:text-[13px] font-bold text-forest">Ayurvedic Expertise</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <Leaf size={22} className="text-botanical" />
          <span className="text-xs sm:text-[13px] font-bold text-forest">Botanical Ingredients</span>
        </div>
      </div>
    </div>
  );
};
