import { Star, MapPin } from 'lucide-react';
import StarRating from './StarRating';

// Deterministic — but now using orange-tinted neutrals, not rainbow
const cardAccents = [
    { bg: 'from-gray-700 to-gray-900', text: 'text-white' },
    { bg: 'from-stone-600 to-stone-800', text: 'text-white' },
    { bg: 'from-zinc-600 to-zinc-900', text: 'text-white' },
    { bg: 'from-neutral-600 to-neutral-900', text: 'text-white' },
    { bg: 'from-slate-600 to-slate-900', text: 'text-white' },
];
const getAccent = (name) => cardAccents[(name?.charCodeAt(0) || 0) % cardAccents.length];

const SORT_OPTIONS = [
    { key: 'default', label: 'Nearest' },
    { key: 'rating', label: 'Top Rated' },
    { key: 'available', label: 'Available Now' },
];

const ProviderList = ({ services, onSelectService, selectedService, searchTerm = '', activeSort, onSortChange }) => {
    const filtered = services.filter((s) => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
            s.name?.toLowerCase().includes(q) ||
            s.category?.toLowerCase().includes(q) ||
            s.description?.toLowerCase().includes(q)
        );
    });

    const sorted = [...filtered].sort((a, b) => {
        if (activeSort === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
    });

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-5 pt-4 pb-3 flex-shrink-0">
                <p className="text-xs text-gray-400 font-medium mb-0.5">
                    {sorted.length} Provider{sorted.length !== 1 ? 's' : ''}
                    {searchTerm && ` for "${searchTerm}"`}
                </p>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                    {searchTerm ? 'Search Results' : 'Service Providers'}
                </h2>

                {/* Sort chips */}
                <div className="flex gap-2 flex-wrap">
                    {SORT_OPTIONS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => onSortChange(key === activeSort ? 'default' : key)}
                            style={activeSort === key ? { backgroundColor: '#FF8A00', borderColor: '#FF8A00', color: '#fff' } : {}}
                            className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all
                                ${activeSort !== key ? 'bg-white text-gray-600 border-gray-200 hover:border-gray-400' : ''}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-gray-100 mx-5 flex-shrink-0" />

            {/* Cards */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pt-3 pb-4 space-y-3">
                {sorted.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-52 text-center px-4">
                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                            <MapPin size={24} className="text-gray-400" />
                        </div>
                        <p className="text-sm font-semibold text-gray-800">
                            {searchTerm ? `No results for "${searchTerm}"` : 'No providers found'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {searchTerm ? 'Try a different search' : 'Try a different category'}
                        </p>
                    </div>
                ) : (
                    sorted.map((service) => {
                        const isSelected = selectedService?.uid === service.uid || selectedService?.id === service.id;
                        const accent = getAccent(service.name);
                        return (
                            <div
                                key={service.id || service.uid}
                                onClick={() => onSelectService(service)}
                                style={isSelected ? { borderColor: '#FF8A00', boxShadow: '0 0 0 1px #FF8A00, 0 4px 16px rgba(255,138,0,0.15)' } : {}}
                                className={`group rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200
                                    ${!isSelected ? 'border-gray-100 hover:border-gray-300 hover:shadow-md bg-white shadow-sm' : 'bg-white'}`}
                            >
                                {/* Gradient hero */}
                                <div className={`relative h-28 bg-gradient-to-br ${accent.bg}`}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold text-white border border-white/20">
                                            {service.name[0]}
                                        </div>
                                    </div>
                                    {/* Rating badge */}
                                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white rounded-lg px-1.5 py-0.5 shadow-sm">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs font-bold text-gray-800">{(service.rating || 0).toFixed(1)}</span>
                                    </div>
                                    {/* Category */}
                                    <div className="absolute top-2.5 left-2.5">
                                        <span className="text-xs font-semibold bg-white/95 text-gray-800 px-2 py-0.5 rounded-lg">
                                            {service.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Body */}
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
