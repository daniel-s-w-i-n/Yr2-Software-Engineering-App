import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const isAuthenticated = () => {
    const token = localStorage.getItem('token');

    // Check if token exists in local storage
    return !!token;
}

const ProtectedRoutes = () => {
    const location = useLocation();
    const user = isAuthenticated();

    // If user is authenticated and trying to access /login or /SignUpPage, redirect to /dashboard
    if (user && (location.pathname === '/login' || location.pathname === '/signUp')) {
        return <Navigate to="/dashboard" replace />;
    }


    // If user is not authenticated and is on the /login route, render the route using Outlet
    else if(!user && (location.pathname === '/login') || (location.pathname ==='/signUp'))   {
        return <Outlet />;
    }

    // If user is authenticated, render the protected route
    // If not authenticated, redirect to /login
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
