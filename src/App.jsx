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
import { AlertCircle, RefreshCw, Navigation, User } from 'lucide-react';

function App() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedService, setSelectedService] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { userData } = useAuth();
    const navigate = useNavigate();
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

            {/* ── Logo + Search bar (left-aligned, same width as list) ── */}
            <div className="absolute top-4 left-4 z-[500] w-[320px] flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src="/logo.png" alt="Servly" className="w-7 h-7 object-contain" />
                </div>
                <div className="flex-1">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={(val) => {
                            setSearchTerm(val);
                            setSelectedService(null);
                        }}
                    />
                </div>
            </div>

            {/* ── Floating profile bubble ── */}
            <div className="absolute top-4 right-4 z-[500]">
                <button
                    onClick={() => navigate('/profile')}
                    title={userData?.name || 'Profile'}
                    className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden hover:shadow-xl transition"
                >
                    {userData?.photoURL ? (
                        <img src={userData.photoURL} alt="" className="w-10 h-10 object-cover" />
                    ) : (
                        <User className="w-5 h-5 text-gray-400" />
                    )}
                </button>
            </div>

            {/* ── Floating provider list ── */}
            <div className="absolute top-[68px] left-4 bottom-4 w-[320px] z-[400]">
                <ProviderList
                    services={sortedProviders}
                    onSelectService={setSelectedService}
                    selectedService={selectedService}
                    searchTerm={searchTerm}
                />
            </div>

            {/* ── Loading pill ── */}
            {isLoading && (
                <div className="absolute top-[72px] left-1/2 -translate-x-1/2 z-[600] bg-white rounded-full shadow-lg px-5 py-2.5 flex items-center gap-2.5">
                    <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-medium text-gray-600">Finding providers…</p>
                </div>
            )}

            {/* ── Location error ── */}
            {locationError && !isLoading && (
                <div className="absolute top-[72px] left-1/2 -translate-x-1/2 z-[600] bg-white border border-yellow-200 rounded-2xl shadow-lg p-3 w-72">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs font-semibold text-gray-700">Location needed</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">{locationError}</p>
                            <button onClick={requestLocation}
                                className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700">
                                <RefreshCw className="w-3 h-3" /> Enable
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Providers error ── */}
            {providersError && (
                <div className="absolute top-[72px] left-1/2 -translate-x-1/2 z-[600] bg-white border border-red-200 rounded-xl shadow-lg px-4 py-3">
                    <p className="text-xs text-red-700 font-medium">{providersError}</p>
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

/* ── Category chips — imported from data ── */
import { categories } from './data/services';

function CategoryChips({ selectedCategory, onSelectCategory }) {
    return categories.map(cat => (
        <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap font-medium shadow transition-all ${selectedCategory === cat.id
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
        >
            {cat.label}
        </button>
    ));
}

export default App;
