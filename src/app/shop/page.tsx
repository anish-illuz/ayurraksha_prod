import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ShopContent } from '@/components/shop/ShopContent';
import { fetchLiveCatalogProducts } from '@/lib/cms';
import { SITE_CONFIG } from '@/data/siteConfig';

export const metadata: Metadata = {
  title: 'Shop All Ayurvedic Products & Health Formulations',
  description:
    'Browse AyurRaksha complete collection of classical Ayurvedic health supplements, tonics, therapeutic oils, herbal powders, and holistic packs. Free prepaid shipping across India.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/shop/`,
  },
};

export default async function ShopPage() {
  const products = await fetchLiveCatalogProducts();

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <Breadcrumb items={[{ name: 'Shop All Formulations', url: '/shop' }]} />
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-charcoal-muted">Loading formulations...</div>}>
        <ShopContent
          initialProducts={products}
          title="All Ayurvedic Formulations"
          description="Explore authentic classical herbal supplements, restorative oils, and specialized packs developed for everyday vitality."
        />
      </Suspense>
    </div>
  );
}
