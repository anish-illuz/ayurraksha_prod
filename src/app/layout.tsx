import type { Metadata } from 'next';
import '@/styles/globals.css';
import { CartProvider } from '@/lib/cartContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE_CONFIG } from '@/data/siteConfig';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.domain),
  title: {
    default: 'Ayurraksha | Health Supplements for Liver Detox, Pain Relief, Skin Care & More',
    template: '%s | Ayurraksha Online',
  },
  description:
    'Discover Ayurraksha, your trusted source for natural health supplements. Shop our range of products, including liver detox tonics, pain relief oils, heart care solutions, and skin care remedies. Embrace wellness with Ayurraksha today!',
  keywords: [
    'Ayurraksha',
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
  publisher: 'Ayurraksha Online',
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
    siteName: 'Ayurraksha',
    title: 'Ayurraksha | Health Supplements for Liver Detox, Pain Relief, Skin Care & More',
    description:
      'Discover Ayurraksha, your trusted source for natural health supplements. Shop our range of products, including liver detox tonics, pain relief oils, heart care solutions, and skin care remedies.',
    images: [
      {
        url: 'https://www.ayurrakshaonline.com/wp-content/uploads/2024/02/1-1024x1024.jpg',
        width: 1024,
        height: 1024,
        alt: 'Ayurraksha Ayurvedic Formulations',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayurraksha | Natural Ayurvedic Health Supplements',
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
        name: 'Ayurraksha',
        url: SITE_CONFIG.domain,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_CONFIG.domain}/#logo`,
          url: 'https://www.ayurrakshaonline.com/wp-content/uploads/2024/02/AYUR-RAKSHA_Favicon-e1708027496398.png',
          caption: 'Ayurraksha',
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
        name: 'Ayurraksha',
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Jost:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1F2421]">
        <CartProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
