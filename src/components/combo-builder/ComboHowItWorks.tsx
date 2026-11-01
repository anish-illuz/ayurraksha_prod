import React from 'react';

export const ComboHowItWorks: React.FC = () => {
  return (
    <section className="py-14 sm:py-18 bg-[#F8F7F2] border-b border-[#e4e7df]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.17em] text-[#ab8345] block mb-2">
            A MORE PERSONAL WAY TO SHOP
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#18372b] tracking-[-0.04em]">
            Your combination. Your choice.
          </h2>
          <p className="mt-2.5 text-sm sm:text-[15px] text-[#283830] leading-[1.6]">
            Start with a skin concern for a useful shopping shortlist, or explore all products on your own. Nothing is added without your choice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Step 1 */}
          <div className="bg-white p-7 rounded-[16px] border border-[#e4e7df] shadow-xs">
            <span className="text-[12px] font-extrabold tracking-wider text-[#b59661] block mb-2">
              01 / EXPLORE
            </span>
            <h3 className="font-sans text-base font-bold text-[#18372b] mb-2 leading-snug">
              Tell us what you're looking for
            </h3>
            <p className="text-xs sm:text-[13px] text-[#283830] leading-relaxed">
              Browse common skin-care concerns or select the full catalogue of 13 formulations.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-7 rounded-[16px] border border-[#e4e7df] shadow-xs">
            <span className="text-[12px] font-extrabold tracking-wider text-[#b59661] block mb-2">
              02 / CUSTOMIZE
            </span>
            <h3 className="font-sans text-base font-bold text-[#18372b] mb-2 leading-snug">
              Build your own combination
            </h3>
            <p className="text-xs sm:text-[13px] text-[#283830] leading-relaxed">
              Choose oils, soaps, shampoo, supplements and specialty products. Both soaps can be selected together.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-7 rounded-[16px] border border-[#e4e7df] shadow-xs">
            <span className="text-[12px] font-extrabold tracking-wider text-[#b59661] block mb-2">
              03 / REVIEW
            </span>
            <h3 className="font-sans text-base font-bold text-[#18372b] mb-2 leading-snug">
              See your total instantly
            </h3>
            <p className="text-xs sm:text-[13px] text-[#283830] leading-relaxed">
              Adjust quantities and view product-wise savings before proceeding to checkout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
