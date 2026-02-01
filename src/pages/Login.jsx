import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Phone, ArrowRight, Shield } from 'lucide-react';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Enter phone, 2: Enter OTP
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { sendOTP, verifyOTP } = useAuth();
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Format phone number to E.164 format (add +91 if not present)
        let formattedPhone = phoneNumber.trim();
        if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+91' + formattedPhone;
        }

        const result = await sendOTP(formattedPhone);

        if (result.success) {
            setConfirmationResult(result.confirmationResult);
            setStep(2);
        } else {
            setError(result.error);
        }
        setIsLoading(false);
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await verifyOTP(confirmationResult, otp);

        if (result.success) {
            navigate(result.userType === 'provider' ? '/provider-dashboard' : '/');
        } else {
            setError(result.error);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#E8E4C9] flex items-center justify-center p-4">
            {/* reCAPTCHA container */}
            <div id="recaptcha-container"></div>

            <div className="w-full max-w-md">
                {/* Main Card */}
                <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden">

                    {/* Header Image */}
                    <div className="relative h-52 bg-gradient-to-br from-[#E8E4C9] to-[#F5F3E7] overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop"
                            alt="Service Provider"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                    </div>

                    <div className="p-8 -mt-8 relative">
                        {/* Title */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                {step === 1 ? 'Welcome Back' : 'Verify OTP'}
                            </h1>
                            <p className="text-gray-500 mt-2">
                                {step === 1
                                    ? 'Sign in to continue to Servly'
                                    : `Enter the 6-digit code sent to ${phoneNumber}`
                                }
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm mb-6 border border-red-100">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        {step === 1 ? (
                            <form onSubmit={handleSendOTP} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#2D2D2D] outline-none transition text-gray-800 placeholder-gray-400"
                                            placeholder="Enter your phone number"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Format: 9876543210 or +919876543210
                                    </p>
                                </div>

                                {/* Send OTP Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#2D2D2D] text-white py-4 rounded-full font-medium flex items-center justify-center gap-3 hover:bg-[#1a1a1a] transition-all disabled:opacity-70 mt-8"
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
                            </form>
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
                                            <span>Verify & Sign In</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                {/* Resend OTP */}
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-sm text-gray-600 hover:text-gray-900 transition"
                                >
                                    Change phone number
                                </button>
                            </form>
                        )}

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-500">
                                Don't have an account?{' '}
                                <Link
                                    to="/signup"
                                    className="text-[#2D2D2D] font-semibold hover:underline"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
