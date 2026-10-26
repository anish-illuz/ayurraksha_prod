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
    <section className="py-16 sm:py-20 bg-forest text-ivory">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-light text-emerald-300 text-sm font-bold mb-4">
          <Mail size={16} />
          <span>Exclusive Subscriber Offer</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Get 10% Off Your First Order
        </h2>

        <p className="mt-3.5 text-sm sm:text-base text-stone-300 max-w-xl mx-auto leading-relaxed">
          Join the Ayurraksha family for natural wellness tips, seasonal health guides, and exclusive subscriber deals. No spam, unsubscribe anytime.
        </p>

        {isSubmitted ? (
          <div className="mt-8 p-5 bg-emerald-900/60 border border-emerald-600 rounded-2xl inline-flex items-center gap-3 text-base font-semibold text-emerald-200">
            <CheckCircle size={20} />
            <span>Thank you for joining our community! We will be in touch soon.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-lg mx-auto flex flex-col sm:flex-row gap-3">
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
              className="flex-grow px-5 py-3.5 rounded-xl text-sm sm:text-base bg-forest-dark border border-forest-light text-white placeholder:text-stone-400 focus:outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm sm:text-base font-bold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors shadow-xs"
            >
              <span>Subscribe</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        <p className="mt-3.5 text-xs text-stone-400">
          We respect your privacy. You can unsubscribe at any time with a single click.
        </p>
      </div>
    </section>
  );
};
