import { useState } from 'react';
import { Phone, MessageCircle, Star, X, MapPin, Info, MessageSquare, Award, Clock } from 'lucide-react';
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
        if (service.phone) window.location.href = `tel:${service.phone}`;
    };

    const handleWhatsApp = () => {
        if (service.phone) {
            const message = encodeURIComponent(`Hi ${service.name}, I found you on Servly and would like to inquire about your ${service.category} services.`);
            window.open(`https://wa.me/${service.phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
        }
    };

    const rating = averageRating || service.rating || 0;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[1000]"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="fixed top-0 right-0 h-full w-[400px] xl:w-[440px] bg-white z-[1001] shadow-2xl flex flex-col animate-slide-in-right">

                {/* Dark hero */}
                <div className="relative h-44 flex-shrink-0" style={{ background: '#1A1A1A' }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-4xl font-bold text-white border border-white/20">
                            {service.name[0]}
                        </div>
                    </div>
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                    {/* Category */}
                    <div className="absolute bottom-4 left-5">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-xl text-white"
                            style={{ backgroundColor: '#FF8A00' }}>
                            {service.category}
                        </span>
                    </div>
                </div>

                {/* Info header */}
                <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">{service.name}</h2>

                    <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2">
                        <div className="flex items-center gap-1.5">
                            <StarRating rating={rating} size={14} />
                            <span className="text-sm font-bold text-gray-800">{rating.toFixed(1)}</span>
                            <span className="text-xs text-gray-400">({reviewCount} reviews)</span>
                        </div>
                        {service.distanceText && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                <MapPin className="w-3.5 h-3.5" />
                                {service.distanceText} away
                            </span>
                        )}
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {[
                            { icon: Award, label: 'Verified', sub: 'Provider' },
                            { icon: Clock, label: 'Available', sub: 'Today' },
                            { icon: Star, label: `${rating.toFixed(1)} ★`, sub: 'Rating' },
                        ].map(({ icon: Icon, label, sub }) => (
                            <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                                <Icon className="w-4 h-4 text-gray-600 mx-auto mb-1" />
                                <p className="text-xs font-bold text-gray-900">{label}</p>
                                <p className="text-[10px] text-gray-400">{sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mt-4 bg-gray-100 rounded-xl p-1">
                        {[
                            { key: 'info', label: 'Info', icon: Info },
                            { key: 'reviews', label: `Reviews (${reviewCount})`, icon: MessageSquare }
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                style={activeTab === key ? { backgroundColor: '#FF8A00', color: '#fff' } : {}}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all
                                    ${activeTab !== key ? 'text-gray-500 hover:text-gray-700' : ''}`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
                    {activeTab === 'info' ? (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">About</h3>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {service.description || 'Professional service provider available in your area. Verified and trusted by the community.'}
                                </p>
                            </div>
                            {service.address && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Address</h3>
                                    <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-3">
                                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-gray-700">{service.address}</p>
                                    </div>
                                </div>
                            )}
                            {service.phone && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Contact</h3>
                                    <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-3">
                                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                        <p className="text-sm text-gray-700">{service.phone}</p>
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
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Customer Reviews</h3>
                                <ReviewList reviews={reviews} loading={reviewsLoading} />
                            </div>
                        </div>
                    )}
                </div>

                {/* CTA buttons */}
                <div className="px-5 py-4 bg-white border-t border-gray-100 flex-shrink-0">
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleCall}
                            style={{ backgroundColor: '#1A1A1A' }}
                            className="flex items-center justify-center gap-2 text-white py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition"
                        >
                            <Phone className="w-4 h-4" />
                            Call Now
                        </button>
                        <button
                            onClick={handleWhatsApp}
                            className="flex items-center justify-center gap-2 text-white py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition"
                            style={{ backgroundColor: '#25D366' }}
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
