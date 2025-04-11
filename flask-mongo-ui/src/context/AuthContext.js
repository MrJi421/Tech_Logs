import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            try {
                const response = await fetch('http://localhost:5000/get-profile', {
                    headers: { 'user-id': userId }
                });
                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                } else {
                    handleLogout();
                }
            } catch (err) {
                handleLogout();
            }
        }
        setLoading(false);
    };

    const handleLogin = (userData) => {
        localStorage.setItem('userId', userData.user_id);
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        setUser(null);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    const value = {
        user,
        loading,
        handleLogin,
        handleLogout,
        logout,
        updateUser,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);