import { useState } from 'react';
import { ChevronUp, ChevronDown, Star, MapPin } from 'lucide-react';
import StarRating from './StarRating';

const ProviderList = ({ services, onSelectService }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={`fixed left-0 right-0 bg-white shadow-[0_-5px_30px_rgba(0,0,0,0.1)] z-[900] transition-all duration-300 ease-in-out rounded-t-2xl
        ${isOpen ? 'bottom-0 h-[60vh]' : 'bottom-0 h-14'}`}
        >
            {/* Header / Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-14 flex items-center justify-center relative border-b border-gray-100"
            >
                <span className="text-sm font-semibold text-gray-500 absolute left-6">
                    {services.length} Providers Nearby
                </span>
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
                {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-gray-400 absolute right-6" />
                ) : (
                    <ChevronUp className="w-5 h-5 text-gray-400 absolute right-6" />
                )}
            </button>

            {/* List Content */}
            <div className="h-full overflow-y-auto pb-20 px-4 pt-2">
                {services.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                        <MapPin size={48} className="mb-2" />
                        <p className="text-sm">No providers found</p>
                    </div>
                ) : (
                    services.map((service, index) => (
                        <div
                            key={service.id || service.uid}
                            onClick={() => {
                                onSelectService(service);
                                setIsOpen(false); // Close list when opening details
                            }}
                            className="flex items-center gap-4 p-4 border-b border-gray-50 hover:bg-gray-50 active:bg-blue-50 transition-colors rounded-xl cursor-pointer relative"
                        >
                            {/* Near Me Badge */}
                            {index === 0 && service.distance && service.distance < 1 && (
                                <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                                    Near Me
                                </div>
                            )}

                            {/* Avatar Placeholder */}
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0">
                                {service.name[0]}
                            </div>

                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                                <div className="flex items-center text-sm text-gray-500 mt-0.5 gap-2">
                                    <span className="text-primary font-medium">{service.category}</span>
                                    {service.distanceText && (
                                        <>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {service.distanceText}
                                            </span>
                                        </>
                                    )}
                                </div>
                                {/* Star Rating */}
                                <div className="mt-1">
                                    <StarRating rating={service.rating || 0} size={14} />
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-xs font-bold text-gray-700">
                                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                    {(service.rating || 0).toFixed(1)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProviderList;
