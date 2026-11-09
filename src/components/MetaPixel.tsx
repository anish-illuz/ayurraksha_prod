'use client';

import React, { useEffect, useRef } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { META_PIXEL_ID } from '@/lib/metaPixel';

/**
 * MetaPixel Component for Next.js App Router
 *
 * Responsibilities:
 * 1. Safely injects the Meta Pixel script once on initial load.
 * 2. Initializes Pixel with `fbq('init', pixelId)`.
 * 3. Tracks initial PageView.
 * 4. Listens to App Router client-side route transitions (usePathname, useSearchParams)
 *    and triggers `fbq('track', 'PageView')` for SPA navigation.
 * 5. Prevents duplicate PageView events on the initial mount.
 * 6. Includes noscript fallback tracking image.
 */
export const MetaPixel: React.FC = () => {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || META_PIXEL_ID;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);

  // Track PageView on client-side route changes
  useEffect(() => {
    // Skip initial mount because the inline script already tracked the first PageView
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[Meta Pixel] SPA Route Change PageView: ${pathname}`);
      }
    }
  }, [pathname, searchParams]);

  if (!pixelId) return null;

  return (
    <>
      <Script
        id="meta-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
};
