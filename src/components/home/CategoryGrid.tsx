import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { HEALTH_CONCERNS } from '@/data/siteConfig';

// High-resolution authentic imagery for each health concern category
const CONCERN_IMAGES: Record<string, string> = {
  'liver-wellness': 'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/1.png',
  'pain-joints': 'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/AYUR-RAKSHA-OIL_new.png',
  'skin-dermatology': 'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/Ayur-Raksha-Skin-well-pack.webp',
  'heart-cardiac': 'https://www.ayurrakshaonline.com/wp-content/uploads/2024/04/cardiac-combo.webp',
  'digestive-health': 'https://www.ayurrakshaonline.com/wp-content/uploads/2024/01/LaxaHealth-Tea-Tin-1.webp',
  'vascular-veins': 'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/Flow-Well-Pack_1.webp',
  'respiratory-care': 'https://www.ayurrakshaonline.com/wp-content/uploads/2024/01/Esnovate-1-768x768-1.webp',
  'immunity-vitality': 'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/Purna-Sakthi-1.webp',
};

export const CategoryGrid: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2.5">
            Targeted Herbal Care
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
            Shop by Health Concern
          </h2>
          <p className="mt-3 text-base sm:text-lg text-charcoal-muted leading-relaxed">
            Explore Ayurvedic wellness products tailored to your needs.
          </p>
        </div>

        {/* 8 Concern Grid: Card Structure: 1. Image, 2. Heading, 3. Short sentence, 4. Explore Collection link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {HEALTH_CONCERNS.map((c) => {
            const imgSrc = CONCERN_IMAGES[c.slug] || 'https://www.ayurrakshaonline.com/wp-content/uploads/2023/02/1.png';
            return (
              <Link
                key={c.id}
                href={`/concern/${c.slug}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs transition-all duration-300 hover:shadow-card-hover hover:border-primary/40 hover:-translate-y-1"
              >
                {/* 1. Category image at the top */}
                <div className="relative w-full aspect-[4/3] bg-[#F7F9F5] p-5 flex items-center justify-center overflow-hidden">
                  <div className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
                    <Image
                      src={imgSrc}
                      alt={c.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* 2. Category heading below the image */}
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-primary group-hover:text-primary-dark transition-colors leading-snug">
                    {c.name}
                  </h3>

                  {/* 3. One short sentence describing the collection */}
                  <p className="text-sm text-charcoal-muted mt-2 leading-relaxed flex-grow">
                    {c.description}
                  </p>

                  {/* 4. Explore Collection link with a right arrow */}
                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center text-sm font-semibold text-primary group-hover:text-primary-dark">
                    <span>Explore Collection</span>
                    <ArrowRight size={16} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
