import { MapPin } from 'lucide-react';

const ProviderList = ({ services, onSelectService, selectedService, searchTerm = '' }) => {

    const filtered = services.filter(s => {
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
            s.name?.toLowerCase().includes(q) ||
            s.category?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="flex flex-col h-full bg-white">

            {/* Header */}
            <div className="px-4 pt-4 pb-2 flex-shrink-0">
                <p className="text-xs text-gray-400 font-medium">
                    {filtered.length} nearby
                </p>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center px-4">
                        <MapPin className="w-6 h-6 text-gray-300 mb-2" />
                        <p className="text-sm text-gray-400">
                            {searchTerm ? `No results for "${searchTerm}"` : 'No providers found'}
                        </p>
                    </div>
                ) : (
                    filtered.map(service => {
                        const isSelected =
                            selectedService?.uid === service.uid ||
                            selectedService?.id === service.id;
                        const initial = (service.name?.[0] || '?').toUpperCase();
                        const rating = service.rating ? service.rating.toFixed(1) : null;

                        return (
                            <button
                                key={service.id || service.uid}
                                onClick={() => onSelectService(service)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'
                                    }`}
                            >
                                {/* Initial circle */}
                                <div className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 text-xs font-semibold transition-colors ${isSelected
                                        ? 'border-gray-900 text-gray-900 bg-gray-900/5'
                                        : 'border-gray-300 text-gray-500'
                                    }`}>
                                    {initial}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold leading-tight truncate ${isSelected ? 'text-gray-900' : 'text-gray-800'
                                        }`}>
                                        {service.name}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                                        {service.category}
                                        {rating && (
                                            <> · <span className="text-yellow-500">★</span> {rating}</>
                                        )}
                                        {service.distanceText && (
                                            <> · <span className="inline-flex items-center gap-0.5">
                                                <MapPin className="inline w-2.5 h-2.5" />{service.distanceText}
                                            </span></>
                                        )}
                                    </p>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ProviderList;
