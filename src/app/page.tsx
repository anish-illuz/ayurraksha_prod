import React from 'react';
import { Hero } from '@/components/home/Hero';
import { TrustBadges } from '@/components/TrustBadges';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { Bestsellers } from '@/components/home/Bestsellers';
import { BrandStory } from '@/components/home/BrandStory';
import { FeaturedCombos } from '@/components/home/FeaturedCombos';
import { TransparencyFaq } from '@/components/home/TransparencyFaq';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { JournalSection } from '@/components/home/JournalSection';
import { Newsletter } from '@/components/home/Newsletter';

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trust & Convenience Strip */}
      <TrustBadges />

      {/* 3. Shop by Wellness Concern / Category */}
      <CategoryGrid />

      {/* 4. Verified Bestsellers Showcase */}
      <Bestsellers />

      {/* 5. Editorial Brand Story & Clinical Formulation */}
      <BrandStory />

      {/* 6. Featured Combos & Health Packs */}
      <FeaturedCombos />

      {/* 7. Real Patient Case Studies & Judge.me Reviews */}
      <ReviewsSection />

      {/* 8. Ingredients & Clinical Transparency FAQ */}
      <TransparencyFaq />

      {/* 9. The Wellness Journal Highlights */}
      <JournalSection />

      {/* 10. Newsletter Dispatch */}
      <Newsletter />
    </>
  );
}
