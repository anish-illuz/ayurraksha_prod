import React from 'react';
import dynamic from 'next/dynamic';
import { Hero } from '@/components/home/Hero';
import { TrustBadges } from '@/components/TrustBadges';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { Bestsellers } from '@/components/home/Bestsellers';
import { BrandStory } from '@/components/home/BrandStory';

const FeaturedCombos = dynamic(
  () => import('@/components/home/FeaturedCombos').then((m) => m.FeaturedCombos)
);
const ReviewsSection = dynamic(
  () => import('@/components/home/ReviewsSection').then((m) => m.ReviewsSection)
);
const TransparencyFaq = dynamic(
  () => import('@/components/home/TransparencyFaq').then((m) => m.TransparencyFaq)
);
const JournalSection = dynamic(
  () => import('@/components/home/JournalSection').then((m) => m.JournalSection)
);
const Newsletter = dynamic(
  () => import('@/components/home/Newsletter').then((m) => m.Newsletter)
);

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
