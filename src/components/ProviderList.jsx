import { Star, MapPin, Sliders, SlidersHorizontal } from 'lucide-react';
import StarRating from './StarRating';

// Deterministic gradient based on provider name initial
const avatarGradients = [
    'from-blue-400 to-blue-600',
    'from-violet-400 to-purple-600',
    'from-emerald-400 to-green-600',
    'from-orange-400 to-rose-500',
    'from-cyan-400 to-sky-600',
    'from-pink-400 to-fuchsia-600',
];
const getGradient = (name) => avatarGradients[(name?.charCodeAt(0) || 0) % avatarGradients.length];

const ProviderList = ({ services, onSelectService, selectedService }) => {
    return (
        <div className="flex flex-col h-full">
            {/* List header */}
            <div className="px-5 pt-4 pb-3 flex-shrink-0">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">
                            {services.length}+ Providers
                        </p>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">
                            Service Providers
                        </h2>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors">
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Filters
                    </button>
                </div>

                {/* Filter pills */}
                <div className="flex gap-2 mt-3 flex-wrap">
                    {['Available Now', 'Top Rated', 'Nearest'].map((filter) => (
                        <button
                            key={filter}
                            className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium"
                        >
                            {filter}
                        </button>
                    ))}
                    <button className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors flex items-center gap-1">
                        <Sliders className="w-3 h-3" />
                        More
                    </button>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 mx-5 flex-shrink-0" />

            {/* Provider cards */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 pt-3 pb-4 space-y-3">
                {services.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-52 text-center px-4">
                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-3">
                            <MapPin size={24} className="text-gray-400" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">No providers found</p>
                        <p className="text-xs text-gray-400 mt-1">Try a different category or location</p>
                    </div>
                ) : (
                    services.map((service) => {
                        const isSelected = selectedService?.uid === service.uid || selectedService?.id === service.id;
                        return (
                            <div
                                key={service.id || service.uid}
                                onClick={() => onSelectService(service)}
                                className={`
                                    group rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200
                                    ${isSelected
                                        ? 'border-blue-400 shadow-lg shadow-blue-100 ring-1 ring-blue-300'
                                        : 'border-gray-100 hover:border-gray-200 hover:shadow-md bg-white'
                                    }
                                `}
                            >
                                {/* Card image area */}
                                <div className="relative h-36 overflow-hidden">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(service.name)} opacity-90`} />
                                    {/* Avatar large */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold text-white border-2 border-white/30">
                                            {service.name[0]}
                                        </div>
                                    </div>
                                    {/* Rating badge */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white rounded-lg px-2 py-1 shadow-sm">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs font-bold text-gray-800">
                                            {(service.rating || 0).toFixed(1)}
                                        </span>
                                    </div>
                                    {/* Category badge */}
                                    <div className="absolute top-3 left-3">
                                        <span className="text-xs font-semibold bg-white/90 backdrop-blur-sm text-blue-700 px-2.5 py-1 rounded-lg">
                                            {service.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Card body */}
                                <div className="p-3.5 bg-white">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 text-sm truncate">
                                                {service.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-0.5 truncate">
                                                {service.description || 'Professional service provider'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer row */}
                                    <div className="flex items-center justify-between mt-2.5">
                                        <div className="flex items-center gap-1">
                                            <StarRating rating={service.rating || 0} size={11} />
                                            <span className="text-xs text-gray-500 ml-1">
                                                ({Math.floor(Math.random() * 80 + 10)} reviews)
                                            </span>
                                        </div>
                                        {service.distanceText && (
                                            <span className="flex items-center gap-1 text-xs text-gray-400">
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
