import { useState } from 'react';
import { Phone, MessageCircle, Star, X, MapPin, Info, MessageSquare, CheckCircle, Clock, Award } from 'lucide-react';
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

    const rating = averageRating || service.rating || 0;
    const initial = (service.name?.[0] || '?').toUpperCase();
    const phone = service.phone || '';
    const hasPhone = phone.trim().length > 0;

    const handleCall = () => {
        if (hasPhone) {
            window.location.href = `tel:${phone}`;
        } else {
            alert('Phone number not available for this provider.');
        }
    };

    const handleWhatsApp = () => {
        if (hasPhone) {
            const digits = phone.replace(/[^0-9]/g, '');
            // Ensure country code — default to India (+91) if missing
            const number = digits.startsWith('91') ? digits : `91${digits}`;
            const msg = encodeURIComponent(`Hi ${service.name}, I found you on Servly and would like to inquire about your ${service.category} services.`);
            window.open(`https://wa.me/${number}?text=${msg}`, '_blank');
        } else {
            alert('Phone number not available for this provider.');
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/30 z-[1000]" onClick={onClose} />

            {/* Panel */}
            <div className="fixed top-0 right-0 h-full w-[380px] bg-white z-[1001] flex flex-col animate-slide-in-right shadow-2xl">

                {/* ── Header ── */}
                <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
                    {/* Close */}
                    <button onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>

                    {/* Category tag */}
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        {service.category}
                    </span>

                    {/* Avatar + Name */}
                    <div className="flex items-center gap-3 mt-3">
                        <div className="w-12 h-12 rounded-full bg-gray-900 text-white text-lg font-bold flex items-center justify-center flex-shrink-0">
                            {initial}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">{service.name}</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="flex items-center gap-0.5">
                                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-semibold text-gray-800">{rating.toFixed(1)}</span>
                                    <span className="text-xs text-gray-400">({reviewCount})</span>
                                </div>
                                {service.distanceText && (
                                    <span className="text-xs text-gray-400 flex items-center gap-0.5">
                                        · <MapPin className="w-3 h-3" /> {service.distanceText}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Quick stats ── */}
                <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { icon: CheckCircle, label: 'Verified', sub: 'Provider', color: '#22C55E' },
                            { icon: Clock, label: 'Available', sub: 'Today', color: '#FF8A00' },
                            { icon: Award, label: rating.toFixed(1) + ' ★', sub: 'Rating', color: '#EAB308' },
                        ].map(({ icon: Icon, label, sub, color }) => (
                            <div key={label} className="bg-gray-50 rounded-xl p-2.5 text-center">
                                <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
                                <p className="text-[11px] font-bold text-gray-800">{label}</p>
                                <p className="text-[10px] text-gray-400">{sub}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="px-5 py-2.5 border-b border-gray-100 flex-shrink-0">
                    <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                        {[
                            { key: 'info', label: 'Info', icon: Info },
                            { key: 'reviews', label: `Reviews (${reviewCount})`, icon: MessageSquare },
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === key
                                    ? 'bg-gray-900 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {activeTab === 'info' ? (
                        <div className="space-y-5">
                            <div>
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">About</p>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {service.description || 'Professional service provider available in your area.'}
                                </p>
                            </div>

                            {service.address && (
                                <div>
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Address</p>
                                    <div className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-3">
                                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-gray-600">{service.address}</p>
                                    </div>
                                </div>
                            )}

                            {/* Contact — always show */}
                            <div>
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Contact</p>
                                <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl p-3">
                                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <p className="text-sm font-medium text-gray-800">
                                        {hasPhone ? phone : <span className="text-gray-400 font-normal">Not provided</span>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {userData?.userType === 'customer' && (
                                <ReviewForm providerId={service.uid} />
                            )}
                            <div>
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer Reviews</p>
                                <ReviewList reviews={reviews} loading={reviewsLoading} />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── CTA buttons ── */}
                <div className="px-5 py-4 bg-white border-t border-gray-100 flex-shrink-0">
                    <div className="grid grid-cols-2 gap-2.5">
                        <button onClick={handleCall}
                            disabled={!hasPhone}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm active:scale-[0.98] transition-all ${hasPhone
                                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}>
                            <Phone className="w-4 h-4" /> Call Now
                        </button>
                        <button onClick={handleWhatsApp}
                            disabled={!hasPhone}
                            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm active:scale-[0.98] transition-all ${hasPhone
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}>
                            <MessageCircle className="w-4 h-4" /> WhatsApp
                        </button>
                    </div>
                    {!hasPhone && (
                        <p className="text-center text-[10px] text-amber-500 mt-2">
                            Provider hasn't added a phone number yet
                        </p>
                    )}
                    {hasPhone && (
                        <p className="text-center text-[10px] text-gray-400 mt-2">
                            Contact via Servly — provider details verified
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ServiceBottomSheet;
