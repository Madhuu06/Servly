import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Custom hook to fetch reviews for a specific provider
 * @param {string} providerId - Provider's user ID
 * @returns {Object} { reviews, averageRating, reviewCount, loading, error }
 */
export function useReviews(providerId) {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!providerId) {
            setLoading(false);
            return;
        }

        try {
            // Query reviews subcollection for this provider
            const reviewsRef = collection(db, 'providers', providerId, 'reviews');
            const q = query(reviewsRef, orderBy('createdAt', 'desc'));

            // Subscribe to real-time updates
            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const reviewsData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    setReviews(reviewsData);
                    setReviewCount(reviewsData.length);

                    // Calculate average rating
                    if (reviewsData.length > 0) {
                        const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0);
                        setAverageRating(sum / reviewsData.length);
                    } else {
                        setAverageRating(0);
                    }

                    setLoading(false);
                    setError(null);
                },
                (err) => {
                    console.error('Error fetching reviews:', err);
                    setError(err.message);
                    setLoading(false);
                }
            );

            // Cleanup subscription
            return () => unsubscribe();
        } catch (err) {
            console.error('Error setting up reviews listener:', err);
            setError(err.message);
            setLoading(false);
        }
    }, [providerId]);

    return { reviews, averageRating, reviewCount, loading, error };
}
