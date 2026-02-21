import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useReviews } from '../hooks/useReviews';
import {
    User, LogOut, Star, Phone, MapPin, Bell, BellOff,
    Edit2, Save, X, Trash2, CheckCircle, Award, Shield
} from 'lucide-react';
import DeleteAccountModal from '../components/DeleteAccountModal';

export default function ProviderDashboard() {
    const { userData, user, logout, deleteAccount } = useAuth();
    const navigate = useNavigate();
    const { averageRating, reviewCount } = useReviews(user?.uid);

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [profileData, setProfileData] = useState({
        name: userData?.name || '',
        phone: userData?.phone || '',
        category: userData?.category || '',
        description: userData?.description || '',
    });

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                name: profileData.name,
                phone: profileData.phone,
                category: profileData.category,
                description: profileData.description,
            });
            await setDoc(doc(db, 'providers', user.uid), {
                uid: user.uid,
                name: profileData.name,
                phone: profileData.phone,
                category: profileData.category,
                description: profileData.description,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            setIsEditing(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2500);
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        const result = await deleteAccount();
        if (result.success) {
            navigate('/login', { replace: true });
        } else {
            alert(result.error || 'Failed to delete account.');
            setShowDeleteModal(false);
            setIsDeleting(false);
        }
    };

    const rating = averageRating || 0;
    const initial = (profileData.name || userData?.name || 'P')[0].toUpperCase();

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>

            {/* ── Header ── */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-5 py-3.5 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #FF8A00, #FF6B00)' }}>
                            <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="font-extrabold text-gray-900 text-xl tracking-tight">Servly</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setNotificationsEnabled(p => !p)}
                            title={notificationsEnabled ? 'Mute notifications' : 'Enable notifications'}
                            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition text-gray-500"
                        >
                            {notificationsEnabled
                                ? <Bell className="w-5 h-5" />
                                : <BellOff className="w-5 h-5" />
                            }
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition text-sm font-semibold"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">

                {/* ── Profile card ── */}
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                    {/* Banner */}
                    <div className="h-20" style={{ background: 'linear-gradient(135deg, #1A1A1A, #2D2D2D)' }} />

                    {/* Avatar + edit */}
                    <div className="px-5 pb-5">
                        <div className="-mt-10 flex items-end justify-between mb-4">
                            <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg text-white text-3xl font-extrabold flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg, #FF8A00, #FF6B00)' }}>
                                {initial}
                            </div>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition"
                                    style={{ background: 'linear-gradient(135deg, #FF8A00, #FF6B00)' }}
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setIsEditing(false); setProfileData({ name: userData?.name || '', phone: userData?.phone || '', category: userData?.category || '', description: userData?.description || '' }); }}
                                        className="px-4 py-2 rounded-xl text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-60 transition"
                                        style={{ background: 'linear-gradient(135deg, #FF8A00, #FF6B00)' }}
                                    >
                                        <Save className="w-3.5 h-3.5" />
                                        {saving ? 'Saving…' : 'Save'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Success Banner */}
                        {saveSuccess && (
                            <div className="flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 mb-4">
                                <CheckCircle className="w-4 h-4" />
                                Profile saved successfully!
                            </div>
                        )}

                        {/* Fields */}
                        <div className="space-y-3">
                            <Field label="Name" icon={User}>
                                {isEditing
                                    ? <input value={profileData.name} onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))}
                                        className="w-full outline-none text-sm font-semibold text-gray-900 bg-transparent" />
                                    : <p className="text-sm font-semibold text-gray-900">{profileData.name || 'Not set'}</p>
                                }
                            </Field>
                            <Field label="Phone" icon={Phone}>
                                {isEditing
                                    ? <input value={profileData.phone} onChange={e => setProfileData(p => ({ ...p, phone: e.target.value }))}
                                        className="w-full outline-none text-sm font-semibold text-gray-900 bg-transparent" placeholder="+91 XXXXX XXXXX" type="tel" />
                                    : <p className="text-sm font-semibold text-gray-900">{profileData.phone || <span className="text-gray-400 font-normal">Not set</span>}</p>
                                }
                            </Field>
                            <Field label="Category" icon={Shield}>
                                {isEditing
                                    ? <input value={profileData.category} onChange={e => setProfileData(p => ({ ...p, category: e.target.value }))}
                                        className="w-full outline-none text-sm font-semibold text-gray-900 bg-transparent" />
                                    : <p className="text-sm font-semibold text-gray-900">{profileData.category || 'Not set'}</p>
                                }
                            </Field>
                            <Field label="Description" icon={Edit2} stretch>
                                {isEditing
                                    ? <textarea value={profileData.description} onChange={e => setProfileData(p => ({ ...p, description: e.target.value }))}
                                        rows={3}
                                        className="w-full outline-none text-sm text-gray-700 bg-transparent resize-none" />
                                    : <p className="text-sm text-gray-700 leading-relaxed">{profileData.description || 'Tap Edit Profile to add a description.'}</p>
                                }
                            </Field>
                        </div>
                    </div>
                </div>

                {/* ── Rating card ── */}
                <div className="bg-white rounded-3xl shadow-sm p-5">
                    <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Your Rating</p>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #FF8A00, #FF6B00)' }}>
                            <Award className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold text-gray-900">{rating.toFixed(1)}</p>
                            <p className="text-sm text-gray-400">{reviewCount} review{reviewCount !== 1 ? 's' : ''} from customers</p>
                        </div>
                        {/* Star bar */}
                        <div className="flex gap-0.5 ml-auto">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} className={`w-5 h-5 ${i <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Settings card ── */}
                <div className="bg-white rounded-3xl shadow-sm p-5">
                    <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Settings</p>
                    <div className="space-y-1">

                        {/* Notifications toggle */}
                        <div className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 rounded-xl transition">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                                    <Bell className="w-4 h-4 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Notifications</p>
                                    <p className="text-xs text-gray-400">{notificationsEnabled ? 'You will receive alerts' : 'Alerts are muted'}</p>
                                </div>
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
                            <p className="text-sm font-semibold text-gray-900">Log Out</p>
                        </button>

                        {/* Delete Account */}
                        <button onClick={() => setShowDeleteModal(true)}
                            className="w-full flex items-center gap-3 px-3 py-3 hover:bg-red-50 rounded-xl transition">
                            <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                                <Trash2 className="w-4 h-4 text-red-500" />
                            </div>
                            <p className="text-sm font-semibold text-red-500">Delete Account</p>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 pb-4">Servly v1.0.0 · Provider Dashboard</p>
            </main>

            <DeleteAccountModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                isLoading={isDeleting}
            />
        </div>
    );
}

/* ── Tiny helper component ── */
function Field({ label, icon: Icon, children, stretch }) {
    return (
        <div className={`flex items-${stretch ? 'start' : 'center'} gap-3 px-4 py-3 bg-gray-50 rounded-2xl`}>
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                {children}
            </div>
        </div>
    );
}
