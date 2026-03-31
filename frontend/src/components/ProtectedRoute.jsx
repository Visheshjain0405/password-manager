import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');

    if (!token || !loginTime) {
        return <Navigate to="/" replace />;
    }

    // Check for 1 hour session (3600000 ms)
    const currentTime = new Date().getTime();
    if (currentTime - parseInt(loginTime) > 3600000) {
        localStorage.removeItem('token');
        localStorage.removeItem('loginTime');
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
