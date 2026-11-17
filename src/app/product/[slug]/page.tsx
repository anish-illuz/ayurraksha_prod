import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProductGallery } from '@/components/pdp/ProductGallery';
import { ProductInfo } from '@/components/pdp/ProductInfo';
import { MobileProductHeader } from '@/components/pdp/MobileProductHeader';
import { ProductDetailsSections } from '@/components/pdp/ProductDetailsSections';
import { ProductReviews } from '@/components/pdp/ProductReviews';
import { BoozlivClinicalResearch, BoozlivVideoHub } from '@/components/pdp/BoozlivSpecialSections';
import { DivineHealingOilVideoHub } from '@/components/pdp/DivineHealingOilVideoHub';
import { StickyMobileBar } from '@/components/pdp/StickyMobileBar';
import { ProductCard } from '@/components/ProductCard';
import { PDPProvider } from '@/context/PDPContext';
import {
  fetchCmsCommerce,
  fetchDynamicProduct,
  resolveRecommendedProducts,
} from '@/lib/cms';
import { SITE_CONFIG } from '@/data/siteConfig';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Product pages are fully dynamic: both the bundled slug and the CMS
// post_name alias resolve on demand, and every request re-fetches CMS
// content (ACF fields, WooCommerce commerce) so a backend update — price,
// stock, description — shows immediately. Static pre-rendering was removed
// on purpose: generateStaticParams would bake CMS content into the build.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchDynamicProduct(slug);
  if (!product) return {};

  const title = `${product.name} | AyurRaksha Online`;
  // SEO copy comes strictly from the CMS Product Short Description. When the
  // backend field is empty we emit no meta description rather than fabricated
  // marketing copy.
  const desc = product.shortDescription || '';

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
          url: product.images[0] || 'https://cms.ayurrakshaonline.com/wp-content/uploads/2024/02/1-1024x1024.jpg',
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
  // Fetch complete dynamic product directly from cms.ayurrakshaonline.com
  const product = await fetchDynamicProduct(slug);
  if (!product) notFound();

  // Map recommended products dynamically from ACF `recommended_products` field.
  // Each recommended card is enriched with its own live CMS commerce data
  // (price, image, stock, rating) so the section never surfaces stale bundled
  // values - the CMS stays the source of truth for recommended products too.
  const recommendedBase = resolveRecommendedProducts(
    product.recommendedProductsText || product.acf?.recommended_products,
    product,
    4
  );
  const recommendedProducts = await Promise.all(
    recommendedBase.map(async (rel) => {
      const relCommerce = await fetchCmsCommerce(rel.slug);
      if (!relCommerce) return rel;
      return {
        ...rel,
        name: relCommerce.name || rel.name,
        price: relCommerce.price,
        regularPrice: relCommerce.regularPrice,
        salePrice: relCommerce.salePrice,
        discountPercent: Math.max(
          0,
          Math.round(((relCommerce.regularPrice - relCommerce.price) / (relCommerce.regularPrice || 1)) * 100),
        ),
        onSale: relCommerce.onSale,
        inStock: relCommerce.inStock,
        rating: relCommerce.rating > 0 ? relCommerce.rating : rel.rating,
        reviewCount: relCommerce.reviewCount,
        images:
          relCommerce.images.length > 0 ? relCommerce.images : rel.images,
        cmsProductId: relCommerce.cmsProductId,
      };
    })
  );

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
    <PDPProvider product={product}>
      <div className="bg-[#FAF7F2] min-h-screen pb-12">
        {/* Product Schema Injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />

        {/* Clean Breadcrumb Navigation - the category crumb is the live
            WooCommerce category name/slug from the CMS, never a hardcoded
            fallback. When the product has no category the crumb is omitted. */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
          <div className="pb-1.5 sm:pb-2 border-b border-stone-200/60">
            <Breadcrumb
              items={[
                { name: 'Home', url: '/' },
                { name: 'Shop', url: '/shop' },
                ...(product.categories[0]
                  ? [{
                      name: product.categories[0],
                      url: product.categorySlugs[0] ? `/category/${product.categorySlugs[0]}` : '/shop',
                    }]
                  : []),
                { name: product.name, url: `/product/${product.slug}` },
              ]}
            />
          </div>
        </div>

        {/* Main PDP Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 lg:gap-10 items-start">
            {/* Left: Product Image Gallery (Visible early on both mobile and desktop) */}
            <div className="order-1 lg:order-1 lg:col-span-6 lg:sticky lg:top-28 w-full">
              <ProductGallery images={product.images} productName={product.name} product={product} />
            </div>

            {/* Mobile Purchase Header: Title, Rating, Pack Selector, Price, and Add to Cart */}
            <div className="order-2 lg:hidden w-full">
              <MobileProductHeader product={product} />
            </div>

            {/* Right: Product Purchase Information (Desktop) */}
            <div className="order-3 lg:order-2 lg:col-span-6 w-full">
              <ProductInfo product={product} />
            </div>
          </div>

          {/* BoozLiv-only: peer-reviewed clinical research banner, placed directly
              below the purchase area and above the product information. */}
          {product.slug === 'boozliv' && <BoozlivClinicalResearch />}

          {/* Redesigned Complete Product Details Sections Matching Reference 3.png */}
          <ProductDetailsSections product={product} />

          {/* Customer reviews: the star aggregate is the live WooCommerce
              average from the CMS (rating / reviewCount); the section hides
              itself when the backend reports no reviews. */}
          <ProductReviews product={product} />

          {/* BoozLiv-only: Doctor Insights video hub, kept below the details so the
              purchase path stays uncluttered. */}
          {product.slug === 'boozliv' && <BoozlivVideoHub />}

          {/* Divine Healing Oil only: practitioner-led usage guidance videos in
              Tamil, English, Hindi and Telugu. */}
          {product.slug === 'divine-healing-oil' && <DivineHealingOilVideoHub />}
        </div>

        {/* Recommended Products dynamically mapped from WordPress ACF `recommended_products` */}
        {recommendedProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
            <div className="border-t border-stone-200/80 pt-6 sm:pt-8">
              <div className="mb-4 sm:mb-6">
                <span className="text-[11px] font-semibold text-botanical uppercase tracking-wider block mb-0.5">
                  Recommended Products
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest">
                  Complete Your Wellness Routine
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
                {recommendedProducts.map((rel) => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Sticky Mobile Add to Cart Bar */}
        <StickyMobileBar product={product} />
      </div>
    </PDPProvider>
  );
}
