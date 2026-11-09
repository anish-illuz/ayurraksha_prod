import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/data/siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/catalog/meta-feed.xml', '/api/catalog/meta-feed'],
        disallow: ['/cart', '/checkout', '/api/'],
      },
      {
        userAgent: 'facebookexternalhit',
        allow: ['/', '/catalog/meta-feed.xml', '/api/catalog/meta-feed', '/product/'],
      },
      {
        userAgent: 'Facebot',
        allow: ['/', '/catalog/meta-feed.xml', '/api/catalog/meta-feed', '/product/'],
      },
    ],
    sitemap: `${SITE_CONFIG.domain}/sitemap.xml`,
  };
}
