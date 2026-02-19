import { useState } from 'react';
import { Phone, MessageCircle, Star, X, MapPin, Info, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../hooks/useReviews';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

const ServiceBottomSheet = ({ service, onClose }) => {
    const [activeTab, setActiveTab] = useState('info');
    const { userData } = useAuth();
    const { reviews, averageRating, reviewCount, loading: reviewsLoading } = useReviews(service?.uid);

    if (!service) return null;

    const handleCall = () => {
        if (service.phone) {
            window.location.href = `tel:${service.phone}`;
        }
    };

    const handleWhatsApp = () => {
        if (service.phone) {
            const message = encodeURIComponent(`Hi ${service.name}, I found you on Servly and would like to inquire about your ${service.category} services.`);
            window.open(`https://wa.me/${service.phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/20 z-[1000] backdrop-blur-[1px]"
                onClick={onClose}
            />

            {/* Right Panel */}
            <div className="fixed top-0 right-0 h-full w-96 xl:w-[420px] bg-white shadow-2xl z-[1001] flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-gray-100">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 mr-3">
                            {/* Avatar + Name */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                                    {service.name[0]}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{service.name}</h2>
                                    <span className="inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-xs font-semibold mt-0.5">
                                        {service.category}
                                    </span>
                                </div>
                            </div>

                            {/* Rating Row */}
                            <div className="flex items-center gap-2">
                                <StarRating rating={averageRating || service.rating || 0} size={16} />
                                <span className="font-bold text-gray-800 text-sm">
                                    {(averageRating || service.rating || 0).toFixed(1)}
                                </span>
                                <span className="text-gray-400 text-xs">({reviewCount} reviews)</span>
                                {service.distanceText && (
                                    <>
                                        <span className="text-gray-300">·</span>
                                        <span className="flex items-center text-xs text-gray-500 gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {service.distanceText}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex-shrink-0"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mt-4">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'info'
                                ? 'bg-[#2D2D2D] text-white'
                                : 'text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            <Info size={14} />
                            Info
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'reviews'
                                ? 'bg-[#2D2D2D] text-white'
                                : 'text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            <MessageSquare size={14} />
                            Reviews ({reviewCount})
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {activeTab === 'info' ? (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">About</h3>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {service.description || "Professional service provider available. Verified and trusted by the community."}
                                </p>
                            </div>

                            {service.address && (
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Address</h3>
                                    <div className="flex items-start gap-2 text-sm text-gray-700">
                                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <p>{service.address}</p>
                                    </div>
                                </div>
                            )}

                            {service.phone && (
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Contact</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <p>{service.phone}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {userData?.userType === 'customer' && (
                                <ReviewForm providerId={service.uid} />
                            )}
                            <div>
                                <h3 className="text-sm font-semibold mb-3 text-gray-800">Customer Reviews</h3>
                                <ReviewList reviews={reviews} loading={reviewsLoading} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Fixed Action Buttons */}
                <div className="px-6 py-4 bg-white border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleCall}
                            className="flex items-center justify-center gap-2 bg-[#2D2D2D] text-white py-3 rounded-xl font-semibold hover:bg-black transition-colors text-sm"
                        >
                            <Phone className="w-4 h-4" />
                            Call Now
                        </button>
                        <button
                            onClick={handleWhatsApp}
                            className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-semibold hover:bg-[#20b858] transition-colors text-sm"
                        >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServiceBottomSheet;
