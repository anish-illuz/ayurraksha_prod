import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import '@/styles/globals.css';
import { CartProvider } from '@/lib/cartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OrderAttributionTracker } from '@/components/OrderAttributionTracker';
import { SITE_CONFIG } from '@/data/siteConfig';

const ExitIntentDiscountModal = dynamic(
  () => import('@/components/ExitIntentDiscountModal').then((mod) => mod.ExitIntentDiscountModal)
);

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['600'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.domain),
  title: {
    default: 'AyurRaksha | Health Supplements for Liver Detox, Pain Relief, Skin Care & More',
    template: '%s | AyurRaksha Online',
  },
  description:
    'Discover AyurRaksha, your trusted source for natural health supplements. Shop our range of products, including liver detox tonics, pain relief oils, heart care solutions, and skin care remedies. Embrace wellness with AyurRaksha today!',
  keywords: [
    'AyurRaksha',
    'Ayurvedic wellness',
    'BoozLiv',
    'Divine Healing Oil',
    'Purna Sakthi Tonic',
    'Dr. Jegajothi Pandian',
    'herbal supplements India',
    'liver detox tonic',
    'pain relief oil',
    'skin well soap',
    'cardiac care ayurveda',
  ],
  authors: [{ name: 'Dr. Jegajothi Pandian & VPrime Innovations' }],
  creator: 'VPrime Innovations',
  publisher: 'AyurRaksha Online',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_CONFIG.domain,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.domain,
    siteName: 'AyurRaksha',
    title: 'AyurRaksha | Health Supplements for Liver Detox, Pain Relief, Skin Care & More',
    description:
      'Discover AyurRaksha, your trusted source for natural health supplements. Shop our range of products, including liver detox tonics, pain relief oils, heart care solutions, and skin care remedies.',
    images: [
      {
        url: 'https://www.ayurrakshaonline.com/wp-content/uploads/2024/02/1-1024x1024.jpg',
        width: 1024,
        height: 1024,
        alt: 'AyurRaksha Ayurvedic Formulations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AyurRaksha | Natural Ayurvedic Health Supplements',
    description: 'Shop doctor-formulated herbal solutions for liver detox, pain relief, and holistic health.',
    images: ['https://www.ayurrakshaonline.com/wp-content/uploads/2024/02/1-1024x1024.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Rank Math Schema structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_CONFIG.domain}/#organization`,
        name: 'AyurRaksha',
        url: SITE_CONFIG.domain,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_CONFIG.domain}/#logo`,
          url: 'https://www.ayurrakshaonline.com/wp-content/uploads/2024/02/AYUR-RAKSHA_Favicon-e1708027496398.png',
          caption: 'AyurRaksha',
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: `${SITE_CONFIG.address.street}, ${SITE_CONFIG.address.area}`,
          addressLocality: SITE_CONFIG.address.city,
          addressRegion: SITE_CONFIG.address.state,
          postalCode: SITE_CONFIG.address.postalCode,
          addressCountry: 'IN',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: SITE_CONFIG.phone,
          contactType: 'customer service',
          areaServed: 'IN',
          availableLanguage: ['en', 'ta', 'hi'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_CONFIG.domain}/#website`,
        url: SITE_CONFIG.domain,
        name: 'AyurRaksha',
        publisher: {
          '@id': `${SITE_CONFIG.domain}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_CONFIG.domain}/shop?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <head>
        {/* Responsive LCP Hero Image Preload: Mobile loads only mobile banner, Desktop loads only desktop banner */}
        <link
          rel="preload"
          as="image"
          href="/images/banners/boozliv-mobile.webp"
          media="(max-width: 767px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/banners/boozliv.webp"
          media="(min-width: 768px)"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#26352D] font-sans antialiased">
        <Suspense fallback={null}>
          <OrderAttributionTracker />
        </Suspense>
        <CartProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <ExitIntentDiscountModal />
        </CartProvider>
      </body>
    </html>
  );
}
