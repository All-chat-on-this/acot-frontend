import {useEffect, useCallback, useState} from 'react'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'
import {ThemeProvider} from './theme/ThemeProvider'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
import ConfigPage from './pages/ConfigPage'
import useAuthStore from './store/authStore'
import usePreferencesStore from './store/preferencesStore'
import useConversationStore from './store/conversationStore'

// Import i18n
import './i18n/i18n'

// Protected route component
const ProtectedRoute = ({children}: { children: JSX.Element }) => {
    const {isAuthenticated} = useAuthStore()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>
    }

    return children
}

// Redirect logged-in users away from login page
const RedirectIfAuthenticated = ({children}: { children: JSX.Element }) => {
    const {isAuthenticated} = useAuthStore()

    if (isAuthenticated) {
        // We'll redirect them to a new conversation
        // This is just a placeholder - the actual redirection happens in the component
        return <Navigate to="/" replace/>
    }
    
    return children
}

function App() {
    const [isInitialized, setIsInitialized] = useState(false);
    const checkAuth = useAuthStore(state => state.checkAuth);
    const fetchPreferences = usePreferencesStore(state => state.fetchPreferences);
    const fetchConversations = useConversationStore(state => state.fetchConversations);
    
    // Memoize the initialization function to prevent infinite re-renders
    const initializeApp = useCallback(() => {
        if (!isInitialized) {
            checkAuth();
            fetchPreferences();
            fetchConversations();
            setIsInitialized(true);
        }
    }, [checkAuth, fetchPreferences, fetchConversations, isInitialized]);

    // Check if user is authenticated on app load
    useEffect(() => {
        initializeApp();
    }, [initializeApp]);

    // Create router with future flags
    const router = createBrowserRouter([
        {
            path: "/",
            element: <HomePage/>
        },
        {
            path: "/login",
            element: <RedirectIfAuthenticated><LoginPage/></RedirectIfAuthenticated>
        },
        {
            path: "/chat/:id",
            element: <ProtectedRoute><ChatPage/></ProtectedRoute>
        },
        {
            path: "/config",
            element: <ProtectedRoute><ConfigPage/></ProtectedRoute>
        },
        {
            path: "*",
            element: <Navigate to="/" replace/>
        }
    ]);

    return (
        <ThemeProvider>
            <RouterProvider router={router}/>
        </ThemeProvider>
    )
}

export default App
