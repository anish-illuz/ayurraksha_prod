import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, ShoppingBag, Leaf } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-[#FAF7F2] min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xs space-y-5">
        <div className="w-16 h-16 rounded-full bg-sage-light text-botanical flex items-center justify-center mx-auto">
          <Leaf size={32} />
        </div>

        <span className="text-xs font-bold text-terracotta uppercase tracking-wider block">
          404 • Page Not Found
        </span>

        <h1 className="font-serif text-3xl font-bold text-forest">
          This Path Could Not Be Found
        </h1>

        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
          The page or formulation you are looking for may have been moved or updated. Let us help guide you back to wellness.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-button text-xs font-semibold bg-forest hover:bg-forest-light text-white transition-colors"
          >
            <Home size={14} />
            <span>Return Home</span>
          </Link>
          <Link
            href="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-button text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-charcoal transition-colors"
          >
            <ShoppingBag size={14} />
            <span>Browse Formulations</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
