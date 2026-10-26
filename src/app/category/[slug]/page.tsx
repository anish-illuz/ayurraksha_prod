import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ShopContent } from '@/components/shop/ShopContent';
import { getAllProducts } from '@/lib/products';
import { PRODUCT_FORMATS, SITE_CONFIG } from '@/data/siteConfig';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return PRODUCT_FORMATS.filter((f) => f.slug !== 'all').map((f) => ({
    slug: f.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const format = PRODUCT_FORMATS.find((f) => f.slug === params.slug);
  if (!format) return {};

  return {
    title: `${format.name} | Ayurraksha Ayurvedic Products`,
    description: `Shop authentic ${format.name.toLowerCase()} prepared using classical Ayurvedic extraction techniques. 100% natural and batch tested.`,
    alternates: {
      canonical: `${SITE_CONFIG.domain}/category/${params.slug}/`,
    },
  };
}

export default function CategoryPage({ params }: PageProps) {
  const format = PRODUCT_FORMATS.find((f) => f.slug === params.slug);
  if (!format) notFound();

  const allProducts = getAllProducts();

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <Breadcrumb
        items={[
          { name: 'Shop', url: '/shop' },
          { name: format.name, url: `/category/${format.slug}` },
        ]}
      />
      <ShopContent
        initialProducts={allProducts}
        title={format.name}
        description={`Explore our range of classical ${format.name.toLowerCase()} formulated for therapeutic depth, balance, and pure botanical vitality.`}
        initialCategory={format.slug}
      />
    </div>
  );
}
