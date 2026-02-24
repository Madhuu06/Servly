import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { categories } from '../data/services';
import { useReviews } from '../hooks/useReviews';
import {
    User, LogOut, Star, Phone, MapPin, Bell,
    Edit2, Save, X, Trash2, CheckCircle, Award, ChevronLeft
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
            // Force a full page reload to /login after a tiny delay
            // so Firebase auth state fully clears first
            setTimeout(() => {
                window.location.replace('/login');
            }, 100);
        } else {
            alert(result.error || 'Failed to delete account.');
            setShowDeleteModal(false);
            setIsDeleting(false);
        }
    };

    const rating = averageRating || 0;
    const initial = (profileData.name || userData?.name || 'P')[0].toUpperCase();

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-white">

            {/* ── Header ── */}
            <header className="border-b border-gray-100 flex-shrink-0">
                <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center gap-3">
                    <button onClick={() => navigate('/')}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-base font-bold text-gray-900">Provider Dashboard</h1>
                    {saveSuccess && (
                        <div className="ml-auto flex items-center gap-1 text-green-600 text-xs font-medium">
                            <CheckCircle className="w-3.5 h-3.5" /> Saved
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto px-4 py-6 space-y-5 pb-10">

                    {/* ── Avatar + Name ── */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-900 text-white text-2xl font-bold flex items-center justify-center flex-shrink-0">
                            {initial}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-gray-900">{profileData.name || 'Provider'}</h2>
                            <p className="text-sm text-gray-400">{profileData.category || 'Service Provider'}</p>
                        </div>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gray-900 text-white hover:bg-gray-800 transition">
                                <Edit2 className="w-3 h-3" /> Edit
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => { setIsEditing(false); setProfileData({ name: userData?.name || '', phone: userData?.phone || '', category: userData?.category || '', description: userData?.description || '' }); }}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition">
                                    <X className="w-4 h-4" />
                                </button>
                                <button onClick={handleSave} disabled={saving}
                                    className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-60">
                                    <Save className="w-3 h-3" />
                                    {saving ? 'Saving…' : 'Save'}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* ── Profile fields ── */}
                    <div className="space-y-3">
                        <Field label="Name" icon={User}>
                            {isEditing
                                ? <input value={profileData.name} onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none text-sm focus:border-gray-400" />
                                : <p className="text-sm text-gray-800">{profileData.name || 'Not set'}</p>
                            }
                        </Field>
                        <Field label="Phone" icon={Phone}>
                            {isEditing
                                ? <input value={profileData.phone} onChange={e => setProfileData(p => ({ ...p, phone: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none text-sm focus:border-gray-400" placeholder="+91 XXXXX XXXXX" type="tel" />
                                : <p className="text-sm text-gray-800">{profileData.phone || <span className="text-gray-400">Not set</span>}</p>
                            }
                        </Field>
                        <Field label="Category" icon={MapPin}>
                            {isEditing
                                ? <select value={profileData.category} onChange={e => setProfileData(p => ({ ...p, category: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none text-sm focus:border-gray-400 bg-white">
                                    <option value="">Select a service</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.label}</option>
                                    ))}
                                </select>
                                : <p className="text-sm text-gray-800">{profileData.category || 'Not set'}</p>
                            }
                        </Field>
                        <Field label="Description" icon={Edit2}>
                            {isEditing
                                ? <textarea value={profileData.description} onChange={e => setProfileData(p => ({ ...p, description: e.target.value }))}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none text-sm resize-none focus:border-gray-400" />
                                : <p className="text-sm text-gray-600 leading-relaxed">{profileData.description || 'Add a description about your services.'}</p>
                            }
                        </Field>
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* ── Rating ── */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3">Your Rating</h3>
                        <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{rating.toFixed(1)}</p>
                                <p className="text-xs text-gray-400">{reviewCount} review{reviewCount !== 1 ? 's' : ''}</p>
                            </div>
                            <div className="flex gap-0.5 ml-auto">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Star key={i} className={`w-4 h-4 ${i <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* ── Settings ── */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-3">Settings</h3>
                        <div className="space-y-1">

                            {/* Notifications */}
                            <div className="flex items-center justify-between px-3 py-3 hover:bg-gray-50 rounded-xl transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Bell className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Notifications</p>
                                        <p className="text-[11px] text-gray-400">{notificationsEnabled ? 'Alerts on' : 'Muted'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setNotificationsEnabled(p => !p)}
                                    className="relative rounded-full transition-colors"
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

                            {/* Delete Account */}
                            <button onClick={() => setShowDeleteModal(true)}
                                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-red-50 rounded-xl transition">
                                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                                    <Trash2 className="w-4 h-4 text-red-400" />
                                </div>
                                <p className="text-sm font-medium text-red-500">Delete Account</p>
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-300 pt-2">Servly v1.0.0</p>
                </div>
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

/* ── Field helper ── */
function Field({ label, icon: Icon, children }) {
    return (
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
                {children}
            </div>
        </div>
    );
}
