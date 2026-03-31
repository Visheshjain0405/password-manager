import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const loginTime = localStorage.getItem('loginTime');

            if (token && loginTime) {
                // Check if session has expired (1 hour)
                const currentTime = new Date().getTime();
                if (currentTime - parseInt(loginTime) > 3600000) {
                    logout();
                } else {
                    try {
                        const res = await api.get('/auth/me');
                        setUser(res.data.data);
                    } catch (err) {
                        logout();
                    }
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('loginTime', new Date().getTime().toString());
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loginTime');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
