'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  ShieldCheck,
  Leaf,
  Clock,
  Package,
  Heart,
  Award,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  Flame,
  Moon,
  Sun,
  Coffee,
  FlaskConical,
  Compass,
  FileText,
  BookOpen,
  Droplets,
  Truck,
  CheckCircle2
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
    <Heart key={idx} size={20} className="text-stone-700" />,
    <Leaf key={idx} size={20} className="text-stone-700" />
  ];
  return fallbackIcons[idx % fallbackIcons.length];
}

export const ProductDetailsSections: React.FC<ProductDetailsSectionsProps> = ({ product }) => {
  // Accordion state: all sections collapsed by default
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    description: false,
    philosophy: false,
    benefits: false,
    ingredients: false,
    howToPrepare: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const whatsappConsultationUrl = `https://wa.me/919940388877?text=${encodeURIComponent(
    `Hello Dr. Jegajothi Pandian, I would like to consult about the dosage and clinical usage of ${product.name}.`
  )}`;

  // Feature cards icons mapping
  const featureIcons = [
    <Sparkles key={0} size={22} className="text-emerald-700" />,
    <Leaf key={1} size={22} className="text-emerald-700" />,
    <Heart key={2} size={22} className="text-emerald-700" />,
    <ShieldCheck key={3} size={22} className="text-emerald-700" />,
    <Package key={4} size={22} className="text-emerald-700" />,
    <Moon key={5} size={22} className="text-emerald-700" />
  ];

  // Step icons mapping
  const stepIcons = [
    <Coffee key={0} size={20} className="text-stone-700" />,
    <FlaskConical key={1} size={20} className="text-stone-700" />,
    <Flame key={2} size={20} className="text-stone-700" />,
    <Moon key={3} size={20} className="text-stone-700" />
  ];

  return (
    <div className="mt-8 sm:mt-12 space-y-6 sm:space-y-8">
      {/* 1. Authentic Clinical Heritage & Usage Doctor Banner */}
      <div className="bg-[#FAF7F2] rounded-3xl border border-stone-200/90 p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 shadow-2xs">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#16382C] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Award size={26} className="text-[#C8A25D]" />
          </div>
          <div>
            <span className="text-xs font-bold text-botanical uppercase tracking-wider block mb-1">
              AUTHENTIC CLINICAL HERITAGE &amp; USAGE
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest leading-snug">
              Formulated Under the Clinical Guidance of{' '}
              <span className="whitespace-nowrap">Dr. Jegajothi Pandian</span>
            </h3>
            <p className="text-sm sm:text-base text-charcoal/80 mt-1 max-w-2xl leading-relaxed font-sans">
              {product.doctorBannerText || 'Combining India’s timeless traditional texts with modern analytical quality verification and standardized clinical purity.'}
            </p>
          </div>
        </div>

        <a
          href={whatsappConsultationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start md:self-center px-6 py-3 rounded-full bg-[#16382C] hover:bg-[#0E251D] text-white text-sm font-semibold transition-all shadow-2xs hover:shadow whitespace-nowrap flex items-center gap-2 shrink-0"
        >
          <span>Discuss Dosage with Doctor</span>
          <ChevronRight size={16} />
        </a>
      </div>

      {/* ============================================================== */}
      {/* THE 5 EXPANDABLE CONTENT ACCORDIONS (COLLAPSED BY DEFAULT)      */}
      {/* ============================================================== */}
      <div className="space-y-4 sm:space-y-5">

        {/* ACCORDION 1: Full Product Description */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection('description')}
            aria-expanded={openSections.description}
            className="w-full p-5 sm:p-7 text-left flex items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 flex items-center justify-center text-forest shrink-0">
                <FileText size={22} className="text-botanical" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] sm:text-xs font-bold text-botanical uppercase tracking-wider block mb-0.5">
                  PRODUCT OVERVIEW
                </span>
                <h3 className="font-serif text-lg sm:text-2xl font-bold text-forest truncate">
                  About this product
                </h3>
              </div>
            </div>

            {/* Downward Arrow (+) Indicator */}
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-charcoal-muted">
                {openSections.description ? 'Collapse' : 'Tap to expand'}
              </span>
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openSections.description
                    ? 'bg-emerald-50 text-emerald-800 rotate-180 border border-emerald-200'
                    : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200/80'
                }`}
              >
                <ChevronDown size={18} />
              </div>
            </div>
          </button>

          {openSections.description && (
            <div className="p-5 sm:p-8 pt-0 sm:pt-0 border-t border-stone-100 animate-in fade-in duration-200">
              <div className="pt-5 space-y-4">
                {product.description ? (
                  <div
                    className="prose prose-stone max-w-none text-charcoal/85 text-sm sm:text-base leading-relaxed font-sans space-y-3.5 [&>h3]:font-serif [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-forest [&>h3]:pt-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>p]:leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                ) : (
                  <div className="text-charcoal/85 text-sm sm:text-base leading-relaxed space-y-3.5 font-sans">
                    <p>{product.shortDescription}</p>
                    <p>{product.cleanDescription}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION 2: Ayurvedic Philosophy */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection('philosophy')}
            aria-expanded={openSections.philosophy}
            className="w-full p-5 sm:p-7 text-left flex items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 flex items-center justify-center text-forest shrink-0">
                <BookOpen size={22} className="text-[#B45309]" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] sm:text-xs font-bold text-[#B45309] uppercase tracking-wider block mb-0.5">
                  {product.slug === 'boozliv'
                    ? 'SIDDHA HERITAGE & FORMULATION'
                    : product.storyEyebrow || 'AYURVEDIC PHILOSOPHY & HERITAGE'}
                </span>
                <h3 className="font-serif text-lg sm:text-2xl font-bold text-forest truncate">
                  {product.slug === 'boozliv'
                    ? 'Traditional Siddha Wellness, Naturally Inspired'
                    : product.storyTitle || 'Traditional Wellness Philosophy & Heritage'}
                </h3>
              </div>
            </div>

            {/* Downward Arrow (+) Indicator */}
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-charcoal-muted">
                {openSections.philosophy ? 'Collapse' : 'Tap to expand'}
              </span>
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openSections.philosophy
                    ? 'bg-emerald-50 text-emerald-800 rotate-180 border border-emerald-200'
                    : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200/80'
                }`}
              >
                <ChevronDown size={18} />
              </div>
            </div>
          </button>

          {openSections.philosophy && (
            <div className="p-5 sm:p-8 pt-0 sm:pt-0 border-t border-stone-100 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-6">
                {/* Left Column: Full Editorial Philosophy Narrative */}
                <div className="lg:col-span-7 space-y-4">
                  <span className="text-xs font-bold text-[#B45309] uppercase tracking-wider block">
                    {product.slug === 'boozliv'
                      ? 'SIDDHA HERITAGE & FORMULATION'
                      : product.storyEyebrow || 'AYURVEDIC PHILOSOPHY & HERITAGE'}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest leading-tight">
                    {product.slug === 'boozliv'
                      ? 'Traditional Siddha Wellness, Naturally Inspired'
                      : product.storyTitle || 'Traditional Ayurvedic Wellness, Naturally Inspired'}
                  </h2>

                  <div className="text-charcoal/85 text-sm sm:text-base leading-relaxed space-y-3.5 font-sans pt-1">
                    {product.slug === 'boozliv' ? (
                      <>
                        <p>
                          Discover the essence of classical Siddha wellness with {product.name}, a specialized botanical formulation inspired by South India&apos;s profound Siddha medical heritage.
                        </p>
                        <p>
                          Rooted in revered Siddha pharmacopoeia, this herbal blend brings together potent botanicals such as Karisalankanni and Keezhanelli, traditionally used for hepatic vitality and metabolic balance.
                        </p>
                        <p>
                          BoozLiv is crafted under the clinical oversight of experienced Siddha researchers, offering pure herbal extracts with zero synthetic additives to help maintain liver equilibrium as part of daily living.
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          Discover the essence of traditional wellness with {product.name}, a thoughtfully developed herbal formulation inspired by India&apos;s rich botanical heritage.
                        </p>
                        <p>
                          Rooted in time-honoured practices, this herbal formulation brings together traditional plant-based ingredients in a convenient format for modern lifestyles, supporting mindful personal care.
                        </p>
                        <p>
                          {product.name} is designed for individuals who appreciate natural, plant-based wellness products and wish to incorporate traditional herbal care into their lifestyle with clinical confidence.
                        </p>
                      </>
                    )}
                  </div>

                  <p className="font-bold text-sm sm:text-base text-forest pt-2 border-l-3 border-botanical pl-3.5">
                    {product.storyClosing || (product.slug === 'boozliv'
                      ? `Embrace the wisdom of Siddha medicine with ${product.name} — where clinical research meets botanical tradition.`
                      : `Embrace the timeless tradition of wellness with ${product.name} — where botanical heritage meets modern care.`)}
                  </p>
                </div>

                {/* Right Column: Featured Description Image Aligned to Full Column Width */}
                <div className="lg:col-span-5 w-full">
                  <div className="relative aspect-[4/5] min-h-[380px] sm:min-h-[440px] w-full rounded-3xl overflow-hidden shadow-md border border-stone-200 group">
                    <Image
                      src={product.storyImage || product.images[0] || '/images/ingredients/traditional-raw-ayurvedic-herbs-mortar.webp'}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 480px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Bottom Overlay Card */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 sm:p-5 rounded-2xl bg-[#16382C]/95 backdrop-blur-md text-white border border-emerald-500/25">
                      <span className="text-xs font-bold text-[#E67E22] uppercase tracking-wider block mb-1">
                        {product.slug === 'boozliv'
                          ? 'SIDDHA CLINICAL PRINCIPLES'
                          : product.principleBadge || 'CLASSICAL FORMULATION PRINCIPLES'}
                      </span>
                      <h4 className="font-serif text-base sm:text-lg font-bold text-white mb-1">
                        {product.slug === 'boozliv'
                          ? 'Liver Vitality • Balancing Pitha & Vatha'
                          : product.principleTitle || 'Balancing Natural Bodily Equilibrium'}
                      </h4>
                      <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                        {product.slug === 'boozliv'
                          ? 'Standardized Siddha botanical extraction verified for optimal bioactive retention and gentle digestive absorption.'
                          : product.principleText || 'Standardized analytical extraction preserving full botanical actives for natural bioavailability.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION 3: Product Benefits */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection('benefits')}
            aria-expanded={openSections.benefits}
            className="w-full p-5 sm:p-7 text-left flex items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 flex items-center justify-center text-forest shrink-0">
                <Sparkles size={22} className="text-emerald-700" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] sm:text-xs font-bold text-botanical uppercase tracking-wider block mb-0.5">
                  {product.featuresEyebrow || 'KEY BENEFITS'}
                </span>
                <h3 className="font-serif text-lg sm:text-2xl font-bold text-forest truncate">
                  {product.featuresTitle || 'Key benefits'}
                </h3>
              </div>
            </div>

            {/* Downward Arrow (+) Indicator */}
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-charcoal-muted">
                {openSections.benefits ? 'Collapse' : 'Tap to expand'}
              </span>
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openSections.benefits
                    ? 'bg-emerald-50 text-emerald-800 rotate-180 border border-emerald-200'
                    : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200/80'
                }`}
              >
                <ChevronDown size={18} />
              </div>
            </div>
          </button>

          {openSections.benefits && (
            <div className="p-5 sm:p-8 pt-0 sm:pt-0 border-t border-stone-100 animate-in fade-in duration-200">
              <div className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100">
                  <div>
                    <span className="text-xs font-bold text-botanical uppercase tracking-wider block mb-1">
                      {product.featuresEyebrow || 'KEY BENEFITS'}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                      {product.featuresTitle || 'Key benefits'}
                    </h3>
                  </div>
                  <span className="px-3.5 py-1.5 rounded-full bg-[#E8EFE6] text-forest text-xs sm:text-sm font-bold self-start sm:self-auto border border-forest/10">
                    {product.featuresBadge || `${product.featureCards?.length || 6} Key Benefits`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {product.featureCards && product.featureCards.length > 0 ? (
                    product.featureCards.map((card, idx) => (
                      <div
                        key={idx}
                        className="p-5 sm:p-6 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-[#FAF7F2] transition-colors flex flex-col justify-between"
                      >
                        <div>
                          <div className="w-10 h-10 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center mb-3 shadow-2xs">
                            {featureIcons[idx % featureIcons.length]}
                          </div>
                          <h4 className="font-serif text-base sm:text-lg font-bold text-forest mb-1.5">
                            {card.title}
                          </h4>
                          <p className="text-sm text-charcoal/80 leading-relaxed font-sans">
                            {card.description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-sm text-charcoal-muted">
                      Features available in product formulation sheet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION 4: Key Ingredients */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection('ingredients')}
            aria-expanded={openSections.ingredients}
            className="w-full p-5 sm:p-7 text-left flex items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 flex items-center justify-center text-forest shrink-0">
                <Leaf size={22} className="text-emerald-700" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] sm:text-xs font-bold text-botanical uppercase tracking-wider block mb-0.5">
                  {product.ingredientsEyebrow || 'INGREDIENTS'}
                </span>
                <h3 className="font-serif text-lg sm:text-2xl font-bold text-forest truncate">
                  {product.ingredientsTitle || 'Ingredients'}
                </h3>
              </div>
            </div>

            {/* Downward Arrow (+) Indicator */}
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-charcoal-muted">
                {openSections.ingredients ? 'Collapse' : 'Tap to expand'}
              </span>
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openSections.ingredients
                    ? 'bg-emerald-50 text-emerald-800 rotate-180 border border-emerald-200'
                    : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200/80'
                }`}
              >
                <ChevronDown size={18} />
              </div>
            </div>
          </button>

          {openSections.ingredients && (
            <div className="p-5 sm:p-8 pt-0 sm:pt-0 border-t border-stone-100 animate-in fade-in duration-200">
              <div className="pt-6">
                <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
                  <span className="text-xs font-bold text-botanical uppercase tracking-wider block mb-1">
                    {product.ingredientsEyebrow || 'INGREDIENTS'}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest mb-2">
                    {product.ingredientsTitle || 'Ingredients'}
                  </h3>
                  <p className="text-sm sm:text-base text-charcoal/70">
                    {product.ingredientsSubtitle || '100% natural herb ingredients with zero synthetic adulterants or harsh chemical additives.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                  {product.ingredientCards?.map((herb, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-stone-200/90 bg-white overflow-hidden shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        {/* Herb Image with Top Badge */}
                        <div className="relative h-28 sm:h-36 bg-stone-100 overflow-hidden">
                          <Image
                            src={herb.image || '/images/ingredients/traditional-raw-ayurvedic-herbs-mortar.webp'}
                            alt={herb.latinName}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#16382C]/90 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                            {herb.badge}
                          </div>
                        </div>

                        {/* Herb Details */}
                        <div className="p-3.5 sm:p-4">
                          <span className="text-xs font-bold text-charcoal-muted uppercase tracking-wider block mb-1 truncate">
                            {herb.commonName}
                          </span>
                          <h4 className="font-serif text-sm sm:text-base font-bold text-forest italic mb-1.5 line-clamp-1">
                            {herb.latinName}
                          </h4>
                          <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans line-clamp-3">
                            {herb.description}
                          </p>
                        </div>
                      </div>

                      {/* Bioactive & Derivative Footer */}
                      <div className="px-3.5 py-2 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-charcoal-muted">
                        <span className="truncate">{herb.bioactive || 'Active Extract'}</span>
                        <span className="truncate ml-1">{herb.derivative || 'Natural'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACCORDION 5: How to Use / Usage Instructions */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection('howToPrepare')}
            aria-expanded={openSections.howToPrepare}
            className="w-full p-5 sm:p-7 text-left flex items-center justify-between gap-4 hover:bg-stone-50/70 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FAF7F2] border border-stone-200/80 flex items-center justify-center text-forest shrink-0">
                <Clock size={22} className="text-botanical" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] sm:text-xs font-bold text-botanical uppercase tracking-wider block mb-0.5">
                  {product.ritualEyebrow || 'HOW TO USE'}
                </span>
                <h3 className="font-serif text-lg sm:text-2xl font-bold text-forest truncate">
                  {product.ritualTitle || 'How to use'}
                </h3>
              </div>
            </div>

            {/* Downward Arrow (+) Indicator */}
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="hidden sm:inline text-xs sm:text-sm font-semibold text-charcoal-muted">
                {openSections.howToPrepare ? 'Collapse' : 'Tap to expand'}
              </span>
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openSections.howToPrepare
                    ? 'bg-emerald-50 text-emerald-800 rotate-180 border border-emerald-200'
                    : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200/80'
                }`}
              >
                <ChevronDown size={18} />
              </div>
            </div>
          </button>

          {openSections.howToPrepare && (
            <div className="p-5 sm:p-8 pt-0 sm:pt-0 border-t border-stone-100 animate-in fade-in duration-200">
              <div className="pt-6">
                <p className="text-sm sm:text-base text-charcoal/70 mb-5 max-w-2xl">
                  {product.ritualSubtitle && !product.ritualSubtitle.toLowerCase().includes('decoction') && !product.ritualSubtitle.toLowerCase().includes('burning delicate')
                    ? product.ritualSubtitle
                    : 'Follow the approved application and dosage directions for optimal results.'}
                </p>

                {(() => {
                  const stepCount = product.ritualSteps?.length || 4;
                  const gridColsClass =
                    stepCount <= 2
                      ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl'
                      : stepCount === 3
                      ? 'grid grid-cols-1 sm:grid-cols-3 gap-4'
                      : stepCount === 4
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
                      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';

                  return (
                    <div className={gridColsClass}>
                      {product.ritualSteps?.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl border border-stone-200/90 bg-[#FAF7F2] flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-8 h-8 rounded-full bg-[#16382C] text-white text-xs font-bold flex items-center justify-center shadow-2xs">
                                {step.stepNumber}
                              </div>
                              <div className="w-7 h-7 rounded-lg bg-white border border-stone-200/80 flex items-center justify-center">
                                {getStepActionIcon(step, idx)}
                              </div>
                            </div>

                            <span className="text-[10px] font-bold text-botanical uppercase tracking-wider block mb-1">
                              STEP {step.stepNumber < 10 ? `0${step.stepNumber}` : step.stepNumber}
                            </span>
                            <h4 className="font-serif text-base font-bold text-forest mb-1.5">
                              {step.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 6. Target Indications, Precautions, Product Specifications (3 Cards) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Target Indications */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-forest font-bold text-xs uppercase tracking-wider mb-3">
              <Compass size={18} className="text-botanical" />
              <span>Target Indications</span>
            </div>
            <p className="text-sm text-charcoal/90 leading-relaxed font-sans mb-4">
              {product.targetIndications}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-medium text-emerald-900 leading-snug">
            {product.targetIndicationsBadge}
          </div>
        </div>

        {/* Card 2: Precautions */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-forest font-bold text-xs uppercase tracking-wider mb-3">
              <ShieldCheck size={18} className="text-amber-700" />
              <span>Precautions</span>
            </div>
            <ul className="space-y-2.5">
              {product.advisoryGuidelines?.map((guide, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-charcoal/80 leading-relaxed">
                  <span className="text-amber-700 font-bold mt-0.5">•</span>
                  <span>{guide}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Card 3: Product Specifications & Delivery */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-forest font-bold text-xs uppercase tracking-wider mb-3">
              <FileText size={18} className="text-botanical" />
              <span>Product Specifications</span>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="text-charcoal-muted">Net Quantity:</span>
                <span className="font-semibold text-forest whitespace-nowrap">{formatPackMeasurement(product.specNetQuantity)}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="text-charcoal-muted">Product Form:</span>
                <span className="font-semibold text-forest">{product.specProductForm}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="text-charcoal-muted">Origin:</span>
                <span className="font-semibold text-forest">{product.specOrigin}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="text-charcoal-muted">Disclosures:</span>
                <span className="font-semibold text-forest">{product.specDisclosures}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-forest text-xs mb-1">
                <Truck size={14} className="text-botanical" />
                <span>Delivery &amp; Returns</span>
              </div>
              <p className="text-[11px] text-charcoal-muted leading-relaxed">
                Free shipping on all prepaid orders across India. 7-day return policy on unopened items.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Credibility Quality Badges Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 bg-white rounded-2xl border border-stone-200/80 shadow-2xs text-center">
        <div className="flex flex-col items-center">
          <Award size={22} className="text-botanical mb-1.5" />
          <span className="text-xs sm:text-sm font-bold text-forest">GMP Certified</span>
          <span className="text-xs text-charcoal-muted">Standardized classical extraction</span>
        </div>
        <div className="flex flex-col items-center">
          <ShieldCheck size={22} className="text-botanical mb-1.5" />
          <span className="text-xs sm:text-sm font-bold text-forest">Heavy-Metal Tested</span>
          <span className="text-xs text-charcoal-muted">Zero pesticides &amp; contaminants</span>
        </div>
        <div className="flex flex-col items-center">
          <Heart size={22} className="text-botanical mb-1.5" />
          <span className="text-xs sm:text-sm font-bold text-forest">Vaidya Formulated</span>
          <span className="text-xs text-charcoal-muted">Clinical practitioners</span>
        </div>
        <div className="flex flex-col items-center">
          <Leaf size={22} className="text-botanical mb-1.5" />
          <span className="text-xs sm:text-sm font-bold text-forest">100% Sourced Flora</span>
          <span className="text-xs text-charcoal-muted">Mature botanicals</span>
        </div>
      </div>
    </div>
  );
};
