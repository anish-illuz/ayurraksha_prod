import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProductGallery } from '@/components/pdp/ProductGallery';
import { ProductInfo } from '@/components/pdp/ProductInfo';
import { MobileProductHeader } from '@/components/pdp/MobileProductHeader';
import { ProductDetailsSections } from '@/components/pdp/ProductDetailsSections';
import { StickyMobileBar } from '@/components/pdp/StickyMobileBar';
import { ProductCard } from '@/components/ProductCard';
import { PDPProvider } from '@/context/PDPContext';
import { getAllProducts, getProductBySlug } from '@/lib/products';
import { fetchCmsProduct, resolveRecommendedProducts } from '@/lib/cms';
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
  const baseProduct = getProductBySlug(slug);
  if (!baseProduct) notFound();

  // Fetch live dynamic ACF data and content directly from WordPress CMS (cms.ayurrakshaonline.com)
  const cmsData = await fetchCmsProduct(slug);
  const cmsLoaded = Boolean(cmsData);

  // Merge CMS backend data dynamically with the selected product.
  // The WordPress CMS is the single source of truth for all product-related
  // content. When a live CMS row loaded, every section field is read
  // strictly from the CMS - an empty field stays empty so the matching PDP
  // section hides instead of surfacing a stale bundled snapshot. Only when
  // the CMS row itself could not be fetched do we fall back to the bundled
  // products.json content (offline / first-render resilience).
  const product = {
    ...baseProduct,
    cmsLoaded,
    description: cmsLoaded ? cmsData!.description : baseProduct.description,
    shortDescription: cmsLoaded ? cmsData!.shortDescription : baseProduct.shortDescription,
    acf: {
      ...(baseProduct.acf || {}),
      ...(cmsData?.acf || {}),
    },
    keyBenefits: cmsLoaded ? cmsData!.acf?.key_benefits || '' : baseProduct.keyBenefits || baseProduct.acf?.key_benefits,
    ingredientsText: cmsLoaded ? cmsData!.acf?.ingredients || '' : baseProduct.ingredientsText || baseProduct.acf?.ingredients,
    howToUseText: cmsLoaded ? cmsData!.acf?.how_to_use || '' : baseProduct.howToUseText || baseProduct.acf?.how_to_use,
    careBeforeUse: cmsLoaded ? cmsData!.acf?.care_before_use || '' : baseProduct.careBeforeUse || baseProduct.acf?.care_before_use,
    productSpecifications:
      cmsLoaded
        ? cmsData!.acf?.product_specifications || ''
        : baseProduct.productSpecifications || baseProduct.acf?.product_specifications,
    recommendedProductsText:
      cmsLoaded
        ? cmsData!.acf?.recommended_products || ''
        : baseProduct.recommendedProductsText || baseProduct.acf?.recommended_products,
  };

  // Map recommended products dynamically from ACF `recommended_products` field
  const recommendedProducts = resolveRecommendedProducts(
    product.recommendedProductsText || product.acf?.recommended_products,
    product,
    4
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

          {/* Redesigned Complete Product Details Sections Matching Reference 3.png */}
          <ProductDetailsSections product={product} />
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
