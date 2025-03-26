import {useEffect} from 'react'
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
    const {createConversation} = useConversationStore()
    
    if (isAuthenticated) {
        // We'll redirect them to a new conversation
        // This is just a placeholder - the actual redirection happens in the component
        return <Navigate to="/" replace/>
    }
    
    return children
}

function App() {
    const {checkAuth} = useAuthStore()
    const {fetchPreferences} = usePreferencesStore()
    const {fetchConversations} = useConversationStore()

    // Check if user is authenticated on app load
    useEffect(() => {
        checkAuth()
        fetchPreferences()
        fetchConversations()
    }, [checkAuth, fetchPreferences, fetchConversations])

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
    ], {
        future: {
            v7_startTransition: true
        }
    });

    return (
        <ThemeProvider>
            <RouterProvider router={router}/>
        </ThemeProvider>
    )
}

export default App
