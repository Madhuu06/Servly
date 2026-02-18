import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    deleteUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc, getDocs, writeBatch, collection } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                // Fetch additional user data from Firestore
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Sign up with email and password
    const signup = async (email, password, userData) => {
        try {
            // Create user with email and password
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = result.user;

            // Update display name
            await updateProfile(firebaseUser, { displayName: userData.name });

            const userDocData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: userData.name,
                userType: userData.userType,
                createdAt: new Date().toISOString(),
                ...(userData.userType === 'provider' && {
                    category: userData.category,
                    description: userData.description,
                    address: userData.address,
                    latitude: userData.latitude || null,
                    longitude: userData.longitude || null,
                    rating: 0,
                    reviewCount: 0,
                    isVerified: false
                })
            };

            // Save to users collection
            await setDoc(doc(db, 'users', firebaseUser.uid), userDocData);

            // If provider, also save to providers collection for map queries
            if (userData.userType === 'provider') {
                await setDoc(doc(db, 'providers', firebaseUser.uid), userDocData);
            }

            setUserData(userDocData);

            return { success: true, userType: userData.userType };
        } catch (error) {
            console.error('Signup error:', error);
            return { success: false, error: getErrorMessage(error.code) };
        }
    };

    // Login with email and password
    const login = async (email, password) => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = result.user;

            // Fetch user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
                const existingUserData = userDoc.data();
                setUserData(existingUserData);
                return { success: true, userType: existingUserData.userType || 'customer' };
            } else {
                return { success: false, error: 'User data not found' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: getErrorMessage(error.code) };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setUserData(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const deleteAccount = async () => {
        try {
            if (!user) {
                return { success: false, error: 'No user is currently logged in' };
            }

            const userId = user.uid;

            // Delete reviews subcollection if provider
            if (userData?.userType === 'provider') {
                try {
                    const reviewsRef = collection(db, 'providers', userId, 'reviews');
                    const reviewsSnapshot = await getDocs(reviewsRef);

                    if (!reviewsSnapshot.empty) {
                        const batch = writeBatch(db);
                        reviewsSnapshot.docs.forEach((doc) => {
                            batch.delete(doc.ref);
                        });
                        await batch.commit();
                    }
                } catch (error) {
                    console.error('Error deleting reviews:', error);
                    // Continue with deletion even if reviews fail
                }

                // Delete provider document
                try {
                    await deleteDoc(doc(db, 'providers', userId));
                } catch (error) {
                    console.error('Error deleting provider document:', error);
                    // Continue with deletion even if provider doc doesn't exist
                }
            }

            // Delete user document
            await deleteDoc(doc(db, 'users', userId));

            // Delete Firebase Auth account
            await deleteUser(user);

            // Clear local state
            setUser(null);
            setUserData(null);

            return { success: true };
        } catch (error) {
            console.error('Account deletion error:', error);

            if (error.code === 'auth/requires-recent-login') {
                return {
                    success: false,
                    error: 'For security reasons, please log out and log in again before deleting your account.'
                };
            }

            return { success: false, error: getErrorMessage(error.code) };
        }
    };

    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/email-already-in-use':
                return 'This email is already registered. Please login instead';
            case 'auth/invalid-email':
                return 'Invalid email address format';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters';
            case 'auth/user-not-found':
                return 'No account found with this email';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again';
            case 'auth/too-many-requests':
                return 'Too many attempts. Please try again later';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection';
            default:
                return 'An error occurred. Please try again';
        }
    };

    const value = {
        user,
        userData,
        loading,
        signup,
        login,
        logout,
        deleteAccount,
        isAuthenticated: !!user,
        isProvider: userData?.userType === 'provider',
        isCustomer: userData?.userType === 'customer'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
