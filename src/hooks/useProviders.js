import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Custom hook to fetch providers from Firestore in real-time
 * @param {string} category - Filter by category, or 'all' for all providers
 * @returns {Object} { providers, loading, error }
 */
export function useProviders(category = 'all') {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            // Always fetch all providers — filter on client side
            // This avoids Firestore composite index issues and handles case-insensitive matching
            const q = query(
                collection(db, 'providers'),
                orderBy('rating', 'desc')
            );

            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    let providersData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    // Client-side category filter (case-insensitive)
                    if (category !== 'all') {
                        const catLower = category.toLowerCase();
                        providersData = providersData.filter(p =>
                            p.category?.toLowerCase() === catLower
                        );
                    }

                    setProviders(providersData);
                    setLoading(false);
                    setError(null);
                },
                (err) => {
                    console.error('Error fetching providers:', err);
                    setError(err.message);
                    setLoading(false);
                }
            );

            return () => unsubscribe();
        } catch (err) {
            console.error('Error setting up providers listener:', err);
            setError(err.message);
            setLoading(false);
        }
    }, [category]);

    return { providers, loading, error };
}
