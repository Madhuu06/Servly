import { useState } from 'react';
import { Phone, MessageCircle, Star, X, MapPin, Info, MessageSquare, CheckCircle, Clock, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useReviews } from '../hooks/useReviews';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

const categoryColors = {
    'Electrician': { from: '#FF8A00', to: '#FF6B00' },
    'Plumber': { from: '#1976D2', to: '#0D47A1' },
    'Carpenter': { from: '#7B1FA2', to: '#4A148C' },
    'Cleaner': { from: '#388E3C', to: '#1B5E20' },
    'AC Repair': { from: '#0097A7', to: '#006064' },
    'default': { from: '#1A1A1A', to: '#404040' },
};
const getCatGradient = (cat) => {
    const c = categoryColors[cat] || categoryColors.default;
    return `linear-gradient(135deg, ${c.from}, ${c.to})`;
};

const ServiceBottomSheet = ({ service, onClose }) => {
    const [activeTab, setActiveTab] = useState('info');
    const { userData } = useAuth();
    const { reviews, averageRating, reviewCount, loading: reviewsLoading } = useReviews(service?.uid);

    if (!service) return null;

    const rating = averageRating || service.rating || 0;

    const handleCall = () => {
        if (service.phone) window.location.href = `tel:${service.phone}`;
    };

    const handleWhatsApp = () => {
        if (service.phone) {
            const msg = encodeURIComponent(`Hi ${service.name}, I found you on Servly and would like to inquire about your ${service.category} services.`);
            window.open(`https://wa.me/${service.phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[1000]" onClick={onClose} />

            {/* Panel */}
            <div className="fixed top-0 right-0 h-full w-[400px] xl:w-[440px] bg-white z-[1001] flex flex-col animate-slide-in-right overflow-hidden"
                style={{ boxShadow: '-4px 0 40px rgba(0,0,0,0.15)' }}>

                {/* ── Hero ── */}
                <div className="relative h-48 flex-shrink-0 flex flex-col justify-end"
                    style={{ background: getCatGradient(service.category) }}>

                    {/* Subtle pattern overlay */}
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                    {/* Provider avatar */}
                    <div className="absolute top-1/2 left-5 -translate-y-1/2">
                        <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur border-2 border-white/30 flex items-center justify-center text-white text-4xl font-extrabold shadow-xl">
                            {service.name[0]}
                        </div>
                        <div className="absolute -bottom-1 -right-1 flex items-center gap-0.5 bg-green-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            Open
                        </div>
                    </div>

                    {/* Close button */}
                    <button onClick={onClose}
                        className="absolute top-4 right-4 w-9 h-9 bg-black/20 hover:bg-black/35 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors">
                        <X className="w-4 h-4 text-white" />
                    </button>

                    {/* Category tag */}
                    <div className="absolute top-4 left-4">
                        <span className="bg-white/20 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                            {service.category}
                        </span>
                    </div>

                    {/* Bottom info overlay */}
                    <div className="relative px-5 pb-4 pt-2 bg-gradient-to-t from-black/30 to-transparent">
                        <h2 className="text-xl font-extrabold text-white drop-shadow-sm">{service.name}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                                <span className="text-white text-sm font-bold">{rating.toFixed(1)}</span>
                                <span className="text-white/70 text-xs">({reviewCount})</span>
                            </div>
                            {service.distanceText && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-white/70" />
                                    <span className="text-white/80 text-xs">{service.distanceText}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Quick stats ── */}
                <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
                    <div className="grid grid-cols-3 gap-2.5">
                        {[
                            { icon: CheckCircle, label: 'Verified', sub: 'Provider', color: '#22C55E' },
                            { icon: Clock, label: 'Available', sub: 'Today', color: '#FF8A00' },
                            { icon: Award, label: rating.toFixed(1) + ' ★', sub: 'Rating', color: '#EAB308' },
                        ].map(({ icon: Icon, label, sub, color }) => (
                            <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                                <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color }} />
                                <p className="text-xs font-extrabold text-gray-900">{label}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="px-5 py-3 border-b border-gray-100 flex-shrink-0">
                    <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                        {[
                            { key: 'info', label: 'Info', icon: Info },
                            { key: 'reviews', label: `Reviews (${reviewCount})`, icon: MessageSquare },
                        ].map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === key ? 'text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                style={activeTab === key ? { background: 'linear-gradient(135deg, #FF8A00, #FF6B00)' } : {}}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Tab content ── */}
                <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
                    {activeTab === 'info' ? (
                        <div className="space-y-5 animate-fade-in">
                            <div>
                                <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">About</p>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {service.description || 'Professional service provider available in your area. Verified and trusted by the local community.'}
                                </p>
                            </div>

                            {service.address && (
                                <div>
                                    <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Address</p>
                                    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3.5">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                            style={{ background: 'linear-gradient(135deg, #FF8A00, #FF6B00)' }}>
                                            <MapPin className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="text-sm text-gray-700 mt-1">{service.address}</p>
                                    </div>
                                </div>
                            )}

                            {service.phone && (
                                <div>
                                    <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">Contact</p>
                                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3.5">
                                        <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-4 h-4 text-gray-600" />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">{service.phone}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4 animate-fade-in">
                            {userData?.userType === 'customer' && (
                                <ReviewForm providerId={service.uid} />
                            )}
                            <div>
                                <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Customer Reviews</p>
                                <ReviewList reviews={reviews} loading={reviewsLoading} />
                            </div>
                        </div>
                    )}
                </div>

                {/* ── CTA buttons ── */}
                <div className="px-5 py-4 bg-white border-t border-gray-100 flex-shrink-0">
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleCall}
                            className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white hover:opacity-90 active:scale-95 transition-all"
                            style={{ background: 'linear-gradient(135deg, #1A1A1A, #404040)' }}>
                            <Phone className="w-4 h-4" />
                            Call Now
                        </button>
                        <button onClick={handleWhatsApp}
                            className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white hover:opacity-90 active:scale-95 transition-all"
                            style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)' }}>
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp
                        </button>
                    </div>
                    <p className="text-center text-[10px] text-gray-400 mt-2.5">
                        Contacting via Servly — provider details verified
                    </p>
                </div>
            </div>
        </>
    );
};

export default ServiceBottomSheet;
