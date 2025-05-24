import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userId, setUserId] = useState(localStorage.getItem('userid'));
    const [profileUpdated, setProfileUpdated] = useState(false);

    // Optionally sync localStorage changes if needed elsewhere, but context is preferred
    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem('token'));
            // We will stop storing userId in localStorage, but this handler is for completeness
            setUserId(localStorage.getItem('userid'));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const login = (newToken, newUserId) => {
        localStorage.setItem('token', newToken);
        // We will now store userId in context, not localStorage
        // localStorage.setItem('userid', newUserId);
        setToken(newToken);
        setUserId(newUserId);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userid'); // Ensure this is cleared too if it was ever set
        setToken(null);
        setUserId(null);
    };

    // Function to trigger profile refresh
    const triggerProfileRefresh = () => {
        setProfileUpdated(prev => !prev);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, userId, isAuthenticated, login, logout, profileUpdated, triggerProfileRefresh }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 