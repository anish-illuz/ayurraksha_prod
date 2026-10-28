'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';

const FAQS = [
  {
    q: 'How are Ayurraksha Ayurvedic formulations prepared?',
    a: 'Our formulations follow classical Ayurvedic pharmacological principles (Samskara and Shodhana) overseen by Dr. Jegajothi Pandian. Herbs are ethically sourced from indigenous growers, inspected for purity, and processed in GMP-compliant facilities under hygienic temperature-controlled environments.',
  },
  {
    q: 'Are these supplements safe to use with my ongoing wellness routine?',
    a: 'Yes, our products are 100% botanical supplements free from synthetic adulterants or corticosteroids. However, if you are currently taking prescription pharmaceutical medications, managing diabetes, pregnant, or nursing, we always recommend consulting your doctor or reaching out to our Ayurvedic support line before starting.',
  },
  {
    q: 'How long does it typically take to feel the benefits?',
    a: 'Ayurveda works holistically by restoring internal balance rather than temporarily masking symptoms. While soothing topical products like Divine Healing Oil or Etioment Cream offer rapid localized comfort within days, internal tonics and packs (like BoozLiv or Flow Well) yield optimal results when taken consistently for 30 to 60 days.',
  },
  {
    q: 'What are the delivery charges and shipping times across India?',
    a: 'We offer 100% Free Shipping on all Prepaid Orders across India. For Cash on Delivery (COD) orders, a nominal delivery convenience fee of ₹100 applies. Metro city orders typically arrive in 2–5 business days, and non-metro locations in 5–7 business days.',
  },
  {
    q: 'Can I speak with a doctor or product specialist before buying?',
    a: `Yes! You can connect directly with our Chennai clinic team via WhatsApp at ${SITE_CONFIG.displayPhone} or email us at ${SITE_CONFIG.email}. We assist customers with formulation selection and dosage guidelines.`,
  },
];

export const TransparencyFaq: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="py-9 sm:py-20 lg:py-24 bg-[#E8EFE7]/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-primary text-xs font-semibold mb-2.5 border border-primary/10 shadow-xs">
            <ShieldCheck size={15} className="text-primary" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base sm:text-lg text-charcoal-muted max-w-xl mx-auto">
            Clear, helpful answers about our natural ingredients, safety, shipping, and doctor consultations.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-stone-200/80 rounded-2xl overflow-hidden transition-all bg-white hover:border-primary/40 shadow-xs"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left text-base sm:text-lg font-bold text-primary transition-colors focus:outline-none"
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
                  <div className="px-5 pb-6 sm:px-6 sm:pb-7 text-sm sm:text-base text-stone-600 leading-relaxed border-t border-stone-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Small Support Section Below the FAQs */}
        <div className="mt-12 p-8 bg-white rounded-2xl border border-stone-200/80 shadow-xs text-center">
          <h3 className="font-heading text-2xl font-bold text-primary">
            Still have questions?
          </h3>
          <p className="mt-2 text-sm sm:text-base text-charcoal-muted max-w-md mx-auto">
            Contact our team for product information and guidance.
          </p>
          <div className="mt-5">
            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 h-12 rounded-[8px] text-sm font-semibold bg-primary hover:bg-primary-dark text-white transition-all shadow-xs active:scale-[0.98]"
            >
              <span>Contact Our Team</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
