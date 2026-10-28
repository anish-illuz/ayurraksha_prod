import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { SITE_CONFIG } from '@/data/siteConfig';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  // Prevent duplicate Home if caller already passed it
  const allItems: BreadcrumbItem[] =
    items.length > 0 && (items[0].url === '/' || items[0].name.toLowerCase() === 'home')
      ? items
      : [{ name: 'Home', url: '/' }, ...items];

  // Schema.org BreadcrumbList JSON-LD
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.domain}${item.url}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <nav aria-label="Breadcrumb" className="py-3 px-4 sm:px-6 max-w-7xl mx-auto">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs text-charcoal-muted">
          {allItems.map((item, idx) => {
            const isLast = idx === allItems.length - 1;
            return (
              <li key={`${item.url}-${idx}`} className="flex items-center gap-1.5">
                {idx === 0 ? (
                  <Link
                    href={item.url}
                    className="flex items-center gap-1 text-charcoal hover:text-botanical transition-colors"
                  >
                    <Home size={12} className="text-botanical" />
                    <span>Home</span>
                  </Link>
                ) : isLast ? (
                  <span className="text-charcoal font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-botanical transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
                {!isLast && <ChevronRight size={12} className="text-stone-400" />}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};
