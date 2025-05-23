import {useCallback, useEffect, useState} from 'react'
import {RouterProvider} from 'react-router-dom'
import {ThemeProvider} from './theme/ThemeProvider'
import useAuthStore from './store/authStore'
import useConversationStore from './store/conversationStore'
import useUserStore from './store/userStore'
import router from './router/index'
import {DialogProvider} from './components/Dialog'

// Import i18n
import './i18n/i18n'

function App() {
    const [isInitialized, setIsInitialized] = useState(false);
    const checkAuth = useAuthStore(state => state.checkAuth);
    const fetchConversations = useConversationStore(state => state.fetchConversations);
    const getUserInformation = useUserStore(state => state.getUserInformation);

    // Memoize the initialization function to prevent infinite re-renders
    const initializeApp = useCallback(() => {
        if (!isInitialized) {
            checkAuth();
            fetchConversations();
            getUserInformation();
            setIsInitialized(true);
        }
    }, [checkAuth, fetchConversations, getUserInformation, isInitialized]);

    // Check if user is authenticated on app load
    useEffect(() => {
        initializeApp();
    }, [initializeApp]);

    return (
        <ThemeProvider>
            <DialogProvider>
                <RouterProvider router={router}/>
            </DialogProvider>
        </ThemeProvider>
    )
}

export default App
