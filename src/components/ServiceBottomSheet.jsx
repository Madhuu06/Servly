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
        <div className="fixed bottom-0 left-0 right-0 z-[1001] bg-white rounded-t-3xl shadow-[0_-5px_30px_rgba(0,0,0,0.15)] animate-slide-up max-h-[80vh] overflow-hidden flex flex-col">
            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
                <div className="w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer" />
            </div>

            <div className="px-6 pt-2 pb-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{service.name}</h2>
                        <div className="flex items-center text-gray-500 text-sm mt-1 gap-2">
                            <span className="bg-blue-100 text-primary px-2 py-0.5 rounded text-xs font-semibold">
                                {service.category}
                            </span>
                            {service.distanceText && (
                                <span className="flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {service.distanceText} away
                                </span>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <StarRating rating={averageRating || service.rating || 0} size={18} />
                    <span className="font-bold text-gray-800">{(averageRating || service.rating || 0).toFixed(1)}</span>
                    <span className="text-gray-400 text-xs">({reviewCount} reviews)</span>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${activeTab === 'info'
                                ? 'text-[#2D2D2D] border-b-2 border-[#2D2D2D]'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Info size={16} />
                        Info
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${activeTab === 'reviews'
                                ? 'text-[#2D2D2D] border-b-2 border-[#2D2D2D]'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <MessageSquare size={16} />
                        Reviews ({reviewCount})
                    </button>
                </div>
            </div>

            {/* Tab Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
                {activeTab === 'info' ? (
                    <div>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                            {service.description || "Professional service provider available. Verified and trusted by the community."}
                        </p>

                        {service.address && (
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-800 mb-1">Address</h3>
                                <p className="text-sm text-gray-600">{service.address}</p>
                            </div>
                        )}

                        {service.phone && (
                            <div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-800 mb-1">Contact</h3>
                                <p className="text-sm text-gray-600">{service.phone}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Review Form - Only for customers */}
                        {userData?.userType === 'customer' && (
                            <ReviewForm providerId={service.uid} />
                        )}

                        {/* Reviews List */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-800">Customer Reviews</h3>
                            <ReviewList reviews={reviews} loading={reviewsLoading} />
                        </div>
                    </div>
                )}
            </div>

            {/* Actions - Fixed at bottom */}
            <div className="px-6 pb-6 pt-4 bg-white border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleCall}
                        className="flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-200 active:scale-95 transition-transform"
                    >
                        <Phone className="w-5 h-5" />
                        Call Now
                    </button>
                    <button
                        onClick={handleWhatsApp}
                        className="flex items-center justify-center gap-2 bg-whatsapp text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-green-100 active:scale-95 transition-transform"
                    >
                        <MessageCircle className="w-5 h-5" />
                        WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ServiceBottomSheet;
