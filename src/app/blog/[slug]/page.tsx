import { formatArticleDate } from '@/lib/dates';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Clock, Share2 } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import postsData from '@/data/posts.json';
import { BlogPost } from '@/types/product';
import { SITE_CONFIG } from '@/data/siteConfig';

const allPosts: BlogPost[] = postsData as BlogPost[];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return allPosts.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} | AyurRaksha Clinical Journal`,
    description: post.excerpt,
    alternates: {
      canonical: `${SITE_CONFIG.domain}/blog/${post.slug}/`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${SITE_CONFIG.domain}/blog/${post.slug}/`,
      type: 'article',
      images: [
        {
          url: post.image || 'https://www.ayurrakshaonline.com/wp-content/uploads/2025/06/Ayurvedic-tonic-for-liver.jpg',
          width: 800,
          height: 500,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogPostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  // Rank Math Schema Article JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AyurRaksha',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.ayurrakshaonline.com/wp-content/uploads/2024/02/AYUR-RAKSHA_Favicon-e1708027496398.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.domain}/blog/${post.slug}/`,
    },
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Breadcrumb
        items={[
          { name: 'Journal', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-botanical hover:underline mb-6"
        >
          <ArrowLeft size={14} />
          <span>Back to All Stories &amp; Articles</span>
        </Link>

        {/* Article Header */}
        <header className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-muted">
            <span className="flex items-center gap-1 text-botanical font-semibold">
              <Calendar size={14} />
              <span>{formatArticleDate(post.date)}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <User size={14} />
              <span>{post.author}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              <span>3 min read</span>
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-forest leading-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed font-serif italic border-l-2 border-botanical pl-4 py-1">
            {post.excerpt}
          </p>
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xs border border-stone-200 mb-10 bg-white">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover"
            />
          </div>
        )}

        {/* Article Body Content */}
        <div
          className="prose prose-stone max-w-none text-charcoal leading-relaxed space-y-4 text-sm sm:text-base [&>p]:mb-4 [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-forest [&>h2]:mt-8 [&>h2]:mb-3 [&>h3]:font-serif [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-forest [&>h3]:mt-6 [&>h3]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>strong]:text-forest"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Article Footer & Consultation Callout */}
        <footer className="mt-12 pt-8 border-t border-stone-200">
          <div className="bg-sage-light p-6 rounded-2xl border border-border-botanical flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-base font-bold text-forest">
                Have a Similar Health Concern?
              </h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                Consult with our Ayurvedic clinical team in Chennai.
              </p>
            </div>
            <a
              href={SITE_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-button text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors flex-shrink-0"
            >
              <span>Consult on WhatsApp</span>
            </a>
          </div>
        </footer>
      </article>
    </div>
  );
}
