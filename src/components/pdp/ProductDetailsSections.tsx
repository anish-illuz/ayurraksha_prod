'use client';

import React, { useState, useMemo } from 'react';
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
import { Product, RitualStep, FeatureCard, IngredientCard } from '@/types/product';
import { formatPackMeasurement } from '@/lib/formatPack';

interface ProductDetailsSectionsProps {
  product: Product;
}

// Dynamic icon resolver that matches the actual step action
function getStepActionIcon(text: string, idx: number) {
  const lower = text.toLowerCase();
  if (lower.includes('lather') || lower.includes('soap') || lower.includes('wash') || lower.includes('rinse')) {
    return <Droplets key={idx} size={20} className="text-stone-700" />;
  }
  if (lower.includes('apply') || lower.includes('massage') || lower.includes('roll') || lower.includes('spread')) {
    return <Sparkles key={idx} size={20} className="text-stone-700" />;
  }
  if (lower.includes('swish') || lower.includes('spit') || lower.includes('gargle') || lower.includes('brush') || lower.includes('teeth')) {
    return <Droplets key={idx} size={20} className="text-stone-700" />;
  }
  if (lower.includes('boil') || lower.includes('simmer') || lower.includes('heat') || lower.includes('warm water') || lower.includes('infuse')) {
    return <Flame key={idx} size={20} className="text-stone-700" />;
  }
  if (lower.includes('night') || lower.includes('bedtime') || lower.includes('sleep') || lower.includes('dinner')) {
    return <Moon key={idx} size={20} className="text-stone-700" />;
  }
  if (lower.includes('morning') || lower.includes('empty stomach') || lower.includes('breakfast')) {
    return <Sun key={idx} size={20} className="text-stone-700" />;
  }
  if (lower.includes('shake') || lower.includes('measure') || lower.includes('drops') || lower.includes('tablespoon') || lower.includes('pinch')) {
    return <FlaskConical key={idx} size={20} className="text-stone-700" />;
  }
  if (lower.includes('tea') || lower.includes('sachet') || lower.includes('brew') || lower.includes('sip') || lower.includes('drink')) {
    return <Coffee key={idx} size={20} className="text-stone-700" />;
  }
  if (lower.includes('dry') || lower.includes('leave on') || lower.includes('wait') || lower.includes('minutes')) {
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

/**
 * Split text by common WordPress line delimiters (newlines, bullet points, double spaces)
 */
function splitDelimitedText(rawText: string | undefined): string[] {
  if (!rawText || !rawText.trim()) return [];
  return rawText
    .split(/[\r\n]+|(?<=[.!?])\s{2,}|(?<=[.!?])\s+(?=[A-Z0-9•\-])|[•\t]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Parse ACF ingredients string into structured herb items
 */
interface ParsedHerb {
  commonName: string;
  latinName?: string;
  description?: string;
  badge?: string;
  image?: string;
}

function parseIngredientsAcf(rawText: string | undefined, existingCards?: IngredientCard[]): ParsedHerb[] {
  if (existingCards && existingCards.length > 0) {
    return existingCards.map((c) => ({
      commonName: c.commonName,
      latinName: c.latinName,
      description: c.description,
      badge: c.badge,
      image: c.image,
    }));
  }

  if (!rawText || !rawText.trim()) return [];

  const items = splitDelimitedText(rawText);
  return items.map((item, idx) => {
    // Check for delimiter like " — " or " - "
    if (item.includes('—')) {
      const [common, latin] = item.split('—').map((s) => s.trim());
      return {
        commonName: common,
        latinName: latin,
        badge: `HERB 0${idx + 1}`,
      };
    }
    if (item.includes(' - ')) {
      const [common, latin] = item.split(' - ').map((s) => s.trim());
      return {
        commonName: common,
        latinName: latin,
        badge: `HERB 0${idx + 1}`,
      };
    }
    return {
      commonName: item,
      badge: `HERB 0${idx + 1}`,
    };
  });
}

/**
 * Parse ACF how_to_use string into structured step items
 */
interface ParsedStep {
  stepNumber: number;
  title: string;
  description: string;
}

function parseHowToUseAcf(rawText: string | undefined, existingSteps?: RitualStep[]): ParsedStep[] {
  if (existingSteps && existingSteps.length > 0) {
    return existingSteps.map((s, idx) => ({
      stepNumber: s.stepNumber || idx + 1,
      title: s.title,
      description: s.description,
    }));
  }

  if (!rawText || !rawText.trim()) return [];

  // Check if numbered: "1. ... 2. ..."
  const numberedMatch = rawText.split(/(?:^|\s+)(?:Step\s*)?(\d+)[\.\:\)]\s*/i).filter(Boolean);
  if (numberedMatch.length > 2) {
    const steps: ParsedStep[] = [];
    for (let i = 0; i < numberedMatch.length; i += 2) {
      const num = parseInt(numberedMatch[i], 10);
      const text = numberedMatch[i + 1]?.trim();
      if (text) {
        const parts = text.split(/(?<=[.!?])\s+/);
        steps.push({
          stepNumber: num || steps.length + 1,
          title: parts[0]?.slice(0, 50) || `Step ${steps.length + 1}`,
          description: text,
        });
      }
    }
    if (steps.length > 0) return steps;
  }

  // Split by sentences or double spaces
  const sentences = splitDelimitedText(rawText);
  return sentences.map((sentence, idx) => {
    const colonIdx = sentence.indexOf(':');
    let title = `Step 0${idx + 1}`;
    let desc = sentence;

    if (colonIdx > 0 && colonIdx < 40) {
      title = sentence.slice(0, colonIdx).trim();
      desc = sentence.slice(colonIdx + 1).trim();
    } else {
      const firstWords = sentence.split(' ').slice(0, 4).join(' ');
      title = firstWords;
    }

    return {
      stepNumber: idx + 1,
      title,
      description: desc,
    };
  });
}

/**
 * Parse ACF product_specifications into key-value pairs
 */
interface SpecRow {
  label: string;
  value: string;
}

function parseSpecificationsAcf(
  rawText: string | undefined,
  fallbackRows: SpecRow[]
): SpecRow[] {
  const rows: SpecRow[] = [];

  if (rawText && rawText.trim()) {
    // Match patterns like "Brand: AyurRaksha" or "Product Type: Ayurvedic..."
    const regex = /([A-Za-z\s/&-]{2,30}):\s*([^:\r\n]+?)(?=(?:[A-Za-z\s/&-]{2,30}:|$|[\r\n]))/g;
    let match;
    while ((match = regex.exec(rawText)) !== null) {
      const label = match[1].trim();
      const val = match[2].trim().replace(/[,\.;]+$/, '');
      if (label && val) {
        rows.push({ label, value: val });
      }
    }

    // If regex didn't find multiple keys, try line by line
    if (rows.length === 0) {
      const lines = rawText.split(/[\r\n]+/).map((l) => l.trim()).filter(Boolean);
      for (const line of lines) {
        const cIdx = line.indexOf(':');
        if (cIdx > 0) {
          rows.push({
            label: line.slice(0, cIdx).trim(),
            value: line.slice(cIdx + 1).trim(),
          });
        }
      }
    }
  }

  // If ACF specifications provided rows, return them
  if (rows.length > 0) {
    return rows;
  }

  // Otherwise fallback to existing structured fields if any exist
  return fallbackRows.filter((r) => r.value && r.value.trim().length > 0);
}

export const ProductDetailsSections: React.FC<ProductDetailsSectionsProps> = ({ product }) => {
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

  const featureIcons = [
    <Sparkles key={0} size={22} className="text-emerald-700" />,
    <Leaf key={1} size={22} className="text-emerald-700" />,
    <ShieldCheck key={2} size={22} className="text-emerald-700" />,
    <Package key={3} size={22} className="text-emerald-700" />,
    <Moon key={4} size={22} className="text-emerald-700" />,
  ];

  // 1. Product Overview: Check if overview / description exists
  const overviewHtml = product.description?.trim() || '';
  const overviewFallback = product.cleanDescription?.trim() || product.shortDescription?.trim() || '';
  const hasOverview = Boolean(overviewHtml || overviewFallback);

  // 2. Why Choose This Product: ACF `key_benefits`
  const rawKeyBenefits = product.acf?.key_benefits || product.keyBenefits || '';
  const parsedBenefits = useMemo(() => {
    if (rawKeyBenefits.trim()) {
      return splitDelimitedText(rawKeyBenefits);
    }
    if (product.featureCards && product.featureCards.length > 0) {
      return product.featureCards.map((c) => `${c.title}: ${c.description}`);
    }
    if (product.features && product.features.length > 0) {
      return product.features;
    }
    return [];
  }, [rawKeyBenefits, product.featureCards, product.features]);
  const hasWhyChoose = parsedBenefits.length > 0;

  // 3. What's Inside: ACF `ingredients`
  const rawIngredients = product.acf?.ingredients || product.ingredientsText || '';
  const parsedIngredients = useMemo(() => {
    return parseIngredientsAcf(rawIngredients, product.ingredientCards);
  }, [rawIngredients, product.ingredientCards]);
  const hasWhatsInside = parsedIngredients.length > 0;

  // 4. How to Use: ACF `how_to_use`
  const rawHowToUse = product.acf?.how_to_use || product.howToUseText || '';
  const parsedSteps = useMemo(() => {
    return parseHowToUseAcf(rawHowToUse, product.ritualSteps);
  }, [rawHowToUse, product.ritualSteps]);
  const hasHowToUse = parsedSteps.length > 0;

  // 5. Care Before Use: ACF `care_before_use`
  const rawCareBeforeUse = product.acf?.care_before_use || product.careBeforeUse || '';
  const parsedCareItems = useMemo(() => {
    if (rawCareBeforeUse.trim()) {
      return splitDelimitedText(rawCareBeforeUse);
    }
    if (product.advisoryGuidelines && product.advisoryGuidelines.length > 0) {
      return product.advisoryGuidelines;
    }
    if (product.warnings && product.warnings.length > 0) {
      return product.warnings;
    }
    return [];
  }, [rawCareBeforeUse, product.advisoryGuidelines, product.warnings]);
  const hasCareBeforeUse = parsedCareItems.length > 0;

  // 6. Product Specifications: ACF `product_specifications`
  const rawSpecs = product.acf?.product_specifications || product.productSpecifications || '';
  const parsedSpecRows = useMemo(() => {
    const fallbackSpecRows = [
      { label: 'Net Quantity', value: formatPackMeasurement(product.specNetQuantity) },
      { label: 'Product Form', value: product.specProductForm || '' },
      { label: 'Origin', value: product.specOrigin || '' },
      { label: 'Disclosures', value: product.specDisclosures || '' },
    ];
    return parseSpecificationsAcf(rawSpecs, fallbackSpecRows);
  }, [rawSpecs, product.specNetQuantity, product.specProductForm, product.specOrigin, product.specDisclosures]);
  const hasSpecifications = parsedSpecRows.length > 0;

  return (
    <div className="mt-6 sm:mt-8 space-y-4">
      <div className="space-y-2.5 sm:space-y-3">
        {/* Accordion 1: Product Overview (WordPress Post Content / Description) */}
        {hasOverview && (
          <SectionAccordion
            id="overview"
            icon={<BookOpen size={16} />}
            title="Product Overview"
            open={openSections.overview}
            onToggle={() => toggleSection('overview')}
          >
            <div className="space-y-3">
              {overviewHtml ? (
                <div
                  className="prose prose-stone max-w-none text-charcoal/85 text-sm sm:text-base leading-relaxed font-sans space-y-3 [&>h3]:font-serif [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-forest [&>h3]:pt-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>p]:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: overviewHtml }}
                />
              ) : (
                <div className="text-charcoal/85 text-sm sm:text-base leading-relaxed space-y-3 font-sans">
                  <p>{overviewFallback}</p>
                </div>
              )}
            </div>
          </SectionAccordion>
        )}

        {/* Accordion 2: Why Choose This Product? (WordPress ACF `key_benefits`) */}
        {hasWhyChoose && (
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
                {parsedBenefits.map((benefit, idx) => {
                  const colonIdx = benefit.indexOf(':');
                  const hasTitle = colonIdx > 0 && colonIdx < 40;
                  const title = hasTitle ? benefit.slice(0, colonIdx).trim() : `Key Benefit 0${idx + 1}`;
                  const desc = hasTitle ? benefit.slice(colonIdx + 1).trim() : benefit;

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-stone-200/80 bg-stone-50/50 hover:bg-[#FAF7F2] transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-9 h-9 rounded-lg bg-white border border-stone-200/80 flex items-center justify-center mb-2.5 shadow-2xs">
                          {featureIcons[idx % featureIcons.length]}
                        </div>
                        <h4 className="font-serif text-sm sm:text-base font-bold text-forest mb-1">
                          {title}
                        </h4>
                        <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
                          {desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionAccordion>
        )}

        {/* Accordion 3: What's Inside? (WordPress ACF `ingredients`) */}
        {hasWhatsInside && (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {parsedIngredients.map((herb, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-stone-200/90 bg-white overflow-hidden shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      {herb.image ? (
                        <div className="relative h-24 sm:h-32 bg-stone-100 overflow-hidden">
                          <Image
                            src={herb.image}
                            alt={herb.latinName || herb.commonName}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#16382C]/90 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                            {herb.badge || `BOTANICAL`}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 sm:p-3.5 bg-[#FAF7F2] border-b border-stone-100 flex items-center justify-between">
                          <div className="w-8 h-8 rounded-lg bg-white border border-stone-200/80 flex items-center justify-center text-botanical shadow-2xs">
                            <Leaf size={16} />
                          </div>
                          <span className="px-2 py-0.5 rounded bg-[#E8EFE6] text-forest text-[10px] font-bold uppercase tracking-wider">
                            {herb.badge || 'HERB'}
                          </span>
                        </div>
                      )}
                      <div className="p-3 sm:p-3.5">
                        <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block mb-0.5 truncate">
                          {herb.commonName}
                        </span>
                        {herb.latinName && (
                          <h4 className="font-serif text-xs sm:text-sm font-bold text-forest italic mb-1 line-clamp-1">
                            {herb.latinName}
                          </h4>
                        )}
                        {herb.description && (
                          <p className="text-xs text-charcoal/80 leading-relaxed font-sans line-clamp-3">
                            {herb.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionAccordion>
        )}

        {/* Accordion 4: How to Use (WordPress ACF `how_to_use`) */}
        {hasHowToUse && (
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

              {product.ritualSubtitle && (
                <p className="text-xs sm:text-sm text-charcoal/70 mb-4 max-w-2xl">
                  {product.ritualSubtitle}
                </p>
              )}

              {(() => {
                const stepCount = parsedSteps.length;
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
                    {parsedSteps.map((step, idx) => (
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
                              {getStepActionIcon(`${step.title} ${step.description}`, idx)}
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
        )}

        {/* Accordion 5: Care Before Use (WordPress ACF `care_before_use`) */}
        {hasCareBeforeUse && (
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
                {parsedCareItems.map((guide, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-charcoal/80 leading-relaxed">
                    <span className="text-amber-700 font-bold mt-0.5">•</span>
                    <span>{guide}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionAccordion>
        )}

        {/* Accordion 6: Product Specifications (WordPress ACF `product_specifications`) */}
        {hasSpecifications && (
          <SectionAccordion
            id="specifications"
            icon={<Package size={16} />}
            title="Product Specifications"
            open={openSections.specifications}
            onToggle={() => toggleSection('specifications')}
          >
            <div className="space-y-1.5">
              {parsedSpecRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-4 text-xs sm:text-sm py-1.5 border-b border-stone-100 last:border-b-0"
                >
                  <span className="text-charcoal-muted">{row.label}</span>
                  <span className="font-semibold text-forest text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </SectionAccordion>
        )}
      </div>

      {/* Quality & Trust Strip */}
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
