import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ShopContent } from '@/components/shop/ShopContent';
import { getAllProducts } from '@/lib/products';
import { SITE_CONFIG } from '@/data/siteConfig';

export const metadata: Metadata = {
  title: 'Shop All Ayurvedic Products & Health Formulations',
  description:
    'Browse AyurRaksha complete collection of 44 classical Ayurvedic health supplements, tonics, therapeutic oils, herbal powders, and holistic packs. Free prepaid shipping across India.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/shop/`,
  },
};

export default function ShopPage() {
  const products = getAllProducts();

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <Breadcrumb items={[{ name: 'Shop All Formulations', url: '/shop' }]} />
      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16 text-center text-charcoal-muted">Loading formulations...</div>}>
        <ShopContent
          initialProducts={products}
          title="All Ayurvedic Formulations"
          description="Explore 44 scientifically prepared, doctor-formulated classical herbal supplements, restorative oils, and specialized packs developed for everyday vitality."
        />
      </Suspense>
    </div>
  );
}
