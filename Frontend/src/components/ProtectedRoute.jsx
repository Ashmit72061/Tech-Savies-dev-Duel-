import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
    const { isAuthenticated, role, loading } = useAuth();
    const location = useLocation();

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Not authenticated - redirect to appropriate login
    if (!isAuthenticated) {
        const loginPath = requiredRole === 'admin' ? '/admin/login' : '/resident/login';
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    // Wrong role - redirect to their own dashboard or login
    if (requiredRole && role !== requiredRole) {
        // If logged in as different role, redirect to their dashboard
        const redirectPath = role === 'admin' ? '/admin' : '/resident';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
}
