import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProductGallery } from '@/components/pdp/ProductGallery';
import { ProductInfo } from '@/components/pdp/ProductInfo';
import { MobileProductHeader } from '@/components/pdp/MobileProductHeader';
import { ProductDetailsSections } from '@/components/pdp/ProductDetailsSections';
import { StickyMobileBar } from '@/components/pdp/StickyMobileBar';
import { ProductCard } from '@/components/ProductCard';
import { getAllProducts, getProductBySlug, getRelatedProducts } from '@/lib/products';
import { SITE_CONFIG } from '@/data/siteConfig';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
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

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
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
    <div className="bg-[#FAF7F2] min-h-screen pb-12">
      {/* Product Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Clean Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <div className="pb-1.5 sm:pb-2 border-b border-stone-200/60">
          <Breadcrumb
            items={[
              { name: 'Home', url: '/' },
              { name: 'Shop', url: '/shop' },
              { name: product.healthConcerns[0] || 'Digestive & Gut Health', url: '/shop' },
              { name: product.name, url: `/product/${product.slug}` },
            ]}
          />
        </div>
      </div>

      {/* Main PDP Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 lg:gap-10 items-start">
          {/* Mobile Above-the-Fold: Prominent Title, Rating, Key Benefit, Price, Discount & Add to Cart */}
          <div className="order-1 lg:hidden w-full">
            <MobileProductHeader product={product} />
          </div>

          {/* Left: Product Image Gallery */}
          <div className="order-2 lg:order-1 lg:col-span-6 lg:sticky lg:top-28 w-full">
            <ProductGallery images={product.images} productName={product.name} product={product} />
          </div>

          {/* Right: Product Purchase Information (Desktop & Detailed Options) */}
          <div className="order-3 lg:order-2 lg:col-span-6 w-full">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Redesigned Complete Product Details Sections Matching Reference 3.png */}
        <ProductDetailsSections product={product} />
      </div>

      {/* Complementary & Related Formulations */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          <div className="border-t border-stone-200/80 pt-6 sm:pt-8">
            <div className="mb-4 sm:mb-6">
              <span className="text-[11px] font-semibold text-botanical uppercase tracking-wider block mb-0.5">
                Synergistic Formulations
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                Recommended to Pair With {product.name}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky Mobile Add to Cart Bar */}
      <StickyMobileBar product={product} />
    </div>
  );
}
