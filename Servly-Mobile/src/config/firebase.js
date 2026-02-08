import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAwObDwyI6SIgTNdjUZibh70_dDlNYFJyo",
    authDomain: "service-d19d2.firebaseapp.com",
    projectId: "service-d19d2",
    storageBucket: "service-d19d2.firebasestorage.app",
    messagingSenderId: "1007835269942",
    appId: "1:1007835269942:web:ccfbc6c06ccd31d7040197",
    measurementId: "G-5ESGXDME2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
