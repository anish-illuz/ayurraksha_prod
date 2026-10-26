import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  showText?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewCount,
  size = 14,
  showText = true,
}) => {
  const rounded = Math.round(rating * 10) / 10;

  return (
    <div className="flex items-center gap-1.5" aria-label={`Rating ${rounded} out of 5 stars`}>
      <div className="flex items-center text-botanical">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const filled = starIndex <= Math.floor(rating);
          const half = !filled && starIndex === Math.ceil(rating) && rating % 1 >= 0.3;

          return (
            <Star
              key={starIndex}
              size={size}
              className={`fill-current ${
                filled
                  ? 'text-botanical fill-botanical'
                  : half
                  ? 'text-botanical fill-botanical/50'
                  : 'text-stone-300 fill-stone-100'
              }`}
            />
          );
        })}
      </div>
      {showText && (
        <span className="text-xs font-medium text-charcoal-muted">
          {rounded.toFixed(1)} {reviewCount !== undefined && `(${reviewCount})`}
        </span>
      )}
    </div>
  );
};
