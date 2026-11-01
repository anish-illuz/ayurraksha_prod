import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/products';
import { HEALTH_CONCERNS, PRODUCT_FORMATS, SITE_CONFIG } from '@/data/siteConfig';
import postsData from '@/data/posts.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.domain;
  const now = new Date().toISOString();

  // Static core routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/combo-builder/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shipping-policy/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/refund-returns/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms-of-service/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy-policy/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Health Concerns
  HEALTH_CONCERNS.forEach((c) => {
    routes.push({
      url: `${baseUrl}/concern/${c.slug}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // Product Formats
  PRODUCT_FORMATS.filter((f) => f.slug !== 'all').forEach((f) => {
    routes.push({
      url: `${baseUrl}/category/${f.slug}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 44 Products
  const products = getAllProducts();
  products.forEach((p) => {
    routes.push({
      url: `${baseUrl}/product/${p.slug}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  });

  // 20 Blog Posts
  postsData.forEach((post) => {
    routes.push({
      url: `${baseUrl}/blog/${post.slug}/`,
      lastModified: post.date ? new Date(post.date).toISOString() : now,
      changeFrequency: 'monthly',
      priority: 0.65,
    });
  });

  return routes;
}
