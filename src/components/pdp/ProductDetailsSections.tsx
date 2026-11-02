'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Clock,
  Package,
  Heart,
  Award,
  ChevronRight,
  Flame,
  Moon,
  Coffee,
  Check,
  FlaskConical,
  Compass,
  FileText
} from 'lucide-react';
import { Product } from '@/types/product';

interface ProductDetailsSectionsProps {
  product: Product;
}

export const ProductDetailsSections: React.FC<ProductDetailsSectionsProps> = ({ product }) => {
  const whatsappConsultationUrl = `https://wa.me/919940388877?text=${encodeURIComponent(
    `Hello Dr. Jegajothi Pandian, I would like to consult about the dosage and clinical usage of ${product.name}.`
  )}`;

  // Feature cards icons mapping
  const featureIcons = [
    <Sparkles key={0} size={20} className="text-emerald-700" />,
    <Leaf key={1} size={20} className="text-emerald-700" />,
    <Heart key={2} size={20} className="text-emerald-700" />,
    <ShieldCheck key={3} size={20} className="text-emerald-700" />,
    <Package key={4} size={20} className="text-emerald-700" />,
    <Moon key={5} size={20} className="text-emerald-700" />
  ];

  // Step icons mapping
  const stepIcons = [
    <Coffee key={0} size={18} className="text-stone-700" />,
    <FlaskConical key={1} size={18} className="text-stone-700" />,
    <Flame key={2} size={18} className="text-stone-700" />,
    <Moon key={3} size={18} className="text-stone-700" />
  ];

  return (
    <div className="mt-14 space-y-16">
      {/* 1. Authentic Clinical Heritage & Usage Doctor Banner matching 3.png */}
      <div className="bg-[#FAF7F2] rounded-3xl border border-stone-200/90 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#16382C] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Award size={28} className="text-[#C8A25D]" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-botanical uppercase tracking-wider block mb-1">
              AUTHENTIC CLINICAL HERITAGE &amp; USAGE
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-forest leading-snug">
              {product.doctorBannerTitle || 'Formulated Under the Clinical Guidance of Dr. Jegajothi Pandian'}
            </h3>
            <p className="text-xs sm:text-sm text-charcoal/70 mt-1 max-w-2xl leading-relaxed">
              {product.doctorBannerText || 'Combining India’s timeless Ayurvedic texts with modern analytical quality verification and standardized decoction standards.'}
            </p>
          </div>
        </div>

        <a
          href={whatsappConsultationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start md:self-center px-6 py-3 rounded-full bg-[#16382C] hover:bg-[#0E251D] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow whitespace-nowrap flex items-center gap-2"
        >
          <span>Discuss Dosage with Doctor</span>
          <ChevronRight size={16} />
        </a>
      </div>

      {/* 2. Traditional Ayurvedic Wellness, Naturally Inspired Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Editorial Philosophy & Story */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-bold text-[#B45309] uppercase tracking-wider block">
            {product.storyEyebrow || 'AYURVEDIC PHILOSOPHY'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest leading-tight">
            {product.storyTitle || 'Traditional Ayurvedic Wellness, Naturally Inspired'}
          </h2>

          <div className="text-charcoal/80 text-sm sm:text-base leading-relaxed space-y-3.5 font-sans pt-2">
            <p>
              Discover the essence of traditional Ayurvedic wellness with {product.name}, a thoughtfully developed herbal formulation inspired by India&apos;s rich botanical heritage.
            </p>
            <p>
              Rooted in time-honoured Ayurvedic practices, this herbal blend brings together traditional plant-based ingredients in a convenient format for modern lifestyles. It reflects Ayurveda&apos;s holistic approach to wellbeing, where mindful daily habits and botanical traditions form an integral part of personal care.
            </p>
            <p>
              {product.name} is designed for individuals who appreciate natural, plant-based wellness products and wish to incorporate traditional herbal preparations into their lifestyle. Its formulation draws on generations of Ayurvedic knowledge while offering the simplicity and convenience expected from a contemporary wellness product.
            </p>
            <p>
              Whether exploring Ayurveda for the first time or continuing an established herbal wellness routine, {product.name} offers a connection to India&apos;s traditional botanical heritage.
            </p>
          </div>

          <p className="font-bold text-sm sm:text-base text-forest pt-2 border-l-3 border-botanical pl-3">
            {product.storyClosing || `Embrace the timeless tradition of Ayurveda with ${product.name} — where herbal heritage meets modern wellness.`}
          </p>
        </div>

        {/* Right Column: Hero Herb Visual with Charaka Samhita Principles Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-md border border-stone-200">
            <Image
              src={product.images[0] || '/images/banners/prod-boozliv.webp'}
              alt={product.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Bottom Overlay Card */}
            <div className="absolute bottom-4 left-4 right-4 p-5 rounded-2xl bg-[#16382C]/95 backdrop-blur-md text-white border border-emerald-500/20">
              <span className="text-[10px] font-bold text-[#E67E22] uppercase tracking-wider block mb-1">
                {product.principleBadge || 'CHARAKA SAMHITA PRINCIPLES'}
              </span>
              <h4 className="font-serif text-lg font-bold text-white mb-1">
                {product.principleTitle || 'Cleansing Agni • Balancing Vata & Pitta'}
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                {product.principleText || 'Pure botanical blend micro-pulverized for optimal warm water extraction and natural bioavailability.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Key Features & Therapeutic Benefits (6 Cards Grid matching 3.png) */}
      <section className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold text-botanical uppercase tracking-wider block mb-1">
              {product.featuresEyebrow || 'TARGETED BIO-ACTIONS'}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
              {product.featuresTitle || 'Key Features & Therapeutic Benefits'}
            </h3>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-[#E8EFE6] text-forest text-xs font-bold self-start sm:self-auto border border-forest/10">
            {product.featuresBadge || '6 Verified Formulation Pillars'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {product.featureCards && product.featureCards.length > 0 ? (
            product.featureCards.map((card, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-[#FAF7F2] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center mb-4 shadow-2xs">
                    {featureIcons[idx % featureIcons.length]}
                  </div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-forest mb-2">
                    {card.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
                    {card.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-sm text-charcoal-muted">Features available in product formulation sheet.</div>
          )}
        </div>
      </section>

      {/* 4. Botanical Ingredients Breakdown (4 Detailed Herb Cards matching 3.png) */}
      <section className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-botanical uppercase tracking-wider block mb-1">
            {product.ingredientsEyebrow || 'STANDARDIZED ANALYTICAL EXTRACTION'}
          </span>
          <h3 className="font-serif text-3xl font-bold text-forest mb-2">
            {product.ingredientsTitle || 'Botanical Ingredients Breakdown'}
          </h3>
          <p className="text-xs sm:text-sm text-charcoal/70">
            {product.ingredientsSubtitle || '100% natural herb ingredients with zero synthetic adulterants or harsh laxative additives.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {product.ingredientCards?.map((herb, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-stone-200/90 bg-white overflow-hidden shadow-2xs flex flex-col justify-between"
            >
              <div>
                {/* Herb Image with Top Badge */}
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  <Image
                    src={herb.image || product.images[0] || '/images/products/ayur-raksha-detox-tea.webp'}
                    alt={herb.latinName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-[#16382C]/90 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                    {herb.badge}
                  </div>
                </div>

                {/* Herb Details */}
                <div className="p-4 sm:p-5">
                  <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block mb-0.5">
                    {herb.commonName}
                  </span>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-forest italic mb-2">
                    {herb.latinName}
                  </h4>
                  <p className="text-xs text-charcoal/80 leading-relaxed font-sans">
                    {herb.description}
                  </p>
                </div>
              </div>

              {/* Bioactive & Derivative Footer */}
              <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[10px] font-semibold text-charcoal-muted">
                <span>{herb.bioactive || 'Bioactive Extract'}</span>
                <span>{herb.derivative || 'Natural Source'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. The Evening Ritual • How to Prepare (4 Steps Cards matching 3.png) */}
      <section className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-botanical uppercase tracking-wider block mb-1">
            {product.ritualEyebrow || 'PREPARATION & TIMING'}
          </span>
          <h3 className="font-serif text-3xl font-bold text-forest mb-2">
            {product.ritualTitle || 'The Evening Ritual • How to Prepare'}
          </h3>
          <p className="text-xs sm:text-sm text-charcoal/70">
            {product.ritualSubtitle || 'Simple 5-minute decoction method to extract full water-soluble botanical actives without burning delicate herbal polyphenols.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {product.ritualSteps?.map((step, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl border border-stone-200/90 bg-[#FAF7F2] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#16382C] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                    {step.stepNumber}
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-white border border-stone-200/80 flex items-center justify-center">
                    {stepIcons[idx % stepIcons.length]}
                  </div>
                </div>

                <span className="text-[10px] font-bold text-botanical uppercase tracking-wider block mb-1">
                  STEP 0{step.stepNumber}
                </span>
                <h4 className="font-serif text-base font-bold text-forest mb-2">
                  {step.title}
                </h4>
                <p className="text-xs text-charcoal/80 leading-relaxed font-sans">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Target Indications, Advisory Guidelines, Product Specifications (3 Cards) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Target Indications */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-forest font-bold text-xs uppercase tracking-wider mb-4">
              <Compass size={18} className="text-botanical" />
              <span>Target Indications</span>
            </div>
            <p className="text-xs sm:text-sm text-charcoal/90 leading-relaxed font-sans mb-4">
              {product.targetIndications}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-900 leading-snug">
            {product.targetIndicationsBadge}
          </div>
        </div>

        {/* Card 2: Advisory Guidelines */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-forest font-bold text-xs uppercase tracking-wider mb-4">
              <ShieldCheck size={18} className="text-amber-700" />
              <span>Advisory Guidelines</span>
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

        {/* Card 3: Product Specifications */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-forest font-bold text-xs uppercase tracking-wider mb-4">
              <FileText size={18} className="text-botanical" />
              <span>Product Specifications</span>
            </div>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="text-charcoal-muted">Net Quantity:</span>
                <span className="font-semibold text-forest">{product.specNetQuantity}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="text-charcoal-muted">Product Form:</span>
                <span className="font-semibold text-forest">{product.specProductForm}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="text-charcoal-muted">Manufacturing Origin:</span>
                <span className="font-semibold text-forest">{product.specOrigin}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-stone-100">
                <span className="text-charcoal-muted">Standard Disclosures:</span>
                <span className="font-semibold text-forest">{product.specDisclosures}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Credibility Quality Badges Strip matching 3.png */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-stone-200/80 shadow-2xs text-center">
        <div className="flex flex-col items-center">
          <Award size={22} className="text-botanical mb-1.5" />
          <span className="text-xs font-bold text-forest">GMP Certified</span>
          <span className="text-[10px] text-charcoal-muted">Standardized classical extraction</span>
        </div>
        <div className="flex flex-col items-center">
          <ShieldCheck size={22} className="text-botanical mb-1.5" />
          <span className="text-xs font-bold text-forest">Heavy-Metal Tested</span>
          <span className="text-[10px] text-charcoal-muted">Zero pesticides &amp; contaminants</span>
        </div>
        <div className="flex flex-col items-center">
          <Heart size={22} className="text-botanical mb-1.5" />
          <span className="text-xs font-bold text-forest">Vaidya Formulated</span>
          <span className="text-[10px] text-charcoal-muted">Curated by clinical practitioners</span>
        </div>
        <div className="flex flex-col items-center">
          <Leaf size={22} className="text-botanical mb-1.5" />
          <span className="text-xs font-bold text-forest">100% Sourced Flora</span>
          <span className="text-[10px] text-charcoal-muted">Wildcrafted mature botanicals</span>
        </div>
      </div>
    </div>
  );
};
