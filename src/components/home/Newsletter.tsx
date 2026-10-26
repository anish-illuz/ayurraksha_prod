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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-light text-emerald-300 text-xs font-semibold mb-4">
          <Mail size={14} />
          <span>Ayurraksha Botanical Dispatch</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Guidance for Mindful, Natural Living
        </h2>

        <p className="mt-3 text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
          Subscribe to receive seasonal Ayurvedic health tips, ingredient spotlights, and announcements on newly formulated restorative packs. No spam, ever.
        </p>

        {isSubmitted ? (
          <div className="mt-8 p-4 bg-emerald-900/60 border border-emerald-600 rounded-card inline-flex items-center gap-2.5 text-sm font-semibold text-emerald-200">
            <CheckCircle size={18} />
            <span>Thank you for joining our community! We will be in touch soon.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-2.5">
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
              className="flex-grow px-4 py-3 rounded-button text-xs sm:text-sm bg-forest-dark border border-forest-light text-white placeholder:text-stone-400 focus:outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-button text-xs sm:text-sm font-bold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
            >
              <span>Subscribe</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}

        <p className="mt-3 text-[11px] text-stone-400">
          We respect your privacy. You can unsubscribe at any time with a single click.
        </p>
      </div>
    </section>
  );
};
