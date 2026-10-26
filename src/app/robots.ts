import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/data/siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/cart', '/checkout', '/api/'],
      },
    ],
    sitemap: `${SITE_CONFIG.domain}/sitemap.xml`,
  };
}
