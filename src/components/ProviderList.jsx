import { Star, MapPin } from 'lucide-react';
import StarRating from './StarRating';

const ProviderList = ({ services, onSelectService, selectedService }) => {
    return (
        <div className="flex-1 overflow-y-auto">
            {services.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 px-4">
                    <MapPin size={40} className="mb-3 text-gray-300" />
                    <p className="text-sm font-medium text-gray-500">No providers found</p>
                    <p className="text-xs text-gray-400 mt-1 text-center">Try selecting a different category</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-50">
                    {services.map((service) => {
                        const isSelected = selectedService?.uid === service.uid || selectedService?.id === service.id;
                        return (
                            <div
                                key={service.id || service.uid}
                                onClick={() => onSelectService(service)}
                                className={`flex items-start gap-3 p-4 cursor-pointer transition-colors
                                    ${isSelected
                                        ? 'bg-gray-900 text-white'
                                        : 'hover:bg-gray-50 bg-white'
                                    }`}
                            >
                                {/* Avatar */}
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold shrink-0
                                    ${isSelected ? 'bg-white text-gray-900' : 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'}`}
                                >
                                    {service.name[0]}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-semibold text-sm truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                        {service.name}
                                    </h3>
                                    <span className={`text-xs font-medium ${isSelected ? 'text-blue-300' : 'text-blue-600'}`}>
                                        {service.category}
                                    </span>
                                    <div className="flex items-center gap-1 mt-1">
                                        <StarRating rating={service.rating || 0} size={11} />
                                        <span className={`text-xs ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                                            ({(service.rating || 0).toFixed(1)})
                                        </span>
                                    </div>
                                    {service.distanceText && (
                                        <div className={`flex items-center gap-1 mt-1 text-xs ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                                            <MapPin className="w-3 h-3" />
                                            {service.distanceText}
                                        </div>
                                    )}
                                </div>

                                {/* Rating badge */}
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold flex-shrink-0
                                    ${isSelected ? 'bg-white/20 text-white' : 'bg-yellow-50 text-gray-700'}`}
                                >
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    {(service.rating || 0).toFixed(1)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProviderList;
