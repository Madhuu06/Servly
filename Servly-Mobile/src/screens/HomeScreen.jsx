import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocation } from '../context/LocationContext';
import { useProviders } from '../hooks/useProviders';
import { sortProvidersByDistance } from '../utils/distanceUtils';
import { COLORS, getCategoryColor } from '../styles/colors';
import SearchBar from '../components/SearchBar';
import ServiceBottomSheet from '../components/ServiceBottomSheet';
import ProviderList from '../components/ProviderList';

export default function HomeScreen() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedService, setSelectedService] = useState(null);
    const { userLocation, loading: locationLoading, error: locationError } = useLocation();
    const { providers, loading: providersLoading, error: providersError } = useProviders(selectedCategory);

    // Calculate distances and sort providers
    const sortedProviders = useMemo(() => {
        if (!userLocation) return providers;
        return sortProvidersByDistance(providers, userLocation);
    }, [providers, userLocation]);

    const isLoading = providersLoading || locationLoading;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Map View */}
            <View style={styles.mapContainer}>
                {userLocation ? (
                    <MapView
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}
                        showsUserLocation
                        showsMyLocationButton
                    >
                        {/* Provider Markers */}
                        {sortedProviders.map((provider) => (
                            <Marker
                                key={provider.id}
                                coordinate={{
                                    latitude: provider.latitude,
                                    longitude: provider.longitude,
                                }}
                                pinColor={getCategoryColor(provider.category)}
                                onPress={() => setSelectedService(provider)}
                                title={provider.name}
                                description={provider.category}
                            />
                        ))}
                    </MapView>
                ) : (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loadingText}>
                            {locationError || 'Getting your location...'}
                        </Text>
                    </View>
                )}
            </View>

            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
                <SearchBar
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />
            </View>

            {/* Provider List */}
            {!selectedService && (
                <ProviderList
                    services={sortedProviders}
                    onSelectService={setSelectedService}
                />
            )}

            {/* Service Bottom Sheet */}
            <ServiceBottomSheet
                service={selectedService}
                onClose={() => setSelectedService(null)}
            />

            {/* Loading Overlay */}
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingCard}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loadingText}>Loading providers...</Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.text.secondary,
    },
    searchBarContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    loadingCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
});
