import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Layout
import Layout from './components/layout/Layout';

// Components
import { MobileBlocker } from './components/MobileBlocker';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Builder from './pages/Builder';
import Shop from './pages/Shop';
import Profile from './pages/Profile';
import Terms from './pages/Terms';
import ForgotPassword from './pages/ForgotPassword';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-dark-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            {/* Mobile Device Blocker */}
            <MobileBlocker />

            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1e293b',
                        color: '#f1f5f9',
                        border: '1px solid #334155',
                    },
                    success: {
                        iconTheme: {
                            primary: '#22c55e',
                            secondary: '#f1f5f9',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#f1f5f9',
                        },
                    },
                }}
            />

            <Routes>
                {/* Public Routes */}
                {/* Public Routes */}
                <Route path="/login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
                <Route path="/register" element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                } />
                <Route path="/forgot-password" element={
                    <PublicRoute>
                        <ForgotPassword />
                    </PublicRoute>
                } />

                {/* Protected Routes */}
                <Route element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                {/* Builder Route (Full Screen) */}
                <Route path="/builder/:projectId" element={
                    <ProtectedRoute>
                        <Builder />
                    </ProtectedRoute>
                } />

                {/* Terms Page (Public) */}
                <Route path="/terms" element={<Terms />} />

                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
