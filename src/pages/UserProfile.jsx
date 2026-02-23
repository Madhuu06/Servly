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

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-white">

            {/* ── Header ── */}
            <header className="border-b border-gray-100 flex-shrink-0">
                <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center gap-3">
                    <button onClick={() => navigate('/')}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-base font-bold text-gray-900">My Profile</h1>
                    {saveStatus === 'success' && (
                        <div className="ml-auto flex items-center gap-1 text-green-600 text-xs font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Saved
                        </div>
                    )}
                    {saveStatus === 'error' && (
                        <div className="ml-auto flex items-center gap-1 text-red-500 text-xs font-medium">
                            <AlertCircle className="w-3.5 h-3.5" /> Failed
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto px-4 py-6 space-y-5 pb-10">

                    {/* ── Avatar card ── */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile"
                                    className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-200 flex items-center justify-center text-white text-xl font-bold">
                                    {getInitials(userData?.name)}
                                </div>
                            )}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingImage}
                                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center shadow disabled:opacity-60"
                            >
                                {isUploadingImage
                                    ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    : <Camera className="w-3 h-3" />
                                }
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageUpload} className="hidden" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">{userData?.name || 'User'}</h2>
                            <p className="text-sm text-gray-400">{userData?.email || user?.email}</p>
                            <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                                {userData?.userType || 'Customer'}
                            </span>
                        </div>
                    </div>

                    {/* ── Divider ── */}
                    <div className="border-t border-gray-100" />

                    {/* ── Personal info ── */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-gray-800">Personal Information</h3>
                            {!isEditing && (
                                <button onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700 transition">
                                    <Edit2 className="w-3 h-3" /> Edit
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            <Row icon={User} label="Full Name">
                                {isEditing ? (
                                    <input type="text" value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none text-sm focus:border-gray-400"
                                        placeholder="Your full name" />
                                ) : (
                                    <p className="text-sm text-gray-800">{userData?.name || 'Not set'}</p>
                                )}
                            </Row>

                            <Row icon={Mail} label="Email">
                                <p className="text-sm text-gray-800">{userData?.email || user?.email}</p>
                            </Row>

                            <Row icon={MapPin} label="Area">
                                {isEditing ? (
                                    <input type="text" id="area-field" value={formData.area}
                                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                        placeholder="e.g. Koramangala, Bangalore"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none text-sm focus:border-gray-400" />
                                ) : (
                                    <p className="text-sm text-gray-800">{userData?.area || 'Not set'}</p>
                                )}
                            </Row>

                            {isEditing && (
                                <div className="flex gap-2 pt-1">
                                    <button onClick={handleSave} disabled={isSaving}
                                        className="flex-1 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50">
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        onClick={() => { setIsEditing(false); setFormData({ name: userData?.name || '', area: userData?.area || '' }); }}
                                        className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-200 transition">
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Divider ── */}
                    <div className="border-t border-gray-100" />

                    {/* ── Settings ── */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3">Settings</h3>
                        <div className="space-y-1">

                            {/* Location */}
                            <button onClick={() => { setIsEditing(true); setTimeout(() => document.getElementById('area-field')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-xl transition text-left">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">Default Location</p>
                                    <p className="text-xs text-gray-400">{userData?.area || 'Not set'}</p>
                                </div>
                            </button>

                            {/* Notifications */}
                            <div className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 rounded-xl transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Bell className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-800">Notifications</p>
                                </div>
                                <button
                                    onClick={() => setNotificationsEnabled(p => !p)}
                                    className="relative w-10 h-5.5 rounded-full transition-colors"
                                    style={{ backgroundColor: notificationsEnabled ? '#111827' : '#D1D5DB', width: 40, height: 22 }}
                                >
                                    <div className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-transform ${notificationsEnabled ? 'translate-x-[18px]' : ''}`} />
                                </button>
                            </div>

                            {/* Logout */}
                            <button onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-xl transition">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <LogOut className="w-4 h-4 text-gray-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-800">Log Out</p>
                            </button>

                            {/* Delete Account — providers only */}
                            {userData?.userType === 'provider' && (
                                <button onClick={() => { setShowDeleteModal(true); setDeleteConfirmText(''); setDeleteError(''); }}
                                    className="w-full flex items-center gap-3 px-3 py-3 hover:bg-red-50 rounded-xl transition">
                                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </div>
                                    <p className="text-sm font-medium text-red-500">Delete Account</p>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2">
                        <button onClick={() => alert('Privacy Policy coming soon.')}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition">
                            <Shield className="w-3 h-3" /> Privacy
                        </button>
                        <span className="text-xs text-gray-300">Servly v1.0.0</span>
                    </div>
                </div>
            </main>

            {/* ── Delete Account Modal ── */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                            <Trash2 className="w-5 h-5 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Account</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            This will permanently delete your provider profile, all reviews, and your account.
                        </p>

                        <p className="text-xs font-semibold text-gray-700 mb-2">Type <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">DELETE</span> to confirm</p>
                        <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => { setDeleteConfirmText(e.target.value); setDeleteError(''); }}
                            placeholder="DELETE"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl outline-none text-sm mb-3 font-mono tracking-widest focus:border-gray-400"
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
                                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold transition disabled:opacity-40 hover:bg-red-600"
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

/* ── Helper row component ── */
function Row({ icon: Icon, label, children }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex-1">
                <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
                {children}
            </div>
        </div>
    );
}

export default UserProfile;
