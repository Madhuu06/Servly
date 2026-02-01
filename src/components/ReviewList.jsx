import StarRating from './StarRating';
import { MessageSquare } from 'lucide-react';

/**
 * ReviewList component - displays list of reviews
 */
export default function ReviewList({ reviews, loading }) {
    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4 h-24"></div>
                ))}
            </div>
        );
    }

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-8">
                <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No reviews yet</p>
                <p className="text-gray-400 text-xs mt-1">Be the first to review this provider!</p>
            </div>
        );
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return '';

        // Handle Firestore Timestamp
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div
                    key={review.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                    <div className="flex items-start justify-between mb-2">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-8 h-8 bg-[#2D2D2D] rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold text-white">
                                        {review.customerName?.charAt(0) || 'U'}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">
                                        {review.customerName || 'Anonymous'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatDate(review.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <StarRating rating={review.rating} size={16} />
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed">
                        {review.comment}
                    </p>
                </div>
            ))}
        </div>
    );
}
