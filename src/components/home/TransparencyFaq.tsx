'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ShieldCheck, ArrowRight, ExternalLink, Phone } from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';

interface FaqItem {
  q: string;
  answerParagraphs: string[];
  link?: {
    href: string;
    label: string;
    isExternal?: boolean;
  };
  contactNote?: string;
}

const FAQS: FaqItem[] = [
  {
    q: '1. What makes AyurRaksha different from other wellness brands?',
    answerParagraphs: [
      'Rooted in Ayurveda. Inspired by nature. Made for your everyday wellness.',
      'AyurRaksha brings traditional Ayurvedic knowledge together with thoughtfully developed herbal formulations for modern lifestyles.',
      'From liver wellness and skincare to joint comfort, digestion and everyday vitality, explore a diverse collection of products suited to different wellness needs.',
      'Discover Ayurveda made accessible, with professional guidance available whenever you need it.',
    ],
  },
  {
    q: '2. How do I find the right AyurRaksha product for my needs?',
    answerParagraphs: [
      'Finding your ideal wellness essential is easier than you think!',
      'Simply explore our Shop by Health Concern collections to discover products relevant to your needs. Browse individual formulations, explore our curated wellness packs or speak with our team for personalised assistance.',
      'Whether you’re looking for skincare, digestive wellness, liver support or everyday vitality, AyurRaksha makes discovering your options simple.',
      'Explore our collections and find the care that suits you.',
    ],
  },
  {
    q: '3. Can I create my own personalised skincare combo?',
    answerParagraphs: [
      'Absolutely! Your skin is unique, and your skincare routine should be too.',
      'With AyurRaksha’s Build Your Own Skin Care Combo, you can explore 13 Ayurvedic skincare and wellness essentials and create a combination suited to your preferences.',
      'Choose from herbal oils, soaps, creams and complementary wellness products, adjust quantities and see your combo price update instantly.',
      'You’re always in control—nothing is added without your choice. Not sure where to begin? Explore products by skin concern or seek guidance from an Ayurvedic doctor.',
    ],
    link: {
      href: '/combo-builder/skin-care',
      label: 'Start Building Your Skin Care Combo →',
    },
  },
  {
    q: '4. Has BoozLiv been clinically studied and what evidence supports it?',
    answerParagraphs: [
      'Yes! BoozLiv has been evaluated in published clinical research conducted at SRM Medical College Hospital & Research Centre, Chennai.',
      'A 12-week randomised controlled study involving 68 adults with alcohol-related liver disease evaluated BoozLiv alongside standard medical treatment.',
      'The researchers reported encouraging improvements in several liver-function markers, including SGOT, SGPT and bilirubin, compared with standard treatment alone.',
      'The research was registered with the Clinical Trials Registry–India (CTRI/2022/08/044978) and published in Gastroenterology & Endoscopy in 2024.',
      'These are promising initial findings, although larger studies are still needed. The research does not establish BoozLiv as a cure or a replacement for prescribed treatment. Study registration and ethics approval are also distinct from product-quality certifications. Discover the published research behind BoozLiv and make an informed choice.',
    ],
    link: {
      href: 'https://www.mmcpharmaceuticals.com/wp-content/uploads/2024/09/Gastroenterology-Endoscopy.pdf',
      label: 'View Published BoozLiv Clinical Study (PDF)',
      isExternal: true,
    },
  },
  {
    q: '5. Are AyurRaksha products made with natural herbal ingredients?',
    answerParagraphs: [
      'Nature and traditional botanical knowledge are at the heart of AyurRaksha.',
      'Our range features Ayurvedic formulations made with carefully selected herbs and plant-derived ingredients.',
      'Each product has its own formulation and purpose. You can explore its key ingredients, product information and usage directions directly on the product page.',
      'Discover what’s inside and choose your wellness essentials with confidence.',
    ],
  },
  {
    q: '6. Are AyurRaksha products suitable for everyone?',
    answerParagraphs: [
      'Your wellbeing is personal, and your wellness routine should be too.',
      'AyurRaksha offers different formulations for different needs. The right choice depends on the product, its ingredients and your individual circumstances.',
      'Need guidance? Our consultation service can help you make an informed choice. Every wellness journey is different.',
    ],
  },
  {
    q: '7. Do you offer free shipping and delivery across India?',
    answerParagraphs: [
      'Yes! Enjoy FREE shipping on all prepaid AyurRaksha orders across India.',
      'Orders are generally processed within 1–2 business days. Estimated delivery times are: Metro cities: 2–5 business days | Non-metro locations: 5–7 business days.',
      'Cash on Delivery is also available with a ₹100 shipping charge. Once your order is dispatched, you’ll receive tracking information so you can follow your delivery.',
      'Shop your AyurRaksha favourites with convenient doorstep delivery.',
    ],
  },
  {
    q: '8. Can I speak with an Ayurvedic doctor before placing my order?',
    answerParagraphs: [
      'Of course! You don’t have to navigate your wellness choices alone.',
      'AyurRaksha offers a free doctor consultation booking service so you can seek guidance on product suitability, ingredients and appropriate usage.',
      'Whether you’re exploring BoozLiv, our skincare essentials or curated wellness packs, getting professional advice can help you make an informed decision.',
    ],
    link: {
      href: SITE_CONFIG.whatsappUrl,
      label: 'Book Your Free Doctor Consultation →',
      isExternal: true,
    },
    contactNote: 'For assistance, call +91 99403 88877.',
  },
];

export const TransparencyFaq: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-8 sm:py-16 lg:py-20 bg-[#E8EFE7]/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with tightened spacing and adjusted size */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-primary text-xs font-semibold mb-2.5 border border-primary/10 shadow-xs">
            <ShieldCheck size={14} className="text-primary" />
            <span>Questions? We&apos;re Here to Help.</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#37443D] max-w-xl mx-auto leading-relaxed">
            Everything you need to know to shop with confidence and discover the right AyurRaksha essentials.
          </p>
        </div>

        {/* 8 Accordion Items */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-stone-200/80 rounded-2xl overflow-hidden transition-all bg-white hover:border-primary/40 shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-base sm:text-lg font-bold text-primary transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4 leading-snug">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-stone-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm sm:text-[15px] text-[#37443D] leading-relaxed border-t border-stone-100 pt-4 space-y-2.5 font-sans">
                    {faq.answerParagraphs.map((para, pIdx) => (
                      <p key={pIdx}>{para}</p>
                    ))}

                    {faq.link && (
                      <div className="pt-2">
                        {faq.link.isExternal ? (
                          <a
                            href={faq.link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark underline decoration-2 underline-offset-4"
                          >
                            <span>{faq.link.label}</span>
                            <ExternalLink size={14} />
                          </a>
                        ) : (
                          <Link
                            href={faq.link.href}
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark underline decoration-2 underline-offset-4"
                          >
                            <span>{faq.link.label}</span>
                            <ArrowRight size={14} />
                          </Link>
                        )}
                      </div>
                    )}

                    {faq.contactNote && (
                      <div className="pt-1 flex items-center gap-2 text-xs sm:text-sm font-semibold text-charcoal">
                        <Phone size={14} className="text-primary" />
                        <a href="tel:+919940388877" className="hover:text-primary underline">
                          {faq.contactNote}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Small Support Section Below the FAQs */}
        <div className="mt-8 sm:mt-10 p-6 sm:p-7 bg-white rounded-2xl border border-stone-200/80 shadow-xs text-center">
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-primary">
            Still have questions?
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto">
            Contact our clinical and customer support team in Chennai for personalized product guidance.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-[8px] text-xs sm:text-sm font-semibold bg-primary hover:bg-primary-dark text-white transition-all shadow-xs active:scale-[0.98]"
            >
              <span>Contact Our Team</span>
            </a>
            <a
              href="tel:+919940388877"
              className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-[8px] text-xs sm:text-sm font-semibold bg-[#FAF9F5] border border-stone-300 hover:border-primary text-primary transition-all shadow-xs"
            >
              <Phone size={14} />
              <span>+91 99403 88877</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
