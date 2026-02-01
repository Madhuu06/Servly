import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useLocation } from './context/LocationContext';
import { useProviders } from './hooks/useProviders';
import { sortProvidersByDistance } from './utils/distanceUtils';
import MapBackground from './components/MapBackground';
import SearchBar from './components/SearchBar';
import ServiceBottomSheet from './components/ServiceBottomSheet';
import ProviderList from './components/ProviderList';
import { User, MapPin, AlertCircle } from 'lucide-react';

function App() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedService, setSelectedService] = useState(null);
    const { userData } = useAuth();
    const { userLocation, loading: locationLoading, error: locationError, requestLocation } = useLocation();
    const { providers, loading: providersLoading, error: providersError } = useProviders(selectedCategory);
    const navigate = useNavigate();

    // Calculate distances and sort providers
    const sortedProviders = useMemo(() => {
        if (!userLocation) return providers;
        return sortProvidersByDistance(providers, userLocation);
    }, [providers, userLocation]);

    const isLoading = providersLoading || locationLoading;

    return (
        <div className="relative h-screen w-full overflow-hidden bg-gray-100 flex justify-center">
            {/* Mobile Container Simulation */}
            <div className="w-full max-w-md h-full relative bg-white shadow-2xl overflow-hidden">


                {/* Location Error Banner */}
                {locationError && (
                    <div className="absolute top-20 left-4 right-4 z-20 bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-lg">
                        <div className="flex items-start gap-2">
                            <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm text-yellow-800 font-medium">Location Access Needed</p>
                                <p className="text-xs text-yellow-700 mt-1">{locationError}</p>
                                <button
                                    onClick={requestLocation}
                                    className="mt-2 text-xs bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700 transition-colors"
                                >
                                    Enable Location
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-white rounded-lg shadow-xl p-6">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D2D2D]"></div>
                            <p className="text-sm text-gray-600">Loading providers...</p>
                        </div>
                    </div>
                )}

                {/* Providers Error */}
                {providersError && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-red-50 border border-red-200 rounded-lg p-4 max-w-sm">
                        <p className="text-sm text-red-800">{providersError}</p>
                    </div>
                )}

                <MapBackground
                    providers={sortedProviders}
                    onMarkerClick={setSelectedService}
                    filteredCategory={selectedCategory}
                    userLocation={userLocation}
                />

                <SearchBar
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />

                {!selectedService && (
                    <ProviderList
                        services={sortedProviders}
                        onSelectService={setSelectedService}
                    />
                )}

                <ServiceBottomSheet
                    service={selectedService}
                    onClose={() => setSelectedService(null)}
                />

            </div>
        </div>
    );
}

export default App;
