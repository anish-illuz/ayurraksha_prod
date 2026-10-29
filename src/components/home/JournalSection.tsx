import { formatArticleDate } from '@/lib/dates';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen } from 'lucide-react';
import postsData from '@/data/posts.json';
import { BlogPost } from '@/types/product';

const posts: BlogPost[] = postsData.slice(0, 3) as BlogPost[];

export const JournalSection: React.FC = () => {
  return (
    <section className="py-9 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:gap-6 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage text-primary text-xs font-semibold mb-2.5">
              <BookOpen size={14} className="text-primary" />
              <span>Health Guides &amp; Ayurvedic Tips</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
              From Our Health Blog
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#37443D] max-w-xl">
              Helpful wellness guides, herbal health tips, and recovery stories from our clinical team in Chennai.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-primary hover:underline transition-colors"
          >
            <span>Read All Articles (20)</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col bg-[#FAF9F5] rounded-2xl border border-stone-200/80 overflow-hidden group hover:shadow-card-hover hover:border-primary/40 transition-all"
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

              <div className="flex flex-col flex-grow p-4 sm:p-7">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  {formatArticleDate(post.date)}
                </span>

                <h3 className="font-heading text-xl sm:text-2xl font-bold text-primary group-hover:text-primary-dark transition-colors mb-2.5 leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-sm text-[#37443D] line-clamp-3 leading-relaxed flex-grow">
                  {post.excerpt}
                </p>

                <div className="mt-5 pt-4 border-t border-stone-200/70 flex items-center text-sm font-semibold text-primary group-hover:text-primary-dark">
                  <span>Read Full Article</span>
                  <ArrowRight size={16} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
