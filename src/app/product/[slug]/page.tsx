import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProductGallery } from '@/components/pdp/ProductGallery';
import { ProductInfo } from '@/components/pdp/ProductInfo';
import { StickyMobileBar } from '@/components/pdp/StickyMobileBar';
import { ProductCard } from '@/components/ProductCard';
import { TrustBadges } from '@/components/TrustBadges';
import { getAllProducts, getProductBySlug, getRelatedProducts } from '@/lib/products';
import { SITE_CONFIG } from '@/data/siteConfig';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) return {};

  const title = `${product.name} | AyurRaksha Online`;
  const desc = product.shortDescription || `${product.name} - authentic classical Ayurvedic formulation by AyurRaksha. Free shipping on prepaid orders.`;

  return {
    title,
    description: desc.slice(0, 160),
    alternates: {
      canonical: `${SITE_CONFIG.domain}/product/${product.slug}/`,
    },
    openGraph: {
      title,
      description: desc.slice(0, 160),
      url: `${SITE_CONFIG.domain}/product/${product.slug}/`,
      images: [
        {
          url: product.images[0] || 'https://www.ayurrakshaonline.com/wp-content/uploads/2024/02/1-1024x1024.jpg',
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const relatedProducts = getRelatedProducts(product, 4);

  // Rank Math Schema.org Product & Offer JSON-LD
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.cleanDescription || product.shortDescription,
    sku: product.sku || `AYUR-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'AyurRaksha',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_CONFIG.domain}/product/${product.slug}/`,
      priceCurrency: 'INR',
      price: product.price.toString(),
      priceValidUntil: '2027-12-31',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'AyurRaksha Online',
      },
    },
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      {/* Product Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { name: 'Shop', url: '/shop' },
          { name: product.healthConcerns[0] || 'Products', url: '/shop' },
          { name: product.name, url: `/product/${product.slug}` },
        ]}
      />

      {/* Main PDP Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-6 lg:sticky lg:top-28">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right: Product Purchase Information */}
          <div className="lg:col-span-6">
            <ProductInfo product={product} />
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="my-12">
        <TrustBadges />
      </div>

      {/* Complementary & Related Formulations */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="border-t border-stone-200/80 pt-10">
            <div className="mb-8">
              <span className="text-xs font-semibold text-botanical uppercase tracking-wider block mb-1">
                Synergistic Formulations
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
                Recommended to Pair With {product.name}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile Fixed Sticky Add-to-Cart Bar */}
      <StickyMobileBar product={product} />
    </div>
  );
}
