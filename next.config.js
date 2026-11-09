/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.ayurrakshaonline.com',
      },
      {
        protocol: 'https',
        hostname: 'ayurrakshaonline.com',
      },
      {
        protocol: 'https',
        hostname: 'cms.ayurrakshaonline.com',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/images/:all*(svg|jpg|jpeg|png|webp|avif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/refund_returns',
        destination: '/refund-returns',
        permanent: true,
      },
      {
        source: '/refund_returns/',
        destination: '/refund-returns',
        permanent: true,
      },
      {
        source: '/terms-and-conditions',
        destination: '/terms-of-service',
        permanent: true,
      },
      {
        source: '/terms-and-conditions/',
        destination: '/terms-of-service',
        permanent: true,
      },
      {
        source: '/terms',
        destination: '/terms-of-service',
        permanent: true,
      },
      {
        source: '/terms/',
        destination: '/terms-of-service',
        permanent: true,
      },
      {
        source: '/cancellation-policy',
        destination: '/refund-returns',
        permanent: true,
      },
      {
        source: '/cancellation-policy/',
        destination: '/refund-returns',
        permanent: true,
      },
      {
        source: '/cancellation-and-refund-policy',
        destination: '/refund-returns',
        permanent: true,
      },
      {
        source: '/cancellation-and-refund-policy/',
        destination: '/refund-returns',
        permanent: true,
      },
      {
        source: '/shipping-and-delivery-policy',
        destination: '/shipping-policy',
        permanent: true,
      },
      {
        source: '/shipping-and-delivery-policy/',
        destination: '/shipping-policy',
        permanent: true,
      },
      {
        source: '/delivery-policy',
        destination: '/shipping-policy',
        permanent: true,
      },
      {
        source: '/delivery-policy/',
        destination: '/shipping-policy',
        permanent: true,
      },
      {
        source: '/medical-disclaimer',
        destination: '/disclaimer',
        permanent: true,
      },
      {
        source: '/medical-disclaimer/',
        destination: '/disclaimer',
        permanent: true,
      },
      {
        source: '/privacy',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/privacy/',
        destination: '/privacy-policy',
        permanent: true,
      },
      {
        source: '/product/ayurraksha-foot-bath-powder-300g',
        destination: '/product/ayur-raksha-foot-bath-powder',
        permanent: true,
      },
      {
        source: '/product/ayurraksha-foot-bath-powder-300g/',
        destination: '/product/ayur-raksha-foot-bath-powder',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/about-us/',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/about-us-2',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/about-us-2/',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/products',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/products/',
        destination: '/shop',
        permanent: true,
      },
      {
        source: '/health-packs',
        destination: '/category/health-packs',
        permanent: true,
      },
      {
        source: '/health-packs/',
        destination: '/category/health-packs',
        permanent: true,
      },
      {
        source: '/dr-jegajothi-pandian',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/dr-jegajothi-pandian/',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/doctor-consultation',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/doctor-consultation/',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/our-locations',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/our-locations/',
        destination: '/contact',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
