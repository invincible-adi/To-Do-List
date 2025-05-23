import React from 'react';
import { Navigate } from 'react-router-dom';

const withAuth = (Component) => {
    return function AuthenticatedComponent(props) {
        const token = localStorage.getItem('token');
        if (!token) {
            return <Navigate to="/login" replace />;
        }
        return <Component {...props} />;
    };
};

// HOC to redirect authenticated users away from guest-only pages
export const withGuest = (Component) => {
    return function GuestOnlyComponent(props) {
        const token = localStorage.getItem('token');
        if (token) {
            return <Navigate to="/dashboard" replace />;
        }
        return <Component {...props} />;
    };
};

export default withAuth;
