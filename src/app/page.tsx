import React from 'react';
import dynamic from 'next/dynamic';
import { Hero } from '@/components/home/Hero';
import { TrustBadges } from '@/components/TrustBadges';

const CategoryGrid = dynamic(
  () => import('@/components/home/CategoryGrid').then((m) => m.CategoryGrid)
);
const Bestsellers = dynamic(
  () => import('@/components/home/Bestsellers').then((m) => m.Bestsellers)
);
const FeaturedVideos = dynamic(
  () => import('@/components/home/FeaturedVideos').then((m) => m.FeaturedVideos)
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
      {/* Primary heading. The hero is a full-bleed banner carousel with no
          visible text, so the page's only <h1> is an accessible heading that
          matches the <title> and gives search + screen readers a topic anchor
          without disturbing the visual design. */}
      <h1 className="sr-only">AyurRaksha — Health Supplements for Liver Detox, Pain Relief &amp; Skin Care</h1>

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Trust & Convenience Strip */}
      <TrustBadges />

      {/* 3-4. Shop by Concern + Bestsellers.
          Mobile (<sm): Bestsellers appears first (closer to the top),
          then Shop by Health Concern.  Desktop (sm+): original order. */}
      <div className="flex flex-col">
        <div className="order-2 sm:order-1">
          <CategoryGrid />
        </div>
        <div className="order-1 sm:order-2">
          <Bestsellers />
        </div>
      </div>

      {/* 4b. Featured Videos Showcase */}
      <FeaturedVideos />

      {/* 7. Real Patient Case Studies & Judge.me Reviews */}
      <ReviewsSection />

      {/* 8. The Wellness Journal Highlights */}
      <JournalSection />

      {/* 9. Ingredients & Clinical Transparency FAQ */}
      <TransparencyFaq />

      {/* 10. Newsletter Dispatch */}
      <Newsletter />
    </>
  );
}
