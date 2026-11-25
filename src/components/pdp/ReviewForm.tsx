'use client';

import React, { useState } from 'react';
import { Star, PencilLine, Send, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

interface ReviewFormProps {
  productSlug: string;
  /** Human product name for copy. */
  productName: string;
}

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string; warn?: boolean };

/**
 * "Write a review" box for the PDP. Submissions go to the local
 * /api/reviews/submit route, which creates the review on the WordPress
 * backend (cms.ayurrakshaonline.com) through the Customer Reviews for
 * WooCommerce plugin's store. On success the page reloads so the freshly
 * published review shows up in the live review list.
 */
export const ReviewForm: React.FC<ReviewFormProps> = ({ productSlug, productName }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [review, setReview] = useState('');
  const [state, setState] = useState<SubmitState>({ kind: 'idle' });

  const displayStar = hoverStar || rating;

  const handleOpen = () => {
    setOpen(true);
    if (state.kind === 'success') {
      // After a successful publish the form is irrelevant; the page is
      // about to reload anyway.
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.kind === 'submitting') return;

    if (rating < 1) {
      setState({ kind: 'error', message: 'Please select a star rating first.', warn: true });
      return;
    }
    if (name.trim().length < 2) {
      setState({ kind: 'error', message: 'Please enter your name.', warn: true });
      return;
    }
    if (review.trim().length < 10) {
      setState({ kind: 'error', message: 'Your review should be at least 10 characters.', warn: true });
      return;
    }

    setState({ kind: 'submitting' });
    try {
      const res = await fetch('/api/reviews/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSlug,
          rating,
          reviewer: name.trim(),
          email: email.trim(),
          review: review.trim(),
        }),
      });
      const data: any = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setState({ kind: 'success' });
        // Give the confirmation a moment to be read, then refresh the page
        // so the live review list (fetched from the CMS) includes it.
        setTimeout(() => window.location.reload(), 1500);
        return;
      }
      setState({
        kind: 'error',
        message: data.error || 'Something went wrong. Please try again later.',
        warn: data.duplicate,
      });
    } catch {
      setState({ kind: 'error', message: 'Could not reach the server. Please try again.' });
    }
  };

  return (
    <div className="mt-4 sm:mt-5">
      {!open ? (
        <button
          type="button"
          onClick={handleOpen}
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-forest text-white text-xs sm:text-sm font-semibold hover:bg-forest-dark transition-colors shadow-xs"
        >
          <PencilLine size={14} />
          Write a review
        </button>
      ) : (
        <div className="rounded-xl sm:rounded-2xl bg-[#FAF7F2] border border-stone-200/70 p-4 sm:p-5">
          <h3 className="font-serif text-sm sm:text-base font-bold text-forest mb-3">
            Share your experience with {productName}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Star rating */}
            <div>
              <label htmlFor="review-rating" className="block text-xs font-semibold text-charcoal mb-1.5">
                Your rating
              </label>
              <div
                id="review-rating"
                className="inline-flex items-center gap-0.5"
                role="radiogroup"
                aria-label="Star rating"
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={rating === i}
                    aria-label={`${i} star${i > 1 ? 's' : ''}`}
                    onClick={() => {
                      setRating(i);
                      if (state.kind === 'error') setState({ kind: 'idle' });
                    }}
                    onMouseEnter={() => setHoverStar(i)}
                    onMouseLeave={() => setHoverStar(0)}
                    className="p-0.5 focus:outline-none focus:ring-2 focus:ring-botanical rounded"
                  >
                    <Star
                      size={20}
                      className={
                        i <= displayStar ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name + email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="review-name" className="block text-xs font-semibold text-charcoal mb-1">
                  Your name
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-xs sm:text-sm text-charcoal placeholder:text-stone-400 focus:outline-none focus:border-botanical"
                />
              </div>
              <div>
                <label htmlFor="review-email" className="block text-xs font-semibold text-charcoal mb-1">
                  Email <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <input
                  id="review-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-xs sm:text-sm text-charcoal placeholder:text-stone-400 focus:outline-none focus:border-botanical"
                />
              </div>
            </div>

            {/* Review text */}
            <div>
              <label htmlFor="review-text" className="block text-xs font-semibold text-charcoal mb-1">
                Your review
              </label>
              <textarea
                id="review-text"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                maxLength={2000}
                placeholder="How did this product work for you?"
                className="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-xs sm:text-sm text-charcoal placeholder:text-stone-400 focus:outline-none focus:border-botanical resize-y"
              />
            </div>

            {/* Feedback */}
            {state.kind === 'success' && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>Thank you! Your review has been published.</span>
              </div>
            )}
            {state.kind === 'error' && (
              <div
                className={`flex items-center gap-2 p-2.5 rounded-lg text-xs sm:text-sm border ${
                  state.warn
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                <AlertTriangle size={16} className="shrink-0" />
                <span>{state.message}</span>
              </div>
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="submit"
                disabled={state.kind === 'submitting' || state.kind === 'success'}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-forest text-white text-xs sm:text-sm font-semibold hover:bg-forest-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {state.kind === 'submitting' ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    Submit review
                  </>
                )}
              </button>
              {state.kind !== 'success' && (
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setState({ kind: 'idle' });
                  }}
                  className="text-xs text-charcoal-muted hover:text-charcoal font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
