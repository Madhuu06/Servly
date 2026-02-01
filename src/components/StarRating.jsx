import { Star } from 'lucide-react';

/**
 * StarRating component - displays or allows selection of star ratings
 * @param {number} rating - Current rating value (0-5)
 * @param {boolean} interactive - Whether stars are clickable
 * @param {function} onRatingChange - Callback when rating changes (interactive mode)
 * @param {number} size - Size of stars in pixels
 */
export default function StarRating({
    rating = 0,
    interactive = false,
    onRatingChange = null,
    size = 20
}) {
    const stars = [1, 2, 3, 4, 5];

    const handleClick = (value) => {
        if (interactive && onRatingChange) {
            onRatingChange(value);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {stars.map((star) => {
                const isFilled = star <= Math.round(rating);

                return (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleClick(star)}
                        disabled={!interactive}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                    >
                        <Star
                            size={size}
                            className={`${isFilled
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-none text-gray-300'
                                } transition-colors`}
                        />
                    </button>
                );
            })}
        </div>
    );
}
