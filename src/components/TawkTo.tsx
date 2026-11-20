'use client';

import React from 'react';
import Script from 'next/script';

/**
 * TawkTo Component for Next.js App Router
 *
 * Responsibilities:
 * 1. Injects the Tawk.to chat loader script once on initial load.
 * 2. Tawk.to then mounts its own floating chat bubble in the DOM.
 *
 * The loader uses a global `Tawk_API` object + an injected async script tag,
 * so it is safe to run client-side after the DOM is ready (afterInteractive).
 * Tawk.to's own loader already guards against double-initialization, and
 * `next/script` with a stable `id` guarantees single injection.
 */
export const TawkTo: React.FC = () => {
  return (
    <Script
      id="tawk-to-loader"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
          (function () {
            var s1 = document.createElement('script'),
              s0 = document.getElementsByTagName('script')[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/63f2dc8031ebfa0fe7ee2aa6/1gpmaqmak';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
          })();
        `,
      }}
    />
  );
};
