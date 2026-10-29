import { formatArticleDate } from '@/lib/dates';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import postsData from '@/data/posts.json';
import { BlogPost } from '@/types/product';
import { SITE_CONFIG } from '@/data/siteConfig';

const allPosts: BlogPost[] = postsData as BlogPost[];

export const metadata: Metadata = {
  title: 'Clinical Case Studies & Ayurvedic Wellness Journal',
  description:
    'Read real customer recovery stories, patient testimonials, and Ayurvedic educational guides on liver detox, joint mobility, skin health, and natural living.',
  alternates: {
    canonical: `${SITE_CONFIG.domain}/blog/`,
  },
};

export default function BlogListPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <Breadcrumb items={[{ name: 'Clinical Journal & Stories', url: '/blog' }]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-botanical uppercase tracking-wider block mb-2">
            The AyurRaksha Journal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest">
            Clinical Insights &amp; Real Recovery Stories
          </h1>
          <p className="mt-2 text-sm text-charcoal-muted leading-relaxed">
            Read verified patient recovery testimonials, Ayurvedic pharmacology guides, and holistic lifestyle practices published by our team in Chennai.
          </p>
        </div>

        {/* 20 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col bg-white rounded-card border border-stone-200/80 overflow-hidden group hover:shadow-card-hover transition-all"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="relative block w-full aspect-[16/10] overflow-hidden bg-stone-100"
              >
                <Image
                  src={post.image || 'https://www.ayurrakshaonline.com/wp-content/uploads/2025/06/Ayurvedic-tonic-for-liver.jpg'}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              <div className="flex flex-col flex-grow p-6">
                <div className="flex items-center justify-between text-[11px] text-charcoal-muted mb-2">
                  <span className="font-semibold text-botanical">{formatArticleDate(post.date)}</span>
                  <span>Verified Case Study</span>
                </div>

                <h2 className="font-serif text-base sm:text-lg font-bold text-forest group-hover:text-botanical transition-colors mb-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>

                <p className="text-xs text-charcoal-muted line-clamp-3 leading-relaxed flex-grow">
                  {post.excerpt}
                </p>

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-charcoal-muted text-[11px]">{post.author}</span>
                  <div className="flex items-center text-xs font-bold text-forest group-hover:text-botanical">
                    <span>Read Story</span>
                    <ArrowRight size={13} className="ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
