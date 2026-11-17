'use client';

import React from 'react';
import Script from 'next/script';

/**
 * AnalyticsScripts Component
 * Initializes global dataLayer, Google Tag Manager (GTM), and GA4 direct measurement.
 * Meta Pixel is managed separately via MetaPixel component for SPA route awareness.
 */
/**
 * Default GTM container for the AyurRaksha storefront.
 * Shipped as a build-time fallback (same pattern as META_PIXEL_ID in
 * lib/metaPixel.ts) so tracking works even if NEXT_PUBLIC_GTM_ID is not set
 * in the deployment environment; the env var always wins when present.
 */
const GTM_CONTAINER_ID = 'GTM-K9BMR9S';

export const AnalyticsScripts: React.FC = () => {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || GTM_CONTAINER_ID;
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;

  return (
    <>
      {/* 1. Global dataLayer & gtag Initialization */}
      {/* beforeInteractive: emitted in the static HTML <head> at parse time,
          so GTM starts as early as possible (GTM's recommended placement). */}
      <Script id="analytics-init" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
        `}
      </Script>

      {/* 2. Google Tag Manager (GTM) Container */}
      {gtmId && (
        <>
          <Script id="gtm-container" strategy="beforeInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}

      {/* 3. Google Analytics 4 (GA4) Direct Measurement */}
      {ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-config" strategy="afterInteractive">
            {`
              gtag('config', '${ga4Id}', {
                page_path: window.location.pathname,
                send_page_view: true
              });
            `}
          </Script>
        </>
      )}
    </>
  );
};
