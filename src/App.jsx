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
import { AlertCircle, RefreshCw } from 'lucide-react';

function App() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedService, setSelectedService] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSort, setActiveSort] = useState('default');

    const { userData } = useAuth();
    const { userLocation, loading: locationLoading, error: locationError, requestLocation } = useLocation();
    const { providers, loading: providersLoading, error: providersError } = useProviders(selectedCategory);

    const sortedProviders = useMemo(() => {
        if (!userLocation) return providers;
        return sortProvidersByDistance(providers, userLocation);
    }, [providers, userLocation]);

    const isLoading = providersLoading || locationLoading;

    return (
        <div className="h-screen w-full overflow-hidden flex flex-col bg-gray-50">

            {/* ── Top Navbar ── */}
            <SearchBar
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    setSelectedService(null);
                }}
                searchTerm={searchTerm}
                onSearchChange={(val) => {
                    setSearchTerm(val);
                    setSelectedService(null);
                }}
            />

            {/* ── Content Row ── */}
            <div className="flex flex-1 overflow-hidden">

                {/* Left sidebar */}
                <div className="w-[380px] xl:w-[420px] flex-shrink-0 h-full bg-white border-r border-gray-100 overflow-hidden flex flex-col shadow-sm">
                    <ProviderList
                        services={sortedProviders}
                        onSelectService={setSelectedService}
                        selectedService={selectedService}
                        searchTerm={searchTerm}
                        activeSort={activeSort}
                        onSortChange={setActiveSort}
                    />
                </div>

                {/* Map area */}
                <div className="flex-1 relative overflow-hidden">

                    {/* Loading overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                            <div className="bg-white rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center gap-3">
                                <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm font-medium text-gray-600">Finding providers...</p>
                            </div>
                        </div>
                    )}

                    {/* Location error */}
                    {locationError && !isLoading && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white border border-yellow-200 rounded-2xl shadow-lg p-4 w-80">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-gray-800">Location needed</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{locationError}</p>
                                    <button
                                        onClick={requestLocation}
                                        className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        <RefreshCw className="w-3 h-3" />
                                        Enable Location
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Providers error */}
                    {providersError && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white border border-red-200 rounded-2xl shadow-lg p-4">
                            <p className="text-sm text-red-700 font-medium">{providersError}</p>
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

            {/* Right Detail Panel */}
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
