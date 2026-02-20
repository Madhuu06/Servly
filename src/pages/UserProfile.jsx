import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
    User, MapPin, LogOut, Mail,
    ChevronLeft, Edit2, Bell,
    Shield, Info, Camera,
    CheckCircle, AlertCircle, Trash2
} from 'lucide-react';

const UserProfile = () => {
    const { user, userData, logout, deleteAccount, updateUserData } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(userData?.photoURL || null);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');
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

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            setDeleteError('Type DELETE exactly to confirm.');
            return;
        }
        setIsDeleting(true);
        setDeleteError('');
        const result = await deleteAccount();
        if (result.success) {
            navigate('/login');
        } else {
            setDeleteError(result.error || 'Failed to delete account.');
            setIsDeleting(false);
        }
    };

    const handleSave = async () => {
        if (!user?.uid || !formData.name.trim()) {
            setSaveStatus('error');
            return;
        }
        setIsSaving(true);
        setSaveStatus(null);
        try {
            const updates = { name: formData.name.trim(), area: formData.area.trim() };
            await updateDoc(doc(db, 'users', user.uid), updates);
            updateUserData(updates);
            setIsEditing(false);
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (err) {
            console.error(err);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !user?.uid) return;
        if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
        if (file.size > 5 * 1024 * 1024) { alert('Image must be < 5MB.'); return; }
        setIsUploadingImage(true);
        try {
            const storageRef = ref(storage, `profile-pictures/${user.uid}`);
            await uploadBytes(storageRef, file);
            const photoURL = await getDownloadURL(storageRef);
            await updateDoc(doc(db, 'users', user.uid), { photoURL });
            updateUserData({ photoURL });
            setProfileImage(photoURL);
        } catch (err) {
            console.error(err);
            alert('Upload failed. Check Firebase Storage rules.');
        } finally {
            setIsUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const Row = ({ icon: Icon, label, value, children }) => (
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex-1">
                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                {children || <p className="text-sm font-medium text-gray-900">{value || 'Not set'}</p>}
            </div>
        </div>
    );

    return (
        <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
            {/* Header */}
            <header className="bg-white border-b border-gray-200 flex-shrink-0">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900">My Profile</h1>

                    {saveStatus === 'success' && (
                        <div className="ml-auto flex items-center gap-1.5 text-green-600 text-sm font-medium">
                            <CheckCircle className="w-4 h-4" /> Saved!
                        </div>
                    )}
                    {saveStatus === 'error' && (
                        <div className="ml-auto flex items-center gap-1.5 text-red-500 text-sm font-medium">
                            <AlertCircle className="w-4 h-4" /> Failed
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="max-w-2xl mx-auto px-4 py-5 space-y-4 pb-8">

                    {/* ── Profile card ── */}
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                        {/* Dark top banner */}
                        <div className="h-20" style={{ backgroundColor: '#1A1A1A' }} />
                        <div className="px-5 pb-5 relative">
                            {/* Avatar overlapping banner */}
                            <div className="relative inline-block -mt-10 mb-3">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile"
                                        className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md" />
                                ) : (
                                    <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-white text-2xl font-bold"
                                        style={{ backgroundColor: '#1A1A1A' }}>
                                        {getInitials(userData?.name)}
                                    </div>
                                )}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploadingImage}
                                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md transition disabled:opacity-60"
                                    style={{ backgroundColor: '#FF8A00' }}
                                >
                                    {isUploadingImage
                                        ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        : <Camera className="w-3.5 h-3.5" />
                                    }
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                                    onChange={handleImageUpload} className="hidden" />
                            </div>

                            <h2 className="text-xl font-bold text-gray-900">{userData?.name || 'User'}</h2>
                            <p className="text-sm text-gray-400 mt-0.5">{userData?.email || user?.email}</p>
                            <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-1 rounded-lg text-white capitalize"
                                style={{ backgroundColor: '#FF8A00' }}>
                                {userData?.userType || 'Customer'}
                            </span>
                        </div>
                    </div>

                    {/* ── Personal info ── */}
                    <div className="bg-white rounded-2xl shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Personal Information</h3>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1.5 text-sm font-semibold"
                                    style={{ color: '#FF8A00' }}
                                >
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            <Row icon={User} label="Full Name">
                                {isEditing ? (
                                    <input type="text" value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none text-sm focus:ring-2"
                                        style={{ '--tw-ring-color': '#FF8A00' }}
                                        placeholder="Your full name" />
                                ) : (
                                    <p className="text-sm font-medium text-gray-900">{userData?.name || 'Not set'}</p>
                                )}
                            </Row>

                            <Row icon={Mail} label="Email Address" value={userData?.email || user?.email} />

                            <Row icon={MapPin} label="Preferred Area">
                                {isEditing ? (
                                    <input type="text" id="area-field" value={formData.area}
                                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                        placeholder="e.g. Koramangala, Bangalore"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none text-sm" />
                                ) : (
                                    <p className="text-sm font-medium text-gray-900">{userData?.area || 'Not set'}</p>
                                )}
                            </Row>

                            {isEditing && (
                                <div className="flex gap-2 pt-1">
                                    <button onClick={handleSave} disabled={isSaving}
                                        className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
                                        style={{ backgroundColor: '#FF8A00' }}>
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={() => { setIsEditing(false); setFormData({ name: userData?.name || '', area: userData?.area || '' }); }}
                                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
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

                            {/* Change location */}
                            <button onClick={() => { setIsEditing(true); setTimeout(() => document.getElementById('area-field')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-xl transition group text-left">
                                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Default Location</p>
                                    <p className="text-xs text-gray-400">{userData?.area || 'Not set'}</p>
                                </div>
                            </button>

                            {/* Notifications */}
                            <div className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 rounded-xl transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                                        <Bell className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">Notifications</p>
                                </div>
                                <button
                                    onClick={() => setNotificationsEnabled(p => !p)}
                                    className="relative w-11 h-6 rounded-full transition-colors"
                                    style={{ backgroundColor: notificationsEnabled ? '#FF8A00' : '#D1D5DB' }}
                                >
                                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notificationsEnabled ? 'translate-x-5' : ''}`} />
                                </button>
                            </div>

                            {/* Logout */}
                            <button onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-xl transition">
                                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                                    <LogOut className="w-4 h-4 text-gray-500" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">Log Out</p>
                            </button>

                            {/* Delete Account — providers only */}
                            {userData?.userType === 'provider' && (
                                <button onClick={() => { setShowDeleteModal(true); setDeleteConfirmText(''); setDeleteError(''); }}
                                    className="w-full flex items-center gap-3 px-3 py-3 hover:bg-red-50 rounded-xl transition">
                                    <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </div>
                                    <p className="text-sm font-medium text-red-500">Delete Account</p>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-2 pb-2">
                        <button onClick={() => alert('Privacy Policy coming soon.')}
                            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition">
                            <Shield className="w-3.5 h-3.5" /> Privacy Policy
                        </button>
                        <div className="flex items-center gap-1.5 text-xs text-gray-300">
                            <Info className="w-3.5 h-3.5" /> Servly v1.0.0
                        </div>
                    </div>
                </div>
            </main>

            {/* ── Delete Account Modal ── */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                        <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                            <Trash2 className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Account</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            This will permanently delete your provider profile, all your reviews, and your account. This cannot be undone.
                        </p>

                        <p className="text-xs font-semibold text-gray-700 mb-2">Type <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">DELETE</span> to confirm</p>
                        <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => { setDeleteConfirmText(e.target.value); setDeleteError(''); }}
                            placeholder="DELETE"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none text-sm mb-3 font-mono tracking-widest"
                        />

                        {deleteError && (
                            <p className="text-xs text-red-500 mb-3 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" />{deleteError}
                            </p>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeleting || deleteConfirmText !== 'DELETE'}
                                className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold transition disabled:opacity-40"
                                style={{ backgroundColor: '#E53E3E' }}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Forever'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
