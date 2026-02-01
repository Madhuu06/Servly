import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Phone, ArrowRight, Briefcase, MapPin, Shield, Navigation } from 'lucide-react';
import { categories } from '../data/services';

const Signup = () => {
    const [step, setStep] = useState(1); // 1: User type & basic info, 2: Provider details, 3: OTP verification
    const [userType, setUserType] = useState('customer');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        category: '',
        description: '',
        address: '',
        latitude: null,
        longitude: null
    });
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    const { sendOTP, verifyOTP } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError('');
    };

    const validateStep1 = () => {
        if (!formData.name.trim()) {
            setError('Please enter your name');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Please enter your phone number');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (userType === 'provider') {
            if (!formData.category) {
                setError('Please select a service category');
                return false;
            }
            if (!formData.description.trim()) {
                setError('Please describe your services');
                return false;
            }
            if (!formData.address.trim()) {
                setError('Please enter your business address');
                return false;
            }
            if (!formData.latitude || !formData.longitude) {
                setError('Please capture your location');
                return false;
            }
        }
        return true;
    };

    const handleGetLocation = () => {
        setIsGettingLocation(true);
        setError('');

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setIsGettingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
                setIsGettingLocation(false);
            },
            (error) => {
                console.error('Geolocation error:', error);
                setError('Unable to get your location. Please enable location services.');
                setIsGettingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const handleNextStep = () => {
        if (step === 1 && validateStep1()) {
            if (userType === 'customer') {
                // Skip step 2 for customers, go directly to OTP
                handleSendOTP();
            } else {
                setStep(2);
            }
        } else if (step === 2 && validateStep2()) {
            handleSendOTP();
        }
    };

    const handleSendOTP = async () => {
        setError('');
        setIsLoading(true);

        // Format phone number to E.164 format
        let formattedPhone = formData.phone.trim();
        if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+91' + formattedPhone;
        }

        const result = await sendOTP(formattedPhone);

        if (result.success) {
            setConfirmationResult(result.confirmationResult);
            setStep(3);
        } else {
            setError(result.error);
        }
        setIsLoading(false);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const userData = {
            name: formData.name,
            userType: userType,
            ...(userType === 'provider' && {
                category: formData.category,
                description: formData.description,
                address: formData.address,
                latitude: formData.latitude,
                longitude: formData.longitude
            })
        };

        const result = await verifyOTP(confirmationResult, otp, userData);

        if (result.success) {
            navigate(userType === 'provider' ? '/provider-dashboard' : '/');
        } else {
            setError(result.error);
        }
        setIsLoading(false);
    };

    const serviceCategories = categories.filter(c => c.id !== 'all');

    return (
        <div className="min-h-screen bg-[#E8E4C9] flex items-center justify-center p-4">
            {/* reCAPTCHA container */}
            <div id="recaptcha-container"></div>

            <div className="w-full max-w-md">
                {/* Main Card */}
                <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden">

                    {/* Header */}
                    <div className="relative h-44 bg-gradient-to-br from-[#E8E4C9] to-[#F5F3E7] overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&h=250&fit=crop"
                            alt="Home Services"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>

                        {/* Step Indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-[#2D2D2D] text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                                {userType === 'provider' && (
                                    <>
                                        <div className={`w-8 h-1 rounded ${step >= 2 ? 'bg-[#2D2D2D]' : 'bg-gray-200'}`}></div>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-[#2D2D2D] text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                                    </>
                                )}
                                <div className={`w-8 h-1 rounded ${step >= 3 ? 'bg-[#2D2D2D]' : 'bg-gray-200'}`}></div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-[#2D2D2D] text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {userType === 'provider' ? '3' : '2'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Title */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                {step === 1 ? 'Create Account' : step === 2 ? 'Service Details' : 'Verify OTP'}
                            </h1>
                            <p className="text-gray-500 mt-2">
                                {step === 1
                                    ? 'Join Servly to get started'
                                    : step === 2
                                        ? 'Tell us about your services'
                                        : `Enter the code sent to ${formData.phone}`
                                }
                            </p>
                        </div>

                        {/* User Type Toggle - Only on Step 1 */}
                        {step === 1 && (
                            <div className="flex gap-3 mb-6">
                                <button
                                    type="button"
                                    onClick={() => setUserType('customer')}
                                    className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all ${userType === 'customer'
                                        ? 'bg-[#2D2D2D] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Customer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setUserType('provider')}
                                    className={`flex-1 py-3 px-4 rounded-full text-sm font-medium transition-all ${userType === 'provider'
                                        ? 'bg-[#2D2D2D] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Service Provider
                                </button>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 border border-red-100">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        {step === 1 ? (
                            <div className="space-y-4">
                                {/* Name */}
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#2D2D2D] outline-none transition text-gray-800 placeholder-gray-400"
                                        placeholder="Full Name"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#2D2D2D] outline-none transition text-gray-800 placeholder-gray-400"
                                        placeholder="Phone Number"
                                    />
                                </div>

                                <p className="text-xs text-gray-500 text-center">
                                    Format: 9876543210 or +919876543210
                                </p>

                                {/* Next Button */}
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    disabled={isLoading}
                                    className="w-full bg-[#2D2D2D] text-white py-4 rounded-full font-medium flex items-center justify-center gap-3 hover:bg-[#1a1a1a] transition-all mt-6 disabled:opacity-70"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Continue</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : step === 2 ? (
                            <div className="space-y-4">
                                {/* Category */}
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#2D2D2D] outline-none transition text-gray-800 appearance-none"
                                    >
                                        <option value="">Select Category</option>
                                        {serviceCategories.map(cat => (
                                            <option key={cat.id} value={cat.label}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Description */}
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#2D2D2D] outline-none transition text-gray-800 placeholder-gray-400 resize-none"
                                    placeholder="Describe your services..."
                                />

                                {/* Address */}
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#2D2D2D] outline-none transition text-gray-800 placeholder-gray-400"
                                        placeholder="Business Address"
                                    />
                                </div>

                                {/* Location Capture */}
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={handleGetLocation}
                                        disabled={isGettingLocation}
                                        className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-70"
                                    >
                                        {isGettingLocation ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                                                <span>Getting Location...</span>
                                            </>
                                        ) : formData.latitude && formData.longitude ? (
                                            <>
                                                <Navigation className="w-5 h-5 text-green-600" />
                                                <span className="text-green-600">Location Captured ✓</span>
                                            </>
                                        ) : (
                                            <>
                                                <Navigation className="w-5 h-5" />
                                                <span>Capture My Location</span>
                                            </>
                                        )}
                                    </button>
                                    {formData.latitude && formData.longitude && (
                                        <p className="text-xs text-gray-500 text-center">
                                            📍 {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                                        </p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="px-6 py-4 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        disabled={isLoading}
                                        className="flex-1 bg-[#2D2D2D] text-white py-4 rounded-full font-medium flex items-center justify-center gap-3 hover:bg-[#1a1a1a] transition-all disabled:opacity-70"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span>Send OTP</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleVerifyOTP} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        OTP Code
                                    </label>
                                    <div className="relative">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#2D2D2D] outline-none transition text-gray-800 placeholder-gray-400 text-center text-2xl tracking-widest"
                                            placeholder="000000"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Verify Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#2D2D2D] text-white py-4 rounded-full font-medium flex items-center justify-center gap-3 hover:bg-[#1a1a1a] transition-all disabled:opacity-70 mt-8"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>Create Account</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                {/* Change Number */}
                                <button
                                    type="button"
                                    onClick={() => setStep(userType === 'provider' ? 2 : 1)}
                                    className="w-full text-sm text-gray-600 hover:text-gray-900 transition"
                                >
                                    Change phone number
                                </button>
                            </form>
                        )}

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-500">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="text-[#2D2D2D] font-semibold hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
