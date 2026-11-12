import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { HEALTH_CONCERNS } from '@/data/siteConfig';

// High-resolution authentic imagery for each health concern category from master design document
const CONCERN_IMAGES: Record<string, string> = {
  'liver-wellness': '/images/categories/cat-liver-wellness.webp',
  'pain-joints': '/images/categories/cat-pain-joints.webp',
  'skin-dermatology': '/images/categories/cat-skin-dermatology.webp',
  'heart-cardiac': '/images/categories/cat-heart-cardiac.webp',
  'digestive-health': '/images/categories/cat-digestive-health.webp',
  'vascular-veins': '/images/categories/cat-vascular-veins.webp',
  'respiratory-care': '/images/categories/cat-respiratory-care.webp',
  'immunity-vitality': '/images/categories/cat-immunity-vitality.webp',
};

// Approved category titles matching master brand design
const CONCERN_TITLES: Record<string, string> = {
  'liver-wellness': 'Liver Wellness & Detox',
  'pain-joints': 'Joint & Muscle Care',
  'skin-dermatology': 'Skin & Botanical Care',
  'heart-cardiac': 'Heart & Cardiovascular',
  'digestive-health': 'Digestive & Gut Health',
  'vascular-veins': 'Circulation & Vein Care',
  'respiratory-care': 'Respiratory Wellness',
  'immunity-vitality': 'Vitality & Rejuvenation',
};

// Approved category descriptions from master design document
const CONCERN_DESCRIPTIONS: Record<string, string> = {
  'liver-wellness': 'Your liver works hard every day. Give it the herbal care it deserves.',
  'pain-joints': 'Keep moving, keep doing what you love. Discover herbal care for everyday comfort.',
  'skin-dermatology': "Love the skin you're in! Discover botanical care for a naturally radiant glow.",
  'heart-cardiac': 'Show your heart some love with thoughtfully crafted Ayurvedic wellness essentials.',
  'digestive-health': 'A happier gut starts with mindful care. Discover herbal support for digestive wellness.',
  'vascular-veins': 'Your legs carry you through life. Give them the care and attention they deserve.',
  'respiratory-care': 'Every breath matters. Discover traditional herbal care for respiratory wellness.',
  'immunity-vitality': 'Bring back the joy of feeling your best with Ayurvedic vitality and wellness essentials.',
};

export const CategoryGrid: React.FC = () => {
  return (
    <section className="py-9 sm:py-20 lg:py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-16">
          <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2.5">
            Targeted Herbal Care
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
            Shop by Health Concern
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#37443D] leading-relaxed">
            Explore Ayurvedic wellness products tailored to your needs.
          </p>
        </div>

        {/* 8 Concern Grid: Card Structure: 1. Category scene image, 2. Heading, 3. Short sentence, 4. Explore Collection link */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {HEALTH_CONCERNS.map((c) => {
            const imgSrc = CONCERN_IMAGES[c.slug] || `/images/categories/${c.slug}.webp`;
            const title = CONCERN_TITLES[c.slug] || c.name;
            const description = CONCERN_DESCRIPTIONS[c.slug] || c.description;

            return (
              <Link
                key={c.id}
                href={`/concern/${c.slug}`}
                prefetch={false}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs transition-all duration-300 hover:shadow-card-hover hover:border-primary/40 hover:-translate-y-1"
              >
                {/* 1. Category scene image at the top */}
                <div className="relative w-full aspect-[2/1] sm:aspect-[4/3] bg-[#F7F9F5] overflow-hidden">
                  <div className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-105">
                    <Image
                      src={imgSrc}
                      alt={title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 380px, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center"
                    />
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  {/* 2. Category heading below the image */}
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-primary group-hover:text-primary-dark transition-colors leading-snug">
                    {title}
                  </h3>

                  {/* 3. One short sentence describing the collection */}
                  <p className="text-sm text-[#37443D] mt-2 leading-relaxed flex-grow">
                    {description}
                  </p>

                  {/* 4. Explore Collection link with right arrow */}
                  <div className="mt-3 pt-3 sm:mt-5 sm:pt-4 border-t border-stone-100 flex items-center text-sm font-semibold text-primary group-hover:text-primary-dark transition-colors">
                    <span>Explore Collection</span>
                    <ArrowRight
                      size={16}
                      className="ml-2 transform transition-transform duration-200 group-hover:translate-x-1"
                    />
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
