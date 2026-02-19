import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import {
    User, LogOut, Star, Phone, MapPin, Clock,
    CheckCircle, XCircle, Bell, Settings, Briefcase,
    TrendingUp, Calendar, MessageSquare, Mail, Edit2, Save, X, Trash2
} from 'lucide-react';
import DeleteAccountModal from '../components/DeleteAccountModal';

export default function ProviderDashboard() {
    const { userData, user, logout, deleteAccount } = useAuth();
    const { userLocation } = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [profileData, setProfileData] = useState({
        name: userData?.name || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        category: userData?.category || '',
        description: userData?.description || '',
        address: userData?.address || '',
        rating: userData?.rating || 0,
        isVerified: userData?.isVerified || false,
        latitude: userData?.latitude || null,
        longitude: userData?.longitude || null
    });

    // Update location when available
    useEffect(() => {
        if (userLocation && !profileData.latitude && !profileData.longitude) {
            setProfileData(prev => ({
                ...prev,
                latitude: userLocation.latitude,
                longitude: userLocation.longitude
            }));
        }
    }, [userLocation, profileData.latitude, profileData.longitude]);

    // Mock data for service requests
    const [serviceRequests] = useState([
        {
            id: 1,
            customerName: 'Rahul Kumar',
            service: 'Electrical Wiring',
            status: 'pending',
            date: '2026-01-29',
            time: '10:00 AM',
            address: 'MG Road, Bangalore',
            phone: '+91 98765 43210'
        },
        {
            id: 2,
            customerName: 'Priya Sharma',
            service: 'Fan Installation',
            status: 'accepted',
            date: '2026-01-29',
            time: '2:00 PM',
            address: 'Koramangala, Bangalore',
            phone: '+91 98765 43211'
        },
        {
            id: 3,
            customerName: 'Amit Patel',
            service: 'Light Fixture Repair',
            status: 'completed',
            date: '2026-01-28',
            time: '4:00 PM',
            address: 'Indiranagar, Bangalore',
            phone: '+91 98765 43212'
        }
    ]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Save to Firestore users collection
            await updateDoc(doc(db, 'users', user.uid), {
                name: profileData.name,
                phone: profileData.phone,
                category: profileData.category,
                description: profileData.description,
                address: profileData.address,
                latitude: profileData.latitude,
                longitude: profileData.longitude
            });

            // Also save/update in providers collection for map display
            await setDoc(doc(db, 'providers', user.uid), {
                uid: user.uid,
                name: profileData.name,
                phone: profileData.phone,
                category: profileData.category,
                description: profileData.description,
                address: profileData.address,
                latitude: profileData.latitude,
                longitude: profileData.longitude,
                rating: profileData.rating,
                reviewCount: 0,
                isVerified: profileData.isVerified,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteAccount();

            if (result.success) {
                // Account deleted successfully, redirect to login
                navigate('/login', { replace: true });
            } else {
                // Show error message
                alert(result.error || 'Failed to delete account. Please try again.');
                setShowDeleteModal(false);
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('An unexpected error occurred. Please try again.');
            setShowDeleteModal(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const stats = [
        { label: 'Total Requests', value: '24', icon: Briefcase, color: 'bg-blue-500' },
        { label: 'Completed', value: '18', icon: CheckCircle, color: 'bg-green-500' },
        { label: 'Pending', value: '4', icon: Clock, color: 'bg-yellow-500' },
        { label: 'Rating', value: user?.rating || '4.5', icon: Star, color: 'bg-purple-500' }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-900">{userData?.name || 'Provider'}</h1>
                            <p className="text-sm text-gray-500">{userData?.category || 'Service Provider'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                            <Settings className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Account"
                        >
                            <Trash2 className="w-5 h-5" />
                            <span className="hidden md:inline">Delete Account</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`${stat.color} p-2 rounded-lg`}>
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="flex border-b">
                        {['overview', 'requests', 'earnings'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-4 text-center font-medium capitalize transition-colors ${activeTab === tab
                                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="p-4">
                        {activeTab === 'overview' && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                                <div className="space-y-3">
                                    {serviceRequests.slice(0, 3).map((request) => (
                                        <div
                                            key={request.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{request.customerName}</p>
                                                    <p className="text-sm text-gray-500">{request.service}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.status === 'completed'
                                                ? 'bg-green-100 text-green-700'
                                                : request.status === 'accepted'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {request.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'requests' && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900">Service Requests</h3>
                                <div className="space-y-4">
                                    {serviceRequests.map((request) => (
                                        <div
                                            key={request.id}
                                            className="p-4 border rounded-lg hover:shadow-md transition"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{request.customerName}</h4>
                                                    <p className="text-purple-600 font-medium">{request.service}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.status === 'completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : request.status === 'accepted'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {request.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {request.date}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    {request.time}
                                                </div>
                                                <div className="flex items-center gap-2 col-span-2">
                                                    <MapPin className="w-4 h-4" />
                                                    {request.address}
                                                </div>
                                            </div>
                                            {request.status === 'pending' && (
                                                <div className="flex gap-2 mt-4">
                                                    <button className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition flex items-center justify-center gap-2">
                                                        <CheckCircle className="w-4 h-4" />
                                                        Accept
                                                    </button>
                                                    <button className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition flex items-center justify-center gap-2">
                                                        <XCircle className="w-4 h-4" />
                                                        Decline
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'earnings' && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900">Earnings Overview</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white">
                                        <p className="text-green-100 text-sm">This Month</p>
                                        <p className="text-3xl font-bold mt-1">₹12,500</p>
                                        <div className="flex items-center gap-1 mt-2 text-green-100 text-sm">
                                            <TrendingUp className="w-4 h-4" />
                                            +15% from last month
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white">
                                        <p className="text-blue-100 text-sm">This Week</p>
                                        <p className="text-3xl font-bold mt-1">₹3,200</p>
                                        <p className="text-blue-100 text-sm mt-2">5 completed jobs</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-white">
                                        <p className="text-purple-100 text-sm">Total Earnings</p>
                                        <p className="text-3xl font-bold mt-1">₹45,800</p>
                                        <p className="text-purple-100 text-sm mt-2">Since joining</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Delete Account Modal */}
            <DeleteAccountModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                isLoading={isDeleting}
            />
        </div>
    );
};
