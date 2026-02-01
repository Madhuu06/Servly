import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LocationProvider } from './context/LocationContext'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ProviderDashboard from './pages/ProviderDashboard.jsx'
import UserProfile from './pages/UserProfile.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 20, color: 'red', fontFamily: 'monospace' }}>
                    <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
                    <div className="bg-red-50 p-4 rounded border border-red-200">
                        <p className="font-bold">{this.state.error && this.state.error.toString()}</p>
                        <pre className="mt-2 text-sm overflow-auto max-h-96">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Protected Route Component
const ProtectedRoute = ({ children, allowedUserType }) => {
    const { isAuthenticated, userData, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#E8E4C9]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D2D2D]"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedUserType && userData?.userType !== allowedUserType) {
        return <Navigate to={userData?.userType === 'provider' ? '/provider-dashboard' : '/'} replace />;
    }

    return children;
};

// Public Route - redirects to app if already logged in
const PublicRoute = ({ children }) => {
    const { isAuthenticated, userData, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#E8E4C9]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D2D2D]"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to={userData?.userType === 'provider' ? '/provider-dashboard' : '/'} replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={
                <PublicRoute>
                    <Login />
                </PublicRoute>
            } />
            <Route path="/signup" element={
                <PublicRoute>
                    <Signup />
                </PublicRoute>
            } />
            <Route path="/provider-dashboard" element={
                <ProtectedRoute allowedUserType="provider">
                    <ProviderDashboard />
                </ProtectedRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute>
                    <UserProfile />
                </ProtectedRoute>
            } />
            <Route path="/" element={
                <ProtectedRoute allowedUserType="customer">
                    <App />
                </ProtectedRoute>
            } />
        </Routes>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <AuthProvider>
                    <LocationProvider>
                        <AppRoutes />
                    </LocationProvider>
                </AuthProvider>
            </BrowserRouter>
        </ErrorBoundary>
    </React.StrictMode>,
)
