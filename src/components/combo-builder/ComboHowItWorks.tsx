import React from 'react';
import { Compass, Sliders, CheckCircle2 } from 'lucide-react';

export const ComboHowItWorks: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-[#F8F7F2] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#ab8345] block mb-2">
            A More Personal Way to Shop
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-normal text-[#123b2d] tracking-tight">
            Your combination. Your choice.
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-stone-600 leading-relaxed">
            Start with an optional skin concern for a curated shopping shortlist, or explore the full catalogue on your own. Nothing is ever added without your active choice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-xs hover:border-[#b49a70]/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold tracking-wider text-[#b59661]">
                01 / EXPLORE
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#E8EFE7] flex items-center justify-center text-[#204A3B]">
                <Compass size={18} />
              </div>
            </div>
            <h3 className="font-heading text-lg font-bold text-[#18372b] mb-2">
              Tell us what you are looking for
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Browse common skin concerns for a targeted product shortlist, or explore all 13 products in the collection.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-xs hover:border-[#b49a70]/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold tracking-wider text-[#b59661]">
                02 / CUSTOMIZE
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#E8EFE7] flex items-center justify-center text-[#204A3B]">
                <Sliders size={18} />
              </div>
            </div>
            <h3 className="font-heading text-lg font-bold text-[#18372b] mb-2">
              Build your own combination
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Choose body oils, soaps, shampoos, internal supplements, and specialty creams. Both soaps can be selected together or individually.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 shadow-xs hover:border-[#b49a70]/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-extrabold tracking-wider text-[#b59661]">
                03 / REVIEW
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#E8EFE7] flex items-center justify-center text-[#204A3B]">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <h3 className="font-heading text-lg font-bold text-[#18372b] mb-2">
              See your total instantly
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Adjust quantities at any stage, view genuine product-wise savings, and proceed directly to secure checkout with verified pricing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
