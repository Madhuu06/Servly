import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
    User, MapPin, LogOut, Mail,
    ChevronLeft, Edit2, Bell, Trash2,
    Shield, Info, ChevronRight, Camera,
    CheckCircle, AlertCircle
} from 'lucide-react';

const UserProfile = () => {
    const { user, userData, logout, updateUserData } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(userData?.photoURL || null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        name: userData?.name || '',
        area: userData?.area || ''
    });

    useEffect(() => {
        if (userData?.photoURL) setProfileImage(userData.photoURL);
    }, [userData]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleSave = async () => {
        if (!user?.uid) return;
        if (!formData.name.trim()) {
            setSaveStatus('error');
            return;
        }

        setIsSaving(true);
        setSaveStatus(null);
        try {
            const userRef = doc(db, 'users', user.uid);
            const updates = { name: formData.name.trim(), area: formData.area.trim() };
            await updateDoc(userRef, updates);
            // Update local context so the UI reflects changes immediately
            updateUserData(updates);
            setIsEditing(false);
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            console.error('Error saving profile:', error);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user?.uid) return;

        // Validate file type and size
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Image must be smaller than 5MB.');
            return;
        }

        setIsUploadingImage(true);
        try {
            const storageRef = ref(storage, `profile-pictures/${user.uid}`);
            await uploadBytes(storageRef, file);
            const photoURL = await getDownloadURL(storageRef);

            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { photoURL });
            updateUserData({ photoURL });
            setProfileImage(photoURL);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Make sure Firebase Storage is enabled.');
        } finally {
            setIsUploadingImage(false);
            // Reset input so same file can be re-selected
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleClearSavedServices = () => {
        // Clear any locally stored favourites (future feature placeholder with feedback)
        localStorage.removeItem('servly_saved_services');
        alert('Saved services cleared.');
    };

    const handleChangeLocation = () => {
        setIsEditing(true);
        // Scroll into view to show the area field
        setTimeout(() => {
            document.getElementById('area-field')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 flex-shrink-0">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">My Profile</h1>

                    {/* Save status toast */}
                    {saveStatus === 'success' && (
                        <div className="ml-auto flex items-center gap-1.5 text-green-600 text-sm font-medium animate-fade-in">
                            <CheckCircle className="w-4 h-4" />
                            Saved!
                        </div>
                    )}
                    {saveStatus === 'error' && (
                        <div className="ml-auto flex items-center gap-1.5 text-red-500 text-sm font-medium">
                            <AlertCircle className="w-4 h-4" />
                            Failed to save
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 pb-8">

                    {/* ── Profile Card ── */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex items-center gap-5">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-2xl object-cover"
                                    />
                                ) : (
                                    <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                                        {getInitials(userData?.name)}
                                    </div>
                                )}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingImage}
                                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-lg transition disabled:opacity-60"
                                    title="Upload avatar"
                                >
                                    {isUploadingImage ? (
                                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Camera className="w-3.5 h-3.5" />
                                    )}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h2 className="text-xl font-bold text-gray-900 truncate">
                                    {userData?.name || 'User'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5 truncate">
                                    {userData?.email || user?.email}
                                </p>
                                <span className="inline-block mt-2 text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg capitalize">
                                    {userData?.userType || 'Customer'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ── Personal Information ── */}
                    <div className="bg-white rounded-2xl shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Personal Information</h3>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    Edit
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {/* Name */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-gray-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400 mb-0.5">Full Name</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-sm"
                                            placeholder="Your full name"
                                        />
                                    ) : (
                                        <p className="text-sm font-medium text-gray-900">{userData?.name || 'Not set'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email (read-only) */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400 mb-0.5">Email Address</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {userData?.email || user?.email || 'Not set'}
                                    </p>
                                </div>
                            </div>

                            {/* Preferred Area */}
                            <div className="flex items-center gap-3" id="area-field">
                                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400 mb-0.5">Preferred Area</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.area}
                                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                            placeholder="e.g. Koramangala, Bangalore"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none text-sm"
                                        />
                                    ) : (
                                        <p className="text-sm font-medium text-gray-900">{userData?.area || 'Not set'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Save/Cancel buttons */}
                            {isEditing && (
                                <div className="flex gap-2 pt-1">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({ name: userData?.name || '', area: userData?.area || '' });
                                        }}
                                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Settings ── */}
                    <div className="bg-white rounded-2xl shadow-sm p-5">
                        <h3 className="font-semibold text-gray-900 mb-3">Settings</h3>
                        <div className="space-y-1">
                            {/* Change Default Location */}
                            <button
                                onClick={handleChangeLocation}
                                className="w-full flex items-center justify-between px-3 py-3 hover:bg-gray-50 rounded-xl transition group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-900">Change Default Location</p>
                                        <p className="text-xs text-gray-400">{userData?.area || 'Not set'}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
                            </button>

                            {/* Notifications Toggle */}
                            <div className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 rounded-xl transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                                        <Bell className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">Notifications</p>
                                </div>
                                <button
                                    onClick={() => setNotificationsEnabled(prev => !prev)}
                                    className={`relative w-11 h-6 rounded-full transition-colors ${notificationsEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                                >
                                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notificationsEnabled ? 'translate-x-5' : ''}`} />
                                </button>
                            </div>

                            {/* Clear Saved Services */}
                            <button
                                onClick={handleClearSavedServices}
                                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-xl transition"
                            >
                                <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
                                    <Trash2 className="w-4 h-4 text-orange-500" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Clear Saved Services</p>
                            </button>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-red-50 rounded-xl transition group"
                            >
                                <div className="w-9 h-9 bg-red-50 group-hover:bg-red-100 rounded-xl flex items-center justify-center">
                                    <LogOut className="w-4 h-4 text-red-500" />
                                </div>
                                <p className="text-sm font-medium text-red-500">Log Out</p>
                            </button>
                        </div>
                    </div>

                    {/* ── Privacy & App Info (compact) ── */}
                    <div className="flex items-center justify-between px-2 pb-2">
                        <button
                            onClick={() => alert('Privacy Policy coming soon.')}
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition"
                        >
                            <Shield className="w-3.5 h-3.5" />
                            Privacy Policy
                        </button>
                        <div className="flex items-center gap-1.5 text-xs text-gray-300">
                            <Info className="w-3.5 h-3.5" />
                            Servly v1.0.0
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
