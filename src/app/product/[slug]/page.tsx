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
import { getProductBySlug, getStaticParamSlugs } from '@/lib/products';
import { fetchCmsProduct, fetchCmsCommerce, resolveRecommendedProducts } from '@/lib/cms';
import { SITE_CONFIG } from '@/data/siteConfig';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Pre-render every Product at both URL shapes it can be reached at: the
// bundled slug and the CMS post_name alias (when they differ). This is what
// lets a CMS-native URL such as /product/ayurraksha-hair-well-.../ render
// alongside the storefront slug /product/hair-well-.../, keeping the PDP
// catalog in sync with the live CMS without re-hardcoding any content.
export async function generateStaticParams() {
  return getStaticParamSlugs().map((slug) => ({
    slug,
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

  // Fetch live ACF content AND live commerce data (prices, variations,
  // images, stock, ratings) directly from the WordPress CMS backend.
  // Both come from cms.ayurrakshaonline.com - the single source of truth.
  const [cmsData, cmsCommerce] = await Promise.all([
    fetchCmsProduct(slug),
    fetchCmsCommerce(slug),
  ]);
  const cmsLoaded = Boolean(cmsData);
  const commerceLoaded = Boolean(cmsCommerce);

  // Map live WooCommerce variations (cms.ayurrakshaonline.com) into the PDP
  // variant model so per-pack pricing, availability and the cart variation id
  // all come from the backend rather than the bundled snapshot.
  const liveVariants = commerceLoaded
    ? cmsCommerce!.variantDetails.map((v) => ({
        id: v.id,
        name: v.variationLabel.replace(/^Packs:\s*/i, '').trim() || `Variation ${v.id}`,
        slug: String(v.id),
        price: Number.isFinite(v.price) && v.price > 0 ? v.price : undefined,
        regularPrice: Number.isFinite(v.regularPrice) && v.regularPrice > 0 ? v.regularPrice : undefined,
        salePrice: Number.isFinite(v.salePrice) && v.salePrice > 0 ? v.salePrice : undefined,
        discountPercent:
          v.regularPrice > v.price
            ? Math.round(((v.regularPrice - v.price) / v.regularPrice) * 100)
            : 0,
        inStock: v.inStock,
      }))
    : undefined;

  // Merge CMS backend data dynamically with the selected product.
  // When a live CMS row loaded, every content + commerce field is read strictly
  // from the CMS - an empty field stays empty so the matching PDP section hides
  // instead of surfacing a stale bundled snapshot. Only when the CMS row itself
  // could not be fetched do we fall back to the bundled products.json content
  // (offline / first-render resilience).
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
    // Live commerce fields: prices, variation pricing, images, stock, ratings.
    // Only applied when the CMS commerce fetch succeeded; otherwise the bundled
    // products.json values are retained as the offline fallback.
    price: commerceLoaded ? cmsCommerce!.price : baseProduct.price,
    regularPrice: commerceLoaded ? cmsCommerce!.regularPrice : baseProduct.regularPrice,
    salePrice: commerceLoaded ? cmsCommerce!.salePrice : baseProduct.salePrice,
    discountPercent: commerceLoaded
      ? Math.max(0, Math.round(((cmsCommerce!.regularPrice - cmsCommerce!.price) / (cmsCommerce!.regularPrice || 1)) * 100))
      : baseProduct.discountPercent,
    onSale: commerceLoaded ? cmsCommerce!.onSale : baseProduct.onSale,
    inStock: commerceLoaded ? cmsCommerce!.inStock : baseProduct.inStock,
    rating: commerceLoaded && cmsCommerce!.rating > 0 ? cmsCommerce!.rating : baseProduct.rating,
    reviewCount: commerceLoaded ? cmsCommerce!.reviewCount : baseProduct.reviewCount,
    sku: commerceLoaded && cmsCommerce!.sku ? cmsCommerce!.sku : baseProduct.sku,
    images: commerceLoaded && cmsCommerce!.images.length > 0 ? cmsCommerce!.images : baseProduct.images,
    variants: commerceLoaded ? (liveVariants && liveVariants.length > 0 ? liveVariants : []) : baseProduct.variants,
    cmsProductId: commerceLoaded ? cmsCommerce!.cmsProductId : (baseProduct as any).cmsProductId,
  };

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
