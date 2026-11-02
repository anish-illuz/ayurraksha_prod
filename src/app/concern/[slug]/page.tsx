import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ShopContent } from '@/components/shop/ShopContent';
import { getAllProducts, getProductsByConcern } from '@/lib/products';
import { HEALTH_CONCERNS, SITE_CONFIG } from '@/data/siteConfig';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return HEALTH_CONCERNS.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const concern = HEALTH_CONCERNS.find((c) => c.slug === slug);
  if (!concern) return {};

  return {
    title: `${concern.name} | Ayurvedic Supplements & Formulations`,
    description: `${concern.description} Shop doctor-formulated natural remedies by AyurRaksha. Free shipping on prepaid orders.`,
    alternates: {
      canonical: `${SITE_CONFIG.domain}/concern/${slug}/`,
    },
  };
}

export default async function ConcernPage({ params }: PageProps) {
  const { slug } = await params;
  const concern = HEALTH_CONCERNS.find((c) => c.slug === slug);
  if (!concern) notFound();

  const allProducts = getAllProducts();

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <Breadcrumb
        items={[
          { name: 'Shop', url: '/shop' },
          { name: concern.name, url: `/concern/${concern.slug}` },
        ]}
      />
      <ShopContent
        initialProducts={allProducts}
        title={concern.name}
        description={concern.description}
        initialConcern={concern.slug}
      />
    </div>
  );
}
