import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext(null);

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};

export const LocationProvider = ({ children }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState(false);

    useEffect(() => {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        // Request user's location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
                setLoading(false);
                setError(null);
                setPermissionDenied(false);
            },
            (err) => {
                console.error('Error getting location:', err);

                if (err.code === err.PERMISSION_DENIED) {
                    setPermissionDenied(true);
                    setError('Location permission denied. Please enable location access to see nearby providers.');
                } else if (err.code === err.POSITION_UNAVAILABLE) {
                    setError('Location information unavailable.');
                } else if (err.code === err.TIMEOUT) {
                    setError('Location request timed out.');
                } else {
                    setError('An unknown error occurred while getting location.');
                }

                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }, []);

    const requestLocation = () => {
        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
                setLoading(false);
                setError(null);
                setPermissionDenied(false);
            },
            (err) => {
                console.error('Error getting location:', err);

                if (err.code === err.PERMISSION_DENIED) {
                    setPermissionDenied(true);
                    setError('Location permission denied.');
                } else {
                    setError('Could not get your location.');
                }

                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const value = {
        userLocation,
        loading,
        error,
        permissionDenied,
        requestLocation
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
};
