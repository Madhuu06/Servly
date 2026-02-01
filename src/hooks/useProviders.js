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
            // Build query
            let q;
            if (category === 'all') {
                q = query(
                    collection(db, 'providers'),
                    orderBy('rating', 'desc')
                );
            } else {
                q = query(
                    collection(db, 'providers'),
                    where('category', '==', category),
                    orderBy('rating', 'desc')
                );
            }

            // Subscribe to real-time updates
            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const providersData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
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

            // Cleanup subscription
            return () => unsubscribe();
        } catch (err) {
            console.error('Error setting up providers listener:', err);
            setError(err.message);
            setLoading(false);
        }
    }, [category]);

    return { providers, loading, error };
}
