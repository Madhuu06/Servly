import { useState } from 'react';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';
import { Send, AlertCircle } from 'lucide-react';

/**
 * ReviewForm component - allows customers to submit reviews
 */
export default function ReviewForm({ providerId, onReviewSubmitted }) {
    const { user, userData } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            setError('Please write a comment');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Check if user already reviewed this provider
            const reviewsRef = collection(db, 'providers', providerId, 'reviews');
            const q = query(reviewsRef, where('customerId', '==', user.uid));
            const existingReviews = await getDocs(q);

            if (!existingReviews.empty) {
                setError('You have already reviewed this provider');
                setLoading(false);
                return;
            }

            // Add review to Firestore
            await addDoc(reviewsRef, {
                providerId,
                customerId: user.uid,
                customerName: userData?.name || 'Anonymous',
                rating,
                comment: comment.trim(),
                createdAt: serverTimestamp()
            });

            // Reset form
            setRating(0);
            setComment('');
            setSuccess(true);
            setLoading(false);

            // Call callback if provided
            if (onReviewSubmitted) {
                onReviewSubmitted();
            }

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Error submitting review:', err);
            setError('Failed to submit review. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Write a Review</h3>

            {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                    ✓ Review submitted successfully!
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Rating
                    </label>
                    <StarRating
                        rating={rating}
                        interactive={true}
                        onRatingChange={setRating}
                        size={28}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this provider..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D2D2D] focus:border-transparent resize-none"
                        rows={4}
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || rating === 0}
                    className="w-full bg-[#2D2D2D] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#1a1a1a] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Send size={16} />
                            Submit Review
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
