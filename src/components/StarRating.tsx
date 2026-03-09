import { memo } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
}

const StarRating = memo(({ rating, size = 16 }: StarRatingProps) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted'} style={{ width: size, height: size }} />
    ))}
  </div>
));
StarRating.displayName = 'StarRating';

export default StarRating;
