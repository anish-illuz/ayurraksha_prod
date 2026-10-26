import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen } from 'lucide-react';
import postsData from '@/data/posts.json';
import { BlogPost } from '@/types/product';

const posts: BlogPost[] = postsData.slice(0, 3) as BlogPost[];

export const JournalSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-white border-b border-border-botanical">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage text-forest text-xs font-semibold mb-2">
              <BookOpen size={14} className="text-botanical" />
              <span>Health Guides &amp; Ayurvedic Tips</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-forest tracking-tight">
              From Our Health Blog
            </h2>
            <p className="mt-2 text-sm text-charcoal-muted max-w-xl">
              Helpful wellness guides, herbal health tips, and recovery stories from our clinical team in Chennai.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-forest hover:text-botanical transition-colors"
          >
            <span>Read All Articles (20)</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col bg-[#FDFBF7] rounded-card border border-stone-200/80 overflow-hidden group hover:shadow-card-hover transition-all"
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
                <span className="text-[11px] font-semibold text-botanical uppercase tracking-wider mb-2">
                  {post.date}
                </span>

                <h3 className="font-serif text-base sm:text-lg font-bold text-forest group-hover:text-botanical transition-colors line-clamp-2 mb-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-xs text-charcoal-muted line-clamp-3 leading-relaxed flex-grow">
                  {post.excerpt}
                </p>

                <div className="mt-4 pt-3 border-t border-stone-200 flex items-center text-xs font-bold text-forest group-hover:text-botanical">
                  <span>Read Full Article</span>
                  <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
