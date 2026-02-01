/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

/**
 * Convert degrees to radians
 */
function toRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export function formatDistance(distanceKm) {
    if (distanceKm < 1) {
        return `${Math.round(distanceKm * 1000)} m`;
    }
    return `${distanceKm.toFixed(1)} km`;
}

/**
 * Sort providers by distance from user location
 * @param {Array} providers - Array of provider objects
 * @param {Object} userLocation - User's location {latitude, longitude}
 * @returns {Array} Sorted array of providers with distance property
 */
export function sortProvidersByDistance(providers, userLocation) {
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
        return providers;
    }

    return providers
        .map(provider => {
            const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                provider.latitude,
                provider.longitude
            );
            return {
                ...provider,
                distance,
                distanceText: formatDistance(distance)
            };
        })
        .sort((a, b) => a.distance - b.distance);
}
