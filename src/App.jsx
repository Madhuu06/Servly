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
import { AlertCircle, RefreshCw, Navigation } from 'lucide-react';

function App() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedService, setSelectedService] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { userData } = useAuth();
    const { userLocation, loading: locationLoading, error: locationError, requestLocation } = useLocation();
    const { providers, loading: providersLoading, error: providersError } = useProviders(selectedCategory);

    const sortedProviders = useMemo(() => {
        if (!userLocation) return providers;
        return sortProvidersByDistance(providers, userLocation);
    }, [providers, userLocation]);

    const isLoading = providersLoading || locationLoading;

    return (
        <div className="h-screen w-full overflow-hidden relative">

            {/* ── Full-screen map ── */}
            <MapBackground
                providers={sortedProviders}
                onMarkerClick={setSelectedService}
                filteredCategory={selectedCategory}
                userLocation={userLocation}
                selectedService={selectedService}
            />

            {/* ── Floating search bar ── */}
            <div className="absolute top-4 left-4 right-4 z-[500]">
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
            </div>

            {/* ── Floating provider list ── */}
            <div className="absolute top-[120px] left-4 bottom-4 w-[280px] z-[400]">
                <ProviderList
                    services={sortedProviders}
                    onSelectService={setSelectedService}
                    selectedService={selectedService}
                    searchTerm={searchTerm}
                />
            </div>

            {/* ── Loading overlay ── */}
            {isLoading && (
                <div className="absolute top-[130px] left-1/2 -translate-x-1/2 z-[600] bg-white rounded-2xl shadow-lg px-6 py-4 flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-gray-600">Finding providers...</p>
                </div>
            )}

            {/* ── Location error ── */}
            {locationError && !isLoading && (
                <div className="absolute top-[130px] left-1/2 -translate-x-1/2 z-[600] bg-white border border-yellow-200 rounded-2xl shadow-lg p-4 w-80">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Location needed</p>
                            <p className="text-xs text-gray-500 mt-0.5">{locationError}</p>
                            <button onClick={requestLocation}
                                className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700">
                                <RefreshCw className="w-3 h-3" /> Enable Location
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Providers error ── */}
            {providersError && (
                <div className="absolute top-[130px] left-1/2 -translate-x-1/2 z-[600] bg-white border border-red-200 rounded-2xl shadow-lg p-4">
                    <p className="text-sm text-red-700 font-medium">{providersError}</p>
                </div>
            )}

            {/* ── Recenter button ── */}
            <button
                onClick={requestLocation}
                className="absolute bottom-5 right-5 z-[500] w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition"
                title="Center on my location"
            >
                <Navigation className="w-4 h-4 text-gray-600" />
            </button>

            {/* ── Detail panel ── */}
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
