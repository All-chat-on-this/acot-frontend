import {useCallback, useEffect, useState} from 'react'
import {RouterProvider} from 'react-router-dom'
import {ThemeProvider} from './theme/ThemeProvider'
import useAuthStore from './store/authStore'
import usePreferenceStore from './store/preferenceStore.ts'
import useConversationStore from './store/conversationStore'
import router from './router/index'

// Import i18n
import './i18n/i18n'

function App() {
    const [isInitialized, setIsInitialized] = useState(false);
    const checkAuth = useAuthStore(state => state.checkAuth);
    const fetchPreference = usePreferenceStore(state => state.fetchPreference);
    const fetchConversations = useConversationStore(state => state.fetchConversations);
    
    // Memoize the initialization function to prevent infinite re-renders
    const initializeApp = useCallback(() => {
        if (!isInitialized) {
            checkAuth();
            fetchPreference();
            fetchConversations();
            setIsInitialized(true);
        }
    }, [checkAuth, fetchPreference, fetchConversations, isInitialized]);

    // Check if user is authenticated on app load
    useEffect(() => {
        initializeApp();
    }, [initializeApp]);

    return (
        <ThemeProvider>
            <RouterProvider router={router}/>
        </ThemeProvider>
    )
}

export default App
