import { createContext, useContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';

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
        requestLocation();
    }, []);

    const requestLocation = async () => {
        try {
            setLoading(true);
            setError(null);

            // Request location permissions
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setPermissionDenied(true);
                setError('Location permission denied. Please enable location access to see nearby providers.');
                setLoading(false);
                return;
            }

            // Get current location
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                accuracy: location.coords.accuracy
            });
            setLoading(false);
            setError(null);
            setPermissionDenied(false);
        } catch (err) {
            console.error('Error getting location:', err);
            setError('Could not get your location. Please try again.');
            setLoading(false);
        }
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
