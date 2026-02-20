import { Star, MapPin, CheckCircle, Clock } from 'lucide-react';
import StarRating from './StarRating';

// Category colour mapping — warm & modern
const categoryColors = {
    'Electrician': { bg: '#FFF3E0', icon: '#FF8A00', dot: '#FF8A00' },
    'Plumber': { bg: '#E3F2FD', icon: '#1976D2', dot: '#1976D2' },
    'Carpenter': { bg: '#F3E5F5', icon: '#7B1FA2', dot: '#7B1FA2' },
    'Cleaner': { bg: '#E8F5E9', icon: '#388E3C', dot: '#388E3C' },
    'AC Repair': { bg: '#E0F7FA', icon: '#0097A7', dot: '#0097A7' },
    'default': { bg: '#F5F5F5', icon: '#616161', dot: '#616161' },
};

const getCatColor = (category) => categoryColors[category] || categoryColors.default;

const SORT_OPTIONS = [
    { key: 'default', label: 'Nearest' },
    { key: 'rating', label: '⭐ Top Rated' },
    { key: 'available', label: '🟢 Available' },
];

const ProviderList = ({ services, onSelectService, selectedService, searchTerm = '', activeSort, onSortChange }) => {
    // Search filter
    const filtered = services.filter((s) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
            s.name?.toLowerCase().includes(q) ||
            s.category?.toLowerCase().includes(q) ||
            s.description?.toLowerCase().includes(q)
        );
    });

    // Sort
    const sorted = [...filtered].sort((a, b) => {
        if (activeSort === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
    });

    return (
        <div className="flex flex-col h-full bg-gray-50">

            {/* ── Header ── */}
            <div className="px-5 pt-5 pb-3 bg-white border-b border-gray-100">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
                        {searchTerm ? 'Results' : 'Nearby'}
                    </h2>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                        {sorted.length} found
                    </span>
                </div>
                {searchTerm && (
                    <p className="text-xs text-gray-400 mb-2">"{searchTerm}"</p>
                )}

                {/* Sort chips */}
                <div className="flex gap-1.5 mt-2 overflow-x-auto scrollbar-hide pb-1">
                    {SORT_OPTIONS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => onSortChange(key === activeSort ? 'default' : key)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition-all ${activeSort === key
                                    ? 'text-white border-transparent'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-orange-200 hover:text-orange-600'
                                }`}
                            style={activeSort === key ? { background: '#FF8A00', borderColor: 'transparent' } : {}}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Cards list ── */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pt-3 pb-4 space-y-2">
                {sorted.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-52 text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3">
                            <MapPin className="w-7 h-7 text-gray-300" />
                        </div>
                        <p className="text-sm font-bold text-gray-700">
                            {searchTerm ? `No results for "${searchTerm}"` : 'No providers found'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Try a different search or category</p>
                    </div>
                ) : (
                    sorted.map((service, index) => {
                        const isSelected = selectedService?.uid === service.uid || selectedService?.id === service.id;
                        const colors = getCatColor(service.category);

                        return (
                            <div
                                key={service.id || service.uid}
                                onClick={() => onSelectService(service)}
                                style={{
                                    animationDelay: `${index * 30}ms`,
                                    borderColor: isSelected ? '#FF8A00' : 'transparent',
                                    boxShadow: isSelected
                                        ? '0 0 0 2px #FF8A00, 0 4px 20px rgba(255,138,0,0.15)'
                                        : '0 1px 4px rgba(0,0,0,0.06)',
                                }}
                                className={`bg-white rounded-2xl cursor-pointer border-2 transition-all duration-200 animate-fade-in card-hover overflow-hidden`}
                            >
                                <div className="flex items-start p-3.5 gap-3">
                                    {/* Category icon circle */}
                                    <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-extrabold relative"
                                        style={{ backgroundColor: colors.bg, color: colors.icon }}>
                                        {service.name[0]}
                                        {/* Available dot */}
                                        <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-1">
                                            <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">
                                                {service.name}
                                            </h3>
                                            {service.distanceText && (
                                                <span className="flex items-center gap-0.5 text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0">
                                                    <MapPin className="w-3 h-3" />
                                                    {service.distanceText}
                                                </span>
                                            )}
                                        </div>

                                        {/* Category badge */}
                                        <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5"
                                            style={{ backgroundColor: colors.bg, color: colors.icon }}>
                                            {service.category}
                                        </span>

                                        <p className="text-xs text-gray-400 mt-1 line-clamp-1 leading-relaxed">
                                            {service.description || 'Professional service • Verified'}
                                        </p>

                                        {/* Footer row */}
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-1">
                                                <StarRating rating={service.rating || 0} size={11} />
                                                <span className="text-[11px] font-bold text-gray-700">
                                                    {(service.rating || 0).toFixed(1)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3 text-green-500" />
                                                <span className="text-[10px] font-semibold text-green-600">Verified</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Selected orange bottom accent */}
                                {isSelected && (
                                    <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #FF8A00, #FF6B00)' }} />
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ProviderList;
