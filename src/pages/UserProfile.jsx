import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
    User, MapPin, LogOut, Phone, MessageCircle,
    ChevronLeft, Edit2, Bell, Trash2,
    HelpCircle, Shield, Info, ChevronRight, Camera
} from 'lucide-react';

const UserProfile = () => {
    const { user, userData, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(userData?.photoURL || null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: userData?.name || '',
        email: userData?.email || '',
        area: userData?.area || ''
    });

    // Load profile image from userData
    useEffect(() => {
        if (userData?.photoURL) {
            setProfileImage(userData.photoURL);
        }
    }, [userData]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleSave = async () => {
        if (!user?.uid) return;

        setIsSaving(true);
        try {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                name: formData.name,
                area: formData.area
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user?.uid) return;

        setIsUploadingImage(true);
        try {
            // Create a storage reference
            const storageRef = ref(storage, `profile-pictures/${user.uid}`);

            // Upload the file
            await uploadBytes(storageRef, file);

            // Get the download URL
            const photoURL = await getDownloadURL(storageRef);

            // Update Firestore with the new photo URL
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { photoURL });

            // Update local state
            setProfileImage(photoURL);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            {/* Header */}
            <header className="bg-white shadow-sm flex-shrink-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-20">
                    {/* Top Profile Section */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex flex-col items-center text-center mb-6">
                            {/* Avatar with Upload */}
                            <div className="relative mb-4">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-[#2D2D2D] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                        {getInitials(userData?.name)}
                                    </div>
                                )}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingImage}
                                    className="absolute bottom-0 right-0 w-8 h-8 bg-[#2D2D2D] rounded-full flex items-center justify-center text-white hover:bg-black transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isUploadingImage ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Camera className="w-4 h-4" />
                                    )}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>

                            {/* Name */}
                            <h2 className="text-2xl font-bold text-gray-900">
                                {userData?.name || 'User'}
                            </h2>

                            {/* Email */}
                            <p className="text-gray-500 mt-1">
                                {userData?.email || user?.email || 'Not set'}
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-gray-100 rounded-xl p-4 text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <User className="w-5 h-5 text-gray-700" />
                                    <span className="text-2xl font-bold text-gray-900">Customer</span>
                                </div>
                                <p className="text-sm text-gray-600">Account Type</p>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-gray-700 text-sm font-medium flex items-center gap-1 hover:text-gray-900"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {/* Full Name */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900">{userData?.name || 'Not set'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                                    <p className="font-medium text-gray-900">{userData?.email || user?.email || 'Not set'}</p>
                                </div>
                            </div>

                            {/* Preferred Area */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 mb-1">Preferred Area / Locality</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.area}
                                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                            placeholder="e.g., Koramangala, Bangalore"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                                        />
                                    ) : (
                                        <p className="font-medium text-gray-900">{userData?.area || 'Not set'}</p>
                                    )}
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex-1 px-4 py-2 bg-[#2D2D2D] text-white rounded-lg hover:bg-black transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                name: userData?.name || '',
                                                email: userData?.email || '',
                                                area: userData?.area || ''
                                            });
                                        }}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium text-gray-900">Change Default Location</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>

                            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition">
                                <div className="flex items-center gap-3">
                                    <Bell className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium text-gray-900">Notifications</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D2D2D]"></div>
                                </label>
                            </div>

                            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition text-gray-900">
                                <div className="flex items-center gap-3">
                                    <Trash2 className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Clear Saved Services</span>
                                </div>
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition text-gray-900"
                            >
                                <div className="flex items-center gap-3">
                                    <LogOut className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">Log Out</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Help & About */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Help & About</h3>
                        <div className="space-y-2">
                            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition">
                                <div className="flex items-center gap-3">
                                    <HelpCircle className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium text-gray-900">How Servly Works</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>

                            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition">
                                <div className="flex items-center gap-3">
                                    <MessageCircle className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium text-gray-900">Report an Issue</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>

                            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium text-gray-900">Privacy Policy</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </button>

                            <div className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2 text-gray-400">
                                    <Info className="w-4 h-4" />
                                    <span className="text-sm">Servly v1.0.0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
};

export default UserProfile;
