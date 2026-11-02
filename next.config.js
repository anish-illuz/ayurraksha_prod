/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
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
