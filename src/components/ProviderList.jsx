import { Star, MapPin, SlidersHorizontal, Sliders } from 'lucide-react';
import StarRating from './StarRating';

const avatarGradients = [
    'from-blue-400 to-blue-600',
    'from-violet-400 to-purple-600',
    'from-emerald-400 to-green-600',
    'from-orange-400 to-rose-500',
    'from-cyan-400 to-sky-600',
    'from-pink-400 to-fuchsia-600',
];
const getGradient = (name) => avatarGradients[(name?.charCodeAt(0) || 0) % avatarGradients.length];

const SORT_OPTIONS = [
    { key: 'default', label: 'Nearest' },
    { key: 'rating', label: 'Top Rated' },
    { key: 'available', label: 'Available Now' },
];

const ProviderList = ({ services, onSelectService, selectedService, searchTerm = '', activeSort, onSortChange }) => {
    // Client-side filter by search term
    const filtered = services.filter((s) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
            s.name?.toLowerCase().includes(q) ||
            s.category?.toLowerCase().includes(q) ||
            s.description?.toLowerCase().includes(q) ||
            s.area?.toLowerCase().includes(q)
        );
    });

    // Client-side sort
    const sorted = [...filtered].sort((a, b) => {
        if (activeSort === 'rating') return (b.rating || 0) - (a.rating || 0);
        // 'nearest' and 'default': providers already sorted by distance from parent
        return 0;
    });

    return (
        <div className="flex flex-col h-full">
            {/* List header */}
            <div className="px-5 pt-4 pb-3 flex-shrink-0">
                <div className="flex items-end justify-between mb-3">
                    <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">
                            {sorted.length} Provider{sorted.length !== 1 ? 's' : ''}
                            {searchTerm && ` for "${searchTerm}"`}
                        </p>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">
                            {searchTerm ? 'Search Results' : 'Service Providers'}
                        </h2>
                    </div>
                </div>

                {/* Sort/filter chips */}
                <div className="flex gap-2 flex-wrap">
                    {SORT_OPTIONS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => onSortChange(key === activeSort ? 'default' : key)}
                            className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all
                                ${activeSort === key
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 mx-5 flex-shrink-0" />

            {/* Provider cards */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pt-3 pb-4 space-y-3">
                {sorted.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-52 text-center px-4">
                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                            <MapPin size={24} className="text-gray-400" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                            {searchTerm ? `No results for "${searchTerm}"` : 'No providers found'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {searchTerm ? 'Try a different search term' : 'Try a different category or location'}
                        </p>
                    </div>
                ) : (
                    sorted.map((service) => {
                        const isSelected = selectedService?.uid === service.uid || selectedService?.id === service.id;
                        return (
                            <div
                                key={service.id || service.uid}
                                onClick={() => onSelectService(service)}
                                className={`
                                    group rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200
                                    ${isSelected
                                        ? 'border-blue-400 shadow-lg shadow-blue-100 ring-1 ring-blue-300'
                                        : 'border-gray-100 hover:border-gray-200 hover:shadow-md bg-white shadow-sm'
                                    }
                                `}
                            >
                                {/* Card image/gradient */}
                                <div className="relative h-32 overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(service.name)}`} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold text-white border-2 border-white/30">
                                            {service.name[0]}
                                        </div>
                                    </div>
                                    {/* Rating badge */}
                                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white rounded-lg px-1.5 py-0.5 shadow-sm">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs font-bold text-gray-800">
                                            {(service.rating || 0).toFixed(1)}
                                        </span>
                                    </div>
                                    {/* Category badge */}
                                    <div className="absolute top-2.5 left-2.5">
                                        <span className="text-xs font-semibold bg-white/90 backdrop-blur-sm text-blue-700 px-2 py-0.5 rounded-lg">
                                            {service.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Card body */}
                                <div className="p-3.5 bg-white">
                                    <h3 className="font-bold text-gray-900 text-sm truncate">{service.name}</h3>
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                                        {service.description || 'Professional service provider'}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                        <StarRating rating={service.rating || 0} size={11} />
                                        {service.distanceText && (
                                            <span className="flex items-center gap-0.5 text-xs text-gray-400">
                                                <MapPin className="w-3 h-3" />
                                                {service.distanceText}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ProviderList;
