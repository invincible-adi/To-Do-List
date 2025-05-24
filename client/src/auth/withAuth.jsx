import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Correct import path

const withAuth = (Component) => {
    // const nav = useNavigate()
    return function AuthenticatedComponent(props) {
        const { isAuthenticated } = useAuth(); // Get isAuthenticated from context
        if (!isAuthenticated) {
            return <Navigate to="/" replace />;
        }
        return <Component {...props} />;
    };
};

// HOC to redirect authenticated users away from guest-only pages
export const withGuest = (Component) => {
    return function GuestOnlyComponent(props) {
        const { isAuthenticated } = useAuth(); // Get isAuthenticated from context
        if (isAuthenticated) {
            return <Navigate to="/dashboard" replace />;
        }
        return <Component {...props} />;
    };
};

export default withAuth;
