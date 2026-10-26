'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FAF9F5] text-charcoal">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage text-primary text-xs font-semibold mb-3">
          <Mail size={14} />
          <span>Exclusive Subscriber Offer</span>
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-primary">
          Get 10% Off Your First Order
        </h2>

        <p className="mt-2.5 text-sm sm:text-base text-charcoal-muted max-w-lg mx-auto leading-relaxed">
          Join the Ayurraksha family for natural wellness tips, seasonal health guides, and exclusive subscriber deals.
        </p>

        {isSubmitted ? (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl inline-flex items-center gap-2.5 text-sm font-semibold text-emerald-800">
            <CheckCircle size={18} />
            <span>Thank you for joining our community! We will be in touch soon.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-2.5">
            <label htmlFor="newsletter-email" className="sr-only">
              Email Address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="flex-grow px-4 h-12 rounded-[8px] text-sm bg-white border border-stone-300 text-charcoal placeholder:text-stone-400 focus:outline-none focus:border-primary shadow-xs"
            />
            <button
              type="submit"
              className="h-12 inline-flex items-center justify-center gap-2 px-6 rounded-[8px] text-sm font-semibold bg-primary hover:bg-primary-dark text-white transition-colors shadow-xs active:scale-[0.98]"
            >
              <span>Subscribe</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        <p className="mt-3 text-xs text-charcoal-muted">
          We respect your privacy. You can unsubscribe at any time with a single click.
        </p>
      </div>
    </section>
  );
};
