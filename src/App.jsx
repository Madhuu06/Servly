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
import { AlertCircle } from 'lucide-react';

function App() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedService, setSelectedService] = useState(null);
    const { userData } = useAuth();
    const { userLocation, loading: locationLoading, error: locationError, requestLocation } = useLocation();
    const { providers, loading: providersLoading, error: providersError } = useProviders(selectedCategory);
    const navigate = useNavigate();

    const sortedProviders = useMemo(() => {
        if (!userLocation) return providers;
        return sortProvidersByDistance(providers, userLocation);
    }, [providers, userLocation]);

    const isLoading = providersLoading || locationLoading;

    return (
        <div className="relative h-screen w-full overflow-hidden flex flex-col">

            {/* Top Navbar with Search */}
            <SearchBar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            {/* Main content area: sidebar + map */}
            <div className="flex flex-1 overflow-hidden">

                {/* Left Sidebar - Provider List */}
                <div className="w-80 xl:w-96 flex-shrink-0 h-full bg-white shadow-lg z-10 overflow-hidden flex flex-col">
                    {/* Sidebar Header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm font-semibold text-gray-600">
                            {isLoading ? 'Loading...' : `${sortedProviders.length} Providers Nearby`}
                        </p>
                    </div>

                    {/* Provider list */}
                    <ProviderList
                        services={sortedProviders}
                        onSelectService={setSelectedService}
                        selectedService={selectedService}
                    />
                </div>

                {/* Map Area */}
                <div className="flex-1 relative">

                    {/* Location Error Banner */}
                    {locationError && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-lg w-96">
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

                    {/* Loading Overlay */}
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
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-800">{providersError}</p>
                        </div>
                    )}

                    <MapBackground
                        providers={sortedProviders}
                        onMarkerClick={setSelectedService}
                        filteredCategory={selectedCategory}
                        userLocation={userLocation}
                    />
                </div>
            </div>

            {/* Right Panel - Service Details */}
            {selectedService && (
                <ServiceBottomSheet
                    service={selectedService}
                    onClose={() => setSelectedService(null)}
                />
            )}
        </div>
    );
}

export default App;
