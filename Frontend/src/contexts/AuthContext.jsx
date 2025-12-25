import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null); // 'resident' | 'admin'
    const [loading, setLoading] = useState(true);

    // Check for existing auth on mount
    useEffect(() => {
        const token = localStorage.getItem('authtoken');
        const storedRole = localStorage.getItem('role');
        const userId = localStorage.getItem('userId');

        if (token && storedRole && userId) {
            setUser({ id: userId });
            setRole(storedRole);
        }
        setLoading(false);
    }, []);

    const login = async (email, password, userRole) => {
        try {
            const endpoint = userRole === 'admin'
                ? `${API_URL}/api/auth/admin/login`
                : `${API_URL}/api/auth/login`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store in localStorage
            localStorage.setItem('authtoken', data.authtoken);
            localStorage.setItem('role', userRole);
            localStorage.setItem('userId', data.id);

            // Update state
            setUser({ id: data.id });
            setRole(userRole);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (userData, userRole) => {
        try {
            const endpoint = userRole === 'admin'
                ? `${API_URL}/api/auth/admin/register`
                : `${API_URL}/api/auth/createuser`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Store in localStorage
            localStorage.setItem('authtoken', data.authtoken);
            localStorage.setItem('role', userRole);
            localStorage.setItem('userId', data.id);

            // Update state
            setUser({ id: data.id });
            setRole(userRole);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('authtoken');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        setUser(null);
        setRole(null);
    };

    const value = {
        user,
        role,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
