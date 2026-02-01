import { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithPhoneNumber,
    signOut,
    onAuthStateChanged,
    updateProfile,
    deleteUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc, getDocs, writeBatch, collection } from 'firebase/firestore';
import { auth, db, setupRecaptcha } from '../config/firebase';

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

    // Send OTP to phone number
    const sendOTP = async (phoneNumber) => {
        try {
            // Setup reCAPTCHA
            const recaptchaVerifier = setupRecaptcha('recaptcha-container');

            // Send OTP
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);

            return { success: true, confirmationResult };
        } catch (error) {
            console.error('Error sending OTP:', error);
            return { success: false, error: getErrorMessage(error.code) };
        }
    };

    // Verify OTP and complete signup/login
    const verifyOTP = async (confirmationResult, otp, userData = null) => {
        try {
            // Verify OTP
            const result = await confirmationResult.confirm(otp);
            const firebaseUser = result.user;

            let userType = 'customer';

            // If userData is provided, this is a signup - save user data
            if (userData) {
                await updateProfile(firebaseUser, { displayName: userData.name });

                const userDocData = {
                    uid: firebaseUser.uid,
                    phone: firebaseUser.phoneNumber,
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
                userType = userData.userType;
            } else {
                // This is a login - fetch existing user data
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                if (userDoc.exists()) {
                    const existingUserData = userDoc.data();
                    setUserData(existingUserData);
                    userType = existingUserData.userType || 'customer';
                }
            }

            return { success: true, userType };
        } catch (error) {
            console.error('OTP verification error:', error);
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
            case 'auth/invalid-phone-number':
                return 'Invalid phone number format';
            case 'auth/missing-phone-number':
                return 'Please enter a phone number';
            case 'auth/quota-exceeded':
                return 'SMS quota exceeded. Please try again later';
            case 'auth/invalid-verification-code':
                return 'Invalid OTP. Please check and try again';
            case 'auth/code-expired':
                return 'OTP has expired. Please request a new one';
            case 'auth/too-many-requests':
                return 'Too many attempts. Please try again later';
            default:
                return 'An error occurred. Please try again';
        }
    };

    const value = {
        user,
        userData,
        loading,
        sendOTP,
        verifyOTP,
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
