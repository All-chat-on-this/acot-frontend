import { createBrowserRouter, Navigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ChatPage from '@/pages/ChatPage';
import ConfigPage from '@/pages/ConfigPage';
import ProfilePage from '@/pages/ProfilePage';
import { ReactElement } from 'react';

// Protected route component
const ProtectedRoute = ({ children }: { children: ReactElement }) => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Redirect logged-in users away from auth pages
const RedirectIfAuthenticated = ({ children }: { children: ReactElement }) => {
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    
    return children;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/login",
        element: <RedirectIfAuthenticated><LoginPage /></RedirectIfAuthenticated>
    },
    {
        path: "/register",
        element: <RedirectIfAuthenticated><RegisterPage /></RedirectIfAuthenticated>
    },
    {
        path: "/chat/:id",
        element: <ProtectedRoute><ChatPage /></ProtectedRoute>
    },
    {
        path: "/config",
        element: <ProtectedRoute><ConfigPage /></ProtectedRoute>
    },
    {
        path: "/profile",
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
]);

export default router; 